const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      hwAPIPath = "/homework",
      port = 80

// Key is corresponding to submission date (really just for uniqueness, doesn't matter for the preset values like this)
const homeworkData = {
  "0": { name: "a2-shortstack", priority: "High", course: "Webware", dueDate:'2021-09-09T11:59:00-0400', subDate: "0",},
  "1": { name: "CSS Grid Garden", priority: "High", course: "Webware", dueDate:'2021-09-09T11:59:00-0400', subDate: "1",},
  "2": { name: "Project 2", priority: "Low", course: "Mobile Computing", dueDate:'2021-09-17T23:59:00-0400', subDate: "2",},
}

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )
  }else if( request.method === 'POST' ){
    handlePostPut( request, response ) 
  }else if( request.method === 'PUT'){
    handlePostPut(request, response)
  }else if( request.method === 'DELETE'){
    handleDelete(request, response)
  }
})

const handleGet = function( request, response ) {
  const filename = request.url.slice( 1 ) 

  // If the homework data is requested, send it
  if(request.url === hwAPIPath) {
    response.writeHeader(200, "OK", {"Content-Type": "application/json"})
    response.end(JSON.stringify(homeworkData))
  }
  // If a blank root path is given, display the home page
  else if( request.url === '/' ) {
    sendFile( response, 'index.html' )
  }
  // Give any public file
  else{
    sendFile( response, filename )
  }
}


const sendFile = function( response, filename ) {
  filename = dir + filename
  const type = mime.getType( filename ) 
  
  fs.readFile( filename, function( err, content ) {

    // if the error = null, then we've loaded the file successfully
    if( err === null ) {
      // status code: https://httpstatuses.com
      response.writeHeader( 200, { 'Content-Type': type })
      response.end( content )
    }else{
      // file not found, error code 404
      response.writeHeader( 404 )
      response.end( '404 Error: File Not Found' )
    }
  })
}

const handlePostPut = function( request, response ) {
  // Add to the homework data if it is requested
  if(request.url === hwAPIPath) {
    let dataString = ''

    // Continue growing the JSON data that is being received before it can be parsed
    request.on( 'data', function( data ) {
        dataString += data 
    })
  
    // Message has been completely received, now parse the JSON in its entirety
    request.on( 'end', function() {
      let hwData = JSON.parse(dataString)
      console.log(hwData)
  
      // Calculate priority based on given submission time and deadline
      const dueDate = new Date(hwData.dueDate)
      const subDate = new Date(hwData.subDate)
      const dayDiff = Math.floor((dueDate - subDate) / 86400000)

      const priorityLevels = [
        [1, "High"],    // One day ==> High
        [3, "Medium"],  // Three days ==> Medium
        [null, "Low"],  // Otherwise == Low
      ]

      // If difference of time is less or equal to whichever priority level, then assign it
      for(priorityTimePair of priorityLevels) {
        const priorityTime = priorityTimePair[0]
        const priorityLevel = priorityTimePair[1]
        if(priorityTime === null || dayDiff <= priorityTime) {
          hwData.priority = priorityLevel
          break
        }
      }
  
      // Add to internal server data, using the submission date as the key (for uniqueness)
      homeworkData[hwData.subDate] = hwData

      console.log(homeworkData)

      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end(JSON.stringify(hwData))
    }) 
  }
}

const handleDelete = function( request, response ) {
  // Delete homework data if it is requested
  if(request.url === hwAPIPath) {
    let dataString = ''

    request.on( 'data', function( data ) {
        dataString += data 
    })

    request.on( 'end', function() {
      let hwData = JSON.parse(dataString)
      console.log( hwData )

      delete homeworkData[hwData.subDate]

      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end()
    })
  }
}


server.listen( process.env.PORT || port )
