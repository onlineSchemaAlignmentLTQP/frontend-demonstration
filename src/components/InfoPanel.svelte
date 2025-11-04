<script lang="ts">
  import { ButtonGroup, Modal, Button} from "flowbite-svelte";
  import configFile from "../../config.json?raw";

  const config = JSON.parse(configFile);

  const normalNetworkHostName:string = `${config["normalNetworkHostName"]}/pods/`;
  const multipleVocabHostName:string = `${config["multipleVocabHostName"]}/pods/`;

  let dataModelModal = $state(false);
</script>

<ButtonGroup class="*:ring-primary-700!">
  <Button onclick={()=>{window.open(multipleVocabHostName, "_blank", "noopener,noreferrer")}} >Multiple Vocab Network</Button>
  <Button onclick={()=>{dataModelModal=true}} >Data Model</Button>
  <Button onclick={()=>{window.open(normalNetworkHostName, "_blank", "noopener,noreferrer")}}>Single Vocab Network</Button>
</ButtonGroup>

<Modal title="Data Model" form bind:open={dataModelModal} onaction={({ action }) => alert(`Handle "${action}"`)}>
   <img src="/data-model.png" alt="solidbench data model">
</Modal>
