let userAlert = document.getElementById("userAlert")

document.getElementById("loginForm").onsubmit = function() {
    localStorage["username"] = document.getElementById("loginForm").elements["username"].value;
}

document.getElementById("create").onclick = function() {
    let currUsername = document.getElementById("loginForm").elements["username"].value
    let currPassword = document.getElementById("loginForm").elements["password"].value
    if (currUsername === "" || currPassword === "") {
        userAlert.classList.add("alert-danger")
        userAlert.classList.remove("alert-success", "d-none")
        userAlert.innerHTML = "Please fill in all fields."
    } else {
        fetch("/addUser", {
                method: "POST", //tells it to use the post method
                body: JSON.stringify({ "username": currUsername, "password": currPassword }),
                headers: {
                    //bodyparser only kicks in if the content type is application/json
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json()) // parse the JSON from the server
            .then(result => {
                console.log("newUser: ", result.newUser)
                if (parseInt(result.newUser) === 1) {
                    userAlert.classList.remove("alert-danger", "d-none")
                    userAlert.classList.add("alert-success")
                    userAlert.innerHTML = "Your account has been created. Please login again."
                } else {
                    userAlert.classList.add("alert-danger", "d-none")
                    userAlert.classList.remove("alert-success")
                    userAlert.innerHTML = "This username is already taken. Please choose a different username."
                }
            });
    }
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