window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Spinner = (function () {
'use strict';

var SfSpinner = /** @class */ (function () {
    function SfSpinner(element, target, dotnetRef) {
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(target);
        this.element.blazor__instance = this;
    }
    SfSpinner.prototype.initialize = function (element, target) {
        this.appendTarget(target);
        var theme = window.getComputedStyle(element, ':after').getPropertyValue('content');
        return theme.replace(/['"]+/g, '');
    };
    SfSpinner.prototype.appendTarget = function (target) {
        if (!sf.base.isNullOrUndefined(target)) {
            var targetElement = document.querySelector(target);
            targetElement.appendChild(this.element);
        }
    };
    SfSpinner.prototype.updateContext = function (target) {
        sf.base.extend(this, this, target);
    };
    return SfSpinner;
}());
// tslint:disable-next-line
var Spinner = {
    initialize: function (element, target, dotnetRef) {
        if (!sf.base.isNullOrUndefined(element)) {
            new SfSpinner(element, target, dotnetRef);
            return (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) ?
                element.blazor__instance.initialize(element, target) : null;
        }
        else {
            return null;
        }
    },
    updateTarget: function (element, target) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            return element.blazor__instance.appendTarget(target);
        }
    }
};

return Spinner;

}());
