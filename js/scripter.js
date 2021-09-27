const submit = function(e) {
  e.preventDefault();

  const movieinput = document.querySelector("#movie"),
    mediaInput = document.querySelector("#media"),
    dateInput = document.querySelector("#date"),
    messagebox = document.querySelector("#messagebox"),
    table = document.querySelector("#resultsTable"),
    json = {
      movie: movieinput.value,
      media: mediaInput.options[mediaInput.selectedIndex].value,
      date: dateInput.value,
      remainingdays: Math.round(
        (new Date(dateInput.value).getTime() - new Date().getTime()) /
          (24 * 3600 * 1000)
      )
    };

  console.log(json);
  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json)
  }).then(response => {
      if (response.message!=undefined)
        messagebox.innerHTML = response.json.message;
  });

  
  var numRows = table.rows.length;
  for (var i = 1; i < numRows; i++) {
    table.deleteRow(1);
  }
  setTimeout(function() {
    fetch("/appdata", {
      method: "GET"
    })
      .then(response => response.json())
      .then(array => {
        console.log(array);
        array.forEach(element => updateTable(table, element));
      });
  }, 1000);
  // Clear inputs
  movieinput.value = "";
  dateInput.value = "";

  return false;
};

const logout = function(e) {
  e.preventDefault();

  fetch("/logout", {
    method: "GET"
  }).then(() => {
    window.location.href = "/";
  });

  return false;
};

const mod = function(table, row, id) {
  const movieinput = document.querySelector("#movie"),
    mediaInput = document.querySelector("#media"),
    dateinput = document.querySelector("#date"),
    button = document.querySelector("#submitButton");

 movieinput.value = row.cells[0].innerHTML;
  mediaInput.options[mediaInput.selectedIndex].value =
    row.cells[1].innerHTML;
  dateinput.value = row.cells[2].innerHTML;

  return false;
};

const del = function(table, id) {
  const json = { _id: id };
  const messagebox = document.querySelector("messagebox");
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
      var numRows = table.rows.length;
      for (var i = 1; i < numRows; i++) {
        table.deleteRow(1);
      }

      array.forEach(element => updateTable(table, element));
    });

  const button = document.querySelector("#submitButton");
  button.onclick = submit;

  return false;
};

//Load each element into the table
const updateTable = function(table, data) {
  var tbody = table.getElementsByTagName("tbody")[0];
  var row = tbody.insertRow(-1);
  var movieCell = row.insertCell(0);
  var mediaCell = row.insertCell(1);
  var dateCell = row.insertCell(2);
  var remainingdaysCell = row.insertCell(3);
  var modCell = row.insertCell(4);
  var delCell = row.insertCell(5);

  movieCell.innerHTML = data.movie;
  mediaCell.innerHTML = data.media;
  dateCell.innerHTML = data.date;
  remainingdaysCell.innerHTML = data.remainingdays;

  var modBtn = document.createElement("button");
  modBtn.id = "EditButton";
  modBtn.innerHTML = "Edit";
  modBtn.onclick = function() {
    mod(table, row, data._id);
  };
  modCell.appendChild(modBtn);

  var delBtn = document.createElement("button");
  delBtn.id = "deleteButton";
  delBtn.innerHTML = "Delete";
  delBtn.onclick = function() {
    del(table, data._id);
  };
  delCell.appendChild(delBtn);
};

window.onload = function() {
  const button = document.querySelector("#submitButton");
  button.onclick = submit;

  const logoutButton = document.querySelector("#logoutButton");
  logoutButton.onclick = logout;

  const table = document.querySelector("#resultsTable");
  fetch("/appdata", {
    method: "GET"
  })
    .then(response => response.json())
    .then(array => {
      console.log(array);
      array.forEach(element => updateTable(table, element));
    });
};
