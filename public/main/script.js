//get username from server
const titleBar = document.getElementsByClassName("title-bar-text").item(0);
const orderBox = document.getElementsByClassName("order-box").item(0);

fetch("/username")
.then(response => response.json())
.then((data) => {
    user = data.user;

    //set title bar text
    titleBar.innerText = `Orders: ${user}`;

    let body = JSON.stringify({user});

    fetch("/user-orders", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body
    })
    .then(response => response.json())
    .then((orders) => {
        orderBox.innerHTML = "<h4>Click an order to edit</h4>";
        orders.forEach((order) => {
            orderBox.append(createOrderNode(order));
        })
        
        const addButton = document.createElement("button");
        addButton.setAttribute("type", "button");
        addButton.setAttribute("onclick", "addOrder()");
        addButton.setAttribute("id", "add-button");
        addButton.innerText = "Add order";
        orderBox.append(addButton);
    })
})


function editOrder(num){
    fetch(`/edit-order.html?num=${num}`).then((res) => window.location.assign(res.url));
}

function addOrder(){
    fetch(`edit-order.html?num=new`).then((res) => window.location.assign(res.url));
}

//helper to create a node from order info
function createOrderNode(order){
    const orderHTML = 
        `<h4>Order Number: ${order.num}</h4>
        <p><em>Flavor:</em> ${order.flavor}</p>
        <p><em>Toppings:</em> ${order.toppings}</p>
        <p><em>Cone:</em> ${order.cone}</p>
        <p><em>Notes:</em> ${order.notes}</p>`

    orderNode = document.createElement("button");
    orderNode.setAttribute("class", "order");
    orderNode.setAttribute("onclick", `editOrder(${order.num})`);
    orderNode.innerHTML = orderHTML;

    return orderNode;
}