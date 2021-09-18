window.onload = function() {
    const button = document.getElementById( 'btn_register' )
    button.onclick = showCreationWindow
    

    console.log("crete")
  }

const showCreationWindow = function(){
  console.log("crsade222te")
    document.getElementById("popup_1").classList.toggle("active")
    const button = document.getElementById( 'btn_create' )
    button.onclick = createAccount
    
  }

function closeEdit() {
    document.getElementById("popup_1").classList.remove("active")
}

function createAccount() {
  console.log("crsadete")

    console.log("in create")
    const json = {
        username:  document.getElementById("enterName").value,
        email: document.getElementById("enterEmail").value,
        password: document.getElementById("enterPassword").value
    }

    let body = JSON.stringify(json)
    console.log(body)
    if (json['username'] === ""  || json['email'] === ""   || json['password'] === "" )
      alert("Please fill in all field before submitting!")
    else{
        fetch( '/createAccount', {
            method:'POST',
            body,
            headers:{
              "Content-Type":"application/json"
            }
          })
          .then( response => {return response.json()})
          .then(json => {
            if(json.isValid){
              closeEdit()
            }
            else{
              console.log("Error when creating account")
            }
            document.getElementById('enterPassword').value = ""
            document.getElementById('enterName').value = ""
            document.getElementById('enterEmail').value = ""
          }) 
    }
}