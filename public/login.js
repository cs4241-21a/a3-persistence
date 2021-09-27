// listen for the form to be submitted and add a new dream when it is
const signIn = function( e ) {
  // prevent default form action from being carried out
  e.preventDefault()

  // get dream value and add it to the list
  let username = document.querySelector('#username').value;
  let password = document.querySelector('#password').value;
  // fetch the initial list of dreams
  fetch('/signin', {
    method:'POST',
    body:JSON.stringify({ name:username, password:password }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json() )
  .then( json => {
    if(json.result === "success"){
      // successful login
      window.location.replace('/index');
    }
    else {
      window.location.replace('/loginfail');
    }
    // console.log(json)
  }) 
  // reset form
};


window.onload = function() {

  const button1 = document.getElementById( 'loginButton' )
  button1.onclick = signIn
}