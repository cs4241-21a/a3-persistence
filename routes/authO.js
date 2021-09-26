const router = require('express').Router();
const User = require('../model/User');
const {regValidation, logValidation} = require('../validation');
const cookie  = require( 'cookie-session' );

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
        if(isValid.error) {
            res.sendFile( __dirname + '/views/indexFail.html' )
            console.log("Invalid response!");
            return res.status(400).send(isValid.error.details[0].message);}

        //check if username does not exists
        const usernameExists = await User.findOne({username: req.body.username});
        if(!usernameExists){
        res.sendFile( __dirname + '/views/indexFail.html' )
        console.log("Username does not exist!");
        return res.status(400).send(req.body);}

        //pass is correct?
        const passwordCorrect = await User.findOne({username: req.body.username, password: req.body.password})
        if(!passwordCorrect){
        console.log("Password is incorrect!");        
        res.sendFile( __dirname + '/views/indexFail.html' )
        return res.status(400).send('password is incorrect')
    }    
        
        req.session.login = true
        res.redirect( '/views/main.html' )
        console.log("User logged in!");
        res.send('succesfull login');
})

module.exports = router;