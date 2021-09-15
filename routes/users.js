const express = require('express'),
    router = express.Router();

//Login
router.get('/login', (req, res) => res.send('Login'));

//Register
router.get('/register', (req, res) => res.send('Register'));

module.exports = router;