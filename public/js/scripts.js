let entryCount = 0;
let activeId; // -1 = Not Open, 0 = New Entry, id = Open for entry w/id

window.onload = () => {
    loadServerData();

    const addButton = document.querySelector("#add-button")
    addButton.onclick = () => {
        clearForm();
        switchForm(0);
    }

    const submitButton = document.querySelector("#submit-button");
    submitButton.onclick = submitData;
}

const loadServerData = () => {
    fetch( "/db", {
        method:"GET",
    })
    .then(res => res.json())
    .then(res => { 
        res.forEach((item) => {
            setEntry(addTableRow(item._id), item);
            entryCount++;
        });
    })
}

//#region Table Handling
    // Sets the table data of a given entry for row
    const setEntry = (entryRow, entry) => {
        const tableDatas = entryRow.querySelectorAll("td");
        tableDatas[0].innerText = entry["name"];
        tableDatas[1].innerText = entry["date"] || "N/A";
        tableDatas[2].innerText = entry["time"] || "N/A";
        tableDatas[3].innerText = (entry["attendance"]) ? "✓" : "✖";
    }

    // Creates a new row on the table
    const addTableRow = (id) => {
        const emptyRow = document.querySelector("#empty-row");
        const newRow = emptyRow.cloneNode(true);
        newRow.setAttribute("id", id);
        newRow.setAttribute("class", "table-row");
        
        const iconButtonCell = newRow.querySelector(".icon-button-cell");
        iconButtonCell.innerHTML = "";
        iconButtonCell.appendChild(addOptionButtons(newRow, id));

        emptyRow.before(newRow);

        return newRow;
    }

    // Finds a table row by the id of the item it contains
    const findTableRow = (id) => {
        return document.getElementById(id);
    }

    // Creates the option buttons for an existing row on the table
    const addOptionButtons = (entryRow, id) => {
        const onClickEdit = (e) => {
            setForm(entryRow);
            switchForm(id);
        }

        const onClickDelete = (e) => {
            deleteData(id);
        }

        const btnContainer = document.createElement("div");
        btnContainer.setAttribute("class", "icon-button-container");

        const btnEdit = document.createElement("button");
        btnEdit.setAttribute("class", "icon-button");
        btnEdit.onclick = onClickEdit;
        
        const imgEdit = document.createElement("img");
        imgEdit.setAttribute("class", "icon edit-icon");
        imgEdit.setAttribute("src", "img/edit.svg");
        imgEdit.setAttribute("title", "Edit Entry");
        
        const btnDelete =  document.createElement("button");
        btnDelete.setAttribute("class", "icon-button");
        btnDelete.onclick = onClickDelete;

        const imgDelete = document.createElement("img");
        imgDelete.setAttribute("class", "icon delete-icon");
        imgDelete.setAttribute("src", "img/delete.svg");
        imgDelete.setAttribute("title", "Delete Entry");

        btnEdit.appendChild(imgEdit);
        btnDelete.appendChild(imgDelete);
        btnContainer.appendChild(btnEdit);
        btnContainer.appendChild(btnDelete);

        return btnContainer;
    }
//#endregion

//#region Form Handling
    const switchForm = (id) => {
        const form = document.querySelector("form");
        if (form.hidden || activeId != id) {
            openForm(id);
            activeId = id;
        } else hideForm(); 
    }

    const openForm = (id) => {
        const form = document.querySelector("form");
        form["submit-button"].value = id;
        form.hidden = false;
    }

    const hideForm = () => {
        const form = document.querySelector("form");
        form.hidden = true;
        formOpen = -1;
    }

    const setForm = (entryRow) => {
        const tableDatas = entryRow.querySelectorAll("td");

        const form = document.querySelector("form");

        form.name.value = tableDatas[0].innerText;
        form.date.value = tableDatas[1].innerText;
        form.time.value = tableDatas[2].innerText;
        form.querySelector("#attendance").checked = (tableDatas[3].innerText == "✓"); 
    }

    const clearForm = () => {
        const form = document.querySelector("form");
        form.name.value = "";
        form.date.value = "";
        form.time.value = "";
        form.querySelector("#attendance").checked = false;
    }

    const submitData = e => {
        e.preventDefault();

        const form = document.querySelector("form");

        const name = form["name"].value;
        const date = form["date"].value;
        const time = form["time"].value;
        const attendance = form.querySelector("#attendance").checked;

        let uri = (activeId === 0) ? "/create" : "/update";

        const json = {
            id: activeId,
            item: {
                name, 
                date,
                time,
                attendance
            }
        };
        const body = JSON.stringify(json);

        fetch(uri, {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body 
        })
        .then(response => response.json())
        .then(response => {
            let entryRow;
            if (activeId === 0) entryRow = addTableRow(response.id);
            else entryRow = findTableRow(response.id);
            setEntry(entryRow, json["item"]);
        })

        clearForm();
        hideForm();
    };

    const deleteData = (id) => {
        const body = JSON.stringify({id});
        console.log(body);

        fetch("/delete", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body 
        })

        const entryRow = findTableRow(id);
        entryRow.remove();
    }
//#endregion
