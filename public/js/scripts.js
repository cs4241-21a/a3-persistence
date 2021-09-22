const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()

    const name = document.querySelector('#yourname'),
        make = document.querySelector("#make"),
        model = document.querySelector("#model"),
        year = document.querySelector("#year"),
        plateNum = document.querySelector("#platenumber")

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
    let table = document.getElementById("cartable")
    for(let row of table.rows) {
        if(row.cells[4].innerHTML === plateNum.value) {
            alert("Cannot have multiple cars with the same plate number.")
            return false
        }
    }

    json = {
        yourname: name.value,
        make: make.value,
        model: model.value,
        year: year.value,
        plateNum: plateNum.value
    },
        body = JSON.stringify(json)

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
            row.className = "rowfixes"
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
            let form = document.getElementById("carform");
            form.reset();
        })

    return
}

const remove = function (obj) {
    let rowNum = obj.parentNode.parentNode.rowIndex
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
        })
}

const edit = function (obj) {
    let rowNum = obj.parentNode.parentNode.rowIndex
    let name = document.getElementById("cartable").rows[rowNum].cells[0].innerHTML
    let make = document.getElementById("cartable").rows[rowNum].cells[1].innerHTML
    let model = document.getElementById("cartable").rows[rowNum].cells[2].innerHTML
    let year = document.getElementById("cartable").rows[rowNum].cells[3].innerHTML
    let plateNum = document.getElementById("cartable").rows[rowNum].cells[4].innerHTML
    let age = document.getElementById("cartable").rows[rowNum].cells[5].innerHTML
    let id = document.getElementById("cartable").rows[rowNum].cells[8].innerHTML
    
    json = {
        yourname: name,
        make: make,
        model: model,
        year: year,
        plateNum: plateNum,
        age: age,
        _id: id
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
        })
}

const resetTable = function () {
    
}

window.onload = function () {
    const button = document.querySelector('button')
    button.onclick = submit
}