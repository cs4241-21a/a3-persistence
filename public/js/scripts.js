/*
This function is called every time you click outside of the "Amount Due" form, and every time a key is pressed inside of it

input: the "input" element (The input element containing the actual value)
blur: is a string ("blur") if the function is being called as a result of clicking outside of the input form
*/
function handle_amount_due(input, blur){

    // Which big white box are we talking about here?
    let parent_container = input.parentElement.parentElement.parentElement;
    
    let tip_location = parent_container.querySelector("#tip_amount");



  

    if (blur === "blur"){
        // We are inside here because we deselected the amount due form

        //Lets make sure the input we gave is formatted (does it have 2 decimal places at the end?, ect)
        formatCurrency(input, blur)

        // Now lets calculate some suggested tips. Lets give it the input element containing the actual value and
        // which big whit box, it should be updating the percentages for
        update_tip_suggestions(input, parent_container);
    }
    else{

        // We are currently typing inside of the amount due form, so lets make sure we don't
        // add any characters we shouldn't and make sure it is formatted properly.
        formatCurrency(input)
    }

    // let tip = tip_location.value;


    // Now that we have an amount, let's make sure that if we already had a tip input, the tip percentage of the total cost
    // will accurately be reflected.
    calculate_tip_percentage(tip_location, parent_container);

}


function handle_tip(input, blur){
    
    // The tip is inside of a form, which is inside of the big white box
    let parent_container = input.parentElement.parentElement.parentElement;
    
    if (blur === "blur"){
        //Inside if means we clicked outside of the tip form

        // We want to make sure that the string is formatted properly even if we didn't 
        //leave it formatted
        formatCurrency(input, blur)

        //We clicked outside of the tip form so, we can now calculate what percentage
        // of the total cost our tip was
        calculate_tip_percentage(input, parent_container);
    }
    else{

        // We are currently typing inside of the tip form, so lets make sure we don't
        // add any characters we shouldn't and make sure it is formatted properly.
        formatCurrency(input)
    }
}


function generateNewForm(newContainerID, oldContainerID, json){

    // console.log("New box id: ", newContainerID);
    // console.log("Old box id: ", oldContainerID)
    // console.log("json: ", json)


    
    let previously_saved_form = document.getElementById(oldContainerID);


    let new_saved_container = document.createElement("div");
    new_saved_container.setAttribute("id", json._id);
    new_saved_container.setAttribute("class", "shadow p-4 container mt-5");
    new_saved_container.setAttribute("style", "width: 500px; height: 450px; font-family: Special Elite;");


    new_saved_container.innerHTML = `
        <div class="row fs-4 mb-5">
            <div class="col-sm">
                <label for="people_input"> ${json.num_of_people} people </label>
            </div>
                <div class="col-sm" style="text-align:right;" onclick="edit_mode(this)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
            </div>
        </div>
        
        <div class="row fs-4" style="text-align: center;">
            <div class="col-sm">20%</div>
            <div class="col-sm">17.5%</div>
            <div class="col-sm">15%</div>
        </div>
        <div class="row fs-4 mb-1" style="text-align: center;">
            <div class="col-sm"> ${json.calc_1} </div>
            <div class="col-sm"> ${json.calc_2} </div>
            <div class="col-sm"> ${json.calc_3} </div>
        </div>

        <div class="row mt-5">
            <div class="col-sm-8" style="text-align:right; margin-top: auto; margin-bottom: auto;">
                <label class="fs-4"> Amount Due : </label>
            </div>
            <div class="col-sm-4">
                <p class="fs-4" style="margin: auto 0; text-align: right; margin-right:12px;"> ${json.amount_due} </p>
            </div>
        </div>
        <div class="row mt-3 mb-2">
            <div class="col-sm-8" style="text-align:right; margin: auto 0;">
                <label class="fs-4"> + Tip ${json.tip_percentage} </label>
            </div>
            <div class="col-sm-4">
                <p class="fs-4" style="margin: auto 0; text-align: right; margin-right:12px;"> ${json.tip} </p>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-sm-8" style="text-align:right; margin: auto 0;">
                <label class="fs-2">  Total / Person : </label>
            </div>
            <div class="col-sm-4">
                <p class="fs-2" style="margin: auto 0; text-align: right; margin-right:12px;"> ${json.price_per_person} </p>
            </div>
        </div>
    `

    //Adds everything to the webpage
    document.body.insertBefore(new_saved_container, previously_saved_form.nextSibling);
}


function delete_form(delete_button){

    let container = delete_button.parentElement.parentElement;

    let id = container.id;

    const data = JSON.stringify({"id" : id})

    // Tell the database to remove the entry
    fetch('/delete_receipt', {
        method: 'POST',
        body: data,
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then(
        // Removes the big white box and everything in it from the screen
        container.remove()
    )
}


function edit_mode(button){


    let container = button.parentElement.parentElement;

    let query = JSON.stringify({"id" : container.id})


    fetch('/find_receipt', {
        method: 'POST',
        body: query,
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then(response => response.json())
    .then(res => {

        const json = res[0];

        // console.log("the json: ", json);

        container.innerHTML = `
            <div class="row fs-4 mb-5">
                <div class="col-sm-1">
                    <select id="people_input" class="form-control" value="${json.num_of_people}" style="width:fit-content; text-align: center;">
                        <option> 1 </option>
                        <option> 2 </option>
                        <option> 3 </option>
                        <option> 4 </option>
                        <option> 5 </option>
                        <option> 6 </option>
                        <option> 7 </option>
                        <option> 8 </option>
                        <option> 9 </option>
                        <option> 10 </option>
                    </select>
                </div>
                <div class="col-sm" style="margin-left: 10px;">
                    <label for="people_input"> people </label>
                </div> 
                <div class="col-sm" style="text-align: right" onclick="delete_form(this)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </div>
            </div> 
            </div>  

            <div class="row fs-2" style="text-align: center;">
                <div class="col-sm">20%</div>
                <div class="col-sm">17.5%</div>
                <div class="col-sm">15%</div>
            </div>
            <div class="row fs-4 mb-1" style="text-align: center;">
                <div class="col-sm" id="tip_twenty"> ${json.calc_1} </div>
                <div class="col-sm" id="tip_seventeen"> ${json.calc_2} </div>
                <div class="col-sm" id="tip_fifteen"> ${json.calc_3} </div>
            </div>


            <div class="row mt-5">
                <div class="col-sm-8" style="text-align:right; margin-top: auto; margin-bottom: auto;">
                    <label class="fs-3"> Amount Due : </label>
                </div>
                <div class="col-sm-4">
                    <input  class="form-control fs-5"
                            type="text"
                            id="given_amount"
                            style="text-align: right;" 
                            value="${json.amount_due}" 
                            data-type='currency' 
                            placeholder="$0.00"
                            onkeyup="handle_amount_due(this)"
                            onblur="handle_amount_due(this, 'blur')">
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-sm-8" style="text-align:right; margin-top: auto; margin-bottom: auto;">
                    <label class="fs-3" id="tip">  + Tip ${json.tip_percentage} </label>
                </div>
                <div class="col-sm-4">
                    <input  class="form-control fs-5" 
                            type="text" 
                            id="tip_amount"
                            style="text-align: right;"
                            value="${json.tip}" 
                            data-type='currency' 
                            placeholder="$0.00"
                            onkeyup="handle_tip(this)"
                            onblur="handle_tip(this, 'blur')">
                </div>
            </div>
            <div class="row mt-5">
            
                <button type="button" style="width:250px; margin: 0 auto;" class="btn btn-primary btn-lg fs-4" onclick="update_values(this)">
                    Calculate 
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-download" viewBox="0 0 20 20">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                </button>

            </div>
        `

        container.querySelector("#people_input").children[json.num_of_people - 1].setAttribute("selected", "");
    })
}


function formatNumber(n) {

  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function formatPeople(input_element){
    let input_val = input_element.value;
 
    input_element.value = formatNumber(input_val);
}


function checkForValue(input_element){
    let input_val = input_element.value;

    if (input_val === "") { 
        input_element.value = 1;
    }
}


function formatCurrency(input, blur) {
  //If there is no input value, the placeholder value will showup again
  if(input.value !== ''){
    input_val = '$' + input.value;
  }
  else{
    input_val = '';
  }

  // don't validate empty input
  if (input_val === "") { return; }
  
  // original length
  var original_len = input_val.length;

  // check for decimal
  if (input_val.indexOf(".") >= 0) {

    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);
    
    // On blur make sure 2 numbers after decimal
    // blur means when you are not focused on the input form (the input is not selected)
    if (blur === "blur") {
      right_side += "00";
    }
    
    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = "$" + left_side + "." + right_side;

  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = "$" + input_val;
    
    // final formatting
    if (blur === "blur") {
      input_val += ".00";
    }
  }

  // Updates the value that is inside of the form
  input.value = input_val;

}


// Updates the pre-defined common tips
function update_tip_suggestions(input, parent_container) {

    // This is the actual use input string (Amount Due)
    let val = input.value;

    // The input value was in currency format, so let's remove the $ and all the commas so we can perform math on it
    val = val.replace(',', '');
    val = val.replace('$', '');

    // We need the amount due to be a float rather than a string in order to perform calculations
    let total_cost = parseFloat(val);

    // Now we calculate the percentages
    let twenty_percent = total_cost * 0.2;
    let seventeen_point_five_percent = total_cost * 0.175;
    let fifteen_percent = total_cost * 0.15;
    
    let twenty_p = parent_container.querySelector("#tip_twenty");
    let seventeen_p = parent_container.querySelector("#tip_seventeen");
    let fifteen_p = parent_container.querySelector("#tip_fifteen");



    let twenty_html = "$" + twenty_percent.toFixed(2);
    let seventeen_html = "$" + seventeen_point_five_percent.toFixed(2);
    let fifteen_html = "$" + fifteen_percent.toFixed(2);

    // If the user did not give any value for the Amount Due, keep the tip suggestions to their default value
    if(twenty_html === "$NaN"){
        twenty_html = "$_.__";
        seventeen_html = "$_.__";
        fifteen_html = "$_.__";
    }


    twenty_p.innerHTML = twenty_html;
    seventeen_p.innerHTML = seventeen_html;
    fifteen_p.innerHTML = fifteen_html;

}


/* 
    This function adds the actual percentage of the Amount Due that the user gave

    input: the actual "input" element that contains the value the user gave
    parent_container: the big white box element that the tip is being altered in
*/
function calculate_tip_percentage(input, parent_container){

    // Lets get the value the user actually gave for the tip
    let input_val = input.value;

    // let num_of_elements = parent_container.children.length;

    //This is the element that writes out to the user "+ Tip"
    let tip_label = parent_container.querySelector("#tip");



    
    if (input_val.length !== 0){
        // If we are inside here, it means the user actually gave a value for the tip

        // In order to perform calculations on the tip, we need to remove the commas and the $
        input_val = input_val.replace(',', '');
        input_val = input_val.replace('$', '');
    
        // We also need to make the tip value a actual number rather than a string, so we can calculate things with it
        let tip = parseFloat(input_val);

        

        // This gives us the form in which the total cost is located. The value for the cost is in one of it's child elements
        // let amount_form = parent_container.children[5];
        let amount_form = parent_container.querySelector("#given_amount");

 
        let cost_val = amount_form.value;

        //Default (for when the user doesn't give a total amount due value)
        let percentage = 100;

        
        // cost_val is a string containing the AmountDue input. If there is any user input, the length would be greater than 0, but
        // if the user didn't give a value, the length of cost_val will be 0
        if(cost_val.length !== 0){
       
            //We want to reformat the input to something that can have calculations performed on it
            cost_val = cost_val.replace(',', '');
            cost_val = cost_val.replace('$', '');
            let total_cost = parseFloat(cost_val);

            if(total_cost === 0){
                percentage = 100;
            }
            else{
                // Lets make it not a decimal percentage
                percentage = (tip / total_cost) * 100;
            }
           

        }

       // Add two decimal places to the percentage
        percentage = percentage.toFixed(2);


        // Now we display to the user the percentage of the cost their tip is
        tip_label.innerHTML = `+ Tip (%${percentage}) :`;

    }
    else{

        //There is no tip given so there is no need to write what percentage of the total cost there tip is
        tip_label.innerHTML = "+ Tip :"
    }
}


function submit(calculate_button) {

    let parent_container = calculate_button.parentElement.parentElement;

    const people_input = document.getElementById("people_input");
    const calc_1 = document.getElementById("tip_twenty");
    const calc_2 = document.getElementById("tip_seventeen");
    const calc_3 = document.getElementById("tip_fifteen");
    const amount_due_input = document.getElementById("given_amount");
    const tip_percentage = document.getElementById("tip");
    const tip_input = document.getElementById("tip_amount");


    const fields = [amount_due_input, tip_input]

    

    if(validate_input_fields(fields)){

        fetch('/get_logged_in_user', {
            method: 'POST',
            body: JSON.stringify({}),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(cookie => cookie.json())
        .then(json => {

            let values = { 
                "num_of_people": people_input.value, 
                "amount_due": amount_due_input.value,
                "tip": tip_input.value,
                "calc_1": calc_1.innerHTML,
                "calc_2": calc_2.innerHTML,
                "calc_3": calc_3.innerHTML,
                "tip_percentage": tip_percentage.innerHTML.substring(6),
                "user": json.user
            };
        
            // console.log("values: ", values);
        
            let data = JSON.stringify(values);
        
            fetch('/add', {
                method: 'POST',
                body: data,
                headers:{
                    "Content-Type":"application/json"
                }
            })
            .then(function( response ){
                // console.log("response: ", response);
                //do something with the response
                return response.json();
            })
            .then(function(json){
                //json is the array returned by the server
                // console.log("Client Side:");
                // console.log("json: ", json);
                // console.log("json.insertedId:", json.insertedId);
        
                // the new container that is made will have the ID equal to the ID that data has in the database
                let newContainerID = json.insertedId
        
        
                // This is the id of the big white box container
                // We want this so that we we create a new form, we know where to place it on the screen 
                let parentID = parent_container.id;
                
        
                let query = JSON.stringify({"id" : newContainerID})
        
                fetch('/find_receipt', {
                    method: 'POST',
                    body: query,
                    headers:{
                        "Content-Type":"application/json"
                    }
                })
                .then(response => response.json())
                .then(json => {
                    // console.log("json", json);
        
                    generateNewForm(newContainerID, "0", json[0]);
                    if(parent_container.id === "0"){
                        refresh_form();
                    }
                    else{
                        parent_container.remove();
                    }
        
                })
            })

        })
        

        
    }
}


function refresh_form(){
    let container = document.getElementById("0");

    container.querySelector("#people_input").value = 1;
    container.querySelector("#tip_twenty").innerHTML = "$_.__";
    container.querySelector("#tip_seventeen").innerHTML = "$_.__";
    container.querySelector("#tip_fifteen").innerHTML = "$_.__";
    container.querySelector("#given_amount").value = "";
    container.querySelector("#tip").innerHTML = "+ Tip :";
    container.querySelector("#tip_amount").value = "";

}


function update_values(calculate_button){

    let parent_container = calculate_button.parentElement.parentElement;

    let people_input = parent_container.querySelector("#people_input").value;
    let calc_1 = parent_container.querySelector("#tip_twenty").innerHTML;
    let calc_2 = parent_container.querySelector("#tip_seventeen").innerHTML;
    let calc_3 = parent_container.querySelector("#tip_fifteen").innerHTML;
    let amount_due_input = parent_container.querySelector("#given_amount").value;
    let tip_percentage = parent_container.querySelector("#tip").innerHTML.substring(6);
    let tip_input = parent_container.querySelector("#tip_amount").value;

    const json = {"id" : parent_container.id,
                "num_of_people" : people_input,
                "amount_due" : amount_due_input,
                "tip" : tip_input,
                "calc_1" : calc_1,
                "calc_2" : calc_2,
                "calc_3" : calc_3,
                "tip_percentage" : tip_percentage}

    const data = JSON.stringify(json);

    fetch('/update_receipt', {
        method: 'POST',
        body: data,
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then(response => response.json())
    .then(json =>{

        let container_before = parent_container.previousElementSibling;

        parent_container.remove();

        generateNewForm(json._id, container_before.id, json);

    })
}




    



function validate_input_fields(input_fields){
    let first_unfilled = true
    let num_of_unfilled_inputs = 0

    input_fields.forEach(field => {
        
        if(first_unfilled === true && field.value.length === 0){
            
            // The first field in the form that hasn't been filled out will be focused on
            field.focus()
            first_unfilled = false
        }

        // what attributes does it already have. That way we don't need to hard code them all again
        let styling = field.getAttribute("class")

        // If there is no input for the form field
        if(field.value.length === 0){
            
            // This means that the input form has already been identified as invalid, so we don't need to 
            // add another invalid class attribute
            if (styling.includes(" is-invalid") === false){
                field.setAttribute("class", styling + " is-invalid");
            }
            
            num_of_unfilled_inputs += 1;
        }
        else{
            
            // The form is no longer invalid, so we can remove the attribute if it has it
            new_styling = styling.replace("is-invalid", "");
            field.setAttribute("class", new_styling);

        }
    })

    if(num_of_unfilled_inputs === 0){
        // Will return true if all of the fields have inputs
        return true;
    }
    else{
        // Will return false if at least one field does not have an input
        return false;
    }
}

function signIn(){
    fetch('/login', {
        method: 'POST',
        body: JSON.stringify({}),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then( () => window.location.reload())
}


function logout(){

    // console.log("signing the user out");
    // Signs the user out which gets rid of the username and email stored in the server.js file
    fetch('/logout', {
        method: 'POST',
        body: JSON.stringify({}),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then( () => window.location.reload())
}




// Loads the receipts the user has already created in previous sessions
window.onload = function(){
    // console.log("window.location.href", window.location.href);

    if(window.location.href.includes('/receipts.html') ){
        // console.log("I'm ready to load receipts");

        fetch('/find_user_receipts', {
            method: 'POST',
            data: JSON.stringify({}),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(response => response.json())
        .then(receipts => {
            // console.log(receipts);

            let old_container_id = "0";

            let count = 1
            receipts.forEach( function(json) {
                // console.log(json);

                generateNewForm(json._id, old_container_id, json);
                old_container_id = json._id;

                count += 1;

            })
        })
        
    }
  
}

function del_cookie(){
    fetch('/delete_cookie', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
            "Content-Type":"application/json"
        }
    })
    
}