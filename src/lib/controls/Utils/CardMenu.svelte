<script lang="ts">
  import { createPopperLite as createPopper } from "@popperjs/core";
	import { onMount } from "svelte";
  import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

  interface IAction {
    id:string,
    name:string;
    action:()=>void;
  }
    export let actions:IAction[] = [];
    export let base:"none"|"duplicate"|"edit"|"crud" = "none";

    let isShowPopper = false;
    let button:HTMLElement;
    let tooltip:HTMLElement;
    onMount(() => {
        if(actions.length == 0 && base == "none") return;
        createPopper(button, tooltip,{placement: 'bottom-end'});
    });
    function doAction(action:string) {
      dispatch(action);
      isShowPopper = false;
    }
</script>
{#if actions.length > 0 || base != "none"}
<div class="inline-flex ">
    <button data-testid="card-menu-button"  bind:this={button} name="acciones" on:click={()=>{isShowPopper = !isShowPopper}} class="btn bg-transparent active:bg-white hover:text-primary h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
      </svg>
    </button>

    <div bind:this={tooltip} data-testid="card-menu" class="popper-root {isShowPopper?'show':''}">
      <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
        <ul>
          {#each actions as action}
          <li>
            <button on:click={()=>doAction(action.id)} class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">{action.name}</button>
          </li>
          {/each}
        </ul>
        {#if base != "none"}
        {#if actions.length > 0}
        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
        {/if}
        <ul>
          {#if base == "duplicate"}
            <li>
              <button on:click={()=>doAction("duplicate")} class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"><i class="fas fa-duplicate mr-2"></i> Duplicar</button>
            </li>
          {/if}
          {#if base == "edit"}
            <li>
              <button  on:click={()=>doAction("edit")} class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"><i class="fas fa-edit mr-2"></i> Editar</button>
            </li>
          {:else}
            <li>
              <button  on:click={()=>doAction("edit")} class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"><i class="fas fa-edit mr-2"></i> Editar</button>
            </li>
            <li>
              <button  on:click={()=>doAction("delete")} class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all text-red-400 hover:bg-slate-100 hover:text-red-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-red-600 dark:focus:text-navy-100"><i class="fas fa-trash mr-2"></i> Eliminar</button>
            </li>
          {/if}

        </ul>
        {/if}
      </div>
    </div>
  </div>
  {/if}