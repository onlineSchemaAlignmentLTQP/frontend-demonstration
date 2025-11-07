<script lang="ts">
  import { ButtonGroup, Button } from "flowbite-svelte";
  import configFile from "../../config.json?raw";
  import { EVENT_TARGET, CHANGE_NETWORK_EVENT, type IChangeNetwork } from "../state.svelte";

  const config = JSON.parse(configFile);
  const normalNetworkHostName: string = config["normalNetworkHostName"];
  const multipleVocabHostName: string = config["multipleVocabHostName"];

  function changeNetworkEvent(newNetwork: string, previousNetwork: string) {
    const event = new CustomEvent<IChangeNetwork>(CHANGE_NETWORK_EVENT, {
      detail: {
        previousNetwork,
        newNetwork,
      },
    });
    EVENT_TARGET.dispatchEvent(event);
  }
</script>

<ButtonGroup class="*:ring-primary-700!">
  <Button
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
      changeNetworkEvent(multipleVocabHostName, normalNetworkHostName);
    }}>Convert to Multiple Vocab Network</Button
  >
  <Button
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
      changeNetworkEvent(normalNetworkHostName, multipleVocabHostName);
    }}>Convert to Single Vocab Network</Button
  >
</ButtonGroup>
