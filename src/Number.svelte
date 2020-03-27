<script>
  import { showText } from './stores.js';
  import Hint from './Hint.svelte';

  export let item = {item: undefined};
  export let number = item.item;
  export let onClick;
  export let off;
  export let small;
  export let smallFit;
  export let light;
  export let highlight;
  export let extraHighlight;
  export let hint;

  let onClickHandler = () => {
    if (onClick && !off) {
      onClick(item, false);
    }
  }

  console.log('"number"', item)

  let classList = [];

  $: {
    if (off) {
      classList = ["off"];
    } else {
      classList = [];
    }

    if (small) {
      classList = [...classList, "small"];
    }

    if (highlight) {
      classList = [...classList, "highlight"]
    }

    if (extraHighlight) {
      classList = [...classList, "extra-highlight"]
    }

    if (!$showText) {
      classList = [...classList, "hide-text"]
    }

    if (smallFit) {
      classList = [...classList, "small-fit"]
    }

      classList = [...classList, `n${parseFloat((item && item.item) ? item.item.toFixed(1) : '').toString().length}`]
    if (number) {
    }

    if (light) {
      classList = [...classList, "light"]
    }

  }


</script>

<section on:click={onClickHandler} class={classList.join(" ")}>
  <div class="content">
    {(item && item.item) ? parseFloat(item.item.toFixed(1)) : ''}
    <Hint hint={hint} />
  </div>
</section>

<style>
   

  .hide-text {
    color: rgba(0, 0, 0, 0);
  }

  .small {
    font-size: 18px;
    opacity: 0.9;
  }

  .light {
    background-color: #ff9179;
    /*font-size: 18px;*/
    opacity: 0.9;
  }

  .small-fit {
  }



    .n4 {
    font-size: 16px;
  }

  .n5 {
    font-size: 14px;
  }

  .n6 {
    font-size: 11px;
  }

  .n7 {
    font-size: 9px;
  }

  .n8 {
    font-size: 9px;
  }

  .n9 {
    font-size: 8px;
  }

  .n10 {
    font-size: 7px;
  }

  .n11 {
    font-size: 5px;
  }

  .n11, .n12, .n13, .n14, .n15, .n16, .n17, .n18, .n19, .n20, .n21, .n22, .n23, .n24 {
    font-size: 5px;
  }

    .light.n4 {
    font-size: 32px;
  }

  .light.n5 {
    font-size: 28px;
  }

  .light.n6 {
    font-size: 22px;
  }

  .light.n7 {
    font-size: 18px;
  }

  .light.n8 {
    font-size: 18px;
  }

  .light.n9 {
    font-size: 16px;
  }

  .light.n10 {
    font-size: 14px;
  }

  .light.n11 {
    font-size: 10px;
  }

  .light.n11, .light.n12, .light.n13, .light.n14, .light.n15, .light.n16, .light.n17, .light.n18, .light.n19, .light.n20, .light.n21, .light.n22, .light.n23, .light.n24 {
    font-size: 10px;
  }



  .highlight, .extra-highlight {
    filter: saturate(2);
  }

  .extra-highlight {
    border: 3px dotted #d2d2d2;
  }

  .off {
    filter: brightness(1.3) saturate(0);
    opacity: 0.4;
  }

  section:hover {
    filter: brightness(1.3);
    transform: scale(1.02);
    /*transition: all0.1s;*/
    cursor: pointer;
  }

  section:hover.off {
    filter: saturate(0) brightness(1.3);
  }

  section:active {
    transform: scale(1);
    filter: brightness(1);
    /*transition: all 0.1s cubic-bezier(1.000, -0.600, 0.000, 1.560);*/
    cursor: pointer;
  }

  section {
    flex: 1;
    position: relative;
    margin: 10px;


    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #964743;
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
    top:      0;
    left:     0;
    bottom:   0;
    right:    0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>