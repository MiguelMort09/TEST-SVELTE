<script lang="ts">
    import { DateTime } from "luxon";
    import CardMenu from "$lib/controls/Utils/CardMenu.svelte";
    import { goto } from '$app/navigation';
    import {timeFormated, timeToAgo} from '$lib/Utils/display';
    import type { CategoriesType } from '$lib/controls/types/categories';
    import { deleteCategories, duplicateCategories, categoriesByIdStore } from '$lib/controls/categories';
    import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
    import { page } from '$app/stores';
    import {slide} from 'svelte/transition';
    import ViewMore from '$lib/components/ui/text/ViewMore.svelte';
    

    export let categoriesId:string = "";
    export let values:CategoriesType|undefined = undefined;
    export let viewAll:boolean = false;
    export let viewMenu:boolean = true;
    

    let row = values;
    let inlist = true;
    let categories: Unsubscriber | undefined = undefined;
    let subcolBaseLink = "";
    let subcolLink = subcolBaseLink.endsWith("/")?subcolBaseLink.slice(0, -1):subcolBaseLink;
    
    	let columnCount = 3;


	if (row == undefined && categoriesId != "") {
        inlist = false;
        categories = categoriesByIdStore( categoriesId).subscribe(async (value) => {
			row = value;
            if (value == undefined) {
                return;
            }
            let tempcategories = value;
            let tmp = [row];
            

            

            row = row;
		});

        
	}

	onDestroy(() => {
		if (categories != undefined) {
			categories();
			categories = undefined;
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
<div transition:slide|local class="card p-0 {!inlist?'bg-gradient-to-br from-slate-200 to-slate-300 mb-4 dark:from-slate-900 dark:to-slate-700':''} grow categories">
{#if row == undefined}
     cargando datos ...
{:else}
    
        <div class="flex flex-col grow items-start p-4 sm:p-5">

					<div class="flex flex-row w-full">
						<div class="flex flex-col grow pt-1 mb-0">
							<p class="text-xs text-left w-full text-slate-400">Categoría</p>
							<h3 class="text-left mb-0 text-lg text-primary font-medium">
								{#if viewMenu}
									<a href="{subcolLink}/categories/edit/{row.id}">{row.name}</a>
								{:else}
									{row.name}
								{/if}
							</h3>
						</div>
						{#if viewMenu}
						<CardMenu base="crud" on:delete={()=>{deleteCategories(id )}} on:edit={()=>{goto(subcolLink+"/categories/edit/"+id)}} on:duplicate={()=>{duplicateCategories(id )}} />
						{/if}
					</div>
		<div class="my-4 h-px w-full bg-slate-200 dark:bg-navy-500"></div>
<div class="fields flex flex-col grow items-start">		<div class="field order"><span class="lbl">Orden : </span> <span class="val">{row.order ?? ""}</span></div>
		<div class="field name"><span class="lbl">Nombre : </span> <span class="val">{row.name ?? ""}</span></div>
</div>
</div>
	{#if viewMenu}
		<div class="flex divide-x divide-slate-150 border-t border-slate-150 dark:divide-navy-500 dark:border-navy-500"></div>
	{/if}

    
{/if}
</div>