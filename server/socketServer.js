const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 1337 });

let server = http.createServer(function(request, response) {});

server.listen(1338, function() {});

let wss = new webSocketServer({
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});

let clients = [];

wss.on('connection', (ws, req) => {
  let lastRoundPoints = 0;
  var [_, roomId, userId, name] = req.url.split("/")
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

  clients[roomId][userId.toString()] = ({ws, name, overallScore});

  

  const sendPlayerRegistered = (roomId) => {
    Object.values(clients[roomId]).map((item) => {
      console.log(getPlayerNames(roomId));
      if (!item.ws) return;
      item.ws.send(JSON.stringify({
        type: "playerRegistered",
        names: getPlayerNames(roomId),
      }));
    })
  }

  const getPlayerNames = (roomId) => {
    return Object.entries(clients[roomId]).map((client) => {
      return {userId: client[0], name: client[1].name};
    }).filter(e => e.name !== undefined);
  }

  // We don't need this right away, can cause crashes
  setTimeout(() => {
    sendPlayerRegistered(roomId);
  }, 100);

  const populateAndSendOut = (message, endRound = false) => {
    if (!clients[message.roomId]["items"]) {
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
      console.log("here 2")
      console.log(getPlayerNames(message.roomId));
      if (clients[message.roomId][uId] && clients[message.roomId][uId].ws) {
        clients[message.roomId][uId].ws.send(JSON.stringify({
          type: "populate",
          data: clients[message.roomId]["items"],
          overallScores: getOverallScores(message.roomId),
          names: getPlayerNames(message.roomId)
        }));

        if (endRound) {
          console.log('================')
          clients[message.roomId][uId].ws.send(JSON.stringify({
            type: "roundOver",
            data: clients[message.roomId]["items"],
            points: uId === userId ? lastRoundPoints : 0,
            overallScores: getOverallScores(message.roomId),
          }));
          
          if (uId === userId) {
            lastRoundPoints = 0;
          }
        }
      }
    });
  }

  const getOverallScores = (roomId) => {
    let x = Object.entries(clients[roomId]).map((item) => {
      if (item[1].overallScore) {
        console.log(overallScore)
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
         
          if (message.userId != userId) {
            clients[message.roomId][userId]
            && clients[message.roomId][userId].ws
            && clients[message.roomId][userId].ws.send(JSON.stringify({
              type: "score",
              score: message.score,
            }));
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
          }
        */

        delete clients[message.roomId].items;

        incrementScore(clients[message.roomId], message.userId, 10);
        populateAndSendOut(message, true);
        break;
    }
  });

  const incrementScore = (room, userId, scoreInc) => {
    lastRoundPoints = scoreInc;
    console.assert(room && userId && scoreInc);

    if (room[userId] && room[userId].overallScore) {
      room[userId].overallScore.overallScore += scoreInc;
      console.log(room[userId].overallScore, 'sss');
    }
  }

  // setInterval(() => ws.send('hi'), 100);

  // ws.send('something');
});