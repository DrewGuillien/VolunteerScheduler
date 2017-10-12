﻿angular.module("Volunteer.App").factory("Session.Service", function() {
	var service = {};
	
	service.user = function() {
		if(sessionStorage.user) {
			return JSON.parse(sessionStorage.user);
		} else {
			return null;
		}
	}
	
	service.hasRole = function(roleName) {
        var user = service.user();
        return user.roles.some(function (role) {
            role.name === roleName;
        });
	}
	
	service.isAuthenticated = function() {
		return sessionStorage.user ? true : false;
	}
	
	service.create = function(user) {
		sessionStorage.user = JSON.stringify(user);
	}
	
	service.destroy = function() {
		delete sessionStorage.user;
	}
	
	return service;
});