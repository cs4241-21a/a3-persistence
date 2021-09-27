// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!")

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    
    const json = {}
    json["courseName"] = document.getElementById("courseName").value
    json["assignmentName"] = document.getElementById("assignmentName").value
    json["dueDate"] = document.getElementById("dueDate").value
    json["submissionType"] = document.getElementById("submissionType").value
    json["description"] = document.getElementById("description").value

    if (document.getElementById('editCheck').checked){
        let givenNum = document.getElementById("assignmentToEdit").value
        let indexNum = givenNum - 1
        json["assignmentNumber"] = indexNum;

        const body = JSON.stringify( json )

        fetch( '/edit', {
            method:'POST',
            headers: { 'Content-Type': 'application/json'},
            body 
        })
        .then( function() {
            fetch( '/refresh', {
                method:'POST', 
            })
            .then( function( response ) {
                return response.json()
            }).then(function(data){
                console.log(data)
                buildTable(data)
            })
        })
    }else{
        const body = JSON.stringify( json )

        fetch( '/add', {
            method:'POST',
            headers: { 'Content-Type': 'application/json'},
            body 
        })
        .then( function() {
            fetch( '/refresh', {
                method:'POST', 
            })
            .then( function( response ) {
                return response.json()
            }).then(function(data){
                console.log(data)
                buildTable(data)
            })
        })
    }

    

    

    return false
}

function doneAssignment(num){
    const json = {}
    json["removeAssignment"] = num

    const body = JSON.stringify(json)

    fetch( '/remove', {
        method:'POST',
        headers: { 'Content-Type': 'application/json'},
        body 
    })
    .then( function() {
        fetch( '/refresh', {
            method:'POST', 
        })
        .then( function( response ) {
            return response.json()
        }).then(function(data){
            console.log(data)
            buildTable(data)
        })
    })
}



function buildTable(data){
    document.getElementById('assignmentTableBody').innerHTML=""; //clear table body only, will repopulate with fresh data

    for(let i = 0; i < data.length; i++){
        let newRow = document.createElement('tr');

        let newData = document.createElement('td');
        newData.append(i+1);
        newRow.append(newData);

        let courseName = document.createTextNode(data[i].courseName)
        newData = document.createElement('td');
        newData.append(courseName);
        newRow.append(newData);

        let assignmentName = document.createTextNode(data[i].assignmentName) 
        newData = document.createElement('td');
        newData.append(assignmentName);
        newRow.append(newData);

        let rawDueDate = data[i].dueDate;
        let dateObj = new Date(rawDueDate)
        let dueDate = document.createTextNode(dateObj.toLocaleString('en-US')); 
        newData = document.createElement('td');
        newData.append(dueDate);
        newRow.append(newData);

        // let daysLeft = document.createTextNode(data[i].daysLeft) 
        // newData = document.createElement('td');
        // newData.append(daysLeft);
        // newRow.append(newData);

        let submissionType = document.createTextNode(data[i].submissionType) 
        newData = document.createElement('td');
        newData.append(submissionType);
        newRow.append(newData);

        let description = document.createTextNode(data[i].description) 
        newData = document.createElement('td');
        newData.append(description);
        newRow.append(newData);

        let turnedIn = document.createElement('button');
        turnedIn.setAttribute("type", "button")
        turnedIn.onclick = () => {this.doneAssignment(i)}
        turnedIn.innerHTML = "Done!"
        turnedIn.id = "turnedInButton" + i;
        newData = document.createElement('td');
        newData.append(turnedIn);
        newRow.append(newData);

        let tableBody = document.getElementById('assignmentTableBody');
        tableBody.append(newRow);

    }
}

function radioToggle(){
    if (document.getElementById('editCheck').checked){
        document.getElementById('ifEdit').style.display = 'block';
    }else{
        document.getElementById('ifEdit').style.display = 'none';
    }
}

window.onload = function() {
    const submitButton = document.getElementById( 'formSubmit' )
    submitButton.onclick = submit
    fetch( '/refresh', {
        method:'POST', 
    })
    .then( function( response ) {
        return response.json()
    }).then(function(data){
        console.log(data)
        buildTable(data)
    })
}

