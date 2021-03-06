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
            .state('partsLocations', {
                url: '/partsLocations',
                templateUrl: staticPath + 'partials/partsLocations.html',
                controller: 'partsLocationsCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('parts', {
                url: '/parts',
                templateUrl: staticPath + 'partials/parts/index.html',
                controller: 'partsCtrl',
                redirectTo: 'parts.locations',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('parts.locations', {
                url: '/locations',
                templateUrl: staticPath + 'partials/parts/locations.html',
                controller: 'partsLocationsCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('parts.partlists', {
                url: '/partlists',
                templateUrl: staticPath + 'partials/parts/partlists.html',
                controller: 'partsPartlistsCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('parts.orders', {
                url: '/orders',
                templateUrl: staticPath + 'partials/parts/orders.html',
                controller: 'partsOrdersCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('vehicles', {
                url: '/vehicles',
                templateUrl: staticPath + 'partials/vehicles/index.html',
                redirectTo: 'vehicles.dashboard',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('vehicles.dashboard', {
                url: '/dashboard',
                templateUrl: staticPath + 'partials/vehicles/dashboard.html',
                controller: 'vehiclesDashboardCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('vehicles.list', {
                url: '/list',
                templateUrl: staticPath + 'partials/vehicles/list.html',
                controller: 'vehiclesListCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('workOrders', {
                url: '/workOrders',
                templateUrl: staticPath + 'partials/workOrders/index.html',
                redirectTo: 'workOrders.active',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('workOrders.active', {
                url: '/active',
                templateUrl: staticPath + 'partials/workOrders/workOrders.html',
                controller: 'workOrdersActiveCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('workOrders.closed', {
                url: '/closed',
                templateUrl: staticPath + 'partials/workOrders/workOrders.html',
                controller: 'workOrdersClosedCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('blog', {
                url: '/blog',
                templateUrl: staticPath + 'partials/blog/index.html',
                controller: 'blogCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('blog.list', {
                url: '/list',
                templateUrl: staticPath + 'partials/blog/list.html',
                controller: 'blogListCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('blog.add', {
                url: '/add',
                templateUrl: staticPath + 'partials/blog/add.html',
                controller: 'blogAddCtrl',
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
    })
    .config(function ($provide) {

        $provide.decorator('taOptions', ['$delegate', function(taOptions){
            // $delegate is the taOptions we are decorating
            // here we override the default toolbars and classes specified in taOptions.
            taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
            taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
            taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft','justifyCenter','justifyRight', 'justifyFull'],
                ['html', 'insertImage', 'insertLink', 'wordcount', 'charcount']
            ];
            taOptions.classes = {
                focussed: 'focussed',
                toolbar: 'btn-toolbar',
                toolbarGroup: 'btn-group',
                toolbarButton: 'btn btn-default',
                toolbarButtonActive: 'active',
                disabled: 'disabled',
                textEditor: 'form-control',
                htmlEditor: 'form-control'
            };
            return taOptions; // whatever you return will be the taOptions
        }]);

        $provide.decorator('taTools', ['$delegate', '$uibModal', function (taTools, $uibModal) {
            taTools.insertImage.action = function (deferred,restoreSelection) {
                    $uibModal.open({
                        controller: 'UploadImageModalInstance',
                        templateUrl: staticPath + 'partials/blog/upload.html'
                    }).result.then(
                        function (result) {
                            restoreSelection();
                            document.execCommand('insertImage', true, result);
                            deferred.resolve();
                        },
                        function () {
                            deferred.resolve();
                        }
                    );
                    return false;
                };
            return taTools;
        }]);
    })
    .run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeStart', function (evt, to, params) {
            if (to.redirectTo) {
                evt.preventDefault();
                $state.go(to.redirectTo, params);
            }
        });
    });