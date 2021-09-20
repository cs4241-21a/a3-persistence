//make two functions, one for login and one for register
//assign those to proper buttons on load

const register = function (e) {
    e.preventDefault()
    let pw = document.getElementById("p").value;
    let un = document.getElementById("u").value;

    json = { u: un, p: pw },
        body = JSON.stringify(json)
    fetch('/register', {
        method: 'POST',
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (data) {
            if (data.failed === "exists") {
                alert("That username already exists. Please try a different one or log in.")
            }
            else if (data.failed === "empty") {
                alert("The username or password cannot be left empty.")
            }
            else {
                debugger
                //WHY DOESNT THIS WORK?
                login(e);
            }
            console.log(data);
            //addRows(data);
        })
}

const login = function (e) {
    console.log("LOGIN CALLED");
    e.preventDefault()
    let pw = document.getElementById("p").value;
    let un = document.getElementById("u").value;

    json = { u: un, p: pw },
        body = JSON.stringify(json)
    fetch('/login', {
        method: 'POST',
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            console.log(response);
            //debugger
            test = null
            //test = response.json()
            return test;
        }).then(function (data) {
            if (data != null) {
                console.log("hi");
                if (data.failed === "incorrect") {
                    alert("Username or password is incorrect. Please try again.")
                }
            }
        })
}

window.onload = function () {
    const lbutton = document.getElementById("login");
    const rbutton = document.getElementById("register");
    lbutton.onclick = login;
    rbutton.onclick = register;
}