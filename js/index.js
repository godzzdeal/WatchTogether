
// var btn_signin = document.getElementById("signin");
// btn_signin.addEventListener("click", (e) => {
//   // prevent the form from submitting
//   e.preventDefault();
  
//   window.location.href='signin';

// });



var img1 = "img/content/lead/planet-logo.png";
var img2 = "img/content/lead/planet-logo2.png";
var hr = (new Date()).getHours();
$("#main_lend").attr(
  "src", 
  hr > 6 & hr < 18? img1 : img2
);
