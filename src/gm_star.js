(function() {
    'use strict';

    angular.module('gm.star', [])
        .directive('gmStar', gmStarDirective)
        .controller(gmStarController.name, gmStarController);

    var STATES = [
        'state-0',
        'state-1',
        'state-2',
        'state-3',
        'state-4',
        'state-5'
    ];

    var STATE_CSS_NAMES = {
        'state-0': '',
        'state-1': 'gm__star-state-1',
        'state-2': 'gm__star-state-2',
        'state-3': 'gm__star-state-3',
        'state-4': 'gm__star-state-4',
        'state-5': 'gm__star-state-5'
    };

    var RESET_AFTER = 2000;

    function gmStarDirective() {
        return {
            restrict: 'EA',
            scope: {},
            controller: gmStarController.name,
            controllerAs: 'ctrl',
            bindToController: {
                'state': '=',
                'onChange': '&?'
            },
            template:'<div class="gm__star" ng-class="ctrl._stateCss" ng-click="ctrl.click($event)">★</div>'
        }
    }

    function gmStarController($timeout, $scope) {
        this.$timeout = $timeout;
        this.$scope   = $scope;

        this._init();
        this._initWatch();
    }

    /**
     * Init controller variables
     */
    gmStarController.prototype._init = function() {
        this.$timeout(this._initLate.bind(this));
    };

    /**
     * Init states after running the first watch loop (so we can trigger
     * another).
     */
    gmStarController.prototype._initLate = function() {
        if (this._stateIdx === undefined) {
            this._stateIdx = 0;

            this.state = STATES[this._stateIdx];
            this.triggerOnChange();
        }
    };

    /**
     * Init watchers.
     */
    gmStarController.prototype._initWatch = function() {
        var self = this;

        this.$scope.$watch('ctrl.state', function(state) {
            self._watchChangeState(state);    
        });
    };

    /**
     * Handle star mouse click.
     * 
     * @param {Event} $event mouse event
     */
    gmStarController.prototype.click = function($event) {
        this.nextState();
    };

    /**
     * Change state from the watcher.
     *
     * @param {Strign} state state name
     */
    gmStarController.prototype._watchChangeState = function(state) {
        var idx = STATES.indexOf(state);

        if (idx > -1) {
            this._cancelResetTimeout();

            this._stateIdx = idx; 
            this._nextStateIdx = (this._stateIdx + 1) % STATES.length;

            this._stateCss = STATE_CSS_NAMES[state];

            this._scheduleReset();
        }
    };

    gmStarController.prototype._cancelResetTimeout = function() {
        console.log('Canceling timeout');
        this.$timeout.cancel(this._resetTimeout);
    };

    gmStarController.prototype._scheduleReset = function() {
        console.log('Scheduling reset');
        this._resetTimeout = this.$timeout(this.reset.bind(this), RESET_AFTER);
    };

    gmStarController.prototype.reset = function() {
        console.log('Reseting');

        if (this._stateIdx > 0) {
            this._nextStateIdx = 0;
        } else {
            this._nextStateIdx = 1;
        }
    };

    gmStarController.prototype.nextState = function() {
        this._stateIdx = this._nextStateIdx;
        this.state = STATES[this._stateIdx];

        this.triggerOnChange();
    };

    gmStarController.prototype.triggerOnChange = function() {
        if (_.isFunction(this.onChange)) {
            this.onChange({$state: this.state});
        }
    };
})();
