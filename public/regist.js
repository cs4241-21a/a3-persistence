// listen for the form to be submitted and add a new dream when it is
const signUp = function( e ) {
  // prevent default form action from being carried out
  e.preventDefault()

  // get dream value and add it to the list
  let username = document.querySelector('#username').value;
  let password = document.querySelector('#password').value;
  // fetch the initial list of dreams
  fetch('/signup', {
    method:'POST',
    body:JSON.stringify({ name:username, password:password }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json() )
  .then( json => {
    window.location.replace('/login')
  })
  // reset form
};


window.onload = function() {

  const button1 = document.getElementById( 'registerButton' )
  button1.onclick = signUp
}