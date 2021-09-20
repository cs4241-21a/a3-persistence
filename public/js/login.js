const loginForm = document.querySelector("form");
const username = document.getElementById("uname");
const password = document.getElementById("pword");

loginForm.addEventListener("submit", event => {
    event.preventDefault();
    
    const json = { username: username.value, 
               password: password.value },
      body = JSON.stringify(json);
    
    fetch("/login", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(user => {
        if (user.length == 0) {
          window.alert("Incorrect username or password");
        } else {
          window.location.href = "./views/index.html";
        }
      });
  })

  