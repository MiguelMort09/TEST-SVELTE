<script lang="ts">
    import { DateTime } from "luxon";
    import CardMenu from "$lib/controls/Utils/CardMenu.svelte";
    import { goto } from '$app/navigation';
    import {timeFormated, timeToAgo} from '$lib/Utils/display';
    import type { TasksType } from '$lib/controls/types/tasks';
    import { deleteTasks, duplicateTasks, tasksByIdStore } from '$lib/controls/tasks';
    import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
    import { page } from '$app/stores';
    import {slide} from 'svelte/transition';
    import ViewMore from '$lib/components/ui/text/ViewMore.svelte';
    import {categoriesValuesMapById} from "$lib/controls/categories"
import {subcategoriesValuesMapById} from "$lib/controls/subcategories"


    export let tasksId:string = "";
    export let values:TasksType|undefined = undefined;
    export let viewAll:boolean = false;
    export let viewMenu:boolean = true;
    

    let row = values;
    let inlist = true;
    let tasks: Unsubscriber | undefined = undefined;
    let subcolBaseLink = "";
    let subcolLink = subcolBaseLink.endsWith("/")?subcolBaseLink.slice(0, -1):subcolBaseLink;
    
    	let categories = categoriesValuesMapById();
	let subcategories = subcategoriesValuesMapById();
	let columnCount = 6;


	if (row == undefined && tasksId != "") {
        inlist = false;
        tasks = tasksByIdStore( tasksId).subscribe(async (value) => {
			row = value;
            if (value == undefined) {
                return;
            }
            let temptasks = value;
            let tmp = [row];
            			
			categories.toQueue(temptasks.category);
				
			
			subcategories.toQueue(temptasks.subcategory);
				


            			
			await categories.load();
			for (let i = 0; i < tmp.length; i++) {
                const element = tmp[i];
				if (element.category != undefined){
					 element.categoryName = $categories.get(element.category)?.name ?? "";
				}
            }
				
			
			await subcategories.load();
			for (let i = 0; i < tmp.length; i++) {
                const element = tmp[i];
				if (element.subcategory != undefined){
					 element.subcategoryName = $subcategories.get(element.subcategory)?.name ?? "";
				}
            }
				


            row = row;
		});

        
	}

	onDestroy(() => {
		if (tasks != undefined) {
			tasks();
			tasks = undefined;
		}
	});

    $: id = row?.id ?? "";

    function removeTrailingSlash(str:string){
        if(str.endsWith("/")){
            return str.slice(0, -1);
        }
        return str;
    }

</script>
<div transition:slide|local class="card p-0 {!inlist?'bg-gradient-to-br from-slate-200 to-slate-300 mb-4 dark:from-slate-900 dark:to-slate-700':''} grow tasks">
{#if row == undefined}
     cargando datos ...
{:else}
    
        <div class="flex flex-col grow items-start p-4 sm:p-5">

					<div class="flex flex-row w-full">
						<div class="flex flex-col grow pt-1 mb-0">
							<p class="text-xs text-left w-full text-slate-400">Tarea</p>
							<h3 class="text-left mb-0 text-lg text-primary font-medium">
								{#if viewMenu}
									<a href="{subcolLink}/tasks/edit/{row.id}">{row.name}</a>
								{:else}
									{row.name}
								{/if}
							</h3>
						</div>
						{#if viewMenu}
						<CardMenu base="crud" on:delete={()=>{deleteTasks(id )}} on:edit={()=>{goto(subcolLink+"/tasks/edit/"+id)}} on:duplicate={()=>{duplicateTasks(id )}} />
						{/if}
					</div>
		<div class="my-4 h-px w-full bg-slate-200 dark:bg-navy-500"></div>
<div class="fields flex flex-col grow items-start">		<div class="field name"><span class="lbl">Nombre : </span> <span class="val">{row.name ?? ""}</span></div>
		<div class="field completed"><span class="lbl">Completado:</span> <span class="val">{row.completed?'Si':'No'}</span></div>
		<div class="field category"><span class="lbl">Categoría:</span> <h5 class="val">{row.categoryName ?? ''}</h5></div>
		<div class="field subcategory"><span class="lbl">Subcategoría:</span> <h5 class="val">{row.subcategoryName ?? ''}</h5></div>
		<div class="field dueDate"><span class="lbl">Fecha Compromiso:</span> <span class="val">{timeFormated(row.dueDate)}</span></div>
</div>
</div>
	{#if viewMenu}
		<div class="flex divide-x divide-slate-150 border-t border-slate-150 dark:divide-navy-500 dark:border-navy-500"></div>
	{/if}

    
{/if}
</div>