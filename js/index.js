
var btn_signin = document.getElementById("signin");
var btn_start_watch = document.getElementById("start_watch");

btn_signin.addEventListener("click", (e) => {
  // prevent the form from submitting
  e.preventDefault();
  
  window.location.href='signin';

});

btn_start_watch.addEventListener("click", (e) => {
  // prevent the form from submitting
  e.preventDefault();
  
  window.location.href='old_room_in';

});