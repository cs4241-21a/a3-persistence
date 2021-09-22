function displayInfo(info){
    const holder = document.querySelector('#data');
    holder.innerHTML = '';
    const row = document.createElement('tr');
    // Sign-up Name
    const userData = document.createElement('td');
    const userInput = document.createElement('input');
    userInput.className = 'table-input';
    userData.appendChild(userInput);
    userInput.value = info.yourName;
    userInput.id = `inputName`;

    // Summoner Name
    const summonerData = document.createElement('td');
    const summonerInput = document.createElement('input');
    summonerInput.className = 'table-input';
    summonerData.appendChild(summonerInput);
    summonerInput.value = info.summonerName;
    summonerInput.id = `summonerName`;

    // Rank
    const rankData = document.createElement('td');
    const rankInput = document.createElement('input');
    rankInput.className = 'table-input';
    rankData.appendChild(rankInput);
    rankInput.value = info.rank;
    rankInput.id = `playerRank`;


    // Primary Position
    const primaryRoleData = document.createElement('td');
    const primaryRoleInput = document.createElement('input');
    primaryRoleInput.className = 'table-input';
    primaryRoleData.appendChild(primaryRoleInput);
    primaryRoleInput.value = info.primaryRole;
    primaryRoleInput.id = `primaryRole`;

    //Make team
    const makeTeamData = document.createElement('td');
    const makeTeamInput = document.createElement('input');
    makeTeamInput.className = 'table-input';
    makeTeamData.appendChild(makeTeamInput);
    makeTeamInput.value = info.makeTeam;
    makeTeamInput.id = `makeTeam`;

    const editData = document.createElement("button");
    editData.value = "Edit information";
    const val = document.createTextNode("Edit")
    editData.appendChild(val);
    editData.id = "edit";
    editData.onclick = editinfo;
    const delData = document.createElement("button");
    delData.id = "del";
    delData.onclick = delinfo;
    delData.value = "Delete Info";
    const del = document.createTextNode("Delete")
    delData.appendChild(del);
    row.appendChild(userData);
    row.appendChild(summonerData);
    row.appendChild(rankData);
    row.appendChild(primaryRoleData);
    row.appendChild(makeTeamData);
    row.appendChild(editData);
    row.appendChild(delData);
    holder.appendChild(row);
}
const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    const yourname = document.querySelector('#yourname');
    const rank = document.querySelector('#rank');
    const sumname = document.querySelector('#sumname');
    const prole = document.querySelector('#prole');
    const username = document.querySelector('#username');
    const password = document.querySelector('#password');
    const json = {username: username.value, password: password.value, yourName: yourname.value, rank: rank.value, summonerName: sumname.value, primaryRole: prole.value, makeTeam: true};
    const body = JSON.stringify(json);
    fetch( '/submit', {
        method:'POST',
        body
    })
        .then( async function (response) {
            const val = await response.json();
            displayInfo(val);
            change_page();
        })

    return false
}
function change_page(){
    // similar behavior as an HTTP redirect
    window.location.replace("main.html");
    //or
    // similar behavior as clicking on a link
    window.location.href = "main.html";
};
const editinfo = function( e ) {
    // prevent default form action from being carried out
    console.log("444");
    e.preventDefault()
    const yourname = document.querySelector('#inputName');
    const rank = document.querySelector('#playerRank');
    const sumname = document.querySelector('#summonerName');
    const prole = document.querySelector('#primaryRole');
    const json = {yourName: yourname.value, rank: rank.value, summonerName: sumname.value, primaryRole: prole.value, makeTeam: true};
    const body = JSON.stringify(json);
    fetch( '/update', {
        method:'POST',
        body
    })
        .then( async function (response) {
            const val = await response.json();
            displayInfo(val);
        })

    return false
}
const delinfo = function (e) {
    console.log("1");
    e.preventDefault()
    fetch('/delete', {method: 'POST'}).then(r => console.log("I have deleted!"))
}
window.onload = function() {
    const button = document.querySelector( '#selector' )
    button.onclick = submit;
}
