angular.module("Volunteer.App")
    .controller("Volunteer.Programs.Controller", ["$scope", "$http", "$location", "$routeParams", function ($scope, $http, $location, $routeParams) {
        $scope.form = false;
        var ctrl = this;


        $scope.updateList = function () {
            $http.get("/programs").then(function (response) {
                $scope.empty = false;
                $scope.programs = response.data;
                if ($scope.programs.length == 0) {
                    $scope.empty = true;
                }
            }, function (response) {
                $scope.empty = true;
            });
        }

        $scope.view = function (programId) {
            // route to '/programs/:programId'
            $location.path("/programs/" + programId);
        };

        $scope.createForm = function () {
            $scope.form = true;
        };

        $scope.add = function () {
            console.log("add hit");
            console.log(ctrl.title);
            console.log(ctrl.description);
            $scope.error = "";
            if (!ctrl.title) {
                $scope.hasError = true;
                $scope.error = "Title is required\n";
            }
            if (!ctrl.description) {
                $scope.hasError = true;
                $scope.error += "Description is required";
            }
            var request = {
                method: "POST",
                url: "/programs",
                headers: {
                    "Content-Type": "application/json"
                },
                data: { title: ctrl.title, description: ctrl.description }
            };

            if (!$scope.hasError) {
                $http(request).then(function (response) {
                    $scope.updateList();
                }, function () {
                    
                });
            }
        };

        $scope.updateList();
    }
]);