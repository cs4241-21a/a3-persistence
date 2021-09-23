const usernameInput = document.querySelector('#username')
const passwordInput = document.querySelector('#password')

const login = function( ) {
    
    json = { username: usernameInput.value, 
            password: passwordInput.value,
            type: 'credentials' 
        }
    body = JSON.stringify( json )

    fetch( '/login', {
        method:'POST',
        body:JSON.stringify({username:usernameInput.value, password:passwordInput.value, type: 'credentials'}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( function( response ) {
        window.location.reload()
        return response.json()
    })

    return false
}



window.onload = function() {
    const loginButton = document.querySelector( '#loginButton' )
    loginButton.onclick = login
}