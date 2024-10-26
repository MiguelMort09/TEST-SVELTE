<script lang="ts">
	import { slide } from 'svelte/transition';

	export let inlist = false;
	export let options: string[] = [];
	export let field = "";

	export let view:'default'|'radio' = 'default';
	export let value:number;
	export let prefix = '';

	let open = false;
	let color = '';
    if($$props.required && (value == undefined || value == null) && options.length > 0){
        value = 0;
    }
	function select(idx:number) {
		value = idx;
		open = false;
	}
</script>
{#if view == 'radio'}
	<div class="flex gap-4 mb-4 flex-wrap">
		{#each options as op, i}
			<label class="inline-flex items-center space-x-2">
				<input
					bind:group={value}
					id="{prefix}radio{i}"
					value={i}
					class="form-radio is-basic checked:bg-primary checked:!border-primary hover:border-primary focus:!border-primary dark:border-navy-500 dark:bg-navy-900"
					name="{prefix}radio{i}"
					type="radio"
				/>
				<p>{op}</p>
			</label>
		{/each}
	</div>
	<hr />
{:else if !inlist}
	<div class="grid grid-cols-1 select-{field}">
		<button
			type="button"
			class="inline-flex btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
			
			on:click={() => {
				open = !open;
			}}
		>
			<span>
				{#if value != null && typeof options[value] !== 'undefined'}{options[
						value
					]}{:else}Seleccionar{/if}</span
			>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4 transition-transform duration-200 {open ? 'rotate-180' : ''}"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
		{#if open}
			<div transition:slide={{ duration: 400 }}>
				<div
					class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700"
				>
					<ul>
						{#each options as op, i}
							<li class="select-{field}-option-{i}">
								<button type="button"
									class="flex min-h-8 py-2 text-left items-center px-3 pr-8 font-medium tracking-wide outline-none w-full transition-all hover:bg-primary hover:text-white focus:bg-primary focus:text-white dark:hover:bg-accent dark:focus:bg-accent"
									on:click={function () {
										select(i);
									}}>{op}</button
								>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	</div>
{:else if value != null && typeof options[value] !== 'undefined'}
	{options[value]}
{:else}
	-
{/if}
