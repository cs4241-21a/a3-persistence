window.onload = function() {
    getCurrentUser()
    const editButton = document.querySelector('#editButton')
    editButton.onclick = editProfile
    const deleteButton = document.querySelector('#deleteButton')
    deleteButton.onclick = deleteProfile
    const logoutButton = document.querySelector('#logoutButton')
    logoutButton.onclick = logout
    const addPuntButton = document.querySelector('#addPuntButton')
    addPuntButton.onclick = addPunt
    const editPuntButton = document.querySelector('#editPuntButton')
    editPuntButton.onclick = editPunt
    const deletePuntButton = document.querySelector('#deleteButtonPunt')
    deletePuntButton.onclick = deletePunt
}

function generateProfile(user) {
    userProfile = document.getElementById("user-profile")
    userProfile.innerHTML = user.firstName + " " + user.lastName + "<small>@" + user.username + "</small>" 
    + "<small>" + user.organization + "</small>" + "<small>Joined " + user.joinDate + "</small>"
    document.getElementById("e1-text").value = user.firstName
    document.getElementById("e2-text").value = user.lastName
    document.getElementById("e3-text").value = user.username
    document.getElementById("e4-text").value = user.password
    document.getElementById("e5-text").value = user.password
    document.getElementById("e6-text").value = user.organization
    deleteTable()
    parsePunts(user.punts)
}

const editProfile = function(e) {
    e.preventDefault()

    const firstName = document.getElementById("e1-text")
    const lastName = document.getElementById("e2-text")
    const username = document.getElementById("e3-text")
    const organization = document.getElementById("e6-text")
    const password = document.getElementById("e4-text")
    const passwordConfirm = document.getElementById("e5-text")

    if (checkField(firstName)) { return }
    if (checkField(lastName)) { return }
    if (checkField(username)) { return }
    if (checkField(organization)) { return }
    if (checkEditPassword(password, passwordConfirm)) {
        return
    }

    json = { "firstName": firstName.value, "lastName": lastName.value, "username": username.value, 
    "organization": organization.value, "password": password.value}
    console.log(json)
    console.log(lastName.value)

    fetch ('update', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    })
    .then(function(response) {
        console.log(response.body)
        getCurrentUser()
    })
}

const deleteProfile = function(e) {
    e.preventDefault()

    fetch ('delete', {
        method:'POST'
    })
    .then(function(response) {
        window.location.href = response.url
        console.log(response.body)
    })
}

const addPunt = function(e) {
    e.preventDefault()

    const punt = checkPuntFields()
    if (!punt) {
        return
    }
 
    fetch ('addPunt', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(punt)
    })
    .then(function(response) {
        console.log(response.body)
        window.location.reload()
    })
}

const logout = function(e) {
    e.preventDefault()
    
    fetch ('logout', {
        method:'POST'
    })
    .then(function(response) {
        window.location.href = response.url
        console.log(response.body)
    })
}

function checkEditPassword(pass1, pass2) {
    if (pass1.value === "" && pass2.value === "") {
        return true
    }
    else if (pass1.value != pass2.value) {
        differentPasswords(pass1, pass2)
        return true
    }
    else if (pass1.value < 8) {
        shortPassword(pass1.value, pass2.value)
        return true
    }
    return false
}

function differentPasswords(pass1, pass2) {
    pass1.style.borderColor = "red"
    pass2.style.borderColor = "red"
    console.log("passwords must match")
}

function shortPassword(pass1, pass2) {
    pass1.style.borderColor = "red"
    pass2.style.borderColor = "red"
    console.log("password must be at least 8 characters")
}

function checkPuntFields() {
    let date = document.getElementById("p1-text")
    let setting = document.getElementById("p2-text")
    let yards = document.getElementById("p3-text")
    let hangtime = document.getElementById("p4-text")
    let returnYards = document.getElementById("p5-text")
    let snapToKick = document.getElementById("p6-text")
    let fairCatch = document.getElementById("p7-text")
    let touchback = document.getElementById("p8-text")
    let inside20 = document.getElementById("p9-text")
    let inside10 = document.getElementById("p10-text")
    let errorText = document.getElementById("puntError")

    date.style.borderColor = "transparent"
    setting.style.borderColor = "transparent"
    yards.style.borderColor = "transparent"
    hangtime.style.borderColor = "transparent"
    returnYards.style.borderColor = "transparent"
    snapToKick.style.borderColor = "transparent"
    fairCatch.style.borderColor = "transparent"
    touchback.style.borderColor = "transparent"
    inside20.style.borderColor = "transparent"
    inside10.style.borderColor = "transparent"
    errorText.innerText = ""
    

    if (inside20.checked === false && inside10.checked === true) {
        inside20.checked = true
        return true
    }
    if (fairCatch.checked === true && returnYards.value != "") {
        returnYards.style.borderColor = "red"
        fairCatch.style.borderColor = "red"
        errorText.innerText = "Cannot have return yards on a fair catch"
        return true
    }
    if ((inside20.checked === true || inside10.checked === true) && touchback.checked === true) {
        touchback.style.borderColor = "red"
        inside20.style.borderColor = "red"
        inside10.style.borderColor = "red"
        errorText.innerText = "Cannot have a touchback and inside 10/20"
        return true
    }
    if (date.value === "") {
        date.style.borderColor = "red"
        errorText.innerText = "Date required"
        return true
    }
    isNumber(yards)
    isNumber(hangtime)
    isNumber(returnYards)
    isNumber(snapToKick)
    fairCatch = trueToYes(fairCatch)
    touchback = trueToYes(touchback)
    inside20 = trueToYes(inside20)
    inside10 = trueToYes(inside10)

    return { "date": date.value, "setting": setting.value, "yards": yards.value, "hangtime": hangtime.value, 
    "returnYards": returnYards.value, "snapToKick": snapToKick.value, "fairCatch": fairCatch, 
    "touchback": touchback, "inside20": inside20, "inside10": inside10 }
}

function isNumber(field) {
    if (parseFloat(field.value) || field.value === "") {
        return false
    }
    else {
        field.style.borderColor = "red"
        document.getElementById("puntError").innerText = "Must be a number"
        return true 
    }
}

function trueToYes(checkbox) {
    if(checkbox.checked === true) {
        return "Yes"
    }
    else {
        return "No"
    }
}

 function parsePunts(punts) {
    let yards = 0, hangtime = 0, returnYards = 0, snapToKick = 0, numYards = 0, numHangtime = 0,
    numReturnYards = 0, numSnapToKicks = 0, highYards = 0, highHangtime = 0, highCatchToKick = 0,
    numPunts = 0, numFairCatches = 0
    for (let i = 0; i < punts.length; i++) {
        numPunts++
        const table = document.getElementById("puntTable")
        let tableRow = document.createElement('tr')
        table.appendChild(tableRow)
        tableRow.onclick = selectRow
        // Date
        let dateCell = document.createElement('th')
        dateCell.innerText = punts[i].date
        dateCell.setAttribute("data-label", "Date")
        tableRow.appendChild(dateCell)
        // Setting
        let settingCell = document.createElement('th')
        settingCell.innerText = punts[i].setting
        settingCell.setAttribute("data-label", "Setting")
        tableRow.appendChild(settingCell)
        // Yards
        let yardsCell = document.createElement('th')
        yardsCell.setAttribute("data-label", "Yards")
        if (punts[i].yards != "") {
            numYards++
            yards += parseFloat(punts[i].yards)
            yardsCell.innerText = punts[i].yards
            if (punts[i].yards > highYards) { highYards = punts[i].yards}
        }
        else { yardsCell.innerText = "0.0"}
        tableRow.appendChild(yardsCell)
        // Net Yards
        let netYardsCell = document.createElement('th')
        netYardsCell.setAttribute("data-label", "Net Yards")
        if (punts[i].yards != "" && punts[i].returnYards != "") {
            netYardsCell.innerText = punts[i].yards - punts[i].returnYards
        }
        else { netYardsCell.innerText = "0.0"}
        tableRow.appendChild(netYardsCell)
        // Hangtime
        let hangtimeCell = document.createElement('th')
        hangtimeCell.setAttribute("data-label", "Hangtime")
        if (punts[i].hangtime != "") {
            numHangtime++
            hangtime += parseFloat(punts[i].hangtime)
            hangtimeCell.innerText = punts[i].hangtime
            if (punts[i].hangtime > highHangtime) { highHangtime = punts[i].hangtime}
        }
        else { hangtimeCell.innerText = "0.0"}
        tableRow.appendChild(hangtimeCell)
        // Snap to Kick
        let snapToKickCell = document.createElement('th')
        snapToKickCell.setAttribute("data-label", "Catch to Kick")
        if (punts[i].snapToKick != "") {
            numSnapToKicks++
            snapToKick += parseFloat(punts[i].snapToKick)
            snapToKickCell.innerText = punts[i].snapToKick
            if (punts[i].snapToKick > highCatchToKick) { highCatchToKick = punts[i].snapToKick}
        }
        else { snapToKickCell.innerText = "0.0"}
        tableRow.appendChild(snapToKickCell)
        // Return Yards
        let returnYardsCell = document.createElement('th')
        returnYardsCell.setAttribute("data-label", "Return Yards")
        if (punts[i].returnYards != "") {
            numReturnYards++
            returnYards += parseFloat(punts[i].returnYards)
            returnYardsCell.innerText = punts[i].returnYards
        }
        else { returnYardsCell.innerText = "0.0"}
        tableRow.appendChild(returnYardsCell)
        // Fair Catch
        let fairCatchCell = document.createElement('th')
        fairCatchCell.setAttribute("data-label", "Fair Catch")
        fairCatchCell.innerText = punts[i].fairCatch
        tableRow.appendChild(fairCatchCell)
        if (punts[i].fairCatch === "Yes") { numFairCatches++ }
        // Touchback
        let touchbackCell = document.createElement('th')
        touchbackCell.setAttribute("data-label", "Touchback")
        touchbackCell.innerText = punts[i].touchback
        tableRow.appendChild(touchbackCell)
        // Inside 20
        let inside20Cell = document.createElement('th')
        inside20Cell.setAttribute("data-label", "Inside 20")
        inside20Cell.innerText = punts[i].inside20
        tableRow.appendChild(inside20Cell)
        // Inside 10
        let inside10Cell = document.createElement('th')
        inside10Cell.setAttribute("data-label", "Inside 10")
        inside10Cell.innerText = punts[i].inside10
        tableRow.appendChild(inside10Cell)
    }
    document.getElementById("highYards").innerText = "Yards: " + highYards
    document.getElementById("highHangtime").innerText = "Hangtime: " + highHangtime
    document.getElementById("highCatchToKick").innerText = "Catch to Kick: " + highCatchToKick

    const statsTable = document.getElementById("stats")
    let statsRow = document.createElement('tr')
    statsTable.appendChild(statsRow)
    // Punts
    document.getElementById("sPunts").innerText = numPunts
    // Yards
    document.getElementById("sYards").innerText = yards
    // Average Yards
    document.getElementById("sAverageYards").innerText = (yards / numYards).toFixed(1)
    // Average Hangtime
    document.getElementById("sAverageHangtime").innerText = (hangtime / numHangtime).toFixed(1)
    // Fair Catches
    document.getElementById("sFairCatches").innerText = numFairCatches
 }

function deleteTable() {
    const table = document.getElementById("puntTable")
    while (table.firstChild) {
      table.removeChild(table.lastChild)
    }
}

let selectedIndex = 0
let selected = true

const selectRow = function(e) {
    e.preventDefault()
    selected = true

    let row = document.getElementById("puntTable").childNodes[selectedIndex]
    for (let i = 0; i < row.childNodes.length; i++) {
        row.childNodes[i].style.color = "black"
    }
    console.log(e)
    selectedIndex = e.path[1].rowIndex - 1
    row = document.getElementById("puntTable").childNodes[selectedIndex]
    for (let i = 0; i < row.childNodes.length; i++) {
        row.childNodes[i].style.color = "red"
    }

    fetch ('getPunt', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "selected": selectedIndex })
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(json) {
        populateEditPunt(json)
    })
}

function populateEditPunt(punt) {
    console.log(punt)
    document.getElementById("edp1-text").value = punt.date
    document.getElementById("edp2-text").value = punt.setting
    document.getElementById("edp3-text").value = punt.yards
    document.getElementById("edp4-text").value = punt.hangtime
    document.getElementById("edp5-text").value = punt.returnYards
    document.getElementById("edp6-text").value = punt.snapToKick
    document.getElementById("edp7-text").checked = yesToChecked(punt.fairCatch)
    document.getElementById("edp8-text").checked = yesToChecked(punt.touchback)
    document.getElementById("edp9-text").checked = yesToChecked(punt.inside20)
    document.getElementById("edp10-text").checked = yesToChecked(punt.inside10)
}

function yesToChecked(punt) {
    if (punt === "Yes") { return true }
    else { return false }
}

function checkEditPunt() {
    let date = document.getElementById("edp1-text")
    let setting = document.getElementById("edp2-text")
    let yards = document.getElementById("edp3-text")
    let hangtime = document.getElementById("edp4-text")
    let returnYards = document.getElementById("edp5-text")
    let snapToKick = document.getElementById("edp6-text")
    let fairCatch = document.getElementById("edp7-text")
    let touchback = document.getElementById("edp8-text")
    let inside20 = document.getElementById("edp9-text")
    let inside10 = document.getElementById("edp10-text")
    let errorText = document.getElementById("puntErrorEdit")

    date.style.borderColor = "transparent"
    setting.style.borderColor = "transparent"
    yards.style.borderColor = "transparent"
    hangtime.style.borderColor = "transparent"
    returnYards.style.borderColor = "transparent"
    snapToKick.style.borderColor = "transparent"
    fairCatch.style.borderColor = "transparent"
    touchback.style.borderColor = "transparent"
    inside20.style.borderColor = "transparent"
    inside10.style.borderColor = "transparent"
    errorText.innerText = ""
    

    if (inside20.checked === false && inside10.checked === true) {
        inside20.checked = true
        return true
    }
    if (fairCatch.checked === true && returnYards.value != "") {
        returnYards.style.borderColor = "red"
        fairCatch.style.borderColor = "red"
        errorText.innerText = "Cannot have return yards on a fair catch"
        return true
    }
    if ((inside20.checked === true || inside10.checked === true) && touchback.checked === true) {
        touchback.style.borderColor = "red"
        inside20.style.borderColor = "red"
        inside10.style.borderColor = "red"
        errorText.innerText = "Cannot have a touchback and inside 10/20"
        return true
    }
    if (date.value === "") {
        date.style.borderColor = "red"
        errorText.innerText = "Date required"
        return true
    }
    isNumber(yards)
    isNumber(hangtime)
    isNumber(returnYards)
    isNumber(snapToKick)
    fairCatch = trueToYes(fairCatch)
    touchback = trueToYes(touchback)
    inside20 = trueToYes(inside20)
    inside10 = trueToYes(inside10)

    return { "date": date.value, "setting": setting.value, "yards": yards.value, "hangtime": hangtime.value, 
    "returnYards": returnYards.value, "snapToKick": snapToKick.value, "fairCatch": fairCatch, 
    "touchback": touchback, "inside20": inside20, "inside10": inside10 }
}

const editPunt = function(e) {
    e.preventDefault()

    const punt = checkEditPunt()
    if (!punt) {
        return
    }
    console.log(punt)
 
    fetch ('updatePunt', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(punt)
    })
    .then(function(response) {
        console.log(response.body)
        getCurrentUser()
    })
}

const deletePunt = function(e) {
    e.preventDefault()

    if (selected) {
        fetch ('deletePunt', {
            method:'POST',
        })
        .then(function(res) {
            console.log("SOS")
            window.location.reload()
        })
    }
}   
