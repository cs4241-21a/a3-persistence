const gameCanvas = document.getElementById('canvascontainer');
let submitBtn = document.getElementById( 'submitBtn' );

window.onload = function() {
    submitBtn.onclick = submit;
}

const submit = function( e ) {
    e.preventDefault();
    const input2 = document.getElementById('printScore'),
        json = {
            yourname: '',
            score: input2.innerText,
            rank: ""
        },
        body = JSON.stringify(json)

    fetch('/submit', {
        method: 'POST',
        body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            // do something with the response
            console.log("Post made to server");
        })
        .then(function (json) {
            console.log(json);
            window.location.reload();
        })

    //updateLeaderboards();
    return false;
}

/////////////////JS for the Game/////////////////////////
let myGameArea;
let myGamePiece;
let myObstacles = [];
let myScore;

function restartGame() {
    document.getElementById("myfilter").style.display = "none";
    document.getElementById("myrestartbutton").style.display = "none";
    document.getElementById("submitBtn").style.display = "none";
    myGameArea.stop();
    myGameArea.clear();
    myGameArea = {};
    myGamePiece = {};
    myObstacles = [];
    myScore.innerText = 0;
    document.getElementById("canvascontainer").innerHTML = "";
    startGame()
}

function startGame() {
    document.getElementById("startBtn").style.display = "none";
    myGameArea = new gamearea();
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = document.getElementById('printScore');
    document.getElementById("accelBtn").style.display = "block";
    document.getElementById("scorePrint").style.display = "block";
    myGameArea.start();
}

function gamearea() {
    this.canvas = document.createElement("canvas"),
        this.start = function() {
            this.canvas.width = 480;
            this.canvas.height = 270;
            this.context = this.canvas.getContext("2d");
            gameCanvas.appendChild(this.canvas);
            this.pause = false;
            this.frameNo = 0;
            this.interval = setInterval(updateGameArea, 20);
        },
        this.stop = function (){
            clearInterval(this.interval);
            this.pause = true;
        },
        this.clear = function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
}

function component(width, height, color, x, y) {
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hitTop();
    }
    this.hitBottom = function() {
        let rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.hitTop = function() {
        let heightLimit = 0;
        if (this.y <= heightLimit){
            this.y = heightLimit;
            this.gravitySpeed = 0.25;
        }
    }
    this.crashWith = function(otherobj) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    let x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (let i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            document.getElementById("myfilter").style.display = "block";
            document.getElementById("myrestartbutton").style.display = "block";
            document.getElementById("submitBtn").style.display = "block";
            document.getElementById("accelBtn").style.display = "none";
            return;
        }
    }
    if (myGameArea.pause === false) {
        myGameArea.clear();
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo === 1 || everyinterval(150)) {
            x = myGameArea.canvas.width;
            minHeight = 20;
            maxHeight = 200;
            height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            minGap = 50;
            maxGap = 200;
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            myObstacles.push(new component(10, height, "green", x, 0));
            myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
        }
        for (let i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
        }
        myScore.innerText = myGameArea.frameNo;
        myGamePiece.newPos();
        myGamePiece.update();
    }
}

function everyinterval(n) {
    return (myGameArea.frameNo / n) % 1 === 0;

}

function accelerate(n) {
    myGamePiece.gravity = n;
}

document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        accelerate(0.05);
    }
});
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        accelerate(-0.2);
    }
});
