<script lang="ts">
	let { bindings }: { bindings: Record<string, string> } = $props();
</script>

<div class="entries">
    {#each Object.entries(bindings) as [key, value] (key)}
	<div class="entry">
	    <span class="key">?{key}</span> <span class="value">{value}</span>
	</div>
    {/each}
</div>

<style>
    .entries{
        display: flex;
        flex-direction:column;
    }
    .entry{
        background-color: hsl(44,8,86);
    }
    .key{
        border-radius: 5px;
        padding-right: 0.5em;
        padding-left: 0.5em;
        background-color: var(--color-comunica-red);
        color: white;
    }
</style>
