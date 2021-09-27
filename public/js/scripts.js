/**
 * Returns true if c is a digit character
 */
function isCharNumber(c) {
    return c >= '0' && c <= '9';
}

function checkISBN10(isbn) {
    // in ISBN10 the last digit can be an X, and this represents 10
    let justDigits = Array.from(isbn)
        .filter(c => (isCharNumber(c) || c === 'X'))
        .map(c => (isCharNumber(c) ? parseInt(c) : 10));

    if (justDigits.length !== 10) {
        return false;
    }

    let index = 0;
    let multiplier = 10;
    let sum = 0;
    while (index < 10) {
        sum += multiplier * justDigits[index];
        index++;
        multiplier--;
    }

    return sum % 11 === 0;
}

function checkISBN13(isbn) {
    let justDigits = Array.from(isbn)
        .filter(isCharNumber)
        .map(c => parseInt(c));

    if (justDigits.length !== 13) {
        return false;
    }

    let index = 0;
    let weight = 1;
    let sum = 0;
    while (index < 13) {
        sum += weight * justDigits[index];
        index++;
        // weight alternates between 1 and 3
        weight = weight === 1 ? 3 : 1;
    }

    return sum % 10 === 0;
}

/**
 * Count the number of digits to figure out which length of isbn it is, 
 * and call the correct validator
 */
function checkISBN(isbn) {
    let numDigits = Array.from(isbn).filter(isCharNumber).length;

    if (numDigits < 13) {
        return checkISBN10(isbn);
    } else {
        return checkISBN13(isbn);
    }
}

function addBook(event) {
    let form = document.getElementById("add-book-form");
    let formValues = {};
    form.querySelectorAll("input").forEach(input => {
        const realId = input.id.split('-')[2];
        formValues[realId] = input.value;
    });

    if (!checkISBN(formValues["ISBN"])) {
        console.log("INVALID ISBN!");
        form.querySelector("#add-book-ISBN").setCustomValidity("ISBN number invalid");
        return;
    }

    apiAddBook(formValues).then(res => {
        getBookData();
        const addBookModal = bootstrap.Modal.getInstance(document.getElementById('add-book-modal'));
        addBookModal.hide();
    }).catch(err => console.log(err));
}


async function apiAddBook(json) {
    console.log("adding book:");
    console.log(json);
    let res = await fetch('/addBook', {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    console.log(res);
}

function deleteBook(event) {
    console.log("delete book event:");
    console.log(event);
    const bookId = event.getAttribute("data-bs-book-id");
    fetch('/deleteBook', {
        method: 'DELETE',
        body: JSON.stringify({ _id: bookId }),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        console.log('response:', response.json());
        getBookData();
        const deleteBookModal = bootstrap.Modal.getInstance(document.getElementById('delete-book-modal'));
        deleteBookModal.hide();

    });
}

function modifyBookEntry(entry_id) {
    let form = document.getElementById("modify-book-form");
    let formValues = { _id: entry_id };

    form.querySelectorAll("input").forEach(input => {
        console.log('input:', input);
        formValues[input.id.split('-')[2]] = input.value;
    });


    if (!checkISBN(formValues["ISBN"])) {
        console.log("INVALID ISBN!");
        console.log(form.querySelector("#modify-book-ISBN"));
        form.querySelector("#modify-book-ISBN").setCustomValidity("ISBN number invalid");
        return;
    }

    fetch('/modifyBook', {
        method: 'PUT',
        body: JSON.stringify(formValues),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        console.log('response:', response.json());
        getBookData();
        const modifyBookModal = bootstrap.Modal.getInstance(document.getElementById('modify-book-modal'));
        modifyBookModal.hide();
    });


}

function makeBookEditDropdown(datarow) {
    const bookId = datarow._id;

    // this is emotionally challenging, but just so easy
    const content = `<div class="dropdown">
    <a class="btn btn-secondary" href="#" role="button" id="dropdownMenuLink${bookId}" data-bs-toggle="dropdown" aria-expanded="false">
    ...
    </a>

    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <li><a class="dropdown-item" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modify-book-modal" data-bs-book-id="${bookId}" href="#"> Modify Entry</a></li>
        <li><a class="dropdown-item" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#delete-book-modal" data-bs-book-id="${bookId}" href="#"> Delete Entry</a></li>
    </ul>
    </div>`;
    return content;

}

const tableColumns = {
    title: { name: "Title", isHeader: true },
    authors: {
        name: "Author(s)",
        formatter: (authors) => authors.join(', ')
    },
    num_pages: "# Pages",
    date_added: {
        name: "Date Added",
        formatter: (timestamp) => (new Date(timestamp)).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" }),
    },
    rating: "Rating",
    location: "Location",
    modify_book: { name: "Edit", className: "modify-book", contentCallback: makeBookEditDropdown, sortable: false }
};



// redux but by hand and worse
var bookData = [];

function getBookById(id) {
    return bookData.find(entry => entry._id === id);
}


function getBookData() {
    fetch('/me/books').then(res => res.json()).then(books => {
        console.log('books: ');
        console.log(books);
        bookData = books;
        const bookTable = document.getElementById("book-table");
        bookTable.innerHTML = '';
        buildTable(bookTable, tableColumns, books);

        const tableHeaders = Array.from(bookTable.querySelector("thead tr").children);
        console.log("tableHeaders");
        console.log(tableHeaders);
        Object.keys(tableColumns).forEach((columnKey, index) => {
            const sortCallback = () => {
                bookData = bookData.sort((a, b) => {
                    const aVal = a[columnKey];
                    const bVal = b[columnKey];
                    if (aVal > bVal) {
                        return 1;
                    } else if (aVal === bVal) {
                        return 0;
                    }
                    return -1;
                });
                const bookTable = document.getElementById("book-table");
                bookTable.removeChild(bookTable.lastChild);
                bookTable.appendChild(makeTableBody(tableColumns, bookData));
            }
            const columnData = tableColumns[columnKey];
            if (isString(columnData)) {
                const header = tableHeaders.find(th => th.innerText === columnData);
                header.addEventListener('click', sortCallback);
            } else {
                const header = tableHeaders.find(th => th.innerText === columnData.name);
                if (!(columnData.sortable === false)) {
                    header.addEventListener('click', sortCallback);
                }
            }
        });
    }).catch(err => console.log(err));
}

function getUserData() {
    fetch('/me').then(res => res.json()).then(user => {
        console.log('username: ', user);
        const usernameDiv = document.getElementById('username');
        const avatarImg = document.getElementById('avatar');
        usernameDiv.innerText = user.name;
        avatarImg.src = user.avatar_url;
    });
}

window.addEventListener('load', event => {
    getUserData();
    getBookData();

    setupModifyBookHandler();
    setupDeleteBookHandler();
});




function setupModifyBookHandler() {
    let modifyBookModal = document.getElementById('modify-book-modal');
    modifyBookModal.addEventListener('show.bs.modal', function(event) {
        // Button that triggered the modal
        const button = event.relatedTarget;

        const book_id = button.getAttribute('data-bs-book-id');
        const book = getBookById(book_id);
        const book_title = book.title;

        // Update the modal's content.
        const modalTitle = modifyBookModal.querySelector('.modal-title');

        const modalBodyISBN = modifyBookModal.querySelector('.modal-body #modify-book-ISBN');
        const modalBodyRating = modifyBookModal.querySelector('.modal-body #modify-book-rating');
        const modalBodyLocation = modifyBookModal.querySelector('.modal-body #modify-book-location');
        modalBodyISBN.value = book.isbn;
        modalBodyRating.value = book.rating;
        modalBodyLocation.value = book.location;

        modalTitle.textContent = 'Modify ' + book_title;

        const modifyButton = modifyBookModal.querySelector('.book-modify-button');
        modifyButton.addEventListener('click', (event) => {
            modifyBookEntry(book_id);
        });
    });
}

function setupDeleteBookHandler() {
    const deleteBookModal = document.getElementById('delete-book-modal');
    deleteBookModal.addEventListener('show.bs.modal', function(event) {
        // Button that triggered the modal
        const button = event.relatedTarget;

        const book = getBookById(button.getAttribute('data-bs-book-id'))
        const book_title = book.title;

        // Update the modal's content.
        const modalBody = deleteBookModal.querySelector('.modal-body');
        //   var modalBodyInput = exampleModal.querySelector('.modal-body input')

        modalBody.textContent = 'Are you sure you want to delete ' + book_title + '?';

        const deleteButton = deleteBookModal.querySelector('.book-deletion-button');
        deleteButton.setAttribute('data-bs-book-id', book._id);
    });
}