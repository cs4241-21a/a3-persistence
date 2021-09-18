const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('./schemas/users');

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
    // console.log('serialize',user);
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log('deserialize',obj);
    done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: GITHUB_ID,
    clientSecret: GITHUB_SECRET,
    callbackURL: "http://localhost:3000/login/oauth2/code/github"
},
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(async function () {

            // Check if user exists in db
            try {
                const userCheck = await User.findOne({ username: profile.username });

                if (userCheck) {
                    return done(null, userCheck);
                }
            } catch (err) {

            }

            // Create new user in db
            try {
                let newUser = new User({
                    username: profile.username
                });
                newUser = await newUser.save();

                return done(null, newUser);
            } catch (err) {

            }

            return done(null, profile);
        });
    }
));