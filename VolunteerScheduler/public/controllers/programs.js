angular.module("Volunteer.App")
    .controller("Volunteer.Programs.Controller", ["$scope", "$http", "$location", "$routeParams", "Session", function ($scope, $http, $location, $routeParams, Session) {
        $scope.form = false;
        $scope.title = "";
        $scope.description = "";
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
            $scope.title = "";
            $scope.description = "";
            $scope.activities = [];
            $scope.form = false;
        }

        $scope.add = function () {
            $scope.error = "";
            if (!ctrl.title) {
                $scope.hasError = true;
                $scope.error = "Title is required\n";
            }
            if (!ctrl.description) {
                $scope.hasError = true;
                $scope.error += "Description is required";
            }
            var request = {
                method: "POST",
                url: "/programs",
                headers: {
                    "Content-Type": "application/json"
                },
                data: { title: ctrl.title, description: ctrl.description }
            };

            if (!$scope.hasError) {
                $http(request).then(function (response) {
                    $scope.updateList();
                }, function (error) {
                    
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
                date: "",
                shifts: [],
                volunteers: [], // Will not be used when created
                addShift: function () {
                    var activity = this;
                    activity.shifts.push({
                        startTime: "12:00",
                        endTime: "13:00",
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
            $scope.activities[$scope.activities.length].addShift();
        }

        $scope.updateList();
    }
]);