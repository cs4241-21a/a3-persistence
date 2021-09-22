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
                //debugger
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
            //debugger;
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
            debugger;
            return response.json();
        }).then(function (res) {
            debugger;
            if (res.failed === "false") {
                el.textContent = res.num + ": " + newname;
            }
            else {
                alert("Could not edit name");
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
        let el = document.createElement("td");
        el.style = "border: none";

        //if second name specified, show name as name: name2
        let rowname = r[i].name;
        if (r[i].name2 !== null && r[i].name2 !== undefined & r[i].name2 !== "") {
            rowname = rowname + ": " + r[i].name2;
        }
        el.innerText = rowname;
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

        if (r[i].un === loggedInAs && r[i].un !== null) {
            let cell6 = row.insertCell();
            let cell7 = row.insertCell();

            let delbut = document.createElement("button");
            delbut.innerText = "D";
            delbut.addEventListener('click', function () {
                let thisrowid = row._id;
                deleteRow(thisrowid);
            });

            let editbut = document.createElement("button");
            editbut.innerText = "E";
            editbut.selected = false;
            editbut.parentrow = row;
            //editbut.rowel = el;
            editbut.nameinput = document.createElement("input");
            editbut.nameinput.setAttribute('type', 'text');
            editbut.nameinput.style = "width: 90%";
            editbut.addEventListener('click', function () {
                let ethisrowid = row._id;
                if (!editbut.selected) {
                    editbut.innerText = "C";
                    el.parentNode.removeChild(el);
                    cell1.appendChild(editbut.nameinput);
                    editbut.selected = true;
                }
                else {
                    editbut.innerText = "E";
                    cell1.removeChild(editbut.nameinput);
                    cell1.appendChild(el);
                    editbut.selected = false;
                    debugger;
                    // console.log(editbut.nameinput.value);
                    editRow(ethisrowid, editbut.nameinput.value, el);
                }


                //nameedit.setAttribute('type')
            });
            cell6.appendChild(editbut);
            cell7.appendChild(delbut);
        }
    }
}