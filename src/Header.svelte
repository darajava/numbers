<script>
  export let name;
  export let startTime;
  export let score;
  export let closestItem = 0;
  export let currently;
  export let opponentsScore;
  export let answerStack;
  export let target;
  export let reset, backspace, save, giveUp;
  import moment from 'moment';
  import Target from './Target.svelte';
  import Answer from './Answer.svelte';
  import Reset from './Reset.svelte';
  import GiveUp from './GiveUp.svelte';
  import Box from './Box.svelte';
  import Save from './Save.svelte';
  import { onMount } from 'svelte';
 
  let time = 0;

 
  onMount(() => {
    const interval = setInterval(() => {
      time++;
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<header>
  <div class="left">
   <div class="answer-box">
        <Answer 
          items={answerStack.slice(0, 4)}
        />


      <div class="controls">
        <GiveUp onClick={giveUp} />
        <div class="closest">
          Closest: {(closestItem && closestItem.item) ? closestItem.item : 0}
        </div>
      </div>
    </div>
  </div>
  <div class="right">
    
    
    <div class="target">
      <Target number={target} currently={currently} opponentsScore={opponentsScore}/>
    </div>
  </div>
</header>

<style>
  header {
    display: flex;
    width: 100%;
  }

  .left, .right {
    display: flex;
    flex-direction: column;
    font-size: 20px;
    width: 100%;
    padding: 10px;
  }
  .right {
    align-items: flex-end;
    flex-direction: row;
    width: 100%;
  }
  .row {
    width: 50%;
    display: flex;
    align-items: center;
  }

  .name {
    font-size: 50px;
    padding-left: 10px;
  }

  .time {
    font-size: 30px;
    padding-left: 20px;

  }

  .target {
    margin-left: auto;
  }
  .answer-box {
    margin-left: auto;
    max-height: 180px;
    min-height: 180px;
    width: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .controls {
    bottom: 10px;
    z-index: 1000;
    text-align: center;
  }

  .closest {
    font-size: 14px;
    opacity: 0.7;
  }

  .controls button {
    cursor: pointer;
  }
</style>