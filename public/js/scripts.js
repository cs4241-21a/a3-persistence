// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 3!")

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    const name = document.getElementById( 'yourname' ),
        gradYear = document.getElementById('grad-year'),
        major = document.querySelector('input[name="major"]:checked'),
        highlight = document.getElementById('highlight').checked,
        id = document.getElementById("id"),
        json =
            {
                _id: id.value,
                name: name.value,
                gradYear :gradYear.value,
                major: major.value,
                highlight: highlight
            },
        body = JSON.stringify( json )
    console.log(body)

    fetch( '/submit', {
        method:'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body
    }).then(response => {
        console.log(`Response time: ${response.headers.get('X-Response-Time')}`)
        return response.json()
    }).then( function( data ) {
        name.value = ""
        gradYear.value = ""
        major.checked = false
        document.getElementById('highlight').checked = false
        updateTable(data)
        location.reload()
    })
    return false
}

window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit
    preloadDatabase()
}

function updateTable(data) {
    console.log(data)
    let tr = document.createElement("tr")
    tr.id = data._id
    let name = document.createElement("td")
    name.textContent = data.name
    tr.appendChild(name)
    let gradYear = document.createElement("td")
    gradYear.textContent = data.gradYear
    tr.appendChild(gradYear)
    let className = document.createElement("td")
    className.textContent = data.className
    tr.appendChild(className)
    let major = document.createElement("td")
    major.textContent = data.major
    tr.appendChild(major)
    let deleteTD = document.createElement("td")
    let deleteButton = document.createElement("button")
    deleteButton.classList.add("btn", "btn-danger")
    deleteButton.innerText = "Delete"
    deleteTD.appendChild(deleteButton)
    deleteButton.value = data._id
    deleteButton.onclick = (ev => {
        deleteEntry(ev, data._id)
    })
    tr.appendChild(deleteTD)
    let editTD = document.createElement("td")
    let editButton = document.createElement("button")
    editButton.classList.add("btn", "btn-warning")
    editButton.innerText = "Edit"
    editButton.value = data._id
    editButton.onclick = (ev => {
        editEntry(ev, data)
    })
    editTD.appendChild(editButton)
    tr.appendChild(editTD)
    if (data.highlight) {
        name.style.backgroundColor = "yellow"
        gradYear.style.backgroundColor = "yellow"
        className.style.backgroundColor = "yellow"
        major.style.backgroundColor = "yellow"
        deleteTD.style.backgroundColor = "yellow"
        editTD.style.backgroundColor = "yellow"
    }
    document.getElementById("data-table").appendChild(tr)
}

function deleteEntry(event, id) {
    event.preventDefault()
    console.log(`Deleting ${id}`)
    document.getElementById(id).remove()
    let data = {
        id: id
    }
    let body = JSON.stringify(data)
    fetch( '/delete', {
        method:'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body
    }).then(() => location.reload())
}

function editEntry(event, data) {
    event.preventDefault()
    console.log(`Edit ${data._id}`)
    document.getElementById('highlight').checked = data.highlight
    document.getElementById( 'yourname' ).value = data.name
    document.getElementById('grad-year').value = data.gradYear
    document.querySelector(`input[value=${data.major}]`).checked = true
    document.getElementById("id").value = data._id
    document.getElementById(data._id).remove()
}

function preloadDatabase() {
    fetch('/database').then(response => {
        console.log(`Response time: ${response.headers.get('X-Response-Time')}`)
        return response.json()
    }).then(json => {
        console.log(json)
        json.forEach(data => {
            updateTable(data)
        })
    })
}

