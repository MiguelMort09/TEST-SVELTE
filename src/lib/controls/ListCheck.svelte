<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';

	export let inlist = false;
	export let options: string[] = [];

	export let value:number[];
	export let component = '';
	export let field = '';

    if($$props.required && (value == undefined || value == null) && options.length > 0){
        value = [0];
    }
	function select(idx:number) {
		if(value == null || value == undefined){
			value = [];
		}
		if(value.includes(idx)){
			value.splice(value.indexOf(idx), 1);
		}else{
			value.push(idx);
		}
		value = value;
	}
</script>
{#if !inlist}
	<div class="flex flex-wrap gap-2">
		{#each options as op, i}
			<div class="flex -space-x-px">
				<button
				  type="button"
				on:click={() => {
					select(i);
				}}
				  class="tag rounded-md {value != undefined && value.includes(i)?' bg-primary/10 text-primary':' bg-slate-600/10 text-slate-600'} hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25"
				>
				{op}
				
				<div
					class="badge ml-2 {value != undefined && value.includes(i)?' bg-primary text-white shadow-lg shadow-primary/50':'badge ml-2  bg-slate-600 text-white'}">
					{#if value != undefined && value.includes(i)}
					<i transition:slide class="fas fa-check"></i>
					{:else}
					<i class="fas fa-minus"></i>
					{/if}
				</div>
				</button>
				
			  </div>
		{/each}
		
	</div>
{:else if value != null && value.length > 0}
	{#each value as v}
		{#if typeof options[v] !== 'undefined'}
			<span class="{component}-{field} {component}-{field}-{v}">{options[v]}</span> 
		{/if}
	{/each}
{:else}
	-
{/if}
