angular.module("Volunteer.App").factory("Session", function () {
    var service = {};

    service.user = function () {
        if (sessionStorage.user) {
            console.log(sessionStorage.user);
            return JSON.parse(sessionStorage.user);
        } else {
            return null;
        }
    }

    service.hasRole = function (roleName) {
        var user = service.user();
        if (user) {
            return user.roles.some((role) => role === roleName);
        } else return false;
    }

    service.isAuthenticated = function () {
        return sessionStorage.user ? true : false;
    }

    service.create = function (user) {
        sessionStorage.user = JSON.stringify(user);
    }

    service.destroy = function () {
        delete sessionStorage.user;
        delete localStorage.user;
    }

    return service;
});