// Add some Javascript code here, to run on the front end.


// add data
const addData = function( e ) {
  // prevent default form action from being carried out
  e.preventDefault()
  const input1 = document.querySelector('#fname')
  const input2 = document.querySelector('#fsavings')
  const input3 = document.querySelector('#fcost')
  var json = { name: input1.value, savings: parseInt(input2.value), cost: parseInt(input3.value), balance: parseInt(input2.value - input3.value) },
  body = JSON.stringify( json );

  fetch( '/addData', {
    method:'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json() )
  .then( function( response ) {
    // do something with the reponse 
    var newContent = ""
    if( Array.isArray(response)){
        for(let i = 0; i < response.length; i++){
            const thing = response[i]
            newContent += "<tr>" +
             "<td>" + thing.name + "</td>" +
             "<td>" + thing.savings + "</td>" +
             "<td>" + thing.cost + "</td>" +
             "<td>" + thing.balance + "</td>" +
             "</tr>"
        }
    }
    newContent = "<table><tr><th>Name</th><th>Savings</th><th>Cost</th><th>Balance</th></tr>" + newContent + "</table>"
    document.getElementById("dataTable").innerHTML = newContent;
  })

  return false
}


// delete data
const deleteData = function( e ) {
  // prevent default form action from being carried out
  e.preventDefault()
  const input1 = document.querySelector('#dname')
  var json = { name: input1.value },
  body = JSON.stringify( json );

  fetch( '/deleteData', {
    method:'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json() )
  .then( function( response ) {
    // do something with the reponse 
    var newContent = ""
    if( Array.isArray(response)){
        for(let i = 0; i < response.length; i++){
            const thing = response[i]
            newContent += "<tr>" +
             "<td>" + thing.name + "</td>" +
             "<td>" + thing.savings + "</td>" +
             "<td>" + thing.cost + "</td>" +
             "<td>" + thing.balance + "</td>" +
             "</tr>"
        }
    }
    newContent = "<table><tr><th>Name</th><th>Savings</th><th>Cost</th><th>Balance</th></tr>" + newContent + "</table>"
    document.getElementById("dataTable").innerHTML = newContent;
  })

  return false
}


// get the table data from the database system
const loadTable = function( e ) {
  // prevent default form action from being carried out
  e.preventDefault()
  var json = { },
  body = JSON.stringify( json );
  fetch("/getTable", {
    method:'POST',
    body
  })
  .then( response => response.json() )
  .then( function( response ) {
    // do something with the reponse 
    var newContent = ""
    if( Array.isArray(response)){
        for(let i = 0; i < response.length; i++){
            const thing = response[i]
            newContent += "<tr>" +
             "<td>" + thing.name + "</td>" +
             "<td>" + thing.savings + "</td>" +
             "<td>" + thing.cost + "</td>" +
             "<td>" + thing.balance + "</td>" +
             "</tr>"
        }
    }
    newContent = "<table><tr><th>Name</th><th>Savings</th><th>Cost</th><th>Balance</th></tr>" + newContent + "</table>"
    document.getElementById("dataTable").innerHTML = newContent;
  })
  
  return false;
}


const updateData = function( e ) {
  e.preventDefault()
  const input1 = document.querySelector('#newName')
  const input2 = document.querySelector('#newSavings')
  const input3 = document.querySelector('#newCost')
  var json = { name: input1.value, savings: parseInt(input2.value), cost: parseInt(input3.value), balance: parseInt(input2.value - input3.value) },
  body = JSON.stringify( json );

  fetch( '/update', {
    method:'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json() )
  .then( function( response ) {
    // do something with the reponse 
    var newContent = ""
    if( Array.isArray(response)){
        for(let i = 0; i < response.length; i++){
            const thing = response[i]
            newContent += "<tr>" +
             "<td>" + thing.name + "</td>" +
             "<td>" + thing.savings + "</td>" +
             "<td>" + thing.cost + "</td>" +
             "<td>" + thing.balance + "</td>" +
             "</tr>"
        }
    }
    newContent = "<table><tr><th>Name</th><th>Savings</th><th>Cost</th><th>Balance</th></tr>" + newContent + "</table>"
    document.getElementById("dataTable").innerHTML = newContent;
  })

  return false
}


window.onload = function() {

  const button1 = document.getElementById( 'addButton' )
  button1.onclick = addData

  const button2 = document.getElementById( 'deleteButton' )
  button2.onclick = deleteData
  
  const button3 = document.getElementById( 'loadTable' )
  button3.onclick = loadTable
  
  const button4 = document.getElementById( 'updateButton' )
  button4.onclick = updateData
}

