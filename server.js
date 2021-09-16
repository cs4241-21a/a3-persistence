const express = require("express");
const { MongoClient } = require("mongodb");
const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;

const GITHUB_CLIENT_ID = "514c43022bd7c6465568";
const GITHUB_CLIENT_SECRET = "200ac9324ceb8855983f8575893a47a109e5cbfa";

const port = 3000;

/* MongoDB Setup */

const uri = "mongodb+srv://a3-app:a3-app@cluster0.fe9fr.mongodb.net/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

/* Express server and middleware */

const app = express();

app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

/* Passport and Github OAuth setup */

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }
  )
);

/* API Routes */

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {
    // Will get redirected to Github
  }
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.user) {
      res.redirect("/");
    }
    console.log(req.user);
    res.redirect("/");
  }
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
