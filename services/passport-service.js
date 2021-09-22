const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GitHubStrategy({
  clientID: process.env.githubClientID,
  clientSecret: process.env.githubClientSecret,
  callbackURL: process.env.githubCallbackURL,
  scope: ['user:email']
},
function(accessToken, refreshToken, user, done) {
  console.log(user.username + " logged in")
  return done(null, user);
}
));