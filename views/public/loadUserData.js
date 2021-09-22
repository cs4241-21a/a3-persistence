$(document).ready(() => {
    const queryString = new URLSearchParams(window.location.search);
    const userID = queryString.get('userID');
    console.log(userID);

    $.get(`/getUserData?id=${userID}`, res => {
        let username = res.username;
        let entries = res.entries;

        $('#user-name').text(username);
        entries.forEach(element => {
            // Add to the right month!
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