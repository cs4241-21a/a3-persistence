loginForm = document.querySelector("form");

addEventListener("submit", e => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username === "" || password === ""){
        if(document.getElementById("error-msg") === null){
            const windowBody = document.getElementsByClassName("window-body").item(0);
            const msg = document.createElement("p");
            msg.setAttribute("id", "error-msg");
            msg.innerText = "Please enter a username and password";
            windowBody.prepend(msg);
        }
    }else{
        body = JSON.stringify({username, password})
        
        fetch("/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body
        })
        .then(res => {
            window.location.assign(res.url)
        })
    }

    
});