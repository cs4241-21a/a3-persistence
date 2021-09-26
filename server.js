const express = require( 'express' ),
      cookie = require('cookie-session'),
      cookieparser = require('cookie-parser'),
      app = express(),
      mongodb = require('mongodb'),
      bodyparser = require('body-parser'),
      env = require('dotenv').config(),
      favicon = require('serve-favicon')
      /*
      middleware used:
      cookie-session
      cookie-parser
      redirect users (custom made)
      body-parser
      serve-favicon
      */


const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
console.log(uri)
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

app.use( express.urlencoded({ extended:true }) )
app.use( bodyparser.json() )
app.use(cookieparser())

app.use(cookie({
  name: 'session',
  keys: ['OEF9GeGgAd0G', 'LQR7wKtsRx1y']
}))

app.post('/register', (req, res)=> {
  let collection = client.db('Accounts').collection('UserPass')
  collection.findOne({username: req.body.username}).then((item) => {
    if (item==null) {
      const newAcc = {
        'username': req.body.username, 
        'password': req.body.password
      };
      collection.insertOne(newAcc).then(()=> {
        req.session.login=true;
        res.cookie('username', req.body.username)
        res.redirect('index.html');
      });
    }
    else {
      res.sendFile(__dirname+'/public/createAccount.html')
    }
  })
})

app.post( '/login', (req,res)=> {
  let userAcc = {'username': req.body.username, 'password': req.body.password};
  client.db('Accounts').collection('UserPass').findOne(userAcc).then( (foundData) => {
    if( foundData !== null ) {
      req.session.login = true;
      res.cookie('username', req.body.username)
      res.redirect('index.html')
    }else{
      res.sendFile( __dirname + '/public/accountLoginFail.html' )
    }
  })})

app.post('/submitData', (req,res)=> {
  req.body.poster = req.cookies.username
  client.db('ImageData').collection('Posts').insertOne(req.body)
  res.sendStatus(200)
})

app.post('/deleteItem', (req,res)=> {
  client.db('ImageData').collection('Posts').deleteOne({ _id:mongodb.ObjectId( req.body._id ) })
  res.sendStatus(200)
})

app.post('/editData', (req,res)=> {
  client.db('ImageData').collection('Posts').updateOne({'_id': mongodb.ObjectId(req.body.id)}, {$set: {'title': req.body.title, 'description': req.body.description}}, (err, resp) => {
    if (err) {
      res.sendStatus(500)
    }
    else {
      res.redirect('myProfile.html')
    }
  })
})

app.get('/profileData', (req,res) => {
  client.db('ImageData').collection('Posts').find({$text:{$search:req.cookies.username}}).toArray((err, result)=> {
    res.send(result)
  })
})

app.get('/imageData', (req,res) => {
  client.db('ImageData').collection('Posts').find({}).toArray((err, result)=> {
    res.send(result)
  })
})

//redirects unauthenticated users
app.use(function(req,res,next) {
  if( req.session.login === true || req.originalUrl === '/createAccount.html' || req.originalUrl.includes('.css') || req.originalUrl === '/accountLoginFail.html' || req.originalUrl === '/favicon.ico')
    next()
  else
    res.sendFile(__dirname+'/public/accountLogin.html')
})

app.use(express.static('./public/'))
//made icon at https://favicon.io/
app.use(favicon(__dirname+'/public/favicon.ico'))

app.listen( process.env.PORT || 3000)