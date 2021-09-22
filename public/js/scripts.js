function generateTable() {
  fetch('/table', {
    method: 'POST',
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
    'Date',
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
    if (title === 'Hotel Name' || title === 'Hotel Location') {
      th.classList.add('title-field');
    } else {
      th.classList.add('number-button-field');
    }
    th.appendChild(headerText);
    headerRow.appendChild(th);
  }
  // Adding rows of data to the table
  for (let element of data) {
    let row = tBody.insertRow();
    for (let key of Object.keys(data[0])) {
      if (key !== '_id' && key !== 'creator') {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }

    // --------------------- Edit Button Code Below ---------------------

    let editButtonCell = row.insertCell();
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-warning';
    const editBtnText = 'Edit';
    editBtn.innerHTML = editBtnText;
    editBtn.onclick = () => {
      document.querySelector('#hotel-name').value = element.hotel;
      document.querySelector('#hotel-location').value = element.location;
      document.querySelector('#start-date').value = element.startdate;
      document.querySelector('#cleanliness-score').value = element.cleanliness;
      document.querySelector('#service-score').value = element.service;
      document.querySelector('#amenity-score').value = element.amenity;
      const saveBtn = document.querySelector('#Submit-Button');
      saveBtn.innerHTML = 'Save Changes';
      saveBtn.onclick = (e) => {
        e.preventDefault();
        const hotelName = document.querySelector('#hotel-name'),
          hotelLocation = document.querySelector('#hotel-location'),
          startdate = document.querySelector('#start-date'),
          cleanlinessScore = document.querySelector('#cleanliness-score'),
          serviceScore = document.querySelector('#service-score'),
          amenityScore = document.querySelector('#amenity-score'),
          json = {
            id: element._id,
            hotel: hotelName.value,
            location: hotelLocation.value,
            startdate: startdate.value,
            cleanliness: Number(cleanlinessScore.value),
            service: Number(serviceScore.value),
            amenity: Number(amenityScore.value),
          },
          body = JSON.stringify(json);
        fetch('/edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
    deleteBtn.className = 'btn btn-danger';
    const deleteBtnText = 'Delete';
    deleteBtn.innerHTML = deleteBtnText;
    deleteBtn.onclick = () => {
      resetForm();
      const formBtn = document.querySelector('#Submit-Button');
      formBtn.onclick = submit;
      formBtn.innerHTML = 'Submit Review';
      fetch('/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: element._id }),
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
  table.classList.add(
    'table',
    'table-bordered',
    'border-dark',
    'align-middle',
    'table-responsive',
    'm-4'
  );
}

const submit = function (e) {
  // prevent default form action from being carried out
  e.preventDefault();

  const hotelName = document.querySelector('#hotel-name'),
    hotelLocation = document.querySelector('#hotel-location'),
    startdate = document.querySelector('#start-date'),
    cleanlinessScore = document.querySelector('#cleanliness-score'),
    serviceScore = document.querySelector('#service-score'),
    amenityScore = document.querySelector('#amenity-score'),
    json = {
      hotel: hotelName.value,
      location: hotelLocation.value,
      startdate: startdate.value,
      cleanliness: Number(cleanlinessScore.value),
      service: Number(serviceScore.value),
      amenity: Number(amenityScore.value),
    },
    body = JSON.stringify(json);

  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

function todaysDate() {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1; // 0 is January
  let day = d.getDate();

  if (day < 10) {
    day = '0' + dd;
  }

  if (month < 10) {
    month = '0' + month;
  }
  return `${year}-${month}-${day}`;
}

window.onload = function () {
  document.querySelector('#start-date').setAttribute('max', todaysDate());
  generateTable();
  const button = document.querySelector('#Submit-Button');
  button.onclick = submit;
};

function resetForm() {
  document.querySelector('form').reset();
}
