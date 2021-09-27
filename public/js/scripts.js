let itemList;
let currentShape = '';

function creatorWindowSetup() {
    document.getElementById('create-button').onclick = beginNewEntry;
    document.getElementById( 'save-btn' ).onclick = onClickSave;
    document.getElementById( 'del-btn' ).onclick = onClickDelete;
    itemList = document.getElementById('item-list');
    beginNewEntry();
}

function addListItem(shapeId, name, color) {
    const newItem = document.createElement('btn');
    newItem.className = 'col-sm-4';
    newItem.id = shapeId;
    newItem.innerText = name;
    newItem.onclick = (() => beginEditEntry(shapeId));
    newItem.setAttribute('data-toggle', 'modal');
    newItem.setAttribute('data-target', '#myModal');
    newItem.style = 'background-color: ' + color + ';'
    itemList.appendChild(newItem);
}

function removeListItem(shapeId) {
    document.getElementById(shapeId).remove();
}

function beginNewEntry() {
    document.getElementById( 'modal-title' ).innerText = 'New Shape';
    updateModal('Cool Shape','#ffffff');
    currentShape = '';
}

function beginEditEntry(shapeId) {
    getEntry(shapeId);
    document.getElementById( 'modal-title' ).innerText = 'Edit Shape';
    currentShape = shapeId;
}

function updateModal( name, color ) {
    document.getElementById( 'shape-name' ).value = name;
    document.getElementById( 'colorpicker' ).value = color;
    updateObject();
}


function onClickSave( event ) {
    event.preventDefault();
    saveEntry();
}

function onClickDelete( event ) {
    event.preventDefault();
    deleteEntry();
}

function onCloseModal( event ) {
    event.preventDefault();
    resetShape();
}

function resetShape() {
    currentShape = shapeId;
}

function getEntry(shapeId) {
    let name = 'dne';
    const json = {docId: shapeId};
    const body = JSON.stringify(json);
    fetch( '/getshape',
    {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })
    .then( response => response.json() )
    .then( responseJSON => updateModal(responseJSON.name, responseJSON.color));
}

function saveEntry() {

    const shapename = document.getElementById( 'shape-name' ).value,
          shapecolor = document.getElementById( 'colorpicker' ).value;

    if (shapename === '') {
        console.error('Error: name must be filled!');
        return true;
    }

    const json = {name: shapename, color: shapecolor};

    const body = JSON.stringify( json );
    console.log(body);

    fetch( '/add',
    {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })
    .then( response => response.json() )
    .then( responseJSON => {
        console.log(responseJSON.insertedId);
        addListItem(responseJSON.insertedId, shapename, shapecolor);
    });

    return false;
}

function deleteEntry() {

    const body = JSON.stringify({shapeId: currentShape});

    fetch( '/remove',
    {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })
    .then( response => response.json() )
    .then(removeListItem(currentShape));
}