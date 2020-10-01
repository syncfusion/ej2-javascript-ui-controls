window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.NumericTextBox = (function () {
'use strict';

/**
 * Blazor numeric texbot interop handler
 */
var INTREGEXP = new RegExp('^(-)?(\\d*)$');
var ENTER = 13;
var ARROW_UP = 38;
var ARROW_DOWN = 40;
var BACK_SPACE = 8;
var WHEEL_DELTA = 120;
var DELTA = 3;
var LEFT_BUTTON = 0;
var RIGHT_BUTTON = 3;
var MOBILE_INTERVEL_TIME = 600;
var INTERVEL_TIME = 10;
var TIMEOUT = 150;
var MOUSE_BUTTON = 2;
var IE_VERSION = '11.0';
var INCREMENT = 'increment';
var DECREMENT = 'decrement';
var MOUSE_MOVE = 'mouseleave';
var ROOT = 'e-input-group-icon';
var MOUSE_UP = 'mouseup';
var MOUSE_WHEEL = 'mousewheel DOMMouseScroll';
var SERVER_ACTION = 'ServerAction';
var SERVER_VALUE_UPDATE = 'ServerupdateValue';
var SPIN_UP = 'e-spin-up';
var SPIN_DOWN = 'e-spin-down';
var DECIMAL = 'decimal';
var FOCUS = 'focus';
var BLUR = 'blur';
var KEY_PRESS = 'keypress';
var KEY_DOWN = 'keydown';
var PASTE = 'paste';
var SfNumericTextBox = /** @class */ (function () {
    function SfNumericTextBox(wrapperElement, element, dotnetRef, options) {
        this.wrapperElement = wrapperElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    SfNumericTextBox.prototype.initialize = function () {
        this.spinButtonEvents();
        sf.base.EventHandler.add(this.element, FOCUS, this.focusHandler, this);
        sf.base.EventHandler.add(this.element, BLUR, this.focusOutHandler, this);
        sf.base.EventHandler.add(this.element, KEY_PRESS, this.keyPressHandler, this);
        sf.base.EventHandler.add(this.element, KEY_DOWN, this.keyDownHandler, this);
        sf.base.EventHandler.add(this.element, PASTE, this.pasteHandler, this);
    };
    SfNumericTextBox.prototype.keyPressHandler = function (event) {
        if (!this.options.enabled || this.options.readonly) {
            return true;
        }
        var action = event.keyCode;
        if (!sf.base.Browser.isDevice && sf.base.Browser.info.version === IE_VERSION && action === ENTER) {
            var inputValue = this.element.value;
            var parsedInput = new sf.base.Internationalization(this.options.locale).getNumberParser({ format: 'n' })(inputValue);
            this.dotNetRef.invokeMethodAsync(SERVER_VALUE_UPDATE, parsedInput, event);
            return true;
        }
        if (event.which === LEFT_BUTTON || event.metaKey || event.ctrlKey || action === BACK_SPACE || action === ENTER) {
            return true;
        }
        var currentChar = String.fromCharCode(event.which);
        var text = this.element.value;
        var inputElement = this.element;
        text = text.substring(0, inputElement.selectionStart) + currentChar + text.substring(inputElement.selectionEnd);
        if (!this.numericRegex().test(text)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        else {
            return true;
        }
    };
    
    SfNumericTextBox.prototype.pasteHandler = function (event) {
        if (!(!this.options.enabled || this.options.readonly)) {
            var pasteValue = event.clipboardData.getData('text/plain');
            if (!this.numericRegex().test(pasteValue)) {
                event.preventDefault();
            }
            else {
                this.dotNetRef.invokeMethodAsync('InvokePasteHandler', pasteValue);
            }
        }
    };
    SfNumericTextBox.prototype.keyDownHandler = function (event) {
        if (!this.options.readonly) {
            if (event.keyCode === ARROW_UP) {
                event.preventDefault();
                this.dotNetRef.invokeMethodAsync(SERVER_ACTION, INCREMENT, event);
            }
            else if (event.keyCode === ARROW_DOWN) {
                event.preventDefault();
                this.dotNetRef.invokeMethodAsync(SERVER_ACTION, DECREMENT, event);
            }
        }
    };
    
    SfNumericTextBox.prototype.numericRegex = function () {
        var numericObject = sf.base.getNumericObject(this.options.locale);
        var decimalSeparator = sf.base.getValue(DECIMAL, numericObject);
        var fractionRule = '*';
        if (decimalSeparator === '.') {
            decimalSeparator = '\\' + decimalSeparator;
        }
        if (this.options.decimals === 0 && this.options.validateDecimalOnType) {
            return INTREGEXP;
        }
        if (this.options.decimals && this.options.validateDecimalOnType) {
            fractionRule = '{0,' + this.options.decimals + '}';
        }
        return new RegExp('^(-)?(((\\d+(' + decimalSeparator + '\\d' + fractionRule +
            ')?)|(' + decimalSeparator + '\\d' + fractionRule + ')))?$');
    };
    
    SfNumericTextBox.prototype.mouseWheel = function (event) {
        event.preventDefault();
        var delta;
        var rawEvent = event;
        if (rawEvent.wheelDelta) {
            delta = rawEvent.wheelDelta / WHEEL_DELTA;
        }
        else if (rawEvent.detail) {
            delta = -rawEvent.detail / DELTA;
        }
        if (delta > 0) {
            this.dotNetRef.invokeMethodAsync(SERVER_ACTION, INCREMENT, event);
        }
        else if (delta < 0) {
            this.dotNetRef.invokeMethodAsync(SERVER_ACTION, DECREMENT, event);
        }
    };
    SfNumericTextBox.prototype.focusHandler = function (event) {
        this.isFocused = true;
        if (!(!this.options.enabled || this.options.readonly)) {
            if (!sf.base.Browser.isDevice) {
                sf.base.EventHandler.add(this.element, MOUSE_WHEEL, this.mouseWheel, this);
            }
        }
    };
    SfNumericTextBox.prototype.focusOutHandler = function (event) {
        this.isFocused = false;
        event.preventDefault();
        if (!sf.base.Browser.isDevice) {
            sf.base.EventHandler.remove(this.element, MOUSE_WHEEL, this.mouseWheel);
        }
    };
    SfNumericTextBox.prototype.mouseDownOnSpinner = function (event) {
        var _this = this;
        if (this.isFocused) {
            this.isPrevFocused = true;
            event.preventDefault();
        }
        var target = event.currentTarget;
        var action = (target.classList.contains(SPIN_UP)) ? INCREMENT : DECREMENT;
        sf.base.EventHandler.add(target, MOUSE_MOVE, this.mouseUpClick, this);
        // tslint:disable
        this.timeOut = setInterval(function () {
            _this.isCalled = true;
            _this.dotNetRef.invokeMethodAsync(SERVER_ACTION, action, event);
        }, TIMEOUT);
        sf.base.EventHandler.add(document, MOUSE_UP, this.mouseUpClick, this);
    };
    SfNumericTextBox.prototype.mouseUpOnSpinner = function (event) {
        if (this.isPrevFocused) {
            this.element.focus();
            if (!sf.base.Browser.isDevice) {
                this.isPrevFocused = false;
            }
        }
        if (!sf.base.Browser.isDevice) {
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        var target = event.currentTarget;
        var action = (target.classList.contains(SPIN_UP)) ? INCREMENT : DECREMENT;
        sf.base.EventHandler.remove(target, MOUSE_MOVE, this.mouseUpClick);
        if (!this.isCalled) {
            this.dotNetRef.invokeMethodAsync(SERVER_ACTION, action, event);
        }
        this.isCalled = false;
        sf.base.EventHandler.remove(document, MOUSE_UP, this.mouseUpClick);
    };
    SfNumericTextBox.prototype.touchMoveOnSpinner = function (event) {
        var target = document.elementFromPoint(event.clientX, event.clientY);
        if (!(target.classList.contains(ROOT))) {
            clearInterval(this.timeOut);
        }
    };
    SfNumericTextBox.prototype.getElementData = function (event) {
        if ((event.which && event.which === RIGHT_BUTTON) || (event.button && event.button === MOUSE_BUTTON)
            || !this.options.enabled || this.options.readonly) {
            return false;
        }
        clearInterval(this.timeOut);
        return true;
    };
    SfNumericTextBox.prototype.mouseUpClick = function (event) {
        event.stopPropagation();
        clearInterval(this.timeOut);
        this.isCalled = false;
        sf.base.EventHandler.remove(this.spinUp, MOUSE_MOVE, this.mouseUpClick);
        sf.base.EventHandler.remove(this.spinDown, MOUSE_MOVE, this.mouseUpClick);
    };
    SfNumericTextBox.prototype.selectRange = function (formatValue) {
        var _this = this;
        if (!sf.base.Browser.isDevice && sf.base.Browser.info.version === IE_VERSION) {
            this.element.setSelectionRange(0, formatValue.length);
        }
        else {
            var delay = (sf.base.Browser.isDevice && sf.base.Browser.isIos) ? MOBILE_INTERVEL_TIME : INTERVEL_TIME;
            setTimeout(function () {
                _this.element.setSelectionRange(0, formatValue.length);
            }, delay);
        }
    };
    SfNumericTextBox.prototype.isDevice = function () {
        return sf.base.Browser.isDevice;
    };
    SfNumericTextBox.prototype.spinButtonEvents = function () {
        this.spinDown = this.wrapperElement ? this.wrapperElement.querySelector('.' + SPIN_DOWN) : null;
        this.spinUp = this.wrapperElement ? this.wrapperElement.querySelector('.' + SPIN_UP) : null;
        if (this.spinDown && this.spinUp) {
            this.unBindSpinButton();
            this.bindSpinButton();
        }
    };
    SfNumericTextBox.prototype.bindSpinButton = function () {
        sf.base.EventHandler.add(this.spinUp, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        sf.base.EventHandler.add(this.spinDown, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        sf.base.EventHandler.add(this.spinUp, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        sf.base.EventHandler.add(this.spinDown, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        sf.base.EventHandler.add(this.spinUp, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
        sf.base.EventHandler.add(this.spinDown, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
    };
    SfNumericTextBox.prototype.unBindSpinButton = function () {
        sf.base.EventHandler.remove(this.spinUp, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner);
        sf.base.EventHandler.remove(this.spinDown, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner);
        sf.base.EventHandler.remove(this.spinUp, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner);
        sf.base.EventHandler.remove(this.spinDown, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner);
        sf.base.EventHandler.remove(this.spinUp, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner);
        sf.base.EventHandler.remove(this.spinDown, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner);
    };
    return SfNumericTextBox;
}());
// tslint:disable
var NumericTextBox = {
    initialize: function (wrapperElement, element, dotnetRef, options) {
        if (element) {
            new SfNumericTextBox(wrapperElement, element, dotnetRef, options);
        }
        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
        }
    },
    selectRange: function (inputEle, formatValue) {
        if (inputEle && inputEle.blazor__instance) {
            inputEle.blazor__instance.selectRange(formatValue);
        }
    },
    propertyChanges: function (element, options) {
        if (element && element.blazor__instance) {
            element.blazor__instance.options = options;
        }
    },
    focusIn: function (inputEle) {
        if (inputEle) {
            inputEle.focus();
        }
    },
    focusOut: function (inputEle) {
        if (inputEle) {
            inputEle.blur();
        }
    },
    spinButtonEvents: function (inputEle) {
        if (inputEle && inputEle.blazor__instance) {
            inputEle.blazor__instance.spinButtonEvents();
        }
    }
};

return NumericTextBox;

}());
