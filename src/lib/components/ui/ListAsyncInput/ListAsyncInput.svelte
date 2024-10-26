<script lang="ts">
    import {doc, setDoc} from 'firebase/firestore';
    import {db} from '$lib/app';
    import 'iconify-icon';

     export let cell: any|undefined = undefined;
     export let row: any|undefined = undefined;
    export let column: any|undefined = undefined;
     export let subcolLink: string = "";
    export let node: string = "";
    export let field: string = "";
    export let id: string|undefined = undefined;
    export let value: number|undefined = undefined;
    export let visible = true;

     let pre="";
     let editMode = false;
     let newValue = value;

     if(cell?.data?._render == "money"){
            pre = "$";
     }
     if(cell?.data != undefined){
        if(cell?.data._node != undefined) {
            node = cell.data._node;
            
        }
        if(cell?.data._subcol != undefined) {
            subcolLink = cell.data._subcol;
        }
        if(cell?.data._field != undefined) {
            field = cell.data._field;
        }
        
        if(cell?.data.id != undefined) {
            id = cell.data.id;
        }
        if(cell?.data?._visible != undefined) {
            visible = cell.data._visible;
        }
        if(cell?.data[field] != undefined) {
            value = cell.data[field];
        }

        // console.log("cell",cell.data.id, id);
    }

     function onChange() {
        if(newValue == undefined || newValue == value){
            editMode = false;
            return;
        }
            if(id == undefined || field == ""){
                console.log("no id or field", id, field, subcolLink);
                return;
            }
            
            // console.log("update",subcolLink, id, field, newVal);
            let update:any = {};
            update[field] = newValue;
            setDoc(doc(db,subcolLink+node, id),update, {merge:true});
        }

        
</script>
{#if visible}
<div class="group">
    {#if editMode}
        <input type="number" bind:value={newValue} />
        <button type="button" on:click={()=>{onChange()}}><iconify-icon icon="lets-icons:save-duotone" class="text-xl text-success"  /></button>
        <button type="button" on:click={()=>editMode=false}><iconify-icon icon="iconoir:cancel" class="text-xl text-red-400"  /></button>
    {:else}
        {pre} {value?.toLocaleString("es-MX") ?? "-"} <button type="button" on:click={()=>{newValue=value; editMode=true}}><iconify-icon icon="line-md:edit-twotone" class="text-xl hidden group-hover:block"  /></button>
    {/if}
</div>
{/if}