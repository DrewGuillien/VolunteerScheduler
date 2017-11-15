var express = require("express");
var router = express.Router();
var path = require("path");

var users = require("./db/users");
var programs = require("./db/programs");
var activities = require("./db/activities");


router.post("/login", function (request, response) {
    users.findByUsername(request.body.username, function (err, user) {
        if (err) {
            console.log(err);
            response.send(401);
        } else {
            console.log(user);
            user.comparePassword(request.body.password, function (error, isMatch) {
                if (error) {
                    response.status(500).end();
                } else if (!isMatch) {
                    response.send(401, "Username or password incorrect");
                } else {
                    delete user.password;
                    response.status(200).send(user);
                }
            });
        }
    });
});

router.post("/logout", function (request, response) {
    delete request.session;
});

router.post("/users", function (request, response) {
    users.save(request.body, function (err, user) {
        if (err) {
            console.log(err);
            response.status(500).end();
        } else {
            response.status(200).end();
        }
    });
});

/* GET home page. */
router.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "../public", "index.html"));
});

router.get("/programs", function (request, response) {
    programs.findAll(function (error, programList) {
        if (error) {
            response.send(404, "No Programs Found");
        } else {
            response.json(programList);
        }
    });
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