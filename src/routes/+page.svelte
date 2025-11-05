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
        <Editor />
        <RulePanel />
    </div>
    <div class="lower-interface">
      <div class="result"><ResultPanel /></div>
      <div class="options"><Options /></div>
    </div>
    <Footer/>
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
        overflow: hidden;
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
