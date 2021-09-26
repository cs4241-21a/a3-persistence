const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const {v4 : uuidv4} = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let db = [
    { id: '7f5e96c8-bfa4-4d8c-947b-b947fde9c16a', 'flightNum': "AA001", 'depAirport': "JFK", 'arrAirport': "WOR", 'date':"2021-9-9"},
    { id: 'f712dbac-99eb-41b6-aaba-c114ebb41cbb', 'flightNum': "AA001", 'depAirport': "JFK", 'arrAirport': "WOR", 'date':"2021-9-20"},
    { id: 'a532b2e6-a97a-4168-a2f7-ccbaea3e1c96', 'flightNum': "AA001", 'depAirport': "JFK", 'arrAirport': "WOR", 'date':"2021-9-8"},
    { id: 'bbbaab13-b910-4f16-99f7-40d08067b98b', 'flightNum': "AA001", 'depAirport': "JFK", 'arrAirport': "WOR", 'date':"2021-9-5"},

];

app.get('/getUpcoming', function (req, res) {
    res.json(db.filter((item) => new Date(item.date).valueOf() >= new Date().valueOf()));
});

app.get('/getPast', function (req, res) {
    res.json(db.filter((item) => new Date(item.date).valueOf() < new Date().valueOf()));
});

app.post('/add', function (req, res) {
    req.body.id = uuidv4();
    db.push(req.body);
    res.json({code: 200, msg: 'success'});
});

app.post('/del', function (req, res) {
    db = db.filter((item) => item.id !== req.body.id);
    res.json({code: 200, msg: 'success'});
});

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Listening at ${port}`)
});