app
    .controller('mainCtrl', function($scope, $auth, $http, $log) {
        if ($auth.getToken()) {
            $http.post('/api/accounts/verify/', {token: $auth.getToken()}).then(function (res) {
                $scope.$auth = $auth;
                $log.debug('success logged in', res);

            });
        }

        $scope.showUser = function() {
            if($auth.getPayload().first_name && $auth.getPayload().last_name) {
                return $auth.getPayload().first_name + ' ' + $auth.getPayload().last_name;
            } else if($auth.getPayload().email) {
                return $auth.getPayload().email;
            } else {
                return $auth.getPayload().username;
            }
        };

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.isMobile = function() {
            return isMobile();
        };

    })
    .controller('menuCtrl', function($scope) {
    })
    .controller('navbarCtrol', function($scope) {
    })
    .controller('homeCtrl', function($scope, $http) {
    })
    .controller('loginCtrl', function($scope, $http, $location, $auth, $rootScope, $log) {
        $scope.login = function() {
            $auth.login($scope.user)
                .then(function() {
                    $log.debug('You have successfully signed in!');
                    if($rootScope.next === undefined)
                        $location.path('/');
                    else
                        $location.path($rootScope.next.url);
                })
                .catch(function(error) {
                    console.log(error.data);
                    alert("Wrong username or password!");
                });
        };

        $scope.authenticate = function(provider) {
            $auth.authenticate(provider).then(function(res){
                $auth.setToken(res.data.token);
                $log.debug('You have successfully signed in with ' + provider + '!');
                if($rootScope.next === undefined)
                    $location.path('/');
                else
                    $location.path($rootScope.next.url);
            }).catch(function(res) {
                if (res.error) {
                    // Popup error - invalid redirect_uri, pressed cancel button, etc.
                    $log.error(error.error);
                } else if (res.data) {
                    // HTTP response error from server
                    $log.error(res.data.message, res.status);
                } else {
                    $log.error(res);
                }
            });
        };
    })
    .controller('logoutCtrl', function($location, $auth, $log) {
        if (!$auth.isAuthenticated()) { return; }
        $auth.logout()
            .then(function() {
                $log.error('You have been logged out');
                $location.path('/');
            });
    })
    .controller('signupCtrl', function($scope, $location, $auth, $rootScope, $log) {
        $scope.signup = function() {
            $auth.signup($scope.user)
                .then(function(response) {
                    $auth.login($scope.user)
                        .then(function() {
                            $log.debug('You have successfully signed in!');
                            if($rootScope.next === undefined)
                                $location.path('/');
                            else
                                $location.path($rootScope.next.url);
                        })
                        .catch(function(error) {
                            $log.error(error.data);
                            alert("Wrong username or password!");
                        });
                })
                .catch(function(response) {
                    $log.error(response);
                    if(response.data.username !== undefined)
                       return alert(response.data.username[0]);
                });
        };
    })
    .controller('partsCtrl', function() {

    })
    .controller('partsPartlistsCtrl', function($scope, PartList, FileSaver, Blob) {
        $scope.partlists = PartList.query(function() {
            $scope.ready = true;
        });


        $scope.exportCSV = function(partlists) {
            var pls = JSON.parse(JSON.stringify(partlists));
            var maxLengthOfPartListItems = 0
            pls.forEach(function(partlist) {
                if(maxLengthOfPartListItems < partlist.part_list_items.length)
                    maxLengthOfPartListItems = partlist.part_list_items.length;
                var items = {};
                for(var i = 0; i < partlist.part_list_items.length; i ++) {
                    items[i.toString()] = partlist.part_list_items[i];
                }
                partlist.part_list_items = items;
            });

            var fields = ['id', 'name', 'note'];
            var headers = ['id', 'name', 'note'];

            for(var i = 0; i < maxLengthOfPartListItems; i ++) {
                fields.push('part_list_items.' + i + '.part.number');
                fields.push('part_list_items.' + i + '.part.description');
                fields.push('part_list_items.' + i + '.part.price');
                fields.push('part_list_items.' + i + '.quantity');
                headers.push('part' + (i + 1));
                headers.push('desc' + (i + 1));
                headers.push('price' + (i + 1));
                headers.push('qty' + (i + 1));
            }

            var csv = json2csv(pls, fields, headers);
            var data = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            FileSaver.saveAs(data, 'partlist.csv');
        };
    })
    .controller('partsLocationsCtrl', function($scope, $http, $filter, $log, $uibModal, Part, PartLocation, OnOrder, FileSaver, Blob) {
        $scope.locations = PartLocation.query(function() {
            $scope.locations.unshift({
                name: 'All'
            });
            $scope.selected = $scope.locations[0].name;
            $scope.parts = Part.query(function() {
                $scope.ready = true;
                $scope.noImage = staticPath + '/images/No_image_available.png';
                $scope.sending = false;

                $scope.takeOne = function(part) {
                    $scope.sending = true;
                    part.qty_on_hand --;
                    part.$update(function() {
                        alert('success');
                        $scope.sending = false;
                        part.isCollapsed = !part.isCollapsed;
                    });
                };

                $scope.order = function(part) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'order.html',
                        controller: function ($scope, $uibModalInstance, part) {

                            $scope.part = part;

                            $scope.ok = function () {
                                $uibModalInstance.close($scope.qty);
                            };

                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'sm',
                        resolve: {
                            part: part
                        }
                    });

                    modalInstance.result.then(function (qty) {
                        var order = new OnOrder();
                        order.part = part.id;
                        order.vendor = part.vendor.id;
                        order.qty = qty;
                        order.$save(function() {
                            part.qty_on_order += qty;
                            alert('success');
                        });
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };
            });

            $scope.getNumberOfParts = function(parts, selected) {
                return $filter('filter')(parts, selected == 'All' ? '' : {location: {name: selected}}).length
            };

            $scope.exportCSV = function(parts, selected) {
                var ps =  $filter('filter')(parts, selected == 'All' ? '' : {location: {name: selected}});
                var csv = json2csv(ps, ["id", "vendor.id", "location.name", "number", "alternate_number", "description", "used_on", "price", "qty_to_stock", "qty_on_hand", "qty_on_order", "image", "note", "date"]);
                var data = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                FileSaver.saveAs(data, 'parts.csv');
            };
        });
    })
    .controller('partsOrdersCtrl', function($scope, OnOrder) {
        $scope.orders = OnOrder.query(function() {
            $scope.ready = true;
            $scope.noImage = staticPath + '/images/No_image_available.png';
            console.log($scope.orders);
        });
    })
    .controller('vehiclesCtrl', function($scope, $http, $filter, $log, Vehicle, FileSaver, Blob) {
        $scope.vehicles = Vehicle.query(function() {
            $scope.ready = true;
        });

        $scope.exportCSV = function(vehicles) {
            var vs =  $filter('filter')(vehicles, {dashboard: true});
            var csv = json2csv(vs, [
                "id",
                "work_orders",
                "department.name",
                "make",
                "model",
                "year",
                "serial",
                "hours",
                "next_interval",
                "active",
                "note",
                "interval_hours_due",
                "engine_make",
                "engine_model",
                "engine_serial",
                "engine_note",
                "dashboard"
            ]);
            console.log(csv);
            var data = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            FileSaver.saveAs(data, 'vehicles.csv');
        };
    });