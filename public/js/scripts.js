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
      title: form.title.value,
      author: form.author.value,
      score: form.score.value,
      notes: form.notes.value,
      year: form.year.value,
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
  row.insertCell(0).innerHTML = json.title;
  row.insertCell(1).innerHTML = json.author;
  row.insertCell(2).innerHTML = json.score;
  row.insertCell(3).innerHTML = json.notes;
  row.insertCell(4).innerHTML = json.year;
}
