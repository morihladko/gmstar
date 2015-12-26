(function() {
    'use strict';

    angular.module('starDemo', ['gm.star'])
        .controller('appController', ['$scope', function($scope) {
            this.state = 'info';

            this.changeState = function($state) {
                console.log('State has been changed to', $state)
            }

            this.save = function($state) {
                console.log('Saving', $state);
            }
        }])
        .constant('GM_STAR_STATES', ['debug', 'info', 'warn', 'error'])
        .constant('GM_STAR_CSS_NAMES', {
            'debug': '',
            'info': 'gm__star-state-1',
            'warn': 'gm__star-state-2',
            'error': 'gm__star-state-3'
        })
        .run(function() {});
})();
