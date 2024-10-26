<script lang="ts">
    import type {CategoriesType} from '$lib/controls/types/categories';
    import CategoryCard from "$lib/pages/categories/CategoryCard.svelte";

    export let categories: CategoriesType[] = [];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
    {#each categories as category}
        <div>
            <CategoryCard {category}/>
        </div>
    {/each}
</div>

