var express = require('express');
var router = express.Router();

// var users = require('./users');

/* GET home page. */
router.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname + "/public" });
});

module.exports = router;