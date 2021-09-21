

window.onload = function() {
    document.getElementById( 'submit' ).onclick = ev => {
        ev.preventDefault()
        postRequest("/login")
        return false
    }
    document.getElementById( 'create' ).onclick = ev => {
        ev.preventDefault()
        postRequest("/create")
        return false
    }
    console.log("Login ready")
}

function postRequest(endpoint) {
    const username = document.getElementById( 'username' ),
        password = document.getElementById('password'),
        json =
            {
                username: username.value,
                password: password.value
            },
        body = JSON.stringify( json )
    console.log(body)

    fetch( endpoint, {
        method:'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body
    }).then(response => {
        console.log(`Response time: ${response.headers.get('X-Response-Time')}`)
        return response.json()
    }).then( function( data ) {
        console.log(data)
        if (data.status === "success") {
            window.location.replace("/index.html")
        } else {
            document.getElementById("invalid-login").removeAttribute("hidden")
        }
    })
}

const submit = function( e ) {
    // prevent default form action from being carried out

}