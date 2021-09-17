document.getElementById("loginForm").onsubmit = function() {
    localStorage["username"] = document.getElementById("loginForm").elements["username"].value;
}

// let submitButton = document.getElementById("submit");
// let loginForm = document.getElementById("loginForm");
// let wrongUserText = document.getElementById("wrongUserMessage");

// submitButton.addEventListener("click", event => {

//     // stop our form submission from refreshing the page
//     event.preventDefault();

//     const inputUsername = document.querySelector('#username').value
//     const inputPassword = document.querySelector('#password').value

//     fetch("/login", {
//             method: "POST", //tells it to use the post method
//             body: JSON.stringify({ "username": inputUsername, "password": inputPassword }),
//             headers: {
//                 //bodyparser only kicks in if the content type is application/json
//                 "Content-Type": "application/json"
//             }
//         })
//         .then(response => response.json())
//         .then(json => {
//             if (json.correctUser === 0) {
//                 wrongUserText.append("Incorrect Username or Password")
//             } else {
//                 wrongUserText.innerHTML = ''
//             }
//         })

//     // reset form
//     loginForm.reset();
// });