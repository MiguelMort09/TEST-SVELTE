<script>
	import { goto } from "$app/navigation";


  export let node = "";
  export let value = "";
  
  function goBack(){
      history.back()
  }
</script>
<div class="row"><div class="col-2"><button
on:click={goBack}
class="btn btn-light waves-effect waves-light">
Regresar</button>
</div>
</div>