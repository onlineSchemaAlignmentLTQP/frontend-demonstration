import { QueryEngine } from "query-sparql-link-traversal-solid-schema-alignment";
import { QueryEngine as LocalQueryEngine } from "@comunica/query-sparql-rdfjs";
import type * as RDF from "@rdfjs/types";
import {
  type WorkerQueryMessage,
  type WorkerResponse,
  type WorkerEndResponse,
  type WorkerBindingResponse,
  type IReportedResults,
  type WorkerErrorResponse
} from "$lib";
import type { BindingsStream } from "@comunica/types";
import {
  type SafePromise,
  type Result,
  error,
  result,
  isError,
} from "result-interface";
import { Parser as N3Parser, Store, Writer as N3Writer } from "n3";
import { DataFactory } from 'rdf-data-factory';

const SEM_MAP_PREFIX = "https://semanticmapping.org/vocab#";

const DF = new DataFactory<RDF.BaseQuad>();
const ENGINE = new QueryEngine();
const LOCAL_ENGINE = new LocalQueryEngine();
const RDF_PARSER = new N3Parser();

interface IRuleSet {
  subweb: string;
  rules: IRule[];
}

interface IRule {
  premise: RDF.Term;
  inference: RDF.Term;
  conclusion: RDF.Term;
}

interface ITrackedInfo{
  links: string[],
  schemaAlignment: IRuleSet[]
}

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent<WorkerQueryMessage>) => {
  const data = event.data;
  let response: WorkerResponse<unknown> = { type:"error", result: "unknown message type"};

  switch (data.type) {
    case "query": {
        const { query, rules:serializedRules, schemaAlignment } = data.payload;
        const rulesResponse = await convertRules(serializedRules);
        if(isError(rulesResponse)){
          response = <WorkerErrorResponse> { type:"error", result: `the rules are malformed: ${rulesResponse.error}`};
          break;
        }
      const { value: { rules, disallowedRules, rulesKg} } = rulesResponse;
        const tracker: ITrackedInfo = { links: [], schemaAlignment: [] };
        const bindingStreamResult = await executeQuery(query, rules, disallowedRules, schemaAlignment, tracker);
        const resultReport = await reportResults(bindingStreamResult, self.postMessage, rulesKg, tracker);
        if(isError(resultReport)){
          response = <WorkerErrorResponse> { type:"error", result: `there was an error in the query: ${resultReport.error}`};
          break;
        }
        response = <WorkerEndResponse> {type:"end", result:resultReport.value}
        break;
      }
    default:
      response = <WorkerErrorResponse> { type:"error", result: "unknown message type"};
      console.warn("Unknown message type", data);
  }
  self.postMessage(response);
};

 async function convertRules(
  rulesKg: string,
 ): SafePromise<{rules:Map<string, RDF.Quad[]>, disallowedRules:string[], rulesKg: RDF.Quad[]}, string> {
  const resp: Map<string, RDF.Quad[]> = new Map();
   let errorOrUndefined: string|undefined = undefined ;
   const disallowedRules: string[] = [];
   const store = new Store();
   const ruleKgParsed: RDF.Quad[] = [];

   RDF_PARSER.parse(rulesKg, (error:Error|undefined, quad)=>{
     if(quad){
       ruleKgParsed.push(quad);
       store.addQuad(quad);
     }else if(error){
       errorOrUndefined = error.message;
     }
   });

   if(errorOrUndefined !== undefined){
     return error(errorOrUndefined);
   }

   const bindingsStream = await LOCAL_ENGINE.queryBindings(`
     PREFIX semmap: <https://semanticmapping.org/vocab#>
     PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
     PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

     SELECT ?subweb ?premise ?inference ?conclusion ?disallowedRule
     WHERE {
       ?ruleDef a semmap:RuleSet ;
                semmap:subweb ?subweb ;
                semmap:rule ?rule .

       ?rule semmap:premise ?premise ;
             semmap:inference ?inference ;
             semmap:conclusion ?conclusion .

       OPTIONAL {
         ?ruleDef semmap:disallowedRules ?list .
         ?list rdf:rest*/rdf:first ?disallowedRule .
       }
     }
`, {
     sources: [store],
   });

   await new Promise((resolve)=>{
     bindingsStream.on("end", () => {
       resolve(undefined);
     });

     bindingsStream.on("error", (err:Error) => {
       errorOrUndefined = err.message;
       resolve(undefined);
     });

     bindingsStream.on("data", (binding: RDF.Bindings) => {
       const [subweb, premise, inference, conclusion, disallowedRule] = [
         binding.get("subweb")!.value,
         binding.get("premise")!,
         binding.get("inference")!,
         binding.get("conclusion")!,
         binding.get("disallowedRule"),
       ];

       if(disallowedRule!==undefined){
         disallowedRules.push(disallowedRule.value);
       }

       const currentSubweb = resp.get(subweb);
       const quad = DF.quad(premise, inference, conclusion);

       if(currentSubweb !== undefined){
         currentSubweb.push(<RDF.Quad>quad);
       }else{
         resp.set(subweb, [<RDF.Quad> quad]);
       }
     });

   })

   if(errorOrUndefined !== undefined){
     return error(errorOrUndefined);
   }

  return result({rules:resp, disallowedRules, rulesKg:ruleKgParsed});
}

async function executeQuery(
  query: string,
  rules: Map<string, RDF.Quad[]>,
  disallowedRules: string[],
  schemaAlignment:boolean,
  tracker: ITrackedInfo
): Promise<BindingsStream> {
  const bindingsStream = await ENGINE.queryBindings(query, {
    lenient: true,
    "@comunica/actor-context-preprocess-query-source-reasoning:rules": rules,
    "@comunica/actor-context-preprocess-query-source-reasoning:disallowedOnlineRules":disallowedRules,
    "@comunica/actor-context-preprocess-query-source-reasoning:activate": schemaAlignment,
    '@comunica/actor-context-preprocess-query-source-reasoning:runtimeInfo': tracker,
  });
  return bindingsStream;
}

function reportResults(bindingsStream:BindingsStream, postFunction: (message:WorkerBindingResponse|WorkerErrorResponse)=>void, rulesKg: RDF.Quad[],tracker: ITrackedInfo):SafePromise<IReportedResults, string>{
  const startTime = performance.now();
  return new Promise((resolve) => {
    bindingsStream.on("data", (binding: RDF.Bindings) => {
      postFunction({ type: "binding", result: binding.toString() });
    });

    bindingsStream.on("error", (err: Error) => {
      resolve(error(err.message));
    });
    bindingsStream.on("end", () => {
      const endTime = performance.now();
      const resultAlignmentKg = ruleSetsToKg(tracker.schemaAlignment);
      let alignment_kg = "";
      if(isError(resultAlignmentKg)){
        postFunction({ type: "error", result: resultAlignmentKg.error });
      }else{
        alignment_kg = resultAlignmentKg.value;
      }
      const resp: IReportedResults = {
        execution_time: endTime - startTime,
        number_http_request: tracker.links.length,
        alignment_kg,
      };
      resolve(result(resp));
    })
  });

}
function ruleSetsToKg(ruleSets: IRuleSet[]): Result<string, string>{
  const writer = new N3Writer({prefixes:{
    semmap: SEM_MAP_PREFIX,
    owl: "http://www.w3.org/2002/07/owl#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    skos: "http://www.w3.org/2004/02/skos/core#"
  }});

  let serializedKg: string = "";
  let serializedError: string | undefined = undefined;

  for(const ruleSet of ruleSets){
    ruleSetToKg(ruleSet, writer);
  }

  writer.end((err, result) => {
    if(result){
      serializedKg = result;
    }else{
      serializedError = err.message;
    }
  });

  if(serializedError!==undefined){
    return error(serializedError);
  }
  return result(serializedKg);
}

function ruleSetToKg(ruleSet: IRuleSet, writer: N3Writer): void{
  const ruleSetNode = DF.blankNode();
  const declaration = <RDF.Quad>DF.quad(ruleSetNode, DF.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), DF.namedNode(`${SEM_MAP_PREFIX}RuleSet`));
  const subwebQuad = <RDF.Quad> DF.quad(ruleSetNode,  DF.namedNode(`${SEM_MAP_PREFIX}subweb`), DF.literal(ruleSet.subweb));

  const kg:RDF.Quad[] = [
    declaration,
    subwebQuad
  ];

  for(const rule of ruleSet.rules){
    const node = DF.blankNode();
    const ruleDeclation = <RDF.Quad> DF.quad(ruleSetNode, DF.namedNode(`${SEM_MAP_PREFIX}rule`), node);
    kg.push(ruleDeclation);
    const ruleKg = <RDF.Quad[]> ruleToKg(rule, node);
    kg.push(...ruleKg);
  }

  writer.addQuads(kg);

}

function ruleToKg(rule: IRule, node: RDF.BlankNode): RDF.BaseQuad[]{
  const kg = [
    DF.quad(node, DF.namedNode(`${SEM_MAP_PREFIX}premise`), rule.premise),
    DF.quad(node, DF.namedNode(`${SEM_MAP_PREFIX}inference`), rule.inference),
    DF.quad(node, DF.namedNode(`${SEM_MAP_PREFIX}conclusion`), rule.conclusion),
  ]
  return kg;
}
