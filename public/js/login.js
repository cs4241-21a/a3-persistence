window.onload = function() {
    document.querySelector('#login_form').onsubmit = (e) => {
        e.preventDefault();

        const user = document.querySelector('#login_username'),
              pass = document.querySelector('#login_password');

        fetch( '/login', {
            method:'POST',
            body: JSON.stringify({ username: user.value, password: pass.value }),
            headers: new Headers({'content-type': 'application/json'})
        })
        .then( function( response ) {
            // do something with the reponse 
            console.log( response );
            if(response.redirected) {
                location.replace(response.url);
                return false;
            }
            response.json().then(json => {
                console.log(json);
                alert(json.msg);
            });
        });
    };

    document.querySelector('#signup_form').onsubmit = (e) => {
        e.preventDefault();

        const user = document.querySelector('#signup_username'),
              pass = document.querySelector('#signup_password');

        fetch( '/signup', {
            method:'POST',
            body: JSON.stringify({ username: user.value, password: pass.value }),
            headers: new Headers({'content-type': 'application/json'})
        })
        .then( function( response ) {
            // do something with the reponse 
            console.log( response );
            if(response.redirected) {
                location.replace(response.url);
                return false;
            }
            response.json().then(json => {
                console.log(json);
                alert(json.msg);
            });
        });
    };
}