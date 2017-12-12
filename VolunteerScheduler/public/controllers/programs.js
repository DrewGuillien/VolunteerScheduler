angular.module("Volunteer.App")
    .controller("Volunteer.Programs.Controller", ["$scope", "$http", "$q", "$location", "$routeParams", "$uibModal", "Session", function ($scope, $http, $q, $location, $routeParams, $uibModal, Session) {
        // Grabs hasRole function from Session service
        $scope.hasRole = Session.hasRole;

        // Refreshes the list of programs
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

        $scope.create = function () {
            $scope.modal.open("new");
        }

        $scope.edit = function (programId) {
            $scope.modal.open("edit", programId);
        }
        
        // View activities for that program
        $scope.view = function (programId) {
            $location.path("/programs/" + programId);
        };

        $scope.modal = {
            open: function (mode, programId) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    component: 'program.Modal',
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'volunteerModal.html',
                    size: 'sm',
                    resolve: {
                        mode: function () {
                            return mode;
                        },
                        program: function () {
                            if (!programId) return {};
                            var diferred = $q.defer();
                            $http.get("/programs/" + programId).then(function (response) {
                                diferred.resolve(response.data);
                            }, function (error) {
                                alert(error.data);
                                diferred.reject(error.data);
                            });
                            return diferred.promise;
                        },
                        activities: function () {
                            if (!programId) return [];
                            var diferred = $q.defer();
                            $http.get("/programs/" + programId + "/activities").then(function (response) {
                                var activities = response.data;
                                // JSON turns dates to strings and must be converted back
                                activities.forEach(function (activity) {
                                    activity.shifts.forEach(function (shift) {
                                        shift.date = new Date(shift.date);
                                        shift.startTime = new Date(shift.startTime);
                                        shift.endTime = new Date(shift.endTime);
                                    });
                                });
                                diferred.resolve(activities);
                            }, function (error) {
                                alert(error.data);
                                diferred.reject(error.data);
                            });
                            return diferred.promise;
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                    var user = JSON.parse(sessionStorage.user);
                    var mode = data[0];
                    var program = data[1];
                    var activities = data[2];
                    var send = mode == "new" ? $http.post : $http.put;

                    send("/programs", program).then(function (response) {
                        activities.forEach(function (activity) {
                            send = activity.id ? $http.put : $http.post;
                            send("/programs/" + response.data.id + "/activities", activity).then(function (response) {
                                // Do nothing
                            }, function (error) {
                                alert(error.data.msg);
                            });
                        });
                        $scope.updateList();
                    }, function (error) {
                        alert(error.data.msg);
                    });
                }, function (dismissReason) {
                    //Do nothing
                });
            }
        }

        $scope.remove = function (programId) {
            if (programId) {
                $http.delete("/programs/" + programId).then(function (response) {
                    $scope.updateList();
                }, function (error) {
                    alert(error.data);
                });
            }
        }

        //TODO: clean
        $scope.finalize = function (programId) {
            var programTitle;
            var users;

            //grab program
            if (programId) {
                $http.get("/programs/" + programId).then(function (response) {
                    programTitle = response.data.title;

                    // Get all users
                    $http.get("/users").then(function (response) {
                        users = response.data;

                        //construct email request
                        var mailgunUrl = "https://api.mailgun.net/v3/sandbox0838e66b15a44816bf0b60b2b6e45540.mailgun.org/messages";
                        var mailgunApiKey = window.btoa("api:key-57d186b66a182eb3e319ff702e045c44")

                        var request = {
                            method: 'POST',
                            url: mailgunUrl,
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'content-type': 'application/x-www-form-urlencoded',
                                'Authorization': 'Basic ' + mailgunApiKey
                            },
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: null
                        };

                        //how am I spamming myself?!?!?!? :rage:
                        users.forEach(function (user) {
                            var dataJSON = {
                                from: "postmaster@sandbox0838e66b15a44816bf0b60b2b6e45540.mailgun.org",
                                to: user.email,
                                subject: programTitle + " Schedule Finalized",
                                text: "The schedule for program '" + programTitle + "' is now finalized. Please log in to verify your volunteer hours.",
                                multipart: true
                            };
                            request.data = dataJSON;

                            //send email for user
                            $http(request).then(function (data) {
                                console.log(data);
                            }, function (error) {
                                alert(error.data);
                            });
                        });
                    }, function (error) {
                        alert(error.data);
                    });
                }, function (error) {
                    alert(error.data);
                });
            }
        }

        $scope.updateList();
    }])
    // Modal component
    .component('program.Modal', {
        templateUrl: 'programModal.html',
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
                        $ctrl.program = {};
                        $ctrl.activities = [];
                        break;
                    case "edit":
                        $ctrl.program = $ctrl.resolve.program;
                        $ctrl.activities = $ctrl.resolve.activities;
                        break;
                }
            }

            $ctrl.addActivity = function() {
                $ctrl.activities.push({
                    title: "",
                    description: "",
                    shifts: [],
                    addShift: function () {
                        var activity = this;
                        var currentDate = new Date();
                        activity.shifts.push({
                            date: currentDate,
                            startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8, 0, 0),
                            endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 17, 0, 0),
                            minVolunteers: 1,
                            maxVolunteers: 1,
                            remove: function () {
                                var index = activity.shifts.indexOf(this);
                                if (index > -1) activity.shifts.splice(index, 1);
                            },
                            // startTime and endTime are stored as dates and will reflect the
                            // correct date by changing their values when the date field is changed
                            changeDate: function () {
                                this.startTime = new Date(
                                    this.date.getFullYear(),
                                    this.date.getMonth(),
                                    this.date.getDate(),
                                    this.startTime.getHours(),
                                    this.startTime.getMinutes(),
                                    this.startTime.getSeconds());
                                this.endTime = new Date(
                                    this.date.getFullYear(),
                                    this.date.getMonth(),
                                    this.date.getDate(),
                                    this.endTime.getHours(),
                                    this.endTime.getMinutes(),
                                    this.endTime.getSeconds());
                            }
                        });
                    },
                    remove: function () {
                        var index = $scope.activities.indexOf(this);
                        if (index > -1) $scope.activities.splice(index, 1);
                    }
                });
                $ctrl.activities[$ctrl.activities.length - 1].addShift();
            }

            $ctrl.accept = function () {
                $ctrl.close({ $value: [$ctrl.resolve.mode, $ctrl.program, $ctrl.activities] });
            }

            $ctrl.cancel = function () {
                $ctrl.dismiss({ $value: 'cancel' });
            }
        }
    });