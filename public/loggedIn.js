let CURRENT_USER = null;
window.onload = async function () {
    // Send a GET request to assign the current user
    // If null (no user associated with request) user will be asked to login again
    CURRENT_USER = await renderUser();
    await renderUserData()

    // submit function
    let submitButton = document.getElementById("car_submit")
    submitButton.onclick = submitEntry;

    // delete function
    let deleteButton = document.getElementById("deleteButton")
    deleteButton.onclick = deleteEntry;

}

async function deleteEntry() {
    let table_element = getCheckedBox(document.getElementById("car_table")).cells;
    getCheckedBox(document.getElementById("car_table")).remove();
    console.log("Removed Entry from Table")
    let searchCriteria = {
        car_name: table_element.item(0).innerHTML,
        purchase_price: table_element.item(1).innerHTML.substr(1),
        repairs: table_element.item(3).innerHTML,
        miles_driven: table_element.item(4).innerHTML
    }
    let response = await fetch("/deleteEntry", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(searchCriteria)
    })
    await console.log(response)
    await renderUserData();


}

function getCheckedBox(table) {
    for (let i = 1, row; (row = table.rows[i]); i++) {
        //iterate through rows
        if (row.cells[6].querySelector("input").checked) {
            // Add the index to the listofChecked row
            return table.rows[i]; // to get true index
        }
    }
}
/**
 * Responsible for rendering the values into the table.
 * @param listOfEntries
 */
async function insertValuesIntoTable(listOfEntries) {
        console.log("Inserting new values into table")
        listOfEntries.forEach((element, index) => {
            let car_name = element.car_name;
            let purchase_price = element.purchase_price;
            let age = 2021 - element.purchase_year;
            let num_repairs = element.repairs;
            let miles_driven = element.miles;
            let estimated_value = element.purchase_price * 0.8 -
                  (2021 - element.purchase_year) * 100 -
                  element.miles / 10 -
                  element.repairs * 100;

            // Acquire the table that we want to add to
            const tableRef = document.getElementById("car_table");
            let newRow = tableRef.insertRow(-1);

            // Construct a new Row
            /*   if (i === tableEntries[0].length - 1) {
                   newRow.setAttribute("id", "lastRow");
               } else {
                   newRow.setAttribute("id", tableIndexCount);
               }*/

            // Construct and populate a new cell
            let newCar_cell = newRow.insertCell(-1);
            let newCar_text = document.createTextNode(car_name);
            newCar_cell.appendChild(newCar_text);

            let newPurchase_cell = newRow.insertCell(-1);
            let newPurchase_text = document.createTextNode("$" + purchase_price);
            newPurchase_cell.appendChild(newPurchase_text);

            let newAge_cell = newRow.insertCell(-1);
            let newAge_text = document.createTextNode(age.toString());
            newAge_cell.appendChild(newAge_text);

            let newRepair_cell = newRow.insertCell(-1);
            let newRepair_text = document.createTextNode(num_repairs);
            newRepair_cell.appendChild(newRepair_text);

            let newMiles_cell = newRow.insertCell(-1);
            let newMiles_text = document.createTextNode(miles_driven);
            newMiles_cell.appendChild(newMiles_text);

            let newEstimate_cell = newRow.insertCell(-1);
            let newEstimate_text = document.createTextNode("$" + estimated_value);
            newEstimate_cell.appendChild(newEstimate_text);

            let newTest_cell = newRow.insertCell(-1);
            let newTest_text = document.createElement("input");
            newTest_text.setAttribute("type", "checkbox");
            newTest_cell.setAttribute("label", "Check Box for True")
            newTest_cell.appendChild(newTest_text);

            let newModify_cell = newRow.insertCell(-1);
            let newModify_text = document.createElement("input");
            newModify_text.setAttribute("type", "checkbox");
            newModify_cell.setAttribute("label", "Check Box for True")
            newModify_cell.appendChild(newModify_text);

            if (document.getElementById("car_table").rows.length === 1) {
                document.getElementById("deleteButton").style.visibility = "hidden";
            } else {
                document.getElementById("deleteButton").style.visibility = "visible";
            }
        })

};

/**
 * Responsible for gathering the fields from the form and passing into server/mongoDB
 * @param e
 */
async function submitEntry(e){
    console.log("Inserting new entry")
    e.preventDefault();
    // prevent default form action from being carried out
    const car_name = document.querySelector("#carname");
    const purchase_price = document.querySelector("#purchaseprice");
    const purchase_year = document.querySelector("#purchaseyear");
    const repairs = document.querySelector("#repairs");
    const miles = document.querySelector("#miles");

    let json = {
        car_name: car_name.value,
        purchase_price: purchase_price.value,
        purchase_year: purchase_year.value,
        repairs: repairs.value,
        miles: miles.value
    };
    let reqbody = JSON.stringify(json);

    fetch("/submit", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: reqbody
    })
    await console.log("returned from fetch")
    await renderUserData();

}

/**
 *  clearTable() --> Responsible for clearing table for rerendering.
 */
async function clearTable(){
    let table = document.querySelector("table");
    table.getElementsByTagName("tbody")[0].innerHTML = table.rows[0].innerHTML;
}
/**
 *
 * @returns {Promise<*>}
 */
async function renderUserData() {
    console.log("Rendering Values into the table")
    // Clear the Table
    await clearTable()
    console.log("Table is cleared")
    const userData = await fetchUserData()
    console.log("User data has been reloaded")
    await insertValuesIntoTable(userData.entries)
}
async function fetchUserData() {
    try{
        let reqBody = {
            userID: CURRENT_USER
        }
        const response = await fetch("/getUserInformation", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(reqBody)
        })
        const list = await response.json().then((data) => {return data;});
        console.log("found user data")
        return list;
    } catch(error) {
        console.error(error)
    }
}


/**
 * The following 2 functions are responsible for getting the userID for the session using a GET request.
 * @returns {Promise<*>}
 */
async function renderUser() {
    const obj = await fetchUser()
    return obj.user;
}
async function fetchUser() {
    try{
        const response = await fetch("/getUser", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: null
        });
        const user = await response.json();
        return user;
    } catch(error) {
        console.error(error)
    }
}