function createError(msg, htmlParent) {
    $(htmlParent).prepend(
        $(document.createElement('div'))
            .attr('class', 'errorDialog')
            .css({'border': '1px solid var(--color-bg-secondary)',
                    'border-radius': 'var(--border-radius)',
                    'box-shadow': 'var(--box-shadow) var(--color-shadow)',
                    'padding': '0px 5px'})
            .append('<h3>Oops!</h3>',
                    $(document.createElement("div")).css({
                        'display':'flex',
                        'align':'center',
                        'justify-content':'space-between',
                    }).append(`<p>${msg}</p>`,
                                '<button onclick="$(this).parent().parent().remove()">Close</button>')))
}

const submitNewAcct = function(e) {
    e.preventDefault()
    
    const formArgs = $('#createAcctForm').serializeArray()
    
    let notFill = false
    let notMatch = false
    
    $(".errorDialog").remove()

    formArgs.forEach(row => {
        let val = row.value
        if (val === "") {
            console.log(`${row.name} is required!`)
            $(`input#${row.name}`).css({
                'border-color': "red",
                'border-width': 'medium'})
            
            notFill = true
            
            return
        } else {
            $(`input#${row.name}`).css({
                'border-color': "",
                'border-width': ''})
        }

        if ($(`input#password`).val() !== $('input#password2').val()) {

            $(`input#password`).css({
                'border-color': "red",
                'border-width': 'medium'})
            $(`input#password2`).css({
                'border-color': "red",
                'border-width': 'medium'})
            
            notMatch = true

            return
        }

    })
    
    if (notFill) {
        createError("Must fill all boxes!", $('#createAcctForm'))        
    }
    if (notMatch) {
        createError("Passwords must match!", $('#createAcctForm'))        
    }
    
    if (!notFill && !notMatch) {
        fetch('/createaccount', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(formArgs)
        })
        .then( res => {
            if (!res.ok) {
                createError("Duplicate username", $('#createAcctForm'))

            }
        })
    }

    console.log("Submit!")
}

const authenticate = function (e) {
    e.preventDefault()

    let formArgs = $('#loginform').serializeArray()

    fetch('/login', {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(formArgs)
    }).then(res => {
        if (res.ok) {
            window.location.href = res.url
        } else {
            createError("Incorect Username/Password", $('#loginform'))
        }
    })
}

function addRow() {
    
    // TODO: submit to database, check input

    let loc = '#addNewRow'
    let data = {
        ticker : $('input#ticker').val(),
        amount : $('input#amount').val(),
        purchase : $('input#purchase').val()
    }


    let htmlStr = `<tr><td>${data.ticker}</td><td>${data.amount}</td><td>${data.purchase}</td></tr>`
    $(loc).before(htmlStr)        

}
