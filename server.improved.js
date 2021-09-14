const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = {
  foundItems: [
    {
      'item': 'AirPods',
      'when': '10/01/2021',
      'where': 'FH 311',
      'description': 'Red case',
      'photo': 'https://apple.com',
      'emailme': 'john',
      'uid': 'ApplePen09012021FH311foundItems1631163168733',
      'timestamp': 1631163168733
    }
  ],
  lostItems: [
    {
      'item': 'Apple Pen',
      'when': '09/01/2021',
      'where': 'FH 311',
      'description': 'White, pen, red cap, Apple original',
      'photo': 'https://google.com',
      'emailme': 'federico',
      'uid': 'ApplePen09012021FH311lostItems1631163183361',
      'timestamp': 1631163183361
    }
  ],
  users: {
    'federico' : {'password': 'abc123'},
    'john' : {'password': 'aaa111'},
    'amanda' : {'password': 'ab24'},
    'sophia' : {'password': 'asdasd5'}
  },
  find: function(uid) {
    let res = this.lostItems.findIndex( e => e.uid === uid)
    if (res >= 0) { return { 'table': 'lostItems', 'idx': res } }
    res = this.foundItems.findIndex( e => e.uid === uid)
    if (res >= 0) { return { 'table': 'foundItems', 'idx': res } }
    else { return undefined }
  }
}

const server = http.createServer( function( request,response ) {
  if ( request.method === 'GET' ) {
    handleGet( request, response )    
  } else if ( request.method === 'POST' ) {
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  } else if ( request.url === '/api/lostitems') {
    sendData(response, appdata.lostItems)
  } else if ( request.url === '/api/founditems') {
    sendData(response, appdata.foundItems)
  } else {
    sendFile( response, filename )
  }
}

const login = function ( credentials ) {
  if (credentials.username in appdata.users) {
    let password = appdata.users[credentials.username].password
    if (credentials.password === password) {
      return true
    }
  }
  return false
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    let data = JSON.parse( dataString )
    if (request.url === '/api/login') {
      handleLogin(data, response)
    } else if (request.url === '/api/create') {
      handleCreate(data, response)
    } else if (request.url === '/api/delete') {
      handleDelete(data, response)
    } else if (request.url === '/api/update') {
      handleEdit(data, response)
    } else {
      response.writeHead( 404, "Invalid API endpoint", {'Content-Type': 'text/plain' })
      response.end()  
    }
  })
}

const handleEdit = (data, response) => {
  console.log(data)
  let dt = appdata.find(data.uid)
  if (dt === undefined) {
    response.writeHead( 404, "Invalid UID", {'Content-Type': 'text/plain' })
    response.end()  
  } else {
    appdata[dt.table][dt.idx].item = data.item
    appdata[dt.table][dt.idx].when = data.when
    appdata[dt.table][dt.idx].where = data.where
    appdata[dt.table][dt.idx].description = data.description
    appdata[dt.table][dt.idx].photo = data.photo
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end()  
  }
}

const handleLogin = (data, response) => {
  if (login(data)) {
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end()    
  } else {
    response.writeHead( 403, "Invalid login", {'Content-Type': 'text/plain' })
    response.end()  
  }
}

const handleCreate = (data, response) => {
  let filtered = {
    'item' : data.item,
    'when' : data.when,
    'where' : data.where,
    'description' : data.description,
    'photo' : data.photo,
    'emailme' : data.emailme,
    'timestamp' : Date.now()
  }
  if (data.lost === true) {
    collection = "lostItems"
  } else if (data.found === true) {
    collection = "foundItems"
  }
  filtered['uid'] = (data.item + data.when + data.where + collection + Date.now()).replace(' ', '+')
  console.log("Adding to " + collection)
  appdata[collection].push(filtered)
  response.writeHeader( 200 )
  response.end()
}

const handleDelete = (data, response) => {
  for(const [idx, e] of appdata.lostItems.entries()) {
    if (e.uid === data.uid) {
      console.log("Deleting " + e.uid)
      appdata.lostItems.splice(idx, 1)
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end()    
      return
    }
  }
  for(const [idx, e] of appdata.foundItems.entries()) {
    if (e.uid === data.uid) {
      console.log("Deleting " + e.uid)
      appdata.foundItems.splice(idx, 1)
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end()    
      return
    }
  }
  response.writeHead( 404, "UID not found", {'Content-Type': 'text/plain' })
  response.end()    
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     } else {

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

const sendData = function( response, data ) {
  response.writeHeader( 200, { 'Content-Type': 'application/json' })
  for (let i = 0; i < data.length; i++) {
    let timestampDate = new Date(data[i].timestamp)
    let elapsed = ((Date.now() - timestampDate) / (24 * 60 * 60 * 1000));
    data[i].created = Math.round(elapsed)
  }
  response.end(JSON.stringify(data))
}

server.listen( process.env.PORT || port )
