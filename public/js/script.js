function sendData () {
    console.log("called send data")
    // obtain data from HTML
    /* // Iterate through data in form
    let data = new FormData(form);
    for (let pair of data.entries()){
        json[pair[0]] = pair[1]
    }
    */
    // set the body for request

    // setup JSON object
    let json = {"a": 123, "b": 456}

    // POST /add Request
    fetch( '/add', {
      method:'POST',
      body: JSON.stringify(json),
      headers: {
          "Content-Type": "application/json"
      }
    })
    .then(function(response) { 
        return response.json()
    }).then( function(data) { 
        found = data.found;
        console.log(found);
        password = data.password;
        console.log(password);
    })
}


window.onload = function() {
    // Request: GET /data
    fetch('/data', {
        method: 'GET'
    }).then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data)
    })
    const submitBtn = document.getElementById('submitBtn');
    // submitBtn.addEventListener("click", sendData);

}