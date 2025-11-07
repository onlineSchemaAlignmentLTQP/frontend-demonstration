<script lang="ts">
  import { onMount } from "svelte";
  import { Toggle } from "flowbite-svelte";
  import { EVENT_TARGET, CHANGE_SCHEMA_ALIGNMENT_STATE_EVENT } from "../state.svelte";

  // start at false because we toggle automatically
  let schemaAlignmentState = false;

  function schemaAlignmentToggle() {
    schemaAlignmentState = !schemaAlignmentState;
    console.log(`schema alignment is ${schemaAlignmentState ? "activated" : "deactivated"}`);
    const event = new CustomEvent(CHANGE_SCHEMA_ALIGNMENT_STATE_EVENT, {
      detail: schemaAlignmentState,
    });
    EVENT_TARGET.dispatchEvent(event);
  }

  onMount(() => {
    schemaAlignmentState = false;
    schemaAlignmentToggle();
  });
</script>

<div class="toggle-network">
  <Toggle
    style="background-color: var(--color-comunica-red);;"
    bind:checked={schemaAlignmentState}
    onclick={schemaAlignmentToggle}>Schema Alignment</Toggle
  >
</div>

<style>
  :global(.toggle-network label span) {
    background-color: var(--color-comunica-red);
  }
</style>
