// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!")

// Update the tasks table data
let updateTasks = (tasks) => {

    // sort based on priority
    tasks.sort((elem1, elem2) => {
        if (elem1.priority > elem2.priority) {
            return -1;
        } else if (elem1.priority === elem2.priority) {
            return 0;
        } else {
            return 1;
        }
    });

    const holder = document.querySelector('#task-holder');
    holder.innerHTML = '';

    tasks.forEach((element, index) => {

        // Create table row
        const row = document.createElement('tr');

        // Task title
        const titleData = document.createElement('td');
        const titleInput = document.createElement('input');
        titleInput.className = 'table-input';
        titleData.appendChild(titleInput);
        titleInput.value = element.title;
        titleInput.id = `title-${index}`;

        // Task description
        const descriptionData = document.createElement('td');
        const descriptionInput = document.createElement('input');
        descriptionInput.className = 'table-input';
        descriptionData.appendChild(descriptionInput);
        descriptionInput.value = element.description;
        descriptionInput.id = `description-${index}`;

        // Task priority
        const priorityData = document.createElement('td');
        const priorityInput = document.createElement('input');
        priorityInput.className = 'table-input';
        priorityInput.type = 'number';
        priorityInput.min = 0;
        priorityInput.max = 10;
        priorityData.appendChild(priorityInput);
        priorityInput.value = element.priority;
        priorityInput.id = `priority-${index}`;

        // Task creation date
        const dateCreatedData = document.createElement('td');
        const dateCreatedInput = document.createElement('input');
        dateCreatedInput.className = 'table-input';
        dateCreatedInput.readOnly = true;
        dateCreatedData.appendChild(dateCreatedInput);
        dateCreatedInput.value = element.dateCreated;

        // Task deadline
        const deadlineData = document.createElement('td');
        const deadlineInput = document.createElement('input');
        deadlineInput.className = 'table-input';
        deadlineInput.readOnly = true;
        deadlineData.appendChild(deadlineInput);
        deadlineInput.value = element.deadline;

        // Task delete button
        const delBtn = document.createElement('button');
        delBtn.className = "warn-btn";
        delBtn.appendChild(document.createTextNode('Delete'));
        delBtn.onclick = () => {

            fetch('/delete', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                  },
                body: JSON.stringify({title: element.title})
            }).then(async (data) => {
                const tasks = await data.json();

                updateTasks(tasks);
            }).catch((err) => {
                console.log(err);
            });
        };

        // Task edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'secondary-btn';
        editBtn.appendChild(document.createTextNode('Save Edits'));
        editBtn.onclick = (e) => {

            const priority = document.querySelector(`#priority-${index}`);

            if ((!priority.valueAsNumber && priority.valueAsNumber !== 0) || priority.valueAsNumber < 0 || priority.valueAsNumber > 10) {
                alert('Priority must be 0 - 10');
                return;
            }

            fetch('/edit', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                  },
                body: JSON.stringify({
                    oldTitle: element.title,
                    newTitle: document.querySelector(`#title-${index}`).value,
                    description: document.querySelector(`#description-${index}`).value,
                    priority: priority.valueAsNumber
                })
            }).then(async (data) => {
                const tasks = await data.json();

                if (tasks.error) {
                    alert(tasks.error);
                    return;
                }

                updateTasks(tasks);
            }).catch((err) => {
                console.log(err);
            });
        };

        // Append everything together
        row.appendChild(titleData);
        row.appendChild(descriptionData);
        row.appendChild(priorityData);
        row.appendChild(dateCreatedData);
        row.appendChild(deadlineData);

        row.appendChild(editBtn);
        row.appendChild(delBtn);

        holder.appendChild(row);
    });
}

// Add task submit callback
const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault();

    // Get and format today's date
    var today = new Date();
    const dateString = `${String(today.getMonth() + 1).padStart(2, '0')}/` +
        `${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

    const title = document.querySelector('#title');
    const description = document.querySelector('#description');

    const priority = document.querySelector('#priority');
    if ((!priority.valueAsNumber && priority.valueAsNumber !== 0) || priority.valueAsNumber < 0 || priority.valueAsNumber > 10) {
        alert('Priority must be 0 - 10');
        return;
    }

    // Compile Data
    const json = {
        title: title.value,
        description: description.value,
        dateCreated: dateString,
        priority: priority.valueAsNumber
    };
    const body = JSON.stringify(json)

    // Send data
    fetch('/submit', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        body
    })
        .then(async function (response) {
            const tasks = await response.json();

            if (tasks.error) {
                alert(tasks.error);
                return;
            }

            updateTasks(tasks);
        });

    return false;
}

const editTask = (i, element) => {

    const priority = document.querySelector(`#priority-${i}`);

    if ((!priority.valueAsNumber && priority.valueAsNumber !== 0) || priority.valueAsNumber < 0 || priority.valueAsNumber > 10) {
        alert('Priority must be 0 - 10');
        return;
    }

    fetch('/edit', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        body: JSON.stringify({
            oldTitle: element.title,
            newTitle: document.querySelector(`#title-${i}`).value,
            description: document.querySelector(`#description-${i}`).value,
            priority: priority.valueAsNumber
        })
    }).then(async (data) => {
        const tasks = await data.json();

        if (tasks.error) {
            alert(tasks.error);
            return;
        }

        updateTasks(tasks);
    }).catch((err) => {
        console.log(err);
    });
};

const delTask = (element) => {

    fetch('/delete', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        body: JSON.stringify({title: element.title})
    }).then(async (data) => {
        const tasks = await data.json();

        updateTasks(tasks);
    }).catch((err) => {
        console.log(err);
    });
};

window.onload = function () {
    const button = document.querySelector('button')
    button.onclick = submit;

    // Get initial table of data from server
    // fetch('/get-data', {
    //     method: 'GET'
    // }).then(async (data) => {
    //     const tasks = await data.json();

    //     updateTasks(tasks);
    // }).catch((err) => {
    //     console.log(err);
    // });
}