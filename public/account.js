let uuid = null;

window.onload = async () => {
  await updateInfo();
};

const updateInfo = async () => {
  const res = await fetch("/me", { method: "GET" });

  if (res.status === 404) return;

  const user = await res.json();

  //document.getElementById("github").innerText = JSON.stringify(user, null, 2);

  // Login history

  user.data.loginTimes.reverse();

  user.data.loginTimes.forEach((timestamp) => {
    const node = document.createElement("li");
    node.appendChild(document.createTextNode(new Date(timestamp)));

    document.getElementById("loginHistoryList").appendChild(node);
  });

  // Github info

  if (user.displayName)
    document.getElementById("name").innerText = user.displayName;
  if (user.emails && user.emails.length > 0)
    document.getElementById("email").innerText = user.emails[0].value;
  if (user.username)
    document.getElementById("username").innerText = user.username;

  if (user.photos && users.photos.length > 0)
    document.getElementById(
      "photo"
    ).innerHTML = `<img src=${user.photos[0].value} width=100 height=100>`;

  // Contacts

  const table = document.getElementById("contactTable");

  // Clear the table (janky)
  for (let i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }

  document.getElementById("noContactsLabel").hidden =
    user.data.contacts && user.data.contacts.length !== 0;

  if (user.data.contacts) {
    user.data.contacts.forEach((contact) => {
      const row = table.insertRow();
      ["name", "phone", "country"].forEach((key, idx) => {
        const cell = row.insertCell(idx);
        cell.class = "row";
        cell.innerHTML = `<p>${contact[key]}</p>`;
      });
      const actionCell = row.insertCell();
      actionCell.innerHTML = `<div class="full-page"><button class="btn btn-secondary btn-sm mx-2" onclick="editContact(\`${contact.uuid}\`)">Edit</button> <button class="btn btn-danger btn-sm mx-2" onclick="deleteContact(\`${contact.uuid}\`)">Delete</button></div>`;
    });
  }
};

const submitForm = async () => {
  console.log("Submitting form");

  const name = document.getElementById("formName").value;
  const phone = document.getElementById("formPhone").value;
  const country = document.getElementById("formCountry").value;

  console.log({ name, phone, country });

  if (!name || !phone || !country) return;

  const res = await fetch("/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, country, uuid }),
  });

  await updateInfo();
};

const editContact = async (_uuid) => {
  uuid = _uuid;

  const res = await fetch("/me", { method: "GET" });
  const user = await res.json();

  const contact = user.data.contacts.find((c) => c.uuid === _uuid);

  console.log(contact);

  document.getElementById("formName").value = contact.name;
  document.getElementById("formPhone").value = contact.phone;
  document.getElementById("formCountry").value = contact.country;

  document.getElementById("submitButton").innerText = "Edit Contact";
  document.getElementById("cancelEditButton").hidden = false;
};

const cancelEdit = () => {
  console.log("Cancelling edit mode");
  uuid = null;

  document.getElementById("cancelEditButton").hidden = true;
  document.getElementById("submitButton").innerText = "Add Contact";

  document.getElementById("formName").value = null;
  document.getElementById("formPhone").value = null;
  document.getElementById("formCountry").value = null;
};

const deleteContact = async (uuid) => {
  await fetch(`/contacts?uuid=${uuid}`, {
    method: "DELETE",
  });
  await updateInfo();
};
