<script>
  export let number = 0;
  export let onClick;
  export let off;
  export let small;
  export let highlight;

  let onClickHandler = () => {
    if (!off) {
      onClick(number, false);
    }
  }

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
    
    if (number)
      classList = [...classList, `n${parseFloat(number.toFixed(1)).toString().length}`]
  }



</script>

<section on:click={onClickHandler} class={classList.join(" ")}>
  {number ? parseFloat(number.toFixed(1)) : ' '}
</section>

<style>
  .small {
    width: 50px;
    height: 50px;
    font-size: 22px;
    opacity: 0.8;
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

  .highlight {
    filter: saturate(2);
  }

  .off {
    filter: brightness(1.3) saturate(0);
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
    width: calc((100vw / 7) - 20px);
    height: calc((100vw / 7) - 20px);

    font-size: 42px;

    display: inline-flex;
    justify-content: center;
    align-items: center;

    background-color: #964743;
    box-shadow: 1px 1px 3px grey;

    color: white;
    margin: 10px;
    transition: background-color 1.8s;
  }
</style>