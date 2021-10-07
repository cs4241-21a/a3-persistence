const loginForm = document.getElementById("form");
const username = document.getElementById("uname");
const password = document.getElementById("pword");
const sub = document.getElementById("submit")

const signup = document.getElementById("signup");
const signform = document.getElementById("form2");


loginForm.addEventListener('submit', event => {
    event.preventDefault();
    
    const json = { username: username.value, 
               password: password.value },
      body = JSON.stringify(json);
    
    fetch("/login", {
      method: "POST",
      body:body,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(user => {
        if (user.length == 0) {
          window.alert("Incorrect username or password");
          loginForm.reset();
        } else {
          window.location.href = "index.html";
        }
      });
  })

signform.addEventListener('submit', event => {
  event.preventDefault();
    let success = true;
    const username = document.getElementById("uname2"),
      password = document.getElementById("pword2"),
      json = { username: username.value, password: password.value },
      body = JSON.stringify(json);
    fetch("/create", {
      method: "POST",
      body:body,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if(response.status != 200) {
          window.alert("Username Taken!")
          
        }

        else{
          response.json() 
          window.location.href = "/index.html";
        }

      })
      
     // window.location.href = "/index.html"
      
  })


  