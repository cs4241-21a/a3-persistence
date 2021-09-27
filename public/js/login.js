window.onload = function() {
  const loginbutton = document.querySelector( '#loginButton' )
  const regsiterbutton = document.querySelector( '#registerButton' )
  loginbutton.onclick = login;
  regsiterbutton.onclick = register;
}

const login = function( e ) {
  window.location.href="index.html"
}

const register = function(e) {
  window.location.href="index.html"
}