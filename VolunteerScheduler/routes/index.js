var express = require('express');
var router = express.Router();

// var users = require('./users');

/* GET home page. */
router.get('/', function (request, response) {
    response.sendFile('index.html', { root: __dirname + "/public" });
});

router.get("/programs", function (request, response) {

});

router.get("/programs/:programId", function (request, response) {

});

router.post("/programs", function (request, response) {

});

router.put("/programs", function (request, response) {

});

router.delete("/programs", function (request, response) {

});

router.get("/programs/:programId/activities", function (request, response) {
    
});

router.get("/programs/:programId/activities/:activityId", function (request, response) {

});

router.post("/programs/:programId/activities", function (request, response) {

});

router.put("/programs/:programId/activities", function (request, response) {

});

router.delete("/programs/:programId/activities", function (request, response) {

});

module.exports = router;