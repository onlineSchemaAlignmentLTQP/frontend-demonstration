<script lang="ts">
  import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
  import { ChevronDownOutline } from "flowbite-svelte-icons";
  import queriesNetwork from "../../example_queries/network.json?raw";
  import { EVENT_TARGET, PROPOSED_QUERY_EVENT, CHANGE_RULE_EVENT } from "../state.svelte";

  let isOpen = $state(false);

  const queries = JSON.parse(queriesNetwork);

  function changeQuery(description: string) {
    const queryEvent = new CustomEvent(PROPOSED_QUERY_EVENT, { detail: queries[description] });
    EVENT_TARGET.dispatchEvent(queryEvent);

    const ruleEvent = new CustomEvent(CHANGE_RULE_EVENT, { detail: queries[description]["rules"] });
    EVENT_TARGET.dispatchEvent(ruleEvent);
    isOpen = false;
  }
</script>

<Button
  style="
background: var(--color-comunica-red);
border: solid black 1px;
color: white;
padding: 0.5rem 0.75rem;
border-radius: 6px;
font-weight: 700;
cursor: pointer;
box-shadow: 0 2px 6px rgba(0,0,0,0.12);"
>
  Queries
  <ChevronDownOutline class="ms-2 h-6 w-6 text-white dark:text-white" />
</Button>
<Dropdown bind:isOpen simple>
  {#each Object.keys(queries) as query (query)}
    <DropdownItem
      onclick={() => {
        changeQuery(query);
      }}>{query}</DropdownItem
    >
  {/each}
</Dropdown>
