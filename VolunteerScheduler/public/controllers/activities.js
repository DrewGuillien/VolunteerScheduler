angular.module("Volunteer.App")
    .controller("Volunteer.Activities.Controller", ["$scope", "$http", "$routeParams", "$uibModal", "Session", function ($scope, $http, $routeParams, $uibModal, Session) {
        $scope.hasRole = Session.hasRole;
        $scope.shifts = [];
        $scope.volunteers = [];


        $scope.updateList = function () {
            $http.get("/programs/" + $routeParams.programId + "/activities").then(function (response) {
                $scope.empty = false;
                $scope.activities = response.data;
                if ($scope.activities.length == 0) {
                    $scope.empty = true;
                }
            }, function (response) {
                $scope.empty = true;
            });
        }

        $scope.updateList();

        $scope.volunteer = function (activityId) {
            $http.get("programs/" + $routeParams.programId + "/activities/" + activityId).then(function (response) {
                $scope.modal.open(response.data);
            }, function (error) {
                $scope.error.open(error.data);
            });
        }

        $scope.conflict = function (shift) {
            var user = JSON.parse(sessionStorage.user);
            $http.post("/users/" + user.id + "/shifts/conflict", shift).then(function (response) {
                return response.data;
            }, function (error) {
                alert(error.data);
                return false;
            });
        }

        $scope.remove = function (activityId) {
            if (activityId) {
                var request = {
                    method: "DELETE",
                    url: "/programs/" + $routeParams.programId + "/activities/" + activityId
                }
                $http(request).then(function (response) {
                    $scope.updateList();
                }, function (error) {

                });
            }
        }

        $scope.modal = {
            open: function (activity) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    component: 'volunteer.Modal',
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'volunteerModal.html',
                    size: 'sm',
                    resolve: {
                        activity: function () {
                            return activity;
                        },
                        user: Session.user
                    }
                });

                modalInstance.result.then(function (shift) {
                    var user = JSON.parse(sessionStorage.user);
                    var request = {
                        method: "PUT",
                        url: "/programs/" + $routeParams.programId + "/activities/" + activity.id + "/shifts/" + shift._id + "/volunteers/" + user.id,
                    }

                    $http(request).then(function (response) {

                    }, function (error) {
                        //console.log(error);
                        $scope.error.open("Error", error.data);
                    });
                }, function () {

                });
            },
        }

        $scope.error = {
            open: function(title, error){
                var modalInstance = $uibModal.open({
                    animation: true,
                    component: 'volunteer.Error.Modal',
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'errorModal.html',
                    size: 'sm',
                    resolve: {
                        title: function () {
                            return title;
                        },
                        error: function () {
                            return error;
                        }
                    }
                });

                modalInstance.result.then(function (response) {
                    // The only response is Ok and all it will do is close the modal
                }, function () {
                    // No else clause
                });
            }
        };

    }]).component('volunteer.Modal', {
        templateUrl: 'volunteerModal.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function () {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                $ctrl.activity = $ctrl.resolve.activity;
                $ctrl.shifts = $ctrl.activity.shifts;
                $ctrl.selected = {};
                $ctrl.selected.shift = $ctrl.shifts[0];
            }

            $ctrl.display = function (shift) {
                var start = new Date(shift.startTime);
                var end = new Date(shift.endTime);
                return $ctrl.getTime(start) + " - " + $ctrl.getTime(end);
            }

            $ctrl.getTime = function(date) {
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                return hours + ':' + minutes + ' ' + ampm;
            }

            $ctrl.ok = function () {
                $ctrl.close({$value: $ctrl.selected.shift});
            };

            $ctrl.cancel = function () {
                $ctrl.dismiss({ $value: 'cancel' });
            }
        }
    }).component('volunteer.Error.Modal', {
        templateUrl: 'errorModal.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: 'volunteer.Error.Modal.Controller'
    });