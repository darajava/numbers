<script>
  import { fade } from 'svelte/transition';
  
  export let overallScore;  
  export let opponentsOverallScore;
  export let name;
  export let opponentsName;
  let fade2 = false;

</script>

<section>
  <div class="l">
    <span class="name">
      {name}
    </span> 
    <span class="score">
      {overallScore}
    </span>
  </div>
  <div class="r">
    &nbsp;-
    <span class="score">
      {opponentsOverallScore}
    </span>
    <span class="name">
      {opponentsName} <span class="fade-up">has joined!</span>
    </span> 
  </div>
</section>

<style>
  section {
    width: 100%;
    display: flex;
    flex-direction: row;
  }  
  .l, .r {
    width: 50%;
    display: flex;
    align-items: center;
  }

  .l {
    justify-content: flex-end;
  }

  .r {
    margin-left: 0;
  }

  .score {
    font-weight: bold;
    font-size: 58px;
    margin: 5px;
  }

  .name {
    font-size: 28px;
  }


  .fade-up {
    animation: 2s fadeUp linear;
    position: relative;
    opacity: 0;
    font-size: 20px;
  }

  @keyframes fadeUp {
    from {
      top: 0;
      opacity: 1;
    }

    90% {
      opacity: 0.8;
      top: 0;
    }

    to {
      top: -200px;
      opacity: 0;
    }

  } 

</style>