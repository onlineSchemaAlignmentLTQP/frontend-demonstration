<script lang="ts">
    import ProposedQueryButton from "./ProposedQueryButton.svelte";
    import SchemaAlignmentSwitch from "./SchemaAlignmentSwitch.svelte"
</script>

<div class="options">
    <ProposedQueryButton />
    <SchemaAlignmentSwitch />
</div>

<style>
    .options {
        margin-top: 10%;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80%;

    }
</style>
