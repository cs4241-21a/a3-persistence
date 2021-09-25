//import "nes.css/css/nes.min.css";
const logout = function () {
    //console.log('here')
    fetch('/logout')
}

const addScore = function () {
    const date = new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/'),
        json = { score: correct, date: date },
        body = JSON.stringify(json)
    fetch('/add', {
        method: 'POST',
        body,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then( getUserData )
}

const delScore = function (id) {
    console.log("deleting")
    const json = { _id: id},
        body = JSON.stringify(json)
    console.log(body)
    fetch('/remove', {
        method: 'POST',
        body,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then( getUserData )
}

const updateScore = function (id, newScore) {
    console.log("deleting")
    const json = { _id: id,
                    score:newScore},
        body = JSON.stringify(json)
    fetch('/update', {
        method: 'POST',
        body,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then( getUserData )
}

const fixScore = function (id) {
    if (confirm("Delete score?")){
        console.log("deleting")
        delScore(id)
    } else {
        if (confirm("Update the entry instead?")){
            let newScore = prompt("Enter a new score")
            console.log("updating", newScore)
            updateScore(id, newScore)
        } else {
            console.log("")
        }
    }
}

const saveScore = function () {
    if (confirm("Save your score?")){
        console.log("saved")
        addScore()
    } else {
        console.log("not saved")
    }
}

playMenu = new Audio('/public/menu_track.mp3')
playCorrect = new Audio('/public/correct.mp3')
playWrong = new Audio("/public/trump_wrong.mp3")

let GAMELENGTH = 60

let time = GAMELENGTH
let timer = null
let correct = 0
let clock = null
let started = false
let mode = null
let flipper = null

const endGame = function () {
    started = false
    clearInterval(timer)
    document.removeEventListener("keydown", handleKeys)
    ans = ""
    document.getElementById("bar").value = GAMELENGTH
    document.getElementById("bar").className = "nes-progress is-pattern"
    const multiply = document.getElementById("multiply")
    multiply.onclick = function() {
        mode = 0
        document.getElementById("start").className = "nes-btn is-primary"
        document.getElementById("mode").innerText = "Multiply"
    }
    const add = document.getElementById("add")
    add.onclick = function() {
        mode = 1
        document.getElementById("start").className = "nes-btn is-primary"
        document.getElementById("mode").innerText = "Add"
    }
    document.getElementById("answer").value = "Answer"
    let flip = false
    flipper = setInterval(() => {
        if (flip) {
            document.getElementById("running_correct").className = "nes-text is-success"
            flip = false
        } else {
            document.getElementById("running_correct").className = "nes-text"
            flip = true
        }
    }, 250);
    pressButtons("is-success")
    setTimeout(saveScore, 250)
}

const list = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "equal", "delete", "clear"]

const pressButtons = function (color) {
    list.forEach((elt) => document.getElementById(elt).className = "nes-btn " + color)
}

const tick = function () {
    time -= 1
    document.getElementById("bar").value = time
    if (time === Math.floor(GAMELENGTH/2)) {
        pressButtons("is-warning")
        document.getElementById("bar").className = "nes-progress is-warning"
        document.getElementById("question").className = "nes-text is-warning"
    } else if (time === Math.floor(GAMELENGTH/4)) {
        pressButtons("is-error")
        document.getElementById("bar").className = "nes-progress is-error"
        document.getElementById("question").className = "nes-text is-error"
    } else if (time === 0){
        endGame()
    }
}

const start = function () {
    if (!started) {
        started = true
        correct = 0
        time = GAMELENGTH
        history = []
        displayHistory()
        clearInterval(flipper)
        playMenu.play()
        document.getElementById("bar").value = time
        document.getElementById("running_correct").innerText = "0"
        const mulitply = document.getElementById("multiply")
        mulitply.onclick = null
        const add = document.getElementById("add")
        add.onclick = null
        document.getElementById("running_correct").className = "nes-text"
        document.getElementById("bar").className = "nes-progress is-success"
        document.getElementById("bar").max = GAMELENGTH
        document.getElementById("bar").value = GAMELENGTH
        document.getElementById("question").className = "nes-text is-primary"
        timer = setInterval(tick,1000)
        document.addEventListener("keydown", handleKeys)
        makeQuiz()
        console.log()
    }
}

let X = 0
let Y = 0
let ans = ""
let question = ""
let history = []

const makeQuiz = function () {
    if (mode) {
        X = Math.floor(Math.random() * 100)
        Y = Math.floor(Math.random() * 100)
        question = X + " + " + Y
    } else {
        X = Math.floor(Math.random() * 12)
        Y = Math.floor(Math.random() * 12)
        question = X + " x " + Y
    }
    document.getElementById("question").innerText = question
}

const displayHistory = function () {
    let str = ""
    history.forEach((item) => str += "<li>" + item + "</li>")
    document.getElementById("prevlist").innerHTML = str
}

const displayPastScores = function () {
    let str = ""
    let first = "<li>"
    let second = "</li>"
    pastScores.forEach(item => {
        str += first + "<a onmouseover='this.style.color = \"red\"' onmouseout='this.style.color = \"black\"' onclick=\"fixScore('"+ item._id +"')\">" + item.score + " - " + item.date + "</a>" + second
    })
    document.getElementById("dblist").innerHTML = str
}


const handleKeys = function ( e ) {
    if (e.key >=0 && e.key <=9) {
        ans += e.key
        document.getElementById("answer").innerText = ans
    } else if (e.keyCode === 8) {
        ans = ans.slice(0, ans.length-1)
        if (ans.length === 0) {
            document.getElementById("answer").innerText = "Answer"
        } else {
            document.getElementById("answer").innerText = ans
        }
    } else if (e.keyCode === 13) {
        answer = document.getElementById("answer").innerText
        if ((answer == (X+Y)) && (mode===1) || (answer == (X*Y)) && (mode===0)) {
            playCorrect.play()
            correct += 1
            history.push(question + " = " + ans)
            displayHistory()
            document.getElementById("running_correct").innerText = correct
            document.getElementById("answer").innerText = "Answer"
            ans = ""
            makeQuiz()
        } else {
            playWrong.play()
            document.getElementById("answer").innerText = "Nope"
            ans = ""
        }
    }
}

let user = null
let pastScores = null

const getUser = function () {
    fetch('/getUser')
    .then(response => response.json())
    .then( json => {
        user = json
        document.getElementById("welcome").innerText = "Welcome back, " + user.username + "!"
    })
}

const getUserData = function () {
    fetch('/getUserData')
    .then(response => response.json())
    .then(json => {
        pastScores = json
        console.log(pastScores)
        displayPastScores()
    })
}

const handleButtons = function () {
    list.forEach(item => document.getElementById(item).addEventListener('onclick', handleKeys))
}

window.onload = function() {

    getUser()
    getUserData()

    playMenu.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    document.getElementById("start").className = "nes-btn is-disabled"

    const logout_button = document.getElementById("logout")
    logout_button.onclick = logout

    const start_button = document.getElementById("start")

    const multiply = document.getElementById("multiply")
    multiply.onclick = function() {
        mode = 0
        document.getElementById("start").className = "nes-btn is-primary"
        start_button.onclick = start
        document.getElementById("mode").innerText = "Multiply"
    }

    const add = document.getElementById("add")
    add.onclick = function() {
        mode = 1
        document.getElementById("start").className = "nes-btn is-primary"
        start_button.onclick = start
        document.getElementById("mode").innerText = "Add"
    }
}