<script lang="ts">
    import { Modal} from "flowbite-svelte";
    import { DEMO_MODE } from "../../state.svelte";
    import { slide } from "svelte/transition";
    import {type IScenario} from "$lib";

    let {step, title, content, selectedIcon}:IScenario = $props();

    let activateModal = $derived(DEMO_MODE.step ===step?true:false);
</script>


<Modal title={title} outsideclose={false} form bind:open={activateModal} transition={slide}>
    {@render content()}
    <button type="submit" onclick={() => {DEMO_MODE.selectedIcon=selectedIcon}}>Next</button>
</Modal>
