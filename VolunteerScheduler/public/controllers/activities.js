angular.module("Volunteer.App")
    .controller("Volunteer.Activities.Controller", ["$scope", "$http", "$routeParams", "Session", function ($scope, $http, $routeParams, Session) {
        $scope.hasRole = Session.hasRole;
        $scope.shifts = [];
        $scope.volunteers = [];

        $http.get("/programs/" + $routeParams.programId + "/activities").then(function (response) {
            $scope.activities = response.data;
        }, function (error) {
            console.log(error);
        });

        $scope.viewShifts = function (activityId) {
            $scope.activities.filter(activity => activity.id == activityId).forEach(activity => view = "shifts");
        }

        $scope.viewVolunteers = function (activityId) {
            $scope.activities.filter(activity => activity.id == activityId).forEach(activity => view = "volunteers");
        }

        $scope.volunteer = function (activityId) {

        }

        $scope.remove = function (activityId) {

        }

    }]);