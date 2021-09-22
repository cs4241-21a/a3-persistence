//import "nes.css/css/nes.min.css";
const logout = function () {
    //console.log('here')
    fetch("/logout")
}

window.onload = function() {
    //const createUser_button = document.querySelector("#createUser")
    //createUser_button.onclick = createUser
    const logout_button = document.getElementById("logout")
    logout_button.onclick = logout
}