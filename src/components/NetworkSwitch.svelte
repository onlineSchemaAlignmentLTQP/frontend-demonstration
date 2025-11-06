<script lang="ts">
  import { ButtonGroup, Button } from "flowbite-svelte";
  import configFile from "../../config.json?raw";
  import {  EVENT_TARGET, CHANGE_NETWORK_EVENT, type IChangeNetwork } from "../state.svelte";

  const config = JSON.parse(configFile);
  const normalNetworkHostName:string = config["normalNetworkHostName"];
  const multipleVocabHostName:string = config["multipleVocabHostName"];

  function changeNetworkEvent(newNetwork:string, previousNetwork:string){
    const event = new CustomEvent<IChangeNetwork>(CHANGE_NETWORK_EVENT, {"detail": {
      previousNetwork,
      newNetwork
    }});
    EVENT_TARGET.dispatchEvent(event);
  }


</script>

<ButtonGroup class="*:ring-primary-700!">
  <Button onclick={()=>{changeNetworkEvent(multipleVocabHostName, normalNetworkHostName)}} >Convert to Multiple Vocab Network</Button>
  <Button onclick={()=>{changeNetworkEvent(normalNetworkHostName, multipleVocabHostName)}}>Convert to Single Vocab Network</Button>
</ButtonGroup>
