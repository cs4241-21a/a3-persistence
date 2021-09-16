let budget = 0;
let totalIn = 0;
let totalOut = 0;

window.onload = function () {
	document.getElementById('submitBudget').onclick = submitBudget
	document.getElementById('submitEntry').onclick = submitEntry
	document.getElementById('date').value = new Date().toLocaleDateString('en-CA')
	refreshData()
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