<script lang="ts">
	import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card";
    import 'iconify-icon';
    export let value:string | undefined = undefined;
    export let required:boolean = false;
    export let id="";
    let search = "";
    let icons:string[] = [];
    $:search , getIcons();

    function getIcons() {
        if(search != "" && search.length > 2){
            ///search?query=
            fetch(`https://api.iconify.design/search?query=${search}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                icons = res.icons;
                
            })
        }
    }
</script>
<div class="flex relative">
    <HoverCard>
    <HoverCardTrigger class="outline outline-primary rounded-md p-2 flex justify-center items-center">
        
        {#if value != undefined && value != ""}
            <iconify-icon icon={value} class="text-2xl m-auto"></iconify-icon>
        {:else}
            Seleccionar
        {/if} 
        
    </HoverCardTrigger>
    <HoverCardContent side={"bottom"} class="bg-white">
        <input type="text" bind:value={search} />
        <hr class="my-3" />
        <div class="grid grid-cols-8 gap-2">
            {#each icons as icon}
                <button type="button" on:click={()=>{value = icon}}>
                    <iconify-icon icon={icon} class="w-6 h-6" ></iconify-icon>
                </button>
            {/each}
        </div>
    </HoverCardContent>
</HoverCard>
</div>