// Add some Javascript code here, to run on the front end.

const form = document.getElementById( "form" )
const formTitle = document.getElementById( "form-title" )
const task = document.getElementById( "name" )
const period = document.getElementById( "period" )
const deadline = document.getElementById( "deadline" )

const taskContainer = document.getElementById( "task-container" )
const taskTemplate = document.getElementById( "task-template" ).content.children[0]

let id = NaN;
let requestType = 0; //0 is add, 1 is edit, 2 is delete

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    form.hidden = true

    let json
    switch( requestType ) {
        case "/add":
            json = { name: task.value, period: Number.parseInt( period.value ), deadline: Date.parse( deadline.value ) };
            break;
        case "/edit": 
            json = { id, name: task.value, period: Number.parseInt( period.value ), deadline: Date.parse( deadline.value ) };
            break;
    }

    const body = JSON.stringify( json )
    console.log( body )

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
    task.value = "Task Name"
    period.value = "1"
    deadline.value = numberToDateValue( Date.parse( Date() ) )
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

    form.removeAttribute( "hidden" )
    formTitle.innerText = "Edit task:"
    task.value = utask.name
    period.value = utask.period
    deadline.value = numberToDateValue( utask.deadline )
    requestType = "/edit"
    id = utask._id

    return false
}

const remove = function( e, utask ) {
    e.preventDefault()

    id = utask._id

    fetch( "/remove", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id } )
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

    //load tasks from json
    json.forEach(task => {
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

window.onload = function() {
    const submitButton = document.getElementById( "submit-form-button" )
    const addButton = document.getElementById( "add-button" )
    
    submitButton.onclick = submit
    addButton.onclick = add

    //load data from server
    fetch( "/update", {
        method: "POST",
        body: "{}"
    })
    .then( ( response ) => response.json() )
    .then( function( appData ) {
        update( appData )
    })
}

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

const numberToDateValue = function( number ) {
    let date = new Date( number )
    
    let year = "" + date.getFullYear()
    while ( year.length < 4 ) {
        year = "0" + year
    }
    let month = "" + ( date.getMonth() + 1 )
    if ( month.length < 2 ) {
        month = "0" + month
    }
    let day = "" + date.getDate()
    if ( day.length < 2 ) {
        day = "0" + day
    }
    let hours = "" + date.getHours()
    if ( hours.length < 2 ) {
        hours = "0" + hours
    }

    return year + "-" + month + "-" + day + "T" + hours + ":00"
}
