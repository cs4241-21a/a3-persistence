const submit = function () {
    const username = document.getElementsByName("username"),
    password = document.getElementsByName("password")

    fetch("/submit", {
        method:"POST",
        body
    })
    .then( function ( text ) {
        console.log( text )
    })
}

window.onload = function() {
    const submit_button = document.querySelector("#submit")
    submit_button.onclick = submit
}