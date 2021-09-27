import client from "./client.js";

// ideally we could open a socket and stream the changes, or detect changes and send them
var interval = setInterval(() => {
    // every 5 seconds, send a patch to update the content
    client.updateBoardContent(window.location.pathname.split('/')[2], document.getElementById("board-content").innerText)
}, 5000)

