<script lang="ts">
    import Editor from "../components/Editor.svelte";
    import ResultPanel from "../components/ResultPanel.svelte";
    import Options from "../components/Options.svelte";
    import RulePanel from "../components/RulePanel.svelte";
</script>

<div class="page">
    <div class="editor">
        <Editor />
        <RulePanel />
    </div>
    <div class="lower-interface">
      <div class="result"><ResultPanel /></div>
      <div class="options"><Options /></div>
    </div>
</div>

<style>
    .editor{
        height: 50%;
        display: flex;
    }

    .lower-interface{
        height: 50%;
        display: flex;
        flex-direction: row;
        width: auto;
    }
    .page{
        height: 100vh;
        display: flex;
        flex-direction: column;
    }
    .result {
        flex: 4;
      }

      .options {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid #d1d1d1;
      }
</style>
