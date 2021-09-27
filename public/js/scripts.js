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

    editDeleteCell = newRow.insertCell(7);
    editDeleteCell.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                                <a onClick="onDelete(this)">Delete</a>`;
}