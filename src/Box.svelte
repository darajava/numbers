<script>
</script>

<section>
  <div class="content"></div>
</section>

<style>

  .background {

  }

  section {
    flex: 1;
    position: relative;
    margin: 10px;


    display: inline-flex;
    justify-content: center;
    align-items: center;

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
    border: 1px dotted grey;
  }
  div {
    position: relative;
    top: -2px;
  }
</style>