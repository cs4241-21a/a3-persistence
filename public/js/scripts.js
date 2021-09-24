let eid = null
fetch("/data")
  .then(response => response.json())
  .then(db => {
    db.forEach(buildTable);
  });

const submit = function (e) {
  // prevent default form action from being carried out
  e.preventDefault();
  let txt = document.getElementById('sub').innerText

  if(txt == "Submit") {
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

    else {
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


    }

  return false;
};


window.onload = function () {
  const button = document.querySelector("button");
  button.onclick = submit;
}

function buildTable(json) {
  //document.querySelector("#tbody tr").remove();

  console.log(json)
  let row = document.querySelector("#tbody").insertRow();
  nplant = row.insertCell(0).innerHTML = json.plant;
  nsunlight = row.insertCell(1).innerHTML = json.sunlight;
  nwater = row.insertCell(2).innerHTML = json.water;
  nadopt = row.insertCell(3).innerHTML = json.adopt;
  nnotes = row.insertCell(4).innerHTML = json.notes;
  let id = json._id;
  //Edit Button
  let editCell = row.insertCell(5);
  let ebutton = document.createElement("button");
  //ebutton.classList.add("button2")
  ebutton.innerHTML = 'Edit';
  //ebutton.style.width = "40px"
  //ebutton.style.height = "40px"

  ebutton.onclick = function() {
    document.querySelector('#plant').value = json.plant
    document.querySelector('#sunlight').value = json.sunlight
    document.querySelector('#water').value = json.water
    document.querySelector('#adopt').value = json.adopt
    document.querySelector('#notes').value = json.notes
    eid = id;

    row.remove()

    document.querySelector('#sub').innerHTML = "Update";
  }

  editCell.appendChild(ebutton);

  //Delete Button
  let deleteCell = row.insertCell(6)
  let dbutton = document.createElement("button")
  dbutton.innerHTML = 'Delete';
  //dbutton.style.width = "40px"
  //dbutton.style.height = "40px"
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
