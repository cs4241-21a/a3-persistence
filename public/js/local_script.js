let modifyID = null;
let sessionID = -1;

// Takes an entry and places it in the form
function editEntry(name, game, score, id) {
    console.log("Populating entries for edit: Name: %s || Game: %s || Score: %d || ID: %s", name, game, score, JSON.stringify(id));

    document.getElementById("submitButton").value = "Modify";
    document.getElementById('nameForm').value = name;
    document.getElementById('scoreForm').value = score;
    modifyID = id;
    let gameSelect = document.getElementById('gameForm');
    switch(game) {
        case 'Mario Bros.':
            gameSelect.selectedIndex = 1;
            break;
        case 'Donkey Kong':
            gameSelect.selectedIndex = 2;
            break;
        case 'Street Racing':
            gameSelect.selectedIndex = 3;
            break;
        case 'Tetris':
            gameSelect.selectedIndex = 4;
            break;
        default:
            console.log("Uh oh");
    }
}

// Deletes an entry
function deleteEntry(deleteID) {
    const jsonID = {
        _id: deleteID
    };

    console.log("Sending delete request for [%d]", deleteID);

    fetch('/delete', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonID)
    }).then(function(response) {
        updateForm();
    });
}

// Creates the JSON object from the form
const makeFormJSON = function () {
    const name = document.getElementById('nameForm');
    const gameSelect = document.getElementById('gameForm');
    let game = gameSelect.options[gameSelect.selectedIndex];
    const score = document.getElementById('scoreForm');
    const id = modifyID;
    
    const json = {
        name: name.value,
        game: game.value,
        score: +score.value,
        highscore: false,
        _id: id
    };
    return json;
};

// Updates the form
function updateForm() {
    console.log("Sending update request");

    fetch('/update', {
        method: 'GET'
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
                editEntry(scoreEntry['name'], scoreEntry['game'], scoreEntry['score'], scoreEntry['_id']);
            }

            let deleteIcon = document.createElement('td');
            deleteIcon.innerHTML = '<span class="material-icons-outlined iconButton">delete_forever</span>'
            deleteIcon.onclick = function(e) {
                deleteEntry(scoreEntry['_id']);
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

    let newJSONEntry = makeFormJSON(); // Call the helper function to make the JSON from the form
    // let json = JSON.parse(body); // Parse that string back

    // Check if these fields are loaded correctly
    if(newJSONEntry['name'] === "" ||
        newJSONEntry['game'] === "-" ||
        newJSONEntry['score'] < 0) {
        alert("One or more fields aren't filled properly.");
        return;
    }

    console.log("Name: %s || Game: %s || Score: %d", newJSONEntry['name'], newJSONEntry['game'], newJSONEntry['score']);

    // Submit the entry (server can figure out if it's a new or existing entry)
    fetch( '/submit', { // Send the POST request
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newJSONEntry)
    }).then(function(response) { // Call the reset after the response; you dummy; you absolute fool
        resetEntry(); // Reset the form
        updateForm(); // Update the form
    });
}

const newEntry = function(e) {
    e.preventDefault();
    resetEntry();
}

function resetEntry() {
    console.log("Reseting Entry Form");

    modifyID = null; // Reset the modifyID

    document.getElementById('nameForm').value = ""; // Reset the fields
    let gameSelect = document.getElementById('gameForm');
    gameSelect.selectedIndex = 0;
    document.getElementById('scoreForm').value = "";
    document.getElementById("submitButton").value = "Submit";
}

function loginRequest() {
    fetch( '/auth/github', { // Send the POST request
        method:'GET'
    });
}

function logoutRequest() {
    
}

// Run when the html page loads
window.onload = function() {
    const submitButton = document.getElementById("submitButton");
    submitButton.onclick = submitEntry;
    const newButton = document.getElementById("newButton");
    newButton.onclick = newEntry;
    newEntry;
    updateForm();
}