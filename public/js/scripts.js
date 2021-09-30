let globaluser = ''
let len = 0

const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()

    const name = document.querySelector('#name')
    const code = document.querySelector('#code')
    const prof = document.querySelector('#prof')
    const grade = document.querySelector('#grade')

    let json = {
        name: name.value,
        code: code.value,
        prof: prof.value,
        grade: grade.value,
        user: globaluser
    }

    if (json.name === '' || json.code === '' || json.prof === '' || json.grade === ''){
        alert('Error: One or more input cells left blank')
    }
    else{
        let body = JSON.stringify(json)
        fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        })
        .then( fetch('/init', {
            method: 'POST'
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (json) {
            addRow(json)
        }))
        .then(fetch('/init', {
            method: 'POST'
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (json) {
            addRow(json)
        }))
        
        
    }
}

const signup = function (e) {
    e.preventDefault()
    const user = document.querySelector('#signupuser')
    const pass = document.querySelector('#signuppass')
    let json = {
        user: user.value,
        pass: pass.value
    }
    if (json.user === '' || json.pass === ''){
        alert('Error: Must enter a username and password')
    }
    else{
        let body = JSON.stringify(json)
        fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        })
        .then( response => alerting(response))
    }
}

const alerting = function (code) {
    if (code.status === 201){
        alert("Username taken, account not created")
    }
    else{
        alert('Account Created!')
    }
}

const login = function (e) {
    e.preventDefault()
    const user = document.querySelector('#loginuser')
    const pass = document.querySelector('#loginpass')
    let json = {
        user: user.value,
        pass: pass.value
    }
    if (json.user === '' || json.pass === ''){
        alert('Error: Must enter a username and password')
    }
    else{
        let body = JSON.stringify(json)
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        })
        .then( response => checklogin(response, user.value))
    }
}

const checklogin = function (code, user) {
    if (code.status === 201){
        alert("Login failed, no account with those creditials")
    }
    else {
        window.location.href = '/content.html#' + user
    }
}

window.onload = function () {
    if (!window.location.href.includes('content.html')){
        const signupButton = document.querySelector('#signupButton')
        signupButton.onclick = signup
        const loginButton = document.querySelector('#loginButton')
        loginButton.onclick = login
    }
    else{
        const button = document.querySelector('button')
        button.onclick = submit
        const username = document.querySelector('#username')
        globaluser = window.location.hash.substring(1)

        fetch('/init', {
            method: 'POST',
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (json) {
            addRow(json)
            newUser()
        })
    }
}

function getDept(code) {
    let tag = code.slice(0, 2 + isNaN(code[2]) + isNaN(code[3]))
    switch (tag) {
        case 'AE': return 'Aerospace Engineering'; break;
        case 'BB': return 'Biology'; break;
        case 'BBT': return 'Biology and Biotechnology'; break;
        case 'BUS': return 'Business'; break;
        case 'CHC': return 'Chemistry & Biochemistry'; break;
        case 'CH': return 'Chemistry'; break;
        case 'CEE': return 'Civil and Environmental Engineering'; break;
        case 'CM':
        case 'CHE': return 'Chemical Engineering'; break;
        case 'CS': return 'Computer Science'; break;
        case 'ECE': return 'Electrical and Computer Engineering'; break;
        case 'EVE': return 'Environmental Engineering'; break;
        case 'EVS': return 'Environmental Sciences'; break;
        case 'FPE': return 'Fire Protection Engineering'; break;
        case 'HUA': return 'Humanities & Arts'; break;
        case 'IE': return 'Industrial Engineering'; break;
        case 'IGSD': return 'Interdisciplinary & Global Studies'; break;
        case 'IMGD': return 'Interactive Media and Game Development'; break;
        case 'MA': return 'Mathematical Sciences'; break;
        case 'MAC': return 'Actuarial Mathematics'; break;
        case 'ME': return 'Mechanical Engineering'; break;
        case 'MFE': return 'Manufacturing Engineering'; break;
        case 'MTE': return 'Materials Science & Engineering'; break;
        case 'MG': return 'Management'; break;
        case 'MGE': return 'Management Engineering'; break;
        case 'MIS': return 'Management Information Systems'; break;
        case 'PH': return 'Physics'; break;
        case 'PSS': return 'Psychological Sciences'; break;
        case 'PW':
        case 'PWR': return 'Professional Writing'; break;
        case 'RBE': return 'Robotics Engineering'; break;
        case 'SSPS': return 'Social Science and Policy Studies'; break;
        default: return 'Unknown'
    }
}

const defaultTable = '<tr><th>Course Name</th><th>Course Code</th><th>Professor</th><th>Department</th><th>Grade</th><th>Change Name?</th><th>Delete?</th></tr>'

function addRow(json) {
    let gpa = 0
    len = 0
    document.getElementById("mainTable").innerHTML = defaultTable
    for (let i = 0; i < json.length; i++) {
        const element = document.createElement('tr')
        const nameCell = document.createElement('td')
        const nameForm = document.createElement('input')
        nameForm.className = 'nameBox'
        nameForm.id = 'nameBox'+json[i]._id
        nameForm.value = json[i].name
        const nameLabel = document.createElement('label')
        nameLabel.htmlFor = nameForm.id
        nameLabel.innerText = 'name'
        nameCell.appendChild(nameLabel)
        nameCell.appendChild(nameForm)
        element.appendChild(nameCell)
        const codeCell = document.createElement('td')
        codeCell.innerText = json[i].code
        element.appendChild(codeCell)
        const profCell = document.createElement('td')
        profCell.innerText = json[i].prof
        element.appendChild(profCell)
        const deptCell = document.createElement('td')
        deptCell.innerText = getDept(json[i].code)
        element.appendChild(deptCell)
        const gradeCell = document.createElement('td')
        gradeCell.innerText = json[i].grade
        element.appendChild(gradeCell)

        const modButtonLoc = document.createElement('td')
        const modButton = document.createElement('button')
        modButton.innerText = 'Modify'
        modButton.onclick = function () {
            fetch('/modify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id: json[i]._id, name: nameForm.value})
            })
            .then(fetch('/init', {
                method: 'POST'
            })
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                addRow(json)
            }))
            .then(fetch('/init', {
                method: 'POST'
            })
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                addRow(json)
            }))
        }
        modButtonLoc.appendChild(modButton)
        element.appendChild(modButtonLoc)

        const buttonLoc = document.createElement('td')
        const delButton = document.createElement('button')
        delButton.innerText = 'Delete'
        delButton.onclick = function () {
            fetch('/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id: json[i]._id})
            })
            .then(fetch('/init', {
                method: 'POST'
            })
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                addRow(json)
            }))
            .then(fetch('/init', {
                method: 'POST'
            })
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                addRow(json)
            }))
        }
        buttonLoc.appendChild(delButton)
        element.appendChild(buttonLoc)

        if (globaluser === json[i].user){
            switch (json[i].grade) {
                case 'A': gpa++;
                case 'B': gpa++;
                case 'C': gpa++;
                default: gpa++;
            }
            len++
            
            document.getElementById("mainTable").appendChild(element)
        }
    }
    gpa = gpa/len
    document.getElementById("gpa").innerText = 'GPA: ' + gpa.toFixed(2)
}

function newUser() {
    if (len === 0){
        const appdata = [
            JSON.stringify({ name: 'Calculus I', code: 'MA1021', prof: 'Abraham', grade: 'C', user: globaluser }),
            JSON.stringify({ name: 'Computer Graphics', code: 'CS543', prof: 'Cuneo', grade: 'A', user: globaluser }),
            JSON.stringify({ name: 'Leadership Practice', code: 'BUS1010', prof: 'French', grade: 'B', user: globaluser })
          ]
        fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: appdata[0]
        })
        .then(fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: appdata[1]
        })
        .then(fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: appdata[2]
        })
        .then(fetch('/init', {
            method: 'POST'
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (json) {
            addRow(json)
        }))))
    }
}

