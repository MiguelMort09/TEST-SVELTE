<script lang="ts">
    import TasksEdit from "$lib/pages/tasks/TasksEdit.svelte";
    import { page } from '$app/stores';

    let params = $page.params;
    let filterName:string|undefined = undefined;
    let filterValue:string|undefined = undefined;
    let tempId:string|null = null;
    let values:any = {};

    const storedProvider = localStorage?.getItem('temp-tasks-values');
    if (storedProvider) {
        values = JSON.parse(storedProvider);
        localStorage.removeItem('temp-tasks-values');
    }

    

    if(params.filters != undefined){
        let farray = params.filters.split("/");
        if(farray.length == 1 && farray[0] != ""){
            tempId = farray[0];
        }else if(farray.length >= 2){
            for (let p = 0; p < farray.length; p++) {
                const element = farray[p];
                if(p == 0){
                    filterName = farray[0];
                    filterValue = farray[1];
                }else if(p%2 == 0 && farray[p+1] != undefined && farray[p+1] != ""){
                    values[element]=farray[p+1];
                }
            }
        
        }
    }

    if(filterName != undefined && filterValue != undefined){
        //console.log("filter : "+filterName+" == "+filterValue)
        values[filterName] = filterValue;
    }
</script>
<svelte:head>
    <title>Detalle Tarea</title>
</svelte:head>
<TasksEdit {tempId} {filterName} {filterValue} values={values}  />