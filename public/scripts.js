let pCards = document.getElementById("pCards")
let cCards = document.getElementById("cCards")
let betAmount = document.getElementById("betAmount")
let playerMoneyText = document.getElementById("playerMoney")
let playerMoney = 100;
let pCardTotalText = document.getElementById("pCardTotal")
let cCardTotalText = document.getElementById("cCardTotal")
let moneyBox = document.getElementById("moneyBox")
let pCardTotal = 0
let cCardTotal = 0
let gameButton = document.getElementById("gameButton")
let gameButtonLower = document.getElementById("gameButtonLower")
let betForm = document.getElementById("betForm")
let moneyVar = 0;
let gameMessage = document.getElementById("message")
let gameStatus = "none";
let helpStatus = "hidden";
let pCardArray = [];
let cCardArray = [];
let playedGame = false;

function displayHelp() {
    let help = document.getElementById("helpText")
    if (helpStatus === "hidden") {
        help.style.visibility = "visible"
        helpStatus = "visible"
    } else if (helpStatus === "visible") {
        help.style.visibility = "hidden"
        helpStatus = "hidden"
    }
}

function startGame() {
    if (!playedGame) {
        fetch('/getUserInfo', {
            method:'GET'
        }).then(response => response.json()).then(data => {{
            if (data === null) {
                console.log(data)
            } else {
                document.getElementById("playerMoney").textContent = "Money: $" + data.money
                playerMoney = data.money
                moneyBox.value = data.money
            }
            }
        })
    }
    gameMessage.textContent = "How much money would you like to bet?"
    playerMoneyText.textContent = "Money: $" + playerMoney;
    gameStatus = "placeBets"
}

function placeBet() {
    if (gameStatus === "none") {
        gameMessage.textContent = "You need to start the game first!"
    } else if (betAmount.value === "") {
        gameMessage.textContent = "You need to bet money!"
    } else if (betAmount.value < 1) {
        gameMessage.textContent = "You must bet at least 1 dollar!"
    } else if (betAmount.value > playerMoney) {
        gameMessage.textContent = "You don't have enough money for that!"
        betAmount.value = "";
    } else {
        moneyVar = betAmount.value;
        gameMessage.textContent = "What would you like to do?" 
        playerMoney -= betAmount.value;
        moneyBox.value = playerMoney;
        playerMoneyText.textContent = "Money: $" + playerMoney;
        let card1 = randomCard();
        let card2 = randomCard();
        let card3 = randomCard();
        let card4 = randomCard();
        pCardArray = [card1, card2]
        cCardArray = [card3, card4]
        gameButton.setAttribute("onclick", "drawCard()")
        gameButton.textContent = "Draw Card"
        gameButtonLower.setAttribute("onclick", "holdCards()")
        gameButtonLower.textContent = "Hold Cards"
        betForm.style.visibility = "hidden";
        updateGame();
    }
}

function randomCard() {
    let card = Math.floor(Math.random() * 13) + 1
    if (card >= 11) {
        card = 10;
    } else if (card === 1) {
        card = 11;
    }
    console.log(card);
    return card;
}

function updateGame() {
    pCards.textContent = "Cards: "
    cCards.textContent = "Cards: "
    pCardTotal = 0;
    cCardTotal = 0;
    for (let i = 0; i < pCardArray.length; i++) {
        pCards.textContent += pCardArray[i] + " "
        pCardTotal += pCardArray[i]
    }
    for (let i = 0; i < cCardArray.length; i++) {
        cCards.textContent += cCardArray[i] + " "
        cCardTotal += cCardArray[i]
    }
    pCardTotalText.textContent = "Total Card Value: " + pCardTotal
    cCardTotalText.textContent = "Total Card Value: " + cCardTotal
    
    if (gameStatus === "holding") {
        if (cCardTotal > pCardTotal && cCardTotal <= 21) {
            gameMessage.textContent = "You Lost!"
            gameStatus = "playerLost"
        } else {
            gameMessage.textContent = "You Won!"
            gameStatus = "playerWon"
        }
    }
    
    if (pCardTotal === 21) {
        gameMessage.textContent = "You Won!"
        gameStatus = "playerWon"
    } else if (cCardTotal === 21) {
        gameMessage.textContent = "You Lost!"
        gameStatus = "playerLost"
    } else if (pCardTotal > 21) {
        gameMessage.textContent = "You Lost!"
        gameStatus = "playerLost"
    } else if (cCardTotal > 21 && pCardTotal < 21) {
        gameMessage.textContent = "You Won!"
        gameStatus = "playerWon"
    }

    if (gameStatus === "playerWon" || gameStatus === "playerLost") {
        endGame();
    }
    console.log("Game Updated")
}

function drawCard() {
    pCardArray.push(randomCard())
    cCardArray.push(randomCard())
    updateGame();
}
function holdCards() {
    gameStatus = "holding"
    gameMessage.textContent = "The computer draws a card..."
    setTimeout(function() {
        cCardArray.push(randomCard())
        updateGame();
    }, 2000)
}

function endGame() {
    playedGame = true;
    if (gameStatus === "playerWon") {
        playerMoney += (moneyVar * 2);
        playerMoneyText.textContent = "Money: $" + playerMoney;
        moneyBox.value = playerMoney
    }
    gameStatus = "none"
    gameButton.style.visibility = "hidden"
    gameButtonLower.style.visibility = "hidden"
    setTimeout(function () {
        gameMessage.textContent = "Resetting game..."
    }, 2000)
    setTimeout(function() {
        gameMessage.textContent = "Welcome to Blackjack! Press the Start Game button to begin!"
        gameButton.setAttribute("onclick", "startGame()")
        gameButton.textContent = "Start Game"
        gameButtonLower.setAttribute("onclick", "placeBet()")
        gameButtonLower.textContent = "Place Bet"
        gameButton.style.visibility = "visible"
        gameButtonLower.style.visibility = "visible"
        betForm.style.visibility = "visible"
        moneyVar = 0
        pCardArray.length = 0
        cCardArray.length = 0
        pCardTotal = 0
        cCardTotal = 0
        pCardTotalText.textContent = "Total Card Value: "
        cCardTotalText.textContent = "Total Card Value: "
        pCards.textContent = "Cards: "
        cCards.textContent = "Cards: "
    }, 5000)
}

document.getElementById("addScore").onclick = function() {
    document.getElementById("addForm").submit();
}

document.getElementById("accButton").onclick = function() {
    document.getElementById("accountManage").submit();
}

document.getElementById("scoreboardButton").onclick = function() {
    document.getElementById("viewScoreboard").submit();
}

window.onload = function() {
    playedGame = false;
    fetch('/getUserInfo', {
        method:'GET'
    }).then(response => response.json()).then(data => {{
        document.getElementById("playerMoney").textContent = "Money: $" + data.money
        moneyBox.value = data.money
        }
    })
}

function refreshChart() {
    setTimeout(function() {
        createScores();
        refreshChart();
    }, 3000)
}
