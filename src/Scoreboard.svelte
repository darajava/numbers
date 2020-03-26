<script>
  import { showText } from './stores.js';
  
  export let overallScore;  
  export let opponentsOverallScore;
  export let onNameClick;
  export let name;
  export let opponentsName;

  export let score;
  export let opponentsScore;
  let fade2 = false;

</script>

<section>
  <div class="holder">
    <div class="l">
      <span class={`name ${$showText ? "" : "hide"}`} on:click={onNameClick}>
        {name}
      </span> 
      <span class="score">
        {+overallScore.toFixed(1)}
      </span>
    </div>
      &nbsp;&mdash;&nbsp;
    <div class="r">
      <span class="score">
        {+opponentsOverallScore.toFixed(1)}
      </span>
      <span class={`name ${$showText ? "" : "hide"}`}>
        {opponentsName}
      </span> 
    </div>
  </div>

  <div class="holder">
    <div class="l">
      <span class="small hint">this round:</span> <span class="closest item">{+score.toFixed(1)}</span>
    </div>
      &nbsp;&mdash;&nbsp;
    <div class="r">
      <span class="closest item">{+opponentsScore.toFixed(1)}</span>
    </div>
  </div>
</section>

<style>
  section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }  

  .holder {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
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

  .name.hide {
    display: none;
  }

  .hint {
    color: #666;
    font-size: 18px;
    margin: 0 5px;
  }

  .hint.small {
    font-size: 14px;
    color: #888;
  }

  .closest {
    font-size: 26px;
    color: #666;
  }

  .closest.item {
    font-size: 20px;
    color: #888;

  }



</style>