
// const login_button = document.getElementById( 'submit_button' )
// const create_act_btn = document.getElementById('create_account_submit_button')
// window.onload = function() {
//     login_button.onclick = submit_login
//     create_act_btn.onclick = create_account
// }
// const submit_login = function( e ) {
//     // prevent default form action from being carried out
//     e.preventDefault()
//     console.log("Started Log In function")
//
//     const input = document.querySelector( '#login_form' ).elements
//     var json = {}
//     for(var i = 0 ; i < input.length - 1 ; i++){ // Subtract 1 because we don't want to include the button
//         var item = input.item(i);
//         json[item.name] = item.value;
//     }
//
//     // Fetch
//     fetch('/login', {
//         method:'POST',
//         body: JSON.stringify(json),
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//         .then(res => {
//             if(res.url.includes('main.html')) {
//                 window.location.replace(res.url)
//             }
//         })
//     return false
// }
//
// const create_account = function( e ) {
//     // prevent default form action from being carried out
//     e.preventDefault()
//     console.log("Started Create User")
//
//     const input = document.querySelector( '#create_account_form' ).elements
//     var json = {}
//     for(var i = 0 ; i < input.length - 1 ; i++){ // Subtract 1 because we don't want to include the button
//         var item = input.item(i);
//         json[item.name] = item.value;
//     }
//
//     // Fetch
//     fetch('/new_user', {
//         method:'POST',
//         body: JSON.stringify(json),
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//         .then(res => {
//             if(res.url.includes('main.html')) {
//                 window.location.replace(res.url)
//             }
//         })
//     return false
// }