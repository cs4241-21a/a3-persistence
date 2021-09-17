let currEdit = 1

window.onload = function() {
    const button = document.getElementById( 'submit_btn' )
    button.onclick = submit
    initData()
  }

  const initData = function(){
    fetch('/getData', {
        method:'GET'
      })
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        const text = document.getElementById( 'contact_counter' )
        text.innerHTML = 'Number of Contacts: ' + Object.values(data).length
        buildTable('dataTable', data) 
    })
  }

  const buildTable = function(tableId, data){
    let tableRef = document.getElementById(tableId)
    for(var i = tableRef.rows.length - 1; i > 0; i--)
        tableRef.deleteRow(i)


        let row = 1
    data.map( function (item){
        let newRow = tableRef.insertRow(-1)
        newRow.classList += "itemRow"
        
        
        let columnNum = tableRef.rows[0].cells.length
        

        for(let i=0; i < columnNum; i++){ 
            let newCell = newRow.insertCell(i)
            let value = Object.values(item)
            let newText 
           
            if(i == 0)
              newText = document.createTextNode(row)
            else 
            newText = document.createTextNode(value[i])

            newCell.appendChild(newText)
        }
        let edit_icon = document.createElement('td')

        edit_icon.id = row - 1

      newRow.onclick= function(){
        showEditWindow(item['_id'])
      }
      
        row++

    })

  } 

  const showEditWindow = function(id){
    fetch('/getItem', {
      method:'POST',
      body: JSON.stringify({id: id}),
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(function (response) {
      return response.json()
    })
    .then( json => {
      
      let value = Object.values(json)
          document.getElementById("editName").value = value[1]
          document.getElementById("editEmail").value = value[2]
          document.getElementById("editNumber").value = value[3]
          document.getElementById("editAge").value = value[4]
          document.getElementById("editOccupation").value = value[5]
          document.getElementById("editNotes").value = value[8]

      const delete_btn = document.getElementById('delete_btn')
      const update_btn = document.getElementById('update_btn')
      
      delete_btn.onclick = function() {
        deleteItem(id)
      }

      update_btn.onclick = function() {
        updateItem(id)
      }

      document.getElementById("popup_1").classList.toggle("active")
    })
    
  }

  function closeEdit() {
    document.getElementById("popup_1").classList.remove("active")
  }

  function updateItem(id) {
    const name = document.getElementById('editName')
    const email = document.getElementById('editEmail')
    const number = document.getElementById('editNumber')
    const notes = document.getElementById('editNotes')
    const age = document.getElementById('editAge')
    const occupation = document.getElementById('editOccupation')

    const json = {
      name: name.value,
      email: email.value,
      number: number.value,
      age: age.value,
      occupation: occupation.value,
      age_group: getAge(age.value),
      education_level: getEducationValue(age.value, occupation.value),
      notes: notes.value,
      modifyInput: id
    }

    let body = JSON.stringify(json)
    
    if (json['name'] === ""  || json['email'] === ""   || json['number'] === ""  || json['notes'] === "" || json['age'] === "" || json['occupation'] === "")
      alert("Please fill in all field before submitting!")
    else{
        fetch( '/update', {
            method:'POST',
            body,
            headers:{
              "Content-Type":"application/json"
            }
          })
          .then( function( ) {
            initData()
            closeEdit()
          })
    }
  }

function deleteItem(id){
  let confirmAction = confirm("Are you sure to delete this item?")
  if (confirmAction) {
    fetch( '/delete', {
         method:'POST',
         body: JSON.stringify({id: id}),
         headers:{
          "Content-Type":"application/json"
        }
        })
        .then( function( ) {
          initData()
          closeEdit()
        })
  }   
}

function getAge(age){
  if(age < 18 && age > 14){
    return "Teenager"
  }
  else if(age < 18){
    return "Child"
  }
  else if(age >= 18 && age <= 65){
    return "Adult"
  }
  else {
    return "Senior"
  }
}

function getEducationValue(age, occupation){
  if(occupation === "Unemployed")
    return " Never Attended"
  else if(age >= 22 && occupation !== "Student"){
    return "Graduate"
  }
  else if(age <= 14 && occupation === "Student") {
    return "Preschool"
  }
  else if(age > 14 && age <18 &&  occupation === "Student")
    return "Highschool"
  else if(age > 18 && occupation === "Working"){
    return "Highschool Graduate"
  }
  else if(age > 22 && occupation === "Student"){
    return "Graduate Program"
  }
  else if(age >= 18 && occupation === "Student"){
    return "College"
  }
  else {
    return "Never Attended"
  }
}

const inputText = document.getElementById('inptNotes')
const counter = document.getElementById('counter')

inputText.addEventListener('input', updateValue)

function updateValue(e){
    const target = e.target
    const maxLength = target.getAttribute('maxlength')
    const currentLength = target.value.length
    
    counter.innerHTML = `${currentLength}/${maxLength}`
}


const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const name = document.getElementById('inptName')
    const email = document.getElementById('inptEmail')
    const number = document.getElementById('inptNumber')
    const notes = document.getElementById('inptNotes')
    const age = document.getElementById('inptAge')
    const occupation = document.getElementById('inptOccupation')

    const json = {
        name: name.value,
        email: email.value,
        number: number.value,
        age: age.value,
        occupation: occupation.value,
        age_group: getAge(age.value),
        education_level: getEducationValue(age.value, occupation.value),
        notes: notes.value
    }

    let body = JSON.stringify(json)
    
    if (json['name'] === ""  || json['email'] === ""   || json['number'] === ""  || json['notes'] === "" || json['age'] === "" || json['occupation'] === "")
        alert("Please fill in all field before submitting!")
    
    else{
        fetch( '/submit', {
            method:'POST',
            body,
            headers:{
              "Content-Type":"application/json"
            }
          })
          .then( response => response.json() )
          .then( json => {
            document.getElementById('inptName').value = ""
            document.getElementById('inptEmail').value = ""
            document.getElementById('inptNumber').value = ""
            document.getElementById('inptNotes').value = ""
            document.getElementById('inptAge').value = ""
            document.getElementById('counter').innerHTML=""
            document.getElementById('inptOccupation').value="Student"

            addToTable(json, json._id)
          })
    }
  }

  function addToTable(json, id){
    const tableRef = document.getElementById('dataTable');

     let newRow = tableRef.insertRow(-1)
        newRow.classList += "itemRow"
        
        let columnNum = tableRef.rows[0].cells.length
        
        for(let i=0; i < columnNum; i++){ 
            let newCell = newRow.insertCell(i)
            let value = Object.values(json)
            let newText 
           
            if(i == 0)
              newText = document.createTextNode( tableRef.rows.length )
            else 
            newText = document.createTextNode(value[i])

            newCell.appendChild(newText)
        }

      newRow.onclick= function(){
        showEditWindow(id)
      }

  }

  function signOut() {
    fetch( '/logOut', {
      method:'POST',
      body: JSON.stringify({test: 1}),
      headers:{
        "Content-Type":"application/json"
      }
    })
  }

  

  




 

 