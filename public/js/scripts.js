// Add some Javascript code here, to run on the front end.
console.log("Welcome to assignment 3!")

const hwTable = document.getElementById('hwTable');
let appdata;
let itemIndex = 1;
let databaseIds = [];

window.onload = function() {
  const btnAdd = document.getElementById("addRow")   
  btnAdd.onclick = add_row;
}

function mark_completed( no ) {
  let assignment_data = document.getElementById("assignment_row"+no).innerHTML;
  let course_data = document.getElementById("course_row"+no).innerHTML;
  let percentage_data = document.getElementById("percentage_row"+no).innerHTML;
  let priority_data = document.getElementById("priority_row"+no).innerHTML;

  const json = {
    _id: databaseIds[no-1],
    assignment: assignment_data,
    course: course_data,
    percentage: parseInt(percentage_data),
    priority: priority_data,
    itemIndex: parseInt(no)
  }

  fetch( '/complete', {
    method: 'POST',
    body:JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then ( response => response.json() )
  .then ( json => {
    console.log("Complete request complete")
    refreshComplete();
  })

  itemIndex--;
  return false
}

function save_row( no ) {
  let assignment_val = document.getElementById("assignment_text"+no).value;
  let course_val = document.getElementById("course_text"+no).value;
  let percentage_val = document.getElementById("percentage_text"+no).value;

  document.getElementById("assignment_row"+no).innerHTML=assignment_val
  document.getElementById("course_row"+no).innerHTML=course_val;
  document.getElementById("percentage_row"+no).innerHTML=percentage_val;

  const json = {
    _id: databaseIds[no-1],
    assignment: assignment_val,
    course: course_val,
    percentage: parseInt(percentage_val),
    priority: "TBD",
    itemIndex: parseInt(no)
  }

  fetch( '/edit', {
    method: 'POST',
    body:JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then ( response => response.json() )
  .then ( json => {
    console.log("Edit request complete")
    refreshEdit();
  })

  document.getElementById("save_button"+no).style.display="none";
  document.getElementById("edit_button"+no).style.display="inline";

  return false
}

function edit_row ( no ) {
  document.getElementById("edit_button"+no).style.display="none";
  document.getElementById("save_button"+no).style.display="inline";
  itemIndex = parseInt(no);

  let assignment = document.getElementById("assignment_row"+no);
  let course = document.getElementById("course_row"+no);
  let percentage = document.getElementById("percentage_row"+no);

  let assignment_data = assignment.innerHTML;
  let course_data = course.innerHTML;
  let percentage_data = percentage.innerHTML;

  assignment.innerHTML="<input type='text' id='assignment_text"+no+"' value='"+assignment_data+"'>";
  course.innerHTML="<input type='text' id='course_text"+no+"' value='"+course_data+"'>";
  percentage.innerHTML="<input type='text' id='percentage_text"+no+"' value='"+percentage_data+"'>";
}

const add_row = function( elt ) {
  // prevent default form action from being carried out
  elt.preventDefault();

  const new_assignment = document.getElementById("new_assignment").value;
  const new_course = document.getElementById("new_course").value;
  const new_percentage = document.getElementById("new_percentage").value;

  const json = {
    assignment: new_assignment,
    course: new_course,
    percentage: parseInt(new_percentage),
    priority: "TBD",
    itemIndex: parseInt(itemIndex)
  }

  fetch( '/add', {
    method: 'POST',
    body:JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then ( response => response.json() )
  .then ( json => {
    console.log("Add request complete")
    refreshAdd();
  })

  let table=document.getElementById('hwTable');
  let table_len=(table.rows.length)-1;
  let row = table.insertRow(table_len).outerHTML="<tr id='row"+table_len+"'><td id='assignment_row"+table_len+"'>"+new_assignment
  +"</td><td id='course_row"+table_len+"'>"+new_course+"</td><td id='percentage_row"+table_len+"'>"+new_percentage+"</td><td id='priority_row"+table_len
  +"'>"+new_priority+"</td><td><input type='button' id='edit_button" +table_len+"' value='Edit' class='edit' onclick='edit_row("+table_len+")'> <input type='button' id='save_button"+table_len
  +"' value='Save' class='save' onclick='save_row("+table_len+")'> <input type='button' value='Mark Completed' class='complete' onclick='mark_completed("+table_len+")'></td></tr>";

  document.getElementById("new_assignment").value="";
  document.getElementById("new_course").value="";
  document.getElementById("new_percentage").value="";
  document.getElementById("new_priority").value="calculated automatically";
  itemIndex++;

  return false
}






function refreshAdd() {
  fetch('/add', {
    method: 'GET'
  }).then(function (response) {
    return response.json(); 
  }).then(function (data) {
    appdata = data;
    console.log("\nNew Data" + JSON.stringify(appdata))

    let no = 0;
    for (let i = 0; i < appdata.length; i++) {
      no = i+1;
      document.getElementById("assignment_row"+no+"").innerHTML= appdata[i].assignment;
      document.getElementById("course_row"+no+"").innerHTML= appdata[i].course;
      document.getElementById("percentage_row"+no+"").innerHTML= appdata[i].percentage;
      document.getElementById("priority_row"+no+"").innerHTML = appdata[i].priority;
    }
    for (let i = 0; i < appdata.length; i++) {
      databaseIds[i] = appdata[i]._id;
    }
});
}

function refreshEdit() {
  fetch('/edit', {
    method: 'GET'
  }).then(function (response) {
      return response.json(); 
  }).then(function (data) {
    appdata = data;
    console.log("\nUpdated Data" + JSON.stringify(appdata))

    let no = 0;
    for (let i = 0; i < appdata.length; i++) {
      no = i+1;
      document.getElementById("assignment_row"+no+"").innerHTML= appdata[i].assignment;
      document.getElementById("course_row"+no+"").innerHTML= appdata[i].course;
      document.getElementById("percentage_row"+no+"").innerHTML= appdata[i].percentage;
      document.getElementById("priority_row"+no+"").innerHTML = appdata[i].priority;
    }

    for (let i = 0; i < appdata.length; i++) {
      databaseIds[i] = appdata[i]._id;
    }
})
}

function refreshComplete() {
  fetch('/complete', {
    method: 'GET'
  }).then(function (response) {
    return response.json(); 
  }).then(function (data) {
    appdata = data;

    console.log("\nData after Delete " + JSON.stringify(appdata))
    if(appdata.length == 0) {
      document.getElementById("hwTable").deleteRow(1);
    }
    else {
      let no = 0;
        for (let i = 0; i < appdata.length; i++) {
        no = i+1;
        document.getElementById("assignment_row"+no+"").innerHTML= appdata[i].assignment;
        document.getElementById("course_row"+no+"").innerHTML= appdata[i].course;
        document.getElementById("percentage_row"+no+"").innerHTML= appdata[i].percentage;
        document.getElementById("priority_row"+no+"").innerHTML = appdata[i].priority;
        }
        document.getElementById("hwTable").deleteRow(no);

        databaseIds.pop()
        for (let i = 0; i < appdata.length; i++) {
          databaseIds[i] = appdata[i]._id;
        }
    }
  })
}