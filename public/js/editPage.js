let globalUsername = "";

window.onload = function () {
    fetch('/getUsername', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(json => {
        let username = json.username;
        globalUsername = username;
        let signOut = document.getElementById("signOutButton");
        if (signOut !== null) {
            signOut.innerHTML = 'Sign Out of ' + username;
        }
        console.log("Username is " + username + "!");
        if (username == null || username === "") {
            console.log("Sign out time!");
            window.location.replace("/login.html");
        }
    })

    const signOut = document.getElementById("signOutButton");
    signOut.onclick = signOutFunction;

    setTimeout(function () {
        updateUserTable();
    }, 1000);
}

const signOutFunction = function () {
    fetch('/signOut', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(json => {
        let signOutSuccess = json.signOutSuccess;
        if (signOutSuccess) {
            console.log("Signing out now!");
            window.location.replace("/login.html");
        }
    })
}

function stepOnSeal() {
    let table = document.getElementById("ratings");
    updateUserTable();
    alert("You stepped on the seal! All undergraduate students now graduate 1 year later!");
}

function updateUserTable() {
    let table = document.getElementById("ratings");
    table.innerHTML = '<thead><tr><th scope="col">Username</th><th scope="col">Name</th><th scope="col">Academic Year</th><th scope="col">Years Till Graduation</th><th scope="col">Best Dorm?</th><th scope="col">Best Dining Hall?</th><th scope="col">Favorite Spot?</th><th scope="col">Additional Notes</th><th scope="col">Edit This Rating</th><th scope="col">Delete This Rating</th></tr></thead>';

    const jsonData = {
        username: globalUsername
    }

    fetch('/getTableData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    }).then(res => {
        return res.json();
    }).then(json => {
        let rowIndex = 0;
        for (let rowData of json.rows.rating) {

            let row = table.insertRow(-1);

            let username = row.insertCell(0);
            let name = row.insertCell(1);
            let studentYear = row.insertCell(2);
            let yearsRemaining = row.insertCell(3);
            let favoriteDorm = row.insertCell(4);
            let favoriteDining = row.insertCell(5);
            let favoriteSpot = row.insertCell(6);
            let notes = row.insertCell(7);
            let edit = row.insertCell(8);
            let deleteCell = row.insertCell(9);

            row.cells[0].innerHTML = globalUsername;
            row.cells[1].innerHTML = rowData.name;
            row.cells[2].innerHTML = rowData.studentYear;
            row.cells[3].innerHTML = rowData.yearsRemaining + sealIncrement(rowData.studentYear);
            row.cells[4].innerHTML = rowData.favoriteDorm;
            row.cells[5].innerHTML = rowData.favoriteDining;
            row.cells[6].innerHTML = rowData.favoriteSpot;
            row.cells[7].innerHTML = rowData.notes;
            row.cells[8].innerHTML = '<button class="btn btn-dark" onclick="editRow(' + rowIndex + ')">Edit This Row</button>';
            row.cells[9].innerHTML = '<button class="btn btn-dark" onclick="deleteRow(' + rowIndex + ')">Delete This Row</button>';


            rowIndex++;
        }
    })
}

function sealIncrement(studentYear) {
    let increment = '';

    return increment;
}

/*   if (seal) {
       switch (studentYear) {
           case 'First-Year':
               increment = 1;
               break;
           case 'Sophomore':
               increment = 1;
               break;
           case 'Junior':
               increment = 1;
               break;
           case 'Senior':
               increment = 1;
               break;
           case 'Graduate Student':
               increment = '';
               break;
           default:
               increment = '';
               break;
       }
   }

   return increment;
} */

const submit = function () {
    // prevent default form action from being carried out

    /*const input = document.querySelector( '#name' ),
         json = { yourname: input.value },
        body = JSON.stringify( json ) */

    const name = document.getElementById('name').value;
    const studentYear = document.getElementById('studentYear').value;
    const favoriteDorm = document.getElementById('favoriteDorm').value;
    const favoriteDining = document.getElementById('favoriteDining').value;
    const favoriteSpot = document.getElementById('favoriteSpot').value;
    const notes = document.getElementById('notes').value; //Can be blank

    if (name.trim() === '' || studentYear.trim() === '' || favoriteDorm.trim() === '' || favoriteDining.trim() === '' || favoriteSpot.trim() === '') {
        alert("To obtain accurate data, please be sure to respond to every question (except for additional notes)!")
        return false;
    } else {
        const jsonData = {
            username: globalUsername,
            name: name,
            studentYear: studentYear,
            favoriteDorm: favoriteDorm,
            favoriteDining: favoriteDining,
            favoriteSpot: favoriteSpot,
            notes: notes,
            yearsRemaining: ""
        }

        fetch('/submitTableData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        }).then(res => {
            return res.json();
        }).then(json => {
            console.log("Data uploaded successfully!")
        })

        setTimeout(function () {
            updateUserTable();
        }, 1000);

        document.getElementById('name').value = "";
        document.getElementById('studentYear').value = 'First-Year';
        document.getElementById('favoriteDorm').value = 'Daniels Hall';
        document.getElementById('favoriteDining').value = 'Campus Center';
        document.getElementById('favoriteSpot').value = "";
        document.getElementById('notes').value = "";
        return true;
    }
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('studentYear').value = 'First-Year';
    document.getElementById('favoriteDorm').value = 'Daniels Hall';
    document.getElementById('favoriteDining').value = 'Campus Center';
    document.getElementById('favoriteSpot').value = '';
    document.getElementById('notes').value = '';
}

function editRow(rowIndex) {
    let table = document.getElementById("ratings");
    let row = table.rows[rowIndex+1];

    document.getElementById('editName').value = row.cells[1].innerHTML;
    document.getElementById('editStudentYear').value = row.cells[2].innerHTML;
    document.getElementById('editFavoriteDorm').value = row.cells[4].innerHTML;
    document.getElementById('editFavoriteDining').value = row.cells[5].innerHTML;
    document.getElementById('editFavoriteSpot').value = row.cells[6].innerHTML;
    document.getElementById('editNotes').value = row.cells[7].innerHTML;
    document.getElementById('hiddenRowIndex').value = rowIndex;
}

function editRatingClicked() {
    const name = document.getElementById('editName').value;
    const studentYear = document.getElementById('editStudentYear').value;
    const favoriteDorm = document.getElementById('editFavoriteDorm').value;
    const favoriteDining = document.getElementById('editFavoriteDining').value;
    const favoriteSpot = document.getElementById('editFavoriteSpot').value;
    const notes = document.getElementById('editNotes').value; //Can be blank
    const rowIndex = document.getElementById('hiddenRowIndex').value;

    if (rowIndex === "") {
        alert("You must first select 'Edit This Row' on a row to edit its data!");
        return false;
    }

    if (name.trim() === '' || studentYear.trim() === '' || favoriteDorm.trim() === '' || favoriteDining.trim() === '' || favoriteSpot.trim() === '') {
        alert("To obtain accurate data, please be sure to respond to every question (except for additional notes)!")
        return false;
    } else {
        const jsonData = {
            index: rowIndex,
            username: globalUsername,
            name: name,
            studentYear: studentYear,
            favoriteDorm: favoriteDorm,
            favoriteDining: favoriteDining,
            favoriteSpot: favoriteSpot,
            notes: notes,
            yearsRemaining: ""
        }

        fetch('/editTableData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        }).then(res => {
            return res.json();
        }).then(json => {
            console.log("Data uploaded successfully!")
        })

        setTimeout(function () {
            updateUserTable();
        }, 1000);

        document.getElementById('editName').value = "";
        document.getElementById('editStudentYear').value = 'First-Year';
        document.getElementById('editFavoriteDorm').value = 'Daniels Hall';
        document.getElementById('editFavoriteDining').value = 'Campus Center';
        document.getElementById('editFavoriteSpot').value = "";
        document.getElementById('editNotes').value = "";
        document.getElementById('hiddenRowIndex').value = "";
        return true;
    }
}

function deleteRow(rowIndex) {
    let confirmDelete = confirm("Are you sure you'd like to delete this row?");
    if (confirmDelete) {
        const json = {
            username: globalUsername,
            deletingItem: rowIndex
        }

        console.log("Deleting row " + rowIndex);
        fetch('/deleteRow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json)
        }).then(res => {
            return res.json();
        }).then(json => {
            console.log("Row deleted!!");
            setTimeout(function () {
                updateUserTable();
            }, 1000);
        })
    }
}

/*window.onload = function() {
    const button = document.querySelector( 'button' );
    button.onclick = submit;

    updateTable();
} */