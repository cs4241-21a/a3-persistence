// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function appendNewDream(dream) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
}

// fetch the initial list of dreams
fetch("/history")
  .then(response => 
    // console.log('hi', JSON.stringify(response))
    response.json
  ) // parse the JSON from the server
  .then(dreams => {
    // remove the loading text
    console.log('dreams', dreams)
    dreamsList.firstElementChild.remove();
  
    // iterate through every dream and add it to our page
    dreams.forEach(appendNewDream);
  
  });

// listen for the form to be submitted and add a new dream when it is
dreamsForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  
  fetch('/add', {
    method:'POST',
    body: JSON.stringify({ dream: dreamsForm.elements.dream.value}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json() )
  .then( json => {
    appendNewDream( json.dream );
  })

  // reset form
  dreamsForm.reset();
  dreamsForm.elements.dream.focus();
});


