// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!")

const showTable = function (e) {
    e.preventDefault();

}

const submit = function(e) {
    // prevent default form action from being carried out
    e.preventDefault();

    document.getElementById('insertconf').innerHTML = '';
    document.getElementById('remconf').innerHTML = '';
    document.getElementById('result').innerHTML = '';

    const inputname = document.querySelector("#bookname"),
        inputid = document.querySelector("#Identification"),
        inputauthor = document.querySelector("#author"),
        prior = document.querySelector("#priority"),
        letime = Date.now(),
        retime = Date.now() + 60480000*prior.value;

        let json = {
            bookname: inputname.value, Id: inputid.value, author: inputauthor.value, checktime: letime,
            returntime: retime, priority: prior.value
        };
        let body = JSON.stringify(json);

        fetch("/submit", {
            method: "POST",
            body
        }).then(function (response) {
            return response.json();
        })
            .then(function (json) {
                console.log(json);
            });
        document.getElementById('insertconf').innerHTML = 'Record successfully saved'
    return false;
};

const delRecord = function(e){
    e.preventDefault();

    document.getElementById('insertconf').innerHTML = '';
    document.getElementById('remconf').innerHTML = '';
    document.getElementById('result').innerHTML = '';

    const body = JSON.stringify({'index' : +document.querySelector("#pointer")});

    fetch("/delete", {
        method: "POST",
        body
    }).then(function(response) {
        return response.json();
    })
        .then(function(json) {
            console.log(json);
        });

    document.getElementById('remconf').innerHTML = 'Record successfully deleted'

    return false;
}

function fixedDate(seconds) {
    const d = new Date(seconds);
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    return month + '/' + day + '/' + year;
}

const showRecords = function(e){
    e.preventDefault();

    document.getElementById('insertconf').innerHTML = '';
    document.getElementById('remconf').innerHTML = '';
    document.getElementById('result').innerHTML = '';

    fetch("/reveal", {
        method: "POST"
    }).then( function (d) {
        return d.json()
    }).then(function (arr) {
        document.getElementById('result').innerHTML = ''
        document.getElementById('result').innerHTML += '<tr>' +
                '<th>Name of the Book</th>' +
                '<th>ID number of the Book</th>' +
                '<th>Author</th>' +
                '<th>Weeks out</th>' +
                '<th>Date of Checkout</th>' +
                '<th>Date of Return</th>' +
            '</tr>'
        //adding the title row for the table
        arr.forEach(fiel => {
            const el = JSON.parse(fiel)
                document.getElementById('result').innerHTML +=
                    `<tr>
                        <td>${el.name}</td>
                        <td>#${el.Id}</td>
                        <td>By ${el.author}</td>
                        <td>${el.priority}</td>
                        <td>${fixedDate(el.checktime)}</td>
                        <td>${fixedDate(el.checktime + 604800000*el.priority)}</td>
                     </tr>`;
        });
    })
    return false;
}

window.onload = function() {
    const submitButton = document.querySelector("#submit");
    const deleteButton = document.querySelector("#delete");
    const revealButton = document.querySelector("#reveal");
    submitButton.onclick = submit;
    deleteButton.onclick = delRecord;
    revealButton.onclick = showRecords;
};