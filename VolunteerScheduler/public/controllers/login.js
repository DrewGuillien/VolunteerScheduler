angular.module("Volunteer.App")
    .controller("Volunteer.Login.Controller", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.username = "";
    $scope.password = "";
    $scope.hasError = false;
    $scope.errorMessage = "";

    //$scope.isAuthenticated = Session.isAuthenticated;

    var getPath = function () {
        $location.path('/programs');
    /*
        if (Session.hasRole("ROLE_ADMIN")) {
            $location.path("/admin/dashboard");
        } else if (Session.hasRole("ROLE_PROGRAM_MANAGER")) {
            $location.path("/programs");
        } else if (Session.hasRole("ROLE_USER")) {
            $locatoin.path("/programs");
        } else {
            $scope.hasError = true;
            $scope.errorMessage = "User does not have a valid role";
        }*/
    }

    /*
    if (Session.isAuthenticated) {
        getPath();
    }*/

    $scope.login = function () {
        console.log($scope.username);
        console.log($scope.password);
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

                //Session.create(response.data);
                //getPath();
                $location.url($location.path());
            },
            function (error) {
                $scope.hasError = true;
                $scope.errorMessage = error.message;
            }
        );
    }
}]);