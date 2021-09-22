const login = function(e){
  e.preventDefault()
  const input_username = document.querySelector( '#susername' ),
        input_password = document.querySelector( '#spassword' )
  if (input_password.value.length === 0 || input_username.value.length === 0){
    alert("please input a valid username or password")
    return false
  }
  const json = {username:input_username.value, password:input_password.value},
        body = JSON.stringify(json)
    
  fetch('/login', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  })
  .then(function(response){
    if (response.redirected){
      window.location = response.url
      alert("Welcome")
    }
    else {
      alert("Account and password do not match")
    }
  })
}
  
const create = function(e){
  e.preventDefault()
  const input_username = document.querySelector( '#cusername' ),
        input_password = document.querySelector( '#cpassword' )
  if (input_password.value.length === 0 || input_username.value.length === 0){
    alert("please input a valid username or password")
    return false
  }
  const json = {username:input_username.value, password:input_password.value},
        body = JSON.stringify(json)
  fetch('/create', {
    method:'POST',
    headers: { 'Content-Type': 'application/json'},
    body
  })
  .then(response=>response.json())
  .then(function(response){
    alert(response)
  })
}

function updatefromDB(){
  fetch("/getdata")
  .then(response => response.json())
  .then(tasks => {
    //tasksList.firstElementChild.remove();
    while(tasksList.firstChild) tasksList.removeChild(tasksList.firstChild);
    // iterate through every task and add it to our page
    tasks.forEach(function(task){appendNewTask(task.task, task.priority,task.starttime, task._id)});
  });
}