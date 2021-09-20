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
  let deadline_data = document.getElementById("deadline_row"+no).innerHTML;
  let grade_data;

  if(document.getElementById("new_grade_A"+no).checked)
  {
    grade_val = document.getElementById("new_grade_A"+no).value;
  } else if(document.getElementById("new_grade_B"+no).checked) {
    grade_val = document.getElementById("new_grade_B"+no).value;
  } else if(document.getElementById("new_grade_C"+no).checked) {
    grade_val = document.getElementById("new_grade_C"+no).value;
  }

  const json = {
    _id: databaseIds[no-1],
    assignment: assignment_data,
    course: course_data,
    percentage: parseInt(percentage_data),
    priority: priority_data,
    deadline: deadline_data,
    grade: grade_data,
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
  let deadline_val = document.getElementById("deadline_text"+no).value;
  let grade_val;

  if(document.getElementById("new_grade_A"+no).checked)
  {
    grade_val = document.getElementById("new_grade_A"+no).value;
  } else if(document.getElementById("new_grade_B"+no).checked) {
    grade_val = document.getElementById("new_grade_B"+no).value;
  } else if(document.getElementById("new_grade_C"+no).checked) {
    grade_val = document.getElementById("new_grade_C"+no).value;
  }

  document.getElementById("assignment_row"+no).innerHTML=assignment_val;
  document.getElementById("course_row"+no).innerHTML=course_val;
  document.getElementById("percentage_row"+no).innerHTML=percentage_val;
  document.getElementById("deadline_row"+no).innerHTML=deadline_val;
  document.getElementById("new_grade_" + grade_val + "" +no).checked=true;

  const json = {
    _id: databaseIds[no-1],
    assignment: assignment_val,
    course: course_val,
    percentage: parseInt(percentage_val),
    priority: "TBD",
    deadline: deadline_val,
    grade: grade_val,
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

  document.getElementById("edit_button"+no).disabled=false;
  document.getElementById("save_button"+no).disabled=true;
  document.getElementById("new_grade_A"+no).disabled=true;
  document.getElementById("new_grade_B"+no).disabled=true;
  document.getElementById("new_grade_C"+no).disabled=true;

  return false
}

function edit_row ( no ) {
  document.getElementById("edit_button"+no).disabled=true;
  document.getElementById("save_button"+no).disabled=false;
  document.getElementById("new_grade_A"+no).disabled=false;
  document.getElementById("new_grade_B"+no).disabled=false;
  document.getElementById("new_grade_C"+no).disabled=false;
  
  itemIndex = parseInt(no);

  let assignment = document.getElementById("assignment_row"+no);
  let course = document.getElementById("course_row"+no);
  let percentage = document.getElementById("percentage_row"+no);
  let deadline = document.getElementById("deadline_row"+no);
  let new_grade_A = document.getElementById("new_grade_A"+no);
  let new_grade_B = document.getElementById("new_grade_B"+no);
  let new_grade_C = document.getElementById("new_grade_C"+no);

  let assignment_data = assignment.innerHTML;
  let course_data = course.innerHTML;
  let percentage_data = percentage.innerHTML;
  let deadline_data = deadline.innerHTML;
  let new_grade_A_data = new_grade_A.checked;
  let new_grade_B_data = new_grade_B.checked;
  let new_grade_C_data = new_grade_C.checked;

  assignment.innerHTML="<input type='text' id='assignment_text"+no+"' value='"+assignment_data+"'>";
  course.innerHTML="<input type='text' id='course_text"+no+"' value='"+course_data+"'>";
  percentage.innerHTML="<input type='text' id='percentage_text"+no+"' value='"+percentage_data+"'>";
  deadline.innerHTML="<input type='date' id='deadline_text"+no+"' value='"+deadline_data+"'>";

  new_grade_A = "<input type='radio' id='new_grade_A"+no+"' value='"+new_grade_A_data+"'>";
  new_grade_B = "<input type='radio' id='new_grade_B"+no+"' value='"+new_grade_B_data+"'>";
  new_grade_C = "<input type='radio' id='new_grade_C"+no+"' value='"+new_grade_C_data+"'>";
}

const add_row = function( elt ) {
  // prevent default form action from being carried out
  elt.preventDefault();

  const new_assignment = document.getElementById("new_assignment").value;
  const new_course = document.getElementById("new_course").value;
  const new_percentage = document.getElementById("new_percentage").value;
  const new_deadline = document.getElementById("new_deadline").value;
  const new_grade = hwTable.querySelector('input[name=new_grade]:checked').value;

  const json = {
    assignment: new_assignment,
    course: new_course,
    percentage: parseInt(new_percentage),
    priority: "TBD",
    deadline: new_deadline,
    grade: new_grade,
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
  +"'>"+new_priority+"</td><td id='deadline_row"+table_len+"'>"+new_deadline+"</td><td><input type='radio' id='new_grade_A"+table_len+"' name='new_grade"+table_len+"' value='A'>"+
  "<label for='grade_A"+table_len+"' >A</label>"+"<input type='radio' id='new_grade_B"+table_len+"' name='new_grade"+table_len+"' value='B'>"+
  "<label for='grade_B"+table_len+"' >B</label>"+"<input type='radio' id='new_grade_C"+table_len+"' name='new_grade"+table_len+"' value='C'>"+
  "<label for='grade_C"+table_len+"' >C</label>"+"</td><td><input type='button' id='edit_button" +table_len+"' value='Edit' class='edit' onclick='edit_row("+table_len+")'> <input type='button' id='save_button"+table_len
  +"' value='Save' class='save' disabled=false onclick='save_row("+table_len+")'> <input type='button' value='Mark Completed' class='complete' onclick='mark_completed("+table_len+")'></td></tr>";

  document.getElementById("new_assignment").value="";
  document.getElementById("new_course").value="";
  document.getElementById("new_percentage").value="";
  document.getElementById("new_priority").value="calculated automatically";
  document.getElementById("new_deadline").value="";
  document.getElementById("new_grade_A").checked=false; // see what happens
  document.getElementById("new_grade_B").checked=false;
  document.getElementById("new_grade_C").checked=false;
  document.getElementById("new_grade_A"+table_len+"").disabled=true;
  document.getElementById("new_grade_B"+table_len+"").disabled=true;
  document.getElementById("new_grade_C"+table_len+"").disabled=true;
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
      document.getElementById("deadline_row"+no+"").innerHTML= appdata[i].deadline;
      document.getElementById('new_grade_'+appdata[i].grade+""+no+"").checked = true;
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
      document.getElementById("deadline_row"+no+"").innerHTML = appdata[i].deadline;
      document.getElementById('new_grade_'+appdata[i].grade+""+no+"").checked = true;
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
        document.getElementById("deadline_row"+no+"").innerHTML = appdata[i].deadline;
        document.getElementById('new_grade_'+appdata[i].grade+""+no+"").checked = true;
        }
        document.getElementById("hwTable").deleteRow(no+1);

        databaseIds.pop()
        for (let i = 0; i < appdata.length; i++) {
          databaseIds[i] = appdata[i]._id;
        }
    }
  })
}