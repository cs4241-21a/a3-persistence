// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// define variables that reference elements on our page
const dreamsList = document.getElementById("data");
const dreamsForm = document.querySelector("form");

const user = document.getElementById("user");
const pass = document.getElementById("pass");

// a helper function that creates a list item for a given dream
function appendNewDream(val) {
  const newListItem = document.createElement("li");
  newListItem.innerText = val['username'];
  dreamsList.appendChild(newListItem);
}




// fetch the initial list of dreams
fetch("/userdata")
  .then(response => response.json()) // parse the JSON from the server
  .then(response => {
  
  
    dreamsForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();
      
      const data = { 'username': user.value, 'password': pass.value}
      
      
      fetch("/login",{
        method : 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => response.json())
        .then(response => {
  
        dreamsList.innerHTML = '';
      

          var num = 0;
        
            var obj = response[0];

            if(response.length > 0){ 
              const newListItem = document.createElement("li");
              newListItem.innerText = "Welcome " + obj.username
              dreamsList.appendChild(newListItem);
              num = 1
            } else {
              const newListItem = document.createElement("li");
              newListItem.innerText = "Login Failed, New user created"
              dreamsList.appendChild(newListItem);
            }
        
            for(var i = 3; i < Object.keys(obj).length; i++){
              const newListItem = document.createElement("li");
              var val = i;
              newListItem.innerText = obj.data
              dreamsList.appendChild(newListItem);
            }
              
              const newListItem1 = document.createElement("input");
              newListItem1.innerText = ""
              dreamsList.appendChild(newListItem1);
       
              const newListItem2 = document.createElement("button");
              newListItem2.innerText = "add"
              dreamsList.appendChild(newListItem2);

      })
          
        
            
      

      
      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
    });
  });
