window.onload = function(){
    let loginBtn = document.getElementById('sign_in_button')
    loginBtn.onclick = login

    console.log("In inside onload")
}

let login = function(e){

    e.preventDefault()
    // Send POST request to server with filled in User Fields
    let username = document.querySelector('#usernameField')
    let password = document.querySelector('#passwordField')

    console.log(username.value)
    console.log(password.value)

    // Pass Content into JSON
    let json = {
        username: username.value,
        password:password.value
    }

    // Stringify it
    let jsonBody = JSON.stringify(json)

    fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: jsonBody
    }).then(function(res){
        return res.json();
    }).then(function(response){
        console.log("Response:", response)
        if(response.loggedIn === true){
            window.location.href = '/loggedIn'
        }
    })
}