// Add some Javascript code here, to run on the front end.

function js_login() {
  const input = document.getElementById("login"),
  json = {
    user: input.elements[0].value,
    pass: input.elements[1].value
  },
  body = JSON.stringify(json);

  fetch("/submit", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body
  }).then(function(response) {
    if (response.redirected) {
        window.location.href = response.url;
    }
    else {
      const errText = document.getElementById("loginFail")
      errText.textContent = "Incorrect password, please try again.";
    }
  });
}

function addRoll() {
  const input = document.getElementById("add"),
    json = {
      character: input.elements[0].value,
      diceType: input.elements[1].value,
      quantity: input.elements[2].value,
      modifier: input.elements[3].value
    },
    body = JSON.stringify(json);

  fetch("/add", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body
  }).then(function(response) {
    console.log("here")
    if (response.status === 200) {
      console.log(body);
      update(response);
    }
    else {
      console.log(response.text());
    }
  });

  return false;
}

function deleteRoll() {
  const input = document.getElementById("delete"),
    json = {
      id: input.elements[0].value,
      character: input.elements[1].value
    },
    body = JSON.stringify(json);

  fetch("/delete", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body
  }).then(function(response) {
    if (response.status === 200) {
      console.log(body);
      update(response);
      return true;
    }
    else {
      return response.text();
    }
  }).then(function(text) {
    if(text === true) {
      // setError("");
      return true;
    }
    else {
      console.log("ERROR 2")
      console.log(text)
      // setError(text);
    }
  });

  return false;
}

function editRoll() {
  let dataInput = document.getElementById("add");

  // Steps:
  // 1) Get the row with specified ID
  const input = document.getElementById("edit"),
    json = {
      id: input.elements[0].value,
    },
    body = JSON.stringify(json);

  fetch("/getedit", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body
  }).then(function(response) {
    // 2) Push row data back to input
      response.json().then(function(data) {
        dataInput.elements[0].value = data.character;
        dataInput.elements[1].value = data.diceType;
        dataInput.elements[2].value = data.quantity;
        dataInput.elements[3].value = data.modifier;

        let addButton = document.getElementById("add_button");
        addButton.innerText = "Edit";
        // 3) After submit, push an edit request with new data
        addButton.onclick = editButton;
      })
    });
}

function editButton() {
  let id = document.getElementById("edit")
  const input = document.getElementById("add"),
    json = {
      id: id.elements[0].value,
      character: input.elements[0].value,
      diceType: input.elements[1].value,
      quantity: input.elements[2].value,
      modifier: input.elements[3].value
    },
    body = JSON.stringify(json);

    fetch("/editroll", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body
    }).then(function(response) {
      // 4) Clear all fields and change button back
      if (response.status === 200) {
        console.log(body);
        update(response);

        // clear data and fix button
        input.elements[0].value = ""
        input.elements[1].value = ""
        input.elements[2].value = ""
        input.elements[3].value = ""
        let addButton = document.getElementById("add_button");
        addButton.innerText = "Add";
        addButton.onclick = addRoll;

      }
    });

}

function clearRolls() {
  fetch("/clear", {
    method: "GET"
  }).then(function(response) {
    if (response.status === 200) {
      update(response);
      return true;
    }
  });
  return false;
}

function updateOnLoad() {
  console.log("temp")
  fetch("/load", {
    method: "GET"
  }).then(function(response) {
    if (response.redirected) {
      window.location.href = response.url;
    }
    else if (response.status === 200) {
      update(response);
      return true;
    }
  });
  return false;
}

function logout() {
  fetch("/logout", {
    method: "GET"
  }).then(function(response) {
    if (response.redirected) {
      window.location.href = response.url;
    }
  return false;
  });
}

function update(results) {
  let table = document.getElementById("table_list");
  let newTable = document.createElement("tbody");

  table.replaceChild(newTable, table.lastChild);

  results.json().then(function(data) {
    let nRows = data.nRows;
    let rowData = data.rowData.reverse();

    for (let i = 0; i < nRows; i++) {
      let newRow = newTable.insertRow(i);
      newRow.insertCell(0).innerHTML = `${rowData[i].id}`;
      newRow.insertCell(1).innerHTML = `${rowData[i].character}`;
      newRow.insertCell(2).innerHTML = `d${rowData[i].diceType}`;
      newRow.insertCell(3).innerHTML = `${rowData[i].quantity}`;
      newRow.insertCell(4).innerHTML = `${rowData[i].modifier}`;
      newRow.insertCell(5).innerHTML = `${rowData[i].roll}`;
    }
  });

  return 0;
}
