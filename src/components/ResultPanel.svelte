<script lang="ts">
    import { QUERY_STATE } from "../state.svelte";
    import BindingsEntry from "./BindingsEntry.svelte";


    let executionTime = $derived(
      QUERY_STATE.executionTime?
      `in ${(QUERY_STATE.executionTime/1000).toFixed(1)}s`:
      ""
    );

    let numberHttpRequests = $derived(
      QUERY_STATE.numberOfHttpRequest?
      `with ${QUERY_STATE.numberOfHttpRequest} HTTP request(s)`:
      ""
    );

    function schemaAlignmentEvent(){
      if(QUERY_STATE.alignmentKg!== undefined){
           const blob = new Blob([QUERY_STATE.alignmentKg], { type: "text/turtle" });

           const url = URL.createObjectURL(blob);

           const a = document.createElement('a');
            a.href = url;
            a.download = "onlineAlignments.ttl";

            // Trigger the download
            document.body.appendChild(a);
            a.click();

            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
      }

    }
</script>

<div class="result-panel">
    {#if QUERY_STATE.error === undefined}
        <div class="bindings-entries">
            {#each QUERY_STATE.results as result, i (i)}
                <div class="bindings-entry">
                    <BindingsEntry bindings={result} />
                </div>
            {/each}
        </div>
        <div class="meta-result">
            {QUERY_STATE.results.length} result(s) {executionTime} {numberHttpRequests} {#if QUERY_STATE.alignmentKg !== undefined}
                <button  onclick={schemaAlignmentEvent} style="color: #0000EE;text-decoration: underline;">see online alignment KG</button>
            {/if}
        </div>
    {:else}
        {QUERY_STATE.error}
    {/if}
</div>

<style>
    :global(.cm-editor){
        height: 100%;
    }
    .meta-result{
        margin-top: 1%;
        margin-left: 2%;
        height: 100%;
    }

    .result-panel{
        border: 1px solid #d1d1d1;
        height: 100%;
    }
    .bindings-entries{
        height: 90%;
        overflow: auto;
    }
    .bindings-entry {
        margin-bottom: 1%;
        border-radius: 10px;
    }

    .bindings-entry:hover {
        background-color: #be1622;
    }
</style>
