<script>
  import {showText} from './stores.js';
  import Hint from './Hint.svelte';

  export let symbol;
  export let onClick;
  export let background;
  export let highlight;
  export let noBorder;
  export let hint;

  let classList = [];

  if (background) {
    classList = [...classList, "background"]
  }

  if (noBorder) {
    classList = [...classList, "no-border"]
  }

</script>

<section on:click={() => onClick({item: symbol, isSymbol: true})} class={classList.join(" ")} >
  <div class="content">
    {#if $showText}
      <div>
        &nbsp;{symbol ? symbol : ''}&nbsp;
      </div>

      <Hint hint={hint} />
    {/if}
  </div>


</section>

<style>

  .background {
    background-color: white;
    color: #333;
    box-shadow: none;
    border: 2px #999 dashed;
    font-size: 36px;
    border-radius: 10px;
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
    flex: 1;
    position: relative;
    margin: 10px;


    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #37793c;
    box-shadow: 1px 1px 3px grey;

    color: white;
    margin: 10px;
    transition: background-color 1.8s;
    position: relative;
    font-size: 42px;
  }

  section:before {
    content:     "";
    display:     block;
    padding-top: 100%; /* initial ratio of 1:1*/
  }

  .content {
    position: absolute;
    top:      -7px;
    left:     0;
    bottom:   0;
    right:    0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>