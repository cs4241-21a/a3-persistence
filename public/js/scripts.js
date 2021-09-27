const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()

    const name = document.querySelector('#name')
    const code = document.querySelector('#code')
    const prof = document.querySelector('#prof')
    const grade = document.querySelector('#grade')

    json = {
        name: name.value,
        code: code.value,
        prof: prof.value,
        dept: getDept(code.value),
        grade: grade.value
    }

    if (json.name === '' || json.code === '' || json.prof === '' || json.grade === ''){
        alert('Error: One or more input cells left blank')
    }
    else{
        body = JSON.stringify(json)
        return finishSubmit(body)
    }
}

const finishSubmit = function (body) {
    fetch('/submit', {
        method: 'POST',
        body
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (json) {
            addRow(json)
        })

    return false
}

window.onload = function () {
    const button = document.querySelector('button')
    finishSubmit('init')
    button.onclick = submit
}

function getDept(code) {
    tag = code.slice(0, 2 + isNaN(code[2]) + isNaN(code[3]))
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

const defaultTable = '<tr><th>Course Name</th><th>Course Code</th><th>Professor</th><th>Department</th><th>Grade</th></tr>'

function addRow(json) {
    let gpa = 0
    document.getElementById("mainTable").innerHTML = defaultTable
    for (let i = 0; i < json.length; i++) {
        const element = document.createElement('tr')
        const nameCell = document.createElement('td')
        nameCell.className = 'nameBox'
        nameCell.innerText = json[i].name
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
        switch (json[i].grade) {
            case 'A': gpa = gpa + 1;
            case 'B': gpa = gpa + 1;
            case 'C': gpa = gpa + 1;
            default: gpa = gpa + 1;
        }
        element.appendChild(gradeCell)

        document.getElementById("mainTable").appendChild(element)
    }
    gpa = gpa/json.length
    document.getElementById("gpa").innerText = 'GPA: ' + gpa.toFixed(2)
}
