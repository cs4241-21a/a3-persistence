console.log("Welcome to assignment 3!");
// Add some Javascript code here, to run on the front end.
const table = document.getElementById("table");
const submitBtn = document.getElementById("submit");
const ActionHeader = document.getElementById("ActionHeader");
const hLeft = document.getElementById("hours");
let hours = 4;
let serverData;
const createNode = function(elt) {
  return document.createElement(elt);
};

const makeTableHeaders = function() {
  let TableRow = createNode("tr");
  let editHeader = createNode("th");
  editHeader.innerHTML = "";
  TableRow.appendChild(editHeader);

  let AssignmentHeader = createNode("th");
  AssignmentHeader.innerHTML = "Assignment";
  TableRow.appendChild(AssignmentHeader);

  let ClassHeader = createNode("th");
  ClassHeader.innerHTML = "Class";
  TableRow.appendChild(ClassHeader);

  let TimeHeader = createNode("th");
  TimeHeader.innerHTML = "Time Commitment (h)";
  TableRow.appendChild(TimeHeader);

  let DueHeader = createNode("th");
  DueHeader.innerHTML = "Due";
  TableRow.appendChild(DueHeader);

  let DaysHeader = createNode("th");
  DaysHeader.innerHTML = "Days Before Dedline";
  TableRow.appendChild(DaysHeader);

  let deleteHeader = createNode("th");
  deleteHeader.innerHTML = "";
  TableRow.appendChild(deleteHeader);

  table.appendChild(TableRow);
};

let newAssignment = "";
let newClass = "";
let newTime = "";
let newDue = "";
let newdays = 0;
const editRow = function(pencil, row) {
  Index = pencil.id[6];
  ActionHeader.innerHTML = "Edit";
  submitBtn.innerHTML = "Update";
  document.getElementById("Assignment").value = row.Assignment;
  document.getElementById("Class").value = row.Class;
  document.getElementById("time").value = row.time;
  document.getElementById("Due").value = row.Due;
  newAssignment = row.Assignment;
  newClass = row.Class;
  newTime = row.time;
  newDue = row.Due;
  //newdays = getDaysLeft(row.Due);
};

const removeRow = function(deleteIcon, row) {
  //delete
  Index = deleteIcon.id[6];
  newAssignment = row.Assignment;
  newClass = row.Class;
  newTime = row.time;
  newDue = row.Due;
  //newdays = getDaysLeft(row.Due);

  const x = document.cookie;
  const jsonUser = JSON.parse(x);
  const jsonBody = {
    Assignment: newAssignment,
    Class: newClass,
    time: newTime,
    Due: newDue
    //Days: newdays
  };
  const newJson = Object.assign({}, jsonBody, jsonUser);
  let id = "";
  fetch("/data/getID", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      token: newJson.token,
      Assignment: newAssignment,
      Class: newClass,
      time: newTime,
      Due: newDue
      //Days: newdays
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      let json = data[0];
      id = json._id;
      const idJson = { id: id };
      const jsonObject = Object.assign({}, newJson, idJson);
      const len = new TextEncoder().encode(JSON.stringify(jsonObject)).length;
      fetch("/data/delete", {
        method: "POST",
        body: JSON.stringify(jsonObject),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Content-Length": len
        }
      }).then(function(res) {
        updatePage();
      });
    });
};

const updatePage = function() {
  const x = document.cookie;
  const jsonUser = JSON.parse(x);
  const username = jsonUser.username;
  const token = jsonUser.token;
  fetch("/data/getuser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      username: username,
      token: token
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      serverData = data;
      table.innerHTML = "";
      makeTableHeaders();
      let rowNum = 1;
      serverData.map(function(row) {
        let pencil = createNode("i");
        pencil.id = `pencil${rowNum}`;
        pencil.innerHTML =
          "<img src='https://cdn.glitch.com/511c05de-bd0a-4d03-8457-593d610c8123%2Fthumbnails%2Fsaas-content-marketing-green.png?1631193082927' width='50px' height='40px'>";
        pencil.onclick = function(elt) {
          editRow(pencil, row);
          elt.preventDefault();
          return false;
        };
        let deleteIcon = createNode("i");
        deleteIcon.id = `deleteIcon${rowNum}`;
        deleteIcon.innerHTML =
          "<img src='https://cdn.glitch.com/511c05de-bd0a-4d03-8457-593d610c8123%2Fthumbnails%2Fdelete-icon-14.jpg?1631193069518' width='40px' height='40px'>";
        deleteIcon.onclick = function(elt) {
          let body = deleteIcon.id;
          removeRow(deleteIcon, row);
          elt.preventDefault();
          return false;
        };
        let tableRow = createNode("tr");
        let editdata = createNode("td");
        editdata.appendChild(pencil);
        tableRow.appendChild(editdata);
        let data1 = createNode("td");
        data1.innerHTML = row.Assignment;
        tableRow.appendChild(data1);
        let data2 = createNode("td");
        data2.innerHTML = row.Class;
        tableRow.appendChild(data2);
        let data3 = createNode("td");
        data3.innerHTML = row.time;
        tableRow.appendChild(data3);
        let data4 = createNode("td");
        data4.innerHTML = row.Due;
        tableRow.appendChild(data4);
        let data5 = createNode("td");
        data5.innerHTML = "100"; //getDaysLeft(row);
        tableRow.appendChild(data5);
        let remove = createNode("td");
        remove.appendChild(deleteIcon);
        tableRow.appendChild(remove);
        table.appendChild(tableRow);
        tableRow.className = rowNum;
        rowNum++;
      });
    });
  fetch("/data/getuser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      username: username,
      token: token
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      serverData = data;
      hours = 0;
      for (let i = 0; i < serverData.length; i++) {
        hours = hours + serverData[i].time;
      }
      hLeft.innerHTML = hours.toString();
    });
};
updatePage();

function getDaysLeft(data) {
  let today = new Date();
  let date = new Date(data.date);
  var diffMilli = date.getTime() - today.getTime();
  var diffDays = diffMilli / (1000 * 3600 * 24);
  return Math.round(diffDays);
}

let inputSelect;
let Index = 0;
const makeBody = function() {
  const Assignment = document.getElementById("Assignment");
  const Class = document.getElementById("Class");
  const time = document.getElementById("time");
  const Due = document.getElementById("Due");
  //let days = getDaysLeft(Due);
  const json = {
    Assignment: Assignment.value,
    Class: Class.value,
    time: parseInt(time.value),
    Due: Due.value,
    //Days: days,
    Index
  };
  return JSON.stringify(json);
};

const submitForm = function(elt) {
  if (submitBtn.innerHTML === "Submit") {
    inputSelect = "add";
    makePost();
  } else {
    inputSelect = "modify";
    makePost();
    submitBtn.innerHTML = "Submit";
    ActionHeader.innerHTML = "Add Assignment";
    document.getElementById("Assignment").value = "";
    document.getElementById("Class").value = "";
    document.getElementById("time").value = "";
    document.getElementById("Due").value = "";
  }
  elt.preventDefault();
  return false;
};
submitBtn.onclick = submitForm;

const makePost = function() {
  let body = makeBody();
  let jsonBody = JSON.parse(body);
  let warning = document.getElementById("warning");

  if (
    jsonBody["Assignment"] === "" ||
    jsonBody["Class"] === "" ||
    jsonBody["time"] === "" ||
    jsonBody["time"] < 0 ||
    jsonBody["Due"] === ""
  ) {
    warning.innerHTML = "!Not all fields filled";
  } else {
    warning.innerHTML = "";
    const x = document.cookie;
    const jsonUser = JSON.parse(x);
    const newJson = Object.assign({}, jsonBody, jsonUser);
    let id = "";
    fetch("/data/getID", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        token: newJson.token,
        Assignment: newAssignment,
        Class: newClass,
        time: newTime,
        Due: newDue
        //Days: newdays
      }
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        let json = data[0];
        if (json !== undefined) id = json._id;
        const idJson = { id: id };
        console.log("ID FROM id = " + id);
        console.log("ID FROM idJSON = " + JSON.stringify(idJson));
        const jsonObject = Object.assign({}, newJson, idJson);
        const len = new TextEncoder().encode(JSON.stringify(jsonObject)).length;

        if (inputSelect === "add") {
          fetch(`/data/add`, {
            method: "POST",
            body: JSON.stringify(jsonObject),
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              "Content-Length": len
            }
          }).then(function(response) {
            updatePage();
            document.getElementById("Assignment").value = "";
            document.getElementById("Class").value = "";
            document.getElementById("time").value = "";
            document.getElementById("Due").value = "";
          });
        } else {
          fetch(`/data/modify`, {
            method: "POST",
            body: JSON.stringify(jsonObject),
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              "Content-Length": len
            }
          }).then(function(response) {
            window.location = "/index.html";
            document.getElementById("Assignment").value = "";
            document.getElementById("Class").value = "";
            document.getElementById("time").value = "";
            document.getElementById("Due").value = "";
          });
        }
      });
  }
};




