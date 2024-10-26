<script lang="ts">
    export let value: string|undefined;
    export let length: number = 150;
    export let showMore: boolean = false;
</script>
{#if value}
    {#if value.length > length && !showMore}
        {value.substring(0, length)}...
        <button
        on:click={() => showMore = !showMore}
        class="text-info text-xs" data-toggle="tooltip" data-placement="top" title="{value}">Ver más</button>
    {:else}
        {value}
    {/if}
{:else}
    <span class="text-muted">-</span>
{/if}