const express = require('express'),
      mongodb = require('mongodb'),
      serveStatic = require('serve-static'),
      bodyParser = require('body-parser')
      app = express(),
      dir  = 'public/',
      port = 3000

require('dotenv').config();

const appdata = [{"name":"admin","message":"this is dummy appdata","nameowo":owoify("admin"),"messageowo":owoify("this is dummy appdata")}];
const faces = ["(・`ω´・)",";;w;;","owo","UwU",">w<","^w^","(･.◤)","^̮^","(>人<)","( ﾟヮﾟ)","(▰˘◡˘▰)"]

app.use(serveStatic('public'))

app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/public/index.html`)
});

app.get('/getAppdata', function(req, res) {
  console.log("getappdata req")
  res.send(JSON.stringify(appdata))
});

app.post('/submit', bodyParser.json(), function(req, res) {
  let obj = {
    name: req.body.name,
    message: req.body.message,
    nameowo: owoify(req.body.name),
    messageowo: owoify(req.body.message)
  }
  appdata.push(obj);
  res.send(JSON.stringify(obj))
});

function owoify(text) {
  //console.log(text)
  let v = text.replace(/[lr]/g, 'w').replace(/[LR]/g, 'W').replace(/n[aeiou]/g, 'ny').replace(/N[aeiou]/g, 'Ny').replace(/N[AEIOU]/g, 'NY');
  let numExclaimations = (v.match(/!/g)||[]).length;
  for(let i = 0; i < numExclaimations; i++) {
    v = v.replace('!'," " + faces[getRandomInt(0, faces.length)] + " ");
  }
  return v;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

app.listen(process.env.PORT || port)
