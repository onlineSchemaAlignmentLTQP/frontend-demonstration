import { QueryEngine } from "query-sparql-link-traversal-solid-schema-alignment";
import type * as RDF from "@rdfjs/types";
import {
  type WorkerMessage,
  type WorkerResponse,
  type SerializedRules,
  type WorkerBindingResponse
} from "$lib";
import type { BindingsStream } from "@comunica/types";
import {
  type SafePromise,
  type Result,
  error,
  result,
  isError,
} from "result-interface";
import { Parser as N3Parser } from "n3";

const ENGINE = new QueryEngine();
const RDF_PARSER = new N3Parser();

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const data = event.data;
  let response: WorkerResponse = { type:"error", result: "unknown message type"};

  switch (data.type) {
    case "query": {
        const { query, rules:serializedRules } = data.payload;
        const rulesResponse = convertRules(serializedRules);
        if(isError(rulesResponse)){
          response = { type:"error", result: `the rules are malformed: ${rulesResponse.error}`};
          return;
        }
        const { value: rules } = rulesResponse;
        const bindingStreamResult = await executeQuery(query, rules);
        const executionTimeResult = await reportResults(bindingStreamResult, self.postMessage);
        if(isError(executionTimeResult)){
          response = { type:"error", result: `there was an error in the query: ${executionTimeResult.error}`};
          return;
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

 function convertRules(
  rules: SerializedRules,
): Result<Map<string, RDF.Quad[]>, string> {
  const resp: Map<string, RDF.Quad[]> = new Map();
   let errorOrUndefined: Error|undefined = undefined ;
  for (const [key, kg] of rules) {
    const quads: RDF.Quad[] = [];

    RDF_PARSER.parse(kg, (error, quad)=>{
      if(quad){
        quads.push(quad)
      }else{
        errorOrUndefined = error;
      }
    });
    if(errorOrUndefined !== undefined){
      return error(errorOrUndefined);
    }
    resp.set(key, quads);
  }
  return result(resp);
}

async function executeQuery(
  query: string,
  rules: Map<string, RDF.Quad[]>,
): Promise<BindingsStream> {
  const bindingsStream = await ENGINE.queryBindings(query, {
    lenient: true,
    "@comunica/actor-context-preprocess-query-source-reasoning:rules": rules,
    "@comunica/actor-context-preprocess-query-source-reasoning:activate": true,
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
