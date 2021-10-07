let eid = null
fetch("/data")
  .then(response => response.json())
  .then(db => {
    db.forEach(buildTable);
  });

const submit = function (e) {
  // prevent default form action from being carried out
  e.preventDefault();
  let txt = document.getElementById('sub').innerText;
  window.alert(txt)
  if(txt.toLowerCase() == 'submit') {
    const form = document.querySelector("form"),
      json = {
        plant: form.plant.value,
        sunlight: form.sunlight.value,
        water: form.water.value,
        adopt: form.adopt.value,
        notes: form.notes.value,
      },
      body = JSON.stringify(json);
      fetch("/add", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function (response) {
          // do something with the reponse
          return response.json();
        })
  
        .then(function (json) {
          document.querySelector("form").reset();
          buildTable(json);
        });
    }
    else if(txt.toLowerCase() == 'update') {
      json = {
        plant: document.getElementById('plant').value,
        sunlight: document.getElementById('sunlight').value,
        water: document.getElementById('water').value,
        adopt: document.getElementById('adopt').value,
        notes: document.getElementById('notes').value,
        id: eid
      },
      body= JSON.stringify(json)
      fetch("/update", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json"
          }
        })
      .then(function (response) {
          // do something with the reponse
        return response.json();
      })
  
      .then(function (json) {
        document.querySelector("form").reset();
        buildTable(json);
      });
    
      document.querySelector('#sub').innerHTML = "Submit";
      eid = null;
    }
  
    return false;
  };

window.onload = function () {
  const button = document.querySelector("button");
  button.onclick = submit;
}

function buildTable(json) {
  let row = document.querySelector("#tbody").insertRow();
  row.insertCell(0).innerHTML = json.plant;
  row.insertCell(1).innerHTML = json.sunlight;
  row.insertCell(2).innerHTML = json.water;
  row.insertCell(3).innerHTML = json.adopt;
  row.insertCell(4).innerHTML = json.notes;
  let id = json._id
  console.log("building" + id)
  //Edit Button
  let editCell = row.insertCell(5);
  let ebutton = document.createElement("button");
  ebutton.innerHTML = 'Edit';
  ebutton.onclick = function() {
     //Move row data to edit
     document.getElementById('plant').value = json.plant
     document.getElementById('sunlight').value = json.sunlight
     document.getElementById('water').value = json.water
     document.getElementById('adopt').value = json.adopt
     document.getElementById('notes').value = json.notes
     eid = id;
 
     row.remove()
 
     document.querySelector('#sub').innerHTML = "Update";
  }

  editCell.appendChild(ebutton);
  
  //Delete Button
  let deleteCell = row.insertCell(6);
  let dbutton = document.createElement("button");
  dbutton.innerHTML = 'Delete';
  dbutton.onclick = function() {
    fetch("/remove", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        row.remove();
      });
  }
  deleteCell.appendChild(dbutton);
}