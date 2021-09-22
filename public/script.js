// client-side js, loaded by index.html
// run by the browser each time the page is loaded

//console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function appendNewDream(dream) {
  console.log("I have a" + dream);
  const newListItem = document.createElement("li");
  newListItem.innerText = dream.name;
  dreamsList.appendChild(newListItem);
}

// fetch the initial list of dreams
fetch("/data")
  .then(response => response.json()) // parse the JSON from the server
  .then(data => {
    // remove the loading text
    dreamsList.firstElementChild.remove();

    // iterate through every dream and add it to our page
    data.forEach(appendNewDream);

    // listen for the form to be submitted and add a new dream when it is
    dreamsForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();

      // get dream value and add it to the list
      let newDream = dreamsForm.elements.dream.value;
      data.push(newDream);
      appendNewDream(newDream);

      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
    });
  });
