<script>
  import {showText} from './stores.js';

  export let symbol;
  export let onClick;
  export let background;
  export let highlight;
  export let noBorder;

  let classList = [];

  if (background) {
    classList = [...classList, "background"]
  }

  if (noBorder) {
    classList = [...classList, "no-border"]
  }

</script>

<section on:click={() => onClick({item: symbol}, true)} class={classList.join(" ")} >
  {#if $showText}
    <div>
      &nbsp;{symbol ? symbol : ''}&nbsp;
    </div>
  {/if}


</section>

<style>

  .background {
    background-color: white;
    color: #333;
    box-shadow: none;
    border: 2px #999 dashed;
    font-size: 36px;
    border-radius: 10px;
    width: 30px;
    height: 30px;
  }

  .no-border {
    border: none;  
  }

  section:hover {
    filter: brightness(1.3);
    transform: scale(1.02);
    transition: transform 0.2s;
    cursor: pointer;
  }

  section:active {
    filter: brightness(1);
    transform: scale(1);
    transition: transform 0.1s cubic-bezier(1.000, -0.600, 0.000, 1.560);
    cursor: pointer;
  }

  section {
    width: 50px;
    height: 50px;

    font-size: 58px;

    display: inline-flex;
    justify-content: center;
    align-items: center;

    background-color: #3b6d3a;
    box-shadow: 1px 1px 3px grey;

    color: white;
    margin: 10px;
  }

  div {
    position: relative;
    top: -2px;
  }
</style>