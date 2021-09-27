const addEntry = json => {
    var table = document.getElementById("resultsTable");

    var newRow = table.insertRow(-1),
        newName = newRow.insertCell(0),
        newHouse = newRow.insertCell(1),
        editElement = newRow.insertCell(2),
        deleteBtn = document.createElement("Input"),
        editBtn = document.createElement("Input");


    deleteBtn.value = "Delete";
    deleteBtn.className += "deleteBtn";
    editElement.appendChild(deleteBtn);

    var idElement = json._id;

    //Adding text to fields
    newName.innerHTML = json.cname;
    newHouse.innerHTML = json.house;

    //Appending delete button to td
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("value", "Delete");
    deleteBtn.className = "deleteBtn";

    //Appending edit button to td
    editBtn.setAttribute("type", "button");
    editBtn.setAttribute("value", "Edit");
    editBtn.className = "editBtn";
    editElement.appendChild(editBtn);
    editElement.appendChild(deleteBtn);

    var cnameInput = document.createElement("Input"),
        houseInput = document.createElement("Input"),
        id = idElement;

    cnameInput.value = newName.innerHTML;
    houseInput.value = newHouse.innerHTML;

    editBtn.onclick = function () {
        document.querySelector("#cname").value = json.cname;
        document.querySelector("#house").value = json.house;

        newRow.delete();

        let json = {
            cname: cnameInput.value,
            house: houseInput.value,
            id: id
        },
            body = JSON.stringify(json);

        fetch("/update", {
            method: "POST",
            body,
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(json => {
                cnameInput.value = newName.innerHTML;
                houseInput.value = newHouse.innerHTML;
            });
    };

    //Handles delete function
    deleteBtn.onclick = function () {
        fetch("/delete", {
            method: "POST",
            body: JSON.stringify({ idElement }),
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(json => {
                newRow.delete();
            });
    };
};

//Loads data and throws it in the table
function loadDatabase(item) {
    var table = document.getElementById("resultsTable");

    var newRow = table.insertRow(-1),
        newName = newRow.insertCell(0),
        newHouse = newRow.insertCell(1),
        editElement = newRow.insertCell(2),
        deleteBtn = document.createElement("Input"),
        editBtn = document.createElement("Input");

    //Appending delete button to td
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("value", "Delete");
    deleteBtn.className = "deleteBtn";

    //Appending edit button to td
    editBtn.setAttribute("type", "button");
    editBtn.setAttribute("value", "Edit");
    editBtn.className = "editBtn";
    editElement.appendChild(editBtn);
    editElement.appendChild(deleteBtn);

    let idElement = item._id;

    let cnameInput = document.createElement("Input"),
        houseInput = document.createElement("Input"),
        id = idElement;

    //Adding text to fields
    newName.innerHTML = item.cname;
    newHouse.innerHTML = item.house;

    cnameInput.value = newName.innerHTML;
    houseInput.value = newHouse.innerHTML;

    //Appending edit button
    editBtn.setAttribute("type", "button");
    editBtn.setAttribute("value", "Edit");
    editBtn.className = "editButton";
    editElement.appendChild(editBtn);

    //Appending delete button
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("value", "Delete");
    deleteBtn.className = "deleteBtn";
    editElement.appendChild(deleteBtn);

    //Delete function
    deleteBtn.onclick = function () {
        deleteFunc(idElement);
    };

    //Edit function
    editBtn.onclick = function () {
        document.querySelector("#cname").value = item.cname;
        document.querySelector("#house").value = item.house;

        deleteFunc(idElement);
    };
}

function deleteFunc(idElement) {
    fetch("/delete", {
        method: "POST",
        body: JSON.stringify({ idElement }),
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(json => {
            clearTable();
        });
    console.log("piss pee");
}

//Submits a new entry
const submit = function (e) {
    e.preventDefault();

    const cname = document.querySelector("#cname"),
        house = document.querySelector("#house");

    if (name.value === "" || house.value === "") {
        alert("Please fill in all fields.");
        return false;
    }

    let json = {
        cname: cname.value,
        house: house.value
    };
    let body = JSON.stringify(json);

    fetch("/submit", {
        method: "POST",
        body: body,
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(json => {
            addEntry(json);
        });
    return false;
};


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//Clears table
function clearTable() {
    let table = document.querySelector('#resultsTable');
    table.innerHTML = table.rows[0].innerHTML;
    setTimeout(() => { console.log("Hmm WAit!"); }, 2000);
    loadTable();
}

//Handles logout
const logout = function (e) {
    e.preventDefault();

    fetch("logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    window.location.href = "/login";
};

//Loads table
function loadTable() {
    fetch("/characters")
        .then(response => response.json())
        .then(character => {
            console.log(character);
            character.forEach(loadDatabase);
        });
}

window.onload = function () {
    //Grabs the json and loads into the table
    fetch("/characters")
        .then(response => response.json())
        .then(character => {
            console.log(character);
            character.forEach(loadDatabase);
        });

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.onclick = submit;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.onclick = logout;
};
