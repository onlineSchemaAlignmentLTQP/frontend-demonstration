<script lang="ts">
    import Editor from "../components/Editor.svelte";
    import ResultPanel from "../components/ResultPanel.svelte";
    import Options from "../components/Options.svelte";
</script>

<div class="page">
    <Editor />
    <div class="lower-interface">
      <div class="result"><ResultPanel /></div>
      <div class="options"><Options /></div>
    </div>


</div>

<style>
    .lower-interface{
        display: flex;
        flex-direction: row;
        width: auto;
    }
    .page{
        height: auto;
        display: flex;
        flex-direction: column;
    }
    .result {
        flex: 4;
      }

      .options {
        flex: 1;
      }
</style>
