const router = require('express').Router();
const User = require('../model/User');
const {regValidation, logValidation} = require('../validation')

router.post('/register', async (req, res) => {
    //validate user response before user creation
    const isValid = regValidation(req.body);
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
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
});

//login
router.post('/login', async (req, res) => {
        //validate user response before user creation
        const isValid = logValidation(req.body);
        if(isValid.error) return res.status(400).send(isValid.error.details[0].message);

        //check if username does not exists
        const usernameExists = await User.findOne({username: req.body.username});
        if(!usernameExists) return res.status(400).send('username does not exists');

        //pass is correct
        const passwordCorrect = await User.findOne({username: req.body.username, password: req.body.password})
        if(!passwordCorrect){return res.status(400).send('password is incorrect')} 

        res.send('succesfull login');


})

module.exports = router;