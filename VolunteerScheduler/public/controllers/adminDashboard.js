angular.module("Volunteer.App")
    .controller("Volunteer.Admin.Dashboard.Controller", ["$scope", "$http", "$location", function ($scope, $http, $location) {
        $scope.message = "";
        $scope.create = function () {
            $scope.user.enabled = true;
            $scope.user.role = [];
            switch ($scope.role) {
                case "admin":
                    $scope.user.role.push("admin");
                case "program_manager":
                    $scope.user.role.push("program_manager");
                case "volunteer":
                    $scope.user.role.push("volunteer");
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