const http = require( 'http' ),
    fs   = require( 'fs' ),
    mime = require( 'mime' ),
    dir  = 'public/',
    port = 3000

const appdata = [
    {'yourname': 'Greg', 'score': 745, 'rank': 1},
    {'yourname': 'Mark', 'score': 687, 'rank': 2},
    {'yourname': 'Liam', 'score': 590, 'rank': 3}
]

const server = http.createServer( function( request,response ) {
    if( request.method === 'GET' ) {
        handleGet( request, response )
    }else if( request.method === 'POST' ){
        handlePost( request, response )
    }
})

function sendAppData(response, data){
    const type = mime.getType(appdata);
    response.writeHead(200,{'Content-Type': type});
    response.write(JSON.stringify(data));
    response.end();
}

const handleGet = function( request, response ) {
    const filename = dir + request.url.slice(1)

    if (request.url === '/') {
        sendFile(response, 'public/index.html')
    } else if (request.url === '/updatePage'){
        sendAppData(response, appdata);
    } else{
        sendFile( response, filename )
    }
}

const handlePost = function( request, response ) {
    let dataString = ''

    request.on( 'data', function( data ) {
        dataString += data
    })

    request.on( 'end', function() {
        const json = JSON.parse(dataString)
        // ... do something with the data here!!!
        if(request.url === '/submit') {
            addRow(dataString);
        } else if (request.url === '/delete'){
            deleteRow(dataString);
        } else if (request.url === '/modify'){
            modifyRow(dataString);
        }
        console.log("appdata:\n" + JSON.stringify(appdata));
        response.writeHead(200,"OK", {'Content-Type': 'text/plain'});
        response.end();

    })
}

function addRow(dataString) {
    let jsonApp = JSON.parse(dataString);
    console.log("jsonApp:\n" + JSON.stringify(jsonApp))

    jsonApp['rank'] = 0;
    for(let i = 0; i < appdata.length; i++){
        let user = appdata[i];

        if (jsonApp['yourname'] === user.yourname && (parseInt(jsonApp['score']) > user.score)){
            deleteRow(i + 1);
        } else if (jsonApp['yourname'] === user.yourname && (parseInt(jsonApp['score']) <= user.score)) {
            // return error message
            return;
        }
    }
    appdata.push(jsonApp);
    calcRank();
}

function deleteRow(dataString) {
    let rankDel = appdata[dataString - 1].rank
    appdata.splice(dataString - 1, 1);
    updateRank(rankDel);
}

function modifyRow(dataString) {
    let jsonApp = JSON.parse(dataString);
    for(let user of appdata){
        if (user.yourname === jsonApp['newName']){
            return;
        }
    }
    for (let user of appdata){
        if (user.yourname === jsonApp['oldName']){
            user.yourname = jsonApp['newName'];
            return;
        }
    }
}


function calcRank(){
    // for each rank of value rank or lower add 1 to number
    let newRank = appdata.length;
    for(let user of appdata){
        let rank = user.rank
        if (rank === 0){
            //Calculate rank value
            let tempRank = Infinity;
            for(let otherUser of appdata){
                if((parseInt(user.score) >= parseInt(otherUser.score)) && (tempRank > otherUser.rank) && (otherUser.rank !== 0)){
                    tempRank = otherUser.rank;
                }
                if(otherUser.rank >= tempRank){
                    otherUser.rank++;
                }
            }
            if (tempRank !== Infinity){
                newRank = tempRank;
            }
            user.rank = newRank;
        }
    }
} //calculates and updates ranks when users are added
function updateRank(rankDel){
    for(let user of appdata){
        if (user.rank > rankDel){
            user.rank--;
        }
    }
    calcRank();
} //updates ranks when users are deleted

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
