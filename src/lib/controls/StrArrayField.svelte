<script lang="ts">
    import { slide } from 'svelte/transition';
    export let value:string[] = [];
    export let id = "";
    let txt = "";
    let toEdit = -1;
    let valEdit = "";

    $:value, checkValue();
    function checkValue(){
        if(value == undefined){
            value = [];
        }
        typeof value == "string" ? value = [value] : value = value;
    }

    function onAdd(){
        if(txt != "" || txt != undefined){
            if(value == undefined){
                value = [];
            }
            console.log("val",value);
            value.push(txt);
            value = value;
            txt = "";
        }
        
    }
    function onRemove(idx:number){
        if(value != undefined){
        value.splice(idx,1);
        value = value;
      }
      
    }
    function onSave(idx:number){
        value[idx] = valEdit;
        toEdit = -1;
        valEdit = "";
    }
    function onCancel(idx:number){
        toEdit = -1;
        valEdit = "";
    }
    function moveUp(idx:number){
        //console.log(idx);
        value = array_move(value, idx, idx-1);
    }
    function moveDown(idx:number){
        //console.log(idx);
        value = array_move(value, idx, idx+1);
    }
    function array_move(arr:string[], old_index:number, new_index:number) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push("");
                //console.error("not implemented");
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    }

    function setEdit(idx:number, val:string){
        toEdit = idx;
        valEdit = val;
    }
    function onEnter(event:any, callback:Function){
        if(event.key == "Enter"){
            callback();
        }
        //console.log(event.key);
    }
</script>
<div class=" flex">
<input {id} type="text" class="listadd flex-1 m-0 shadow-sm" bind:value={txt} on:keydown={(ev)=>onEnter(ev, onAdd)}/><button type="button" class="btn h-10 rounded-l-none bg-primary font-black text-sm text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90" on:click={onAdd}><i class="fas fa-plus text-sm"></i></button>
</div>
{#if value != undefined && value.length > 0}
<ul class=" text-sm border bg-slate-100 border-coolGray-300 rounded-b-md mx-2 border-t-0">
    {#each value as v, idx (v+idx)}
    <li class="flex p-2 content-center border-b-slate-300 border-b" transition:slide>
        
        
        {#if toEdit == idx}
        <input class="flex-1 leading-relaxed mr-2" type="text" bind:value={valEdit} on:keydown={(ev)=>onEnter(ev, ()=>onSave(idx))} /> 
        <button type="button" class="btn btn-primary " on:click={()=>onSave(idx)}><i class="fas fa-save text-sm opacity-75"></i></button>
        <button type="button" class="btn btn-outline-error " on:click={()=>onCancel(idx)}><i class="fas fa-times text-sm opacity-75"></i></button>
        {:else}
        <div class="grid grid-cols-1 pr-2 text-slate-400">
            {#if idx != 0}
            <button type="button" on:click={()=>moveUp(idx)}><i class="fas fa-arrow-up text-sm opacity-75"></i></button>
            {/if}
            {#if idx != value.length -1}
            <button type="button" on:click={()=>moveDown(idx)}><i class="fas fa-arrow-down text-sm opacity-75"></i></button>
            {/if}
        </div>
        <div class="flex-1 leading-relaxed" on:click={()=>setEdit(idx, v)}>{v}</div> 
        <button type="button" class="btn btn-outline " on:click={()=>onRemove(idx)}><i class="fas fa-minus text-sm opacity-75"></i></button>
        {/if}
    </li>
    {/each}
</ul>
{/if}
