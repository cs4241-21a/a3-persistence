console.log(document.cookie)


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
    const userId = document.querySelector('#addTask-btn').getAttribute('userid');

    tasks.forEach((element, index) => {

        // Create table row
        const row = document.createElement('tr');

        // Task title
        const titleData = document.createElement('td');
        const titleLabel = document.createElement('label');
        const titleInput = document.createElement('input');
        titleLabel.htmlFor = `title-${index}`;
        titleLabel.ariaLabel = "Task Title Input";
        titleInput.className = 'table-input';
        titleData.appendChild(titleLabel);
        titleData.appendChild(titleInput);
        titleInput.value = element.title;
        titleInput.id = `title-${index}`;

        // Task description
        const descriptionData = document.createElement('td');
        const descriptionLabel = document.createElement('label');
        const descriptionInput = document.createElement('input');
        descriptionLabel.htmlFor = `description-${index}`;
        descriptionLabel.ariaLabel = "Task Description Input";
        descriptionInput.className = 'table-input';
        descriptionData.appendChild(descriptionLabel);
        descriptionData.appendChild(descriptionInput);
        descriptionInput.value = element.description;
        descriptionInput.id = `description-${index}`;

        // Task priority
        const priorityData = document.createElement('td');
        const priorityLabel = document.createElement('label');
        const priorityInput = document.createElement('input');
        priorityLabel.htmlFor = `priority-${index}`;
        priorityLabel.ariaLabel = "Task Priority Input";
        priorityInput.className = 'table-input';
        priorityInput.type = 'number';
        priorityInput.min = 0;
        priorityInput.max = 10;
        priorityData.appendChild(priorityLabel);
        priorityData.appendChild(priorityInput);
        priorityInput.value = element.priority;
        priorityInput.id = `priority-${index}`;

        // Task creation date
        const dateCreatedData = document.createElement('td');
        const dateCreatedLabel = document.createElement('label');
        const dateCreatedInput = document.createElement('input');
        dateCreatedLabel.htmlFor = `dateCreated-${index}`;
        dateCreatedLabel.ariaLabel = "Task Date Created";
        dateCreatedInput.id = `dateCreated-${index}`;
        dateCreatedInput.className = 'table-input';
        dateCreatedInput.readOnly = true;
        dateCreatedData.appendChild(dateCreatedLabel);
        dateCreatedData.appendChild(dateCreatedInput);
        dateCreatedInput.value = element.dateCreated;

        // Task deadline
        const deadlineData = document.createElement('td');
        const deadlineLabel = document.createElement('label');
        const deadlineInput = document.createElement('input');
        deadlineLabel.htmlFor = `deadline-${index}`;
        deadlineLabel.ariaLabel = "Task Deadline";
        deadlineInput.id = `deadline-${index}`;
        deadlineInput.className = 'table-input';
        deadlineInput.readOnly = true;
        deadlineData.appendChild(deadlineInput);
        deadlineInput.value = element.deadline;

        // Task delete button
        const buttonData = document.createElement('td');

        const delBtn = document.createElement('button');
        delBtn.className = "warn-btn";
        // TODO: add custom id attribute userId
        delBtn.appendChild(document.createTextNode('Delete'));
        delBtn.onclick = (e) => {
            delTask(element.title, e.target);
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

        buttonData.appendChild(editBtn);
        buttonData.appendChild(delBtn);

        // Append everything together
        row.appendChild(titleData);
        row.appendChild(descriptionData);
        row.appendChild(priorityData);
        row.appendChild(dateCreatedData);
        row.appendChild(deadlineData);

        row.appendChild(buttonData);

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
    fetch(`/user/${e.target.getAttribute('userid')}/submit`, {
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

const editTask = (i, title) => {

    const index = parseInt(i);
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
            oldTitle: title,
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

const delTask = (title, btn) => {

    fetch(`/user/${btn.getAttribute('userid')}/delete`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ title })
    }).then(async (data) => {
        const tasks = await data.json();

        updateTasks(tasks);
    }).catch((err) => {
        console.log(err);
    });
};

window.onload = function () {
    const button = document.querySelector('#addTask-btn');
    button.onclick = submit;
}