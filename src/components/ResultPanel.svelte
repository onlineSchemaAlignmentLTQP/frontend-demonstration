<script lang="ts">
    import { QUERY_STATE } from "../state.svelte";
    import BindingsEntry from "./BindingsEntry.svelte";

    let executionTime = $derived(
      QUERY_STATE.executionTime?
      `in ${(QUERY_STATE.executionTime/1000).toFixed(1)}s`:
      ""
    )
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
            {QUERY_STATE.results.length} result(s) {executionTime}
        </div>
    {:else}
        {QUERY_STATE.error}
    {/if}
</div>

<style>
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
