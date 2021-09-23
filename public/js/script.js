let form = null;
let pokeNames = null;

function resetForm() {
    form.reset;
    document.getElementById("modal").style.display = "none";
    document.getElementById("secondPart").style.display = "none";
    form.onsubmit = submitForm;
}

const editEntry = function(id, pokemon, nickname, gender){
    console.log(id)
    document.getElementById("pokeID").value = pokemon;
    document.getElementById("nickname").value = nickname;
    document.getElementById("gender").value = gender;
    document.getElementById("modal").style.display = "block"
    document.getElementById("secondPart").style.display = "block"
    document.getElementById("modal-message").innerHTML = "Edit Pokemon:"
    document.getElementById("exitModalBtn").addEventListener("click", resetForm)
    form.onsubmit = function(e){
        e.preventDefault()
        // setup JSON object
        let json = {"_id": id}
        // Iterate through data in form
        let data = new FormData(form);
        for (let pair of data.entries()){
            json[pair[0]] = pair[1]
        }

        // POST /add Request
        fetch( '/edit', {
            method:'POST',
            body: JSON.stringify(json),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then( function( response ) { 
            console.log( response )
        }).then( function() { 
            console.log( "Finished edit request" )
            updateData()
            form.reset()
            form.onsubmit = submitForm
            document.getElementById("secondPart").style.display = "none"
            document.getElementById("modal").style.display = "none"
        })
        }
}

const deleteEntry = function(id){
    // console.log(id)
    fetch( '/delete', {
        method:'POST',
        body: JSON.stringify({"_id": id}),
        headers: {
            "Content-Type": "application/json"
        }
      })
      .then( function( response ) { 
        console.log( response )
      })
      .then( function() { 
        console.log( "Finished delete request" )
        updateData()
      })
}

const submitForm = function(e){
    e.preventDefault();
    // setup JSON object
    let json = {}
    // Iterate through data in form
    let data = new FormData(form);
    for (let pair of data.entries()){
        json[pair[0]] = pair[1]
    }

    // POST /add Request
    fetch( '/add', {
        method:'POST',
        body: JSON.stringify(json),
        headers: {
            "Content-Type": "application/json"
        }
      })
      .then( function( response ) { 
        console.log( response )
      }).then( function() { 
          console.log( "Finished add request" )
          updateData()
          form.reset()
          document.getElementById("secondPart").style.display = "none"
          document.getElementById("modal").style.display = "none"
      })
}

function updateData(){
    fetch('/update', {
        method: 'GET'
    }).then(function(response){
        return response.json();
    }).then(async function(data){
        console.log(data);
        const resultsTable = document.getElementById("results");
        resultsTable.innerHTML = " ";

        // create table header + head row elements
        let tableHead = document.createElement('thead');
        let headRow = document.createElement('tr');

        // create th elements based on fields
        let th1 = document.createElement('th');
        th1.innerHTML = 'Pokemon';
        headRow.appendChild(th1);
        
        let th2 = document.createElement('th');
        th2.innerHTML = 'Gender';
        headRow.appendChild(th2);

        let th3 = document.createElement('th');
        th3.innerHTML = 'Type';
        headRow.appendChild(th3);

        // append filler headers for edit and delete icons
        let filler = document.createElement('th');
        headRow.appendChild(filler);
        let filler2 = document.createElement('th');
        headRow.appendChild(filler2);
        
        // add head row to table head
        tableHead.appendChild(headRow)
        // add table head to table
        resultsTable.appendChild(tableHead)

        // create table body element
        let tableBody = document.createElement('tbody');
        
        // iterate through obtained data
        for (let index = 0; index < data.length; index++) {
            let entry = data[index];

            // start new row
            let newRow = document.createElement('tr');
            newRow.id = entry["_id"];
            newRow.className = "tableEntry";

            // add species related data
            let pokeSpecies = document.createElement('td');
            let displayName = entry["pokemon"]
            if(entry["nickname"].length !== 0){
                displayName += "\n(" + entry["nickname"] + ")"
            }
            pokeSpecies.innerHTML = displayName;
            newRow.appendChild(pokeSpecies)

            // add gender related data
            let gender = document.createElement('td');
            gender.innerHTML = entry["gender"];
            newRow.appendChild(gender)

            // add type related data
            let type = document.createElement('td');
            let typeId = "type_" + entry["_id"]
            type.id = typeId
            getType(entry["pokemon"], typeId);
            newRow.appendChild(type);

            // add edit icon
            let editIcon = document.createElement('td');
            editIcon.innerHTML = "<span class=\"icon\">&#9998;</span>";
            editIcon.onclick = function(e) {
                e.preventDefault();
                editEntry(entry["_id"], entry["pokemon"], entry["nickname"], entry["gender"]);
            }
            newRow.appendChild(editIcon);

            // add delete icon
            let deleteIcon = document.createElement('td');
            deleteIcon.innerHTML = "<span class=\"icon\">&times;</span>";
            deleteIcon.onclick = function(e) {
                e.preventDefault();
                deleteEntry(entry["_id"]);
            }
            newRow.appendChild(deleteIcon);

            // add new row to table body
            tableBody.appendChild(newRow);
        }
        // append table body to table
        resultsTable.appendChild(tableBody);
    })
}


// populate form data
function fetchPokemon() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
    .then(response => response.json())
    .then(pokes => {
        console.log(pokes)
        // create label
        let pokeLabel = document.createElement('label')
        pokeLabel.setAttribute("for", "pokemon")
        pokeLabel.innerHTML = "Select your Pokemon: <br>"
        
        // create list input
        let listInput = document.createElement('input');
        listInput.setAttribute('list', "pokemon");
        listInput.id = "pokeID";
        listInput.name = "pokemon";
        listInput.required = true;

        // create child datalist
        let dataList = document.createElement('datalist');
        dataList.id = "pokemon";
        pokeNames = []

        pokes.results.forEach(function(mon) {
            let opt = document.createElement('option');
            pokeNames.push(mon["name"])
            opt.value = mon["name"].charAt(0).toUpperCase() + mon["name"].slice(1);
            dataList.appendChild(opt);
        })

        // append datalist to list input
        listInput.appendChild(dataList);

        // append input to first part of form
        const firstPart = document.getElementById("firstPart")
        firstPart.appendChild(pokeLabel);
        firstPart.appendChild(listInput);

        // add validate button
        let validateBtn = document.createElement('button')
        validateBtn.innerHTML = "Confirm"
        firstPart.appendChild(validateBtn)
        validateBtn.addEventListener("click", validatePokemon)
    })
}

// validate and build form
function validatePokemon(e) {
    e.preventDefault()
    let pokemonInput = document.getElementById('pokeID')
    let valid = pokeNames.includes(pokemonInput.value.toLowerCase());
    if(valid) {
        pokemonInput.style.background = "#b3f2c7"
        pokemonInput.style.borderColor = "#1e8f42"
        document.getElementById("secondPart").style.display = "block"
    }
    else {
        pokemonInput.style.background = "#f5c6c6"
        pokemonInput.style.borderColor = "red"
        document.getElementById("secondPart").style.display = "none"
    }
}

function getType(pokemon, id) {
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon.toLowerCase())
    .then(response => response.json())
    .then(data => {
        let pokeType = []
        data.types.forEach(type => {
            let typeName = type.type.name
            pokeType.push(typeName.charAt(0).toUpperCase() + typeName.slice(1));
        })
        document.getElementById(id).innerHTML = pokeType.join("/");
    })
}


window.onload = function() {
    form = document.getElementById('data_form');
    form.onsubmit = submitForm
    updateData()
    fetchPokemon()
}