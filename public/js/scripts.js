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

    const body = JSON.stringify( json )

    fetch( '/submit', {
        method:'POST',
        body 
    })
    .then( function( response ) {
        return response.json()
    }).then(function(data){
        console.log(data)
        buildTable(data)
    })

    

    return false
}

function doneAssignment(num){
    const json = {}
    json["removeAssignment"] = num

    const body = JSON.stringify(json)

    fetch( '/submit', {
        method:'POST',
        body 
    })
    .then( function( response ) {
        return response.json()
    }).then(function(data){
        console.log(data)
        buildTable(data)
    })
}



function buildTable(data){
    document.getElementById('assignmentTableBody').innerHTML=""; //clear table body only, will repopulate with fresh data

    for(let i = 0; i < data.length; i++){
        let newRow = document.createElement('tr');

        let courseName = document.createTextNode(data[i].courseName)
        let newData = document.createElement('td');
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

        let daysLeft = document.createTextNode(data[i].daysLeft) 
        newData = document.createElement('td');
        newData.append(daysLeft);
        newRow.append(newData);

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

window.onload = function() {
    const submitButton = document.getElementById( 'formSubmit' )
    submitButton.onclick = submit
}