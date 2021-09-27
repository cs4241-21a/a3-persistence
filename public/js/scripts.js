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
            if (data.code === 403)
                window.location.href = '/login.html';

            let tableData = "";
            for (let i = 0; i < data.length; i++) {
                tableData += "<tr>";
                tableData += `<td>${data[i].flightNum}</td>`;
                tableData += `<td>${data[i].depAirport}</td>`;
                tableData += `<td>${data[i].arrAirport}</td>`;
                tableData += `<td>${data[i].date}</td>`;
                tableData += `<td><a href="javascript:void(0);" onclick="loadModify('${data[i]._id}');">Edit</a></td>`;
                tableData += `<td><a href="javascript:void(0);" onclick="delFlight('${data[i]._id}');">Remove</a></td>`;
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
                tableData += `<td><a href="javascript:void(0);" onclick="loadModify('${data[i]._id}');">Edit</a></td>`;
                tableData += `<td><a href="javascript:void(0);" onclick="delFlight('${data[i]._id}');">Remove</a></td>`;
                tableData += "</tr>";
            }
            document.getElementById("pastData").innerHTML = tableData;
        });
}

function loadModify(id) {
    const json = {id: id};

    fetch("/queryFlight", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json),
    }).then(response => response.json())
      .then(data => {
          document.getElementById("boxTitle").innerText = "Edit Flight";
          document.getElementById("flightNum").value = data.result.flightNum;
          document.getElementById("depAirport").value = data.result.depAirport;
          document.getElementById("arrAirport").value = data.result.arrAirport;
          document.getElementById("date").value = data.result.date;
          document.getElementById("idToModify").value = id;
          document.getElementById("submitButton").onclick = submitModify;

          document.getElementById("flightNum").focus();
      });
}

function submitModify(e) {

    e.preventDefault();

    const id = document.querySelector("#idToModify").value;

    const flightNum = document.querySelector("#flightNum"),
        depAirport = document.querySelector("#depAirport"),
        arrAirport = document.querySelector("#arrAirport"),
        date = document.querySelector("#date");

    const json = {id, flightNum: flightNum.value, depAirport: depAirport.value, arrAirport: arrAirport.value, date: date.value};

    fetch("/editFlight", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json),
    }).then(function (_) {
        window.location.reload();
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

    document.getElementById("submitButton").onclick = submit;
};