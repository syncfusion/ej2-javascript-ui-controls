window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.TextBox = (function () {
'use strict';

/**
 * Blazor texbox interop handler
 */
var BLUR = 'blur';
var SfTextBox = /** @class */ (function () {
    function SfTextBox(element, dotnetRef) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.isDestroyed = false;
    }
    SfTextBox.prototype.initialize = function () {
        sf.base.EventHandler.add(this.element, BLUR, this.blurHandler, this);
    };
    SfTextBox.prototype.blurHandler = function () {
        if (!this.isDestroyed) {
            this.dotNetRef.invokeMethodAsync('BlurHandler');
        }
        else {
            sf.base.EventHandler.remove(this.element, BLUR, this.blurHandler);
        }
    };
    return SfTextBox;
}());
// tslint:disable
var TextBox = {
    initialize: function (element, dotnetRef) {
        if (element) {
            new SfTextBox(element, dotnetRef);
        }
        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
        }
    },
    focusIn: function (element) {
        element.focus();
    },
    focusOut: function (element) {
        element.blur();
    },
    destroyInput: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.isDestroyed = true;
        }
    }
};

return TextBox;

}());
