const loginAPIPath = "/auth/github"

function onLogin(e) {

  fetch(loginAPIPath, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  })
  .then(response => {
    console.log(response)
  })
}

window.onload = function() {
  const loginBtn = document.getElementById('loginBtn')
  loginBtn.onclick = onLogin
}