const createUser = function () {
    const username = document.getElementsByName("username"),
        password = document.getElementsByName("password"),
        json = {username:username,
                password:password},
        body = JSON.stringify( json )

    fetch("/createUser", {
        method:"POST",
        body
    })
    .then( function ( text ) {
        console.log( text )
    })
}

window.onload = function() {
    //const createUser_button = document.querySelector("#createUser")
    //createUser_button.onclick = createUser
}