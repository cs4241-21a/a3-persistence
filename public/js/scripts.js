function displaySpeedrunRow(speedrun) {
    let table = document.getElementById("speedruns").getElementsByTagName("tbody")[0];
    let newRow = table.insertRow(table.length);

    userNameCell = newRow.insertCell(0);
    userNameCell.innerHTML = speedrun.userName;

    inGameTimerCell = newRow.insertCell(1);
    inGameTimerCell.innerHTML = speedrun.inGameTimer;

    totalDeathsCell = newRow.insertCell(2);
    totalDeathsCell.innerHTML = speedrun.totalDeaths;

    totalStrawberriesCell = newRow.insertCell(3);
    totalStrawberriesCell.innerHTML = speedrun.toalStrawberries;

    inputTypeCell = newRow.insertCell(4);
    inputTypeCell.innerHTML = speedrun.inputType;

    dateCompletedCell = newRow.insertCell(5);
    dateCompletedCell.innerHTML = speedrun.dateCompleted;

    platformCell = newRow.insertCell(6);
    platformCell.innerHTML = speedrun.platform;

    databaseId = newRow.insertCell(7);
    databaseId.innerHTML = speedrun.dbid;

    editDeleteCell = newRow.insertCell(8);
    editDeleteCell.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                                <a onClick="onDelete(this)">Delete</a>`;
}

function onDelete(td) {
    row = td.parentElement.parentElement;
    deleteId = row.cells[7].innerHTML;
    fetch ("/removeSpeedrun", {
        method:'DELETE',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({dbid: deleteId})
        }).then( function (response) {
            response.json().then ((data) => {
                createResultsTable(data)
            });
        });
}

const createResultsTable = function (resultsData) {
    for (let i = 0; i < resultsData.length; i++) {
        displaySpeedrunRow(resultsData[i]);
    }
}

window.onload = function() {
    fetch("/getUserData", {
        method: "GET"
    }).then( function (response) {
        createResultsTable(response.body.data);
    })
}