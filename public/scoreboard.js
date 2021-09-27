const scoreDiv = document.querySelector("div.scores");
let tableHeaders = ["Name", "Gender", "Money", "Best Player?"]

window.onload = () => {
    createScores()
    refreshScores()
}

function createScores() {
    
    while (scoreDiv.firstChild) scoreDiv.removeChild(scoreDiv.firstChild)

    let scoresTable = document.createElement('table')
    scoresTable.className = 'scoresTable'

    let scoresTableHead = document.createElement('thead')
    scoresTableHead.className = 'scoresTableHead'

    let scoresTableHeaderRow = document.createElement('tr') 
    scoresTableHeaderRow.className = 'scoresTableHeaderRow'

    tableHeaders.forEach(header => {
        let scoreHeader = document.createElement('th')
        scoreHeader.innerText = header
        scoresTableHeaderRow.append(scoreHeader)
    })

    scoresTableHead.append(scoresTableHeaderRow)
    scoresTable.append(scoresTableHead)

    let scoresTableBody = document.createElement('tbody')
    scoresTableBody.className = "scoresTable-Body"
    scoresTable.append(scoresTableBody)
    addScores();

    scoreDiv.append(scoresTable)
}

function appendScores(score) {
    const scoresTable = document.querySelector('.scoresTable')

    let scoresTableBodyRow = document.createElement('tr')
    scoresTableBodyRow.className = 'scoresTableBodyRow'

    let nameData = document.createElement('td')
    nameData.innerText = score.Username

    let genderData = document.createElement('td')
    genderData.innerText = score.gender

    let moneyData = document.createElement('td')
    moneyData.innerText = score.money

    let bestPlayerData = document.createElement('td')
    bestPlayerData.innerText = score.isBestPlayer

    scoresTableBodyRow.append(nameData, genderData, moneyData, bestPlayerData)

    scoresTable.append(scoresTableBodyRow)
}


function addScores() {
    let highestValue = 0;
    fetch( '/getAllScores', {
        method:'GET',
        }).then (response => response.json()).then(data => {{
            for (let i = 0; i < data.length; i++) {
                if (data[i]["money"] > highestValue) {
                    highestValue = data[i]["money"]
                }
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i]["money"] === highestValue) {
                    data[i]["isBestPlayer"] = true;
                } else data[i]["isBestPlayer"] = false;
                appendScores(data[i])
            }
        }}
    )
}

document.getElementById("returnToMainButton").onclick = function() {
    document.getElementById("returnToMainForm").submit();
}

let toggleRefresh = document.getElementById("toggleRefresh")

function refreshScores() {
    setTimeout(function() {
        if (toggleRefresh.checked === true) {
            createScores()
        }
        refreshScores()
    }, 4000)
}