<script type="text/javascript">
  let display = false;
  setTimeout(() => {
    display = true;
  }, 300);
</script>

{#if display}
  <div class="waiting">
    Waiting for another player
    <div class="pls">(please be patient)</div>
  </div>
{/if}

<style type="text/css">
  .waiting {
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

  .pls {
    font-size: 10px;
  }
</style>