activities = angular.module("Volunteer.Activities", ["$ngRoute"]);

activities.config(["$routeProvider", function ($routeProvider) {
    var config = {
        templateUrl: "view/shared/pages/activities.html",
        controller: "Volunteer.Activities"
    }
    $routeProvider.when("/activities", config);
}]);

activities.controller("Volunteer.Activities.Controller", ["$scope", "$http", "$routeParams"], function ($scope, $http, $routeParams) {
    $http.get("/activities").then(function(response) {
        $scope.activities = response;
    });
});