const orderBox = document.getElementsByClassName("order-box").item(0);

fetch("/username")
.then((res) => res.json())
.then((data) => {
    const user = data.user;

    orderBox.innerHTML = `<p>User with name "${user}" does not exist</p>
                          <p>Would you like to create a new user with the username and password you entered?</p>
                          <button type="button" onclick="makeUser()">Yes</button>
                          <button type="button" onclick="cancel()">No</button>`
})

function makeUser(){
    fetch("/new-user", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
    })
    .then(res => window.location.assign(res.url));
}

function cancel(){
    fetch("/logout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
    })
    .then(res => window.location.assign(res.url));
}