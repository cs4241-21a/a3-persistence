function logout(){
    fetch("/logout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
    })
    .then(res => window.location.assign(res.url));
}