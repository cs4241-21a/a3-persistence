window.onload = function(){
  
const loginForm = document.getElementById("loginform")

/*
function addNewUser(user){

  let newUser
  newUser.username = loginForm.elements.username.value
  newUser.password = loginForm.elements.password.value
  
  console.log(newUser.username)
  
}
*/

loginForm.addEventListener("submit", event => {
  
  
  
  // stop our form submission from refreshing the page
  //event.preventDefault();
  
  
  fetch("/login", {
      method: "POST",
      body: JSON.stringify({ username : loginForm.username.value,
                           password : loginForm.password.value}),
      headers: {
        "Content-Type": "application/json"
      }
  })
  
  
    // sends json item to server
    .then(response => response.json())
    .then(json => {
      console.log(json[0]);
    });
  
  
})
  
}
                           
                           