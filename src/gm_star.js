(function() {
    'use strict';

    angular.module('gm.star', [])
        .directive('gmStar', gmStarDirective)
        .controller(GmStarController.name, GmStarController)
        .constant('GM_STAR_STATES', [
            'state-0',
            'state-1',
            'state-2',
            'state-3',
            'state-4',
        ])
        .constant('GM_STAR_CSS_NAMES', {
            'state-0': '',
            'state-1': 'gm__star-state-1',
            'state-2': 'gm__star-state-2',
            'state-3': 'gm__star-state-3',
            'state-4': 'gm__star-state-4',
            'state-5': 'gm__star-state-5'
        });

    var RESET_AFTER = 2000;

    function gmStarDirective() {
        return {
            restrict: 'EA',
            scope: {},
            controller: GmStarController.name,
            controllerAs: 'ctrl',
            bindToController: {
                'state': '=',
                'onChange': '&?',
                'onSave': '&?'
            },
            template:'<div class="gm__star" ng-class="ctrl._stateCss" ng-click="ctrl.click($event)">★</div>'
        }
    }

    function GmStarController($timeout, $scope, GM_STAR_STATES, GM_STAR_CSS_NAMES) {
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
    GmStarController.prototype._init = function() {
        this._innerState = this.state;

        this.$timeout(this._initLate.bind(this));
    };

    /**
     * Init states after running the first watch loop (so we can trigger
     * another).
     */
    GmStarController.prototype._initLate = function() {
        if (this._stateIdx === undefined) {
            this._stateIdx = 0;

            this._innerState = this.GM_STAR_STATES[this._stateIdx];
            this.triggerOnChange();
        }
    };

    /**
     * Init watchers.
     */
    GmStarController.prototype._initWatch = function() {
        var self = this;

        this.$scope.$watch('ctrl._innerState', function(state) {
            self._watchChangeState(state);    
        });
    };

    /**
     * Handle star mouse click.
     * 
     * @param {Event} $event mouse event
     */
    GmStarController.prototype.click = function($event) {
        this.nextState();
    };

    /**
     * Change state from the watcher.
     *
     * @param {Strign} state state name
     */
    GmStarController.prototype._watchChangeState = function(state) {
        var idx = this.GM_STAR_STATES.indexOf(state);

        if (idx > -1) {
            this._cancelSaveTimeout();

            // don't trigger save if state is defined (on the first run)
            if (!_.isUndefined(this._stateIdx)) {
                this._scheduleSave();
            }

            this._stateIdx = idx; 
            this._nextStateIdx = (this._stateIdx + 1) % this.GM_STAR_STATES.length;

            this._stateCss = this.GM_STAR_CSS_NAMES[state];

        }
    };

    GmStarController.prototype._cancelSaveTimeout = function() {
        this.$timeout.cancel(this._saveTimeout);
    };

    GmStarController.prototype._scheduleSave = function() {
        this._saveTimeout = this.$timeout(this.save.bind(this), RESET_AFTER);
    };

    GmStarController.prototype.save = function() {
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

    GmStarController.prototype.nextState = function() {
        this._stateIdx = this._nextStateIdx;
        this._innerState = this.GM_STAR_STATES[this._stateIdx];

        this.triggerOnChange();
    };

    GmStarController.prototype.triggerOnChange = function() {
        if (_.isFunction(this.onChange)) {
            this.onChange({$state: this._innerState});
        }
    };
})();
