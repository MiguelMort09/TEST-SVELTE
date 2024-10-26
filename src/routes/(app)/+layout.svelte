<script>
	import '../../custom.css';
	import 'iconify-icon';
	import AppBar from './AppBar.svelte';
	import BottomLinks from './BottomLinks.svelte';
	import MainLinks from './MainLinks.svelte';
    import Sidebar from './Sidebar.svelte';
	import { user} from "$lib/user";

	let sidebar = false;

	function toggle() {
		sidebar = !sidebar;
	}
	
	function close() {
		sidebar = false;
	}
	
</script>

<!-- Page Wrapper -->
<div
	id="root"
	class="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900 {sidebar ? 'is-sidebar-open' : ''}"
>	
	{#if $user == null}
		<div
      class="app-preloader fixed z-50 grid h-full w-full place-content-center bg-slate-50 dark:bg-navy-900"
    >
      <div class="app-preloader-inner relative inline-block h-48 w-48"></div>
    </div>
	{:else}
	<!-- Sidebar -->
	<div class="sidebar print:hidden">
		<!-- Main Sidebar -->
		<div class="main-sidebar">
			<div
				class="flex h-full w-full flex-col items-center border-r border-slate-150 bg-white dark:border-navy-700 dark:bg-navy-800"
			>
				<!-- Application Logo -->
				<div class="flex pt-4">
					<a href="/">
						<img
							class="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
							src="/images/logo.png"
							alt="logo"
						/>
					</a>
				</div>

                <MainLinks on:click={close} />

				<BottomLinks />
			</div>
		</div>
        <Sidebar on:click={toggle} />
		
	</div>

	<AppBar on:click={toggle} />

    <!-- Mobile Search -->
	
    <!-- Right Sidebar -->
	

	<!-- Main Content Wrapper -->
	<main class="main-content w-full px-[var(--margin-x)] pb-8">
		<slot />
	</main>
	{/if}
</div>
