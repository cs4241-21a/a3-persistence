const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()

    const nameText = document.getElementById('name');
    const targetText = document.getElementById('target-text');
    json = {
        name: nameText.value,
        message: targetText.value
    };
    body = JSON.stringify(json)

    fetch('/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body
    })
        .then(function (response) {
            // do something with the reponse 
            response.text().then(function (str) {
                addNewElt(JSON.parse(str));
            })
        })

    return false
}

const switchView = function (e) {
    if (e.target.id === 'table-nav') {
        document.getElementById('table-root').style.display = 'flex';
        document.getElementById('sentence-root').style.display = 'none';
    } else {
        document.getElementById('table-root').style.display = 'none';
        document.getElementById('sentence-root').style.display = 'flex';
    }
}

function addNewElt(element) {
    let normalTable = document.getElementById('normal-table');
    let owoTable = document.getElementById('owo-table');
    let normalSentenceRoot = document.getElementById('normal-sentence-root');
    let owoSentenceRoot = document.getElementById('owo-sentence-root');

    let normalrow = normalTable.insertRow(-1);
    normalrow.insertCell(0).innerHTML = element.name;
    normalrow.insertCell(1).innerHTML = element.message;
    let oworow = owoTable.insertRow(-1);
    oworow.insertCell(0).innerHTML = element.nameowo;
    oworow.insertCell(1).innerHTML = element.messageowo;
    let normalSentence = document.createElement('p');
    normalSentence.innerHTML = `${element.name} said: "${element.message}"`;
    let owoSentence = document.createElement('p');
    owoSentence.innerHTML = `${element.nameowo} said: "${element.messageowo}"`;
    normalSentenceRoot.append(normalSentence);
    owoSentenceRoot.append(owoSentence);
}

window.onload = function () {
    const button = document.querySelector('button')
    button.onclick = submit;
    const tableLink = document.getElementById('table-nav')
    const sentenceLink = document.getElementById('sentence-nav')
    tableLink.onclick = switchView;
    sentenceLink.onclick = switchView;
    fetch('/getAppdata', {
        method: 'GET',
    }).then(function (response) {
        response.text().then(function (jsonData) {
            console.log(jsonData)
            let appdata = JSON.parse(jsonData);
            if (appdata.length !== 0) {
                appdata.forEach(element => addNewElt(element));
            }
        })
    })
}