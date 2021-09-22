//const appdata = [];
let modifyID = -1;

// Updates the local appdata file
/*function updateJSON() {
    fetch('/update', {
        method: 'POST'
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        appdata = data;
        console.log(data)
    });
}*/

// Takes an entry and places it in the form
function editEntry(name, game, score, id) {
    document.getElementById("submitButton").innerHTML = "Modify";
    document.getElementById('nameForm').value = name;
    document.getElementById('scoreForm').value = score;
    modifyID = id;
    let gameSelect = document.getElementById('gameForm');
    switch(game) {
        case 'Mario Bros.':
            gameSelect.selectedIndex = 1;
        case 'Donkey Kong':
            gameSelect.selectedIndex = 2;
        case 'Street Racing':
            gameSelect.selectedIndex = 3;
        case 'Tetris':
            gameSelect.selectedIndex = 4;
        default:
            console.log("Uh oh");
    }
}

// Deletes an entry
function deleteEntry(id) {
    if(containsID === true) { // ID is still in server memory
        fetch('/delete', {
            method: 'POST'
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            appdata = data;
        });
    }
    updateForm();
}

// Creates the JSON String
const makeJSONString = function () {
    const name = document.getElementById('nameForm');
    const gameSelect = document.getElementById('gameForm');
    let game = gameSelect.options[gameSelect.selectedIndex];
    const score = document.getElementById('scoreForm');
    var id = 0;
	
    if(modifyID != -1 && containsID(modifyID)) { // We are modifying an ID that exists
        id = modifyID;
    } else { // We are adding an ID or the ID no longer exists
        id = getNextAvailableID();
    }
    
    const json = {
        name: name.value,
        game: game.value,
        score: +score.value,
        highscore: false,
        id: id
    };
    return JSON.stringify(json);
};

// Gets the next available ID
// Note: Critical that you update appdata before you call this!
function getNextAvailableID() {
    let currentID = 0;
    for(let i = 0; i < appdata.length; i++) {
        let scoreEntry = appdata[i];

        if(scoreEntry['id'] >= currentID) {
            currentID = scoreEntry['id'] + 1;
        }
    }
    return currentID;
}

// Checks if the given ID is in appdata
// Note: Critical that you update appdata before you call this!
function containsID(id) {
    for(let i = 0; i < appdata.length; i++) {
        let scoreEntry = appdata[i];

        if(scoreEntry['id'] === id) {
            return true;
        }
    }
    return false;
}

// Updates the form
function updateForm() {
    fetch('/update', {
        method: 'POST'
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        console.log("Table Update");
        let table = document.getElementById("scoreTable");
        table.innerHTML = "";

        // Create table header/titles
        let tableHeader = document.createElement('tr');
        let h1 = document.createElement('th');
        let h2 = document.createElement('th');
        let h3 = document.createElement('th');
        let h4 = document.createElement('th');

        h1.innerHTML = "Name";
        h2.innerHTML = "Game";
        h3.innerHTML = "Score";
        h4.innerHTML = "High Score?";

        tableHeader.appendChild(h1);
        tableHeader.appendChild(h2);
        tableHeader.appendChild(h3);
        tableHeader.appendChild(h4);

        table.appendChild(tableHeader);

        console.log(data.length);
        for(let i = 0; i < data.length; i++) {
            let scoreEntry = data[i];

            let newRow = document.createElement('tr');
            let nameData = document.createElement('td');
            let gameData = document.createElement('td');
            let scoreData = document.createElement('td');
            let highscoreData = document.createElement('td');

            nameData.innerHTML = scoreEntry['name'];
            gameData.innerHTML = scoreEntry['game'];
            scoreData.innerHTML = scoreEntry['score'];
            highscoreData.innerHTML = scoreEntry['highscore'];

            newRow.appendChild(nameData);
            newRow.appendChild(gameData);
            newRow.appendChild(scoreData);
            newRow.appendChild(highscoreData);

            let editIcon = document.createElement('td');
            editIcon.innerHTML = '<span class="material-icons-outlined iconButton">edit</span>'
            editIcon.onclick = function(e) {
                e.preventDefault();
                editEntry(scoreEntry['name'], scoreEntry['game'], scoreEntry['score'], scoreEntry['id']);
            }

            let deleteIcon = document.createElement('td');
            deleteIcon.innerHTML = '<span class="material-icons-outlined iconButton">delete_forever</span>'
            deleteIcon.onclick = function(e) {
                e.preventDefault();
                deleteEntry(scoreEntry['id']);
            }

            newRow.appendChild(editIcon);
            newRow.appendChild(deleteIcon);

            table.appendChild(newRow);
        }
    });
}

const submitEntry = function(e) {
    // Prevent default form action from being carried out
    e.preventDefault();

    let body = makeJSONString();
    let json = JSON.parse(body);

    if(json['name'] === "" ||
        json['game'] === "-" ||
        json['score'] < 0) {
        alert("One or more fields aren't filled properly.");
    }

    if(modifyID === -1) { // Submit
        fetch( '/submit', {
            method:'POST',
            body
        }).then(function(response) {
            updateForm();
            document.getElementById('nameForm').value = "";
            document.getElementById('gameForm').value = "";
            let scoreSelect = document.getElementById('scoreForm');
            scoreSelect.selectedIndex = 0;
            return response.json()
        }).then(function(json){
			//It's only here you can call update form 
			console.log(json);
		});
    } else { // Modify
        fetch( '/modify', {
            method:'POST',
            body
        }).then(function(response) {
            updateForm();
            document.getElementById('nameForm').value = "";
            document.getElementById('gameForm').value = "";
            let scoreSelect = document.getElementById('scoreForm');
            scoreSelect.selectedIndex = 0;
            console.log(response);
        });
    }
    newEntry;
    updateForm();
    return false;
}

const newEntry = function(e) {
    e.preventDefault();
    modifyID = -1;
    document.getElementById('nameForm').value = "";
    let gameSelect = document.getElementById('gameForm');
    gameSelect.selectedIndex = 0;
    document.getElementById('scoreForm').value = "";
    document.getElementById("submitButton").innerHTML = "Submit";
}

window.onload = function() {
    const submitButton = document.getElementById("submitButton");
    submitButton.onclick = submitEntry;
    const newButton = document.getElementById("newButton");
    newButton.onclick = newEntry;
    updateForm();
}