var express = require('express');
var router = express.Router();

let appdata = require('../data');
const { createDeadline } = require('../util');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'TODOList' });
});

router.get('/get-data', (req, res, next) => {
  res.json(appdata);
});

router.post('/submit', (req, res, next) => {
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
