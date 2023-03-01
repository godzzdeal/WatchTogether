// import User from 'users';

const express = require("express");
const { createServer, get } = require("http");
const { Server } = require("socket.io");
const User = require('./js/modules/users');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
console.log('Wait, server starting...');

let users = [];
let statusPlayerOnRooms = new Map();
let bufferPackages = 0;

io.on("connection", (socket) => {
  console.log('Connection');

  socket.on('joinRoom', (params, callback) => {
    if (params.un == '' || params.rm == '') {
      callback('Неверные Имя пользователя или комнаты');
    }
    console.log(params.rm);

    try {
      console.log(socket.rooms.has(params.rm));
      socket.join(params.rm);
      socket.nickname = params.un;
      // console.log(socket.rooms)
      users.push(new User(socket.nickname, socket.id, params.rm));
      console.log(io.sockets.adapter.rooms.get(params.rm));
      params.unv = socket.nickname;
      console.log(users);
      // console.log(Array.from(socket.rooms).get(socket.id));
      console.log(socket.rooms.keys());
      socket.emit('validate', params);
      // for (var socketId in io.adapter.rooms[params.rm]) {
      //   console.log(socketId);
      // }
      // var clients = io.sockets.sockets;
      // console.log(clients);
      socket.emit('updateUsers', params);
      console.log(`Joined room: ${params.un} in ${params.rm}`);
    } catch (error) {
      callback(error.message);
      console.log(`Failed joined room: ${error}`);
    }
  });

  socket.on('playContent', function (data) {
    console.log(statusPlayerOnRooms);
    if (statusPlayerOnRooms.length != 0) {
      if (statusPlayerOnRooms.get(data.rm) != true) {
        statusPlayerOnRooms.set(data.rm, true);
      }else{
        return;
      };
    }else{
      statusPlayerOnRooms.set(data.rm, true);
    };
    
    io.in(data.rm).emit('change play', data.un);
  });

  socket.on('pauseContent', function (data) {
    statusPlayerOnRooms.set(data.rm, false);
    console.log(statusPlayerOnRooms);
    io.in(data.rm).emit('change pause', data.un);
  });

  socket.on('setContent', function (data) {
    io.in(data.rm).emit('change content', { un: data.un, path: data.path});
  });

  socket.on('sendTime', function (data) {

    bufferPackages++;
    // console.log(bufferPackages);
    if (bufferPackages == 15) {
      io.sockets.in(data.rm).emit('change time', { time: data.time, master: data.un });
      bufferPackages = 0;
    };


    // setTimeout(() => {

    // }, 5000);
  });

});

app.use(express.static(`${__dirname}/`));
httpServer.listen(process.env.PORT || 3000);
console.log('Server started');

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

