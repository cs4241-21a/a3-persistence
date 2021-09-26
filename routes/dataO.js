const router2 = require('express').Router();
const path = require('path');
const Data = require('../model/Data');
const cookie = require('cookie-session')

router2.get("/getData", async (req, res) => {
    // express helps us take JS objects and send them as JSON
    const allUserData = await Data.find({username: session.username})
    console.log('all user data')
    console.log(allUserData)
    res.json(allUserData);
  });

router2.post( '/data', async (req,res)=> {
    // express.urlencoded will put your key value pairs 
    // into an object, where the key is the name of each
    // form field and the value is whatever the user entered
    console.log("in log func")
    console.log( req.body )
    
    // below is *just a simple authentication example* 
    // for A3, you should check username / password combos in your database
            //validate user response before user creation
        const isValid = logValidation(req.body);
        //check if username does not exists
        const usernameExists = await User.findOne({username: req.body.username});
        //pass is correct?
        const passwordCorrect = await User.findOne({username: req.body.username, password: req.body.password})
    if( true ) {
      // define a variable that we can check in other middleware
      // the session object is added to our requests by the cookie-session middleware
      req.session.login = true
      req.session.username = req.body.username
      console.log(req.session.username)
      console.log("Succefull registration !")
      // since login was successful, send the user to the main content
      // use redirect to avoid authentication problems when refreshing
      // the page or using the back button, for details see:
      // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
      res.redirect('../../../main.html')
    }else{
      // password incorrect, redirect back to login page
      console.log("Failed registration!")
      res.sendFile( path.join(__dirname, '..', 'views', 'indexFail.html'))
    }  
  })

module.exports = router2;