const express = require( "express" ),
    app = express();

app.use(express.static( "public" ));

app.get("/", ( request, response ) => {
  response.sendFile( __dirname + "/views/index.html" );
});

app.get( "/dreams", ( request, response ) => {
  response.json( dreams );
});

app.post( "/submit", ( request, response ) => {
    return "submitted: ${}"
})

// listen for requests :)
const listener = app.listen( process.env.PORT, () => {
  console.log( "Your app is listening on port " + listener.address().port );
});
