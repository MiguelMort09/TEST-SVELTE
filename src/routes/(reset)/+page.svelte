<script lang="ts">
    import type {CategoriesType} from '$lib/controls/types/categories';
    import Skeleton from "$lib/controls/Skeleton.svelte";
    import {categoriesStore} from "$lib/controls/categories";
    import CategoryList from "$lib/pages/categories/CategoryList.svelte";
    import TaskCreate from "$lib/pages/tasks/TaskCreate.svelte";

    let categories: CategoriesType[] = [];
    let loading: boolean = true

    async function loadCategories() {
        categoriesStore().subscribe((data) => {
            categories = data;
            loading = false;
        });
    }

    loadCategories();

</script>

<main class="max-w-7xl mx-auto sm:px-6 lg:px-8 py-10">
    <h1 class="text-xl font-bold uppercase font-mono text-gray-900 mb-5">
        Administrador de tareas
        <TaskCreate/>
    </h1>


    {#if loading}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
        </div>
    {:else}
        {#if categories.length > 0}
            <CategoryList {categories}/>
        {:else}
            <p>No hay categorías disponibles.</p>
        {/if}
    {/if}
</main>
