angular.module("Volunteer.App")
    .controller("Volunteer.Reports.Controller", ["$scope", "$http", "$location", function ($scope, $http, $location) {
        $scope.programs;

        $scope.buildReport = function () {
            //get program list
            $http.get("/programs").then(function (response) {
                $scope.programs = response.data;
                $scope.programs.forEach(function (program) {
                    $http.get("/programs/" + program.id + "/activities/").then(function (response) {
                        program.activities = response.data;
                        program.activities.forEach(function (activity) {
                            activity.shifts.forEach(function (shift) {
                                shift.names = [];
                                shift.volunteers.forEach(function (volunteer) {
                                    $http.get("/users/" + volunteer).then(function (response) {
                                        shift.names.push(response.data.name.first + " " + response.data.name.last);
                                    })
                                })
                            })
                        });
                    });
                })
            });
        }

        $scope.buildReport();
    }]); 