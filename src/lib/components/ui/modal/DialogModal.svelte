<script lang="ts">
    export let buttonText: string;
    export let cancelTextButton: string;
    export let confirmTextButton: string;
    export let title: string;

    let showModal: boolean = false;

    function toggleModal() {
        showModal = !showModal;
    }

    function handleConfirm() {
        // Emite el evento 'confirm' al confirmar la acción
        toggleModal();
        dispatch('confirm');
    }

    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();
</script>

<div>
    <button class="text-sm p-2 text-center font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg"
            on:click={toggleModal}>
        {buttonText}
    </button>

    {#if showModal}
        <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
             role="dialog">
            <div class="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
                <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                    <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                        {title}
                    </h3>
                    <button
                            on:click={toggleModal}
                            class="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                    >
                        <svg
                                class="size-4.5"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                    d="M6 18L18 6M6 6l12 12"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div class="px-4 py-4 sm:px-5">
                    <div class="mt-4 space-y-4">
                        <slot></slot>
                        <div class="space-x-2 text-right">
                            <button class="text-sm p-2 text-center font-semibold bg-white hover:bg-gray-200 rounded-lg shadow-lg"
                                    on:click={toggleModal}>
                                {cancelTextButton}
                            </button>

                            <button class="text-sm p-2 text-center font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded-lg shadow-lg"
                                    on:click={handleConfirm}>
                                {confirmTextButton}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
