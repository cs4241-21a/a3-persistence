const submit = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();

  const name_input = document.querySelector("#name"),
    age_input = document.querySelector("#age"),
    license_input = document.querySelector("#license"),
    json = {
      name: name_input.value,
      age: age_input.value,
      license: license_input.value
    },
    body = JSON.stringify(json);

  fetch("/submit", {
    method: "POST",
    body: body,
    headers: { "Content-Type": "application/json" }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log(json);

      let entryID = json._id;

      var namenode = document.createElement("div");
      namenode.setAttribute("class", "grid-item");
      namenode.innerText = json.name;
      document.getElementById("table").appendChild(namenode);

      var agenode = document.createElement("div");
      agenode.setAttribute("class", "grid-item");
      agenode.innerText = json.age;
      document.getElementById("table").appendChild(agenode);

      var lnode = document.createElement("div");
      lnode.setAttribute("class", "grid-item");
      lnode.innerText = json.license;
      document.getElementById("table").appendChild(lnode);

      var legalnode = document.createElement("div");
      legalnode.setAttribute("class", "grid-item");
      legalnode.innerText = json.legalDriver;
      document.getElementById("table").appendChild(legalnode);

      let name1 = 0,
        age1 = 0,
        l1 = 0,
        legal1 = 0,
        ID = entryID;

      var editbutton = document.createElement("Input");
      editbutton.setAttribute("type", "button");
      editbutton.setAttribute("value", "edit");
      document.getElementById("table").appendChild(editbutton);

      editbutton.onclick = function() {
        name1 = document.querySelector("#name").value;
        age1 = document.querySelector("#age").value;
        l1 = document.querySelector("#license").value;

        json = {
          name: name1,
          age: age1,
          license: l1,
          legalDriver: legal1,
          id: ID
        };
        body = JSON.stringify(json);

        fetch("update", {
          method: "POST",
          body: body,
          headers: { "Content-Type": "application/json" }
        })
          .then(response => response.json())
          .then(json => {
            namenode.innerText = json.name;
            agenode.innerText = json.age;
            lnode.innerText = json.license;
            legalnode.innerText = json.legalDriver;
          });
      };

      var delbutton = document.createElement("Input");
      delbutton.setAttribute("type", "button");
      delbutton.setAttribute("value", "delete");
      document.getElementById("table").appendChild(delbutton);

      delbutton.onclick = function() {
        fetch("/remove", {
          method: "POST",
          body: JSON.stringify({ entryID }),
          headers: { "Content-Type": "application/json" }
        })
          .then(response => response.json())
          .then(json => {
            namenode.remove();
            agenode.remove();
            lnode.remove();
            legalnode.remove();
            editbutton.remove();
            delbutton.remove();
          });
      };
    });

  return false;
};

function loadData(entry) {
  let entryID = entry._id;

  var namenode = document.createElement("div");
  namenode.setAttribute("class", "grid-item");
  namenode.innerText = entry.name;
  document.getElementById("table").appendChild(namenode);

  var agenode = document.createElement("div");
  agenode.setAttribute("class", "grid-item");
  agenode.innerText = entry.age;
  document.getElementById("table").appendChild(agenode);

  var lnode = document.createElement("div");
  lnode.setAttribute("class", "grid-item");
  lnode.innerText = entry.license;
  document.getElementById("table").appendChild(lnode);

  var legalnode = document.createElement("div");
  legalnode.setAttribute("class", "grid-item");
  legalnode.innerText = entry.legalDriver;
  document.getElementById("table").appendChild(legalnode);

  let name1 = namenode.innerText,
    age1 = agenode.innerText,
    l1 = lnode.innerText,
    legal1 = legalnode.innerText,
    ID = entryID;

  var editbutton = document.createElement("Input");
  editbutton.setAttribute("type", "button");
  editbutton.setAttribute("value", "edit");
  document.getElementById("table").appendChild(editbutton);

  editbutton.onclick = function() {
    name1 = document.querySelector("#name").value;
    age1 = document.querySelector("#age").value;
    l1 = document.querySelector("#license").value;

    let json = {
        name: name1,
        age: age1,
        license: l1,
        legalDriver: legal1,
        id: ID
      },
      body = JSON.stringify(json);

    fetch("update", {
      method: "POST",
      body: body,
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        namenode.innerText = json.name;
        agenode.innerText = json.age;
        lnode.innerText = json.license;
        legalnode.innerText = json.legalDriver;
      });
  };

  var delbutton = document.createElement("Input");
  delbutton.setAttribute("type", "button");
  delbutton.setAttribute("value", "delete");
  document.getElementById("table").appendChild(delbutton);

  delbutton.onclick = function() {
    fetch("/remove", {
      method: "POST",
      body: JSON.stringify({ entryID }),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        namenode.remove();
        agenode.remove();
        lnode.remove();
        legalnode.remove();
        editbutton.remove();
        delbutton.remove();
      });
  };
}
fetch("/getDatabase")
  .then(response => response.json())
  .then(getDatabase => {
    getDatabase.forEach(loadData);
  });

const goback = function(e) {
  e.preventDefault();

  fetch("logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }).then(response => response.json());
  window.location.href = "login.html";
};

window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;

  const logoutButton = document.getElementByID("logoutButton");
  logoutButton.onclick = goback;
};
