const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let appdata = [
  
]

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
    
     dataObj = JSON.parse(dataString)

    if(dataObj.id >= appdata.length){
      response.writeHead( 200, "Id not found", {'appdata': appdata })
      response.end(JSON.stringify([JSON.stringify({name: "na", chore: "na" , complete:"na", load:-1, id:0})]))//this indicates a failure to parse
    }
      else{
      if(dataObj.id == -1){ //indicates add
        dataObj.id = appdata.length
        appdata.push(JSON.stringify(dataObj))
      }
      else if(dataObj.load == -1) //indicates deletion
      {
        
        
        newappdata = []
        for(let i = 0; i < dataObj.id; i++){
          newappdata.push(appdata[i])
          
        }
        
        for(let j = (dataObj.id+1); j < appdata.length; j++){
          
            let aline = JSON.parse(appdata[j])
            aline.id = aline.id - 1

            newappdata.push(JSON.stringify(aline))
        }
      
        appdata = newappdata
      }
      else{ // indicates modify
        appdata[dataObj.id] = dataString
      }

      //load re-calculation
      let sortnames = []
      
      for (let i = 0; i < appdata.length; i++){//start with sorted list of names
        let aline = JSON.parse(appdata[i])
        sortnames.push(aline.name)
      }
      sortnames.sort()
      let allnames = []
      let namescount = []
      let lastname = sortnames[0]
      allnames.push(sortnames[0])
      namescount.push(1)
      let countindex = 0;
      for (let i = 1; i < sortnames.length; i++){//get counts
        if(!(lastname === sortnames[i])){
          allnames.push(sortnames[i])
          namescount.push(1)
          lastname = sortnames[i]
          countindex++
        }
        else{
          namescount[countindex] =  namescount[countindex] + 1
        }
      }

    

      for (let i = 0; i < appdata.length; i++){
        let aline = JSON.parse(appdata[i])

        aline.load = namescount[(allnames.indexOf(aline.name))]

        appdata[i] = JSON.stringify(aline)
      }

      response.writeHead( 200, "OK", {'appdata': appdata })
      response.end(JSON.stringify(appdata))
    }
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
