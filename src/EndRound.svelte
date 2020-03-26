<script type="text/javascript">
  export let points;
</script>

<div class="end-round">
  {points ? `${points} points` : "No points"}

</div>

<style type="text/css">
  .end-round {
    width: 100vw;
    height: 100vh;
    /*pointer-events: none;*/
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 100px;
    flex-direction: column;
    text-align: center;
    padding: 50px;
  }
</style>