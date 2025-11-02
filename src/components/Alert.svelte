<script lang="ts">
  import { Alert } from "flowbite-svelte";
  import { InfoCircleSolid } from "flowbite-svelte-icons";
  import { ALERT, AlertType } from "../state.svelte";
  import { fade } from 'svelte/transition';


  const color:"green"|"red"|undefined = $derived.by(()=>{
    if(ALERT.type === AlertType.None){
      return undefined;
    }else if(ALERT.type === AlertType.Error){
      return "red";
    } else{
      return "green";
    }
  });
  let visible = $state(false);
  let timeout:NodeJS.Timeout;

  $effect(()=>{
    if(ALERT.type !== AlertType.None){
      clearTimeout(timeout);
      visible = true;

      timeout = setTimeout(()=>{
        visible = false;
        ALERT.type = AlertType.None;
        ALERT.message = undefined;
      }, 1000);
    }
  });

</script>

{#if visible}
    <div out:fade={{ duration: 500 }}>
        <Alert color={color}>
          {#snippet icon()}<InfoCircleSolid class="h-5 w-5" />{/snippet}
          {ALERT.message}
        </Alert>
    </div>
{/if}
