<script lang="ts">
  import { Modal, Button, Tooltip } from "flowbite-svelte";
  import configFile from "../../config.json?raw";
  import { DEMO_MODE } from "../state.svelte";

  const config = JSON.parse(configFile);

  const normalNetworkHostName: string = `${config["normalNetworkHostName"]}/pods/`;
  const multipleVocabHostName: string = `${config["multipleVocabHostName"]}/pods/`;

  let dataModelModal = $state(false);
</script>

<div style="display: flex; flex-direction: column; gap:1rem;">
  <Tooltip triggeredBy="#multiple-vocab-btn"
    >Open a file explorer in a new tab with presenting the newtwork using multiple vocabularies</Tooltip
  >
  <Tooltip triggeredBy="#single-vocab-btn"
    >Open a file explorer in a new tab with presenting the newtwork using a single vocabulary</Tooltip
  >
  <Tooltip triggeredBy="#data-model-btn">Open a modal showing SolidBench data model</Tooltip>

  <Tooltip triggeredBy="#demo-btn">Activate the Demo Mode</Tooltip>

  <Button
    id="multiple-vocab-btn"
    style="
  background: var(--color-comunica-red);
  border: solid black 1px;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  "
    onclick={() => {
      window.open(multipleVocabHostName, "_blank", "noopener,noreferrer");
    }}>Multiple Vocab Network</Button
  >

  <Button
    id="data-model-btn"
    style="
  background: var(--color-comunica-red);
  border: solid black 1px;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  "
    onclick={() => {
      dataModelModal = true;
    }}>Data Model</Button
  >

  <Button
    id="single-vocab-btn"
    style="
  background: var(--color-comunica-red);
  border: solid black 1px;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  "
    onclick={() => {
      window.open(normalNetworkHostName, "_blank", "noopener,noreferrer");
    }}>Single Vocab Network</Button
  >

  <Button
      id="demo-btn"
    style="
  background: var(--color-comunica-red);
  border: solid black 1px;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  "
    onclick={() => {
      DEMO_MODE.activated = true;
      DEMO_MODE.step = 0;
    }}>Demo</Button
  >
</div>

<Modal
  title="Data Model"
  form
  bind:open={dataModelModal}
  onaction={({ action }) => alert(`Handle "${action}"`)}
>
  <img src="/data-model.png" alt="solidbench data model" />
</Modal>
