<script lang="ts">
  import { onMount } from "svelte";
  import { Toggle } from "flowbite-svelte";
  import { EVENT_TARGET, CHANGE_SCHEMA_ALIGNMENT_STATE_EVENT } from "../state.svelte";

  let domDiv:HTMLDivElement|null;
  // start at false because we toggle automatically
  let schemaAlignmentState = false;

  function schemaAlignmentToggle() {
    schemaAlignmentState = !schemaAlignmentState;
    console.log(`schema alignment is ${schemaAlignmentState ? "activated" : "deactivated"}`);
    const event = new CustomEvent(CHANGE_SCHEMA_ALIGNMENT_STATE_EVENT, {
      detail: schemaAlignmentState,
    });
    EVENT_TARGET.dispatchEvent(event);
    const toggleSwitch = domDiv?.querySelector(".toggle-network label span");
    console.log(toggleSwitch)
    if(!schemaAlignmentState){
      toggleSwitch?.classList.add("alignment-switch-unselected");
    }else{
      toggleSwitch?.classList.remove("alignment-switch-unselected");
    }
  }

  onMount(() => {
    schemaAlignmentState = true;

  });
</script>

<div class="toggle-network" bind:this={domDiv}>
  <Toggle
    bind:checked={schemaAlignmentState}
    onclick={schemaAlignmentToggle}>Schema Alignment</Toggle
  >
</div>

<style>
  :global(.toggle-network label span) {
    background-color: var(--color-comunica-red);
  }
  :global(.alignment-switch-unselected){
      background-color: #f3f4f6 !important;
  }
</style>
