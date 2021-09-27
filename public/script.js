const tdate = document.querySelector("#loanDate");
const cont = document.querySelector("#contents");
const tcolor = document.querySelector("#tupColor");
const tsize = document.querySelector("#tup_Size");
const theirname = document.querySelector("#theirname");
const reli = document.querySelector("#relible");

const storedTupTable = document.getElementById("storedTups");
const addTupButton = document.getElementById("addTupButton");
const viewTupButton = document.getElementById("viewTup");
const subbut = document.getElementById("submitDataButton");

let requestType = "/add";
let _id = NaN;

var tableIndexCount = 0;

window.onload = function() {
  addTupButton.onclick = add;
  viewTupButton.onclick = view;
  subbut.onclick = submit;

  fetch("/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}"
  })
    .then(response => response.json())
    .then(function(appData) {
      //update( appData )
    });
};

const submit = function(e) {
  e.preventDefault();

  let json;

  switch (requestType) {
    case "/add":
      json = {
        tdate: tdate.value,
        cont: cont.value,
        tcolor: tcolor.value,
        tsize: tsize.value,
        theirname: theirname.value,
        reli: reli.value
      };
      break;

    case "/edit":
      //json tbd
      break;
  }

  const body = JSON.stringify(json);

  fetch(requestType, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  })
    .then(response => response.json())
    .then(function(appData) {
      update(appData);
    });

  return false;
};

const view = function(e) {};

const update = function(e) {};

const add = function(e) {
  e.preventDefault();
  requestType = "/add";

  return false;
};
