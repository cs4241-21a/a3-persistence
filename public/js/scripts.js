const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    let longTitle = false;
    //prevents any submissions with no image.
    if (document.querySelector('#imgLink').value == "" || !document.querySelector('#imgLink').value.includes('http')) {
      return false;
    }
    const val = document.querySelector('#imgLink').value
    if (!val.includes('.jpg') && !val.includes('.gif') && !val.includes('.png') && !val.includes('.jpeg') && !val.includes('.webp')) {
      return false;
    }
    if (document.querySelector('#title').value.length > 100) {
      longTitle = true;
      document.querySelector('#title').value = document.querySelector('#title').value.substring(0,100);
    }

    const jsonObj = {
      'title': document.querySelector('#title').value,
      'description': document.querySelector('#description').value,
      'linkToImg': document.querySelector('#imgLink').value,
      'titleCutOff': longTitle
    }

    const data = JSON.stringify(jsonObj)
    console.log(data)
    fetch( '/submitData', {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
    updateImage();
    document.querySelector('#title').value = "";
    document.querySelector('#description').value = "";
    document.querySelector('#imgLink').value = "";
  }

window.onload = function() {
    updateImage();
    const button = document.querySelector( 'button' )
    button.onclick = submit
  }


  function updateImage() {
    const imageDiv = document.getElementById('loadimages')
    let data = fetch('/imageData').then(response => response.json()).then(data => {
        console.log(data)
        if (data.length!=imageDiv.childElementCount) {
            imageDiv.innerHTML='';
            for (let i=data.length-1;i>=0;i--) {
              const thisImg = document.createElement('div');
              const title = document.createElement('p');
              title.style="font-size: 30px;"
              const description = document.createElement('p');
              const imgE = document.createElement('img');
              const author = document.createElement('p');
              author.style="font-size: 18px;"
              author.innerHTML = "Posted by "+data[i]['poster'];
              thisImg.className = "indivImg";
              imgE.src = data[i]['linkToImg'];
              if (data[i]['titleCutOff']) {
                  title.innerHTML = data[i]['title']+"...";
                  imgE.alt = data[i]['title']+"...";
              }
              else {
                  title.innerHTML = data[i]['title'];
                  imgE.alt = data[i]['title'];
              }
              description.innerHTML = data[i]['description'];
              thisImg.append(title);
              thisImg.append(author);
              thisImg.append(imgE)
              thisImg.append(description);
              imageDiv.append(thisImg);
            }
        }
    })
}

function resetForm() {
  document.getElementById('submitForm').reset();
}

setInterval(updateImage, 2000);

