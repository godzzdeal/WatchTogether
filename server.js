const express = require("express");
const { createServer, get } = require("http");
const { Server } = require("socket.io");
const User = require('./js/modules/users');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const roomVersion = 'beta_primary_room';
const root = 'root_primary_room';
console.log('Wait, server starting...');
const info = require('./package.json');
let statusPlayerOnRooms = new Map();
let thisRoom;
let rooms = new Map();
let bufferPackages = 0;

io.on("connection", (socket) => {
  console.log('Socket connection ->');

  socket.on('joinRoom', (data, callback) => {
    if (data.un == '' || data.rm == '') {
      callback('Неверные Имя пользователя или комнаты');
    };
    try {
      if (data.rm == roomVersion & data.un != root) {
        throw new Error('Невозможно создать или подключится к комнате с таким именем');
      } else if (data.rm == roomVersion & data.un == root) {
        console.log('Init authorization case');
      };
      socket.join(data.rm);
      socket.nickname = data.un;
      socket.room = data.rm;
      socket.version = info.version;
      socket.author = info.author;
      data.version = socket.version;
      data.author = socket.author;
      data.unv = socket.nickname;
      if (data.rm != roomVersion & socket.nickname != root) {
        if (!rooms.has(data.rm)) {
          rooms.set(data.rm, new Map());
        };
        thisRoom = rooms.get(data.rm);
        if (!thisRoom.has(socket.nickname)) {
          thisRoom.set(socket.nickname, { time: 0, time2: '0:00' });
        };
        data.validate_list_users = returnDataInMap(thisRoom);
        primaryData = thisRoom.entries().next().value;
        data.primeUser = primaryData[0];
        console.log('thisRoom: ' + thisRoom.has(socket.nickname));
      };

      socket.emit('validate', data);
      // socket.emit('updateUsers', data);
      io.in(data.rm).emit('updateUsers', data.validate_list_users);
      console.log(`Joined room: ${data.un} in ${data.rm}`);
    } catch (error) {
      callback(error.message);
      console.log(`Failed joined room: ${error}`);
    }
  });

  // Событие отлючения сокета
  socket.on('disconnect', function () {
    console.log(`Disconnect socket ${socket.nickname}`);
    initThisRoom(socket.room);
    if (thisRoom!=undefined) {
      thisRoom.delete(socket.nickname);
      console.log(thisRoom);
    };
  });

  socket.on('playContent', function (data) {
    console.log('[playContent]', statusPlayerOnRooms);
    if (!statusPlayerOnRooms.get(data.rm)) {
      statusPlayerOnRooms.set(data.rm, true);
      io.in(data.rm).emit('change play', data.un);
    };
  });

  socket.on('pauseContent', function (data) {
    console.log('[pauseContent]', statusPlayerOnRooms);
    if (statusPlayerOnRooms.get(data.rm)) {
      statusPlayerOnRooms.set(data.rm, false);
      io.in(data.rm).emit('change pause', data.un);
    };
  });

  socket.on('setContent', function (data) {
    console.log(data.path);
    io.in(data.rm).emit('change content', { un: data.un, path: data.path });
  });

  socket.on('sendTime', function (data) {
    bufferPackages++;
    primaryData = getPrimaryUserRoom(data.rm);
    if (bufferPackages < 50) {
      return;
    };
    if (socket.nickname == primaryData.pUser) {
      primaryData.pTime.time = data.time;
      thisRoom.set(socket.nickname, primaryData.pTime);
      console.log('[sendTime]', `time send to (${socket.nickname}) prime (${primaryData.pUser})`);
      io.sockets.in(data.rm).emit('change time', { time: data.time, primary: primaryData.pUser });
      bufferPackages = 0;
    } else {
      // console.log('[sendTime]', `time send to (${socket.nickname}) prime (${primaryData.pUser})`);
      // io.sockets.in(data.rm).emit('change time', { time: data.time, primary: primaryData.pUser });
      // bufferPackages = 0;
    };

  });

  socket.on('sendTimeTwo', function (data) {
    updateUserList(data, socket);
  });
});

function updateUserList(data, client) {

  primaryData = getPrimaryUserRoom(data.rm);
  console.log('[Rooms]', rooms);
  if (thisRoom.get(data.un).time2 == data.time) {
    return;
  };
  console.log('[updateUserList]', thisRoom.get(primaryData.pUser));
  // if (data.un == primaryData.pUser) {
    primaryData.pTime.time2 = data.time;
  // };
  thisRoom.set(data.un, primaryData.pTime);

  io.sockets.in(data.rm).emit('change updateListTime', { list: returnDataInMap(thisRoom), user: client.nickname });
};

function getPrimaryUserRoom(room) {
  initThisRoom(room);
  primaryData = thisRoom.entries().next().value;
  return { pUser: primaryData[0], pTime: primaryData[1] };
};

function initThisRoom(room) {
  thisRoom = rooms.get(room);
};

function returnDataInMap(usersMap) {
  let data = [];
  let element = {};
  console.log(data);
  console.log(usersMap);
  usersMap.forEach((value, key, map) => {
    element[key] = value;
    data.push(element);
  });
  console.log(data);
  return data;
};

app.use(express.static(`${__dirname}/`));
httpServer.listen(process.env.PORT || 3000);
console.log('Server started');

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/room', function (req, res) {
  res.sendFile(`${__dirname}/room.html`);
});