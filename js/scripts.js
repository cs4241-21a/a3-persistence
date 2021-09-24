// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 3!")

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const input = document.querySelector( 'form' ),
          json = { yourclass: input.yourclass.value, yourassignment: input.yourassignment.value, 
                  complete: input.complete.value, date: input.date.value},
          body = JSON.stringify( json )

    fetch( '/submit', {
      method:'POST',
      body 
    })
    .then( function( response ) {
      // do something with the reponse 
      console.log( response )
      return response.json()
    })
    .then( function(json) {
      console.log(json)
      
      //Delete anything currently in table
      for (let i = document.querySelector('#tableID').rows.length-1; i > 0 ; i--) {
        document.querySelector('#tableID').deleteRow(i)
      }
      
      //Populate/Repopulate table
      for( let i = 0; i < json.homework.length; i++) {
      var row = document.querySelector('#tableID').insertRow()
      row.insertCell(0).innerHTML = json.homework[i].yourclass
      row.insertCell(1).innerHTML = json.homework[i].yourassignment
      row.insertCell(2).innerHTML = json.homework[i].complete
      row.insertCell(3).innerHTML = json.homework[i].date
      row.insertCell(4).innerHTML = json.homework[i].calculated
      }
    })

    return false
  }

  window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit
  }