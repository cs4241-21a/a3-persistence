// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");
  
let isUserEditing = false;
let nameEditing = '';
let countryEditing = '';
let ageEditing = '';


function edit_row(no)
{
    if(!isUserEditing){
 document.getElementById("edit_button"+no).style.display="none";
 document.getElementById("save_button"+no).style.display="block";
	
 var name=document.getElementById("name_row"+no);
 var country=document.getElementById("country_row"+no);
 var age=document.getElementById("age_row"+no);
	
 var name_data=name.innerHTML;
 var country_data=country.innerHTML;
 var age_data=age.innerHTML;
	
 name.innerHTML="<input type='text' id='name_text"+no+"' value='"+name_data+"'>";
 country.innerHTML="<input type='text' id='country_text"+no+"' value='"+country_data+"'>";
 age.innerHTML="<input type='text' id='age_text"+no+"' value='"+age_data+"'>";
 nameEditing = name_data;
 countryEditing = country_data;
 ageEditing = age_data;

 isUserEditing = true;
    }
    else{
        console.log('can only edit one thing at a time!')
    }
}



function save_row(no)
{
 var name_val=document.getElementById("name_text"+no).value;
 var country_val=document.getElementById("country_text"+no).value;
 var age_val=document.getElementById("age_text"+no).value;

 document.getElementById("name_row"+no).innerHTML=name_val;
 document.getElementById("country_row"+no).innerHTML=country_val;
 document.getElementById("age_row"+no).innerHTML=age_val;

 document.getElementById("edit_button"+no).style.display="block";
 document.getElementById("save_button"+no).style.display="none";

 json = { username: '', name: name_val, country: country_val, age: age_val, nameEditing: nameEditing, countryEditing: countryEditing, ageEditing: ageEditing},
       body = JSON.stringify(json);
 fetch('/api/user/editData', {
    method: 'POST',
    headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
    body: body
  })
  .then(res => res) // parse the JSON from the server
  .then(data => {
    });

    isUserEditing = false;
}

function delete_row(no)
{
    var name_val=document.getElementById("name_row"+no).textContent;
    var country_val=document.getElementById("country_row"+no).textContent;
    var age_val=document.getElementById("age_row"+no).textContent;
 

 json = { username: '', name: name_val, country: country_val, age: age_val},
 body = JSON.stringify(json);

fetch('/api/user/deleteData', {
method: 'POST',
headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
body: body
})
.then(res => res) // parse the JSON from the server
.then(data => {
});

document.getElementById("row"+no+"").outerHTML="";
}

function add_row()
{
 var new_name=document.getElementById("new_name").value;
 var new_country=document.getElementById("new_country").value;
 var new_age=document.getElementById("new_age").value;
	
 var table=document.getElementById("data_table");
 var table_len=(table.rows.length)-1;
 var row = table.insertRow(table_len).outerHTML="<tr style='background-color:Cyan' id='row"+table_len+"'><td id='name_row"+table_len+"'>"+new_name+"</td><td id='country_row"+table_len+"'>"+new_country+"</td><td id='age_row"+table_len+"'>"+new_age+"</td><td><input type='button' id='edit_button"+table_len+"' value='Edit' class='edit' onclick='edit_row("+table_len+")'> <input type='button' id='save_button"+table_len+"' value='Save' class='save' onclick='save_row("+table_len+")'> <input type='button' value='Delete' class='delete' onclick='delete_row("+table_len+")'></td></tr>";

 document.getElementById("new_name").value="";
 document.getElementById("new_country").value="";
 document.getElementById("new_age").value="";

json = { username: '', name: new_name, country: new_country, age: new_age},
       body = JSON.stringify(json);
 fetch('/api/user/newData', {
          method: 'POST',
          headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
          body: body
        })
        .then(res => res) // parse the JSON from the server
        .then(data => {
          });
}

function add_rowFromServer(name, country, age)
{
 var table=document.getElementById("data_table");
 var table_len=(table.rows.length)-1;
 var row = table.insertRow(table_len).outerHTML="<tr style='background-color:Tan' id='row"+table_len+"'><td id='name_row"+table_len+"'>"+name+"</td><td id='country_row"+table_len+"'>"+country+"</td><td id='age_row"+table_len+"'>"+age+"</td><td><input type='button' id='edit_button"+table_len+"' value='Edit' class='edit' onclick='edit_row("+table_len+")'> <input type='button' id='save_button"+table_len+"' value='Save' class='save' onclick='save_row("+table_len+")'> <input type='button' value='Delete' class='delete' onclick='delete_row("+table_len+")'></td></tr>";

}
// const login = function (e) {
//     //prevent default form action from being carried out
//     e.preventDefault();
  
//         const input = document.querySelector( '#username' ),
//         input2 = document.querySelector( '#password' ),
//               json = { username: input.value, password: input2.value},
//       body = JSON.stringify(json);
//       console.log(body);
//     fetch('/api/user/login', {
//       method: 'POST',
//       headers: {
//               'Accept': 'application/json, text/plain, */*',
//               'Content-Type': 'application/json'
//             },
//       body: body
//     })
//       .then(function( res ) {
//         return res.json();
//       })
//       .then(function (json) {
//           //returned data in json 
//           console.log(json)
//       });
//       return false;
//   }

// const login = function (e) {
//     //prevent default form action from being carried out
//     e.preventDefault();
  
//         const input = document.querySelector( '#username' ),
//         input2 = document.querySelector( '#password' ),
//               json = { username: input.value, password: input2.value},
//       body = JSON.stringify(json);
//       console.log(body);
//     fetch('/api/user/login', {
//       method: 'POST',
//       headers: {
//               'Accept': 'application/json, text/plain, */*',
//               'Content-Type': 'application/json'
//             },
//       body: body
//     })
//       .then(function( res ) {
//         return res.json();
//       })
//       .then(function (json) {
//           //returned data in json 
//           console.log(json)
//       });
//       return false;
//   }





window.onload = function() {
    fetch("/api/user/getData")
    .then(response => response.json()) // parse the JSON from the server
    .then(data => {
        for (var i = 0; i < data.length; i++) { 
            add_rowFromServer(data[i].name, data[i].country, data[i].age);
        }
      });
  }
