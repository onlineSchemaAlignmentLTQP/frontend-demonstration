<script lang="ts">
    import Scenario from "./ScenarioModal.svelte";
    import {P} from "flowbite-svelte";
</script>

<Scenario step={1} title="Select a Query" selectedIcon={[]}>
    {#snippet content()}
        <P>
            Let's start by selecting a query.
        </P>
    {/snippet}
</Scenario>
