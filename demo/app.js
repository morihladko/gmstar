(function() {
    'use strict';

    angular.module('starDemo', ['gm.star'])
        .controller('appController', ['$scope', function($scope) {
            $scope.state = 'None';

            this.changeState = function($state) {
                console.log('State has been changed to', $state)
            }
        }])
        .run(function() {});
})();
