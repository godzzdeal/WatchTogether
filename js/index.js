
var btn_signin = document.getElementById("signin");

btn_signin.addEventListener("click", (e) => {
  // prevent the form from submitting
  e.preventDefault();
  
  window.location.href='signin';

});