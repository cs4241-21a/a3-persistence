const todoInput = document.querySelector( '#todo' )
const dayInput = document.querySelector( '#day' )
const difficultyInput = document.querySelector('#difficulty')

const deleteButton = function(row){
   // window.alert(row._id)

   json = { todo: todoInput.value, 
            day: dayInput.value, 
            difficulty: difficultyInput.value,
            _id: row._id 
    }
    body = JSON.stringify( json )

    fetch( '/delete', {
        method:'POST',
        body:JSON.stringify({todo:row.todo, day:row.day, difficulty: row.difficulty, _id:row._id}),
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


const submit = function( ) {
  // prevent default form action from being carried out
  //e.preventDefault()
  
        json = { todo: todoInput.value, 
                  day: dayInput.value, 
                  difficulty: difficultyInput.value, 
                  }
        body = JSON.stringify( json )

  fetch( '/submit', {
    method:'POST',
    body:JSON.stringify({todo:todoInput.value, day:dayInput.value, difficulty:difficultyInput.value}),
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
        }
        body = JSON.stringify( json )

    fetch( '/loadTable', {
        method:'POST',
        body:JSON.stringify({todo:todoInput.value, day:dayInput.value, difficulty:difficultyInput.value}),
        headers: {
            'Content-Type': 'application/json'
        }
      })
        .then(function(response){
            return response.json()
        })
            .then(function(json){
                tableDeleter('Sunday')
                tableDeleter('Monday')
                tableDeleter('Tuesday')
                tableDeleter('Wednesday')
                tableDeleter('Thursday')
                tableDeleter('Friday')
                tableDeleter('Saturday')
                
                for(let count = 0; count < json.length; count++){
                    let tr = document.createElement('tr')
                    let day = json[count].day.toString()
                    let table = document.getElementById(day.toString())
                    let td = document.createElement('td')
                    let item = document.createTextNode(json[count].todo)
                    td.appendChild(item)
                    tr.appendChild(td)

                    td = document.createElement('td')
                    item = document.createTextNode(json[count].difficulty)
                    td.appendChild(item)
                    tr.appendChild(td)

                    td = document.createElement('td')
                    item = document.createElement('button')
                    item.appendChild(document.createTextNode('UPDATE'))
                    td.appendChild(item)
                    tr.appendChild(td)

                    td = document.createElement('td')
                    item = document.createElement('button')
                    item.appendChild(document.createTextNode('DELETE'))
                    td.appendChild(item)
                    tr.appendChild(td)

                    item.onclick = function() {deleteButton(json[count])}

                    table.appendChild(tr)
                }
            })
}

window.onload = function() {
    populateTable()
    const button = document.querySelector( '#submitButton' )
    button.onclick = submit
}