var express = require("express");
var router = express.Router();
var path = require("path");

var users = require("./db/users");
var programs = require("./db/programs");
var activities = require("./db/activities");


router.post("/login", function (request, response) {
    users.findByUsername(request.body.username, function (userError, user) {
        if (userError) {
            response.send(401);
        } else {
            user.comparePassword(request.body.password, function (passwordError, isMatch) {
                if (passwordError) {
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
    
    activities.findAll(request.params.programId, function (error, activityList) {
        if (error) {
            response.status(404, "No activities found");
        } else {
            response.send(200, activityList);
        }
    });
});

router.get("/programs/:programId/activities/:activityId", function (request, response) {
    activities.findById(request.params.programId, request.params.activityId, function (error, activity) {
        if (error) {
            response.status(404, "Activity not found");
        } else {
            response.send(200, activity);
        }
    });
});

router.post("/programs/:programId/activities", function (request, response) {
    var activity = request.body;
    activity.programId = request.params.programId;
    activities.save(activity, function (error) {
        if (error) {
            response.status(500, "Error creating activity");
        } else {
            response.status(200).end();
        }
    });
});

router.put("/programs/:programId/activities/:activityId", function (request, response) {
    activities.update(request.params.activityId, request.body, function (error) {
        if (error) {
            response.status(500, "Error updating activity");
        } else {
            response.status(200).end();
        }
    });
});

router.delete("/programs/:programId/activities/:activityId", function (request, response) {
    activities.remove(request.params.activityId, function (error) {
        if (error) {
            response.status(500, "Error deleting activity");
        } else {
            response.status(200).end();
        }
    });
});

module.exports = router;