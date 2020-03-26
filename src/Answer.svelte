<script>
  import Number from './Number.svelte';
  import Symbol from './Symbol.svelte';
  export let items; 
  export let paintFirst; 
</script>

<div>
  {#if items}
    <Number extraHighlight={paintFirst} small item={items[0]} />
    <Symbol background symbol={items[1] && items[1].item} />
    <Number small item={items[2]} />
  {/if}
</div>


<style>
  div {
    display: flex;
    align-items: center;
  }
</style>