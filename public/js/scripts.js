console.log("Welcome to assignment 3!");

const load = function () {
  fetch("/load", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      update(result);
    });
};

const add = function (e) {
  e.preventDefault();

  const nameIn = document.querySelector("#name"),
    tickerIn = document.querySelector("#ticker"),
    exchangeIn = document.querySelector("#exchange"),
    priceIn = document.querySelector("#price"),
    sharesIn = document.querySelector("#shares");

  const radios = document.getElementsByName("risk");
  let riskIn = "";
  for (let rad = 0; rad < radios.length; rad++) {
    if (radios[rad].checked) {
      riskIn = document.getElementById(radios[rad].id);
    }
  }

  const ret = validate(nameIn, tickerIn, exchangeIn, riskIn, priceIn, sharesIn);
  if (ret === false) return ret;

  const json = {
    name: nameIn.value,
    ticker: tickerIn.value,
    exchange: exchangeIn.value,
    risk: riskIn.value,
    price: priceIn.value,
    shares: sharesIn.value,
  };
  json.invested = json.price * json.shares;
  const body = JSON.stringify(json);

  fetch("/add", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      update(result);
    });
};

const remove = function (e) {
  e.preventDefault();

  const element = this.index,
    json = {
      _id: element,
    },
    body = JSON.stringify(json);

  fetch("/remove", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      update(result);
    });
};

const edit = function (e) {
  e.preventDefault();

  const nameIn = document.querySelector("#name"),
    tickerIn = document.querySelector("#ticker"),
    exchangeIn = document.querySelector("#exchange"),
    priceIn = document.querySelector("#price"),
    sharesIn = document.querySelector("#shares");

  const radios = document.getElementsByName("risk");
  let riskIn = "";
  for (let rad = 0; rad < radios.length; rad++) {
    if (radios[rad].checked) {
      riskIn = document.getElementById(radios[rad].id);
    }
  }

  const ret = validate(nameIn, tickerIn, exchangeIn, riskIn, priceIn, sharesIn);
  if (ret === false) return ret;

  const element = this.index,
    json = {
      _id: element,
      name: nameIn.value,
      ticker: tickerIn.value,
      exchange: exchangeIn.value,
      risk: riskIn.value,
      price: priceIn.value,
      shares: sharesIn.value,
    };
  json.invested = json.price * json.shares;
  const body = JSON.stringify(json);

  fetch("/edit", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      update(result);
    });
};

const validate = function (nameIn, tickerIn, exchangeIn, riskIn, priceIn, sharesIn) {
  if (
    nameIn.value === "" ||
    tickerIn.value === "" ||
    priceIn.value === "" ||
    sharesIn.value === "" ||
    exchangeIn.value === "" ||
    riskIn === "" ||
    nameIn.value === "Enter Name of Security Here" ||
    tickerIn.value === "Enter Ticker Symbol Here" ||
    priceIn.value === "Enter Price of Security Here" ||
    sharesIn.value === "Enter Shares Owned Here"
  ) {
    console.log("ERROR: Some or all fields are empty");
    alert("ERROR: Some or all fields are empty");
    return false;
  }

  if (nameIn.value.length > 16 || tickerIn.value.length > 6 || priceIn.value.length > 12 || sharesIn.value.length > 12) {
    console.log("ERROR: Too many characters entered");
    alert("ERROR: Too many characters entered");
    return false;
  }

  if (isNaN(priceIn.value) || isNaN(sharesIn.value)) {
    console.log("ERROR: Price or shares are not numbers");
    alert("ERROR: Price or shares are not numbers");
    return false;
  }
};

const update = function (data) {
  let tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  for (let row = 0; row < data.length; row++) {
    if (data[row].username === undefined && data[row].password === undefined) {
      let newRow = document.createElement("tr");
      for (let col = 0; col < 9; col++) {
        let newCol = document.createElement("td");
        let newNode;
        switch (col) {
          case 0:
            newNode = document.createTextNode(data[row].name);
            break;
          case 1:
            newNode = document.createTextNode(data[row].ticker);
            break;
          case 2:
            newNode = document.createTextNode(data[row].exchange);
            break;
          case 3:
            newNode = document.createTextNode(data[row].risk);
            break;
          case 4:
            newNode = document.createTextNode(data[row].price);
            break;
          case 5:
            newNode = document.createTextNode(data[row].shares);
            break;
          case 6:
            newNode = document.createTextNode(data[row].invested);
            break;
          case 7:
            newNode = document.createElement("button");
            newNode.innerHTML = "Remove";
            newNode.setAttribute("class", "btn text-light btn-dark col-8");
            newNode.onclick = remove;
            newNode.index = data[row]._id;
            break;
          case 8:
            newNode = document.createElement("button");
            newNode.innerHTML = "Edit";
            newNode.setAttribute("class", "btn text-light btn-dark col-8");
            newNode.onclick = edit;
            newNode.index = data[row]._id;
            break;
        }
        newCol.appendChild(newNode);
        newRow.appendChild(newCol);
      }
      tbody.appendChild(newRow);
    }
  }
};

window.onload = function () {
  load();
  const button = document.querySelector("button");
  button.onclick = add;
};
