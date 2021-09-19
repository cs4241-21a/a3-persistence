//Gets derivative field
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
  
  //Adds an entry to the table when user presses submit
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
  
    let idElement = json._id;
  
    //Adding text to fields
    newName.innerHTML = json.yourname;
    newMajor.innerHTML = json.major;
    newHours.innerHTML = json.hours;
    newAdvice.innerHTML = json.advice;
  
    //Appending edit button to td
    editButton.setAttribute('type','button')
    editButton.setAttribute('value', 'Edit')
    editButton.className = 'editButton';
    editElement.appendChild(editButton);
  
    let nameInput = document.createElement('Input'),
      majorInput = document.createElement('Input'),
      hoursInput = document.createElement('Input'),
      adviceInput = document.createElement('Input'),
      id = idElement;
  
      nameInput.value = newName.innerHTML;
      majorInput.value = newMajor.innerHTML;
      hoursInput.value = newHours.innerHTML;
      adviceInput.value = adviceInput.innerHTML;
  
    editButton.onclick = function() {
  
      document.querySelector('#yourname').value = json.yourname
      document.querySelector('#major').value = json.major
      document.querySelector('#hours').value = json.hours
  
      newRow.remove();
  
      json = { yourname: nameInput.value, major: majorInput.value, hours: hoursInput.value, advice: adviceInput.value, id: id }
      body = JSON.stringify( json )
  
      fetch( '/update', {
        method:'POST',
        body,
        headers: {
          "Content-Type": "application/json"
        } 
      })
      .then(response => response.json())
      .then(json => {
        
        nameInput.value = newName.innerHTML
        majorInput.value = newMajor.innerHTML
        hoursInput.value = newHours.innerHTML
        adviceInput.value = newAdvice.innerHTML
  
        console.log("json:", json)
      })
    }
  
    //Appending remove button to td
    removeButton.setAttribute('type','button')
    removeButton.setAttribute('value', 'Remove')
    removeButton.className = 'removeButton';
    removeElement.appendChild(removeButton);
  
    //Handles remove function
    removeButton.onclick = function () {
  
      fetch( '/remove', {
        method:'POST',
        body: JSON.stringify({idElement}),
        headers: {
          "Content-Type": "application/json"
        } 
      })
      .then(response => response.json())
      .then(json => {
        newRow.remove();
      })
    }
  };

  //Loads data from the database depending on the user
  function loadDatabase(item) {
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
  
    let idElement = item._id;
  
    //Adding text to fields
    newName.innerHTML = item.yourname;
    newMajor.innerHTML = item.major;
    newHours.innerHTML = item.hours;
    newAdvice.innerHTML = item.advice;
  
    //Appending edit button to td
    editButton.setAttribute('type','button')
    editButton.setAttribute('value', 'Edit')
    editButton.className = 'editButton';
    editElement.appendChild(editButton);
  
    let nameInput = document.createElement('Input'),
      majorInput = document.createElement('Input'),
      hoursInput = document.createElement('Input'),
      adviceInput = document.createElement('Input'),
      id = idElement;
  
      nameInput.value = newName.innerHTML;
      majorInput.value = newMajor.innerHTML;
      hoursInput.value = newHours.innerHTML;
      adviceInput.value = adviceInput.innerHTML;
  
    editButton.onclick = function() {
  
      document.querySelector('#yourname').value = item.yourname
      document.querySelector('#major').value = item.major
      document.querySelector('#hours').value = item.hours
  
      newRow.remove();
  
      json = { yourname: nameInput.value, major: majorInput.value, hours: hoursInput.value, advice: adviceInput.value, id: id }
      body = JSON.stringify( json )
  
      fetch( '/update', {
        method:'POST',
        body,
        headers: {
          "Content-Type": "application/json"
        } 
      })
      .then(response => response.json())
      .then(json => {
        
        nameInput.value = newName.innerHTML
        majorInput.value = newMajor.innerHTML
        hoursInput.value = newHours.innerHTML
        adviceInput.value = newAdvice.innerHTML
  
        console.log("json:", json)
      })
    }
  
    //Appending remove button to td
    removeButton.setAttribute('type','button')
    removeButton.setAttribute('value', 'Remove')
    removeButton.className = 'removeButton';
    removeElement.appendChild(removeButton);
  
    //Handles remove function
    removeButton.onclick = function () {
  
      fetch( '/remove', {
        method:'POST',
        body: JSON.stringify({idElement}),
        headers: {
          "Content-Type": "application/json"
        } 
      })
      .then(response => response.json())
      .then(json => {
        newRow.remove();
      })
    }
  }

  fetch("/sleep")
  .then(response => response.json())
  .then(sleep => {
    sleep.forEach(loadDatabase);
  });
  
  const submit = function( e ) {

    e.preventDefault()

      const name = document.querySelector( '#yourname' ),
      major = document.querySelector('#major'),
      sleep = document.querySelector('#hours');
      advice = getAdvice(sleep.value);
  
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

    //Handles logout when the user wants to logout 
    const logout = function (e) {

        e.preventDefault()

        fetch('logout', {
            method: 'POST',
            headers: {
                "Content-Type":"application/json"
            }
        })
        window.location.href = "login.html"
    }
    
    window.onload = function() {
      const button = document.querySelector( 'button' )
      button.onclick = submit

      const logoutButton = document.getElementById('logoutBtn')
      logoutButton.onclick = logout
    }