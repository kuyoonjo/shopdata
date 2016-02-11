app
    .config(function($stateProvider, $urlRouterProvider, $httpProvider, $authProvider, snapRemoteProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'homeCtrl',
                templateUrl:  staticPath + 'partials/home.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: staticPath + 'partials/login.html',
                controller: 'loginCtrl',
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn
                }
            })
            .state('logout', {
                url: '/logout',
                template: null,
                controller: 'logoutCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: staticPath + 'partials/signup.html',
                controller: 'signupCtrl',
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn
                }
            })
            .state('parts', {
                url: '/parts',
                templateUrl: staticPath + 'partials/parts.html',
                controller: 'partsCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            });

        $urlRouterProvider.otherwise('/');

        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        $authProvider.loginUrl = '/api/accounts/login/';
        $authProvider.signupUrl = '/api/accounts/signup/';
        $authProvider.authToken = 'JWT';

        // Facebook

        $authProvider.facebook({
            clientId: '1008467062559053',
            url: '/api/accounts/login/social/jwt/facebook'
        });

        function skipIfLoggedIn($q, $auth) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                deferred.reject();
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        function loginRequired($q, $location, $auth) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                deferred.resolve();
            } else {
                $location.path('/login');
            }
            return deferred.promise;
        }

        snapRemoteProvider.globalOptions = {
            disable: 'right',
            easing: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
            maxPosition: 350,
            minPosition: -350,
            touchToDrag: isMobile(),
        };
    })
    .run(function($rootScope) {
        $rootScope.$on('$stateChangeStart', function(event, next, current) {
            if(next.name != "login" && next.name != "signup")
                $rootScope.next = next;
        });
    });