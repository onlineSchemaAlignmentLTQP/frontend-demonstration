<script lang="ts">
    import { onMount } from "svelte";
    import { type Yasqe as YasqeType } from "@triply/yasqe";
    import {
        type WorkerQueryMessage,
        type WorkerEndResponse,
        type WorkerBindingResponse,
        type WorkerErrorResponse,
        resetQueryState
    } from "$lib";
    import { CHANGE_NETWORK_EVENT, EVENT_TARGET, QUERY_STATE, RULES, PROPOSED_QUERY_EVENT, CHANGE_SCHEMA_ALIGNMENT_STATE_EVENT, type IChangeNetwork, ALERT, AlertType } from "../state.svelte";


    type WorkerQueryResponse =
        | WorkerBindingResponse
        | WorkerEndResponse
        | WorkerErrorResponse;
    let yasguiDiv: HTMLElement | undefined;
    let yasqe: YasqeType | undefined;
    let worker: Worker;

    let schemaAlignment = true;

    function newWorker():void{
      if(worker){
        worker.terminate();
      }
      worker = new Worker(new URL("$lib/query_worker.ts", import.meta.url), {
          type: "module",
      });

      worker.onerror = (event) => {
        console.warn('Worker crashed!');
        console.warn('Error message:', event.message);
        console.warn('Filename:', event.filename);
        console.warn('Line number:', event.lineno);

        event.preventDefault();

        worker.terminate();
        newWorker();
      };

      worker.onmessage = (event: MessageEvent<WorkerQueryResponse>) => {
          const data = event.data;
          if (data.type === "binding") {
              console.log(data.result);
              QUERY_STATE.results.push(JSON.parse(data.result));
          } else if (data.type === "end") {
            console.log(`query ended after ${data.result.execution_time}`);
              QUERY_STATE.executionTime = data.result.execution_time;
              QUERY_STATE.numberOfHttpRequest = data.result.number_http_request;
              QUERY_STATE.alignmentKg = data.result.alignment_kg;
              QUERY_STATE.queryIsRunning = false;

          } else if (data.type === "error") {
              console.warn(`there was an error when performing the query ${data.result}`);
              QUERY_STATE.error = data.result;
              QUERY_STATE.queryIsRunning = false;
              ALERT.type = AlertType.Error;
              ALERT.message = `The query engine produce an error ${data.result}`;
          } else {
              console.warn(`There was an unknown response ${data}`);
          }
      };
    }

    onMount(async () => {
        newWorker();

        const Yasqe = (await import("@triply/yasqe")).default;
        yasqe = new Yasqe(yasguiDiv!, {
            showQueryButton: true,
            createShareableLink:false,
            resizeable:false,
        });
        yasqe.setSize("100%", "100%");

        EVENT_TARGET.addEventListener(PROPOSED_QUERY_EVENT, ((e: CustomEvent) => {
          if(yasqe){
            yasqe.setValue(e.detail);
          }else{
            console.warn("yasque is not yet instantiated");
          }
        }) as EventListener);

        EVENT_TARGET.addEventListener(CHANGE_SCHEMA_ALIGNMENT_STATE_EVENT, ((e: CustomEvent<boolean>) => {
          schemaAlignment = e.detail;
        }) as EventListener);

        EVENT_TARGET.addEventListener(CHANGE_NETWORK_EVENT, ((e: CustomEvent<IChangeNetwork>)=>{
          const {previousNetwork, newNetwork} = e.detail;
          if(!yasqe){
            console.warn("yasque is not yet instantiated");
            return
          }
          const query:string = yasqe.getValue();

          if(!query.includes(previousNetwork)){
            ALERT.type = AlertType.Error;
            ALERT.message = `The network ${previousNetwork} is not in the query`;
            console.warn(ALERT.message);
          }else{
            const newQuery = query.replaceAll(previousNetwork, newNetwork);
            yasqe.setValue(newQuery);
            ALERT.type = AlertType.Info;
            ALERT.message = "The network has changes.";
            console.log(ALERT.message);
          }

        }) as EventListener);

        yasqe.on("query", async (instance: YasqeType) => {
            if(QUERY_STATE.queryIsRunning === true){
              ALERT.type = AlertType.Info;
              ALERT.message = "The query was stopped by the user";
              console.log("stoping the query");
              QUERY_STATE.queryIsRunning = false;
              newWorker();
              return;
            }
            console.log(`starting the query ${schemaAlignment?"with schema alignment":""} `);
            resetQueryState(QUERY_STATE);
            QUERY_STATE.queryIsRunning = true;
            const query = instance.getValue();

            const message: WorkerQueryMessage = {
                type: "query",
                payload: { query, rules: RULES.kg, schemaAlignment },
            };
            worker.postMessage(message);
        });
    });
</script>

<div bind:this={yasguiDiv} class="editor" ></div>


<style>
    .editor{
         height: 100%;
         width: 60%;
    }
    :global(.yasqe){
        height: 100%;
    }

     :global(.yasgui .autocompleteWrapper) {
        display: none !important;
        height: 100%;
    }
</style>
