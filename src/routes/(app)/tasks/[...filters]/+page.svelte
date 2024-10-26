<script lang="ts">
    import TasksList from "$lib/pages/tasks/TasksList.svelte";
    import type { TasksType } from "$lib/controls/types/tasks";
    import { page } from '$app/stores';

    export let data:any;
    let params = $page.params;
    

    let filter = (item:TasksType) => true;

    if(data != undefined || data.filter != undefined){
        filter = data.filter;
    }

    let filterName:string|undefined = params.field;
    let filterValue:string|undefined = params.value;
    if(params.filters != undefined && params.filters.length > 0){
        let farray = params.filters.split("/");
        //tempId = farray[0];
        if(farray.length > 1){
            filterName = farray[0];
            filterValue = farray[1];
        }
    }
</script>
<svelte:head>
    <title>Administración Tareas</title>
</svelte:head>
<div class="page-list page-list-tasks">
    <TasksList {filterName} {filterValue} {filter}  />
</div>