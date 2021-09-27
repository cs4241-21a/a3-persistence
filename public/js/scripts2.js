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

function getUserID() {
  getRequest('/auth/getUserID', {}, (response) => {
    console.log("Login status: " + response.status)
    if (response.status === 200) {
      loggedInUser = response.username
      document.querySelector('#username-box').innerText = `${loggedInUser}`
      els = document.querySelectorAll( '.logged-in' )
      els.forEach(el => el.style.display = 'block')
      getLostItems()
      getFoundItems()
    } else {
      document.querySelector('#error-box').innerText = "Error! Could not fetch user details!"
      document.querySelector('#error-box').classList.add('flash', 'mt-3', 'flash-error')
    }
  })
}

function getItems(listname) {
  getRequest('/api/' + listname, {}, (data) => {
    let table = ""
    for (let info of data) {
        if (info.emailme !== loggedInUser) {
            continue;
        }
        let row = ""
        row += `<td class="p-1 item">${info.item}</td>`
        row += `<td class="p-1 when">${info.when}</td>`
        row += `<td class="p-1 where">${info.where}</td>`
        row += `<td class="p-1 description">${info.description}</td>`
        row += `<td class="p-1 photo">${info.photo}</td>`
        row += `<td class="p-1 emailme">${info.emailme}</td>`
        row += `<td class="p-1 timestamp">${info.created} days ago</td>`
        table += `<tr id="${info._id}">${row}</tr>`
    }
    let header = '<tr><th class="p-1">Item</th><th class="p-1">When</th><th class="p-1">Where</th><th class="p-1">Description</th><th class="p-1">Photo</th><th class="p-1">Email me!</th><th class="p-1">Created</th></tr>'
    document.querySelector('#' + listname).innerHTML = header + table
  })
}

function getFoundItems() {
  getItems('founditems')
}

function getLostItems() {
  getItems('lostitems')
}

window.onload = function() {
  getUserID()
}