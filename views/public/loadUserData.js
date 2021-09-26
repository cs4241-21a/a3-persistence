$(document).ready(() => {
    let monthClasses = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let currentMonth = monthClasses[(new Date).getMonth()];
    $(`#${currentMonth}`).addClass('show').addClass('active');

    const queryString = new URLSearchParams(window.location.search);
    const userID = queryString.get('userID');
    console.log(userID);

    $.get(`/getUserData?id=${userID}`, res => {
        let username = res.username;
        let entries = res.entries;

        $('#user-name').text(username);
        entries.forEach(entry => {
            let tableId = getMonthTabelId(entry.month);
            let rowClass = getRowColor(entry.amount);
            let deleteBtn = `<button type="button" class="btn btn-default remove-entry" onclick="removeEntry('` + entry.month + `', '` + entry.from + `', ` + entry.amount + `, '` + entry.category + `')">` +
                `<span class="fas fa-times-circle fa-lg add-entry" aria-hiddne="true"></span>` +
                `</button>`;
            let newRow = `<tr class="${rowClass} align-middle" height="40px">` +
                `<td>${entry.from}</td>` +
                `<td>${entry.amount}$</td>` +
                `<td>${entry.category}</td>` +
                `<td>${deleteBtn}</td>` +
                `</tr>`;
            $('#' + tableId + ' tbody').append(newRow);
        });
    })
});

function getMonthTabelId(month) {
    switch (month) {
        case 'January':
            return 'jan-table';
        case 'February':
            return 'feb-table';
        case 'March':
            return 'mar-table';
        case 'April':
            return 'apr-table';
        case 'May':
            return 'may-table';
        case 'June':
            return 'jun-table';
        case 'July':
            return 'jul-table';
        case 'August':
            return 'aug-table';
        case 'September':
            return 'sep-table';
        case 'October':
            return 'oct-table';
        case 'November':
            return 'nov-table';
        case 'December':
            return 'dec-table';
    }
}

function getRowColor(amount) {
    if (amount > 0) {
        return 'table-success';
    } else if (amount < 0) {
        return 'table-danger';
    } else {
        return 'table-light';
    }
}