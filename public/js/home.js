import client from "./client.js";

// onload, set the grid to include the recent boards the user created
window.onload = async () => {
    // get all of the boards of the logged in user
    console.log(await client.getAllBoards())
}