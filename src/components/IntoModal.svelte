<script lang="ts">
  import { Modal, P } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { page } from '$app/state';
  import { DEMO_MODE } from "../state.svelte";

  let defaultModal = $state(false);
  DEMO_MODE.activated=false;
  DEMO_MODE.step = undefined;

  onMount(()=>{
    const demo = page.url.searchParams.has('demo');
    if(demo){
      defaultModal = true;
      return;
    }
    const firstVist:string|null = localStorage.getItem("firstVisit");
    if(firstVist === "true"){
      defaultModal = true;
    }else{
      defaultModal = false;
    }
    localStorage.setItem("firstVisit", "false");
  });

  function modeActivation(mode:string):void{
    switch(mode){
      case "demo":
        DEMO_MODE.activated=true;
        DEMO_MODE.step = 1;
        break;
      case "free":
        DEMO_MODE.activated=false;
        DEMO_MODE.step = undefined;
        break;
      default:
      console.warn("An unknown mode was activated");
    }
  }
</script>

<Modal title="Online Schema Alignment for Link Traversal Queries" form bind:open={defaultModal} onaction={({ action }) => modeActivation(action)}>
    <P>
    This demonstrator serves two purposes: first, to highlight a key challenge in querying decentralized, unindexed networks; and second, to present our proposed solution.
    It is not intended as a "product". Users interested in our early implementation can refer to
    this <a style="color: #0000ee; text-decoration: underline;" href="https://www.npmjs.com/package/query-sparql-link-traversal-solid-schema-alignment">package</a>, which provides both a command-line interface for running queries and a library interface for integration.
    </P>

    <P>
    The demo scenario features a user or agent executing queries across a decentralized social media network.
    Each query begins from an "anchor" user but may retrieve information about others, for example, the messages the anchor user has liked.
    </P>

    <P>
    When all participants share the same vocabulary, such queries are straightforward.
    However, when multiple vocabularies or foreign schemas are involved, existing approaches fail.
    Our solution directly addresses this interoperability challenge.
    </P>

    {#snippet footer()}
        <button value="free">Free Mode</button> <button value="demo">Demo Mode</button>
      {/snippet}
</Modal>
