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
                            console.log(error);
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
                var request = {
                    method: "DELETE",
                    url: "/programs/" + programId
                }
                $http(request).then(function (response) {
                    $scope.updateList();
                }, function (error) {

                });
            }
        }

        $scope.addActivity = function () {
            $scope.activities.push({
                title: "",
                description: "",
                date: new Date(),
                shifts: [],
                volunteers: [], // Will not be used when created
                addShift: function () {
                    var activity = this;
                    activity.shifts.push({
                        startTime: new Date(1970, 0, 1, 8, 0, 0),
                        endTime: new Date(1970, 0, 1, 17, 0, 0),
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
                }
            });
            $scope.activities[$scope.activities.length - 1].addShift();
        }

        $scope.updateList();
    }
]);