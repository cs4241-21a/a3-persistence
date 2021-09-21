$(document).ready(function () {
    $('#password, #confirm-password').on('keyup', function () {
        if ($('#password').val() === $('#confirm-password').val()) {
            $('#password-message').html('Passwords are matching').css('color', 'green');
            $('#signUpBTN').prop('disabled', false);
        } else {
            $('#password-message').html('Passwords are not matching').css('color', 'red');
            $('#signUpBTN').prop('disabled', true);
        }
    });
});