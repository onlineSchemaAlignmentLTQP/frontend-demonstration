<script lang="ts">
  import { onMount } from "svelte";
  import { Toggle } from "flowbite-svelte";
  import {EVENT_TARGET, CHANGE_SCHEMA_ALIGNMENT_STATE} from "../state.svelte";

  // start at false because we toggle automatically
  let schemaAlignmentState = false;

  function schemaAlignmentToggle(){
    schemaAlignmentState = !schemaAlignmentState;
    console.log(`schema alignment is ${schemaAlignmentState?"activated":"deactivated"}`);
    const event = new CustomEvent(CHANGE_SCHEMA_ALIGNMENT_STATE, {"detail":schemaAlignmentState})
    EVENT_TARGET.dispatchEvent(event);
  }

  onMount(()=>{
    schemaAlignmentState = false;
    schemaAlignmentToggle();
  });

</script>

<Toggle bind:checked={schemaAlignmentState} onclick={schemaAlignmentToggle}>Schema Alignment</Toggle>
