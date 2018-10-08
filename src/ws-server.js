if (process.env.NODE_ENV === 'development') require('dotenv').config();


import app from './http-server';
const server = require('http').createServer(app);
const socketServer = require('socket.io');
const io = socketServer(server);
const port = process.env.PORT || 1337;
server.listen(port, () => {console.log('server started')});

let history = [];

function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const handleIO = (socket) => {
  const disconnected = () => {
      console.log("Client Disconnected")
  };

  socket.on('disconnect', disconnected);

  socket.on('user_name', (msg) => {
      if (history.length > 0) {
          const json = JSON.stringify({"type": 'history', "data": history});
          socket.emit('new_message',  json);

      }
      const historyObj = {
          time: (new Date()).getTime(),
          text: "Thanks for logging in",
          author: msg.clientMsg,
      };
      history.push(historyObj);
      history = history.slice(-100);
      const json = JSON.stringify({"type": 'message', "data":historyObj});
      io.emit('new_message', json);
  });

  socket.on('message', (msg) => {
      if (msg.clientMsg === "deleteall") {
          history =[];
      }
      const historyObj = {
          time: (new Date()).getTime(),
          text: htmlEntities(msg.clientMsg),
          author: htmlEntities(msg.userName),
      };

      history.push(historyObj);
      history = history.slice(-100);
      const json = JSON.stringify({type: 'message', data: historyObj });
      io.emit('new_message', json);
  });
};

io.on('connection', handleIO);