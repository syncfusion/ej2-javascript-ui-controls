window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.MaskedTextBox = (function () {
'use strict';

var UPDATE_MULTIPLE_DELETION = 'UpdateMultipleDeletion';
var PASTE_HANDLER = 'UpdatePasteValue';
var KEY_DOWN = 'keydown';
var KEY_PRESS = 'keypress';
var BACK_SPACE = 8;
var DELETE = 46;
var FOCUS = 'focus';
var PASTE = 'paste';
var CUT = 'cut';
var MOUSE_DOWN = 'mousedown';
var MOUSE_UP = 'mouseup';
var SPACE = 32;
var SfMaskedTextBox = /** @class */ (function () {
    function SfMaskedTextBox(wrapperElement, element, dotnetRef, options) {
        this.ismultipledelete = false;
        this.isClicked = false;
        this.wrapperElement = wrapperElement;
        this.isClicked = false;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    SfMaskedTextBox.prototype.initialize = function () {
        sf.base.EventHandler.add(this.element, FOCUS, this.focusHandler, this);
        sf.base.EventHandler.add(this.element, KEY_DOWN, this.keyDownHandler, this);
        sf.base.EventHandler.add(this.element, KEY_PRESS, this.keyPressHandler, this);
        sf.base.EventHandler.add(this.element, PASTE, this.pasteHandler, this);
        sf.base.EventHandler.add(this.element, CUT, this.cutHandler, this);
        sf.base.EventHandler.add(this.element, MOUSE_DOWN, this.mouseDownHandler, this);
        sf.base.EventHandler.add(this.element, MOUSE_UP, this.mouseUpHandler, this);
    };
    SfMaskedTextBox.prototype.mouseDownHandler = function (event) {
        this.isClicked = true;
    };
    SfMaskedTextBox.prototype.mouseUpHandler = function (event) {
        this.isClicked = false;
    };
    SfMaskedTextBox.prototype.keyDownHandler = function (event) {
        var _this = this;
        if (this.options.mask && !this.options.readonly) {
            var inputElement_1 = this.element;
            var startIndex = inputElement_1.selectionStart;
            var endIndex = inputElement_1.selectionEnd;
            if (startIndex !== endIndex && this.options.mask !== null && !event.ctrlKey) {
                if ((event.keyCode >= 48 && event.keyCode <= 90) || (event.keyCode >= 96 && event.keyCode <= 111) ||
                    (event.keyCode >= 186 && event.keyCode <= 192) || (event.keyCode >= 219 && event.keyCode <= 222) ||
                    (event.keyCode === BACK_SPACE || event.keyCode === DELETE || event.keyCode === SPACE)) {
                    this.ismultipledelete = true;
                    var eventArgs = {
                        Readonly: false,
                        Enabled: true,
                        Value: inputElement_1.value,
                        selectionEnd: inputElement_1.selectionEnd,
                        selectionStart: inputElement_1.selectionStart,
                        keyValue: event.key,
                        IsMultipleDelete: this.ismultipledelete
                    };
                    // @ts-ignore-start
                    // tslint:disable-next-line:no-any
                    this.dotNetRef.invokeMethodAsync(UPDATE_MULTIPLE_DELETION, eventArgs).then(function (args) {
                        // @ts-ignore-end
                        inputElement_1.value = args.inputValue;
                        inputElement_1.selectionStart = inputElement_1.selectionEnd = args.cursorPosition;
                        if (event.keyCode !== BACK_SPACE && event.keyCode !== DELETE) {
                            _this.ismultipledelete = false;
                            _this.keyPressHandler(event);
                        }
                    });
                }
            }
            else {
                this.ismultipledelete = false;
                if (event.keyCode === BACK_SPACE || event.keyCode === DELETE) {
                    this.keyPressHandler(event);
                }
            }
        }
    };
    SfMaskedTextBox.prototype.focusHandler = function (event) {
        var _this = this;
        var inputElement = this.element;
        var startIndex = 0;
        var modelValue = this.stripValue(inputElement.value);
        var toAllowForward = false;
        var toAllowBackward = false;
        if (this.options.mask !== null) {
            if (!(!(modelValue === null || modelValue === '') || this.options.floatLabelType === 'Always' ||
                this.options.placeHolder === null || this.options.placeHolder === '')) {
                inputElement.value = this.options.maskedValue;
            }
            setTimeout(function () {
                if (inputElement.selectionStart === _this.options.mask.length ||
                    inputElement.value[inputElement.selectionStart] === _this.options.promptCharacter) {
                    toAllowForward = true;
                }
                else {
                    for (var i = inputElement.selectionStart; i < _this.options.mask.length; i++) {
                        if (inputElement.value[i] !== _this.options.promptCharacter) {
                            if ((inputElement.value[i] !== _this.options.mask[i])) {
                                toAllowForward = false;
                                break;
                            }
                        }
                        else {
                            toAllowForward = true;
                            break;
                        }
                    }
                }
            });
            setTimeout(function () {
                var backSelectionStart = inputElement.selectionStart - 1;
                if (backSelectionStart === _this.options.mask.length - 1 ||
                    inputElement.value[backSelectionStart] === _this.options.promptCharacter) {
                    toAllowBackward = true;
                }
                else {
                    for (var i = backSelectionStart; i >= 0; i--) {
                        if (inputElement.value[i] !== _this.options.promptCharacter) {
                            if ((inputElement.value[i] !== _this.options.mask[i])) {
                                toAllowBackward = false;
                                break;
                            }
                        }
                        else {
                            toAllowBackward = true;
                            break;
                        }
                    }
                }
            });
            if ((this.isClicked || (this.options.floatLabelType !== 'Always' &&
                ((modelValue === null || modelValue === '') &&
                    (this.options.placeHolder !== null && this.options.placeHolder !== ''))))) {
                for (startIndex = 0; startIndex < this.options.mask.length; startIndex++) {
                    if (inputElement.value[startIndex] === this.options.promptCharacter) {
                        setTimeout(function () {
                            if (toAllowForward || toAllowBackward) {
                                inputElement.selectionEnd = startIndex;
                                inputElement.selectionStart = startIndex;
                            }
                        });
                        break;
                    }
                }
                this.isClicked = false;
            }
        }
    };
    SfMaskedTextBox.prototype.stripValue = function (inputEleValue) {
        var stripVal = '';
        if (this.options.mask !== null && inputEleValue != null && inputEleValue !== '') {
            for (var i = 0; i < this.options.mask.length; i++) {
                if (this.options.mask[i] !== inputEleValue[i]) {
                    stripVal += inputEleValue[i];
                }
            }
        }
        return stripVal;
    };
    SfMaskedTextBox.prototype.keyPressHandler = function (event) {
        if (this.options.mask && !event.ctrlKey && !this.options.readonly) {
            var inputElement_2 = this.element;
            var startIndex = inputElement_2.selectionStart;
            var endIndex = inputElement_2.selectionEnd;
            var eventArgs = {
                Readonly: false,
                Enabled: true,
                Value: inputElement_2.value,
                selectionEnd: inputElement_2.selectionEnd,
                selectionStart: inputElement_2.selectionStart,
                keyValue: event.key,
                IsMultipleDelete: this.ismultipledelete
            };
            event.preventDefault();
            // @ts-ignore-start
            // tslint:disable-next-line:no-any
            this.dotNetRef.invokeMethodAsync(UPDATE_MULTIPLE_DELETION, eventArgs).then(function (args) {
                // @ts-ignore-end
                inputElement_2.value = args.inputValue;
                inputElement_2.selectionStart = inputElement_2.selectionEnd = args.cursorPosition;
            });
        }
    };
    SfMaskedTextBox.prototype.pasteHandler = function (event) {
        var inputElement = this.element;
        var pasteValue = event.clipboardData.getData('text/plain');
        if (pasteValue !== null) {
            var eventArgs = {
                Readonly: false,
                Enabled: true,
                Value: inputElement.value,
                selectionEnd: inputElement.selectionEnd,
                selectionStart: inputElement.selectionStart,
                IsMultipleDelete: this.ismultipledelete,
                PasteValue: pasteValue
            };
            event.preventDefault();
            // @ts-ignore-start
            this.dotNetRef.invokeMethodAsync(PASTE_HANDLER, eventArgs).then(function (index) {
                // @ts-ignore-end
                inputElement.selectionStart = inputElement.selectionEnd = index;
            });
        }
    };
    SfMaskedTextBox.prototype.cutHandler = function (event) {
        if (this.options.mask) {
            var inputElement_3 = this.element;
            var startIndex = inputElement_3.selectionStart;
            var endIndex = inputElement_3.selectionEnd;
            if (startIndex !== endIndex && this.options.mask !== null) {
                this.ismultipledelete = true;
                var selectedText = inputElement_3.value.substring(startIndex, endIndex);
                event.clipboardData.setData('text', selectedText);
                var eventArgs = {
                    Value: inputElement_3.value,
                    selectionEnd: inputElement_3.selectionEnd,
                    selectionStart: inputElement_3.selectionStart,
                    IsMultipleDelete: this.ismultipledelete
                };
                // @ts-ignore-start
                // tslint:disable-next-line:no-any
                this.dotNetRef.invokeMethodAsync(UPDATE_MULTIPLE_DELETION, eventArgs).then(function (args) {
                    // @ts-ignore-end
                    inputElement_3.value = args.inputValue;
                    inputElement_3.selectionStart = inputElement_3.selectionEnd = args.cursorPosition;
                });
                event.preventDefault();
            }
        }
    };
    SfMaskedTextBox.prototype.propertyChange = function (options) {
        this.options = options;
    };
    return SfMaskedTextBox;
}());
// tslint:disable
var MaskedTextBox = {
    initialize: function initialize(wrapperElement, element, dotnetRef, options) {
        if (element) {
            new SfMaskedTextBox(wrapperElement, element, dotnetRef, options);
        }
        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
        }
    },
    propertyChange: function propertyChange(inputEle, options) {
        if (inputEle && inputEle.blazor__instance) {
            inputEle.blazor__instance.propertyChange(options);
        }
    },
    focusIn: function focusIn(inputEle) {
        if (inputEle) {
            inputEle.focus();
        }
    },
    focusOut: function focusOut(inputEle) {
        if (inputEle) {
            inputEle.blur();
        }
    }
};

return MaskedTextBox;

}());
