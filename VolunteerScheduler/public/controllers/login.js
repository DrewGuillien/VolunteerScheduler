angular.module("Volunteer.App")
    .controller("Volunteer.Login.Controller", ["$scope", "$http", "$location", "Session.service"], function ($scope, $http, $location, Session) {
    $scope.username = "";
    $scope.password = "";
    $scope.hasError = false;
    $scope.errorMessage = "";

    $scope.isAuthenticated = Session.isAuthenticated;

    var getPath = function () {
        if (Session.hasRole("ROLE_ADMIN")) {
            $location.path("/admin/dashboard");
        } else if (Session.hasRole("ROLE_PROGRAM_MANAGER")) {
            $location.path("/programs");
        } else if (Session.hasRole("ROLE_USER")) {
            $locatoin.path("/programs");
        } else {
            $scope.hasError = true;
            $scope.errorMessage = "User does not have a valid role";
        }
    }

    if (Session.isAuthenticated) getPath();

    $scope.login = function () {
        var request = {
            method: "POST",
            url: "/login",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "username=" + $scope.username + "&password=" + $scope.password
        };

        $http(req).then(
            function (response) {
                $scope.hasError = false;
                $scope.errorMessage = "";

                Session.create(response.data);
                $location.url($location.path());
                getPath();
            },
            function (error) {
                $scope.hasError = true;
                $scope.errorMessage = error.message;
            }
        );
    }
});