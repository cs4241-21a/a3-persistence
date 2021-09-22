fetch("/data")
  .then(response => response.json())
  .then(db => {
    db.forEach(buildTable);
  });

const submit = function (e) {
  // prevent default form action from being carried out
  e.preventDefault();

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
  row.insertCell(0).innerHTML = json.plant;
  row.insertCell(1).innerHTML = json.sunlight;
  row.insertCell(2).innerHTML = json.water;
  row.insertCell(3).innerHTML = json.adopt;
  row.insertCell(4).innerHTML = json.notes;
}
