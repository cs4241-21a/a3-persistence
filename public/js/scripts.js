const submit = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();

  const tasknameinput = document.querySelector("#taskname"),
    priorityinput = document.querySelector("#priority"),
    duedateinput = document.querySelector("#duedate"),
    messagebox = document.querySelector("#messagebox"),
    table = document.querySelector("#resultsTable"),
    json = {
      taskname: tasknameinput.value,
      priority: priorityinput.options[priorityinput.selectedIndex].value,
      duedate: duedateinput.value,
      remainingdays: Math.round(
        (new Date(duedateinput.value).getTime() - new Date().getTime()) /
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

  
  //Reload table
  var numRows = table.rows.length;
  for (var i = 1; i < numRows; i++) {
    table.deleteRow(1);
  }
  //Wait for previous task to be completed
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
  tasknameinput.value = "";
  //priorityinput.options[priorityinput.selectedIndex].value = "";
  duedateinput.value = "";

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
  const tasknameinput = document.querySelector("#taskname"),
    priorityinput = document.querySelector("#priority"),
    duedateinput = document.querySelector("#dueate"),
    button = document.querySelector("#submitButton");

  tasknameinput.value = row.cells[0].innerHTML;
  priorityinput.options[priorityinput.selectedIndex].value =
    row.cells[1].innerHTML;
  duedateinput.value = row.cells[2].innerHTML;

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
  var tasknameCell = row.insertCell(0);
  var priorityCell = row.insertCell(1);
  var duedateCell = row.insertCell(2);
  var remainingdaysCell = row.insertCell(3);
  var modCell = row.insertCell(4);
  var delCell = row.insertCell(5);

  tasknameCell.innerHTML = data.taskname;
  priorityCell.innerHTML = data.priority;
  duedateCell.innerHTML = data.duedate;
  remainingdaysCell.innerHTML = data.remainingdays;

  var modBtn = document.createElement("button");
  modBtn.id = "modifyButton";
  modBtn.innerHTML = "Modify";
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
