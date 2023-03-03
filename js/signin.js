
var form = document.getElementById("signin");

form.addEventListener("submit", (e) => {
  // prevent the form from submitting
  e.preventDefault();

  // show the form values
  const formData = new FormData(form);
  var xhr = new XMLHttpRequest();
  //open the request
  xhr.open('POST', 'api/signin')
  xhr.setRequestHeader("Content-Type", "application/json");

  //send the form data
  data = JSON.stringify(Object.fromEntries(formData));
  xhr.send(data);

  xhr.onload = function() {
    alert(`Ответ: ${xhr.status} ${xhr.response}`);
  };
  
  xhr.onerror = function() { // происходит, только когда запрос совсем не получилось выполнить
    alert(`Ошибка соединения`);
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      //form.reset(); //reset form after AJAX success or do something else
    }
  }
  //Fail the onsubmit to avoid page refresh.
  return false;
});