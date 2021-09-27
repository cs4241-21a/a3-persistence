// Add some Javascript code here, to run on the front end.

const submit = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();

  const location = document.querySelector("#location"),
    cost = document.querySelector("#cost"),
    priority = document.querySelector("#priority"),
    visited = document.querySelector("#visited"),
    json = {
      location: location.value,
      cost: cost.value,
      priority: priority.value,
      rating: calcRating(cost.value, priority.value),
      visited: visited.checked
    },
    body = JSON.stringify(json);

  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  }).then(async response => {
    const data = await response.json();
    console.log(data);
    updateData(data);
    console.log(response);
  });

  return false;
};

let calcRating = (cost, priority) => {
  return (priority - cost + 10) / 2;
};

let updateData = data => {
  const table = document.getElementById("location-body");
  console.log("length", table.rows.length);
  let n = 0;
  for (let i = table.rows.length; i > 0; i--) {
    n++;
    table.deleteRow(0);
  }
  console.log("n", n);

  data.forEach((entry, i) => {
    const row = document.createElement("tr");

    const locationtd = document.createElement("td");
    row.appendChild(locationtd);
    const location = document.createElement("input");
    location.value = entry.location;
    location.id = "location" + i;
    locationtd.appendChild(location);

    const costtd = document.createElement("td");
    row.appendChild(costtd);
    const cost = document.createElement("input");
    cost.value = entry.cost;
    cost.type = "number";
    cost.id = "cost" + i;
    costtd.appendChild(cost);

    const prioritytd = document.createElement("td");
    row.appendChild(prioritytd);
    const priority = document.createElement("input");
    priority.value = entry.priority;
    priority.type = "number";
    priority.id = "priority" + i;
    prioritytd.appendChild(priority);

    const rating = document.createElement("td");
    rating.innerHTML = entry.rating;
    row.appendChild(rating);

    const visitedtd = document.createElement("td");
    row.appendChild(visitedtd);
    const visited = document.createElement("input");
    visited.type = "checkbox";
    visited.checked = entry.visited;
    visited.id = "visited" + i;
    visitedtd.appendChild(visited);

    const updatetd = document.createElement("td");
    row.appendChild(updatetd);
    const updateBtn = document.createElement("button");
    updateBtn.innerHTML = "Update";
    updateBtn.className = "update-button";
    updateBtn.onclick = e => {
      e.preventDefault();
      const newLocation = document.querySelector("#location" + i),
        cost = document.querySelector("#cost" + i),
        priority = document.querySelector("#priority" + i),
        visited = document.querySelector("#visited" + i),
        json = {
          location: location.value,
          cost: cost.value,
          priority: priority.value,
          rating:calcRating(cost.value,priority.value),
          visited:visited.checked,
          _id: entry._id
        },
        body = JSON.stringify(json);

      fetch("/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      }).then(async response => {
        const data = await response.json();
        console.log(data);
        updateData(data);
        console.log(response);
      });

      return false;
    };
    updatetd.appendChild(updateBtn);

    const deletetd = document.createElement("td");
    row.appendChild(deletetd);
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
        deleteBtn.onclick = (e) => {
          e.preventDefault();
          const json = { _id: entry._id },
            body = JSON.stringify(json);
          fetch("/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
          }).then(async response => {
            const data = await response.json();
            updateData(data);
            console.log(response);
          });

          return false;
        };
    deletetd.appendChild(deleteBtn);

    table.appendChild(row);
  });
  console.log("end", table.rows.length);
};

window.onload = function() {
  const button = document.getElementById("submit-button");
  button.onclick = submit;

  fetch("/init", {
    method: "GET"
  }).then(async response => {
    const data = await response.json();
    updateData(data);
  });
};
