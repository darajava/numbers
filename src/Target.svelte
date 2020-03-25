<script>
  export let number;
  export let currently;
  export let opponentsScore;
</script>

<section>
  {number}
  <span class="top">TARGET</span>
  <span class="bottom">
    You: {currently ? +currently.toFixed(1) : 0}<br/>
    Opponent: {opponentsScore}
  </span>
</section>

<style>

  section:hover {
    filter: brightness(1.3);
    transition: filter 0.2s;
  }
  section {
    position: relative;

    width: 240px;
    height: 240px;

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
    top: 5px;
    color: white;
    font-size: 18px;
  }

  span.bottom {
    position: absolute;
    bottom: 5px;
    font-size: 18px;
    text-align: center;
  }
</style>