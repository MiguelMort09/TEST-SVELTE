<script lang="ts">
    import {DateTime} from "luxon";

    export let task: { name: string; completed: boolean; dueDate: undefined };

    const isDateInFuture = (date: Date | DateTime | string | undefined): boolean => {
        if (!date) return false;

        const dateTime = (date instanceof Date)
            ? DateTime.fromJSDate(date)
            : typeof date === 'string'
                ? DateTime.fromISO(date)
                : date;

        return dateTime > DateTime.now();
    };

    const formatDateForList = (date: Date | DateTime | string | undefined): string => {
        if (!date) return "Sin fecha";
        const dateTime = (date instanceof Date)
            ? DateTime.fromJSDate(date)
            : typeof date === 'string'
                ? DateTime.fromISO(date)
                : date;

        return dateTime.toFormat("dd LLL yyyy, hh:mm a");
    };
</script>
<li class="px-4 py-1">
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
            {#if task.completed}
                <div class="p-2 bg-green-600 rounded-full"></div>
            {:else}
                {#if isDateInFuture(task.dueDate)}
                    <div class="p-2 bg-white rounded-full border border-black"></div>
                {:else}
                    <div class="p-2 bg-red-600 rounded-full"></div>
                {/if}
            {/if}
            <div>{task.name}</div>
        </div>
        <div>{formatDateForList(task.dueDate)}</div>
    </div>
</li>