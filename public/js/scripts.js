let rowNum = 0
let _id = ""

const login = function (e) {
    e.preventDefault()

    let username = document.getElementById("username").value
    let password = document.getElementById("password").value

    if(username === "" || password === "") {
        alert("Username and/or password can not be blank!")
        return false
    }



    json = {
        username: username,
        password: password
    },
        body = JSON.stringify(json)

    fetch('/login', {
        method: 'POST',
        body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.text())
        .then(function (text) {
            const data = JSON.parse(text)
            
            if (data.status === "Bad") {
                alert("Password is invalid: Try again")
                document.getElementById("password").value = ""
            }
            else {
                localStorage.setItem("global_username", data.username)
                window.location.href = 'registry.html'
            }
        })
}

const submit = function (e) {
    e.preventDefault()

    const name = document.querySelector('#yourname'),
        make = document.querySelector("#make"),
        model = document.querySelector("#model"),
        year = document.querySelector("#year"),
        plateNum = document.querySelector("#platenumber")

    body = checkInput(name, make, model, year, plateNum)

    if (body === false) {
        return false
    }

    fetch('/submit', {
        method: 'POST',
        body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.text())
        .then(function (text) {
            const data = JSON.parse(text)
            let table = document.getElementById("cartable")
            let row = table.insertRow(-1)
            let c0 = row.insertCell(0)
            let c1 = row.insertCell(1)
            let c2 = row.insertCell(2)
            let c3 = row.insertCell(3)
            let c4 = row.insertCell(4)
            let c5 = row.insertCell(5)
            let c6 = row.insertCell(6)
            let c7 = row.insertCell(7)
            let c8 = row.insertCell(8)
            c0.innerHTML = data.yourname
            c1.innerHTML = data.make
            c2.innerHTML = data.model
            c3.innerHTML = data.year
            c4.innerHTML = data.plateNum
            c5.innerHTML = data.age
            c6.innerHTML = '<button onclick="update(this)">Edit</button>'
            c7.innerHTML = '<button onclick="remove(this)">Delete</button>'
            c8.innerHTML = data._id
            document.getElementById("carform").reset();
        })

    return
}

const remove = function (obj) {
    rowNum = obj.parentNode.parentNode.rowIndex
    let id = document.getElementById("cartable").rows[rowNum].cells[8].innerHTML
    document.getElementById("cartable").deleteRow(rowNum)

    json = {
        _id: id
    },
        body = JSON.stringify(json)

    fetch('/remove', {
        method: 'POST',
        body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.text())
        .then(function (text) {
            console.log("Deleted row from database.")
            document.getElementById("editform").reset()
            document.getElementById("hide").style.display = "none"
            document.getElementById("submit").disabled = false
        })
}

const update = function (obj) {
    rowNum = obj.parentNode.parentNode.rowIndex
    document.getElementById("edityourname").value = document.getElementById("cartable").rows[rowNum].cells[0].innerHTML
    document.getElementById("editmake").value = document.getElementById("cartable").rows[rowNum].cells[1].innerHTML
    document.getElementById("editmodel").value = document.getElementById("cartable").rows[rowNum].cells[2].innerHTML
    document.getElementById("edityear").value = document.getElementById("cartable").rows[rowNum].cells[3].innerHTML
    document.getElementById("editplatenumber").value = document.getElementById("cartable").rows[rowNum].cells[4].innerHTML
    _id = document.getElementById("cartable").rows[rowNum].cells[8].innerHTML


    document.getElementById("hide").style.display = "block"
    document.getElementById("edityourname").focus()
    document.getElementById("submit").disabled = true
}

const editSubmission = function (e) {
    e.preventDefault()

    const name = document.getElementById("edityourname"),
        make = document.getElementById("editmake"),
        model = document.getElementById("editmodel"),
        year = document.getElementById("edityear"),
        plateNum = document.getElementById("editplatenumber")

    test = checkInput(name, make, model, year, plateNum)

    if (test === false) {
        return false
    }

    let d = new Date()
    let age = d.getFullYear() - year.value

    json = {
        yourname: name.value,
        make: make.value,
        model: model.value,
        year: year.value,
        plateNum: plateNum.value,
        age: String(age),
        _id: _id
    },
        body = JSON.stringify(json)

    fetch('/edit', {
        method: 'POST',
        body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.text())
        .then(function (text) {
            console.log("Edited row in database.")

            document.getElementById("cartable").rows[rowNum].cells[0].innerHTML = name.value
            document.getElementById("cartable").rows[rowNum].cells[1].innerHTML = make.value
            document.getElementById("cartable").rows[rowNum].cells[2].innerHTML = model.value
            document.getElementById("cartable").rows[rowNum].cells[3].innerHTML = year.value
            document.getElementById("cartable").rows[rowNum].cells[4].innerHTML = plateNum.value
            document.getElementById("cartable").rows[rowNum].cells[5].innerHTML = age

            document.getElementById("editform").reset()
            document.getElementById("hide").style.display = "none"
            document.getElementById("submit").disabled = false
        })
}

const checkInput = function (name, make, model, year, plateNum) {
    if (name.value === "" || make.value === "" || model.value === "" || year.value === "" || plateNum.value === "") {
        alert("Need to fill all fields!")
        return false
    }

    if (isNaN(year.value)) {
        alert("Please input a valid year.")
        return false
    }

    let yearNum = parseInt(year.value)

    if (yearNum < 1886) {
        alert("Cars were not invented yet. Please input a valid year.")
        return false
    }

    let d = new Date()
    let d1 = d.getFullYear()

    if (yearNum > d1) {
        alert("This year's models aren't released yet.")
        return false
    }

    year.value = yearNum

    if (plateNum.value.length < 5 || plateNum.value.length > 8) {
        alert("A plate number has a min of 5 and max of 8 characters.")
        return false
    }

    plateNum.value = plateNum.value.toUpperCase()

    json = {
        yourname: name.value,
        make: make.value,
        model: model.value,
        year: year.value,
        plateNum: plateNum.value,
        username: localStorage.getItem("global_username")
    },
        body = JSON.stringify(json)

    return body
}

const fillTable = function () {
    let table = document.getElementById("cartable")

    json = {
        username: localStorage.getItem("global_username")
    },
        body = JSON.stringify(json)

    fetch('/fill', {
        method: 'POST',
        body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.text())
        .then(function (text) {
            const data = JSON.parse(text)

            for (let i = 0; i < data.length; i++) {
                let table = document.getElementById("cartable")
                let row = table.insertRow(-1)
                let c0 = row.insertCell(0)
                let c1 = row.insertCell(1)
                let c2 = row.insertCell(2)
                let c3 = row.insertCell(3)
                let c4 = row.insertCell(4)
                let c5 = row.insertCell(5)
                let c6 = row.insertCell(6)
                let c7 = row.insertCell(7)
                let c8 = row.insertCell(8)
                c0.innerHTML = data[i].yourname
                c1.innerHTML = data[i].make
                c2.innerHTML = data[i].model
                c3.innerHTML = data[i].year
                c4.innerHTML = data[i].plateNum
                c5.innerHTML = data[i].age
                c6.innerHTML = '<button onclick="update(this)">Edit</button>'
                c7.innerHTML = '<button onclick="remove(this)">Delete</button>'
                c8.innerHTML = data[i]._id
            }
            console.log("Pulled rows from database.")
        })
}

window.onload = function () {
    if (window.location.href.match('http://127.0.0.1:3000/registry.html') != null) {
        const button = document.getElementById('submit')
        button.onclick = submit

        const submitChanges = document.getElementById('submitChanges')
        submitChanges.onclick = editSubmission

        fillTable()
    }
    else if (window.location.href.match('http://127.0.0.1:3000/') != null) {
        const loginBtn = document.getElementById('loginBtn')
        loginBtn.onclick = login
    }
}