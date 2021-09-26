// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsForm = document.querySelector("form");
const registerButton = document.getElementById("submit-register");
const loginButton = document.getElementById("submit-login");

// a helper function that creates a list item for a given dream
function appendNewDream(dream) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
}

registerButton.addEventListener("click", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  
  if(dreamsForm.elements.username.value == "" || dreamsForm.elements.password.value == ""){
    window.alert("Neither username nor password can be an empty string.")
    return
  }
  
  fetch("/register", {
    method: "POST",
    body: JSON.stringify({
      username: dreamsForm.elements.username.value,
      password: dreamsForm.elements.password.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json.login) {
        window.location.href = "userpage";
      } else {
        window.alert(
          "User already exists - log in or try again with different credentials."
        );
      }
    });

  // reset form
  dreamsForm.reset();
});

loginButton.addEventListener("click", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  
  if(dreamsForm.elements.username.value == "" || dreamsForm.elements.password.value == ""){
    window.alert("Neither username nor password can be an empty string.")
    return
  }
  
  fetch("/login", {
    method: "POST",
    body: JSON.stringify({
      username: dreamsForm.elements.username.value,
      password: dreamsForm.elements.password.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json.login) {
        window.location.href = "userpage";
      } else {
        window.alert("Invalid login info.");
      }
    });

  // reset form
  dreamsForm.reset();
});
