console.log('Hello world.');

fetch('/getUserData')
.then(response => response.json())
.then(data => {document.getElementById('user-data').innerHTML = JSON.stringify(data);})
