// Add some Javascript code here, to run on the front end.

//const { monitorEventLoopDelay } = require("perf_hooks")

console.log("Welcome to assignment 3!")

window.onload = function() {
    const button = document.getElementById( 'submitAdd' )
    button.onclick = submit
    //const loginButton = document.getElementById( 'loginButton' )
    //loginButton.onclick = login
    initTable()
}

const initTable = function(){
    fetch('/getData', {
        method:'GET'
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        const text = document.getElementById( 'dataTable' )
        const charCount = document.getElementById( 'characterCount' )
        charCount.innerHTML = 'Number of Characters: ' + Object.values(data).length
        createTable("dataTable", data)

    })
}

function remove(id) {

  fetch( '/delete', {
      method: 'POST',
      body: JSON.stringify({id: id}),
      headers:{
          "Content-Type": "application/json"
      }
    })
    .then( function( response ) {
        console.log( response )
        initTable()
})
}

function edit(id) {
    const name = document.getElementById('charName')
    const element = document.getElementById('elmt')
    const level = document.getElementById('lvl')

    const json = { id: id,
                  name: name.value,
            element: element.value,
            level: level.value
         }
         body = JSON.stringify( json )
        console.log('hello' + name.value)
    fetch( '/update', {
                method:'POST',
                body,
                headers: {
                    "Content-Type":"application/json"
                }
      })
      .then( function( response ) {
                // do something with the reponse 
                console.log( response )
                return response.json()
              })
              .then( function( json ){
                  initTable()
              }
  )
  }

const createTable = function(id, data) {
    
        let table = document.getElementById("dataTable")
        for(var i = table.rows.length - 1; i > 0; i--)
            table.deleteRow(i)

        let row = 1
            data.map( function ( item ){
                let repRow = table.insertRow(-1)
                repRow.classList += "itemRow"

                let columnNum = table.rows[0].cells.length

                console.log(item)

                for(let i=0; i<columnNum; i++){
                    let newCell = document.createElement("td")
                    let value = Object.values(item)
                    let newText

                    if (i == 0)
                        newText = document.createTextNode(row)
                    else if ( i == columnNum - 1) {
                        newText = document.createElement('button')
                        newText.innerHTML = "Alter"
                        newText.classList += "btn btn-primary changeButton"
                        newText.onclick = function() {
                            $("#alterInfo").modal('show')
                            deleteBtn.onclick = function(){
                                remove(item._id)
                                $("#alterInfo").modal('hide')
                            }
                            editBtn.onclick = function(){
                                edit(item._id)
                                $("#alterInfo").modal('hide')
                            }
                        }
                    }
                    else
                        newText = document.createTextNode(value[i])

                    newCell.appendChild(newText)
                    repRow.appendChild(newCell)
                }
                row++
            })
}

const login = function(){
  const password = document.getElementById( 'uname' ).value
  const username = document.getElementById('pword').value

  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({
      password: password,
      username: username
    }),
    headers:{
      "Content-Type":"application/json"
    }
  })
  .then(response => {
    return response.json()
  }) 
  .then(json => {
    if(json.worked){
      document.getElementById( 'pword' ).value = ""
      document.getElementById( 'uname' ).value = ""
      window.location.href = '/main.html'
    }
    else {
      document.getElementById( 'pword' ).value = ""
      document.getElementById( 'uname' ).value = ""
      console.log('Wrong info')
      
    }
    initTable()
  })
}


function logout() {
    fetch( '/logout', {
        method:'GET',
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then( window.location.replace('/index.html'))
  initTable()
}

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const input = document.querySelector( '#name' ),
        input2 = document.querySelector( '#element' ),
        input3 = document.querySelector( '#level' )
          json = { name: input.value,
            element: input2.value,
            level: input3.value,
            modifyInput: 1
         },
          body = JSON.stringify( json )
          if(json['name']  === "" || json['level'] === "") {
              alert("Please fill in all fields.")
          } else {
            fetch( '/submit', {
                method:'POST',
                body,
                headers: {
                    "Content-Type":"application/json"
                }
              })
              .then( function( response ) {
                // do something with the reponse 
                console.log( response )
                return response.json()
              })
              .then( function( json ){
                  initTable()
                  console.log("Created ID: " + json.insertedId)
              })
          }

    return false
  }

