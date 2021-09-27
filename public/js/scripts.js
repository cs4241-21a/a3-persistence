const submit = function(e) {
    // prevent default form action from being carried out
    e.preventDefault()

    const taskInput = document.querySelector('#task'),
        timeInput = document.querySelector('#time'),
        dateInput = document.querySelector('#date')

    if (taskInput.value === '') {
        window.alert('Please input a task!')
        return;
    }

    const json = {
            'task': taskInput.value,
            'time': timeInput.value,
            'date': dateInput.value,
            'done': 'false'
        },
        body = JSON.stringify(json)

    taskInput.value = ''
    timeInput.value = ''
    dateInput.value = ''

    fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        .then(response => response.json())
        .then(function(json) {
            refresh()
        })

    return false
}

const del = function del(e) {
    const toDoItemID = e.target.parentNode.id

    body = {
        '_id': toDoItemID
    }
    body = JSON.stringify(body)
    console.log(body)
    fetch('/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        .then(response => response.json())
        .then(function(json) {
            console.log('deleting')
            document.getElementById(toDoItemID).remove()
        })
    return false
}

function checked(box) {
    const toDoItemID = box.parentNode.id,
        toDoItem = document.getElementById(toDoItemID),
        checked = (toDoItem.getAttribute("done") === "true") ? "false" : "true"
    console.log(toDoItem.done)
    toDoItem.setAttribute('done', checked)
    let json = {
        '_id': toDoItemID,
        'done': checked
    }
    body = JSON.stringify(json)

    fetch('/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        .then(response => response.json())
        .then(function(json) {
            refresh()

        })
    return false
}

const edit = function editTask(e) {
    const toDoItem = e.target.parentNode,
        taskInput = toDoItem.querySelector('.taskItem'),
        timeInput = toDoItem.querySelector('.timeItem'),
        dateInput = toDoItem.querySelector('.dateItem'),
        editB = toDoItem.querySelector('.editB'),
        deleteB = toDoItem.querySelector('.deleteB'),
        saveB = toDoItem.querySelector('.saveB')

    editB.style.display = 'none'
    deleteB.style.display = 'none'
    saveB.style.display = 'table-cell'

    taskInput.readOnly = false;
    timeInput.readOnly = false;
    dateInput.readOnly = false;

    return;
}

const save = function saveTask(e) {
    e.preventDefault()

    const col = e.target.parentNode,
        row = col.parentNode,
        toDoItem = row.parentNode
    console.log("heyy:" + toDoItem)
    const toDoItemID = toDoItem.id

    const taskInput = toDoItem.querySelector('.taskItem'),
        timeInput = toDoItem.querySelector('.timeItem'),
        dateInput = toDoItem.querySelector('.dateItem'),
        editB = toDoItem.querySelector('.editB'),
        deleteB = toDoItem.querySelector('.deleteB'),
        saveB = toDoItem.querySelector('.saveB')

    editB.style.display = 'table-cell'
    deleteB.style.display = 'table-cell'
    saveB.style.display = 'none'

    taskInput.readOnly = true;
    timeInput.readOnly = true;
    dateInput.readOnly = true;

    json = {
        '_id': toDoItemID,
        'task': taskInput.value,
        'time': timeInput.value,
        'date': dateInput.value,
        'done': 'false'
    }

    body = JSON.stringify(json)

    fetch('/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        .then(response => response.json())
        .then(function(json) {
            refresh()
        })
    return false
}

function refresh() {

    fetch('/collection', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(function(json) {
            console.log("getting")
            const toDoList = document.getElementById('toDoList')

            while (toDoList.firstChild) {
                toDoList.removeChild(toDoList.firstChild)
            }

            if (Array.isArray(json)) {
                json.forEach((input, index) => {
                    const task = input.task,
                        time = input.time,
                        date = input.date,
                        done = input.done,
                        u = input.u

                    const toDoItem = document.createElement('li')
                    toDoItem.id = input._id
                    toDoItem.className = 'toDoItem container list-group-item'

                    toDoItem.setAttribute('done', done)

                    const row = document.createElement('div')
                    row.className = 'row'

                    const checkCol = document.createElement('div')
                    checkCol.className = 'col-1'
                    const check = document.createElement('input') // making checkbox
                    check.type = 'checkbox'
                    check.className = 'form-check-input me-1 checkbox'
                    check.addEventListener('change', function() {
                        checked(check)
                    })
                    if (done === 'true') {
                        check.checked = true;
                        toDoItem.className = toDoItem.className + " disabled"
                    }
                    checkCol.append(check)


                    const taskCol = document.createElement('div')
                    taskCol.className = 'col-4'
                    const timeCol = document.createElement('div')
                    timeCol.className = 'col-2'
                    const dateCol = document.createElement('div')
                    dateCol.className = 'col-2'

                    const taskEdit = document.createElement('input') // making info elements
                    const timeEdit = document.createElement('input')
                    const dateEdit = document.createElement('input')

                    taskEdit.type = 'text'
                    timeEdit.type = 'time'
                    dateEdit.type = 'date'

                    taskEdit.value = task
                    timeEdit.value = time
                    dateEdit.value = date

                    taskEdit.readOnly = true;
                    timeEdit.readOnly = true;
                    dateEdit.readOnly = true;

                    taskEdit.className = 'taskItem'
                    timeEdit.className = 'timeItem'
                    dateEdit.className = 'dateItem'


                    taskCol.append(taskEdit)
                    timeCol.append(timeEdit)
                    dateCol.append(dateEdit)

                    // making urgency tag
                    const uCol = document.createElement('div')
                    uCol.className = 'col-1'
                    const urg = document.createElement('p')
                    let str = ""
                        //console.log(u)
                    urg.className = 'urgItem'
                    for (let i = 0; i < u; i++) {
                        str += '!'
                    }
                    urg.innerHTML = str
                    uCol.append(urg)

                    // making buttons -----------------------------------
                    const buttonCol = document.createElement('div')
                    buttonCol.className = 'col-2'

                    const editB = document.createElement('button'),
                        deleteB = document.createElement('button'),
                        saveB = document.createElement('button')

                    editB.className = 'editB'
                    deleteB.className = 'deleteB'
                    saveB.className = 'saveB'

                    editB.textContent = 'Edit'
                    deleteB.textContent = 'Delete'
                    saveB.textContent = 'Save'

                    deleteB.onclick = del
                    editB.onclick = edit
                    saveB.onclick = save

                    saveB.style.display = 'none'

                    if (done === 'true') {
                        deleteB.style.display = 'none'
                        editB.style.display = 'none'
                    } else {
                        deleteB.style.display = 'table-cell'
                        editB.style.display = 'table-cell'
                    }

                    buttonCol.append(editB)
                    buttonCol.append(deleteB)
                    buttonCol.append(saveB)

                    // append to to-do item
                    row.appendChild(checkCol)
                    row.appendChild(uCol)
                    row.appendChild(taskCol)
                    row.appendChild(dateCol)
                    row.appendChild(timeCol)
                    row.appendChild(buttonCol)

                    toDoItem.append(row)

                    // append to list
                    toDoList.appendChild(toDoItem)
                })
            }
        })

    return false;
}

window.onload = function() {
    const addB = document.getElementById('addB')
    addB.onclick = submit
    refresh()
}