// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// define variables that reference elements on our page
let reviewsForm = document.getElementById("form");
let submitButton = document.getElementById("submit");
let table = document.getElementById("reviews");

let tableIDs = []

let user = localStorage["username"];

document.getElementById("welcomeMessage").innerHTML = `Welcome back, ${user}!`

// fetch the initial list of reviews
fetch("/reviews", {
        method: "POST", //tells it to use the post method
        body: JSON.stringify({ "user": user }),
        headers: {
            //bodyparser only kicks in if the content type is application/json
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // parse the JSON from the server
    .then(reviews => {
        console.log("reviews: ", reviews)
            // iterate through every review and add it to our page
        for (let review of reviews) {
            console.log("review: ", review)
            populateTable(review)
        }
    });

submitButton.addEventListener("click", event => {

    // stop our form submission from refreshing the page
    event.preventDefault();

    const inputTitle = String(document.querySelector('#title').value)
    const inputAuthor = String(document.querySelector('#author').value)
    const inputRating = String(document.querySelector('#rating').value)
    const inputDescription = String(document.querySelector('#description').value)

    if (inputTitle === '' || inputAuthor === '' ||
        inputRating === '' || inputDescription === '') {
        // alert("Fill in all the fields")
    } else {

        let newReview = { "title": inputTitle, "author": inputAuthor, "rating": inputRating, "description": inputDescription }

        fetch("/add", {
                method: "POST", //tells it to use the post method
                body: JSON.stringify({ "review": newReview, "user": user }),
                headers: {
                    //bodyparser only kicks in if the content type is application/json
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(json => {
                console.log("review: ", json)
                populateTable(json)
            })

        // reset form
        reviewsForm.reset();
    }
});

const remove = function(e) {
    // stop our form submission from refreshing the page
    e.preventDefault();

    e = e || window.event;
    var target = e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }
    if (target) {
        let cells = target.getElementsByTagName("td");
        let body = JSON.stringify({ "_id": cells[0].innerHTML })
        console.log("body:", body)

        let index = tableIDs.indexOf(String(cells[0].innerHTML)) + 1

        if (index != null) {
            table.deleteRow(index)

            fetch('/remove', {
                    method: 'POST',
                    body,
                    headers: {
                        //bodyparser only kicks in if the content type is application/json
                        "Content-Type": "application/json"
                    }
                })
                .then(function(response) {
                    response.text().then(function(textdata) {
                        console.log(JSON.parse(textdata))
                    })
                })
        }
    }
    return false
}

const edit = function(e) {
    // stop our form submission from refreshing the page
    e.preventDefault();

    e = e || window.event;
    var target = e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }
    if (target) {

        let cells = target.getElementsByTagName("td");

        let index = tableIDs.indexOf(String(cells[0].innerHTML)) + 1;

        let titleValue = cells[1].innerHTML;
        console.log("Title: ", String(titleValue))
        cells[1].innerHTML = "<input type='text' class='w-100' id='modifyTitle' value='" + String(titleValue) + "'>";

        let authorValue = cells[2].innerHTML;
        cells[2].innerHTML = "<input type='text' class='w-100' id='modifyAuthor' value='" + String(authorValue) + "'>";

        let ratingValue = cells[3].innerHTML;
        cells[3].innerHTML = "<input type='number' class='w-100' id='modifyRating' value='" + String(ratingValue) + "'>";

        let descriptionValue = cells[4].innerHTML;
        cells[4].innerHTML = "<textarea id='modifyDescription' rows='4' cols='40'>" + String(descriptionValue) + "</textarea>";

        let saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('btn', 'btn-success');
        saveButton.style.height = '50px';
        saveButton.style.width = '60px';
        saveButton.onclick = save;
        cells[5].innerHTML = '';
        cells[5].append(saveButton);

    }
}

const save = function(e) {
    // stop our form submission from refreshing the page
    e.preventDefault();

    e = e || window.event;
    var target = e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }
    if (target) {
        let cells = target.getElementsByTagName("td");

        if (modifyTitle.value == '' || modifyAuthor.value == '' || modifyRating.value == '' || modifyDescription.value == '') {
            alert("Fill in all the fields")
        } else {

            let updatedReview = { "title": modifyTitle.value, "author": modifyAuthor.value, "rating": modifyRating.value, "description": modifyDescription.value }

            cells[1].innerHTML = modifyTitle.value;
            cells[2].innerHTML = modifyAuthor.value;
            cells[3].innerHTML = modifyRating.value;
            cells[4].innerHTML = modifyDescription.value;

            let editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-primary');
            editButton.style.height = '50px';
            editButton.style.width = '60px';
            editButton.onclick = edit
            cells[5].innerHTML = '';
            cells[5].append(editButton);

            var body = JSON.stringify({ "_id": cells[0].innerHTML, "review": updatedReview, "user": user })
            console.log("body:", body)

            fetch('/update', {
                    method: 'POST',
                    body,
                    headers: {
                        //bodyparser only kicks in if the content type is application/json
                        "Content-Type": "application/json"
                    }
                })
                .then(function(response) {
                    response.text().then(function(textdata) {
                        console.log(JSON.parse(textdata))
                    })
                })
        }

    }
    return false
}

function populateTable(data) {
    const tableBody = document.getElementById("reviews")

    const cellID = document.createElement("td")
    cellID.appendChild(document.createTextNode(String(data._id)))
    tableIDs.push(String(data._id))
    cellID.style.display = "none"

    const cellTitle = document.createElement("td")
    cellTitle.colSpan = "1"
    cellTitle.appendChild(document.createTextNode(String(data.review.title)))

    const cellAuthor = document.createElement("td")
    cellAuthor.colSpan = "1"
    cellAuthor.appendChild(document.createTextNode(String(data.review.author)))

    const cellRating = document.createElement("td")
    cellRating.colSpan = "1"
    cellRating.appendChild(document.createTextNode(String(data.review.rating)))

    const cellDescription = document.createElement("td")
    cellDescription.colSpan = "2"
    cellDescription.appendChild(document.createTextNode(String(data.review.description)))

    const cellEdit = document.createElement("td")
    cellEdit.colSpan = "1"
    var editButton = document.createElement('button')
    editButton.textContent = 'Edit';
    editButton.classList.add('btn', 'btn-primary');
    editButton.style.height = '50px';
    editButton.style.width = '60px';
    editButton.onclick = edit
    cellEdit.appendChild(editButton)

    const cellDelete = document.createElement("td")
    cellDelete.colSpan = "1"
    var deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.style.height = '50px';
    deleteButton.onclick = remove
    cellDelete.appendChild(deleteButton)

    const newRow = document.createElement("tr")
    newRow.append(cellID, cellTitle, cellAuthor, cellRating, cellDescription, cellEdit, cellDelete)

    tableBody.appendChild(newRow)
}