const WebSocket = require('ws');

const port = 2000;
const wss = new WebSocket.Server({ port });
console.log("running on " + port)
let clients = [];

wss.on('connection', (ws, req) => {
  let lastRoundPoints = 0;
  var [_,roomId, userId, name] = req.url.split("/")
  if (!clients[roomId]) {
    clients[roomId.toString()] = [];
  }

  // If this user is already here, overwrite
  let overallScore = {overallScore: 0, userId};
  if (clients[roomId][userId]) {
    clients[roomId][userId].ws.close();
    // Save their score
    overallScore = clients[roomId][userId].overallScore;
  } else {
    if (clients[roomId].length >= 2) {

      // TODO: Not handled on client yet
      ws.send(JSON.stringify({
        type: "full",
      }))

      return;
    }
  }

  clients[roomId][userId.toString()] = ({ws, name, overallScore, score: 0});

  const removePlayer = (room, playerId) => {
    delete room[playerId];
  }
  

  const sendPlayerRegistered = (roomId) => {
    Object.entries(clients[roomId]).map(([playerId, player]) => {
      if (!player.ws) return;
      if (player.ws.readyState === 3) {
        removePlayer(clients[roomId], playerId);
      } else {
        player.ws.send(JSON.stringify({
          type: "playerRegistered",
          names: getPlayerNames(roomId),
        }));
      }
    })
  }

  const getPlayerNames = (roomId) => {
    return Object.entries(clients[roomId]).map((client) => {
      return {userId: client[0], name: client[1].name};
    }).filter(e => e.name !== undefined);
  }

  sendPlayerRegistered(roomId);

  const populateAndSendOut = (message, endRound = false) => {
    if (!clients[message.roomId].items) {
      clients[message.roomId].items = {
        numbers: message.numbers,
        target: message.target,
      }
    }

    /*
      sends:
      {
        data: {
          numbers,
          target,
          names,
        },
      }
    */
    // Send the new info to all players
    Object.keys(clients[message.roomId]).forEach((uId) => {
      if (clients[message.roomId][uId] && clients[message.roomId][uId].ws) {
          clients[message.roomId][uId].ws.send(JSON.stringify({
            type: "populate",
            data: clients[message.roomId]["items"],
            overallScores: getOverallScores(message.roomId),
            names: getPlayerNames(message.roomId)
          }))

        if (endRound) {
          console.log('33', Math.max(0, 10 - clients[message.roomId][uId].score))
          clients[message.roomId][uId].ws.send(JSON.stringify({
            type: "roundOver",
            data: clients[message.roomId]["items"],
            score: clients[message.roomId][uId].score,
            overallScores: getOverallScores(message.roomId),
          }));
        }
      }
    });
  }

  const getOverallScores = (roomId) => {
    let x = Object.entries(clients[roomId]).map((item) => {
      if (item[1].overallScore) {
        return item[1].overallScore;
      }
    }).filter(e => e !== undefined)

    return x;
  }

  ws.on('message', (message) => {
    // console.log(JSON.stringify(message));
    message = JSON.parse(message);
    /*
      All messages expect:
      {
        roomId,
        userId,
      }
    */
    switch (message.type) {
      case "score":
        /*
          This is for the ingame score, the overall score is referred to as "overallScore"
          and is saved on the user in the array.

          expecting:
          {
            score
          }
        */
        Object.keys(clients[message.roomId]).forEach((userId) => {
          if (message.userId !== userId) {
            if (clients[message.roomId][userId]
              && clients[message.roomId][userId].ws) {
              clients[message.roomId][userId].ws.send(JSON.stringify({
                type: "score",
                score: message.score,
              }));
            }
          } else {
            clients[message.roomId][userId].score = message.score;
          }
        });
        break;
      case "populate":
        /*
          expecting:
          {
            numbers,
            target,
            name,
          }
        */
        // Todo: catch this properly
        try {
          populateAndSendOut(message);
        } catch (e) {
          setTimeout(() => populateAndSendOut(message), 100);
        }

        break;
      case "win":
        /*
          expecting:
          {
            numbers,
            target,
            name,
            score,
          }
        */

        delete clients[message.roomId].items;
        console.log(clients[message.roomId][userId].score);
        const otherUserId = getOtherUserId(message.roomId);
        console.log(clients[message.roomId][otherUserId].score);

        clients[message.roomId][userId].score = message.score
        incrementOverallScore(clients[message.roomId], message.userId, message.score);
        incrementOverallScore(clients[message.roomId], otherUserId, clients[message.roomId][otherUserId].score);
        
        populateAndSendOut(message, true);
        
        clients[message.roomId][userId].score = 0;
        clients[message.roomId][otherUserId].score = 0;
        break;
    }
  });

  const getOtherUserId = (roomId) => {
    return Object.keys(clients[roomId]).find(id => id !== userId && id.startsWith("id"));
  }

  const incrementOverallScore = (room, userId, scoreInc) => {
    if (room[userId] && room[userId].overallScore) {
      room[userId].overallScore.overallScore += scoreInc;
    }
  }

  // setInterval(() => ws.send('hi'), 100);

  // ws.send('something');
});