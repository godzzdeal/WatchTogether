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
document.getElementById("disconnectRoom").addEventListener("click", disconnectRoom);

function onPlay() {
  socket.emit('playContent', { un: userName, rm: room });
};

function onPause() {
  socket.emit('pauseContent', { un: userName, rm: room });
};

function initParametrs() {
  let search = window.location.search.substring(1);
  let params = JSON.parse('{"' + decodeURI(search).replace(/&/g, '","').replace(/\+/g, '').replace(/=/g, '":"') + '"}');
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
    document.getElementsByName('version_footer')[0].innerHTML = data.version;
    document.getElementsByName('version_header')[0].innerHTML = data.version;
    document.getElementsByName('author_footer')[0].innerHTML = data.author;
    document.getElementsByName('roomServer')[0].innerHTML = data.rm;
    document.getElementsByName('userServer')[0].innerHTML = data.unv;
    if (data.primeUser == userName) {
      document.getElementsByName('userServer')[0].setAttribute('class', 'badge bg-warning text-dark');
    };
    document.getElementsByName('listUsersInRoom')[0].innerHTML = '';
    document.getElementsByName('mainPreloader')[0].hidden = true;


    initPlayer();
  });

  socket.on('change play', function (user) {
    console.log('[Emit]', user + ' begin play content');
    if (user != userName) {
      player.api('play');
    }
  });

  socket.on('updateUsers', function (map) {
    console.log('[update_users]', map);
    createElementInListUser(map);
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

  socket.on('change updateListTime', function (data) {
    if (data.user == userName) {
      console.log('[Emit]', 'room taken update user list');
      updateTimeUser(data.list, data.user);
    };
  });

});

function playContent() {
  socket.emit('playContent', { un: userName, rm: room })
};

function disconnectRoom() {
  window.location.href = '/';
};

function createElementInListUser(usersMap, primary) {
  let classC = 'list-group-item bg-dark d-flex justify-content-between align-items-center href-viewer';
  for (var index in usersMap) {
    for (var key in usersMap[index]) {
      let el = document.getElementById(`time_${key}`);
      if (el == undefined) {
        let span_class = index == 0 & primary == userName ? 'badge bg-warning' : 'badge bg-primary';
        let new_content = `<a href="#" class="${classC}">${key} <span class="${span_class} rounded-pill" id="time_${key}">${usersMap[index][key].time2}</span></a> `;
        document.getElementsByName('listUsersInRoom')[0].insertAdjacentHTML('afterbegin', new_content);
      };
    };
  };
};

function updateTimeUser(usersMap) {
  for (var index in usersMap) {
    for (var key in usersMap[index]) {
      let el = document.getElementById(`time_${key}`);
      if (el != undefined) {
        console.log('[update time]', `user ${key} init time ${usersMap[index][key].time2}`);
        el.innerText = usersMap[index][key].time2;
      };
    };
  };
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

function parseUrl_old() {
  checked = document.querySelector('input[name="options"]:checked').value;
  url = document.getElementById('urlVideo').value;
  if (checked == "YT") {
    let preset = 'https://www.youtube.com/embed/';
    let videoID = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)[1];
    return preset + videoID;
  } else if (checked == "URL") {
    return url;
  };
}