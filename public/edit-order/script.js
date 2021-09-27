const form = document.querySelector("form");
const ordernum = parseInt(window.location.search.substring(1).split("=")[1]);

form.addEventListener("submit", e => {
    e.preventDefault();

    let toppings = [];
    const checkboxes = document.getElementsByName("toppings");
    for(let i = 0; i < checkboxes.length; i++){
        if(checkboxes[i].checked) toppings.push(checkboxes[i].value);
    }

    let body = {
        flavor: form.elements["flavor"].value,
        toppings,
        cone: form.elements["cone"].value,
        notes: form.elements["notes"].value
    }

    if(Number.isNaN(ordernum)){//adding a new order
        body = JSON.stringify(body);

        fetch("/add-order", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body
        })
        .then(() => fetch("/main.html").then(res => window.location.assign(res.url)));
    }else{//editing an existing order
        body.num = ordernum;
        body = JSON.stringify(body);
    
        fetch("/submit-edit", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body
        })
        .then(() => fetch("/main.html").then(res => window.location.assign(res.url)));
    }
})

function deleteThisOrder(){
    fetch("/delete-order", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({num: ordernum})
    })
    .then(() => fetch("/main.html").then(res => window.location.assign(res.url)));
}

fetch(`/order-info?num=${ordernum}`)
.then(res => res.json())
.then((order) => {
    console.log(order);

    if(order !== null){
        document.querySelector(`option[value="${order.flavor}"]`).setAttribute("selected", "");

        order.toppings.forEach((topping) => {
            document.querySelector(`input[type="checkbox"][value="${topping}"]`).setAttribute("checked", "");
        })

        document.querySelector(`input[type="radio"][value="${order.cone}"]`).setAttribute("checked", "");

        document.querySelector("textarea").innerText = order.notes;
    }
})