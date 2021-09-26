// client-side js, loaded by index.html
// run by the browser each time the page is loaded
let editDream;
let lastClickedEdit;

window.onload = function(){
  // define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");



// a helper function that creates a list item for a given dream
function appendNewDream(dream) {
  
  
  const newListItem = document.createElement("li");
  newListItem.innerText = "complete " + dream.dream + " by " + dream.dreamtime + ", priority is " + dream.dreampriority;
  
  if(dream.dreampriority == "high"){
    newListItem.style.backgroundColor = '#f59d9d'
  } else if (dream.dreampriority == "medium"){
    newListItem.style.backgroundColor = '#f5df9d'
  } else if (dream.dreampriority == "low"){
    newListItem.style.backgroundColor = '#bad9a5'
  }
  
  newListItem.id = dream._id
  
  console.log(newListItem)
  
  let delBtn = document.createElement('button')
  delBtn.innerHTML = "delete"
  newListItem.appendChild(delBtn)
  
  let editBtn = document.createElement('button')
  editBtn.innerHTML = "edit"
  newListItem.appendChild(editBtn)
  
  delBtn.onclick = function(){
    fetch("/delete", {
    method: "POST",
    body: JSON.stringify({ id: newListItem.id}),
    headers: {
      "Content-Type": "application/json"
    }
  })
    // get dream value and delete it from the list
    .then(response => response.json())
    .then(json => {
      newListItem.remove()
    });
  }
  
  
  editBtn.onclick = function(e){
    editDream = e.target.parentNode.id;
    lastClickedEdit = newListItem.id
    fetch("/getdream", {
    method: "POST",
    body: JSON.stringify({ id: newListItem.id }),
    headers: {
      "Content-Type": "application/json"
    }
      
  })
    
    .then(response => {
    return response.json()})
    .then(json => {
      dreamsForm.elements.dream.value = json[0].dream
      dreamsForm.elements.dreamtime.value = json[0].dreamtime
      dreamsForm.elements.priority.value = json[0].priority
      
      let addButton = document.getElementById("submit-dream")
      addButton.innerText = "Save"
      
      
    });
  }
  
  dreamsList.appendChild(newListItem);
}

// fetch the initial list of dreams
fetch("/getdata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
})
  
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    // remove the loading text
    dreamsList.firstElementChild.remove();

    // iterate through every dream and add it to our page
    dreams.forEach(appendNewDream);
  });

// listen for the form to be submitted and add a new dream when it is
dreamsForm.addEventListener("submit", event => {
  
  // stop our form submission from refreshing the page
  event.preventDefault();
  let addButton = document.getElementById("submit-dream")
  
  if(addButton.innerText == "ADD"){
    console.log("i am here")
    
      fetch("/add", {
      method: "POST",
      body: JSON.stringify({ dream: dreamsForm.elements.dream.value, 
                            dreamtime: dreamsForm.elements.dreamtime.value, 
                            dreampriority: dreamsForm.elements.priority.value }),
      headers: {
        "Content-Type": "application/json"
      }
  })
    // get dream value and add it to the list
    .then(response => response.json())
    .then(json => {
      appendNewDream(json[0]);
    });
    
    
    
  } else if(addButton.innerText == "SAVE"){
    console.log("im here woot")
    
    let dreamEdit = dreamsForm.elements.dream.value
    let timeEdit = dreamsForm.elements.dreamtime.value
    let priorityEdit = dreamsForm.elements.priority.value
   fetch("/edit", {
      method: "POST",
      body: JSON.stringify({ id: lastClickedEdit, newData: {dream: dreamEdit, 
                            dreamtime: timeEdit, 
                            dreampriority: priorityEdit }}),
      headers: {
        "Content-Type": "application/json"
      }
  })
    // get dream value and add it to the list
    .then(response => response.json())
    .then(json => {
         let listElement = document.getElementById(editDream).innerText = "complete " + dreamEdit 
                                                                           + " by " +  timeEdit + 
                                                                          ", priority is " + priorityEdit;
    });
    
    addButton.innerText= "Add"
  }



  // reset form
  dreamsForm.reset();
  dreamsForm.elements.dream.focus();
});

}
