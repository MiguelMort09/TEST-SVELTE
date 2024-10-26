<script>
    import { page } from '$app/stores';
    import "../app.css";
    import "../custom.css";
</script>
<div class="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900">
<main class="grid w-full grow grid-cols-1 place-items-center bg-center" style="background-image: url(&quot;./images/illustrations/ufo-bg.svg&quot;);">
    <div class="max-w-[26rem] text-center">
      <div class="w-full">
        <img class="w-full" id="hero-image-light" src="/images/illustrations/ufo.svg" alt="ufo not found">
        <img class="w-full hidden" id="hero-image-dark" src="/images/illustrations/ufo-dark.svg" alt="ufo not found dark">
      </div>
      <p class="pt-4 text-7xl font-bold text-primary dark:text-accent">
        {$page.status}
      </p>
      <p class="pt-4 text-xl font-semibold text-slate-800 dark:text-navy-50">
        Oops. hubo un problema.
      </p>
      <p class="pt-2 text-slate-500 dark:text-navy-200">
        {$page.error?.message ?? ''}
      </p>

      <a href="/" class="btn mt-8 h-11 bg-primary text-base font-medium text-white hover:bg-primary-focus hover:shadow-lg hover:shadow-primary/50 focus:bg-primary-focus focus:shadow-lg focus:shadow-primary/50 active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:hover:shadow-accent/50 dark:focus:bg-accent-focus dark:focus:shadow-accent/50 dark:active:bg-accent/90">
        Ir al inicio
      </a>
    </div>
  </main>
</div>