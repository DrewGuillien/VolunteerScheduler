var app = angular.module("Volunteer.App"); //Get App

app.controller("Volunteer.Navigation.Controller",
    ["$scope", "$http", "$location", "Session",
        function ($scope, $http, $location, Session) {
            // Passing the Session authentication check to the scope
            $scope.isAuthenticated = Session.isAuthenticated;

            // Define username as a function that grabs the user from the session
            $scope.username = function () {
                var user = Session.user();
                return user && user.username;
            }

            // Get role from session
            $scope.hasRole = Session.hasRole;

            // Logout destroys session and redirects to login view
            $scope.logout = function () {
                $http.get("/logout").then(function () {
                    Session.destroy();
                    $location.path("/login");
                });
            }
        }
    ]
);

app.factory("AuthInterceptor", ["$q", "$location", "$locationProvider", "Session.Service", function ($q, $location, $locationProvider, Session) {
    return {
        "responseError": function (rejection) {
            $locationProvider.hashPrefix("");

            Session.destroy();
            $location.path("/login");
            //$location.path("programs");
            return $q.reject(rejection);
        }
    }
}]);

app.config(["$routeProvider", "$httpProvider",
    function ($routeProvider, $httpProvider) {
        $routeProvider
            .otherwise({
                redirectTo: "/login"
                //redirectTo: "/programs"
            });
    }
]);