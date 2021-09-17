let firstTime = true
let showingAll = false
const createEntry = function (record) {
    if (firstTime) {
        let table = document.createElement('table')
        table.id = "data"
        let header = document.createElement('tr')
        header.innerHTML = "<th>Name</th><th>Birthday</th><th>Gender</th><th>Life Lived</th><th colspan = \"2\">Actions</th>"
        table.appendChild(header)
        document.body.appendChild(table)
        firstTime = false
    }
    console.log(record)
    const row = document.createElement('tr')
    row.id = record._id
    console.log(row)

    const name = document.createElement('Input')
    name.setAttribute('type', 'text')
    name.setAttribute('value', record.yourname)
    name.setAttribute('class', 'name')

    const DOB = document.createElement('Input')
    DOB.setAttribute('type', 'date')
    DOB.setAttribute('value', record.yourdob)
    DOB.setAttribute('class', 'dob')

    const gender = document.createElement('Select')
    gender.setAttribute('name', 'Gender')
    gender.setAttribute('class', 'gender')

    switch (record.yourgender) {
        case "Male":
            gender.innerHTML = "<option value='Male' selected>Male</option> <option value = 'Female' >Female</option> <option value='Other'>Other</option>"
            break;
        case "Female":
            gender.innerHTML = "<option value='Male' >Male</option> <option value = 'Female' selected>Female</option> <option value='Other'>Other</option>"
            break;
        case "Other":
            gender.innerHTML = "<option value='Male' >Male</option> <option value = 'Female' >Female</option> <option value='Other'selected>Other</option>"
    }

    const percent = document.createElement('p')
    percent.setAttribute('class', 'percentLeft')
    percent.innerText = record.percentDead
    percent.setAttribute('class', 'percent')

    const updateBtn = document.createElement('button')
    updateBtn.setAttribute('class', 'update')
    updateBtn.innerText = 'Update'
    updateBtn.onclick = update

    const removeBtn = document.createElement('button')
    removeBtn.setAttribute('class', 'remove')
    removeBtn.innerText = 'Remove'
    removeBtn.onclick = remove

    row.appendChild(document.createElement('td')).appendChild(name)
    row.appendChild(document.createElement('td')).appendChild(DOB)
    row.appendChild(document.createElement('td')).appendChild(gender)
    row.appendChild(document.createElement('td')).appendChild(percent)
    row.appendChild(document.createElement('td')).appendChild(updateBtn)
    row.appendChild(document.createElement('td')).appendChild(removeBtn)

    document.querySelector('table').appendChild(row)

    return false
}

const addExistingData = function () {
    if (!showingAll) {
        fetch('/all', {
            method: 'POST',
            body: '',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json()
            })
            .then(function (response) {
                console.log(response)
                for (let entry of response) {
                    createEntry(entry)
                }
                showingAll = true
            })
    } else {
        return true
    }
    return false
}

const update = function (event) {
    event.preventDefault()
    const row = event.composedPath()[2]
    console.log(row)
    const name = row.querySelector('.name')
    const dob = row.querySelector('.dob')
    const gender = row.querySelector('.gender')
    json = { yourname: name.value, yourdob: dob.value, yourgender: gender.value, _id: row.id }

    fetch('/update', {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            console.log(response)
            name.setAttribute('value', response.yourname)
            dob.setAttribute('value', response.yourdob)
            switch (response.yourgender) {
                case "Male":
                    gender.innerHTML = "<option value='Male' selected>Male</option> <option value = 'Female' >Female</option> <option value='Other'>Other</option>"
                    break;
                case "Female":
                    gender.innerHTML = "<option value='Male' >Male</option> <option value = 'Female' selected>Female</option> <option value='Other'>Other</option>"
                    break;
                case "Other":
                    gender.innerHTML = "<option value='Male' >Male</option> <option value = 'Female' >Female</option> <option value='Other'selected>Other</option>"
            }
            const percent = row.querySelector('.percent')
            percent.innerText = response.percentDead

        })
    return false
}

const remove = function (event) {
    event.preventDefault()
    const row = event.composedPath()[2]
    console.log(row)
    const name = row.querySelector('.name')
    const dob = row.querySelector('.dob')
    const gender = row.querySelector('.gender')
    json = { yourname: name.value, yourdob: dob.value, yourgender: gender.value, _id: row.id }

    // Tell the server to discard the record with this _id
    fetch('/remove', {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            row.remove() // Remove the HTML for this record
        })
    return false
}

const add = function (event) {
    // prevent default form action from being carried out
    event.preventDefault()

    const name = document.querySelector('#yourname')
    const dob = document.querySelector('#yourbirthdate')
    const gender = document.querySelector('#yourgender')
    // This just gets the item with an id of yourname
    // can use document.querySelectorAll() to get a list of all instances
    json = { yourname: name.value, yourdob: dob.value, yourgender: gender.value }

    console.log(json)

    fetch('/add', {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            // do something with the reponse 
            console.log(response)
            createEntry(response)
        })

    return false
}

const signout = function (event) {
    event.preventDefault()

    fetch('/signout', {
        method: 'POST',
        body: ''
    })
        .then(function (response) {
            console.log('logging out')
            location.replace('http://127.0.0.1:3000/login.html')
        })
    return false
}

window.onload = function () {
    const addBtn = document.querySelector('#add')
    addBtn.onclick = add
    const signoutButton = document.querySelector('#signOut')
    signoutButton.onclick = signout
    //const allBtn = document.querySelector('#all')
    addExistingData()
}