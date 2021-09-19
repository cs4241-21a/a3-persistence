let loggedInUser = undefined

const getRequest = function(endpoint, data, callback) {
  fetch( endpoint, {
    method:'GET',
    data 
  })
  .then( response => response.json())
  .then( response => callback(response) )
  return false
}

const postRequest = function(endpoint, data, callback) {
  fetch( endpoint, {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then( response => callback(response) )
  return false
}

function getUserID() {
  getRequest('/auth/getUserID', {}, (response) => {
    console.log("Login status: " + response.status)
    if (response.status === 200) {
      loggedInUser = response.username
      document.querySelector('#username-box').innerText = `Logged in as ${loggedInUser}`
      els = document.querySelectorAll( '.logged-in' )
      els.forEach(el => el.style.display = 'block')
      getLostItems()
      getFoundItems()
    } else {
      document.querySelector('#error-box').innerText = "Error! Could not fetch user details!"
    }
  })
}

function getItems(listname) {
  getRequest('/api/' + listname, {}, (data) => {
    let table = ""
    for (let info of data) {
      let row = ""
      row += `<td class="item">${info.item}</td>`
      row += `<td class="when">${info.when}</td>`
      row += `<td class="where">${info.where}</td>`
      row += `<td class="description">${info.description}</td>`
      row += `<td class="photo">${info.photo}</td>`
      row += `<td class="emailme">${info.emailme}</td>`
      row += `<td class="timestamp">${info.created} days ago</td>`
      if (info.emailme === loggedInUser) {
        row += `<td><form><button class="deleteBtn">Delete</button><button class="editBtn">Edit</button></form></td>`
      }
      table += `<tr id="${info._id}">${row}</tr>`
    }
    let header = '<tr><th>Item</th><th>When</th><th>Where</th><th>Description</th><th>Photo</th><th>Email me!</th><th>Created</th><th>Actions</th></tr>'
    document.querySelector('#' + listname).innerHTML = header + table
    document.querySelectorAll( '.deleteBtn' )
    .forEach( (element) => {
      element.onclick = (e) => {
        e.preventDefault()
        deleteValue(e.target.parentNode.parentNode.parentNode.id)
      }
    });
    document.querySelectorAll( '.editBtn' )
    .forEach( (element) => {
      element.onclick = (e) => {
        e.preventDefault()
        editValue(e.target.parentNode.parentNode.parentNode.id)
      }
    });
  })
}

function getFoundItems() {
  getItems('founditems')
}

function getLostItems() {
  getItems('lostitems')
}

function createElement() {
  // Get fields
  let entry = {
    'lost' : document.querySelector( '#type1-create' ).checked,
    'found' : document.querySelector( '#type2-create' ).checked,
    'item' : document.querySelector( '#item-create' ).value,
    'when' : document.querySelector( '#when-create' ).value,
    'where' : document.querySelector( '#where-create' ).value,
    'description' : document.querySelector( '#description-create' ).value,
    'photo' : document.querySelector( '#photo-create' ).value,
    'emailme' : loggedInUser
  }
  if (entry.item === "" || entry.description === "" || entry.when === "" || entry.where === "") {
    alert("Item, description, where, and when cannot be empty")
    return;
  }
  // Submit to server
  postRequest('/api/create', entry, (response) => {
    if (response.status === 200) {
      // Empty fields
      console.log('Emptying fields')
      document.querySelectorAll( 'input' )
      .forEach((el) => el.value = "")
      // Update lists
      console.log('Updating lists')
      getFoundItems()
      getLostItems()
    } else {
      document.querySelector('#error-box').innerText = "Error, could not complete request."
    }
  })
}

function deleteValue(_id) {
  // Submit to server
  postRequest('/api/delete', { _id }, (response) => {
    if (response.status === 200) {
      // Update lists
      console.log('Updating lists')
      getLostItems()
      getFoundItems()
    } else {
      document.querySelector('#error-box').innerText = "Error, could not delete item."
    }
  })
}

const editValue = (_id) => {
  console.log("Editing value " + _id)
  let values = {}
  let row = document.querySelector(`#${_id}`)
  row.childNodes
  .forEach( e => {
    console.log(e)
    if (e.firstChild !== null && e.firstChild.nodeName.toUpperCase() !== "FORM") {
      values[e.className] = e.innerText
    }
  })

  let editForm = document.querySelector(`#editform`)
  editForm.style.display = 'block'
  editForm.childNodes.forEach( e => {
    if (e.nodeName.toUpperCase() === 'INPUT') { e.value = values[e.id.split('-')[0]] }
  })
  editForm.querySelector('#editentry-button').onclick = (e) => {
    e.preventDefault()
    saveEdits(_id)
  }
}

function saveEdits(_id) {
  console.log(`Saving edits for ${_id}`)
  let row = document.querySelector(`#editform`)
  // Get fields
  let entry = {
    'item' : row.querySelector( '#item-edit' ).value,
    'when' : row.querySelector( '#when-edit' ).value,
    'where' : row.querySelector( '#where-edit' ).value,
    'description' : row.querySelector( '#description-edit' ).value,
    'photo' : row.querySelector( '#photo-edit' ).value,
    '_id' : _id
  }
  // Submit to server
  postRequest('/api/update', entry, (response) => {
    if (response.status === 200) {
      // Empty fields
      console.log('Emptying fields')
      document.querySelectorAll( 'input' )
      .forEach((el) => el.value = "")
      // Hide form 
      document.querySelector(`#editform`).style.display = 'none'
      // Update lists
      console.log('Updating lists')
      getFoundItems()
      getLostItems()
    } else {
      document.querySelector('#error-box').innerText = "Error, could not create new item."
    }
  })
}

window.onload = function() {
  getUserID()

  document.querySelector( '#createentry-button' ).onclick = (e) => {
    e.preventDefault()
    createElement()
  }
}