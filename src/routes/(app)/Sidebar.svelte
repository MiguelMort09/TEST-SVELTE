<script lang="ts">
    import { menuSide as menu } from "$lib/menu";

</script>
<!-- Sidebar Panel -->
<div class="sidebar-panel">
    <div
        class="flex h-full grow flex-col bg-white pl-[var(--main-sidebar-width)] dark:bg-navy-750"
    >
        <!-- Sidebar Panel Header -->
        <div class="flex h-18 w-full items-center justify-between pl-4 pr-1">
            <p class="text-base tracking-wider text-slate-800 dark:text-navy-100">Dashboards</p>
            <button
                class="sidebar-close btn h-7 w-7 rounded-full p-0 text-primary hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:text-accent-light/80 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 xl:hidden"
                on:click
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
        </div>

        <!-- Sidebar Panel Body -->
        <div class="nav-wrapper h-[calc(100%-4.5rem)] overflow-x-hidden pb-6" data-simplebar>
            <ul class="flex flex-1 flex-col px-4 font-inter">
                <li>
                    <a on:click
                        href="/"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Inicio
                    </a>
                </li>
                {#each $menu as m}
                    {#if "divider" in m}
                        <li><div class="my-3 mx-0 h-px bg-slate-200 dark:bg-navy-500" /></li>
                    {:else}
                        <li>
                            <a on:click
                                href={m.link}
                                data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                                data-active-class="font-medium text-primary dark:text-accent-light"
                                class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                            >
                                {m.name}
                            </a>
                        </li>
                    {/if}
                {/each}
                <!-- <li>
                    <a
                        href="dashboards-orders.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Orders
                    </a>
                </li> -->
            </ul>
            <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500" />
            <!-- <ul class="flex flex-1 flex-col px-4 font-inter">
                <li
                    class="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50"
                >
                    <button
                        class="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                    >
                        <span>Cryptocurrency</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-slate-400 transition-transform ease-in-out"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                    <ul class="ac-panel">
                        <li>
                            <a
                                href="dashboards-crypto-1.html"
                                class="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                                data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                                <div class="flex items-center space-x-2">
                                    <div class="h-1.5 w-1.5 rounded-full border border-current opacity-40" />
                                    <span>Cryptocurrency v1</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a
                                href="dashboards-crypto-2.html"
                                class="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                                data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                                <div class="flex items-center space-x-2">
                                    <div class="h-1.5 w-1.5 rounded-full border border-current opacity-40" />
                                    <span>Cryptocurrency v2</span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </li>
                <li
                    class="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50"
                >
                    <button
                        class="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                    >
                        <span>Banking</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-slate-400 transition-transform ease-in-out"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                    <ul class="ac-panel">
                        <li>
                            <a
                                href="dashboards-banking-1.html"
                                class="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                                data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                                <div class="flex items-center space-x-2">
                                    <div class="h-1.5 w-1.5 rounded-full border border-current opacity-40" />
                                    <span>Banking v1</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a
                                href="dashboards-banking-2.html"
                                class="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                                data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                                <div class="flex items-center space-x-2">
                                    <div class="h-1.5 w-1.5 rounded-full border border-current opacity-40" />
                                    <span>Banking v2</span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </li>

                <li>
                    <a
                        href="dashboards-personal.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Personal
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-cms-analytics.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        CMS Analytics
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-influencer.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Influencer
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-travel.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Travel
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-teacher.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Teacher
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-education.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Education
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-authors.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Authors
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-doctor.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Doctor
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-employees.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Employees
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-workspaces.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Workspaces
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-meetings.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Meetings
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-project-boards.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Project Boards
                    </a>
                </li>
            </ul> -->
            <!-- <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500" />
            <ul class="flex flex-1 flex-col px-4 font-inter">
                <li>
                    <a
                        href="dashboards-widget-ui.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Widget UI
                    </a>
                </li>
                <li>
                    <a
                        href="dashboards-widget-contacts.html"
                        data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                        data-active-class="font-medium text-primary dark:text-accent-light"
                        class="nav-link flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out"
                    >
                        Widget Contacts
                    </a>
                </li>
            </ul> -->
        </div>
    </div>
</div>