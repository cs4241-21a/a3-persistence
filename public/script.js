// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const entriesList = document.getElementById("dreams");
const countMMs = document.querySelector("form");


// a helper function that creates a list item for a given dream
function appendNewEntry(entry) {
  const newListItem = document.createElement("li");
  newListItem.innerText = entry[0] + " - " + entry[1];
  entriesList.appendChild(newListItem);
}

// fetch the initial list of dreams
fetch("/entries")
  .then(response => response.json()) // parse the JSON from the server
  .then(entries => {
    // remove the loading text
    entriesList.firstElementChild.remove();
  
    // iterate through every dream and add it to our page
    entries.forEach(appendNewEntry);

    // listen for the form to be submitted and add a new dream when it is
    countMMs.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();

      // get dream value and add it to the list
      let newEntry = [countMMs.mm_count.value, document.querySelector('input[type="radio"][name="mm_color"]:checked').value];
      if (newEntry[0] != "") {
        console.log(newEntry);
        entries.push(newEntry);
        appendNewEntry(newEntry);
      } else {
        alert ("Please enter a number of M&Ms");
      }
      

      // reset form
      countMMs.reset();
      countMMs.elements.mm_count.focus();
    });
  });
