angular.module("Volunteer.App")
    .controller("Volunteer.Admin.Dashboard.Controller", ["$scope", "$http", "$location", function ($scope, $http, $location) {
        $scope.message = "";
        $scope.create = function () {
            $scope.user.enabled = true;
            $scope.user.roles = [];
            switch ($scope.role) {
                case "admin":
                    $scope.user.roles.push("admin");
                case "program_manager":
                    $scope.user.roles.push("program_manager");
                case "volunteer":
                    $scope.user.roles.push("volunteer");
            }
            var request = {
                method: "POST",
                url: "/users",
                headers: {
                    "Content-Type": "application/json"
                },
                data: $scope.user
            }
            $http(request).then(function (response) {
                $scope.message = "User successfully created";
                $scope.clear();
            }, function (err) {
                $scope.message = err;
            });
        }
        $scope.clear = function () {
            $scope.user = {};
            $scope.role = "";
        }
    }
]);