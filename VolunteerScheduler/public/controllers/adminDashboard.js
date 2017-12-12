angular.module("Volunteer.App")
    .controller("Volunteer.Admin.Dashboard.Controller", ["$scope", "$http", "$location", function ($scope, $http, $location) {
        $scope.message = "";
        $scope.showUser = false;
        $scope.showTable = false;
        $scope.isActVis = false;
        $scope.users;
        $scope.activities;

        $scope.updateList = function () {
            $http.get("/users").then(function (response) {
                $scope.users = response.data;
                console.log($scope.users);
            });
        }

        //manage users
        $scope.searchUsers = function () {
            $scope.showUser = false;
            $scope.isActVis = false;
            $scope.updateList();
            $scope.showTable = !$scope.showTable;
        }

        $scope.shouldShow = function (username, enabled) {
            if (enabled === true && username != "Admin") {
                return true;
            } else {
                return false;
            }
        }

        $scope.isAdmin = function (username) {
            if (username === "Admin") {
                return false;
            } else {
                return true;
            }
        }

        $scope.suspend = function (userid, index) {
            var tmp = $scope.users[index];
            tmp.enabled = false;

            var request = {
                method: "PUT",
                url: "/users/update/" + userid,
                headers: {
                    "Content-Type": "application/json"
                },
                data: tmp
            };

            $http(request).then(function (response) {
                $scope.updateList();
            })
        }

        $scope.enable = function (userid, index) {
            var tmp = $scope.users[index];
            tmp.enabled = true;

            var request = {
                method: "PUT",
                url: "/users/update/" + userid,
                headers: {
                    "Content-Type": "application/json"
                },
                data: tmp
            };

            $http(request).then(function (response) {
                $scope.updateList();
            })
        }

        $scope.remove = function (userId) {
            $http.delete("/users/" + userId).then(function (response) {
                $http.get("/activities").then(function (response) {
                    console.log(response);
                    response.data.forEach(function (activity) {
                        console.log(activity);
                        activity.shifts.forEach(function (shift) {
                            var idx = shift.volunteers.indexOf(userId);
                            console.log(idx + ": " + shift.volunteers);

                            if (idx > -1) {
                                shift.volunteers.splice(idx, 1);

                                var request = {
                                    method: "PUT",
                                    url: "/activities/" + activity.id,
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    data: activity
                                };

                                $http(request);
                            }
                        })                       
                    })
                });

                $scope.updateList();
            }, function (error) {
                alert(error.data);
            });
        }

        //create users
        $scope.createUser = function () {
            $scope.showTable = false;
            $scope.isActVis = false;
            $scope.showUser = !$scope.showUser;
        }

        $scope.create = function () {
            $scope.user.enabled = true;
            $scope.user.roles = [];
            switch ($scope.role) {
                case "admin":
                    $scope.user.roles.push("admin");
                case "program_manager":
                    $scope.user.roles.push("program_manager");
                case "volunteer":
                    $scope.user.roles.push("volunteer");
            }
            var request = {
                method: "POST",
                url: "/users",
                headers: {
                    "Content-Type": "application/json"
                },
                data: $scope.user
            }
            $http(request).then(function (response) {
                $scope.message = "User successfully created";
                $scope.clear();
                $scope.updateList();
            }, function (err) {
                $scope.message = err;
            });
        }
        $scope.clear = function () {
            $scope.user = {};
            $scope.role = "";
        }

        //report gen
        $scope.genReport = function () {
            $location.path("/reports")
        };

        //show activities
        $scope.showActivities = function () {
            $scope.showUser = false;
            $scope.showTable = false;
            $scope.isActVis = !$scope.isActVis;
            $scope.updateActivities();
        }

        $scope.updateActivities = function () {
            $scope.activities = [];

            $http.get("/activities").then(function (response) {
                console.log(response.data);
                $scope.activities = response.data;
                $scope.activities.forEach(function (activity) {
                    $http.get("/programs/" + activity.programId).then(function (response) {
                        activity.program = response.data.title;
                    })

                    activity.shifts.forEach(function (shift) {
                        shift.usernames = "";
                        shift.volunteers.forEach(function (volunteer) {
                            $http.get("/users/" + volunteer).then(function (response) {
                                shift.usernames += " " + response.data.username;
                            })
                        });
                    });

                    console.log($scope.activities);
                });
                console.log($scope.activities);
            });
        }

        $scope.searchTable = function (check) {
            $scope.activities.forEach(function (activity) {
                activity.shifts.forEach(function (shift) {
                    var test = shift.usernames.indexOf(check);
                    console.log("string: " + shift.usernames + " idx: " + test);
                    if (test == -1) {
                        shift.remove = true;
                    }
                })
            });

            $scope.activities.forEach(function (activity, index, object) {
                activity.shifts.forEach(function (shift, index, object) {
                    if (shift.remove === true) {
                        object.splice(index, 1);
                        console.log(index);
                    }
                })
            });

            //the code below brings great dishonor to my family, but I am too tired to care.
            $scope.activities.forEach(function (activity, index, object) {
                if (activity.shifts.length == 0) {
                    object.splice(index, 1);
                }
            });

            $scope.activities.forEach(function (activity, index, object) {
                if (activity.shifts.length == 0) {
                    object.splice(index, 1);
                }
            });

            $scope.activities.forEach(function (activity, index, object) {
                if (activity.shifts.length == 0) {
                    object.splice(index, 1);
                }
            });

        }

    }
]);