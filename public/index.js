const loginAPIPath = "/auth/github"

function onLogin(e) {
  window.location.href = loginAPIPath
}

window.onload = function() {
  const loginBtn = document.getElementById('loginBtn')
  loginBtn.onclick = onLogin

  const urlParams = new URLSearchParams(window.location.search)
  
  // Display error message if one has been given
  if(urlParams.has("error")) {
    const errorPopup = document.getElementById("errorPopup"),
          errorMsg = document.getElementById("errorMsg")
    
    errorPopup.style.display = "block"
    errorMsg.innerHTML = urlParams.get("error")
  }

}