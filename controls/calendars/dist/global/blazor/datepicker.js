window.sf = window.sf || {};
var sfdatepicker = (function (exports) {
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
/// <reference path='../calendar/calendar-model.d.ts'/>
// tslint:disable-next-line
//class constant defination
var DATEWRAPPER = 'e-date-wrapper';
var ROOT = 'e-datepicker';
var LIBRARY = 'e-lib';
var CONTROL = 'e-control';
var POPUPWRAPPER = 'e-popup-wrapper';
var INPUTWRAPPER = 'e-input-group-icon';
var POPUP = 'e-popup';
var INPUTCONTAINER = 'e-input-group';
var INPUTFOCUS = 'e-input-focus';
var INPUTROOT = 'e-input';
var ERROR = 'e-error';
var ACTIVE = 'e-active';
var OVERFLOW = 'e-date-overflow';
var DATEICON = 'e-date-icon';
var CLEARICON = 'e-clear-icon';
var ICONS = 'e-icons';
var OPENDURATION = 300;
var OFFSETVALUE = 4;
var SELECTED = 'e-selected';
var FOCUSEDDATE = 'e-focused-date';
var NONEDIT = 'e-non-edit';
var containerAttr = ['title', 'class', 'style'];
/**
 * Represents the DatePicker component that allows user to select
 * or enter a date value.
 * ```html
 * <input id='datepicker'/>
 * ```
 * ```typescript
 * <script>
 *   let datePickerObject:DatePicker = new DatePicker({ value: new Date() });
 *   datePickerObject.appendTo('#datepicker');
 * </script>
 * ```
 */
var DatePicker = /** @class */ (function (_super) {
    __extends(DatePicker, _super);
    /**
     * Constructor for creating the widget.
     */
    function DatePicker(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.previousElementValue = '';
        _this.isDateIconClicked = false;
        _this.isAltKeyPressed = false;
        _this.isInteracted = true;
        _this.isBlazorServer = false;
        _this.invalidValueString = null;
        _this.checkPreviousValue = null;
        _this.isAngular = false;
        _this.preventChange = false;
        _this.isIconClicked = false;
        _this.datepickerOptions = options;
        return _this;
    }
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    DatePicker.prototype.render = function () {
        this.initialize();
        this.bindEvents();
        this.renderComplete();
        if (!this.isBlazorServer) {
            this.setTimeZone(this.serverTimezoneOffset);
        }
    };
    DatePicker.prototype.setTimeZone = function (offsetValue) {
        if (!sf.base.isNullOrUndefined(this.serverTimezoneOffset) && this.value) {
            var clientTimeZoneDiff = new Date().getTimezoneOffset() / 60;
            var serverTimezoneDiff = offsetValue;
            var timeZoneDiff = serverTimezoneDiff + clientTimeZoneDiff;
            timeZoneDiff = this.isDayLightSaving() ? timeZoneDiff-- : timeZoneDiff;
            this.value = new Date((this.value).getTime() + (timeZoneDiff * 60 * 60 * 1000));
            this.updateInput();
        }
    };
    DatePicker.prototype.isDayLightSaving = function () {
        var firstOffset = new Date(this.value.getFullYear(), 0, 1).getTimezoneOffset();
        var secondOffset = new Date(this.value.getFullYear(), 6, 1).getTimezoneOffset();
        return (this.value.getTimezoneOffset() < Math.max(firstOffset, secondOffset));
    };
    DatePicker.prototype.setAllowEdit = function () {
        if (this.allowEdit) {
            if (!this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        }
        else {
            sf.base.attributes(this.inputElement, { 'readonly': '' });
        }
        this.updateIconState();
    };
    DatePicker.prototype.updateIconState = function () {
        if (!this.allowEdit && this.inputWrapper && !this.readonly) {
            if (this.inputElement.value === '') {
                sf.base.removeClass([this.inputWrapper.container], [NONEDIT]);
            }
            else {
                sf.base.addClass([this.inputWrapper.container], [NONEDIT]);
            }
        }
        else if (this.inputWrapper) {
            sf.base.removeClass([this.inputWrapper.container], [NONEDIT]);
        }
    };
    DatePicker.prototype.initialize = function () {
        if (!this.isBlazorServer) {
            this.checkInvalidValue(this.value);
            this.createInput();
            this.updateHtmlAttributeToWrapper();
            this.setAllowEdit();
            this.updateInput();
        }
        else {
            var parentElement = this.element.parentElement;
            this.inputWrapper = {
                container: parentElement,
                clearButton: parentElement.querySelector('.' + CLEARICON),
                buttons: [parentElement.querySelector('.' + DATEICON)]
            };
            sf.inputs.Input.bindInitialEvent({
                element: this.inputElement,
                floatLabelType: this.floatLabelType
            });
            if (this.showClearButton && this.inputWrapper.clearButton) {
                sf.inputs.Input.wireClearBtnEvents(this.inputElement, this.inputWrapper.clearButton, this.inputWrapper.container);
            }
            this.setAllowEdit();
        }
        this.previousElementValue = this.inputElement.value;
        this.previousDate = !sf.base.isNullOrUndefined(this.value) ? new Date(+this.value) : null;
        this.inputElement.setAttribute('value', this.inputElement.value);
        this.inputValueCopy = this.value;
    };
    DatePicker.prototype.createInput = function () {
        var ariaAttrs = {
            'aria-live': 'assertive', 'aria-atomic': 'true',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-invalid': 'false'
        };
        if (this.getModuleName() === 'datepicker') {
            var l10nLocale = { placeholder: this.placeholder };
            this.globalize = new sf.base.Internationalization(this.locale);
            this.l10n = new sf.base.L10n('datepicker', l10nLocale, this.locale);
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
        var updatedCssClassValues = this.cssClass;
        if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValues = (this.cssClass.replace(/\s+/g, ' ')).trim();
        }
        this.inputWrapper = sf.inputs.Input.createInput({
            element: this.inputElement,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: updatedCssClassValues,
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
            },
            buttons: [INPUTWRAPPER + ' ' + DATEICON + ' ' + ICONS]
        }, this.createElement);
        this.setWidth(this.width);
        if (this.inputElement.name !== '') {
            this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute('name'));
        }
        else {
            this.inputElement.setAttribute('name', '' + this.element.id);
        }
        sf.base.attributes(this.inputElement, ariaAttrs);
        if (!this.enabled) {
            this.inputElement.setAttribute('aria-disabled', 'true');
            this.inputElement.tabIndex = -1;
        }
        else {
            this.inputElement.setAttribute('aria-disabled', 'false');
            this.inputElement.setAttribute('tabindex', this.tabIndex);
        }
        sf.inputs.Input.addAttributes({ 'aria-label': 'select' }, this.inputWrapper.buttons[0]);
        sf.base.addClass([this.inputWrapper.container], DATEWRAPPER);
    };
    DatePicker.prototype.updateInput = function () {
        var formatOptions;
        if (this.value && !this.isCalendar()) {
            if (!this.isBlazorServer) {
                this.disabledDates();
            }
        }
        if (isNaN(+new Date(this.checkValue(this.value)))) {
            this.setProperties({ value: null }, true);
        }
        if (this.strictMode) {
            //calls the Calendar processDate protected method to update the date value according to the strictMode true behaviour.
            _super.prototype.validateDate.call(this);
            this.minMaxUpdates();
            _super.prototype.minMaxUpdate.call(this);
        }
        if (!sf.base.isNullOrUndefined(this.value)) {
            var dateValue = this.value;
            var dateString = void 0;
            var tempFormat = !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat;
            if (this.getModuleName() === 'datetimepicker') {
                if (this.calendarMode === 'Gregorian') {
                    dateString = this.globalize.formatDate(this.value, {
                        format: tempFormat, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd'
                    });
                }
                else {
                    dateString = this.globalize.formatDate(this.value, {
                        format: tempFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                    });
                }
            }
            else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
                }
                else {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                dateString = this.globalize.formatDate(this.value, formatOptions);
            }
            if ((+dateValue <= +this.max) && (+dateValue >= +this.min)) {
                this.updateInputValue(dateString);
            }
            else {
                var value = (+dateValue >= +this.max || !+this.value) || (!+this.value || +dateValue <= +this.min);
                if (!this.strictMode && value) {
                    this.updateInputValue(dateString);
                }
            }
        }
        if (sf.base.isNullOrUndefined(this.value) && this.strictMode) {
            this.updateInputValue('');
        }
        if (!this.strictMode && sf.base.isNullOrUndefined(this.value) && this.invalidValueString) {
            this.updateInputValue(this.invalidValueString);
        }
        this.changedArgs = { value: this.value };
        this.errorClass();
        this.updateIconState();
    };
    
    DatePicker.prototype.minMaxUpdates = function () {
        if (!sf.base.isNullOrUndefined(this.value) && this.value < this.min && this.min <= this.max && this.strictMode) {
            this.setProperties({ value: this.min }, true);
            this.changedArgs = { value: this.value };
        }
        else {
            if (!sf.base.isNullOrUndefined(this.value) && this.value > this.max && this.min <= this.max && this.strictMode) {
                this.setProperties({ value: this.max }, true);
                this.changedArgs = { value: this.value };
            }
        }
    };
    DatePicker.prototype.checkStringValue = function (val) {
        var returnDate = null;
        var formatOptions = null;
        var formatDateTime = null;
        if (this.getModuleName() === 'datetimepicker') {
            var culture = new sf.base.Internationalization(this.locale);
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
                formatDateTime = { format: culture.getDatePattern({ skeleton: sf.base.isBlazor() ? 'd' : 'yMd' }), type: 'dateTime' };
            }
            else {
                formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime', calendar: 'islamic' };
            }
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
            }
            else {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
        }
        returnDate = this.checkDateValue(this.globalize.parseDate(val, formatOptions));
        if (sf.base.isNullOrUndefined(returnDate) && (this.getModuleName() === 'datetimepicker')) {
            returnDate = this.checkDateValue(this.globalize.parseDate(val, formatDateTime));
        }
        return returnDate;
    };
    DatePicker.prototype.checkInvalidValue = function (value) {
        if (!(value instanceof Date) && !sf.base.isNullOrUndefined(value)) {
            var valueDate = null;
            var valueString = value;
            if (typeof value === 'number') {
                valueString = value.toString();
            }
            var formatOptions = null;
            var formatDateTime = null;
            if (this.getModuleName() === 'datetimepicker') {
                var culture = new sf.base.Internationalization(this.locale);
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
                    formatDateTime = { format: culture.getDatePattern({ skeleton: sf.base.isBlazor() ? 'd' : 'yMd' }), type: 'dateTime' };
                }
                else {
                    formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                    formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime', calendar: 'islamic' };
                }
            }
            else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
                }
                else {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
            }
            var invalid = false;
            if (typeof valueString !== 'string') {
                valueString = null;
                invalid = true;
            }
            else {
                if (typeof valueString === 'string') {
                    valueString = valueString.trim();
                }
                valueDate = this.checkStringValue(valueString);
                if (!valueDate) {
                    var extISOString = null;
                    var basicISOString = null;
                    // tslint:disable-next-line
                    extISOString = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                    // tslint:disable-next-line
                    basicISOString = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                    if ((!extISOString.test(valueString) && !basicISOString.test(valueString))
                        || (/^[a-zA-Z0-9- ]*$/).test(valueString) || isNaN(+new Date(this.checkValue(valueString)))) {
                        invalid = true;
                    }
                    else {
                        valueDate = new Date(valueString);
                    }
                }
            }
            if (invalid) {
                if (!this.strictMode) {
                    this.invalidValueString = valueString;
                }
                this.setProperties({ value: null }, true);
            }
            else {
                this.setProperties({ value: valueDate }, true);
            }
        }
    };
    
    DatePicker.prototype.bindInputEvent = function () {
        if (!sf.base.isNullOrUndefined(this.formatString)) {
            if (this.formatString.indexOf('y') === -1) {
                sf.base.EventHandler.add(this.inputElement, 'input', this.inputHandler, this);
            }
            else {
                sf.base.EventHandler.remove(this.inputElement, 'input', this.inputHandler);
            }
        }
    };
    DatePicker.prototype.bindEvents = function () {
        sf.base.EventHandler.add(this.inputWrapper.buttons[0], 'mousedown touchstart', (this.isBlazorServer ? this.preventEventBubbling : this.dateIconHandler), this);
        sf.base.EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
        sf.base.EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
        this.bindInputEvent();
        // To prevent the twice triggering.
        sf.base.EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
        if (this.showClearButton && (this.inputWrapper.clearButton || (this.isBlazorServer))) {
            sf.base.EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
        if (this.formElement) {
            sf.base.EventHandler.add(this.formElement, 'reset', this.resetFormHandler, this);
        }
        this.defaultKeyConfigs = sf.base.extend(this.defaultKeyConfigs, this.keyConfigs);
        this.keyboardModules = new sf.base.KeyboardEvents(this.inputElement, {
            eventName: 'keydown',
            keyAction: this.inputKeyActionHandle.bind(this),
            keyConfigs: this.defaultKeyConfigs
        });
    };
    DatePicker.prototype.unBindEvents = function () {
        sf.base.EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', (this.isBlazorServer ? this.preventEventBubbling : this.dateIconHandler));
        sf.base.EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
        sf.base.EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
        sf.base.EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
        if (this.showClearButton && (this.inputWrapper.clearButton || (this.isBlazorServer))) {
            sf.base.EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
        }
        if (this.formElement) {
            sf.base.EventHandler.remove(this.formElement, 'reset', this.resetFormHandler);
        }
    };
    DatePicker.prototype.resetFormHandler = function () {
        if (!this.enabled) {
            return;
        }
        if (!this.inputElement.disabled) {
            var value = this.inputElement.getAttribute('value');
            if (this.element.tagName === 'EJS-DATEPICKER' || this.element.tagName === 'EJS-DATETIMEPICKER') {
                value = '';
                this.inputValueCopy = null;
                this.inputElement.setAttribute('value', '');
            }
            if (!this.isBlazorServer) {
                this.setProperties({ value: this.inputValueCopy }, true);
                this.restoreValue();
                if (this.inputElement) {
                    this.updateInputValue(value);
                    this.errorClass();
                }
            }
        }
    };
    DatePicker.prototype.restoreValue = function () {
        this.currentDate = this.value ? this.value : new Date();
        this.previousDate = this.value;
        this.previousElementValue = (sf.base.isNullOrUndefined(this.inputValueCopy)) ? '' :
            this.globalize.formatDate(this.inputValueCopy, {
                format: this.formatString, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd'
            });
    };
    DatePicker.prototype.inputChangeHandler = function (e) {
        if (!this.enabled) {
            return;
        }
        e.stopPropagation();
    };
    DatePicker.prototype.bindClearEvent = function () {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            sf.base.EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    };
    DatePicker.prototype.resetHandler = function (e) {
        if (!this.enabled) {
            return;
        }
        e.preventDefault();
        this.clear(e);
    };
    DatePicker.prototype.clear = function (event) {
        if (!this.isBlazorServer) {
            this.setProperties({ value: null }, true);
        }
        this.updateInputValue('');
        var clearedArgs = {
            event: event
        };
        this.trigger('cleared', clearedArgs);
        this.invalidValueString = '';
        if (!this.isBlazorServer) {
            this.updateInput();
            this.popupUpdate();
            this.changeEvent(event);
        }
        if (this.isBlazorServer) {
            // tslint:disable
            this.interopAdaptor.invokeMethodAsync('OnValueCleared');
            // tslint:enable
        }
    };
    DatePicker.prototype.preventEventBubbling = function (e) {
        e.preventDefault();
        // tslint:disable
        this.interopAdaptor.invokeMethodAsync('OnDateIconClick');
        // tslint:enable
    };
    DatePicker.prototype.updateInputValue = function (value) {
        sf.inputs.Input.setValue(value, this.inputElement, this.floatLabelType, this.showClearButton);
    };
    DatePicker.prototype.dateIconHandler = function (e) {
        if (!this.enabled) {
            return;
        }
        this.isIconClicked = true;
        if (sf.base.Browser.isDevice) {
            this.inputElement.setAttribute('readonly', '');
            this.inputElement.blur();
        }
        if (!this.isBlazorServer) {
            e.preventDefault();
        }
        if (!this.readonly) {
            if (this.isCalendar() && !this.isBlazorServer) {
                this.hide(e);
            }
            else {
                if (!this.isBlazorServer || (this.isBlazorServer && this.inputWrapper.container.nextElementSibling)) {
                    this.isDateIconClicked = true;
                    this.show(null, e);
                    if (this.getModuleName() === 'datetimepicker') {
                        this.inputElement.focus();
                    }
                    this.inputElement.focus();
                    sf.base.addClass([this.inputWrapper.container], [INPUTFOCUS]);
                    sf.base.addClass(this.inputWrapper.buttons, ACTIVE);
                }
            }
        }
        this.isIconClicked = false;
    };
    DatePicker.prototype.updateHtmlAttributeToWrapper = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (!sf.base.isNullOrUndefined(this.htmlAttributes[key])) {
                    if (containerAttr.indexOf(key) > -1) {
                        if (key === 'class') {
                            var updatedClassValues = (this.htmlAttributes[key].replace(/\s+/g, ' ')).trim();
                            if (updatedClassValues !== '') {
                                sf.base.addClass([this.inputWrapper.container], updatedClassValues.split(' '));
                            }
                        }
                        else if (key === 'style') {
                            var setStyle = this.inputWrapper.container.getAttribute(key);
                            if (!sf.base.isNullOrUndefined(setStyle)) {
                                if (setStyle.charAt(setStyle.length - 1) === ';') {
                                    setStyle = setStyle + this.htmlAttributes[key];
                                }
                                else {
                                    setStyle = setStyle + ';' + this.htmlAttributes[key];
                                }
                            }
                            else {
                                setStyle = this.htmlAttributes[key];
                            }
                            this.inputWrapper.container.setAttribute(key, setStyle);
                        }
                        else {
                            this.inputWrapper.container.setAttribute(key, this.htmlAttributes[key]);
                        }
                    }
                }
            }
        }
    };
    DatePicker.prototype.updateHtmlAttributeToElement = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (containerAttr.indexOf(key) < 0) {
                    this.inputElement.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    };
    DatePicker.prototype.updateCssClass = function (newCssClass, oldCssClass) {
        if (!sf.base.isNullOrUndefined(oldCssClass)) {
            oldCssClass = (oldCssClass.replace(/\s+/g, ' ')).trim();
        }
        if (!sf.base.isNullOrUndefined(newCssClass)) {
            newCssClass = (newCssClass.replace(/\s+/g, ' ')).trim();
        }
        sf.inputs.Input.setCssClass(newCssClass, [this.inputWrapper.container], oldCssClass);
        if (this.popupWrapper) {
            sf.inputs.Input.setCssClass(newCssClass, [this.popupWrapper], oldCssClass);
        }
    };
    DatePicker.prototype.CalendarKeyActionHandle = function (e) {
        switch (e.action) {
            case 'escape':
                if (this.isCalendar()) {
                    this.hide(e);
                }
                else {
                    this.inputWrapper.container.children[this.index].blur();
                }
                break;
            case 'enter':
                if (!this.isCalendar()) {
                    this.show(null, e);
                }
                else {
                    if (+this.value !== +this.currentDate && !this.isCalendar()) {
                        this.inputWrapper.container.children[this.index].focus();
                    }
                }
                if (this.getModuleName() === 'datetimepicker') {
                    this.inputElement.focus();
                }
                break;
            case 'tab':
                this.hide(e);
        }
    };
    DatePicker.prototype.inputFocusHandler = function () {
        if (!this.enabled) {
            return;
        }
        var focusArguments = {
            model: sf.base.isBlazor() && this.isServerRendered ? null : this
        };
        this.isDateIconClicked = false;
        this.trigger('focus', focusArguments);
        this.updateIconState();
        if (this.openOnFocus && !this.isIconClicked) {
            this.show();
        }
    };
    DatePicker.prototype.inputHandler = function (e) {
        this.isPopupClicked = false;
    };
    DatePicker.prototype.inputBlurHandler = function (e) {
        if (!this.enabled) {
            return;
        }
        if (!this.isBlazorServer) {
            this.strictModeUpdate();
            if (this.inputElement.value === '' && sf.base.isNullOrUndefined(this.value)) {
                this.invalidValueString = null;
                this.updateInputValue('');
            }
            this.updateInput();
            this.popupUpdate();
            this.changeTrigger(e);
            this.errorClass();
        }
        else {
            // tslint:disable
            this.interopAdaptor.invokeMethodAsync('OnStrictModeUpdate', this.inputElement.value);
            // tslint:enable
        }
        if (this.isCalendar() && document.activeElement === this.inputElement) {
            this.hide(e);
        }
        if (this.getModuleName() === 'datepicker') {
            var blurArguments = {
                model: sf.base.isBlazor() && this.isServerRendered ? null : this
            };
            this.trigger('blur', blurArguments);
        }
        if (this.isCalendar()) {
            this.defaultKeyConfigs = sf.base.extend(this.defaultKeyConfigs, this.keyConfigs);
            this.calendarKeyboardModules = new sf.base.KeyboardEvents(this.calendarElement.children[1].firstElementChild, {
                eventName: 'keydown',
                keyAction: this.CalendarKeyActionHandle.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        }
        this.isPopupClicked = false;
    };
    DatePicker.prototype.documentHandler = function (e) {
        if ((!sf.base.isNullOrUndefined(this.popupObj) && (this.inputWrapper.container.contains(e.target) ||
            (this.popupObj.element && this.popupObj.element.contains(e.target)))) && e.type !== 'touchstart') {
            e.preventDefault();
        }
        var target = e.target;
        if (!(sf.base.closest(target, '.e-datepicker.e-popup-wrapper'))
            && !(sf.base.closest(target, '.' + INPUTCONTAINER) === this.inputWrapper.container)
            && (!target.classList.contains('e-day'))) {
            this.hide(e);
            this.focusOut();
        }
        else if (sf.base.closest(target, '.e-datepicker.e-popup-wrapper')) {
            // Fix for close the popup when select the previously selected value.
            if (target.classList.contains('e-day')
                && !sf.base.isNullOrUndefined(e.target.parentElement)
                && e.target.parentElement.classList.contains('e-selected')
                && sf.base.closest(target, '.e-content')
                && sf.base.closest(target, '.e-content').classList.contains('e-' + this.depth.toLowerCase())) {
                this.hide(e);
            }
            else if (sf.base.closest(target, '.e-footer-container')
                && target.classList.contains('e-today')
                && target.classList.contains('e-btn')
                && (+new Date(+this.value) === +_super.prototype.generateTodayVal.call(this, this.value) && !this.isBlazorServer)) {
                this.hide(e);
            }
        }
    };
    DatePicker.prototype.inputKeyActionHandle = function (e) {
        var clickedView = this.currentView();
        switch (e.action) {
            case 'altUpArrow':
                this.isAltKeyPressed = false;
                this.hide(e);
                this.inputElement.focus();
                break;
            case 'altDownArrow':
                this.isAltKeyPressed = true;
                if (!this.isBlazorServer) {
                    this.strictModeUpdate();
                    this.updateInput();
                    this.changeTrigger(e);
                }
                else {
                    // tslint:disable
                    this.interopAdaptor.invokeMethodAsync('OnStrictModeUpdate', this.inputElement.value);
                    // tslint:enable
                }
                if (this.getModuleName() === 'datepicker') {
                    if (!this.isBlazorServer) {
                        this.show(null, e);
                    }
                    else {
                        // tslint:disable
                        this.interopAdaptor.invokeMethodAsync('OnPopupHide', true);
                        // tslint:enable
                    }
                }
                break;
            case 'escape':
                this.hide(e);
                break;
            case 'enter':
                if (!this.isBlazorServer) {
                    this.strictModeUpdate();
                    this.updateInput();
                    this.popupUpdate();
                    this.changeTrigger(e);
                    this.errorClass();
                }
                else {
                    // tslint:disable
                    this.interopAdaptor.invokeMethodAsync('OnStrictModeUpdate', this.inputElement.value);
                    // tslint:enable
                }
                if (!this.isCalendar() && document.activeElement === this.inputElement) {
                    this.hide(e);
                }
                if (this.isCalendar()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
            case 'tab':
            case 'shiftTab':
                if (!this.isBlazorServer) {
                    this.strictModeUpdate();
                    this.updateInput();
                    this.popupUpdate();
                    this.changeTrigger(e);
                    this.errorClass();
                }
                else {
                    // tslint:disable
                    this.interopAdaptor.invokeMethodAsync('OnStrictModeUpdate', this.inputElement.value);
                    // tslint:enable
                }
                this.hide(e);
                break;
            default:
                this.defaultAction(e);
                // Fix for close the popup when select the previously selected value.
                if (e.action === 'select' && clickedView === this.depth) {
                    this.hide(e);
                }
        }
    };
    DatePicker.prototype.defaultAction = function (e) {
        this.previousDate = ((!sf.base.isNullOrUndefined(this.value) && new Date(+this.value)) || null);
        if (this.isCalendar()) {
            _super.prototype.keyActionHandle.call(this, e);
            if (!this.isBlazorServer) {
                sf.base.attributes(this.inputElement, {
                    'aria-activedescendant': '' + this.setActiveDescendant()
                });
            }
        }
    };
    DatePicker.prototype.popupUpdate = function () {
        if ((sf.base.isNullOrUndefined(this.value)) && (!sf.base.isNullOrUndefined(this.previousDate)) ||
            (+this.value !== +this.previousDate)) {
            if (this.popupObj) {
                if (this.popupObj.element.querySelectorAll('.' + SELECTED).length > 0) {
                    sf.base.removeClass(this.popupObj.element.querySelectorAll('.' + SELECTED), [SELECTED]);
                }
            }
            if (!sf.base.isNullOrUndefined(this.value) && !this.isBlazorServer) {
                if ((+this.value >= +this.min) && (+this.value <= +this.max)) {
                    var targetdate = new Date(this.checkValue(this.value));
                    _super.prototype.navigateTo.call(this, 'Month', targetdate);
                }
            }
        }
    };
    DatePicker.prototype.strictModeUpdate = function () {
        var format;
        var formatOptions;
        if (this.getModuleName() === 'datetimepicker') {
            format = !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat;
        }
        else {
            format = sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.formatString.replace('dd', 'd');
        }
        if (!sf.base.isNullOrUndefined(format)) {
            var len = format.split('M').length - 1;
            if (len < 3) {
                format = format.replace('MM', 'M');
            }
        }
        var dateOptions;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                dateOptions = {
                    format: !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd'
                };
            }
            else {
                dateOptions = {
                    format: !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                };
            }
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: format, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
            }
            else {
                formatOptions = { format: format, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
            dateOptions = formatOptions;
        }
        var date;
        if (typeof this.inputElement.value === 'string') {
            this.inputElement.value = this.inputElement.value.trim();
        }
        if ((this.getModuleName() === 'datetimepicker')) {
            if (this.checkDateValue(this.globalize.parseDate(this.inputElement.value, dateOptions))) {
                date = this.globalize.parseDate(this.inputElement.value, dateOptions);
            }
            else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
                }
                else {
                    formatOptions = { type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.parseDate(this.inputElement.value, formatOptions);
            }
        }
        else {
            date = this.globalize.parseDate(this.inputElement.value, dateOptions);
            if (!sf.base.isNullOrUndefined(this.formatString) && this.inputElement.value !== '' && this.strictMode) {
                if ((this.isPopupClicked || (!this.isPopupClicked && this.inputElement.value === this.previousElementValue))
                    && this.formatString.indexOf('y') === -1) {
                    date.setFullYear(this.value.getFullYear());
                }
            }
        }
        // EJ2-35061 - To prevent change event from triggering twice when using strictmode and format property
        if ((this.getModuleName() === 'datepicker') && (this.value && !isNaN(+this.value)) && date) {
            date.setHours(this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
        }
        if (this.strictMode && date) {
            this.updateInputValue(this.globalize.formatDate(date, dateOptions));
            if (this.inputElement.value !== this.previousElementValue) {
                this.setProperties({ value: date }, true);
            }
        }
        else if (!this.strictMode) {
            if (this.inputElement.value !== this.previousElementValue) {
                this.setProperties({ value: date }, true);
            }
        }
        if (this.strictMode && !date && this.inputElement.value === '') {
            this.setProperties({ value: null }, true);
        }
        if (isNaN(+this.value)) {
            this.setProperties({ value: null }, true);
        }
        if (sf.base.isNullOrUndefined(this.value)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
        }
    };
    DatePicker.prototype.createCalendar = function () {
        var _this = this;
        if (!this.isBlazorServer) {
            this.popupWrapper = this.createElement('div', { className: '' + ROOT + ' ' + POPUPWRAPPER });
            if (!sf.base.isNullOrUndefined(this.cssClass)) {
                this.popupWrapper.className += ' ' + this.cssClass;
            }
        }
        else {
            this.popupWrapper = this.inputWrapper.container.nextElementSibling;
            this.calendarElement = this.popupWrapper.firstElementChild;
            this.tableBodyElement = sf.base.select('tbody', this.calendarElement);
            this.contentElement = sf.base.select('.e-content', this.calendarElement);
        }
        if (sf.base.Browser.isDevice) {
            this.modelHeader();
            this.modal = this.createElement('div');
            this.modal.className = '' + ROOT + ' e-date-modal';
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        //this.calendarElement represent the Calendar object from the Calendar class.
        this.calendarElement.querySelector('table tbody').className = '';
        this.popupObj = new sf.popups.Popup(this.popupWrapper, {
            content: this.isBlazorServer ? null : this.calendarElement,
            relateTo: sf.base.Browser.isDevice ? document.body : this.inputWrapper.container,
            position: sf.base.Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            offsetY: OFFSETVALUE,
            targetType: 'container',
            enableRtl: this.enableRtl,
            zIndex: this.zIndex,
            collision: sf.base.Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            open: function () {
                if (_this.getModuleName() !== 'datetimepicker') {
                    if (document.activeElement !== _this.inputElement) {
                        _this.defaultKeyConfigs = sf.base.extend(_this.defaultKeyConfigs, _this.keyConfigs);
                        _this.calendarElement.children[1].firstElementChild.focus();
                        _this.calendarKeyboardModules = new sf.base.KeyboardEvents(_this.calendarElement.children[1].firstElementChild, {
                            eventName: 'keydown',
                            keyAction: _this.CalendarKeyActionHandle.bind(_this),
                            keyConfigs: _this.defaultKeyConfigs
                        });
                        _this.calendarKeyboardModules = new sf.base.KeyboardEvents(_this.inputWrapper.container.children[_this.index], {
                            eventName: 'keydown',
                            keyAction: _this.CalendarKeyActionHandle.bind(_this),
                            keyConfigs: _this.defaultKeyConfigs
                        });
                    }
                }
            }, close: function () {
                if (_this.isDateIconClicked) {
                    _this.inputWrapper.container.children[_this.index].focus();
                }
                if (_this.value && !_this.isBlazorServer) {
                    _this.disabledDates();
                }
                if (_this.popupObj) {
                    _this.popupObj.destroy();
                }
                sf.base.detach(_this.popupWrapper);
                _this.popupObj = _this.popupWrapper = null;
                _this.setAriaAttributes();
            }, targetExitViewport: function () {
                if (!sf.base.Browser.isDevice) {
                    _this.hide();
                }
            }
        });
        if (!this.isBlazorServer) {
            this.popupObj.element.className += ' ' + this.cssClass;
        }
        this.setAriaAttributes();
    };
    DatePicker.prototype.setAriaDisabled = function () {
        if (!this.enabled) {
            this.inputElement.setAttribute('aria-disabled', 'true');
            this.inputElement.tabIndex = -1;
        }
        else {
            this.inputElement.setAttribute('aria-disabled', 'false');
            this.inputElement.setAttribute('tabindex', this.tabIndex);
        }
    };
    DatePicker.prototype.modelHeader = function () {
        var dateOptions;
        var modelHeader = this.createElement('div', { className: 'e-model-header' });
        var yearHeading = this.createElement('h1', { className: 'e-model-year' });
        var h2 = this.createElement('div');
        var daySpan = this.createElement('span', { className: 'e-model-day' });
        var monthSpan = this.createElement('span', { className: 'e-model-month' });
        if (this.calendarMode === 'Gregorian') {
            dateOptions = { format: 'y', skeleton: 'dateTime' };
        }
        else {
            dateOptions = { format: 'y', skeleton: 'dateTime', calendar: 'islamic' };
        }
        yearHeading.textContent = '' + this.globalize.formatDate(this.value || new Date(), dateOptions);
        if (this.calendarMode === 'Gregorian') {
            dateOptions = { format: 'E', skeleton: 'dateTime' };
        }
        else {
            dateOptions = { format: 'E', skeleton: 'dateTime', calendar: 'islamic' };
        }
        daySpan.textContent = '' + this.globalize.formatDate(this.value || new Date(), dateOptions) + ', ';
        if (this.calendarMode === 'Gregorian') {
            dateOptions = { format: 'MMM d', skeleton: 'dateTime' };
        }
        else {
            dateOptions = { format: 'MMM d', skeleton: 'dateTime', calendar: 'islamic' };
        }
        monthSpan.textContent = '' + this.globalize.formatDate(this.value || new Date(), dateOptions);
        modelHeader.appendChild(yearHeading);
        h2.appendChild(daySpan);
        h2.appendChild(monthSpan);
        modelHeader.appendChild(h2);
        this.calendarElement.insertBefore(modelHeader, this.calendarElement.firstElementChild);
    };
    DatePicker.prototype.changeTrigger = function (event) {
        if (this.inputElement.value !== this.previousElementValue) {
            if (((this.previousDate && this.previousDate.valueOf()) !== (this.value && this.value.valueOf()))) {
                this.changedArgs.value = this.value;
                this.changedArgs.event = event || null;
                this.changedArgs.element = this.element;
                this.changedArgs.isInteracted = !sf.base.isNullOrUndefined(event);
                if (this.isAngular && this.preventChange) {
                    this.preventChange = false;
                }
                else {
                    this.trigger('change', this.changedArgs);
                }
                this.previousElementValue = this.inputElement.value;
                this.previousDate = !isNaN(+new Date(this.checkValue(this.value))) ? new Date(this.checkValue(this.value)) : null;
                this.isInteracted = true;
            }
        }
    };
    DatePicker.prototype.navigatedEvent = function () {
        this.trigger('navigated', this.navigatedArgs);
    };
    DatePicker.prototype.changeEvent = function (event) {
        if (((this.previousDate && this.previousDate.valueOf()) !== (this.value && this.value.valueOf()))) {
            this.selectCalendar(event);
            this.changedArgs.event = event ? event : null;
            this.changedArgs.element = this.element;
            this.changedArgs.isInteracted = this.isInteracted;
            this.trigger('change', this.changedArgs);
            this.previousDate = this.value && new Date(+this.value);
            this.hide(event);
            this.previousElementValue = this.inputElement.value;
            this.errorClass();
        }
    };
    DatePicker.prototype.requiredModules = function () {
        var modules = [];
        if (this) {
            modules.push({ args: [this], member: 'islamic' });
        }
        return modules;
    };
    DatePicker.prototype.selectCalendar = function (e) {
        var date;
        var tempFormat;
        var formatOptions;
        if (this.getModuleName() === 'datetimepicker') {
            tempFormat = !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat;
        }
        else {
            tempFormat = this.formatString;
        }
        if (this.value) {
            if (this.getModuleName() === 'datetimepicker') {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: tempFormat, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
                }
                else {
                    formatOptions = { format: tempFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.formatDate(this.changedArgs.value, formatOptions);
            }
            else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
                }
                else {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.formatDate(this.changedArgs.value, formatOptions);
            }
        }
        if (!sf.base.isNullOrUndefined(date)) {
            this.updateInputValue(date);
        }
    };
    DatePicker.prototype.isCalendar = function () {
        if (this.popupWrapper && this.popupWrapper.classList.contains('' + POPUPWRAPPER)) {
            return true;
        }
        return false;
    };
    DatePicker.prototype.setWidth = function (width) {
        if (typeof width === 'number') {
            this.inputWrapper.container.style.width = sf.base.formatUnit(this.width);
        }
        else if (typeof width === 'string') {
            this.inputWrapper.container.style.width = (width.match(/px|%|em/)) ? (this.width) : (sf.base.formatUnit(this.width));
        }
        else {
            this.inputWrapper.container.style.width = '100%';
        }
    };
    /**
     * Shows the Calendar.
     * @returns void
     * @deprecated
     */
    DatePicker.prototype.show = function (type, e) {
        var _this = this;
        if ((this.enabled && this.readonly) || !this.enabled || this.popupObj) {
            return;
        }
        else {
            var prevent_1 = true;
            var outOfRange = void 0;
            if (!sf.base.isNullOrUndefined(this.value) && !(+this.value >= +this.min && +this.value <= +this.max)) {
                outOfRange = new Date(this.checkValue(this.value));
                if (!this.isBlazorServer) {
                    this.setProperties({ 'value': null }, true);
                }
            }
            else {
                outOfRange = this.value || null;
            }
            if (!this.isCalendar()) {
                if (!this.isBlazorServer) {
                    _super.prototype.render.call(this);
                    this.setProperties({ 'value': outOfRange || null }, true);
                }
                this.previousDate = outOfRange;
                this.createCalendar();
            }
            if (sf.base.Browser.isDevice) {
                this.mobilePopupWrapper = this.createElement('div', { className: 'e-datepick-mob-popup-wrap' });
                document.body.appendChild(this.mobilePopupWrapper);
            }
            this.preventArgs = {
                preventDefault: function () {
                    prevent_1 = false;
                },
                popup: sf.base.isBlazor() && this.isServerRendered ? null : this.popupObj,
                event: e || null,
                cancel: false,
                appendTo: sf.base.Browser.isDevice ? this.mobilePopupWrapper : document.body
            };
            var eventArgs = this.preventArgs;
            this.trigger('open', eventArgs, function (eventArgs) {
                _this.preventArgs = eventArgs;
                if (prevent_1 && !_this.preventArgs.cancel) {
                    if (_this.isBlazorServer) {
                        _this.popupWrapper.style.visibility = '';
                        _this.popupWrapper.style.width = 'auto';
                        _this.popupWrapper.style.height = 'auto';
                    }
                    sf.base.addClass(_this.inputWrapper.buttons, ACTIVE);
                    _this.preventArgs.appendTo.appendChild(_this.popupWrapper);
                    _this.popupObj.refreshPosition(_this.inputElement);
                    var openAnimation = {
                        name: 'FadeIn',
                        duration: sf.base.Browser.isDevice ? 0 : OPENDURATION,
                    };
                    if (_this.zIndex === 1000) {
                        _this.popupObj.show(new sf.base.Animation(openAnimation), _this.element);
                    }
                    else {
                        _this.popupObj.show(new sf.base.Animation(openAnimation), null);
                    }
                    if (!_this.isBlazorServer) {
                        _super.prototype.setOverlayIndex.call(_this, _this.mobilePopupWrapper, _this.popupObj.element, _this.modal, sf.base.Browser.isDevice);
                    }
                    _this.setAriaAttributes();
                }
                else {
                    _this.popupObj.destroy();
                    if (_this.isBlazorServer) {
                        // tslint:disable
                        _this.interopAdaptor.invokeMethodAsync('OnPopupHide', false);
                        // tslint:enable
                    }
                    _this.popupWrapper = _this.popupObj = null;
                }
                if (!sf.base.isNullOrUndefined(_this.inputElement) && _this.inputElement.value === '') {
                    if (!sf.base.isNullOrUndefined(_this.tableBodyElement) && _this.tableBodyElement.querySelectorAll('td.e-selected').length > 0) {
                        sf.base.addClass([_this.tableBodyElement.querySelector('td.e-selected')], FOCUSEDDATE);
                        sf.base.removeClass(_this.tableBodyElement.querySelectorAll('td.e-selected'), SELECTED);
                    }
                }
                sf.base.EventHandler.add(document, 'mousedown touchstart', _this.documentHandler, _this);
            });
        }
    };
    /**
     * Hide the Calendar.
     * @returns void
     * @deprecated
     */
    DatePicker.prototype.hide = function (event) {
        var _this = this;
        if (!sf.base.isNullOrUndefined(this.popupWrapper)) {
            var prevent_2 = true;
            this.preventArgs = {
                preventDefault: function () {
                    prevent_2 = false;
                },
                popup: sf.base.isBlazor() && this.isServerRendered ? null : this.popupObj,
                event: event || null,
                cancel: false
            };
            sf.base.removeClass(this.inputWrapper.buttons, ACTIVE);
            sf.base.removeClass([document.body], OVERFLOW);
            var eventArgs = this.preventArgs;
            if (this.isCalendar()) {
                this.trigger('close', eventArgs, function (eventArgs) {
                    _this.closeEventCallback(prevent_2, eventArgs);
                });
            }
            else {
                this.closeEventCallback(prevent_2, eventArgs);
            }
        }
        else {
            if (sf.base.Browser.isDevice && this.allowEdit && !this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
            this.setAllowEdit();
        }
    };
    DatePicker.prototype.closeEventCallback = function (prevent, eventArgs) {
        this.preventArgs = eventArgs;
        if (this.isCalendar() && (prevent && !this.preventArgs.cancel)) {
            if (!this.isBlazorServer) {
                this.popupObj.hide();
                this.isAltKeyPressed = false;
                this.keyboardModule.destroy();
            }
            else {
                // tslint:disable
                this.interopAdaptor.invokeMethodAsync('OnPopupHide', false);
                // tslint:enable
                this.isAltKeyPressed = false;
                this.popupWrapper = this.popupObj = null;
            }
            sf.base.removeClass(this.inputWrapper.buttons, ACTIVE);
        }
        this.setAriaAttributes();
        if (sf.base.Browser.isDevice && this.modal) {
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
        if (sf.base.Browser.isDevice) {
            if (!sf.base.isNullOrUndefined(this.mobilePopupWrapper)) {
                this.mobilePopupWrapper.remove();
                this.mobilePopupWrapper = null;
            }
        }
        sf.base.EventHandler.remove(document, 'mousedown touchstart', this.documentHandler);
        if (sf.base.Browser.isDevice && this.allowEdit && !this.readonly) {
            this.inputElement.removeAttribute('readonly');
        }
        this.setAllowEdit();
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    DatePicker.prototype.focusIn = function (triggerEvent) {
        if (document.activeElement !== this.inputElement && this.enabled) {
            this.inputElement.focus();
            sf.base.addClass([this.inputWrapper.container], [INPUTFOCUS]);
            
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    DatePicker.prototype.focusOut = function () {
        if (document.activeElement === this.inputElement) {
            sf.base.removeClass([this.inputWrapper.container], [INPUTFOCUS]);
            this.inputElement.blur();
        }
    };
    /**
     * Gets the current view of the DatePicker.
     * @returns string
     * @deprecated
     */
    DatePicker.prototype.currentView = function () {
        var currentView;
        if (this.calendarElement) {
            // calls the Calendar currentView public method
            currentView = _super.prototype.currentView.call(this);
        }
        return currentView;
    };
    /**
     * Navigates to specified month or year or decade view of the DatePicker.
     * @param  {string} view - Specifies the view of the calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     * @deprecated
     */
    DatePicker.prototype.navigateTo = function (view, date) {
        if (this.calendarElement) {
            // calls the Calendar navigateTo public method
            _super.prototype.navigateTo.call(this, view, date);
        }
    };
    /**
     * To destroy the widget.
     * @returns void
     */
    DatePicker.prototype.destroy = function () {
        this.unBindEvents();
        if (!this.isBlazorServer) {
            _super.prototype.destroy.call(this);
            this.keyboardModules.destroy();
            if (this.popupObj && this.popupObj.element.classList.contains(POPUP)) {
                _super.prototype.destroy.call(this);
            }
        }
        var ariaAttrs = {
            'aria-live': 'assertive', 'aria-atomic': 'true', 'aria-disabled': 'true',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        };
        if (this.inputElement) {
            sf.inputs.Input.removeAttributes(ariaAttrs, this.inputElement);
            (!sf.base.isNullOrUndefined(this.inputElementCopy.getAttribute('tabindex'))) ?
                this.inputElement.setAttribute('tabindex', this.tabIndex) : this.inputElement.removeAttribute('tabindex');
            sf.base.EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            sf.base.EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            this.ensureInputAttribute();
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) {
                sf.base.detach(this.popupWrapper);
            }
            this.popupObj = this.popupWrapper = null;
            if (!this.isBlazorServer) {
                this.keyboardModule.destroy();
            }
        }
        if (this.ngTag === null) {
            if (this.inputElement) {
                this.inputWrapper.container.insertAdjacentElement('afterend', this.inputElement);
                sf.base.removeClass([this.inputElement], [INPUTROOT]);
            }
            sf.base.removeClass([this.element], [ROOT]);
            sf.base.detach(this.inputWrapper.container);
        }
        if (this.formElement) {
            sf.base.EventHandler.remove(this.formElement, 'reset', this.resetFormHandler);
        }
    };
    DatePicker.prototype.ensureInputAttribute = function () {
        var prop = [];
        for (var i = 0; i < this.inputElement.attributes.length; i++) {
            prop[i] = this.inputElement.attributes[i].name;
        }
        for (var i = 0; i < prop.length; i++) {
            if (sf.base.isNullOrUndefined(this.inputElementCopy.getAttribute(prop[i]))) {
                if (prop[i].toLowerCase() === 'value') {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(prop[i]);
            }
            else {
                if (prop[i].toLowerCase() === 'value') {
                    this.inputElement.value = this.inputElementCopy.getAttribute(prop[i]);
                }
                this.inputElement.setAttribute(prop[i], this.inputElementCopy.getAttribute(prop[i]));
            }
        }
    };
    /**
     * Initialize the event handler
     * @private
     */
    DatePicker.prototype.preRender = function () {
        this.inputElementCopy = this.element.cloneNode(true);
        sf.base.removeClass([this.inputElementCopy], [ROOT, CONTROL, LIBRARY]);
        this.inputElement = this.element;
        this.formElement = sf.base.closest(this.inputElement, 'form');
        this.index = this.showClearButton ? 2 : 1;
        this.isBlazorServer = (sf.base.isBlazor() && this.isServerRendered && this.getModuleName() === 'datepicker') ? true : false;
        if (!this.isBlazorServer) {
            this.ngTag = null;
            if (this.element.tagName === 'EJS-DATEPICKER' || this.element.tagName === 'EJS-DATETIMEPICKER') {
                this.ngTag = this.element.tagName;
                this.inputElement = this.createElement('input');
                this.element.appendChild(this.inputElement);
            }
            if (this.element.getAttribute('id')) {
                if (this.ngTag !== null) {
                    this.inputElement.id = this.element.getAttribute('id') + '_input';
                }
            }
            else {
                if (this.getModuleName() === 'datetimepicker') {
                    this.element.id = sf.base.getUniqueID('ej2-datetimepicker');
                    if (this.ngTag !== null) {
                        sf.base.attributes(this.inputElement, { 'id': this.element.id + '_input' });
                    }
                }
                else {
                    this.element.id = sf.base.getUniqueID('ej2-datepicker');
                    if (this.ngTag !== null) {
                        sf.base.attributes(this.inputElement, { 'id': this.element.id + '_input' });
                    }
                }
            }
            if (this.ngTag !== null) {
                this.validationAttribute(this.element, this.inputElement);
            }
            this.updateHtmlAttributeToElement();
        }
        this.defaultKeyConfigs = this.getDefaultKeyConfig();
        this.checkHtmlAttributes(false);
        this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
        if (!this.isBlazorServer) {
            this.element.removeAttribute('tabindex');
            _super.prototype.preRender.call(this);
        }
    };
    
    DatePicker.prototype.getDefaultKeyConfig = function () {
        this.defaultKeyConfigs = {
            altUpArrow: 'alt+uparrow',
            altDownArrow: 'alt+downarrow',
            escape: 'escape',
            enter: 'enter',
            controlUp: 'ctrl+38',
            controlDown: 'ctrl+40',
            moveDown: 'downarrow',
            moveUp: 'uparrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            select: 'enter',
            home: 'home',
            end: 'end',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            shiftPageUp: 'shift+pageup',
            shiftPageDown: 'shift+pagedown',
            controlHome: 'ctrl+home',
            controlEnd: 'ctrl+end',
            shiftTab: 'shift+tab',
            tab: 'tab'
        };
        return this.defaultKeyConfigs;
    };
    DatePicker.prototype.validationAttribute = function (target, inputElement) {
        var nameAttribute = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        inputElement.setAttribute('name', nameAttribute);
        target.removeAttribute('name');
        var attribute = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attribute.length; i++) {
            if (sf.base.isNullOrUndefined(target.getAttribute(attribute[i]))) {
                continue;
            }
            var attr = target.getAttribute(attribute[i]);
            inputElement.setAttribute(attribute[i], attr);
            target.removeAttribute(attribute[i]);
        }
    };
    DatePicker.prototype.checkFormat = function () {
        var culture = new sf.base.Internationalization(this.locale);
        if (this.format) {
            if (typeof this.format === 'string') {
                this.formatString = sf.base.isBlazor() ? this.format.replace(/tt/, 'a') : this.format;
            }
            else if (this.format.skeleton !== '' && !sf.base.isNullOrUndefined(this.format.skeleton)) {
                var skeletonString = this.format.skeleton;
                if (this.getModuleName() === 'datetimepicker') {
                    this.formatString = culture.getDatePattern({ skeleton: skeletonString, type: 'dateTime' });
                }
                else {
                    this.formatString = culture.getDatePattern({ skeleton: skeletonString, type: 'date' });
                }
            }
            else {
                if (this.getModuleName() === 'datetimepicker') {
                    this.formatString = this.dateTimeFormat;
                }
                else {
                    this.formatString = null;
                }
            }
        }
        else {
            this.formatString = null;
        }
    };
    DatePicker.prototype.checkHtmlAttributes = function (dynamic) {
        this.globalize = new sf.base.Internationalization(this.locale);
        this.checkFormat();
        this.checkView();
        var attributes$$1 = dynamic ? sf.base.isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['value', 'min', 'max', 'disabled', 'readonly', 'style', 'name', 'placeholder', 'type'];
        var options;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                options = {
                    format: !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd'
                };
            }
            else {
                options = {
                    format: !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                };
            }
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                options = { format: this.formatString, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
            }
            else {
                options = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
        }
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!sf.base.isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if (((sf.base.isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['enabled'] === undefined)) || dynamic) && !this.isBlazorServer) {
                            var enabled = this.inputElement.getAttribute(prop) === 'disabled' || this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !dynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if (((sf.base.isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['readonly'] === undefined)) || dynamic) && !this.isBlazorServer) {
                            var readonly = this.inputElement.getAttribute(prop) === 'readonly' || this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !dynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if (((sf.base.isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['placeholder'] === undefined)) || dynamic) && !this.isBlazorServer) {
                            var placeholder = this.inputElement.getAttribute(prop);
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, !dynamic);
                        }
                        break;
                    case 'style':
                        if (!this.isBlazorServer) {
                            this.inputElement.setAttribute('style', '' + this.inputElement.getAttribute(prop));
                        }
                        break;
                    case 'name':
                        if (!this.isBlazorServer) {
                            this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute(prop));
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if (((sf.base.isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['value'] === undefined)) || dynamic) && !this.isBlazorServer) {
                            var value = this.inputElement.getAttribute(prop);
                            this.setProperties(sf.base.setValue(prop, this.globalize.parseDate(value, options), {}), !dynamic);
                        }
                        break;
                    case 'min':
                        if ((+this.min === +new Date(1900, 0, 1)) || dynamic) {
                            var min = this.inputElement.getAttribute(prop);
                            this.setProperties(sf.base.setValue(prop, this.globalize.parseDate(min), {}), !dynamic);
                        }
                        break;
                    case 'max':
                        if ((+this.max === +new Date(2099, 11, 31)) || dynamic) {
                            var max = this.inputElement.getAttribute(prop);
                            this.setProperties(sf.base.setValue(prop, this.globalize.parseDate(max), {}), !dynamic);
                        }
                        break;
                    case 'type':
                        if (this.inputElement.getAttribute(prop) !== 'text' && !this.isBlazorServer) {
                            this.inputElement.setAttribute('type', 'text');
                        }
                        break;
                }
            }
        }
    };
    /**
     * To get component name.
     * @private
     */
    DatePicker.prototype.getModuleName = function () {
        return 'datepicker';
    };
    DatePicker.prototype.disabledDates = function () {
        var valueCopy;
        var formatOptions;
        var globalize;
        valueCopy = this.checkDateValue(this.value) ? new Date(+this.value) : new Date(this.checkValue(this.value));
        var previousValCopy = this.previousDate;
        //calls the Calendar render method to check the disabled dates through renderDayCell event and update the input value accordingly.
        this.minMaxUpdates();
        if (!this.isBlazorServer) {
            _super.prototype.render.call(this);
        }
        this.previousDate = previousValCopy;
        var date = valueCopy && +(valueCopy);
        var dateIdString = '*[id^="/id"]'.replace('/id', '' + date);
        if (!this.strictMode) {
            if (typeof this.value === 'string' || ((typeof this.value === 'object') && (+this.value) !== (+valueCopy))) {
                this.setProperties({ value: valueCopy }, true);
            }
        }
        if (!sf.base.isNullOrUndefined(this.calendarElement.querySelectorAll(dateIdString)[0])) {
            if (this.calendarElement.querySelectorAll(dateIdString)[0].classList.contains('e-disabled')) {
                if (!this.strictMode) {
                    this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
                }
            }
        }
        var inputVal;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                globalize = this.globalize.formatDate(valueCopy, {
                    format: !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd'
                });
            }
            else {
                globalize = this.globalize.formatDate(valueCopy, {
                    format: !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                });
            }
            inputVal = globalize;
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
            }
            else {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
            inputVal = this.globalize.formatDate(valueCopy, formatOptions);
        }
        if (!this.popupObj) {
            this.updateInputValue(inputVal);
        }
    };
    DatePicker.prototype.setAriaAttributes = function () {
        if (this.isBlazorServer) {
            if (this.isCalendar()) {
                var focusedEle = this.tableBodyElement.querySelector('tr td.e-focused-date');
                var selectedEle = this.tableBodyElement.querySelector('tr td.e-selected');
                var id = (focusedEle || selectedEle) ? (focusedEle || selectedEle).getAttribute('id') : 'null';
                sf.base.attributes(this.inputElement, { 'aria-activedescendant': '' + id });
            }
            else {
                sf.base.attributes(this.inputElement, { 'aria-activedescendant': 'null' });
            }
        }
        else {
            if (this.isCalendar()) {
                sf.inputs.Input.addAttributes({ 'aria-expanded': 'true' }, this.inputElement);
                sf.base.attributes(this.inputElement, { 'aria-activedescendant': '' + this.setActiveDescendant() });
            }
            else {
                sf.inputs.Input.addAttributes({ 'aria-expanded': 'false' }, this.inputElement);
                sf.base.attributes(this.inputElement, { 'aria-activedescendant': 'null' });
            }
        }
    };
    DatePicker.prototype.errorClass = function () {
        var dateIdString = '*[id^="/id"]'.replace('/id', '' + (+this.value));
        var isDisabledDate = this.calendarElement &&
            this.calendarElement.querySelectorAll(dateIdString)[0] &&
            this.calendarElement.querySelectorAll(dateIdString)[0].classList.contains('e-disabled');
        if ((!sf.base.isNullOrUndefined(this.value) && !(+new Date(+this.value).setMilliseconds(0) >= +this.min
            && +new Date(+this.value).setMilliseconds(0) <= +this.max))
            || (!this.strictMode && this.inputElement.value !== '' && sf.base.isNullOrUndefined(this.value) || isDisabledDate)) {
            sf.base.addClass([this.inputWrapper.container], ERROR);
            sf.base.attributes(this.inputElement, { 'aria-invalid': 'true' });
        }
        else {
            sf.base.removeClass([this.inputWrapper.container], ERROR);
            sf.base.attributes(this.inputElement, { 'aria-invalid': 'false' });
        }
    };
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    DatePicker.prototype.onPropertyChanged = function (newProp, oldProp) {
        var options;
        if (this.calendarMode === 'Gregorian') {
            options = { format: this.formatString, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
        }
        else {
            options = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'value':
                    this.isInteracted = false;
                    this.invalidValueString = null;
                    if (!this.isBlazorServer) {
                        this.checkInvalidValue(newProp.value);
                    }
                    newProp.value = this.value;
                    this.previousElementValue = this.inputElement.value;
                    if (!this.isBlazorServer) {
                        if (sf.base.isNullOrUndefined(this.value)) {
                            this.updateInputValue('');
                            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
                        }
                        this.updateInput();
                        if (+this.previousDate !== +this.value) {
                            this.changeTrigger(null);
                        }
                    }
                    this.isInteracted = true;
                    break;
                case 'format':
                    this.checkFormat();
                    this.bindInputEvent();
                    if (!this.isBlazorServer) {
                        this.updateInput();
                    }
                    break;
                case 'allowEdit':
                    this.setAllowEdit();
                    break;
                case 'placeholder':
                    sf.inputs.Input.setPlaceholder(this.placeholder, this.inputElement);
                    break;
                case 'readonly':
                    sf.inputs.Input.setReadonly(this.readonly, this.inputElement);
                    break;
                case 'enabled':
                    sf.inputs.Input.setEnabled(this.enabled, this.inputElement);
                    this.setAriaDisabled();
                    break;
                case 'htmlAttributes':
                    this.updateHtmlAttributeToElement();
                    this.updateHtmlAttributeToWrapper();
                    this.checkHtmlAttributes(true);
                    break;
                case 'locale':
                    this.globalize = new sf.base.Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    sf.inputs.Input.setPlaceholder(this.placeholder, this.inputElement);
                    if (!this.isBlazorServer) {
                        this.updateInput();
                    }
                    break;
                case 'enableRtl':
                    sf.inputs.Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                    break;
                case 'start':
                case 'depth':
                    this.checkView();
                    if (this.calendarElement && !this.isBlazorServer) {
                        _super.prototype.onPropertyChanged.call(this, newProp, oldProp);
                    }
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    break;
                case 'cssClass':
                    this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
                case 'showClearButton':
                    sf.inputs.Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    this.index = this.showClearButton ? 2 : 1;
                    break;
                case 'strictMode':
                    this.invalidValueString = null;
                    if (!this.isBlazorServer) {
                        this.updateInput();
                    }
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    sf.inputs.Input.removeFloating(this.inputWrapper);
                    sf.inputs.Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                default:
                    if (this.calendarElement && !this.isBlazorServer) {
                        _super.prototype.onPropertyChanged.call(this, newProp, oldProp);
                    }
                    break;
            }
            this.hide(null);
        }
    };
    __decorate([
        sf.base.Property(null)
    ], DatePicker.prototype, "width", void 0);
    __decorate([
        sf.base.Property(null)
    ], DatePicker.prototype, "value", void 0);
    __decorate([
        sf.base.Property(null)
    ], DatePicker.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], DatePicker.prototype, "strictMode", void 0);
    __decorate([
        sf.base.Property(null)
    ], DatePicker.prototype, "format", void 0);
    __decorate([
        sf.base.Property(true)
    ], DatePicker.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property({})
    ], DatePicker.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property(null)
    ], DatePicker.prototype, "values", void 0);
    __decorate([
        sf.base.Property(false)
    ], DatePicker.prototype, "isMultiSelection", void 0);
    __decorate([
        sf.base.Property(true)
    ], DatePicker.prototype, "showClearButton", void 0);
    __decorate([
        sf.base.Property(true)
    ], DatePicker.prototype, "allowEdit", void 0);
    __decorate([
        sf.base.Property(null)
    ], DatePicker.prototype, "keyConfigs", void 0);
    __decorate([
        sf.base.Property(false)
    ], DatePicker.prototype, "enablePersistence", void 0);
    __decorate([
        sf.base.Property(1000)
    ], DatePicker.prototype, "zIndex", void 0);
    __decorate([
        sf.base.Property(false)
    ], DatePicker.prototype, "readonly", void 0);
    __decorate([
        sf.base.Property(null)
    ], DatePicker.prototype, "placeholder", void 0);
    __decorate([
        sf.base.Property('Never')
    ], DatePicker.prototype, "floatLabelType", void 0);
    __decorate([
        sf.base.Property(null)
    ], DatePicker.prototype, "serverTimezoneOffset", void 0);
    __decorate([
        sf.base.Property(false)
    ], DatePicker.prototype, "openOnFocus", void 0);
    __decorate([
        sf.base.Event()
    ], DatePicker.prototype, "open", void 0);
    __decorate([
        sf.base.Event()
    ], DatePicker.prototype, "cleared", void 0);
    __decorate([
        sf.base.Event()
    ], DatePicker.prototype, "close", void 0);
    __decorate([
        sf.base.Event()
    ], DatePicker.prototype, "blur", void 0);
    __decorate([
        sf.base.Event()
    ], DatePicker.prototype, "focus", void 0);
    __decorate([
        sf.base.Event()
    ], DatePicker.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], DatePicker.prototype, "destroyed", void 0);
    DatePicker = __decorate([
        sf.base.NotifyPropertyChanges
    ], DatePicker);
    return DatePicker;
}(sf.calendars.Calendar));

/**
 * Datepicker modules
 */

exports.DatePicker = DatePicker;

return exports;

});

    sf.calendars = sf.base.extend({}, sf.calendars, sfdatepicker({}));