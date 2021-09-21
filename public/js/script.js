let form = null

const submitForm = function(e){
    e.preventDefault();
    // setup JSON object
    let json = {}
    // Iterate through data in form
    let data = new FormData(form);
    for (let pair of data.entries()){
        json[pair[0]] = pair[1]
    }

    // POST /add Request
    fetch( '/add', {
        method:'POST',
        body: JSON.stringify(json),
        headers: {
            "Content-Type": "application/json"
        }
      })
      .then( function( response ) { 
        console.log( response )
      }).then( function() { 
          console.log( "Finished add request" )
          updateData()
          form.reset()
      })
}

function updateData(){
    fetch('/update', {
        method: 'GET'
    }).then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);
        const resultsTable = document.getElementById("results");
        resultsTable.innerHTML = " ";

        // create table row
        let headRow = document.createElement('tr');

        // create table headers
        let th1 = document.createElement('th');
        th1.innerHTML = 'Pokemon';
        headRow.appendChild(th1);
        
        let th2 = document.createElement('th');
        th2.innerHTML = 'Nickname';
        headRow.appendChild(th2);
        
        // add head row to table
        resultsTable.appendChild(headRow)
        
        // iterate through obtained data
        for (let index = 0; index < data.length; index++) {
            let entry = data[index];

            // start new row
            let newRow = document.createElement('tr');
            newRow.id = entry["_id"];
            newRow.className = "tableEntry";

            // add associated data
            let someData = document.createElement('td');
            someData.innerHTML = entry["pokemon"];
            newRow.appendChild(someData)

            // add entry to table
            resultsTable.appendChild(newRow);
        }
    })
}

window.onload = function() {
    form = document.getElementById('data_form');
    form.onsubmit = submitForm
    updateData()
}