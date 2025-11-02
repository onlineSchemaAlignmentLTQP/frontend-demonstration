<script lang="ts">
    import ProposedQueryButton from "./ProposedQueryButton.svelte";
    import SchemaAlignmentSwitch from "./SchemaAlignmentSwitch.svelte";
    import NetworkSwitch from "./NetworkSwitch.svelte";
    import ProposedRulesQueryButton from "./ProposedRulesQueryButton.svelte";
</script>

<div class="options">
    <ProposedQueryButton />
    <ProposedRulesQueryButton />
    <SchemaAlignmentSwitch />
    <NetworkSwitch />
</div>

<style>
    .options {
      margin-top: 10%;
      display: flex;
      flex-direction: column;
      align-items: center;
      align-content: space-around;
      row-gap: 10%;
      width: 80%;
      height: 100%;
    }
</style>
