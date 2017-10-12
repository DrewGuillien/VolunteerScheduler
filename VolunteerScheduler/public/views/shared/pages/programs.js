programs = angular.module("Volunteer.Programs", ["$ngRoute"]);

programs.config(["$routeProvider", function ($routeProvider) {
    var config = {
        templateUrl: "view/shared/pages/programs.html",
        controller: "Volunteer.Programs.Controller"
    }
    $routeProvider.when("/programs", config);
}]);

programs.controller("Volunteer.Programs.Controller", ["$scope", "$http", "$routeParams"], function ($scope, $http, $routeParams) {
    $http.get("/programs").then(function (response) {
        $scope.programs = response;
    });

    $scope.view = function (programId) {
        // route to '/programs/:programId'

    }
});