<script>
  import Number from './Number.svelte';
  import Symbol from './Symbol.svelte';
  export let items; 
  export let paintFirst; 
</script>

<div>
  {#if items}
    <Number extraHighlight={paintFirst} item={items[0]} light/>
    <Symbol background symbol={items[1] && items[1].item} />
    <Number item={items[2]} light />
  {/if}
</div>


<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
  }
</style>