// Add some Javascript code here, to run on the front end.
//function
//request that just gives me data
//have edit function return data as well

//const { response } = require("express");


const secretDoc = document.getElementById("deleteScoreForm")
secretDoc.style.display = "none";

let usernameVar = "sample";


fetch('/currentUser', {
  method: 'GET',
  headers:{
    "Content-Type":"application/json"
  }
}).then(function(response) {
  response.text().then(function(textdata) {
    //console.log(JSON.parse(textdata)[0].name);
    usernameVar = JSON.parse(textdata)[0].name;
    document.getElementById("playername").innerHTML = usernameVar;

    //makeTableFromData(newAppdata);
  })


})






//Adds a row 
function addRow(){
    let addedName = document.getElementById("player-name");
    let addedScore = document.getElementById("player-score");
    let table = document.getElementById("game-leaderboard");

    let addedRank;
    let currentScore;
    let isRankPlaced;
    for(let i = 1; i < appdata.length; i++){
        if(!isRankPlaced){
            currentScore = appdata[i].rank;
            if(addedScore.innerHTML > currentScore){
                addedRank = i;
            }
        } else {
            //Lower the rank of the appdata 
            appdata[i].rank += 1;
        }
    }
}

function makeTableFromData(appdata){
    let table = document.getElementById("game-leaderboard");
    let data = Object.keys(appdata[0]);

    table.innerHTML = '';
    generateTableHead(table, data);
    generateTable(table, appdata);

}

function generateTableHead(table, data){
    let thead = table.createTHead();
    let row = thead.insertRow();

    for (let key of data) {
        if(key === "name" || key === "score" || key === "rank"){
          let th = document.createElement("th");
          let text = document.createTextNode(key);
          th.appendChild(text);
          row.appendChild(th);
        }
      }
}

function generateTable(table, data){

    let i = 0;
    
    for(let element of data){
        i++;
        let row = table.insertRow();
        for(key in element){
          if(key === "name" || key === "score" || key === "rank"){
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
          }
        }
    }
    
}


////////////// 
//Game Code
//////////////

let gameOver = false;
let timeInterval = 1500;
let playerScore = 0;
let displayMessage = document.getElementById("message");
let displayScore = document.getElementById("score");
let displaySavedScore = document.getElementById("savedScore");
let isKeyPressed = true;
let wrongKeyPressed = false;
let gameTimer;

function gameLoopSetup(){
  playerScore = 0;
  gameOver = false;
  timeInterval = 1500;
  isKeyPressed = true;
  displayScore.innerHTML = "Score: " + playerScore;


  gameLoop();
}


function gameLoop(){

  //If the correct key was pressed at the end of the interval, the game continues
  if(isKeyPressed){
    gameOver = false;
  } else {
    gameOver = true;
  }

  //Primary game loop
  if(!gameOver){
    isKeyPressed = false;

    //Increase game speed over time
    if(playerScore % 10 === 0 && playerScore <= 100 && playerScore !== 0){
      timeInterval -= 50;
    }

    //Make a new timeout
    clearTimeout(gameLoop);
    gameTimer = setTimeout(gameLoop, timeInterval);

    //Set a randomized key
    let keyArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    let currentKey = keyArray[getRandomInt(0,25)];
    let currentKeyCode = "Key"+currentKey;


    displayMessage.innerHTML = "Press " + currentKey + "!";

    //Make a key event listener that removes itself after success
    document.addEventListener("keydown", function(event){

      let timesActivated = 0;

      if(event.code === currentKeyCode){

        displayMessage.innerHTML = currentKey + " was pressed!";
        isKeyPressed = true;
        playerScore += 1;
        displayScore.innerHTML = "Score: " + playerScore;
        timesActivated += 1;

      } else {
        if(timesActivated > 0){
          displayMessage.innerHTML = currentKey + " was not pressed! Game over!";
          wrongKeyPressed = true;
          gameOver = true;
          clearTimeout(gameLoop);
        }
       
        timesActivated += 1;
      }
    }, {once: true});
  } else if(gameOver) {
    console.log("poggy woggy: " + wrongKeyPressed)
    if(!wrongKeyPressed){
      displayMessage.innerHTML = " The key was not pressed in time! Game over!";
    }

    displaySavedScore.innerHTML = playerScore;
    clearTimeout(gameLoop);
  }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
 function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
