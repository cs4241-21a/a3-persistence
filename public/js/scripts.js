let dataArr = [];

const getAdvice = function (hours) {

  let advice = ""
  
    if (hours === "0-4 hours") {
  
      advice = 'Go get some sleep'
  
    } else if (hours === "5-7 hours") {
  
      advice = 'Moderate amount of hours of sleep'
  
    } else if (hours === "8 hours") {
  
      advice = 'Perfect amount of hours of sleep'
  
    } else {
  
      advice = 'Cut back on some hours'
  
    }

  return advice;
}

const addEntry = (json) => {

  let table = document.getElementById('sleeptable')
  
  let newRow = table.insertRow(-1),
  newName = newRow.insertCell(0),
  newMajor = newRow.insertCell(1),
  newHours = newRow.insertCell(2),
  newAdvice = newRow.insertCell(3),
  editElement = newRow.insertCell(4),
  editButton = document.createElement('Input'),
  removeElement = newRow.insertCell(5),
  removeButton = document.createElement('Input');

  editButton.setAttribute('type','button')
  editButton.setAttribute('value', 'Edit')
  editButton.className = 'editButton';

  editElement.appendChild(editButton);

  removeButton.setAttribute('type','button')
  removeButton.setAttribute('value', 'Remove')
  removeButton.className = 'removeButton';

  removeElement.appendChild(removeButton);

  newName.innerHTML = json.yourname;
  newMajor.innerHTML = json.major;
  newHours.innerHTML = json.hours;
  newAdvice.innerHTML = json.advice;
};

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
  
    const name = document.querySelector( '#yourname' ),
    major = document.querySelector('#major'),
    sleep = document.querySelector('#hours');
    console.log("sleep.value:", sleep.value)

    advice = getAdvice(sleep.value)

    console.log("advice:", Object.getPrototypeOf(advice))

    //Error checking to make sure the fields are not empty
    if (name.value === "" || major.value === "" || sleep.value === "") {
        console.log("All fields are empty")
        alert("All fields needs to be filled.")
        return false
    } 

    //Error checking to make sure the fields are not just a single character
    if (name.value.length < 2 || major.value.length < 2) {
      console.log("Not a valid input")
      alert("Enter valid fields only.")
      return false
    }

    //Error checking to make sure the fields are not the starting text
    if (name.value === "Enter your name here" || major.value === "Enter your major here") {
        console.log("Not valid data")
        alert("Enter valid fields only.")
        return false
    }
  
    json = { yourname: name.value, major: major.value, hours:sleep.value, advice: advice }
    body = JSON.stringify( json )
  
    fetch( '/submit', {
      method:'POST',
      body: body,
      headers: {
        "Content-Type": "application/json"
      } 
    })
    .then(response => response.json())
    .then(json => {
      addEntry(json)
    })
    return false
  }

  //Edits the selected row by removing it and adding it back to the table
  const modify = function (e) {
      e.preventDefault()
  
      //Gets the id of the row that needs to be editted
      let entry = dataArr[Number(e.target.id.substring(4))];
  
      document.querySelector('#yourname').value = entry.yourname
      document.querySelector('#major').value = entry.major
      document.querySelector('#hours').value = entry.hours
  
      dataArr.splice(Number(e.target.id.substring(4)), 1);
      console.log("Current dataArr when editing: " + JSON.stringify(dataArr))
  
      updateTable();
    }

  //Removes the selected row from the table
  const remove = function (e) {
    e.preventDefault()

    //Gets the id of the row that needs to be deleted
    dataArr.splice(Number(e.target.id.substring(6)), 1);
    console.log("Current dataArr after deletion: " + JSON.stringify(dataArr))

    updateTable();
  }
  
  window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit
  }
