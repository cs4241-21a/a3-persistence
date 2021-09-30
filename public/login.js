// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const userForm = document.querySelector("form");
const loginButton = document.getElementById("log-in");
const registerButton = document.getElementById("register");

registerButton.addEventListener("click", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  if(userForm.elements.usr.value == "" || userForm.elements.pwd.value == ""){
    window.alert("Neither username nor password can be an empty string.")
    return
  }

  fetch("/register", {
    method: "POST",
    body: JSON.stringify({
      usr: userForm.elements.usr.value,
      pwd: userForm.elements.pwd.value,
      entries: []
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json.login) {
        window.location.href = "tracker";
      } else {
        window.alert(
          "That user already exists! Maybe try another name?"
        );
      }
    });

  // reset form
  userForm.reset();
});

loginButton.addEventListener("click", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  if(userForm.elements.usr.value == "" || userForm.elements.pwd.value == ""){
    window.alert("Neither username nor password can be an empty string.")
    return
  }

  fetch("/login", {
    method: "POST",
    body: JSON.stringify({
      usr: userForm.elements.usr.value,
      pwd: userForm.elements.pwd.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json.login) {
        window.location.href = "tracker";
      } else {
        window.alert("Invalid login info.");
      }
    });

  // reset form
  userForm.reset();
});
