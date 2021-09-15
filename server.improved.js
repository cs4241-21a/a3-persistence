let count = 0;

const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000


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

    count = count + 1;

    const json = JSON.parse(dataString);

    // Here, we add the calculated price per person and add it to the json element to 
    // be sent back to the client

    let last_json_item = json[json.length - 1];

    let num_of_people = parseFloat(last_json_item.num_of_people.replace(",", ""));
    let amount_due = parseFloat(last_json_item.amount_due.replace("$","").replace(",", ""));
    let tip = parseFloat(last_json_item.tip.replace("$","").replace(",", ""));

    let price_per_person = (amount_due + tip) / num_of_people;

    json[json.length - 1]['price_per_person'] = "$" + price_per_person.toFixed(2).toString();
    json[json.length - 1]['id'] = count.toString();

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(json))
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
