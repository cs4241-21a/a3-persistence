let entryCount = 0;
let formOpen = -2; // -2 = Not open, -1 = Open for add entry, 0+ = Open for edit index entry

window.onload = () => {
    loadServerData();

    const addButton = document.querySelector("#add-button")
    addButton.onclick = () => {
        clearForm();
        switchForm(-1, entryCount);
    }

    const submitButton = document.querySelector("#submit-button");
    submitButton.onclick = submitData;
}

const loadServerData = () => {
    fetch( "/events", {
        method:"GET",
    })
    .then(res => res.json())
    .then(res => { 
        res.forEach((item, index) => {
            addTableRow(entryCount);    
            setEntry(index, item);
            entryCount++;
        });
    })
}

//#region Table Handling
    // Sets the table data of a given entry for row identified by index
    const setEntry = (index, entry) => {
        const tableRows = document.getElementsByClassName("table-row");
        const entryRow = tableRows[index];

        const tableDatas = entryRow.querySelectorAll("td");
        tableDatas[0].innerText = entry["name"];
        tableDatas[1].innerText = entry["date"] || "N/A";
        tableDatas[2].innerText = entry["time"] || "N/A";
        tableDatas[3].innerText = (entry["attendance"]) ? "Yes" : "No";
    }

    // Creates a new row on the table
    const addTableRow = (index) => {
        const emptyRow = document.querySelector("#empty-row");
        const newRow = emptyRow.cloneNode(true);
        newRow.setAttribute("id", "");
        newRow.setAttribute("class", "table-row");
        
        const iconButtonCell = newRow.querySelector(".icon-button-cell");
        iconButtonCell.innerHTML = "";
        iconButtonCell.appendChild(addOptionButtons(index));

        emptyRow.before(newRow);
    }

    // Creates the option buttons for an existing row on the table
    const addOptionButtons = (index) => {
        const onClickEdit = (e) => {
            setForm(index);
            switchForm(index, index);
        }

        const onClickDelete = (e) => {
            deleteData(index);
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
    const switchForm = (formType, index) => {
        const form = document.querySelector("form");
        if (form.hidden || formType != formOpen) {
            openForm(index);
            formOpen = formType;
        } else hideForm(); 
    }

    const openForm = (index) => {
        const form = document.querySelector("form");
        form["submit-button"].value = index;
        form.hidden = false;
    }

    const hideForm = () => {
        const form = document.querySelector("form");
        form.hidden = true;
        formOpen = -2;
    }

    const setForm = (index) => {
        const tableRows = document.getElementsByClassName("table-row");
        const entryRow = tableRows[index];
        const tableDatas = entryRow.querySelectorAll("td");

        const form = document.querySelector("form");

        form.name.value = tableDatas[0].innerText;
        form.date.value = tableDatas[1].innerText;
        form.time.value = tableDatas[2].innerText;
        form.querySelector("#attendance").checked = (tableDatas[3].innerText == "Yes"); 
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

        const index = e.target.value;

        const json = {
            index,
            item: {
                name, 
                date,
                time,
                attendance
            }
        };
        const body = JSON.stringify(json);
        console.log(json);//!!!

        fetch( "/submit", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body 
        })
        .then(() => {
            if (index >= entryCount) {
                addTableRow(entryCount);
                entryCount++;
            }
            setEntry(index, json["item"]);
        })

        clearForm();
        hideForm();
    }

    const deleteData = (index) => {
        const body = JSON.stringify({index});

        fetch( "/submit", {
            method:"POST",
            body 
        })
        .then(() => {
            window.location.replace(window.location.href);
        })
    }
//#endregion
