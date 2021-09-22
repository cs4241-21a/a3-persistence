let selectedRowName = ''

    const selectingRow = function(){
      var table = document.querySelector('#allEntries')
      for (let i = 1; i < table.rows.length; i++){
        //Deletes the selected row from the display table 
        table.rows[i].cells[5].onclick = function(){
          json = {nameToRemove:table.rows[i].cells[6].innerHTML}   
          table.deleteRow(this.parentElement.rowIndex)
          body = JSON.stringify(json) 
          fetch( '/deleteEntry', {
            method:'POST',
            body:body,
            headers:{ 
              "Content-Type":"application/json"
            }
          })
          .then( function( response ) {
            return response.json() 
           })
        }

        //Selecting for modifying, Populate entry fields and get unique ID
        table.rows[i].cells[0].onclick = function(){
          document.querySelector("#name").value = table.rows[i].cells[0].innerHTML
          document.querySelector("#phoneNum").value = table.rows[i].cells[1].innerHTML
          document.querySelector("#birthday").value =  table.rows[i].cells[2].innerHTML
          if(table.rows[1].cells[3].innerHTML === 'true'){
            document.querySelector("#toGift").checked = true
          }
          else{
            document.querySelector("#toGift").checked = false
          }
          selectedRowName = table.rows[i].cells[6].innerHTML
        }
      }
    }
    
  //Displays a new row with information 
  const addRow = function(entry){
    var table = document.querySelector('#allEntries')
    var row = table.insertRow()
    var cellName = row.insertCell(0)
    var cellNumber = row.insertCell(1)
    var cellBday = row.insertCell(2)
    var cellToGift = row.insertCell(3)
    var cellGiftBy = row.insertCell(4)
    var cellDelete = row.insertCell(5)
    var cellID = row.insertCell(6)

    cellName.innerHTML = entry.name
    cellNumber.innerHTML = entry.phoneNum
    cellBday.innerHTML = entry.birthday
    cellToGift.innerHTML = entry.toGift
    cellGiftBy.innerHTML = entry.giftBy
    cellDelete.innerHTML = 'Delete'
    cellDelete.classList.add('deleteBtn')
    cellID.innerHTML = entry._id
  }

  const deleteEntry = function(){
    fetch('/deleteEntry', {
      method:'POST'
    })
    .then(function(response) {
      document.querySelector('#allEntries').deleteRow(1)
    })
  }

  const submit = function( event ) {
    //Prevent default form action from being carried out
    event.preventDefault()

    const input = document.querySelector('form'),
          json = {name: input.name.value, phoneNum: input.phoneNum.value, birthday: input.birthday.value, toGift: input.toGift.checked, rowName: selectedRowName}
          body = JSON.stringify( json )

    fetch( '/submit', {
      method:'POST',
      body: body,
      headers:{ 
        "Content-Type":"application/json"
      }
    })
    .then(response => response.json())
    .then(function(jsonResponse){
      table = document.querySelector("#allEntries")
      for (let i = 1; i < table.rows.length; i++){
        if (table.rows[i].cells[6].innerHTML === selectedRowName){
          table.deleteRow(i) 
        }
      }
      selectedRowName = '' //reset
      
      addRow(jsonResponse)
    })    
  }

  window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit

    fetch('/getUserContacts', {
     method:'POST'
    })
    .then(response => response.json())
    .then(res => {
      res.forEach(element => {
        addRow(element)
      })    
    })
}