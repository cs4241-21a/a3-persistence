const http = require('http')
const fs = require('fs')
const mime = require('mime')

const DIR = 'public/'
const PORT = 3000

const scores = {'Liam': 26}

const server = http.createServer(function(request, response) {
  if (request.method === 'GET') {
    handleGet(request, response)    
  } else if (request.method === 'POST'){
    handlePost(request, response) 
  }
})

const handleGet = function(request, response) {
  const filename = DIR + request.url.slice(1) 

  if (request.url === '/') {
    sendFile(response, 'public/index.html')
  } else if (request.url === '/scores') {
    response.writeHead(200, "OK", {'Content-Type': 'application/json' })
    response.end(JSON.stringify(scores))
  } else if (request.url !== '/?') {
    sendFile(response, filename)
  }
}

const handlePost = function(request, response) {
  let dataString = ''

  request.on('data', function(data) {
    dataString += data 
  })

  request.on('end', function() {
    let data = JSON.parse(dataString)

    if (scores[data.username]) {
      scores[data.username] += data.score
    } else {
      scores[data.username] = data.score
    }

    response.writeHead(200, "OK", {'Content-Type': 'application/json' })
    response.end(JSON.stringify(scores))
  })
}

const sendFile = function(response, filename) {
  const type = mime.getType(filename) 
  fs.readFile(filename, function(err, content) {
    if (err === null) {
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content)
    } else {
      response.writeHeader(404)
      response.end('404 Error: File Not Found')
    }
  })
}

server.listen(process.env.PORT || PORT)
