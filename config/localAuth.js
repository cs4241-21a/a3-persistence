const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const Console = require("console");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Local Strategy
passport.use(
    new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        // Match User
        User.findOne({username: email}, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                console.log("Result : ", docs);
            }
        })
            .then(user => {
                // Create new User
                if (user === undefined) {
                    const newUser = new User({email, password});
                    // Hash password before saving in database
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    return done(null, user);
                                })
                                .catch(err => {
                                    return done(null, false, {message: err});
                                });
                        });
                    });
                    Console.log(newUser);
                    // Return other user
                } else {
                    // Match password
                    Console.log(email + password);
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {message: "Wrong password"});
                        }
                    });
                }
            })
            .catch(err => {
                return done(null, false, {message: err});
            });
    })
);

module.exports = passport;