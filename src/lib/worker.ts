import { QueryEngine } from "query-sparql-link-traversal-solid-schema-alignment";
import type * as RDF from "@rdfjs/types";
import {
  type WorkerMessage,
  type WorkerResponse,
  type SerializedRules,
} from "$lib";
import type { BindingsStream } from "@comunica/types";
import { rdfParser } from "rdf-parse";
import {
  type SafePromise,
  type Result,
  error,
  result,
  isError,
} from "result-interface";
import Streamify from "streamify-string";

const ENGINE = new QueryEngine();

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const data = event.data;
  let response: WorkerResponse = { type:"error", result: "unknown message type"};

  switch (data.type) {
    case "query": {
        const { query, rules:serializedRules } = data.payload;
        const rulesResponse = await convertRules(serializedRules);
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

async function convertRules(
  rules: SerializedRules,
): SafePromise<Map<string, RDF.Quad[]>, string> {
  const resp: Map<string, RDF.Quad[]> = new Map();
  const operations: Promise<Result<[string, RDF.Quad[]], string>>[] = [];

  for (const [key, kg] of rules) {
    const operation: Promise<Result<[string, RDF.Quad[]], string>> = new Promise(
      (resolve) => {
        const quads: RDF.Quad[] = [];
        rdfParser
          .parse(Streamify(kg), { contentType: "text/turtle" })
          .on("data", (quad: RDF.Quad) => {
            quads.push(quad);
          })
          .on("error", (err: Error) => {
            resolve(error(err.message));
          })
          .on("end", () => {
            resolve(result([key, quads]));
          });
        operations.push(operation);
      },
    );
  }
  const operationResults = await Promise.all(operations);
  for (const operationResult of operationResults) {
    if (isError(operationResult)) {
      return operationResult;
    }
    resp.set(operationResult.value[0], operationResult.value[1]);
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

function reportResults(bindingsStream:BindingsStream, postFunction: (message:string)=>void):SafePromise<number, string>{
  const startTime = performance.now();
  return new Promise((resolve)=>{
    bindingsStream.on("data", (binding: RDF.Bindings) => {
      postFunction(binding.toString());
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
