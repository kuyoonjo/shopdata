app
    .filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        }
    })
    .filter('partsFilter', function() {
        return function(number) {

            // Ensure that the passed in data is a number
            if(isNaN(number) || number < 1) {

                // If the data is not a number or is less than one (thus not having a cardinal value) return it unmodified.
                return number;

            } else {

                // If the data we are applying the filter to is a number, perform the actions to check it's ordinal suffix and apply it.

                var lastDigit = number % 10;

                if(lastDigit === 1) {
                    return number + 'st'
                } else if(lastDigit === 2) {
                    return number + 'nd'
                } else if (lastDigit === 3) {
                    return number + 'rd'
                } else if (lastDigit > 3) {
                    return number + 'th'
                }

            }
        }
    });
