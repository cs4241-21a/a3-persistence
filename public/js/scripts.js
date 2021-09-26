let budget = 0;
let totalIn = 0;
let totalOut = 0;

window.onload = function () {
	document.getElementById('submitBudget').onclick = submitBudget
	document.getElementById('submitEntry').onclick = submitEntry
	document.getElementById('date').value = new Date().toLocaleDateString('en-CA')
	refreshData()
	fetch('/read', {
		method: 'GET',
		headers: {
			"Content-Type": "application/json"
		}
	}).then(res => {
		return res.json()
	}).then(res => {
		res.forEach(day => createCard(day))
	})
}
function convertDate(date) {return new Date(Date.parse(date)).toDateString()}

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

		list += " px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'> <dt class='text-base font-medium text-gray-500'> " +
			"<div class='w-0 flex-1 flex items-center'> " +
			"<svg class='flex-shrink-0 h-5 w-5 text-gray-400' " +
			"xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' " +
			"aria-hidden='true' x-description='Heroicon name: solid/"

		// Change svg for amount
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
			"<dd class='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'> " +
			"<li class='flex items-center justify-between text-sm'> " +
			"<div class='w-0 flex-1 flex items-center'> " +
			"<span class='flex-1 w-0'>"

		// Insert Note
		list += transaction.note

		list += "</span> </div> <div class='ml-4 flex-shrink-0'> " +
			"<button class='font-medium text-myGreen-600 hover:text-myGreen-500' " +
			"onclick=editItem(" + transaction._id + ", " + transaction.isIn + ", " + transaction.amount + ", " + transaction.note + ")> Edit </button> </div> </li> </dd> </div>"
	})

	let innerHTML = "<div class='max-w-4xl mx-auto'> " +
		"<div class='bg-white shadow overflow-hidden sm:rounded-lg'> " +
		"<div class='px-4 py-5 sm:px-6'> " +
		"<h3 class='text-lg leading-6 font-medium text-gray-900'> " +
		convertDate(json.date) +
		" </h3> <p class='mt-1 max-w-2xl text-sm text-gray-500'> Income: $" +
		json.I / 100 + ", Expenses: $" + json.O / 100 +
		" </p> </div> <div class='border-t border-gray-200'> <dl> " +
		list + "</dl> </div> </div> </div>"
	div.innerHTML = innerHTML
	document.body.insertBefore(div, document.getElementById('foot'))
}

const submitEntry = function (e) {
	e.preventDefault()

	const type = document.getElementById('type'),
		date = document.getElementById('date'),
		amount = document.getElementById('amount'),
		category = document.getElementById('category'),
		json = {type: type.value, date: date.value, amount: amount.value, category: category.value},
		body = JSON.stringify(json)

	amount.value = 0

	fetch('/submit', {
		method: 'POST',
		body
	})
		.then(response => response.json())
		.then(function (json) {
			// Removes all old data
			document.querySelectorAll(".item").forEach(each => each.remove());

			// Add new data
			console.log(json)
			getData(json)
		})

	return false
}

const submitBudget = function (e) {
	e.preventDefault()

	const json = {type: "budget", budget: +document.getElementById('budgetNew').value},
		body = JSON.stringify(json)

	refreshBudget(body)

	return false
}

const refreshBudget = function (body) {
	fetch('/submit', {
		method: 'POST',
		body
	})
		.then(response => response.json())
		.then(function (json) {
			console.log(json)

			if (json == null) budget = 0.00
			else budget = json

			document.getElementById('budget').innerText = "Budget: $" + json
			document.getElementById('budgetNew').placeholder = json;


			if (totalOut > json) {
				alert("You are over budget!")
			}
		})

	return false
}

const refreshData = function () {

	const body = JSON.stringify({type: "getData"})

	fetch('/submit', {
		method: 'POST',
		body
	})
		.then(response => response.json())
		.then(function (json) {
			console.log(json)
			getData(json)
		})

	return false
}

function getData(json) {
	totalIn = 0;
	totalOut = 0;

	json.forEach(eachDay => {
		const cardHolder = document.createElement('div')
		cardHolder.className += "cardHolder item"

		const card = document.createElement('div')
		card.className += "card"

		const dayHolder = document.createElement('div')
		if (eachDay.I === eachDay.O) {
			dayHolder.className += "dayHolder"
		} else if (eachDay.I > eachDay.O) {
			dayHolder.className += "dayHolder win"
		} else dayHolder.className += "dayHolder lose"

		const day = document.createElement('p')
		day.className += "day"

		const b = document.createElement('b')
		b.innerText = eachDay.date

		const IO = document.createElement('p')
		IO.innerText = "In: $" + (+eachDay.I).toFixed(2) + " Out: $" + (+eachDay.O).toFixed(2)

		dayHolder.appendChild(document.createElement('br'))
		day.appendChild(b)
		dayHolder.appendChild(day)
		dayHolder.appendChild(IO)
		dayHolder.appendChild(document.createElement('br'))
		card.appendChild(dayHolder)

		eachDay.transactions.forEach(eachTransaction => {

			const detailHolder = document.createElement('div')
			detailHolder.className += "detailHolder"

			const catagory = document.createElement('p')
			catagory.innerText = eachTransaction.category

			const amount = document.createElement('p')
			if (eachTransaction.isIn) {
				amount.innerText = "+" + eachTransaction.amount
				totalIn += +(+eachTransaction.amount).toFixed(2)
			} else {
				amount.innerText = "-" + eachTransaction.amount
				totalOut += +(+eachTransaction.amount).toFixed(2)
			}

			detailHolder.appendChild(catagory)
			detailHolder.appendChild(amount)
			card.appendChild(detailHolder)
		})
		cardHolder.appendChild(card)
		document.body.appendChild(cardHolder)
	})

	document.getElementById('totalIn').innerText = "Total Income: $" + totalIn.toFixed(2)
	document.getElementById('totalOut').innerText = "Total Expense: $" + totalOut.toFixed(2)

	refreshBudget(JSON.stringify({type: "getBudget"}))
}