// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 3!")

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    const input = document.querySelector( 'form' ),
          json = { yourclass: input.yourclass.value, yourassignment: input.yourassignment.value, 
                  complete: input.complete.value, date: input.date.value},
          body = JSON.stringify( json )
    
    fetch( '/add', {
      method:'POST',
      body,
      headers:{
        "Content-Type": "application/json"
      }
    })
    .then( function( response ) {
      // do something with the reponse 
      //console.log( response )
      return response.json()
    })
    .then( function(json) {
      //console.log(json)
      
      //Delete anything currently in table
      var table = document.querySelector("#tableID")
      
      for (let i = document.querySelector('#tableID').rows.length-1; i > 0 ; i--) {
        document.querySelector('#tableID').deleteRow(i)
      }
      
      //Populate/Repopulate table
      for (let i = 0; i < json.length; i++) {
        var row = table.insertRow()
        row.insertCell(0).innerHTML = json[i].yourclass
        row.insertCell(1).innerHTML = json[i].yourassignment
        row.insertCell(2).innerHTML = json[i].complete
        row.insertCell(3).innerHTML = json[i].date
      }
      
      
    })

    return false
  }


const deletefunct = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
  
    const input = document.querySelector( 'form' ),
          json = { yourclass: input.yourclass.value, yourassignment: input.yourassignment.value, 
                  complete: input.complete.value, date: input.date.value},
          body = JSON.stringify( json )
    
    fetch( '/deletefunct', {
        method:'POST',
        body,
        headers:{
          "Content-Type": "application/json"
        }
      })
      .then( function( response ) {
        // do something with the reponse
        return response.json()
      })
      .then( function(json) {

        var table = document.querySelector("#tableID")
      
        //Delete anything currently in table
        for (let i = document.querySelector('#tableID').rows.length-1; i > 0 ; i--) {
          document.querySelector('#tableID').deleteRow(i)
        }

        //Populate/Repopulate table
        for (let i = 0; i < json.length; i++) {
          var row = table.insertRow()
          row.insertCell(0).innerHTML = json[i].yourclass
          row.insertCell(1).innerHTML = json[i].yourassignment
          row.insertCell(2).innerHTML = json[i].complete
          row.insertCell(3).innerHTML = json[i].date
        }

    })

    return false
  }

  window.onload = function() {
    const submitbutton = document.querySelector( '#submit' )
    submitbutton.onclick = submit
    
    const deletebutton = document.querySelector('#delete')
    deletebutton.onclick = deletefunct
  }