window.sf = window.sf || {};
var sftimepicker = (function (exports) {
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
var WRAPPERCLASS = 'e-time-wrapper';
var POPUP = 'e-popup';
var ERROR = 'e-error';
var POPUPDIMENSION = '240px';
var DAY = new Date().getDate();
var MONTH = new Date().getMonth();
var YEAR = new Date().getFullYear();
var ROOT = 'e-timepicker';
var LIBRARY = 'e-lib';
var CONTROL = 'e-control';
var CONTENT = 'e-content';
var SELECTED = 'e-active';
var HOVER = 'e-hover';
var NAVIGATION = 'e-navigation';
var DISABLED = 'e-disabled';
var ICONANIMATION = 'e-icon-anim';
var TIMEICON = 'e-time-icon';
var CLEARICON = 'e-clear-icon';
var FOCUS = 'e-input-focus';
var LISTCLASS = 'e-list-item';
var HALFPOSITION = 2;
var ANIMATIONDURATION = 50;
var OVERFLOW = 'e-time-overflow';
var OFFSETVAL = 4;
var EDITABLE = 'e-non-edit';
var wrapperAttributes = ['title', 'class', 'style'];

(function (TimePickerBase) {
    // tslint:disable-next-line
    function createListItems(createdEl, min, max, globalize, timeFormat, step) {
        if (this.calendarMode === 'Gregorian') {
            
        }
        else {
            
        }
        var start;
        var end;
        var interval = step * 60000;
        var listItems = [];
        var timeCollections = [];
        start = +(min.setMilliseconds(0));
        end = +(max.setMilliseconds(0));
        while (end >= start) {
            timeCollections.push(start);
            listItems.push(globalize.formatDate(new Date(start), { format: timeFormat, type: 'time' }));
            start += interval;
        }
        var listTag = sf.lists.ListBase.createList(createdEl, listItems, null, true);
        return { collection: timeCollections, list: listTag };
    }
    TimePickerBase.createListItems = createListItems;
})(exports.TimePickerBase || (exports.TimePickerBase = {}));
/**
 * TimePicker is an intuitive interface component which provides an options to select a time value
 * from popup list or to set a desired time value.
 * ```
 * <input id='timepicker' type='text'/>
 * <script>
 *   var timePickerObj = new TimePicker({ value: new Date() });
 *   timePickerObj.appendTo('#timepicker');
 * </script>
 * ```
 */
var TimePicker = /** @class */ (function (_super) {
    __extends(TimePicker, _super);
    /**
     * Constructor for creating the widget
     */
    function TimePicker(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.liCollections = [];
        _this.timeCollections = [];
        _this.blazorTimeCollections = [];
        _this.disableItemCollection = [];
        _this.invalidValueString = null;
        _this.isBlazorServer = false;
        _this.isAngular = false;
        _this.preventChange = false;
        _this.timeOptions = options;
        return _this;
    }
    /**
     * Initialize the event handler
     * @private
     */
    TimePicker.prototype.preRender = function () {
        this.keyConfigure = {
            enter: 'enter',
            escape: 'escape',
            end: 'end',
            tab: 'tab',
            home: 'home',
            down: 'downarrow',
            up: 'uparrow',
            left: 'leftarrow',
            right: 'rightarrow',
            open: 'alt+downarrow',
            close: 'alt+uparrow'
        };
        this.cloneElement = this.element.cloneNode(true);
        sf.base.removeClass([this.cloneElement], [ROOT, CONTROL, LIBRARY]);
        this.inputElement = this.element;
        this.angularTag = null;
        this.formElement = sf.base.closest(this.element, 'form');
        this.isBlazorServer = (sf.base.isBlazor() && this.isServerRendered && this.getModuleName() === 'timepicker') ? true : false;
        if (!this.isBlazorServer) {
            if (this.element.tagName === 'EJS-TIMEPICKER') {
                this.angularTag = this.element.tagName;
                this.inputElement = this.createElement('input');
                this.element.appendChild(this.inputElement);
            }
            this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
            this.element.removeAttribute('tabindex');
            this.openPopupEventArgs = {
                appendTo: document.body
            };
        }
    };
    // element creation
    TimePicker.prototype.render = function () {
        if (!this.isBlazorServer) {
            this.initialize();
            this.createInputElement();
            this.updateHtmlAttributeToWrapper();
            this.setTimeAllowEdit();
            this.setEnable();
            this.validateInterval();
        }
        else {
            this.globalize = new sf.base.Internationalization(this.locale);
            this.defaultCulture = new sf.base.Internationalization('en');
            this.checkTimeFormat();
            var parentElement = this.element.parentElement;
            this.inputWrapper = {
                container: parentElement,
                clearButton: parentElement.querySelector('.' + CLEARICON),
                buttons: [parentElement.querySelector('.' + TIMEICON)]
            };
            sf.inputs.Input.bindInitialEvent({
                element: this.inputElement,
                floatLabelType: this.floatLabelType
            });
            if (this.showClearButton && this.inputWrapper.clearButton) {
                sf.inputs.Input.wireClearBtnEvents(this.inputElement, this.inputWrapper.clearButton, this.inputWrapper.container);
            }
        }
        this.bindEvents();
        if (!this.isBlazorServer) {
            this.validateDisable();
            this.setValue(this.getFormattedValue(this.value));
        }
        this.anchor = this.inputElement;
        this.inputElement.setAttribute('value', this.inputElement.value);
        if (!this.isBlazorServer) {
            this.inputEleValue = this.getDateObject(this.inputElement.value);
        }
        this.renderComplete();
    };
    TimePicker.prototype.setTimeAllowEdit = function () {
        if (this.allowEdit) {
            if (!this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        }
        else {
            sf.base.attributes(this.inputElement, { 'readonly': '' });
        }
        this.clearIconState();
    };
    TimePicker.prototype.clearIconState = function () {
        if (!this.allowEdit && this.inputWrapper && !this.readonly) {
            if (this.inputElement.value === '') {
                sf.base.removeClass([this.inputWrapper.container], [EDITABLE]);
            }
            else {
                sf.base.addClass([this.inputWrapper.container], [EDITABLE]);
            }
        }
        else if (this.inputWrapper) {
            sf.base.removeClass([this.inputWrapper.container], [EDITABLE]);
        }
    };
    TimePicker.prototype.validateDisable = function () {
        this.setMinMax(this.initMin, this.initMax);
        this.popupCreation();
        this.popupObj.destroy();
        this.popupWrapper = this.popupObj = null;
        if ((!isNaN(+this.value) && this.value !== null)) {
            if (!this.valueIsDisable(this.value)) {
                //disable value given in value property so reset the date based on current date
                if (this.strictMode) {
                    this.resetState();
                }
                this.initValue = null;
                this.initMax = this.getDateObject(this.initMax);
                this.initMin = this.getDateObject(this.initMin);
                this.timeCollections = this.liCollections = [];
                this.setMinMax(this.initMin, this.initMax);
            }
        }
    };
    TimePicker.prototype.validationAttribute = function (target, input) {
        var name = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        input.setAttribute('name', name);
        target.removeAttribute('name');
        var attributes$$1 = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attributes$$1.length; i++) {
            if (sf.base.isNullOrUndefined(target.getAttribute(attributes$$1[i]))) {
                continue;
            }
            var attr = target.getAttribute(attributes$$1[i]);
            input.setAttribute(attributes$$1[i], attr);
            target.removeAttribute(attributes$$1[i]);
        }
    };
    TimePicker.prototype.initialize = function () {
        this.globalize = new sf.base.Internationalization(this.locale);
        this.defaultCulture = new sf.base.Internationalization('en');
        this.checkTimeFormat();
        this.checkInvalidValue(this.value);
        // persist the value property.
        this.setProperties({ value: this.checkDateValue(new Date(this.checkInValue(this.value))) }, true);
        this.setProperties({ min: this.checkDateValue(new Date(this.checkInValue(this.min))) }, true);
        this.setProperties({ max: this.checkDateValue(new Date(this.checkInValue(this.max))) }, true);
        this.setProperties({ scrollTo: this.checkDateValue(new Date(this.checkInValue(this.scrollTo))) }, true);
        if (this.angularTag !== null) {
            this.validationAttribute(this.element, this.inputElement);
        }
        this.updateHtmlAttributeToElement();
        this.checkAttributes(false); //check the input element attributes
        var localeText = { placeholder: this.placeholder };
        this.l10n = new sf.base.L10n('timepicker', localeText, this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        this.initValue = this.checkDateValue(this.value);
        this.initMin = this.checkDateValue(this.min);
        this.initMax = this.checkDateValue(this.max);
        this.isNavigate = this.isPreventBlur = this.isTextSelected = false;
        this.activeIndex = this.valueWithMinutes = this.prevDate = null;
        if (!sf.base.isNullOrUndefined(this.element.getAttribute('id'))) {
            if (this.angularTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        }
        else {
            //for angular case
            this.element.id = sf.base.getUniqueID('ej2_timepicker');
            if (this.angularTag !== null) {
                sf.base.attributes(this.inputElement, { 'id': this.element.id + '_input' });
            }
        }
        if (sf.base.isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            sf.base.attributes(this.inputElement, { 'name': this.element.id });
        }
    };
    TimePicker.prototype.checkTimeFormat = function () {
        if (this.format) {
            if (typeof this.format === 'string') {
                this.formatString = this.format;
            }
            else if (!sf.base.isNullOrUndefined(this.format.skeleton) && this.format.skeleton !== '') {
                var skeletonString = this.format.skeleton;
                this.formatString = this.globalize.getDatePattern({ type: 'time', skeleton: skeletonString });
            }
            else {
                this.formatString = this.globalize.getDatePattern({ type: 'time', skeleton: 'short' });
            }
        }
        else {
            this.formatString = null;
        }
    };
    TimePicker.prototype.checkDateValue = function (value) {
        return (!sf.base.isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    };
    TimePicker.prototype.createInputElement = function () {
        var updatedCssClassesValue = this.cssClass;
        if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassesValue = (this.cssClass.replace(/\s+/g, ' ')).trim();
        }
        this.inputWrapper = sf.inputs.Input.createInput({
            element: this.inputElement,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: updatedCssClassesValue,
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
            },
            buttons: [' e-input-group-icon e-time-icon e-icons']
        }, this.createElement);
        this.inputWrapper.container.style.width = this.setWidth(this.width);
        sf.base.attributes(this.inputElement, {
            'aria-haspopup': 'true', 'aria-autocomplete': 'list', 'tabindex': '0', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-disabled': 'false', 'aria-invalid': 'false'
        });
        if (!this.isNullOrEmpty(this.inputStyle)) {
            sf.inputs.Input.addAttributes({ 'style': this.inputStyle }, this.inputElement);
        }
        sf.base.addClass([this.inputWrapper.container], WRAPPERCLASS);
    };
    TimePicker.prototype.getCldrDateTimeFormat = function () {
        var culture = new sf.base.Internationalization(this.locale);
        var cldrTime;
        var dateFormat = culture.getDatePattern({ skeleton: sf.base.isBlazor() ? 'd' : 'yMd' });
        if (this.isNullOrEmpty(this.formatString)) {
            cldrTime = dateFormat + ' ' + this.CldrFormat('time');
        }
        else {
            cldrTime = this.formatString;
        }
        return cldrTime;
    };
    TimePicker.prototype.checkInvalidValue = function (value) {
        var isInvalid = false;
        if (typeof value !== 'object' && !sf.base.isNullOrUndefined(value)) {
            var valueString = value;
            if (typeof valueString === 'string') {
                valueString = valueString.trim();
            }
            var valueExpression = null;
            var valueExp = null;
            if (typeof value === 'number') {
                valueString = value.toString();
            }
            else if (typeof value === 'string') {
                if (!(/^[a-zA-Z0-9- ]*$/).test(value)) {
                    valueExpression = this.setCurrentDate(this.getDateObject(value));
                    if (sf.base.isNullOrUndefined(valueExpression)) {
                        valueExpression = this.checkDateValue(this.globalize.parseDate(valueString, {
                            format: this.getCldrDateTimeFormat(), type: 'datetime'
                        }));
                        if (sf.base.isNullOrUndefined(valueExpression)) {
                            valueExpression = this.checkDateValue(this.globalize.parseDate(valueString, {
                                format: this.formatString, type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd'
                            }));
                        }
                    }
                }
            }
            valueExp = this.globalize.parseDate(valueString, {
                format: this.getCldrDateTimeFormat(), type: 'datetime'
            });
            valueExpression = (!sf.base.isNullOrUndefined(valueExp) && valueExp instanceof Date && !isNaN(+valueExp)) ? valueExp : null;
            if (sf.base.isNullOrUndefined(valueExpression) && valueString.replace(/\s/g, '').length) {
                var extISOString = null;
                var basicISOString = null;
                // tslint:disable-next-line
                extISOString = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                // tslint:disable-next-line
                basicISOString = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                if ((!extISOString.test(valueString) && !basicISOString.test(valueString))
                    || ((/^[a-zA-Z0-9- ]*$/).test(value)) || isNaN(+new Date('' + valueString))) {
                    isInvalid = true;
                }
                else {
                    valueExpression = new Date('' + valueString);
                }
            }
            if (isInvalid) {
                if (!this.strictMode) {
                    this.invalidValueString = valueString;
                }
                this.setProperties({ value: null }, true);
                this.initValue = null;
            }
            else {
                this.setProperties({ value: valueExpression }, true);
                this.initValue = this.value;
            }
        }
    };
    TimePicker.prototype.CldrFormat = function (type) {
        var cldrDateTimeString;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrDateTimeString = sf.base.isBlazor() ? this.getBlazorCultureFormat('t') :
                (sf.base.getValue('timeFormats.short', sf.base.getDefaultDateObject()));
        }
        else {
            cldrDateTimeString = (this.getCultureTimeObject(sf.base.cldrData, '' + this.locale));
        }
        return cldrDateTimeString;
    };
    // destroy function
    TimePicker.prototype.destroy = function () {
        if (this.isBlazorServer) {
            this.unBindEvents();
        }
        else {
            this.hide();
            this.unBindEvents();
            var ariaAttribute = {
                'aria-haspopup': 'true', 'aria-autocomplete': 'list', 'tabindex': '0', 'aria-activedescendant': 'null',
                'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
                'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-disabled': 'true', 'aria-invalid': 'false'
            };
            if (this.inputElement) {
                sf.inputs.Input.removeAttributes(ariaAttribute, this.inputElement);
                if (this.angularTag === null) {
                    this.inputWrapper.container.parentElement.appendChild(this.inputElement);
                }
                (!sf.base.isNullOrUndefined(this.cloneElement.getAttribute('tabindex'))) ?
                    this.inputElement.setAttribute('tabindex', this.tabIndex) : this.inputElement.removeAttribute('tabindex');
                this.ensureInputAttribute();
                this.enableElement([this.inputElement]);
                this.inputElement.classList.remove('e-input');
                if (sf.base.isNullOrUndefined(this.cloneElement.getAttribute('disabled'))) {
                    sf.inputs.Input.setEnabled(true, this.inputElement, this.floatLabelType);
                }
            }
            if (this.inputWrapper.container) {
                sf.base.detach(this.inputWrapper.container);
            }
            this.inputWrapper = this.popupWrapper = this.cloneElement = undefined;
            this.liCollections = this.timeCollections = this.disableItemCollection = [];
            if (!sf.base.isNullOrUndefined(this.rippleFn)) {
                this.rippleFn();
            }
            _super.prototype.destroy.call(this);
            if (this.formElement) {
                sf.base.EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
            }
        }
    };
    TimePicker.prototype.ensureInputAttribute = function () {
        var propertyList = [];
        for (var i = 0; i < this.inputElement.attributes.length; i++) {
            propertyList[i] = this.inputElement.attributes[i].name;
        }
        for (var i = 0; i < propertyList.length; i++) {
            if (!sf.base.isNullOrUndefined(this.cloneElement.getAttribute(propertyList[i]))) {
                this.inputElement.setAttribute(propertyList[i], this.cloneElement.getAttribute(propertyList[i]));
                if (propertyList[i].toLowerCase() === 'value') {
                    this.inputElement.value = this.cloneElement.getAttribute(propertyList[i]);
                }
            }
            else {
                this.inputElement.removeAttribute(propertyList[i]);
                if (propertyList[i].toLowerCase() === 'value') {
                    this.inputElement.value = '';
                }
            }
        }
    };
    //popup creation
    TimePicker.prototype.popupCreation = function () {
        if (!this.isBlazorServer) {
            this.popupWrapper = this.createElement('div', {
                className: ROOT + ' ' + POPUP,
                attrs: { 'id': this.element.id + '_popup', 'style': 'visibility:hidden' }
            });
            if (!sf.base.isNullOrUndefined(this.cssClass)) {
                this.popupWrapper.className += ' ' + this.cssClass;
            }
            if (!sf.base.isNullOrUndefined(this.step) && this.step > 0) {
                this.generateList();
                sf.base.append([this.listWrapper], this.popupWrapper);
            }
            this.openPopupEventArgs.appendTo.appendChild(this.popupWrapper);
        }
        else {
            this.popupWrapper = this.inputWrapper.container.nextElementSibling;
            this.generateList();
        }
        this.addSelection();
        this.renderPopup();
        sf.base.detach(this.popupWrapper);
    };
    TimePicker.prototype.getPopupHeight = function () {
        var height = parseInt(POPUPDIMENSION, 10);
        var popupHeight = this.popupWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    };
    TimePicker.prototype.generateList = function () {
        if (!this.isBlazorServer) {
            this.createListItems();
        }
        else {
            this.listWrapper = this.popupWrapper.querySelector('.e-content');
        }
        this.wireListEvents();
        var rippleModel = { duration: 300, selector: '.' + LISTCLASS };
        this.rippleFn = sf.base.rippleEffect(this.listWrapper, rippleModel);
        this.liCollections = this.listWrapper.querySelectorAll('.' + LISTCLASS);
        if (this.isBlazorServer) {
            this.blazorTimeCollections = [];
            for (var index = 0; index < this.liCollections.length; index++) {
                this.blazorTimeCollections.push(this.liCollections[index].getAttribute('data-value'));
            }
        }
    };
    TimePicker.prototype.renderPopup = function () {
        var _this = this;
        this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
        this.popupObj = new sf.popups.Popup(this.popupWrapper, {
            width: this.setPopupWidth(this.width),
            zIndex: this.zIndex,
            targetType: 'relative',
            position: sf.base.Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            collision: sf.base.Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            enableRtl: this.enableRtl,
            relateTo: sf.base.Browser.isDevice ? document.body : this.inputWrapper.container,
            offsetY: OFFSETVAL,
            open: function () {
                _this.popupWrapper.style.visibility = 'visible';
                sf.base.addClass([_this.inputWrapper.buttons[0]], SELECTED);
            }, close: function () {
                sf.base.removeClass([_this.inputWrapper.buttons[0]], SELECTED);
                _this.unWireListEvents();
                _this.inputElement.setAttribute('aria-activedescendant', 'null');
                if (!_this.isBlazorServer) {
                    sf.base.remove(_this.popupObj.element);
                    _this.popupObj.destroy();
                    _this.popupWrapper.innerHTML = '';
                }
                _this.listWrapper = _this.popupWrapper = _this.listTag = undefined;
            }, targetExitViewport: function () {
                if (!sf.base.Browser.isDevice) {
                    _this.hide();
                }
            }
        });
        if (!sf.base.Browser.isDevice) {
            this.popupObj.collision = { X: 'none', Y: 'flip' };
        }
        this.popupObj.element.style.maxHeight = POPUPDIMENSION;
    };
    //util function
    TimePicker.prototype.getFormattedValue = function (value) {
        if (sf.base.isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        else {
            return this.globalize.formatDate(value, { skeleton: sf.base.isBlazor() ? 't' : 'medium', type: 'time' });
        }
    };
    TimePicker.prototype.getDateObject = function (text) {
        if (!this.isNullOrEmpty(text)) {
            var dateValue = this.createDateObj(text);
            var value = !this.isNullOrEmpty(this.initValue);
            if (this.checkDateValue(dateValue)) {
                var date = value ? this.initValue.getDate() : DAY;
                var month = value ? this.initValue.getMonth() : MONTH;
                var year = value ? this.initValue.getFullYear() : YEAR;
                return new Date(year, month, date, dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds());
            }
        }
        return null;
    };
    TimePicker.prototype.updateHtmlAttributeToWrapper = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttributes.indexOf(key) > -1) {
                    if (key === 'class') {
                        var updatedClassesValue = (this.htmlAttributes[key].replace(/\s+/g, ' ')).trim();
                        if (updatedClassesValue !== '') {
                            sf.base.addClass([this.inputWrapper.container], updatedClassesValue.split(' '));
                        }
                    }
                    else if (key === 'style') {
                        var timeStyle = this.inputWrapper.container.getAttribute(key);
                        timeStyle = !sf.base.isNullOrUndefined(timeStyle) ? (timeStyle + this.htmlAttributes[key]) :
                            this.htmlAttributes[key];
                        this.inputWrapper.container.setAttribute(key, timeStyle);
                    }
                    else {
                        this.inputWrapper.container.setAttribute(key, this.htmlAttributes[key]);
                    }
                }
            }
        }
    };
    TimePicker.prototype.updateHtmlAttributeToElement = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttributes.indexOf(key) < 0) {
                    this.inputElement.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    };
    TimePicker.prototype.updateCssClass = function (cssClassNew, cssClassOld) {
        if (!sf.base.isNullOrUndefined(cssClassOld)) {
            cssClassOld = (cssClassOld.replace(/\s+/g, ' ')).trim();
        }
        if (!sf.base.isNullOrUndefined(cssClassNew)) {
            cssClassNew = (cssClassNew.replace(/\s+/g, ' ')).trim();
        }
        sf.inputs.Input.setCssClass(cssClassNew, [this.inputWrapper.container], cssClassOld);
        if (this.popupWrapper) {
            sf.inputs.Input.setCssClass(cssClassNew, [this.popupWrapper], cssClassOld);
        }
    };
    TimePicker.prototype.removeErrorClass = function () {
        sf.base.removeClass([this.inputWrapper.container], ERROR);
        sf.base.attributes(this.inputElement, { 'aria-invalid': 'false' });
    };
    TimePicker.prototype.checkErrorState = function (val) {
        var value = this.getDateObject(val);
        if (this.validateState(value) && !this.invalidValueString) {
            this.removeErrorClass();
        }
        else {
            sf.base.addClass([this.inputWrapper.container], ERROR);
            sf.base.attributes(this.inputElement, { 'aria-invalid': 'true' });
        }
    };
    TimePicker.prototype.validateInterval = function () {
        if (!sf.base.isNullOrUndefined(this.step) && this.step > 0) {
            this.enableElement([this.inputWrapper.buttons[0]]);
        }
        else {
            this.disableTimeIcon();
        }
    };
    TimePicker.prototype.disableTimeIcon = function () {
        this.disableElement([this.inputWrapper.buttons[0]]);
        this.hide();
    };
    TimePicker.prototype.disableElement = function (element) {
        sf.base.addClass(element, DISABLED);
    };
    TimePicker.prototype.enableElement = function (element) {
        sf.base.removeClass(element, DISABLED);
    };
    TimePicker.prototype.selectInputText = function () {
        this.inputElement.setSelectionRange(0, (this.inputElement).value.length);
    };
    TimePicker.prototype.setCursorToEnd = function () {
        this.inputElement.setSelectionRange((this.inputElement).value.length, (this.inputElement).value.length);
    };
    TimePicker.prototype.getMeridianText = function () {
        var meridian;
        if (this.locale === 'en' || this.locale === 'en-US') {
            meridian = sf.base.getValue((sf.base.isBlazor() ? 'dayPeriods.wide' : 'dayPeriods.format.wide'), sf.base.getDefaultDateObject());
        }
        else {
            var gregorianFormat = (sf.base.isBlazor() ? '.dates.dayPeriods.abbreviated' :
                '.dates.calendars.gregorian.dayPeriods.format.abbreviated');
            var mainVal = sf.base.isBlazor() ? '' : 'main.';
            meridian = sf.base.getValue(mainVal + '' + this.locale + gregorianFormat, sf.base.cldrData);
        }
        return meridian;
    };
    TimePicker.prototype.getCursorSelection = function () {
        var input = (this.inputElement);
        var start = 0;
        var end = 0;
        if (!isNaN(input.selectionStart)) {
            start = input.selectionStart;
            end = input.selectionEnd;
        }
        return { start: Math.abs(start), end: Math.abs(end) };
    };
    TimePicker.prototype.getActiveElement = function () {
        if (!sf.base.isNullOrUndefined(this.popupWrapper)) {
            return this.popupWrapper.querySelectorAll('.' + SELECTED);
        }
        else {
            return null;
        }
    };
    TimePicker.prototype.isNullOrEmpty = function (value) {
        if (sf.base.isNullOrUndefined(value) || (typeof value === 'string' && value.trim() === '')) {
            return true;
        }
        else {
            return false;
        }
    };
    TimePicker.prototype.setWidth = function (width) {
        if (typeof width === 'number') {
            width = sf.base.formatUnit(width);
        }
        else if (typeof width === 'string') {
            width = (width.match(/px|%|em/)) ? width : sf.base.formatUnit(width);
        }
        else {
            width = '100%';
        }
        return width;
    };
    TimePicker.prototype.setPopupWidth = function (width) {
        width = this.setWidth(width);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    };
    TimePicker.prototype.setScrollPosition = function () {
        var listHeight = this.getPopupHeight();
        var element;
        element = this.selectedElement;
        if (!sf.base.isNullOrUndefined(element)) {
            this.findScrollTop(element);
        }
        else if (this.popupWrapper && this.checkDateValue(this.scrollTo)) {
            this.setScrollTo();
        }
    };
    TimePicker.prototype.findScrollTop = function (element) {
        var listHeight = this.getPopupHeight();
        var nextEle = element.nextElementSibling;
        var height = nextEle ? nextEle.offsetTop : element.offsetTop;
        var liHeight = element.getBoundingClientRect().height;
        if ((height + element.offsetTop) > listHeight) {
            this.popupWrapper.scrollTop = nextEle ? (height - (listHeight / HALFPOSITION + liHeight / HALFPOSITION)) : height;
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
    };
    TimePicker.prototype.setScrollTo = function () {
        var element;
        if (!sf.base.isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                var initialTime = this.isBlazorServer ? new Date(new Date().toDateString() + ' ' +
                    this.blazorTimeCollections[0]).setMilliseconds(0) : this.timeCollections[0];
                var scrollTime = this.isBlazorServer ? new Date(new Date().toDateString() + ' ' +
                    this.scrollTo.toLocaleTimeString()).setMilliseconds(0) :
                    this.getDateObject(this.checkDateValue(this.scrollTo)).getTime();
                element = items[Math.round((scrollTime - initialTime) / (this.step * 60000))];
            }
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
        if (!sf.base.isNullOrUndefined(element)) {
            this.findScrollTop(element);
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
    };
    TimePicker.prototype.getText = function () {
        return (sf.base.isNullOrUndefined(this.checkDateValue(this.value))) ? '' : this.getValue(this.value);
    };
    TimePicker.prototype.getValue = function (value) {
        return (sf.base.isNullOrUndefined(this.checkDateValue(value))) ? null : this.globalize.formatDate(value, {
            format: this.cldrTimeFormat(), type: 'time'
        });
    };
    TimePicker.prototype.cldrDateFormat = function () {
        var cldrDate;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrDate = sf.base.isBlazor() ? (sf.base.getValue('d', sf.base.getValue(this.locale, sf.base.blazorCultureFormats))) :
                (sf.base.getValue('dateFormats.short', sf.base.getDefaultDateObject()));
        }
        else {
            cldrDate = (this.getCultureDateObject(sf.base.cldrData, '' + this.locale));
        }
        return cldrDate;
    };
    TimePicker.prototype.getBlazorCultureFormat = function (formatVal) {
        return (sf.base.getValue(formatVal, sf.base.getValue(this.locale, sf.base.blazorCultureFormats))).replace(/tt/, 'a');
    };
    TimePicker.prototype.cldrTimeFormat = function () {
        var cldrTime;
        if (this.isNullOrEmpty(this.formatString)) {
            if (this.locale === 'en' || this.locale === 'en-US') {
                cldrTime = sf.base.isBlazor() ? this.getBlazorCultureFormat('t') :
                    (sf.base.getValue('timeFormats.short', sf.base.getDefaultDateObject()));
            }
            else {
                cldrTime = (this.getCultureTimeObject(sf.base.cldrData, '' + this.locale));
            }
        }
        else {
            cldrTime = this.formatString;
        }
        return cldrTime;
    };
    TimePicker.prototype.dateToNumeric = function () {
        var cldrTime;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrTime = sf.base.isBlazor() ? this.getBlazorCultureFormat('T') :
                (sf.base.getValue('timeFormats.medium', sf.base.getDefaultDateObject()));
        }
        else {
            cldrTime = sf.base.isBlazor() ? this.getBlazorCultureFormat('T') :
                (sf.base.getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.medium', sf.base.cldrData));
        }
        return cldrTime;
    };
    TimePicker.prototype.getExactDateTime = function (value) {
        if (sf.base.isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        else {
            return this.globalize.formatDate(value, { format: this.dateToNumeric(), type: 'time' });
        }
    };
    TimePicker.prototype.setValue = function (value) {
        var time = this.checkValue(value);
        if (!this.strictMode && !this.validateState(time)) {
            if (this.checkDateValue(this.valueWithMinutes) === null) {
                this.initValue = this.valueWithMinutes = null;
            }
            this.validateMinMax(this.value, this.min, this.max);
        }
        else {
            if (this.isNullOrEmpty(time)) {
                this.initValue = null;
                this.validateMinMax(this.value, this.min, this.max);
            }
            else {
                this.initValue = this.compareFormatChange(time);
            }
        }
        this.updateInput(true, this.initValue);
    };
    TimePicker.prototype.compareFormatChange = function (value) {
        if (sf.base.isNullOrUndefined(value)) {
            return null;
        }
        return (value !== this.getText()) ? this.getDateObject(value) : this.getDateObject(this.value);
    };
    TimePicker.prototype.updatePlaceHolder = function () {
        sf.inputs.Input.setPlaceholder(this.l10n.getConstant('placeholder'), this.inputElement);
    };
    //event related functions
    TimePicker.prototype.updateInputValue = function (value) {
        sf.inputs.Input.setValue(value, this.inputElement, this.floatLabelType, this.showClearButton);
    };
    TimePicker.prototype.preventEventBubbling = function (e) {
        e.preventDefault();
        // tslint:disable
        this.interopAdaptor.invokeMethodAsync('OnTimeIconClick');
        // tslint:enable
    };
    TimePicker.prototype.updateBlazorTimeCollections = function (listData) {
        this.blazorTimeCollections = listData;
    };
    TimePicker.prototype.popupHandler = function (e) {
        if (sf.base.Browser.isDevice) {
            this.inputElement.setAttribute('readonly', '');
        }
        if (!this.isBlazorServer) {
            e.preventDefault();
        }
        if (this.isPopupOpen() && !this.isBlazorServer) {
            this.closePopup(0, e);
        }
        else {
            this.inputElement.focus();
            this.show(e);
        }
    };
    TimePicker.prototype.mouseDownHandler = function () {
        if (!this.readonly) {
            var curPos = this.getCursorSelection();
            this.inputElement.setSelectionRange(0, 0);
            sf.base.EventHandler.add(this.inputElement, 'mouseup', this.mouseUpHandler, this);
        }
    };
    TimePicker.prototype.mouseUpHandler = function (event) {
        if (!this.readonly) {
            event.preventDefault();
            sf.base.EventHandler.remove(this.inputElement, 'mouseup', this.mouseUpHandler);
            var curPos = this.getCursorSelection();
            if (!(curPos.start === 0 && curPos.end === this.inputElement.value.length)) {
                if (this.inputElement.value.length > 0) {
                    this.cursorDetails = this.focusSelection();
                }
                this.inputElement.setSelectionRange(this.cursorDetails.start, this.cursorDetails.end);
            }
        }
    };
    TimePicker.prototype.focusSelection = function () {
        var regex = new RegExp('^[a-zA-Z0-9]+$');
        var split = this.inputElement.value.split('');
        split.push(' ');
        var curPos = this.getCursorSelection();
        var start = 0;
        var end = 0;
        var isSeparator = false;
        if (!this.isTextSelected) {
            for (var i = 0; i < split.length; i++) {
                if (!regex.test(split[i])) {
                    end = i;
                    isSeparator = true;
                }
                if (isSeparator) {
                    if (curPos.start >= start && curPos.end <= end) {
                        end = end;
                        this.isTextSelected = true;
                        break;
                    }
                    else {
                        start = i + 1;
                        isSeparator = false;
                    }
                }
            }
        }
        else {
            start = curPos.start;
            end = curPos.end;
            this.isTextSelected = false;
        }
        return { start: start, end: end };
    };
    TimePicker.prototype.inputHandler = function (event) {
        if (!this.readonly && this.enabled) {
            if (event.action !== 'right' && event.action !== 'left' && event.action !== 'tab') {
                event.preventDefault();
            }
            switch (event.action) {
                case 'home':
                case 'end':
                case 'up':
                case 'down':
                    this.keyHandler(event);
                    break;
                case 'enter':
                    if (this.isNavigate) {
                        this.selectedElement = this.liCollections[this.activeIndex];
                        if (!this.isBlazorServer) {
                            this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
                            this.updateValue(this.valueWithMinutes, event);
                        }
                        else {
                            this.inputElement.setAttribute('value', this.selectedElement.getAttribute('data-value'));
                            // tslint:disable-next-line
                            this.interopAdaptor.invokeMethodAsync('OnListItemClick', this.activeIndex, true);
                        }
                    }
                    else {
                        if (!this.isBlazorServer) {
                            this.updateValue(this.inputElement.value, event);
                        }
                        else {
                            // tslint:disable-next-line
                            this.interopAdaptor.invokeMethodAsync('OnStrictMode', this.inputElement.value);
                        }
                    }
                    this.hide();
                    this.isNavigate = false;
                    if (this.isPopupOpen()) {
                        event.stopPropagation();
                    }
                    break;
                case 'open':
                    if (this.isBlazorServer) {
                        // tslint:disable
                        this.interopAdaptor.invokeMethodAsync('OnPopupHide', true);
                        // tslint:enable
                    }
                    else {
                        this.show(event);
                    }
                    break;
                case 'escape':
                    if (!this.isBlazorServer) {
                        this.updateInputValue(this.objToString(this.value));
                        this.previousState(this.value);
                    }
                    this.hide();
                    break;
                case 'close':
                    this.hide();
                    break;
                default:
                    this.isNavigate = false;
                    break;
            }
        }
    };
    TimePicker.prototype.onMouseClick = function (event) {
        var target = event.target;
        var li = this.selectedElement = sf.base.closest(target, '.' + LISTCLASS);
        this.setSelection(li, event);
        if (li && li.classList.contains(LISTCLASS)) {
            this.hide();
        }
    };
    TimePicker.prototype.closePopup = function (delay, e) {
        var _this = this;
        if (this.isPopupOpen() && this.popupWrapper) {
            var args = {
                popup: this.isBlazorServer ? null : this.popupObj,
                event: e || null,
                cancel: false,
                name: 'open'
            };
            sf.base.removeClass([document.body], OVERFLOW);
            this.trigger('close', args, function (args) {
                if (!args.cancel) {
                    var animModel = {
                        name: 'FadeOut',
                        duration: ANIMATIONDURATION,
                        delay: delay ? delay : 0
                    };
                    _this.popupObj.hide(new sf.base.Animation(animModel));
                    sf.base.removeClass([_this.inputWrapper.container], [ICONANIMATION]);
                    sf.base.attributes(_this.inputElement, { 'aria-expanded': 'false' });
                    sf.base.EventHandler.remove(document, 'mousedown touchstart', _this.documentClickHandler);
                    if (_this.isBlazorServer) {
                        _this.disposeServerPopup();
                        // tslint:disable
                        _this.inputWrapper.container.parentElement.insertBefore(_this.popupWrapper, _this.inputWrapper.container.nextElementSibling);
                        _this.interopAdaptor.invokeMethodAsync('OnPopupHide', false);
                        // tslint:enable
                        _this.popupWrapper = _this.popupObj = null;
                    }
                }
                if (sf.base.Browser.isDevice && _this.modal) {
                    _this.modal.style.display = 'none';
                    _this.modal.outerHTML = '';
                    _this.modal = null;
                }
                if (sf.base.Browser.isDevice) {
                    if (!sf.base.isNullOrUndefined(_this.mobileTimePopupWrap)) {
                        _this.mobileTimePopupWrap.remove();
                        _this.mobileTimePopupWrap = null;
                    }
                }
                if (sf.base.Browser.isDevice && _this.allowEdit && !_this.readonly) {
                    _this.inputElement.removeAttribute('readonly');
                }
            });
        }
        else {
            if (sf.base.Browser.isDevice && this.allowEdit && !this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        }
    };
    TimePicker.prototype.disposeServerPopup = function () {
        if (this.popupWrapper) {
            this.popupWrapper.style.visibility = 'hidden';
            this.popupWrapper.style.top = '-9999px';
            this.popupWrapper.style.left = '-9999px';
            this.popupWrapper.style.width = '0px';
            this.popupWrapper.style.height = '0px';
        }
    };
    TimePicker.prototype.checkValueChange = function (event, isNavigation) {
        if (!this.strictMode && !this.validateState(this.valueWithMinutes)) {
            if (this.checkDateValue(this.valueWithMinutes) === null) {
                this.initValue = this.valueWithMinutes = null;
            }
            this.setProperties({ value: this.compareFormatChange(this.inputElement.value) }, true);
            this.initValue = this.valueWithMinutes = this.compareFormatChange(this.inputElement.value);
            this.prevValue = this.inputElement.value;
            if (+this.prevDate !== +this.value) {
                this.changeEvent(event);
            }
        }
        else {
            if (!isNavigation) {
                if ((this.prevValue !== this.inputElement.value) || sf.base.isNullOrUndefined(this.checkDateValue(this.value))) {
                    this.valueProcess(event, this.compareFormatChange(this.inputElement.value));
                }
            }
            else {
                var value = this.getDateObject(new Date(this.timeCollections[this.activeIndex]));
                if (+this.prevDate !== +value) {
                    this.valueProcess(event, value);
                }
            }
        }
    };
    TimePicker.prototype.onMouseOver = function (event) {
        var currentLi = sf.base.closest(event.target, '.' + LISTCLASS);
        this.setHover(currentLi, HOVER);
    };
    TimePicker.prototype.setHover = function (li, className) {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(className)) {
            this.removeHover(className);
            sf.base.addClass([li], className);
            if (className === NAVIGATION) {
                li.setAttribute('aria-selected', 'true');
            }
        }
    };
    TimePicker.prototype.setSelection = function (li, event) {
        if (this.isValidLI(li) && !li.classList.contains(SELECTED)) {
            if (!this.isBlazorServer) {
                this.checkValue(li.getAttribute('data-value'));
                this.selectedElement = li;
                this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
                this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
                sf.base.addClass([this.selectedElement], SELECTED);
                this.selectedElement.setAttribute('aria-selected', 'true');
                this.checkValueChange(event, true);
            }
            else {
                this.selectedElement = li;
                this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
                sf.base.addClass([this.selectedElement], SELECTED);
                this.selectedElement.setAttribute('aria-selected', 'true');
                this.inputElement.setAttribute('value', li.getAttribute('data-value'));
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnListItemClick', this.activeIndex, false);
                this.addSelection();
            }
        }
    };
    TimePicker.prototype.onMouseLeave = function () {
        this.removeHover(HOVER);
    };
    TimePicker.prototype.scrollHandler = function () {
        if (this.getModuleName() === 'timepicker' && sf.base.Browser.isDevice) {
            return;
        }
        else {
            this.hide();
        }
    };
    TimePicker.prototype.setMinMax = function (minVal, maxVal) {
        if (sf.base.isNullOrUndefined(this.checkDateValue(minVal))) {
            this.initMin = this.getDateObject('12:00:00 AM');
        }
        if (sf.base.isNullOrUndefined(this.checkDateValue(maxVal))) {
            this.initMax = this.getDateObject('11:59:59 PM');
        }
    };
    //protected function
    TimePicker.prototype.validateMinMax = function (dateVal, minVal, maxVal) {
        var value = dateVal instanceof Date ? dateVal : this.getDateObject(dateVal);
        if (!sf.base.isNullOrUndefined(this.checkDateValue(value))) {
            dateVal = this.strictOperation(this.initMin, this.initMax, dateVal, value);
        }
        else if (+(this.createDateObj(this.getFormattedValue(this.initMin))) >
            +(this.createDateObj(this.getFormattedValue(this.initMax)))) {
            this.disableTimeIcon();
        }
        if (this.strictMode) {
            dateVal = this.valueIsDisable(dateVal) ? dateVal : null;
        }
        this.checkErrorState(dateVal);
        return dateVal;
    };
    TimePicker.prototype.valueIsDisable = function (value) {
        if (this.disableItemCollection.length > 0) {
            if (this.disableItemCollection.length === this.timeCollections.length) {
                return false;
            }
            var time = value instanceof Date ? this.objToString(value) : value;
            for (var index = 0; index < this.disableItemCollection.length; index++) {
                if (time === this.disableItemCollection[index]) {
                    return false;
                }
            }
        }
        return true;
    };
    TimePicker.prototype.validateState = function (val) {
        if (!this.strictMode) {
            if (this.valueIsDisable(val)) {
                var value = typeof val === 'string' ? this.setCurrentDate(this.getDateObject(val)) :
                    this.setCurrentDate(this.getDateObject(val));
                var maxValue = this.setCurrentDate(this.getDateObject(this.initMax));
                var minValue = this.setCurrentDate(this.getDateObject(this.initMin));
                if (!sf.base.isNullOrUndefined(this.checkDateValue(value))) {
                    if ((+(value) > +(maxValue)) || (+(value) < +(minValue))) {
                        return false;
                    }
                }
                else {
                    if ((+(maxValue) < +(minValue)) || this.inputElement.value !== '') {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        }
        return true;
    };
    TimePicker.prototype.strictOperation = function (minimum, maximum, dateVal, val) {
        var maxValue = this.createDateObj(this.getFormattedValue(maximum));
        var minValue = this.createDateObj(this.getFormattedValue(minimum));
        var value = this.createDateObj(this.getFormattedValue(val));
        if (this.strictMode) {
            if (+minValue > +maxValue) {
                this.disableTimeIcon();
                this.initValue = this.getDateObject(maxValue);
                this.updateInputValue(this.getValue(this.initValue));
                return this.inputElement.value;
            }
            else if (+minValue >= +value) {
                return this.getDateObject(minValue);
            }
            else if (+value >= +maxValue || +minValue === +maxValue) {
                return this.getDateObject(maxValue);
            }
        }
        else {
            if (+minValue > +maxValue) {
                this.disableTimeIcon();
                if (!isNaN(+this.createDateObj(dateVal))) {
                    return dateVal;
                }
            }
        }
        return dateVal;
    };
    TimePicker.prototype.bindEvents = function () {
        sf.base.EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', (this.isBlazorServer ? this.preventEventBubbling : this.popupHandler), this);
        sf.base.EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
        sf.base.EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
        sf.base.EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
        if (this.showClearButton && this.inputWrapper.clearButton) {
            sf.base.EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.clearHandler, this);
        }
        if (this.formElement) {
            sf.base.EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
        if (!sf.base.Browser.isDevice) {
            this.keyConfigure = sf.base.extend(this.keyConfigure, this.keyConfigs);
            this.inputEvent = new sf.base.KeyboardEvents(this.inputWrapper.container, {
                keyAction: this.inputHandler.bind(this),
                keyConfigs: this.keyConfigure,
                eventName: 'keydown'
            });
            if (this.showClearButton && this.inputElement) {
                sf.base.EventHandler.add(this.inputElement, 'mousedown', this.mouseDownHandler, this);
            }
        }
    };
    TimePicker.prototype.formResetHandler = function () {
        if (!this.inputElement.disabled) {
            var timeValue = this.inputElement.getAttribute('value');
            var val = this.isBlazorServer ? this.inputEleValue : this.checkDateValue(this.inputEleValue);
            if (this.element.tagName === 'EJS-TIMEPICKER') {
                val = null;
                timeValue = '';
                this.inputElement.setAttribute('value', '');
            }
            if (!this.isBlazorServer) {
                this.setProperties({ value: val }, true);
                this.prevDate = this.value;
                this.valueWithMinutes = this.value;
                this.initValue = this.value;
            }
            if (this.inputElement) {
                this.updateInputValue(timeValue);
                if (!this.isBlazorServer) {
                    this.checkErrorState(timeValue);
                }
                this.prevValue = this.inputElement.value;
            }
        }
    };
    TimePicker.prototype.inputChangeHandler = function (e) {
        e.stopPropagation();
    };
    TimePicker.prototype.unBindEvents = function () {
        if (this.inputWrapper) {
            sf.base.EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', (this.isBlazorServer ? this.preventEventBubbling : this.popupHandler));
        }
        sf.base.EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
        sf.base.EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
        sf.base.EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
        if (this.inputEvent) {
            this.inputEvent.destroy();
        }
        sf.base.EventHandler.remove(this.inputElement, 'mousedown touchstart', this.mouseDownHandler);
        if (this.showClearButton && !sf.base.isNullOrUndefined(this.inputWrapper.clearButton)) {
            sf.base.EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.clearHandler);
        }
        if (this.formElement) {
            sf.base.EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
    };
    TimePicker.prototype.bindClearEvent = function () {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            sf.base.EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.clearHandler, this);
        }
    };
    TimePicker.prototype.raiseClearedEvent = function (e) {
        var clearedArgs = {
            event: e
        };
        this.trigger('cleared', clearedArgs);
    };
    TimePicker.prototype.clearHandler = function (e) {
        e.preventDefault();
        if (!sf.base.isNullOrUndefined(this.value)) {
            this.clear(e);
        }
        else {
            this.resetState();
            this.raiseClearedEvent(e);
        }
        if (this.isBlazorServer) {
            // tslint:disable
            this.interopAdaptor.invokeMethodAsync('OnValueCleared');
            // tslint:enable
        }
        if (this.popupWrapper) {
            this.popupWrapper.scrollTop = 0;
        }
    };
    TimePicker.prototype.clear = function (event) {
        if (!this.isBlazorServer) {
            this.setProperties({ value: null }, true);
        }
        this.initValue = null;
        this.resetState();
        this.raiseClearedEvent(event);
        if (!this.isBlazorServer) {
            this.changeEvent(event);
        }
    };
    TimePicker.prototype.setZIndex = function () {
        if (this.popupObj) {
            this.popupObj.zIndex = this.zIndex;
            this.popupObj.dataBind();
        }
    };
    TimePicker.prototype.checkAttributes = function (isDynamic) {
        var attributes$$1 = isDynamic ? sf.base.isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['step', 'disabled', 'readonly', 'style', 'name', 'value', 'min', 'max', 'placeholder'];
        var value;
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!sf.base.isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.timeOptions) || (this.timeOptions['enabled'] === undefined)) || isDynamic) {
                            var enabled = this.inputElement.getAttribute(prop) === 'disabled' || this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'style':
                        this.inputStyle = this.inputElement.getAttribute(prop);
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.timeOptions) || (this.timeOptions['readonly'] === undefined)) || isDynamic) {
                            var readonly = this.inputElement.getAttribute(prop) === 'readonly' || this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', this.inputElement.getAttribute(prop));
                        break;
                    case 'step':
                        this.step = parseInt(this.inputElement.getAttribute(prop), 10);
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.timeOptions) || (this.timeOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, !isDynamic);
                        }
                        break;
                    case 'min':
                        if (!this.isBlazorServer) {
                            // tslint:disable-next-line
                            if ((sf.base.isNullOrUndefined(this.timeOptions) || (this.timeOptions['min'] === undefined)) || isDynamic) {
                                value = new Date(this.inputElement.getAttribute(prop));
                                if (!sf.base.isNullOrUndefined(this.checkDateValue(value))) {
                                    this.setProperties({ min: value }, !isDynamic);
                                }
                            }
                        }
                        break;
                    case 'max':
                        if (!this.isBlazorServer) {
                            // tslint:disable-next-line
                            if ((sf.base.isNullOrUndefined(this.timeOptions) || (this.timeOptions['max'] === undefined)) || isDynamic) {
                                value = new Date(this.inputElement.getAttribute(prop));
                                if (!sf.base.isNullOrUndefined(this.checkDateValue(value))) {
                                    this.setProperties({ max: value }, !isDynamic);
                                }
                            }
                        }
                        break;
                    case 'value':
                        if (!this.isBlazorServer) {
                            // tslint:disable-next-line
                            if ((sf.base.isNullOrUndefined(this.timeOptions) || (this.timeOptions['value'] === undefined)) || isDynamic) {
                                value = new Date(this.inputElement.getAttribute(prop));
                                if (!sf.base.isNullOrUndefined(this.checkDateValue(value))) {
                                    this.initValue = value;
                                    this.updateInput(false, this.initValue);
                                    this.setProperties({ value: value }, !isDynamic);
                                }
                            }
                        }
                        break;
                }
            }
        }
    };
    TimePicker.prototype.setCurrentDate = function (value) {
        if (sf.base.isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        return new Date(YEAR, MONTH, DAY, value.getHours(), value.getMinutes(), value.getSeconds());
    };
    TimePicker.prototype.getTextFormat = function () {
        var time = 0;
        if (this.cldrTimeFormat().split(' ')[0] === 'a' || this.cldrTimeFormat().indexOf('a') === 0) {
            time = 1;
        }
        else if (this.cldrTimeFormat().indexOf('a') < 0) {
            var strArray = this.cldrTimeFormat().split(' ');
            for (var i = 0; i < strArray.length; i++) {
                if (strArray[i].toLowerCase().indexOf('h') >= 0) {
                    time = i;
                    break;
                }
            }
        }
        return time;
    };
    TimePicker.prototype.updateValue = function (value, event) {
        var val;
        if (this.isNullOrEmpty(value)) {
            this.resetState();
        }
        else {
            val = this.checkValue(value);
            if (this.strictMode) {
                // this case set previous value to the text box when set invalid date
                var inputVal = (val === null && value.trim().length > 0) ?
                    this.previousState(this.prevDate) : this.inputElement.value;
                this.updateInputValue(inputVal);
            }
        }
        this.checkValueChange(event, typeof value === 'string' ? false : true);
    };
    TimePicker.prototype.previousState = function (date) {
        var value = this.getDateObject(date);
        for (var i = 0; i < this.timeCollections.length; i++) {
            if (+value === this.timeCollections[i]) {
                this.activeIndex = i;
                this.selectedElement = this.liCollections[i];
                this.valueWithMinutes = new Date(this.timeCollections[i]);
                break;
            }
        }
        return this.prevValue;
    };
    TimePicker.prototype.resetState = function () {
        this.removeSelection();
        sf.inputs.Input.setValue('', this.inputElement, this.floatLabelType, false);
        this.valueWithMinutes = this.activeIndex = null;
        if (!this.strictMode && !this.isBlazorServer) {
            this.checkErrorState(null);
        }
    };
    TimePicker.prototype.objToString = function (val) {
        if (sf.base.isNullOrUndefined(this.checkDateValue(val))) {
            return null;
        }
        else {
            return this.globalize.formatDate(val, { format: this.cldrTimeFormat(), type: 'time' });
        }
    };
    TimePicker.prototype.checkValue = function (value) {
        if (!this.isNullOrEmpty(value)) {
            var date = value instanceof Date ? value : this.getDateObject(value);
            return this.validateValue(date, value);
        }
        this.resetState();
        return this.valueWithMinutes = null;
    };
    TimePicker.prototype.validateValue = function (date, value) {
        var time;
        var val = this.validateMinMax(value, this.min, this.max);
        var newval = this.createDateObj(val);
        if (this.getFormattedValue(newval) !== this.getFormattedValue(this.value)) {
            this.valueWithMinutes = sf.base.isNullOrUndefined(newval) ? null : newval;
            time = this.objToString(this.valueWithMinutes);
        }
        else {
            if (this.strictMode) {
                //for strict mode case, when value not present within a range. Reset the nearest range value.
                date = newval;
            }
            this.valueWithMinutes = this.checkDateValue(date);
            time = this.objToString(this.valueWithMinutes);
        }
        if (!this.strictMode && sf.base.isNullOrUndefined(time)) {
            var value_1 = val.trim().length > 0 ? val : '';
            this.updateInputValue(value_1);
        }
        else {
            this.updateInputValue(time);
        }
        return time;
    };
    TimePicker.prototype.findNextElement = function (event) {
        var textVal = (this.inputElement).value;
        var value = sf.base.isNullOrUndefined(this.valueWithMinutes) || this.isBlazorServer ? this.createDateObj(textVal) :
            this.getDateObject(this.valueWithMinutes);
        var timeVal = null;
        var count = this.liCollections.length;
        var collections = this.isBlazorServer ? (sf.base.isNullOrUndefined(this.blazorTimeCollections) ? [] :
            this.blazorTimeCollections) : this.timeCollections;
        if (!sf.base.isNullOrUndefined(this.checkDateValue(value)) || !sf.base.isNullOrUndefined(this.activeIndex)) {
            if (event.action === 'home') {
                var index = this.validLiElement(0);
                if (!this.isBlazorServer) {
                    timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                }
                this.activeIndex = index;
            }
            else if (event.action === 'end') {
                var index = this.validLiElement(collections.length - 1, true);
                if (!this.isBlazorServer) {
                    timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                }
                this.activeIndex = index;
            }
            else {
                if (event.action === 'down') {
                    for (var i = 0; i < count; i++) {
                        if (this.isBlazorServer ? (+value < +this.createDateObj(this.blazorTimeCollections[i])) :
                            (+value < this.timeCollections[i])) {
                            var index = this.validLiElement(i);
                            if (!this.isBlazorServer) {
                                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            }
                            this.activeIndex = index;
                            break;
                        }
                        else if (i === count - 1) {
                            var index = this.validLiElement(0);
                            if (!this.isBlazorServer) {
                                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            }
                            this.activeIndex = index;
                            break;
                        }
                    }
                }
                else {
                    for (var i = count - 1; i >= 0; i--) {
                        if (this.isBlazorServer ? (+value > +this.createDateObj(this.blazorTimeCollections[i])) :
                            (+value > this.timeCollections[i])) {
                            var index = this.validLiElement(i, true);
                            if (!this.isBlazorServer) {
                                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            }
                            this.activeIndex = index;
                            break;
                        }
                        else if (i === 0) {
                            var index = this.validLiElement(count - 1);
                            if (!this.isBlazorServer) {
                                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            }
                            this.activeIndex = index;
                            break;
                        }
                    }
                }
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            if (this.isBlazorServer) {
                this.inputElement.setAttribute('value', this.selectedElement.getAttribute('data-value'));
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnListItemClick', this.activeIndex, true);
            }
            else {
                this.elementValue(sf.base.isNullOrUndefined(timeVal) ? null : new Date(timeVal));
            }
        }
        else {
            this.selectNextItem(event);
        }
    };
    TimePicker.prototype.selectNextItem = function (event) {
        var index = this.validLiElement(0, event.action === 'down' ? false : true);
        this.activeIndex = index;
        this.selectedElement = this.liCollections[index];
        if (this.isBlazorServer) {
            this.inputElement.setAttribute('value', this.selectedElement.getAttribute('data-value'));
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnListItemClick', index, true);
        }
        else {
            this.elementValue(new Date(this.timeCollections[index]));
        }
    };
    TimePicker.prototype.findNextInBlazor = function (event) {
        var count = sf.base.isNullOrUndefined(this.blazorTimeCollections) ? 0 : this.blazorTimeCollections.length;
        var index = 0;
        var value = this.createDateObj(this.inputElement.value);
        switch (event.action) {
            case 'home':
                this.activeIndex = index;
                break;
            case 'end':
                index = count - 1;
                this.activeIndex = index;
                break;
            case 'down':
                for (var i = 0; i < count; i++) {
                    if (this.isBlazorServer ? (+value < +this.createDateObj(this.blazorTimeCollections[i])) :
                        (+value < this.timeCollections[i])) {
                        var index_1 = this.validLiElement(i);
                        this.activeIndex = index_1;
                        break;
                    }
                    else if (i === count - 1) {
                        var index_2 = this.validLiElement(0);
                        this.activeIndex = index_2;
                        break;
                    }
                }
                break;
            case 'up':
                for (var i = count - 1; i >= 0; i--) {
                    if (this.isBlazorServer ? (+value > +this.createDateObj(this.blazorTimeCollections[i])) :
                        (+value > this.timeCollections[i])) {
                        var index_3 = this.validLiElement(i, true);
                        this.activeIndex = index_3;
                        break;
                    }
                    else if (i === 0) {
                        var index_4 = this.validLiElement(count - 1);
                        this.activeIndex = index_4;
                        break;
                    }
                }
                break;
        }
        // tslint:disable-next-line
        this.interopAdaptor.invokeMethodAsync('OnListItemClick', this.activeIndex, true);
    };
    TimePicker.prototype.elementValue = function (value) {
        if (!sf.base.isNullOrUndefined(this.checkDateValue(value))) {
            this.checkValue(value);
        }
    };
    TimePicker.prototype.validLiElement = function (index, backward) {
        var elementIndex = null;
        if (this.isBlazorServer && sf.base.isNullOrUndefined(this.popupWrapper)) {
            var items = this.blazorTimeCollections;
            if (items.length) {
                if (backward) {
                    for (var i = index; i >= 0; i--) {
                        elementIndex = i;
                        break;
                    }
                }
                else {
                    for (var i = index; i <= items.length - 1; i++) {
                        elementIndex = i;
                        break;
                    }
                }
            }
        }
        else {
            var items = sf.base.isNullOrUndefined(this.popupWrapper) ? this.liCollections :
                this.popupWrapper.querySelectorAll('.' + LISTCLASS);
            var isCheck = true;
            if (items.length) {
                if (backward) {
                    for (var i = index; i >= 0; i--) {
                        if (!items[i].classList.contains(DISABLED)) {
                            elementIndex = i;
                            break;
                        }
                        else if (i === 0) {
                            if (isCheck) {
                                index = i = items.length;
                                isCheck = false;
                            }
                        }
                    }
                }
                else {
                    for (var i = index; i <= items.length - 1; i++) {
                        if (!items[i].classList.contains(DISABLED)) {
                            elementIndex = i;
                            break;
                        }
                        else if (i === items.length - 1) {
                            if (isCheck) {
                                index = i = -1;
                                isCheck = false;
                            }
                        }
                    }
                }
            }
        }
        return elementIndex;
    };
    TimePicker.prototype.keyHandler = function (event) {
        if (sf.base.isNullOrUndefined(this.step) || this.step <= 0 || this.inputWrapper.buttons[0].classList.contains(DISABLED)) {
            return;
        }
        var count = this.isBlazorServer ? (sf.base.isNullOrUndefined(this.blazorTimeCollections) ? 0 :
            this.blazorTimeCollections.length) : this.timeCollections.length;
        if (sf.base.isNullOrUndefined(this.getActiveElement()) || this.getActiveElement().length === 0) {
            if (sf.base.isNullOrUndefined(this.popupObj) && this.isBlazorServer) {
                if (sf.base.isNullOrUndefined(this.activeIndex)) {
                    var index = this.validLiElement(0, event.action === 'down' ? false : true);
                    this.activeIndex = index;
                    // tslint:disable-next-line
                    this.interopAdaptor.invokeMethodAsync('OnListItemClick', index, true);
                }
                else {
                    this.findNextInBlazor(event);
                }
            }
            else {
                if (this.liCollections.length > 0) {
                    if (this.isBlazorServer ? (sf.base.isNullOrUndefined(this.activeIndex)) : (sf.base.isNullOrUndefined(this.value) &&
                        sf.base.isNullOrUndefined(this.activeIndex))) {
                        this.selectNextItem(event);
                    }
                    else {
                        this.findNextElement(event);
                    }
                }
                else {
                    this.findNextElement(event);
                }
            }
        }
        else {
            var nextItem = void 0;
            if ((event.keyCode >= 37) && (event.keyCode <= 40)) {
                var index = (event.keyCode === 40 || event.keyCode === 39) ? ++this.activeIndex : --this.activeIndex;
                this.activeIndex = index = this.activeIndex === (count) ? 0 : this.activeIndex;
                this.activeIndex = index = this.activeIndex < 0 ? (count - 1) : this.activeIndex;
                this.activeIndex = index = this.validLiElement(this.activeIndex, (event.keyCode === 40 || event.keyCode === 39) ?
                    false : true);
                if (!this.isBlazorServer) {
                    nextItem = sf.base.isNullOrUndefined(this.timeCollections[index]) ? this.timeCollections[0] : this.timeCollections[index];
                }
            }
            else if (event.action === 'home') {
                var index = this.validLiElement(0);
                this.activeIndex = index;
                if (!this.isBlazorServer) {
                    nextItem = this.timeCollections[index];
                }
            }
            else if (event.action === 'end') {
                var index = this.validLiElement(count - 1, true);
                this.activeIndex = index;
                if (!this.isBlazorServer) {
                    nextItem = this.timeCollections[index];
                }
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            if (this.isBlazorServer) {
                this.inputElement.setAttribute('value', this.selectedElement.getAttribute('data-value'));
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnListItemClick', this.activeIndex, true);
            }
            else {
                this.elementValue(new Date(nextItem));
            }
        }
        this.isNavigate = true;
        this.setHover(this.selectedElement, NAVIGATION);
        this.setActiveDescendant();
        if (!this.isBlazorServer) {
            this.selectInputText();
        }
        if (this.isPopupOpen() && this.selectedElement !== null && (!event || event.type !== 'click')) {
            this.setScrollPosition();
        }
    };
    TimePicker.prototype.getCultureTimeObject = function (ld, c) {
        return sf.base.isBlazor() ? (sf.base.getValue('t', sf.base.getValue(c, sf.base.blazorCultureFormats))).replace(/tt/, 'a') :
            sf.base.getValue('main.' + c + '.dates.calendars.gregorian.timeFormats.short', ld);
    };
    TimePicker.prototype.getCultureDateObject = function (ld, c) {
        return sf.base.isBlazor() ? (sf.base.getValue('d', sf.base.getValue(c, sf.base.blazorCultureFormats))) :
            sf.base.getValue('main.' + c + '.dates.calendars.gregorian.dateFormats.short', ld);
    };
    TimePicker.prototype.wireListEvents = function () {
        sf.base.EventHandler.add(this.listWrapper, 'click', this.onMouseClick, this);
        if (!sf.base.Browser.isDevice) {
            sf.base.EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
            sf.base.EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
        }
    };
    TimePicker.prototype.unWireListEvents = function () {
        if (this.listWrapper) {
            sf.base.EventHandler.remove(this.listWrapper, 'click', this.onMouseClick);
            if (!sf.base.Browser.isDevice) {
                sf.base.EventHandler.remove(this.listWrapper, 'mouseover', this.onMouseOver);
                sf.base.EventHandler.remove(this.listWrapper, 'mouseout', this.onMouseLeave);
            }
        }
    };
    TimePicker.prototype.valueProcess = function (event, value) {
        var result = (sf.base.isNullOrUndefined(this.checkDateValue(value))) ? null : value;
        if (+this.prevDate !== +result) {
            this.initValue = result;
            this.changeEvent(event);
        }
    };
    TimePicker.prototype.changeEvent = function (e) {
        this.addSelection();
        this.updateInput(true, this.initValue);
        var eventArgs = {
            event: (e || null),
            value: this.value,
            text: (this.inputElement).value,
            isInteracted: !sf.base.isNullOrUndefined(e),
            element: this.element
        };
        eventArgs.value = this.valueWithMinutes || this.getDateObject(this.inputElement.value);
        this.prevDate = this.valueWithMinutes || this.getDateObject(this.inputElement.value);
        if (this.isAngular && this.preventChange) {
            this.preventChange = false;
        }
        else {
            this.trigger('change', eventArgs);
        }
        this.invalidValueString = null;
        this.checkErrorState(this.value);
    };
    TimePicker.prototype.updateInput = function (isUpdate, date) {
        if (isUpdate) {
            this.prevValue = this.getValue(date);
        }
        this.prevDate = this.valueWithMinutes = date;
        if ((typeof date !== 'number') || (this.value && +new Date(+this.value).setMilliseconds(0)) !== +date) {
            this.setProperties({ value: date }, true);
        }
        if (!this.strictMode && sf.base.isNullOrUndefined(this.value) && this.invalidValueString) {
            this.checkErrorState(this.invalidValueString);
            this.updateInputValue(this.invalidValueString);
        }
        this.clearIconState();
    };
    TimePicker.prototype.setActiveDescendant = function () {
        if (!sf.base.isNullOrUndefined(this.selectedElement)) {
            sf.base.attributes(this.inputElement, { 'aria-activedescendant': this.selectedElement.getAttribute('id') });
        }
        else {
            sf.base.attributes(this.inputElement, { 'aria-activedescendant': 'null' });
        }
    };
    TimePicker.prototype.removeSelection = function () {
        this.removeHover(HOVER);
        if (!sf.base.isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + SELECTED);
            if (items.length) {
                sf.base.removeClass(items, SELECTED);
                items[0].removeAttribute('aria-selected');
            }
        }
    };
    TimePicker.prototype.removeHover = function (className) {
        var hoveredItem = this.getHoverItem(className);
        if (hoveredItem && hoveredItem.length) {
            sf.base.removeClass(hoveredItem, className);
            if (className === NAVIGATION) {
                hoveredItem[0].removeAttribute('aria-selected');
            }
        }
    };
    TimePicker.prototype.getHoverItem = function (className) {
        var hoveredItem;
        if (!sf.base.isNullOrUndefined(this.popupWrapper)) {
            hoveredItem = this.popupWrapper.querySelectorAll('.' + className);
        }
        return hoveredItem;
    };
    TimePicker.prototype.setActiveClass = function () {
        if (!sf.base.isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                for (var i = 0; i < items.length; i++) {
                    if ((!this.isBlazorServer && this.timeCollections[i] === +this.getDateObject(this.valueWithMinutes))
                        || (this.isBlazorServer && this.blazorTimeCollections[i] === this.blazorTimeCollections[this.activeIndex])) {
                        items[i].setAttribute('aria-selected', 'true');
                        this.selectedElement = items[i];
                        this.activeIndex = i;
                        break;
                    }
                }
            }
        }
    };
    TimePicker.prototype.addSelection = function () {
        this.selectedElement = null;
        this.removeSelection();
        this.setActiveClass();
        if (!sf.base.isNullOrUndefined(this.selectedElement)) {
            sf.base.addClass([this.selectedElement], SELECTED);
            this.selectedElement.setAttribute('aria-selected', 'true');
        }
    };
    TimePicker.prototype.isValidLI = function (li) {
        return (li && li.classList.contains(LISTCLASS) && !li.classList.contains(DISABLED));
    };
    TimePicker.prototype.createDateObj = function (val) {
        var formatStr = sf.base.isBlazor() ?
            // tslint:disable-next-line
            'M' + sf.base.getDefaultDateObject().dateSeperator + 'd' + sf.base.getDefaultDateObject().dateSeperator + 'yy'
            : null;
        var today = this.globalize.formatDate(new Date(), { format: formatStr, skeleton: 'short', type: 'date' });
        var value = null;
        if (typeof val === 'string') {
            if (val.toUpperCase().indexOf('AM') > -1 || val.toUpperCase().indexOf('PM') > -1) {
                today = this.defaultCulture.formatDate(new Date(), { format: formatStr, skeleton: 'short', type: 'date' });
                value = isNaN(+new Date(today + ' ' + val)) ? null : new Date(new Date(today + ' ' + val).setMilliseconds(0));
                if (sf.base.isNullOrUndefined(value)) {
                    value = this.TimeParse(today, val);
                }
            }
            else {
                value = this.TimeParse(today, val);
            }
        }
        else if (val instanceof Date) {
            value = val;
        }
        return value;
    };
    TimePicker.prototype.TimeParse = function (today, val) {
        var value;
        value = this.globalize.parseDate(today + ' ' + val, {
            format: this.cldrDateFormat() + ' ' + this.cldrTimeFormat(), type: 'datetime'
        });
        value = sf.base.isNullOrUndefined(value) ? this.globalize.parseDate(today + ' ' + val, {
            format: this.cldrDateFormat() + ' ' + this.dateToNumeric(), type: 'datetime'
        }) : value;
        value = sf.base.isNullOrUndefined(value) ? value : new Date(value.setMilliseconds(0));
        return value;
    };
    TimePicker.prototype.createListItems = function () {
        var _this = this;
        this.listWrapper = this.createElement('div', { className: CONTENT, attrs: { 'tabindex': '0' } });
        var start;
        var end;
        var interval = this.step * 60000;
        var listItems = [];
        this.timeCollections = [];
        this.disableItemCollection = [];
        start = +(this.getDateObject(this.initMin).setMilliseconds(0));
        end = +(this.getDateObject(this.initMax).setMilliseconds(0));
        while (end >= start) {
            this.timeCollections.push(start);
            listItems.push(this.globalize.formatDate(new Date(start), { format: this.cldrTimeFormat(), type: 'time' }));
            start += interval;
        }
        var listBaseOptions = {
            itemCreated: function (args) {
                var eventArgs = {
                    element: args.item,
                    text: args.text, value: _this.getDateObject(args.text), isDisabled: false
                };
                _this.trigger('itemRender', eventArgs, function (eventArgs) {
                    if (eventArgs.isDisabled) {
                        eventArgs.element.classList.add(DISABLED);
                    }
                    if (eventArgs.element.classList.contains(DISABLED)) {
                        _this.disableItemCollection.push(eventArgs.element.getAttribute('data-value'));
                    }
                });
            }
        };
        this.listTag = sf.lists.ListBase.createList(this.createElement, listItems, listBaseOptions, true);
        sf.base.attributes(this.listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
        sf.base.append([this.listTag], this.listWrapper);
    };
    TimePicker.prototype.documentClickHandler = function (event) {
        var target = event.target;
        if ((!sf.base.isNullOrUndefined(this.popupObj) && (this.inputWrapper.container.contains(target) ||
            (this.popupObj.element && this.popupObj.element.contains(target)))) && event.type !== 'touchstart') {
            event.preventDefault();
        }
        if (!(sf.base.closest(target, '[id="' + this.popupObj.element.id + '"]')) && target !== this.inputElement
            && target !== (this.inputWrapper && this.inputWrapper.buttons[0]) &&
            target !== (this.inputWrapper && this.inputWrapper.clearButton) &&
            target !== (this.inputWrapper && this.inputWrapper.container)) {
            if (this.isPopupOpen()) {
                this.hide();
                this.focusOut();
            }
        }
        else if (target !== this.inputElement) {
            if (!sf.base.Browser.isDevice) {
                this.isPreventBlur = (sf.base.Browser.isIE || sf.base.Browser.info.name === 'edge') && (document.activeElement === this.inputElement)
                    && (target === this.popupWrapper);
            }
        }
    };
    TimePicker.prototype.setEnableRtl = function () {
        sf.inputs.Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
        if (this.popupObj) {
            this.popupObj.enableRtl = this.enableRtl;
            this.popupObj.dataBind();
        }
    };
    TimePicker.prototype.setEnable = function () {
        sf.inputs.Input.setEnabled(this.enabled, this.inputElement, this.floatLabelType);
        if (this.enabled) {
            sf.base.removeClass([this.inputWrapper.container], DISABLED);
            sf.base.attributes(this.inputElement, { 'aria-disabled': 'false' });
            this.inputElement.setAttribute('tabindex', this.tabIndex);
        }
        else {
            this.hide();
            sf.base.addClass([this.inputWrapper.container], DISABLED);
            sf.base.attributes(this.inputElement, { 'aria-disabled': 'true' });
            this.inputElement.tabIndex = -1;
        }
    };
    TimePicker.prototype.getProperty = function (date, val) {
        if (val === 'min') {
            this.initMin = this.checkDateValue(new Date(this.checkInValue(date.min)));
            this.setProperties({ min: this.initMin }, true);
        }
        else {
            this.initMax = this.checkDateValue(new Date(this.checkInValue(date.max)));
            this.setProperties({ max: this.initMax }, true);
        }
        if (this.inputElement.value === '') {
            this.validateMinMax(this.value, this.min, this.max);
        }
        else {
            this.checkValue(this.inputElement.value);
        }
        this.checkValueChange(null, false);
    };
    TimePicker.prototype.inputBlurHandler = function (e) {
        // IE popup closing issue when click over the scrollbar
        if (this.isPreventBlur && this.isPopupOpen()) {
            this.inputElement.focus();
            return;
        }
        this.closePopup(0, e);
        sf.base.removeClass([this.inputWrapper.container], [FOCUS]);
        var blurArguments = {
            model: this.isBlazorServer ? null : this,
        };
        this.trigger('blur', blurArguments);
        if (!this.isBlazorServer && this.getText() !== this.inputElement.value) {
            this.updateValue((this.inputElement).value, e);
        }
        else if (this.inputElement.value.trim().length === 0) {
            this.resetState();
        }
        if (this.isBlazorServer) {
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnStrictMode', this.inputElement.value);
        }
        this.cursorDetails = null;
        this.isNavigate = false;
        if (this.inputElement.value === '') {
            this.invalidValueString = null;
        }
    };
    /**
     * Focuses out the TimePicker textbox element.
     * @returns void
     */
    TimePicker.prototype.focusOut = function () {
        if (document.activeElement === this.inputElement) {
            this.inputElement.blur();
            sf.base.removeClass([this.inputWrapper.container], [FOCUS]);
            var blurArguments = {
                model: this.isBlazorServer ? null : this
            };
            this.trigger('blur', blurArguments);
        }
    };
    TimePicker.prototype.isPopupOpen = function () {
        if (this.popupWrapper && this.popupWrapper.classList.contains('' + ROOT)) {
            return true;
        }
        return false;
    };
    TimePicker.prototype.inputFocusHandler = function () {
        var focusArguments = {
            model: this.isBlazorServer ? null : this
        };
        if (!this.readonly && !sf.base.Browser.isDevice) {
            this.selectInputText();
        }
        this.trigger('focus', focusArguments);
        this.clearIconState();
        if (this.openOnFocus) {
            this.show();
        }
    };
    /**
     * Focused the TimePicker textbox element.
     * @returns void
     */
    TimePicker.prototype.focusIn = function () {
        if (document.activeElement !== this.inputElement && this.enabled) {
            this.inputElement.focus();
            
        }
    };
    /**
     * Hides the TimePicker popup.
     * @returns void
     * @deprecated
     */
    TimePicker.prototype.hide = function () {
        this.closePopup(100, null);
        this.clearIconState();
    };
    /**
     * Opens the popup to show the list items.
     * @returns void
     * @deprecated
     */
    TimePicker.prototype.show = function (event) {
        var _this = this;
        if ((this.enabled && this.readonly) || !this.enabled || this.popupWrapper) {
            return;
        }
        else {
            this.popupCreation();
            if (sf.base.Browser.isDevice && this.listWrapper) {
                this.modal = this.createElement('div');
                this.modal.className = '' + ROOT + ' e-time-modal';
                document.body.className += ' ' + OVERFLOW;
                document.body.appendChild(this.modal);
            }
            if (sf.base.Browser.isDevice) {
                this.mobileTimePopupWrap = this.createElement('div', { className: 'e-timepicker-mob-popup-wrap' });
                document.body.appendChild(this.mobileTimePopupWrap);
            }
            this.openPopupEventArgs = {
                popup: this.isBlazorServer ? null : (this.popupObj || null),
                cancel: false,
                event: event || null,
                name: 'open',
                appendTo: sf.base.Browser.isDevice ? this.mobileTimePopupWrap : document.body
            };
            var eventArgs = this.openPopupEventArgs;
            this.trigger('open', eventArgs, function (eventArgs) {
                if ((sf.base.isBlazor() && _this.isServerRendered)) {
                    eventArgs.popup = _this.popupObj || null;
                }
                _this.openPopupEventArgs = eventArgs;
                if (!_this.openPopupEventArgs.cancel && !_this.inputWrapper.buttons[0].classList.contains(DISABLED)) {
                    if (_this.isBlazorServer) {
                        _this.popupWrapper.style.visibility = '';
                        _this.popupWrapper.style.width = _this.inputWrapper.container.offsetWidth + 'px';
                        _this.popupWrapper.style.height = 'auto';
                    }
                    if (_this.isBlazorServer) {
                        _this.openPopupEventArgs.popup = _this.popupObj;
                    }
                    _this.openPopupEventArgs.appendTo.appendChild(_this.popupWrapper);
                    _this.popupAlignment(_this.openPopupEventArgs);
                    _this.setScrollPosition();
                    if (!sf.base.Browser.isDevice) {
                        _this.inputElement.focus();
                    }
                    var openAnimation = {
                        name: 'FadeIn',
                        duration: ANIMATIONDURATION,
                    };
                    _this.popupObj.refreshPosition(_this.anchor);
                    if (_this.zIndex === 1000) {
                        _this.popupObj.show(new sf.base.Animation(openAnimation), _this.element);
                    }
                    else {
                        _this.popupObj.show(new sf.base.Animation(openAnimation), null);
                    }
                    _this.setActiveDescendant();
                    sf.base.attributes(_this.inputElement, { 'aria-expanded': 'true' });
                    sf.base.addClass([_this.inputWrapper.container], FOCUS);
                    sf.base.EventHandler.add(document, 'mousedown touchstart', _this.documentClickHandler, _this);
                    _this.setOverlayIndex(_this.mobileTimePopupWrap, _this.popupObj.element, _this.modal, sf.base.Browser.isDevice);
                }
                else {
                    _this.popupObj.destroy();
                    if (_this.isBlazorServer) {
                        _this.disposeServerPopup();
                        // tslint:disable
                        _this.inputWrapper.container.parentElement.insertBefore(_this.popupWrapper, _this.inputWrapper.container.nextElementSibling);
                        _this.interopAdaptor.invokeMethodAsync('OnPopupHide', false);
                        // tslint:enable
                    }
                    _this.popupWrapper = _this.listTag = undefined;
                    _this.liCollections = _this.timeCollections = _this.disableItemCollection = [];
                    _this.popupObj = null;
                }
            });
        }
    };
    TimePicker.prototype.setOverlayIndex = function (popupWrapper, timePopupElement, modal, isDevice) {
        if (isDevice && !sf.base.isNullOrUndefined(timePopupElement) && !sf.base.isNullOrUndefined(modal) && !sf.base.isNullOrUndefined(popupWrapper)) {
            var index = parseInt(timePopupElement.style.zIndex, 10) ? parseInt(timePopupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupWrapper.style.zIndex = index.toString();
        }
    };
    TimePicker.prototype.formatValues = function (type) {
        var value;
        if (typeof type === 'number') {
            value = sf.base.formatUnit(type);
        }
        else if (typeof type === 'string') {
            value = (type.match(/px|%|em/)) ? type : isNaN(parseInt(type, 10)) ? type : sf.base.formatUnit(type);
        }
        return value;
    };
    TimePicker.prototype.popupAlignment = function (args) {
        args.popup.position.X = this.formatValues(args.popup.position.X);
        args.popup.position.Y = this.formatValues(args.popup.position.Y);
        if (!isNaN(parseFloat(args.popup.position.X)) || !isNaN(parseFloat(args.popup.position.Y))) {
            this.popupObj.relateTo = this.anchor = document.body;
            this.popupObj.targetType = 'container';
        }
        if (!isNaN(parseFloat(args.popup.position.X))) {
            this.popupObj.offsetX = parseFloat(args.popup.position.X);
        }
        if (!isNaN(parseFloat(args.popup.position.Y))) {
            this.popupObj.offsetY = parseFloat(args.popup.position.Y);
        }
        if (!sf.base.Browser.isDevice) {
            switch (args.popup.position.X) {
                case 'left':
                    break;
                case 'right':
                    args.popup.offsetX = this.containerStyle.width;
                    break;
                case 'center':
                    args.popup.offsetX = -(this.containerStyle.width / 2);
                    break;
            }
            switch (args.popup.position.Y) {
                case 'top':
                    break;
                case 'bottom':
                    break;
                case 'center':
                    args.popup.offsetY = -(this.containerStyle.height / 2);
                    break;
            }
            if (args.popup.position.X === 'center' && args.popup.position.Y === 'center') {
                this.popupObj.relateTo = this.inputWrapper.container;
                this.anchor = this.inputElement;
                this.popupObj.targetType = 'relative';
            }
        }
        else {
            if (args.popup.position.X === 'center' && args.popup.position.Y === 'center') {
                this.popupObj.relateTo = this.anchor = document.body;
                this.popupObj.offsetY = 0;
                this.popupObj.targetType = 'container';
                this.popupObj.collision = { X: 'fit', Y: 'fit' };
            }
        }
    };
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    TimePicker.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * To get component name
     * @private
     */
    TimePicker.prototype.getModuleName = function () {
        return 'timepicker';
    };
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    TimePicker.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'placeholder':
                    sf.inputs.Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.inputElement.setAttribute('aria-placeholder', newProp.placeholder);
                    break;
                case 'readonly':
                    sf.inputs.Input.setReadonly(this.readonly, this.inputElement, this.floatLabelType);
                    if (this.readonly) {
                        this.hide();
                    }
                    this.setTimeAllowEdit();
                    break;
                case 'enabled':
                    this.setProperties({ enabled: newProp.enabled }, true);
                    this.setEnable();
                    break;
                case 'allowEdit':
                    this.setTimeAllowEdit();
                    break;
                case 'enableRtl':
                    if (!this.isBlazorServer) {
                        this.setProperties({ enableRtl: newProp.enableRtl }, true);
                        this.setEnableRtl();
                    }
                    break;
                case 'cssClass':
                    this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    this.setZIndex();
                    break;
                case 'htmlAttributes':
                    this.updateHtmlAttributeToElement();
                    this.updateHtmlAttributeToWrapper();
                    this.checkAttributes(true);
                    break;
                case 'min':
                case 'max':
                    if (!this.isBlazorServer) {
                        this.getProperty(newProp, prop);
                    }
                    break;
                case 'showClearButton':
                    sf.inputs.Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'locale':
                    this.setProperties({ locale: newProp.locale }, true);
                    this.globalize = new sf.base.Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.updatePlaceHolder();
                    if (!this.isBlazorServer) {
                        this.setValue(this.value);
                    }
                    break;
                case 'width':
                    sf.base.setStyleAttribute(this.inputWrapper.container, { 'width': this.setWidth(newProp.width) });
                    this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.checkTimeFormat();
                    if (!this.isBlazorServer) {
                        this.setValue(this.value);
                    }
                    break;
                case 'value':
                    if (!this.isBlazorServer) {
                        this.invalidValueString = null;
                        this.checkInvalidValue(newProp.value);
                        newProp.value = this.value;
                        if (!this.invalidValueString) {
                            if (typeof newProp.value === 'string') {
                                this.setProperties({ value: this.checkDateValue(new Date(newProp.value)) }, true);
                                newProp.value = this.value;
                            }
                            else {
                                if ((newProp.value && +new Date(+newProp.value).setMilliseconds(0)) !== +this.value) {
                                    newProp.value = this.checkDateValue(new Date('' + newProp.value));
                                }
                            }
                            this.initValue = newProp.value;
                            newProp.value = this.compareFormatChange(this.checkValue(newProp.value));
                        }
                        else {
                            this.updateInputValue(this.invalidValueString);
                            this.checkErrorState(this.invalidValueString);
                        }
                        this.checkValueChange(null, false);
                        if (this.isAngular && this.preventChange) {
                            this.preventChange = false;
                        }
                    }
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    sf.inputs.Input.removeFloating(this.inputWrapper);
                    sf.inputs.Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                case 'strictMode':
                    if (!this.isBlazorServer) {
                        this.invalidValueString = null;
                        if (newProp.strictMode) {
                            this.checkErrorState(null);
                        }
                        this.setProperties({ strictMode: newProp.strictMode }, true);
                        this.checkValue((this.inputElement).value);
                        this.checkValueChange(null, false);
                    }
                    break;
                case 'scrollTo':
                    if (!this.isBlazorServer) {
                        if (this.checkDateValue(new Date(this.checkInValue(newProp.scrollTo)))) {
                            if (this.popupWrapper) {
                                this.setScrollTo();
                            }
                            this.setProperties({ scrollTo: this.checkDateValue(new Date(this.checkInValue(newProp.scrollTo))) }, true);
                        }
                        else {
                            this.setProperties({ scrollTo: null }, true);
                        }
                    }
                    else {
                        if (this.popupWrapper) {
                            this.setScrollTo();
                        }
                    }
                    break;
            }
        }
    };
    TimePicker.prototype.checkInValue = function (inValue) {
        if (inValue instanceof Date) {
            return (inValue.toUTCString());
        }
        else {
            return ('' + inValue);
        }
    };
    __decorate([
        sf.base.Property(null)
    ], TimePicker.prototype, "width", void 0);
    __decorate([
        sf.base.Property(null)
    ], TimePicker.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], TimePicker.prototype, "strictMode", void 0);
    __decorate([
        sf.base.Property(null)
    ], TimePicker.prototype, "keyConfigs", void 0);
    __decorate([
        sf.base.Property(null)
    ], TimePicker.prototype, "format", void 0);
    __decorate([
        sf.base.Property(true)
    ], TimePicker.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property(false)
    ], TimePicker.prototype, "readonly", void 0);
    __decorate([
        sf.base.Property({})
    ], TimePicker.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property('Never')
    ], TimePicker.prototype, "floatLabelType", void 0);
    __decorate([
        sf.base.Property(null)
    ], TimePicker.prototype, "placeholder", void 0);
    __decorate([
        sf.base.Property(1000)
    ], TimePicker.prototype, "zIndex", void 0);
    __decorate([
        sf.base.Property(false)
    ], TimePicker.prototype, "enablePersistence", void 0);
    __decorate([
        sf.base.Property(true)
    ], TimePicker.prototype, "showClearButton", void 0);
    __decorate([
        sf.base.Property(30)
    ], TimePicker.prototype, "step", void 0);
    __decorate([
        sf.base.Property(null)
    ], TimePicker.prototype, "scrollTo", void 0);
    __decorate([
        sf.base.Property(null)
    ], TimePicker.prototype, "value", void 0);
    __decorate([
        sf.base.Property(null)
    ], TimePicker.prototype, "min", void 0);
    __decorate([
        sf.base.Property(null)
    ], TimePicker.prototype, "max", void 0);
    __decorate([
        sf.base.Property(true)
    ], TimePicker.prototype, "allowEdit", void 0);
    __decorate([
        sf.base.Property(false)
    ], TimePicker.prototype, "openOnFocus", void 0);
    __decorate([
        sf.base.Event()
    ], TimePicker.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], TimePicker.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], TimePicker.prototype, "destroyed", void 0);
    __decorate([
        sf.base.Event()
    ], TimePicker.prototype, "open", void 0);
    __decorate([
        sf.base.Event()
    ], TimePicker.prototype, "itemRender", void 0);
    __decorate([
        sf.base.Event()
    ], TimePicker.prototype, "close", void 0);
    __decorate([
        sf.base.Event()
    ], TimePicker.prototype, "cleared", void 0);
    __decorate([
        sf.base.Event()
    ], TimePicker.prototype, "blur", void 0);
    __decorate([
        sf.base.Event()
    ], TimePicker.prototype, "focus", void 0);
    TimePicker = __decorate([
        sf.base.NotifyPropertyChanges
    ], TimePicker);
    return TimePicker;
}(sf.base.Component));

/**
 * TimePicker modules
 */

exports.TimePicker = TimePicker;

return exports;

});

    sf.calendars = sf.base.extend({}, sf.calendars, sftimepicker({}));