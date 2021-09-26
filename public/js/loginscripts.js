const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

}


window.onload = function() {
    const submitButton = document.getElementById( 'formSubmit' )
    submitButton.onclick = submit
}