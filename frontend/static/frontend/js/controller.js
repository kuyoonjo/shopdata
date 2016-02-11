app
    .controller('mainCtrl', function($scope, $auth, $http, $log) {
        if ($auth.getToken()) {
            $http.post('/api/accounts/verify/', {token: $auth.getToken()}).then(function (res) {
                $scope.$auth = $auth;
                $log.debug('success logged in', res);

                $scope.showUser = function() {
                    if($auth.getPayload().first_name && $auth.getPayload().last_name) {
                        return $auth.getPayload().first_name + ' ' + $auth.getPayload().last_name;
                    } else if($auth.getPayload().email) {
                        return $auth.getPayload().email;
                    } else {
                        return $auth.getPayload().username;
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
            return viewLocation == $location.path();
        };
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
    .controller('partsCtrl', function($scope, $http, $log) {
        $http.get('/api/parts/').then(function(res) {
            $log.debug(res);
            $scope.ready = true;
            $scope.parts = res.data;

        }, function(res) {
            $log.error('Failed to load parts!', res);
        })
    });