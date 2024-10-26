<script lang="ts">
    import 'iconify-icon';

    export let value: number|undefined = undefined;
    export let visible = true;
    export let view:""|"money"|"percent" = "";
    export let onChangeValue: (value:number) => void = (value:number)=>{};
    export let classList = "";

     let pre="";
     let post="";
     let editMode = false;
     let newValue = value;

     if(view == "money"){
            pre = "$";
     }
     if(view == "percent"){
            post = "%";
     }
     

     function onChange() {
        if(newValue == undefined || newValue == value){
            editMode = false;
            return;
        }
        onChangeValue(newValue);
        editMode = false;
    }

        
</script>
{#if visible}
<div class="group flex flex-row items-center gap-1">
    {#if editMode}
        <input type="number" bind:value={newValue} class="grow" />
        <button type="button" on:click={()=>{onChange()}}><iconify-icon icon="lets-icons:save-duotone" class="text-xl text-success"  /></button>
        <button type="button" on:click={()=>editMode=false}><iconify-icon icon="iconoir:cancel" class="text-xl text-red-400"  /></button>
    {:else}
        <div class="{classList} flex flex-row gap-2 items-center"><span>{pre} {value?.toLocaleString("es-MX") ?? "-"} {post}</span><button type="button" on:click={()=>{newValue=value; editMode=true}}><iconify-icon icon="line-md:edit-twotone" class="text-xl hidden group-hover:block" /></button></div>
    {/if}
</div>
{/if}