// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 3!")

// define variables that reference elements on our page
const Form = document.querySelector("frm");



// helper function to get current day 
var curday = function(sp){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //As January is 0.
  var yyyy = today.getFullYear();

  if(dd<10) dd='0'+dd;
  if(mm<10) mm='0'+mm;
  return (mm+sp+dd+sp+yyyy);
  };



// a helper function that adds entries to the table
function addEntryToTable(json){
  // Create an empty <tr> element and add it to the 1st position of the table:
  var row = document.getElementById("table1").insertRow(1);
  // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);



  // Add some text to the new cells:
  cell1.innerHTML = json.positionname;
  cell2.innerHTML = json.company;
  cell3.innerHTML = json.location;
  cell4.innerHTML = json.references;
  cell5.innerHTML = json.date;
  cell6.innerHTML = "<button class='btnEdit';>Delete</button>";



}

//fetch the initial list of dreams
fetch("/load")
  .then(response => response.json()) // parse the JSON from the server
  .then(entries => {
  console.log("on load")
    entries.forEach(e => addEntryToTable(e));
  });

  function updateTable(){
  fetch("/load")
    .then(response => response.json()) // parse the JSON from the server
    .then(entries => {
      console.log(entries)
      entries.forEach(e => addEntryToTable(e));
    });}


  // submit the new entry to the server and get the response to load on the table 
const submit = function(event){

  event.preventDefault();
  
 let newEntry = {
              positionname: document.querySelector('#position').value,
              company: document.querySelector('#company').value,
              location: document.querySelector('#location').value,
              references: document.querySelector('#references').value,
              date: curday('/')
             }
 
   if(newEntry.positionname === "" ||newEntry.company === "" || newEntry.location === "" || newEntry.references === ""){
  window.alert('All of the fields must be filled');
  return false;
}

  let body = JSON.stringify(newEntry);
  console.log("this is the body")
  console.log(body)
  fetch('/add',{
    method: 'POST',
    body,
    headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(json =>{
      console.log(json);
      console.log("in here");
      addEntryToTable(json);
    })     

  // reset form
  document.getElementById("frm").reset();

};

// delete last data recorded 
const edit = function(event){
  var LogTable = document.getElementById("table1"),rIndex;

  var r = confirm("To edit an entry, click on any cell of its row\nThis entry will appear in the input boxes for resubmition");
    if (r == true){

  for(var i = 1; i < LogTable.rows.length; i++)
  {
      LogTable.rows[i].onclick = function()
      {
          rIndex = this.rowIndex;
          console.log(rIndex);
          
          document.querySelector('#position').value = this.cells[0].innerHTML;
          document.querySelector('#company').value = this.cells[1].innerHTML;
          document.querySelector('#location').value = this.cells[2].innerHTML;
          document.querySelector('#references').value = this.cells[3].innerHTML;

          oldPosition = this.cells[0].innerHTML;
          oldCompany = this.cells[1].innerHTML;
          oldLocation = this.cells[2].innerHTML;
          oldReference = this.cells[3].innerHTML;
          oldDate = this.cells[4].innerHTML;

      };
  }
}
}

$(document).ready(function(){
  $("#table1").on('click','.btnEdit',function(){
    console.log("button CLicked")
    var r = confirm(" Are you sure you want to continue?\nThis entry will be deleted");
    if (r == true){
  var currentRow=$(this).closest("tr"); 
         
  var oldPosition= currentRow.find("td:eq(0)").text(); 
  var oldCompany= currentRow.find("td:eq(1)").text(); 
  var oldLocation= currentRow.find("td:eq(2)").text(); 
  var oldReference= currentRow.find("td:eq(3)").text(); 
  var oldDate= currentRow.find("td:eq(4)").text(); 


  let oldEntry ={oldPosition, oldCompany, oldLocation, oldReference, oldDate}

  let body = JSON.stringify(oldEntry);
  console.log("this is the body")
  console.log(body)
  fetch('/edit',{
    method: 'POST',
    body,
    headers: {'Content-Type': 'application/json'}
    })
    }
    location.reload();
  });
});



// delete all data recorded 
const deleteall = function(event){
  var r = confirm(" Are you sure you want to continue?\nAll your data will be deleted");
    if (r == true){
    fetch('/deleteAll',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
          })
          location.reload();

    }
  }
  
   window.onload = function() {
      const button = document.getElementById( 'submitBtn' )
      const delButton = document.getElementById('deleteButton')
      const delLastButton = document.getElementById('delLastButton')
      delButton.onclick = deleteall;
      delLastButton.onclick = edit;
      button.onclick = submit
   }