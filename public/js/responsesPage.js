window.onload = function () {
    setTimeout(function () {
        updateTable();
    }, 1000);
}

let numberOfElements = 1;

function stepOnSeal() {
    let table = document.getElementById("ratings");
    updateTable();
    alert("You stepped on the seal! All undergraduate students now graduate 1 year later! (Coming soon!)");
}

function updateTable() {
    let table = document.getElementById("ratings");
    table.innerHTML = '<thead><tr><th scope="col">Username</th><th scope="col">Name</th><th scope="col">Academic Year</th><th scope="col">Years Till Graduation</th><th scope="col">Best Dorm?</th><th scope="col">Best Dining Hall?</th><th scope="col">Favorite Spot?</th><th scope="col">Additional Notes</th></tr></thead>';
    fetch('/getFullTableData', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(json => {
        console.log(json.ratings);
        let rowIndex = 0;
        for (let rowData of json.ratings) {

            let row = table.insertRow(-1);

            let username = row.insertCell(0);
            let name = row.insertCell(1);
            let studentYear = row.insertCell(2);
            let yearsRemaining = row.insertCell(3);
            let favoriteDorm = row.insertCell(4);
            let favoriteDining = row.insertCell(5);
            let favoriteSpot = row.insertCell(6);
            let notes = row.insertCell(7);

            row.cells[0].innerHTML = json.usernames[rowIndex];
            row.cells[1].innerHTML = rowData.name;
            row.cells[2].innerHTML = rowData.studentYear;
            row.cells[3].innerHTML = rowData.yearsRemaining + sealIncrement(rowData.studentYear);
            row.cells[4].innerHTML = rowData.favoriteDorm;
            row.cells[5].innerHTML = rowData.favoriteDining;
            row.cells[6].innerHTML = rowData.favoriteSpot;
            row.cells[7].innerHTML = rowData.notes;

            rowIndex++;
        }
    });
}

function sealIncrement(studentYear) {
    let increment = '';

    return increment;
}