// Add some Javascript code here, to run on the front end.
let loggedInAs = null;
const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()
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

const deleteRow = function (id) {
    json = { _id: id },
        body = JSON.stringify(json)
    fetch('/delete', {
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
            if (data.failed === "false") {
                table = document.getElementById("table");
                for (i = 1; i < table.rows.length; i++) {
                    if (table.rows[i]._id === id) {
                        try {
                            table.deleteRow(i);
                        }
                        catch (e) {
                            alert(e);
                            console.log("failed to delete row");
                        }
                        break;
                    }
                }
            }
        })
}

const editRow = function (id, newname, el) {
    json = { _id: id, name2: newname },
        body = JSON.stringify(json)
    fetch('/edit', {
        method: 'POST',
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (res) {
            if (res.failed === "false") {
                if (newname !== ""){
                    el.textContent = res.num + ": " + newname;
                }
                else{
                    el.style = "white-space: pre;"; //preserve \n
                    el.textContent = res.num;
                }
            }
            else {
                alert("Could not edit row name, likely due to server error");
            }
        })
}

const logout = function () {
    fetch('/logout', {
        method: 'GET'
    }).then(res => {
        window.location.href = "index.html";
    })
}

const convert = function () {
    let input = document.getElementById("bintext").value.toLowerCase();
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
    loggedInAs = null;
    const button = document.getElementById("compute");
    button.onclick = submit
    document.getElementById("logout").onclick = logout;
    document.getElementById("convert").onclick = convert;

    body = ""
    fetch('/load', {
        method: 'GET'
    })
        .then(function (response) {
            let contentType = response.headers.get("content-type");
            console.log(contentType);
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(data => {
                    loggedInAs = data.shift().un;
                    document.getElementById("logouttext").innerText = "You are logged in as: " + loggedInAs;
                    addRows(data);
                })
            }
            else {
                window.location.href = "index.html";
            }

        })
}

function addRows(response) {
    r = response;
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
        row._id = r[i]._id;

        let cell1 = row.insertCell();
        //if second name specified, show name as name: name2
        cell1.rowname = r[i].name;
        if (r[i].name2 !== null && r[i].name2 !== undefined && r[i].name2 !== "") {
            cell1.rowname = cell1.rowname + ": " + r[i].name2;
        }
        cell1.innerText = cell1.rowname;

        let cell2 = row.insertCell();
        cell2.innerText = r[i].x;

        let cell3 = row.insertCell();
        cell3.innerText = r[i].o;

        let cell4 = row.insertCell();
        cell4.innerText = r[i].y;

        let cell5 = row.insertCell();
        cell5.innerText = r[i].result;

        //if can edit/delete the values in this row, insert buttons
        if (r[i].un === loggedInAs && r[i].un !== null) {

            let delbut = document.createElement("button");
            delbut.innerHTML = '<i class="fa fa-trash-o fa-lg"></i> <span class="visuallyhidden">delete</span>';
            delbut.addEventListener('click', function () {
                let thisrowid = row._id;
                deleteRow(thisrowid);
            });

            let editbut = document.createElement("button");
            editbut.innerHTML = '<i class="fas fa-edit fa-lg"></i> <span class="visuallyhidden">edit</span>';
            editbut.selected = false;
            editbut.nameinput = document.createElement("input");
            editbut.nameinput.setAttribute('type', 'text');
            editbut.addEventListener('click', function () {
                let ethisrowid = row._id;
                if (!editbut.selected) {
                    editbut.innerHTML = '<i class="fas fa-check fa-lg"></i> <span class="visuallyhidden">confirm</span>';
                    cell1.innerText = "";
                    cell1.appendChild(editbut.nameinput);
                    editbut.nameinput.focus();
                    editbut.selected = true;
                }
                else {
                    editbut.innerHTML = '<i class="fas fa-edit fa-lg"></i> <span class="visuallyhidden">edit</span>';
                    cell1.removeChild(editbut.nameinput);
                    editbut.selected = false;
                    editRow(ethisrowid, editbut.nameinput.value, cell1);
                }
            });

            let cell6 = row.insertCell();
            cell6.style ="display: flex; flex-direction: row";
            cell6.appendChild(delbut);
            cell6.appendChild(editbut);
        }
    }
}