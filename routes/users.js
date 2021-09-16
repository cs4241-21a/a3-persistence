var express = require('express');
var router = express.Router();

const Task = require('../schemas/tasks');
const { createDeadline } = require('../util');

/* GET users listing. */
router.get('/:id', async function(req, res, next) {
  const id = req.params.id;
  let tasks;
  
  try {

    tasks = await Task.find({owner: id});

  } catch(err) {
    res.redirect('/login');
  }

  res.render('index', { title: 'TODOList', tasks, userId: id });
});

router.post('/:id/submit', async (req, res, next) => {
  console.log('User Task submission');

  const id = req.params.id;

  try {
    const data = req.body;

    // Check if task title is duplicate
    let dupe = false;
    const dupes = await Task.find({owner: id, title: data.title});
    if(dupes.length > 0) {
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

    let tasks = await Task.find({owner: id});

    res.json(tasks);

  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
