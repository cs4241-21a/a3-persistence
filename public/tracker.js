// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const entriesList = document.getElementById("entries");
const countMMs = document.querySelector("form");
const introduction = document.getElementById("howdy");
const entryList = document.getElementById("entries");
const submitButton = document.getElementById("submit-entry");
const logoutButton = document.getElementById("logout");

function appendNewEntry(entry) {
  const newListItem = document.createElement("li");
  newListItem.innerText = entry[0] + " - " + entry[1];
  entriesList.appendChild(newListItem);
}

let fillPage = function(entries) {
  console.log(entries);

  console.log(entries.length);

  while (entryList.firstChild) {
    entryList.removeChild(entryList.firstChild);
  }

  for (let i = 0; i < entries.length; i++) {
    let entry = document.createElement("div");
    entry.className = "row";
    
    let entryInfoContainer = document.createElement("div");
    entryInfoContainer.className = "col";
    entryInfoContainer.innerText = entries[i].mmCount + " - " + entries[i].mmColor + "    ";
    
    let deleteButton = document.createElement("button");
    deleteButton.className = "material-icons";
    deleteButton.innerText = "delete";
    //deleteButton.innerText = '<i class="material-icons">delete</i>';
    
    let updateButton = document.createElement("button");
    updateButton.className = "material-icons";
    updateButton.innerText = "edit";
    //updateButton.innerHTML = <i class="material-icons">&#xe22b</i>
    
    deleteButton.addEventListener("click", event => {
      event.preventDefault();
      fetch("/deleteEntry", {
        method: "POST",
        body: JSON.stringify({
          mmCount: entries[i].mmCount,
          index: i
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(entries => {
          fillPage(entries);
        });
    });

    updateButton.addEventListener("click", event => {
      event.preventDefault();
      let newEntry = [countMMs.mm_count.value, document.querySelector('input[type="radio"][name="mm_color"]:checked').value];
      if (newEntry[0] != "") {
    
      } else {
        alert ("Please enter a number of M&Ms");
      }
      fetch("/updateEntry", {
        method: "POST",
        body: JSON.stringify({
          mmCount: newEntry[0],
          mmColor: newEntry[1],
          index: i
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(entries => {
          fillPage(entries);
        });
    });

    entryList.appendChild(entry);
    entry.appendChild(entryInfoContainer);
    entryInfoContainer.appendChild(deleteButton);
    entryInfoContainer.appendChild(updateButton);
  }
}

/*
// fetch the initial list of dreams
fetch("/entries")
  .then(response => response.json()) // parse the JSON from the server
  .then(entries => {
    // remove the loading text
    entriesList.firstElementChild.remove();
  
    // iterate through every dream and add it to our page
    entries.forEach(appendNewEntry);

    // listen for the form to be submitted and add a new dream when it is
    countMMs.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();

      // get dream value and add it to the list
      let newEntry = [countMMs.mm_count.value, document.querySelector('input[type="radio"][name="mm_color"]:checked').value];
      if (newEntry[0] != "") {
        console.log(newEntry);
        entries.push(newEntry);
        appendNewEntry(newEntry);
      } else {
        alert ("Please enter a number of M&Ms");
      }
      

      // reset form
      countMMs.reset();
      countMMs.elements.mm_count.focus();
    });
  });
*/

window.onload = function() {
  document.getElementById("howdy").innerText = "hello";
  
  console.log("onload called");
  fetch("/getname", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json.usr) {
        document.getElementById("howdy").innerText = "Howdy " + json.usr + "!";
      } else {
        window.alert("You aren't logged in yet!");
        window.location.href = "/";
      }
    });

  fetch("/getMMCounts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(entries => {
      fillPage(entries);
    });
};

submitButton.addEventListener("click", event => {
  event.preventDefault();

  let newEntry = [countMMs.mm_count.value, document.querySelector('input[type="radio"][name="mm_color"]:checked').value];
  if (newEntry[0] != "") {
    
  } else {
    alert ("Please enter a number of M&Ms");
  }
  fetch("/logMMCount", {
    method: "POST",
    body: JSON.stringify({
      mmCount: newEntry[0],
      mmColor: newEntry[1]
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(entries => {
      fillPage(entries);
    });
});

logoutButton.addEventListener("click", event => {
  event.preventDefault();

  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json.logout) {
        window.location.href = "/";
      } else {
        window.alert("You are already logged out.");
        window.location.href = "/";
      }
    });
});
  