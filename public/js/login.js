window.onload = function() {

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});

    const button = document.getElementById( 'btn_register' )
    button.onclick = showCreationWindow

    const btn_login = document.getElementById('btn_login')
    btn_login.onclick = attemptLogin
  }

const showCreationWindow = function(){
 
    document.getElementById("popup_1").classList.toggle("is-active")
    const button = document.getElementById( 'btn_create' )
    button.onclick = createAccount
    
  }

const attemptLogin = function(){
  const password = document.getElementById( 'loginPassword' ).value
  const name = document.getElementById('loginName').value

  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({
      password: password,
      username: name
    }),
    headers:{
      "Content-Type":"application/json"
    }
  })
  .then(res => {
    return res.json()
  }) 
  .then(json => {
    if(json.worked){
      document.getElementById( 'loginPassword' ).value = ""
      document.getElementById( 'loginName' ).value = ""
      window.location.href = '/main.html'
    }
    else {
      document.getElementById( 'loginPassword' ).value = ""
      document.getElementById( 'loginName' ).value = ""
      document.getElementById("wrong_info").classList.remove("is-hidden")
      
    }
  })
}

function closeEdit() {
    document.getElementById("popup_1").classList.remove("is-active")
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
              document.getElementById('username_avail').classList.add('is-hidden')
              document.getElementById('enterName').classList.remove('is-danger')
              document.getElementById('enterPassword').value = ""
              document.getElementById('enterName').value = ""
              document.getElementById('enterEmail').value = ""
              closeEdit()
            }
            else{
              console.log("Error when creating account")
              document.getElementById('username_avail').classList.remove('is-hidden')
              document.getElementById('enterName').classList.add('is-danger')
            }
        
          }) 
    }
}