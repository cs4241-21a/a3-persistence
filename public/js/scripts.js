window.onload = pageLoad()

function pageLoad() {
	// Fetch data from server to create cards on load
	fetch('/read', {
		method: 'GET',
		headers: {
			"Content-Type": "application/json"
		}
	}).then(res => {
		return res.json()
	}).then(res => {

		// Handle empty form
		if (res.length === 0) {
			document.getElementById('loader').innerHTML =
				`<p class="m-auto text-lg text-gray-400">wow, such empty</p>`
			return
		}

		// Sort data
		res.sort((a, b) => b.date.localeCompare(a.date))

		let jsons = []

		// Process first transaction
		jsons[0] = {
			"date": res[0].date,
			"I": 0,
			"O": 0,
			"transactions": []
		}
		if (res[0].isIn) jsons[0].I += res[0].amount
		else jsons[0].O += res[0].amount
		jsons[0].transactions.push({
			"id": res[0]._id,
			"date": res[0].date,
			"isIn": res[0].isIn,
			"amount": res[0].amount,
			"note": res[0].note
		})

		// Repeat for all transactions and add to previous date when possible
		for (let i = 1; i < res.length; i++) {
			if (res[i].date !== jsons[jsons.length - 1].date) {
				jsons.push({
					"date": res[i].date,
					"I": 0,
					"O": 0,
					"transactions": []
				})
			}
			if (res[i].isIn) jsons[jsons.length - 1].I += res[i].amount
			else jsons[jsons.length - 1].O += res[i].amount
			jsons[jsons.length - 1].transactions.push({
				"id": res[i]._id,
				"date": res[i].date,
				"isIn": res[i].isIn,
				"amount": res[i].amount,
				"note": res[i].note
			})
		}

		// Add statistics
		let I = 0;
		let O = 0;

		jsons.forEach(day => {
			I += day.I
			O += day.O
		})

		let stat = document.createElement('div')
		stat.setAttribute('class', 'max-w-7xl mx-auto pt-12 sm:px-6 lg:px-8')
		stat.innerHTML = `<div class="max-w-4xl mx-auto"> <div class="bg-white shadow overflow-hidden sm:rounded-lg"> <div class="px-4 py-5 sm:px-6"> <h3 class="text-lg leading-6 font-medium text-gray-900"> Statistics </h3> <p class="mt-1 max-w-2xl text-sm text-gray-500">
			Total Income: $${(I / 100).toFixed(2)}, Total Expenses: $${(O / 100).toFixed(2)} </p> </div> </div> </div>`

		document.body.insertBefore(stat, document.getElementById('foot'))

		// Add cards
		jsons.forEach(day => createCard(day))

		// Remove spinner
		document.body.removeChild(document.getElementById('loader'))
	})
}

function addItem() {
	let div = document.createElement('div')
	div.setAttribute('id', 'overlayAdd');
	div.setAttribute('class', 'fixed z-10 inset-0 overflow-y-auto');
	div.setAttribute('aria-labelledby', 'modal-title');
	div.setAttribute('role', 'dialog');
	div.setAttribute('aria-modal', 'true');
	div.innerHTML =
		"  <div class=\"flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0\">\n" +
		"    <div class=\"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity\" aria-hidden=\"true\"></div>\n" +
		"    <span class=\"hidden sm:inline-block sm:align-middle sm:h-screen\" aria-hidden=\"true\">&#8203;</span>\n" +
		"    <form action=\"/create\" method=\"post\"\n" +
		"          class=\"inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full\">\n" +
		"      <div class=\"bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4\">\n" +
		"        <div>\n" +
		"          <div class=\"mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-myGreen-100 sm:mx-0 sm:h-10 sm:w-10\">\n" +
		"            <!-- Heroicon name: outline/plus-circle -->\n" +
		"            <svg class=\"h-6 w-6 text-myGreen-600\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\"\n" +
		"                 viewBox=\"0 0 24 24\" stroke=\"currentColor\" aria-hidden=\"true\">\n" +
		"              <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"\n" +
		"                    d=\"M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z\"/>\n" +
		"            </svg>\n" +
		"          </div>\n" +
		"          <div class=\"mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left\">\n" +
		"            <h3 class=\"text-lg leading-6 font-medium text-gray-900\" id=\"modal-title\">\n" +
		"              Add Item</h3>\n" +
		"            <div class=\"mt-2\">\n" +
		"              <!-- Amount and Type -->\n" +
		"              <div>\n" +
		"                <label for=\"amount\" class=\"block text-sm font-medium text-gray-700\">Amount</label>\n" +
		"                <div class=\"mt-1 relative rounded-md shadow-sm\">\n" +
		"                  <div class=\"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none\">\n" +
		"                    <span class=\"text-gray-500 sm:text-sm\"> $ </span></div>\n" +
		"                  <input type=\"number\" id=\"amount\" name=\"amount\" min=\"0.01\" step=\"0.01\"\n" +
		"                         placeholder=\"0.00\" required\n" +
		"                         class=\"focus:ring-myGreen-500 focus:border-myGreen-500 block w-full pl-7 pr-12 text-gray-500 sm:text-sm border-gray-300 rounded-md\">\n" +
		"                  <div class=\"absolute inset-y-0 right-0 flex items-center\">\n" +
		"                    <label for=\"type\" class=\"sr-only\">Type</label>\n" +
		"                    <select id=\"type\" name=\"type\"\n" +
		"                            class=\"focus:ring-myGreen-500 focus:border-myGreen-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md\">\n" +
		"                      <option value=\"expense\" selected>Expense</option>\n" +
		"                      <option value=\"income\">Income</option>\n" +
		"                    </select>\n" +
		"                  </div>\n" +
		"                </div>\n" +
		"              </div>\n" +
		"              <br>\n" +
		"              <!-- Date -->\n" +
		"              <div>\n" +
		"                <label for=\"date\" class=\"block text-sm font-medium text-gray-700\">Date</label>\n" +
		"                <div class=\"mt-1 relative rounded-md shadow-sm\">\n" +
		"                  <input type=\"date\" id=\"date\" name=\"date\" value='" + new Date().toLocaleDateString('en-CA') + "' required\n" +
		"                         class=\"focus:ring-myGreen-500 focus:border-myGreen-500 block w-full text-gray-500 sm:text-sm border-gray-300 rounded-md\">\n" +
		"                </div>\n" +
		"              </div>\n" +
		"              <br>\n" +
		"              <!-- Note -->\n" +
		"              <div>\n" +
		"                <label for=\"note\" class=\"block text-sm font-medium text-gray-700\">Note</label>\n" +
		"                <div class=\"mt-1 relative rounded-md shadow-sm\">\n" +
		"                  <input type=\"text\" id=\"note\" name=\"note\" placeholder=\"optional\"\n" +
		"                            class=\"focus:ring-myGreen-500 focus:border-myGreen-500 block w-full text-gray-500\n" +
		"                  sm:text-sm border-gray-300 rounded-md\">\n" +
		"                </div>\n" +
		"              </div>\n" +
		"            </div>\n" +
		"          </div>\n" +
		"        </div>\n" +
		"      </div>\n" +
		"      <div class=\"bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse\">\n" +
		"        <button type=\"submit\"\n" +
		"                class=\"w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-myGreen-600 text-base font-medium text-white hover:bg-myGreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myGreen-500 sm:ml-3 sm:w-auto sm:text-sm\">\n" +
		"          Add Item\n" +
		"        </button>\n" +
		"        <button type=\"button\" onclick=\"document.body.removeChild(document.getElementById('overlayAdd'))\"\n" +
		"                class=\"mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myGreen-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm\">\n" +
		"          Cancel\n" +
		"        </button>\n" +
		"      </div>\n" +
		"    </form>\n" +
		"  </div>\n"
	document.body.appendChild(div)
}

async function deleteItem(id) {
	await fetch('/delete', {
		method: 'Post',
		body: JSON.stringify({'id': id}),
		headers: {
			"Content-Type": "application/json"
		}
	}).then(window.location.href = '/')
}

function editItem(id, date, isIn, amount, note) {
	let div = document.createElement('div')
	div.setAttribute('id', 'overlayEdit');
	div.setAttribute('class', 'fixed z-10 inset-0 overflow-y-auto');
	div.setAttribute('aria-labelledby', 'modal-title');
	div.setAttribute('role', 'dialog');
	div.setAttribute('aria-modal', 'true');
	let innerHTML =
		"  <div class=\"flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0\">\n" +
		"    <div class=\"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity\" aria-hidden=\"true\"></div>\n" +
		"    <span class=\"hidden sm:inline-block sm:align-middle sm:h-screen\" aria-hidden=\"true\">&#8203;</span>\n" +
		"    <form action=\"/update\" method=\"post\"\n" +
		"          class=\"inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full\">\n" +
		"      <div class=\"bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4\">\n" +
		"        <div>\n" +
		"          <div class=\"mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10\">\n" +
		"            <!-- Heroicon name: outline/pencil-alt -->\n" +
		"            <svg class=\"h-6 w-6 text-yellow-600\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\"\n" +
		"                 viewBox=\"0 0 24 24\" stroke=\"currentColor\" aria-hidden=\"true\">\n" +
		"              <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z\" />\n" +
		"            </svg>\n" +
		"          </div>\n" +
		"          <div class=\"mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left\">\n" +
		"            <h3 class=\"text-lg leading-6 font-medium text-gray-900\" id=\"modal-title\">\n" +
		"              Edit Item</h3>\n" +
		"            <div class=\"mt-2\">\n" +
		"              <!-- Hidden ID for POST -->\n" +
		"              <input type='text' value='" + id + "' name='id' required class='hidden'>\n" +
		"              <!-- Amount and Type -->\n" +
		"              <div>\n" +
		"                <label for=\"amount\" class=\"block text-sm font-medium text-gray-700\">Amount</label>\n" +
		"                <div class=\"mt-1 relative rounded-md shadow-sm\">\n" +
		"                  <div class=\"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none\">\n" +
		"                    <span class=\"text-gray-500 sm:text-sm\"> $ </span></div>\n" +
		"                  <input type=\"number\" id=\"amount\" name=\"amount\" min=\"0.01\" step=\"0.01\"\n" +
		"                         placeholder=\"0.00\" value='" + amount / 100 + "' required\n" +
		"                         class=\"focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-7 pr-12 text-gray-500 sm:text-sm border-gray-300 rounded-md\">\n" +
		"                  <div class=\"absolute inset-y-0 right-0 flex items-center\">\n" +
		"                    <label for=\"type\" class=\"sr-only\">Type</label>\n" +
		"                    <select id=\"type\" name=\"type\"\n" +
		"                            class=\"focus:ring-yellow-500 focus:border-yellow-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md\">\n"

	if (isIn === 'true') {
		innerHTML +=
			"                      <option value=\"expense\">Expense</option>\n" +
			"                      <option value=\"income\" selected>Income</option>\n"
	} else {
		innerHTML +=
			"                      <option value=\"expense\" selected>Expense</option>\n" +
			"                      <option value=\"income\">Income</option>\n"
	}

	innerHTML +=
		"                    </select>\n" +
		"                  </div>\n" +
		"                </div>\n" +
		"              </div>\n" +
		"              <br>\n" +
		"              <!-- Date -->\n" +
		"              <div>\n" +
		"                <label for=\"date\" class=\"block text-sm font-medium text-gray-700\">Date</label>\n" +
		"                <div class=\"mt-1 relative rounded-md shadow-sm\">\n" +
		"                  <input type=\"date\" id=\"date\" name=\"date\" value='" + date + "' required\n" +
		"                         class=\"focus:ring-yellow-500 focus:border-yellow-500 block w-full text-gray-500 sm:text-sm border-gray-300 rounded-md\">\n" +
		"                </div>\n" +
		"              </div>\n" +
		"              <br>\n" +
		"              <!-- Note -->\n" +
		"              <div>\n" +
		"                <label for=\"note\" class=\"block text-sm font-medium text-gray-700\">Note</label>\n" +
		"                <div class=\"mt-1 relative rounded-md shadow-sm\">\n" +
		"                  <input type=\"text\" id=\"note\" name=\"note\" value='" + note + "' placeholder=\"optional\"\n" +
		"                            class=\"focus:ring-yellow-500 focus:border-yellow-500 block w-full text-gray-500\n" +
		"                  sm:text-sm border-gray-300 rounded-md\">\n" +
		"                </div>\n" +
		"              </div>\n" +
		"            </div>\n" +
		"          </div>\n" +
		"        </div>\n" +
		"      </div>\n" +
		"      <div class=\"bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse\">\n" +
		"        <button type=\"submit\"\n" +
		"                class=\"w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm\">\n" +
		"          Edit Item\n" +
		"        </button>\n" +
		"        <button type=\"button\" onclick=\"document.body.removeChild(document.getElementById('overlayEdit'))\"\n" +
		"                class=\"mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm\">\n" +
		"          Cancel\n" +
		"        </button>\n" +
		"        <button type=\"button\" onclick='deleteItem(\"" + id + "\")'\n" +
		"                class=\"mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm\">\n" +
		"          Delete\n" +
		"        </button>\n" +
		"      </div>\n" +
		"    </form>\n" +
		"  </div>\n"
	div.innerHTML = innerHTML
	document.body.appendChild(div)
}

function createCard(json) {
	let div = document.createElement('div')
	div.setAttribute('class', 'max-w-7xl mx-auto pt-12 sm:px-6 lg:px-8');
	let list = ""
	let color = false

	// Insert list items
	json.transactions.forEach(transaction => {

		// Change color for alternating rows
		if (color) list += "<div class='bg-white"
		else list += "<div class='bg-gray-50"
		color = !color

		list += " px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'> <dt class='text-base font-medium "
		// Change color for type
		if (transaction.isIn) list += "text-myGreen-500'> "
		else list += "text-yellow-500'> "
		list += "<div class='w-0 flex-1 flex items-center'> " +
			"<svg class='flex-shrink-0 h-4 w-4 "
		// Change color for type
		if (transaction.isIn) list += "text-myGreen-500' "
		else list += "text-yellow-500' "
		list += "xmlns='http://www.w3.org/2000/svg' fill='currentColor' " +
			"aria-hidden='true' viewBox='0 0 18 18' x-description='Heroicon name: solid/"

		// Change svg for type
		if (transaction.isIn) {
			list += "plus-sm'> " +
				"<path fill-rule='evenodd' " +
				"d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z' " +
				"clip-rule='evenodd'/> </svg> "
		} else {
			list += "minus-sm'> " +
				"<path fill-rule='evenodd' " +
				"d='M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z' " +
				"clip-rule='evenodd'/> </svg> "
		}

		// Insert amount
		list += "<div> $" + transaction.amount / 100 + " </div> </div> </dt> " +
			"<dd class='mt-1 text-sm "
		// Change color for type
		if (transaction.isIn) list += "text-myGreen-600"
		else list += "text-yellow-500"
		list += " sm:mt-0 sm:col-span-2'> " +
			"<div class='flex items-center justify-between text-sm'> " +
			"<div class='w-0 flex-1 flex items-center'> " +
			"<span class='flex-1 w-0'>"

		// Insert Note
		list += transaction.note

		list += `</span> </div> <div class='ml-4 flex-shrink-0'>
			<button class='font-medium `
		// Change color for type
		if (transaction.isIn) list += `text-myGreen-600 hover:text-myGreen-700' `
		else list += `text-yellow-500 hover:text-yellow-600' `
		list += `onclick="editItem('${transaction.id}', '${transaction.date}', '${transaction.isIn}', '${transaction.amount}', '${transaction.note}')"> Edit </button> </div> </div> </dd> </div>`
	})

	div.innerHTML = "<div class='max-w-4xl mx-auto'> " +
		"<div class='bg-white shadow overflow-hidden sm:rounded-lg'> " +
		"<div class='px-4 py-5 sm:px-6'> " +
		"<h3 class='text-lg leading-6 font-medium text-gray-900'> " +
		new Date(Date.parse(json.date)).toDateString() +
		" </h3> <p class='mt-1 max-w-2xl text-sm text-gray-500'> Income: $" +
		(json.I / 100).toFixed(2) + ", Expenses: $" + (json.O / 100).toFixed(2) +
		" </p> </div> <div class='border-t border-gray-200'> <dl> " +
		list + "</dl> </div> </div> </div>"
	document.body.insertBefore(div, document.getElementById('foot'))
}
