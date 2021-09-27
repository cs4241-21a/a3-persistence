// client-side js, loaded by index.html

// define variables that reference elements on our page
const dreamsList = document.getElementById("todos");
const dreamsForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function appendNewTodo(todo) {
  const newListItem = document.createElement("li");
  newListItem.innerText = todo;
  dreamsList.appendChild(newListItem);
}

// fetch the initial list of dreams
fetch("/todos")
  .then(response => response.json()) // parse the JSON from the server
  .then(todos => {
    // remove the loading text
    dreamsList.firstElementChild.remove();
  
    // iterate through every dream and add it to our page
    todos.forEach(appendNewTodo);
  

  });

// listen for the form to be submitted and add a new dream when it is
dreamsForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  
  fetch('/add', {
  method:'POST',
  body: JSON.stringify({ dream:dreamsForm.elements.dream.value }),
  headers:{
    "Content-type": "application/json"
  }
})
  .then( response => response.json() )
  .then( json => {
    appendNewTodo( json.dream);
  })

// reset form
dreamsForm.reset();
dreamsForm.elements.dream.focus();
});
