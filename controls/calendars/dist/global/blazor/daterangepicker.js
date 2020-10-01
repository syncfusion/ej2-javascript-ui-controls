window.sf = window.sf || {};
var sfdaterangepicker = (function (exports) {
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
var DATERANGEWRAPPER = 'e-date-range-wrapper';
var INPUTCONTAINER = 'e-input-group';
var DATERANGEICON = 'e-input-group-icon e-range-icon e-icons';
var POPUP = 'e-popup';
var LEFTCALENDER = 'e-left-calendar';
var RIGHTCALENDER = 'e-right-calendar';
var LEFTCONTAINER = 'e-left-container';
var RIGHTCONTAINER = 'e-right-container';
var ROOT = 'e-daterangepicker';
var LIBRARY = 'e-lib';
var CONTROL = 'e-control';
var ERROR = 'e-error';
var ACTIVE = 'e-active';
var STARTENDCONTAINER = 'e-start-end';
var STARTDATE = 'e-start-date';
var ENDDATE = 'e-end-date';
var STARTBUTTON = 'e-start-btn';
var INPUTFOCUS = 'e-input-focus';
var ENDBUTTON = 'e-end-btn';
var RANGEHOVER = 'e-range-hover';
var OTHERMONTH = 'e-other-month';
var STARTLABEL = 'e-start-label';
var ENDLABEL = 'e-end-label';
var DISABLED = 'e-disabled';
var SELECTED = 'e-selected';
var CALENDAR = 'e-calendar';
var NEXTICON = 'e-next';
var PREVICON = 'e-prev';
var HEADER = 'e-header';
var TITLE = 'e-title';
var ICONCONTAINER = 'e-icon-container';
var RANGECONTAINER = 'e-date-range-container';
var RANGEHEADER = 'e-range-header';
var PRESETS = 'e-presets';
var FOOTER = 'e-footer';
var RANGEBORDER = 'e-range-border';
var TODAY = 'e-today';
var FOCUSDATE = 'e-focused-date';
var CONTENT = 'e-content';
var DAYSPAN = 'e-day-span';
var WEEKNUMBER = 'e-week-number';
var DATEDISABLED = 'e-date-disabled';
var ICONDISABLED = 'e-icon-disabled';
var CALENDARCONTAINER = 'e-calendar-container';
var SEPARATOR = 'e-separator';
var APPLY = 'e-apply';
var CANCEL = 'e-cancel';
var DEVICE = 'e-device';
var OVERLAY = 'e-overlay';
var CHANGEICON = 'e-change-icon e-icons';
var LISTCLASS = 'e-list-item';
var RTL = 'e-rtl';
var HOVER = 'e-hover';
var OVERFLOW = 'e-range-overflow';
var OFFSETVALUE = 4;
var PRIMARY = 'e-primary';
var FLAT = 'e-flat';
var CSS = 'e-css';
var ZOOMIN = 'e-zoomin';
var NONEDITABLE = 'e-non-edit';
var DAYHEADERLONG = 'e-daterange-day-header-lg';
var HIDDENELEMENT = 'e-daterange-hidden';
var wrapperAttr = ['title', 'class', 'style'];
var Presets = /** @class */ (function (_super) {
    __extends(Presets, _super);
    function Presets() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property()
    ], Presets.prototype, "label", void 0);
    __decorate([
        sf.base.Property()
    ], Presets.prototype, "start", void 0);
    __decorate([
        sf.base.Property()
    ], Presets.prototype, "end", void 0);
    return Presets;
}(sf.base.ChildProperty));
/**
 * Represents the DateRangePicker component that allows user to select the date range from the calendar
 * or entering the range through the input element.
 * ```html
 * <input id="daterangepicker"/>
 * ```
 * ```typescript
 * <script>
 *   var dateRangePickerObj = new DateRangePicker({ startDate: new Date("05/07/2017"), endDate: new Date("10/07/2017") });
 *   dateRangePickerObj.appendTo("#daterangepicker");
 * </script>
 * ```
 */
var DateRangePicker = /** @class */ (function (_super) {
    __extends(DateRangePicker, _super);
    /**
     * Constructor for creating the widget
     */
    function DateRangePicker(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isCustomRange = false;
        _this.isCustomWindow = false;
        _this.presetsItem = [];
        _this.liCollections = [];
        _this.previousEleValue = '';
        _this.isKeyPopup = false;
        _this.dateDisabled = false;
        _this.isRangeIconClicked = false;
        _this.isMaxDaysClicked = false;
        _this.disabledDays = [];
        _this.preventBlur = false;
        _this.preventFocus = false;
        _this.invalidValueString = null;
        _this.dateRangeOptions = options;
        return _this;
    }
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    DateRangePicker.prototype.render = function () {
        this.initialize();
        this.setProperties({ startDate: this.startValue }, true);
        this.setProperties({ endDate: this.endValue }, true);
        this.setModelValue();
        this.setDataAttribute(false);
        this.renderComplete();
    };
    /**
     * Initialize the event handler
     * @returns void
     * @private
     */
    DateRangePicker.prototype.preRender = function () {
        this.keyInputConfigs = {
            altDownArrow: 'alt+downarrow',
            escape: 'escape',
            enter: 'enter',
            tab: 'tab',
            altRightArrow: 'alt+rightarrow',
            altLeftArrow: 'alt+leftarrow',
            moveUp: 'uparrow',
            moveDown: 'downarrow',
            spacebar: 'space'
        };
        this.defaultConstant = {
            placeholder: this.placeholder,
            startLabel: 'Start Date',
            endLabel: 'End Date',
            customRange: 'Custom Range',
            applyText: 'Apply',
            cancelText: 'Cancel',
            selectedDays: 'Selected Days',
            days: 'days'
        };
        /**
         * Mobile View
         */
        this.isMobile = window.matchMedia('(max-width:550px)').matches;
        this.inputElement = this.element;
        this.angularTag = null;
        if (this.element.tagName === 'EJS-DATERANGEPICKER') {
            this.angularTag = this.element.tagName;
            this.inputElement = this.createElement('input');
            this.element.appendChild(this.inputElement);
        }
        this.cloneElement = this.element.cloneNode(true);
        sf.base.removeClass([this.cloneElement], [ROOT, CONTROL, LIBRARY]);
        this.updateHtmlAttributeToElement();
        if (this.element.getAttribute('id')) {
            if (this.angularTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        }
        else {
            this.element.id = sf.base.getUniqueID('ej2-datetimepicker');
            if (this.angularTag !== null) {
                sf.base.attributes(this.inputElement, { 'id': this.element.id + '_input' });
            }
        }
        this.checkInvalidRange(this.value);
        if (!this.invalidValueString && (typeof (this.value) === 'string')) {
            var rangeArray = this.value.split(' ' + this.separator + ' ');
            this.value = [new Date(rangeArray[0]), new Date(rangeArray[1])];
        }
        this.initProperty();
        this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
        this.element.removeAttribute('tabindex');
        _super.prototype.preRender.call(this);
        this.navNextFunction = this.navNextMonth.bind(this);
        this.navPrevFunction = this.navPrevMonth.bind(this);
        this.deviceNavNextFunction = this.deviceNavNext.bind(this);
        this.deviceNavPrevFunction = this.deviceNavPrevious.bind(this);
        this.initStartDate = this.checkDateValue(this.startValue);
        this.initEndDate = this.checkDateValue(this.endValue);
        this.formElement = sf.base.closest(this.element, 'form');
    };
    
    DateRangePicker.prototype.updateValue = function () {
        var dateOptions = { format: this.formatString, type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
        if (this.value && this.value.length > 0) {
            if (this.value[0] instanceof Date && !isNaN(+this.value[0])) {
                this.setProperties({ startDate: this.value[0] }, true);
                this.startValue = this.value[0];
            }
            else if (typeof this.value[0] === 'string') {
                if (+this.value[0] === 0 || isNaN(+(new Date(this.checkValue(this.value[0]))))) {
                    this.startValue = null;
                    this.setValue();
                }
                else {
                    this.setProperties({ startDate: new Date(this.checkValue(this.value[0])) }, true);
                    this.startValue = new Date(this.checkValue(this.value[0]));
                }
            }
            else {
                this.startValue = null;
                this.setValue();
            }
            if (this.value[1] instanceof Date && !isNaN(+this.value[1])) {
                this.setProperties({ endDate: this.value[1] }, true);
                this.endValue = this.value[1];
            }
            else if (typeof this.value[1] === 'string') {
                if (+this.value[0] === 0 || isNaN(+(new Date(this.checkValue(this.value[0]))))) {
                    this.setProperties({ endDate: null }, true);
                    this.endValue = null;
                    this.setValue();
                }
                else {
                    this.setProperties({ endDate: new Date(this.checkValue(this.value[1])) }, true);
                    this.endValue = new Date(this.checkValue(this.value[1]));
                    this.setValue();
                }
            }
            else {
                this.setProperties({ endDate: null }, true);
                this.endValue = null;
                this.setValue();
            }
        }
        else if (this.value && this.value.start) {
            if (this.value.start instanceof Date && !isNaN(+this.value.start)) {
                this.setProperties({ startDate: this.value.start }, true);
                this.startValue = this.value.start;
            }
            else if (typeof this.value.start === 'string') {
                this.setProperties({ startDate: new Date(this.checkValue(this.value.start)) }, true);
                this.startValue = new Date(this.checkValue(this.value.start));
            }
            else {
                this.startValue = null;
                this.setValue();
            }
            if (this.value.end instanceof Date && !isNaN(+this.value.end)) {
                this.setProperties({ endDate: this.value.end }, true);
                this.endValue = this.value.end;
            }
            else if (typeof this.value.end === 'string') {
                this.setProperties({ endDate: new Date(this.checkValue(this.value.end)) }, true);
                this.endValue = new Date(this.checkValue(this.value.end));
                this.setValue();
            }
            else {
                this.setProperties({ endDate: null }, true);
                this.endValue = null;
                this.setValue();
            }
        }
        else if (sf.base.isNullOrUndefined(this.value)) {
            this.endValue = this.checkDateValue(new Date(this.checkValue(this.endDate)));
            this.startValue = this.checkDateValue(new Date(this.checkValue(this.startDate)));
            this.setValue();
        }
    };
    DateRangePicker.prototype.initProperty = function () {
        this.globalize = new sf.base.Internationalization(this.locale);
        this.checkFormat();
        this.checkView();
        if (sf.base.isNullOrUndefined(this.firstDayOfWeek) || this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: this.globalize.getFirstDayOfWeek() }, true);
        }
        this.updateValue();
    };
    DateRangePicker.prototype.checkFormat = function () {
        if (this.format) {
            if (typeof this.format === 'string') {
                this.formatString = this.format;
            }
            else if (this.format.skeleton !== '' && !sf.base.isNullOrUndefined(this.format.skeleton)) {
                var skeletonString = this.format.skeleton;
                this.formatString = this.globalize.getDatePattern({ skeleton: skeletonString, type: 'date' });
            }
            else {
                this.formatString = null;
            }
        }
        else {
            this.formatString = null;
        }
    };
    DateRangePicker.prototype.initialize = function () {
        if (this.angularTag !== null) {
            this.validationAttribute(this.element, this.inputElement);
        }
        this.checkHtmlAttributes(false);
        sf.base.merge(this.defaultKeyConfigs, { shiftTab: 'shift+tab' });
        var start = this.checkDateValue(new Date(this.checkValue(this.startValue)));
        this.setProperties({ startDate: start }, true); // persist the value propeerty.
        this.setProperties({ endValue: this.checkDateValue(new Date(this.checkValue(this.endValue))) }, true);
        this.setValue();
        this.setProperties({ min: this.checkDateValue(new Date(this.checkValue(this.min))) }, true);
        this.setProperties({ max: this.checkDateValue(new Date(this.checkValue(this.max))) }, true);
        this.l10n = new sf.base.L10n('daterangepicker', this.defaultConstant, this.locale);
        this.l10n.setLocale(this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        this.processPresets();
        this.createInput();
        this.updateHtmlAttributeToWrapper();
        this.setRangeAllowEdit();
        this.bindEvents();
    };
    DateRangePicker.prototype.setDataAttribute = function (isDynamic) {
        var attributes$$1 = {};
        if (!isDynamic) {
            for (var i = 0; i < this.element.attributes.length; i++) {
                attributes$$1[this.element.attributes[i].name] = this.element.getAttribute(this.element.attributes[i].name);
            }
        }
        else {
            attributes$$1 = this.htmlAttributes;
        }
        for (var _i = 0, _a = Object.keys(attributes$$1); _i < _a.length; _i++) {
            var pro = _a[_i];
            if (pro.indexOf('data') === 0) {
                this.firstHiddenChild.setAttribute(pro, attributes$$1[pro]);
                this.secondHiddenChild.setAttribute(pro, attributes$$1[pro]);
            }
        }
    };
    DateRangePicker.prototype.setRangeAllowEdit = function () {
        if (this.allowEdit) {
            if (!this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        }
        else {
            sf.base.attributes(this.inputElement, { 'readonly': '' });
        }
        this.updateClearIconState();
    };
    DateRangePicker.prototype.updateClearIconState = function () {
        if (!this.allowEdit && this.inputWrapper && !this.readonly) {
            if (this.inputElement.value === '') {
                sf.base.removeClass([this.inputWrapper.container], [NONEDITABLE]);
            }
            else {
                sf.base.addClass([this.inputWrapper.container], [NONEDITABLE]);
            }
        }
        else if (this.inputWrapper) {
            sf.base.removeClass([this.inputWrapper.container], [NONEDITABLE]);
        }
    };
    DateRangePicker.prototype.validationAttribute = function (element, input) {
        var name = element.getAttribute('name') ? element.getAttribute('name') : element.getAttribute('id');
        input.setAttribute('name', name);
        element.removeAttribute('name');
        var attributes$$1 = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attributes$$1.length; i++) {
            if (sf.base.isNullOrUndefined(element.getAttribute(attributes$$1[i]))) {
                continue;
            }
            var attr = element.getAttribute(attributes$$1[i]);
            input.setAttribute(attributes$$1[i], attr);
            element.removeAttribute(attributes$$1[i]);
        }
    };
    DateRangePicker.prototype.updateHtmlAttributeToWrapper = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttr.indexOf(key) > -1) {
                    if (key === 'class') {
                        var updatedClassValue = (this.htmlAttributes[key].replace(/\s+/g, ' ')).trim();
                        if (updatedClassValue !== '') {
                            sf.base.addClass([this.inputWrapper.container], updatedClassValue.split(' '));
                        }
                    }
                    else if (key === 'style') {
                        var dateRangeStyle = this.inputWrapper.container.getAttribute(key);
                        dateRangeStyle = !sf.base.isNullOrUndefined(dateRangeStyle) ? (dateRangeStyle + this.htmlAttributes[key]) :
                            this.htmlAttributes[key];
                        this.inputWrapper.container.setAttribute(key, dateRangeStyle);
                    }
                    else {
                        this.inputWrapper.container.setAttribute(key, this.htmlAttributes[key]);
                    }
                }
            }
        }
    };
    DateRangePicker.prototype.updateHtmlAttributeToElement = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttr.indexOf(key) < 0) {
                    this.inputElement.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    };
    DateRangePicker.prototype.updateCssClass = function (cssNewClass, cssOldClass) {
        if (!sf.base.isNullOrUndefined(cssOldClass)) {
            cssOldClass = (cssOldClass.replace(/\s+/g, ' ')).trim();
        }
        if (!sf.base.isNullOrUndefined(cssNewClass)) {
            cssNewClass = (cssNewClass.replace(/\s+/g, ' ')).trim();
        }
        sf.inputs.Input.setCssClass(cssNewClass, [this.inputWrapper.container], cssOldClass);
        if (this.popupWrapper) {
            sf.inputs.Input.setCssClass(cssNewClass, [this.popupWrapper], cssOldClass);
        }
    };
    DateRangePicker.prototype.processPresets = function () {
        this.presetsItem = [];
        var i = 0;
        if (!sf.base.isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
            for (var _i = 0, _a = this.presets; _i < _a.length; _i++) {
                var range = _a[_i];
                var id = range.label.replace(/\s+/g, '') + '_' + (++i);
                if (typeof range.end === 'string') {
                    this.presetsItem.push({
                        id: id, text: range.label, end: new Date(this.checkValue(range.end)), start: new Date(this.checkValue(range.start))
                    });
                }
                else {
                    this.presetsItem.push({ id: id, text: range.label, start: range.start, end: range.end });
                }
            }
            var startDate = sf.base.isNullOrUndefined(this.startValue) ? null : new Date(+this.startValue);
            var endDate = sf.base.isNullOrUndefined(this.endValue) ? null : new Date(+this.endValue);
            this.presetsItem.push({ id: 'custom_range', text: this.l10n.getConstant('customRange'), start: startDate, end: endDate });
            if (!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue)) {
                this.isCustomRange = true;
                this.activeIndex = this.presetsItem.length - 1;
            }
        }
    };
    DateRangePicker.prototype.bindEvents = function () {
        if (this.enabled) {
            sf.base.EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler, this);
            sf.base.EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
            sf.base.EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
            sf.base.EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
            if (this.showClearButton && this.inputWrapper.clearButton) {
                sf.base.EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
            }
            if (!this.isMobile) {
                this.keyInputConfigs = sf.base.extend(this.keyInputConfigs, this.keyConfigs);
                this.inputKeyboardModule = new sf.base.KeyboardEvents(this.inputElement, {
                    eventName: 'keydown',
                    keyAction: this.inputHandler.bind(this),
                    keyConfigs: this.keyInputConfigs
                });
            }
            if (this.formElement) {
                sf.base.EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
            }
            this.inputElement.setAttribute('tabindex', this.tabIndex);
        }
        else {
            sf.base.EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler);
            sf.base.EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            sf.base.EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            sf.base.EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
            if (this.showClearButton && this.inputWrapper.clearButton) {
                sf.base.EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
            }
            if (!this.isMobile) {
                if (!sf.base.isNullOrUndefined(this.inputKeyboardModule)) {
                    this.inputKeyboardModule.destroy();
                }
            }
            if (this.formElement) {
                sf.base.EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
            }
            this.inputElement.tabIndex = -1;
        }
    };
    DateRangePicker.prototype.updateHiddenInput = function () {
        if (this.firstHiddenChild && this.secondHiddenChild) {
            var format = { type: 'datetime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
            if (typeof this.startDate === 'string') {
                this.startDate = this.globalize.parseDate(this.startDate, format);
            }
            if (typeof this.endDate === 'string') {
                this.endDate = this.globalize.parseDate(this.endDate, format);
            }
            this.firstHiddenChild.value = (this.startDate && this.globalize.formatDate(this.startDate, format))
                || (this.inputElement.value);
            this.secondHiddenChild.value = (this.endDate && this.globalize.formatDate(this.endDate, format)) ||
                (this.inputElement.value);
            this.dispatchEvent(this.firstHiddenChild, 'focusout');
            this.dispatchEvent(this.firstHiddenChild, 'change');
        }
    };
    DateRangePicker.prototype.inputChangeHandler = function (e) {
        e.stopPropagation();
        this.updateHiddenInput();
    };
    DateRangePicker.prototype.bindClearEvent = function () {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            sf.base.EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
        }
    };
    DateRangePicker.prototype.resetHandler = function (e) {
        this.valueType = this.value;
        e.preventDefault();
        this.clear();
        var clearedArgs = {
            event: e
        };
        this.setProperties({ endDate: this.checkDateValue(this.endValue) }, true);
        this.setProperties({ startDate: this.checkDateValue(this.startValue) }, true);
        this.trigger('cleared', clearedArgs);
        this.changeTrigger(e);
        this.clearRange();
        this.hide(e);
    };
    DateRangePicker.prototype.restoreValue = function () {
        this.previousEleValue = this.inputElement.value;
        this.previousStartValue = this.startValue;
        this.previousEndValue = this.endValue;
        this.valueType = null;
        this.initStartDate = this.checkDateValue(this.startValue);
        this.initEndDate = this.checkDateValue(this.endValue);
        this.setValue();
        this.setModelValue();
    };
    DateRangePicker.prototype.formResetHandler = function (e) {
        if (this.formElement && (e.target === this.formElement) && !this.inputElement.disabled) {
            var val = this.inputElement.getAttribute('value');
            if (!sf.base.isNullOrUndefined(this.startCopy)) {
                if (!sf.base.isNullOrUndefined(this.value) && !sf.base.isNullOrUndefined(this.value.start)) {
                    this.setProperties({ value: { start: this.startCopy, end: this.endCopy } }, true);
                    this.startValue = this.value.start;
                    this.endValue = this.value.end;
                }
                else {
                    this.setProperties({ value: [this.startCopy, this.endCopy] }, true);
                    this.startValue = this.value[0];
                    this.endValue = this.value[1];
                }
                this.setProperties({ startDate: this.startValue, endDate: this.endValue }, true);
            }
            else {
                this.setProperties({ value: null, startDate: null, endDate: null }, true);
                this.startValue = this.endValue = null;
            }
            if (this.element.tagName === 'EJS-DATERANGEPICKER') {
                this.setProperties({ value: null, startDate: null, endDate: null }, true);
                val = '';
                this.startValue = this.endValue = null;
                this.inputElement.setAttribute('value', '');
            }
            this.restoreValue();
            if (this.inputElement) {
                sf.inputs.Input.setValue(val, this.inputElement, this.floatLabelType, this.showClearButton);
                this.errorClass();
            }
        }
    };
    DateRangePicker.prototype.clear = function () {
        if (this.startValue !== null) {
            this.startValue = null;
        }
        if (this.endValue !== null) {
            this.endValue = null;
        }
        if (this.value && this.value.start) {
            this.setProperties({ value: { start: null, end: null } }, true);
        }
        if (this.value !== null && this.value.length > 0) {
            this.setProperties({ value: null }, true);
        }
        sf.inputs.Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        if (!(sf.base.isNullOrUndefined(this.applyButton))) {
            this.applyButton.disabled = this.applyButton.element.disabled = true;
        }
        this.removeSelection();
    };
    DateRangePicker.prototype.rangeIconHandler = function (e) {
        if (this.isMobile) {
            this.inputElement.setAttribute('readonly', '');
        }
        e.preventDefault();
        this.targetElement = null;
        if (this.isPopupOpen() && document.body.contains(this.popupObj.element)) {
            this.applyFunction(e);
        }
        else {
            this.isRangeIconClicked = true;
            this.inputWrapper.container.children[0].focus();
            this.show(null, e);
            if (!this.isMobile) {
                if (!sf.base.isNullOrUndefined(this.leftCalendar)) {
                    this.isRangeIconClicked = false;
                    this.calendarFocus();
                    this.isRangeIconClicked = true;
                }
            }
            sf.base.addClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
    };
    DateRangePicker.prototype.checkHtmlAttributes = function (isDynamic) {
        this.globalize = new sf.base.Internationalization(this.locale);
        var attributes$$1 = isDynamic ? sf.base.isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['startDate', 'endDate', 'minDays', 'maxDays', 'min', 'max', 'disabled', 'readonly', 'style', 'name', 'placeholder',
                'type', 'value'];
        var format = { format: this.formatString, type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!sf.base.isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['enabled'] === undefined)) || isDynamic) {
                            var disabled = this.inputElement.getAttribute(prop) === 'disabled' ||
                                this.inputElement.getAttribute(prop) === '' || this.inputElement.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ enabled: !disabled }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['readonly'] === undefined)) || isDynamic) {
                            var readonly = this.inputElement.getAttribute(prop) === 'readonly' ||
                                this.inputElement.getAttribute(prop) === 'true' || this.inputElement.getAttribute(prop) === '' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['value'] === undefined)) || isDynamic) {
                            var value = this.inputElement.getAttribute(prop);
                            this.setProperties(sf.base.setValue(prop, value, {}), !isDynamic);
                        }
                        break;
                    case 'style':
                        this.inputElement.setAttribute('style', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'min':
                        if ((sf.base.isNullOrUndefined(this.min) || +this.min === +new Date(1900, 0, 1)) || isDynamic) {
                            var dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.setProperties(sf.base.setValue(prop, dateValue, {}), !isDynamic);
                        }
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'max':
                        if ((sf.base.isNullOrUndefined(this.max) || +this.max === +new Date(2099, 11, 31)) || isDynamic) {
                            var dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.setProperties(sf.base.setValue(prop, dateValue, {}), !isDynamic);
                        }
                        break;
                    case 'startDate':
                        if (sf.base.isNullOrUndefined(this.startDate)) {
                            var dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.startValue = dateValue;
                            this.setValue();
                        }
                        break;
                    case 'endDate':
                        if (sf.base.isNullOrUndefined(this.endDate)) {
                            var dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.endValue = dateValue;
                            this.setValue();
                        }
                        break;
                    case 'minDays':
                        if (sf.base.isNullOrUndefined(this.minDays)) {
                            this.setProperties(sf.base.setValue(prop, parseInt(this.inputElement.getAttribute(prop), 10), {}), true);
                        }
                        break;
                    case 'maxDays':
                        if (sf.base.isNullOrUndefined(this.maxDays)) {
                            this.setProperties(sf.base.setValue(prop, parseInt(this.inputElement.getAttribute(prop), 10), {}), true);
                        }
                        break;
                    case 'type':
                        if (this.inputElement.getAttribute(prop) !== 'text') {
                            this.inputElement.setAttribute('type', 'text');
                        }
                        break;
                }
            }
        }
    };
    DateRangePicker.prototype.createPopup = function () {
        for (var i = 0; i < this.presetsItem.length; i++) {
            if ((i !== (this.presetsItem.length - 1)) && this.presetsItem[i].id === 'custom_range') {
                this.presetsItem.splice(i, 1);
            }
        }
        this.activeIndex = this.presetsItem.length - 1;
        this.isCustomRange = true;
        for (var i = 0; i <= this.presetsItem.length - 2; i++) {
            var startDate = this.presetsItem[i].start;
            var endDate = this.presetsItem[i].end;
            if (this.startValue && this.endValue) {
                if ((+startDate.setMilliseconds(0) === +this.startValue.setMilliseconds(0)) &&
                    (+endDate.setMilliseconds(0) === +this.endValue.setMilliseconds(0))) {
                    this.activeIndex = i;
                    this.isCustomRange = false;
                }
            }
        }
        this.popupWrapper = sf.base.createElement('div', { id: this.element.id + '_popup', className: ROOT + ' ' + POPUP });
        this.adjustLongHeaderWidth();
        var isPreset = (!this.isCustomRange || this.isMobile);
        if (!sf.base.isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && isPreset) {
            this.isCustomWindow = false;
            this.createPresets();
            this.listRippleEffect();
            this.renderPopup();
        }
        else {
            this.isCustomWindow = true;
            this.renderControl();
        }
    };
    DateRangePicker.prototype.renderControl = function () {
        this.createControl();
        this.bindCalendarEvents();
        this.updateRange((this.isMobile ? [this.calendarElement] : [this.leftCalendar, this.rightCalendar]));
        if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue)) {
            this.disabledDateRender();
        }
        this.updateHeader();
    };
    DateRangePicker.prototype.clearCalendarEvents = function () {
        sf.base.EventHandler.clearEvents(this.leftCalPrevIcon);
        sf.base.EventHandler.clearEvents(this.leftCalNextIcon);
        sf.base.EventHandler.clearEvents(this.rightCalPrevIcon);
        sf.base.EventHandler.clearEvents(this.rightCalNextIcon);
    };
    DateRangePicker.prototype.updateNavIcons = function () {
        _super.prototype.iconHandler.call(this);
    };
    DateRangePicker.prototype.calendarIconEvent = function () {
        this.clearCalendarEvents();
        if (this.leftCalPrevIcon && !this.leftCalPrevIcon.classList.contains(DISABLED)) {
            sf.base.EventHandler.add(this.leftCalPrevIcon, 'mousedown', this.navPrevFunction);
        }
        if (this.leftCalNextIcon && !this.leftCalNextIcon.classList.contains(DISABLED)) {
            sf.base.EventHandler.add(this.leftCalNextIcon, 'mousedown', this.navNextFunction);
        }
        if (this.rightCalPrevIcon && !this.rightCalPrevIcon.classList.contains(DISABLED)) {
            sf.base.EventHandler.add(this.rightCalPrevIcon, 'mousedown', this.navPrevFunction);
        }
        if (this.rightCalNextIcon && !this.rightCalNextIcon.classList.contains(DISABLED)) {
            sf.base.EventHandler.add(this.rightCalNextIcon, 'mousedown', this.navNextFunction);
        }
    };
    DateRangePicker.prototype.bindCalendarEvents = function () {
        if (!this.isMobile) {
            this.updateNavIcons();
            this.calendarIconEvent();
            this.calendarIconRipple();
            this.headerTitleElement = this.popupObj.element.querySelector('.' + RIGHTCALENDER + ' .' + HEADER + ' .' + TITLE);
            this.headerTitleElement = this.popupObj.element.querySelector('.' + LEFTCALENDER + ' .' + HEADER + ' .' + TITLE);
            this.defaultKeyConfigs = sf.base.extend(this.defaultKeyConfigs, this.keyConfigs);
            this.leftKeyboardModule = new sf.base.KeyboardEvents(this.leftCalendar, {
                eventName: 'keydown',
                keyAction: this.keyInputHandler.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
            this.rightKeyboardModule = new sf.base.KeyboardEvents(this.rightCalendar, {
                eventName: 'keydown',
                keyAction: this.keyInputHandler.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        }
        else {
            this.deviceCalendarEvent();
            sf.base.EventHandler.add(this.startButton.element, 'click', this.deviceHeaderClick, this);
            sf.base.EventHandler.add(this.endButton.element, 'click', this.deviceHeaderClick, this);
        }
        if (this.start === this.depth) {
            this.bindCalendarCellEvents();
        }
        this.removeFocusedDate();
    };
    DateRangePicker.prototype.calendarIconRipple = function () {
        sf.base.rippleEffect(this.leftCalPrevIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        sf.base.rippleEffect(this.leftCalNextIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
        sf.base.rippleEffect(this.rightCalPrevIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        sf.base.rippleEffect(this.rightCalNextIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
    };
    DateRangePicker.prototype.deviceCalendarEvent = function () {
        sf.base.EventHandler.clearEvents(this.nextIcon);
        sf.base.EventHandler.clearEvents(this.previousIcon);
        sf.base.rippleEffect(this.nextIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        sf.base.rippleEffect(this.previousIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
        if (this.nextIcon && !this.nextIcon.classList.contains(DISABLED)) {
            sf.base.EventHandler.add(this.nextIcon, 'mousedown', this.deviceNavNextFunction);
        }
        if (this.previousIcon && !this.previousIcon.classList.contains(DISABLED)) {
            sf.base.EventHandler.add(this.previousIcon, 'mousedown', this.deviceNavPrevFunction);
        }
    };
    DateRangePicker.prototype.deviceNavNext = function (e) {
        var calendar = sf.base.closest(e.target, '.' + CALENDAR);
        this.updateDeviceCalendar(calendar);
        this.navigateNext(e);
        this.deviceNavigation();
    };
    DateRangePicker.prototype.deviceNavPrevious = function (e) {
        var calendar = sf.base.closest(e.target, '.' + CALENDAR);
        this.updateDeviceCalendar(calendar);
        this.navigatePrevious(e);
        this.deviceNavigation();
    };
    DateRangePicker.prototype.updateDeviceCalendar = function (calendar) {
        if (calendar) {
            this.previousIcon = calendar.querySelector('.' + PREVICON);
            this.nextIcon = calendar.querySelector('.' + NEXTICON);
            this.calendarElement = calendar;
            this.deviceCalendar = calendar;
            this.contentElement = calendar.querySelector('.' + CONTENT);
            this.tableBodyElement = sf.base.select('.' + CONTENT + ' tbody', calendar);
            this.table = calendar.querySelector('.' + CONTENT).getElementsByTagName('table')[0];
            this.headerTitleElement = calendar.querySelector('.' + HEADER + ' .' + TITLE);
            this.headerElement = calendar.querySelector('.' + HEADER);
        }
    };
    DateRangePicker.prototype.deviceHeaderClick = function (event) {
        var element = event.currentTarget;
        if (element.classList.contains(STARTBUTTON) && !sf.base.isNullOrUndefined(this.startValue)) {
            this.endButton.element.classList.remove(ACTIVE);
            this.startButton.element.classList.add(ACTIVE);
            var calendar = this.popupObj.element.querySelector('.' + CALENDAR);
            this.updateDeviceCalendar(calendar);
            if (sf.base.isNullOrUndefined(this.calendarElement.querySelector('.' + STARTDATE + ':not(.e-other-month)'))) {
                this.currentDate = new Date(+this.startValue);
                sf.base.remove(this.tableBodyElement);
                this.createContentBody();
                this.deviceNavigation();
            }
            this.removeClassDisabled();
        }
        else if (!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue)) {
            this.startButton.element.classList.remove(ACTIVE);
            this.endButton.element.classList.add(ACTIVE);
            var calendar = this.popupObj.element.querySelector('.' + CALENDAR);
            this.updateDeviceCalendar(calendar);
            if (sf.base.isNullOrUndefined(this.calendarElement.querySelector('.' + ENDDATE + ':not(.e-other-month)'))) {
                this.currentDate = new Date(+this.endValue);
                sf.base.remove(this.tableBodyElement);
                this.createContentBody();
                this.deviceNavigation();
            }
            this.updateMinMaxDays(this.popupObj.element.querySelector('.' + CALENDAR));
            this.selectableDates();
        }
    };
    DateRangePicker.prototype.inputFocusHandler = function () {
        this.preventBlur = false;
        var focusArguments = {
            model: (sf.base.isBlazor() && this.isServerRendered) ? null : this
        };
        if (!this.preventFocus) {
            this.preventFocus = true;
            this.trigger('focus', focusArguments);
        }
        this.updateClearIconState();
        this.updateHiddenInput();
        if (this.openOnFocus) {
            this.show();
        }
    };
    DateRangePicker.prototype.inputBlurHandler = function (e) {
        if (!this.preventBlur) {
            var value = this.inputElement.value;
            if (!sf.base.isNullOrUndefined(this.presetsItem)) {
                if (this.presetsItem.length > 0 && this.previousEleValue !== this.inputElement.value) {
                    this.activeIndex = this.presetsItem.length - 1;
                    this.isCustomRange = true;
                }
            }
            if (!sf.base.isNullOrUndefined(value) && value.trim() !== '') {
                var range = value.split(' ' + this.separator + ' ');
                if (range.length > 1) {
                    this.invalidValueString = null;
                    var dateOptions = { format: this.formatString, type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
                    var startDate = this.globalize.parseDate(range[0].trim(), dateOptions);
                    var endDate = this.globalize.parseDate(range[1].trim(), dateOptions);
                    if (!sf.base.isNullOrUndefined(startDate) && !isNaN(+startDate) && !sf.base.isNullOrUndefined(endDate) && !isNaN(+endDate)) {
                        var prevStartVal = this.startValue;
                        this.startValue = startDate;
                        var prevEndVal = this.endValue;
                        this.endValue = endDate;
                        this.setValue();
                        this.refreshControl();
                        if (value !== this.previousEleValue) {
                            this.changeTrigger(e);
                        }
                        if (!this.preventBlur && document.activeElement !== this.inputElement) {
                            this.preventFocus = false;
                            var blurArguments = {
                                model: (sf.base.isBlazor() && this.isServerRendered) ? null : this
                            };
                            this.trigger('blur', blurArguments);
                        }
                        this.updateHiddenInput();
                        // For Mobile mode, when a value is present and choose another range and click on console
                        // when popup is open, two startvalues and end values are updated in the popup.
                        if (this.isMobile && this.isPopupOpen()) {
                            this.startValue = prevStartVal;
                            this.endValue = prevEndVal;
                        }
                        return;
                    }
                    else {
                        if (!this.strictMode) {
                            this.startValue = null;
                            this.endValue = null;
                            this.setValue();
                        }
                    }
                }
                else {
                    if (!this.strictMode) {
                        this.startValue = null;
                        this.endValue = null;
                        this.setValue();
                    }
                }
            }
            if (!this.strictMode) {
                if (sf.base.isNullOrUndefined(this.popupObj)) {
                    this.currentDate = null;
                }
                this.previousStartValue = this.previousEndValue = null;
                this.startValue = null;
                this.endValue = null;
                this.setValue();
            }
            else {
                if (!sf.base.isNullOrUndefined(value) && value.trim() === '') {
                    this.startValue = null;
                    this.endValue = null;
                }
                sf.inputs.Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                this.updateInput();
            }
            this.errorClass();
            this.changeTrigger(e);
            if (!this.preventBlur && document.activeElement !== this.inputElement) {
                this.preventFocus = false;
                var blurArguments = {
                    model: (sf.base.isBlazor() && this.isServerRendered) ? null : this
                };
                this.trigger('blur', blurArguments);
            }
        }
        this.updateHiddenInput();
    };
    DateRangePicker.prototype.clearRange = function () {
        this.previousStartValue = this.previousEndValue = null;
        this.currentDate = null;
    };
    DateRangePicker.prototype.errorClass = function () {
        var inputStr = this.inputElement.value.trim();
        if (((sf.base.isNullOrUndefined(this.endValue) && sf.base.isNullOrUndefined(this.startValue) && inputStr !== '') ||
            ((!sf.base.isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
                || ((!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
                || (!sf.base.isNullOrUndefined(this.endValue) && +this.endValue > +this.max))
            || ((this.startValue && this.isDateDisabled(this.startValue))
                || (this.endValue && this.isDateDisabled(this.endValue)))) && inputStr !== '') {
            sf.base.addClass([this.inputWrapper.container], ERROR);
            sf.base.attributes(this.inputElement, { 'aria-invalid': 'true' });
        }
        else {
            if (this.inputWrapper) {
                sf.base.removeClass([this.inputWrapper.container], ERROR);
                sf.base.attributes(this.inputElement, { 'aria-invalid': 'false' });
            }
        }
    };
    DateRangePicker.prototype.keyCalendarUpdate = function (isLeftCalendar, ele) {
        this.removeFocusedDate();
        if (isLeftCalendar) {
            this.leftCalCurrentDate = new Date(+this.currentDate);
            ele = this.leftCalendar;
        }
        else {
            this.rightCalCurrentDate = new Date(+this.currentDate);
            ele = this.rightCalendar;
        }
        this.updateCalendarElement(ele);
        this.table.focus();
        return ele;
    };
    DateRangePicker.prototype.navInCalendar = function (e, isLeftCalendar, leftLimit, rightLimit, ele) {
        var view = this.getViewNumber(this.currentView());
        var date;
        var min = this.min;
        var max;
        if (!sf.base.isNullOrUndefined(this.maxDays) && this.isMaxDaysClicked && !sf.base.isNullOrUndefined(this.startValue)) {
            max = new Date(new Date(+this.startValue).setDate(this.startValue.getDate() + (this.maxDays - 1)));
        }
        else {
            max = this.max;
        }
        switch (e.action) {
            case 'moveRight':
                date = new Date(+this.currentDate);
                this.addDay(date, 1, e, max, min);
                if (isLeftCalendar && +date === +rightLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.KeyboardNavigate(1, view, e, max, min);
                this.keyNavigation(ele, e);
                break;
            case 'moveLeft':
                date = new Date(+this.currentDate);
                this.addDay(date, -1, e, max, min);
                if (!isLeftCalendar) {
                    if (+date === +leftLimit) {
                        ele = this.keyCalendarUpdate(true, ele);
                    }
                }
                this.KeyboardNavigate(-1, view, e, max, min);
                this.keyNavigation(ele, e);
                break;
            case 'moveUp':
                if (view === 0) {
                    date = new Date(+this.currentDate);
                    this.addDay(date, -7, e, max, min);
                    if (+date <= +leftLimit && !isLeftCalendar) {
                        ele = this.keyCalendarUpdate(true, ele);
                    }
                    this.KeyboardNavigate(-7, view, e, max, min);
                }
                else {
                    this.KeyboardNavigate(-4, view, e, this.max, this.min); // move the current year to the previous four days.
                }
                this.keyNavigation(ele, e);
                break;
            case 'moveDown':
                if (view === 0) {
                    date = new Date(+this.currentDate);
                    this.addDay(date, 7, e, max, min);
                    if (isLeftCalendar && +date >= +rightLimit) {
                        ele = this.keyCalendarUpdate(false, ele);
                    }
                    this.KeyboardNavigate(7, view, e, max, min);
                }
                else {
                    this.KeyboardNavigate(4, view, e, this.max, this.min);
                }
                this.keyNavigation(ele, e);
                break;
            case 'home':
                this.currentDate = this.firstDay(this.currentDate);
                sf.base.remove(this.tableBodyElement);
                (view === 0) ? this.renderMonths(e) : ((view === 1) ? this.renderYears(e) : this.renderDecades(e));
                this.keyNavigation(ele, e);
                break;
            case 'end':
                this.currentDate = this.lastDay(this.currentDate, view);
                sf.base.remove(this.tableBodyElement);
                (view === 0) ? this.renderMonths(e) : ((view === 1) ? this.renderYears(e) : this.renderDecades(e));
                this.keyNavigation(ele, e);
                break;
        }
    };
    // tslint:disable-next-line:max-func-body-length
    DateRangePicker.prototype.keyInputHandler = function (e, value) {
        var date;
        var view = this.getViewNumber(this.currentView());
        var rightDateLimit = new Date(this.rightCalCurrentDate.getFullYear(), this.rightCalCurrentDate.getMonth(), 1);
        var leftDateLimit = new Date(this.leftCalCurrentDate.getFullYear(), this.leftCalCurrentDate.getMonth() + 1, 0);
        var ele = sf.base.closest(e.target, '.' + RIGHTCALENDER);
        ele = sf.base.isNullOrUndefined(ele) ? this.leftCalendar : ele;
        var isLeftCalendar = ele.classList.contains(LEFTCALENDER);
        this.updateCalendarElement(ele);
        var selectedDate = this.tableBodyElement.querySelector('tr td.e-selected');
        var focusedDate = ele.querySelector('tr td.' + FOCUSDATE);
        var startDate = ele.querySelector('tr td.' + STARTDATE);
        var endDate = ele.querySelector('tr td.' + ENDDATE);
        var depthValue = this.getViewNumber(this.depth);
        var levelRestrict = (view === depthValue && this.getViewNumber(this.start) >= depthValue);
        var leftCalendar = sf.base.closest(e.target, '.' + LEFTCALENDER);
        var rightCalendar = sf.base.closest(e.target, '.' + RIGHTCALENDER);
        var presetElement = sf.base.closest(e.target, '.' + PRESETS);
        if (!sf.base.isNullOrUndefined(focusedDate)) {
            this.currentDate = this.currentDate;
        }
        else if (!sf.base.isNullOrUndefined(endDate) && !this.dateDisabled) {
            this.currentDate = new Date(+this.endValue);
        }
        else if (!sf.base.isNullOrUndefined(startDate) && !this.dateDisabled) {
            this.currentDate = new Date(+this.startValue);
        }
        else if (!this.dateDisabled) {
            this.currentDate.setDate(1);
        }
        this.effect = '';
        switch (e.action) {
            case 'altUpArrow':
                if (this.isPopupOpen()) {
                    this.hide(e);
                    this.preventFocus = true;
                    this.inputElement.focus();
                    sf.base.addClass([this.inputWrapper.container], [INPUTFOCUS]);
                }
                break;
            case 'select':
                if (levelRestrict) {
                    var element = !sf.base.isNullOrUndefined(focusedDate) ? focusedDate : startDate;
                    if (!sf.base.isNullOrUndefined(element) && !element.classList.contains(DISABLED)) {
                        this.selectRange(null, (element));
                    }
                }
                else {
                    if (!sf.base.isNullOrUndefined(selectedDate) && !levelRestrict || !sf.base.isNullOrUndefined(focusedDate)) {
                        if (!sf.base.isNullOrUndefined(this.value)) {
                            if (this.calendarElement.classList.contains(LEFTCALENDER)) {
                                value = this.startDate;
                            }
                            else {
                                value = this.endDate;
                            }
                        }
                        this.controlDown = e;
                        this.contentClick(null, --view, (focusedDate || selectedDate), value);
                    }
                }
                e.preventDefault();
                break;
            case 'controlHome':
                var yearDate = new Date(this.currentDate.getFullYear(), 0, 1);
                if (!isLeftCalendar && +yearDate < +leftDateLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                _super.prototype.navigateTo.call(this, 'Month', new Date(this.currentDate.getFullYear(), 0, 1));
                this.keyNavigation(ele, e);
                break;
            case 'altRightArrow':
                if (!sf.base.isNullOrUndefined(leftCalendar)) {
                    this.rightCalendar.children[1].firstElementChild.focus();
                }
                else if (!sf.base.isNullOrUndefined(rightCalendar)) {
                    if (!sf.base.isNullOrUndefined(this.presetElement)) {
                        this.presetElement.focus();
                        this.removeFocusedDate();
                    }
                    else {
                        this.cancelButton.element.focus();
                    }
                }
                else {
                    if (!sf.base.isNullOrUndefined(presetElement)) {
                        this.cancelButton.element.focus();
                    }
                }
                e.preventDefault();
                break;
            case 'altLeftArrow':
                if (!sf.base.isNullOrUndefined(leftCalendar)) {
                    if (this.applyButton.element.disabled !== true) {
                        this.applyButton.element.focus();
                    }
                    else {
                        this.cancelButton.element.focus();
                    }
                }
                else {
                    if (!sf.base.isNullOrUndefined(rightCalendar)) {
                        this.leftCalendar.children[1].firstElementChild.focus();
                    }
                }
                e.preventDefault();
                break;
            case 'controlUp':
                if (this.calendarElement.classList.contains(LEFTCALENDER)) {
                    this.calendarNavigation(e, this.calendarElement);
                }
                else {
                    this.calendarNavigation(e, this.calendarElement);
                }
                e.preventDefault();
                break;
            case 'controlDown':
                if ((!sf.base.isNullOrUndefined(selectedDate) || !sf.base.isNullOrUndefined(focusedDate)) && !levelRestrict) {
                    if (!sf.base.isNullOrUndefined(this.value)) {
                        if (this.calendarElement.classList.contains(LEFTCALENDER)) {
                            value = this.startDate;
                        }
                        else {
                            value = this.endDate;
                        }
                    }
                    this.controlDown = e;
                    this.contentClick(null, --view, (selectedDate || focusedDate), value);
                }
                e.preventDefault();
                break;
            case 'controlEnd':
                yearDate = new Date(this.currentDate.getFullYear(), 11, 31);
                if (isLeftCalendar && +yearDate > +rightDateLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                _super.prototype.navigateTo.call(this, 'Month', new Date(this.currentDate.getFullYear(), 11, 31));
                this.keyNavigation(ele, e);
                break;
            case 'pageUp':
                date = new Date(+this.currentDate);
                this.addMonths(date, -1);
                if (!isLeftCalendar && +date <= +leftDateLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.addMonths(this.currentDate, -1);
                _super.prototype.navigateTo.call(this, 'Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'pageDown':
                date = new Date(+this.currentDate);
                this.addMonths(date, 1);
                if (isLeftCalendar && +date >= +rightDateLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.addMonths(this.currentDate, 1);
                _super.prototype.navigateTo.call(this, 'Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'shiftPageUp':
                date = new Date(+this.currentDate);
                this.addYears(date, -1);
                if (!isLeftCalendar && +date <= +leftDateLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.addYears(this.currentDate, -1);
                _super.prototype.navigateTo.call(this, 'Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'shiftPageDown':
                date = new Date(+this.currentDate);
                this.addYears(date, 1);
                if (isLeftCalendar && +date >= +rightDateLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.addYears(this.currentDate, 1);
                _super.prototype.navigateTo.call(this, 'Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'shiftTab':
                if (!sf.base.isNullOrUndefined(this.presetElement)) {
                    this.presetElement.setAttribute('tabindex', '0');
                    this.presetElement.focus();
                    this.removeFocusedDate();
                }
                e.preventDefault();
                break;
            case 'spacebar':
                if (this.applyButton && !this.applyButton.disabled) {
                    this.applyFunction(e);
                }
                break;
            default:
                this.navInCalendar(e, isLeftCalendar, leftDateLimit, rightDateLimit, ele);
                this.checkMinMaxDays();
        }
        this.presetHeight();
    };
    DateRangePicker.prototype.keyNavigation = function (calendar, e) {
        this.bindCalendarCellEvents(calendar);
        if (calendar.classList.contains(LEFTCALENDER)) {
            this.leftCalCurrentDate = new Date(+this.currentDate);
        }
        else {
            this.rightCalCurrentDate = new Date(+this.currentDate);
        }
        this.updateNavIcons();
        this.calendarIconEvent();
        this.updateRange([calendar]);
        this.dateDisabled = this.isDateDisabled(this.currentDate);
        e.preventDefault();
    };
    DateRangePicker.prototype.inputHandler = function (e) {
        switch (e.action) {
            case 'altDownArrow':
                if (!this.isPopupOpen()) {
                    if (this.inputElement.value === '') {
                        this.clear();
                        this.changeTrigger(e);
                        this.clearRange();
                    }
                    this.show(null, e);
                    this.isRangeIconClicked = false;
                    if (!this.isMobile) {
                        if (!sf.base.isNullOrUndefined(this.leftCalendar)) {
                            this.calendarFocus();
                        }
                    }
                    this.isKeyPopup = true;
                }
                break;
            case 'escape':
                if (this.isPopupOpen()) {
                    this.hide(e);
                }
                break;
            case 'enter':
                if (document.activeElement === this.inputElement) {
                    this.inputBlurHandler(e);
                    this.hide(e);
                }
                break;
            case 'tab':
                if (document.activeElement === this.inputElement && this.isPopupOpen()) {
                    this.hide(e);
                    e.preventDefault();
                }
                break;
        }
    };
    DateRangePicker.prototype.bindCalendarCellEvents = function (calendar) {
        var tdCells;
        if (calendar) {
            tdCells = calendar.querySelectorAll('.' + CALENDAR + ' td');
        }
        else {
            tdCells = this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td');
        }
        for (var _i = 0, tdCells_1 = tdCells; _i < tdCells_1.length; _i++) {
            var cell = tdCells_1[_i];
            sf.base.EventHandler.clearEvents(cell);
            var disabledCell = void 0;
            disabledCell = cell.classList.contains(DISABLED) || cell.classList.contains(DATEDISABLED);
            if (!disabledCell && !cell.classList.contains(WEEKNUMBER)) {
                if (!this.isMobile) {
                    sf.base.EventHandler.add(cell, 'mouseover', this.hoverSelection, this);
                }
                sf.base.EventHandler.add(cell, 'mousedown', this.selectRange, this);
            }
        }
    };
    DateRangePicker.prototype.removeFocusedDate = function () {
        var isDate = !sf.base.isNullOrUndefined(this.startValue) || !sf.base.isNullOrUndefined(this.endValue);
        var focusedDate;
        focusedDate = this.popupObj.element.querySelectorAll('.' + CALENDAR + ' .' + FOCUSDATE);
        for (var _i = 0, focusedDate_1 = focusedDate; _i < focusedDate_1.length; _i++) {
            var ele = focusedDate_1[_i];
            var today = new Date();
            var eleDate = this.getIdValue(null, ele);
            if ((this.depth === 'Month' && this.currentView() === 'Month' &&
                (!ele.classList.contains(TODAY) || (ele.classList.contains(TODAY) && isDate)))
                || (this.depth === 'Year' && this.currentView() === 'Year' &&
                    ((!this.isSameMonth(today, eleDate) && !this.isSameYear(today, eleDate)) || isDate))
                || (this.depth === 'Decade' && this.currentView() === 'Decade' &&
                    (!this.isSameYear(today, eleDate) || isDate))) {
                ele.classList.remove(FOCUSDATE);
                if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(ENDDATE)) {
                    ele.removeAttribute('aria-label');
                }
            }
        }
    };
    DateRangePicker.prototype.hoverSelection = function (event, element) {
        var currentElement = element || event.currentTarget;
        var currentDate = this.getIdValue(null, currentElement);
        if (!sf.base.isNullOrUndefined(this.startValue) && +this.startValue >= +this.min && +this.startValue <= +this.max) {
            if ((!this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)
                && sf.base.isNullOrUndefined(this.endValue) && sf.base.isNullOrUndefined(this.startValue))
                || (!sf.base.isNullOrUndefined(this.startValue) && sf.base.isNullOrUndefined(this.endValue))) {
                var tdCells = void 0;
                tdCells = this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td');
                for (var _i = 0, tdCells_2 = tdCells; _i < tdCells_2.length; _i++) {
                    var ele = tdCells_2[_i];
                    var isDisabledCell = (!ele.classList.contains(DISABLED) || ele.classList.contains(DATEDISABLED));
                    if (!ele.classList.contains(WEEKNUMBER) && isDisabledCell) {
                        var eleDate = this.getIdValue(null, ele);
                        var startDateValue = new Date(+this.startValue);
                        var eleDateValue = new Date(+eleDate);
                        if (eleDateValue.setHours(0, 0, 0, 0) >= startDateValue.setHours(0, 0, 0, 0) && +eleDate <= +currentDate) {
                            sf.base.addClass([ele], RANGEHOVER);
                        }
                        else {
                            sf.base.removeClass([ele], [RANGEHOVER]);
                        }
                    }
                }
            }
        }
    };
    DateRangePicker.prototype.isSameStartEnd = function (startVal, endVal) {
        var isSame = false;
        if (this.depth === 'Month') {
            if ((startVal).setHours(0, 0, 0, 0) === (endVal).setHours(0, 0, 0, 0)) {
                isSame = true;
            }
        }
        else if (this.depth === 'Year') {
            if ((startVal.getFullYear() === endVal.getFullYear()) &&
                (startVal.getMonth() === endVal.getMonth())) {
                isSame = true;
            }
        }
        else if (this.depth === 'Decade') {
            if (startVal.getFullYear() === endVal.getFullYear()) {
                isSame = true;
            }
        }
        return isSame;
    };
    DateRangePicker.prototype.updateRange = function (elementCollection) {
        if (!sf.base.isNullOrUndefined(this.startValue)) {
            for (var _i = 0, elementCollection_1 = elementCollection; _i < elementCollection_1.length; _i++) {
                var calendar = elementCollection_1[_i];
                var tdCells = calendar.querySelectorAll('.' + CALENDAR + ' td');
                for (var _a = 0, tdCells_3 = tdCells; _a < tdCells_3.length; _a++) {
                    var ele = tdCells_3[_a];
                    if (!ele.classList.contains(WEEKNUMBER) && !ele.classList.contains(DISABLED)) {
                        var eleDate = this.getIdValue(null, ele);
                        var eleDateValue = this.getIdValue(null, ele);
                        if (!sf.base.isNullOrUndefined(this.endValue)) {
                            if (this.currentView() === this.depth &&
                                +eleDateValue.setHours(0, 0, 0, 0) >= +new Date(+this.startValue).setHours(0, 0, 0, 0)
                                && +eleDateValue.setHours(0, 0, 0, 0) <= +new Date(+this.endValue).setHours(0, 0, 0, 0) &&
                                !this.isSameStartEnd(new Date(+this.startValue), new Date(+this.endValue)) &&
                                +new Date(+this.startValue).setHours(0, 0, 0, 0) >= +this.min
                                && +new Date(+this.endValue).setHours(0, 0, 0, 0) <= +this.max
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                sf.base.addClass([ele], RANGEHOVER);
                            }
                        }
                        else {
                            sf.base.removeClass([ele], [RANGEHOVER]);
                        }
                        if (!ele.classList.contains(OTHERMONTH)) {
                            var startDateValue = new Date(+this.startValue);
                            var eleDateValue_1 = new Date(+eleDate);
                            if (this.currentView() === this.depth &&
                                +eleDateValue_1.setHours(0, 0, 0, 0) === +startDateValue.setHours(0, 0, 0, 0)
                                && +eleDateValue_1.setHours(0, 0, 0, 0) >= +startDateValue.setHours(0, 0, 0, 0) &&
                                +this.startValue >= +this.min
                                && !this.inputWrapper.container.classList.contains('e-error')
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                sf.base.addClass([ele], [STARTDATE, SELECTED]);
                                this.addSelectedAttributes(ele, this.startValue, true);
                            }
                            var endDateValue = new Date(+this.endValue);
                            if (this.currentView() === 'Year') {
                                eleDateValue_1 = new Date(eleDateValue_1.getFullYear(), eleDateValue_1.getMonth() + 1, 0);
                            }
                            else if (this.currentView() === 'Decade') {
                                eleDateValue_1 = new Date(eleDateValue_1.getFullYear(), 11, 31);
                            }
                            if (this.currentView() === this.depth &&
                                !sf.base.isNullOrUndefined(this.endValue) &&
                                +eleDateValue_1.setHours(0, 0, 0, 0) === +endDateValue.setHours(0, 0, 0, 0)
                                && +eleDateValue_1.setHours(0, 0, 0, 0) <= +endDateValue.setHours(0, 0, 0, 0) &&
                                +this.startValue >= +this.min
                                && !this.inputWrapper.container.classList.contains('e-error')
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                sf.base.addClass([ele], [ENDDATE, SELECTED]);
                                this.addSelectedAttributes(ele, this.startValue, false);
                            }
                            if (+eleDate === +this.startValue && !sf.base.isNullOrUndefined(this.endValue) && +eleDate === +this.endValue) {
                                this.addSelectedAttributes(ele, this.endValue, false, true);
                            }
                        }
                    }
                }
            }
        }
    };
    DateRangePicker.prototype.checkMinMaxDays = function () {
        if ((!sf.base.isNullOrUndefined(this.minDays) && this.minDays > 0) || (!sf.base.isNullOrUndefined(this.maxDays) && this.maxDays > 0)) {
            if (!this.isMobile) {
                this.updateMinMaxDays(this.popupObj.element.querySelector('.' + LEFTCALENDER));
                this.updateMinMaxDays(this.popupObj.element.querySelector('.' + RIGHTCALENDER));
            }
            else {
                this.updateMinMaxDays(this.popupObj.element.querySelector('.' + CALENDAR));
            }
        }
    };
    DateRangePicker.prototype.rangeArgs = function (e) {
        var inputValue;
        var range;
        var startDate = !sf.base.isNullOrUndefined(this.startValue) ?
            this.globalize.formatDate(this.startValue, {
                format: this.formatString, type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd'
            }) : null;
        var endDate = !sf.base.isNullOrUndefined(this.endValue) ?
            this.globalize.formatDate(this.endValue, {
                format: this.formatString, type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd'
            }) : null;
        if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue)) {
            inputValue = startDate + ' ' + this.separator + ' ' + endDate;
            range = (Math.floor(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
        }
        else {
            inputValue = '';
            range = 0;
        }
        var args = {
            value: this.value,
            startDate: this.startValue,
            endDate: this.endValue,
            daySpan: range,
            event: e || null,
            element: this.element,
            isInteracted: !sf.base.isNullOrUndefined(e),
            text: inputValue
        };
        return args;
    };
    DateRangePicker.prototype.otherMonthSelect = function (ele, isStartDate, sameDate) {
        var value = +this.getIdValue(null, ele);
        var dateIdString = '*[id^="/id"]:not(.e-other-month)'.replace('/id', '' + value);
        var tdCell = this.popupObj && this.popupObj.element.querySelector(dateIdString);
        if (!sf.base.isNullOrUndefined(tdCell)) {
            if (isStartDate) {
                sf.base.addClass([tdCell], [STARTDATE, SELECTED]);
                this.addSelectedAttributes(tdCell, this.startValue, true);
            }
            else {
                sf.base.addClass([tdCell], [ENDDATE, SELECTED]);
                this.addSelectedAttributes(tdCell, this.endValue, true);
            }
            if (sameDate) {
                this.addSelectedAttributes(ele, this.endValue, false, true);
            }
        }
    };
    // tslint:disable-next-line:max-func-body-length
    DateRangePicker.prototype.selectRange = function (event, element) {
        var leftCalendar;
        var rightCalendar;
        if (event) {
            event.preventDefault();
        }
        var date;
        date = sf.base.isNullOrUndefined(event) ? this.getIdValue(null, element)
            : this.getIdValue(event, null);
        var y = date.getFullYear();
        var m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var firstMonth = new Date(y, 0, 1);
        var lastMonth = new Date(y, 11, 31);
        if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue)) {
            if (!this.isMobile || this.isMobile && !this.endButton.element.classList.contains(ACTIVE)) {
                this.removeSelection();
            }
        }
        else if (this.isMobile && this.startButton.element.classList.contains(ACTIVE)) {
            this.removeSelection();
        }
        var ele = element || event.currentTarget;
        if (sf.base.isNullOrUndefined(this.startValue)) {
            if (!sf.base.isNullOrUndefined(this.previousStartValue)) {
                date.setHours(this.previousStartValue.getHours());
                date.setMinutes(this.previousStartValue.getMinutes());
                date.setSeconds(this.previousStartValue.getSeconds());
            }
            this.startValue = (this.depth === 'Month') ? new Date(this.checkValue(date)) :
                (this.depth === 'Year') ? firstDay : firstMonth;
            this.endValue = null;
            this.setValue();
            sf.base.addClass([ele], STARTDATE);
            this.addSelectedAttributes(ele, this.startValue, true);
            if (ele.classList.contains(OTHERMONTH)) {
                this.otherMonthSelect(ele, true);
            }
            this.checkMinMaxDays();
            this.applyButton.disabled = true;
            this.applyButton.element.disabled = true;
            if (this.isMobile) {
                this.endButton.element.classList.add(ACTIVE);
                this.startButton.element.classList.remove(ACTIVE);
                this.endButton.element.removeAttribute('disabled');
                this.selectableDates();
            }
            this.trigger('select', this.rangeArgs(event));
        }
        else {
            if (+date === +this.startValue || +date > +this.startValue) {
                if (+date === +this.startValue && !sf.base.isNullOrUndefined(this.minDays) && this.minDays > 1) {
                    return;
                }
                this.endValue = null;
                this.setValue();
                if (this.isMobile || element) {
                    this.hoverSelection(event, element);
                }
                if (!sf.base.isNullOrUndefined(this.previousEndValue)) {
                    date.setHours(this.previousEndValue.getHours());
                    date.setMinutes(this.previousEndValue.getMinutes());
                    date.setSeconds(this.previousEndValue.getSeconds());
                }
                this.endValue = (this.depth === 'Month') ? new Date(this.checkValue(date)) :
                    (this.depth === 'Year') ? lastDay : lastMonth;
                this.setValue();
                var endEle = this.popupObj.element.querySelectorAll('.' + ENDDATE);
                if (this.isMobile) {
                    this.startButton.element.classList.remove(ACTIVE);
                    this.endButton.element.classList.add(ACTIVE);
                    for (var _i = 0, endEle_1 = endEle; _i < endEle_1.length; _i++) {
                        var ele_1 = endEle_1[_i];
                        ele_1.removeAttribute('aria-label');
                        if (!ele_1.classList.contains(STARTDATE)) {
                            ele_1.setAttribute('aria-selected', 'false');
                            sf.base.removeClass([ele_1], [ENDDATE, SELECTED]);
                        }
                        else {
                            this.addSelectedAttributes(ele_1, this.startValue, true);
                            sf.base.removeClass([ele_1], [ENDDATE]);
                        }
                    }
                }
                sf.base.addClass([ele], ENDDATE);
                if (+this.endValue === +this.startValue) {
                    this.addSelectedAttributes(ele, this.endValue, false, true);
                }
                else {
                    this.addSelectedAttributes(ele, this.endValue, false);
                }
                if (ele.classList.contains(OTHERMONTH)) {
                    if (+this.endValue === +this.startValue) {
                        this.otherMonthSelect(ele, false, true);
                    }
                    else {
                        this.otherMonthSelect(ele, false);
                    }
                }
                endEle = this.popupObj.element.querySelectorAll('.' + ENDDATE);
                for (var _a = 0, endEle_2 = endEle; _a < endEle_2.length; _a++) {
                    var ele_2 = endEle_2[_a];
                    if (ele_2.classList.contains(STARTDATE)) {
                        sf.base.removeClass([ele_2], [RANGEHOVER]);
                    }
                }
                this.applyButton.disabled = false;
                this.applyButton.element.disabled = false;
                if (!this.isMobile) {
                    this.removeClassDisabled();
                }
                this.disabledDateRender();
                this.trigger('select', this.rangeArgs(event));
            }
            else if (+date < +this.startValue) {
                this.removeClassDisabled();
                this.startValue = (this.depth === 'Month') ? new Date(this.checkValue(date)) :
                    (this.depth === 'Year') ? firstDay : firstMonth;
                this.setValue();
                this.removeSelectedAttributes();
                sf.base.removeClass(this.popupObj.element.querySelectorAll('.' + STARTDATE), [STARTDATE, SELECTED]);
                sf.base.addClass([ele], STARTDATE);
                this.addSelectedAttributes(ele, this.startValue, true);
                if (ele.classList.contains(OTHERMONTH)) {
                    this.otherMonthSelect(ele, true);
                }
                this.checkMinMaxDays();
            }
        }
        if (event) {
            leftCalendar = sf.base.closest(event.target, '.' + LEFTCALENDER);
        }
        if (!sf.base.isNullOrUndefined(leftCalendar)) {
            this.leftCalendar.children[1].firstElementChild.focus();
        }
        else {
            if (event) {
                rightCalendar = event && sf.base.closest(event.target, '.' + RIGHTCALENDER);
            }
            if (!sf.base.isNullOrUndefined(rightCalendar)) {
                this.rightCalendar.children[1].firstElementChild.focus();
            }
        }
        sf.base.addClass([ele], SELECTED);
        this.updateHeader();
        this.removeFocusedDate();
    };
    DateRangePicker.prototype.selectableDates = function () {
        if (!sf.base.isNullOrUndefined(this.startValue)) {
            var tdCells = this.calendarElement.querySelectorAll('.' + CALENDAR + ' td');
            var isStartDate = false;
            if (this.currentView() === this.depth) {
                for (var _i = 0, tdCells_4 = tdCells; _i < tdCells_4.length; _i++) {
                    var ele = tdCells_4[_i];
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(WEEKNUMBER)) {
                        if (!ele.classList.contains(DISABLED)) {
                            var eleDate = this.getIdValue(null, ele);
                            if (+eleDate < +this.startValue) {
                                sf.base.addClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                                sf.base.EventHandler.clearEvents(ele);
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                    }
                    if (ele.classList.contains(STARTDATE) && !ele.classList.contains(OTHERMONTH)) {
                        isStartDate = true;
                        break;
                    }
                }
                if (isStartDate) {
                    if (!this.previousIcon.classList.contains(DISABLED)) {
                        sf.base.addClass([this.previousIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                    }
                }
            }
            else {
                for (var _a = 0, tdCells_5 = tdCells; _a < tdCells_5.length; _a++) {
                    var ele = tdCells_5[_a];
                    var startMonth = this.startValue.getMonth();
                    var startYear = this.startValue.getFullYear();
                    var element = this.getIdValue(null, ele);
                    if (!this.startButton.element.classList.contains(ACTIVE) && ((this.currentView() === 'Year' &&
                        (element.getMonth() < startMonth) && (element.getFullYear() <= startYear))
                        || (this.currentView() === 'Decade' && (element.getMonth() <= startMonth) &&
                            (element.getFullYear() < startYear)))) {
                        sf.base.addClass([ele], [DISABLED]);
                    }
                    else {
                        break;
                    }
                }
                if (tdCells[0].classList.contains(DISABLED)) {
                    this.previousIconHandler(true);
                }
                else if (tdCells[tdCells.length - 1].classList.contains(DISABLED)) {
                    this.nextIconHandler(true);
                }
            }
        }
    };
    DateRangePicker.prototype.updateMinMaxDays = function (calendar) {
        if ((!sf.base.isNullOrUndefined(this.startValue) && sf.base.isNullOrUndefined(this.endValue)) ||
            (this.isMobile && this.endButton.element.classList.contains(ACTIVE))) {
            if ((!sf.base.isNullOrUndefined(this.minDays) && this.minDays > 0) || (!sf.base.isNullOrUndefined(this.maxDays) && this.maxDays > 0)) {
                var minDate = new Date(new Date(+this.startValue).setDate(this.startValue.getDate() + (this.minDays - 1)));
                var maxDate = new Date(new Date(+this.startValue).setDate(this.startValue.getDate() + (this.maxDays - 1)));
                minDate = (!sf.base.isNullOrUndefined(this.minDays) && this.minDays > 0) ? minDate : null;
                maxDate = (!sf.base.isNullOrUndefined(this.maxDays) && this.maxDays > 0) ? maxDate : null;
                if (this.currentView() === 'Year') {
                    minDate = sf.base.isNullOrUndefined(minDate) ? null : new Date(minDate.getFullYear(), minDate.getMonth(), 0);
                    maxDate = sf.base.isNullOrUndefined(maxDate) ? null : new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
                }
                else if (this.currentView() === 'Decade') {
                    minDate = sf.base.isNullOrUndefined(minDate) ? null : new Date(minDate.getFullYear() - 1, 11, 1);
                    maxDate = sf.base.isNullOrUndefined(maxDate) ? null : new Date(maxDate.getFullYear(), 0, 1);
                }
                var tdCells = calendar.querySelectorAll('.' + CALENDAR + ' td');
                var maxEle = void 0;
                for (var _i = 0, tdCells_6 = tdCells; _i < tdCells_6.length; _i++) {
                    var ele = tdCells_6[_i];
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(WEEKNUMBER)) {
                        var eleDate = this.getIdValue(null, ele);
                        if (!sf.base.isNullOrUndefined(minDate) && +eleDate === +minDate && ele.classList.contains(DISABLED)) {
                            minDate.setDate(minDate.getDate() + 1);
                        }
                        if (!ele.classList.contains(DISABLED)) {
                            if (+eleDate <= +this.startValue) {
                                continue;
                            }
                            if (!sf.base.isNullOrUndefined(minDate) && +eleDate < +minDate) {
                                sf.base.addClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                                sf.base.EventHandler.clearEvents(ele);
                            }
                            if (!sf.base.isNullOrUndefined(maxDate) && +eleDate > +maxDate) {
                                sf.base.addClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                                this.isMaxDaysClicked = true;
                                sf.base.EventHandler.clearEvents(ele);
                                if (sf.base.isNullOrUndefined(maxEle) && !ele.classList.contains(OTHERMONTH)) {
                                    maxEle = ele;
                                }
                            }
                        }
                    }
                }
                if (!sf.base.isNullOrUndefined(maxEle)) {
                    if (this.isMobile) {
                        if (!this.nextIcon.classList.contains(DISABLED)) {
                            sf.base.addClass([this.nextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                        }
                    }
                    else {
                        var calendar_1 = sf.base.closest(maxEle, '.' + RIGHTCALENDER);
                        calendar_1 = sf.base.isNullOrUndefined(calendar_1) ? this.leftCalendar : calendar_1;
                        var isLeftCalendar = calendar_1.classList.contains(LEFTCALENDER);
                        if (!isLeftCalendar) {
                            if (!this.rightCalNextIcon.classList.contains(DISABLED)) {
                                sf.base.addClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                        }
                        else {
                            if (!this.rightCalNextIcon.classList.contains(DISABLED)) {
                                sf.base.addClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                            if (!this.leftCalNextIcon.classList.contains(DISABLED)) {
                                sf.base.addClass([this.leftCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                            if (!this.rightCalPrevIcon.classList.contains(DISABLED)) {
                                sf.base.addClass([this.rightCalPrevIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                        }
                    }
                }
            }
        }
        else {
            this.isMaxDaysClicked = false;
        }
    };
    DateRangePicker.prototype.removeClassDisabled = function () {
        var tdCells;
        tdCells = this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td' + '.' + DATEDISABLED);
        for (var _i = 0, tdCells_7 = tdCells; _i < tdCells_7.length; _i++) {
            var ele = tdCells_7[_i];
            if (ele.classList.contains(DATEDISABLED)) {
                sf.base.removeClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                sf.base.EventHandler.add(ele, 'click', this.selectRange, this);
                if (!this.isMobile) {
                    sf.base.EventHandler.add(ele, 'mouseover', this.hoverSelection, this);
                }
            }
        }
        if (this.isMobile) {
            if (this.nextIcon.classList.contains(ICONDISABLED)) {
                sf.base.removeClass([this.nextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
            if (this.previousIcon.classList.contains(ICONDISABLED)) {
                sf.base.removeClass([this.previousIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
        }
        else {
            if (this.rightCalNextIcon.classList.contains(ICONDISABLED)) {
                sf.base.removeClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
            if (this.rightCalPrevIcon.classList.contains(ICONDISABLED)) {
                sf.base.removeClass([this.rightCalPrevIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
            if (this.leftCalNextIcon.classList.contains(ICONDISABLED)) {
                sf.base.removeClass([this.leftCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
        }
    };
    DateRangePicker.prototype.updateHeader = function () {
        var format = { type: 'date', skeleton: sf.base.isBlazor() ? 'D' : 'yMMMd' };
        if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue)) {
            var range = (Math.floor(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if (!sf.base.isNullOrUndefined(this.disabledDayCnt)) {
                range = range - this.disabledDayCnt;
                this.disabledDayCnt = null;
            }
            this.popupObj.element.querySelector('.' + DAYSPAN).textContent = range.toString() + ' ' + this.l10n.getConstant('days');
        }
        else {
            this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
        }
        if (!this.isMobile) {
            if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue)) {
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.globalize.formatDate(this.endValue, format);
            }
            else {
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.l10n.getConstant('endLabel');
            }
            if (!sf.base.isNullOrUndefined(this.startValue)) {
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.globalize.formatDate(this.startValue, format);
            }
            else {
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.l10n.getConstant('startLabel');
            }
        }
        else {
            if (!sf.base.isNullOrUndefined(this.startValue)) {
                this.startButton.element.textContent = this.globalize.formatDate(this.startValue, format);
            }
            else {
                this.startButton.element.textContent = this.l10n.getConstant('startLabel');
            }
            if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue)) {
                this.endButton.element.textContent = this.globalize.formatDate(this.endValue, format);
            }
            else {
                this.endButton.element.textContent = this.l10n.getConstant('endLabel');
            }
        }
        if ((this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue)) ||
            ((!sf.base.isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
                || (!sf.base.isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
                || ((!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue))
                    && +this.startValue > +this.endValue))) {
            if (!this.isMobile) {
                this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.l10n.getConstant('startLabel');
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.l10n.getConstant('endLabel');
            }
            else {
                this.startButton.element.textContent = this.l10n.getConstant('startLabel');
                this.endButton.element.textContent = this.l10n.getConstant('endLabel');
                this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
            }
        }
        if (this.popupObj.element.querySelector('#custom_range')) {
            this.popupObj.element.querySelector('#custom_range').textContent =
                this.l10n.getConstant('customRange') !== '' ? this.l10n.getConstant('customRange') : 'Custom Range';
        }
    };
    DateRangePicker.prototype.removeSelection = function () {
        this.startValue = null;
        this.endValue = null;
        this.setValue();
        this.removeSelectedAttributes();
        if (this.popupObj) {
            if (this.popupObj.element.querySelectorAll('.' + SELECTED).length > 0) {
                sf.base.removeClass(this.popupObj.element.querySelectorAll('.' + SELECTED), [STARTDATE, ENDDATE, SELECTED]);
            }
            if (this.popupObj.element.querySelectorAll('.' + FOCUSDATE).length > 0) {
                sf.base.removeClass(this.popupObj.element.querySelectorAll('.' + FOCUSDATE), FOCUSDATE);
            }
            if (this.popupObj.element.querySelectorAll('.' + RANGEHOVER).length > 0) {
                sf.base.removeClass(this.popupObj.element.querySelectorAll('.' + RANGEHOVER), [RANGEHOVER]);
            }
        }
    };
    DateRangePicker.prototype.addSelectedAttributes = function (ele, date, isStartDate, sameDate) {
        if (ele) {
            var title = this.globalize.formatDate(date, { type: 'date', skeleton: sf.base.isBlazor() ? 'D' : 'full' });
            if (!sf.base.isNullOrUndefined(sameDate) && sameDate) {
                ele.setAttribute('aria-label', 'The current start and end date is ' + '' + title);
            }
            else {
                ele.setAttribute('aria-label', 'The current ' + (isStartDate ? 'start' : 'end') + ' date is ' + '' + title);
            }
            ele.setAttribute('aria-selected', 'true');
        }
    };
    DateRangePicker.prototype.removeSelectedAttributes = function () {
        if (this.popupObj) {
            var start = this.popupObj.element.querySelectorAll('.' + STARTDATE);
            for (var _i = 0, start_1 = start; _i < start_1.length; _i++) {
                var ele = start_1[_i];
                ele.setAttribute('aria-selected', 'false');
                ele.removeAttribute('aria-label');
            }
            var end = this.popupObj.element.querySelectorAll('.' + ENDDATE);
            for (var _a = 0, end_1 = end; _a < end_1.length; _a++) {
                var ele = end_1[_a];
                ele.setAttribute('aria-selected', 'false');
                ele.removeAttribute('aria-label');
            }
        }
    };
    DateRangePicker.prototype.updateCalendarElement = function (calendar) {
        if (calendar.classList.contains(LEFTCALENDER)) {
            this.calendarElement = this.leftCalendar;
            this.currentDate = this.leftCalCurrentDate;
            this.previousIcon = this.leftCalPrevIcon;
            this.nextIcon = this.leftCalNextIcon;
        }
        else {
            this.calendarElement = this.rightCalendar;
            this.currentDate = this.rightCalCurrentDate;
            this.previousIcon = this.rightCalPrevIcon;
            this.nextIcon = this.rightCalNextIcon;
        }
        this.contentElement = calendar.querySelector('.' + CONTENT);
        this.tableBodyElement = sf.base.select('.' + CONTENT + ' tbody', calendar);
        this.table = calendar.querySelector('.' + CONTENT).getElementsByTagName('table')[0];
        this.headerTitleElement = calendar.querySelector('.' + HEADER + ' .' + TITLE);
        this.headerElement = calendar.querySelector('.' + HEADER);
    };
    DateRangePicker.prototype.navPrevMonth = function (e) {
        e.preventDefault();
        var ele = sf.base.closest(e.target, '.' + LEFTCALENDER);
        ele = sf.base.isNullOrUndefined(ele) ? sf.base.closest(e.target, '.' + RIGHTCALENDER) : ele;
        this.updateCalendarElement(ele);
        this.navigatePrevious(e);
        if (!sf.base.isNullOrUndefined(this.startValue) && sf.base.isNullOrUndefined(this.endValue)) {
            this.updateMinMaxDays(ele);
        }
        this.updateControl(ele);
    };
    DateRangePicker.prototype.deviceNavigation = function (ele) {
        this.deviceCalendarEvent();
        this.updateRange([this.popupObj.element.querySelector('.' + CALENDAR)]);
        if (this.endButton.element.classList.contains(ACTIVE)) {
            this.updateMinMaxDays(this.popupObj.element.querySelector('.' + CALENDAR));
        }
        if (this.endButton.element.classList.contains(ACTIVE)) {
            this.selectableDates();
        }
        if (this.currentView() === this.depth) {
            this.bindCalendarCellEvents();
        }
        this.removeFocusedDate();
    };
    DateRangePicker.prototype.updateControl = function (calendar) {
        if (calendar.classList.contains(RIGHTCALENDER)) {
            this.rightCalCurrentDate = new Date(+this.currentDate);
        }
        else {
            this.leftCalCurrentDate = new Date(+this.currentDate);
        }
        this.calendarIconEvent();
        if ((((this.depth === 'Month')
            && this.leftCalendar.querySelector('.e-content').classList.contains('e-month')
            && this.rightCalendar.querySelector('.e-content').classList.contains('e-month'))
            || ((this.depth === 'Year')
                && this.leftCalendar.querySelector('.e-content').classList.contains('e-year')
                && this.rightCalendar.querySelector('.e-content').classList.contains('e-year'))
            || ((this.depth === 'Decade')
                && this.leftCalendar.querySelector('.e-content').classList.contains('e-decade')
                && this.rightCalendar.querySelector('.e-content').classList.contains('e-decade')))
            || this.isMobile) {
            this.bindCalendarCellEvents();
        }
        this.removeFocusedDate();
        this.updateRange([calendar]);
    };
    DateRangePicker.prototype.navNextMonth = function (event) {
        event.preventDefault();
        var ele = sf.base.closest(event.target, '.' + LEFTCALENDER);
        ele = sf.base.isNullOrUndefined(ele) ? sf.base.closest(event.target, '.' + RIGHTCALENDER) : ele;
        this.updateCalendarElement(ele);
        this.navigateNext(event);
        if (!sf.base.isNullOrUndefined(this.startValue) && sf.base.isNullOrUndefined(this.endValue)) {
            this.updateMinMaxDays(ele);
        }
        this.updateControl(ele);
    };
    DateRangePicker.prototype.isPopupOpen = function () {
        if (!sf.base.isNullOrUndefined(this.popupObj) && this.popupObj.element.classList.contains(POPUP)) {
            return true;
        }
        return false;
    };
    DateRangePicker.prototype.createRangeHeader = function () {
        var labelContainer = this.createElement('div', { className: STARTENDCONTAINER });
        if (!this.isMobile) {
            var startLabel = this.createElement('a', { className: STARTLABEL });
            var endLabel = this.createElement('a', { className: ENDLABEL });
            var changeIcon = this.createElement('span', { className: CHANGEICON });
            sf.base.attributes(startLabel, { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'Start Date', 'role': 'button' });
            sf.base.attributes(endLabel, { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'End Date', 'role': 'button' });
            labelContainer.appendChild(startLabel);
            labelContainer.appendChild(changeIcon);
            labelContainer.appendChild(endLabel);
            startLabel.textContent = this.l10n.getConstant('startLabel');
            endLabel.textContent = this.l10n.getConstant('endLabel');
        }
        else {
            var endBtn = this.createElement('button', { className: ENDBUTTON });
            var startBtn = this.createElement('button', { className: STARTBUTTON });
            this.startButton = new sf.buttons.Button({ content: this.l10n.getConstant('startLabel') }, startBtn);
            this.endButton = new sf.buttons.Button({ content: this.l10n.getConstant('endLabel') }, endBtn);
            labelContainer.appendChild(startBtn);
            labelContainer.appendChild(endBtn);
        }
        return labelContainer;
    };
    DateRangePicker.prototype.disableInput = function () {
        if (this.strictMode) {
            if (!sf.base.isNullOrUndefined(this.previousStartValue) && !sf.base.isNullOrUndefined(this.previousEndValue)) {
                this.startValue = this.previousStartValue;
                this.endValue = this.previousEndValue;
                this.setValue();
                this.updateInput();
            }
        }
        else {
            this.updateInput();
            this.clearRange();
            this.setProperties({ startDate: null }, true);
            this.setProperties({ endDate: null }, true);
            this.startValue = null;
            this.endValue = null;
            this.setValue();
            this.errorClass();
        }
        this.setProperties({ enabled: false }, true);
        sf.inputs.Input.setEnabled(this.enabled, this.inputElement);
        this.bindEvents();
    };
    DateRangePicker.prototype.validateMinMax = function () {
        this.min = sf.base.isNullOrUndefined(this.min) || !(+this.min) ? this.min = new Date(1900, 0, 1) : this.min;
        this.max = sf.base.isNullOrUndefined(this.max) || !(+this.max) ? this.max = new Date(2099, 11, 31) : this.max;
        if (!(this.min <= this.max)) {
            this.disableInput();
            return;
        }
        if (!sf.base.isNullOrUndefined(this.minDays) && !sf.base.isNullOrUndefined(this.maxDays)) {
            if (this.maxDays > 0 && this.minDays > 0 && (this.minDays > this.maxDays)) {
                this.maxDays = null;
            }
        }
        if (!sf.base.isNullOrUndefined(this.minDays) && this.minDays < 0) {
            this.minDays = null;
        }
        if (!sf.base.isNullOrUndefined(this.maxDays) && this.maxDays < 0) {
            this.maxDays = null;
        }
    };
    DateRangePicker.prototype.validateRangeStrict = function () {
        if (!sf.base.isNullOrUndefined(this.startValue)) {
            if (+this.startValue <= +this.min) {
                this.startValue = this.min;
                this.setValue();
            }
            else if (+this.startValue >= +this.min && +this.startValue >= +this.max) {
                this.startValue = this.max;
            }
        }
        if (!sf.base.isNullOrUndefined(this.endValue)) {
            if (+this.endValue > +this.max) {
                this.endValue = this.max;
                this.setValue();
            }
            else if (+this.endValue < +this.min) {
                this.endValue = this.min;
                this.setValue();
            }
        }
        this.validateMinMaxDays();
    };
    DateRangePicker.prototype.validateRange = function () {
        this.validateMinMaxDays();
    };
    DateRangePicker.prototype.validateMinMaxDays = function () {
        if (!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue)) {
            var range = (Math.floor(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if ((!sf.base.isNullOrUndefined(this.minDays) && this.minDays > 0) && !(range >= this.minDays)) {
                if (this.strictMode) {
                    var date = new Date(+this.startValue);
                    date.setDate(date.getDate() + (this.minDays - 1));
                    if (+date > +this.max) {
                        this.endValue = this.max;
                        this.setValue();
                    }
                    else {
                        this.endValue = date;
                        this.setValue();
                    }
                }
                else {
                    this.startValue = null;
                    this.endValue = null;
                    this.setValue();
                }
            }
            if ((!sf.base.isNullOrUndefined(this.maxDays) && this.maxDays > 0) && !(range <= this.maxDays)) {
                if (this.strictMode) {
                    this.endValue = new Date(+this.startValue);
                    this.endValue.setDate(this.endValue.getDate() + (this.maxDays - 1));
                    this.setValue();
                }
                else {
                    this.startValue = null;
                    this.endValue = null;
                    this.setValue();
                }
            }
        }
    };
    DateRangePicker.prototype.renderCalendar = function () {
        this.calendarElement = this.createElement('div');
        this.calendarElement.classList.add(CALENDAR);
        if (this.enableRtl) {
            this.calendarElement.classList.add(RTL);
        }
        sf.base.attributes(this.calendarElement, { 'role': 'calendar' });
        _super.prototype.createHeader.call(this);
        _super.prototype.createContent.call(this);
    };
    DateRangePicker.prototype.isSameMonth = function (start, end) {
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return true;
        }
        return false;
    };
    DateRangePicker.prototype.isSameYear = function (start, end) {
        if (start.getFullYear() === end.getFullYear()) {
            return true;
        }
        return false;
    };
    DateRangePicker.prototype.isSameDecade = function (start, end) {
        var startYear = start.getFullYear();
        var endYear = end.getFullYear();
        if ((startYear - (startYear % 10)) === (endYear - (endYear % 10))) {
            return true;
        }
        return false;
    };
    DateRangePicker.prototype.startMonthCurrentDate = function () {
        if (this.isSameMonth(this.min, this.max) || +this.currentDate > +this.max || this.isSameMonth(this.currentDate, this.max)) {
            this.currentDate = new Date(+this.max);
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        }
        else if (this.currentDate < this.min) {
            this.currentDate = new Date(this.checkValue(this.min));
        }
    };
    DateRangePicker.prototype.selectNextMonth = function () {
        if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue) && !this.isSameMonth(this.endValue, this.currentDate)
            && !this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)) {
            this.currentDate = new Date(+this.endValue);
        }
        else {
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            return;
        }
        if ((!sf.base.isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
            || (!sf.base.isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || ((!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setDate(1);
            var month = this.currentDate.getMonth() + 1;
            this.currentDate.setMonth(month);
        }
    };
    DateRangePicker.prototype.selectNextYear = function () {
        if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue) && !this.isSameYear(this.endValue, this.currentDate)
            && !this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)) {
            this.currentDate = new Date(+this.endValue);
        }
        else {
            this.currentDate.setMonth(0);
            var yr = this.currentDate.getFullYear() + 1;
            this.currentDate.setFullYear(yr);
            return;
        }
        if ((!sf.base.isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || ((!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
            || (!sf.base.isNullOrUndefined(this.startValue) && +this.startValue < +this.min)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setMonth(0);
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        }
    };
    DateRangePicker.prototype.selectNextDecade = function () {
        if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue) && !this.isSameDecade(this.endValue, this.currentDate)
            && !this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)) {
            this.currentDate = new Date(+this.endValue);
        }
        else {
            var decyr = this.currentDate.getFullYear() + 10;
            this.currentDate.setFullYear(decyr);
            return;
        }
        if (((!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
            || (!sf.base.isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || (!sf.base.isNullOrUndefined(this.startValue) && +this.startValue < +this.min)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 10);
        }
    };
    DateRangePicker.prototype.selectStartMonth = function () {
        if (!sf.base.isNullOrUndefined(this.startValue)) {
            if (!sf.base.isNullOrUndefined(this.max) && this.isSameMonth(this.startValue, this.max)) {
                this.currentDate = new Date(+this.max);
                this.currentDate.setDate(1);
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            }
            else if (!(this.startValue >= this.min && this.startValue <= this.max)
                || this.isDateDisabled(this.startValue)) {
                this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            }
            else {
                this.currentDate = new Date(+this.startValue);
            }
        }
        else {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.startMonthCurrentDate();
        }
        if ((!sf.base.isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || (!sf.base.isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
            || ((!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
        }
        this.startMonthCurrentDate();
    };
    DateRangePicker.prototype.createCalendar = function () {
        var calendarContainer = this.createElement('div', { className: CALENDARCONTAINER });
        if (!this.isMobile) {
            this.selectStartMonth();
            this.renderCalendar();
            this.leftCalCurrentDate = new Date(+this.currentDate);
            this.calendarElement.classList.add(LEFTCALENDER);
            this.leftCalPrevIcon = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + PREVICON);
            this.leftCalNextIcon = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + NEXTICON);
            this.leftTitle = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + TITLE);
            sf.base.remove(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + ICONCONTAINER));
            this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER).appendChild(this.leftCalNextIcon);
            this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER).appendChild(this.leftCalPrevIcon);
            sf.base.prepend([this.leftCalPrevIcon], this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER));
            this.leftCalendar = this.calendarElement;
            var leftContainer = this.createElement('div', { className: LEFTCONTAINER });
            var rightContainer = this.createElement('div', { className: RIGHTCONTAINER });
            leftContainer.appendChild(this.leftCalendar);
            calendarContainer.appendChild(leftContainer);
            if (!this.isMobile) {
                sf.base.EventHandler.add(this.leftTitle, 'click', this.leftNavTitle, this);
            }
            if (this.start === 'Month') {
                this.selectNextMonth();
            }
            if (this.start === 'Year') {
                this.selectNextYear();
            }
            if (this.start === 'Decade') {
                this.selectNextDecade();
            }
            this.renderCalendar();
            this.rightCalCurrentDate = new Date(+this.currentDate);
            sf.base.addClass([this.calendarElement], RIGHTCALENDER);
            this.rightCalendar = this.calendarElement;
            sf.base.removeClass([this.leftCalendar && this.leftCalendar.querySelector('.e-content tbody')], 'e-zoomin');
            sf.base.removeClass([this.rightCalendar && this.rightCalendar.querySelector('.e-content tbody')], 'e-zoomin');
            this.rightCalPrevIcon = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + PREVICON);
            this.rightCalNextIcon = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + NEXTICON);
            this.rightTitle = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + TITLE);
            sf.base.remove(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + ICONCONTAINER));
            this.calendarElement.querySelector('table').setAttribute('tabindex', '-1');
            this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER).appendChild(this.rightCalNextIcon);
            this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER).appendChild(this.rightCalPrevIcon);
            sf.base.prepend([this.rightCalPrevIcon], this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER));
            rightContainer.appendChild(this.rightCalendar);
            calendarContainer.appendChild(rightContainer);
            if (!this.isMobile) {
                sf.base.EventHandler.add(this.rightTitle, 'click', this.rightNavTitle, this);
            }
        }
        else {
            if (!sf.base.isNullOrUndefined(this.startValue)) {
                this.currentDate = new Date(+this.startValue);
            }
            _super.prototype.validateDate.call(this);
            _super.prototype.minMaxUpdate.call(this);
            _super.prototype.render.call(this);
            var prevIcon = this.calendarElement.querySelector('.' + CALENDAR + ' .' + PREVICON);
            var nextIcon = this.calendarElement.querySelector('.' + CALENDAR + ' .' + NEXTICON);
            sf.base.remove(this.calendarElement.querySelector('.' + CALENDAR + ' .' + ICONCONTAINER));
            this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER).appendChild(nextIcon);
            this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER).appendChild(prevIcon);
            sf.base.prepend([prevIcon], this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER));
            this.deviceCalendar = this.calendarElement;
            calendarContainer.appendChild(this.calendarElement);
            this.headerTitleElement = this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER + ' .' + TITLE);
        }
        return calendarContainer;
    };
    DateRangePicker.prototype.leftNavTitle = function (e) {
        if (this.isPopupOpen()) {
            this.calendarElement = this.leftCalendar;
            this.calendarNavigation(e, this.calendarElement);
        }
    };
    DateRangePicker.prototype.calendarNavigation = function (e, element) {
        this.table = element.querySelector('table');
        this.headerTitleElement = element.querySelector('.e-title');
        this.tableBodyElement = element.querySelector('tbody');
        this.tableHeadElement = element.querySelector('thead');
        this.contentElement = element.querySelector('.e-content');
        this.updateCalendarElement(element);
        _super.prototype.navigateTitle.call(this, e);
        this.updateNavIcons();
    };
    DateRangePicker.prototype.rightNavTitle = function (e) {
        if (this.isPopupOpen()) {
            this.calendarElement = this.rightCalendar;
            this.calendarNavigation(e, this.calendarElement);
        }
    };
    DateRangePicker.prototype.clickEventEmitter = function (e) {
        if (!this.isMobile) {
            if (sf.base.closest(e.target, '.e-calendar.e-left-calendar')) {
                this.calendarElement = this.leftCalendar;
                this.updateCalendarElement(this.leftCalendar);
            }
            else {
                this.calendarElement = this.rightCalendar;
                this.updateCalendarElement(this.rightCalendar);
            }
        }
    };
    /**
     * Gets the current view of the Calendar.
     * @returns string
     * @private
     * @hidden
     */
    DateRangePicker.prototype.currentView = function () {
        return _super.prototype.currentView.call(this);
    };
    DateRangePicker.prototype.getCalendarView = function (view) {
        if (view === 'Year') {
            return 'Year';
        }
        else if (view === 'Decade') {
            return 'Decade';
        }
        else {
            return 'Month';
        }
    };
    DateRangePicker.prototype.navigatedEvent = function (e) {
        this.trigger('navigated', this.navigatedArgs);
        if (!sf.base.isNullOrUndefined(this.popupObj)) {
            var element = void 0;
            var view = this.getCalendarView(this.currentView());
            if (this.isMobile) {
                if (view === this.depth) {
                    this.bindCalendarCellEvents();
                    this.deviceNavigation();
                    this.removeFocusedDate();
                    this.checkMinMaxDays();
                }
                else {
                    this.selectableDates();
                }
            }
            else {
                if (!this.isMobile && view === this.depth) {
                    element = this.calendarElement.classList.contains('e-left-calendar') ? this.leftCalendar : this.rightCalendar;
                    if (element === this.leftCalendar && ((e && !e.currentTarget.children[0].classList.contains('e-icons'))
                        || (!sf.base.isNullOrUndefined(this.controlDown)))) {
                        this.leftCalCurrentDate = new Date(+this.currentDate);
                        this.effect = '';
                        this.currentDate = this.leftCalCurrentDate;
                        this.updateCalendarElement(this.leftCalendar);
                        this.updateControl(this.leftCalendar);
                        this.updateCalendarElement(this.rightCalendar);
                        _super.prototype.navigateTo.call(this, view, this.rightCalCurrentDate);
                        this.updateControl(this.rightCalendar);
                        this.updateNavIcons();
                        this.calendarIconEvent();
                        this.calendarIconRipple();
                        this.controlDown = null;
                    }
                    else if (e && !e.currentTarget.children[0].classList.contains('e-icons')
                        || (!sf.base.isNullOrUndefined(this.controlDown))) {
                        this.rightCalCurrentDate = new Date(+this.currentDate);
                        this.effect = '';
                        this.currentDate = this.rightCalCurrentDate;
                        this.updateCalendarElement(this.rightCalendar);
                        this.updateControl(this.rightCalendar);
                        this.updateCalendarElement(this.leftCalendar);
                        if (this.startValue && sf.base.isNullOrUndefined(this.endValue)) {
                            if (view === 'Month' && this.startValue.getMonth() < this.rightCalCurrentDate.getMonth() &&
                                this.startValue.getFullYear() <= this.rightCalCurrentDate.getFullYear()) {
                                _super.prototype.navigateTo.call(this, view, new Date(+this.startValue));
                            }
                            else if (view === 'Year' && this.startValue.getFullYear() < this.rightCalCurrentDate.getFullYear()) {
                                _super.prototype.navigateTo.call(this, view, new Date(+this.startValue));
                            }
                            else {
                                _super.prototype.navigateTo.call(this, view, this.leftCalCurrentDate);
                            }
                        }
                        else {
                            _super.prototype.navigateTo.call(this, view, this.leftCalCurrentDate);
                        }
                        this.updateControl(this.leftCalendar);
                        this.updateNavIcons();
                        this.calendarIconEvent();
                        this.calendarIconRipple();
                        this.controlDown = null;
                    }
                    this.checkMinMaxDays();
                }
                else {
                    this.updateNavIcons();
                    this.calendarIconEvent();
                }
            }
        }
    };
    DateRangePicker.prototype.createControl = function () {
        var controlContainer = this.createElement('div', { className: RANGECONTAINER });
        var headerContainer = this.createElement('div', { className: RANGEHEADER });
        var labelContainer = this.createRangeHeader();
        headerContainer.appendChild(labelContainer);
        var daySpan = this.createElement('div', { className: DAYSPAN });
        sf.base.attributes(daySpan, { 'aria-label': 'Selected Days' });
        daySpan.textContent = this.l10n.getConstant('selectedDays');
        headerContainer.appendChild(daySpan);
        var separator = this.createElement('div', { className: SEPARATOR });
        var calendarContainer = this.createCalendar();
        controlContainer.appendChild(headerContainer);
        controlContainer.appendChild(separator);
        controlContainer.appendChild(calendarContainer);
        var footerSection = this.createElement('div', { className: FOOTER });
        var cancelBtn = this.createElement('button', { className: CANCEL + ' ' + FLAT + ' ' + CSS });
        var applyBtn = this.createElement('button');
        sf.base.addClass([applyBtn], [APPLY, FLAT, PRIMARY, CSS]);
        footerSection.appendChild(applyBtn);
        footerSection.appendChild(cancelBtn);
        var enable = !sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue);
        this.cancelButton = new sf.buttons.Button({ content: this.l10n.getConstant('cancelText') }, cancelBtn);
        this.applyButton = new sf.buttons.Button({ content: this.l10n.getConstant('applyText'), disabled: !enable }, applyBtn);
        sf.base.EventHandler.add(applyBtn, 'click', this.applyFunction, this);
        sf.base.EventHandler.add(cancelBtn, 'click', this.cancelFunction, this);
        this.popupWrapper.appendChild(controlContainer);
        if (!this.isMobile) {
            if (!sf.base.isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
                this.createPresets();
                this.listRippleEffect();
                sf.base.addClass([controlContainer], RANGEBORDER);
                sf.base.addClass([this.popupWrapper], 'e-preset-wrapper');
                var presets = this.popupWrapper.querySelector('.' + PRESETS);
                presets.style.height = this.popupWrapper.querySelector('.' + RANGECONTAINER).getBoundingClientRect().height + 'px';
            }
        }
        this.popupWrapper.appendChild(footerSection);
        if (this.isMobile) {
            this.deviceHeaderUpdate();
        }
        this.renderPopup();
    };
    DateRangePicker.prototype.cancelFunction = function (eve) {
        if (document.activeElement !== this.inputElement) {
            this.preventFocus = true;
            this.inputElement.focus();
            sf.base.addClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
        eve.preventDefault();
        if (this.isKeyPopup) {
            this.inputElement.focus();
            this.isKeyPopup = false;
        }
        this.startValue = null;
        this.endValue = null;
        this.removeSelection();
        this.hide(eve);
    };
    DateRangePicker.prototype.deviceHeaderUpdate = function () {
        if (sf.base.isNullOrUndefined(this.startValue) && sf.base.isNullOrUndefined(this.endValue)) {
            this.endButton.element.setAttribute('disabled', '');
            this.startButton.element.classList.add(ACTIVE);
        }
        else if (!sf.base.isNullOrUndefined(this.startValue)) {
            this.startButton.element.classList.add(ACTIVE);
        }
    };
    DateRangePicker.prototype.applyFunction = function (eve) {
        var isValueChanged = false;
        if (eve.type !== 'touchstart') {
            eve.preventDefault();
        }
        if (this.closeEventArgs && this.closeEventArgs.cancel) {
            this.startValue = this.popupWrapper.querySelector('.e-start-date') &&
                this.getIdValue(null, this.popupWrapper.querySelector('.e-start-date'));
            this.endValue = this.popupWrapper.querySelector('.e-end-date') &&
                this.getIdValue(null, this.popupWrapper.querySelector('.e-end-date'));
            this.setValue();
        }
        if (document.activeElement !== this.inputElement) {
            this.preventFocus = true;
            this.inputElement.focus();
            sf.base.addClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
        if (eve.type !== 'touchstart' &&
            this.closeEventArgs && !this.closeEventArgs.cancel) {
            eve.preventDefault();
        }
        if (!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue)) {
            this.previousStartValue = new Date(+this.startValue);
            this.previousEndValue = new Date(+this.endValue);
            this.previousEleValue = this.inputElement.value;
            sf.inputs.Input.setValue(this.rangeArgs(eve).text, this.inputElement, this.floatLabelType, this.showClearButton);
            if (+this.initStartDate !== +this.startValue || +this.initEndDate !== +this.endValue) {
                isValueChanged = true;
            }
            this.changeTrigger(eve);
            this.hide(eve ? eve : null);
            this.errorClass();
            isValueChanged = true;
        }
        else {
            this.hide(eve ? eve : null);
        }
        if (!(sf.base.closest(eve.target, '.' + INPUTCONTAINER))
            && (!isValueChanged)) {
            this.focusOut();
        }
        if (!this.isMobile) {
            this.isKeyPopup = false;
            if (this.isRangeIconClicked) {
                this.inputWrapper.container.children[1].focus();
                this.keyInputConfigs = sf.base.extend(this.keyInputConfigs, this.keyConfigs);
                this.popupKeyboardModule = new sf.base.KeyboardEvents(this.inputWrapper.container.children[1], {
                    eventName: 'keydown',
                    keyConfigs: this.keyInputConfigs,
                    keyAction: this.popupKeyActionHandle.bind(this)
                });
            }
        }
    };
    DateRangePicker.prototype.onMouseClick = function (event, item) {
        if (event.type === 'touchstart') {
            return;
        }
        var target = item || event.target;
        var li = sf.base.closest(target, '.' + LISTCLASS);
        var isClick = li && li.classList.contains(ACTIVE);
        if (li && li.classList.contains(LISTCLASS)) {
            this.setListSelection(li, event);
        }
        this.inputElement.focus();
        if (!this.isMobile) {
            this.preventFocus = true;
            if (li && li.classList.contains(LISTCLASS) && li.getAttribute('id') === 'custom_range') {
                this.leftCalendar.children[1].firstElementChild.focus();
            }
            else {
                if (!isClick && event.type === 'keydown') {
                    this.inputElement.focus();
                }
            }
        }
    };
    DateRangePicker.prototype.onMouseOver = function (event) {
        var li = sf.base.closest(event.target, '.' + LISTCLASS);
        if (li && li.classList.contains(LISTCLASS) && !li.classList.contains(HOVER)) {
            sf.base.addClass([li], HOVER);
        }
    };
    DateRangePicker.prototype.onMouseLeave = function (event) {
        var item = sf.base.closest(event.target, '.' + HOVER);
        if (!sf.base.isNullOrUndefined(item)) {
            sf.base.removeClass([item], HOVER);
        }
    };
    DateRangePicker.prototype.setListSelection = function (li, event) {
        if (li && (!li.classList.contains(ACTIVE) || (this.isMobile && li.classList.contains(ACTIVE)))) {
            if (this.isMobile && li.classList.contains(ACTIVE)) {
                this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
                var values_1 = this.presetsItem[this.activeIndex];
                if (values_1.id === 'custom_range') {
                    this.renderCustomPopup();
                    return;
                }
                return;
            }
            this.removeListSelection();
            this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
            sf.base.addClass([li], ACTIVE);
            li.setAttribute('aria-selected', 'true');
            var values = this.presetsItem[this.activeIndex];
            if (values.id === 'custom_range') {
                this.renderCustomPopup();
            }
            else {
                this.applyPresetRange(values, event);
            }
        }
    };
    DateRangePicker.prototype.removeListSelection = function () {
        var item = this.presetElement.querySelector('.' + ACTIVE);
        if (!sf.base.isNullOrUndefined(item)) {
            sf.base.removeClass([item], ACTIVE);
            item.removeAttribute('aria-selected');
        }
    };
    DateRangePicker.prototype.setValue = function () {
        this.modelValue = [this.startValue, this.endValue];
    };
    DateRangePicker.prototype.applyPresetRange = function (values, e) {
        this.hide(null);
        this.presetsItem[this.presetsItem.length - 1].start = null;
        this.presetsItem[this.presetsItem.length - 1].end = null;
        this.startValue = values.start;
        this.endValue = values.end;
        this.setValue();
        this.refreshControl();
        this.trigger('select', this.rangeArgs(e));
        this.changeTrigger(e);
        this.previousEleValue = this.inputElement.value;
        this.isCustomRange = false;
        this.leftCalendar = this.rightCalendar = null;
        if (this.isKeyPopup) {
            this.isRangeIconClicked = false;
            this.inputElement.focus();
        }
    };
    DateRangePicker.prototype.showPopup = function (element, event) {
        this.presetHeight();
        if (this.zIndex === 1000) {
            this.popupObj.show(null, this.element);
        }
        else {
            this.popupObj.show(null, null);
        }
        if (this.isMobile) {
            this.popupObj.refreshPosition();
        }
    };
    DateRangePicker.prototype.renderCustomPopup = function () {
        this.isCustomWindow = true;
        this.popupObj.hide();
        this.popupWrapper = this.createElement('div', { id: this.element.id + '_popup', className: ROOT + ' ' + POPUP });
        this.renderControl();
        this.openEventArgs.appendTo.appendChild(this.popupWrapper);
        this.showPopup();
        this.isCustomRange = true;
        if (!this.isMobile) {
            this.calendarFocus();
        }
    };
    DateRangePicker.prototype.listRippleEffect = function () {
        for (var _i = 0, _a = this.liCollections; _i < _a.length; _i++) {
            var li = _a[_i];
            sf.base.rippleEffect(li);
        }
    };
    DateRangePicker.prototype.createPresets = function () {
        if (!sf.base.isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
            this.presetElement = this.createElement('div', { className: PRESETS, attrs: { 'tabindex': '0' } });
            var listTag = sf.lists.ListBase.createList(this.createElement, this.presetsItem, null, true);
            sf.base.attributes(listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
            this.presetElement.appendChild(listTag);
            this.popupWrapper.appendChild(this.presetElement);
            var customElement = this.presetElement.querySelector('#custom_range');
            if (!sf.base.isNullOrUndefined(customElement)) {
                customElement.textContent = this.l10n.getConstant('customRange') !== '' ? this.l10n.getConstant('customRange')
                    : 'Custom Range';
            }
            this.liCollections = this.presetElement.querySelectorAll('.' + LISTCLASS);
            this.wireListEvents();
            if (this.isMobile) {
                this.presetElement.style.width = this.inputWrapper.container.getBoundingClientRect().width + 'px';
            }
            if (!sf.base.isNullOrUndefined(this.activeIndex) && this.activeIndex > -1) {
                sf.base.addClass([this.liCollections[this.activeIndex]], ACTIVE);
            }
        }
    };
    DateRangePicker.prototype.wireListEvents = function () {
        sf.base.EventHandler.add(this.presetElement, 'click', this.onMouseClick, this);
        if (!this.isMobile) {
            sf.base.EventHandler.add(this.presetElement, 'mouseover', this.onMouseOver, this);
            sf.base.EventHandler.add(this.presetElement, 'mouseout', this.onMouseLeave, this);
        }
    };
    DateRangePicker.prototype.unWireListEvents = function () {
        if (!sf.base.isNullOrUndefined(this.presetElement)) {
            sf.base.EventHandler.remove(this.presetElement, 'click touchstart', this.onMouseClick);
            if (!this.isMobile) {
                sf.base.EventHandler.remove(this.presetElement, 'mouseover', this.onMouseOver);
                sf.base.EventHandler.remove(this.presetElement, 'mouseout', this.onMouseLeave);
            }
        }
    };
    // tslint:disable-next-line:max-func-body-length
    DateRangePicker.prototype.renderPopup = function () {
        var _this = this;
        this.popupWrapper.classList.add('e-control');
        var popupWidth = this.popupWrapper.getBoundingClientRect().width;
        if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass.trim() !== '') {
            this.popupWrapper.className += ' ' + this.cssClass;
        }
        if (this.isMobile && this.isCustomWindow) {
            this.modal = this.createElement('div');
            document.body.appendChild(this.modal);
        }
        this.popupObj = new sf.popups.Popup(this.popupWrapper, {
            relateTo: this.isMobile && this.isCustomWindow ? document.body :
                (!sf.base.isNullOrUndefined(this.targetElement) ? this.targetElement : this.inputWrapper.container),
            position: (this.isMobile ?
                (!sf.base.isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && !this.isCustomWindow ?
                    { X: 'left', Y: 'bottom' } : { X: 'center', Y: 'center' }) :
                this.enableRtl ? { X: 'left', Y: 'bottom' } : { X: 'right', Y: 'bottom' }),
            offsetX: this.isMobile || this.enableRtl ? 0 : -popupWidth,
            offsetY: OFFSETVALUE,
            collision: this.isMobile ?
                (!sf.base.isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && !this.isCustomWindow ?
                    { X: 'fit' } : { X: 'fit', Y: 'fit' }) : { X: 'fit', Y: 'flip' },
            targetType: this.isMobile && this.isCustomWindow ? 'container' : 'relative',
            enableRtl: this.enableRtl,
            zIndex: this.zIndex,
            open: function () {
                sf.base.attributes(_this.inputElement, { 'aria-expanded': 'true' });
                sf.base.addClass([_this.inputWrapper.buttons[0]], ACTIVE);
                if (!_this.isMobile) {
                    if (_this.cancelButton) {
                        _this.btnKeyboardModule = new sf.base.KeyboardEvents(_this.cancelButton.element, {
                            eventName: 'keydown',
                            keyAction: _this.popupKeyActionHandle.bind(_this),
                            keyConfigs: { tab: 'tab', altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                        });
                        _this.btnKeyboardModule = new sf.base.KeyboardEvents(_this.applyButton.element, {
                            eventName: 'keydown',
                            keyAction: _this.popupKeyActionHandle.bind(_this),
                            keyConfigs: { altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                        });
                    }
                    if (!sf.base.isNullOrUndefined(_this.leftCalendar)) {
                        if (!_this.isRangeIconClicked) {
                            _this.calendarFocus();
                        }
                    }
                    if (!sf.base.isNullOrUndefined(_this.presetElement)) {
                        _this.keyInputConfigs = sf.base.extend(_this.keyInputConfigs, _this.keyConfigs);
                        _this.presetKeyboardModule = new sf.base.KeyboardEvents(_this.presetElement, {
                            eventName: 'keydown',
                            keyAction: _this.presetKeyActionHandler.bind(_this),
                            keyConfigs: _this.keyInputConfigs
                        });
                        _this.presetKeyboardModule = new sf.base.KeyboardEvents(_this.presetElement, {
                            eventName: 'keydown',
                            keyAction: _this.popupKeyActionHandle.bind(_this),
                            keyConfigs: { altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                        });
                        if (sf.base.isNullOrUndefined(_this.leftCalendar)) {
                            _this.preventBlur = true;
                            _this.presetElement.focus();
                        }
                        else {
                            _this.presetElement.setAttribute('tabindex', '-1');
                        }
                    }
                    _this.popupKeyBoardHandler();
                }
                if (_this.isMobile && !sf.base.Browser.isDevice) {
                    sf.base.EventHandler.add(document, 'keydown', _this.popupCloseHandler, _this);
                }
            },
            close: function () {
                sf.base.attributes(_this.inputElement, { 'aria-expanded': 'false' });
                sf.base.removeClass([_this.inputWrapper.buttons[0]], ACTIVE);
                if (_this.isRangeIconClicked) {
                    _this.inputWrapper.container.children[1].focus();
                }
                if (!sf.base.isUndefined(_this.presets[0].start && _this.presets[0].end && _this.presets[0].label)) {
                    _this.unWireListEvents();
                }
                if (!sf.base.isNullOrUndefined(_this.popupObj)) {
                    if (!sf.base.isNullOrUndefined(_this.popupObj.element.parentElement)) {
                        sf.base.detach(_this.popupObj.element);
                    }
                    _this.popupObj.destroy();
                    _this.popupObj = null;
                }
                if (_this.isMobile && !sf.base.Browser.isDevice) {
                    sf.base.EventHandler.remove(document, 'keydown', _this.popupCloseHandler);
                }
            }, targetExitViewport: function () {
                if (!sf.base.Browser.isDevice) {
                    _this.hide();
                }
            }
        });
        if (this.isMobile) {
            this.popupObj.element.classList.add(DEVICE);
            if (!this.isMobile) {
                this.popupObj.element.classList.add('e-bigger');
            }
        }
        if (this.isMobile && this.isCustomWindow) {
            sf.base.addClass([this.modal], [DEVICE, ROOT, 'e-range-modal']);
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
        }
        sf.base.EventHandler.add(document, 'mousedown touchstart', this.documentHandler, this);
    };
    DateRangePicker.prototype.popupCloseHandler = function (e) {
        switch (e.keyCode) {
            case 27:
                this.hide(e);
                break;
        }
    };
    DateRangePicker.prototype.calendarFocus = function () {
        var startDate = this.popupObj && this.popupObj.element.querySelector('.' + STARTDATE);
        if (startDate) {
            var ele = sf.base.closest(startDate, '.' + RIGHTCALENDER);
            ele = sf.base.isNullOrUndefined(ele) ? this.leftCalendar : ele;
            if (this.isRangeIconClicked) {
                this.inputWrapper.container.focus();
            }
            else {
                this.preventBlur = true;
                ele.children[1].firstElementChild.focus();
            }
            sf.base.addClass([startDate], FOCUSDATE);
        }
        else {
            if (this.isRangeIconClicked) {
                this.inputWrapper.container.focus();
            }
            else {
                this.preventBlur = true;
                this.leftCalendar.children[1].firstElementChild.focus();
            }
        }
    };
    DateRangePicker.prototype.presetHeight = function () {
        var presets = this.popupObj && this.popupObj.element.querySelector('.' + PRESETS);
        var rangeContainer = this.popupObj && this.popupObj.element.querySelector('.' + RANGECONTAINER);
        if (!sf.base.isNullOrUndefined(presets) && !sf.base.isNullOrUndefined(rangeContainer)) {
            presets.style.height = rangeContainer.getBoundingClientRect().height + 'px';
        }
    };
    DateRangePicker.prototype.presetKeyActionHandler = function (e) {
        switch (e.action) {
            case 'moveDown':
                this.listMoveDown(e);
                this.setScrollPosition();
                e.preventDefault();
                break;
            case 'moveUp':
                this.listMoveUp(e);
                this.setScrollPosition();
                e.preventDefault();
                break;
            case 'enter':
                var hvrItem = this.getHoverLI();
                var actItem = this.getActiveLI();
                if (!sf.base.isNullOrUndefined(this.leftCalendar) && !sf.base.isNullOrUndefined(actItem)) {
                    if (sf.base.isNullOrUndefined(hvrItem) || (!sf.base.isNullOrUndefined(actItem) && actItem === hvrItem)) {
                        this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(actItem);
                        var values = this.presetsItem[this.activeIndex];
                        if (values.id === 'custom_range') {
                            this.calendarFocus();
                            actItem.classList.remove(HOVER);
                            e.preventDefault();
                            return;
                        }
                    }
                }
                if (!sf.base.isNullOrUndefined(hvrItem) || !sf.base.isNullOrUndefined(actItem)) {
                    this.onMouseClick(e, hvrItem || actItem);
                }
                e.preventDefault();
                break;
            case 'tab':
                if (this.leftCalendar) {
                    var item = this.getHoverLI();
                    if (!sf.base.isNullOrUndefined(item)) {
                        item.classList.remove(HOVER);
                    }
                }
                else {
                    this.hide(e);
                    e.preventDefault();
                }
                break;
        }
    };
    DateRangePicker.prototype.listMoveDown = function (e) {
        var hvrItem = this.getHoverLI();
        var actItem = this.getActiveLI();
        if (!sf.base.isNullOrUndefined(hvrItem)) {
            var li = hvrItem.nextElementSibling;
            if (!sf.base.isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                sf.base.removeClass([hvrItem], HOVER);
                sf.base.addClass([li], HOVER);
            }
        }
        else if (!sf.base.isNullOrUndefined(actItem)) {
            var li = actItem.nextElementSibling;
            if (!sf.base.isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                sf.base.addClass([li], HOVER);
            }
        }
        else {
            sf.base.addClass([this.liCollections[0]], HOVER);
        }
    };
    DateRangePicker.prototype.listMoveUp = function (e) {
        var hvrItem = this.getHoverLI();
        var actItem = this.getActiveLI();
        if (!sf.base.isNullOrUndefined(hvrItem)) {
            var li = hvrItem.previousElementSibling;
            if (!sf.base.isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                sf.base.removeClass([hvrItem], HOVER);
                sf.base.addClass([li], HOVER);
            }
        }
        else if (!sf.base.isNullOrUndefined(actItem)) {
            var li = actItem.previousElementSibling;
            if (!sf.base.isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                sf.base.addClass([li], HOVER);
            }
        }
    };
    DateRangePicker.prototype.getHoverLI = function () {
        var item = this.presetElement.querySelector('.' + HOVER);
        return item;
    };
    DateRangePicker.prototype.getActiveLI = function () {
        var item = this.presetElement.querySelector('.' + ACTIVE);
        return item;
    };
    DateRangePicker.prototype.popupKeyBoardHandler = function () {
        this.popupKeyboardModule = new sf.base.KeyboardEvents(this.popupWrapper, {
            eventName: 'keydown',
            keyAction: this.popupKeyActionHandle.bind(this),
            keyConfigs: { escape: 'escape' }
        });
        this.keyInputConfigs = sf.base.extend(this.keyInputConfigs, this.keyConfigs);
        this.popupKeyboardModule = new sf.base.KeyboardEvents(this.inputWrapper.container.children[1], {
            eventName: 'keydown',
            keyAction: this.popupKeyActionHandle.bind(this),
            keyConfigs: this.keyInputConfigs
        });
    };
    DateRangePicker.prototype.setScrollPosition = function () {
        var listHeight = this.presetElement.getBoundingClientRect().height;
        var hover = this.presetElement.querySelector('.' + HOVER);
        var active = this.presetElement.querySelector('.' + ACTIVE);
        var element = !sf.base.isNullOrUndefined(hover) ? hover : active;
        if (!sf.base.isNullOrUndefined(element)) {
            var nextEle = element.nextElementSibling;
            var height = nextEle ? nextEle.offsetTop : element.offsetTop;
            var liHeight = element.getBoundingClientRect().height;
            if ((height + element.offsetTop) > listHeight) {
                this.presetElement.scrollTop = nextEle ? (height - (listHeight / 2 + liHeight / 2)) : height;
            }
            else {
                this.presetElement.scrollTop = 0;
            }
        }
    };
    DateRangePicker.prototype.popupKeyActionHandle = function (e) {
        var presetElement = sf.base.closest(e.target, '.' + PRESETS);
        switch (e.action) {
            case 'escape':
                if (this.isPopupOpen()) {
                    if (this.isKeyPopup) {
                        this.inputElement.focus();
                        this.isKeyPopup = false;
                    }
                    this.hide(e);
                }
                else {
                    this.inputWrapper.container.children[1].blur();
                }
                break;
            case 'enter':
                if (!this.isPopupOpen()) {
                    this.show(null, e);
                }
                else {
                    this.inputWrapper.container.children[1].focus();
                }
                break;
            case 'tab':
                this.hide(e);
                break;
            case 'altRightArrow':
                if (!sf.base.isNullOrUndefined(presetElement)) {
                    this.cancelButton.element.focus();
                }
                else {
                    if (document.activeElement === this.cancelButton.element && this.applyButton.element.disabled !== true) {
                        this.applyButton.element.focus();
                    }
                    else {
                        this.leftCalendar.children[1].firstElementChild.focus();
                    }
                }
                e.preventDefault();
                break;
            case 'altLeftArrow':
                if (!sf.base.isNullOrUndefined(presetElement)) {
                    this.rightCalendar.children[1].firstElementChild.focus();
                }
                else {
                    if (document.activeElement === this.applyButton.element && this.applyButton.element.disabled !== true) {
                        this.cancelButton.element.focus();
                    }
                    else {
                        if (!sf.base.isNullOrUndefined(this.presetElement) && (document.activeElement === this.cancelButton.element)) {
                            this.presetElement.focus();
                        }
                        else {
                            this.rightCalendar.children[1].firstElementChild.focus();
                        }
                    }
                }
                e.preventDefault();
                break;
        }
    };
    DateRangePicker.prototype.documentHandler = function (e) {
        if (sf.base.isNullOrUndefined(this.popupObj)) {
            return;
        }
        var target = e.target;
        if (!this.inputWrapper.container.contains(target) ||
            (!sf.base.isNullOrUndefined(this.popupObj) && !sf.base.closest(target, this.popupWrapper.id))) {
            if (e.type !== 'touchstart' && ((e.type === 'mousedown') ||
                this.closeEventArgs && !this.closeEventArgs.cancel)) {
                e.preventDefault();
            }
        }
        if ((sf.base.isNullOrUndefined(this.targetElement) ||
            (!sf.base.isNullOrUndefined(this.targetElement) && !(target === this.targetElement))) &&
            !(sf.base.closest(target, '#' + this.popupObj.element.id))
            && !(sf.base.closest(target, '.' + INPUTCONTAINER) === this.inputWrapper.container)
            && !(sf.base.closest(target, '.e-daterangepicker.e-popup') && (!target.classList.contains('e-day')))) {
            this.preventBlur = false;
            if (this.isPopupOpen() && document.body.contains(this.popupObj.element)) {
                this.applyFunction(e);
                if (!this.isMobile) {
                    this.isRangeIconClicked = false;
                }
            }
        }
    };
    DateRangePicker.prototype.createInput = function () {
        var updatedCssClassValue = this.cssClass;
        if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValue = (this.cssClass.replace(/\s+/g, ' ')).trim();
        }
        this.inputWrapper = sf.inputs.Input.createInput({
            floatLabelType: this.floatLabelType,
            element: this.inputElement,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: updatedCssClassValue,
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
            },
            buttons: [DATERANGEICON]
        }, this.createElement);
        sf.base.attributes(this.inputElement, {
            'aria-readonly': this.readonly ? 'true' : 'false', 'tabindex': '0', 'aria-haspopup': 'true',
            'aria-activedescendant': 'null', 'aria-owns': this.element.id + '_popup', 'aria-expanded': 'false',
            'role': 'combobox', 'autocomplete': 'off', 'aria-disabled': !this.enabled ? 'true' : 'false',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        });
        sf.inputs.Input.addAttributes({ 'aria-label': 'select' }, this.inputWrapper.buttons[0]);
        if (!sf.base.isNullOrUndefined(this.placeholder) && this.placeholder.trim() !== '') {
            sf.inputs.Input.addAttributes({ 'aria-placeholder': this.placeholder }, this.inputElement);
        }
        this.setEleWidth(this.width);
        sf.base.addClass([this.inputWrapper.container], DATERANGEWRAPPER);
        if (sf.base.isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            sf.base.attributes(this.inputElement, { 'name': this.element.id });
        }
        if (this.inputElement.type === 'hidden') {
            this.inputWrapper.container.style.display = 'none';
        }
        this.refreshControl();
        this.previousEleValue = this.inputElement.value;
        this.inputElement.setAttribute('value', this.inputElement.value);
        this.startCopy = this.startDate;
        this.endCopy = this.endDate;
    };
    DateRangePicker.prototype.setEleWidth = function (width) {
        if (typeof width === 'string') {
            this.inputWrapper.container.style.width = (this.width);
        }
        else if (typeof width === 'number') {
            this.inputWrapper.container.style.width = sf.base.formatUnit(this.width);
        }
        else {
            this.inputWrapper.container.style.width = '100%';
        }
    };
    DateRangePicker.prototype.adjustLongHeaderWidth = function () {
        if (this.dayHeaderFormat === 'Wide') {
            sf.base.addClass([this.popupWrapper], DAYHEADERLONG);
        }
    };
    DateRangePicker.prototype.refreshControl = function () {
        this.validateMinMax();
        if (this.strictMode) {
            this.validateRangeStrict();
        }
        var isDisabled = this.disabledDates();
        if (this.strictMode && (isDisabled)) {
            this.startValue = this.previousStartValue;
            this.setProperties({ startDate: this.startValue }, true);
            this.endValue = this.previousEndValue;
            this.setProperties({ endDate: this.endValue }, true);
            this.setValue();
        }
        this.updateInput();
        if (!this.strictMode) {
            this.validateRange();
        }
        if (!this.strictMode && (isDisabled)) {
            this.clearRange();
        }
        if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue) && !isDisabled) {
            this.disabledDateRender();
        }
        this.errorClass();
        this.previousStartValue = sf.base.isNullOrUndefined(this.startValue) || isNaN(+this.startValue) ? null : new Date(+this.startValue);
        this.previousEndValue = sf.base.isNullOrUndefined(this.endValue) || isNaN(+this.endValue) ? null : new Date(+this.endValue);
    };
    DateRangePicker.prototype.updateInput = function () {
        if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue)) {
            var formatOption = { format: this.formatString, type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
            var startDate = this.globalize.formatDate(this.startValue, formatOption);
            var endDate = this.globalize.formatDate(this.endValue, formatOption);
            sf.inputs.Input.setValue(startDate + ' ' + this.separator + ' ' + endDate, this.inputElement, this.floatLabelType, this.showClearButton);
            this.previousStartValue = new Date(+this.startValue);
            this.previousEndValue = new Date(+this.endValue);
        }
        if (!this.strictMode && sf.base.isNullOrUndefined(this.value) && this.invalidValueString) {
            sf.inputs.Input.setValue(this.invalidValueString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    };
    DateRangePicker.prototype.checkInvalidRange = function (value) {
        if (!sf.base.isNullOrUndefined(value)) {
            var invalid = false;
            var startinvalue = void 0;
            var endinvalue = void 0;
            var startString = null;
            var endString = null;
            var valueString = null;
            var startObject = false;
            var endObject = false;
            var invalidobject = false;
            if (typeof (value) === 'string') {
                var range = value.split(' ' + this.separator + ' ');
                if (range.length === 2) {
                    startString = range[0];
                    endString = range[1];
                }
                else {
                    invalid = true;
                    valueString = value;
                }
            }
            else {
                if (value.length > 0) {
                    startinvalue = value[0];
                    endinvalue = value[1];
                }
                else {
                    startinvalue = value.start;
                    endinvalue = value.end;
                }
                if (!(startinvalue instanceof Date) && typeof (startinvalue) !== 'object') {
                    startString = this.getstringvalue(startinvalue);
                }
                else if (startinvalue instanceof Date) {
                    startObject = true;
                }
                else if (!sf.base.isNullOrUndefined(startinvalue)) {
                    invalidobject = true;
                }
                if (!(endinvalue instanceof Date) && typeof (endinvalue) !== 'object') {
                    endString = this.getstringvalue(endinvalue);
                }
                else if (endinvalue instanceof Date) {
                    endObject = true;
                }
                else if (!sf.base.isNullOrUndefined(endinvalue)) {
                    invalidobject = true;
                }
            }
            if ((sf.base.isNullOrUndefined(startString) && !startObject && !sf.base.isNullOrUndefined(endString)) ||
                (!sf.base.isNullOrUndefined(startString) && !endObject && sf.base.isNullOrUndefined(endString))) {
                invalid = true;
            }
            if (invalidobject) {
                startString = endString = valueString = null;
                invalid = true;
            }
            if (startString) {
                invalid = invalid || this.checkInvalidValue(startString);
            }
            if (endString) {
                invalid = invalid || this.checkInvalidValue(endString);
            }
            if (invalid) {
                if (startObject && !invalidobject) {
                    startString = startinvalue.toLocaleDateString();
                }
                if (endObject && !invalidobject) {
                    endString = endinvalue.toLocaleDateString();
                }
                if (!sf.base.isNullOrUndefined(startString) && !sf.base.isNullOrUndefined(endString)) {
                    valueString = startString + ' ' + this.separator + ' ' + endString;
                }
                else if (!sf.base.isNullOrUndefined(startString)) {
                    valueString = startString;
                }
                else if (!sf.base.isNullOrUndefined(endString)) {
                    valueString = endString;
                }
                this.invalidValueString = valueString;
                this.setProperties({ value: null }, true);
                this.setProperties({ startValue: null }, true);
                this.setProperties({ endValue: null }, true);
                this.startDate = null;
                this.endDate = null;
            }
        }
    };
    DateRangePicker.prototype.getstringvalue = function (value) {
        var stringValue = null;
        if (!sf.base.isNullOrUndefined(value) && (typeof value === 'number')) {
            stringValue = (value).toString();
        }
        else if (!sf.base.isNullOrUndefined(value) && (typeof value === 'string')) {
            stringValue = '' + value;
        }
        return stringValue;
    };
    DateRangePicker.prototype.checkInvalidValue = function (value) {
        var valueString = value;
        var invalid = false;
        var formatOpt = null;
        formatOpt = { format: this.formatString, type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
        if (typeof valueString !== 'string') {
            invalid = true;
        }
        else {
            var globalize = new sf.base.Internationalization(this.locale);
            if (!this.checkDateValue(globalize.parseDate(valueString, formatOpt))) {
                var extISOStr = null;
                var basISOString = null;
                // tslint:disable-next-line
                extISOStr = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                // tslint:disable-next-line
                basISOString = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                if ((!extISOStr.test(valueString) && !basISOString.test(valueString))
                    || (/^[a-zA-Z0-9- ]*$/).test(valueString) || isNaN(+new Date(this.checkValue(valueString)))) {
                    invalid = true;
                }
            }
        }
        return invalid;
    };
    DateRangePicker.prototype.isDateDisabled = function (date) {
        if (sf.base.isNullOrUndefined(date)) {
            return false;
        }
        var value = new Date(+date);
        if (+value < +this.min || +value > +this.max) {
            return true;
        }
        this.virtualRenderCellArgs = {
            date: value,
            isDisabled: false,
        };
        var args = this.virtualRenderCellArgs;
        this.virtualRenderCellEvent(args);
        if (args.isDisabled) {
            return true;
        }
        return false;
    };
    DateRangePicker.prototype.disabledDateRender = function () {
        this.disabledDays = [];
        this.disabledDayCnt = null;
        var localDate = new Date(+this.startValue);
        var count = 0;
        while (+localDate <= +this.endValue) {
            this.virtualRenderCellArgs = {
                date: localDate,
                isDisabled: false,
            };
            var args = this.virtualRenderCellArgs;
            this.virtualRenderCellEvent(args);
            if (args.isDisabled) {
                this.disabledDays.push(new Date(+args.date));
                if (+localDate > +this.startValue && +localDate < +this.endValue) {
                    count++;
                }
            }
            this.addDay(localDate, 1, null, this.max, this.min);
        }
        this.disabledDayCnt = count;
    };
    DateRangePicker.prototype.virtualRenderCellEvent = function (args) {
        sf.base.extend(this.virtualRenderCellArgs, { name: 'renderDayCell' });
        this.trigger('renderDayCell', args);
    };
    DateRangePicker.prototype.disabledDates = function () {
        var isStartDisabled = false;
        var isEndDisabled = false;
        if (!sf.base.isNullOrUndefined(this.endValue) && !sf.base.isNullOrUndefined(this.startValue)) {
            isStartDisabled = this.isDateDisabled(this.startValue);
            isEndDisabled = this.isDateDisabled(this.endValue);
            if (!this.isPopupOpen()) {
                this.currentDate = null;
            }
            this.setValue();
        }
        return (isStartDisabled || isEndDisabled);
    };
    DateRangePicker.prototype.setModelValue = function () {
        if (!this.value && this.startDate === null && this.endDate === null) {
            this.setProperties({ value: null }, true);
        }
        else if (this.value === null || this.value.start === null) {
            if (this.value === null) {
                this.setProperties({ value: [this.startDate, this.endDate] }, true);
            }
            else if (this.value.start === null) {
                this.setProperties({ value: { start: this.startDate, end: this.endDate } }, true);
            }
        }
        else {
            if ((this.value && this.value.length > 0) ||
                this.valueType && this.valueType.length > 0) {
                if (+this.startDate !== +this.value[0] || +this.endDate !== +this.value[1]) {
                    this.setProperties({ value: [this.startDate, this.endDate] }, true);
                }
                if (this.value && this.value[0] == null && this.value[1] == null) {
                    this.setProperties({ value: null }, true);
                }
            }
            else {
                if ((this.value && this.value.start)) {
                    this.setProperties({ value: { start: this.startDate, end: this.endDate } }, true);
                }
            }
        }
        this.createHiddenInput();
    };
    /**
     * To dispatch the event manually
     */
    DateRangePicker.prototype.dispatchEvent = function (element, type) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        element.dispatchEvent(evt);
        this.firstHiddenChild.dispatchEvent(evt);
    };
    DateRangePicker.prototype.changeTrigger = function (e) {
        if (+this.initStartDate !== +this.startValue || +this.initEndDate !== +this.endValue) {
            this.setProperties({ endDate: this.checkDateValue(this.endValue) }, true);
            this.setProperties({ startDate: this.checkDateValue(this.startValue) }, true);
            this.setModelValue();
            this.trigger('change', this.rangeArgs(e));
        }
        this.previousEleValue = this.inputElement.value;
        this.initStartDate = this.checkDateValue(this.startValue);
        this.initEndDate = this.checkDateValue(this.endValue);
    };
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     * @hidden
     */
    DateRangePicker.prototype.navigateTo = function (view, date) {
        if (this.isPopupOpen()) {
            if (view.toLowerCase() === 'month') {
                view = 'Month';
            }
            else if (view.toLowerCase() === 'year') {
                view = 'Year';
            }
            else if (view.toLowerCase() === 'decade') {
                view = 'Decade';
            }
            else {
                return;
            }
            if (this.getViewNumber(view) < this.getViewNumber(this.depth)) {
                view = this.depth;
            }
            if (this.isMobile) {
                _super.prototype.navigateTo.call(this, view, date);
            }
            else {
                if (date < this.min) {
                    date = new Date(+this.min);
                }
                else if (date >= this.max) {
                    date = new Date(+this.max);
                }
                if (view === 'Month' && this.isSameMonth(date, this.max)) {
                    date = new Date(this.max.getFullYear(), this.max.getMonth() - 1, this.min.getDate());
                }
                else if (view === 'Year' && this.isSameYear(date, this.max)) {
                    date = new Date((this.max.getFullYear() - 1), this.max.getMonth(), this.max.getDate());
                }
                else if (view === 'Decade' && this.isSameDecade(date, this.max)) {
                    date = new Date((this.max.getFullYear() - 10), this.max.getMonth(), this.max.getDate());
                }
                this.leftCalCurrentDate = date;
                this.navigate(this.leftCalendar, this.leftCalCurrentDate, view);
                if (view === 'Month') {
                    date = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
                }
                else if (view === 'Year') {
                    date = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() + 1));
                }
                else {
                    date = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() + 10));
                }
                this.rightCalCurrentDate = date;
                this.navigate(this.rightCalendar, this.rightCalCurrentDate, view);
                this.leftKeyboardModule = this.rightKeyboardModule = null;
                this.updateNavIcons();
            }
            if (this.currentView() === this.depth) {
                this.bindCalendarCellEvents();
            }
            this.removeFocusedDate();
            this.updateRange((this.isMobile ? [this.calendarElement] : [this.leftCalendar, this.rightCalendar]));
        }
    };
    DateRangePicker.prototype.navigate = function (calendar, date, view) {
        this.calendarElement = calendar;
        this.table = calendar.querySelector('table');
        this.tableBodyElement = calendar.querySelector('tbody');
        this.headerTitleElement = calendar.querySelector('.e-title');
        this.tableHeadElement = calendar.querySelector('thead');
        this.contentElement = calendar.querySelector('.e-content');
        this.previousIcon = calendar.querySelector('.e-prev');
        this.nextIcon = calendar.querySelector('.e-next');
        this.effect = ZOOMIN;
        _super.prototype.navigateTo.call(this, view, date);
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    DateRangePicker.prototype.focusIn = function () {
        if (document.activeElement !== this.inputElement && this.enabled) {
            sf.base.addClass([this.inputWrapper.container], [INPUTFOCUS]);
            this.inputElement.focus();
            
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    DateRangePicker.prototype.focusOut = function () {
        var isBlur = this.preventBlur;
        if (document.activeElement === this.inputElement) {
            sf.base.removeClass([this.inputWrapper.container], [INPUTFOCUS]);
            this.preventBlur = false;
            this.inputElement.blur();
            this.preventBlur = isBlur;
        }
    };
    /**
     * To destroy the widget.
     * @returns void
     */
    DateRangePicker.prototype.destroy = function () {
        this.hide(null);
        var ariaAttrs = {
            'aria-readonly': this.readonly ? 'true' : 'false', 'tabindex': '0', 'aria-haspopup': 'true',
            'aria-activedescendant': 'null', 'aria-owns': this.element.id + '_popup', 'aria-expanded': 'false',
            'role': 'combobox', 'autocomplete': 'off', 'aria-disabled': !this.enabled ? 'true' : 'false',
            'autocorrect': 'off', 'autocapitalize': 'off', 'aria-invalid': 'false', 'spellcheck': 'false'
        };
        if (this.inputElement) {
            sf.base.removeClass([this.inputElement], [ROOT]);
            sf.base.EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            sf.inputs.Input.removeAttributes(ariaAttrs, this.inputElement);
            (!sf.base.isNullOrUndefined(this.cloneElement.getAttribute('tabindex'))) ?
                this.inputElement.setAttribute('tabindex', this.tabIndex) : this.inputElement.removeAttribute('tabindex');
            this.ensureInputAttribute();
            this.inputElement.classList.remove('e-input');
            if (!sf.base.isNullOrUndefined(this.inputWrapper)) {
                sf.base.EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler);
                if (this.angularTag === null) {
                    this.inputWrapper.container.parentElement.appendChild(this.inputElement);
                }
                sf.base.detach(this.inputWrapper.container);
            }
        }
        if (!sf.base.isNullOrUndefined(this.inputKeyboardModule) && !this.isMobile) {
            this.inputKeyboardModule.destroy();
        }
        if (this.popupObj) {
            if (!this.isMobile) {
                this.clearCalendarEvents();
            }
        }
        _super.prototype.destroy.call(this);
        this.inputWrapper = this.popupWrapper = this.popupObj = this.cloneElement = this.presetElement = null;
        if (this.formElement) {
            sf.base.EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
        if ((!sf.base.isNullOrUndefined(this.firstHiddenChild))
            && (!sf.base.isNullOrUndefined(this.secondHiddenChild))) {
            sf.base.detach(this.firstHiddenChild);
            sf.base.detach(this.secondHiddenChild);
            this.firstHiddenChild = this.secondHiddenChild = null;
            this.inputElement.setAttribute('name', this.element.getAttribute('data-name'));
            this.inputElement.removeAttribute('data-name');
        }
    };
    DateRangePicker.prototype.ensureInputAttribute = function () {
        var attr = [];
        for (var i = 0; i < this.inputElement.attributes.length; i++) {
            attr[i] = this.inputElement.attributes[i].name;
        }
        for (var i = 0; i < attr.length; i++) {
            if (sf.base.isNullOrUndefined(this.cloneElement.getAttribute(attr[i]))) {
                if (attr[i].toLowerCase() === 'value') {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(attr[i]);
            }
            else {
                if (attr[i].toLowerCase() === 'value') {
                    this.inputElement.value = this.cloneElement.getAttribute(attr[i]);
                }
                this.inputElement.setAttribute(attr[i], this.cloneElement.getAttribute(attr[i]));
            }
        }
    };
    /**
     * To get component name
     * @returns string
     * @private
     */
    DateRangePicker.prototype.getModuleName = function () {
        return 'daterangepicker';
    };
    /**
     * Return the properties that are maintained upon browser refresh.
     * @returns string
     */
    DateRangePicker.prototype.getPersistData = function () {
        var keyEntity = ['startDate', 'endDate', 'value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Return the selected range and day span in the DateRangePicker.
     * @returns Object
     */
    DateRangePicker.prototype.getSelectedRange = function () {
        var range;
        if (!sf.base.isNullOrUndefined(this.startValue) && !sf.base.isNullOrUndefined(this.endValue)) {
            range = (Math.floor(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            this.disabledDateRender();
            if (!sf.base.isNullOrUndefined(this.disabledDayCnt)) {
                range = range - this.disabledDayCnt;
                this.disabledDayCnt = null;
            }
        }
        else {
            range = 0;
        }
        return { startDate: this.startValue, endDate: this.endValue, daySpan: range };
    };
    /**
     * To open the Popup container in the DateRangePicker component.
     * @returns void
     */
    DateRangePicker.prototype.show = function (element, event) {
        var _this = this;
        if (this.isMobile && this.popupObj) {
            this.popupObj.refreshPosition();
        }
        if ((this.enabled && this.readonly) || !this.enabled || this.popupObj) {
            return;
        }
        else {
            if (!this.isPopupOpen()) {
                if (element) {
                    this.targetElement = element;
                }
                this.createPopup();
                if (this.isMobile || sf.base.Browser.isDevice) {
                    this.mobileRangePopupWrap = this.createElement('div', { className: 'e-daterangepick-mob-popup-wrap' });
                    document.body.appendChild(this.mobileRangePopupWrap);
                }
                this.openEventArgs = {
                    popup: (sf.base.isBlazor() && this.isServerRendered) ? null : this.popupObj || null,
                    cancel: false,
                    date: this.inputElement.value,
                    model: (sf.base.isBlazor() && this.isServerRendered) ? null : this,
                    event: event ? event : null,
                    appendTo: this.isMobile || sf.base.Browser.isDevice ? this.mobileRangePopupWrap : document.body
                };
                var eventArgs = this.openEventArgs;
                this.trigger('open', eventArgs, function (eventArgs) {
                    _this.openEventArgs = eventArgs;
                    if (!_this.openEventArgs.cancel) {
                        _this.openEventArgs.appendTo.appendChild(_this.popupWrapper);
                        _this.showPopup(element, event);
                        var isPreset = (!_this.isCustomRange || (_this.isMobile && _this.isCustomRange));
                        if (!sf.base.isUndefined(_this.presets[0].start && _this.presets[0].end && _this.presets[0].label) && isPreset) {
                            _this.setScrollPosition();
                        }
                        _this.checkMinMaxDays();
                        if ((_this.isMobile) && (!sf.base.isNullOrUndefined(_this.startDate)) && (sf.base.isNullOrUndefined(_this.endDate))) {
                            _this.endButton.element.classList.add(ACTIVE);
                            _this.startButton.element.classList.remove(ACTIVE);
                            _this.endButton.element.removeAttribute('disabled');
                            _this.selectableDates();
                        }
                        _super.prototype.setOverlayIndex.call(_this, _this.mobileRangePopupWrap, _this.popupObj.element, _this.modal, _this.isMobile || sf.base.Browser.isDevice);
                    }
                });
            }
        }
    };
    /**
     * To close the Popup container in the DateRangePicker component.
     * @returns void
     */
    DateRangePicker.prototype.hide = function (event) {
        var _this = this;
        if (this.popupObj) {
            if (sf.base.isNullOrUndefined(this.previousEndValue) && sf.base.isNullOrUndefined(this.previousStartValue)) {
                this.clearRange();
            }
            else {
                if (!sf.base.isNullOrUndefined(this.previousStartValue)) {
                    this.startValue = new Date(this.checkValue(this.previousStartValue));
                    this.setValue();
                    this.currentDate = new Date(this.checkValue(this.startValue));
                }
                else {
                    this.startValue = null;
                    this.setValue();
                }
                if (!sf.base.isNullOrUndefined(this.previousEndValue)) {
                    this.endValue = new Date(this.checkValue(this.previousEndValue));
                    this.setValue();
                }
                else {
                    this.endValue = null;
                    this.setValue();
                }
            }
            if (this.isPopupOpen()) {
                this.closeEventArgs = {
                    cancel: false,
                    popup: (sf.base.isBlazor() && this.isServerRendered) ? null : this.popupObj,
                    date: this.inputElement.value,
                    model: (sf.base.isBlazor() && this.isServerRendered) ? null : this,
                    event: event ? event : null
                };
                var eventArgs = this.closeEventArgs;
                this.trigger('close', eventArgs, function (eventArgs) {
                    _this.closeEventArgs = eventArgs;
                    if (!_this.closeEventArgs.cancel) {
                        if (_this.isMobile) {
                            if (!sf.base.isNullOrUndefined(_this.startButton) && !sf.base.isNullOrUndefined(_this.endButton)) {
                                sf.base.EventHandler.remove(_this.startButton.element, 'click touchstart', _this.deviceHeaderClick);
                                sf.base.EventHandler.remove(_this.endButton.element, 'click touchstart', _this.deviceHeaderClick);
                            }
                        }
                        if (_this.popupObj) {
                            _this.popupObj.hide();
                            if (_this.preventBlur) {
                                _this.inputElement.focus();
                                sf.base.addClass([_this.inputWrapper.container], [INPUTFOCUS]);
                            }
                        }
                        if (!_this.isMobile) {
                            if (!sf.base.isNullOrUndefined(_this.leftKeyboardModule) && !sf.base.isNullOrUndefined(_this.rightKeyboardModule)) {
                                _this.leftKeyboardModule.destroy();
                                _this.rightKeyboardModule.destroy();
                            }
                            if (!sf.base.isNullOrUndefined(_this.presetElement)) {
                                _this.presetKeyboardModule.destroy();
                            }
                            if (!sf.base.isNullOrUndefined(_this.cancelButton)) {
                                _this.btnKeyboardModule.destroy();
                            }
                        }
                        _this.targetElement = null;
                        sf.base.removeClass([document.body], OVERFLOW);
                        sf.base.EventHandler.remove(document, 'mousedown touchstart', _this.documentHandler);
                        if (_this.isMobile && _this.modal) {
                            _this.modal.style.display = 'none';
                            _this.modal.outerHTML = '';
                            _this.modal = null;
                        }
                        if (_this.isMobile || sf.base.Browser.isDevice) {
                            if (!sf.base.isNullOrUndefined(_this.mobileRangePopupWrap)) {
                                _this.mobileRangePopupWrap.remove();
                                _this.mobileRangePopupWrap = null;
                            }
                        }
                        _this.isKeyPopup = _this.dateDisabled = false;
                    }
                    else {
                        sf.base.removeClass([_this.inputWrapper.buttons[0]], ACTIVE);
                    }
                    _this.updateClearIconState();
                    _this.updateHiddenInput();
                    if (_this.isMobile && _this.allowEdit && !_this.readonly) {
                        _this.inputElement.removeAttribute('readonly');
                    }
                });
            }
        }
        else {
            this.updateClearIconState();
            this.updateHiddenInput();
            if (this.isMobile && this.allowEdit && !this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        }
    };
    DateRangePicker.prototype.setLocale = function () {
        this.globalize = new sf.base.Internationalization(this.locale);
        this.l10n.setLocale(this.locale);
        this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
        sf.inputs.Input.setPlaceholder(this.placeholder, this.inputElement);
        this.updateInput();
        this.updateHiddenInput();
        this.changeTrigger();
    };
    DateRangePicker.prototype.refreshChange = function () {
        this.checkView();
        this.refreshControl();
        this.changeTrigger();
    };
    DateRangePicker.prototype.setDate = function () {
        sf.inputs.Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        this.refreshChange();
    };
    DateRangePicker.prototype.enableInput = function () {
        if (+this.min <= +this.max) {
            this.setProperties({ enabled: true }, true);
            sf.inputs.Input.setEnabled(this.enabled, this.inputElement);
            if (this.element.hasAttribute('disabled')) {
                this.bindEvents();
            }
        }
    };
    DateRangePicker.prototype.clearModelvalue = function (newProp, oldProp) {
        this.setProperties({ startDate: null }, true);
        this.setProperties({ endDate: null }, true);
        if (oldProp.value && oldProp.value.length > 0) {
            this.setProperties({ value: null }, true);
        }
        else if (oldProp.value && oldProp.value.start) {
            this.setProperties({ value: { start: null, end: null } }, true);
        }
        else if (oldProp.value && !oldProp.value.start) {
            this.setProperties({ value: { start: null, end: null } }, true);
        }
        this.updateValue();
        this.setDate();
    };
    DateRangePicker.prototype.createHiddenInput = function () {
        if (sf.base.isNullOrUndefined(this.firstHiddenChild) && sf.base.isNullOrUndefined(this.secondHiddenChild)) {
            this.firstHiddenChild = this.createElement('input');
            this.secondHiddenChild = this.createElement('input');
        }
        if (!sf.base.isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            this.inputElement.setAttribute('data-name', this.inputElement.getAttribute('name'));
            this.inputElement.removeAttribute('name');
        }
        sf.base.attributes(this.firstHiddenChild, {
            'type': 'text', 'name': this.inputElement.getAttribute('data-name'), 'class': HIDDENELEMENT
        });
        sf.base.attributes(this.secondHiddenChild, {
            'type': 'text', 'name': this.inputElement.getAttribute('data-name'), 'class': HIDDENELEMENT
        });
        var format = { type: 'datetime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
        this.firstHiddenChild.value = this.startDate && this.globalize.formatDate(this.startDate, format);
        this.secondHiddenChild.value = this.endDate && this.globalize.formatDate(this.endDate, format);
        this.inputElement.parentElement.appendChild(this.firstHiddenChild);
        this.inputElement.parentElement.appendChild(this.secondHiddenChild);
    };
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    DateRangePicker.prototype.onPropertyChanged = function (newProp, oldProp) {
        var format = { format: this.formatString, type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            this.hide(null);
            switch (prop) {
                case 'width':
                    this.setEleWidth(this.width);
                    break;
                case 'separator':
                    this.previousEleValue = this.inputElement.value;
                    this.setProperties({ separator: newProp.separator }, true);
                    this.updateInput();
                    this.changeTrigger();
                    break;
                case 'placeholder':
                    sf.inputs.Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.setProperties({ placeholder: newProp.placeholder }, true);
                    break;
                case 'readonly':
                    sf.inputs.Input.setReadonly(this.readonly, this.inputElement);
                    this.inputElement.setAttribute('aria-readonly', '' + this.readonly);
                    this.setRangeAllowEdit();
                    break;
                case 'cssClass':
                    this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
                case 'enabled':
                    this.setProperties({ enabled: newProp.enabled }, true);
                    sf.inputs.Input.setEnabled(this.enabled, this.inputElement);
                    this.bindEvents();
                    break;
                case 'allowEdit':
                    this.setRangeAllowEdit();
                    break;
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    sf.inputs.Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.checkFormat();
                    this.updateInput();
                    this.changeTrigger();
                    break;
                case 'locale':
                    this.globalize = new sf.base.Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    sf.inputs.Input.setPlaceholder(this.placeholder, this.inputElement);
                    this.setLocale();
                    break;
                case 'htmlAttributes':
                    this.updateHtmlAttributeToElement();
                    this.updateHtmlAttributeToWrapper();
                    this.setDataAttribute(true);
                    this.checkHtmlAttributes(true);
                    break;
                case 'showClearButton':
                    sf.inputs.Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'startDate':
                    if (typeof newProp.startDate === 'string') {
                        newProp.startDate = this.globalize.parseDate(newProp.startDate, format);
                    }
                    if (+this.initStartDate !== +newProp.startDate) {
                        this.startValue = this.checkDateValue(new Date(this.checkValue(newProp.startDate)));
                        this.setDate();
                        this.setValue();
                    }
                    break;
                case 'endDate':
                    if (typeof newProp.endDate === 'string') {
                        newProp.endDate = this.globalize.parseDate(newProp.endDate, format);
                    }
                    if (+this.initEndDate !== +newProp.endDate) {
                        this.endValue = this.checkDateValue(new Date(this.checkValue(newProp.endDate)));
                        this.setDate();
                        this.setValue();
                    }
                    break;
                case 'value':
                    this.invalidValueString = null;
                    this.checkInvalidRange(newProp.value);
                    if (typeof (newProp.value) === 'string') {
                        if (!this.invalidValueString) {
                            var rangeArray = newProp.value.split(' ' + this.separator + ' ');
                            this.value = [new Date(rangeArray[0]), new Date(rangeArray[1])];
                            this.updateValue();
                            this.setDate();
                        }
                        else {
                            this.clearModelvalue(newProp, oldProp);
                        }
                    }
                    else {
                        if ((!sf.base.isNullOrUndefined(newProp.value) && newProp.value.length > 0)
                            || !sf.base.isNullOrUndefined(newProp.value) && newProp.value.start) {
                            this.valueType = newProp.value;
                            if (newProp.value[0] === null || (newProp.value.start === null)) {
                                if (newProp.value.length === 1 || (newProp.value.start)) {
                                    this.clearModelvalue(newProp, oldProp);
                                }
                                else if (newProp.value[1] === null ||
                                    (newProp.value.start === null)) {
                                    this.clearModelvalue(newProp, oldProp);
                                }
                            }
                            else if ((+this.initStartDate !== +newProp.value[0]
                                || +this.initEndDate !== +newProp.value[1]) ||
                                (+this.initStartDate !== +(newProp.value.start
                                    || +this.initEndDate !== +newProp.value.start))) {
                                if (newProp.value.length === 1) {
                                    this.modelValue = newProp.value;
                                }
                                else if (newProp.value.start) {
                                    this.modelValue = newProp.value;
                                }
                                this.updateValue();
                                this.setDate();
                            }
                        }
                        else {
                            if (sf.base.isNullOrUndefined(this.value)
                                || newProp.value.start == null) {
                                this.valueType = newProp.value;
                                this.startValue = null;
                                this.endValue = null;
                                this.clearModelvalue(newProp, oldProp);
                            }
                        }
                    }
                    break;
                case 'minDays':
                    this.setProperties({ minDays: newProp.minDays }, true);
                    this.refreshChange();
                    break;
                case 'maxDays':
                    this.setProperties({ maxDays: newProp.maxDays }, true);
                    this.refreshChange();
                    break;
                case 'min':
                    this.setProperties({ min: this.checkDateValue(new Date(this.checkValue(newProp.min))) }, true);
                    this.previousEleValue = this.inputElement.value;
                    this.enableInput();
                    this.refreshChange();
                    break;
                case 'max':
                    this.setProperties({ max: this.checkDateValue(new Date(this.checkValue(newProp.max))) }, true);
                    this.enableInput();
                    this.refreshChange();
                    break;
                case 'strictMode':
                    this.invalidValueString = null;
                    this.setProperties({ strictMode: newProp.strictMode }, true);
                    this.refreshChange();
                    break;
                case 'presets':
                    this.setProperties({ presets: newProp.presets }, true);
                    this.processPresets();
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    sf.inputs.Input.removeFloating(this.inputWrapper);
                    sf.inputs.Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                case 'start':
                    this.setProperties({ start: newProp.start }, true);
                    this.refreshChange();
                    break;
                case 'depth':
                    this.setProperties({ depth: newProp.depth }, true);
                    this.refreshChange();
                    break;
            }
        }
    };
    __decorate([
        sf.base.Property(null)
    ], DateRangePicker.prototype, "value", void 0);
    __decorate([
        sf.base.Property(false)
    ], DateRangePicker.prototype, "enablePersistence", void 0);
    __decorate([
        sf.base.Property(new Date(1900, 0, 1))
    ], DateRangePicker.prototype, "min", void 0);
    __decorate([
        sf.base.Property(new Date(2099, 11, 31))
    ], DateRangePicker.prototype, "max", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateRangePicker.prototype, "locale", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateRangePicker.prototype, "firstDayOfWeek", void 0);
    __decorate([
        sf.base.Property(false)
    ], DateRangePicker.prototype, "weekNumber", void 0);
    __decorate([
        sf.base.Property('Gregorian')
    ], DateRangePicker.prototype, "calendarMode", void 0);
    __decorate([
        sf.base.Property(false)
    ], DateRangePicker.prototype, "openOnFocus", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "destroyed", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "cleared", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "navigated", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "renderDayCell", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateRangePicker.prototype, "startDate", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateRangePicker.prototype, "endDate", void 0);
    __decorate([
        sf.base.Collection([{}], Presets)
    ], DateRangePicker.prototype, "presets", void 0);
    __decorate([
        sf.base.Property('')
    ], DateRangePicker.prototype, "width", void 0);
    __decorate([
        sf.base.Property(1000)
    ], DateRangePicker.prototype, "zIndex", void 0);
    __decorate([
        sf.base.Property(true)
    ], DateRangePicker.prototype, "showClearButton", void 0);
    __decorate([
        sf.base.Property(true)
    ], DateRangePicker.prototype, "showTodayButton", void 0);
    __decorate([
        sf.base.Property('Month')
    ], DateRangePicker.prototype, "start", void 0);
    __decorate([
        sf.base.Property('Month')
    ], DateRangePicker.prototype, "depth", void 0);
    __decorate([
        sf.base.Property('')
    ], DateRangePicker.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property('-')
    ], DateRangePicker.prototype, "separator", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateRangePicker.prototype, "minDays", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateRangePicker.prototype, "maxDays", void 0);
    __decorate([
        sf.base.Property(false)
    ], DateRangePicker.prototype, "strictMode", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateRangePicker.prototype, "keyConfigs", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateRangePicker.prototype, "format", void 0);
    __decorate([
        sf.base.Property(true)
    ], DateRangePicker.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property(false)
    ], DateRangePicker.prototype, "readonly", void 0);
    __decorate([
        sf.base.Property(true)
    ], DateRangePicker.prototype, "allowEdit", void 0);
    __decorate([
        sf.base.Property('Never')
    ], DateRangePicker.prototype, "floatLabelType", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateRangePicker.prototype, "placeholder", void 0);
    __decorate([
        sf.base.Property({})
    ], DateRangePicker.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "open", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "close", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "select", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "focus", void 0);
    __decorate([
        sf.base.Event()
    ], DateRangePicker.prototype, "blur", void 0);
    DateRangePicker = __decorate([
        sf.base.NotifyPropertyChanges
    ], DateRangePicker);
    return DateRangePicker;
}(sf.calendars.CalendarBase));

/**
 * DateRangePicker modules
 */

exports.Presets = Presets;
exports.DateRangePicker = DateRangePicker;

return exports;

});

    sf.calendars = sf.base.extend({}, sf.calendars, sfdaterangepicker({}));