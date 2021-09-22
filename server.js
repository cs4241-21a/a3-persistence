const express = require("express");
const { MongoClient } = require("mongodb");
const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;
const dotenv = require("dotenv").config();
const session = require("express-session");

const port = 3000;

/* MongoDB Setup */

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.fe9fr.mongodb.net/`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  console.log("Mongo client connected");
  //const collection = client.db("test").collection("devices");
});

/* Express server and middleware */

const app = express();

app.use(
  session({ secret: "a3-jhsul", resave: false, saveUninitialized: true })
);

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.url === "/" && req.user) {
    res.redirect("/account");
    return;
  }

  if (req.url === "/account" && !req.user) {
    res.redirect("/");
    return;
  }

  next();
});

app.use(express.static("public", { extensions: ["html"] }));

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
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }
  )
);

/* OAuth Routes */

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
  async (req, res) => {
    if (!req.user) {
      res.redirect("/");
    }
    //if (!client.) await client.connect();

    const userRes = await client
      .db("a3")
      .collection("users")
      .findOne({ _id: req.user.id });

    if (!userRes) {
      console.log(`Adding new user with Github ID ${req.user.id}`);
      await client
        .db("a3")
        .collection("users")
        .insertOne({ _id: req.user.id, loginTimes: [Date.now()] });
    } else {
      console.log(`Logging in existing user with Github ID ${req.user.id}`);
      await client
        .db("a3")
        .collection("users")
        .updateOne({ _id: req.user.id }, { $push: { loginTimes: Date.now() } });
    }
    res.redirect("/");
  }
);

app.post("/contacts", async (req, res) => {
  console.log(req);
  if (!req.user) res.status(400);

  if (req.body.uuid) {
  } else {
  }

  await client
    .db("a3")
    .collection("users")
    .findOneAndUpdate(
      { _id: req.user.id },
      { $push: { contacts: req.body } },
      { returnOriginal: false }
    );
});

app.get("/me", async (req, res) => {
  if (!req.user) res.status(404);

  const userRes = await client
    .db("a3")
    .collection("users")
    .findOne({ _id: req.user.id });

  console.log(userRes);

  if (!userRes) res.status(404);

  req.user.data = userRes;

  res.json(req.user);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
