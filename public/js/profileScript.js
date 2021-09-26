function updateImage() {
    const imageDiv = document.getElementById('loadimages')
    let data = fetch('/profileData').then(response => response.json()).then(data => {
        console.log(data)
        if (data.length!=imageDiv.childElementCount) {
            imageDiv.innerHTML='';
            for (let i=0;i<data.length;i++) {
            const thisImg = document.createElement('div');
            const title = document.createElement('input');
            title.type="text"
            title.name="title"
            title.placeholder="Title"
            const description = document.createElement('input');
            description.type="text"
            const imgE = document.createElement('img');
            const delButton = document.createElement('button');
            const upButton = document.createElement('button');
            delButton.innerText = "Delete"
            delButton.setAttribute('onclick', 'deleteItem(\''+data[i]['_id']+'\')')
            thisImg.className = "indivImg";
            imgE.src = data[i]['linkToImg'];
            imgE.className = "post"
            if (data[i]['titleCutOff']) {
                title.value = data[i]['title']+"...";
                imgE.alt = data[i]['title']+"...";
            }
            else {
                title.value = data[i]['title'];
                imgE.alt = data[i]['title'];
            }
            editButton = document.createElement('button')
            editButton.innerText = "Update"
            editButton.setAttribute('onclick', 'updateItem(\''+data[i]['_id']+'\')')
            description.value = data[i]['description'];
            description.name = "description"
            description.placeholder = "Description"
            const form = document.createElement('form')
            form.action = "/editData"
            form.method = "POST"
            const idInput = document.createElement('input')
            idInput.type="hidden"
            idInput.name="id"
            idInput.value=data[i]['_id']
            thisImg.id=data[i]['_id']
            thisImg.append(imgE)
            form.append(title)
            form.append(idInput)
            form.append(document.createElement('br'))
            form.append(description)
            form.append(document.createElement('br'))
            form.append(editButton)
            thisImg.append(form)
            thisImg.append(delButton)
            imageDiv.append(thisImg);
            }
        }
    })
}

function deleteItem(id){
  fetch( '/deleteItem', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({'_id': id})
  }).then(document.getElementById(id).remove())
}


window.onload = function() {
    updateImage();
  }