const submit = function( e ) {
  e.preventDefault()

  const ftitle = document.querySelector( '#ftitle' ),
        fauthor = document.querySelector( '#fauthor' ),
        fyear = document.querySelector( '#fyear' ),
        frating = document.querySelector( '#frating' ),
        fexisting = document.querySelector( '#fexisting' ),
        json = { title: ftitle.value, author: fauthor.value, year: fyear.value, rating: frating.value, edit: fexisting.valueg },
        body = JSON.stringify( json )

  fetch( '/submit-book', {
    method:'POST',
    body 
  })
  .then( function( response ) {
    return response.json()
  })
  .then( function( json ) {
    console.log(json)

    reloadTable(json)
    booksForm.reset();
  })

  return false
}

const deleteBook = function( e ) {
  e.preventDefault()

  const fdelete = document.querySelector( '#fdelete' ),
        json = { delete: fdelete.value },
        body = JSON.stringify( json )

  fetch( '/delete-book', {
    method:'POST',
    body 
  })
  .then( function( response ) {
    return response.json()
  })
  .then( function( json ) {
    console.log(json)

    reloadTable(json)
    deleteForm.reset()
  })

  return false
}

const reloadTable = (json) => {
  var newTable = document.createElement('table')
    var tableText = '<table><tr><th>Title</th><th>Author</th><th>Release Year</th><th>Rating</th><th>Rank</th></tr>'
    var i = 0
      while (json[i]!=undefined) {
      tableText +='<tr><td>'
      tableText += json[i].title
      tableText += '</td><td>'
      tableText += json[i].author
      tableText += '</td><td>'
      tableText += json[i].year
      tableText += '</td><td>'
      tableText += json[i].rating
      tableText += '</td><td>'
      tableText += json[i].rank
      tableText += '</td></tr>'
      i++
    }
    tableText += '</table>'
    newTable.innerHTML = tableText
    document.querySelector('table').remove()
    document.body.appendChild(newTable)
}

window.onload = function() {
  const submitBookButton = document.querySelector( '#submit-book' )
  const deleteBookButton = document.querySelector( '#delete-button' )
  submitBookButton.onclick = submit
  deleteBookButton.onclick = deleteBook
}

// client-side js, loaded by index.html

// define variables that reference elements on our page
const booksTable = document.getElementById("books");
const booksForm = document.querySelector(".enterForm");
const deleteForm = document.querySelector("#delete-form")
// const dreamsList = document.getElementById("dreams");
// const dreamsForm = document.querySelector("form");

// a helper function that creates a table item for a given dream
// function appendNewBook(book) {
//   const newTableItem = document.createElement("table");
//   var tableText = '<table><tr><th>Title</th><th>Author</th><th>Release Year</th><th>Rating</th><th>Rank</th></tr>'
//   tableText +='<tr><td>'
//   tableText += book[0]
//   tableText += '</td><td>'
//   tableText += book[1]
//   tableText += '</td><td>'
//   tableText += book[2]
//   tableText += '</td><td>'
//   tableText += book[3]
//   tableText += '</td><td>'
//   tableText += book[4]
//   tableText += '</td></tr></table>'
//   newTableItem.innerHTML = tableText
//   // document.querySelector('table').remove()
//   document.body.appendChild(newTableItem)
//   booksTable.appendChild(newTableItem)
// }
// // function appendNewDream(dream) {
// //   const newListItem = document.createElement("li");
// //   newListItem.innerText = dream;
// //   dreamsList.appendChild(newListItem);
// // }

// // fetch the initial list of books
// fetch("/books")
//   .then(response => response.json()) // parse the JSON from the server
//   .then(books => {
//     // remove the loading text
//     // booksTable.firstElementChild.remove();
  
//     // iterate through every book and add it to our page
//     // books.forEach(appendNewBook);
  
//     // listen for the form to be submitted and add a new book when it is
//     booksForm.addEventListener("submit", event => {
//       // stop our form submission from refreshing the page
//       event.preventDefault();

//       // get book value and add it to the table
//       let newBook = [booksForm.elements["ftitle"],
//         booksForm.elements["fauthor"],
//         booksForm.elements["fyear"],
//         booksForm.elements["frating"],
//         booksForm.elements["frank"]];
//       books.push(newBook);
//       console.log(books)
//       // appendNewBook(newBook);

//       // reset form
//       booksForm.reset();
//       // booksForm.elements.book.focus();
//     });
//   });



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
