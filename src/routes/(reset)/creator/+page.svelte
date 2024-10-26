<script lang="ts">
	import { browser } from "$app/environment";
	import MicInput from "$lib/controls/MicInput.svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
  import dJSON from 'dirty-json';
	import Particles from "./Particles.svelte";
	import { doc, setDoc } from "firebase/firestore";
	import { db } from "$lib/app";
  // import {PythonShell} from 'python-shell';
  //const dJSON = require('dirty-json');


  let nodeId = "sys"+Math.floor(100000 + Math.random() * 900000);
  const localweb = "http://localhost:5100/"

  let final_transcript = "";
  let code = "";
  let codeJSON:any;
  let generated = false;
  let generating = false;
  let typewriter:any;
  let typedChar = ""; // SECTION displaying typed text
	let index = 0; 
  let step = 0;
  let isTyping = false;

  function onRefresh() {
    final_transcript = "";
    generated = false;
    generating= false;
    stopTyping();
    typedChar = "";
    step = 0;
    nodeId = "sys"+Math.floor(100000 + Math.random() * 900000);
    
  }

  function generate() {
    generating = true;
    code = "";
    
    genFields();
    //setTimeout(()=>generated=true,10000);
  }
  
  const typeChar = () => {
		if (index < code.length) {
			isTyping = true;
			typedChar += code[index];
			index += 1;
      typedChar += code[index];
			index += 1;
		} else {
			stopTyping();
			return;
		}
	}
	
	const typing = () => typewriter = setInterval(typeChar, 5);
	
	const stopTyping = () => {
		clearInterval(typewriter);
		isTyping = false;
	}


	async function genFields() {
    
    if(final_transcript == "" || final_transcript.length < 10){
      return;
    }
    let body = 'Quiero hacer un sistema '+final_transcript+'. \nEscoge la pantalla de caputura de información mas importante y genera un arreglo con objetos JSON de cada campo de capura que podria contener. Usa esta estructura para cada objeto json "ctype" que es el tipo de campo ,"render" ponle "default" o "select" si el "ctype" es "list" ,"list" true o false si es un campo importante,"required" true o false si es obligatorio,"label" nombre del campo,"order" el orden, "initial" un string vacio o una lista de las opciones del campo, "id" un identificador solo con letras único para ese campo.\nUsa esta tabla de posibles valores para "ctype": "str" si es texto, "int" si es Numero, "float" si es numero con decilmales, "list" si es una lista de selección, "date" si es fecha, "datetime" si es fecha y hora, "bool" si se debe marcar como si o no,"file" si es un archivo a guardar.\n\n';
  const res = await fetch(`https://api.openai.com/v1/completions`, {
      //mode: 'no-cors',
      method: 'POST',
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: body,
        temperature: 0.75,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer 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`
      }
    });
    const data = await res.json();
    if (data.id != undefined && data.choices != undefined && data.choices.length > 0) {
      code = data.choices[0].text;
      codeJSON = dJSON.parse(code);
      console.log(code);
      typing();
      step = 1;
      loadToFirestore();
    } else {
      code = JSON.stringify(data);
    }
  
}

	async function loadToFirestore() {
    await setDoc(doc(db, nodeId, "data"),{
      buttons: "crud",
      hascreate:true,
      hasedit:true,
      hasstore:true,
      nameId:nodeId,
      brief:final_transcript,
      nameplr: "Registros",
      namesin: "Registro",
      node: nodeId,
      order: "",
      template: "app"}); 
    for (var [key, value] of Object.entries<any>(codeJSON)) {
        await setDoc(doc(db, nodeId, "data","schema",value.id), value); 
    }
    step = 2;
    generateCode();
}

async function generateCode() {
  let res = await fetch("http://127.0.0.1:5000/generate/"+nodeId);
  const restext = await res.text();
  console.log("gen res ",restext);   
  generated = true;                

}

</script>
<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300&family=Open+Sans&display=swap" rel="stylesheet">
</svelte:head>
<Particles />
<div class="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
  {#each typedChar.split("\n") as sentence}
    <p>{sentence}</p>
  {/each}
</div>
<main>
  <div class="items-center justify-center flex flex-col mb-16">
    
      <img
          class="h-[100px] w-[100px] transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
          src="/images/logomxd-space.png"
          alt="logo"
        />
    {#if generating && !generated}
      <img transition:fade
        class=" w-[500px] mix-blend-lighten absolute"
        src="/images/aialoader.gif"
        alt="logo"
      />
    {/if}
    {#if !generating}
            <h1 class="mt-8 text-3xl text-white text-center">Hola <br/>¿Qué vas a administrar con tu sistema?</h1>
    {:else}
            <h1 class="mt-8 text-xl text-white/50 text-center mb-6">{final_transcript}</h1>
    {/if}
  </div>
  
  <div class="glassIco text mb-4">
    {#if !generating}
      <textarea class="bg-transparent border-none placeholder:italic" placeholder="ej. quiero manejar los inventarios de medicinas para mi clínica veterinaria" bind:value={final_transcript}></textarea>
    {:else}
      <div>
        <ul>
        {#if generating && !generated}
            <li class="text-white">
              <i class="fas fa-cog animate-spin"></i> Generando campos
            </li>
            <li class="text-white ">
              <i class="fas fa-cog animate-spin"></i> Cargando base de datos
            </li>
            <li class="text-white ">
              <i class="fas fa-cog animate-spin"></i> Generando HTML
            </li>
        {:else}

            <li class="text-white/50">
              <i class="fas fa-check"></i> Generando campos
            </li>
            <li class="text-white/50 ">
              <i class="fas fa-check"></i> Cargando base de datos
            </li>
            <li class="text-white/50 ">
              <i class="fas fa-check"></i> Generando HTML
            </li>
            <li>Listo: <a href="{localweb}{nodeId}" class="mr-2" target="_blank"> Utilizar <i class="fas fa-circle-right"></i></a></li>
          
        {/if}
      </ul>
      </div>
    {/if}
  </div>
  <div class="actions">
    
    {#if generated}
      <a transition:fade class="glassIco" href="#" on:click={onRefresh}><i class="fas fa-refresh"></i></a>
      <a transition:fade class="glassIco" href="#"><i class="fab fa-whatsapp"></i></a>
    {:else if !generating}
      <MicInput class="glassIco" bind:value={final_transcript} />
    {/if}
    {#if final_transcript != "" && final_transcript.length > 10 && !generating}
      <a class="glassIco" href="#" on:click={generate} transition:fade><i class="fas fa-robot"></i></a>
    {/if}
  </div>
  
</main>


<style>
  
    main {
      
font-family: 'Open Sans', sans-serif;
font-weight: 400;
      height: 100%;
  position: relative;
  background-image: linear-gradient(135deg, rgba(249, 119, 148,0.6) 10%, rgb(98, 58, 162,0.3) 100%);
  justify-content: center;
  align-items: center;
  @apply flex flex-col;
}
main > div{
  max-width: 800px;
}
main:before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  bottom: 0;
  left: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
  /* z-index: -1; */
}

h1{
  font-family: 'Josefin Sans', sans-serif;
  font-weight: 300;
}

/* 
 * Start 
*/

.actions{
  @apply flex col-start-2 items-center justify-center;
}
.text{
  @apply w-full col-start-2 p-4 m-0 text-base;
}
.text textarea{
  @apply w-full h-full outline-none;
}



</style>