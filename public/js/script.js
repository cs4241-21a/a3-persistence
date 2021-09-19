// Add some Javascript code here, to run on the front end.

const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()
    console.log("SUBMIT");
    let val1 = document.getElementById("value1").value;
    let val2 = document.getElementById("value2").value;
    const op = document.getElementById("operator").value;
    val1 = val1.replace(/\s+/g, ''); //remove all whitespace
    val2 = val2.replace(/\s+/g, '');
    if (isNaN(val1) || isNaN(val2) || val1 === "" || val2 === "") {
        alert("Must input numbers");
    }
    else if (op.match(/^[-+/^*]/) === null) {
        alert("Must input valid operator (+, -, *, /, ^)");
    }
    else {
        json = { x: val1, y: val2, o: op },
            body = JSON.stringify(json)
        fetch('/add', {
            method: 'POST',
            body: body,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(function (response) {
                console.log(response);
                return response.json();
            }).then(function (data) {
                console.log(data);
                addRows(data);
            })
    }

    return false
}

const convert = function () {
    let input = document.getElementById("bintext").value.toLowerCase();
    //SET INPUT TO LOWERCASE
    let output = "";
    for (var i = 0; i < input.length; i++) {
        output += input[i].charCodeAt(0).toString(2) + " ";
    }
    //console.log(output); //number in binary, with spaces
    //console.log(parseInt(output.split(" ").join(""), 2)); //actual number
    //console.log(parseInt(output.split(" ").join(""), 2).toString(2)); //number in binary

    document.getElementById("bintextconv").value = parseInt(output.split(" ").join(""), 2);
}

window.onload = function () {
    const button = document.getElementById("compute");
    button.onclick = submit

    document.getElementById("convert").onclick = convert;

    body = ""
    fetch('/load', {
        method: 'GET'
        // headers: {
        //     "Content-Type": "application-json"
        // }

    })
        .then(function (response) {
            console.log("GOT TO FIRST .then")
            return response.json();
        }).then(function (data) {
            console.log("GOT TO SECOND .then", data)
            addRows(data);
        })
    //I can do a POST with a different url /load
    //NEED TO LOAD THE WHOLE TABLE HERE
}

function addRows(response) {
    r = response;
    //r = JSON.parse(response);
    table = document.getElementById("table");

    rlen = table.rows.length
    for (i = 1; i < rlen; i++) {
        try {
            table.deleteRow(rlen - i);
        }
        catch (e) {
            alert(e);
            console.log("failed to delete row");
        }
    }

    for (i = 0; i < r.length; i++) {
        let row = table.insertRow(1);

        let cell1 = row.insertCell();
        let el = document.createElement("td");
        el.style = "border: none";
        el.innerText = r[i].name;
        cell1.appendChild(el);

        let cell2 = row.insertCell();
        let el2 = document.createElement("td");
        el2.style = "border: none";
        el2.innerText = r[i].x;
        cell2.appendChild(el2);

        let cell3 = row.insertCell();
        let el3 = document.createElement("td");
        el3.style = "border: none";
        el3.innerText = r[i].y;
        cell3.appendChild(el3);

        let cell4 = row.insertCell();
        let el4 = document.createElement("td");
        el4.style = "border: none";
        el4.innerText = r[i].o;
        cell4.appendChild(el4);

        let cell5 = row.insertCell();
        let el5 = document.createElement("td");
        el5.style = "border: none";
        el5.innerText = r[i].result;
        cell5.appendChild(el5);
    }
}