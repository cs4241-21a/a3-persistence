
/*function clearForm(){
    document.getElementById('reviewArea').value = '';
    document.getElementById('oneStar').checked = false;
    document.getElementById('twoStar').checked = false;
    document.getElementById('threeStar').checked = false;
    document.getElementById('fourStar').checked = false;
    document.getElementById('fiveStar').checked = false;
}*/


function myEdit(idValue){
    console.log(idValue)
}

function myDelete(idValue){

    const json = { id: idValue},
        body = JSON.stringify( json )
    fetch('/delete', {
        method:'POST',
        body,
        headers:{
            "Content-Type":"application/json"
        }
    })
        .then( function( response ) {
            // do something with the response
            console.log("Post made to server");
        })
        .then( function( json ) {
            console.log(json);
        })
}
