<script lang="ts">
    import {writable} from 'svelte/store';
    import {tasksStore} from "$lib/controls/tasks";
    import type {TasksType} from "$lib/controls/types/tasks";
    import TaskItem from "$lib/pages/tasks/TaskItem.svelte";

    export let subcategory: { id: int; name: string };

    const isOpen = writable(false);

    let filteredTasks: TasksType[] = [];
    let unsubscribe: Function;

    async function loadTasks() {
        const store = tasksStore(subcategory.id);
        unsubscribe = store.subscribe((data) => {
            filteredTasks = data.filter((item: TasksType) => item.subcategory === subcategory.id);
        })
    }

    async function toggleAccordion() {
        await loadTasks();
        isOpen.update(open => !open);
    }
</script>

<li>
    <div class="flex items-center justify-between bg-slate-200 p-4 dark:bg-navy-500 sm:px-5"
         on:click={toggleAccordion}>
        <div class="flex items-center space-x-3.5 tracking-wide outline-none transition-all">
            <h2 class="text-slate-700 line-clamp-1 dark:text-navy-100">
                <strong>{subcategory.name}</strong>
            </h2>
        </div>
        <div class="text-sm font-normal leading-none text-slate-400 transition-transform duration-300 dark:text-navy-300">
            <svg class="w-4 h-4 transition-transform duration-300" fill="currentColor"
                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path class="transition-transform duration-300" d="M10 12l-4-4h8l-4 4z"
                      fill="currentColor"/>
            </svg>
        </div>
    </div>

    {#if $isOpen}
        <ul class="divide-y divide-slate-500">
            {#if filteredTasks.length > 0}
                {#each filteredTasks as task}
                    <TaskItem {task}/>
                {/each}
            {:else }
                <li class="px-4 py-2">
                    <span>
                        Aun no existen tareas en está sección
                    </span>
                </li>
            {/if}
        </ul>
    {/if}

</li>