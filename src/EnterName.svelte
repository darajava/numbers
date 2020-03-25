<script type="text/javascript">
  export let onSubmit;
  let name;
</script>

<div class="name-screen">
  <div class="name-input">
    <div>Enter name</div>
      <input maxlength="10" bind:value={name} />
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

  input {
    margin: 50px;
    text-align: center;
    outline: 0;
    border: 1px solid svelte;
  }

  button {
    background-color: #ccc;
    border: 0;
  }
</style>