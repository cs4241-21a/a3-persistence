const submit = function( e ) {
  // prevent default form action from being carried out
  e.preventDefault()

  const todoInput = document.querySelector( '#todo' )
  const dayInput = document.querySelector( '#day' )
  const priority = document.querySelector('#priority')
 // const difficulty = document.querySelector('#difficulty')
  
        json = { todo: todoInput.value, 
                  day: dayInput.value, 
                  priority: priority.value, 
                  }
        body = JSON.stringify( json )



  fetch( '/submit', {
    method:'POST',
    body 
  })
  .then( function( response ) {
      return response.json()
  })
  .then(function(json){
      console.log(json)
      document.getElementById('dataTable').remove()
      createTable(json)
  });

  return false
}

window.onload = function() {
  const button = document.querySelector( 'button' )
  button.onclick = submit
}

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