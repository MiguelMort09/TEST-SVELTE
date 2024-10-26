<script lang="ts">
    import {writable} from 'svelte/store';
    import {subcategoriesStore} from "$lib/controls/subcategories";
    import type {SubcategoriesType} from '$lib/controls/types/subcategories';
    import SubcategoryCard from "$lib/pages/subcategories/SubcategoryCard.svelte";

    export let category: { id: number; name: string; order: number; }; // Cambia 'int' a 'number'

    const isOpen = writable(false);
    const loading = writable(true);

    let filteredSubcategories: SubcategoriesType[] = [];

    async function loadSubcategories() {
        const store = subcategoriesStore(category.id);

        store.subscribe((data) => {
            filteredSubcategories = data.filter((item: SubcategoriesType) => item.category === category.id);
            loading.set(false);
        });
    }

    loadSubcategories();

    function toggleAccordion() {
        isOpen.update(open => !open);
    }
</script>

<div class="overflow-hidden bg-white rounded-lg border border-slate-150 dark:border-navy-500 shadow-lg">
    <div class="flex flex-col">
        <div class="flex items-center justify-between bg-slate-600 p-4 dark:bg-navy-500 sm:px-5"
             on:click={toggleAccordion}>
            <div class="flex items-center space-x-3.5 tracking-wide outline-none transition-all">
                <h2 class="text-gray-100 line-clamp-1 dark:text-navy-100">
                    <strong>{category.name}</strong>
                </h2>
            </div>
            <div class={`text-sm font-normal leading-none text-slate-400 transition-transform duration-300 dark:text-navy-300`}>
                <svg class="w-4 h-4 transition-transform duration-300" fill="currentColor"
                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path class={`transition-transform duration-300 ${$isOpen ? 'rotate-180' : ''}`}
                          d="M10 12l-4-4h8l-4 4z"/>
                </svg>
            </div>
        </div>
        {#if $isOpen}
            {#if $loading}
                <p>Cargando subcategorías...</p>
            {:else}
                <ul class="divide-y divide-slate-950">
                    {#each filteredSubcategories as subcategory}
                        <SubcategoryCard {subcategory}/>
                    {/each}
                </ul>
            {/if}
        {/if}
    </div>
</div>
