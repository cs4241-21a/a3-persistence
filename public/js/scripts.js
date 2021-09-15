// // Add some Javascript code here, to run on the front end.
//
// let appdata = []
// let table = document.getElementById("shopping_list");
//
// function update_table(data) {
//     let json_data = JSON.parse(data);
//     appdata = json_data["data"];
//     clear_table();
//     appdata.forEach(element => add_row(element["list_entry"], element["quantity"], element["urgency"], element["deadline"]));
// }
// // The line below is at the top of the document
// // let table = document.getElementById("shopping_list");
// function add_row(item, quantity, urgent, deadline) {
//     let row = table.insertRow(-1);
//
//     if(urgent) {
//         row.setAttribute("Style", "background-color: orange");
//     }
//     else {
//         row.setAttribute("Style", "background-color: yellow");
//     }
//
//     let cell1 = row.insertCell(0);
//     let cell2 = row.insertCell(1);
//     let cell3 = row.insertCell(2);
//     let cell4 = row.insertCell(3);
//
//     let cb = document.createElement('input');
//     cb.type = 'checkbox';
//     cb.value = 'false'
//     cb.addEventListener('change', (event) => {
//        toggle_got_item(cb, row, urgent);
//     });
//     cell4.appendChild(cb);
//
//     cell1.innerHTML = item;
//     cell2.innerHTML = quantity;
//     cell3.innerHTML = deadline
// }
// function clear_table() {
//     table = document.getElementById("shopping_list");
//     console.log(table.rows.length + " togo")
//
//     let nLength = 0;
//     while(table.rows.length > 1)
//     {
//         nLength = table.rows.length;
//         table.deleteRow(-1);
//         if (nLength == table.rows.length)
//         {
//             table.rows[nLength-1].outerHTML = '';
//         }
//     }
//
//
//     console.log(table.rows.length + " left")
// }
//
// function toggle_got_item(cb, row, urgent) {
//     if(cb.checked) {
//         row.setAttribute("Style", "background-color: green");
//     }
//     else {
//         if(urgent) {
//             row.setAttribute("Style", "background-color: orange");
//         }
//         else {
//             row.setAttribute("Style", "background-color: yellow");
//         }
//     }
//
// }
