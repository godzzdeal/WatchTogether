addEventListener("DOMContentLoaded", (event) => {
    var form = document.getElementById("signup");

    const password = document.getElementById("typePasswordX");
    const passwordR = document.getElementById("typePasswordRepeatX");
    const passwordAlert = document.getElementById("password-alert");
    const requirements = document.querySelectorAll(".requirements");
    let lengBoolean, bigLetterBoolean, numBoolean, specialCharBoolean;
    let leng = document.querySelector(".leng");
    let bigLetter = document.querySelector(".big-letter");
    let num = document.querySelector(".num");
    let specialChar = document.querySelector(".special-char");
    const specialChars = "!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~";
    const numbers = "0123456789";

    form.addEventListener("submit", (e) => {
        // prevent the form from submitting
        e.preventDefault();

        // show the form values
        const formData = new FormData(form);
        var xhr = new XMLHttpRequest();
        //open the request
        xhr.open('POST', 'api/signup')
        xhr.setRequestHeader("Content-Type", "application/json");

        //send the form data
        data = JSON.stringify(Object.fromEntries(formData));
        xhr.send(data);

        xhr.onload = function () {
            alert(`Ответ: ${xhr.status} ${xhr.response}`);
        };

        xhr.onerror = function () { // происходит, только когда запрос совсем не получилось выполнить
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

    requirements.forEach((element) => element.classList.add("wrong"));

    password.addEventListener("focus", () => {
        passwordAlert.classList.remove("d-none");
        if (!password.classList.contains("is-valid")) {
            password.classList.add("is-invalid");
        }
        passwordAlert.classList.add("border-danger"); //alert-warning
    });

    passwordR.addEventListener("focus", () => {
        passwordAlert.classList.remove("d-none");
        if (!password.classList.contains("is-valid")) {
            password.classList.add("is-invalid");
        }
        passwordAlert.classList.add("border-danger"); //alert-warning
    });

    password.addEventListener("input", () => {
        let value = password.value;
        if (value.length < 6) {
            lengBoolean = false;
        } else if (value.length > 5) {
            lengBoolean = true;
        }

        if (value.toLowerCase() == value) {
            bigLetterBoolean = false;
        } else {
            bigLetterBoolean = true;
        }

        numBoolean = false;
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < numbers.length; j++) {
                if (value[i] == numbers[j]) {
                    numBoolean = true;
                    break;
                }
            }
        }

        specialCharBoolean = false;
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < specialChars.length; j++) {
                if (value[i] == specialChars[j]) {
                    specialCharBoolean = true;
                    break;
                }
            }
        }

        if (lengBoolean == true && bigLetterBoolean == true && numBoolean == true && specialCharBoolean == true) {
            password.classList.remove("is-invalid");
            password.classList.add("is-valid");

            requirements.forEach((element) => {
                element.classList.remove("wrong");
                element.classList.add("good");
            });
            passwordAlert.classList.remove("border-danger");
            passwordAlert.classList.add("border-success");
        } else {
            password.classList.remove("is-valid");
            password.classList.add("is-invalid");

            passwordAlert.classList.add("border-danger");
            passwordAlert.classList.remove("border-success");

            if (lengBoolean == false) {
                leng.classList.add("wrong");
                leng.classList.remove("good");
            } else {
                leng.classList.add("good");
                leng.classList.remove("wrong");
            }

            if (bigLetterBoolean == false) {
                bigLetter.classList.add("wrong");
                bigLetter.classList.remove("good");
            } else {
                bigLetter.classList.add("good");
                bigLetter.classList.remove("wrong");
            }

            if (numBoolean == false) {
                num.classList.add("wrong");
                num.classList.remove("good");

            } else {
                num.classList.add("good");
                num.classList.remove("wrong");
            }

            if (specialCharBoolean == false) {
                specialChar.classList.add("wrong");
                specialChar.classList.remove("good");
            } else {
                specialChar.classList.add("good");
                specialChar.classList.remove("wrong");

            }
        }
    });

    password.addEventListener("blur", () => {
        passwordAlert.classList.add("d-none");
    });


    passwordR.addEventListener("input", () => {
        let value = passwordR.value;
        if (value == password.value) {
            passwordsMatch = true;
        } else {
            passwordsMatch = false;
        }

        if (passwordsMatch == true) {
            passwordR.classList.remove("is-invalid");
            passwordR.classList.add("is-valid");

            // requirements.forEach((element) => {
            //     element.classList.remove("wrong");
            //     element.classList.add("good");
            // });
            passwordAlert.classList.remove("border-danger");
            passwordAlert.classList.add("border-success");
        } else {
            passwordR.classList.remove("is-valid");
            passwordR.classList.add("is-invalid");

            passwordAlert.classList.add("border-danger");
            passwordAlert.classList.remove("border-success");
        }
    });

    passwordR.addEventListener("blur", () => {
        passwordAlert.classList.add("d-none");
    });
});

