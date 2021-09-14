const submitBtn = document.getElementById('submit');
const dataTable = document.getElementById('dataTable');
const rightHeader = document.getElementById('rightHeader');
const counterDisplayElem = document.getElementById('counter');
let count = 4;

let appdata;
const createNode = function (elt) {
    return document.createElement(elt);
};

const makeTableHead = function () {
    let th1 = createNode('th');
    let th2 = createNode('th');
    let th3 = createNode('th');
    let th4 = createNode('th');
    let th5 = createNode('th');
    let th6 = createNode('th');
    th1.innerHTML = 'Name';
    th2.innerHTML = 'Age';
    th3.innerHTML = 'Gender';
    th4.innerHTML = 'Adult';
    th5.innerHTML = "Edit";
    th6.innerHTML = "Delete";
    let tableRow = createNode('tr');
    tableRow.appendChild(th1);
    tableRow.appendChild(th2);
    tableRow.appendChild(th3);
    tableRow.appendChild(th4);
    tableRow.appendChild(th5);
    tableRow.appendChild(th6);
    dataTable.appendChild(tableRow);
};

//Edit Function
const editPencil = function (pencil, row) {
    modifyIndex = pencil.id[6];
    rightHeader.innerHTML = "Modify Information";
    submitBtn.innerHTML = "Update";
    document.getElementById('yourname').value = row.name;
    document.getElementById('age').value = row.age;
    let genderSelect = document.getElementById('yourgender');

    if (row.gender === "Male") genderSelect[1].selected = true;
    else if (row.gender === "Female") genderSelect[2].selected = true;
    else genderSelect[3].selected = true;
}


//Updates page.
const updatePage = function () {
    fetch('/updatePage', {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        appdata = data;
        dataTable.innerHTML = "";
        makeTableHead();
        let rowNum = 1;
        appdata.map(function (row) {
            let tableRow = createNode('tr');
            let td1 = createNode('td');
            let td2 = createNode('td');
            let td3 = createNode('td');
            let td4 = createNode('td');
            let td5 = createNode('td');
            let td6 = createNode('td');

            let pencil = createNode('i');
            pencil.id = `pencil${rowNum}`;
            pencil.innerHTML = "&#x270F";
            pencil.onclick = function (elt) {
                editPencil(pencil, row);
                elt.preventDefault();
                return false;
            };
            let cross = createNode('i');
            cross.id = `cross${rowNum}`;
            cross.innerHTML = "&#x274C";
            cross.onclick = function (elt) {
                let body = cross.id;
                fetch('/delete', {
                    method: 'POST',
                    body
                }).then(function (response) {
                    console.log("Delete post sent to server: " + response);
                    updatePage();
                    //count--;
                });
                elt.preventDefault();
                return false;
            };

            td1.innerHTML = row.name;
            td2.innerHTML = row.age;
            td3.innerHTML = row.gender;
            td4.innerHTML = row.adult;
            td5.appendChild(pencil);
            td6.appendChild(cross);

            tableRow.appendChild(td1);
            tableRow.appendChild(td2);
            tableRow.appendChild(td3);
            tableRow.appendChild(td4);
            tableRow.appendChild(td5);
            tableRow.appendChild(td6);
            dataTable.appendChild(tableRow);
            tableRow.className = rowNum;
            rowNum++;
        });
    });
    console.log("Count = "+count);
    fetch('/updatePage', {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        appdata = data;
        console.log("APPDATA ON UPDATE = "+appdata.length);
        console.log("APPDATA VALUE\n"+JSON.stringify(appdata));
        count = appdata.length;
        console.log("COUNT ON UPDATE = "+count);
        counterDisplayElem.innerHTML = count.toString();
    });
};
updatePage();

let inputSelect;
let modifyIndex = 0;
//Makes page body.
const makePageBody = function () {
    const name = document.getElementById('yourname');
    const age = document.getElementById('age');
    const genderSelect = document.getElementById('yourgender');
    let gender = genderSelect.options[genderSelect.selectedIndex];
    let isAdult = false
    if(parseInt(age.value) >= 18)
        isAdult = true
    const json = {
        name: name.value,
        age: parseInt(age.value),
        gender: gender.value,
        adult: isAdult,
        modifyIndex
    };
    return JSON.stringify(json);
};
//Makes post and sends to server.
const makePost = function () {
    let body = makePageBody();
    let jsonBody = JSON.parse(body);
    let warning = document.getElementById('warning');

    if (jsonBody['name'] === ""
        || jsonBody['age'] === ""
        || jsonBody['age'] < 0
        || jsonBody['age'] > 130
        || jsonBody['gender'] === ""
        || jsonBody['gender'] === "Gender") {
        warning.innerHTML = "You must fill in all fields.";
    } else {
        warning.innerHTML = "";
        fetch(`/${inputSelect}`, {
            method: 'POST',
            body
        }).then(function (response) {
            console.log("Post from makePost sent to server: " + response);
            updatePage();
            document.getElementById('yourname').value = "";
            document.getElementById('age').value = "";
            let genderSelect = document.getElementById('yourgender');
            genderSelect[0].selected = true;
        });
    }
};
//Handles input once button is pressed.
const handleInput = function (elt) {
    if (submitBtn.innerHTML === "Submit") {
        inputSelect = 'add';
        makePost();
        //count++;
    } else {
        inputSelect = 'modify';
        makePost();
        rightHeader.innerHTML = "Add New Information";
        submitBtn.innerHTML = "Submit";

        document.getElementById('yourname').value = "";
        document.getElementById('age').value = "";
        let genderSelect = document.getElementById('yourgender');
        genderSelect.selected = false;
    }
    elt.preventDefault();
    return false;
};
submitBtn.onclick = handleInput;
console.log("Welcome to assignment 2!")