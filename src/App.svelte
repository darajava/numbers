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
  import Delete from './Delete.svelte';
  import Reset from './Reset.svelte';
  
  import { showText } from './stores.js';
  
  const keyBindings = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ]

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
    let theseNumbers = shuffle(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
    ).slice(0, 7);
    let thisTarget = Math.round(Math.random() * 900) + 101;

    // theseNumbers = shuffle([1, 2, 3, 4, 5, 6, 7]);
    // thisTarget = 0;

    console.log(theseNumbers.map(n => {return {item: n, id: Math.random()}}), "helo");

    return [theseNumbers.map(n => {return {item: n, id: Math.random()}}), thisTarget];
  }

  let [numbers, target] = generateNewNumbers();

  let socket;

  let answerStack = [];
  let offStack = [];
  let savedOffStack = [];
  let savedAnswers = [];
  let score = 0;
  let closest = undefined;
  let closestItem = undefined;
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

  document.onkeyup = (e) => {
    let keyIndex = keyBindings[0].findIndex(key => e.key === key)
    if (keyIndex > -1) {
      pushAnswer(numbers[keyIndex]);
      return;
    }

    keyIndex = keyBindings[1].findIndex(key => e.key === key)
    if (keyIndex > -1) {
      switch (keyIndex) {
        case 0:
          pushAnswer({item: "+", isSymbol: true});
          break;
        case 1:
          pushAnswer({item: "-", isSymbol: true});
          break;
        case 2:
          pushAnswer({item: "×", isSymbol: true});
          break;
        case 3:
          pushAnswer({item: "÷", isSymbol: true});
          break;
        default:
          pushAnswer(savedAnswers[keyIndex - 4]);
      }
    }

    return;
  }

  const calculate = (arr) => {
    let [op1, operator, op2] = arr.slice(-3);

    let result;

    switch (operator.item) {
      case '+':
        result = op1.item + op2.item;
        break;
      case '-':
        result = op1.item - op2.item;
        break;
      case '×':
        result = op1.item * op2.item;
        break;
      case '÷':
        result = op1.item / op2.item;
        break;
    }

    return {item: result}
  }

  const isFloat = (value) => {
    return !isNaN(value) && 
           parseFloat(value) == value && 
           !isNaN(parseFloat(value, 10));
  }

  const pushAnswer = (item) => {
    if (!item) return;

    console.log("pushAnswer", item);
    const audio = new Audio('thud.mp3');
    if (answerStack.length % 2 === 0) {
      if (!item.isSymbol) {
        answerStack = [...answerStack, item];
        offStack = [...offStack, item];
        if (item.isFromSaved) {
          savedOffStack = [...savedOffStack, item];
        }
        audio.play();
      }
    } else {
      if (item.isSymbol) {
        answerStack = [...answerStack, item];
        offStack = [...offStack, item];
        if (item.isFromSaved) {
          savedOffStack = [...savedOffStack, item];
        }
        audio.play();
      }
    }

    if (answerStack.length % 4 === 3) {
      let newItem = calculate(answerStack);
      console.log("pooo", newItem);
      win(newItem);
      answerStack = [...answerStack, newItem, newItem];
      console.error(savedOffStack);
      save();
      answerStack = [];
    }
  }

  const reset = (keepClosest) => {
    answerStack = [];
    offStack = [];
    savedAnswers = [];
    savedOffStack = [];
    currently = 0;
    if (!keepClosest) {
      score = 0;
      closest = undefined;
      closestItem = undefined;
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
    savedAnswers = [...savedAnswers, {item: topNumber.item, stack: answerStack, id: Math.random(), isFromSaved: true}]
    answerStack = [];
  }

  const win = (item = null, win = false) => {
    if (closest === undefined) {
      closest = 10000;
    }

    if (item !== null) {
      console.log('poopie item', item.item);
      console.log('poopie target', target);
      console.log('poopie closest', closest);
      console.log('poopie newtest', Math.abs(item.item - target));
      console.log('poopie oldtest', Math.abs(closest - target));
      if (Math.abs(item.item - target) < closest) {
        closest = Math.abs(item.item - target);
        score = Math.max(0, 10 - closest);
        closestItem = item;
      }
    }

    if (item === target || win) {
      [numbers, target] = generateNewNumbers();
      socket.send(JSON.stringify({type: "win", score, roomId, userId, name, numbers, target}));

      setTimeout(reset, 3000);
      return;
    }

    socket.send(JSON.stringify({type: "score", score, roomId, userId}));
  }

  const giveUp = () => {
    win(null, true);
  }

  const roundOver = (points) => {
    intermission = points;
    $showText = false;
    setTimeout(() => {
      intermission = false;
      $showText = true;
    }, 3000);
  }

  const connect = () => {
    if (socket) return;
    // socket = new WebSocket(`ws://localhost:2000/${roomId}/${userId}/${name}`);
    socket = new WebSocket(`wss://darajava.ie/socket/${roomId}/${userId}/${name}`);

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
          roundOver(message.score);
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
    <EndRound points={score} />
  {/if}

  {#if !name}
    <EnterName onSubmit={setName}/>
  {/if}
  
  <Scoreboard 
    name={name}
    opponentsName={opponentsName}
    overallScore={overallScore}
    score={score}
    opponentsScore={opponentsScore}
    opponentsOverallScore={opponentsOverallScore}
    onNameClick={() => name = undefined}
  />
  <Header
    answerStack={answerStack}
    opponentsScore={opponentsScore}
    target={target}
    closestItem={closestItem}
    reset={() => reset(true)}
    backspace={backspace}
    giveUp={giveUp}
  />
  <div class="game">
    <div class="board">
      {#if numbers}
        {#each numbers as number, i}
          <Number hint={keyBindings[0][i]} onClick={pushAnswer} item={number} off={!!offStack.find(e => e && e.id == number.id)} />
        {/each}
      {/if}
    </div>
    
    <div class="controls">
      <div class="symbols">
        <Symbol onClick={pushAnswer} symbol="+" hint={keyBindings[1][0]}/>
        <Symbol onClick={pushAnswer} symbol="-" hint={keyBindings[1][1]}/>
        <Symbol onClick={pushAnswer} symbol="×" hint={keyBindings[1][2]}/>
        <Symbol onClick={pushAnswer} symbol="÷" hint={keyBindings[1][3]}/>

        {#each savedAnswers as item, i}
          <Number smallFit hint={keyBindings[1][i+4]} onClick={(item) => pushAnswer(item, false, true)} item={item} off={!!savedOffStack.find(e => {
            console.error(e);
            return e && e.id === item.id;
          })} small />
        {/each}

        {#each new Array(Math.max(0, 6 - savedAnswers.length)) as _} 
          <Box />
        {/each}
      </div>

    </div>
  </div>
  <div class="controls-holder">
    <Delete onClick={backspace} />
    <Reset onClick={() => reset(true)} />
  </div>

</main>

<style>



  .controls {
    display: flex;
  }

  .symbols {
    display: flex;
  }

  .board, .symbols, .controls-holder {
    display: flex;
    flex-direction: row;
    /*align-items: stretch;*/
    width: 100%;
    /*height: 70px;*/
  }

  .controls-holder * {
    /*flex: 1;*/
  }

  main {
    padding: 0;
    margin: 0;
    height: 100vh;
    max-width: 800px;

    flex: 1;
  }

  .controls-holder {
    display: flex;
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

  }

  * {
    user-select: none;
  }
</style>