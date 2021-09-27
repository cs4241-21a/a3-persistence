// client-side js, loaded by index.html

// define variables that reference elements on our page
const booksTable = document.getElementById("books");
const booksForm = document.querySelector("form");
// const dreamsList = document.getElementById("dreams");
// const dreamsForm = document.querySelector("form");

// a helper function that creates a table item for a given dream
function appendNewBook(book) {
  const newTableItem = document.createElement("tr");
  var tableText = '<tr><th>Title</th><th>Author</th><th>Release Year</th><th>Rating</th><th>Rank</th></tr>'
  tableText +='<tr><td>'
  tableText += book[0]
  tableText += '</td><td>'
  tableText += book[1]
  tableText += '</td><td>'
  tableText += book[2]
  tableText += '</td><td>'
  tableText += book[3]
  tableText += '</td><td>'
  tableText += book[4]
  tableText += '</td></tr>'
  newTableItem.innerHTML = tableText
  // document.querySelector('tr').remove()
  // document.body.appendChild(newTableItem)
  booksTable.append(newTableItem)
}
// function appendNewDream(dream) {
//   const newListItem = document.createElement("li");
//   newListItem.innerText = dream;
//   dreamsList.appendChild(newListItem);
// }

// fetch the initial list of books
fetch("/books")
  .then(response => response.json()) // parse the JSON from the server
  .then(books => {
    // remove the loading text
    // booksTable.firstElementChild.remove();
  
    // iterate through every book and add it to our page
    // books.forEach(appendNewBook);
  
    // listen for the form to be submitted and add a new book when it is
    booksForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();

      // get book value and add it to the table
      let newBook = [booksForm.elements["title"],
        booksForm.elements["author"],
        booksForm.elements["year"],
        booksForm.elements["rating"],
        booksForm.elements["rank"]];
      books.push(newBook);
      appendNewBook(newBook);

      // reset form
      booksForm.reset();
      // booksForm.elements.book.focus();
    });
  });
// fetch("/dreams")
//   .then(response => response.json()) // parse the JSON from the server
//   .then(dreams => {
//     // remove the loading text
//     dreamsList.firstElementChild.remove();
  
//     // iterate through every dream and add it to our page
//     dreams.forEach(appendNewDream);
  
//     // listen for the form to be submitted and add a new dream when it is
//     dreamsForm.addEventListener("submit", event => {
//       // stop our form submission from refreshing the page
//       event.preventDefault();

//       // get dream value and add it to the list
//       let newDream = dreamsForm.elements.dream.value;
//       dreams.push(newDream);
//       appendNewDream(newDream);

//       // reset form
//       dreamsForm.reset();
//       dreamsForm.elements.dream.focus();
//     });
//   });
