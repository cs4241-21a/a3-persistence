
/*function clearForm(){
    document.getElementById('reviewArea').value = '';
    document.getElementById('oneStar').checked = false;
    document.getElementById('twoStar').checked = false;
    document.getElementById('threeStar').checked = false;
    document.getElementById('fourStar').checked = false;
    document.getElementById('fiveStar').checked = false;
}*/


async function myEdit(idValue) {
    // open edit options
    let writeReview = document.getElementById("writeReview");
    writeReview.innerText = "Edit your Review";
    let reviewArea = document.getElementById('reviewArea');
    let oneStar = document.getElementById('oneStar');
    let twoStar = document.getElementById('twoStar');
    let threeStar = document.getElementById('threeStar');
    let fourStar = document.getElementById('fourStar');
    let fiveStar = document.getElementById('fiveStar');
    const json = {id: idValue},
        body = JSON.stringify(json);
    await fetch('/getReview', {
        method: 'POST',
        body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            return response.json();
            })
        .then(json => {
            //console.log(json);
            reviewArea.innerText = json.review;
            switch (json.rating) {
                case 1:
                    oneStar.checked = true;
                    break;
                case 2:
                    twoStar.check = true;
                    break;
                case 3:
                    threeStar.check = true;
                    break;
                case 4:
                    fourStar.check = true;
                    break;
                case 5:
                    fiveStar.check = true;
                    break;
            }
        })


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
