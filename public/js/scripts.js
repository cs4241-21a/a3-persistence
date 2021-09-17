/* function to submit new/modified data to the server */
const submit = function (e) {
  // prevent default form action from being carried out
  e.preventDefault();

  /* retrieve all data from the form and create json */
  const name = document.getElementById("name");
  const team = document.getElementById("team");
  const time = document.getElementById("time");
  const laps = document.getElementById("laps");
  const fastest = document.getElementById("fastest");
  const comments = document.getElementById("comments");
  const json = {
    name: name.value,
    team: team.value,
    time: time.value,
    laps: laps.value,
    fastest: fastest.value,
    comments: comments.value,
  };

  /* validate that all json values filled */
  for (x in json) {
    if (json[x] === "") {
      document.getElementById("invalid").innerText =
        "Invalid entry, missing: " + x;
      return;
    }
  }

  /* if valid, ensure invalid is empty */
  document.getElementById("invalid").innerText = "";
  const body = JSON.stringify(json);
  
  /* send the new json to the server */
  fetch("/submit", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (res) {
      /* redraw table with new json array */
      if (res.acknowledged === true) {
        getData();
      }
    });

  return false;
};

const userlogout = function() {
  fetch("/logout", {
    method: "GET"
  })
  window.location.href="/";
}

function getData() {
  fetch("/results", {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      redrawTable(data);
    });
}

/* function to remove data from the server data */
const remove = function (e) {
  // prevent default form action from being carried out
  e.preventDefault();

  /* get racer name and team from table and create json */
  const name = e.path[1].cells[1].innerText;
  const team = e.path[1].cells[2].innerText;
  const json = { name: name, team: team };
  const body = JSON.stringify(json);

  /* send server the json to match name & team with server and remove old data */
  fetch("/remove", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (res) {
      /* redraw table with new json array */
      if (res.acknowledged === true) {
        getData();
      }
    });

  return false;
};

/* function to redraw the table with new data from the server */
function redrawTable(values) {
  /* list of headers for the table */
  const headers = [
    "Place",
    "Racer",
    "Team",
    "Total Time",
    "Number of Laps",
    "Fastest Lap",
    "Comments",
    "Average Lap Time",
    "Remove",
  ];
  let table = document.getElementById("results-table");

  /* remove all the values from the table */
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  /* create headers */
  let r = document.createElement("tr");
  for (let header of headers) {
    let h = document.createElement("th");
    let hval = document.createTextNode(header);
    h.appendChild(hval);
    r.appendChild(h);
  }
  table.appendChild(r);

  /* if data is empty, return here */
  if (values.length === 0) {
    return;
  }

  /* fill in new values */
  values.forEach((element) => {
    let row = document.createElement("tr");
    let placeNode = document.createElement("td");
    let placeText = document.createTextNode(values.indexOf(element) + 1);
    placeNode.appendChild(placeText);
    row.appendChild(placeNode);
    for (let value in element) {
      if (value !== "_id" && value !== "userID") {
        let valueNode = document.createElement("td");
        let valueText = document.createTextNode(element[value]);
        valueNode.appendChild(valueText);
        if(value === "comments") {
          valueNode.classList.add("max-w-xs");
        }
        row.appendChild(valueNode);
      }
    }
    let deleteElement = createDelete();
    row.appendChild(deleteElement);
    table.appendChild(row);
  });
}

/* helper function to create the delete column in the table */
function createDelete() {
  let deleteNode = document.createElement("td");
  let deleteText = document.createTextNode("delete");
  deleteNode.appendChild(deleteText);
  deleteNode.onclick = remove;
  return deleteNode;
}

/* on startup, assigning functions to existing html */
window.onload = function () {
  const button = document.getElementById("submit-button");
  button.onclick = submit;
  const logout = document.getElementById("logout");
  logout.onclick = userlogout;
  getData()
};
