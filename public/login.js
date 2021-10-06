const login = function (e) {

    e.preventDefault()

    const username = document.querySelector('#username'),
        password = document.querySelector('#password');

    if (username.value === "" || password.value === "") {
        alert("Please fill out both fields.");
        return false;
    }

    let json = { username: username.value, password: password.value },
        body = JSON.stringify(json);

    fetch('/signin', {
        method: 'POST',
        body: body,
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(user => {
            if (user.length == 0) {
                window.alert("Username or password is incorrect!");
            } else {
                window.location.href = "/index";
            }
        });
    return false
}

const signup = function (e) {

    e.preventDefault()

    const username = document.getElementById('username'),
        password = document.getElementById('password');

    if (username.value === "" || password.value === "") {
        alert("Please fill out both fields.");
        return false;
    }

    let json = { username: username.value, password: password.value },
        body = JSON.stringify(json);

    fetch('/signup', {
        method: 'POST',
        body: body,
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
    window.location.href = "/index";
}

window.onload = function () {

    const loginBtn = document.getElementById('loginBtn');
    loginBtn.onclick = login;

    const signupBtn = document.getElementById('signupBtn')
    signupBtn.onclick = signup;
}