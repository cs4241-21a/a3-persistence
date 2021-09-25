//import "nes.css/css/nes.min.css";
const logout = function () {
    //console.log('here')
    fetch("/logout")
}

playMenu = new Audio('/public/menu_track.mp3')
playCorrect = new Audio('/public/correct.mp3')
playWrong = new Audio("/public/trump_wrong.mp3")

let time = 60
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
    document.getElementById("answer").value = "Answer"
    ans = ""
    document.getElementById("bar").value = 60
    document.getElementById("bar").className = "nes-progress is-pattern"
    const multiply = document.getElementById("multiply")
    document.getElementById("multiply").className = "nes-btn"
    multiply.onclick = function() {
        mode = 0
        document.getElementById("start").className = "nes-btn is-primary"
        document.getElementById("mode").innerText = "Multiply"
    }
    const add = document.getElementById("add")
    document.getElementById("add").className = "nes-btn"
    add.onclick = function() {
        mode = 1
        document.getElementById("start").className = "nes-btn is-primary"
        document.getElementById("mode").innerText = "Add"
    }
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
}

const list = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "zero", "equal", "delete", "clear"]

const pressButtons = function (color) {
    list.forEach((elt) => document.getElementById(elt).className = "nes-btn " + color)
}

const tick = function () {
    time -= 1
    document.getElementById("bar").value = time
    if (time === 30) {
        pressButtons("is-warning")
        document.getElementById("bar").className = "nes-progress is-warning"
        document.getElementById("question").className = "nes-text is-warning"
    } else if (time === 10) {
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
        time = 60
        history = []
        displayHistory()
        clearInterval(flipper)
        playMenu.play()
        document.getElementById("bar").value = time
        document.getElementById("running_correct").innerText = "0"
        const mulitply = document.getElementById("multiply")
        document.getElementById("multiply").className = "nes-btn is-disabled"
        mulitply.onclick = null
        const add = document.getElementById("add")
        document.getElementById("add").className = "nes-btn is-disabled"
        add.onclick = null
        document.getElementById("running_correct").className = "nes-text"
        document.getElementById("bar").className = "nes-progress is-success"
        document.getElementById("question").className = "nes-text is-primary"
        timer = setInterval(tick,1000)
        document.addEventListener("keydown", handleKeys)
        makeQuiz()
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


window.onload = function() {
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