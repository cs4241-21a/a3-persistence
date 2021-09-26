
function delFlight(id) {
    const json = {id: id};

    fetch("/del", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json),
    }).then(function (_) {
        fetchData();
    });
}

function fetchData() {
    fetch('/getUpcoming')
        .then(response => response.json())
        .then(data => {
            let tableData = "";
            for (let i = 0; i < data.length; i++) {
                tableData += "<tr>";
                tableData += `<td>${data[i].flightNum}</td>`;
                tableData += `<td>${data[i].depAirport}</td>`;
                tableData += `<td>${data[i].arrAirport}</td>`;
                tableData += `<td>${data[i].date}</td>`;
                tableData += `<td><a href="javascript:void(0);" onclick="delFlight('${data[i].id}');">Remove</a></td>`;
                tableData += "</tr>";
            }
            document.getElementById("upcomingData").innerHTML = tableData;
        });

    fetch('/getPast')
        .then(response => response.json())
        .then(data => {
            let tableData = "";
            for (let i = 0; i < data.length; i++) {
                tableData += "<tr>";
                tableData += `<td>${data[i].flightNum}</td>`;
                tableData += `<td>${data[i].depAirport}</td>`;
                tableData += `<td>${data[i].arrAirport}</td>`;
                tableData += `<td>${data[i].date}</td>`;
                tableData += `<td><a href="javascript:void(0);" onclick="delFlight('${data[i].id}');">Remove</a></td>`;
                tableData += "</tr>";
            }
            document.getElementById("pastData").innerHTML = tableData;
        });
}

const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault();

    const desc = document.querySelector("#flightNum"),
        depAirport = document.querySelector("#depAirport"),
        arrAirport = document.querySelector("#arrAirport"),
        date = document.querySelector("#date");

    const json = {flightNum: desc.value, depAirport: depAirport.value, arrAirport: arrAirport.value, date: date.value};

    fetch("/add", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json),
    }).then(function (_) {
        fetchData();
    });

    return false;
};


window.onload = function () {
    fetchData();

    const button = document.querySelector("button");
    button.onclick = submit;
};