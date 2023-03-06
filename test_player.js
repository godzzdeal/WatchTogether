let socket = io.connect();
let userName;
let room;
let player;
let isPlaying;
let newPath;

window.addEventListener("message", function (event) {
  if (!socket.connected || player == undefined) return;
  socket.emit('sendTime', { un: userName, rm: room, time: player.api('time') })
  socket.emit('sendTimeTwo', { un: userName, rm: room, time: player.api('time2') })
});

document.getElementById("player").addEventListener("play", onPlay);
document.getElementById("player").addEventListener("pause", onPause);
document.getElementById("addUrlToPlayer").addEventListener("click", initContentPlayer);

function onPlay() {
  socket.emit('playContent', { un: userName, rm: room });
};

function onPause() {
  socket.emit('pauseContent', { un: userName, rm: room });
};

function initParametrs() {
  let search = window.location.search.substring(1);
  let params ={Username: 'test', Room: 'test'};
  return params;
};

function initPlayer(file = '') {
  if (player != undefined) {
    player.api('file', file);
  } else {
    player = new Playerjs({ id: "player", file: file }); //"https://www.youtube.com/embed/iYGz93bKkn0"
  }
};

function joinRoom() {
  let params = initParametrs();
  socket.emit('joinRoom', { un: params.Username, rm: params.Room }, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
  })
};

socket.on('connect', function () {

  joinRoom();

  socket.on('validate', function (data) {
    userName = data.unv;
    room = data.rm;
    initPlayer();
  });

  socket.on('change play', function (user) {
    console.log('[Emit]', user + ' begin play content');
    if (user != userName) {
      player.api('play');
    }
  });

  socket.on('change pause', function (user) {
    console.log('[Emit]', user + ' begin pause content');
    if (user != userName) {
      player.api('pause');
    };
  });

  socket.on('change content', function (data) {
    console.log('[Emit]', data.un + ' begin load content');
    initPlayer(data.path);
  });

  socket.on('change time', function (data) {
    if (data.primary != userName) {
      console.log('[Emit]', 'room taken time content');
      player.api('seek', data.time);
    }
  });


});

function playContent() {
  socket.emit('playContent', { un: userName, rm: room })
};

function initContentPlayer() {
  newPath = GetFile();
  setFile();
};

function GetFile() {
  return document.getElementById('urlVideo').value;
};

function setFile() {
  console.log(newPath);
  socket.emit('setContent', { un: userName, rm: room, path: newPath })
};
