// JS script for handling form requests on login page

const submitForget = function(e) {
    // prevent default form action from being carried out
    e.preventDefault()
    const form = document.getElementById('forget_password_form');
    // setup JSON object
    let json = {}
    // Iterate through data in form
    let data = new FormData(form);
    for (let pair of data.entries()){
        json[pair[0]] = pair[1]
    }
    // POST /remember Request
    fetch( '/remember', {
        method:'POST',
        body: JSON.stringify(json),
        headers: {
            "Content-Type": "application/json"
        }
      })
      .then( function( response ) { 
        return response.json()
      }).then( function(data) { 
        // extract response data
        found = data.found;
        password = data.password;
        // depending if an associated account was found, write message to div
        const forget_response = document.getElementById('forget_response')
        if(found) {
            forget_response.style.color = "green";
            forget_response.innerHTML = "<br> The password is: <b>" + password + "</b>";
        }
        else {
            forget_response.style.color = "red";
            forget_response.innerHTML = "<br> <b> Unknown username </b>";
        }
    })
}

window.onload = function() {
    const forget_form = document.getElementById('forget_password_form');
    forget_form.onsubmit = submitForget;
}