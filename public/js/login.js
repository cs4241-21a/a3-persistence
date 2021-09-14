const { application } = require("express")

const login = function (e) {
    
    e.preventDefault()

    const username = document.querySelector('#username'),
    const password = document.querySelector('#password');

    if (username.value === "" || password.value === "") {
        console.log("Incorrect username or password");
        alert("Enter a valid username and password");
        return false
    }

    json = {username: username.value, password: password.value}
    body = JSON.stringify(json);

    fetch( '/login', {
        method: 'POST',
        body: body, 
        headers: {
            "Content-Type": "application/json"
        }
    })

    .then(reponse => {
        if(reponse.ok) {
            window.location.href = "index.html";
        }
    })

    return false
}

const logout = function(e) {
    fetch( '/logout');
}
 
window.onload = function() {

    logout();

    const loginBtn = document.getElementById('loginBtn');
    loginBtn.onclick = login;

    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
}