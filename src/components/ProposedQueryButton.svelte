<script lang="ts">
  import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
  import { ChevronDownOutline } from "flowbite-svelte-icons";
  import queriesNetwork from "../../example_queries/network.json?raw";
  import { EVENT_TARGET, PROPOSED_QUERY_EVENT } from "../state.svelte";

  const queries = JSON.parse(queriesNetwork);

  function changeQuery(description:string){
    const event = new CustomEvent(PROPOSED_QUERY_EVENT, {"detail":queries[description]})
    EVENT_TARGET.dispatchEvent(event);
  }

</script>

<Button>
  Proposed Queries
  <ChevronDownOutline class="ms-2 h-6 w-6 text-white dark:text-white" />
</Button>
<Dropdown simple>
  {#each Object.keys(queries) as query (query)}
    <DropdownItem onclick={()=>{changeQuery(query) }}>{query}</DropdownItem>
  {/each}
</Dropdown>
