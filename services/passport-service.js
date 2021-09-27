const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

passport.serializeUser(function(user, done) {
  console.log("Serializing ")
  console.log(user)
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("Deserializing ")
  console.log(user)
  done(null, user);
});

passport.use(new GitHubStrategy({
  clientID: process.env.githubClientID,
  clientSecret: process.env.githubClientSecret,
  callbackURL: process.env.githubCallbackURL,
  scope: ['user:email']
},
function(accessToken, refreshToken, user, done) {
  console.log(user.username + " logged in with accessToken " + accessToken)
  console.log(user)
  return done(null, user);
}
));