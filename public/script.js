console.log("Hello 🌎");

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    console.log("Submit")

    const input1 = document.querySelector( '#descrip' ),
          input2 = document.querySelector( '#expectedTime' ),
          input3 = document.querySelector( '#dueDate' ),
          prompt = document.querySelector("#prompt"),
          json = { descrip: input1.value,
                   expectedTime: input2.value,
                   dueDate: input3.value },
          body = JSON.stringify( json )

    fetch( '/submit', {
      method:'POST',
      body,
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then( res => res.json() )
    .then( json => {
      console.log("WE MADE IT BOYS")
    })
}

window.onload = function() {
    const button = document.querySelector( 'button' )
    if(button !== null)
      button.onclick = submit
  
    const taskTable = document.querySelector('#taskTable')
    if(taskTable !== null){
      fetch("/tasks")
      .then(res => res.json())
      .then(function(json){
        console.log("We got tasks")
        for(let i = 1; i <= json.length; i++){
          if(i < taskTable.rows.length){
            taskTable.rows[i].cells[0].innerHTML = json[i-1].descrip
            taskTable.rows[i].cells[1].innerHTML = json[i-1].expectedTime
            taskTable.rows[i].cells[2].innerHTML = json[i-1].dueDate
            taskTable.rows[i].cells[3].innerHTML = json[i-1].DueDate
          } else {
            let newRow = taskTable.insertRow(i)

            newRow.insertCell(0)
            newRow.insertCell(1)
            newRow.insertCell(2)
            newRow.insertCell(3)

            newRow.cells[0].innerHTML = json[i-1].descrip
            newRow.cells[1].innerHTML = json[i-1].expectedTime
            newRow.cells[2].innerHTML = json[i-1].dueDate
            newRow.cells[3].innerHTML = json[i-1].DueDate
          }
        }
      })
    }
}