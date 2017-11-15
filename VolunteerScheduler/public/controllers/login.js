angular.module("Volunteer.App")
    .controller("Volunteer.Login.Controller", ["$scope", "$http", "$location", "Session", function ($scope, $http, $location, Session) {
    $scope.username = "";
    $scope.password = "";
    $scope.hasError = false;
    $scope.errorMessage = "";

    //$scope.isAuthenticated = Session.isAuthenticated;

    var getPath = function () {
        //$location.path('/programs');
    
        if (Session.hasRole("admin")) {
            $location.path("/admin/dashboard");
        } else if (Session.hasRole("program_manager")) {
            $location.path("/programs");
        } else if (Session.hasRole("volunteer")) {
            $locatoin.path("/programs");
        } else {
            $scope.hasError = true;
            $scope.errorMessage = "User does not have a valid role";
        }
    }

    if (Session.isAuthenticated) {
        getPath();
    }

    $scope.login = function () {
        var request = {
            method: "POST",
            url: "/login",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "username=" + $scope.username + "&password=" + $scope.password
        };

        $http(request).then(
            function (response) {
                $scope.hasError = false;
                $scope.errorMessage = "";

                Session.create(response.data);
                getPath();

                $location.url($location.path());
            },
            function (error) {
                $scope.hasError = true;
                $scope.errorMessage = error.message;
            }
        );
    }

    //Temporary Code
    $scope.createAdmin = function () {
        var request = {
            method: "POST",
            url: "/users",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                username: "Admin",
                password: "1234",
                name: { first: "Ad", last: "Min" },
                email: "admin@VolunteerScheduler.com",
                roles: ["admin", "program_manager", "volunteer"],
                enabled: true
            }
        };

        $http(request).then(
            function (response) {
                $scope.hasError = true;
                $scope.errorMessage = "Admin account created";
            },
            function (error) {
                $scope.hasError = true;
                $scope.errorMessage = error.message;
            }
        );
    };
}]);