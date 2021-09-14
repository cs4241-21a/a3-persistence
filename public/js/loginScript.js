const submitBtn = document.getElementById('submit');
const createBtn = document.getElementById('submitCreate')

//Makes post and sends to server.

const makePageBody = function () {
    const username = document.getElementById('username');
    const password = document.getElementById('passwd');
    const json = {
        username: username.value,
        password: password.value
    };
    return JSON.stringify(json);
};

const makePageBody2 = function () {
    const username = document.getElementById('usernameCreate');
    const password = document.getElementById('passwdCreate');
    const json = {
        username: username.value,
        password: password.value
    };
    return JSON.stringify(json);
};

const makePost = function () {
    let body = makePageBody();
    let jsonBody = JSON.parse(body);
    let warning = document.getElementById('warning2');

    if (jsonBody['username'] === ""
        || jsonBody['password'] === "") {
        warning.innerHTML = "You must fill in all fields.";
    } else {
        warning.innerHTML = "";
        console.log(JSON.stringify(jsonBody))
        console.log(jsonBody)
        const len = (new TextEncoder().encode(JSON.stringify(jsonBody))).length
        fetch('/user/login', {
            method: 'POST',
            body: JSON.stringify(jsonBody),
            headers: {"Content-Type": "application/json; charset=UTF-8", 'Content-Length': len}
        })
            .then(res => res.json())
            .then(json=>{
                console.log(json)
                console.log(json.token)
                let tokenVal = {token : json.token}
                const expDays = 1
                let date = new Date();
                date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
                const expires = "; expires=" + date.toUTCString();
                document.cookie = JSON.stringify(tokenVal) + expires
                fetch('user/me', {
                    method: 'GET',
                    headers: {"Content-Type": "application/json; charset=UTF-8", "token": json.token}
                }).then(res => res.json()).then(json=>{
                    //{_id: "613fbf031e4de4b36ee27f2c",
                    // username: "user123456",
                    // password: "$2a$10$ZuowAxZkv54tCxvTUKBvN.2n9R.qmIIuFmFrD/nfL7hgWA.iNFB7m",
                    // __v: 0}
                    let x = document.cookie
                    let jsonToken = JSON.parse(x)
                    console.log(jsonToken)
                    console.log(json)
                    let token = jsonToken.token
                    console.log(token)
                    let jsonFinal = Object.assign({}, json, jsonToken)
                    const expDays = 1
                    let date = new Date();
                    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
                    const expires = "; expires=" + date.toUTCString();

                    document.cookie = JSON.stringify(jsonFinal) + expires
                    console.log(jsonFinal)
                    warning.innerHTML = JSON.stringify(jsonFinal)
                    if(!(warning.innerHTML === "{\"message\":\"Invalid Token\"}")) {
                        warning.innerHTML = ""
                        window.location = "/main/index.html"
                    } else {
                        warning.innerHTML = "Wrong Username/Password!"
                    }
                })
            })
            .catch(err=>{
                warning.innerHTML = "Error: "+err;
                console.log(err)
            });
    }
};

const makePost2 = function () {
    let body = makePageBody2();
    let jsonBody = JSON.parse(body);
    let warning = document.getElementById('warningCreate');

    if (jsonBody['username'] === ""
        || jsonBody['password'] === "") {
        warning.innerHTML = "You must fill in all fields.";
    }
    else if (jsonBody['password'].length < 6) {
        warning.innerHTML = "Password must be longer than 6 characters.";
    } else {
        warning.innerHTML = "";
        console.log(JSON.stringify(jsonBody))
        console.log(jsonBody)
        const len = (new TextEncoder().encode(JSON.stringify(jsonBody))).length
        fetch('/user/signup', {
            method: 'POST',
            body: JSON.stringify(jsonBody),
            headers: {"Content-Type": "application/json; charset=UTF-8", 'Content-Length': len}
        })
            .then(res => res.json())
            .then(json=>{
                console.log(json)
                window.location = "/"
            })
            .catch(err=>{
                warning.innerHTML = "Error: "+err;
                console.log(err)
            });
    }
};

const handleInput = function (elt) {
    makePost();
    elt.preventDefault();
    return false;
};

const handleInput2 = function (elt) {
    makePost2();
    elt.preventDefault();
    return false;
};

submitBtn.onclick = handleInput;
createBtn.onclick = handleInput2;