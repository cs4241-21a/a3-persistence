const login = function (e) {
    
    e.preventDefault()

    const username = document.querySelector('#username'),
    password = document.querySelector('#password');

    //Error checking that the user enters both fields
    if (username.value === "" || password.value === "") {
        alert("Enter a valid username and password");
        return false
    }

    json = {username: username.value, password: password.value}
    body = JSON.stringify(json);

    fetch( '/login', {
        method: 'POST',
        body: body, 
        headers: {"Content-Type": "application/json"}
    })
    .then(response => response.json())
    .then(user => {
      if (user.length == 0) {
        window.alert("Username or password is incorrect");
      } else {
        window.location.href = "index.html";
      }
    });
    return false
}

const signup = function (e) {

    e.preventDefault()

    const username = document.getElementById('username'),
    password = document.getElementById('password');

    //Error checking that the user signs-up with valid fields
    if (username.value === "" || password.value === "") {
        alert("Enter a valid username and password");
        return false
    }

    json = {username: username.value, password: password.value}
    body = JSON.stringify(json)

    fetch('/signin', {
        method: 'POST',
        body: body,
        headers: {"Content-Type" : "application/json"}
    })
    .then(response => response.json())
    window.location.href = "index.html"
}

window.onload = function() {

    const loginBtn = document.getElementById('loginBtn');
    loginBtn.onclick = login;

    const signUpBtn = document.getElementById('signUp')
    signUpBtn.onclick = signup;
}