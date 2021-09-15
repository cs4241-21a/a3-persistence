// Add some Javascript code here, to run on the front end.



/*
This function is called every time you click outside of the "Amount Due" form, and every time a key is pressed inside of it

input: the "input" element (The input element containing the actual value)
blur: is a string ("blur") if the function is being called as a result of clicking outside of the input form
*/
function handle_amount_due(input, blur){

    // Which big white box are we talking about here?
    let parent_container = input.parentElement.parentElement;
    
    //This is the form location for the "Tip" within the same big white box
    let tip_location = parent_container.children[7];

    if(parent_container.children.length === 10){
        tip_location = parent_container.children[8];
    }
  

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

    let tip = tip_location.children[0];


    // Now that we have an amount, let's make sure that if we already had a tip input, the tip percentage of the total cost
    // will accurately be reflected.
    calculate_tip_percentage(tip, parent_container);

}


function handle_tip(input, blur){
    
    // The tip is inside of a form, which is inside of the big white box
    let parent_container = input.parentElement.parentElement;
    
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

function generateNewForm(id){

    

    let previously_saved_form = document.body.children[2];
    

    let new_saved_container = document.createElement("div");
    new_saved_container.setAttribute("id", id);
    new_saved_container.setAttribute("class", "saved_container");

    let json = getAppropriateJSON(id);

    console.log("updated json: ", json);


    //Time Stamp
    let d = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let month = months[d.getMonth()]
    let year = d.getFullYear();
    let date = d.getDate();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let tod = "am";

    if(minutes < 10){
         minutes = "0" + minutes;
    }
    if(hours > 12) {
        hours = hours - 12;
        tod = "pm";
    }

    let saved_time = "Saved on " + month + " " + date + ", " + year + " at " + hours + ":" + minutes + tod;

    let new_time_stamp = document.createElement("p");
    new_time_stamp.setAttribute("id", "time_stamp");
    new_time_stamp.innerHTML = saved_time;

    new_saved_container.appendChild(new_time_stamp);




    let new_edit_button = document.createElement("span");
    new_edit_button.setAttribute("id", "edit_button");
    new_edit_button.setAttribute("class", "material-icons");
    new_edit_button.setAttribute("onclick", "edit_mode(this)");
    new_edit_button.innerHTML = "edit";

    new_saved_container.appendChild(new_edit_button);


    let new_people_form = document.createElement("form");
    new_people_form.setAttribute("id", "num_people_container");

    let new_num_people = document.createElement("label");
    new_num_people.setAttribute("id", "people_input");
    new_num_people.innerHTML = json.num_of_people;

    let new_people_label = document.createElement("label");
    new_people_label.innerHTML = " people";



    new_people_form.appendChild(new_num_people);
    new_people_form.appendChild(new_people_label);
    new_saved_container.appendChild(new_people_form);



    let new_provided_calculation_1 = document.createElement("div");
    new_provided_calculation_1.setAttribute("id", "provided_calculation_1");
    new_provided_calculation_1.setAttribute("class", "calculation");

    let new_20_p = document.createElement("p");
    new_20_p.innerHTML = "20%";

    let new_calculated_20 = document.createElement("p");
    new_calculated_20.setAttribute("id", "20%_value");
    new_calculated_20.innerHTML = json.calc_1;

    new_provided_calculation_1.appendChild(new_20_p);
    new_provided_calculation_1.appendChild(new_calculated_20);
    new_saved_container.appendChild(new_provided_calculation_1);




    let new_provided_calculation_2 = document.createElement("div");
    new_provided_calculation_2.setAttribute("id", "provided_calculation_2");
    new_provided_calculation_2.setAttribute("class", "calculation");

    let new_17_p = document.createElement("p");
    new_17_p.innerHTML = "17.5%";

    let new_calculated_17 = document.createElement("p");
    new_calculated_17.setAttribute("id", "17.5%_value");
    new_calculated_17.innerHTML = json.calc_2;


    new_provided_calculation_2.appendChild(new_17_p);
    new_provided_calculation_2.appendChild(new_calculated_17);
    new_saved_container.appendChild(new_provided_calculation_2);



    let new_provided_calculation_3 = document.createElement("div");
    new_provided_calculation_3.setAttribute("id", "provided_calculation_3");
    new_provided_calculation_3.setAttribute("class", "calculation");

    let new_15_p = document.createElement("p");
    new_15_p.innerHTML = "15%";

    let new_calculated_15 = document.createElement("p");
    new_calculated_15.setAttribute("id", "15%_value");
    new_calculated_15.innerHTML = json.calc_3;
    
    new_provided_calculation_3.appendChild(new_15_p);
    new_provided_calculation_3.appendChild(new_calculated_15);
    new_saved_container.appendChild(new_provided_calculation_3);




    let new_amount_due_label = document.createElement("label");
    new_amount_due_label.setAttribute("id","amount_due");
    new_amount_due_label.innerHTML = "Amount Due :";
    new_saved_container.appendChild(new_amount_due_label);



    let new_form_amount_due = document.createElement("form");
    new_form_amount_due.setAttribute("id", "form_amount_due");
    new_form_amount_due.setAttribute("class", "form_container");

    let new_amount_due = document.createElement("p");
    new_amount_due.setAttribute("id", "given_amount");
    new_amount_due.innerHTML = json.amount_due;
    new_form_amount_due.appendChild(new_amount_due);

    new_saved_container.appendChild(new_form_amount_due);




    let new_tip_label = document.createElement("label");
    new_tip_label.setAttribute("id","tip");
    new_tip_label.innerHTML = `+ Tip ${json.tip_percentage}`;
    new_saved_container.appendChild(new_tip_label);




    let new_form_tip = document.createElement("form");
    new_form_tip.setAttribute("id", "form_tip");
    new_form_tip.setAttribute("class", "form_container");

    let new_tip = document.createElement("p");
    new_tip.innerHTML = json.tip;
    new_form_tip.appendChild(new_tip);

    new_saved_container.appendChild(new_form_tip);




    let new_footer = document.createElement("p");
    new_footer.setAttribute("id", "footer");
    new_footer.innerHTML = " = Total / Person:";

    
    let new_total_cost = document.createElement("p");
    new_total_cost.setAttribute("id", "final_calculation");
    new_total_cost.innerHTML = json.price_per_person;

    new_saved_container.appendChild(new_footer);
    new_saved_container.appendChild(new_total_cost);


    //Adds everything to the webpage
    document.body.insertBefore(new_saved_container, previously_saved_form);

    return new_saved_container;




    

    




}

function delete_form(delete_button){
    let container = delete_button.parentElement;

    let id = container.id;

    let json = getAppropriateJSON(id);

    let index = appdata.indexOf(json);

    appdata.pop(index);
    container.remove();
}





function edit_mode(button){

    let container = button.parentElement;

    let previous_time_stamp = container.children[0];
    let total_calculation = container.children[11];

    total_calculation.remove();
    

    let people_form = container.children[2];
    let amount_form = container.children[7];
    let tip_form = container.children[9];
    let calculation = container.children[10];

    previous_time_stamp.remove();

    let people_input = people_form.children[0];
    let amount_input = amount_form.children[0];
    let tip_input = tip_form.children[0];




    let num_of_people = people_input.innerHTML;
    let amount_due = amount_input.innerHTML;
    let tip = tip_input.innerHTML;



    
    amount_input.remove();
    tip_input.remove();
    

    let new_people_input = document.createElement("input");

    new_people_input.setAttribute("type", "text");
    new_people_input.setAttribute("value", num_of_people);
    new_people_input.setAttribute("class", "people_input");
    new_people_input.setAttribute("onkeyup", "formatPeople(this)");
    new_people_input.setAttribute("onblur", "checkForValue(this)");

    people_form.insertBefore(new_people_input, people_input);

    people_input.remove();
    
    let new_amount_input = document.createElement("input");

    new_amount_input.setAttribute("type", "text");
    new_amount_input.setAttribute("id", "given_amount");
    new_amount_input.setAttribute("value", amount_due);
    new_amount_input.setAttribute("data", "currency");
    new_amount_input.setAttribute("placeholder", "$0.00");
    new_amount_input.setAttribute("onkeyup", "handle_amount_due(this)");
    new_amount_input.setAttribute("onblur", "handle_amount_due(this, 'blur')");

    amount_form.appendChild(new_amount_input);


    let new_tip_input = document.createElement("input");

    

    new_tip_input.setAttribute("type", "text");
    new_tip_input.setAttribute("id", "tip_amount");
    new_tip_input.setAttribute("value", tip);
    new_tip_input.setAttribute("data-type", 'currency');
    new_tip_input.setAttribute("placeholder", "$0.00");
    new_tip_input.setAttribute("onkeyup", "handle_tip(this)");
    new_tip_input.setAttribute("onblur", "handle_tip(this, 'blur')");

    tip_form.appendChild(new_tip_input);

    calculation.remove();

    let new_calculate_button = document.createElement("button");
    let new_save_icon = document.createElement("span");

    new_save_icon.setAttribute("class", "material-icons");
    new_save_icon.innerHTML = "save_alt";

    new_calculate_button.setAttribute("id", "footer");
    new_calculate_button.setAttribute("onclick","submit(this)");
    new_calculate_button.innerHTML = "Calculate ";
    new_calculate_button.appendChild(new_save_icon);

    container.appendChild(new_calculate_button);


    const get_date = function(){
        let d = new Date();
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let month = months[d.getMonth()]
        let year = d.getFullYear();
        let date = d.getDate();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        let tod = "am";

        if(minutes < 10){
             minutes = "0" + minutes;
        }
        if(hours > 12) {
            hours = hours - 12;
            tod = "pm";
        }
    
        let saved_time = "Saved on " + month + " " + date + ", " + year + " at " + hours + ":" + minutes + tod;
    }

    button.innerHTML = "delete";
    button.setAttribute("onclick", "delete_form(this)");
    

    

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
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.
  
  // get input value

  let input_val;


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
    

    let twenty_p = parent_container.children[1];
    let seventeen_p = parent_container.children[2];
    let fifteen_p = parent_container.children[3];

    if(parent_container.children.length === 10){
        twenty_p = parent_container.children[2];
        seventeen_p = parent_container.children[3];
        fifteen_p = parent_container.children[4];
    }

    let twenty_html = "$" + twenty_percent.toFixed(2);
    let seventeen_html = "$" + seventeen_point_five_percent.toFixed(2);
    let fifteen_html = "$" + fifteen_percent.toFixed(2);

    // If the user did not give any value for the Amount Due, keep the tip suggestions to their default value
    if(twenty_html === "$NaN"){
        twenty_html = "$_.__";
        seventeen_html = "$_.__";
        fifteen_html = "$_.__";
    }

    twenty_p.children[1].innerHTML = twenty_html;
    seventeen_p.children[1].innerHTML = seventeen_html;
    fifteen_p.children[1].innerHTML = fifteen_html;

}

/* 
    This function adds the actual percentage of the Amount Due that the user gave

    input: the actual "input" element that contains the value the user gave
    parent_container: the big white box element that the tip is being altered in
*/
function calculate_tip_percentage(input, parent_container){

    // Lets get the value the user actually gave for the tip
    let input_val = input.value;

    let num_of_elements = parent_container.children.length;

    //This is the element that writes out to the user "+ Tip"
    let tip_label = parent_container.children[6];

    if(num_of_elements === 10){
        // If the user is editing a calculation, the edit/delete button in the upper right hand corner, messes up which child
        // we want to grab. Here, we are making up for that.
        tip_label = parent_container.children[7];
    }


    
    if (input_val.length !== 0){
        // If we are inside here, it means the user actually gave a value for the tip

        // In order to perform calculations on the tip, we need to remove the commas and the $
        input_val = input_val.replace(',', '');
        input_val = input_val.replace('$', '');
    
        // We also need to make the tip value a actual number rather than a string, so we can calculate things with it
        let tip = parseFloat(input_val);

        

        // This gives us the form in which the total cost is located. The value for the cost is in one of it's child elements
        let amount_form = parent_container.children[5];

        if(num_of_elements === 10){

            // If the user is editing a calculation, the edit/delete button in the upper right hand corner, messes up which child
            // we want to grab. Here, we are making up for that.
            amount_form = parent_container.children[6];
        }

        let cost_val = amount_form.children[0].value;

        //Default (for when the user doesn't give a total amount due value)
        let percentage = 100;

        
        // cost_val is a string containing the AmountDue input. If there is any user input, the length would be greater than 0, but
        // if the user didn't give a value, the length of cost_val will be 0
        if(cost_val.length !== 0){
       
            //We want to reformat the input to something that can have calculations performed on it
            cost_val = cost_val.replace(',', '');
            cost_val = cost_val.replace('$', '');
            let total_cost = parseFloat(cost_val);

            // Lets make it not a decimal percentage
            percentage = (tip / total_cost) * 100;

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

    // This is the big white box/form being worked on
    let parent_container = calculate_button.parentElement;


    

    // // console.log(calculate_button);
    // if(container.className === "container"){
    //     // console.log("main form");
    //     new_saved_container = generateNewForm();
        
    // } 
    // else{
    //     // console.log("sub form");
    //     new_saved_container = generateNewForm(container);
    // }   





    let people_input = parent_container.children[0].children[0];
    let calc_1 = parent_container.children[1].children[1];
    let calc_2 = parent_container.children[2].children[1];
    let calc_3 = parent_container.children[3].children[1];
    let amount_due_input = parent_container.children[5].children[0];
    let tip_percentage = parent_container.children[6];
    let tip_input = parent_container.children[7].children[0];

    if(parent_container.children.length === 10){
        people_input = parent_container.children[1].children[0];
        calc_1 = parent_container.children[2].children[1];
        calc_2 = parent_container.children[3].children[1];
        calc_3 = parent_container.children[4].children[1];
        amount_due_input = parent_container.children[6].children[0];
        tip_percentage = parent_container.children[7];
        tip_input = parent_container.children[8].children[0];
    }

    console.log("tip_percentage", tip_percentage);
    
    // console.log("calc_1.value = ", calc_1.value);
    let values = { 
        "num_of_people": people_input.value, 
        "amount_due": amount_due_input.value,
        "tip": tip_input.value,
        "calc_1": calc_1.innerHTML,
        "calc_2": calc_2.innerHTML,
        "calc_3": calc_3.innerHTML,
        "tip_percentage": tip_percentage.innerHTML.substring(6)
    };
    
    appdata.push(values);

    let data = JSON.stringify(appdata);

    // create array
    // stringify array

    fetch('/submit', {
        method: 'POST',
        "body": data // Same thing as: "body" : body
    })
    .then(function( response ){
        //do something with the response
        return response.json()
    })
    .then(function(json) {
        //json is the array returned by the server
        console.log("json", json);
        appdata = json;

        generateNewForm(json[json.length - 1].id);
        if(parent_container.id === "0"){
            refresh_form();
        }
        else{
            parent_container.remove();
        }
        // generateNewForm(undefined, json[json.length - 1].id);
        
        
    })

    return false
}

function refresh_form(){
    let container = document.getElementById("0");

    container.children[0].children[0].value = 1;
    container.children[1].children[1].innerHTML = "$_.__";
    container.children[2].children[1].innerHTML = "$_.__";
    container.children[3].children[1].innerHTML = "$_.__";
    container.children[5].children[0].value = "";
    container.children[6].innerHTML = "+ Tip :";
    container.children[7].children[0].value = "";
    // container.children[3].children[1].innerHTML = "$_.__";

}


function getAppropriateJSON(id){
    for( i = 0; i < appdata.length; i++){
        let json = appdata[i];
        if(json.id === id){
            return json;
        }
    }

    return;
}


let appdata = [];
