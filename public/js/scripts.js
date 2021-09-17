let id = null;

function generateTable() {
  
  fetch('/table', {
    method: 'POST',
    body: JSON.stringify({userid: id}),
    headers: {'Content-Type': 'application/json'}
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      refreshTable(json);
    });
}

function refreshTable(data) {
  let table = document.querySelector('table');
  if (table === null) {
    table = document.createElement('table');
  }
  let tBody = table.createTBody();
  let tHead = table.createTHead();
  let headerRow = tHead.insertRow();
  let tableColumns = [
    'Hotel Name',
    'Hotel Location',
    'Cleanliness',
    'Service',
    'Amenities',
    'Overall Score',
    'Edit',
    'Delete',
  ];
  // Adding table headers 
  for (let title of tableColumns) {
    let th = document.createElement('th');
    let headerText = document.createTextNode(title);
    if (title === 'Hotel Name' || title === 'Hotel Location'){
      th.classList.add('title-field');
    }
    else {
      th.classList.add('number-button-field')
    }
    th.appendChild(headerText);
    headerRow.appendChild(th);
  }
  // Adding rows of data to the table
  for (let element of data) {
    let row = tBody.insertRow();
    for (let key of Object.keys(data[0])) {
      if(key !== '_id' && key !== 'creator'){
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
        if(key === 'hotel' || key === 'location'){
          cell.classList.add('title-field');
        }
        else{
          cell.classList.add('number-button-field')
        }
      }
    }

    // --------------------- Edit Button Code Below ---------------------

    let editButtonCell = row.insertCell();
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-button')
    const editBtnText = 'Edit';
    editBtn.innerHTML = editBtnText;
    editBtn.onclick = () => {
      document.querySelector('#hotel-name').value = element.hotel;
      document.querySelector('#hotel-location').value = element.location;
      document.querySelector('#cleanliness-score').value = element.cleanliness;
      document.querySelector('#service-score').value = element.service;
      document.querySelector('#amenity-score').value = element.amenity;
      const saveBtn = document.querySelector('#Submit-Button');
      saveBtn.innerHTML = 'Save Changes';
      saveBtn.onclick = (e) => {
        e.preventDefault();
        const hotelName = document.querySelector('#hotel-name'),
          hotelLocation = document.querySelector('#hotel-location'),
          cleanlinessScore = document.querySelector('#cleanliness-score'),
          serviceScore = document.querySelector('#service-score'),
          amenityScore = document.querySelector('#amenity-score'),
          json = {
            id: element._id,
            userid: id,
            hotel: hotelName.value,
            location: hotelLocation.value,
            cleanliness: Number(cleanlinessScore.value),
            service: Number(serviceScore.value),
            amenity: Number(amenityScore.value),
          },
          body = JSON.stringify(json);
        fetch('/edit', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body,
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (json) {
            let table = document.querySelector('table');
            table.remove();
            refreshTable(json);
            resetForm();
            saveBtn.innerHTML = 'Submit Review';
            saveBtn.onclick = submit;
          });
      };
    };
    editButtonCell.appendChild(editBtn);

    // --------------------- Delete Button Code Below ---------------------

    let deleteButtonCell = row.insertCell();
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-button')
    const deleteBtnText = 'Delete';
    deleteBtn.innerHTML = deleteBtnText;
    deleteBtn.onclick = () => {
      resetForm();
      const formBtn = document.querySelector('#Submit-Button');
      formBtn.onclick = submit;
      formBtn.innerHTML = 'Submit Review';
      fetch('/delete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: element._id, userid:id}),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          let table = document.querySelector('table');
          table.remove();
          refreshTable(json);
        });
    };
    deleteButtonCell.appendChild(deleteBtn);
  }
  document.body.appendChild(table);
}

const submit = function (e) {
  // prevent default form action from being carried out
  e.preventDefault();

  const hotelName = document.querySelector('#hotel-name'),
  hotelLocation = document.querySelector('#hotel-location'),
  cleanlinessScore = document.querySelector('#cleanliness-score'),
  serviceScore = document.querySelector('#service-score'),
  amenityScore = document.querySelector('#amenity-score'),
    json = {
      userid: id,
      hotel: hotelName.value,
      location: hotelLocation.value,
      cleanliness: Number(cleanlinessScore.value),
      service: Number(serviceScore.value),
      amenity: Number(amenityScore.value),
    },
    body = JSON.stringify(json);

  fetch('/submit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      let table = document.querySelector('table');
      table.remove();
      refreshTable(json);
      resetForm();
    });

  return false;
};

window.onload = function () {
  id = window.sessionStorage.getItem('userid')
  document.querySelector('#title').innerHTML = `Welcome, ${window.sessionStorage.getItem('username')}!`
  generateTable();
  const button = document.querySelector('#Submit-Button');
  button.onclick = submit;
};

function resetForm() {
  document.querySelector('form').reset();
}
