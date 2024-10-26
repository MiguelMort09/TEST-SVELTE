<script lang="ts">
    import { DateTime } from "luxon";
    import CardMenu from "$lib/controls/Utils/CardMenu.svelte";
    import { goto } from '$app/navigation';
    import {timeFormated, timeToAgo} from '$lib/Utils/display';
    import type { SubcategoriesType } from '$lib/controls/types/subcategories';
    import { deleteSubcategories, duplicateSubcategories, subcategoriesByIdStore } from '$lib/controls/subcategories';
    import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
    import { page } from '$app/stores';
    import {slide} from 'svelte/transition';
    import ViewMore from '$lib/components/ui/text/ViewMore.svelte';
    import {categoriesValuesMapById} from "$lib/controls/categories"


    export let subcategoriesId:string = "";
    export let values:SubcategoriesType|undefined = undefined;
    export let viewAll:boolean = false;
    export let viewMenu:boolean = true;
    

    let row = values;
    let inlist = true;
    let subcategories: Unsubscriber | undefined = undefined;
    let subcolBaseLink = "";
    let subcolLink = subcolBaseLink.endsWith("/")?subcolBaseLink.slice(0, -1):subcolBaseLink;
    
    	let categories = categoriesValuesMapById();
	let columnCount = 4;


	if (row == undefined && subcategoriesId != "") {
        inlist = false;
        subcategories = subcategoriesByIdStore( subcategoriesId).subscribe(async (value) => {
			row = value;
            if (value == undefined) {
                return;
            }
            let tempsubcategories = value;
            let tmp = [row];
            			
			categories.toQueue(tempsubcategories.category);
				


            			
			await categories.load();
			for (let i = 0; i < tmp.length; i++) {
                const element = tmp[i];
				if (element.category != undefined){
					 element.categoryName = $categories.get(element.category)?.name ?? "";
				}
            }
				


            row = row;
		});

        
	}

	onDestroy(() => {
		if (subcategories != undefined) {
			subcategories();
			subcategories = undefined;
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
<div transition:slide|local class="card p-0 {!inlist?'bg-gradient-to-br from-slate-200 to-slate-300 mb-4 dark:from-slate-900 dark:to-slate-700':''} grow subcategories">
{#if row == undefined}
     cargando datos ...
{:else}
    
        <div class="flex flex-col grow items-start p-4 sm:p-5">

					<div class="flex flex-row w-full">
						<div class="flex flex-col grow pt-1 mb-0">
							<p class="text-xs text-left w-full text-slate-400">Subcategoría</p>
							<h3 class="text-left mb-0 text-lg text-primary font-medium">
								{#if viewMenu}
									<a href="{subcolLink}/subcategories/edit/{row.id}">{row.name}</a>
								{:else}
									{row.name}
								{/if}
							</h3>
						</div>
						{#if viewMenu}
						<CardMenu base="crud" on:delete={()=>{deleteSubcategories(id )}} on:edit={()=>{goto(subcolLink+"/subcategories/edit/"+id)}} on:duplicate={()=>{duplicateSubcategories(id )}} />
						{/if}
					</div>
		<div class="my-4 h-px w-full bg-slate-200 dark:bg-navy-500"></div>
<div class="fields flex flex-col grow items-start">		<div class="field order"><span class="lbl">Orden : </span> <span class="val">{row.order ?? ""}</span></div>
		<div class="field category"><span class="lbl">Categoría:</span> <h5 class="val">{row.categoryName ?? ''}</h5></div>
		<div class="field name"><span class="lbl">Nombre : </span> <span class="val">{row.name ?? ""}</span></div>
</div>
</div>
	{#if viewMenu}
		<div class="flex divide-x divide-slate-150 border-t border-slate-150 dark:divide-navy-500 dark:border-navy-500"></div>
	{/if}

    
{/if}
</div>