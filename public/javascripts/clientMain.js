// Add some Javascript code here, to run on the front end.

// console.log("Welcome to assignment 2!")

let storedMessages = []
import "/javascripts/tinycolor.js"

/**
 * Submit
 * Provides the function for submitting messages with the form
 *
 * @param e
 * @returns {boolean}
 */
const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const name = document.getElementById( "inputName" ),
        color = document.getElementById("inputColor"),
        message = document.getElementById("inputMessage"),
        json = { name: name.value, color: color.value, message: message.value },
        body = JSON.stringify( json )

    fetch( '/submit', {
        method:'POST',
        body
    })
        .then( function( response ) {
            if (response.ok){
                //Clear message box
                document.getElementById("inputMessage").value = ""
                return response.json()
            }else {
                return false
            }
        }).then( function ( json ) {
        if (json){
            loadMessages()
        }else {
            console.log("Error submitting data")
        }


    })

    return false
}

/**
 * Loads all messages from the server. Only displays new messages
 */
const loadMessages = function (){
    fetch( '/messages', {
        method:'GET'
    }).then(function( response ) {
        return response.json()
    }).then(function (jsonMessages){
        for (const jsonMessage of jsonMessages) {
            if(storedMessages.includes(JSON.stringify(jsonMessage))){
                //Do nothing, we don't want duplicates
            }else {
                storedMessages.push(JSON.stringify(jsonMessage))
                makeMessage(jsonMessage.name, jsonMessage.color, jsonMessage.message)
            }

        }
    })
}

/**
 * makeMessage
 *
 * Takes name, color, and message and creates a new message element and appends it to the screen
 * @param name
 * @param color
 * @param message
 */
const makeMessage = function (name, color, message){
    var secondary = tinycolor(color);
    secondary.darken(30)
    let textColor = secondary.complement()

    const messageWrapper = document.createElement("message")
    messageWrapper.style.backgroundColor = color
    const nameTag = document.createElement("h3")
    nameTag.style.color = textColor.toHexString()
    const nameNode = document.createTextNode(name)
    nameTag.appendChild(nameNode)
    const messageBody = document.createElement("p")
    messageBody.style.backgroundColor = secondary.toHexString()
    const messageNode = document.createTextNode(message)
    messageBody.appendChild(messageNode)
    messageWrapper.appendChild(nameTag)
    messageWrapper.appendChild(messageBody)
    const documentBody = document.getElementById("main")
    documentBody.insertBefore(messageWrapper, documentBody.childNodes[0])

}

window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit
    loadMessages()
}