window.sf = window.sf || {};
var sfdatetimepicker = (function (exports) {
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
///<reference path='../datepicker/datepicker-model.d.ts'/>
//class constant defination
var DATEWRAPPER = 'e-date-wrapper';
var DATEPICKERROOT = 'e-datepicker';
var DATETIMEWRAPPER = 'e-datetime-wrapper';
var DAY = new Date().getDate();
var MONTH = new Date().getMonth();
var YEAR = new Date().getFullYear();
var HOUR = new Date().getHours();
var MINUTE = new Date().getMinutes();
var SECOND = new Date().getSeconds();
var MILLISECOND = new Date().getMilliseconds();
var ROOT = 'e-datetimepicker';
var DATETIMEPOPUPWRAPPER = 'e-datetimepopup-wrapper';
var INPUTWRAPPER = 'e-input-group-icon';
var POPUP = 'e-popup';
var TIMEICON = 'e-time-icon';
var INPUTFOCUS = 'e-input-focus';
var POPUPDIMENSION = '250px';
var ICONANIMATION = 'e-icon-anim';
var DISABLED = 'e-disabled';
var ERROR = 'e-error';
var CONTENT = 'e-content';
var NAVIGATION = 'e-navigation';
var ACTIVE = 'e-active';
var HOVER = 'e-hover';
var ICONS = 'e-icons';
var HALFPOSITION = 2;
var LISTCLASS = 'e-list-item';
var ANIMATIONDURATION = 100;
var OVERFLOW = 'e-time-overflow';
/**
 * Represents the DateTimePicker component that allows user to select
 * or enter a date time value.
 * ```html
 * <input id="dateTimePicker"/>
 * ```
 * ```typescript
 * <script>
 *   let dateTimePickerObject:DateTimePicker = new DateTimePicker({ value: new Date() });
 *   dateTimePickerObject.appendTo("#dateTimePicker");
 * </script>
 * ```
 */
var DateTimePicker = /** @class */ (function (_super) {
    __extends(DateTimePicker, _super);
    /**
     * Constructor for creating the widget
     */
    function DateTimePicker(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.valueWithMinutes = null;
        _this.dateTimeOptions = options;
        return _this;
    }
    DateTimePicker.prototype.focusHandler = function () {
        sf.base.addClass([this.inputWrapper.container], INPUTFOCUS);
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    DateTimePicker.prototype.focusIn = function () {
        _super.prototype.focusIn.call(this);
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    DateTimePicker.prototype.focusOut = function () {
        if (document.activeElement === this.inputElement) {
            this.inputElement.blur();
            sf.base.removeClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
    };
    DateTimePicker.prototype.blurHandler = function (e) {
        // IE popup closing issue when click over the scrollbar
        if (this.isTimePopupOpen() && this.isPreventBlur) {
            this.inputElement.focus();
            return;
        }
        sf.base.removeClass([this.inputWrapper.container], INPUTFOCUS);
        var blurArguments = {
            model: (sf.base.isBlazor() && this.isServerRendered) ? null : this
        };
        if (this.isTimePopupOpen()) {
            this.hide(e);
        }
        this.trigger('blur', blurArguments);
    };
    /**
     * To destroy the widget.
     * @returns void
     */
    DateTimePicker.prototype.destroy = function () {
        if (this.popupObject && this.popupObject.element.classList.contains(POPUP)) {
            this.popupObject.destroy();
            sf.base.detach(this.dateTimeWrapper);
            this.dateTimeWrapper = undefined;
            this.liCollections = this.timeCollections = [];
            if (!sf.base.isNullOrUndefined(this.rippleFn)) {
                this.rippleFn();
            }
        }
        var ariaAttribute = {
            'aria-live': 'assertive', 'aria-atomic': 'true', 'aria-invalid': 'false',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off'
        };
        if (this.inputElement) {
            sf.inputs.Input.removeAttributes(ariaAttribute, this.inputElement);
            this.inputElement.removeAttribute('aria-placeholder');
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) {
                sf.base.detach(this.popupWrapper);
            }
            this.popupObject = this.popupWrapper = null;
            this.keyboardHandler.destroy();
        }
        this.unBindInputEvents();
        _super.prototype.destroy.call(this);
    };
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    DateTimePicker.prototype.render = function () {
        this.timekeyConfigure = {
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
        this.valueWithMinutes = null;
        this.previousDateTime = null;
        this.isPreventBlur = false;
        this.cloneElement = this.element.cloneNode(true);
        this.dateTimeFormat = this.cldrDateTimeFormat();
        this.initValue = this.value;
        _super.prototype.updateHtmlAttributeToElement.call(this);
        this.checkAttributes(false);
        var localeText = { placeholder: this.placeholder };
        this.l10n = new sf.base.L10n('datetimepicker', localeText, this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        _super.prototype.render.call(this);
        this.createInputElement();
        _super.prototype.updateHtmlAttributeToWrapper.call(this);
        this.bindInputEvents();
        this.setValue();
        this.previousDateTime = this.value && new Date(+this.value);
        if (this.element.tagName === 'EJS-DATETIMEPICKER') {
            this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
            this.element.removeAttribute('tabindex');
            if (!this.enabled) {
                this.inputElement.tabIndex = -1;
            }
        }
        this.renderComplete();
    };
    DateTimePicker.prototype.setValue = function () {
        this.initValue = this.validateMinMaxRange(this.value);
        if (!this.strictMode && this.isDateObject(this.initValue)) {
            var value = this.validateMinMaxRange(this.initValue);
            sf.inputs.Input.setValue(this.getFormattedValue(value), this.inputElement, this.floatLabelType, this.showClearButton);
            this.setProperties({ value: value }, true);
        }
        else {
            if (sf.base.isNullOrUndefined(this.value)) {
                this.initValue = null;
                this.setProperties({ value: null }, true);
            }
        }
        this.valueWithMinutes = this.value;
        _super.prototype.updateInput.call(this);
    };
    DateTimePicker.prototype.validateMinMaxRange = function (value) {
        var result = value;
        if (this.isDateObject(value)) {
            result = this.validateValue(value);
        }
        else {
            if (+this.min > +this.max) {
                this.disablePopupButton(true);
            }
        }
        this.checkValidState(result);
        return result;
    };
    DateTimePicker.prototype.checkValidState = function (value) {
        this.isValidState = true;
        if (!this.strictMode) {
            if ((+(value) > +(this.max)) || (+(value) < +(this.min))) {
                this.isValidState = false;
            }
        }
        this.checkErrorState();
    };
    DateTimePicker.prototype.checkErrorState = function () {
        if (this.isValidState) {
            sf.base.removeClass([this.inputWrapper.container], ERROR);
        }
        else {
            sf.base.addClass([this.inputWrapper.container], ERROR);
        }
        sf.base.attributes(this.inputElement, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
    };
    DateTimePicker.prototype.validateValue = function (value) {
        var dateVal = value;
        if (this.strictMode) {
            if (+this.min > +this.max) {
                this.disablePopupButton(true);
                dateVal = this.max;
            }
            else if (+value < +this.min) {
                dateVal = this.min;
            }
            else if (+value > +this.max) {
                dateVal = this.max;
            }
        }
        else {
            if (+this.min > +this.max) {
                this.disablePopupButton(true);
                dateVal = value;
            }
        }
        return dateVal;
    };
    DateTimePicker.prototype.disablePopupButton = function (isDisable) {
        if (isDisable) {
            sf.base.addClass([this.inputWrapper.buttons[0], this.timeIcon], DISABLED);
            this.hide();
        }
        else {
            sf.base.removeClass([this.inputWrapper.buttons[0], this.timeIcon], DISABLED);
        }
    };
    DateTimePicker.prototype.getFormattedValue = function (value) {
        var dateOptions;
        if (!sf.base.isNullOrUndefined(value)) {
            if (this.calendarMode === 'Gregorian') {
                dateOptions = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
            }
            else {
                dateOptions = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
            return this.globalize.formatDate(value, dateOptions);
        }
        else {
            return null;
        }
    };
    DateTimePicker.prototype.isDateObject = function (value) {
        return (!sf.base.isNullOrUndefined(value) && !isNaN(+value)) ? true : false;
    };
    DateTimePicker.prototype.createInputElement = function () {
        sf.base.removeClass([this.inputElement], DATEPICKERROOT);
        sf.base.removeClass([this.inputWrapper.container], DATEWRAPPER);
        sf.base.addClass([this.inputWrapper.container], DATETIMEWRAPPER);
        sf.base.addClass([this.inputElement], ROOT);
        this.renderTimeIcon();
    };
    DateTimePicker.prototype.renderTimeIcon = function () {
        this.timeIcon = sf.inputs.Input.appendSpan(INPUTWRAPPER + ' ' + TIMEICON + ' ' + ICONS, this.inputWrapper.container);
    };
    DateTimePicker.prototype.bindInputEvents = function () {
        sf.base.EventHandler.add(this.timeIcon, 'mousedown', this.timeHandler, this);
        sf.base.EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.dateHandler, this);
        sf.base.EventHandler.add(this.inputElement, 'blur', this.blurHandler, this);
        sf.base.EventHandler.add(this.inputElement, 'focus', this.focusHandler, this);
        this.defaultKeyConfigs = sf.base.extend(this.defaultKeyConfigs, this.keyConfigs);
        this.keyboardHandler = new sf.base.KeyboardEvents(this.inputElement, {
            eventName: 'keydown',
            keyAction: this.inputKeyAction.bind(this),
            keyConfigs: this.defaultKeyConfigs
        });
    };
    DateTimePicker.prototype.unBindInputEvents = function () {
        sf.base.EventHandler.remove(this.timeIcon, 'mousedown touchstart', this.timeHandler);
        sf.base.EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateHandler);
        if (this.inputElement) {
            sf.base.EventHandler.remove(this.inputElement, 'blur', this.blurHandler);
            sf.base.EventHandler.remove(this.inputElement, 'focus', this.focusHandler);
        }
        if (this.keyboardHandler) {
            this.keyboardHandler.destroy();
        }
    };
    DateTimePicker.prototype.cldrTimeFormat = function () {
        var cldrTime;
        if (this.isNullOrEmpty(this.timeFormat)) {
            if (this.locale === 'en' || this.locale === 'en-US') {
                cldrTime = sf.base.isBlazor() ? (sf.base.getValue('t', sf.base.getValue(this.locale, sf.base.blazorCultureFormats))).replace(/tt/, 'a') :
                    (sf.base.getValue('timeFormats.short', sf.base.getDefaultDateObject()));
            }
            else {
                cldrTime = (this.getCultureTimeObject(sf.base.cldrData, '' + this.locale));
            }
        }
        else {
            cldrTime = this.timeFormat;
        }
        return cldrTime;
    };
    DateTimePicker.prototype.cldrDateTimeFormat = function () {
        var cldrTime;
        var culture = new sf.base.Internationalization(this.locale);
        var dateFormat = culture.getDatePattern({ skeleton: sf.base.isBlazor() ? 'd' : 'yMd' });
        if (this.isNullOrEmpty(this.formatString)) {
            cldrTime = dateFormat + ' ' + this.getCldrFormat('time');
        }
        else {
            cldrTime = this.formatString;
        }
        return cldrTime;
    };
    DateTimePicker.prototype.getCldrFormat = function (type) {
        var cldrDateTime;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrDateTime = sf.base.isBlazor() ? (sf.base.getValue('t', sf.base.getValue(this.locale, sf.base.blazorCultureFormats))).replace(/tt/, 'a') :
                (sf.base.getValue('timeFormats.short', sf.base.getDefaultDateObject()));
        }
        else {
            cldrDateTime = (this.getCultureTimeObject(sf.base.cldrData, '' + this.locale));
        }
        return cldrDateTime;
    };
    DateTimePicker.prototype.isNullOrEmpty = function (value) {
        if (sf.base.isNullOrUndefined(value) || (typeof value === 'string' && value.trim() === '')) {
            return true;
        }
        else {
            return false;
        }
    };
    DateTimePicker.prototype.getCultureTimeObject = function (ld, c) {
        if (this.calendarMode === 'Gregorian') {
            return sf.base.isBlazor() ? (sf.base.getValue('t', sf.base.getValue(this.locale, sf.base.blazorCultureFormats))).replace(/tt/, 'a') :
                (sf.base.getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.short', ld));
        }
        else {
            return sf.base.getValue('main.' + '' + this.locale + '.dates.calendars.islamic.timeFormats.short', ld);
        }
    };
    DateTimePicker.prototype.timeHandler = function (e) {
        if (sf.base.Browser.isDevice) {
            this.inputElement.setAttribute('readonly', '');
        }
        if (e.currentTarget === this.timeIcon) {
            e.preventDefault();
        }
        if (this.enabled && !this.readonly) {
            if (this.isDatePopupOpen()) {
                _super.prototype.hide.call(this, e);
            }
            if (this.isTimePopupOpen()) {
                this.closePopup(e);
            }
            else {
                this.inputElement.focus();
                this.popupCreation('time', e);
                sf.base.addClass([this.inputWrapper.container], [INPUTFOCUS]);
            }
        }
    };
    DateTimePicker.prototype.dateHandler = function (e) {
        if (e.currentTarget === this.inputWrapper.buttons[0]) {
            e.preventDefault();
        }
        if (this.enabled && !this.readonly) {
            if (this.isTimePopupOpen()) {
                this.closePopup(e);
            }
            if (!sf.base.isNullOrUndefined(this.popupWrapper)) {
                this.popupCreation('date', e);
            }
        }
    };
    DateTimePicker.prototype.show = function (type, e) {
        if ((this.enabled && this.readonly) || !this.enabled) {
            return;
        }
        else {
            if (type === 'time' && !this.dateTimeWrapper) {
                if (this.isDatePopupOpen()) {
                    this.hide(e);
                }
                this.popupCreation('time', e);
            }
            else if (!this.popupObj) {
                if (this.isTimePopupOpen()) {
                    this.hide(e);
                }
                _super.prototype.show.call(this);
                this.popupCreation('date', e);
            }
        }
    };
    DateTimePicker.prototype.toggle = function (e) {
        if (this.isDatePopupOpen()) {
            _super.prototype.hide.call(this, e);
            this.show('time', null);
        }
        else if (this.isTimePopupOpen()) {
            this.hide(e);
            _super.prototype.show.call(this, null, e);
            this.popupCreation('date', null);
        }
        else {
            this.show(null, e);
        }
    };
    DateTimePicker.prototype.listCreation = function () {
        var dateObject;
        if (this.calendarMode === 'Gregorian') {
            dateObject = this.globalize.parseDate(this.inputElement.value, {
                format: this.cldrDateTimeFormat(), type: 'datetime'
            });
        }
        else {
            dateObject = this.globalize.parseDate(this.inputElement.value, {
                format: this.cldrDateTimeFormat(), type: 'datetime', calendar: 'islamic'
            });
        }
        var value = sf.base.isNullOrUndefined(this.value) ? this.inputElement.value !== '' ?
            dateObject :
            new Date() : this.value;
        this.valueWithMinutes = value;
        this.listWrapper = sf.base.createElement('div', { className: CONTENT, attrs: { 'tabindex': '0' } });
        var min = this.startTime(value);
        var max = this.endTime(value);
        var listDetails = sf.calendars.TimePickerBase.createListItems(this.createElement, min, max, this.globalize, this.cldrTimeFormat(), this.step);
        this.timeCollections = listDetails.collection;
        this.listTag = listDetails.list;
        sf.base.attributes(this.listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
        sf.base.append([listDetails.list], this.listWrapper);
        this.wireTimeListEvents();
        var rippleModel = { duration: 300, selector: '.' + LISTCLASS };
        this.rippleFn = sf.base.rippleEffect(this.listWrapper, rippleModel);
        this.liCollections = this.listWrapper.querySelectorAll('.' + LISTCLASS);
    };
    DateTimePicker.prototype.popupCreation = function (type, e) {
        if (sf.base.Browser.isDevice) {
            this.element.setAttribute('readonly', 'readonly');
        }
        if (type === 'date') {
            if (!this.readonly && this.popupWrapper) {
                sf.base.addClass([this.popupWrapper], DATETIMEPOPUPWRAPPER);
                sf.base.attributes(this.popupWrapper, { 'id': this.element.id + '_datepopup' });
            }
        }
        else {
            if (!this.readonly) {
                this.dateTimeWrapper = sf.base.createElement('div', {
                    className: ROOT + ' ' + POPUP,
                    attrs: { 'id': this.element.id + '_timepopup', 'style': 'visibility:hidden ; display:block' }
                });
                if (!sf.base.isNullOrUndefined(this.cssClass)) {
                    this.dateTimeWrapper.className += ' ' + this.cssClass;
                }
                if (!sf.base.isNullOrUndefined(this.step) && this.step > 0) {
                    this.listCreation();
                    sf.base.append([this.listWrapper], this.dateTimeWrapper);
                }
                document.body.appendChild(this.dateTimeWrapper);
                this.addTimeSelection();
                this.renderPopup();
                this.setTimeScrollPosition();
                this.openPopup(e);
                this.popupObject.refreshPosition(this.inputElement);
            }
        }
    };
    DateTimePicker.prototype.openPopup = function (e) {
        var _this = this;
        this.preventArgs = {
            cancel: false,
            popup: (sf.base.isBlazor() && this.isServerRendered) ? null : this.popupObject,
            event: e || null
        };
        var eventArgs = this.preventArgs;
        this.trigger('open', eventArgs, function (eventArgs) {
            _this.preventArgs = eventArgs;
            if (!_this.preventArgs.cancel && !_this.readonly) {
                var openAnimation = {
                    name: 'FadeIn',
                    duration: ANIMATIONDURATION,
                };
                if (_this.zIndex === 1000) {
                    _this.popupObject.show(new sf.base.Animation(openAnimation), _this.element);
                }
                else {
                    _this.popupObject.show(new sf.base.Animation(openAnimation), null);
                }
                sf.base.addClass([_this.inputWrapper.container], [ICONANIMATION]);
                sf.base.attributes(_this.inputElement, { 'aria-expanded': 'true' });
                sf.base.EventHandler.add(document, 'mousedown touchstart', _this.documentClickHandler, _this);
            }
        });
    };
    DateTimePicker.prototype.documentClickHandler = function (event) {
        var target = event.target;
        if ((!sf.base.isNullOrUndefined(this.popupObject) && (this.inputWrapper.container.contains(target) ||
            (this.popupObject.element && this.popupObject.element.contains(target)))) && event.type !== 'touchstart') {
            event.preventDefault();
        }
        if (!(sf.base.closest(target, '#' + (this.popupObject && this.popupObject.element.id))) && target !== this.inputElement
            && target !== this.timeIcon && target !== this.inputWrapper.container) {
            if (this.isTimePopupOpen()) {
                this.hide(event);
                this.focusOut();
            }
        }
        else if (target !== this.inputElement) {
            if (!sf.base.Browser.isDevice) {
                this.isPreventBlur = ((document.activeElement === this.inputElement) && (sf.base.Browser.isIE || sf.base.Browser.info.name === 'edge')
                    && target === this.popupObject.element);
            }
        }
        if (this.openOnFocus) {
            this.show();
        }
    };
    DateTimePicker.prototype.isTimePopupOpen = function () {
        return (this.dateTimeWrapper && this.dateTimeWrapper.classList.contains('' + ROOT)) ? true : false;
    };
    DateTimePicker.prototype.isDatePopupOpen = function () {
        return (this.popupWrapper && this.popupWrapper.classList.contains('' + DATETIMEPOPUPWRAPPER)) ? true : false;
    };
    DateTimePicker.prototype.renderPopup = function () {
        var _this = this;
        this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
        if (sf.base.Browser.isDevice) {
            this.timeModal = sf.base.createElement('div');
            this.timeModal.className = '' + ROOT + ' e-time-modal';
            document.body.className += ' ' + OVERFLOW;
            this.timeModal.style.display = 'block';
            document.body.appendChild(this.timeModal);
        }
        var offset = 4;
        this.popupObject = new sf.popups.Popup(this.dateTimeWrapper, {
            width: this.setPopupWidth(),
            zIndex: this.zIndex,
            targetType: 'container',
            collision: sf.base.Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            relateTo: sf.base.Browser.isDevice ? document.body : this.inputWrapper.container,
            position: sf.base.Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            enableRtl: this.enableRtl,
            offsetY: offset,
            open: function () {
                _this.dateTimeWrapper.style.visibility = 'visible';
                sf.base.addClass([_this.timeIcon], ACTIVE);
                if (!sf.base.Browser.isDevice) {
                    _this.timekeyConfigure = sf.base.extend(_this.timekeyConfigure, _this.keyConfigs);
                    _this.inputEvent = new sf.base.KeyboardEvents(_this.inputWrapper.container, {
                        keyAction: _this.TimeKeyActionHandle.bind(_this),
                        keyConfigs: _this.timekeyConfigure,
                        eventName: 'keydown'
                    });
                }
            }, close: function () {
                sf.base.removeClass([_this.timeIcon], ACTIVE);
                _this.unWireTimeListEvents();
                _this.inputElement.setAttribute('aria-activedescendant', 'null');
                sf.base.remove(_this.popupObject.element);
                _this.popupObject.destroy();
                _this.dateTimeWrapper.innerHTML = '';
                _this.listWrapper = _this.dateTimeWrapper = undefined;
                if (_this.inputEvent) {
                    _this.inputEvent.destroy();
                }
            }, targetExitViewport: function () {
                if (!sf.base.Browser.isDevice) {
                    _this.hide();
                }
            }
        });
        this.popupObject.element.style.maxHeight = POPUPDIMENSION;
    };
    DateTimePicker.prototype.setDimension = function (width) {
        if (typeof width === 'number') {
            width = sf.base.formatUnit(width);
        }
        else if (typeof width === 'string') {
            width = width;
        }
        else {
            width = '100%';
        }
        return width;
    };
    DateTimePicker.prototype.setPopupWidth = function () {
        var width = this.setDimension(this.width);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    };
    DateTimePicker.prototype.wireTimeListEvents = function () {
        sf.base.EventHandler.add(this.listWrapper, 'click', this.onMouseClick, this);
        if (!sf.base.Browser.isDevice) {
            sf.base.EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
            sf.base.EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
        }
    };
    DateTimePicker.prototype.unWireTimeListEvents = function () {
        if (this.listWrapper) {
            sf.base.EventHandler.remove(this.listWrapper, 'click', this.onMouseClick);
            sf.base.EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
            if (!sf.base.Browser.isDevice) {
                sf.base.EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
                sf.base.EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
            }
        }
    };
    DateTimePicker.prototype.onMouseOver = function (event) {
        var currentLi = sf.base.closest(event.target, '.' + LISTCLASS);
        this.setTimeHover(currentLi, HOVER);
    };
    DateTimePicker.prototype.onMouseLeave = function () {
        this.removeTimeHover(HOVER);
    };
    DateTimePicker.prototype.setTimeHover = function (li, className) {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(className)) {
            this.removeTimeHover(className);
            sf.base.addClass([li], className);
        }
    };
    DateTimePicker.prototype.getPopupHeight = function () {
        var height = parseInt(POPUPDIMENSION, 10);
        var popupHeight = this.dateTimeWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    };
    DateTimePicker.prototype.changeEvent = function (e) {
        if ((this.value && this.value.valueOf()) !== (this.previousDateTime && +this.previousDateTime.valueOf())) {
            _super.prototype.changeEvent.call(this, e);
            this.valueWithMinutes = this.value;
            this.setInputValue('date');
            this.previousDateTime = this.value && new Date(+this.value);
        }
    };
    DateTimePicker.prototype.updateValue = function (e) {
        this.setInputValue('time');
        if (+this.previousDateTime !== +this.value) {
            this.changedArgs = {
                value: this.value, event: e || null,
                isInteracted: !sf.base.isNullOrUndefined(e),
                element: this.element
            };
            this.addTimeSelection();
            this.trigger('change', this.changedArgs);
            this.previousDateTime = this.value;
        }
    };
    DateTimePicker.prototype.setTimeScrollPosition = function () {
        var popupElement;
        popupElement = this.selectedElement;
        if (!sf.base.isNullOrUndefined(popupElement)) {
            this.findScrollTop(popupElement);
        }
        else if (this.dateTimeWrapper && this.checkDateValue(this.scrollTo)) {
            this.setScrollTo();
        }
    };
    DateTimePicker.prototype.findScrollTop = function (element) {
        var listHeight = this.getPopupHeight();
        var nextElement = element.nextElementSibling;
        var height = nextElement ? nextElement.offsetTop : element.offsetTop;
        var lineHeight = element.getBoundingClientRect().height;
        if ((height + element.offsetTop) > listHeight) {
            this.dateTimeWrapper.scrollTop = nextElement ? (height - (listHeight / HALFPOSITION + lineHeight / HALFPOSITION)) : height;
        }
        else {
            this.dateTimeWrapper.scrollTop = 0;
        }
    };
    DateTimePicker.prototype.setScrollTo = function () {
        var element;
        var items = this.dateTimeWrapper.querySelectorAll('.' + LISTCLASS);
        if (items.length >= 0) {
            var initialTime = this.timeCollections[0];
            var scrollTime = this.getDateObject(this.checkDateValue(this.scrollTo)).getTime();
            element = items[Math.round((scrollTime - initialTime) / (this.step * 60000))];
        }
        else {
            this.dateTimeWrapper.scrollTop = 0;
        }
        if (!sf.base.isNullOrUndefined(element)) {
            this.findScrollTop(element);
        }
        else {
            this.dateTimeWrapper.scrollTop = 0;
        }
    };
    DateTimePicker.prototype.setInputValue = function (type) {
        if (type === 'date') {
            this.inputElement.value = this.previousElementValue = this.getFormattedValue(this.getFullDateTime());
            this.setProperties({ value: this.getFullDateTime() }, true);
        }
        else {
            var tempVal = this.getFormattedValue(new Date(this.timeCollections[this.activeIndex]));
            sf.inputs.Input.setValue(tempVal, this.inputElement, this.floatLabelType, this.showClearButton);
            this.previousElementValue = this.inputElement.value;
            this.setProperties({ value: new Date(this.timeCollections[this.activeIndex]) }, true);
        }
        this.updateIconState();
    };
    DateTimePicker.prototype.getFullDateTime = function () {
        var value = null;
        if (this.isDateObject(this.valueWithMinutes)) {
            value = this.combineDateTime(this.valueWithMinutes);
        }
        else {
            value = this.previousDate;
        }
        return this.validateMinMaxRange(value);
    };
    DateTimePicker.prototype.combineDateTime = function (value) {
        if (this.isDateObject(value)) {
            var day = this.previousDate.getDate();
            var month = this.previousDate.getMonth();
            var year = this.previousDate.getFullYear();
            var hour = value.getHours();
            var minutes = value.getMinutes();
            var seconds = value.getSeconds();
            return new Date(year, month, day, hour, minutes, seconds);
        }
        else {
            return this.previousDate;
        }
    };
    DateTimePicker.prototype.onMouseClick = function (event) {
        var target = event.target;
        var li = this.selectedElement = sf.base.closest(target, '.' + LISTCLASS);
        if (li && li.classList.contains(LISTCLASS)) {
            this.timeValue = li.getAttribute('data-value');
            this.hide(event);
        }
        this.setSelection(li, event);
    };
    DateTimePicker.prototype.setSelection = function (li, event) {
        if (this.isValidLI(li) && !li.classList.contains(ACTIVE)) {
            var value = li.getAttribute('data-value');
            this.selectedElement = li;
            var index = Array.prototype.slice.call(this.liCollections).indexOf(li);
            this.activeIndex = index;
            this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
            sf.base.addClass([this.selectedElement], ACTIVE);
            this.selectedElement.setAttribute('aria-selected', 'true');
            this.updateValue(event);
        }
    };
    DateTimePicker.prototype.setTimeActiveClass = function () {
        var collections = sf.base.isNullOrUndefined(this.dateTimeWrapper) ? this.listWrapper : this.dateTimeWrapper;
        if (!sf.base.isNullOrUndefined(collections)) {
            var items = collections.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                for (var i = 0; i < items.length; i++) {
                    if (this.timeCollections[i] === +(this.valueWithMinutes)) {
                        items[i].setAttribute('aria-selected', 'true');
                        this.selectedElement = items[i];
                        this.activeIndex = i;
                        this.setTimeActiveDescendant();
                        break;
                    }
                }
            }
        }
    };
    DateTimePicker.prototype.setTimeActiveDescendant = function () {
        if (!sf.base.isNullOrUndefined(this.selectedElement)) {
            sf.base.attributes(this.inputElement, { 'aria-activedescendant': this.selectedElement.getAttribute('id') });
        }
        else {
            sf.base.attributes(this.inputElement, { 'aria-activedescendant': 'null' });
        }
    };
    DateTimePicker.prototype.addTimeSelection = function () {
        this.selectedElement = null;
        this.removeTimeSelection();
        this.setTimeActiveClass();
        if (!sf.base.isNullOrUndefined(this.selectedElement)) {
            sf.base.addClass([this.selectedElement], ACTIVE);
            this.selectedElement.setAttribute('aria-selected', 'true');
        }
    };
    DateTimePicker.prototype.removeTimeSelection = function () {
        this.removeTimeHover(HOVER);
        if (!sf.base.isNullOrUndefined(this.dateTimeWrapper)) {
            var items = this.dateTimeWrapper.querySelectorAll('.' + ACTIVE);
            if (items.length) {
                sf.base.removeClass(items, ACTIVE);
                items[0].removeAttribute('aria-selected');
            }
        }
    };
    DateTimePicker.prototype.removeTimeHover = function (className) {
        var hoveredItem = this.getTimeHoverItem(className);
        if (hoveredItem && hoveredItem.length) {
            sf.base.removeClass(hoveredItem, className);
        }
    };
    DateTimePicker.prototype.getTimeHoverItem = function (className) {
        var collections = sf.base.isNullOrUndefined(this.dateTimeWrapper) ? this.listWrapper : this.dateTimeWrapper;
        var hoveredItem;
        if (!sf.base.isNullOrUndefined(collections)) {
            hoveredItem = collections.querySelectorAll('.' + className);
        }
        return hoveredItem;
    };
    DateTimePicker.prototype.isValidLI = function (li) {
        return (li && li.classList.contains(LISTCLASS) && !li.classList.contains(DISABLED));
    };
    DateTimePicker.prototype.calculateStartEnd = function (value, range, method) {
        var day = value.getDate();
        var month = value.getMonth();
        var year = value.getFullYear();
        var hours = value.getHours();
        var minutes = value.getMinutes();
        var seconds = value.getSeconds();
        var milliseconds = value.getMilliseconds();
        if (range) {
            if (method === 'starttime') {
                return new Date(year, month, day, 0, 0, 0);
            }
            else {
                return new Date(year, month, day, 23, 59, 59);
            }
        }
        else {
            return new Date(year, month, day, hours, minutes, seconds, milliseconds);
        }
    };
    DateTimePicker.prototype.startTime = function (date) {
        var tempStartValue;
        var start;
        var tempMin = this.min;
        var value;
        value = date === null ? new Date() : date;
        if ((+value.getDate() === +tempMin.getDate() && +value.getMonth() === +tempMin.getMonth() &&
            +value.getFullYear() === +tempMin.getFullYear()) || ((+new Date(value.getFullYear(), value.getMonth(), value.getDate())) <=
            +new Date(tempMin.getFullYear(), tempMin.getMonth(), tempMin.getDate()))) {
            start = false;
            tempStartValue = this.min;
        }
        else if (+value < +this.max && +value > +this.min) {
            start = true;
            tempStartValue = value;
        }
        else if (+value >= +this.max) {
            start = true;
            tempStartValue = this.max;
        }
        return this.calculateStartEnd(tempStartValue, start, 'starttime');
    };
    DateTimePicker.prototype.endTime = function (date) {
        var tempEndValue;
        var end;
        var tempMax = this.max;
        var value;
        value = date === null ? new Date() : date;
        if ((+value.getDate() === +tempMax.getDate() && +value.getMonth() === +tempMax.getMonth() &&
            +value.getFullYear() === +tempMax.getFullYear()) || (+new Date(value.getUTCFullYear(), value.getMonth(), value.getDate()) >=
            +new Date(tempMax.getFullYear(), tempMax.getMonth(), tempMax.getDate()))) {
            end = false;
            tempEndValue = this.max;
        }
        else if (+value < +this.max && +value > +this.min) {
            end = true;
            tempEndValue = value;
        }
        else if (+value <= +this.min) {
            end = true;
            tempEndValue = this.min;
        }
        return this.calculateStartEnd(tempEndValue, end, 'endtime');
    };
    DateTimePicker.prototype.hide = function (e) {
        var _this = this;
        if (this.popupObj || this.dateTimeWrapper) {
            this.preventArgs = {
                cancel: false,
                popup: (sf.base.isBlazor() && this.isServerRendered) ? null : this.popupObj || this.popupObject,
                event: e || null
            };
            var eventArgs = this.preventArgs;
            if (sf.base.isNullOrUndefined(this.popupObj)) {
                this.trigger('close', eventArgs, function (eventArgs) {
                    _this.dateTimeCloseEventCallback(e, eventArgs);
                });
            }
            else {
                this.dateTimeCloseEventCallback(e, eventArgs);
            }
        }
        else {
            if (sf.base.Browser.isDevice && this.allowEdit && !this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
            this.setAllowEdit();
        }
    };
    DateTimePicker.prototype.dateTimeCloseEventCallback = function (e, eventArgs) {
        this.preventArgs = eventArgs;
        if (!this.preventArgs.cancel) {
            if (this.isDatePopupOpen()) {
                _super.prototype.hide.call(this, e);
            }
            else if (this.isTimePopupOpen()) {
                this.closePopup(e);
                sf.base.removeClass([document.body], OVERFLOW);
                if (sf.base.Browser.isDevice && this.timeModal) {
                    this.timeModal.style.display = 'none';
                    this.timeModal.outerHTML = '';
                    this.timeModal = null;
                }
                this.setTimeActiveDescendant();
            }
        }
        if (sf.base.Browser.isDevice && this.allowEdit && !this.readonly) {
            this.inputElement.removeAttribute('readonly');
        }
        this.setAllowEdit();
    };
    DateTimePicker.prototype.closePopup = function (e) {
        if (this.isTimePopupOpen() && this.popupObject) {
            var animModel = {
                name: 'FadeOut',
                duration: ANIMATIONDURATION,
                delay: 0
            };
            this.popupObject.hide(new sf.base.Animation(animModel));
            this.inputWrapper.container.classList.remove(ICONANIMATION);
            sf.base.attributes(this.inputElement, { 'aria-expanded': 'false' });
            sf.base.EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
        }
    };
    DateTimePicker.prototype.preRender = function () {
        this.checkFormat();
        this.dateTimeFormat = this.cldrDateTimeFormat();
        _super.prototype.preRender.call(this);
        sf.base.removeClass([this.inputElementCopy], [ROOT]);
    };
    
    DateTimePicker.prototype.getProperty = function (date, val) {
        if (val === 'min') {
            this.setProperties({ min: this.validateValue(date.min) }, true);
        }
        else {
            this.setProperties({ max: this.validateValue(date.max) }, true);
        }
    };
    DateTimePicker.prototype.checkAttributes = function (isDynamic) {
        var attributes$$1 = isDynamic ? sf.base.isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['style', 'name', 'step', 'disabled', 'readonly', 'value', 'min', 'max', 'placeholder', 'type'];
        var value;
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!sf.base.isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'name':
                        this.inputElement.setAttribute('name', this.inputElement.getAttribute(prop));
                        break;
                    case 'step':
                        this.step = parseInt(this.inputElement.getAttribute(prop), 10);
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['readonly'] === undefined)) || isDynamic) {
                            var readonly = this.inputElement.getAttribute(prop) === 'disabled' ||
                                this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, !isDynamic);
                        }
                        break;
                    case 'min':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['min'] === undefined)) || isDynamic) {
                            value = new Date(this.inputElement.getAttribute(prop));
                            if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                                this.setProperties({ min: value }, !isDynamic);
                            }
                        }
                        break;
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['enabled'] === undefined)) || isDynamic) {
                            var enabled = this.inputElement.getAttribute(prop) === 'disabled' ||
                                this.inputElement.getAttribute(prop) === 'true' ||
                                this.inputElement.getAttribute(prop) === '' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['value'] === undefined)) || isDynamic) {
                            value = new Date(this.inputElement.getAttribute(prop));
                            if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                                this.setProperties({ value: value }, !isDynamic);
                            }
                        }
                        break;
                    case 'max':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['max'] === undefined)) || isDynamic) {
                            value = new Date(this.inputElement.getAttribute(prop));
                            if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                                this.setProperties({ max: value }, !isDynamic);
                            }
                        }
                        break;
                }
            }
        }
    };
    DateTimePicker.prototype.requiredModules = function () {
        var modules = [];
        if (this) {
            modules.push({ args: [this], member: 'islamic' });
        }
        return modules;
    };
    DateTimePicker.prototype.getTimeActiveElement = function () {
        if (!sf.base.isNullOrUndefined(this.dateTimeWrapper)) {
            return this.dateTimeWrapper.querySelectorAll('.' + ACTIVE);
        }
        else {
            return null;
        }
    };
    DateTimePicker.prototype.createDateObj = function (val) {
        return val instanceof Date ? val : null;
    };
    DateTimePicker.prototype.getDateObject = function (text) {
        if (!this.isNullOrEmpty(text)) {
            var dateValue = this.createDateObj(text);
            var value = this.valueWithMinutes;
            var status_1 = !sf.base.isNullOrUndefined(value);
            if (this.checkDateValue(dateValue)) {
                var date = status_1 ? value.getDate() : DAY;
                var month = status_1 ? value.getMonth() : MONTH;
                var year = status_1 ? value.getFullYear() : YEAR;
                var hour = status_1 ? value.getHours() : HOUR;
                var minute = status_1 ? value.getMinutes() : MINUTE;
                var second = status_1 ? value.getSeconds() : SECOND;
                var millisecond = status_1 ? value.getMilliseconds() : MILLISECOND;
                return new Date(year, month, date, hour, minute, second, millisecond);
            }
        }
        return null;
    };
    DateTimePicker.prototype.findNextTimeElement = function (event) {
        var textVal = (this.inputElement).value;
        var value = sf.base.isNullOrUndefined(this.valueWithMinutes) ? this.createDateObj(textVal) :
            this.getDateObject(this.valueWithMinutes);
        var dateTimeVal = null;
        var listCount = this.liCollections.length;
        if (!sf.base.isNullOrUndefined(this.activeIndex) || !sf.base.isNullOrUndefined(this.checkDateValue(value))) {
            if (event.action === 'home') {
                dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[0])));
                this.activeIndex = 0;
            }
            else if (event.action === 'end') {
                dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[this.timeCollections.length - 1])));
                this.activeIndex = this.timeCollections.length - 1;
            }
            else {
                if (event.action === 'down') {
                    for (var i = 0; i < listCount; i++) {
                        if (+value < this.timeCollections[i]) {
                            dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[i])));
                            this.activeIndex = i;
                            break;
                        }
                    }
                }
                else {
                    for (var i = listCount - 1; i >= 0; i--) {
                        if (+value > this.timeCollections[i]) {
                            dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[i])));
                            this.activeIndex = i;
                            break;
                        }
                    }
                }
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.timeElementValue(sf.base.isNullOrUndefined(dateTimeVal) ? null : new Date(dateTimeVal));
        }
    };
    DateTimePicker.prototype.setTimeValue = function (date, value) {
        var dateString;
        var time;
        var val = this.validateMinMaxRange(value);
        var newval = this.createDateObj(val);
        if (this.getFormattedValue(newval) !== (!sf.base.isNullOrUndefined(this.value) ? this.getFormattedValue(this.value) : null)) {
            this.valueWithMinutes = sf.base.isNullOrUndefined(newval) ? null : newval;
            time = new Date(+this.valueWithMinutes);
        }
        else {
            if (this.strictMode) {
                //for strict mode case, when value not present within a range. Reset the nearest range value.
                date = newval;
            }
            this.valueWithMinutes = this.checkDateValue(date);
            time = new Date(+this.valueWithMinutes);
        }
        if (this.calendarMode === 'Gregorian') {
            dateString = this.globalize.formatDate(time, {
                format: !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.cldrDateTimeFormat(),
                type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd'
            });
        }
        else {
            dateString = this.globalize.formatDate(time, {
                format: !sf.base.isNullOrUndefined(this.formatString) ? this.formatString : this.cldrDateTimeFormat(),
                type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
            });
        }
        if (!this.strictMode && sf.base.isNullOrUndefined(time)) {
            sf.inputs.Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        else {
            sf.inputs.Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        return time;
    };
    DateTimePicker.prototype.timeElementValue = function (value) {
        if (!sf.base.isNullOrUndefined(this.checkDateValue(value)) && !this.isNullOrEmpty(value)) {
            var date = value instanceof Date ? value : this.getDateObject(value);
            return this.setTimeValue(date, value);
        }
        return null;
    };
    DateTimePicker.prototype.timeKeyHandler = function (event) {
        if (sf.base.isNullOrUndefined(this.step) || this.step <= 0) {
            return;
        }
        var listCount = this.timeCollections.length;
        if (sf.base.isNullOrUndefined(this.getTimeActiveElement()) || this.getTimeActiveElement().length === 0) {
            if (this.liCollections.length > 0) {
                if (sf.base.isNullOrUndefined(this.value) && sf.base.isNullOrUndefined(this.activeIndex)) {
                    this.activeIndex = 0;
                    this.selectedElement = this.liCollections[0];
                    this.timeElementValue(new Date(this.timeCollections[0]));
                }
                else {
                    this.findNextTimeElement(event);
                }
            }
        }
        else {
            var nextItemValue = void 0;
            if ((event.keyCode >= 37) && (event.keyCode <= 40)) {
                var index = (event.keyCode === 40 || event.keyCode === 39) ? ++this.activeIndex : --this.activeIndex;
                this.activeIndex = index = this.activeIndex === (listCount) ? 0 : this.activeIndex;
                this.activeIndex = index = this.activeIndex < 0 ? (listCount - 1) : this.activeIndex;
                nextItemValue = sf.base.isNullOrUndefined(this.timeCollections[index]) ? this.timeCollections[0] : this.timeCollections[index];
            }
            else if (event.action === 'home') {
                this.activeIndex = 0;
                nextItemValue = this.timeCollections[0];
            }
            else if (event.action === 'end') {
                this.activeIndex = listCount - 1;
                nextItemValue = this.timeCollections[listCount - 1];
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.timeElementValue(new Date(nextItemValue));
        }
        this.isNavigate = true;
        this.setTimeHover(this.selectedElement, NAVIGATION);
        this.setTimeActiveDescendant();
        if (this.isTimePopupOpen() && this.selectedElement !== null && (!event || event.type !== 'click')) {
            this.setTimeScrollPosition();
        }
    };
    DateTimePicker.prototype.TimeKeyActionHandle = function (event) {
        if (this.enabled) {
            if (event.action !== 'right' && event.action !== 'left' && event.action !== 'tab') {
                event.preventDefault();
            }
            switch (event.action) {
                case 'up':
                case 'down':
                case 'home':
                case 'end':
                    this.timeKeyHandler(event);
                    break;
                case 'enter':
                    if (this.isNavigate) {
                        this.selectedElement = this.liCollections[this.activeIndex];
                        this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
                        this.setInputValue('time');
                        if (+this.previousDateTime !== +this.value) {
                            this.changedArgs.value = this.value;
                            this.addTimeSelection();
                            this.previousDateTime = this.value;
                        }
                    }
                    else {
                        this.updateValue(event);
                    }
                    this.hide(event);
                    sf.base.addClass([this.inputWrapper.container], INPUTFOCUS);
                    this.isNavigate = false;
                    event.stopPropagation();
                    break;
                case 'escape':
                    this.hide(event);
                    break;
                default:
                    this.isNavigate = false;
                    break;
            }
        }
    };
    DateTimePicker.prototype.inputKeyAction = function (event) {
        switch (event.action) {
            case 'altDownArrow':
                this.strictModeUpdate();
                this.updateInput();
                this.toggle(event);
                break;
        }
    };
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @deprecated
     */
    DateTimePicker.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'value':
                    var options = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' };
                    this.invalidValueString = null;
                    this.checkInvalidValue(newProp.value);
                    newProp.value = this.value;
                    newProp.value = this.validateValue(newProp.value);
                    sf.inputs.Input.setValue(this.getFormattedValue(newProp.value), this.inputElement, this.floatLabelType, this.showClearButton);
                    this.valueWithMinutes = newProp.value;
                    this.setProperties({ value: newProp.value }, true);
                    this.previousDateTime = new Date(this.inputElement.value);
                    this.updateInput();
                    this.changeTrigger(null);
                    break;
                case 'min':
                case 'max':
                    this.getProperty(newProp, prop);
                    this.updateInput();
                    break;
                case 'enableRtl':
                    sf.inputs.Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                    break;
                case 'cssClass':
                    if (!sf.base.isNullOrUndefined(oldProp.cssClass)) {
                        oldProp.cssClass = (oldProp.cssClass.replace(/\s+/g, ' ')).trim();
                    }
                    if (!sf.base.isNullOrUndefined(newProp.cssClass)) {
                        newProp.cssClass = (newProp.cssClass.replace(/\s+/g, ' ')).trim();
                    }
                    sf.inputs.Input.setCssClass(newProp.cssClass, [this.inputWrapper.container], oldProp.cssClass);
                    if (this.dateTimeWrapper) {
                        sf.inputs.Input.setCssClass(newProp.cssClass, [this.dateTimeWrapper], oldProp.cssClass);
                    }
                    break;
                case 'locale':
                    this.globalize = new sf.base.Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    sf.inputs.Input.setPlaceholder(this.l10n.getConstant('placeholder'), this.inputElement);
                    this.dateTimeFormat = this.cldrDateTimeFormat();
                    _super.prototype.updateInput.call(this);
                    break;
                case 'htmlAttributes':
                    this.updateHtmlAttributeToElement();
                    this.updateHtmlAttributeToWrapper();
                    this.checkAttributes(true);
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.checkFormat();
                    this.dateTimeFormat = this.formatString;
                    this.setValue();
                    break;
                case 'placeholder':
                    sf.inputs.Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.inputElement.setAttribute('aria-placeholder', newProp.placeholder);
                    break;
                case 'enabled':
                    sf.inputs.Input.setEnabled(this.enabled, this.inputElement);
                    if (!this.enabled) {
                        this.inputElement.tabIndex = -1;
                    }
                    this.bindEvents();
                    break;
                case 'strictMode':
                    this.invalidValueString = null;
                    this.updateInput();
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    break;
                case 'readonly':
                    sf.inputs.Input.setReadonly(this.readonly, this.inputElement);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    sf.inputs.Input.removeFloating(this.inputWrapper);
                    sf.inputs.Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                case 'scrollTo':
                    if (this.checkDateValue(new Date(this.checkValue(newProp.scrollTo)))) {
                        if (this.dateTimeWrapper) {
                            this.setScrollTo();
                        }
                        this.setProperties({ scrollTo: newProp.scrollTo }, true);
                    }
                    else {
                        this.setProperties({ scrollTo: null }, true);
                    }
                    break;
                default:
                    _super.prototype.onPropertyChanged.call(this, newProp, oldProp);
                    break;
            }
            this.hide(null);
        }
    };
    /**
     * To get component name.
     * @private
     */
    DateTimePicker.prototype.getModuleName = function () {
        return 'datetimepicker';
    };
    DateTimePicker.prototype.restoreValue = function () {
        this.previousDateTime = this.previousDate;
        this.currentDate = this.value ? this.value : new Date();
        this.valueWithMinutes = this.value;
        this.previousDate = this.value;
        this.previousElementValue = this.previousElementValue = (sf.base.isNullOrUndefined(this.inputValueCopy)) ? '' :
            this.getFormattedValue(this.inputValueCopy);
    };
    __decorate([
        sf.base.Property(null)
    ], DateTimePicker.prototype, "timeFormat", void 0);
    __decorate([
        sf.base.Property(30)
    ], DateTimePicker.prototype, "step", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateTimePicker.prototype, "scrollTo", void 0);
    __decorate([
        sf.base.Property(1000)
    ], DateTimePicker.prototype, "zIndex", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateTimePicker.prototype, "value", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateTimePicker.prototype, "keyConfigs", void 0);
    __decorate([
        sf.base.Property({})
    ], DateTimePicker.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property(false)
    ], DateTimePicker.prototype, "enablePersistence", void 0);
    __decorate([
        sf.base.Property(true)
    ], DateTimePicker.prototype, "allowEdit", void 0);
    __decorate([
        sf.base.Property(false)
    ], DateTimePicker.prototype, "isMultiSelection", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateTimePicker.prototype, "values", void 0);
    __decorate([
        sf.base.Property(true)
    ], DateTimePicker.prototype, "showClearButton", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateTimePicker.prototype, "placeholder", void 0);
    __decorate([
        sf.base.Property(false)
    ], DateTimePicker.prototype, "strictMode", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateTimePicker.prototype, "serverTimezoneOffset", void 0);
    __decorate([
        sf.base.Property(new Date(1900, 0, 1))
    ], DateTimePicker.prototype, "min", void 0);
    __decorate([
        sf.base.Property(new Date(2099, 11, 31))
    ], DateTimePicker.prototype, "max", void 0);
    __decorate([
        sf.base.Property(null)
    ], DateTimePicker.prototype, "firstDayOfWeek", void 0);
    __decorate([
        sf.base.Property('Gregorian')
    ], DateTimePicker.prototype, "calendarMode", void 0);
    __decorate([
        sf.base.Property('Month')
    ], DateTimePicker.prototype, "start", void 0);
    __decorate([
        sf.base.Property('Month')
    ], DateTimePicker.prototype, "depth", void 0);
    __decorate([
        sf.base.Property(false)
    ], DateTimePicker.prototype, "weekNumber", void 0);
    __decorate([
        sf.base.Property(true)
    ], DateTimePicker.prototype, "showTodayButton", void 0);
    __decorate([
        sf.base.Property('Short')
    ], DateTimePicker.prototype, "dayHeaderFormat", void 0);
    __decorate([
        sf.base.Property(false)
    ], DateTimePicker.prototype, "openOnFocus", void 0);
    __decorate([
        sf.base.Event()
    ], DateTimePicker.prototype, "open", void 0);
    __decorate([
        sf.base.Event()
    ], DateTimePicker.prototype, "close", void 0);
    __decorate([
        sf.base.Event()
    ], DateTimePicker.prototype, "cleared", void 0);
    __decorate([
        sf.base.Event()
    ], DateTimePicker.prototype, "blur", void 0);
    __decorate([
        sf.base.Event()
    ], DateTimePicker.prototype, "focus", void 0);
    __decorate([
        sf.base.Event()
    ], DateTimePicker.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], DateTimePicker.prototype, "destroyed", void 0);
    DateTimePicker = __decorate([
        sf.base.NotifyPropertyChanges
    ], DateTimePicker);
    return DateTimePicker;
}(sf.calendars.DatePicker));

/**
 * DateTimePicker modules
 */

exports.DateTimePicker = DateTimePicker;

return exports;

});

    sf.calendars = sf.base.extend({}, sf.calendars, sfdatetimepicker({}));