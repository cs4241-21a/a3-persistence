const petSubmitButton = document.getElementById("petsubmit");
const logoutButton = document.getElementById("logoutButton");

const petNameText = document.getElementById("petname");
const petAgeText = document.getElementById("petage");
const petAnimalBoxText = document.getElementById("animaltype");

const petInfoContainer = document.getElementById("gridContainer");

window.onload = function() {
  fetch("/getuserinfo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json.username) {
        document.getElementById("usernameHeader").innerText +=
          " " + json.username;
      } else {
        window.alert("You aren't logged in yet!");
        window.location.href = "/";
      }
    });

  fetch("/getuserpets", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(pets => {
      populator(pets);
    });
};

let populator = function(pets) {
  console.log(pets);

  console.log(pets.length);

  //Through the power of brute force and copious amounts of spaghetti, it works flawlessly

  while (petInfoContainer.firstChild) {
    petInfoContainer.removeChild(petInfoContainer.firstChild);
  }

  let petRowBase = document.createElement("div");
  petRowBase.className = "row";

  let NameList = document.createElement("div");
  NameList.className = "col";
  NameList.innerText = "Name";

  let AgeList = document.createElement("div");
  AgeList.className = "col";
  AgeList.innerText = "Age";

  let AnimalList = document.createElement("div");
  AnimalList.className = "col";
  AnimalList.innerText = "Animal";

  let deleteList = document.createElement("div");
  deleteList.className = "col";
  deleteList.innerText = "Click to delete";

  let updateList = document.createElement("div");
  updateList.className = "col";
  updateList.innerText = "Click to update";

  petInfoContainer.appendChild(petRowBase);
  petRowBase.appendChild(NameList);
  petRowBase.appendChild(AgeList);
  petRowBase.appendChild(AnimalList);
  petRowBase.appendChild(deleteList);
  petRowBase.appendChild(updateList);

  for (let i = 0; i < pets.length; i++) {
    let petRow = document.createElement("div");
    petRow.className = "row";

    let petNameBox = document.createElement("div");
    petNameBox.className = "col";
    petNameBox.innerText = pets[i].petname;

    let petAgeBox = document.createElement("div");
    petAgeBox.className = "col";
    petAgeBox.innerText = pets[i].petage;

    let petAnimalBox = document.createElement("div");
    petAnimalBox.className = "col";
    petAnimalBox.innerText = pets[i].animaltype;

    let deleteBox = document.createElement("div");
    deleteBox.className = "col";
    deleteBox.innerText = "Delete?";

    let updateBox = document.createElement("div");
    updateBox.className = "col";
    updateBox.innerText = "Update?";

    deleteBox.addEventListener("click", event => {
      event.preventDefault();
      fetch("/deletepet", {
        method: "POST",
        body: JSON.stringify({
          petname: petNameText.value,
          index: i
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(pets => {
          populator(pets);
        });
    });

    updateBox.addEventListener("click", event => {
      event.preventDefault();

      if (
        petNameText.value == "" ||
        petAgeText.value == "" ||
        petAnimalBoxText.value == "" ||
        petAgeText.value < 0
      ) {
        window.Alert("Please fill in all fields before updating an entry!");
        return;
      }

      console.log({
        petname: petNameText.value,
        petage: petAgeText.value,
        animaltype: petAnimalBoxText.value,
        index: i
      });

      fetch("/updatepet", {
        method: "POST",
        body: JSON.stringify({
          petname: petNameText.value,
          petage: petAgeText.value,
          animaltype: petAnimalBoxText.value,
          index: i
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(pets => {
          populator(pets);
        });
    });

    petInfoContainer.appendChild(petRow);
    petRow.appendChild(petNameBox);
    petRow.appendChild(petAgeBox);
    petRow.appendChild(petAnimalBox);
    petRow.appendChild(deleteBox);
    petRow.appendChild(updateBox);
  }
};

petSubmitButton.addEventListener("click", event => {
  event.preventDefault();

  if (
    petNameText.value == "" ||
    petAgeText.value == "" ||
    petAnimalBoxText.value == "" ||
    petAgeText.value < 0
  ) {
    window.Alert("Please fill in all fields before updating an entry!");
    return;
  }

  fetch("/submitpet", {
    method: "POST",
    body: JSON.stringify({
      petname: petNameText.value,
      petage: petAgeText.value,
      animaltype: petAnimalBoxText.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(pets => {
      populator(pets);
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
