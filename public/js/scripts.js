let arr = [];
let editObject = 'unknown';
let getRowIndex;

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    //generates random id;
    let randID = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    newID = randID();

    let name = document.getElementById( 'yourname' ),
        order = document.getElementById('order'),
        dist = document.getElementById('distance'),
          json = { yourname: name.value, yourorder: order.value, distance: dist.value, _id: newID},
          body = JSON.stringify( json );

    if(name.value === ''){
      alert('Please do not leave name field blank')
    }
    else if(order.value === ''){
      alert('Please do not leave order field blank')
    }
    else{
      fetch( '/add', {
        method:'POST',
        body,
        headers:{
            'Content-type':'application/json'
        }
      })
      .then( response => response.text())
      .then( text => {
        arr.push(JSON.parse(text));
        newData();
      })
    }
    return false
  }

  window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit

    var btn = document.getElementById('update_button')
    btn.style.visibility = 'hidden'

    savedData();
  }

  function newData(){
    const d = new Date();
    let index = arr.length - 1;

    let table = document.getElementById('dataTable');
    let newRow = table.insertRow(-1);

    let nameCell = newRow.insertCell(0);
    let timeCell = newRow.insertCell(1);
    let orderCell = newRow.insertCell(2);
    let distanceCell = newRow.insertCell(3);
    let dropTimeCell = newRow.insertCell(4);
    let deleteCell = newRow.insertCell(5);
    let editCell = newRow.insertCell(6)
    
    nameCell.innerHTML = arr[index].yourname;
    timeCell.innerHTML = arr[index].time;
    orderCell.innerHTML = arr[index].yourorder;
    distanceCell.innerHTML = arr[index].distance;
    dropTimeCell.innerHTML = arr[index].dropTime;
    deleteCell.innerHTML = '<button onclick="remove(this)">Remove</button>';
    editCell.innerHTML = '<button class="edit_button" onclick="edit(this)">Edit</button>';
   }

   function getTime(date){
      let hours;
      if(date.getHours() > 12){
        hours = date.getHours() - 12;
      }
      else{
        hours = date.getHours();
      }

      let minutes = date.getMinutes();
      if(minutes === 0){
        return hours + ":00";
      }
      else if(minutes < 10){
        return hours + ":0" + minutes;
      }
      else{
        return hours + ":" + minutes;
      }
      
   }

   function remove(cell){
    let index = cell.parentNode.parentNode.rowIndex;
    console.log(index);
    
    fetch( '/delete', {
        method:'POST',
        body: JSON.stringify(arr[index - 1]),
        headers:{
            'Content-type':'application/json'
        }
      })
      .then( response => response.text())
      .then( text => {
        const table = document.getElementById('dataTable');
        table.deleteRow(index);
        arr.splice(index - 1, 1);
      })
   }

   function edit(cell){
    let index = cell.parentNode.parentNode.rowIndex;

    let form = document.querySelector('form');
    form.elements['yourname'].value = arr[index - 1].yourname;
    form.elements['order'].value = arr[index - 1].yourorder;
    form.elements['distance'].value = arr[index - 1].distance;

    var btn = document.getElementById('update_button');
    btn.style.visibility = 'visible'
    
    editObject = arr[index-1];
    getRowIndex = index;
   }

   function updateCell(){
    const table = document.getElementById('dataTable');
    let form = document.querySelector('form');

    let name = form.elements['yourname'].value,
        order = form.elements['order'].value,
        dist = form.elements['distance'].value,
            json = { yourname: name, yourorder: order, distance: dist, _id: editObject._id },
            body = JSON.stringify(json);

    fetch('/update',{
        method:'POST',
        body,
        headers:{
            'Content-type':'application/json'
        }
    })
    .then( response => response.text())
    .then( text => {
        textParsed = JSON.parse(text);
        
        //change in table
        table.rows[getRowIndex].cells[0].innerHTML = textParsed.yourname;
        table.rows[getRowIndex].cells[2].innerHTML = textParsed.yourorder;
        table.rows[getRowIndex].cells[3].innerHTML = textParsed.distance;
        table.rows[getRowIndex].cells[4].innerHTML = textParsed.dropTime;

        //change in data arr
        arr[getRowIndex - 1].yourname = textParsed.yourname;
        arr[getRowIndex - 1].yourorder = textParsed.yourorder;
        arr[getRowIndex - 1].distance = textParsed.distance;
        arr[getRowIndex - 1].dropTime = textParsed.dropTime;
      })

        //make button invisible again
        var btn = document.getElementById('update_button');
        btn.style.visibility = 'hidden'

   }

    function savedData(){
       fetch('/saved', {
            method:'POST',
            body: JSON.stringify({userID: ''}),
            headers:{
                'Content-type':'application/json'
            }
       })
       .then(response => response.text())
       .then(text =>{
            const found = JSON.parse(text);

            for(let i = 0; i < found.length; i++){
                arr[i] = found[i];
                let table = document.getElementById('dataTable');
                    let newRow = table.insertRow(-1);

                    let nameCell = newRow.insertCell(0);
                    let timeCell = newRow.insertCell(1);
                    let orderCell = newRow.insertCell(2);
                    let distanceCell = newRow.insertCell(3);
                    let dropTimeCell = newRow.insertCell(4);
                    let deleteCell = newRow.insertCell(5);
                    let editCell = newRow.insertCell(6)
    
                    nameCell.innerHTML = found[i].yourname;
                    timeCell.innerHTML = found[i].time;
                    orderCell.innerHTML = found[i].yourorder;
                    distanceCell.innerHTML = found[i].distance;
                    dropTimeCell.innerHTML = found[i].dropTime;
                    deleteCell.innerHTML = '<button onclick="remove(this)">Remove</button>';
                    editCell.innerHTML = '<button class="edit_button" onclick="edit(this)">Edit</button>';
            }
       })
    }