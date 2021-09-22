const button = document.querySelector( 'button' )
window.onload = function() {
    fetch("/load")
    .then(response => response.json())
    .then(appdata => {
        console.log(appdata)
        update_table(appdata)
    });
    button.onclick = submit
}

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    console.log("Started submit function")

    let updating = button.innerText === 'Update Selected Entry';
    if(updating) {
        // console.log('inside if', id)
    }

    const input = document.querySelector( '#my_form' ).elements
    var json = {}
    for(var i = 0 ; i < input.length - 1 ; i++){ // Subtract 1 because we don't want to include the label
        var item = input.item(i);
        if(item.type == "checkbox") { json[item.name] = item.checked; }
        else { json[item.name] = item.value; }
    }

    if(validate_row(json.list_entry, json.quantity)) {
        clear_form();
        fetch("/submit", {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(json => {
                load_table()
            })
    }
    else {
        // Error message
        alert("Bad Form");
    }
    return false
}

function validate_row(item, quantity) {
    if(item === "" || quantity === "") { return false; }
    if(isNaN(quantity)) { return false; }
    return true;
}

function clear_form() {
    document.getElementById("my_form").reset();
}

function load_table() {
    fetch("/load")
        .then(response => response.json())
        .then(appdata => {
            console.log(appdata)
            update_table(appdata)
        });
}

//
// fetch("/load")
//     .then(response => response.json())
//     .then(appdata => {
//         console.log(appdata)
//         update_table(appdata)
//     })
//
// fetch("/submit", {
//     method:'POST',
//     body:JSON.stringify({test:1}),
//     headers: {
//         "Content-Type":"application/json"
//     }
// })

const submit_update = function( e, id ) {
    // prevent default form action from being carried out
    e.preventDefault()
    console.log("STARTING UPDATE")

    const input = document.querySelector( '#my_form' ).elements
    var json = {}
    for(var i = 0 ; i < input.length - 1 ; i++){ // Subtract 1 because we don't want to include the label
        var item = input.item(i);
        if(item.type == "checkbox") { json[item.name] = item.checked; }
        else { json[item.name] = item.value; }
    }

    if(validate_row(json.list_entry, json.quantity)) {
        console.log("VALIDATED")
        document.getElementById("submit_button").innerText = 'Add Item';
        button.onclick = submit

        clear_form();
        fetch("/update", {
            method: 'POST',
            body: JSON.stringify( { 'json': json, 'id': id } ),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(json => {
                load_table()
            })
    }
    else {
        // Error message
        alert("Bad Form");
    }
    return false
}