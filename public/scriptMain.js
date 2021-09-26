      var myform = document.getElementById("addform");
      myform.style.display = "none";
      var editform = document.getElementById("editform");
      editform.style.display = "none";
      
      const servantsList = document.getElementById("servants");

      const openaddform = function( e ) {
        e.preventDefault()
        if(myform.style.display==="none"){
          myform.style.display = "block";
        }
        else {
          myform.style.display = "none";
        }
      }
      
      
      
      function updatefromDB(){
        fetch("/getdata", {
          method:'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(servants => {
          while(servantsList.firstChild) servantsList.removeChild(servantsList.firstChild);
          
          var hrow = document.createElement("tr");
          hrow.innerHTML = "<tr><th>Name</th><th>Ocuupation</th><th>Attack</th><th>Defense</th><th>Delete</th><th>Edit</th></tr>";
          servantsList.append(hrow);
          
          servants.forEach(function(servant){appendServant(servant.servantname, servant.occupation,servant.attack, servant.defense, servant._id)});
        });
      }

      function appendServant(name, occupation, attack, defense, id){
        const list = document.createElement("tr");
        const editb = document.createElement("Button");
        const deleteb = document.createElement("Button");
        editb.innerText = "edit";
        editb.className = "edit";
        deleteb.innerText = "delete";
        deleteb.className = "close";
        
        var cell_name = document.createElement("td");
        cell_name.append(document.createTextNode(name));
        var cell_occupation = document.createElement("td");
        cell_occupation.append(document.createTextNode(occupation));
        var cell_attack = document.createElement("td");
        cell_attack.append(document.createTextNode(attack));
        var cell_defense = document.createElement("td");
        cell_defense.append(document.createTextNode(defense)); 
        var cell_delete = document.createElement("td");
        cell_delete.append(deleteb);
        var cell_edit = document.createElement("td");
        cell_edit.append(editb);
        
        deleteb.onclick = function(){
          fetch('/delete', {
            method:'POST',
            body: JSON.stringify({id}),
            headers:{'Content-type':'application/json'}
          })
          .then(response => response.JSON)
          .then(json => list.remove())
        }
        
        editb.onclick = function(){
          if(editform.style.display==="none"){
            editform.style.display = "block";
            const saveb = document.getElementById("saveb");
            
            saveb.onclick = function(){
              let newname = document.getElementById("newservantname");
              if (newname.value === ""){
                alert("Can't use null name!")
              }
              else{              
                fetch('/update', {
                  method:'POST',
                  body:JSON.stringify({id:id, servantname:newname.value}),
                  headers:{'Content-type':'application/json'}
                })
                .then(function update(){
                  editform.style.display = "none";
                  updatefromDB();
                })
              }
            }
            
          }
          else {
            editform.style.display = "none";
          }
        }
        
        list.append(cell_name);
        list.append(cell_occupation);
        list.append(cell_attack);
        list.append(cell_defense);
        list.append(cell_delete);
        list.append(cell_edit);
  
        servantsList.appendChild(list);
      }

  const submit = function( e ) {
    e.preventDefault()
    var occupation = get_occupation_selected();
    const input = document.querySelector( '#servantname' );

    if(input.value === "" || occupation === "None"){
      alert("The information submited is not completed")
    }
    else{
      const json = { username:"null", servantname:input.value, occupation:occupation, attack:generateServantAttribute(occupation), defense:generateServantAttribute(occupation)},
      body = JSON.stringify( json )

      fetch( '/add', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body 
      })
      .then( response => response.json() )
      .then( json => {
        myform.style.display = "none";
        updatefromDB();
      })
    }
    

  }
  
  function get_occupation_selected(){
      var saber_check = document.getElementById("saber").checked;
      var lancer_check = document.getElementById("lancer").checked;
      var archer_check = document.getElementById("archer").checked;
      var caster_check = document.getElementById("caster").checked;
      var rider_check = document.getElementById("rider").checked;
      var assassin_check = document.getElementById("assassin").checked;

      if (saber_check === true){
        return "Saber";
      }
      else if (lancer_check === true){
        return "Lancer";
      }
      else if (archer_check === true){
        return "Archer";
      }
      else if (caster_check === true){
        return "Caster";
      }
      else if (rider_check === true){
        return "Rider";
      }
      else if (assassin_check === true){
        return "Assassin";
      }
      else{
        return "None";
      }
    }

function generateServantAttribute( occup ){
  if(occup === "Saber"){
    return getRandomAttribute(1,2);
  }
  else if(occup === "Lancer"){
    return getRandomAttribute(2,3);
  }
  else if(occup === "Archer"){
    return getRandomAttribute(1,4);
  }
  else if(occup === "Caster"){
    return getRandomAttribute(1,5);
  }
  else if(occup === "Rider"){
    return getRandomAttribute(2,5);
  }
  else if(occup === "Assassin"){
    return getRandomAttribute(2,6);
  }
}
      
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

function getRandomAttribute(min, max){
  //range: high (EX, A), mid (A, B, C), low (C, D, E)
  let range = getRandomInt(min, max);

  if (range === 1){
    let num = getRandomInt(1, 20);
    if (num === 1 ){
      return "EX";
    }
    else if (num === 2 || num === 3){
      return "A++"
    }
    else if (num >= 4 && num <= 7){
      return "A+"
    }
    else if (num >= 8 && num <= 14){
      return "A"
    }
    else{
      return "A-"
    }
  }
  else if (range === 2 || range === 3){
    let num = getRandomInt(1, 10);
    if (num === 1 ){
      return "A--";
    }
    else if (num >= 2 && num <= 5){
      return "B";
    }
    else{
      return "C";
    }
  }
  else {
    let num = getRandomInt(1, 5);
    if (num === 1){
      return "C";
    }
    else if (num >=2 && num <= 4){
      return "D";
    }
    else{
      return "E";
    }
  }

}
       
  window.onload = function(){
    const button_open_add_form = document.querySelector( '#addb' )
    button_open_add_form.onclick = openaddform
        
    const button_show_servants = document.querySelector( '#resultb' )
    button_show_servants.onclick = updatefromDB
    
    const button_submit = document.querySelector('#submitb')
    button_submit.onclick = submit
  }