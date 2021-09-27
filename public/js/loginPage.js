window.onload = function () {
    fetch('/redirectToEdit', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(json => {
        if (json.redirect) {
            window.location.replace("/edit.html");
        }
    })


    const signIn = document.getElementById("signInButton");
    signIn.onclick = signInFunction;

    const register = document.getElementById("registerAccountButton");
    register.onclick = registerFunction;
}

const signInFunction = function (event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    let data = {
        username: username,
        password: password
    }

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => {
        console.log("Within JSON");
        return res.json();
    }).then(json => {
        console.log("Back at JSON!");

        document.getElementById("loginUsername").value = "";
        document.getElementById("loginPassword").value = "";

        console.log(json.loginSuccess);
        if (json.loginSuccess) {
            window.location.replace("/edit.html");
        } else {
            alert("Incorrect username or password!");
        }
    })
}

const registerFunction = function (event) {
    event.preventDefault();
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;

    if (username.trim() === "" || password.trim() === "") {
        document.getElementById("registerUsername").value = "";
        document.getElementById("registerPassword").value = "";
        alert("Your username or password cannot be empty or whitespace!");
    } else {
        let data = {
            username: username,
            password: password
        }

        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => {
            return res.json();
        }).then(json => {
            document.getElementById("registerUsername").value = "";
            document.getElementById("registerPassword").value = "";

            if (json.registrationSuccess) {
                alert("Your account has been successfully registered!");
                window.location.replace("/edit.html");
            } else {
                alert("The username " + username + " is already taken!");
            }
        })
    }
}