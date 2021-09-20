const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose =
        require("passport-local-mongoose"),
    User = require("../models/User");
proteccRouter = express.Router();
    router = express.Router();

    function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())  // <-- typo here
        return next();
    res.redirect('/');
    }

    proteccRouter.get('/', (req, res) => res.render('welcome'));
    proteccRouter.get('/dash', (req, res) => res.render('dashboard'));



//Login
router.get('/', (req, res) => res.render('login'));

//Register
router.get('/register', (req, res) => res.render('register'));

// Handling user signup
router.post("/register", function (req, res) {
    const iusername = req.body.username;
    const ipassword = req.body.password;
    const i2password = req.body.confPassword;
    const iemail = req.body.email;
    User.register(new User({ username: iusername, email: iemail, password: ipassword}),
        ipassword, function (err, user) {
            if (err) {
                console.log(err);
                return res.render("register");
            }else if (ipassword !== i2password){
                console.log('passwords do not match')
                return res.render("register")
            }

            passport.authenticate("local",
                req, res, function () {
                    res.render("/");
                });
        });
});

//login handle
router.post("/", passport.authenticate("local", {
    successRedirect: "/library/",
    failureRedirect: "/"
}), function (req, res) {
});

module.exports = {
    protected: proteccRouter,
    unprotected: router
};