<script lang="ts">
  import {writable, type Unsubscriber } from 'svelte/store';
  import {doc, getDoc, collection, addDoc, setDoc, deleteField, updateDoc, orderBy, limit} from 'firebase/firestore';
  import {db, timenow} from '$lib/app';
  import { permissions} from "$lib/user";
  import type { CategoriesType } from '$lib/controls/types/categories';
  import { CategoriesFromData, categoriesGetAll, categoriesGetNextOfField } from '$lib/controls/categories';
  
  //import TitleBar from "$lib/base/TitleBar.svelte";
  import { onDestroy,onMount } from "svelte";
  import { page } from '$app/stores';
  import { goto, afterNavigate } from '$app/navigation';
  import { DateTime } from "luxon";
  import { numberFormat, decimalFormat } from '$lib/actions/numberFormat';
  import {validateFrom, type Validator} from "$lib/Utils/validator";
	
  
 async function checkVisibles(){
		 console.log('checkVisibles');
	if(values != undefined && values.order == undefined){ values.order = await autoIncrement('order'); } 
}


  export let values:any = {};
  export let buttons = true;
  export let data:any|undefined = undefined;
  export let tempId:string|null = null;
  export let viewTitle = true;
  export let saveLabel = "Guardar";
  export let cancelLabel = "Cancelar";
  export let filterName:string|undefined = undefined;
  export let filterValue:string|undefined = undefined;
  export let anonymous = false;

  let uid = "";
  let userName = "anonymous";

  let toValidate = writable<Validator[]>([]);
  validateFrom.set(toValidate);
  

  values = { ...{}, ...values};

  let params = $page.params;

  
  
  let old:any = {};
  let adder:any = {};
  let exists = false;

  let loading = true;
  let form:HTMLFormElement;

  if(data != undefined){
    if(data.buttons != undefined && data.buttons == false){
      buttons = false;
    }
  }

  let previousPage:string|undefined;
  afterNavigate((navigaton) => {
    previousPage = navigaton?.from?.url.pathname;
  });
  export let onBack = (cancel?:boolean, data?:CategoriesType)=> {
    let defaultRoute = '/categories';
    goto(previousPage != undefined ? previousPage : defaultRoute);
    //goto("/schema/"+node);

  }

  export let beforeSave = (values:any) => {
    return values;
  }

  if(!anonymous){
    importUserAndLoadData();
  }
  let unsubUser:Unsubscriber|undefined = undefined;
  async function importUserAndLoadData(){
    let user = (await import('$lib/user')).user;
    unsubUser = user.subscribe((value) => {
      if(value != undefined){
        uid = value.uid ?? "";
        userName = value.displayName ?? "anonymous";
      }
    });
  }
  
  onMount(() => {
    // form = document.getElementById('form');

    if (tempId == null) {
      loading = false;
      
    } else {
      getDoc(doc(db, "categories", tempId)).then(function(query) {
          if (query == null || query == undefined || query.data() == null) {
            //No data crear
            //pop();
          } else {
            exists = true;
            values = query.data();
            values.id = query.id;
            
            old = values;
            
          }
          loading = false;
        });
    }
  });
  onDestroy(() => {
    if(unsubUser != undefined){
      unsubUser();
    }
  });
  

  function cancel() {
    onBack(true);
  }

  async function updateData() {
    
    if(!form.checkValidity()){
      form.reportValidity();
      /*
        TODO:focus if different tab
      */
      return;
    }
    if($toValidate.length > 0){
      for(let i = 0; i < $toValidate.length; i++){
        let result = $toValidate[i].validate();
        if(result == false){
          console.log("Validation failed : "+$toValidate[i].field);
          return;
        }
      }
    }
    loading = true;
    if(checkVisibles != undefined){
      await checkVisibles();
    }
    
    
    if (tempId != null) {
      //Actualizar si tiene id
      if(!exists){
        values = beforeSave(values);
        if(values.added == undefined || values.added == ""){
          values.added = timenow;
        }else if(typeof values.added === 'string' || values.added instanceof String){
          values.added = DateTime.fromISO(values.added as string).toJSDate();
        }
        values.createdBy = uid;
        values.createdName = userName;
        setDoc(doc(db, "categories",tempId) , values).then(function () {

            loading = false;

            let data:CategoriesType|undefined = undefined;
            try{
              data = CategoriesFromData(tempId, values);
            }catch(e){
              console.log(e);
            }
            onBack(false,data);
          });
      }else{
        values = beforeSave(values);
        values.edited = timenow;
        values.editedBy = uid;
        values.editedName = userName;
        updateDoc(doc(db, "categories",tempId) , values).then(function() {
            loading = false;
            let data = CategoriesFromData(tempId!, values);
            onBack(false,data);
          });
      }
      
    } else {
      //Crear nuevo si no tiene
      values = beforeSave(values);
      if(values.added == undefined || values.added == ""){
          values.added = timenow;
      }else if(typeof values.added === 'string' || values.added instanceof String){
        values.added = DateTime.fromISO(values.added as string).toJSDate();
      }
      values.createdBy = uid;
      values.createdName = userName;
      let newDoc = doc(collection(db, "categories"));
      let dId = newDoc.id;
      if(values.id != undefined){
        // if has a field named ID, use it
        dId = values.id;
      }

      setDoc(doc(db, "categories",dId) , values).then(function () {

          loading = false;
          let data = CategoriesFromData(dId, values);
          onBack(false, data);
        });
    }
  }
  function setField(field:string, value:any){
    values[field] = value;
    values = values;
  }

  function addToTable(field:string, adderValues:any){
    if(values[field] == undefined){
      values[field] = [];
    }
    values[field].push(adderValues);
    values = values;
    adder = {};
  }
  function deleteFromTable(field:string, idx:number){
    if(values[field] != undefined){
        values[field].splice(idx,1);
      }
      values = values;
  }

  function onAction(event:any){
    const action = event.detail;
    if(action == "save"){
      //console.log("saved");
      updateData();
    }
  }

  interface IIndexable {
    [key: string]: any;
  }
  async function autoIncrement(field:string):Promise<number>{
    let maxDocs = await categoriesGetNextOfField( field);
    return maxDocs;
  }
</script>

<div class="page-content modal-body w-full max-w-2xl mx-auto ">
  <!-- <TitleBar title="Agregar Categoría" base="Inventario" /> -->
<form id="form" bind:this={form}>
  <div class="row">
    {#if viewTitle}
      <h4 class="card-title mt-4">Categoría</h4>
    {/if}
      
<div class="col-12">
	<div class="card">
<div class="card-body">

	<div class="form-group row"><label for="order" class="col-md-4 col-form-label">Orden</label><div class="col-md-8 input-group">{values.order ?? '--'} </div> </div>

	<div class="form-group row"><label for="name" class="col-md-4 col-form-label">Nombre</label><div class="col-md-8 input-group flex-wrap"><input class="form-control name " type="text" bind:value={values.name} id="name"  required /></div> </div>

</div>
	</div>
</div>
  </div>
</form>
  
</div>
{#if buttons}
<div class="row modal-footer w-full max-w-2xl mx-auto">
  <div class="col-12">
    <div class="card">
      <div class="card-body flex gap-2">
        
        <button
          on:click={updateData}
          class="btn btn-primary waves-effect waves-light"
          disabled={loading}> {#if loading}<i class="bx bx-loader bx-spin font-size-16 align-middle mr-2"></i>{/if}
          {saveLabel}</button>
        {#if loading}
          <div class="spinner-grow text-secondary m-1" role="status">
            <span class="sr-only">Guardando...</span>
          </div>
        {/if}
        {#if cancelLabel != ""}
        <button
          on:click={cancel}
          class="btn btn-light waves-effect waves-light"
          disabled={loading}>
          {cancelLabel}</button>
        {/if}
      </div>
    </div>
  </div>
  <!-- end col -->
</div>
<!-- end row -->
{/if}

<style>
  .table th{
    @apply bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800;
  }
</style>