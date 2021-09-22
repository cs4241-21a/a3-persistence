const loginAPIPath = "/login"

function onLogin(e) {

  fetch(loginAPIPath, {
    method: "GET"
  })
  .then(response => {
    console.log(response)
  })
}

window.onload = function() {
  const loginBtn = document.getElementById('loginBtn')
  loginBtn.onclick = onLogin
}