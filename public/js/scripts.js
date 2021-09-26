// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 3!")

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const task = document.querySelector( '#task' ),
            priority = document.querySelector( '#priority' ),
            date = new Date(),
            json = {
                action: "add",
                payload: { task: task.value, priority: priority.value, creationDate: (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() }
            },
            body = JSON.stringify( json )

    fetch( '/submit', {
        method:'POST',
        body,
        headers: new Headers({'content-type': 'application/json'})
    })
    .then( function( response ) {
        // do something with the reponse 
        console.log( response )
        response.json().then(json => {
            console.log(json);
            updateTable(json);
        })
    })

    return false
}

window.onload = function() {
    document.querySelector('#logout').onclick = logout;
    document.querySelector('form button').onclick = submit;

    fetch( '/get', {
        method:'GET'
    }).then( function( response ) {
        // do something with the reponse 
        console.log( response )
        response.json().then(json => {
            console.log(json);
            updateTable(json);
        })
    })
}

function updateTable(data) {
    let parent = document.querySelector("#dataContent");

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    data.forEach((e, i) => {
        let elem = document.createElement("div");
        elem.classList.add("dataRow");

        let task_el = document.createElement("div");
        task_el.innerText = e.task;
        elem.appendChild(task_el);

        let priority_el = document.createElement("div");
        priority_el.innerText = e.priority;
        elem.appendChild(priority_el);

        let creationDate_el = document.createElement("div");
        creationDate_el.innerText = e.creationDate;
        elem.appendChild(creationDate_el);

        let deadline_el = document.createElement("div");
        deadline_el.innerText = e.deadline;
        elem.appendChild(deadline_el);

        let edit_el = document.createElement("div");
        let edit_btn_el = document.createElement("button");
        edit_btn_el.innerText = "Edit";
        edit_el.appendChild(edit_btn_el);
        elem.appendChild(edit_el);

        let delete_el = document.createElement("div");
        let delete_btn_el = document.createElement("button");
        delete_btn_el.innerText = "Delete";
        delete_el.appendChild(delete_btn_el);
        elem.appendChild(delete_el);

        parent.appendChild(elem);

        delete_btn_el.onclick = () => {
            fetch( '/submit', {
                method: 'POST',
                body: JSON.stringify({ action: "delete", index: i }),
                headers: new Headers({'content-type': 'application/json'})
            })
            .then( function( response ) {
                // do something with the reponse 
                console.log( response )
                response.json().then(json => {
                    console.log(json);
                    updateTable(json);
                })
            })
        };

        edit_btn_el.onclick = () => {
            let task_in_el = document.createElement("input");
            task_in_el.type = "text";
            task_in_el.value = task_el.innerText;
            elem.replaceChild(task_in_el, task_el);

            let priority_in_el = document.createElement("select");
            ["Low", "Medium", "High"].forEach(e => {
                let option_el = document.createElement("option");
                option_el.value = e.toLowerCase();
                option_el.innerText = e;
                priority_in_el.appendChild(option_el);
            });
            priority_in_el.value = priority_el.innerText;
            elem.replaceChild(priority_in_el, priority_el);

            edit_btn_el.innerText = "Submit";
            delete_btn_el.innerText = "Cancel";

            delete_btn_el.onclick = () => {
                fetch( '/get', {
                    method:'GET'
                }).then( function( response ) {
                    // do something with the reponse 
                    console.log( response )
                    response.json().then(json => {
                        console.log(json);
                        updateTable(json);
                    })
                })
            }

            edit_btn_el.onclick = () => {
                const task = elem.querySelectorAll( 'input' )[0],
                        priority = elem.querySelectorAll( 'select' )[0],
                        json = {
                            action: "modify",
                            index: i,
                            payload: { task: task.value, priority: priority.value }
                        },
                        body = JSON.stringify( json )

                fetch( '/submit', {
                    method:'POST',
                    body,
                    headers: new Headers({'content-type': 'application/json'})
                })
                .then( function( response ) {
                    // do something with the reponse 
                    console.log( response )
                    response.json().then(json => {
                        console.log(json);
                        updateTable(json);
                    })
                })
            }
        }
    })

    // document.querySelector("#dataTable").innerText = JSON.stringify(data);
}

function logout() {
    fetch( '/logout', {
        method: 'POST'
    }).then(() => {
        location.reload();
    });
}