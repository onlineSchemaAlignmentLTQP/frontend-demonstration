<script lang="ts">
    import { onMount } from 'svelte';
    import { Modal } from "flowbite-svelte";
    import { QUERY_STATE } from "../state.svelte";
    import BindingsEntry from "./BindingsEntry.svelte";
    import {basicSetup} from "codemirror";
    import {EditorView} from "@codemirror/view";
    import {EditorState, Compartment} from "@codemirror/state";
    import { turtle } from 'codemirror-lang-turtle';

    let editor: HTMLElement | undefined;
    let view: EditorView|undefined;
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

    let schemaAlignmentModal = $state(false);

    onMount(()=>{
      view = new EditorView({
       doc:  "aaa",
       parent: editor!,
       extensions: [
         basicSetup,
         turtle(),
         EditorView.editable.of(false),
       ],
     });
    });

    function schemaAlignmentEvent(){
      schemaAlignmentModal=true;
      view!.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: QUERY_STATE.alignmentKg
          }
        });
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
                <Modal title="Alignment" form bind:open={schemaAlignmentModal} onaction={({ action }) => alert(`Handle "${action}"`)}>
                    <div bind:this={editor}  class="editor"></div>
                </Modal>
            {/if}
        </div>
    {:else}
        {QUERY_STATE.error}
    {/if}
</div>

<style>
    .editor{
        width: 100vh;
        height: 100vh;
        border: 1px solid #d1d1d1;
    }
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
