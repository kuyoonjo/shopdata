app
    .controller('mainCtrl', function($scope, $auth, $http, $log) {
        if ($auth.getToken()) {
            $http.post('/api/accounts/verify/', {token: $auth.getToken()}).then(function (res) {
                $scope.$auth = $auth;
                $log.debug('success logged in', res, $auth.getPayload());

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
    .controller('partsLocationsCtrl', function($scope, $http, $filter, $log, $uibModal, $auth, Part, PartLocation, OnOrder, FileSaver, Blob) {
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
                    part.date = $filter('date')(new Date(), 'yyyy-MM-dd');
                    part.$update(function() {
                        alert('success');
                        $scope.sending = false;
                        part.isCollapsed = !part.isCollapsed;
                    });
                };
                $scope.addOne = function(part) {
                    $scope.sending = true;
                    part.qty_on_hand ++;
                    part.date = $filter('date')(new Date(), 'yyyy-MM-dd');
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
                        order.user = $auth.getPayload().user_id;
                        order.$save(function() {
                            part.qty_on_order += qty;
                            alert('success');
                        });
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                $scope.showImage = function(part) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'image.html',
                        controller: function ($scope, $uibModalInstance, part) {

                            $scope.part = part;

                            $scope.ok = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'lg',
                        resolve: {
                            part: part
                        }
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
    .controller('blogCtrl', function($scope) {

    })
    .controller('blogListCtrl', function($scope, Blog) {
        $scope.blogs = Blog.query(function() {
            $scope.ready = true;
        });
    })
    .controller('blogAddCtrl', function($scope, $state, Blog) {
        $scope.submit = function() {
            var blog = new Blog();
            blog.html = $scope.html;
            blog.title = $scope.title;
            blog.$save(function() {
                 $state.go('blog.list');
            });
        };
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
    })
    .controller('UploadImageModalInstance', function($scope, $timeout, $uibModalInstance, Uploads, Upload){

        //$scope.image = 'img/default.png';

        //$scope.progress = 0;
        //$scope.files = [];

        /*$scope.upload = function(){
            Upload.upload({
                url: 'api/upload',
                fields: {'dir': 'img/uploads/'},
                file: $scope.files[0],
                method: 'POST'
            }).progress(function (evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data) {
                $scope.progress = 0;
                $scope.image = data.dir+data.filename;
            });
        };*/

        $scope.images = Uploads.query({file_type: 'image'}, function() {
            $scope.ready = true;
        });

        $scope.select = function(image) {
            $scope.images.forEach(function(image) {
                image.selected = false;
            });
            image.selected = true;
            $scope.image = image.file;
        };

        $scope.insert = function(){
            $uibModalInstance.close($scope.image);
        };

        $scope.upload = function() {
            if(!$scope.file)
                return;
            // if($scope.file.size > 1024 * 500)
            //    return alert('Max size: 1 MB');
            console.log($scope.file);
            Upload.upload({
                url: '/api/uploads/',
                data: {file: $scope.file, file_type: 'image'}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                $timeout(function() {
                    $scope.images = Uploads.query({file_type: 'image'});
                    $scope.image = null;
                });
            });
        };
    });