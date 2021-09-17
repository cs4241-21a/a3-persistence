var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../schemas/users');
const Task = require('../schemas/tasks');
const { createDeadline } = require('../util');
const { checkLogin } = require('../middleware');

const loginCookieName = 'loginCookie';

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'TODOList', tasks: appdata });
  res.redirect('/login');
});

// Login endpoints
router.get('/login', checkLogin, (req, res, next) => {

  res.render('login', { title: 'TODOList' });
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {

    const user = await User.findOne({ username });
    if (!user) {
      res.render('login', {
        title: 'TODOList',
        errors: { username: `User with username ${username} does not exist` },
        formData: { username }
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      res.render('login', {
        title: 'TODOList',
        errors: { password: 'Password Does Not Match' },
        formData: { username }
      });
    }

    // login success
    res.cookie(loginCookieName, { userId: user._id }, { maxAge: 21600000 });
    res.redirect(`/user/${user._id}`);
  } catch {
    res.redirect('/login');
  }
});

router.get('/logout', (req, res, next) => {
  res.clearCookie(loginCookieName);
  res.redirect('/login');
});

// Register Account endpoints
router.get('/register', checkLogin, (req, res, next) => {
  res.render('register', { title: 'TODOList' });
});

router.post('/register', async (req, res, next) => {
  const { username, password, confirmPassword } = req.body;
  let passwordHash;
  let newUser;

  if (password === confirmPassword) {
    passwordHash = await bcrypt.hash(password, 12);
  }

  try {

    newUser = new User({
      username,
      passwordHash
    });

    // save to db
    newUser = await newUser.save();

  } catch (err) {
    console.log(err);
    res.render('register', { title: 'TODOList' });
    return;
  }

  // register success
  res.cookie(loginCookieName, { userId: newUser._id }, { maxAge: 21600000 });
  res.redirect(`/user/${newUser._id}`);
});

router.post('/edit', (req, res, next) => {
  const data = req.body;

  console.log('working')

  appdata = appdata.map((element) => {
    if (data.oldTitle === element.title) {
      element.title = data.newTitle;
      element.description = data.description;
      element.priority = data.priority;
      element.deadline = createDeadline(element.dateCreated, data.priority);
    }

    return element;
  });

  res.json(appdata);
});

module.exports = router;
