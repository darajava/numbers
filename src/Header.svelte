<script>
  export let name;
  export let startTime;
  export let score;
  export let closest;
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
  import Delete from './Delete.svelte';
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
      {#if answerStack}
        {#each answerStack as item, i}
          {#if i % 4 === 0}
            <Answer 
              paintFirst={i===0}
              items={answerStack.slice(-i + answerStack.length - answerStack.length % 4)}
            />
          {/if}
        {/each}
      {/if}

      <div class="controls">
        <Save onClick={save} />
        <Delete onClick={backspace} />
        &nbsp;
        <Reset onClick={reset} />
        <GiveUp onClick={giveUp} />
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
    width: 100vw;
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
    max-height: 240px;
    min-height: 240px;
    width: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .answer-box:after {
    content: '';
    position : absolute;
    z-index  : 1;
    bottom   : 0;
    left     : 0;
    pointer-events   : none;
    background-image : linear-gradient(180deg, 
                      rgba(255,255,255, 0), 
                      rgba(255,255,255, 1) 100%);
    width    : 100%;
    height   : 55%;
  }

  .controls {
    position: absolute;
    bottom: 10px;
    z-index: 1000;
  }

  .controls button {
    cursor: pointer;
  }
</style>