let socket = io.connect();
let userName;
let room;
let player;
let isPlaying;
let newPath;

window.addEventListener("message", function (event) {
  //  console.log(event.data);
  if (typeof event.data != 'string') {
    return;
  };
  let data = JSON.parse(event.data);
  isPlaying = player.api('playing');
  if (isPlaying) {
    socket.emit('playContent', { un: userName, rm: room });
  } else {
    socket.emit('pauseContent', { un: userName, rm: room });
  };
  if (data.info.currentTime != undefined & isPlaying) {
    let playerTime = data.info.currentTime;
    sendTime(playerTime);
  };
});

// document.getElementById("player").addEventListener("file",setFile);

function initParametrs() {
  let search = window.location.search.substring(1);
  let params = JSON.parse('{"' + decodeURI(search).replace(/&/g, '","').replace(/\+/g, '').replace(/=/g, '":"') + '"}');
  return params;
};

function initPlayer() {
  player = new Playerjs({ id: "player", file: "http://www.youtube.com/embed/J3qD4pAcWc0" });
  // document.getElementById("player").addEventListener("play", this);
};

function timePlayer() {
  console.log(player.api('time'));
  console.log(player.api('time2'));
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

  socket.on('validate', function (params) {
    userName = params.unv;
    room = params.rm;
    document.getElementsByName('roomServer')[0].innerHTML = params.rm;
    document.getElementsByName('userServer')[0].innerHTML = params.unv;
    document.getElementsByName('listUsersInRoom')[0].innerHTML = '';
    // document.getElementsByName('listUsersInRoom')[0].innerHTML += createElementInListUser();
    createElementInListUser();
    initPlayer();
    document.getElementsByName('mainPreloader')[0].hidden = true;
  });

  socket.on('updateUsers', function (data) {

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
    }
  });

  socket.on('change content', function (data) {
    console.log('[Emit]', data.un + ' begin load content');
    player = new Playerjs({ id: "player", file: data.newPath });
  });

  socket.on('change time', function (data) {
    console.log('[Emit]', 'room taken time content');
    createElementInListUserByEmit(data);
    if (data.master != userName) {
      player.api('seek', data.time);
    }
  });
});

function sendTime(time) {
  document.getElementById('time_' + userName).innerText = player.api('time2');
  socket.emit('sendTime', { un: userName, rm: room, time: time })
};

function playContent() {
  socket.emit('playContent', { un: userName, rm: room })
};

function createElementInListUser() {
  let content = '<li class="list-group-item d-flex justify-content-between align-items-center bg-dark">' +
    userName +
    '<span class="badge bg-primary rounded-pill" id="time_' + userName + '">00:00</span></li>';

  document.getElementsByName('listUsersInRoom')[0].insertAdjacentHTML('afterbegin', content);
};

function createElementInListUserByEmit(data) {

  let el = document.getElementsByName('time_' + data.master)[0];
  if (el == undefined) {
    return
  };
  el.remove();
  let content = '<li class="list-group-item d-flex justify-content-between align-items-center bg-dark">' +
    data.master +
    '<span class="badge bg-primary rounded-pill" id="time_' + data.master + '">' + data.time + '</span></li>';

  document.getElementsByName('listUsersInRoom')[0].insertAdjacentHTML('afterbegin', content);
};

function initContentPlayer() {
  newPath = GetFile();
  setFile();
}


function GetFile() {
  checked = document.querySelector('input[name="options"]:checked').value;
  url = document.getElementById('urlVideo').value;
  if (checked == "YT") {
    let preset = 'https://www.youtube.com/embed/';
    let videoID = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)[1];
    return preset + videoID;
  } else if (checked == "URL") {
    return url;
  }
}

function setFile() {
  console.log(newPath);
  socket.emit('setContent', { un: userName, rm: room, path: newPath })
}