import client from "./client.js";

var reviewers = []
// onload, set the grid to include the recent boards the user created
window.onload = async () => {
    // get all of the boards of the logged in user
    let boards = await client.getAllBoards()
    let ownedRow = document.getElementById('owned-boards')
    let reviewRow = document.getElementById('review-boards')
    let usersDropdown = document.getElementById('users-dropdown')
    let addNew = document.getElementById('submit-board')
    addNew.onclick = createBoard

    for(let b of boards.owned) {
        addBoard(ownedRow, b, true)
    }

    for(let b of boards.review) {
        addBoard(reviewRow, b, false)
    }

    // set the current list of users
    let users = await client.getUsers()
    for(let u of users) {
        let item = document.createElement('option')
        item.setAttribute('value', u._id)
        item.appendChild(document.createTextNode(u.name))
        usersDropdown.appendChild(item)
    }

    $('#users-dropdown').on('click',function() {
        reviewers = $(this).val();
    });
}

let addBoard = function(parent, b, owned) {
    let preview = document.createElement('div')
    preview.classList.add('preview', 'c'+ randInt(3).toString(), 'shadow')
    preview.onclick = () => {
        window.location = `/boards/${b.id}`
        return false
    }

    if(owned) {
        let btn = document.createElement('button')
        btn.setAttribute('type', 'button')
        btn.classList.add('btn', 'close', 'px-0')
        btn.setAttribute('role', 'button')
        btn.setAttribute('aria-label', `delete board ${b.name}`)
        btn.onclick = async (e)  => {
            e.preventDefault()
            e.stopPropagation()
            await client.deleteBoard(b.id)
        }

        let i = document.createElement('i')
        i.classList.add('fas', 'fa-times-circle')
  
        btn.appendChild(i)
        preview.appendChild(btn)
    }

    let title = document.createElement('p')
    title.appendChild(document.createTextNode(b.name))
    preview.appendChild(title)
    
    parent.appendChild(preview)
}

async function createBoard() {
    console.log(document.getElementById('board-title').value)
    let board = {
        name: document.getElementById('board-title').value,
        reviewers
    }

    let s = await client.createBoard(board)
    window.location = `/boards/${s.insertedId}`
}

// excluding max
function randInt(max) {
    return Math.floor(Math.random() * max)
}