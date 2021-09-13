const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [];
const faces = ["(・`ω´・)",";;w;;","owo","UwU",">w<","^w^","(･.◤)","^̮^","(>人<)","( ﾟヮﾟ)","(▰˘◡˘▰)"]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 
  console.log(filename);

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else if(request.url === '/getAppdata') {
    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' });
    response.end(JSON.stringify(appdata));
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
    let jsonData = JSON.parse(dataString);
    //console.log(jsonData)
    let obj = {
      name: jsonData.name,
      message: jsonData.message,
      nameowo: owoify(jsonData.name),
      messageowo: owoify(jsonData.message)
    }
    appdata.push(obj);


    response.writeHead( 200, "OK", { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify(obj));
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

server.listen( process.env.PORT || port )
