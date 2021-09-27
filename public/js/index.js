
 const logout = function (e) {

  e.preventDefault()

  fetch('logout', {
      method: 'POST',
      headers: {"Content-Type":"application/json"}
  })
  window.location.href = "login.html"
}
const addEntry = (json) => {

  let table = document.getElementById('items')
  
  let newRow = table.insertRow(-1),
  newItem = newRow.insertCell(0),
  newDescription = newRow.insertCell(1),
  newExpiration = newRow.insertCell(2),
  newUrgency = newRow.insertCell(3),
  editElement = newRow.insertCell(4),
  editButton = document.createElement('Input'),
  removeElement = newRow.insertCell(5),
  removeButton = document.createElement('Input');

  let idElement = json._id;

  newItem.innerHTML = json.itemName;
  newDescription.innerHTML = json.description;
  newExpiration.innerHTML = json.expiraton;
  newUrgency.innerHTML = json.urgency;

  editButton.setAttribute('type','button')
  editButton.setAttribute('value', 'Edit')
  editButton.className = 'editButton';
  editElement.appendChild(editButton);

  let itemInput = document.createElement('Input'),
    descriptionInput = document.createElement('Input'),
    expirationInput = document.createElement('Input'),
    urgencyInput = document.createElement('Input'),
    id = idElement;

    itemInput.value = newItem.innerHTML;
    descriptionInput.value = newDescription.innerHTML;
    expirationInput.value = newExpiration.innerHTML;
    urgencyInput.value = urgencyInput.innerHTML;

  editButton.onclick = function() {

    document.querySelector('#itemName').value = json.itemName
    document.querySelector('#itemDescription').value = json.description
    document.querySelector('#expiration').value = json.expiration

    newRow.remove();

    json = { itemName: itemInput.value, description: descriptionInput.value, expiration: expirationInput.value, urgency: urgencyInput.value, id: id }
    body = JSON.stringify( json )

    fetch('/update', {
      method:'POST',
      body,
      headers: {"Content-Type": "application/json"} 
    })
    .then(response => response.json())
    .then(json => {
      
      itemInput.value = newItem.innerHTML
      descriptionInput.value = newDescription.innerHTML
      expirationInput.value = newExpiration.innerHTML
      urgencyInput.value = newUrgency.innerHTML
    })
  }

  removeButton.setAttribute('type','button')
  removeButton.setAttribute('value', 'Remove')
  removeButton.classItem = 'removeButton';
  removeElement.appendChild(removeButton);

  removeButton.onclick = function () {

    fetch( '/remove', {
      method:'POST',
      body: JSON.stringify({idElement}),
      headers: {"Content-Type": "application/json"} 
    })
    .then(response => response.json())
    .then(json => {newRow.remove();
   })
  }
};

function loadDatabase(item) {
  let table = document.getElementById('items')
  
  let newRow = table.insertRow(-1),
  newItem = newRow.insertCell(0),
  newDescription = newRow.insertCell(1),
  newExpiration = newRow.insertCell(2),
  newUrgency = newRow.insertCell(3),
  editElement = newRow.insertCell(4),
  editButton = document.createElement('Input'),
  removeElement = newRow.insertCell(5),
  removeButton = document.createElement('Input');

  let idElement = item._id;

  newItem.innerHTML = item.itemName;
  newDescription.innerHTML = item.description;
  newExpiration.innerHTML = item.expiraton;
  newUrgency.innerHTML = item.urgency;

  editButton.setAttribute('type','button')
  editButton.setAttribute('value', 'Edit')
  editButton.className = 'editButton';
  editElement.appendChild(editButton);

  let itemInput = document.createElement('Input'),
    descriptionInput = document.createElement('Input'),
    expirationInput = document.createElement('Input'),
    urgencyInput = document.createElement('Input'),
    id = idElement;

    itemInput.value = newItem.innerHTML;
    descriptionInput.value = newDescription.innerHTML;
    expirationInput.value = newExpiration.innerHTML;
    urgencyInput.value = urgencyInput.innerHTML;

  editButton.onclick = function() {

    document.querySelector('#itemName').value = item.itemName
    document.querySelector('#itemDescription').value = item.description
    document.querySelector('#expiration').value = item.expiration

    newRow.remove();

    json = { itemName: itemInput.value, description: descriptionInput.value, expiration: expirationInput.value, urgency: urgencyInput.value, id: id }
    body = JSON.stringify( json )

    fetch( '/update', {
      method:'POST',
      body,
      headers: {"Content-Type": "application/json"} 
    })
    .then(response => response.json())
    .then(json => {
      
      itemInput.value = newItem.innerHTML
      descriptionInput.value = newDescription.innerHTML
      expirationInput.value = newExpiration.innerHTML
      urgencyInput.value = newUrgency.innerHTML
    })
  }

  removeButton.setAttribute('type','button')
  removeButton.setAttribute('value', 'Remove')
  removeButton.className = 'removeButton';
  removeElement.appendChild(removeButton);


  removeButton.onclick = function () {

    fetch( '/remove', {
      method:'POST',
      body: JSON.stringify({idElement}),
      headers: {"Content-Type": "application/json"} 
    })
    .then(response => response.json())
    .then(json => {newRow.remove()})
  }
}

fetch("/fridge")
.then(response => response.json())
.then(fridge => {fridge.forEach(loadDatabase);});

const submit = function( e ) {

  e.preventDefault()

    const item = document.querySelector( '#itemName' ),
    description = document.querySelector( '#itemDescription' ),
    expiration = document.querySelector( '#expiration' ),
    urgency = getUrgency(expiration.value);

    if (item.value === "" || expiration.value === ""||description.value === "") {
        console.log("Crucial fields are empty")
        alert("Item and expiration fields needs to be filled.")
        return false
    } 


    if (item.value.length < 2 ||item.value.length < 2 ) {
      console.log("Not a valid item or description")
      alert("Enter valid fields only.")
      return false
    }

   
    if (item.value === "Item" ) {
        console.log("Not valid item")
        alert("Enter only valid fields for item.")
        return false
    }
  
    json = { itemName: item.value, description: description.value, expiraton:expiration.value, urgency: urgency }
    body = JSON.stringify( json )

    fetch( '/submit', {
      method:'POST',
      body: body,
      headers: {"Content-Type": "application/json"} 
    })
    .then(response => response.json())
    .then(json => {addEntry(json)})
    return false
  }

  const getUrgency = function (expiraton) {
    let urgency = "";
     
    if (expiraton === "expiration-long") {
      urgency = "Take Your Time";
    } else if (expiraton === "expiration-med") {
      urgency = "Finish it Soon";
    } else if (expiraton === "expiration-short") {
      urgency = "Finish it Now";
    } else  {
      urgency = "Finish it Soon";
    }
    return urgency;
  }
  
  window.onload = function() {
    const addButton = document.querySelector("#addItem");
    addButton.onclick = submit;
  

    const logoutButton = document.getElementById('logoutBtn')
    logoutButton.onclick = logout
  }