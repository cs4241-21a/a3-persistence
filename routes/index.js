const express = require('express'),
    router = express.Router();

router.get('/', (req, res) => res.render('welcome'));

module.exports = router;