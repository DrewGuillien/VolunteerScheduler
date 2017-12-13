angular.module("Volunteer.App")
    .controller("Volunteer.Admin.Dashboard.Controller", ["$scope", "$http", "$q", "$location", "$uibModal", function ($scope, $http, $q, $location, $uibModal) {
        $scope.message = "";
        $scope.showUser = false;
        $scope.showTable = false;
        $scope.users;
        $scope.activities;

        // Refresh table of users
        $scope.updateList = function () {
            $http.get("/users").then(function (response) {
                $scope.users = response.data;
            });
        }

        //manage users
        $scope.searchUsers = function () {
            $scope.showUser = false;
            $scope.isActVis = false;
            $scope.updateList();
            $scope.showTable = !$scope.showTable;
        }

        $scope.shouldShow = function (username, enabled) {
            return (enabled && username != "Admin");
        }

        $scope.isAdmin = function (username) {
            return username === "Admin";
        }

        $scope.suspend = function (user) {
            user.enabled = false;

            $http.put("/users/" + user.id, user).then(function (response) {
                $scope.updateList();
            }, function (error) {
                alert(error.data.msg);
            });
        }

        $scope.enable = function (user) {
            user.enabled = true;

            $http.put("/users/" + user.id, user).then(function (response) {
                $scope.updateList();
            }, function (error) {
                alert(error.data.msg);
            });
        }

        $scope.modal = {
            open: function (mode, userId) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    component: 'user.Modal',
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    size: 'sm',
                    resolve: {
                        mode: function () {
                            return mode;
                        },
                        user: function () {
                            if (!userId) return {};
                            var diferred = $q.defer();
                            $http.get("/users/" + userId).then(function (response) {
                                diferred.resolve(response.data);
                            }, function (error) {
                                alert(error.data.msg);
                                diferred.reject(error.data);
                            });
                            return diferred.promise;
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                    var user = JSON.parse(sessionStorage.user);
                    var mode = data[0];
                    var user = data[1];
                    user.roles = [];
                    switch ($scope.role) {
                        case "admin":
                            user.roles.push("admin");
                        case "program_manager":
                            user.roles.push("program_manager");
                        case "volunteer":
                            user.roles.push("volunteer");
                    }
                    var send = mode == "new" ? $http.post : $http.put;

                    send("/users", program).then(function (response) {
                        $scope.updateList();
                    }, function (error) {
                        alert(error.data.msg);
                    });
                }, function (dismissReason) {
                    //Do nothing
                });
            }
        }

        $scope.remove = function (userId) {
            $http.delete("/users/" + userId).then(function (response) {
                $http.get("/activities").then(function (response) {
                    response.data.forEach(function (activity) {
                        activity.shifts.forEach(function (shift) {
                            var idx = shift.volunteers.indexOf(userId);
                            console.log(idx + ": " + shift.volunteers);

                            if (idx > -1) {
                                shift.volunteers.splice(idx, 1);

                                var request = {
                                    method: "PUT",
                                    url: "/activities/" + activity.id,
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    data: activity
                                };

                                $http(request);
                            }
                        })
                    })
                });

                $scope.updateList();
            }, function (error) {
                alert(error.data);
            });
        }

        //Opens modal to create user
        $scope.create = function () {
            $scope.modal.open("new");
        }

        $scope.edit = function (userId) {
            $scope.modal.open("edit", userId);
        }

        //report gen
        $scope.genReport = function () {
            $location.path("/reports")
        };

        //show activities
        $scope.showActivities = function () {
            $scope.showUser = false;
            $scope.showTable = false;
            $scope.isActVis = !$scope.isActVis;
            $scope.updateActivities();
        }

        $scope.updateActivities = function () {
            $scope.activities = [];

            $http.get("/activities").then(function (response) {
                console.log(response.data);
                $scope.activities = response.data;
                $scope.activities.forEach(function (activity) {
                    $http.get("/programs/" + activity.programId).then(function (response) {
                        activity.program = response.data.title;
                    })

                    activity.shifts.forEach(function (shift) {
                        shift.usernames = "";
                        shift.volunteers.forEach(function (volunteer) {
                            $http.get("/users/" + volunteer).then(function (response) {
                                shift.usernames += " " + response.data.username;
                            })
                        });
                    });

                    console.log($scope.activities);
                });
                console.log($scope.activities);
            });
        }

        $scope.searchTable = function (check) {
            $scope.activities.forEach(function (activity) {
                activity.shifts.forEach(function (shift) {
                    var test = shift.usernames.indexOf(check);
                    console.log("string: " + shift.usernames + " idx: " + test);
                    if (test == -1) {
                        shift.remove = true;
                    }
                })
            });

            $scope.activities.forEach(function (activity, index, object) {
                activity.shifts.forEach(function (shift, index, object) {
                    if (shift.remove === true) {
                        object.splice(index, 1);
                        console.log(index);
                    }
                })
            });

            //the code below brings great dishonor to my family, but I am too tired to care.
            $scope.activities.forEach(function (activity, index, object) {
                if (activity.shifts.length == 0) {
                    object.splice(index, 1);
                }
            });

            $scope.activities.forEach(function (activity, index, object) {
                if (activity.shifts.length == 0) {
                    object.splice(index, 1);
                }
            });

            $scope.activities.forEach(function (activity, index, object) {
                if (activity.shifts.length == 0) {
                    object.splice(index, 1);
                }
            });

        }

        $scope.updateList();
    }
    ]).component("user.Modal", {
        templateUrl: "userModal.html",
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function () {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                switch ($ctrl.resolve.mode) {
                    case "new":
                        $ctrl.user = {};
                        $ctrl.role = "volunteer";
                        break;
                    case "edit":
                        $ctrl.user = $ctrl.resolve.user;
                        $ctrl.role = $ctrl.roles[0];
                        break;
                }
            }

            $ctrl.accept = function () {
                $ctrl.close({ $value: [$ctrl.resolve.mode, $ctrl.program, $ctrl.activities] });
            }

            $ctrl.cancel = function () {
                $ctrl.dismiss({ $value: 'cancel' });
            }
        }
    });