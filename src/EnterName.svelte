<script type="text/javascript">
  import { onMount } from 'svelte';

  export let onSubmit;
  
  let name;
  let ref;

  onMount(() => {
    ref.focus(); 
  });

  if (localStorage.getItem("name")) {
    onSubmit(localStorage.getItem("name"));
  }

  const checkForEnter = (e) => {
    if (e.keyCode === 13) {
      onSubmit(name);
    }

    localStorage.setItem("name", name);
  }
</script>

<div class="name-screen">
  <div class="name-input">
    <div>Enter name</div>
    <input maxlength="10" bind:value={name} bind:this={ref} on:keyup={checkForEnter} />
    <button on:click={(e) => onSubmit(name)}>Go</button>
  </div>
</div>

<style type="text/css">
  .name-screen {
    width: 100vw;
    height: 100vh;
    /*pointer-events: none;*/
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    flex-direction: column;
    text-align: center;
    padding: 50px;
  }

  .name-input {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    margin: 50px;
    text-align: center;
    outline: 0;
    border: 1px solid svelte;
    max-width: 80%;
  }

  button {
    background-color: #ccc;
    border: 0;
    width: 150px;
  }
</style>