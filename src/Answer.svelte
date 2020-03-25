<script>
  import Number from './Number.svelte';
  import Symbol from './Symbol.svelte';
  export let items; 
</script>

<div>
  {#if items}
    <Number small number={items[0] && items[0].item} />
    <Symbol background symbol={items[1] && items[1].item} />
    <Number small number={items[2] && items[2].item} />
    <Symbol noBorder background symbol={"="} />
    <Number highlight small number={items[3] && items[3].item} />
  {/if}
</div>


<style>
  div {
    display: flex;
    align-items: center;
  }
</style>