window.sf = window.sf || {};
var sfnumerictextbox = (function (exports) {
'use strict';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ROOT = 'e-control-wrapper e-numeric';
var SPINICON = 'e-input-group-icon';
var SPINUP = 'e-spin-up';
var SPINDOWN = 'e-spin-down';
var ERROR = 'e-error';
var INCREMENT = 'increment';
var DECREMENT = 'decrement';
var INTREGEXP = new RegExp('^(-)?(\\d*)$');
var DECIMALSEPARATOR = '.';
var COMPONENT = 'e-numerictextbox';
var CONTROL = 'e-control';
var NUMERIC_FOCUS = 'e-input-focus';
var HIDDENELEMENT = 'e-numeric-hidden';
var wrapperAttributes = ['title', 'style', 'class'];
/**
 * Represents the NumericTextBox component that allows the user to enter only numeric values.
 * ```html
 * <input type='text' id="numeric"/>
 * ```
 * ```typescript
 * <script>
 *   var numericObj = new NumericTextBox({ value: 10 });
 *   numericObj.appendTo("#numeric");
 * </script>
 * ```
 */
var NumericTextBox = /** @class */ (function (_super) {
    __extends(NumericTextBox, _super);
    function NumericTextBox(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isVue = false;
        _this.preventChange = false;
        _this.numericOptions = options;
        return _this;
    }
    NumericTextBox.prototype.preRender = function () {
        this.isPrevFocused = false;
        this.decimalSeparator = '.';
        this.intRegExp = new RegExp('/^(-)?(\d*)$/');
        this.isCalled = false;
        var ejInstance = sf.base.getValue('ej2_instances', this.element);
        this.cloneElement = this.element.cloneNode(true);
        sf.base.removeClass([this.cloneElement], [CONTROL, COMPONENT, 'e-lib']);
        this.angularTagName = null;
        this.formEle = sf.base.closest(this.element, 'form');
        if (this.element.tagName === 'EJS-NUMERICTEXTBOX') {
            this.angularTagName = this.element.tagName;
            var input = this.createElement('input');
            var index = 0;
            for (index; index < this.element.attributes.length; index++) {
                var attributeName = this.element.attributes[index].nodeName;
                if (attributeName !== 'id') {
                    input.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                    input.innerHTML = this.element.innerHTML;
                }
            }
            if (this.element.hasAttribute('name')) {
                this.element.removeAttribute('name');
            }
            this.element.classList.remove('e-control', 'e-numerictextbox');
            this.element.appendChild(input);
            this.element = input;
            sf.base.setValue('ej2_instances', ejInstance, this.element);
        }
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            sf.base.attributes(this.element, { 'role': 'spinbutton', 'tabindex': '0', 'autocomplete': 'off', 'aria-live': 'assertive' });
            var localeText = {
                incrementTitle: 'Increment value', decrementTitle: 'Decrement value', placeholder: this.placeholder
            };
            this.l10n = new sf.base.L10n('numerictextbox', localeText, this.locale);
            if (this.l10n.getConstant('placeholder') !== '') {
                this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
            }
        }
        this.isValidState = true;
        this.inputStyle = null;
        this.inputName = null;
        this.cultureInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.prevValue = this.value;
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            this.updateHTMLAttrToElement();
            this.checkAttributes(false);
            if (this.formEle) {
                this.inputEleValue = this.value;
            }
        }
        this.validateMinMax();
        this.validateStep();
        if (this.placeholder === null && !(sf.base.isBlazor() && this.isServerRendered)) {
            this.updatePlaceholder();
        }
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    NumericTextBox.prototype.render = function () {
        if (this.element.tagName.toLowerCase() === 'input') {
            if (!(sf.base.isBlazor() && this.isServerRendered)) {
                this.createWrapper();
                if (this.showSpinButton) {
                    this.spinBtnCreation();
                }
                this.setElementWidth(this.width);
                if (!this.container.classList.contains('e-input-group')) {
                    this.container.classList.add('e-input-group');
                }
                this.changeValue(this.value === null || isNaN(this.value) ?
                    null : this.strictMode ? this.trimValue(this.value) : this.value);
            }
            else {
                this.container = this.element.parentElement;
                this.inputWrapper = { container: this.container };
                this.hiddenInput = this.container.querySelector('input[type="hidden"]');
                if (this.showClearButton) {
                    this.inputWrapper.clearButton = this.container.querySelector('.e-clear-icon');
                    sf.inputs.Input.wireClearBtnEvents(this.element, this.inputWrapper.clearButton, this.inputWrapper.container);
                }
                if (this.showSpinButton) {
                    this.spinDown = this.container.querySelector('.' + SPINDOWN);
                    this.spinUp = this.container.querySelector('.' + SPINUP);
                    this.wireSpinBtnEvents();
                }
                sf.inputs.Input.bindInitialEvent({
                    element: this.element, buttons: null, customTag: null, floatLabelType: this.floatLabelType, properties: this.properties
                });
            }
            this.wireEvents();
            if (!(sf.base.isBlazor() && this.isServerRendered)) {
                if (this.value !== null && !isNaN(this.value)) {
                    if (this.decimals) {
                        this.setProperties({ value: this.roundNumber(this.value, this.decimals) }, true);
                    }
                }
                if (this.element.getAttribute('value') || this.value) {
                    this.element.setAttribute('value', this.element.value);
                    this.hiddenInput.setAttribute('value', this.hiddenInput.value);
                }
            }
            this.elementPrevValue = this.element.value;
            if (this.element.hasAttribute('data-val')) {
                this.element.setAttribute('data-val', 'false');
            }
            this.renderComplete();
        }
    };
    NumericTextBox.prototype.checkAttributes = function (isDynamic) {
        var attributes$$1 = isDynamic ? sf.base.isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['value', 'min', 'max', 'step', 'disabled', 'readonly', 'style', 'name', 'placeholder'];
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!sf.base.isNullOrUndefined(this.element.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['enabled'] === undefined)) || isDynamic) {
                            var enabled = this.element.getAttribute(prop) === 'disabled' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['readonly'] === undefined)) || isDynamic) {
                            var readonly = this.element.getAttribute(prop) === 'readonly' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.element.placeholder }, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['value'] === undefined)) || isDynamic) {
                            var setNumber = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            this.setProperties(sf.base.setValue(prop, setNumber, {}), !isDynamic);
                        }
                        break;
                    case 'min':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['min'] === undefined)) || isDynamic) {
                            var minValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (minValue !== null && !isNaN(minValue)) {
                                this.setProperties(sf.base.setValue(prop, minValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'max':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['max'] === undefined)) || isDynamic) {
                            var maxValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (maxValue !== null && !isNaN(maxValue)) {
                                this.setProperties(sf.base.setValue(prop, maxValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'step':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['step'] === undefined)) || isDynamic) {
                            var stepValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (stepValue !== null && !isNaN(stepValue)) {
                                this.setProperties(sf.base.setValue(prop, stepValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'style':
                        this.inputStyle = this.element.getAttribute(prop);
                        break;
                    case 'name':
                        this.inputName = this.element.getAttribute(prop);
                        break;
                    default:
                        var value = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                        if ((value !== null && !isNaN(value)) || (prop === 'value')) {
                            this.setProperties(sf.base.setValue(prop, value, {}), true);
                        }
                        break;
                }
            }
        }
    };
    NumericTextBox.prototype.updatePlaceholder = function () {
        this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
    };
    NumericTextBox.prototype.initCultureFunc = function () {
        this.instance = new sf.base.Internationalization(this.locale);
    };
    NumericTextBox.prototype.initCultureInfo = function () {
        this.cultureInfo.format = this.format;
        if (sf.base.getValue('currency', this) !== null) {
            sf.base.setValue('currency', this.currency, this.cultureInfo);
            this.setProperties({ currencyCode: this.currency }, true);
        }
    };
    /* Wrapper creation */
    NumericTextBox.prototype.createWrapper = function () {
        var updatedCssClassValue = this.cssClass;
        if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValue = this.getNumericValidClassList(this.cssClass);
        }
        var inputObj = sf.inputs.Input.createInput({
            element: this.element,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: updatedCssClassValue,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
                enabled: this.enabled
            }
        }, this.createElement);
        this.inputWrapper = inputObj;
        this.container = inputObj.container;
        this.container.setAttribute('class', ROOT + ' ' + this.container.getAttribute('class'));
        this.updateHTMLAttrToWrapper();
        if (this.readonly) {
            sf.base.attributes(this.element, { 'aria-readonly': 'true' });
        }
        this.hiddenInput = (this.createElement('input', { attrs: { type: 'text',
                'validateHidden': 'true', 'class': HIDDENELEMENT } }));
        this.inputName = this.inputName !== null ? this.inputName : this.element.id;
        this.element.removeAttribute('name');
        sf.base.attributes(this.hiddenInput, { 'name': this.inputName });
        this.container.insertBefore(this.hiddenInput, this.container.childNodes[1]);
        this.updateDataAttribute(false);
        if (this.inputStyle !== null) {
            sf.base.attributes(this.container, { 'style': this.inputStyle });
        }
    };
    NumericTextBox.prototype.updateDataAttribute = function (isDynamic) {
        var attr = {};
        if (!isDynamic) {
            for (var a = 0; a < this.element.attributes.length; a++) {
                attr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        else {
            attr = this.htmlAttributes;
        }
        for (var _i = 0, _a = Object.keys(attr); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.indexOf('data') === 0) {
                this.hiddenInput.setAttribute(key, attr[key]);
            }
        }
    };
    NumericTextBox.prototype.updateHTMLAttrToElement = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var pro = _a[_i];
                if (wrapperAttributes.indexOf(pro) < 0) {
                    this.element.setAttribute(pro, this.htmlAttributes[pro]);
                }
            }
        }
    };
    NumericTextBox.prototype.updateCssClass = function (newClass, oldClass) {
        sf.inputs.Input.setCssClass(this.getNumericValidClassList(newClass), [this.container], this.getNumericValidClassList(oldClass));
    };
    NumericTextBox.prototype.getNumericValidClassList = function (numericClassName) {
        var result = numericClassName;
        if (!sf.base.isNullOrUndefined(numericClassName) && numericClassName !== '') {
            result = (numericClassName.replace(/\s+/g, ' ')).trim();
        }
        return result;
    };
    NumericTextBox.prototype.updateHTMLAttrToWrapper = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var pro = _a[_i];
                if (wrapperAttributes.indexOf(pro) > -1) {
                    if (pro === 'class') {
                        var updatedClassValue = this.getNumericValidClassList(this.htmlAttributes[pro]);
                        if (updatedClassValue !== '') {
                            sf.base.addClass([this.container], updatedClassValue.split(' '));
                        }
                    }
                    else if (pro === 'style') {
                        var numericStyle = this.container.getAttribute(pro);
                        numericStyle = !sf.base.isNullOrUndefined(numericStyle) ? (numericStyle + this.htmlAttributes[pro]) :
                            this.htmlAttributes[pro];
                        this.container.setAttribute(pro, numericStyle);
                    }
                    else {
                        this.container.setAttribute(pro, this.htmlAttributes[pro]);
                    }
                }
            }
        }
    };
    NumericTextBox.prototype.setElementWidth = function (width) {
        if (!sf.base.isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.container.style.width = sf.base.formatUnit(width);
            }
            else if (typeof width === 'string') {
                this.container.style.width = (width.match(/px|%|em/)) ? (width) : (sf.base.formatUnit(width));
            }
        }
    };
    /* Spinner creation */
    NumericTextBox.prototype.spinBtnCreation = function () {
        this.spinDown = sf.inputs.Input.appendSpan(SPINICON + ' ' + SPINDOWN, this.container, this.createElement);
        sf.base.attributes(this.spinDown, {
            'title': this.l10n.getConstant('decrementTitle'),
            'aria-label': this.l10n.getConstant('decrementTitle')
        });
        this.spinUp = sf.inputs.Input.appendSpan(SPINICON + ' ' + SPINUP, this.container, this.createElement);
        sf.base.attributes(this.spinUp, {
            'title': this.l10n.getConstant('incrementTitle'),
            'aria-label': this.l10n.getConstant('incrementTitle')
        });
        this.wireSpinBtnEvents();
    };
    NumericTextBox.prototype.validateMinMax = function () {
        if (!(typeof (this.min) === 'number' && !isNaN(this.min))) {
            this.setProperties({ min: -(Number.MAX_VALUE) }, true);
        }
        if (!(typeof (this.max) === 'number' && !isNaN(this.max))) {
            this.setProperties({ max: Number.MAX_VALUE }, true);
        }
        if (this.decimals !== null) {
            if (this.min !== -(Number.MAX_VALUE)) {
                this.setProperties({ min: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.min)) }, true);
            }
            if (this.max !== (Number.MAX_VALUE)) {
                this.setProperties({ max: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.max)) }, true);
            }
        }
        this.setProperties({ min: this.min > this.max ? this.max : this.min }, true);
        sf.base.attributes(this.element, { 'aria-valuemin': this.min.toString(), 'aria-valuemax': this.max.toString() });
    };
    NumericTextBox.prototype.formattedValue = function (decimals, value) {
        return this.instance.getNumberFormat({
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals, useGrouping: false
        })(value);
    };
    NumericTextBox.prototype.validateStep = function () {
        if (this.decimals !== null) {
            this.setProperties({ step: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.step)) }, true);
        }
    };
    NumericTextBox.prototype.action = function (operation, event) {
        this.isInteract = true;
        var value = this.isFocused ? this.instance.getNumberParser({ format: 'n' })(this.element.value) : this.value;
        this.changeValue(this.performAction(value, this.step, operation));
        this.raiseChangeEvent(event);
    };
    NumericTextBox.prototype.checkErrorClass = function () {
        if (this.isValidState) {
            sf.base.removeClass([this.container], ERROR);
        }
        else {
            sf.base.addClass([this.container], ERROR);
        }
        sf.base.attributes(this.element, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
    };
    NumericTextBox.prototype.bindClearEvent = function () {
        if (this.showClearButton) {
            sf.base.EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    };
    NumericTextBox.prototype.resetHandler = function (e) {
        e.preventDefault();
        if (!(this.inputWrapper.clearButton.classList.contains('e-clear-icon-hide'))) {
            this.clear(e);
        }
        this.isInteract = true;
        this.raiseChangeEvent(e);
    };
    NumericTextBox.prototype.clear = function (event) {
        this.setProperties({ value: null }, true);
        this.setElementValue('');
        this.hiddenInput.value = '';
        var formElement = sf.base.closest(this.element, 'form');
        if (formElement) {
            var element = this.element.nextElementSibling;
            var keyupEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    };
    NumericTextBox.prototype.resetFormHandler = function () {
        if (this.element.tagName === 'EJS-NUMERICTEXTBOX') {
            this.updateValue(null);
        }
        else {
            this.updateValue(this.inputEleValue);
        }
    };
    NumericTextBox.prototype.setSpinButton = function () {
        if (!sf.base.isNullOrUndefined(this.spinDown)) {
            sf.base.attributes(this.spinDown, {
                'title': this.l10n.getConstant('decrementTitle'),
                'aria-label': this.l10n.getConstant('decrementTitle')
            });
        }
        if (!sf.base.isNullOrUndefined(this.spinUp)) {
            sf.base.attributes(this.spinUp, {
                'title': this.l10n.getConstant('incrementTitle'),
                'aria-label': this.l10n.getConstant('incrementTitle')
            });
        }
    };
    NumericTextBox.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'focus', this.focusHandler, this);
        sf.base.EventHandler.add(this.element, 'blur', this.focusOutHandler, this);
        sf.base.EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
        sf.base.EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        sf.base.EventHandler.add(this.element, 'input', this.inputHandler, this);
        sf.base.EventHandler.add(this.element, 'keypress', this.keyPressHandler, this);
        sf.base.EventHandler.add(this.element, 'change', this.changeHandler, this);
        sf.base.EventHandler.add(this.element, 'paste', this.pasteHandler, this);
        if (this.enabled) {
            this.bindClearEvent();
            if (this.formEle) {
                sf.base.EventHandler.add(this.formEle, 'reset', this.resetFormHandler, this);
            }
        }
    };
    NumericTextBox.prototype.wireSpinBtnEvents = function () {
        /* bind spin button events */
        sf.base.EventHandler.add(this.spinUp, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        sf.base.EventHandler.add(this.spinDown, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        sf.base.EventHandler.add(this.spinUp, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        sf.base.EventHandler.add(this.spinDown, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        sf.base.EventHandler.add(this.spinUp, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
        sf.base.EventHandler.add(this.spinDown, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
    };
    NumericTextBox.prototype.unwireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'focus', this.focusHandler);
        sf.base.EventHandler.remove(this.element, 'blur', this.focusOutHandler);
        sf.base.EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        sf.base.EventHandler.remove(this.element, 'input', this.inputHandler);
        sf.base.EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
        sf.base.EventHandler.remove(this.element, 'keypress', this.keyPressHandler);
        sf.base.EventHandler.remove(this.element, 'change', this.changeHandler);
        sf.base.EventHandler.remove(this.element, 'paste', this.pasteHandler);
        if (this.formEle) {
            sf.base.EventHandler.remove(this.formEle, 'reset', this.resetFormHandler);
        }
    };
    NumericTextBox.prototype.unwireSpinBtnEvents = function () {
        /* unbind spin button events */
        sf.base.EventHandler.remove(this.spinUp, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner);
        sf.base.EventHandler.remove(this.spinDown, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner);
        sf.base.EventHandler.remove(this.spinUp, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner);
        sf.base.EventHandler.remove(this.spinDown, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner);
        sf.base.EventHandler.remove(this.spinUp, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner);
        sf.base.EventHandler.remove(this.spinDown, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner);
    };
    NumericTextBox.prototype.changeHandler = function (event) {
        event.stopPropagation();
        if (!this.element.value.length) {
            this.setProperties({ value: null }, true);
        }
        var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        this.updateValue(parsedInput, event);
    };
    NumericTextBox.prototype.raiseChangeEvent = function (event) {
        if (this.prevValue !== this.value) {
            var eventArgs = {};
            this.changeEventArgs = { value: this.value, previousValue: this.prevValue, isInteracted: this.isInteract,
                isInteraction: this.isInteract, event: event };
            if (event) {
                this.changeEventArgs.event = event;
            }
            if (this.changeEventArgs.event === undefined) {
                this.changeEventArgs.isInteracted = false;
                this.changeEventArgs.isInteraction = false;
            }
            sf.base.merge(eventArgs, this.changeEventArgs);
            this.prevValue = this.value;
            this.isInteract = false;
            this.elementPrevValue = this.element.value;
            this.preventChange = false;
            this.trigger('change', eventArgs);
        }
    };
    NumericTextBox.prototype.pasteHandler = function () {
        var _this = this;
        if (!this.enabled || this.readonly) {
            return;
        }
        var beforeUpdate = this.element.value;
        setTimeout(function () {
            if (!_this.numericRegex().test(_this.element.value)) {
                _this.setElementValue(beforeUpdate);
            }
        });
    };
    NumericTextBox.prototype.preventHandler = function () {
        var _this = this;
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        setTimeout(function () {
            if (_this.element.selectionStart > 0) {
                var currentPos = _this.element.selectionStart;
                var prevPos = _this.element.selectionStart - 1;
                var start = 0;
                var ignoreKeyCode = void 0;
                var valArray = _this.element.value.split('');
                var numericObject = sf.base.getNumericObject(_this.locale);
                var decimalSeparator = sf.base.getValue('decimal', numericObject);
                ignoreKeyCode = decimalSeparator.charCodeAt(0);
                if (_this.element.value[prevPos] === ' ' && _this.element.selectionStart > 0 && !iOS) {
                    if (sf.base.isNullOrUndefined(_this.prevVal)) {
                        _this.element.value = _this.element.value.trim();
                    }
                    else if (prevPos !== 0) {
                        _this.element.value = _this.prevVal;
                    }
                    else if (prevPos === 0) {
                        _this.element.value = _this.element.value.trim();
                    }
                    _this.element.setSelectionRange(prevPos, prevPos);
                }
                else if (isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 1])) &&
                    _this.element.value[_this.element.selectionStart - 1].charCodeAt(0) !== 45) {
                    if ((valArray.indexOf(_this.element.value[_this.element.selectionStart - 1]) !==
                        valArray.lastIndexOf(_this.element.value[_this.element.selectionStart - 1]) &&
                        _this.element.value[_this.element.selectionStart - 1].charCodeAt(0) === ignoreKeyCode) ||
                        _this.element.value[_this.element.selectionStart - 1].charCodeAt(0) !== ignoreKeyCode) {
                        _this.element.value = _this.element.value.substring(0, prevPos) +
                            _this.element.value.substring(currentPos, _this.element.value.length);
                        _this.element.setSelectionRange(prevPos, prevPos);
                        if (isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 1])) && _this.element.selectionStart > 0
                            && _this.element.value.length) {
                            _this.preventHandler();
                        }
                    }
                }
                else if (isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 2])) && _this.element.selectionStart > 1 &&
                    _this.element.value[_this.element.selectionStart - 2].charCodeAt(0) !== 45) {
                    if ((valArray.indexOf(_this.element.value[_this.element.selectionStart - 2]) !==
                        valArray.lastIndexOf(_this.element.value[_this.element.selectionStart - 2]) &&
                        _this.element.value[_this.element.selectionStart - 2].charCodeAt(0) === ignoreKeyCode) ||
                        _this.element.value[_this.element.selectionStart - 2].charCodeAt(0) !== ignoreKeyCode) {
                        _this.element.setSelectionRange(prevPos, prevPos);
                        _this.nextEle = _this.element.value[_this.element.selectionStart];
                        _this.cursorPosChanged = true;
                        _this.preventHandler();
                    }
                }
                if (_this.cursorPosChanged === true && _this.element.value[_this.element.selectionStart] === _this.nextEle &&
                    isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 1]))) {
                    _this.element.setSelectionRange(_this.element.selectionStart + 1, _this.element.selectionStart + 1);
                    _this.cursorPosChanged = false;
                    _this.nextEle = null;
                }
                if (_this.element.value.trim() === '') {
                    _this.element.setSelectionRange(start, start);
                }
                if (_this.element.selectionStart > 0) {
                    if ((_this.element.value[_this.element.selectionStart - 1].charCodeAt(0) === 45) && _this.element.selectionStart > 1) {
                        if (sf.base.isNullOrUndefined(_this.prevVal)) {
                            _this.element.value = _this.element.value;
                        }
                        else {
                            _this.element.value = _this.prevVal;
                        }
                        _this.element.setSelectionRange(_this.element.selectionStart, _this.element.selectionStart);
                    }
                }
                _this.prevVal = _this.element.value;
            }
        });
    };
    NumericTextBox.prototype.keyUpHandler = function (event) {
        if (!this.enabled || this.readonly) {
            return;
        }
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (!iOS && sf.base.Browser.isDevice) {
            this.preventHandler();
        }
        var parseValue = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        parseValue = parseValue === null || isNaN(parseValue) ? null : parseValue;
        this.hiddenInput.value = parseValue || parseValue === 0 ? parseValue.toString() : null;
        var formElement = sf.base.closest(this.element, 'form');
        if (formElement) {
            var element = this.element.nextElementSibling;
            var keyupEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    };
    
    NumericTextBox.prototype.inputHandler = function (event) {
        if (!this.enabled || this.readonly) {
            return;
        }
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        var fireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if ((fireFox || iOS) && sf.base.Browser.isDevice) {
            this.preventHandler();
        }
        if (this.isVue) {
            var current = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            var previous = this.instance.getNumberParser({ format: 'n' })(this.elementPrevValue);
            var eventArgs = {
                event: event,
                value: (current === null || isNaN(current) ? null : current),
                previousValue: (previous === null || isNaN(previous) ? null : previous)
            };
            this.preventChange = true;
            this.elementPrevValue = this.element.value;
            this.trigger('input', eventArgs);
        }
    };
    
    NumericTextBox.prototype.keyDownHandler = function (event) {
        if (!this.readonly) {
            switch (event.keyCode) {
                case 38:
                    event.preventDefault();
                    this.action(INCREMENT, event);
                    break;
                case 40:
                    event.preventDefault();
                    this.action(DECREMENT, event);
                    break;
                default: break;
            }
        }
    };
    
    NumericTextBox.prototype.performAction = function (value, step, operation) {
        if (value === null || isNaN(value)) {
            value = 0;
        }
        var updatedValue = operation === INCREMENT ? value + step : value - step;
        updatedValue = this.correctRounding(value, step, updatedValue);
        return this.strictMode ? this.trimValue(updatedValue) : updatedValue;
    };
    
    NumericTextBox.prototype.correctRounding = function (value, step, result) {
        var floatExp = new RegExp('[,.](.*)');
        var valueText = value.toString();
        var stepText = step.toString();
        var floatValue = floatExp.test(value.toString());
        var floatStep = floatExp.test(step.toString());
        if (floatValue || floatStep) {
            var valueCount = floatValue ? floatExp.exec(value.toString())[0].length : 0;
            var stepCount = floatStep ? floatExp.exec(step.toString())[0].length : 0;
            var max = Math.max(valueCount, stepCount);
            return value = this.roundValue(result, max);
        }
        return result;
    };
    
    NumericTextBox.prototype.roundValue = function (result, precision) {
        precision = precision || 0;
        var divide = Math.pow(10, precision);
        return result *= divide, result = Math.round(result) / divide;
    };
    
    NumericTextBox.prototype.updateValue = function (value, event) {
        if (event) {
            this.isInteract = true;
        }
        if (value !== null && !isNaN(value)) {
            if (this.decimals) {
                value = this.roundNumber(value, this.decimals);
            }
        }
        this.changeValue(value === null || isNaN(value) ? null : this.strictMode ? this.trimValue(value) : value);
        if ((!this.isVue) || (this.isVue && !this.preventChange)) {
            this.raiseChangeEvent(event);
        }
    };
    NumericTextBox.prototype.updateCurrency = function (prop, propVal) {
        sf.base.setValue(prop, propVal, this.cultureInfo);
        this.updateValue(this.value);
    };
    NumericTextBox.prototype.changeValue = function (value) {
        if (!(value || value === 0)) {
            value = null;
            this.setProperties({ value: value }, true);
        }
        else {
            var numberOfDecimals = void 0;
            numberOfDecimals = this.getNumberOfDecimals(value);
            this.setProperties({ value: this.roundNumber(value, numberOfDecimals) }, true);
        }
        this.modifyText();
        if (!this.strictMode) {
            this.validateState();
        }
    };
    
    NumericTextBox.prototype.modifyText = function () {
        if (this.value || this.value === 0) {
            var value = this.formatNumber();
            var elementValue = this.isFocused ? value : this.instance.getNumberFormat(this.cultureInfo)(this.value);
            this.setElementValue(elementValue);
            sf.base.attributes(this.element, { 'aria-valuenow': value });
            this.hiddenInput.value = this.value.toString();
            if (this.value !== null && this.serverDecimalSeparator) {
                this.hiddenInput.value = this.hiddenInput.value.replace('.', this.serverDecimalSeparator);
            }
        }
        else {
            this.setElementValue('');
            this.element.removeAttribute('aria-valuenow');
            this.hiddenInput.value = null;
        }
    };
    
    NumericTextBox.prototype.setElementValue = function (val, element) {
        sf.inputs.Input.setValue(val, (element ? element : this.element), this.floatLabelType, this.showClearButton);
    };
    NumericTextBox.prototype.validateState = function () {
        this.isValidState = true;
        if (this.value || this.value === 0) {
            this.isValidState = !(this.value > this.max || this.value < this.min);
        }
        this.checkErrorClass();
    };
    NumericTextBox.prototype.getNumberOfDecimals = function (value) {
        var numberOfDecimals;
        var EXPREGEXP = new RegExp('[eE][\-+]?([0-9]+)');
        var valueString = value.toString();
        if (EXPREGEXP.test(valueString)) {
            var result = EXPREGEXP.exec(valueString);
            if (!sf.base.isNullOrUndefined(result)) {
                valueString = value.toFixed(Math.min(parseInt(result[1], 10), 20));
            }
        }
        var decimalPart = valueString.split('.')[1];
        numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        if (this.decimals !== null) {
            numberOfDecimals = numberOfDecimals < this.decimals ? numberOfDecimals : this.decimals;
        }
        return numberOfDecimals;
    };
    NumericTextBox.prototype.formatNumber = function () {
        var numberOfDecimals;
        numberOfDecimals = this.getNumberOfDecimals(this.value);
        return this.instance.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(this.value);
    };
    
    NumericTextBox.prototype.trimValue = function (value) {
        if (value > this.max) {
            return this.max;
        }
        if (value < this.min) {
            return this.min;
        }
        return value;
    };
    
    NumericTextBox.prototype.roundNumber = function (value, precision) {
        var result = value;
        var decimals = precision || 0;
        var result1 = result.toString().split('e');
        result = Math.round(Number(result1[0] + 'e' + (result1[1] ? (Number(result1[1]) + decimals) : decimals)));
        var result2 = result.toString().split('e');
        result = Number(result2[0] + 'e' + (result2[1] ? (Number(result2[1]) - decimals) : -decimals));
        return Number(result.toFixed(decimals));
    };
    
    NumericTextBox.prototype.cancelEvent = function (event) {
        event.preventDefault();
        return false;
    };
    NumericTextBox.prototype.keyPressHandler = function (event) {
        if (!this.enabled || this.readonly) {
            return true;
        }
        if (!sf.base.Browser.isDevice && sf.base.Browser.info.version === '11.0' && event.keyCode === 13) {
            var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput, event);
            return true;
        }
        if (event.which === 0 || event.metaKey || event.ctrlKey || event.keyCode === 8 || event.keyCode === 13) {
            return true;
        }
        var currentChar = String.fromCharCode(event.which);
        var text = this.element.value;
        text = text.substring(0, this.element.selectionStart) + currentChar + text.substring(this.element.selectionEnd);
        if (!this.numericRegex().test(text)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        else {
            return true;
        }
    };
    
    NumericTextBox.prototype.numericRegex = function () {
        var numericObject = sf.base.getNumericObject(this.locale);
        var decimalSeparator = sf.base.getValue('decimal', numericObject);
        var fractionRule = '*';
        if (decimalSeparator === DECIMALSEPARATOR) {
            decimalSeparator = '\\' + decimalSeparator;
        }
        if (this.decimals === 0 && this.validateDecimalOnType) {
            return INTREGEXP;
        }
        if (this.decimals && this.validateDecimalOnType) {
            fractionRule = '{0,' + this.decimals + '}';
        }
        return new RegExp('^(-)?(((\\d+(' + decimalSeparator + '\\d' + fractionRule +
            ')?)|(' + decimalSeparator + '\\d' + fractionRule + ')))?$');
    };
    
    NumericTextBox.prototype.mouseWheel = function (event) {
        event.preventDefault();
        var delta;
        var rawEvent = event;
        if (rawEvent.wheelDelta) {
            delta = rawEvent.wheelDelta / 120;
        }
        else if (rawEvent.detail) {
            delta = -rawEvent.detail / 3;
        }
        if (delta > 0) {
            this.action(INCREMENT, event);
        }
        else if (delta < 0) {
            this.action(DECREMENT, event);
        }
        this.cancelEvent(event);
    };
    NumericTextBox.prototype.focusHandler = function (event) {
        var _this = this;
        this.focusEventArgs = { event: event, value: this.value, container: this.container };
        this.trigger('focus', this.focusEventArgs);
        if (!this.enabled || this.readonly) {
            return;
        }
        this.isFocused = true;
        sf.base.removeClass([this.container], ERROR);
        this.prevValue = this.value;
        if ((this.value || this.value === 0)) {
            var formatValue_1 = this.formatNumber();
            this.setElementValue(formatValue_1);
            if (!this.isPrevFocused) {
                if (!sf.base.Browser.isDevice && sf.base.Browser.info.version === '11.0') {
                    this.element.setSelectionRange(0, formatValue_1.length);
                }
                else {
                    var delay = (sf.base.Browser.isDevice && sf.base.Browser.isIos) ? 600 : 0;
                    setTimeout(function () {
                        _this.element.setSelectionRange(0, formatValue_1.length);
                    }, delay);
                }
            }
        }
        if (!sf.base.Browser.isDevice) {
            sf.base.EventHandler.add(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel, this);
        }
    };
    
    NumericTextBox.prototype.focusOutHandler = function (event) {
        var _this = this;
        this.blurEventArgs = { event: event, value: this.value, container: this.container };
        this.trigger('blur', this.blurEventArgs);
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.isPrevFocused) {
            event.preventDefault();
            if (sf.base.Browser.isDevice) {
                var value_1 = this.element.value;
                this.element.focus();
                this.isPrevFocused = false;
                var ele_1 = this.element;
                setTimeout(function () {
                    _this.setElementValue(value_1, ele_1);
                }, 200);
            }
        }
        else {
            this.isFocused = false;
            if (!this.element.value.length) {
                this.setProperties({ value: null }, true);
            }
            var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput);
            if (!sf.base.Browser.isDevice) {
                sf.base.EventHandler.remove(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel);
            }
        }
        var formElement = sf.base.closest(this.element, 'form');
        if (formElement) {
            var element = this.element.nextElementSibling;
            var focusEvent = document.createEvent('FocusEvent');
            focusEvent.initEvent('focusout', false, true);
            element.dispatchEvent(focusEvent);
        }
    };
    
    NumericTextBox.prototype.mouseDownOnSpinner = function (event) {
        var _this = this;
        if (this.isFocused) {
            this.isPrevFocused = true;
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        var result = this.getElementData(event);
        var target = event.currentTarget;
        var action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        sf.base.EventHandler.add(target, 'mouseleave', this.mouseUpClick, this);
        this.timeOut = setInterval(function () { _this.isCalled = true; _this.action(action, event); }, 150);
        sf.base.EventHandler.add(document, 'mouseup', this.mouseUpClick, this);
    };
    NumericTextBox.prototype.touchMoveOnSpinner = function (event) {
        var target = document.elementFromPoint(event.clientX, event.clientY);
        if (!(target.classList.contains(SPINICON))) {
            clearInterval(this.timeOut);
        }
    };
    NumericTextBox.prototype.mouseUpOnSpinner = function (event) {
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
        var action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        sf.base.EventHandler.remove(target, 'mouseleave', this.mouseUpClick);
        if (!this.isCalled) {
            this.action(action, event);
        }
        this.isCalled = false;
        sf.base.EventHandler.remove(document, 'mouseup', this.mouseUpClick);
        var formElement = sf.base.closest(this.element, 'form');
        if (formElement) {
            var element = this.element.nextElementSibling;
            var keyupEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    };
    NumericTextBox.prototype.getElementData = function (event) {
        if ((event.which && event.which === 3) || (event.button && event.button === 2)
            || !this.enabled || this.readonly) {
            return false;
        }
        clearInterval(this.timeOut);
        return true;
    };
    NumericTextBox.prototype.floatLabelTypeUpdate = function () {
        sf.inputs.Input.removeFloating(this.inputWrapper);
        var hiddenInput = this.hiddenInput;
        this.hiddenInput.remove();
        sf.inputs.Input.addFloating(this.element, this.floatLabelType, this.placeholder, this.createElement);
        this.container.insertBefore(hiddenInput, this.container.childNodes[1]);
    };
    NumericTextBox.prototype.mouseUpClick = function (event) {
        event.stopPropagation();
        clearInterval(this.timeOut);
        this.isCalled = false;
        sf.base.EventHandler.remove(this.spinUp, 'mouseleave', this.mouseUpClick);
        sf.base.EventHandler.remove(this.spinDown, 'mouseleave', this.mouseUpClick);
    };
    /**
     * Increments the NumericTextBox value with the specified step value.
     * @param  {number} step - Specifies the value used to increment the NumericTextBox value.
     * if its not given then numeric value will be incremented based on the step property value.
     */
    NumericTextBox.prototype.increment = function (step) {
        if (step === void 0) { step = this.step; }
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, INCREMENT));
        this.raiseChangeEvent();
    };
    /**
     * Decrements the NumericTextBox value with specified step value.
     * @param  {number} step - Specifies the value used to decrement the NumericTextBox value.
     * if its not given then numeric value will be decremented based on the step property value.
     */
    NumericTextBox.prototype.decrement = function (step) {
        if (step === void 0) { step = this.step; }
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, DECREMENT));
        this.raiseChangeEvent();
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    NumericTextBox.prototype.destroy = function () {
        this.unwireEvents();
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            sf.base.detach(this.hiddenInput);
            if (this.showSpinButton) {
                this.unwireSpinBtnEvents();
                sf.base.detach(this.spinUp);
                sf.base.detach(this.spinDown);
            }
            var attrArray = ['aria-labelledby', 'role', 'autocomplete', 'aria-readonly',
                'autocorrect', 'aria-disabled', 'aria-placeholder', 'autocapitalize',
                'spellcheck', 'aria-autocomplete', 'tabindex', 'aria-valuemin',
                'aria-valuemax', 'aria-live', 'aria-valuenow', 'aria-invalid'];
            for (var i = 0; i < attrArray.length; i++) {
                this.element.removeAttribute(attrArray[i]);
            }
            this.element.classList.remove('e-input');
            this.container.insertAdjacentElement('afterend', this.element);
            sf.base.detach(this.container);
            _super.prototype.destroy.call(this);
        }
    };
    /**
     * Returns the value of NumericTextBox with the format applied to the NumericTextBox.
     */
    NumericTextBox.prototype.getText = function () {
        return this.element.value;
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    NumericTextBox.prototype.focusIn = function () {
        if (document.activeElement !== this.element && this.enabled) {
            this.element.focus();
            sf.base.addClass([this.container], [NUMERIC_FOCUS]);
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    NumericTextBox.prototype.focusOut = function () {
        if (document.activeElement === this.element && this.enabled) {
            this.element.blur();
            sf.base.removeClass([this.container], [NUMERIC_FOCUS]);
        }
    };
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    NumericTextBox.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    NumericTextBox.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                    this.setElementWidth(newProp.width);
                    break;
                case 'cssClass':
                    this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
                case 'enabled':
                    sf.inputs.Input.setEnabled(newProp.enabled, this.element);
                    break;
                case 'enableRtl':
                    sf.inputs.Input.setEnableRtl(newProp.enableRtl, [this.container]);
                    break;
                case 'readonly':
                    sf.inputs.Input.setReadonly(newProp.readonly, this.element);
                    if (this.readonly) {
                        sf.base.attributes(this.element, { 'aria-readonly': 'true' });
                    }
                    else {
                        this.element.removeAttribute('aria-readonly');
                    }
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttrToElement();
                    this.updateHTMLAttrToWrapper();
                    this.updateDataAttribute(true);
                    this.checkAttributes(true);
                    sf.inputs.Input.validateInputType(this.container, this.element);
                    break;
                case 'placeholder':
                    sf.inputs.Input.setPlaceholder(newProp.placeholder, this.element);
                    break;
                case 'step':
                    this.step = newProp.step;
                    this.validateStep();
                    break;
                case 'showSpinButton':
                    this.updateSpinButton(newProp);
                    break;
                case 'showClearButton':
                    this.updateClearButton(newProp);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    this.floatLabelTypeUpdate();
                    break;
                case 'value':
                    this.updateValue(newProp.value);
                    if (this.isVue && this.preventChange) {
                        this.preventChange = false;
                    }
                    break;
                case 'min':
                case 'max':
                    sf.base.setValue(prop, sf.base.getValue(prop, newProp), this);
                    this.validateMinMax();
                    this.updateValue(this.value);
                    break;
                case 'strictMode':
                    this.strictMode = newProp.strictMode;
                    this.updateValue(this.value);
                    this.validateState();
                    break;
                case 'locale':
                    this.initCultureFunc();
                    this.l10n.setLocale(this.locale);
                    this.setSpinButton();
                    this.updatePlaceholder();
                    sf.inputs.Input.setPlaceholder(this.placeholder, this.element);
                    this.updateValue(this.value);
                    break;
                case 'currency':
                    var propVal = sf.base.getValue(prop, newProp);
                    this.setProperties({ currencyCode: propVal }, true);
                    this.updateCurrency(prop, propVal);
                    break;
                case 'currencyCode':
                    var propValue = sf.base.getValue(prop, newProp);
                    this.setProperties({ currency: propValue }, true);
                    this.updateCurrency('currency', propValue);
                    break;
                case 'format':
                    sf.base.setValue(prop, sf.base.getValue(prop, newProp), this);
                    this.initCultureInfo();
                    this.updateValue(this.value);
                    break;
                case 'decimals':
                    this.decimals = newProp.decimals;
                    this.updateValue(this.value);
            }
        }
    };
    NumericTextBox.prototype.updateClearButton = function (newProp) {
        if (sf.base.isBlazor()) {
            if (this.showClearButton) {
                this.inputWrapper.clearButton = this.container.querySelector('.e-clear-icon');
                sf.inputs.Input.wireClearBtnEvents(this.element, this.inputWrapper.clearButton, this.inputWrapper.container);
            }
        }
        else {
            sf.inputs.Input.setClearButton(newProp.showClearButton, this.element, this.inputWrapper, undefined, this.createElement);
            this.bindClearEvent();
        }
    };
    NumericTextBox.prototype.updateSpinButton = function (newProp) {
        if (sf.base.isBlazor()) {
            if (this.showSpinButton) {
                this.spinDown = this.container.querySelector('.' + SPINDOWN);
                this.spinUp = this.container.querySelector('.' + SPINUP);
                this.wireSpinBtnEvents();
            }
        }
        else {
            if (newProp.showSpinButton) {
                this.spinBtnCreation();
            }
            else {
                sf.base.detach(this.spinUp);
                sf.base.detach(this.spinDown);
            }
        }
    };
    /**
     * Gets the component name
     * @private
     */
    NumericTextBox.prototype.getModuleName = function () {
        return 'numerictextbox';
    };
    __decorate([
        sf.base.Property('')
    ], NumericTextBox.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "value", void 0);
    __decorate([
        sf.base.Property(-(Number.MAX_VALUE))
    ], NumericTextBox.prototype, "min", void 0);
    __decorate([
        sf.base.Property(Number.MAX_VALUE)
    ], NumericTextBox.prototype, "max", void 0);
    __decorate([
        sf.base.Property(1)
    ], NumericTextBox.prototype, "step", void 0);
    __decorate([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "width", void 0);
    __decorate([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "placeholder", void 0);
    __decorate([
        sf.base.Property({})
    ], NumericTextBox.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property(true)
    ], NumericTextBox.prototype, "showSpinButton", void 0);
    __decorate([
        sf.base.Property(false)
    ], NumericTextBox.prototype, "readonly", void 0);
    __decorate([
        sf.base.Property(true)
    ], NumericTextBox.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property(false)
    ], NumericTextBox.prototype, "showClearButton", void 0);
    __decorate([
        sf.base.Property(false)
    ], NumericTextBox.prototype, "enablePersistence", void 0);
    __decorate([
        sf.base.Property('n2')
    ], NumericTextBox.prototype, "format", void 0);
    __decorate([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "decimals", void 0);
    __decorate([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "currency", void 0);
    __decorate([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "currencyCode", void 0);
    __decorate([
        sf.base.Property(true)
    ], NumericTextBox.prototype, "strictMode", void 0);
    __decorate([
        sf.base.Property(false)
    ], NumericTextBox.prototype, "validateDecimalOnType", void 0);
    __decorate([
        sf.base.Property('Never')
    ], NumericTextBox.prototype, "floatLabelType", void 0);
    __decorate([
        sf.base.Event()
    ], NumericTextBox.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], NumericTextBox.prototype, "destroyed", void 0);
    __decorate([
        sf.base.Event()
    ], NumericTextBox.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], NumericTextBox.prototype, "focus", void 0);
    __decorate([
        sf.base.Event()
    ], NumericTextBox.prototype, "blur", void 0);
    NumericTextBox = __decorate([
        sf.base.NotifyPropertyChanges
    ], NumericTextBox);
    return NumericTextBox;
}(sf.base.Component));

/**
 * NumericTextBox modules
 */

exports.NumericTextBox = NumericTextBox;

return exports;

});

    sf.inputs = sf.base.extend({}, sf.inputs, sfnumerictextbox({}));