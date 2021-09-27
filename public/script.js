window.onload = function() {
    const button = document.querySelector('#signUpButton')
    button.onclick = signUp
}

const signUp = function(e) {
    e.preventDefault()
    document.getElementById("signUpErrorText").innerText = ""

    const firstName = document.getElementById("su1-text")
    const lastName = document.getElementById("su2-text")
    const username = document.getElementById("su3-text")
    const organization = document.getElementById("su6-text")
    const password = document.getElementById("su4-text")
    const passwordConfirm = document.getElementById("su5-text")

    firstName.style.borderColor = "transparent"
    lastName.style.borderColor = "transparent"
    username.style.borderColor = "transparent"
    organization.style.borderColor = "transparent"
    password.style.borderColor = "transparent"
    passwordConfirm.style.borderColor = "transparent"

    if (checkField(firstName)) { return }
    if (checkField(lastName)) { return }
    if (checkField(username)) { return }
    if (checkField(organization)) { return }
    if (checkField(password)) { return }
    if (checkField(passwordConfirm)) { return }
    if (checkPassword(password, passwordConfirm)) { return }

    var today = new Date()
    var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = today.getFullYear()
    const joinDate = mm + "/" + yyyy

    json = { "firstName": firstName.value, "lastName": lastName.value, "username": username.value, 
    "organization": organization.value, "joinDate": joinDate, "password": password.value, "punts": []}
    console.log(json)

    fetch ('addUser', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    })
    .then(function(response) {
        window.location.href = response.url
        console.log(response.body)
    })
}

function getCurrentUser() {
    fetch ('currentUser', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "test": "test"})
    })
    .then(function(response) {
        return response.json()
    })
    .then(function (json) {
        generateProfile(json)
    })
}

function checkField(element) {
    if (element.value === "") {
        console.log("Fields cannot be empty")
        document.getElementById("signUpErrorText").innerText = "Fields cannot be blank"
        element.style.borderColor = "red"
        return true
    }
    return false
}

function checkPassword(password, passwordConfirm) {
    if (password.value != passwordConfirm.value) {
        console.log("Passwords do not match")
        document.getElementById("signUpErrorText").innerText = "Passwords do not match"
        password.style.borderColor = "red"
        passwordConfirm.style.borderColor = "red"
        return true
    }
    if (password.value.length < 8) {
        console.log("Password must be at least 8 characters")
        document.getElementById("signUpErrorText").innerText = "Password must be at least 8 characters"
        password.style.borderColor = "red"
        passwordConfirm.style.borderColor = "red"
        return true
    }
    return false
}