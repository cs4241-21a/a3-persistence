const secondaryButton = document.getElementById( 'secondaryButton' )


const register = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault(e)

    json = createJson('add')
    
    if (verifyJson(json)) {
      body = JSON.stringify( json )
      console.log(body)
      sendPost('add', body)
      return false
    }
    alert('One or more form fields are empty')
  }

window.onload = function() {

    secondaryButton.onclick = register

  }