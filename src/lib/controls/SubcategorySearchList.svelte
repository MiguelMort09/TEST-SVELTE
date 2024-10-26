<script lang="ts">
  import { onMount, onDestroy  } from 'svelte';
  import Select from 'svelte-select';
  import swal from 'sweetalert';
  import { subcategoriesStore, addSubcategories } from './subcategories';
  import type { SubcategoriesType } from './types/subcategories';
  import type { ComponentType } from 'svelte';
  import { type Readable } from 'svelte/store';
  import type { Unsubscriber } from 'svelte/store';
  import 'iconify-icon';

  export let value:string|string[] = "";
  export let inlist = false;
  export let onlyfields = false;
  export let baseId:string ="";
  export let fields:string[] = [];
  export let excludeIds:string[] = [];
  export let allTag:string = "Seleccionar ...";
  export let withStyle = true;
  export let onSelect:((selected:any)=>void)|null = null;
  export let canAdd = false;
  export let filter = (row:any)=>{return true;};
  export let multiple = false;
  

  let Edit:ComponentType;
  let rows:any[] = [];
  let allRows:SubcategoriesType[] = [];
  let valueObject:any;
  let addForm:HTMLDivElement;
  let unsubscribe:Unsubscriber|undefined;

  let subcategories:Readable<SubcategoriesType[]>|undefined;
  //  const subcategories = subcategoriesStore();

  $: value, filter , updateSelect2();
  $: valueObject, handleSelect();

  function updateStore(){
  // if(quotesId == undefined && quotesId == "") {
  //   return;
  // }
    if(unsubscribe != undefined){
      unsubscribe();
    }
    subcategories = subcategoriesStore();
    unsubscribe = subcategories.subscribe(data => {
      allRows = data;
      //sort by name
      allRows.sort((a,b)=>a.name != undefined && b.name != undefined ? a.name.localeCompare(b.name):0);
      updateSelect2();
    });


    }
    updateStore();

  function updateSelect2(){
    rows = [];
  // let found = false;
  for (let d = 0; d < allRows.length; d++) {
      const element = allRows[d];
      const op = {value:element.id, label:element.name};
      if(element.id != undefined && !excludeIds.includes(element.id) && filter(element)){
        
        if(element.id == value){
          if(valueObject?.value != element.id){
            valueObject = op;
            onSelect?.(element);
          }
        }
        rows.push(op);
      }
      
    }
  }
  function handleSelect(){
    if(valueObject == undefined){
        return;
    }

    if (Array.isArray(valueObject) && multiple) {
      
      //check if all values are in the list
      if(value == undefined){
        value = [];
      }
      if(!Array.isArray(value)){
        value = [value];
      }
      let allInList = true;
      value.forEach((element:string) => {
        if(!valueObject.some((row:any)=>row.value == element)){
          allInList = false;
        }
      });
      if(allInList){
        return;
      }
      value = valueObject.map((item: any) => item.value);
      if(onSelect != null && typeof onSelect === 'function'){
        let selected:ProjectsType[] = [];
        allRows.forEach(element => {
          if(element.id != undefined && value.includes(element.id)){
            onSelect!(selected);
          }
        });
        
      }
    } else {
      if(valueObject.value == undefined){
        return;
      }
      if(valueObject.value == value){
        return;
      }
      value = valueObject.value;
      if(onSelect != null && typeof onSelect === 'function'){
        allRows.forEach(element => {
          if(element.id == value){
            onSelect!(element);
            //console.log(element);
          }
        });
      }
    }
  }

  function handleClear(event:any) {
    value = "";
  }


  onDestroy(()=>{
    unsubscribe?.();
  });

  async function addOption(){
    Edit = (await import('$lib/pages/subcategories/SubcategoriesEdit.svelte')).default;
    await swal({
      closeOnClickOutside: false,
      buttons: [false],
      content:{"element":addForm},
      className:"modal-add"
    });
  }
  function onBack(cancel?:boolean, data?:SubcategoriesType){
    if(!cancel && data?.id != undefined){
      value = data.id;
    }
    swal.close?.();
  }
</script>
<div class="{withStyle?'form-group flex':''}">
  {#if inlist && $subcategories != undefined}
    {#each $subcategories as row}
      {#if row.id == value}
        {#if !onlyfields}
          {#if withStyle}
            <h5>{row.name}</h5>
          {:else}
            {row.name}
          {/if}
        {/if}
      {/if}
    {/each}
  {:else}
  <Select {multiple} items={rows} bind:value={valueObject} on:clear={handleClear} placeholder={allTag} class={canAdd?'select-w-add':''}>
    <div slot="empty" class="p-4 text-sm text-slate-400" >No hay resultados</div>
  </Select>
    {#if canAdd}
      <button type="button" class="btn btn-outline-secondary waves-effect waves-light shrink p-2 rounded-l-none" on:click={addOption}>
        <iconify-icon icon="mdi:plus" class="text-xl mr-2"></iconify-icon> Agregar
      </button>
    {/if}
    {/if}
</div>
{#if !inlist && canAdd}
<template>
    <div class="add-form" bind:this={addForm}>
    <svelte:component this={Edit} onBack={onBack}  />
    </div>
</template>
{/if}