angular.module("Volunteer.App")
    .controller("Volunteer.Activities.Controller", ["$scope", "$http", "$routeParams"], function ($scope, $http, $routeParams) {
    $http.get("/programs/" + $routeParams + "/activities").then(function(response) {
        $scope.activities = response;
    });
});