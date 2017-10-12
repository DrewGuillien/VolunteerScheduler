angular.module("Volunteer.App")
    .controller("Volunteer.Programs.Controller", ["$scope", "$http", "$location", "$routeParams"], function ($scope, $http, $location, $routeParams) {
    $http.get("/programs").then(function (response) {
        $scope.programs = response;
    });

    $scope.view = function (programId) {
        // route to '/programs/:programId'
        $location.path("/programs/" + programId);
    }
});