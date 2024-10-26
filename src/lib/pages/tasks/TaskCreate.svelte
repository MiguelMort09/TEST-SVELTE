<script lang="ts">
    import {collection, doc, setDoc} from 'firebase/firestore';
    import {db, timenow} from '$lib/app';
    import {DateTime} from 'luxon';
    import CategorySearchList from "$lib/controls/CategorySearchList.svelte";
    import SubcategorySearchList from "$lib/controls/SubcategorySearchList.svelte";
    import DialogModal from "$lib/components/ui/modal/DialogModal.svelte";
    import type {CategoriesType} from "$lib/controls/types/categories";
    import type {SubcategoriesType} from "$lib/controls/types/subcategories";
    import type {TasksType} from "$lib/controls/types/tasks";
    import AlertModal from "$lib/components/ui/alert/AlertModal.svelte";


    export let onBack = (cancel?: boolean, data?: TasksType) => {
    }

    let uid: string = '';
    let category: CategoriesType;
    let subcategory: SubcategoriesType;
    let nameTask: string = '';
    let dueDate: string = '';

    let modalType: 'success' | 'error' = 'success'; // Valor por defecto
    let message: string = '';
    let alertModal: AlertModal;

    function triggerAlert(type: 'success' | 'error', msg: string) {
        modalType = type;
        message = msg;
        alertModal.openModal();
    }

    function handleSelectCategory(event: CustomEvent<CategoriesType>) {
        category = event.detail;
    }

    function handleSelectSubcategory(event: CustomEvent<SubcategoriesType>) {
        subcategory = event.detail;
    }

    function handleNameTask(event: Event) {
        nameTask = (event.target as HTMLInputElement).value;
    }

    function handleDueDateTask(event: Event) {
        dueDate = (event.target as HTMLInputElement).value;
    }

    async function createTask() {

        if (!nameTask || !dueDate) {
            triggerAlert("error", "Por favor, completa todos los campos.");
            return;
        }

        const values = {
            category,
            subcategory,
            name: nameTask,
            dueDate: DateTime.fromISO(dueDate).toJSDate(),
            added: timenow,
            createdBy: uid,
        };

        const newDoc = doc(collection(db, "tasks"));
        values.createdBy = uid;
        await setDoc(newDoc, values);

        onBack(false, {id: newDoc.id, ...values});

        triggerAlert("success", "La tarea se agrego correctamente");
    }
</script>

<div>
    <DialogModal
            buttonText="Agregar Tarea"
            cancelTextButton="Cancelar"
            confirmTextButton="Crear Tarea"
            on:confirm={createTask}
            title="Nueva Tarea"
    >
        <CategorySearchList bind:value={category} on:select={handleSelectCategory}/>
        <SubcategorySearchList bind:value={subcategory} on:select={handleSelectSubcategory}/>
        <input bind:value={nameTask} placeholder="Nombre de la tarea" type="text"/>
        <input bind:value={dueDate} placeholder="Fecha de entrega" type="date"/>
    </DialogModal>


    <AlertModal bind:this={alertModal} message={message} modalType={modalType}/>
</div>

