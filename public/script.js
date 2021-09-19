const todoInput = document.querySelector( '#todo' )
const dayInput = document.querySelector( '#day' )
const difficultyInput = document.querySelector('#difficulty')

const submit = function( e ) {
  // prevent default form action from being carried out
  e.preventDefault()
  
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
      let table = null
      let day = json[0].day
      let tr = document.createElement('tr')

    table = document.getElementById(day.toString())
    let td = document.createElement('td')
    let item = document.createTextNode(json[0].todo)
    td.appendChild(item)
    tr.appendChild(td)

    td = document.createElement('td')
    item = document.createTextNode(json[0].difficulty)
    td.appendChild(item)
    tr.appendChild(td)

    table.appendChild(tr)
  });

  return false
}

window.onload = function() {

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

                    table.appendChild(tr)
                }
                

    
      })


  const button = document.querySelector( 'button' )
  button.onclick = submit
}
/*
function createTable(data) {
  let table = document.createElement('table')
  let tr = document.createElement('tr')
  let tableHeaders = ['Day of the Week', 'Items/Difficulties...']

  for (let count = 0; count < tableHeaders.length; count++) {
    let header = document.createTextNode(tableHeaders[count])
    let th = document.createElement('th')
    th.appendChild(header)
    tr.appendChild(th)
  }
  table.appendChild(tr)
  tr = document.createElement('tr');

  function populateDay(day){
    let dayOfWeek = document.createTextNode(day)
    let td = document.createElement('td')

    td.appendChild(dayOfWeek)
    tr.appendChild(td)

    for (let count = 0; count < data.length; count++){
      if(data[count].day === day){
        let item = document.createTextNode('Todo: '+data[count].todo +', Raw Difficulty: '+ data[count].priority + ', Adjusted Difficulty: '+data[count].difficulty)
        let td = document.createElement('td')
        td.appendChild(item)
        tr.appendChild(td)
      }
  }
  table.appendChild(tr);
  tr = document.createElement('tr');

}
  table.id = 'dataTable'

populateDay("Sunday")
populateDay("Monday")
populateDay("Tuesday")
populateDay("Wednesday")
populateDay("Thursday")
populateDay("Friday")
populateDay("Saturday")

document.body.appendChild(table)

}
*/