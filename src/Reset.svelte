<script>
  export let onClick;  
</script>

<button on:click={onClick}>
  Clear all
</button>

<style>
  button {
    background-color: #ccc;
    border: 0;
    font-size: 16px;
  }
</style>