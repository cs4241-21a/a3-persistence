$(document).ready(() => {
    $.get('/loginMessage', res => {
        let usernameErr = 'No user with that username!';
        let passwordErr = 'Incorrect password!';

        switch (res) {
            case usernameErr:
                $('label[for=username]').text(usernameErr);
                $('#username').addClass('is-invalid');
                break;
            case passwordErr:
                $('label[for=password]').text(passwordErr);
                $('#password').addClass('is-invalid');
                break;
            default:
                break;
        }
    });
});