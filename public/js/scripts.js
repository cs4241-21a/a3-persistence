// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!")

window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit
    createTable()
}

function remove() {
    let table = document.getElementById("dataTable")
    document.getElementById("dataTable").deleteRow(table.rowIndex);
      json = { 
        modifyInput: 1
     },
     body = JSON.stringify( json )

  fetch( '/delete', {
      method: 'POST',
      body
    })
    .then( function( response ) {
    console.log( response )
    createTable()
})
}

const createTable = function() {
    fetch("/getData", {
        method:"GET"
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(data){
        let table = document.getElementById("dataTable")
        for(var i = table.rows.length - 1; i > 0; i--)
            table.deleteRow(i)

        data.map(function(item) {
            let tableRow = document.createElement("tr")
            let tableData = document.createElement("td")
            let tableData2 = document.createElement("td")
            let tableData3 = document.createElement("td")
            let tableData4 = document.createElement("td")
            let deleteButton = document.createElement("td")
            tableData.innerHTML = item['name']
            tableData2.innerHTML = item['age']
            tableData3.innerHTML = item['hours']
            tableData4.innerHTML = item['jobType']
            deleteButton.innerHTML = '<button onclick="remove()">Delete</button>';
            tableRow.appendChild(tableData)
            tableRow.appendChild(tableData2)
            tableRow.appendChild(tableData3)
            tableRow.appendChild(tableData4)
            tableRow.appendChild(deleteButton)
            table.appendChild(tableRow)
        })
    })
}



const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const input = document.querySelector( '#name' ),
        input2 = document.querySelector( '#age' ),
        input3 = document.querySelector( '#hours' ),
        typeJob = document.querySelector( '#jobType')
          json = { name: input.value,
            age: input2.value,
            hours: input3.value,
            jobType: getJobType(input3.value, input2.value),
            modifyInput: 1
         },
          body = JSON.stringify( json )
          if(json['name']  === "" || json['age']  === "" || json['hours'] === "") {
              alert("Please fill in all fields.")
          } else {
            fetch( '/submit', {
                method:'POST',
                body 
              })
              .then( function( response ) {
                // do something with the reponse 
                console.log( response )
                createTable()
              })
          }

          function getJobType(hours, age) {
              if(hours <= 0 && age < 18) {
                  return "Student"
              }
              else if(hours <= 0) {
                  return "Unemployed"
              }
              else if(hours < 40) {
                  return "Part time"
              }
              else {
                  return "Full Time"
              }
          }


    return false
  }

