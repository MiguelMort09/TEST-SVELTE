<script lang="ts">
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { privacyLink, singInMethods, termsLink } from "$lib/app";
    import { createAuth, user } from "$lib/user";
	import { zchema } from "$lib/zchema";
	import { onDestroy } from "svelte";
	import { slide } from "svelte/transition";
  import 'iconify-icon';


    export let redirectAfterLogin:string = '';
    export let loginPage:string = '/login';
    export let view:"login"|"forgot"|"singup" = "login";
    export let register = false;

    let email = "";
    let password = "";
    let error = "";
    let code = false;
    let emailCode = "";
    console.log("storeUser", redirectAfterLogin);
    let storeUser:typeof user;
    console.log("redirectAfterLogin", redirectAfterLogin);
    if(redirectAfterLogin == ''){
      storeUser = user;
    }else{
      storeUser = createAuth(loginPage);
    }

    let zuser = zchema.object({
        email: zchema.string().email(),
        password: zchema.string().min(6),
    });

    function login() {
        if(!parseData()){
          return;
        }
        storeUser.signInEmail(email, password).catch((reason:any)=>{
              error = reason.message;
              // auth/invalid-email
              // Thrown if the email address is not valid.
              if(reason.code == "auth/invalid-email"){
                error = "Correo inválido";
              }
              // auth/user-disabled
              // Thrown if the user corresponding to the given email has been disabled.
              if(reason.code == "auth/user-disabled"){
                error = "Usuario deshabilitado"
              }
              // auth/user-not-found
              // Thrown if there is no user corresponding to the given email.
              if(reason.code == "auth/user-not-found"){
                error = "Usuario no encontrado"
              }
              // auth/wrong-password
              if(reason.code == "auth/wrong-password"){
                error = "Password inválido"
              }

            });
          
        
    }

    function parseData() {
        error = "";
        let result = zuser.safeParse({ email, password });
        if (result.success) {
          return true;
        } 

        error= result.error.issues.map((e) => e.message).join(",");;
        return false;
      
    }

    function googleLogin() {
      error = "";
      storeUser.signInWith("google");
    }
    function facebookLogin() {
      error = "";
      storeUser.signInWith("facebook");
    }

    function forgot() {
      error = "";
      code = false;
      emailCode = "";
      let emailSchema = zchema.string().email();
      if(!emailSchema.safeParse(email).success){
        error = "Correo inválido";
        
        return;
      }
      storeUser.resetPassword(email).then(()=>{
          password = "";
          emailCode = "";
          code = true;
          error = "Se ha enviado un correo para restablecer tu contraseña";
          view = "login";
        }).catch((reason:any)=>{
          error = reason.message;
        });
      
      
    }
    function changePassword(){
      error = "";
      let passwordSchema = zchema.string().min(6);
      if(!passwordSchema.safeParse(password).success){
        error = "Contraseña inválida";
        return;
      }
      if(emailCode == ""){
        error = "Código inválido";
        return;
      }
      storeUser.resetPasswordConfirm(emailCode, password).then(()=>{
        error = "Contraseña cambiada";
        view = "login";
      }).catch((reason:any)=>{
        error = reason.message;
      });
    }
    function create(){
      if(!parseData()){
          return;
        }
        console.log("create", email, password);
          storeUser.createUserWithEmailAndPassword(email, password)
        .catch((fberror) => {
          // const errorCode = error.code;
          console.log("error", fberror.code );
          if(fberror.code == "auth/email-already-in-use"){
            error = "Correo ya registrado";
            console.log("error", error );
            return;
          }
          
          const errorMessage = fberror.message;
          error = errorMessage;
          
          
          // ..
        });
        
    }
    
    let listenUser = storeUser.subscribe((u)=>{
      console.log("login user", u);
      if(u != null){
        console.log("> redirectAfterLogin", redirectAfterLogin);
        if(redirectAfterLogin == ''){
            let to = $page.url.searchParams.get('to');
            if(to != null){
              goto(to);
            }else{
              goto(base+"/");
            }
        }else{
          goto(redirectAfterLogin);
        }
      }
    });
    onDestroy(()=>{
      listenUser();
    });
</script>
<svelte:head>
  <title>Inicio de sesión al sistema</title>
</svelte:head>
<!-- Page Wrapper -->
<div
id="root"
class="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900"
>
<!-- Main Content Wrapper -->
<main class="grid w-full grow grid-cols-1 place-items-center">
  <div class="w-full max-w-md p-4 sm:px-5">
    <div class="text-center">
      <img
        class="mx-auto h-16 w-16"
        src="/images/logo.png"
        alt="logo"
      />
      <div class="mt-4">
        <h2
          class="text-2xl font-semibold text-slate-600 dark:text-navy-100"
        >
          Bienvenido
        </h2>
        <p class="text-slate-400 dark:text-navy-300">
         Favor de iniciar sesión para continuar
        </p>
        
      </div>
      
    </div>
    <div class="card mt-5 rounded-lg p-5 lg:p-7">
      {#if error != ""}
        <p class="text-red-600 dark:text-red-300 mb-4" in:slide>
          {error}
         </p>
         {/if}
         {#if singInMethods.email}
      <label class="block">
        <span>Correo:</span>
        <span class="relative mt-1.5 flex">
          <input
          bind:value={email}
            class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 !pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
            placeholder="Email"
            type="text"
          />
          <span
            class="pointer-events-none absolute flex h-full w-10 z-20 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </span>
        </span>
      </label>
      {#if view == "login" || view == "singup"}
      <label class="mt-4 block">
        <span>Password:</span>
        <span class="relative mt-1.5 flex">
          <input
          bind:value={password}
            class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
            placeholder="Enter Password"
            type="password"
          />
          <span
            class="pointer-events-none absolute flex h-full w-10 items-center justify-center z-20 text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </span>
        </span>
      </label>
      {#if view == "login"}
        <div class="mt-4 flex items-center justify-between space-x-2" in:slide>
          <label class="inline-flex items-center space-x-2">
            <input 
              class="form-checkbox is-basic h-5 w-5 rounded border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
              type="checkbox"
            />
            <span class="line-clamp-1">Recordar</span>
          </label>
          <a
            href="/login"
            on:click|preventDefault={() => {view = "forgot"}}
            class="text-xs text-slate-400 transition-colors line-clamp-1 hover:text-slate-800 focus:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100 dark:focus:text-navy-100"
            >¿Se te olvidó la contraseña?</a
          >
        </div>
        <button
        on:click={login}
          class="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
        >
          Entrar
        </button>
        {#if register}
        <div class="mt-4 text-center text-xs+">
          <p class="line-clamp-1">
            <span>¿No tienes cuenta?</span>

            <a
              on:click|preventDefault={() => {view = "singup"}}
              class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
              href="/login"
              >Crear cuenta</a
            >
          </p>
        </div>
        {/if}
      {:else}
        <button
        on:click={create}
          class="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
        >
          Crear cuenta
        </button>
        <div class="mt-4 text-center text-xs+">
          <p class="line-clamp-1">
            <span>¿Ya tienes cuenta?</span>

            <a 
              on:click|preventDefault={() => {view = "login"}}
              class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
              href="/login"
              >Iniciar sesión</a
            >
          </p>
        </div>
      {/if}
      {/if}
      {#if view == "forgot"}
        {#if code}
          <label class="mt-4 block">
            <span>Código del correo:</span>
            <span class="relative mt-1.5 flex">
              <input
              bind:value={emailCode}
                class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Código del correo"
                type="text"
              />
            </span>
          </label>
          <label class="mt-4 block">
            <span>Nuevo Password:</span>
            <span class="relative mt-1.5 flex">
              <input
              bind:value={password}
                class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Enter Password"
                type="password"
              />
              <span
                class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
            </span>
          </label>
          <button
            on:click={changePassword}
            class="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
          >
            Cambiar contraseña
          </button>
        {:else}
          <button
            on:click={forgot}
            class="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
          >
            Resetear contraseña
          </button>
        {/if}
        <div class="mt-4 text-center text-xs+">
          <p class="line-clamp-1">
            <span>¿Ya tienes cuenta?</span>

            <a
              on:click|preventDefault={() => {view = "login"}}
              class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
              href="/login"
              >Iniciar sesión</a
            >
          </p>
        </div>
      {/if}
      {/if}
      <div class="my-7 flex items-center space-x-3">
        <div class="h-px flex-1 bg-slate-200 dark:bg-navy-500"></div>
        <p>O</p>
        <div class="h-px flex-1 bg-slate-200 dark:bg-navy-500"></div>
      </div>
      <div class="flex space-x-4">
        {#if 'google' in singInMethods && singInMethods.google }
          <button on:click={googleLogin}
            class="btn w-full space-x-3 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
          >
          <iconify-icon icon="uim:google" class="text-primary text-lg align-middle" ></iconify-icon>            
            <span>Google</span>
          </button>
        {/if}
        {#if 'facebook' in singInMethods && singInMethods.facebook }
          <button
          on:click={facebookLogin}
            class="btn w-full space-x-3 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
          >
            <img
              class="h-5.5 w-5.5"
              src="images/100x100.png"
              alt="logo"
            />
            <span>Facebook</span>
          </button>
        {/if}
      </div>
    </div>
    <div
      class="mt-8 flex justify-center text-xs text-slate-400 dark:text-navy-300"
    >
      <slot name="footer"></slot>
    </div>
    <div
      class="mt-8 flex justify-center text-xs text-slate-400 dark:text-navy-300"
    >
      <a href={termsLink}>Política de privacidad</a>
      <div class="mx-3 my-1 w-px bg-slate-200 dark:bg-navy-500"></div>
      <a href={privacyLink}>Terminos y condiciones</a>
    </div>
  </div>
</main>
</div>