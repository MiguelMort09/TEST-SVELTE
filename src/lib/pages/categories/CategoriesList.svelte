<script lang="ts">
    import Grid from "gridjs-svelte";
    import {html, h} from "gridjs";
    import { esES } from "gridjs/l10n";
    import {SvelteWrapper} from "gridjs-svelte/plugins";
    import 'iconify-icon';
    import { DateTime } from "luxon";
    import {timeFormated, timeToAgo} from '$lib/Utils/display';
    import * as ExcelJS from 'exceljs';
    import saveAs from 'file-saver';
    import { onMount, onDestroy , tick} from 'svelte';
    import swal from 'sweetalert';
    import FilterName from '$lib/base/FilterName.svelte';
    import { permissions, profile} from "$lib/user";
    import { page } from '$app/stores';
    import {doc, getDoc, addDoc, collection, query, onSnapshot , orderBy, deleteDoc, setDoc, Timestamp, where} from 'firebase/firestore';
    import type {Query, CollectionReference} from 'firebase/firestore';
    import {db} from '$lib/app';
    import { goto } from '$app/navigation';
    import { transformData } from "$lib/trasnform";
    import ViewMore from '$lib/components/ui/text/ViewMore.svelte';
    import type { CategoriesType } from '$lib/controls/types/categories';
    import { CategoriesSchema } from '$lib/controls/types/categories';
    import { deleteCategories, duplicateCategories, CategoriesFromData } from '$lib/controls/categories';
    
    //import CategoriesEdit from "./CategoriesEdit.svelte";

    
    
    let params = $page.params;
    export let modal = false;
    //array [0 = doc field, 1=profile field]
    export let profileFilter:string[]|null = null;
    export let hasAdd = true;
    export let hasEdit = true;
    export let hasActions = true;
    export let title="Administración Categorías";
    export let filterName:string|undefined = undefined;
    export let filterValue:string|undefined = undefined;
    export let filters:{[key:string]:(item:CategoriesType)=>boolean} = {};
    
    
    
    
    let categories:CategoriesType[] = [];
    let filteredCategories:CategoriesType[] = [];
    let filterValues:{[key:string]:any} = {};
    let grid:Grid;
    
    $: filters, categories, filterData();
    function filterData(){
        let filtered:CategoriesType[] = [];
        if(Object.keys(filters).length == 0){
            filtered = categories;
        }else{
            filtered = categories.filter((item) => {
                for (const key in filters) {
                    if (!filters[key](item)) {
                        return false;
                    }
                }
                return true;
            });
        }
        filteredCategories = filtered;
        if(grid != undefined){
            grid.updateConfig({data:filteredCategories});
        }
    }
    
    let columns:any = [];
    let unsubscribe:Function|undefined;
    let unsubscribeProfile:Function|undefined;
    let loading = true;
    let showModal = false;
    let canView = false;

    let editData = {field:filterName, value:filterValue,bid:undefined};
    let subcolLink = "";
    let parentLink = "";

    	let columnCount = 3;


    onMount(()=>{

    });

    onDestroy(() => {
		if(unsubscribe != null && unsubscribe != undefined){
            unsubscribe();
            unsubscribe = undefined;
        }
	});

    if(profileFilter != null){
        unsubscribeProfile = profile.subscribe((value:any) => {
            if(value == undefined && !$permissions.admin){
                console.log("no profile");
                return;
            }
            if(!$permissions.admin && !$permissions.categories){
                console.log("not admin",value);

                filterName = profileFilter![0];
                let pf = profileFilter![1];
                filterValue = value != undefined && pf != undefined ? (value[pf] ?? ''):'';
            }
            // else{
            //     hasEdit = true;
            // }
            loadFirebaseData();
        });
    }else{
        loadFirebaseData();
    }
    function loadData(){
        //if(!loadDataTable){
            columns = [
				{ id: 'order', name:"Orden",width:"auto", formatter: function (data:any) {
                    return ''+(data != undefined?data:'');
                }, },

				{ id: 'name', name:'Nombre',width:"auto", formatter: function (data:any, type:any, row:any, meta:any) {
					var id = "";
                    if(row != undefined) id = row.id;
					if(type.cells != undefined){
						id = type.cells[type.cells.length-1].data;
					}
					if(data != undefined && data.length > 90){
						data = data.substring(0,90)+"...";
					}
                    return html('<a href="/categories/edit/'+id+'">'+data+'</a>');
                }, },
			{ id: 'id', sort:false, hidden:!hasActions, name:'Acciones', formatter: function (data:any, type:any, row:any, meta:any) {
					
					let buttons = [];
					
					if(hasEdit){
						if(modal){
							buttons.push(h('button', {
										className:"btn btn-light h-10",
								onClick: () => setEditId(data)
							}, html('<iconify-icon icon="uil:edit" class="text-lg align-middle"></iconify-icon>')));
						}else{
							buttons.push(html('<a href="/categories/edit/'+data+'" class="btn btn-light waves-effect h-10"><iconify-icon icon="uil:edit" class="text-lg align-middle"></iconify-icon></a>'));
						}
					}
					
					buttons.push(h('button', {
						className:"btn btn-outline-danger h-10",
							onClick: () => deleteCategories( data)
						}, html('<iconify-icon icon="mi:delete" class="text-lg align-middle"></iconify-icon>')));
		
					return h('div',{className:"flex button-bar"}, buttons);;
				}, },
];
            return;
        //}
        
    }
	function loadFirebaseData(){
        let collRef:CollectionReference|Query  = collection(db,subcolLink + "categories");
        if(filterName != undefined && filterValue != undefined){
            console.log("filter : "+filterName+" == "+filterValue)
            collRef = query(collRef,where(filterName,"==",filterValue));
        }else{
            collRef = query(collRef,orderBy('added','desc'));
        }
        
        unsubscribe = onSnapshot(collRef, async (querySnapshot) => {
            canView = true;
            const tmp:CategoriesType[] = [];
            
            for (let d = 0; d < querySnapshot.docs.length; d++) {
                const tempcategories = CategoriesFromData(querySnapshot.docs[d].id, querySnapshot.docs[d].data());

                if(tempcategories == undefined){
                    continue;
                }
                
                
                const element =tempcategories;

                tmp.push(element);
            };

            

            loading = false;
            categories = tmp;
            
            if(columns.length == 0){
                
                loadData();
            }
            
            
        }, (error) => {
            loading = false;
                if(error.code == "permission-denied"){
                    canView = false;
                    swal("Error", "No tiene permisos para ver esta información", "error");
                    return;
                }
                console.log("Error getting documents: ", error.code);
            });
    }
    

function setEditId(eId:string|undefined) {
    // editData = {field:filterName, value:filterValue,bid:eId};
    showModal = true;
    
    
}

function asyncChange(id:string, field:string, newval:any){
    
    var update:any = {};
    update[field] = newval;
    setDoc(doc(db,subcolLink + "categories", id),update, {merge:true});
}


async function runFunction(fid:string, params:any){
    //   import { fun } from '$lib/callable';
    let fun = (await import ('$lib/callable')).fun;
    if(typeof fun[fid] ==='function'){ 
        loading = true;
        fun[fid](params).then((result:any) => {
            // Read result of the Cloud Function.
            var sanitizedMessage = result.data.text;
            loading = false;
        })
        .catch((error:any) => {
        loading = false;
            // Getting the Error details.
            var code = error.code;
            var message = error.message;
            var details = error.details;
            swal({
                        title: "Error",
                        text: message,
                        icon: "warning"
                    });
        });;
    }
}


interface Column {
  property: string;
  title: string;
  format?: (row: CategoriesType) => any;
}

function downloadExcel(){
    let cols:Column[] = [
        {property:"id",title:"id"},
        		{title: 'Orden', property: 'order', },
		{title: 'Nombre', property: 'name', },

        {property:"added",title:"Fecha de Creación",format:(row:CategoriesType) => {
            if(row.added?.toDate != undefined) {
                return row.added.toDate();
            }
            return row.added;
        }},
    ];
    createAndDownloadExcel(categories, cols);
}


async function createAndDownloadExcel<CategoriesType>(tmp: CategoriesType[], cols: Column[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Categorías');

    // Define columns in worksheet
    worksheet.columns = cols.map(column => ({ header: column.title, key: column.property }));
    
    for (let d = 0; d < tmp.length; d++) {
        const tempcategories = tmp[d];
        
        tmp[d] = tempcategories;
    }
    

    // Add rows to worksheet
    tmp.forEach(item => {
        const row = cols.map(column => getProperty(item, column.property, column.format));
        worksheet.addRow(row);
    });

    // // Write buffer and save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Categorías.xlsx');
}
function getProperty(obj:any, prop:string, format?: (row: any) => any){
    const hasProp = Object.prototype.hasOwnProperty.call(obj, prop);
    if( hasProp){
        let res = transformData("excel", prop, obj[prop]);
        if(format != undefined){
            return format(obj);
        }
        return res;
    }
    return "";
}
</script>
<div class="page-content">
    
    <!-- <TitleBar title="Categorías" base="Inventario" /> -->
    <h4 class="card-title mt-6 flex gap-2 items-center">
        {#if parentLink != ""}
            <a class="btn h-9 w-9 rounded-full bg-slate-150 p-0 font-medium text-slate-500 hover:text-primary hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-200/50 focus:bg-slate-200 focus:shadow-lg focus:shadow-slate-200/50 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:hover:shadow-navy-450/50 dark:focus:bg-navy-450 dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90" 
            href={parentLink}><iconify-icon icon="system-uicons:chevron-left" class="text-4xl"></iconify-icon></a>
        {/if}
        {title}
        
    </h4>
    <div class="row">
        
    </div>
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <div class="row">
                    {#if hasAdd}
                        {#if loading}
                            <div
                                class="alert flex space-x-2 rounded-lg border border-primary px-4 py-4 text-primary"
                            >
                                
                                <p>Cargando datos ...</p>
                            </div>
                        {:else if canView}
                            <div class="flex gap-2">
                                <div class="flex flex-col grow">
                                    {#if filterName != undefined && filterValue != undefined}
                                        <FilterName node={profileFilter != null? profileFilter[1]:filterName} value={filterValue} />
                                    {/if}
                                </div>
                                <div class="flex">
                                    <button type="button" class="btn h-10 group rounded-none rounded-l-lg" on:click={downloadExcel}><iconify-icon
                                        icon="ri:file-excel-2-line" class="md:mr-2 text-lg text-green-800 group-hover:text-white"
                                    ></iconify-icon> <span class="hidden md:block">Excel</span></button>
                                    {#if modal}
                                    <button type="button" class="btn btn-primary h-10 rounded-none rounded-r-lg " on:click={()=>{ setEditId(undefined);}}> Agregar Categoría</button>
                                    {:else}
                                    <button on:click={function() { 
                                        let s = subcolLink.replace(/\/$/, ''); 
                                        if(filterName != undefined && filterValue != undefined){
                                            goto(s+'/categories/edit/'+filterName+'/'+filterValue+"/");
                                        }else{
                                            goto(s+'/categories/edit/');
                                        }
                                        
                                    }} class="btn btn-add-record h-10 rounded-none rounded-r-lg ">
                                        <iconify-icon
                                        icon="ic:round-add" class="md:mr-2 text-xl"
                                    ></iconify-icon> <span class="hidden md:block">Agregar Categoría</span></button>
                                    {/if}
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <div class="flex flex-col grow">
                                    
                                </div>
                            </div>
                        {:else}
                            <div
                                class="alert flex space-x-2 rounded-lg border border-error px-4 py-4 text-error"
                            >
                            <iconify-icon icon="mdi:alert-circle" class="text-xl"></iconify-icon>
                                <p>No tiene permisos para ver estos datos</p>
                            </div>
                        {/if}
                    {/if}
                </div>
            
            
                <Grid bind:instance={grid} data={filteredCategories} language={esES} columns={columns} search={canView} sort pagination={{enabled:true,limit:20}} autoWidth={true} style={{table: { 
                    'min-width': columns.length*180+'px'
                }}} />
            
                <div class="row">
                    
                </div>

            </div>
        </div>
    </div>
    <!-- end col -->
</div>
<!-- end row -->
</div>