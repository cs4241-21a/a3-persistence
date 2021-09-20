const hwAPIPath = "/homework"

const hwProperties = [
  "name", "priority", "course", "dueDate",
]
const hwPropColNames = [
  "Homework", "Priority", "Course", "Due Date",
]

const homeworkData = { }

function onComplete(homeworkTable, homeworkRow, homework) {
  console.log(homework)
  const body = JSON.stringify(homework)
  fetch( hwAPIPath, {
    method:'DELETE',
    body
  })
  .then( function( response ) {
    // Get DELETE response to confirm success
    if(response.status === 200) {
      homeworkTable.removeChild(homeworkRow)
      delete homeworkData[homework.subDate]
    }
  })
}

function createHWRow(homeworkTable, homework) {
  console.log(homework)
  
  let homeworkRow = document.createElement('tr')
  const dueDate = new Date(homework.dueDate)
  // Create each data element for the row
  for(const prop of hwProperties) {
    console.log(homework + " ==> " + prop)
    let homeworkProp = document.createElement('td')

    if(prop === "dueDate") {
      homeworkProp.textContent = dueDate.toLocaleString('en-US')
    }
    else {
      homeworkProp.textContent = homework[prop]
    }
    homeworkRow.appendChild(homeworkProp)
  }

  const newHWSubmit = document.getElementById('newHWSubmit')
  const editBtn = document.createElement('button')
  editBtn.textContent = "Edit"
  editBtn.onclick = function() {
    const nameInput = document.getElementById('homeworkName'),
          courseInput = document.getElementById('homeworkCourse'),
          dueDateInput = document.getElementById('homeworkDue')

    nameInput.value = homework.name
    courseInput.value = homework.course
    dueDateInput.value = dueDate.toLocaleString('en-US')

    showOverlay()
    newHWSubmit.onclick = generateSubmitFunc(false, homework, homeworkRow)
  }

  const deleteBtn = document.createElement('button')
  deleteBtn.textContent = "Complete"
  deleteBtn.onclick = function(e) {
    onComplete(homeworkTable, homeworkRow, homework)
  }

  homeworkRow.appendChild(editBtn)
  homeworkRow.appendChild(deleteBtn)
  return homeworkRow
}

function addHWToTable(homeworkTable, homework) {
  const homeworkRow = createHWRow(homeworkTable, homework)
  homeworkTable.appendChild(homeworkRow)
}

function replaceHWRow(homeworkTable, homework, prevHomeworkRow) {
  const homeworkRow = createHWRow(homeworkTable, homework)
  homeworkTable.replaceChild(homeworkRow, prevHomeworkRow)
}

function hideOverlay() {
  const overlay = document.getElementById('overlay')
  overlay.style.display = "none"
}

function showOverlay() {
  const overlay = document.getElementById('overlay')
  overlay.style.display = "block"
}

function clearInputBoxes() {
  const inputs = document.querySelectorAll('input')
  for(const input of inputs) {
    input.value = ""
  }
}

function resetSubmissionUI() {
  const newHWSubmit = document.getElementById('newHWSubmit')
  newHWSubmit.onclick = generateSubmitFunc()
  hideOverlay()
  clearInputBoxes()
}

function submitHWDialog(isNewHomework=true, prevHomework=null) {
  const nameInput = document.getElementById('homeworkName'),
        courseInput = document.getElementById('homeworkCourse'),
        dueDateInput = document.getElementById('homeworkDue'),
        homework = { name: nameInput.value, course: courseInput.value}

  try{
    let dueDate = new Date(dueDateInput.value)
    homework.dueDate = dueDate

    if(isNewHomework) {
      // Calculate submission time
      let currDate = new Date()
      homework.subDate = currDate.toISOString()
    }
    else {
      homework.subDate = prevHomework.subDate
    }

    console.log(homework)
  }
  catch(err) {
    alert(err)
  }

  return homework
}

function generateSubmitFunc(isNewHomework=true, prevHomework=null, prevHWRow=null) {
  const onSubmit = function(event) {
    // prevent default form action from being carried out
    event.preventDefault()

    // Get homework data from dialog
    let homework = submitHWDialog(isNewHomework, prevHomework)

    const body = JSON.stringify(homework)
    fetch( hwAPIPath, {
      method: isNewHomework ? 'POST' : 'PUT',
      body
    })
    .then( function( response ) {
      const homeworkTable = document.getElementById('assignments')
      // Convert POST response into JSON to extract new homework information
      // Then display homework info on the table
      response.json().then(homework => {
        // Display given homeworks
        homeworkData[homework.subDate] = homework

        // Update table UI
        if(isNewHomework) {
          addHWToTable(homeworkTable, homework)
        }
        else {
          replaceHWRow(homeworkTable, homework, prevHWRow)
        }
      })
    })

    // Clean up UI after submission takes place
    resetSubmissionUI()
  }
  return onSubmit
}

window.onload = function() {
  const addHWBtn = document.getElementById('addHWBtn')
  addHWBtn.onclick = function(e) {
    showOverlay()
  }

  const newHWSubmit = document.getElementById('newHWSubmit')
  const newHWCancel = document.getElementById('newHWCancel')
  newHWSubmit.onclick = generateSubmitFunc()
  newHWCancel.onclick = function(e) {
    resetSubmissionUI()
  }

  const homeworkTable = document.getElementById('assignments')

  // Initialize Column Names
  let labelRow = document.createElement('tr')
  for(const name of hwPropColNames) {
    let colLabel = document.createElement('th')
    colLabel.textContent = name
    labelRow.appendChild(colLabel)
  }
  homeworkTable.appendChild(labelRow)

  // Request list of homework stored on server
  fetch('/homework', {
    method: 'GET',
  })
  .then(function(response) {
    // Convert GET response into JSON to extract homework information
    // Then display homework info on the table
    response.json().then(assignments => {
      console.log(assignments)
      // Display given homeworks
      for(const homeworkID in assignments) {
        homeworkData[homeworkID] = assignments[homeworkID]
        addHWToTable(homeworkTable, homeworkData[homeworkID])
      }
    })
  })
}