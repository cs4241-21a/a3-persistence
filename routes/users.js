const express = require('express'),
    router = express.Router();
    bycrypt = require('bcrypt')
//user model
const User = require('../models/User')

//Login
router.get('/login', (req, res) => res.render('login'));

//Register
router.get('/register', (req, res) => res.render('register'));

//register handle
router.post('/register', (req, res) =>{
    const  {name, email, password, confPassword} = req.body;
    let errors = [];

    if (!name ||!email || !password ||!confPassword){
        errors.push({msg: 'please fill in all fields'})
    }

    if (password !== confPassword){
        errors.push({ msg: 'please have passwords match'})
    }

    if (errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            confPassword,
        })
    }else {
        User.findOne({email:email})
            .then(user =>{
                if(user){
                    errors.push({msg: 'email is already in use'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        confPassword,
                    });
                }else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    console.log(newUser)
                    res.send('hello')
                }
            })
    }
})

module.exports = router;