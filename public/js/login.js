const login = function (e) {
    
    e.preventDefault()

    const username = document.querySelector('#username'),
    password = document.querySelector('#password');

    //Error checking that the user enters both fields
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
    //Launches the homepage
    .then(response => {
        if(response.ok) {
            console.log("response:", response)
            window.location.href = "index.html"
        } else {
            alert("Network Error")
        }
    })
    return false
}
 
window.onload = function() {

    const loginButton = document.getElementById('loginBtn');
    loginButton.onclick = login;

    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
}