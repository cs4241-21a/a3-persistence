const dataTable = document.getElementById('Leaderboard');
const gameCanvas = document.getElementById('canvascontainer');
let submitBtn = document.getElementById( 'submitBtn' );
let editSubBtn = document.getElementById('submitNewNameBtn');
let rowNumEdit;
let killEdit = false;

window.onload = function() {
    makeTableHead();
    updatePage();
    submitBtn.onclick = submit;
    editSubBtn.onclick = callEdit;
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

const submit = function( e ) {
    e.preventDefault();
    const input = document.querySelector( '#yourname' ),
        input2 = document.getElementById('printScore'),
        json = { yourname: input.value,
            score: input2.innerText,
            rank: "" },
        body = JSON.stringify( json )
    if (input.value === "") {
        window.alert("Please enter a username");
        return false;
    }

    fetch( '/submit', {
        method:'POST',
        body,
        headers:{
            "Content-Type":"application/json"
        }
    })
        .then( function( response ) {
            // do something with the response
            console.log("Post made to server");
        })
        .then( function( json ) {
            console.log(json);
            updatePage();
        })
    return false;
}

let count = 3;

let appdata;

const makeTableHead = function () {
    let thName = document.createElement('th');
    let thScore = document.createElement('th');
    let thRank = document.createElement('th');
    let thEdit = document.createElement('th');
    let thReport = document.createElement('th');
    thName.innerHTML = 'Name';
    thScore.innerHTML = 'Score';
    thRank.innerHTML = 'Rank';
    thEdit.innerHTML = "Edit";
    thReport.innerHTML = "Report";
    let tableRow = document.createElement('tr');
    tableRow.appendChild(thName);
    tableRow.appendChild(thScore);
    tableRow.appendChild(thRank);
    tableRow.appendChild(thEdit);
    tableRow.appendChild(thReport);
    dataTable.appendChild(tableRow);
};

function checkExisting(){
    const input = document.querySelector( '#editName' );
    fetch('/updatePage', {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        appdata = json;
        for(let user of appdata){
            console.log(user.yourname);
            if (user.yourname === input.value){
                window.alert("Please enter a unique username");
                killEdit = true;
            }
        }
    })
    return false;
}

//Edit Function
const callEdit = async function () {
    const input = document.querySelector('#editName'),
        input2 = rowNumEdit,
        json = {
            newName: input.value,
            oldName: input2
        },
        body = JSON.stringify(json)

    /*const promise1 = ()=> new Promise( async (resolve) => {
        checkExisting();
        resolve();
    });

    await promise1;*/
    await checkExisting();

    if (killEdit) {
        killEdit = false;
        return false;
    }
    fetch('/modify', {
        method: 'POST',
        body,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        // do something with the response
        console.log("Post made to server");
    }).then(function (json) {
        console.log(json);
        updatePage();
        document.getElementById("editName").style.display = "none";
        document.getElementById("submitNewNameBtn").style.display = "none";
    })
    /*if (fetch('/modify', {
        method: 'POST',
        body,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        // do something with the response
        console.log("Post made to server");
    }).then(function (json) {
        console.log(json);
        updatePage();
        document.getElementById("editName").style.display = "none";
        document.getElementById("submitNewNameBtn").style.display = "none";
    })){
        window.alert("Please enter a unique username");
    }*/
    return false;
}


//Updates page.
const updatePage = function () {
    fetch('/updatePage', {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        appdata = json;
        dataTable.innerHTML = "";
        makeTableHead();
        let rowNum = 1;
        appdata.map(function (row) {
            let tableRow = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let td4 = document.createElement('td');
            let td5 = document.createElement('td');

            let pencil = document.createElement('i');
            pencil.id = `pencil${rowNum}`;
            pencil.innerHTML = "&#10000";
            pencil.onclick = function (elt) {
                elt.preventDefault();
                document.getElementById("editName").style.display = "block";
                document.getElementById("submitNewNameBtn").style.display = "block";
                rowNumEdit = row.yourname;
                return false;
            };
            let trash = document.createElement('i');
            trash.id = `${rowNum}`;
            trash.innerHTML = "&#128465";
            trash.onclick = function (elt) {
                let json = {id: trash.id};
                let body = JSON.stringify(json);
                if(!window.confirm("Are you sure you want to delete someones score")){
                    return false;
                }
                fetch('/delete', {
                    method: 'POST',
                    body,
                    headers:{
                        "Content-Type":"application/json"
                    }
                }).then(function (response) {
                    console.log("Delete post sent to server: " + response);
                    updatePage();
                });
                elt.preventDefault();
                return false;
            };

            td1.innerHTML = row.yourname;
            td2.innerHTML = row.score;
            td3.innerHTML = row.rank;
            td4.appendChild(pencil);
            td5.appendChild(trash);

            tableRow.appendChild(td1);
            tableRow.appendChild(td2);
            tableRow.appendChild(td3);
            tableRow.appendChild(td4);
            tableRow.appendChild(td5);
            dataTable.appendChild(tableRow);
            tableRow.className = rowNum;
            rowNum++;
        });
        sortTable();
    });
    console.log("Count = "+count);
    fetch('/updatePage', {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        appdata = json;
        console.log("APPDATA ON UPDATE = " + appdata.length);
        console.log("APPDATA VALUE\n" + JSON.stringify(appdata));
        count = appdata.length;
        console.log("COUNT ON UPDATE = " + count);
    });
};
updatePage();

//////////////////////////////////////////
let myGameArea;
let myGamePiece;
let myObstacles = [];
let myScore;

function restartGame() {
    document.getElementById("myfilter").style.display = "none";
    document.getElementById("myrestartbutton").style.display = "none";
    document.getElementById("submitBtn").style.display = "none";
    document.getElementById("yourname").style.display = "none";
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
            document.getElementById("yourname").style.display = "block";
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


//////////////////////////////////////////////

function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("Leaderboard");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[2];
            y = rows[i + 1].getElementsByTagName("TD")[2];
            //check if the two rows should switch place:
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
