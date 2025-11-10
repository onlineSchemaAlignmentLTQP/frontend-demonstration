<script lang="ts">
  import { QUERY_STATE } from "../state.svelte";
  import { Spinner } from "flowbite-svelte";
  import BindingsEntry from "./BindingsEntry.svelte";

  let executionTime = $derived(
    QUERY_STATE.executionTime ? `in ${(QUERY_STATE.executionTime / 1000).toFixed(1)}s` : ""
  );

  let numberHttpRequests = $derived(
    QUERY_STATE.numberOfHttpRequest ? `with ${QUERY_STATE.numberOfHttpRequest} HTTP request(s)` : ""
  );

  function schemaAlignmentEvent() {
    if (QUERY_STATE.alignmentKg !== undefined) {
      const blob = new Blob([QUERY_STATE.alignmentKg], { type: "text/turtle" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
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
    <!-- spinner moved into the results area so selections/scrolling remain interactive -->

    <div class="bindings-entries">
      {#if QUERY_STATE.queryIsRunning}
        <div class="spinner-overlay" aria-hidden="true">
          <div class="spinner-backdrop" role="status" aria-live="polite">
            <Spinner color="red" size="8" />
          </div>
        </div>
      {/if}
      {#each QUERY_STATE.results as result, i (i)}
        <div class="bindings-entry">
          <BindingsEntry bindings={result} />
        </div>
      {/each}
    </div>

    <div class="meta-result">
      {QUERY_STATE.results.length} result(s) {executionTime}
      {numberHttpRequests}
      {#if QUERY_STATE.alignmentKg !== undefined}
        <button
          id="schema-alignment"
          onclick={schemaAlignmentEvent}
          style="color: #0000EE;text-decoration: underline;padding:0px; margin:0px;"
          >see online alignment KG</button
        >
      {/if}
    </div>
  {:else}
    {QUERY_STATE.error}
  {/if}
</div>

<style>
  #schema-alignment:hover {
    cursor: pointer;
  }

  .meta-result {
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 1em;
    margin-top: 1%;
    margin-left: 2%;
    height: 100%;
  }

  /* Make the panel a positioned container so overlay can be centered */
  .result-panel {
    position: relative;
    border: 1px solid #d1d1d1;
    height: 100%;
    overflow: hidden;
  }

  .bindings-entries {
    height: calc(100% - 3.5rem);
    overflow: auto;
    padding: 0.5rem;
    position: relative; /* position overlay relative to the scrollable results area */
  }

  .bindings-entry {
    margin-bottom: 1%;
    border-radius: 10px;
  }

  .bindings-entry:hover {
    background-color: #be1622;
  }

  .spinner-overlay {
    position: absolute;
    inset: 0; /* cover the scrollable results area */
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent; /* visual backdrop is provided by the inner backdrop only */
    z-index: 60;
    pointer-events: none; /* allow pointer events (selection / scroll) to pass through to results */
  }

  .spinner-backdrop {
    background: rgba(255, 255, 255, 0.95);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none; /* spinner itself shouldn't intercept pointer events */
    user-select: none; /* don't accidentally select spinner markup while selecting text */
  }
</style>
