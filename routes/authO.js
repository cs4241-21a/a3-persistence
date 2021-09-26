const router = require('express').Router();
const User = require('../model/User');
const {regValidation, logValidation} = require('../validation');
// const cookie  = require( 'cookie-session' );

// let dataString = ''

// request.on( 'data', function( data ) {
// dataString += data 
// })

// request.on( 'end', function() {
//   const json = JSON.parse( dataString ) 
//   json.yourname += ' is a cool name!'
//   json.birth += ' is an amazing birth year!'
//   json.cur += ', wow time flies by!'
//   // json.arr = appdata;
// //Storing to server, with derived estimated age
//  appdata[appdata.length] = (json.yourname, json.birth, json.cur, (parseInt(json.cur) - parseInt(json.birth)))
 
//   response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
//   response.end(JSON.stringify(json))

  // })
// const json = JSON.parse( dataString ) 



router.post('/register', async (req, res) => {
    //validate user response before user creation
    const isValid = regValidation(json.username);
    if(isValid.error) return res.status(400).send(isValid.error.details[0].message);

    //check if username already exists
    const usernameExists = await User.findOne({username: req.body.username});
    if(usernameExists) return res.status(400).send('username already exists');

    //creating user in database
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    try{
        const savedUser = await user.save();
        console.log("User created!");
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
});

//login
router.post('/login', async (req, res) => {
    console.log("in log func")
    console.log(req.body)

        //validate user response before user creation
        const isValid = logValidation(req.body);
        if(isValid.error) return res.status(400).send(isValid.error.details[0].message);

        //check if username does not exists
        const usernameExists = await User.findOne({username: req.body.username});
        if(!usernameExists) return res.status(400).send('username does not exists');

        //pass is correct
        const passwordCorrect = await User.findOne({username: req.body.username, password: req.body.password})
        if(!passwordCorrect){return res.status(400).send('password is incorrect')} 
        console.log("User logged in!");
        res.send('succesfull login');


})

module.exports = router;