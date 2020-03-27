<script>
  import FaUndoAlt from 'svelte-icons/fa/FaUndoAlt.svelte'

  export let onClick;  
</script>

<button on:click={onClick}>
  <FaUndoAlt />
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

    color: #333;
    margin: 10px;
    position: relative;
    border: 0;
    padding: 19px;
    cursor: pointer;
  }

  button:hover {
    transform: scale(1.02);
    /*transition: all0.1s;*/
    cursor: pointer;
  }
</style>