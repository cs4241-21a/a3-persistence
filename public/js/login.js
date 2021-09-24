function toaster(content) {
    document.getElementById("toaster-content").innerHTML = content
    var toast = new bootstrap.Toast(document.getElementById("toaster"))
    toast.show()
}

function getParameterByName(name, url = window.location.href) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var errorcodes = {
    "10": "You didn't enter a username and/or password. Make sure to enter this to log in.",
    "11": "Couldn't find user. Try registering for Todoish.",
    "12": "That's the wrong password. Please try again.",
    "20": "Failed to authenticate via GitHub. Make sure to give Todoish permission.",
    "30": "Successfully logged out. Thanks for using Todoish!",
    "40": "You didn't enter a username and/or password. Make sure to enter this to register.",
    "41": "This username is already taken. Try logging in instead.",
    "42": "Successfully registered for Todoish. You can now log in."
}

window.onload = function() {
    var errcode = getParameterByName("error")
    if (errcode != null) {
        toaster(errorcodes[errcode])
        history.pushState(null, 'Todoish - Log In', '/')
    }
}