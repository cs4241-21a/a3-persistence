// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");
const table = document.getElementById("watchlist");
const form = document.querySelector("#movieForm");
const addButton = document.getElementById("add-entry");

function updateWatchlist(data) {
  let json_data = JSON.parse(data);
  //  clientdata = json_data["data"];
  table.innerHTML = `<tr> <th id ="title" ><div contenteditable = 'true'> Title</th> <th id ="year" ><div contenteditable = 'true'> Year</th> <th id ="genre"><div contenteditable = 'true'>Genre</th><th id = "streaming"> <div contenteditable = 'true'>Streaming</th><th id = "synopsis"><div contenteditable = 'true'>Synopsis</th><th id = "save" >Save Edit</th> <th id = "delete" >Delete</th>  </tr>`;
  json_data.forEach(element =>
    addMedia(
      element["titleEntry"],
      element["yearEntry"],
      element["Genre"],
      element["isStreaming"],
      element["synopsisEntry"]
    )
  );
  // addMedia(json_data.title, json_data.director, json_data.)
}

window.onload = function() {
  fetch("/load")
    .then(response => response.json())
    .then(appdata => {
      updateWatchlist(appdata);
    });
  addButton.onclick = submit;
};

function addMedia(title, year, genre, isStreaming, synopsis) {
  // console.log(title,director,genre,year,isInTheaters)
  let row = table.insertRow(-1);
  let streamChecker = document.getElementById("isStreaming");
  let cell0 = row.insertCell(0);
  let cell1 = row.insertCell(1);
  let cell2 = row.insertCell(2);
  let cell3 = row.insertCell(3);
  let cell4 = row.insertCell(4);
  let cell5 = row.insertCell(5);
  let cell6 = row.insertCell(6);

  cell0.innerHTML = title;
  cell1.innerHTML = year;
  cell2.innerHTML = genre;
  if (streamChecker) {
    cell3.innerHTML = "Yes";
  } else cell3.innerHTML = "No";
  cell4.innerHTML = synopsis;
  cell5.innerHTML = `<button type="submit" id="delete-entry">Delete</button>`;
  cell6.innerHTML = `<button type="submit" id="save-entry">Save</button>`;
}

const submit = function(e) {
  console.log("started submit");
  e.preventDefault();

  // get dream value and add it to the list
  let newEntry = form.elements;
  for (var i = 0; i < newEntry.length - 1; i++) {
    let element = newEntry.item(i);
    console.log(element.id, element.value);
  }
};
/*
// define variables that reference elements on our page
const table = document.getElementById("watchlist");
const form = document.querySelector("movieForm");
const addButton = document.getElementById("add-entry");


window.onload = function() {
//    fetch("/load")
//    .then(response => response.json())
//    .then(appdata => {
//        update_table(appdata)
//    });
    addButton.onclick = submit
  
}

const submit = function(e){
        event.preventDefault();

      // get dream value and add it to the list
     let  newEntry = form.elements;
      console.log(newEntry);
     // appendNewDream(newDream);

      // fetch('/add', {
      //   method: 'POST'
      //  // body:JSON.stringify({dream:newDream}),
      //  // headers:{
      //  //   'Content-Type': 'application/json'
      //   })
      // .then( response => response.json() )
      // .then( json =>{
      //   appendNewDream(json.dream, json._id);
      // })
      
      // reset form
      form.reset();
      form.elements.dream.focus();
    //});

}


function addMedia(title,year,genre,isStreaming, synopsis){
 // console.log(title,director,genre,year,isInTheaters)
  let row = table.insertRow(-1);
  let streamChecker = document.getElementById("isStreaming");
  let cell0 = row.insertCell(0);
  let cell1 = row.insertCell(1);
  let cell2 = row.insertCell(2);
  let cell3 = row.insertCell(3);
  let cell4 = row.insertCell(4); 
  let cell5 = row.insertCell(5);
  let cell6 = row.insertCell(6);
  
  cell0.innerHTML = title;
  cell1.innerHTML = year;
  cell2.innerHTML = genre;  
  if (streamChecker) {
      cell3.innerHTML = "Yes";
  } else cell3.innerHTML = "No";
  cell4.innerHTML = synopsis;
  cell5.innerHTML = `<button type="submit" id="delete-entry">Delete</button>`
  cell6.innerHTML = `<button type="submit" id="save-entry">Save</button>`
}


// a helper function that creates a list item for a given dream
// function appendNewDream(entry, id) {
//   const newListItem = document.getElementById("movieForm");
//   const deleteItem = document.getElementById("delete")
//   newListItem.innerHTML = dream;
  
//   deleteItem.onclick = function(){
//      fetch('/delete', {
//         method: 'POST',
//         body: JSON.stringify({ id }),
//         headers:{
//           'Content-Type': 'application/json'
//         }
//       })
//       .then( response => response.json())
//       .then( json =>{
//           newListItem.remove()
//       })
//   }

//    table.innerHTML = "<tr> <th>Title</th><th>Director</th> <th>Genre</th> <th>Year</th><th>In Theaters?</th><th>Leaving Soon?</th></tr>"

//  json_data.forEach(element=> addMedia(element["titleEntry"], element["directorEntry"], element["genreEntry"], element["yearEntry"], element["isInTheaters"], element["leavingSoon"]))
// }


/*
    function modifyRow(){
      var table = document.getElementByID("watchlist")
      for (let i = 1; i < table.rows.length; i++){

        //Selecting for modifying, Populate entry fields and get unique ID
          table.rows[i].cells[5].onclick = function(){
          document.getElementByID("title").value = table.rows[i].cells[0].innerHTML
          document.getElementByID("year").value = table.rows[i].cells[1].innerHTML
          document.getElementByID("genre").value =  table.rows[i].cells[2].innerHTML
          if(table.rows[i].cells[3].innerHTML === 'Yes'){
            document.getElementByID("isStreaming").checked = true
          }
          else{
            document.getElementID("isStreaming").checked = false
          }
          document.getElementByID("genre").value =  table.rows[i].cells[4].innerHTML
        }
          table.rows[i].cells[6].onclick = function(){
         let json = {nameToRemove:table.rows[i].cells[6].innerHTML}   
          table.deleteRow(this.parentElement.rowIndex)
          body = JSON.stringify(json) 
          fetch( '/deleteEntry', {
            method:'POST',
            body:body,
            headers:{ 
              "Content-Type":"application/json"
            }
          })
          .then( function( response ) {
            return response.json() 
           })
        }
      }
    }
    

/*

// fetch the initial list of dreams
fetch("/entries")
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    // remove the loading text
    dreamsList.firstElementChild.remove();
  
    // iterate through every dream and add it to our page
    dreams.forEach(appendNewDream);
  });

 // listen for the form to be submitted and add a new dream when it is
    form.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();

      /*
      // get dream value and add it to the list
      let newDream = dreamsForm.elements.dream.value;
      appendNewDream(newDream);

      fetch('/add', {
        method: 'POST'
        body:JSON.stringify({dream:newDream}),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then( response => response.json() )
      .then( json =>{
        appendNewDream(json.dream, json._id);
      })
      
      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
      */
