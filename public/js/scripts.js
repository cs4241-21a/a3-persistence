let dataArr = [];

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
  
    const name = document.querySelector( '#yourname' ),
    major = document.querySelector('#major'),
    sleep = document.querySelector('#hours');

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
          json = { yourname: name.value, major: major.value, hours:sleep.value }
          body = JSON.stringify( json )
  
    fetch( '/submit', {
      method:'POST',
      body 
    })
    .then( function( response ) {
      return response.text()
    })

    .then( function ( text ) {
        dataArr.push(JSON.parse(text));
        updateTable();
        console.log("dataArr: " + JSON.stringify(dataArr));
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

  //Function updates the table either by adding, editing, or deleting a row from the table
  function updateTable() {

    let tbody = document.querySelector('tbody')
    tbody.innerHTML = ""

    for (let index = 0; index < dataArr.length; index++) {

        let newRow = document.createElement('tr')

        for (let cell = 0; cell < 6; cell++) {

            let newCell = document.createElement('td')
            let newText;

           switch(cell) {
               case 0:
                   //Creates a new cell that contains the Name value
                   newText = document.createTextNode(dataArr[index].yourname);
                   break;
                case 1:
                    //Creates a new cell that contains the Major value
                    newText = document.createTextNode(dataArr[index].major);
                    break;
                case 2:
                    //Creates a new cell that contains the Hours value
                    newText = document.createTextNode(dataArr[index].hours);
                    break;
                case 3:
                    //Creates a new cell that contains the Advice value
                    newText = document.createTextNode(dataArr[index].advice);
                    break;
                case 4:
                    //Creates a new cell that contains the Edit button
                    newText = document.createElement('Input')
                    newText.setAttribute('type','button')
                    newText.setAttribute('value', 'Edit')
                    newText.className = 'editButton';
                    break;
                case 5:
                    //Creates a new cell that contains the Remove button
                    newText = document.createElement('Input')
                    newText.setAttribute('type','button')
                    newText.setAttribute('value', 'Remove')
                    newText.className = 'removeButton';
                    break;
           }
            //Adds an event to the Edit button
            if (cell === 4) {
                newText.id = "Edit" + index.toString()
                newText.onclick = modify;
            }
            //Adds an event to the Remove button
            if (cell === 5) {
                newText.id = "Delete" + index.toString()
                newText.onclick = remove;
            }
            //Placing each text to there appropriate cell and placing each cell to a row
            newCell.appendChild(newText)
            newRow.appendChild(newCell)
        }
        //Placing the row in the tbody
        tbody.appendChild(newRow)
    }   
  }