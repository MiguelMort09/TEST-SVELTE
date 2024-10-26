<script lang="ts">
  import {writable, type Unsubscriber } from 'svelte/store';
  import {doc, getDoc, collection, addDoc, setDoc, deleteField, updateDoc, orderBy, limit} from 'firebase/firestore';
  import {db, timenow} from '$lib/app';
  import { permissions} from "$lib/user";
  import type { TasksType } from '$lib/controls/types/tasks';
  import { TasksFromData, tasksGetAll, tasksGetNextOfField } from '$lib/controls/tasks';
  
  //import TitleBar from "$lib/base/TitleBar.svelte";
  import { onDestroy,onMount } from "svelte";
  import { page } from '$app/stores';
  import { goto, afterNavigate } from '$app/navigation';
  import { DateTime } from "luxon";
  import { numberFormat, decimalFormat } from '$lib/actions/numberFormat';
  import {validateFrom, type Validator} from "$lib/Utils/validator";
	
  import CategorySearchList from "$lib/controls/CategorySearchList.svelte"
import SubcategorySearchList from "$lib/controls/SubcategorySearchList.svelte"

 async function checkVisibles(){
		 console.log('checkVisibles');
	if(values != undefined && values.dueDate != undefined){ values.dueDate = DateTime.fromISO(values.dueDate).toJSDate(); delete values.dueDateTime; } 
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
  export let onBack = (cancel?:boolean, data?:TasksType)=> {
    // let defaultRoute = '/tasks';
    // goto(previousPage != undefined ? previousPage : defaultRoute);
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
      getDoc(doc(db, "tasks", tempId)).then(function(query) {
          if (query == null || query == undefined || query.data() == null) {
            //No data crear
            //pop();
          } else {
            exists = true;
            values = query.data();
            values.id = query.id;
            	if(values.dueDate != undefined){ values.dueDateTime = DateTime.fromJSDate(values.dueDate.toDate());
			values.dueDate= values.dueDateTime.toISODate(); }

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
        setDoc(doc(db, "tasks",tempId) , values).then(function () {

            loading = false;

            let data:TasksType|undefined = undefined;
            try{
              data = TasksFromData(tempId, values);
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
        updateDoc(doc(db, "tasks",tempId) , values).then(function() {
            loading = false;
            let data = TasksFromData(tempId!, values);
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
      let newDoc = doc(collection(db, "tasks"));
      let dId = newDoc.id;
      if(values.id != undefined){
        // if has a field named ID, use it
        dId = values.id;
      }

      setDoc(doc(db, "tasks",dId) , values).then(function () {

          loading = false;
          let data = TasksFromData(dId, values);
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
    let maxDocs = await tasksGetNextOfField( field);
    return maxDocs;
  }
</script>

<div class="page-content modal-body w-full max-w-2xl mx-auto ">
  <!-- <TitleBar title="Agregar Tarea" base="Inventario" /> -->
<form id="form" bind:this={form}>
  <div class="row">
    {#if viewTitle}
      <h4 class="card-title mt-4">Tarea</h4>
    {/if}
      
<div class="col-12">
	<div class="card">
<div class="card-body">

	<div class="form-group row"><label for="name" class="col-md-4 col-form-label">Nombre</label><div class="col-md-8 input-group flex-wrap"><input class="form-control name " type="text" bind:value={values.name} id="name"  required /></div> </div>

	<div class="form-group row"><div class="col-md-4"></div>
	<label class="inline-flex items-center space-x-2 col-md-8">
		<input bind:checked={values.completed}  class="form-checkbox is-basic h-5 w-5 rounded border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" />
	<span class="line-clamp-1">Completado</span>
	</label></div>
	<div class="form-group row"><label for="#select-category" class="col-md-4 col-form-label">Categoría</label>
	<div class="col-md-8"><CategorySearchList bind:value={values.category}  />
	</div> </div>

	<div class="form-group row"><label for="#select-subcategory" class="col-md-4 col-form-label">Subcategoría</label>
	<div class="col-md-8"><SubcategorySearchList bind:value={values.subcategory}  />
	</div> </div>

	<div class="form-group row"><label for="dueDate" class="col-md-4 col-form-label">Fecha Compromiso</label> <div class="col-md-8"> <input class="form-control" type="date" bind:value={values.dueDate} id="dueDate"  /> </div> </div>

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