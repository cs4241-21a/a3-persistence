var express = require('express');
var router = express.Router();

const User = require('../schemas/users');
const Task = require('../schemas/tasks');
const { createDeadline } = require('../util');

router.get('/get-login-cookie', (req, res, next) => {
  res.json(req.cookies.loginCookie);
});

// Show the tasks list page to a user with id
router.get('/:id', async function (req, res, next) {
  const id = req.params.id;
  let tasks;

  const user = await checkUserExists(id, res);

  try {

    tasks = await Task.find({ owner: id });

  } catch (err) {
    res.redirect('/login');
  }

  res.render('index', {
    title: 'TODOList',
    tasks, userId: id,
    user: { username: user.username }
  });
});

// Submit a task from a user
router.post('/:id/submit', async (req, res, next) => {
  console.log('User Task submission');

  const id = req.params.id;

  await checkUserExists(id, res);

  try {
    const data = req.body;

    // Check if task title is duplicate
    let dupe = false;
    const dupes = await Task.find({ owner: id, title: data.title });
    if (dupes.length > 0) {
      const resData = { error: 'Duplicate Task titles not allowed' };
      res.json(resData);
    }

    if (dupe)
      next();

    console.log(data);

    let newTask = new Task({
      title: data.title,
      description: data.description,
      priority: data.priority,
      dateCreated: data.dateCreated,
      deadline: createDeadline(data.dateCreated, data.priority),
      owner: id
    });

    // save to db
    newTask = await newTask.save();

    let tasks = await Task.find({ owner: id });

    res.json(tasks);

  } catch (err) {
    console.error(err);
  }
});

// Delete a task for a user
router.post('/:id/delete', async (req, res, next) => {

  const id = req.params.id;
  await checkUserExists(id, res);

  try {
    const data = req.body;

    // Delete task
    await Task.deleteOne({ title: data.title, owner: id });
    
    let tasks = await Task.find({ owner: id });

    res.json(tasks);
  } catch (err) {
    console.error(err);
  }

});

const checkUserExists = async (id, res) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      res.redirect('/login');
    }

    return user;
  } catch (err) {
    res.redirect('/login');
  }
}

module.exports = router;
