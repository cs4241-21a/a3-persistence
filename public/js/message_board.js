const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()

    const nameText = document.getElementById('name');
    const targetText = document.getElementById('target-text');
    const fancyFont = document.getElementById('fancy-font');
    const textFaces = document.getElementById('text-faces');
    const emojis = document.getElementById('emojis');
    let checkedRadio = -1;
    if (textFaces.checked) {
        checkedRadio = 0;
    } else if (emojis.checked) {
        checkedRadio = 1;
    } else {
        checkedRadio = 2;
    }
    json = {
        name: nameText.value,
        message: targetText.value,
        fancyFont: fancyFont.checked,
        checkedRadio: checkedRadio
    };
    body = JSON.stringify(json)

    if (nameText.value !== '' && targetText.value !== '') {
        fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        })
            .then(function (response) {
                // do something with the reponse 
                response.text().then(function (str) {
                    let jsonObj = JSON.parse(str);
                    if (jsonObj.loggedInUser === jsonObj.obj.to) {
                        addNewElt(jsonObj.obj);
                    }
                    addSentElement(jsonObj.obj);
                })
            })

    } else {
        alert("Please specify a user to receive a message, as well as the message itself.")
    }
    return false
}

const switchView = function (e) {
    document.getElementsByClassName('active')[0].classList.remove('active');
    e.target.classList.add('active');
    if (e.target.id === 'table-nav') {
        document.getElementById('table-root').style.display = 'flex';
        document.getElementById('sentence-root').style.display = 'none';
        document.getElementById('sent-root').style.display = 'none';
    } else if (e.target.id === 'sentence-nav') {
        document.getElementById('table-root').style.display = 'none';
        document.getElementById('sentence-root').style.display = 'flex';
        document.getElementById('sent-root').style.display = 'none';
    } else {
        document.getElementById('table-root').style.display = 'none';
        document.getElementById('sentence-root').style.display = 'none';
        document.getElementById('sent-root').style.display = 'flex';
    }
}

function addNewElt(element) {
    let normalTable = document.getElementById('normal-table');
    let owoTable = document.getElementById('owo-table');
    let normalSentenceRoot = document.getElementById('normal-sentence-root');
    let owoSentenceRoot = document.getElementById('owo-sentence-root');

    let normalrow = normalTable.insertRow(-1);
    normalrow.insertCell(0).innerHTML = element.from;
    let messagecell = normalrow.insertCell(1);
    messagecell.innerHTML = element.message;
    let oworow = owoTable.insertRow(-1);
    oworow.insertCell(0).innerHTML = element.fromowo;
    let messageowocell = oworow.insertCell(1);
    messageowocell.innerHTML = element.messageowo;
    let normalSentence = document.createElement('p');
    normalSentence.innerHTML = `${element.from} said: "${element.message}"`;
    let owoSentence = document.createElement('p');
    owoSentence.innerHTML = `${element.fromowo} said: "${element.messageowo}"`;
    owoSentence.classList.add('sentence');
    normalSentence.classList.add('sentence');
    if (element.fancyFont) {
        messagecell.className = 'fancy-font';
        messageowocell.className = 'fancy-font';
        normalSentence.className = 'fancy-font';
        owoSentence.className = 'fancy-font';
    }
    normalSentenceRoot.append(normalSentence);
    owoSentenceRoot.append(owoSentence);
}

function addSentElement(element, idx) {
    const editRoot = document.getElementById('editable-root');
    let newForm = document.createElement('form');
    newForm.classList.add('row', 'inline-form');
    newForm.innerHTML = `
    <div class='form-floating col-4'>
        <textarea class='form-control' placeholder='message goes here' name='message' id='message${idx}'>${element.message}</textarea>
        <label for='message'>Message</label>
    </div>
    <div class='form-check col'>
        <label class='form-check-label' for='fancy-font'>Fancy Font?</label>
        <input class='form-check-input' type="checkbox" id='fancy-font${idx}'>
    </div>
    <div class='col'>
        <div class='row'>
            <div class='form-check col'>
                <label class='form-check-label' for='text-faces${idx}'>Replace '!' With Text Faces</label>
                <input class='form-check-input' type='radio' name='facereplace${idx}' id='text-faces${idx}'>
            </div>
        </div>
        <div class='row'>
            <div class='form-check col'>
                <label class='form-check-label' for='emojis${idx}'>Replace '!' With Emojis</label>
                <input class='form-check-input' type='radio' name='facereplace${idx}' id='emojis${idx}'>
            </div>
        </div>
        <div class='row'>
            <div class='form-check col'>
                <label class='form-check-label' for='no-replace${idx}'>Do Not Replace '!'</label>
                <input class='form-check-input' type='radio' name='facereplace${idx}' id='no-replace${idx}'>
            </div>
        </div>
    </div>
    <div class='col'>
        <div class='row'>
            <button class='btn btn-outline-primary inline-update-btn' id='inline-update-btn${idx}' data-index=${idx} data-dbid=${element._id}>Update</button>
        </div>
        <div class='row'>
            <button class='btn btn-outline-secondary inline-delete-btn' id='inline-delete-btn${idx}' data-index=${idx} data-dbid=${element._id}>Delete</button>
        </div>
    </div>`;
    editRoot.append(newForm);
    switch (element.oworeplace) {
        case 0:
            document.getElementById('text-faces' + idx).checked = true;
            break;
        case 1:
            document.getElementById('emojis' + idx).checked = true;
            break;
        case 2:
            document.getElementById('no-replace' + idx).checked = true;
            break;
    }
    if (element.fancyFont) {
        document.getElementById('fancy-font' + idx).checked = true;
    }

    const updateBtn = document.getElementById('inline-update-btn' + idx);
    const deleteBtn = document.getElementById('inline-delete-btn' + idx);

    let updateFunc = function (e) {
        e.preventDefault;
        let btn = e.srcElement
        let index = btn.getAttribute('data-index');
        let dbid = btn.getAttribute('data-dbid');
        let checkedRadio = -1;
        if (document.getElementById('text-faces' + index).checked) {
            checkedRadio = 0;
        } else if (document.getElementById('emojis' + index).checked) {
            checkedRadio = 1
        } else {
            checkedRadio = 2;
        }
        let obj = {
            dbid: dbid,
            message: document.getElementById('message' + index).value,
            fancyFont: document.getElementById('fancy-font' + index).checked,
            checkedRadio: checkedRadio
        }
        let body = JSON.stringify(obj);
        fetch('/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        }).then(function (response) {
            clearAllMessages();
            fetchAllMessages();
        });
    }
    updateBtn.onclick = updateFunc;
    let deleteFunc = function (e) {
        e.preventDefault;
        let btn = e.srcElement
        let dbid = btn.getAttribute('data-dbid');
        let obj = {
            dbid: dbid
        }
        let body = JSON.stringify(obj);
        fetch('/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        }).then(function (response) {
            clearAllMessages();
            fetchAllMessages();
        });
    }
    deleteBtn.onclick = deleteFunc;

}

function clearAllMessages() {
    const normalTable = document.getElementById('normal-table');
    const owoTable = document.getElementById('owo-table');
    const normalSentence = document.getElementById('normal-sentence-root');
    const owoSentence = document.getElementById('owo-sentence-root');
    const sentMessages = document.getElementById('editable-root')

    normalTable.innerHTML =
        `<thead>
        <tr>
        <th>Name</th>
        <th>Message</th>
        </tr>
    </thead>`;
    owoTable.innerHTML =
        `<thead>
        <tr>
        <th>Name</th>
        <th>Message</th>
        </tr>
    </thead>`;
    normalSentence.innerHTML = '<b>Normal Sentences</b>';
    owoSentence.innerHTML = '<b>OwO-ified Sentences</b>';
    sentMessages.innerHTML = '<b>Sent Messages</b>';

}

function fetchAllMessages() {
    fetch('/getMessagesTo', {
        method: 'GET',
    }).then(function (response) {
        response.text().then(function (jsonData) {
            console.log(jsonData)
            let appdata = JSON.parse(jsonData);
            if (appdata.length !== 0) {
                appdata.forEach(element => addNewElt(element));
            }
        });
    });

    fetch('/getMessagesFrom', {
        metod: 'GET',
    }).then(function (response) {
        response.text().then(function (jsonData) {
            console.log(jsonData);
            let appdata = JSON.parse(jsonData);
            if (appdata.length !== 0) {
                appdata.forEach(function (elt, idx) {
                    addSentElement(elt, idx);
                });
            }
        });
    })
}

window.onload = function () {
    const button = document.getElementById('form-submit-btn')
    button.onclick = submit;
    const tableLink = document.getElementById('table-nav');
    const sentenceLink = document.getElementById('sentence-nav');
    const sentLink = document.getElementById('sent-nav');
    tableLink.onclick = switchView;
    sentenceLink.onclick = switchView;
    sentLink.onclick = switchView;
    fetchAllMessages();
}