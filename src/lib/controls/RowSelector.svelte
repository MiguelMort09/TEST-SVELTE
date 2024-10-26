<script lang="ts">
	import { rowSelectorStore } from "$lib/Utils/RowSelectorStore";

    export let row: any = {};
    export let column:any ={};
    export let cell:any ={};
    export let id:string = cell.data?.id ?? "";

</script>
<div class="collection-control align-middle">
    <label class="inline-flex items-center space-x-2 col-md-8">
        <input bind:checked={$rowSelectorStore[id]} on:click={()=>{
            // console.log("click", id, cell);
            rowSelectorStore.toggle(id);
            }} class="form-checkbox is-basic h-5 w-5 rounded border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" />
    </label>
</div>