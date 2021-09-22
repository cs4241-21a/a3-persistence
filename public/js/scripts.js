let table = document.getElementById("shopping_list");

function update_table(data) {
    // let json_data = JSON.parse(data);
    // appdata = json_data["data"];
    clear_table();
    data.forEach(element => add_row(element["_id"], element["list_entry"], element["quantity"], element["urgency"], element["deadline"]));
}

function add_row(id, item, quantity, urgent, deadline) {
    let row = table.insertRow(-1);

    if(urgent) {
        row.setAttribute("Style", "background-color: #ffff6a");
    }
    else {
        row.setAttribute("Style", "background-color: #ffc06a");
    }

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    cell4.addEventListener('click', function() {
        delete_row(id);
    });
    cell5.addEventListener('click', function() {
        update_row(id);
    });

    cell1.innerHTML = item;
    cell2.innerHTML = quantity;
    cell3.innerHTML = deadline
    cell4.innerHTML = 'Delete'
    cell5.innerHTML = 'Update'
}

function delete_row(id) {
    fetch('/delete', {
        method: 'POST',
        body: JSON.stringify({ _id: id }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(json => {
            if(json['acknowledged']) {
                load_table()
            }
    })
}

function update_row(id) {
    // Get the data from that row first
    fetch('/get_item', {
        method: 'POST',
        body: JSON.stringify({ _id: id }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(json => {
            populate_form(json[0])
        })
}

function populate_form(json) {
    document.getElementById("list_entry").value = json['list_entry'];
    document.getElementById("quantity").value = json['quantity'];
    document.getElementById("urgency").checked = json['urgency'];
    document.getElementById("submit_button").innerText = 'Update Selected Entry';

    const button = document.querySelector( 'button' )
    button.onclick = null // Remove current submit for button
    button.addEventListener('click', function () {
        submit_update(event, json['_id'])
    },{once : true})
}

function clear_table() {
    table = document.getElementById("shopping_list");

    let nLength = 0;
    while(table.rows.length > 1)
    {
        nLength = table.rows.length;
        table.deleteRow(-1);
        if (nLength == table.rows.length)
        {
            table.rows[nLength-1].outerHTML = '';
        }
    }
}