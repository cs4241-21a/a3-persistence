// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 3!")

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const name = document.getElementById( 'yourname' ),
        gradYear = document.getElementById('grad-year'),
        major = document.querySelector('input[name="major"]:checked'),
        highlight = document.getElementById('highlight').checked,
        json =
            {
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
        updateTable(data)
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
    if (data.highlight) {
        name.style.backgroundColor = "yellow"
        gradYear.style.backgroundColor = "yellow"
        className.style.backgroundColor = "yellow"
        major.style.backgroundColor = "yellow"
    }
    document.getElementById("data-table").appendChild(tr)
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