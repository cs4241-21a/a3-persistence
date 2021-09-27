require("mongoose");
require("body-parser");
require("passport-local-mongoose");
require("passport-local");
require('body-parser');
const robots = ('express-robots-txt');
const express = require("express"),
    passport = require("passport"),
    User = require("../models/User");
const {render} = require("ejs");
const Console = require("console");
const bodyParser = require("body-parser");
const {join} = require("path");
const {sendFile} = require("express/lib/response");
    router = express.Router();

    function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
    }

    router.get('/welcome', (req, res) => res.render('welcome'));
    router.get('/dash', (req, res) => res.render('dashboard'));

const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({extended: false});


router.get('/', urlencodedParser,(req, res) => res.render('login'));

//Register
router.get('/register', (req, res) => res.render('register'));

// Handling user signup
router.post('/register', jsonParser,function (req, res) {
    const iusername = req.body.firstName + ' ' + req.body.lastName;
    const ipassword = req.body.floatingPassword;
    const i2password = req.body.confPassword;
    const iemail = req.body.floatingInput;
    let newUser = new User({ name:iusername, username: iemail});
    Console.log(newUser);
    User.register(newUser, ipassword, function (err, user) {
            if (err) {
                console.log(err);
                return res.render("register");
            }else if (ipassword !== i2password){
                console.log('passwords do not match')
                return res.render("register")
            }

            passport.authenticate("local",{
                successRedirect: "/welcome",
                failureRedirect: "/"
            },
                req, res, function () {});
        });
});

//login handle
router.post("/", passport.authenticate('local', {
    successRedirect: "/welcome",
    failureRedirect: "/"
}), function (req, res) {
});

module.exports= router;