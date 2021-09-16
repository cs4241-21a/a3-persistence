const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = []

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {

    let parsedInput = JSON.parse(dataString)

    //if portion runs if we're trying to get rid of one of the assignments
    if(Object.keys(parsedInput).length === 1){
      let assignmentToRemove = parsedInput.removeAssignment;
      appdata.splice(assignmentToRemove, 1);
    } 
    //else we're trying to add a new assignment to the table
    else{
      //time manipulation
      let providedDuedate = new Date(parsedInput.dueDate);
      let today = new Date();
      let diffTime = providedDuedate-today;
      let diffDays = Math.ceil(diffTime / (1000*60*60*24)) - 1;

      parsedInput["daysLeft"] = diffDays;

      appdata.push(parsedInput)
    }

    console.log(appdata)

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(appdata))
    response.end()
  })
}

const sendFile = function( response, filename ) {
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

server.listen( process.env.PORT || port )
