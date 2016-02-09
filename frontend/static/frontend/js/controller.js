app
    .controller('mainCtrl', function($scope, $auth, $http, $log) {
        if ($auth.getToken()) {
            $http.post('/api/accounts/verify/', {token: $auth.getToken()}).then(function (res) {
                $scope.payload = $auth.getPayload();
                $log.debug('success logged in', res);
                $log.debug('current payload: ', $auth.getPayload());
                $log.debug('token: ', $auth.getToken());

                $scope.showUser = function() {
                    if($scope.payload.first_name && $scope.payload.last_name) {
                        return $scope.payload.first_name + ' ' + $scope.payload.last_name;
                    } else if($scope.payload.email) {
                        return $scope.payload.email;
                    } else {
                        return $scope.payload.username;
                    }
                }
            });
        }
        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.isMobile = function() {
            return isMobile();
        };

    })
    .controller('menuCtrl', function($scope, $location) {
    })
    .controller('navbarCtrol', function($scope, $location) {
        $scope.isActive = function (viewLocation) {
            console.log($location.path());
            return viewLocation == $location.path();
        };
    })
    .controller('homeCtrl', function($scope, $http) {
    })
    .controller('loginCtrl', function($scope, $http, $location, $auth, $rootScope) {
        $scope.login = function() {
            $auth.login($scope.user)
                .then(function() {
                    console.log('You have successfully signed in!');
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
                console.log('You have successfully signed in with ' + provider + '!');
                if($rootScope.next === undefined)
                    $location.path('/');
                else
                    $location.path($rootScope.next.url);
            }).catch(function(res) {
                if (res.error) {
                    // Popup error - invalid redirect_uri, pressed cancel button, etc.
                    console.log(error.error);
                } else if (res.data) {
                    // HTTP response error from server
                    console.log(res.data.message, res.status);
                } else {
                    console.log(res);
                }
            });
        };
    })
    .controller('logoutCtrl', function($location, $auth) {
        if (!$auth.isAuthenticated()) { return; }
        $auth.logout()
            .then(function() {
                console.log('You have been logged out');
                $location.path('/');
            });
    })
    .controller('signupCtrl', function($scope, $location, $auth, $rootScope) {
        $scope.signup = function() {
            $auth.signup($scope.user)
                .then(function(response) {
                    $auth.login($scope.user)
                        .then(function() {
                            console.log('You have successfully signed in!');
                            if($rootScope.next === undefined)
                                $location.path('/');
                            else
                                $location.path($rootScope.next.url);
                        })
                        .catch(function(error) {
                            console.log(error.data);
                            alert("Wrong username or password!");
                        });
                })
                .catch(function(response) {
                    console.log(response);
                    if(response.data.username !== undefined)
                       return alert(response.data.username[0]);
                });
        };
    })
    .controller('partsCtrl', function($scope, $http, $log) {
        $http.get('/api/parts/').then(function(res) {
            $log.debug(res);
            $scope.ready = true;
            $scope.parts = res.data;

        }, function(res) {
            $log.error('Failed to load parts!', res);
        })
    });