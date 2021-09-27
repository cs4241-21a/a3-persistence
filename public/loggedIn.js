let CURRENT_USER = null;
window.onload = async function () {
    // Send a GET request to assign the current user
    // If null (no user associated with request) user will be asked to login again
    CURRENT_USER = await renderUser();

    renderTableForUser()
    // submit function
    let submitButton = document.getElementById("car_submit")
    submitButton.onclick = submitEntry;
}

function renderTableForUser() {
    renderUserData()
}

function insertValuesIntoTable(listOfEntries) {
        listOfEntries.forEach((element) => {
            console.log("element is", element)
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
            //newTest_text.setAttribute("id", "checkbox" + tableIndexCount);
            newTest_cell.appendChild(newTest_text);

            if (document.getElementById("car_table").rows.length === 1) {
                document.getElementById("deleteButton").style.visibility = "hidden";
            } else {
                document.getElementById("deleteButton").style.visibility = "visible";
            }
        })

};

function submitEntry(e){
    e.preventDefault();
    // prevent default form action from being carried out
    const car_name = document.querySelector("#carname");
    const purchase_price = document.querySelector("#purchaseprice");
    const purchase_year = document.querySelector("#purchaseyear");
    const repairs = document.querySelector("#repairs");
    const miles = document.querySelector("#miles");

    json = {
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
}

/**
 *
 * @returns {Promise<*>}
 */
async function renderUserData() {
    const userData = await fetchUserData()
    insertValuesIntoTable(userData.entries)
}
async function fetchUserData() {
    try{
        console.log("USER: ",CURRENT_USER);
        let reqBody = {
            userID: CURRENT_USER
        }

        const response = await fetch("/getUserInformation", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(reqBody)
        })
        const list = await response.json().then((data) => {return data;});
        console.log("Code reached here")
        console.log(list);
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