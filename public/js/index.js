//flag for the item expiration time
var flag = "";
let item = [];

const submit = function() {
  console.log(flag);
  const name = document.querySelector("#itemName").value,
    description = document.querySelector("#itemDescription").value;
  //itemExpiration = document.querySelector('#item').value

  if (formComplete(name, description)) {
    const json = {
        itemName: name,
        itemDescription: description,
        itemExpiration: flag
      },
      body = JSON.stringify(json);

    fetch("/submit", {
      method: "POST",
      body
    })
      .then(function(response) {
        return response.text();
      })

      .then(function(text) {
        item.push(JSON.parse(text));
        updateItem();
        console.log("Item: " + JSON.stringify(item));
      });
  }
  return false;
};

//update flag to reflect the accurate expiration
function shortFlag() {
  flag = "expiration-short";
  console.log(flag);
}
function medFlag() {
  flag = "expiration-med";
  console.log(flag);
}
function longFlag() {
  flag = "expiration-long";
  console.log(flag);
}

//check if the form is fully complete
function formComplete(itemName, itemDescription) {
  if (itemName === "") {
    document.getElementById("error").style.display = "block";
    document.getElementById("error").focus();
    return false;
  } else {
    document.getElementById("error").style.display = "none";
    document.getElementById("error").focus();
    return true;
  }
}

//edits the row selected
const edit = function(e) {
  e.preventDefault();
  let row = item[Number(e.target.id.substring(4))];
  document.querySelector("#itemName").value = row.itemName;
  document.querySelector("#itemDescription").value = row.itemDescription;
  flag = row.itemExpiration;
  item.splice(Number(e.target.id.substring(4)), 1);
  console.log("Current items when editing: " + JSON.stringify(item));
  updateItem();
};

const remove = function(e) {
  e.preventDefault();
  item.splice(Number(e.target.id.substring(6)), 1);
  console.log("Current Items after deletion: " + JSON.stringify(item));
  updateItem();
};
//update the item table with any changes
function updateItem() {
  let table = document.querySelector("tbody");
  table.innerHTML = "";
  for (let index = 0; index < item.length; index++) {
    let newRow = document.createElement("tr");
    for (let unit = 0; unit < 6; unit++) {
      let newUnit = document.createElement("td");
      let newText;
      switch (unit) {
        case 0:
          //Creates a new unit that contains the itemName value
          newText = document.createTextNode(item[index].itemName);
          break;
        case 1:
          //Creates a new unit that contains the itemDescription value
          newText = document.createTextNode(item[index].itemDescription);
          break;
        case 2:
          //Creates a new unit that contains the Expiration value
          newText = document.createTextNode(item[index].itemExpiration);
          break;
        case 3:
          //Creates a new unit that contains the Urgency value
          newText = document.createTextNode(item[index].itemUrgency);
          break;
        case 4:
          //Creates a new unit that contains the Edit button
          newText = document.createElement("Input");
          newText.setAttribute("type", "button");
          newText.setAttribute("value", "Edit");
          newText.className = "editButton";
          break;
        case 5:
          //Creates a new unit that contains the Remove button
          newText = document.createElement("Input");
          newText.setAttribute("type", "button");
          newText.setAttribute("value", "Remove");
          newText.className = "removeButton";
          break;
      }
      //Adds an event to the Edit button
      if (unit === 4) {
        newText.id = "Edit" + index.toString();
        newText.onclick = edit;
      }
      //Adds an event to the Remove button
      if (unit === 5) {
        newText.id = "Delete" + index.toString();
        newText.onclick = remove;
      }
      //Placing each text to there appropriate unit and placing each unit to a row
      newUnit.appendChild(newText);
      newRow.appendChild(newUnit);
    }
    //Placing the row in the table
    table.appendChild(newRow);
  }
}

window.onload = function() {
  const addButton = document.querySelector("#addItem");
  addButton.onclick = submit;
};