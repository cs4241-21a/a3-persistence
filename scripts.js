const submit = function(e) {
    // prevent default form action from being carried out
    e.preventDefault();
    let submited = document.getElementById("subB").innerText;
  
    if (submited == "Submit") {
      let dataSet = JSON.parse(submited);
  
      var totalP = parseInt(dataSet.totP);
      var slicesEa = parseInt(dataSet.slicePer);
      var gfPeople = parseInt(dataSet.gfP);
  
      //Initialize vars
      var pNoGf = totalP - gfPeople; //people that aren't gf
      var totalSl = slicesEa * pNoGf; //total slices needed
      var totalGf = slicesEa * gfPeople; //total slices for gf
      var large = 0;
      var medium = 0;
      var small = 0;
      var largeGf = 0;
      var mediumGf = 0;
      var smallGf = 0;
  
      //Time to be greedy, Boys
      while (totalSl > 6) {
        if (totalSl - 10 >= 0) {
          large++;
          totalSl -= 10;
        } else if (totalSl - 8 >= 0) {
          medium++;
          totalSl -= 8;
        } else {
          small++;
          totalSl -= 6;
        }
      }
  
      if (totalSl > 0 && totalSl <= 6) {
        small++;
      }
  
      while (totalGf > 6) {
        if (totalGf - 10 >= 0) {
          largeGf++;
          totalGf -= 10;
        } else if (totalGf - 8 >= 0) {
          mediumGf++;
          totalGf -= 8;
        } else {
          smallGf++;
          totalGf -= 6;
        }
      }
  
      if (totalGf > 0 && totalGf <= 6) {
        small++;
      }
  
      //Add new fields to object
      dataSet.large = large;
      dataSet.medium = medium;
      dataSet.small = small;
      dataSet.largeGf = largeGf;
      dataSet.mediumGf = mediumGf;
      dataSet.smallGf = smallGf;
  
      const form = document.querySelector("form1"),
        json = {
          totP: document.getElementById("totP").value,
          slicePer: document.getElementById("slicePer").value,
          gfP: document.getElementById("gfP").value,
          large: large,
          medium: medium,
          small: small,
          largeGf: largeGf,
          mediumGf: mediumGf,
          smallGf: smallGf
        },
        body = JSON.stringify(json);
  
      fetch("/add", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function(response) {
          // do something with the reponse
          return response.json();
        })
  
        .then(function(json) {
          document.querySelector("#form1").reset();
          let row = document.querySelector("#t1").insertRow();
          row.insertCell(0).innerHTML = json.totP;
          row.insertCell(1).innerHTML = json.slicePer;
          row.insertCell(2).innerHTML = json.gfP;
          row.insertCell(3).innerHTML = json.large;
          row.insertCell(4).innerHTML = json.medium;
          row.insertCell(5).innerHTML = json.small;
          row.insertCell(6).innerHTML = json.largeGf;
          row.insertCell(7).innerHTML = json.mediumGf;
          row.insertCell(8).innerHTML = json.smallGf;
        });
      document.querySelector("#subB").innerHTML = "Submit";
    }
    return false;
  };
  
  
  
  
  window.onload = function() {
    const button = document.querySelector("button");
    button.onclick = submit;
  }; // Add some Javascript code here, to run on the front end.