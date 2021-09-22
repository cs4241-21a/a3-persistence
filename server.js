const express    = require('express'),
      mongodb    = require( 'mongodb' ),
      app        = express(),
      bodyparser = require( 'body-parser' ),
      cookie     = require('cookie-session'),
      helmet     = require('helmet'),
      favicon    = require('serve-favicon')
      dreams     = []

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use(express.static( 'public' ) )
app.use(express.urlencoded({ extended: true }))
app.use(helmet());
app.use(favicon(__dirname + '/public/img/favicon.ico'))

// get json when appropriate
app.use( bodyparser.json() )

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2'],
}))


const uri = 'mongodb+srv://a3-user:cs4241@a3-persistence-trbouwen.ley0q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let credentials = null
let user_data = null

let current_user = ""

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'a3-persistence-trbouwens' ).collection( 'credentials' )
  })
  .then( __collection => {
    // store reference to collection
    credentials = __collection
  });

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'a3-persistence-trbouwens' ).collection( 'roll_data' )
  })
  .then( __collection => {
    // store reference to collection
    user_data = __collection
  });

const rollDice = function(type, quantity, mod) {
  let totalRoll = 0;

  for (let i = 0; i < parseInt(quantity, 10); i++) {
    let baseRoll = Math.floor(Math.random() * parseInt(type, 10));
    totalRoll += baseRoll + 1;
  }
  return totalRoll + parseInt(mod, 10);
};

// even with our static file handler, we still
// need to explicitly handle the domain name alone...
app.get('/', function(request, response) {
  console.log("loading index...")
  response.sendFile( __dirname + '/public/index.html' )
})

app.post( '/submit', function( request, response ) {
  credentials
  dreams.push( request.body.newdream )
  // response.setHeader("Content-Type", "text/html")
  let body = request.body

  console.log(body)

  credentials.find(body).toArray().then(function(creds) {

    if(creds.length > 0) {
      console.log("Login Success")

      current_user = body.user
      request.session.login = true
      request.session.user = body.user

      response.redirect('/table.html')
      console.log(creds)
    }
    else {
      console.log("Login Failure")
      credentials.find({user: body.user}).toArray().then(function(creds) {
        console.log(creds)
        if(creds.length > 0) { // password incorrect
          response.send("Invalid Login!")
        }
        else { // Make new User
          console.log("Login Success")
          addCreds(body)

          current_user = body.user
          request.session.login = true
          request.session.user = body.user

          response.redirect('/table.html')
          console.log(creds)
        }
      });
    }
  });
})

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  data = req.body
  j_index = {index_user: req.session.user}

  console.log(j_index)
  user_data.find(j_index).toArray().then(function(out) {
    return out[0]
  }).then(function(i) {

    index = parseInt(i.index)
    id = i._id

    let thisRoll = rollDice(data.diceType, data.quantity, data.modifier);

    let json = {
      user: current_user,
      id: index,
      character: data.character,
      diceType: data.diceType,
      quantity: data.quantity,
      modifier: data.modifier,
      roll: thisRoll
    };

    console.log(json)

    user_data.insertOne( json ).then(result => sendTable(res, result))
    user_data.updateOne(
      { _id:mongodb.ObjectId( id ) },
      { $set:{ index: index+1 } }
    )
  });
})

app.post('/delete', (req,res) => {
  data = req.body
  console.log("DELETE")
  console.log(data)

  if(data.id !== '') {
    id_int = parseInt(data.id)
    user_data.find({user: current_user, id: id_int}).toArray().then(function(data) {
      deleteList(res, data)
      sendTable(res)
    });
  }
  else if(data.character !== '') {
    user_data.find({user: current_user, character: data.character}).toArray().then(function(data) {
      deleteList(res, data)
      sendTable(res)
    });
  }
  else {
    // fail
  }
})

app.post('/getedit', (req,res) => {
  editData = req.body
  console.log("FETCH FOR EDIT")
  console.log(req.body)

  j_index = {
    id: parseInt(req.body.id),
    user: req.session.user
  }

  // console.log(j_index)

  user_data.find(j_index).toArray().then(function(out) {
    if(out.length === 1) {
      // console.log(out[0]);
      j_out = {
        character: out[0].character,
        diceType: out[0].diceType,
        quantity: out[0].quantity,
        modifier: out[0].modifier
      }

      outBody = JSON.stringify(j_out)
      res.send(outBody)
    }
  });
});

app.post('/editroll', (req,res) => {
  editData = req.body

  j_index = {
    id: parseInt(editData.id),
    user: req.session.user
  }

  console.log("TO EDIT:")
  console.log(j_index)

  user_data.find(j_index).toArray().then(function(out) {
    id = out[0]._id

    let newRoll = rollDice(editData.diceType, editData.quantity, editData.modifier);

    console.log(id + " / " + newRoll)

    user_data.updateOne(
      { _id:mongodb.ObjectId( id ) },
      { $set:{
        character: editData.character,
        diceType: editData.diceType,
        quantity: editData.quantity,
        modifier: editData.modifier,
        roll: newRoll
      }
    }).then(function() {
      sendTable(res)
    })
  });
});

app.get('/load', (req,res) => {
  current_user = req.session.user
  console.log("Login: " + current_user + " " + req.session.login)

  if (req.session.login !== true && req.path !== '/') {
    console.log("redirecting...")
    return res.redirect('/');
  }
  else {
    sendTable(res)
  }
})

app.get('/logout', (req,res) => {
  console.log("Logging out user: " + current_user)
  req.session.user = null
  req.session.login = false

  return res.redirect('/');
})

app.get('/clear', (req,res) => {
  console.log("Clearing Data...")
  user_data.find({user: current_user}).toArray().then(function(data) {
    deleteList(res, data)
    sendTable(res)
  });
})

const sendTable = function(response, result) {
    json = {
      nRows: 0,
      rowData: []
    }

    user_data.find({user: current_user}).toArray().then(function(data) {
      // console.log(data)

      json.rowData = data
      json.nRows = data.length

      body = JSON.stringify(json)

      response.send( body )
    })
}

const deleteList = function(res, list) {
  for(let i = 0; i < list.length; i++) {
    user_data.deleteOne({_id:mongodb.ObjectId(list[i]._id)})
    // .then( result => res.json( result ) )
  }
}

const addCreds = function(creds) {
  credentials.insertOne( creds )
  user_data.insertOne( {index_user: creds.user, index: 0} )
}

app.listen( process.env.PORT || 3000 )
