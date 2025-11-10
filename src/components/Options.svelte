<script lang="ts">
  import { Tabs, TabItem, Tooltip } from "flowbite-svelte";
  import ProposedQueryButton from "./ProposedQueryButton.svelte";
  import SchemaAlignmentSwitch from "./SchemaAlignmentSwitch.svelte";
  import NetworkSwitch from "./NetworkSwitch.svelte";
  import ProposedRulesQueryButton from "./ProposedRulesQueryButton.svelte";
  import InfoPanel from "./InfoPanel.svelte";
</script>

<div class="option-panel">
  <Tabs>
    <Tooltip triggeredBy="#proposed-queries">Proposed queries for demonstration</Tooltip>
    <TabItem id="proposed-queries" open title="Proposed Queries">
      <div class="proposed-buttons">
        <div class="btn-wrapper">
          <ProposedQueryButton />
        </div>
        <div class="btn-wrapper">
          <ProposedRulesQueryButton />
        </div>
      </div>
    </TabItem>

    <Tooltip triggeredBy="#options">Options to configure the schema alignment</Tooltip>
    <TabItem id="options" open title="Options">
      <div class="options">
        <SchemaAlignmentSwitch />
        <NetworkSwitch />
      </div>
    </TabItem>

    <Tooltip placement="left" triggeredBy="#extra"
      >Explore the network and activate the tutorial mode</Tooltip
    >
    <TabItem id="extra" open title="Extra">
      <div class="extra">
        <InfoPanel />
      </div>
    </TabItem>
  </Tabs>
</div>

<style>
  :global(.option-panel ul li button:hover) {
    background-color: var(--color-comunica-red);
    color: white;
  }

  :global(.option-panel ul li .text-primary-600) {
    background-color: var(--color-comunica-red);
    color: white;
    font-weight: bolder;
  }

  .extra {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    box-sizing: border-box;
    margin: 0.5rem auto;
    width: 100%;
  }

  .options {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    box-sizing: border-box;
    margin: 0.5rem auto;
    width: 100%;
    gap: 2rem;
  }

  .proposed-buttons {
    display: flex;
    flex-direction: column;
    gap: 4rem;
    align-items: center;
    padding: 1rem;
    box-sizing: border-box;
    margin: 0.5rem auto;
    width: 100%;
  }

  .btn-wrapper {
    width: 100%;
  }

  .btn-wrapper :global(button) {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 0.75rem;
  }
</style>
