<script lang="ts">
  import { ButtonGroup, Modal, Button} from "flowbite-svelte";
  import configFile from "../../config.json?raw";

  const config = JSON.parse(configFile);

  const normalNetworkHostName:string = `${config["normalNetworkHostName"]}/pods/`;
  const multipleVocabHostName:string = `${config["multipleVocabHostName"]}/pods/`;

  let dataModelModal = $state(false);
</script>

<ButtonGroup >
  <Button style="
  background: var(--color-comunica-red);
  border: solid black 1px;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  " onclick={()=>{window.open(multipleVocabHostName, "_blank", "noopener,noreferrer")}} >Multiple Vocab Network</Button>
  <Button style="
  background: var(--color-comunica-red);
  border: solid black 1px;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  " onclick={()=>{dataModelModal=true}} >Data Model</Button>
  <Button style="
  background: var(--color-comunica-red);
  border: solid black 1px;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  " onclick={()=>{window.open(normalNetworkHostName, "_blank", "noopener,noreferrer")}}>Single Vocab Network</Button>
</ButtonGroup>

<Modal title="Data Model" form bind:open={dataModelModal} onaction={({ action }) => alert(`Handle "${action}"`)}>
   <img src="/data-model.png" alt="solidbench data model">
</Modal>
