let state = {
    entryMode: 'new-entry'
};

let databaseData = [];

function main() {
    addSubmitOnClick();
    addEntryOnClick();
    populateDatabaseView();

    document.getElementById('id-input').style.display = 'none';
}

function addEntryOnClick() {
    const showNewEntry = document.getElementById('show-new-entry');
    const showModifyEntry = document.getElementById('show-modify-entry');
    const showDeleteEntry = document.getElementById('show-delete-entry');

    showNewEntry.onclick = function() {
        state.entryMode = 'new-entry';
        changeEntryName('New Entry');

        document.getElementById('id-input').style.display = 'none';
        document.getElementById('input-data').style.display = '';
    };

    showModifyEntry.onclick = function() {
        state.entryMode = 'modify-entry';
        changeEntryName('Modify Entry');

        document.getElementById('id-input').style.display = '';
        document.getElementById('input-data').style.display = '';
    };

    showDeleteEntry.onclick = function() {
        state.entryMode = 'delete-entry';
        changeEntryName('Delete Entry');

        document.getElementById('id-input').style.display = '';
        document.getElementById('input-data').style.display = 'none';
    };
}

function changeEntryName(str) {
    const entryName = document.getElementById('entry-name');
    entryName.innerHTML = '';
    const h3 = document.createElement('h2');
    h3.innerHTML = str;
    entryName.appendChild(h3);
}

function addSubmitOnClick() {
    document.getElementById('submit').onclick = function(event) {
        switch (state.entryMode) {
            case 'new-entry':
            console.log('newEntry')
            newEntry();
            break;
            case 'modify-entry':
            modifyEntry();
            break;
            case 'delete-entry':
            deleteEntry();
            break;
            default:
            break;
        }
        return false;
    }
}

function newEntry() {
    const firstName = document.getElementById('firstNameInput').value;
    const lastName = document.getElementById('lastNameInput').value;
    const birthday = document.getElementById('birthdayInput').value;
    const gender = document.getElementById('genderInput').value;

    const data = {
        firstName,
        lastName,
        birthday,
        gender,
    };

    console.log(JSON.stringify(data));

    const fetchParams = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(data),
    };

    fetch('/newEntry', fetchParams)
    .then((response) => response.text())
    .then((text) => {
        console.log(text);
        populateDatabaseView();
    });
}

function modifyEntry() {
    const idInput = document.getElementById('idInput').value;
    const firstName = document.getElementById('firstNameInput').value;
    const lastName = document.getElementById('lastNameInput').value;
    const birthday = document.getElementById('birthdayInput').value;
    const gender = document.getElementById('genderInput').value;

    const data = {
        _id: idInput,
        firstName,
        lastName,
        birthday,
        gender,
    };

    console.log(data);

    const fetchParams = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(data),
    };

    fetch('/modifyEntry', fetchParams)
    .then((response) => response.text())
    .then((text) => {
        console.log(text)
        populateDatabaseView();
    });
}

function deleteEntry() {
    const idInput = document.getElementById('idInput').value;

    const data = {
        _id: idInput,
    };

    console.log(data);

    const fetchParams = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(data),
    };

    fetch('/deleteEntry', fetchParams)
    .then((response) => response.text())
    .then((text) => {
        console.log(text)
        populateDatabaseView();
    });
}

function populateDatabaseView() {
    const databaseTable = document.getElementById('database-table');
    databaseTable.tBodies[0].innerHTML = '';
    fetch('/getData')
    .then((response) => response.json())
    .then((arr) => {
        arr.forEach(entry => {
            let row = document.createElement('tr');
            for(let i in entry) {
                if(i === 'user') continue;
                let td = document.createElement('td');
                // let input = document.createElement('input');
                // input.type = 'text';
                // input.value = entry[i];
                let input = document.createElement('p');
                input.innerHTML = entry[i];
                td.appendChild(input);
                row.appendChild(td);
            }
            databaseTable.tBodies[0].appendChild(row);
        });
    });
}