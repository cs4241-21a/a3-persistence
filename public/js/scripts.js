// Add some Javascript code here, to run on the front end.
const form = document.getElementById( "form" )
const formTitle = document.getElementById( "form-title" )
const task = document.getElementById( "name" )
const period = document.getElementById( "period" )
const deadlineDate = M.Datepicker.init( document.getElementById( "deadline-date" ) )
const deadlineHour = M.Timepicker.init( document.getElementById( "deadline-hour" ) )
const submitButton = document.getElementById( "submit-form-button" )

const addButton = document.getElementById( "add-button" )

const taskContainer = document.getElementById( "task-container" )
const taskTemplate = document.getElementById( "task-template" ).content.children[0]

let _id = NaN;
let requestType = "/add";

window.onload = function() {
    submitButton.onclick = submit
    addButton.onclick = add

    fetch( "/update", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: "{}"
    })
    .then( ( response ) => response.json() )
    .then( function( appData ) {
        update( appData )
    })
}

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    form.hidden = true

    let interval = 60 * 60 * 1000 // number of milliseconds in an hour
    let deadline = Date.parse( deadlineDate.date ) + timeToNumber( deadlineHour.time )

    let json
    switch( requestType ) {
        case "/add":
            json = { name: task.value, period: Number.parseInt( period.value ), deadline };
            break;
        case "/edit": 
            json = { _id, name: task.value, period: Number.parseInt( period.value ), deadline };
            break;
    }

    const body = JSON.stringify( json )

    fetch( requestType, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body
    })
    .then( ( response ) => response.json() )
    .then( function( appData ) {
        update( appData )
    })

    return false
}

const add = function ( e ) {
    e.preventDefault()

    form.hidden = false
    formTitle.innerText = "Add new task:"
    requestType = "/add"

    return false
}

const getEditCallback = function( task ) {
    const utask = task
    return function( e ) {
        edit( e, utask )
    }
}

const getRemoveCallback = function( task ) {
    const utask = task
    return function( e ) {
        remove( e, utask )
    }
}

const edit = function( e, utask ) {
    e.preventDefault()

    form.hidden = false
    formTitle.innerText = "Edit task:"
    task.value = utask.name
    period.value = utask.period
    deadlineDate.value = new Date( utask.deadline )
    deadlineHour.value = new Date( utask.deadline ).getHours() + ":00"
    requestType = "/edit"
    _id = utask._id

    return false
}

const remove = function( e, utask ) {
    e.preventDefault()

    _id = utask._id

    fetch( "/remove", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { _id } )
    })
    .then( ( response ) => response.json() )
    .then( function( appData ) {
        update( appData )
    })

    return false
}

const update = function ( json ) {
    //clear tasks
    taskContainer.innerHTML = ""

    //load tasks from json and none if login was invalid
    json.forEach( task => {
        let element = taskTemplate.cloneNode( true )
        element.children[0].innerText = task.name
        element.children[1].innerText = numberToDateText( task.start )
        element.children[2].innerText = numberToHoursText( task.period )
        element.children[3].innerText = numberToDateText( task.deadline )
        element.children[4].children[0].onclick = getEditCallback( task )
        element.children[4].children[1].onclick = getRemoveCallback( task )

        taskContainer.appendChild( element )
    });

    return false
}

// --------------------------------------------------------------
// ---------- Data to text conversion helper functions ----------
// --------------------------------------------------------------

const numberToHoursText = function( number ) {
    let suffix = ( number == 1 )?"":"s"
    return "" + number + " hour" + suffix
}

const numberToDateText = function( number ) {
    let date = new Date( number )

    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let pm = "AM"
    if ( hours >= 12 ) {
        pm = "PM"
        hours -= 12
    }
    if ( hours === 0 ) {
        hours = 12
    }

    return "" + hours + ":00 " + pm + " " + month + "/" + day + "/" + year
}

const timeToNumber = function( time ) {
    const interval = 60 * 60 * 1000 // number of milliseconds in an hour

    let components = time.split(':')
    let hours = parseInt(components[0]) + Math.round( parseInt( components[1] ) / 60 )
    return hours * interval
}
