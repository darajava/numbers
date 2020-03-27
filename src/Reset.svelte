<script>
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'

  export let onClick;  
</script>

<button on:click={onClick}>
  <FaTrash />
</button>

<style>
  button {
    width: 60px;
    height: 60px;
    overflow: hidden;

    font-size: 58px;

    display: inline-flex;
    justify-content: center;
    align-items: center;

    background-color: #ccc;
    box-shadow: 1px 1px 3px grey;

    color: #ab0000;
    margin: 10px;
    padding: 19px;
    position: relative;
    border: 0;
    cursor: pointer;

  }

  button:hover {
    transform: scale(1.02);
    /*transition: all0.1s;*/
    cursor: pointer;
  }
</style>