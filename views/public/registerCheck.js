$(document).ready(async function () {
    let users = []
    await $.get('/getUsers', (data) => {
        users = data
    });

    $('#username').on('keyup', function () {
        if ($('#username').val() === '') {
            $('#username-message').text('You must have a username!').css('color', 'red');
        } else if (users.includes($('#username').val())) {
            $('#username-message').text('Username is taken!').css('color', 'red');
        } else {
            $('#username-message').text('Username is unique!').css('color', 'green');
        }
    });

    $('#password, #confirm-password').on('keyup', function () {
        if ($('#password').val() === '') {
            $('#password-message').text('You must have a password!').css('color', 'red');
        } else if ($('#password').val() === $('#confirm-password').val()) {
            $('#password-message').text('Passwords are matching!').css('color', 'green');
            $('#signUpBTN').prop('disabled', false);
        } else {
            $('#password-message').text('Passwords are not matching!').css('color', 'red');
            $('#signUpBTN').prop('disabled', true);
        }
    });
});