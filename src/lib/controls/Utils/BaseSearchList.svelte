<script lang="ts">
	import { onDestroy } from 'svelte';
	import Select from 'svelte-select';
	import swal from 'sweetalert';
	import type { Readable } from 'svelte/store';

	interface IOption {
		value: string;
		label: string;
		element: any;
	}

	export let value = '';
	export let inlist = false;
	export let onlyfields = false;
	export let collection: any[];
	export let fields: string[] = [];
	export let idField = 'id';
	export let nameField = 'name';
	export let excludeIds: string[] = [];
	export let allTag = 'Seleccionar ...';
	export let withStyle = true;
	export let onSelect: ((selected: any) => void) | null = null;
	export let canAdd = false;
	export let filter = (row: any) => {
		return true;
	};

	let name;
	let rows: IOption[];
	let allRows: unknown[];
	let valueObject: IOption;

	$: value, filter, updateSelect2();
	$: valueObject, handleSelect();

	function updateSelect2() {
		rows = [];
		// let found = false;
		if (allRows == undefined) {
			return;
		}
		for (let d = 0; d < allRows.length; d++) {
			const element = allRows[d];
			if (validElement(element)) {
				const el = element as any;
				const op = { value: el[idField], label: el[nameField], element: el };
				if (!excludeIds.includes(op.value) && filter(el)) {
					if (el[idField] == value) {
						valueObject = op;
					}
					rows.push(op);
				}
			}
		}
	}
	function validElement(element: unknown) {
		return (
			typeof element === 'object' && element !== null && idField in element && nameField in element
		);
	}
	function handleSelect() {
		if (valueObject == undefined || valueObject.value == undefined) {
			return;
		}
		//console.log(val);
		value = valueObject.value;
		if (onSelect != null && typeof onSelect === 'function') {
			allRows.forEach((element) => {
				if (validElement(element)) {
					const el = element as any;
					if (el[idField] == value) {
						if (onSelect != null) {
							onSelect(el);
						}
						//console.log(element);
					}
				}
			});
		}
	}

	function handleClear(event: any) {
		value = '';
	}
	$: collection, updateCollection();
	function updateCollection() {
		allRows = collection;
		updateSelect2();
	}

	function addOption() {
		swal({
			title: 'Añadir Nuevo',
			// content:"input",
			// showCancelButton: true,
			buttons: ['Cancelar', 'Guardar']
			// showLoaderOnConfirm: true,
			// confirmButtonColor: "#3b5de7",
			// cancelButtonColor: "#f46a6a",
			// preConfirm: function (name) {

			// },
			// allowOutsideClick: false
		}).then(function (name) {
			console.log(name);
			if (name != null) {
				var values = {
					name: name
				};

				// db.collection("template")
				//   .add(values)
				// addVideo_templates(values).then((rid)=>{
				//   value = rid;
				//   swal({
				// icon: 'success',
				// title: 'Registro grardado!',
				// html: 'Se agregó correctamente '// + name.value
				// })
				// });
			}
		});
	}
</script>

<div class={withStyle ? 'form-group' : ''}>
	{#if inlist}
		{#each rows as row}
			{#if row.value == value}
				{#if !onlyfields}
					{#if withStyle}
						<h5>{row.label}</h5>
					{:else}
						{row.label}
					{/if}
				{/if}
				{#each fields as field}
					{#if row.element[field] == undefined}
						{#if field == 'avatar'}
							<div class="avatar-md">
								<span class="avatar-title rounded-circle bg-soft-primary text-primary">
									{row.label.substring(0, 2)}
								</span>
							</div>
						{/if}
					{:else}
						<p>{row.element[field]}</p>
					{/if}
				{/each}
			{/if}
		{/each}
	{:else}
		<Select items={rows} bind:value={valueObject} on:clear={handleClear} placeholder={allTag} />
		<!-- <select id="select-template{baseId}" bind:value={value} class="form-control select2"  >
                          <option value="">{allTag}</option>
                            {#each rows as row}
                              {#if !excludeIds.includes(row.id) && filter(row)}
                                <option value={row.id} selected={row.id == value}>{row.name}</option>
                              {/if}
                            {/each}
                      </select> -->
		{#if canAdd}
			<button
				type="button"
				class="btn btn-outline-secondary waves-effect waves-light"
				on:click={addOption}
			>
				<i class="bx bx-plus font-size-16 align-middle mr-2" /> Agregar
			</button>
		{/if}
	{/if}
</div>
