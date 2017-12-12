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

//users
router.post("/users", function (request, response) {
    users.save(request.body, function (error, user) {
        if (error) {
            response.status(500).end();
        } else {
            response.status(200).end();
        }
    });
});

router.get("/users", function (request, response) {
    users.findAll(function (error, userList) {
        if (error) {
            response.status(404, "Unable to get users");
        } else {
            response.send(200, userList);
        }
    });
});

router.delete("/users/:userId", function (request, response) {
    users.remove(request.params.userId, function (error) {
        if (error) {
            response.send(500, "Failed to remove user");
        } else {
            response.send(200);
        }
    });
});

router.put("/users/update/:userId", function (request, response) {
    //TODO: remove from activities

    users.update(request.params.userId, request.body, function (error) {
        if (error) {
            response.status(500, "Error updating user");
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

router.put("/programs", function (request, response) {
    if (!request.body || !request.body.id) response.send(400, "No program to update");
    programs.update(request.body.id, request.body, function (error, program) {
        if (error) {
            response.send(500, "Failed to update program");
        } else {
            response.json(program);
        }
    })
})

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
    // Remove all activities from the program before removing program
    activities.findByProgramId(request.params.programId, function (error, activityList) {
        if (error) {
            // No activities existed for program therefore there is no need to remove them
            response.status(200).end();
        } else {
            var hasError = false;
            activityList.forEach(function (activity) {
                console.log(activity);
                activities.remove(activity._id, function (error) {
                    hasError = true;
                });
            });

            // After activities are removed, then remove the program
            programs.remove(request.params.programId, function (error) {
                if (error) {
                    response.send(500, "Failed to remove program");
                } else {
                    response.send(200);
                }
            });
        }
    });
});

router.get("/programs/:programId/activities", function (request, response) {
    
    activities.findByProgramId(request.params.programId, function (error, activityList) {
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

router.put("/programs/:programId/activities", function (request, response) {
    if(!request.body || !request.body.id) response.status(400, "No activity to update")
    activities.update(request.body.id, request.body, function (error) {
        if (error) {
            response.status(500, "Error updating activity");
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

//Volunteer
router.put("/programs/:programId/activities/:activityId/shifts/:shiftId/volunteers/:userId", function (request, response) {
    activities.findById(request.params.programId, request.params.activityId, function (activityError, activity) {
        if (activityError) {
            response.status(404).send("Activity not found");
        } else {
            activity.shifts = activity.shifts.map(function (shift) {
                if (shift.id == request.params.shiftId) {
                    return shift.volunteers.push(request.params.userId);
                }
                return shift;
            });
            activities.update(activity._id, { $set: { shifts: activity.shifts } }, function (updateError) {
                if (updateError) {
                    response.status(500).send("Unable to volunteer for this activity");
                } else {
                    response.status(200).end();
                }
            });
        }
    });
});

router.post("/users/:userId/shifts/conflict", function (request, response) {
    var shift1 = request.body;
    // Returns true if shift2 conflicts with shift 1
    var conflicts = function (shift2) {
        var cond1 = shift1.endTime >= shift2.startTime && shift1.endTime <= shift2.endTime;
        var cond2 = shift1.startTime <= shift2.startTime && shift1.endTime >= shift2.endTime;
        var cond3 = shift1.startTime >= shift2.startTime && shift1.startTime <= shift2.endTime;
        return cond1 || cond2 || cond3;
    };
    activities.findAll(function (error, activityList) {
        // Concatonate all of the shifts in all activities for which the user has volunteered
        var shifts = [];
        activityList.forEach(function (activity) {
            shifts.concat(activity.shifts.filter(function (s) {
                return s.volunteers.contains(request.params.userId);
            }));
        });
        // Returns true after first conflict is found
        response.status(200).send(shifts.some(conflicts(s)));
    });
});

module.exports = router;