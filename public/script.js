const todoInput = document.querySelector( '#todo' )
const dayInput = document.querySelector( '#day' )
const difficultyInput = document.querySelector('#difficulty')

const usernameInput = document.querySelector('#username')
const passwordInput = document.querySelector('#password')

const submit = function( ) {
  // prevent default form action from being carried out
  //e.preventDefault()
  
        json = { todo: todoInput.value, 
                  day: dayInput.value, 
                  difficulty: difficultyInput.value,
                  type: 'todo',
                  user: null
                  }
        body = JSON.stringify( json )

  fetch( '/submit', {
    method:'POST',
    body:JSON.stringify({todo:todoInput.value, day:dayInput.value, difficulty:difficultyInput.value, type:'todo', user:null}),
    headers: {
        'Content-Type': 'application/json'
    }
  })
  .then( function( response ) {
      return response.json()
  })
  .then(function(json){
      console.log(json)
      populateTable(json)
  });

  return false
}

const deleteButton = function(row){
    // window.alert(row._id)
 
    json = { todo: todoInput.value, 
             day: dayInput.value, 
             difficulty: difficultyInput.value,
             type: 'todo' ,
             _id: row._id,
             user:null 
     }
     body = JSON.stringify( json )
 
     fetch( '/delete', {
         method:'POST',
         body:JSON.stringify({todo:row.todo, day:row.day, difficulty: row.difficulty, type: 'todo', _id:row._id, user:null}),
         headers: {
             'Content-Type': 'application/json'
         }
       })
       .then( function( response ) {
           return response.json()
       })
       .then(function(json){
           //console.log(json)
           populateTable(json)
       });
 }

const updateButton = function(row){
    json = { todo: todoInput.value, 
        day: dayInput.value, 
        difficulty: difficultyInput.value,
        type: 'todo', 
        _id: row._id,
        user:null 
}
body = JSON.stringify( json )

fetch( '/update', {
    method:'POST',
    body:JSON.stringify({todo:todoInput.value, day:dayInput.value, difficulty:difficultyInput.value, type: 'todo', _id:row._id,user:null}),
    headers: {
        'Content-Type': 'application/json'
    }
  })
  .then( function( response ) {
      return response.json()
  })
  .then(function(json){
      //console.log(json)
      populateTable(json)
  });
}

const populateTable = function(json){

    const tableDeleter = function(day){
        let table = document.getElementById(day);
        let rowCount = table.rows.length;
        for (let count = 1; count < rowCount; count++) {
            table.deleteRow(1);
        }
    }

    json = { todo: todoInput.value, 
        day: dayInput.value, 
        difficulty: difficultyInput.value,
        type: 'todo',
        user: null 
        }
        body = JSON.stringify( json )

    fetch( '/loadTable', {
        method:'POST',
        body:JSON.stringify({todo:todoInput.value, day:dayInput.value, difficulty:difficultyInput.value, type:'todo', user:null}),
        headers: {
            'Content-Type': 'application/json'
        }
      })
        .then(function(response){
            return response.json()
        })
            .then(function(json){

                let tableItems = []

                for(let count = 1; count < json.length; count++){
                    if(json[count].type === 'todo' && json[count].user === json[0]){
                        tableItems.push(json[count])
                    }
                }

                tableDeleter('Sunday')
                tableDeleter('Monday')
                tableDeleter('Tuesday')
                tableDeleter('Wednesday')
                tableDeleter('Thursday')
                tableDeleter('Friday')
                tableDeleter('Saturday')
                
                for(let count = 0; count < tableItems.length; count++){
                    let tr = document.createElement('tr')
                    let day = tableItems[count].day
                    let table = document.getElementById(day)
                    let td = document.createElement('td')
                    let item = document.createTextNode(tableItems[count].todo)
                    td.appendChild(item)
                    tr.appendChild(td)

                    td = document.createElement('td')
                    item = document.createTextNode(tableItems[count].difficulty)
                    td.appendChild(item)
                    tr.appendChild(td)

                    td = document.createElement('td')
                    item = document.createElement('button')
                    item.appendChild(document.createTextNode('UPDATE'))
                    td.appendChild(item)
                    tr.appendChild(td)

                    item.onclick = function() {updateButton(tableItems[count])}

                    td = document.createElement('td')
                    item = document.createElement('button')
                    item.appendChild(document.createTextNode('DELETE'))
                    td.appendChild(item)
                    tr.appendChild(td)

                    item.onclick = function() {deleteButton(tableItems[count])}

                    table.appendChild(tr)
                }
            })
}

window.onload = function() {
    populateTable()
    const submitButton = document.querySelector( '#submitButton' )
    submitButton.onclick = submit
}