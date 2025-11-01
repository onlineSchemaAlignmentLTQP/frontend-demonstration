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
    import { EVENT_TARGET, QUERY_STATE, RULES, PROPOSED_QUERY_EVENT, CHANGE_SCHEMA_ALIGNMENT_STATE } from "../state.svelte";

    type WorkerQueryResponse =
        | WorkerBindingResponse
        | WorkerEndResponse
        | WorkerErrorResponse;
    let yasguiDiv: HTMLElement | undefined;
    let yasqe: YasqeType | undefined;
    let worker: Worker;
    const originalBorderColor = "#d1d1d1";
    const queryRunningBorderColor = "green";
    const queryStopBorderColor = "red";
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
              QUERY_STATE.queryIsRunning = false;
              setYasqeBorderColor(originalBorderColor);

          } else if (data.type === "error") {
              console.warn(`there was an error when performing the query ${data.result}`);
              QUERY_STATE.error = data.result;
              QUERY_STATE.queryIsRunning = false;
              setYasqeBorderColor(originalBorderColor);
          } else {
              console.warn(`There was an unknown response ${data}`);
          }
      };
    }

    function setYasqeBorderColor(color:string):void{
      const yasqeElement:HTMLElement|null = document.querySelector('.yasqe .CodeMirror');
      if(yasqeElement){
        yasqeElement.style.borderColor = color;
      }
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

        EVENT_TARGET.addEventListener(CHANGE_SCHEMA_ALIGNMENT_STATE, ((e: CustomEvent<boolean>) => {
          schemaAlignment = e.detail;
        }) as EventListener);

        yasqe.on("query", async (instance: YasqeType) => {
            if(QUERY_STATE.queryIsRunning === true){
              console.log("stoping the query");
              QUERY_STATE.queryIsRunning = false;
              newWorker();
              setYasqeBorderColor(queryStopBorderColor);
              return;
            }
            console.log(`starting the query ${schemaAlignment?"with schema alignment":""} `);
            resetQueryState(QUERY_STATE);
            setYasqeBorderColor(queryRunningBorderColor);
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
