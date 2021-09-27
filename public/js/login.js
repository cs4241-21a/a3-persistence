function loginWindowOnLoad() {
    document.getElementById('login-btn').onclick = onClickLogin;
}

function onClickLogin( event ) {
    event.preventDefault();
    tryLogin();
}


function tryLogin() {
    const user = document.getElementById('user-textbox').value;
    const pass = document.getElementById('pass-textbox').value;
    const body = JSON.stringify( {user: user, pass: pass} );
    fetch( '/login',
    {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    });

}