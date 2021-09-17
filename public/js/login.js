const login = function (e) {
  e.preventDefault();
  const username = document.querySelector('#user-name'),
    password = document.querySelector('#password'),
    json = {
      username: username.value,
      password: password.value,
    },
    body = JSON.stringify(json);
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      if (json[0].password === password.value) {
        window.sessionStorage.setItem('userid', json[0]._id);
        window.sessionStorage.setItem('username', username.value);
        if (json[0].new) {
          alert(
            `No account found for given username, account has been created for user ${username.value}`
          );
        }
        location.href = 'home.html';
      } else {
        alert('Password incorrect. Please try logging in again.');
      }
    });
};

window.onload = function () {
  const button = document.querySelector('#Login-Button');
  button.onclick = login;
};
