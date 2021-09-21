const submit = function( e ) {
  // prevent default form action from being carried out
  e.preventDefault()

  const foodInput = document.getElementById( 'fname' );
  const calInput = document.getElementById( 'cal' );
  const servInput = document.getElementById( 'numserv' );

  if(calInput.value < 0 || servInput.value < 0){
    alert("Invalid input: Negative value");
  }
  else{
  const json = { userId: "", fname: foodInput.value, cal: calInput.value, numserv: servInput.value};
  const body = JSON.stringify( json );

  fetch( '/add', {
    method:'POST', 
    headers: { 'Content-Type': 'application/json'},
    body
  })
  .then( response => response.text())
  .then( function( text ){
    console.log(text)
    const form = document.getElementById("foodform");
    form.reset();
    fetchdata()
  })
  }
  return false
}

function fetchdata(){
const tablebody = document.getElementById("foodtable").getElementsByTagName("tbody")[0]
const caltable = document.getElementById("caltable")
const signedin = document.getElementById("signedin")
tablebody.innerHTML = ""
caltable.innerHTML = ""
signedin.innerHTML = ""

const userCookie = document.cookie
  .split('; ')
  .find(row => row.startsWith('username='))
  .split('=')[1];

signedin.innerHTML = `Signed in as: ${userCookie}`

const json = { userId: "" }
const body = JSON.stringify(json)

fetch( '/data', {
  method:'POST',
  headers: { 'Content-Type': 'application/json'},
  body
})
.then( response => response.text())
.then( text => {
  console.log(text)
  const entries = JSON.parse(text);

  let calsum = 0
  for(let i = 0; i < entries.length; i++){
    calsum += entries[i].tcal
    let row = tablebody.insertRow(-1);
    row._id = entries[i]._id 
    const c1 = row.insertCell(0);
    const c2 = row.insertCell(1);
    const c3 = row.insertCell(2);
    const c4 = row.insertCell(3);
    const c5 = row.insertCell(4);
    const c6 = row.insertCell(5);
    c1.innerHTML = entries[i].fname;
    c2.innerHTML = entries[i].cal;
    c3.innerHTML = entries[i].numserv;
    c4.innerHTML = entries[i].tcal;
    c5.innerHTML = '<button id="edit" onclick="edit(this)">Edit</button>';
    c6.innerHTML = '<button id="delete" onclick="remove(this)">Delete</button>';
    }
    caltable.innerHTML = `Total Calories of table: ${calsum}`
  })
  return false
}

const edit = function( obj ) {
  const i = obj.parentNode.parentNode.rowIndex;

  document.getElementById("fname2").value = document.getElementById("foodtable").rows[i].cells[0].innerHTML;
  document.getElementById("cal2").value = document.getElementById("foodtable").rows[i].cells[1].innerHTML;
  document.getElementById("numserv2").value = document.getElementById("foodtable").rows[i].cells[2].innerHTML;
  document.getElementById("entryid").innerHTML = `${document.getElementById("foodtable").rows[i]._id}`
}

const update = function( e ){
  e.preventDefault();

  const foodUpdate = document.getElementById( 'fname2' );
  const calUpdate = document.getElementById( 'cal2' );
  const servUpdate = document.getElementById( 'numserv2' );
  const entryid = document.getElementById('entryid').innerHTML;

  if(calUpdate.value < 0 || servUpdate.value < 0){
    alert("Invalid input: Negative value");
  }
  else{
    const json = { _id: entryid, fname: foodUpdate.value, cal: calUpdate.value, numserv: servUpdate.value};
    const body = JSON.stringify( json );

  fetch( '/update', {
    method:'POST',
    headers: { 'Content-Type': 'application/json'},
    body 
  })
  .then( response => response.text())
  .then( function( text ){
      console.log(text)
      const form = document.getElementById("updateform");
      form.reset();
      fetchdata()   
  })
}
  return false
}

const remove = function( obj ) {
  const i = obj.parentNode.parentNode.rowIndex;
  const foodid = document.getElementById("foodtable").rows[i]._id;
  
  const json = {_id: foodid}
  const body = JSON.stringify(json)

  fetch( '/remove', {
    method:'POST',
    headers: { 'Content-Type': 'application/json'},
    body
  })
  .then( response => response.text())
  .then( function( text ){
    console.log(text)
    fetchdata()
  })
  return false
}

const logout = function(e){
  e.preventDefault()

  fetch( '/logout', {
    method:'GET', 
  })
  .then( response => response.text())
  .then( text => window.location.replace('/index.html'))
}

window.onload = function() {
  fetchdata()

  const addbtn = document.getElementById( 'add' )
  addbtn.onclick = submit

  const updatebtn = document.getElementById( 'update' )
  updatebtn.onclick = update

  const logoutbtn = document.getElementById( 'logout' )
  logoutbtn.onclick = logout
}