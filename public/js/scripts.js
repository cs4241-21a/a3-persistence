// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!");

const submit = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();

  const username = document.querySelector("#yourname");
  const highscore = document.querySelector("#yourscore");
  const json = {
    place: 0,
    yourname: username.value,
    yourscore: highscore.value,
    difference: 0
  };

  fetch("/submit", {
    method: "POST",
    body: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function(response) {
      // do something with the reponse
      console.log(response);
      return response.json();
    })
    .then(function(json) {
      console.log(json);

      const table = document.querySelector("#data_table");

      for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
      }

      for (let i = 0; i < json.scores.length; i++) {
        json.scores[i].place = i + 1;
        updateTable(table, json.scores[i]);
      }
    });

  return false;
};

window.onload = function() {
  const button = document.querySelector("#submitButton");
  button.onclick = submit;
};

function reloadTable(table, scores) {
  for (let i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }

  for (let i = 0; i < scores.length; i++) {
    scores[i].place = i + 1;
    updateTable(table, scores[i]);
  }
}
function updateTable(table, score) {
  const row = table.insertRow(table.length);

  const place = row.insertCell(0);
  const username = row.insertCell(1);
  const highscore = row.insertCell(2);
  const difference = row.insertCell(3);
  const editButtonPlace = row.insertCell(4);
  const deleteButtonPlace = row.insertCell(5);

  place.innerHTML = score.place;
  username.innerText = score.username;
  highscore.innerHTML = score.highscore;
  difference.innerHTML = score.difference;

  var editButton = document.createElement("button");
  editButton.id = "editBtn";
  editButton.innerHTML = "Edit";
  editButton.onclick = function() {
    editTable(table, row);
  };
  editButtonPlace.appendChild(editButton);

  var deleteButton = document.createElement("button");
  deleteButton.id = "deleteBtn";
  deleteButton.innerHTML = "Remove";
  deleteButton.onclick = function() {
    deleteScore(table, score._id);
  };
  deleteButtonPlace.appendChild(deleteButton);
}

window.onload = function() {
  const button = document.querySelector("#submitButton");
  button.onclick = submit;

  const table = document.querySelector("#data_table");
  fetch("/appdata", {
    method: "GET"
  })
    .then(response => response.json())
    .then(array => {
      console.log(array);
      array.forEach(element => updateTable(table, element));
    });
};

function editTable(table, row) {
  const username = document.querySelector("#yourname");
  const highscore = document.querySelector("#yourscore");
  const button = document.querySelector("#submitButton");

  username.value = row.cells[1].innerHTML;
  highscore.value = row.cells[2].innerHTML;

  return false;
}

function deleteScore(table, id) {
  const json = { _id: id };
  console.log(json);

  fetch("/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json)
  })
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(array => {
      //Reload table
      for (var i = 1; i < table.rows.length; i++) {
        table.deleteRow(1);
      }

      for (let i = 0; i < json.scores.length; i++) {
        json.scores[i].place = i + 1;
        updateTable(table, json.scores[i]);
      }
    });

  const button = document.querySelector("#submitButton");
  button.onclick = submit;

  return false;
}
