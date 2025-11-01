import { QueryEngine } from "query-sparql-link-traversal-solid-schema-alignment";
import { QueryEngine as LocalQueryEngine } from "@comunica/query-sparql-rdfjs";
import type * as RDF from "@rdfjs/types";
import {
  type WorkerMessage,
  type WorkerResponse,
  type WorkerBindingResponse
} from "$lib";
import type { BindingsStream } from "@comunica/types";
import {
  type SafePromise,
  error,
  result,
  isError,
} from "result-interface";
import { Parser as N3Parser, Store } from "n3";
import { DataFactory } from 'rdf-data-factory';

const DF = new DataFactory<RDF.BaseQuad>();
const ENGINE = new QueryEngine();
const LOCAL_ENGINE = new LocalQueryEngine();
const RDF_PARSER = new N3Parser();

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const data = event.data;
  let response: WorkerResponse = { type:"error", result: "unknown message type"};

  switch (data.type) {
    case "query": {
        const { query, rules:serializedRules, schemaAlignment } = data.payload;
        const rulesResponse = await convertRules(serializedRules);
        if(isError(rulesResponse)){
          response = { type:"error", result: `the rules are malformed: ${rulesResponse.error}`};
          break;
        }
        const { value: [rules, disallowedRules] } = rulesResponse;
        const bindingStreamResult = await executeQuery(query, rules, disallowedRules, schemaAlignment);
        const executionTimeResult = await reportResults(bindingStreamResult, self.postMessage);
        if(isError(executionTimeResult)){
          response = { type:"error", result: `there was an error in the query: ${executionTimeResult.error}`};
          break;
        }
        response = {type:"end", result:{execution_time:executionTimeResult.value}}
        break;
      }
    default:
      response = { type:"error", result: "unknown message type"};
      console.warn("Unknown message type", data);
  }
  self.postMessage(response);
};

 async function convertRules(
  rulesKg: string,
): SafePromise<[Map<string, RDF.Quad[]>, string[]], string> {
  const resp: Map<string, RDF.Quad[]> = new Map();
   let errorOrUndefined: string|undefined = undefined ;
   const disallowedRules: string[] = [];
   const store = new Store();

   RDF_PARSER.parse(rulesKg, (error:Error|undefined, quad)=>{
     if(quad){
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
  return result([resp, Array.from(new Set(disallowedRules))]);
}

async function executeQuery(
  query: string,
  rules: Map<string, RDF.Quad[]>,
  disallowedRules: string[],
  schemaAlignment:boolean
): Promise<BindingsStream> {
  const bindingsStream = await ENGINE.queryBindings(query, {
    lenient: true,
    "@comunica/actor-context-preprocess-query-source-reasoning:rules": rules,
    "@comunica/actor-context-preprocess-query-source-reasoning:disallowedOnlineRules":disallowedRules,
    "@comunica/actor-context-preprocess-query-source-reasoning:activate": schemaAlignment,
  });
  return bindingsStream;
}

function reportResults(bindingsStream:BindingsStream, postFunction: (message:WorkerBindingResponse)=>void):SafePromise<number, string>{
  const startTime = performance.now();
  return new Promise((resolve)=>{
    bindingsStream.on("data", (binding: RDF.Bindings) => {
      postFunction({type:"binding", result: binding.toString()});
    });

    bindingsStream.on("error", (err: Error) => {
      resolve(error(err.message));
    });
    bindingsStream.on("end", ()=>{
      const endTime = performance.now();
      resolve(result(endTime - startTime));
    })
  })

}
