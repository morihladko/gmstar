(function() {
    'use strict';

    angular.module('atmt.star', [])
        .directive('atmtStar', atmtStarDirective)
        .controller(AtmtStarController.name, AtmtStarController)
        .constant('GM_STAR_STATES', [
            'state-0',
            'state-1',
            'state-2',
            'state-3',
            'state-4',
        ])
        .constant('GM_STAR_CSS_NAMES', {
            'state-0': '',
            'state-1': 'atmt__star-state-1',
            'state-2': 'atmt__star-state-2',
            'state-3': 'atmt__star-state-3',
            'state-4': 'atmt__star-state-4',
            'state-5': 'atmt__star-state-5'
        });

    var RESET_AFTER = 2000;

    function atmtStarDirective() {
        return {
            restrict: 'EA',
            scope: {},
            controller: AtmtStarController.name,
            controllerAs: 'ctrl',
            bindToController: {
                'state': '=',
                'onChange': '&?',
                'onSave': '&?'
            },
            template:'<div class="atmt__star" ng-class="ctrl._stateCss" ng-click="ctrl.click($event)">★</div>'
        }
    }

    function AtmtStarController($timeout, $scope, GM_STAR_STATES, GM_STAR_CSS_NAMES) {
        this.$timeout = $timeout;
        this.$scope   = $scope;

        this.GM_STAR_STATES    = GM_STAR_STATES;
        this.GM_STAR_CSS_NAMES = GM_STAR_CSS_NAMES;

        this._init();
        this._initWatch();
    }

    /**
     * Init controller variables
     */
    AtmtStarController.prototype._init = function() {
        this._innerState = this.state;
    };

    /**
     * Init watchers.
     */
    AtmtStarController.prototype._initWatch = function() {
        var self = this;

        this.$scope.$watch('ctrl._innerState', function(state) {
            self._watchChangeState(state.toString());
        });
    };

    /**
     * Handle star mouse click.
     * 
     * @param {Event} $event mouse event
     */
    AtmtStarController.prototype.click = function($event) {
        this.nextState();
    };

    /**
     * Change state from the watcher.
     *
     * @param {Strign} state state name
     */
    AtmtStarController.prototype._watchChangeState = function(state) {
        var idx = this.GM_STAR_STATES.indexOf(state),
            firstTimeCheck = _.isUndefined(this._stateIdx);	

        if (idx > -1) {
            this._cancelSaveTimeout();

            if (!firstTimeCheck) {
                this._scheduleSave();
            }

            this._stateIdx = idx;

            if (firstTimeCheck && this._stateIdx > 0) {
                this._nextStateIdx = 0;
            } else {
                this._nextStateIdx = (this._stateIdx + 1) % this.GM_STAR_STATES.length;
            }

            this._stateCss = this.GM_STAR_CSS_NAMES[state];

        } else {
            this._nextStateIdx = 1;
        }
    };

    AtmtStarController.prototype._cancelSaveTimeout = function() {
        this.$timeout.cancel(this._saveTimeout);
    };

    AtmtStarController.prototype._scheduleSave = function() {
        this._saveTimeout = this.$timeout(this.save.bind(this), RESET_AFTER);
    };

    AtmtStarController.prototype.save = function() {
        if (_.isFunction(this.onSave)) {
            this.onSave({$state: this._innerState});
        }

        this.state = this._innerState;

        // reset the next state
        if (this._stateIdx > 0) {
            this._nextStateIdx = 0;
        } else {
            this._nextStateIdx = 1;
        }
    };

    AtmtStarController.prototype.nextState = function() {
        this._stateIdx = this._nextStateIdx;
        this._innerState = this.GM_STAR_STATES[this._stateIdx];

        this.triggerOnChange();
    };

    AtmtStarController.prototype.triggerOnChange = function() {
        if (_.isFunction(this.onChange)) {
            this.onChange({$state: this._innerState});
        }
    };
})();
