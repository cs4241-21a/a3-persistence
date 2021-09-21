window.onload = async () => {
  console.log("sdlfkj");
  const res = await fetch("/me", { method: "GET" });

  if (res.status === 404) return;

  const user = await res.json();

  document.getElementById("github").innerText = JSON.stringify(user, null, 2);

  document.getElementById("name").innerText = user.displayName;
  document.getElementById("email").innerText = user.emails[0].value;
  document.getElementById("username").innerText = user.username;
  document.getElementById(
    "photo"
  ).innerHTML = `<img src=${user.photos[0].value} width=100 height=100>`;
};
