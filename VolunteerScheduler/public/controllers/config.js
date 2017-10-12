angular.module("Volunteer.App", ["ngRoute", "Session"])
    .config(["$locationProvider", "$routeProvider", function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix("");
        $routeProvider
            .when("/login", {
                templateUrl: "/views/shared/login/login.html",
                controller: "Volunteer.Login.Controller"
            })
            .when("/programs", {
                templateUrl: "/views/shared/pages/programs.html",
                controller: "Volunteer.Programs.Controller"
            })
            .when("/programs/:programId", {
                templateUrl: "/views/shared/pages/activities.html",
                controller: "Volunteer.Activities.Controller"
            })
    }]);