const loginForm = document.getElementById( "login" )
const accountMessage = document.getElementById( "account-message" )
const username = document.getElementById( "username" )
const password = document.getElementById( "password" )
const loginButton = document.getElementById( "login-button" )

const login = function( e ) {
    e.preventDefault()

    let json = { username: username.value, password: password.value }
    const body = JSON.stringify( json )

    //load data from server
    fetch( "/login", {
        method: "POST",
        body
    })
}

window.onload = function() {
    loginButton.onclick = login
}