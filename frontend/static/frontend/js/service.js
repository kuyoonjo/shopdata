app
    .factory('Part', function($resource) {
        return $resource('/api/parts/:id/', { id: '@id' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        }, {
            stripTrailingSlashes: false
        });
    })
    .factory('PartList', function($resource) {
        return $resource('/api/partlists/:id/', { id: '@id' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        }, {
            stripTrailingSlashes: false
        });
    })
    .factory('PartLocation', function($resource) {
        return $resource('/api/parts/locations/:id/', { id: '@id' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        }, {
            stripTrailingSlashes: false
        });
    })
    .factory('OnOrder', function($resource) {
        return $resource('/api/onOrders/:id/', { id: '@id' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        }, {
            stripTrailingSlashes: false
        });
    })
    .factory('Vehicle', function($resource) {
        return $resource('/api/vehicles/:id/', { id: '@id' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        }, {
            stripTrailingSlashes: false
        });
    });
