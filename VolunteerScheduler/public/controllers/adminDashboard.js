angular.module("Volunteer.App")
    .controller("Volunteer.Admin.Dashboard.Controller", ["$scope", "$http", "$location", function ($scope, $http, $location) {
        var ctrl = this;
        $scope.create = function () {
            ctrl.user.enabled = true;
            ctrl.user.roles = [];
            ctrl.admin && ctrl.user.roles.push("ROLE_ADMIN");
            ctrl.projectManager && ctrl.user.roles.push("ROLE_PROJECT_MANAGER");
            ctrl.volunteer && ctrl.user.roles.push("ROLE_VOLUNTEER");
            var request = {
                method: "POST",
                url: "/users",
                headers: {
                    "Content-Type": "application/json"
                },
                data: ctrl.user
            }
            $http(request).then(function (response) {
                console.log(response);
            }, function (err) {

            });
        }
    }
]);