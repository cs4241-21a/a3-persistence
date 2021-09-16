var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../schemas/users');
const Task = require('../schemas/tasks');
let appdata = require('../data');
const { createDeadline } = require('../util');

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'TODOList', tasks: appdata });
  res.redirect('/login');
});

// Login endpoints
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'TODOList' });
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {

    const user = await User.findOne({ username });
    if (!user) {
      res.render('login', {
        title: 'TODOList',
        errors: { username: `User with username ${username} does not exist`},
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

    res.redirect(`/user/${user._id}`);
  } catch {
    res.render('login', { title: 'TODOList' });
  }
});

// Register Account endpoints
router.get('/register', (req, res, next) => {
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
  }

  res.redirect(`/user/${newUser._id}`);
});

router.post('/submit', async (req, res, next) => {
  try {
    const data = req.body;

    // Check if task title is duplicate
    let dupe = false;
    appdata.forEach((element) => {
      if (element.title === data.title) {

        const resData = { ...appdata, error: 'Duplicate Task titles not allowed' };
        res.json(resData);
        dupe = true;
      }
    });

    if (dupe)
      next();

    // Add data to array
    appdata.push(
      {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dateCreated: data.dateCreated,
        deadline: createDeadline(data.dateCreated, data.priority)
      }
    );

    let newTask = new Task({
      title: data.title,
      description: data.description,
      priority: data.priority,
      dateCreated: data.dateCreated,
      deadline: createDeadline(data.dateCreated, data.priority)
    });

    // save to db
    newTask = await newTask.save();

    console.log(newTask);

    res.json(appdata);

  } catch (err) {
    console.error(err);
  }
});

router.post('/delete', (req, res, next) => {
  try {
    const data = req.body;

    // Delete task
    appdata = appdata.filter((element) => {
      return data.title !== element.title;
    });

    res.json(appdata);
  } catch (err) {
    console.error(err);
  }

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
