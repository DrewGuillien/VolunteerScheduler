var express = require("express");
var router = express.Router();

var users = require("./db/users");
var programs = require("./db/programs");
// var activities = require("./db/activities");

/* GET home page. */
router.get("/", function (request, response) {
    response.sendFile("index.html", { root: __dirname + "/public" });
});

router.get("/programs", function (request, response) {
    response.json([
        { title: "Test 1", description: "Test description" },
        { title: "Test 2", description: "TEST TEST" },
        { title: "Test 3", description: "SOMETHING WENT HORRIBLY WRONG jk test" }
    ]);
/*
    programs.findAll(function (error, programList) {
        if (error) {
            response.send(404, "No Programs Found");
        } else {
            response.json(programList);
        }
    });
    */
});

router.get("/programs/:programId", function (request, response) {
    programs.findById(request.params.programId, function (error, program) {
        if (error) {
            response.send(404, "Program Not Found");
        } else {
            response.json(program);
        }
    });
});

router.post("/programs", function (request, response) {
    programs.save(request.body, function (error, program) {
        if (error) {
            response.send(500, "Failed to create new program");
        } else {
            response.json(program);
        }
    });
});

router.put("/programs/:programId", function (request, response) {
    programs.update(request.params.programId, request.body, function (error, program) {
        if (error) {
            response.send(500, "Failed to update program");
        } else {
            response.json(program);
        }
    });
});

router.delete("/programs/:programId", function (request, response) {
    programs.remove(request.params.programId, function (error) {
        if (error) {
            response.send(500, "Failed to remove program");
        } else {
            response.send(200);
        }
    });
});

router.get("/programs/:programId/activities", function (request, response) {
    
});

router.get("/programs/:programId/activities/:activityId", function (request, response) {
    
});

router.post("/programs/:programId/activities", function (request, response) {

});

router.put("/programs/:programId/activities/:activityId", function (request, response) {

});

router.delete("/programs/:programId/activities/:activityId", function (request, response) {

});

module.exports = router;