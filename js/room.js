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

  for (var index in usersMap) {
    for (var key in usersMap[index]) {
      let el = document.getElementById(`time_${key}`);
      if (el == undefined) {
        contentUserList(key, usersMap[index][key].time2);
      };
    };
  };
};
function contentUserList(key, time) {

  // create a new li element
  const newLi = document.createElement("li");

  let classesLi = ['list-group-item', 'list-group-item-action', 'px-3', 'd-flex', 'transparent-input', 'justify-content-between', 'align-items-center', 'text-white'];
  newLi.classList.add(...classesLi);

  let classesDiv1 = ['d-flex', 'align-items-center'];
  let newDiv1 = document.createElement("div");
  newDiv1.classList.add(...classesDiv1);

  let classesI = ['bi', 'bi-person-circle', "rounded-circle"];
  let newI = document.createElement("i");
  newI.classList.add(...classesI);
  newI.setAttribute("alt", key);
  newI.setAttribute("width", "45");
  newI.setAttribute("height", "45");
  newDiv1.appendChild(newI);

  let newDiv2 = document.createElement("div");
  let classesDiv2 = ['ms-3'];
  newDiv2.classList.add(...classesDiv2);

  let newP1 = document.createElement("p");
  let classesP1 = ['fw-bold', 'mb-1'];
  newP1.classList.add(...classesP1);
  let newContentP1 = document.createTextNode(key);
  newP1.appendChild(newContentP1);
  newDiv2.appendChild(newP1);

  let newP2 = document.createElement("p");
  let classesP2 = ['text-muted', 'mb-0'];
  newP2.classList.add(...classesP2);
  newP2.setAttribute("id", `time_${key}`);
  let newContentP2 = document.createTextNode(time);
  newP2.appendChild(newContentP2);
  newDiv2.appendChild(newP2);
  newDiv1.appendChild(newDiv2);

  newLi.appendChild(newDiv1);

  const currentDiv = document.getElementsByName("listUsersInRoom");
  currentDiv[0].insertAdjacentElement("beforeend", newLi);
}

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