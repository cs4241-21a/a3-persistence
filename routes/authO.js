const router = require('express').Router();
const User = require('../model/User');
const Data = require('../model/Data');
const {regValidation, logValidation} = require('../validation');
const cookie  = require( 'cookie-session' );
const path = require('path');
const { nextTick } = require('process');
// const reqPath = path.join(__dirname, '..', 'views', 'indexFail.html');
let userNameOfU = '';

router.get("/getData", async (req, res) => {
  // express helps us take JS objects and send them as JSON
  const allUserData = await Data.find({username: userNameOfU})
  console.log('all user data')
  console.log(userNameOfU)
  console.log(allUserData)
  res.json(allUserData);
});

router.post('/register', async (req, res) => {    
  //validate user response before user creation
    const isValid = regValidation(req.body);    
  //check if username already exists
    const usernameExists = await User.findOne({username: req.body.username});
  if( !isValid.error && !usernameExists) {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
    console.log("Registered!")
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    const user = new User({
      username: req.body.username,
      password: req.body.password
  });
  try{
      const savedUser = await user.save();
      console.log("User created!");
      // res.send(savedUser);
      userNameOfU = req.body.username;    
      req.session.login = true
      res.redirect('../../../main.html')      

  }catch(err){
      res.status(400).send(err);
  }

  }else{
    // password incorrect, redirect back to login page
    console.log("Failed registration!")
    res.sendFile( path.join(__dirname, '..', 'views', 'indexFail.html'))
  } 
});

router.post( '/login', async (req,res)=> {
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
    if( !isValid.error && usernameExists && passwordCorrect ) {
      // define a variable that we can check in other middleware
      // the session object is added to our requests by the cookie-session middleware
      req.session.login = true
      userNameOfU = req.body.username;    
      console.log(req.session.username)
      console.log("Succefull log in!")
      // since login was successful, send the user to the main content
      // use redirect to avoid authentication problems when refreshing
      // the page or using the back button, for details see:
      // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
      res.redirect('../../../main.html')
    }else{
      // password incorrect, redirect back to login page
      console.log("Failed log in!")
      res.sendFile( path.join(__dirname, '..', 'views', 'indexFail.html'))
    }  
  })

//login
// router.post('/login', async (req, res) => {
//     console.log("in log func")
//     console.log(req.body)


//         //validate user response before user creation
//         const isValid = logValidation(req.body);
//         //check if username does not exists
//         const usernameExists = await User.findOne({username: req.body.username});
//         //pass is correct?
//         const passwordCorrect = await User.findOne({username: req.body.username, password: req.body.password})
//         if(isValid.error || !usernameExists || !passwordCorrect) {
//             console.log("Invalid username or password!");            
//             res.redirect('views/indexFail.html');
// } else{
    
//         console.log("User logged in!");
//         req.session.login = true        
//         res.redirect( 'main.html' );}
// })
  
module.exports = router;