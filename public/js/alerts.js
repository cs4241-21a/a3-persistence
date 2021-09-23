window.onload = () => {
  let alertMsg = getCookie("alert");
  if (alertMsg !== "") {
    alert(decodeURI(alertMsg));
    resetAlertCookie();
  }
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function resetAlertCookie() {
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    if (c.indexOf("alert=") !== -1) {
      document.cookie = "alert=;";
      for (let j = 0; j < ca.length; j++) {
        if (j !== i) {
          document.cookie += ca[j] + ";";
        }
      }
    }
  }
}