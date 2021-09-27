let usernameBox = document.getElementById("usernameBox")
let passwordBox = document.getElementById("passwordBox")
let usernameBoxLogin = document.getElementById("usernameBoxLogin")
let passwordBoxLogin = document.getElementById("passwordBoxLogin")

function register() {
    if ((usernameBox.value === "") || (passwordBox.value === "")) {
        window.alert("There are fields that you still need to fill out!")
    } else {
        document.getElementById("registerForm").submit();
    }
}

function login() {
    if ((usernameBoxLogin.value === "") || (passwordBoxLogin.value === "")) {
        window.alert("There are fields that you still need to fill out!")
    } else {
        document.getElementById("loginForm").submit();
    }
}