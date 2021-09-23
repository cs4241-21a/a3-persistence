
/*function clearForm(){
    document.getElementById('reviewArea').value = '';
    document.getElementById('oneStar').checked = false;
    document.getElementById('twoStar').checked = false;
    document.getElementById('threeStar').checked = false;
    document.getElementById('fourStar').checked = false;
    document.getElementById('fiveStar').checked = false;
}*/
let storedIdValue = '';
let reviewArea = document.getElementById('reviewArea');
let oneStar = document.getElementById('oneStar');
let twoStar = document.getElementById('twoStar');
let threeStar = document.getElementById('threeStar');
let fourStar = document.getElementById('fourStar');
let fiveStar = document.getElementById('fiveStar');


async function myEdit(idValue, rating) {
    // open edit options
    storedIdValue = idValue;
    let writeReview = document.getElementById("writeReview");
    writeReview.innerText = "Edit your Review";

    reviewArea.innerText = document.getElementById('comment' + idValue).innerText;
    switch (parseInt(rating)) {
        case 1:
            oneStar.checked = true;
            break;
        case 2:
            twoStar.checked = true;
            break;
        case 3:
            threeStar.checked = true;
            break;
        case 4:
            fourStar.checked = true;
            break;
        case 5:
            fiveStar.checked = true;
            break;
    }
}

function myDelete(idValue){

    const json = { id: idValue},
        body = JSON.stringify( json );
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
            window.location.reload();
        })
}

async function submitHandler() {
    let getRating = 0;
    if (oneStar.checked){getRating = 1}
    if (twoStar.checked){getRating = 2}
    if (threeStar.checked){getRating = 3}
    if (fourStar.checked){getRating = 4}
    if (fiveStar.checked){getRating = 5}

    const json = {id: storedIdValue,
            review: reviewArea.value,
            rating: getRating},
        body = JSON.stringify(json);

    if (storedIdValue === '') {
        // submit new value
        await fetch('/postReview', {
            method: 'POST',
            body,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                console.log(response.rating)
                return response.json();
            })
            .then(json => {

            })
    } else {
        // update old value
        await fetch('/updateReview', {
            method: 'POST',
            body,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                console.log(response.rating)
                return response.json();
            })
            .then(json => {

            })
        window.location.reload();
    }
    storedIdValue = '';
}
