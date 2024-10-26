<script lang="ts">
    import * as Popover from "$lib/components/ui/popover";
    import {doc, setDoc} from 'firebase/firestore';
    import {db} from '$lib/app';
    export let list: string[] = [];
    export let cell: any|undefined = undefined;
    export let row: any|undefined = undefined;
    export let column: any|undefined = undefined;
    
    export let subcolLink: string = "";
    export let node: string = "";
    export let field: string = "";
    export let id: string|undefined = undefined;
    export let value: number|undefined = undefined;
    export let onChange: ((newVal: number) => void) | undefined = undefined;
    
    
    // let subcolLink = subcol.join("/");

    let popoverOpen = false;
    $: cell?.data, valFromCell();
    if(cell?.data != undefined){
        // if is not undefined and is a string[] then assign it to list
        if(cell?.data._list != undefined && Array.isArray(cell.data._list)) {
            list = cell.data._list;
        }
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
        if(cell?.data[field] != undefined) {
            value = cell.data[field];
        }
        // console.log("cell",cell.data.id, id);
    }
    if(onChange == undefined) {
        onChange = (newVal: number) => {
            if(id == undefined || field == "" || subcolLink == ""){
                console.log("no id or field or subcolLink", id, field, subcolLink);
                return;
            }
            
            console.log("update",subcolLink,node, id, field, newVal);
            let update:any = {};
            update[field] = newVal;
            setDoc(doc(db,subcolLink+node, id),update, {merge:true});
        }
    }
    
    function valFromCell(){
        if(cell?.data != undefined && cell.data[field]){
            value = cell.data[field];
        }
    }
    function setNewValue(newValue: number) {
        
        popoverOpen = false;
        if(cell?.data != undefined) {
            cell.data[cell.data._field] = newValue;
        }
       
        value = newValue;
        onChange?.(newValue);
    }


  </script>
   
  <Popover.Root bind:open={popoverOpen}>
    <Popover.Trigger class="trigger"><span class="{node}-{field} {node}-{field}-{value}">{value != undefined && list[value] != undefined ? list[value]:"-"}</span></Popover.Trigger>
    <Popover.Content class="p-0">
        <div role="listbox" class="async-edit card bg-white dark:bg-slate-700 flex flex-col gap-2">
            {#each list as item,idx}
            <button on:click={()=>setNewValue(idx)} class="{node}-{field} {node}-{field}-{idx}">{item}</button>
            {/each}
        </div>
    </Popover.Content>
  </Popover.Root>