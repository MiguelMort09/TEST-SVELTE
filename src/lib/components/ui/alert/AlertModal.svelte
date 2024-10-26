<script lang="ts">
    export type ModalType = 'success' | 'error';

    export let modalType: ModalType;
    export let message: string;

    let showModal = false;

    export function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }
</script>

{#if showModal}
    <div class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/60"
         on:click={closeModal}>
        <div class="relative max-w-lg rounded-lg bg-white p-6 text-center"
             on:click|stopPropagation
        >
            <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="inline size-28 mb-4 {modalType === 'success' ? 'text-green-500' : 'text-red-500'}"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
            >
                {#if modalType === 'success'}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                {:else}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4m0 4h.01M10 8h4M4 6h16"/>
                {/if}
            </svg>

            <h2 class="text-2xl mb-2">
                {modalType === 'success' ? 'Success Message' : 'Error Message'}
            </h2>
            <p class="mb-4">{message}</p>
            <button on:click={closeModal} class="btn bg-blue-500 text-white hover:bg-blue-600">
                Close
            </button>
        </div>
    </div>
{/if}
