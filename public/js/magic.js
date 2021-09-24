// I did not copy and paste all the client-side code from A2.
// Nope. Not at all.

// Add some Javascript code here, to run on the front end.

var toastElList;
var toastList
var ntModal;
var edModal;
var dtModal;

function renderTable() {
    var table = document.getElementById("main-tbody")
    table.innerHTML = ""

    //var table = document.getElementById("main-table")

    fetch('/getData', {
        method: 'GET'
      })
    .then(response => response.json())
    .then(function(json) {
        // Parse the response
        var index = 0;
        for (let item of json) {
            var row = table.insertRow()
            for (var i = 0; i < 8; i++) {
                row.insertCell(i)
            }
            row.cells[0].innerHTML = "<label style='font-size: 0px' for='" + index + "-checkbox'>Done?</label><input type='checkbox' id='" + index + "-checkbox' label='Complete this task' onclick='setTimeout(function() {completeItem(" + index + ")}, 250)'>"
            row.cells[1].innerHTML = item.name
            row.cells[2].innerHTML = item.category
            row.cells[3].innerHTML = item.priority
            row.cells[4].innerHTML = item.duedate
            // TODO: Importance NEEDS to get figured out automatically
            if (item.importance == 101) {
                // Not the best way to do this but I'm lazy
                row.cells[5].innerHTML = "<span style='color: #dc3545'>Overdue!</span>"
            } else {
                row.cells[5].innerHTML = item.importance + "%"
            }
            row.cells[6].innerHTML = "<button class='btn btn-primary' onclick='updateItem(" + index + ")'>Edit</button>"
            row.cells[7].innerHTML = "<button class='btn btn-danger' onclick='deleteItem(" + index + ")'>Delete</button>"
            index++;
        }
    })
}

function renderCompletedTable() {
    var table = document.getElementById("completed-tbody")
    table.innerHTML = ""

    //var table = document.getElementById("main-table")

    fetch('/getCompletedData', {
        method: 'GET'
      })
    .then(response => response.json())
    .then(function(json) {
        // Parse the response
        var index = 0;
        for (let item of json) {
            var row = table.insertRow()
            for (var i = 0; i < 4; i++) {
                row.insertCell(i)
            }
            row.cells[0].innerHTML = item.name
            row.cells[1].innerHTML = item.category
            row.cells[2].innerHTML = item.priority
            row.cells[3].innerHTML = item.duedate
            index++;
        }
    })
}

function completeItem(index) {
    fetch('/completeData', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"index": index})
    })
    .then(response => response.text())
    .then(function (text) {
        renderTable()
        renderCompletedTable()
        if (text != "OK") {
            toaster("The task wasn't marked as completed. Try again later.")
        } else {
            toaster("Nice job! Task marked as completed.")
        }
    })
}

function deleteItem(index) {
    dtModal.toggle()
    document.getElementById("delete-submit").setAttribute("onclick", "deleteItem2('" + index + "')")
}

function deleteItem2(index) {
    fetch('/deleteData', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"index": index})
    })
    .then(response => response.text())
    .then(function (text) {
        renderTable()
        dtModal.toggle()
        if (text != "OK") {
            toaster("The task wasn't deleted. Try again later.")
        } else {
            toaster("The task has been deleted successfully.")
        }
    })
}

function toaster(content) {
    document.getElementById("toaster-content").innerHTML = content
    var toast = new bootstrap.Toast(document.getElementById("toaster"))
    toast.show()
}

const postItem = function() {
    //e.preventDefault()

    var name = document.getElementById("taskName").value
    var duedate = document.getElementById("taskDueDate").value
    var priority = document.getElementById("taskPriority").value
    var category = document.getElementById("taskCategory").value

    if (name == "" || priority == "" || category == "" || duedate == "") {
        document.getElementById("taskValidation").style.display = ""
        return
    } else {
        document.getElementById("taskValidation").style.display = "none"
    }

    var data = {"name": name, "duedate": duedate, "priority": priority, "importance": 1, "category": category}

    fetch('/postData', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(function (text) {
        renderTable()
        ntModal.toggle()
        document.getElementById("taskName").value = ""
        document.getElementById("taskDueDate").value = ""
        document.getElementById("taskPriority").value = "1"
        document.getElementById("taskCategory").value = ""
        if (text != "OK") {
            toaster("The task wasn't added. Try again later.")
        } else {
            toaster("The task has been added successfully.")
        }
    })

    return false
}

function updateItem(item) {
    var table = document.getElementById("main-tbody")
    var name = table.rows[item].cells[1].innerHTML
    var category = table.rows[item].cells[2].innerHTML
    var priority = table.rows[item].cells[3].innerHTML
    var date = table.rows[item].cells[4].innerHTML
    document.getElementById("edit-taskName").value = name
    document.getElementById("edit-taskCategory").value = category
    document.getElementById("edit-taskPriority").value = priority
    document.getElementById("edit-taskDueDate").value = date
    document.getElementById("edit-submit").setAttribute("onclick", "updateItem2('" + item + "')")
    edModal.toggle()
}

function updateItem2(item) {
    var name = document.getElementById("edit-taskName").value
    var priority = document.getElementById("edit-taskPriority").value
    var category = document.getElementById("edit-taskCategory").value
    var duedate = document.getElementById("edit-taskDueDate").value

    if (name == "" || priority == "" || category == "" || duedate == "") {
        document.getElementById("editValidation").style.display = ""
        return
    } else {
        document.getElementById("editValidation").style.display = "none"
    }

    data = {"index": item, "name": name, "priority": priority, "category": category, "duedate": duedate}
    fetch('/patchData', {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(function (text) {
        renderTable()
        edModal.toggle()
        if (text != "OK") {
            toaster("The task couldn't be edited. Try again later.")
        } else {
            toaster("The task has been edited successfully.")
        }
    })
}

function whoAmI() {
    fetch('/whoami', {
        method: "GET",
    })
    .then(response => response.text())
    .then(function (text) {
            document.getElementById("usernamedisplay").innerHTML = text
    })
}


window.onload = function () {
    toastElList = [].slice.call(document.querySelectorAll('.toast'))
    toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl)
    })

    ntModal = new bootstrap.Modal(document.getElementById('newTaskModal'))
    edModal = new bootstrap.Modal(document.getElementById('editTaskModal'))
    dtModal = new bootstrap.Modal(document.getElementById('deleteTaskModal'))

    renderTable()
    renderCompletedTable()
    whoAmI()

    //button = document.querySelector("#input-submit")
    //button.onclick = postItem
}
