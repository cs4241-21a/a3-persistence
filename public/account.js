window.onload = async () => {
  const res = await fetch("/me", { method: "GET" });

  if (res.status === 404) return;

  const user = await res.json();

  //document.getElementById("github").innerText = JSON.stringify(user, null, 2);

  document.getElementById("noContactsLabel").hidden =
    user.data.contacts && user.data.contacts.length !== 0;

  user.data.loginTimes.reverse();

  user.data.loginTimes.forEach((timestamp) => {
    const node = document.createElement("li");
    node.appendChild(document.createTextNode(new Date(timestamp)));

    document.getElementById("loginHistoryList").appendChild(node);
  });
  document.getElementById("name").innerText = user.displayName;
  document.getElementById("email").innerText = user.emails[0].value;
  document.getElementById("username").innerText = user.username;
  document.getElementById(
    "photo"
  ).innerHTML = `<img src=${user.photos[0].value} width=100 height=100>`;
};
