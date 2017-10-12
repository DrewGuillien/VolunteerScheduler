angular.module("Volunteer.App")
    .controller("Volunteer.Programs.Controller", ["$scope", "$http", "$location", "$routeParams", function ($scope, $http, $location, $routeParams) {
        $scope.form = false;
        $scope.updateList = function () {
            $http.get("/programs").then(function (response) {
                $scope.programs = response.data;
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
            
        }

        $scope.updateList();
    }
]);