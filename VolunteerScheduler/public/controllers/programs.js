angular.module("Volunteer.App")
    .controller("Volunteer.Programs.Controller", ["$scope", "$http", "$location", "$routeParams", "Session", function ($scope, $http, $location, $routeParams, Session) {
        $scope.form = false;
        $scope.program = {};
        $scope.activities = [];

        $scope.hasRole = Session.hasRole;

        $scope.updateList = function () {
            $http.get("/programs").then(function (response) {
                $scope.empty = false;
                $scope.programs = response.data;
                if ($scope.programs.length == 0) {
                    $scope.empty = true;
                }
            }, function (response) {
                $scope.empty = true;
            });
        }

        $scope.view = function (programId) {
            // route to '/programs/:programId'
            // view activities for that program
            $location.path("/programs/" + programId);
        };

        $scope.createForm = function () {
            $scope.form = true;
        };

        $scope.cancel = function () {
            $scope.program.title = "";
            $scope.program.description = "";
            $scope.activities = [];
            $scope.form = false;
        }

        $scope.add = function () {
            $scope.error = "";
            if (!$scope.program.title) {
                $scope.hasError = true;
                $scope.error = "Title is required\n";
            }
            if (!$scope.program.description) {
                $scope.hasError = true;
                $scope.error += "Description is required";
            }
            $scope.program.finalized = false;
            var request = {
                method: "POST",
                url: "/programs",
                headers: {
                    "Content-Type": "application/json"
                },
                data: $scope.program
            };

            if (!$scope.hasError) {
                $http(request).then(function (response) {
                    $scope.updateList();
                    $scope.activities.forEach(function (activity) {
                        request = {
                            method: "POST",
                            url: "/programs/" + response.data.id + "/activities",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            data: activity
                        };
                        $http(request).then(function (response) {
                        }, function (error) {
                            alert(error.data);
                        });
                    });
                    $scope.form = false;
                }, function (error) {
                    console.log(error)
                });
            }
        };

        $scope.remove = function (programId) {
            if (programId) {
                $http.delete("/programs/" + programId).then(function (response) {
                    $scope.updateList();
                }, function (error) {
                    alert(error.data);
                });
            }
        }

        //TODO: clean
        $scope.finalize = function (programId) {
            var programTitle;
            var users;
            var prog;

            //grab program
            if (programId) {
                $http.get("/programs/" + programId).then(function (response) {
                    prog = response.data;
                    programTitle = prog.title;

                    // Get all users
                    //$http.get("/users").then(function (response) {
                    //    users = response.data;

                    //    //construct email request
                    //    var mailgunUrl = "https://api.mailgun.net/v3/sandbox0838e66b15a44816bf0b60b2b6e45540.mailgun.org/messages";
                    //    var mailgunApiKey = window.btoa("api:key-57d186b66a182eb3e319ff702e045c44")

                    //    var request = {
                    //        method: 'POST',
                    //        url: mailgunUrl,
                    //        headers: {
                    //            'Access-Control-Allow-Origin': '*',
                    //            'content-type': 'application/x-www-form-urlencoded',
                    //            'Authorization': 'Basic ' + mailgunApiKey
                    //        },
                    //        transformRequest: function (obj) {
                    //            var str = [];
                    //            for (var p in obj)
                    //                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    //            return str.join("&");
                    //        },
                    //        data: null
                    //    };

                    //    //how am I spamming myself?!?!?!? :rage:
                    //    users.forEach(function (user) {
                    //        var dataJSON = {
                    //            from: "postmaster@sandbox0838e66b15a44816bf0b60b2b6e45540.mailgun.org",
                    //            to: user.email,
                    //            subject: programTitle + " Schedule Finalized",
                    //            text: "The schedule for program '" + programTitle + "' is now finalized. Please log in to verify your volunteer hours.",
                    //            multipart: true
                    //        };
                    //        request.data = dataJSON;

                    //        //send email for user
                    //        $http(request).then(function (data) {
                    //            console.log(data);
                    //        }, function (error) {
                    //            alert(error.data);
                    //            });

                            //TODO: update program

                    prog.finalized = true;
                            var req = {
                                method: "PUT",
                                url: "/programs/" + programId,
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                data: prog
                            };

                            $http(req).then(function (data) {
                                $scope.updateList();
                            }, function (error) {
                                alert(error.data);
                            });

                    //    });
                    //}, function (error) {
                    //    alert(error.data);
                    //});
                }, function (error) {
                    alert(error.data);
                });
            }
        }

        $scope.addActivity = function () {
            $scope.activities.push({
                title: "",
                description: "",
                shifts: [],
                addShift: function () {
                    var activity = this;
                    var currentDate = new Date();
                    activity.shifts.push({
                        date: currentDate,
                        startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8, 0, 0),
                        endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 17, 0, 0),
                        minVolunteers: 1,
                        maxVolunteers: 1,
                        remove: function () {
                            var index = activity.shifts.indexOf(this);
                            if (index > -1) activity.shifts.splice(index, 1);
                        }
                    });
                },
                remove: function () {
                    var index = $scope.activities.indexOf(this);
                    if (index > -1) $scope.activities.splice(index, 1);
                },
                changeDate: function () {
                    this.shifts.forEach(function (shift) {
                        shift.startTime = new Date(
                            shift.date.getFullYear(),
                            shift.date.getMonth(),
                            shift.date.getDate(),
                            shift.startTime.getHours(),
                            shift.startTime.getMinutes(),
                            shift.startTime.getSeconds());
                        shift.endTime = new Date(
                            shift.date.getFullYear(),
                            shift.date.getMonth(),
                            shift.date.getDate(),
                            shift.endTime.getHours(),
                            shift.endTime.getMinutes(),
                            shift.endTime.getSeconds());
                    });
                }
            });
            $scope.activities[$scope.activities.length - 1].addShift();
        }

        $scope.updateList();
    }
]);