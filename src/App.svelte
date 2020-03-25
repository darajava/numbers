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
    // return [shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]).slice(0, 7), Math.round(Math.random() * 1000)];
    return [shuffle([1, 2, 3, 4, 5, 6, 7]).slice(0, 7), Math.round(Math.random() * 7)];
  }

  let [numbers, target] = generateNewNumbers();

  let socket;

  let answerStack = [];
  let offStack = [];
  let savedOffStack = [];
  let savedAnswers = [];
  let score = 0;
  let closest = 0;
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
    console.log(op1, op2, operator)
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
      console.log(item)
      answerStack = [...answerStack, {item}, {item}];
    }
  }

  const reset = () => {
    answerStack = [];
    offStack = [];
    savedAnswers = [];
    savedOffStack = [];
    currently = 0;
    console.log(answerStack);
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
    console.log(savedAnswers)
  }

  const win = (item = null) => {
    if (item === target) {
        setTimeout(reset, 0);
        closest = 0;
        
        [numbers, target] = generateNewNumbers();
        socket.send(JSON.stringify({type: "win", roomId, userId, name, numbers, target}));

        return;
    }

    if (Math.abs(target - item) < Math.abs(target - closest)) {
      closest = Math.abs(item - target);
    }
    
    currently = item;

    socket.send(JSON.stringify({type: "score", score: item, roomId, userId}));
  }

  const roundOver = (points) => {
    intermission = points;
    setTimeout(() => {
      intermission = false;
    }, 1000);
  }

  const connect = () => {
    socket = new WebSocket(`ws://darajava.ie:1337/${roomId}/${userId}/${name}`);

    socket.onopen = (event) => {
      console.log("populateory", {
        type: "populate",
        numbers,
        target,
        roomId,
        userId,
        name,
      })
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
          console.log("populate", message);
          target = message.data.target;

          numbers = message.data.numbers;
          currently = 0;
          opponentsScore = 0;

          console.log('xxx', message.overallScores);
          opponentsOverallScore = message.overallScores.find((e) => e.userId !== userId).overallScore || 0;
          overallScore = message.overallScores.find((e) => e.userId === userId).overallScore || 0;
          break;
        case "playerRegistered":
        console.error(message);
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
  {#if name && waitingForPlayer}
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
    currently={currently}
    opponentsScore={opponentsScore}
    target={target}
    score={score}
    closest={closest}
    name="dara"
    reset={reset}
    backspace={backspace}
    save={save}
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
    opponentsOverallScore={opponentsOverallScore}
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