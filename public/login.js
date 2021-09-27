const login = function(e) {
  e.preventDefault();

  const username = document.querySelector("#username"),
    password = document.querySelector("#password");

  if (username.value === "" || password.value === "") {
    alert("Enter a valid username and password");
    return false;
  }

  let json = { username: username.value, password: password.value };
  let body = JSON.stringify(json);

  fetch("/login", {
    method: "POST",
    body: body,
    headers: { "Content-Type": "application/json" }
  })
    .then(response => response.json())
    .then(user => {
      if (user.length == 0) {
        window.alert("Username or password is incorrect");
      } else {
        location.href = "loggedin";
      }
    });
  return false;
};

const register = function(e) {
  e.preventDefault();

  const username = document.getElementById("username"),
    password = document.getElementById("password");

  if (username.value === "" || password.value === "") {
    alert("Enter a valid username and password");
    return false;
  }

  let json = { username: username.value, password: password.value };
  let body = JSON.stringify(json);

  fetch("/signin", {
    method: "POST",
    body: body,
    headers: { "Content-Type": "application/json" }
  }).then(response => response.json());
  location.href = "loggedin";
};

window.onload = function() {
  const loginButton = document.getElementById("login");
  loginButton.onclick = login;

  const registerButton = document.getElementById("register");
  registerButton.onclick = register;
};
