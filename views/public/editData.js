function removeEntry(month, from, amount, category) {
    const queryString = new URLSearchParams(window.location.search);
    const userID = queryString.get('userID');
    console.log(userID);
    $.post(`/removeEntry?id=${userID}&month=${month}&from=${from}&amount=${amount}&category=${category}`, res => {
        console.log(res);
    })
}

function openAddForm(month) {
    const queryString = new URLSearchParams(window.location.search);
    const userID = queryString.get('userID');

    $('input#month').val(month);
    $('input#id').val(userID);
    if ($('#addEntryOverlay').hasClass('closed')) {
        $('#addEntryOverlay')
            .removeClass('closed')
            .addClass('opened');
    } else {
        $('#addEntryOverlay')
            .removeClass('opened')
            .addClass('closed');
    }
}