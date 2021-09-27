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

            } else {
                window.location.href = res.url
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

    $(".errorDialog").remove()
    
    let loc = '#addNewRow'
    let data = {
        ticker : $('input#ticker').val(),
        amount : $('input#amount').val(),
        purchase : $('input#purchase').val()
    }
    let blank = false
    for (let e in data) {
        if (data[e] === "") {
            blank = true
        }
    }

    if (blank) {
        createError("All fields must be filled.", $('main>section'))
        return
    }
   

    createRow(data, $('#addNewRow'))
    $('input#ticker').val('')
    $('input#amount').val('')
    $('input#purchase').val('')
    //let htmlStr = `<tr><td>${data.ticker}</td><td>${data.amount}</td><td>${data.purchase}</td></tr>`
    //let row = $(loc).before(htmlStr)        
    
    fetch('/addAsset', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
    .then(res => res.text())
    .then(text => {
        console.log(text)
        row[0].objID = text
    })


}

function refreshTable() {
    window.location.reload() 
}

function removeRow(row) {
    let arr = row.children()
    let toRemove = {}
    toRemove.ticker = arr[0].innerHTML
    toRemove.amount = arr[1].innerHTML
    toRemove.purchase = arr[2].innerHTML

    fetch('/removeAsset', {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(toRemove)
    }).then(res => {
        if (res.ok) {
            refreshTable()
        } else {
            console.log("ERROR: removeRow")
        }
    })

}

function editRow(row) {

    let arr = row.children()
    let t = arr[0].innerHTML
    let a = arr[1].innerHTML
    let p = arr[2].innerHTML
    $(arr[0]).html($(document.createElement('input')).val(t).attr('id', 'tickEdit'))
    $(arr[1]).html($(document.createElement('input')).val(a).attr('id', 'amtEdit'))
    $(arr[2]).html($(document.createElement('input')).val(p).attr('id', 'purchEdit'))

    $(arr[3]).html($('<button>Submit</button>')
        .click(async (e) => {

            $(".errorDialog").remove()

            let loc = '#addNewRow'
            let data = {
                ticker : $('input#tickEdit').val(),
                amount : $('input#amtEdit').val(),
                purchase : $('input#purchEdit').val()
            }
            let blank = false
            for (let e in data) {
                if (data[e] === "") {
                    blank = true
                }
            }

            if (blank) {
                createError("All fields must be filled.", $('main>section'))
                return
            }


            createRow(data, $('#addNewRow'))

            let toRemove = {}
            toRemove.ticker = t 
            toRemove.amount = a
            toRemove.purchase = p

            fetch('/removeAsset', {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(toRemove)
            }).then(res => {
                if (res.ok) {
                    refreshTable()
                } else {
                    console.log("ERROR: removeRow")
                }
            })
            await fetch('/addAsset', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(data)
            })
            refreshTable()
        })).append($('<button>Cancel</button>')
            .click((e) => {
                refreshTable()    
            }))

}

function createRow(data, loc) {

    $(loc).before(
        $(document.createElement('tr'))
        .append(`<td>${data.ticker}</td>`,
            `<td>${data.amount}</td>`,
            `<td>${data.purchase}</td>`)
        .append($(document.createElement('td'))
            .append($('<button>Remove</button>')
                .click((e) => {
                    removeRow($(e.target).closest("tr"))
                }),
                $('<button>Edit</button>')
                .click((e) => {

                    editRow($(e.target).closest("tr"))

                }))))

}

function populateUserTable(data) {

    let loc = $('#addNewRow')

    let portfolio = data.portfolio

    portfolio.forEach(elm => {
        createRow(elm, loc)
    })

}
