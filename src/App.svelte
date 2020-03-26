<script>
  import Number from './Number.svelte';
  import Target from './Target.svelte';
  import Symbol from './Symbol.svelte';
  import Header from './Header.svelte';
  import EndRound from './EndRound.svelte';
  import EnterName from './EnterName.svelte';
  import Waiting from './Waiting.svelte';
  import Scoreboard from './Scoreboard.svelte';
  import Answer from './Answer.svelte';
  import Box from './Box.svelte';
  
  import { showText } from './stores.js';
  
  const shuffle = (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  const generateNewNumbers = () => {
    return [
      shuffle(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
      ).slice(0, 7), Math.round(Math.random() * 1000),
    ];
    // return [shuffle([1, 2, 3, 4, 5, 6, 7]).slice(0, 7), Math.round(Math.random() * 7)];
  }

  let [numbers, target] = generateNewNumbers();

  let socket;

  let answerStack = [];
  let offStack = [];
  let savedOffStack = [];
  let savedAnswers = [];
  let score = 0;
  let closest = undefined;
  let closestItem = 0;
  let currently = 0;
  let opponentsScore = 0;
  let overallScore = 0;
  let opponentsOverallScore = 0;
  let opponentsName = '';
  let waitingForPlayer =  true;
  let intermission = false;

  let userId = localStorage.getItem("userId");

  if (!userId) {
    localStorage.setItem("userId", "id" + Math.round(Math.random() * 100000));
    userId = localStorage.getItem("userId");
  }

  let roomId = "abc";

  let name;

  let currentAnswer;

  const calculate = (arr) => {
    let [op1, operator, op2] = arr.slice(-3);

    switch (operator.item) {
      case '+':
        return op1.item + op2.item;
      case '-':
        return op1.item - op2.item;
      case '×':
        return op1.item * op2.item;
      case '÷':
        return op1.item / op2.item;
    }
  }

  const isFloat = (value) => {
    return !isNaN(value) && 
           parseFloat(value) == value && 
           !isNaN(parseFloat(value, 10));
  }

  const pushAnswer = (item, isSymbol = false, isFromSaved = false) => {
    const audio = new Audio('thud.mp3');
    if (answerStack.length % 2 === 0) {
      if (!isSymbol) {
        answerStack = [...answerStack, {item, isSymbol, isFromSaved}];
        offStack = [...offStack, {item}];
        if (isFromSaved) {
          savedOffStack = [...savedOffStack, {item, isFromSaved}];
        }
        audio.play();
      }
    } else {
      if (isSymbol) {
        answerStack = [...answerStack, {item, isSymbol, isFromSaved}];
        offStack = [...offStack, {item}];
        if (isFromSaved) {
          savedOffStack = [...savedOffStack, {item, isFromSaved}];
        }
        audio.play();
      }
    }

    if (answerStack.length % 4 === 3) {
      item = calculate(answerStack);
      win(item);
      answerStack = [...answerStack, {item}, {item}];
    }
  }

  const reset = (keepClosest) => {
    answerStack = [];
    offStack = [];
    savedAnswers = [];
    savedOffStack = [];
    currently = 0;
    if (!keepClosest) {
      closest = undefined;
      closestItem = 0;
    }
    win();
  }

  const lose = () => {
    reset();
  }

  const backspace = () => {
    win();

    if (answerStack.length === 0) {
      if (savedAnswers.length) {
        answerStack = savedAnswers[savedAnswers.length - 1].stack;
        savedAnswers = savedAnswers.slice(0, savedAnswers.length - 1);
        return;
      }
    }
    
    offStack = offStack.slice(0, offStack.length - 1);

    if (answerStack.length > 2 && isFloat(answerStack[answerStack.length - 1].item) && isFloat(answerStack[answerStack.length - 2].item)) {
      if (answerStack[answerStack.length - 3] && answerStack[answerStack.length - 3].isFromSaved) {
        savedOffStack = savedOffStack.slice(0, savedOffStack.length - 1);
      }
      answerStack = answerStack.slice(0, answerStack.length - 3);
    } else {
      if (answerStack[answerStack.length - 1] && answerStack[answerStack.length - 1].isFromSaved) {
        savedOffStack = savedOffStack.slice(0, savedOffStack.length - 1);
      }
      answerStack = answerStack.slice(0, answerStack.length - 1);
      }
  }

  const save = () => {
    const i = answerStack.length - 1;
    if (!answerStack[i - 1]) return;
    const topNumber = answerStack[i - 1] && (answerStack[i].isSymbol ? answerStack[i - 1] : answerStack[i])
    savedAnswers = [...savedAnswers, {item: topNumber.item, stack: answerStack}]
    answerStack = [];
  }

  const win = (item = null, win = false) => {
    if (item === target || win) {
      [numbers, target] = generateNewNumbers();
      socket.send(JSON.stringify({type: "win", score: closest, roomId, userId, name, numbers, target}));

      setTimeout(reset, 0);
      return;
    }

    if (closest === undefined) {
      closest = 10000;
    }

    if (Math.abs(item - target) < Math.abs(closest - target)) {
      closest = Math.abs(item - target);
      score = Math.max(0, 10 - closest);
    }
    
    if (item !== null)
      currently = item;

    socket.send(JSON.stringify({type: "score", score, roomId, userId}));
  }

  const giveUp = () => {
    win(false, true);
  }

  const roundOver = (points) => {
    intermission = points;
    setTimeout(() => {
      intermission = false;
    }, 3000);
  }

  const connect = () => {
    if (socket) return;
    socket = new WebSocket(`ws://localhost:2000/${roomId}/${userId}/${name}`);
    // socket = new WebSocket(`wss://darajava.ie/socket/${roomId}/${userId}/${name}`);

    socket.onopen = (event) => {
      socket.send(JSON.stringify({
        type: "populate",
        numbers,
        target,
        roomId,
        userId,
        name,
      }));
    }

    socket.onmessage = (message) => {
      message = JSON.parse(message.data);
      console.log("message", message)
      console.log(message.type);
      switch (message.type) {
        case "score":
          opponentsScore = message.score;
          break;
        case "populate":
          target = message.data.target;
          setTimeout(() => {
            $showText = true;
          }, 200);
          numbers = message.data.numbers;
          currently = 0;
          opponentsScore = 0;

          opponentsOverallScore = message.overallScores.find((e) => e.userId !== userId).overallScore || 0;
          overallScore = message.overallScores.find((e) => e.userId === userId).overallScore || 0;
          break;
        case "playerRegistered":
          try {
            opponentsName = message.names.find(message => message.userId !== userId).name;
            waitingForPlayer = false;
          } catch (e) {
            
          }
          break;

        case "roundOver":
          roundOver(message.points);
          break;
      }
    }
  }

  const setName = (newName) => {
    name = newName;
    connect();
  }

</script>

<main>
  {#if waitingForPlayer}
    <Waiting />
  {/if}

  {#if intermission !== false}
    <EndRound points={intermission} />
  {/if}

  {#if !name}
    <EnterName onSubmit={setName}/>
  {/if}
  
  <Header
    answerStack={answerStack}
    currently={closestItem}
    opponentsScore={opponentsScore}
    target={target}
    name="dara"
    reset={() => reset(true)}
    backspace={backspace}
    save={save}
    giveUp={giveUp}
  />
  <div class="game">
    <div class="board">
      {#if numbers}
        {#each numbers as number, i}
          <Number onClick={pushAnswer} number={number} off={!!offStack.find(e => e && e.item == number)} />
        {/each}
      {/if}
    </div>
    
    <div class="controls">
      <div class="symbols">
        <Symbol onClick={pushAnswer} symbol="+" />
        <Symbol onClick={pushAnswer} symbol="-" />
        <Symbol onClick={pushAnswer} symbol="×" />
        <Symbol onClick={pushAnswer} symbol="÷" />

        {#each savedAnswers as item, i}
          <Number onClick={(item) => pushAnswer(item, false, true)} off={!!savedOffStack.find(e => e && e.item === item.item)} number={item.item} small />
        {/each}

        {#each new Array(Math.max(0, 4 - savedAnswers.length)) as _} 
          <Box />
        {/each}
      </div>

    </div>
  </div>

  <Scoreboard 
    name={name}
    opponentsName={opponentsName}
    overallScore={overallScore}
    score={score}
    opponentsScore={opponentsScore}
    opponentsOverallScore={opponentsOverallScore}
    onNameClick={() => name = undefined}
  />

</main>

<style>



  .controls {
    display: flex;
  }

  .symbols {
    display: flex;
  }

  main {
    padding: 0;
    max-width: 240px;
    margin: 0;
    height: 100vh;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  body {
    padding: 0;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  * {
    user-select: none;
  }
</style>