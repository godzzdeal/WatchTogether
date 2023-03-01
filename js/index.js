let socket = io.connect();
let root = 'root_primary_room';
let room = 'beta_primary_room';
let version;

socket.on('connect', function () {
  console.log('Client connect socket');
  socket.emit('joinRoom', { un: root, rm: room }, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
  });

  socket.on('validate', function (data) {
    console.log('Validation');
    document.getElementsByName('version_footer')[0].innerHTML = data.version;
    document.getElementsByName('version_header')[0].innerHTML = data.version;
    document.getElementsByName('author_footer')[0].innerHTML = data.author;
  });
});