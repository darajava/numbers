<script>
  export let number;
  export let currently;
  export let opponentsScore;
  import { showText } from './stores.js';

</script>

<section class={!$showText ? "hide-text" : ""}>
    {number}
    <span class="top">TARGET</span>
</section>

<style>
  .hide-text {
    color: rgba(0, 0, 0, 0) !important;
  }

  section:hover {
    filter: brightness(1.3);
    transition: filter 0.2s;
  }
  section {
    position: relative;

    width: 180px;
    height: 180px;

    font-size: 82px;

    display: inline-flex;
    justify-content: center;
    align-items: center;

    background-color: #252525;
    box-shadow: 1px 1px 3px grey;

    color: white;
  }


  span.top {
    position: absolute;
    top: 15px;
    font-size: 26px;
    opacity: 0.5;
  }

  span.bottom {
    position: absolute;
    bottom: 5px;
    font-size: 18px;
    text-align: center;
  }
</style>