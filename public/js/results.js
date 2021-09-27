function updateLeaderboard(values) {
    const elements = Object.entries(values)
        .sort(([, a], [, b]) => b.score - a.score)
        .map(([id, x], index) =>
            `<tr id="value${id}">
                <td>${index + 1}</td>
                <td>${x.username}</td>
                <td>${x.score}</td>
                <td>${x.date}</td>
                <td>
                    <button type="button" class="ui primary button edit">Edit</button>
                    <button type="button" class="ui button remove">Remove</button>
                </td>
              </tr>`)
        .join("\n");

    const table = document.querySelector("#leaderboard")
    table.tBodies[0].innerHTML = elements

    document.querySelectorAll(".remove").forEach(x => x.onclick = removeButton)
    document.querySelectorAll(".edit").forEach(x => x.onclick = editButton)
}

function removeButton(e) {
    // Not necessary, but do anyway just to be safe
    e.preventDefault()

    const targetID = e.path[2].id;
    const id = parseInt(targetID.substring(5))
    console.log("Removing row of id " + id)

    const body = JSON.stringify({
        "id": id,
    })

    fetch('/api/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body
    })
        .then(x => x.json())
        .then(updateLeaderboard)

    return false
}

function editButton(e) {
    if (e.path[0].innerHTML === "Edit") {
        e.path[0].innerHTML = "Save"

        const user = e.path[2].children[1]
        const score = e.path[2].children[2]

        user.innerHTML = `<div class="ui input"><input type="text" value="${user.innerHTML}"></div>`
        score.innerHTML = `<div class="ui input"><input type="text" value="${score.innerHTML}"></div>`
    } else {
        e.path[0].innerHTML = "Edit"

        const body = JSON.stringify({
            "id": parseInt(e.path[2].id.substring(5)),
            "username": e.path[2].children[1].children[0].children[0].value,
            "score": parseInt(e.path[2].children[2].children[0].children[0].value),
        })

        fetch('/api/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
            .then(x => x.json())
            .then(updateLeaderboard)
    }

    return false
}

function fetchValues() {
    fetch('/api/values', {method: 'GET'})
        .then(x => x.json())
        .then(updateLeaderboard)
}


function addUser(e) {
    // prevent default form action from being carried out
    e.preventDefault()

    const username = document.querySelector('#username')
    const score = document.querySelector('#score')

    const body = JSON.stringify({
        "username": username.value,
        "score": parseInt(score.value),
    })

    fetch('/api/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body
    })
        .then(x => x.json())
        .then(updateLeaderboard)

    return false
}

function logOut() {
    fetch('/auth/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: "follow",
    }).then(response => {
        if (response.redirected) {
            location.replace(response.url);
        } else {
            console.log("Failed to log out");
        }
    });
}
