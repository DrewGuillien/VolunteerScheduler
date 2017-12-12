angular.module("Volunteer.App", ["ngRoute", "ngAnimate", "ngSanitize", "ui.bootstrap"])
    .controller("Volunteer.Error.Modal.Controller", [], function () {
        // Controller for the error modal
        var $ctrl = this;
        $ctrl.$onInit = function () {
            $ctrl.title = $ctrl.resolve.title || "Error";
            $ctrl.error = $ctrl.resolve.error;
        }

        $ctrl.cancel = function () {
            $ctrl.dismiss({ $value: 'cancel' });
        }
    })
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
            .when("/admin/dashboard", {
                templateUrl: "/views/admin/adminDashboard.html",
                controller: "Volunteer.Admin.Dashboard.Controller"
            })
            .when("/reports", {
                templateUrl: "/views/shared/pages/reports.html",
                controller: "Volunteer.Reports.Controller"
            })
            .otherwise({
                templateUrl: "/views/shared/login/login.html",
                controller: "Volunteer.Login.Controller"
            })
    }]);