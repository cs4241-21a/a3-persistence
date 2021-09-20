// Add some Javascript code here, to run on the front end.

//const { response } = require("express")

console.log("Welcome to assignment 2!")
var appdata = [0]


//Converts user given height in feet and inches to only inches
const FeetToInches = function(){
    const feet = document.querySelector('#feet').value
    const inches = document.querySelector('#inches').value
    const height = 12*parseInt(feet)+ parseInt(inches)
    return height
}

//Calculates the BMI based on height in inches and weight
const calculateBMI = function(){
  const height = FeetToInches()
  const weight = document.querySelector('#weight').value
  const bmi = (parseFloat(weight)/height/height)*703
  return bmi.toFixed(1)
}

//Finds the correct weight status based on BMI
const weightStatus = function(){
    var bmi = calculateBMI()
    var status = ""
    if(bmi < 18.5){
        status = "Underweight"
    }
    if(bmi >= 18.5 && bmi <= 24.9){
        status = "Healthy"
    }
    if(bmi >= 25.0 && bmi <= 29.9 ){
        status = "Overweight"
    }
    if(bmi >= 30.0){
        status = "Obese"
    }
    return status;
}

//Creates initial table with headings
const createTable = function(){
  const tbl = document.querySelector('#results')
  const t1 = document.createElement('th')
  const t2 = document.createElement('th')
  const t3 = document.createElement('th')
  const t4 = document.createElement('th')
  const t5 = document.createElement('th')
  const t6 = document.createElement('th')
  const t7 = document.createElement('th')
  const t8 = document.createElement('th')
  const row = document.createElement('tr')
  t1.innerText = "Name"
  t2.innerText = "Height(feet)"
  t3.innerText = "Height(inches)"
  t4.innerText = "Weight"
  t5.innerText = "BMI"
  t6.innerText = "Weight Status"
  t7.innerText = "Edit"
  t8.innerText = "Delete"
  row.appendChild(t1)
  row.appendChild(t2)
  row.appendChild(t3)
  row.appendChild(t4)
  row.appendChild(t5)
  row.appendChild(t6)
  row.appendChild(t7)
  row.appendChild(t8)
  tbl.appendChild(row)
}

createTable()

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    const a = calculateBMI()
    const b = weightStatus()
    const input = document.querySelector( '#yourname'),
    input2 = document.querySelector('#feet'),
    input3 = document.querySelector('#inches'),
    input4 = document.querySelector('#weight'),
          json = { yourname: input.value, feet:parseInt(input2.value), inches:parseInt(input3.value), weight:parseInt(input4.value), bmi:parseInt(a), status:b },
          body = JSON.stringify( json )
    fetch( '/add', {
      method:'POST',
      body,
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => response.json()) 
     //function(json)
    .then(function(json){
      //console.log(json.insertedId)
      var itemid = json.insertedId
      appdata.push({_id: itemid})
    })
    .then(function(data){
      //console.log(json)
      const tbl = document.querySelector('#results')
      const e1 = document.createElement('td')
      const e2 = document.createElement('td')
      const e3 = document.createElement('td')
      const e4 = document.createElement('td')
      const e5 = document.createElement('td')
      const e6 = document.createElement('td')
      const row = document.createElement('tr')
      const calc = document.querySelector('#bmidisplay')
      const e7 = document.createElement('p')
      const e8 = document.createElement('td')
      const e9 = document.createElement('td')
      const e10 = document.createElement('p')

      e1.id = 'n'
      e2.id = 'f'
      e3.id = 'i'
      e4.id = 'w'
      e5.id = 'b'
      e6.id = 's'
      e1.innerText = json.yourname
      e2.innerText = json.feet
      e3.innerText = json.inches
      e4.innerText = json.weight
      e5.innerText = calculateBMI()
      e6.innerText = weightStatus()
      e7.innerText = ''
      e8.innerHTML = '<button id= "edit" onclick = "editRow(this.parentNode.parentNode)">Edit</button>'
      e9.innerHTML = '<button id= "delete" onclick = "removeRow(this.parentNode.parentNode)">Delete</button>'
      e10.innerHTML = calculateBMI()

      row.appendChild(e1)
      row.appendChild(e2)
      row.appendChild(e3)
      row.appendChild(e4)
      row.appendChild(e5)
      row.appendChild(e6)
      row.appendChild(e8)
      row.appendChild(e9)
      tbl.appendChild(row)
      calc.appendChild(e7)

      calc.childNodes[0].innerText = calculateBMI()
     // console.log(collection.findOne(ObjectId('appdata[0]')))
      //appdata.push(data)
      // console.log("Row was added. Updated data: ")
      //console.log(appdata)
      
    })
    
    return false
  }

  constgetData = function(){
    fetch('/', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(json => console.log(json))
    //use body parser?
  }

  window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit
    constgetData()
  }

  //Function to delete a row
  function removeRow(row){
    const button = document.getElementById('delete')
    button.onclick =
      fetch('/remove', {
        method:'POST',
        body:JSON.stringify(appdata[row.rowIndex]),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        appdata.splice((row.rowIndex), 1)
        row.remove()
      })
    
    // var bttn = document.getElementById('delete')
    // var tbl = document.querySelector('#results')
    // appdata.splice((aButton.parentNode.parentNode.rowIndex)-1, 1)
    // tbl.deleteRow(aButton.parentNode.parentNode.rowIndex)

    //  console.log("Row was deleted. Updated data: ")
    //  console.log(appdata)
  }

  
  function editRow(row){
    
    const button = document.getElementById('edit')
    // var tbl = document.querySelector('#results')
    var name = document.querySelector('#yourname')
    var ft = document.querySelector('#feet')
    var inc = document.querySelector('#inches')
    var weight = document.querySelector('#weight')

    name.value = row.childNodes[0].innerText
    ft.value = row.childNodes[1].innerText
    inc.value = row.childNodes[2].innerText
    weight.value = row.childNodes[3].innerText

    button.innerHTML = 'Save'

    button.onclick =
    fetch('/update', {
      method:'POST',
      body:JSON.stringify(appdata[row.rowIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
      .then(json => {
        console.log(json)
      row.childNodes[0].innerText = name.value
      row.childNodes[1].innerText = ft.value 
      row.childNodes[2].innerText = inc.value
      row.childNodes[3].innerText = weight.value
      row.childNodes[4].innerText = calculateBMI()
      row.childNodes[5].innerText = weightStatus()
      })

      // appdata[(aButton.parentNode.parentNode.rowIndex)-1].yourname = name.value
      // appdata[(aButton.parentNode.parentNode.rowIndex)-1].feet = ft.value
      // appdata[(aButton.parentNode.parentNode.rowIndex)-1].inches = inc.value
      // appdata[(aButton.parentNode.parentNode.rowIndex)-1].weight = weight.value
      // appdata[(aButton.parentNode.parentNode.rowIndex)-1].bmi = calculateBMI()
      // appdata[(aButton.parentNode.parentNode.rowIndex)-1].weightStatus = weightStatus() 
      button.innerHTML = 'Edit'
      console.log("Row was edited. Updated data: ")
      console.log(appdata)
    
  }

