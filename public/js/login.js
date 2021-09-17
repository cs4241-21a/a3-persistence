const login = function (event) {
    //event.preventDefault()
    //console.log("loggining in")

    const username = document.querySelector('#username').value
    const pass = document.querySelector('#pass').value

    json = { username: username, pass: pass }

    //console.log(json)

    fetch('/login', {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            // do something with the reponse
            console.log(response)
        })

    return false
}

window.onload = function () {
    const addBtn = document.querySelector('#login')
    //addBtn.onclick = login
}