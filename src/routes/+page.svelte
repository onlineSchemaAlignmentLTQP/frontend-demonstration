<script lang="ts">
  import Editor from "../components/Editor.svelte";
  import ResultPanel from "../components/ResultPanel.svelte";
  import Options from "../components/Options.svelte";
  import RulePanel from "../components/RulePanel.svelte";
  import Alert from "../components/Alert.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<div class="page">
  <Alert />
  <div class="editor">
    <div class="editor-col left">
      <Editor />
    </div>
    <div class="editor-col right">
      <RulePanel />
    </div>
  </div>

  <div class="lower-interface">
    <div class="result"><ResultPanel /></div>
    <div class="options"><Options /></div>
  </div>

  <Footer />
</div>

<style>
  /* Page fills the viewport and uses column layout */
  .page {
    height: 100vh;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    margin: 0;
  }

  /* Top area: Editor and RulePanel side-by-side, occupying maximum space with no gap */
  .editor {
    height: 50%;
    display: flex;
    flex-direction: row;
    gap: 0;
    margin: 0;
    padding: 0;
  }

  /* Each column takes exactly half the width and fills the editor height. No padding so no visible gap. */
  .editor-col {
    flex: 1 1 0;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    min-width: 0; /* allow children to shrink properly */
    min-height: 0; /* important for proper scrolling in flex children */
    overflow: hidden;
  }

  /* Ensure the child component root in each column fills the available space and can scroll internally */
  .editor-col > * {
    flex: 1 1 0;
    min-height: 0;
    min-width: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    overflow: auto;
  }

  /* Lower area takes the remaining 50% */
  .lower-interface {
    height: 50%;
    display: flex;
    flex-direction: row;
    width: auto;
    margin: 0;
    padding: 0;
  }

  .result {
    flex: 4;
    overflow: auto;
  }

  .options {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #d1d1d1;
    overflow: auto;
  }

  /* Small utility: ensure internal editors can scroll if needed */
  .editor-col :global(.editor),
  .editor-col :global(.cm-editor) {
    width: 100%;
    height: 100%;
    min-height: 0;
  }
</style>
