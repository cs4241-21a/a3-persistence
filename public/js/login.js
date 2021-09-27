function postJson(route, body) {
    return fetch(route, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: "follow",
        body: JSON.stringify(body),
    }).then(response => {
        if (response.redirected) {
            location.replace(response.url);
        }
        return response.json();
    }).then(body => {
        if (!body.hasOwnProperty("error")) {
            return body;
        }

        showErrors([body.error]);
    });
}

function showErrors(errors) {
    const domErrors = document.querySelector("#errors");
    let html = "";

    for (const err of errors) {
        html += "<li>" + err + "</li>";
    }

    domErrors.innerHTML = "<ul class='list'>" + html + "</ul>";
    document.querySelector("form").classList.add("error");
}

function collectFields() {
    const fields = {
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value,
    };

    const errors = [];

    if (fields.username.length < 5) {
        errors.push("Username must be at least 5 characters");
    } else if (fields.username.length > 30) {
        errors.push("Username must be at most 30 characters");
    }

    if (!fields.username.match(/^[a-zA-Z0-9_]{5,30}$/g)) {
        errors.push("Username must be alphanumeric");
    }

    if (fields.password.length < 5) {
        errors.push("Password must be at least 5 characters");
    } else if (fields.password.length > 60) {
        errors.push("Password must be at most 60 characters");
    }

    if (errors.length > 0) {
        showErrors(errors);
        return null;
    }

    return fields;
}

function performLogin() {
    console.log("Performing login!");

    const body = collectFields();

    if (body !== null) {
        postJson("/auth/login", body)
            .then(console.log);
    }
}

function performSignup() {
    console.log("Performing signup!");

    const body = collectFields();

    if (body !== null) {
        postJson("/auth/signup", body).then(console.log);
    }
}
