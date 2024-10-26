<script lang="ts">
    import SubcategoriesList from "$lib/pages/subcategories/SubcategoriesList.svelte";
    import type { SubcategoriesType } from "$lib/controls/types/subcategories";
    import { page } from '$app/stores';

    export let data:any;
    let params = $page.params;
    

    let filter = (item:SubcategoriesType) => true;

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
    <title>Administración Subcategorias</title>
</svelte:head>
<div class="page-list page-list-subcategories">
    <SubcategoriesList {filterName} {filterValue} {filter}  />
</div>