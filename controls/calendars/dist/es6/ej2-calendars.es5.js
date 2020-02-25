import { Animation, Browser, ChildProperty, Collection, Component, Event, EventHandler, HijriParser, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, append, attributes, cldrData, closest, createElement, detach, extend, formatUnit, getDefaultDateObject, getUniqueID, getValue, isBlazor, isNullOrUndefined, isUndefined, merge, prepend, remove, removeClass, rippleEffect, select, setStyleAttribute, setValue, throwError } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Input } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
import { ListBase, cssClass } from '@syncfusion/ej2-lists';

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
//class constant defination.
var OTHERMONTH = 'e-other-month';
var OTHERDECADE = 'e-other-year';
var ROOT = 'e-calendar';
var DEVICE = 'e-device';
var HEADER = 'e-header';
var RTL = 'e-rtl';
var CONTENT = 'e-content';
var YEAR = 'e-year';
var MONTH = 'e-month';
var DECADE = 'e-decade';
var ICON = 'e-icons';
var PREVICON = 'e-prev';
var NEXTICON = 'e-next';
var PREVSPAN = 'e-date-icon-prev';
var NEXTSPAN = 'e-date-icon-next ';
var ICONCONTAINER = 'e-icon-container';
var DISABLED = 'e-disabled';
var OVERLAY = 'e-overlay';
var WEEKEND = 'e-weekend';
var WEEKNUMBER = 'e-week-number';
var SELECTED = 'e-selected';
var FOCUSEDDATE = 'e-focused-date';
var OTHERMONTHROW = 'e-month-hide';
var TODAY = 'e-today';
var TITLE = 'e-title';
var LINK = 'e-day';
var CELL = 'e-cell';
var WEEKHEADER = 'e-week-header';
var ZOOMIN = 'e-zoomin';
var FOOTER = 'e-footer-container';
var BTN = 'e-btn';
var FLAT = 'e-flat';
var CSS = 'e-css';
var PRIMARY = 'e-primary';
var DAYHEADERLONG = 'e-calendar-day-header-lg';
var dayMilliSeconds = 86400000;
var minutesMilliSeconds = 60000;
/**
 *
 * @private
 */
var CalendarBase = /** @__PURE__ @class */ (function (_super) {
    __extends(CalendarBase, _super);
    /**
     * Initialized new instance of Calendar Class.
     * Constructor for creating the widget
     * @param  {CalendarModel} options?
     * @param  {string|HTMLElement} element?
     */
    function CalendarBase(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.effect = '';
        _this.isPopupClicked = false;
        _this.isDateSelected = true;
        return _this;
    }
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    CalendarBase.prototype.render = function () {
        this.rangeValidation(this.min, this.max);
        this.calendarEleCopy = this.element.cloneNode(true);
        if (this.calendarMode === 'Islamic') {
            if (+(this.min.setSeconds(0)) === +new Date(1900, 0, 1, 0, 0, 0)) {
                this.min = new Date(1944, 2, 18);
            }
            if (+this.max === +new Date(2099, 11, 31)) {
                this.max = new Date(2069, 10, 16);
            }
        }
        this.globalize = new Internationalization(this.locale);
        if (isNullOrUndefined(this.firstDayOfWeek) || this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: this.globalize.getFirstDayOfWeek() }, true);
        }
        this.todayDisabled = false;
        this.todayDate = new Date(new Date().setHours(0, 0, 0, 0));
        if (this.getModuleName() === 'calendar') {
            this.element.classList.add(ROOT);
            if (this.enableRtl) {
                this.element.classList.add(RTL);
            }
            if (Browser.isDevice) {
                this.element.classList.add(DEVICE);
            }
            attributes(this.element, {
                'data-role': 'calendar'
            });
            this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
            this.element.setAttribute('tabindex', this.tabIndex);
        }
        else {
            this.calendarElement = this.createElement('div');
            this.calendarElement.classList.add(ROOT);
            if (this.enableRtl) {
                this.calendarElement.classList.add(RTL);
            }
            if (Browser.isDevice) {
                this.calendarElement.classList.add(DEVICE);
            }
            attributes(this.calendarElement, {
                'role': 'calendar'
            });
        }
        this.createHeader();
        this.createContent();
        this.wireEvents();
    };
    CalendarBase.prototype.rangeValidation = function (min, max) {
        if (isNullOrUndefined(min)) {
            this.setProperties({ min: new Date(1900, 0, 1) }, true);
        }
        if (isNullOrUndefined(max)) {
            this.setProperties({ max: new Date(2099, 11, 31) }, true);
        }
    };
    CalendarBase.prototype.getDefaultKeyConfig = function () {
        this.defaultKeyConfigs = {
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
            altUpArrow: 'alt+uparrow',
            spacebar: 'space',
            altRightArrow: 'alt+rightarrow',
            altLeftArrow: 'alt+leftarrow'
        };
        return this.defaultKeyConfigs;
    };
    CalendarBase.prototype.validateDate = function (value) {
        this.setProperties({ min: this.checkDateValue(new Date(this.checkValue(this.min))) }, true);
        this.setProperties({ max: this.checkDateValue(new Date(this.checkValue(this.max))) }, true);
        this.currentDate = this.currentDate ? this.currentDate : new Date(new Date().setHours(0, 0, 0, 0));
        if (!isNullOrUndefined(value) && this.min <= this.max && value >= this.min && value <= this.max) {
            this.currentDate = new Date(this.checkValue(value));
        }
    };
    CalendarBase.prototype.setOverlayIndex = function (popupWrapper, popupElement, modal, isDevice) {
        if (isDevice && !isNullOrUndefined(popupElement) && !isNullOrUndefined(modal) && !isNullOrUndefined(popupWrapper)) {
            var index = parseInt(popupElement.style.zIndex, 10) ? parseInt(popupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupWrapper.style.zIndex = index.toString();
        }
    };
    CalendarBase.prototype.minMaxUpdate = function (value) {
        if (!(+this.min <= +this.max)) {
            this.setProperties({ min: this.min }, true);
            addClass([this.element], OVERLAY);
        }
        else {
            removeClass([this.element], OVERLAY);
        }
        this.min = isNullOrUndefined(this.min) || !(+this.min) ? this.min = new Date(1900, 0, 1) : this.min;
        this.max = isNullOrUndefined(this.max) || !(+this.max) ? this.max = new Date(2099, 11, 31) : this.max;
        if (+this.min <= +this.max && value && +value <= +this.max && +value >= +this.min) {
            this.currentDate = new Date(this.checkValue(value));
        }
        else {
            if (+this.min <= +this.max && !value && +this.currentDate > +this.max) {
                this.currentDate = new Date(this.checkValue(this.max));
            }
            else {
                if (+this.currentDate < +this.min) {
                    this.currentDate = new Date(this.checkValue(this.min));
                }
            }
        }
    };
    CalendarBase.prototype.createHeader = function () {
        var ariaPrevAttrs = {
            'aria-disabled': 'false',
            'aria-label': 'previous month'
        };
        var ariaNextAttrs = {
            'aria-disabled': 'false',
            'aria-label': 'next month'
        };
        var ariaTitleAttrs = {
            'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'title'
        };
        this.headerElement = this.createElement('div', { className: HEADER });
        var iconContainer = this.createElement('div', { className: ICONCONTAINER });
        this.previousIcon = this.createElement('button', { className: '' + PREVICON, attrs: { type: 'button' } });
        rippleEffect(this.previousIcon, {
            duration: 400,
            selector: '.e-prev',
            isCenterRipple: true
        });
        attributes(this.previousIcon, ariaPrevAttrs);
        this.nextIcon = this.createElement('button', { className: '' + NEXTICON, attrs: { type: 'button' } });
        rippleEffect(this.nextIcon, {
            selector: '.e-next',
            duration: 400,
            isCenterRipple: true
        });
        attributes(this.nextIcon, ariaNextAttrs);
        this.headerTitleElement = this.createElement('div', { className: '' + LINK + ' ' + TITLE });
        attributes(this.headerTitleElement, ariaTitleAttrs);
        this.headerElement.appendChild(this.headerTitleElement);
        this.previousIcon.appendChild(this.createElement('span', { className: '' + PREVSPAN + ' ' + ICON }));
        this.nextIcon.appendChild(this.createElement('span', { className: '' + NEXTSPAN + ' ' + ICON }));
        iconContainer.appendChild(this.previousIcon);
        iconContainer.appendChild(this.nextIcon);
        this.headerElement.appendChild(iconContainer);
        if (this.getModuleName() === 'calendar') {
            this.element.appendChild(this.headerElement);
        }
        else {
            this.calendarElement.appendChild(this.headerElement);
        }
        this.adjustLongHeaderSize();
    };
    CalendarBase.prototype.createContent = function () {
        this.contentElement = this.createElement('div', { className: CONTENT });
        this.table = this.createElement('table', { attrs: { tabIndex: '0', 'role': 'grid', 'aria-activedescendant': '' } });
        if (this.getModuleName() === 'calendar') {
            this.element.appendChild(this.contentElement);
        }
        else {
            this.calendarElement.appendChild(this.contentElement);
        }
        this.contentElement.appendChild(this.table);
        this.createContentHeader();
        this.createContentBody();
        if (this.showTodayButton) {
            this.createContentFooter();
        }
    };
    CalendarBase.prototype.getCultureValues = function () {
        var culShortNames = [];
        var cldrObj;
        var dayFormat = 'days.stand-alone.' + this.dayHeaderFormat.toLowerCase();
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = (getValue(dayFormat, getDefaultDateObject()));
        }
        else {
            cldrObj = (this.getCultureObjects(cldrData, '' + this.locale));
        }
        for (var _i = 0, _a = Object.keys(cldrObj); _i < _a.length; _i++) {
            var obj = _a[_i];
            culShortNames.push(getValue(obj, cldrObj));
        }
        return culShortNames;
    };
    CalendarBase.prototype.toCapitalize = function (text) {
        return !isNullOrUndefined(text) && text.length ? text[0].toUpperCase() + text.slice(1) : text;
    };
    CalendarBase.prototype.createContentHeader = function () {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.element.querySelectorAll('.e-content .e-week-header')[0])) {
                detach(this.element.querySelectorAll('.e-content .e-week-header')[0]);
            }
        }
        else {
            if (!isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content .e-week-header')[0])) {
                detach(this.calendarElement.querySelectorAll('.e-content .e-week-header')[0]);
            }
        }
        var daysCount = 6;
        var html = '';
        var shortNames;
        if (this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: 0 }, true);
        }
        this.tableHeadElement = this.createElement('thead', { className: WEEKHEADER });
        if (this.weekNumber) {
            html += '<th class="e-week-number"></th>';
            if (this.getModuleName() === 'calendar') {
                addClass([this.element], '' + WEEKNUMBER);
            }
            else {
                addClass([this.calendarElement], '' + WEEKNUMBER);
            }
        }
        shortNames = this.shiftArray(((this.getCultureValues().length > 0 && this.getCultureValues())), this.firstDayOfWeek);
        for (var days = 0; days <= daysCount; days++) {
            html += '<th  class="">' + this.toCapitalize(shortNames[days]) + '</th>';
        }
        html = '<tr>' + html + '</tr>';
        this.tableHeadElement.innerHTML = html;
        this.table.appendChild(this.tableHeadElement);
    };
    CalendarBase.prototype.createContentBody = function () {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.element.querySelectorAll('.e-content tbody')[0])) {
                detach(this.element.querySelectorAll('.e-content tbody')[0]);
            }
        }
        else {
            if (!isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content tbody')[0])) {
                detach(this.calendarElement.querySelectorAll('.e-content tbody')[0]);
            }
        }
        switch (this.start) {
            case 'Year':
                this.renderYears();
                break;
            case 'Decade':
                this.renderDecades();
                break;
            default:
                this.renderMonths();
        }
    };
    CalendarBase.prototype.updateFooter = function () {
        this.todayElement.textContent = this.l10.getConstant('today');
        this.todayElement.setAttribute('aria-label', this.l10.getConstant('today'));
    };
    CalendarBase.prototype.createContentFooter = function () {
        if (this.showTodayButton) {
            var minimum = new Date(+this.min);
            var maximum = new Date(+this.max);
            var l10nLocale = { today: 'Today' };
            this.globalize = new Internationalization(this.locale);
            this.l10 = new L10n(this.getModuleName(), l10nLocale, this.locale);
            this.todayElement = this.createElement('button', { attrs: { role: 'button' } });
            rippleEffect(this.todayElement);
            this.updateFooter();
            addClass([this.todayElement], [BTN, TODAY, FLAT, PRIMARY, CSS]);
            if ((!(+new Date(minimum.setHours(0, 0, 0, 0)) <= +this.todayDate &&
                +this.todayDate <= +new Date(maximum.setHours(0, 0, 0, 0)))) || (this.todayDisabled)) {
                addClass([this.todayElement], DISABLED);
            }
            this.footer = this.createElement('div', { className: FOOTER });
            this.footer.appendChild(this.todayElement);
            if (this.getModuleName() === 'calendar') {
                this.element.appendChild(this.footer);
            }
            if (this.getModuleName() === 'datepicker') {
                this.calendarElement.appendChild(this.footer);
            }
            if (this.getModuleName() === 'datetimepicker') {
                this.calendarElement.appendChild(this.footer);
            }
            if (!this.todayElement.classList.contains(DISABLED)) {
                EventHandler.add(this.todayElement, 'click', this.todayButtonClick, this);
            }
        }
    };
    CalendarBase.prototype.wireEvents = function (id, ref, keyConfig, moduleName) {
        if (!(isBlazor() && ref)) {
            EventHandler.add(this.headerTitleElement, 'click', this.navigateTitle, this);
            this.defaultKeyConfigs = extend(this.defaultKeyConfigs, this.keyConfigs);
        }
        else {
            this.element = document.getElementById(id);
            this.defaultKeyConfigs = this.getDefaultKeyConfig();
            this.defaultKeyConfigs = extend(this.defaultKeyConfigs, keyConfig);
            this.blazorRef = ref;
            this.serverModuleName = moduleName;
        }
        if (this.getModuleName() === 'calendar') {
            this.keyboardModule = new KeyboardEvents(this.element, {
                eventName: 'keydown',
                keyAction: this.keyActionHandle.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        }
        else {
            this.keyboardModule = new KeyboardEvents(this.calendarElement, {
                eventName: 'keydown',
                keyAction: this.keyActionHandle.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        }
    };
    CalendarBase.prototype.dateWireEvents = function (id, ref, keyConfig, moduleName) {
        this.defaultKeyConfigs = this.getDefaultKeyConfig();
        this.defaultKeyConfigs = extend(this.defaultKeyConfigs, keyConfig);
        this.blazorRef = ref;
        this.serverModuleName = moduleName;
    };
    CalendarBase.prototype.todayButtonClick = function (value) {
        if (this.showTodayButton) {
            if (this.currentView() === this.depth) {
                this.effect = '';
            }
            else {
                this.effect = 'e-zoomin';
            }
            if (this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                this.navigateTo(this.depth, new Date(this.checkValue(value)));
            }
            else {
                this.navigateTo('Month', new Date(this.checkValue(value)));
            }
        }
    };
    CalendarBase.prototype.checkDeviceMode = function (ref) {
        if (Browser.isDevice && isBlazor() && ref) {
            // tslint:disable-next-line
            ref.invokeMethodAsync('OnDevice', true);
        }
    };
    // tslint:disable-next-line:max-func-body-length
    CalendarBase.prototype.keyActionHandle = function (e, value, multiSelection) {
        if (isBlazor() && this.blazorRef) {
            e.preventDefault();
            if (!this.tableBodyElement) {
                this.element = closest(e.target, '.' + 'e-calendar');
                this.tableBodyElement = this.element.querySelector('tbody');
            }
            multiSelection = false;
        }
        var focusedDate = this.tableBodyElement.querySelector('tr td.e-focused-date');
        var selectedDate;
        if (multiSelection) {
            if (!isNullOrUndefined(focusedDate) && +value === parseInt(focusedDate.getAttribute('id').split('_')[0], 10)) {
                selectedDate = focusedDate;
            }
            else {
                selectedDate = this.tableBodyElement.querySelector('tr td.e-selected');
            }
        }
        else {
            selectedDate = this.tableBodyElement.querySelector('tr td.e-selected');
        }
        if (isBlazor() && this.blazorRef) {
            this.tableBodyElement.focus();
            var targetEle = e.target;
            var args = {
                Action: e.action, Key: e.key, Events: e,
                SelectDate: selectedDate ? selectedDate.id : null,
                FocusedDate: focusedDate ? focusedDate.id : null,
                classList: selectedDate ? selectedDate.classList.toString() : focusedDate ? focusedDate.classList.toString() : 'e-cell',
                Id: focusedDate ? focusedDate.id : selectedDate ? selectedDate.id : null,
                TargetClassList: targetEle.classList.toString()
            };
            // tslint:disable-next-line
            this.blazorRef.invokeMethodAsync('OnCalendarKeyboardEvent', args);
            if (targetEle.classList.contains('e-today')) {
                targetEle.blur();
                this.tableBodyElement.focus();
            }
            if (this.serverModuleName === 'ejs.calendars.Calendar') {
                this.tableBodyElement = null;
            }
        }
        else {
            var view = this.getViewNumber(this.currentView());
            var depthValue = this.getViewNumber(this.depth);
            var levelRestrict = (view === depthValue && this.getViewNumber(this.start) >= depthValue);
            this.effect = '';
            switch (e.action) {
                case 'moveLeft':
                    this.KeyboardNavigate(-1, view, e, this.max, this.min);
                    e.preventDefault();
                    break;
                case 'moveRight':
                    this.KeyboardNavigate(1, view, e, this.max, this.min);
                    e.preventDefault();
                    break;
                case 'moveUp':
                    if (view === 0) {
                        this.KeyboardNavigate(-7, view, e, this.max, this.min); // move the current date to the previous seven days.
                    }
                    else {
                        this.KeyboardNavigate(-4, view, e, this.max, this.min); // move the current year to the previous four days.
                    }
                    e.preventDefault();
                    break;
                case 'moveDown':
                    if (view === 0) {
                        this.KeyboardNavigate(7, view, e, this.max, this.min);
                    }
                    else {
                        this.KeyboardNavigate(4, view, e, this.max, this.min);
                    }
                    e.preventDefault();
                    break;
                case 'select':
                    if (e.target === this.todayElement) {
                        this.todayButtonClick(value);
                    }
                    else {
                        var element = !isNullOrUndefined(focusedDate) ? focusedDate : selectedDate;
                        if (!isNullOrUndefined(element) && !element.classList.contains(DISABLED)) {
                            if (levelRestrict) {
                                var d = new Date(parseInt('' + (element).id, 0));
                                this.selectDate(e, d, (element));
                            }
                            else {
                                this.contentClick(null, --view, (element), value);
                            }
                        }
                    }
                    break;
                case 'controlUp':
                    this.title();
                    e.preventDefault();
                    break;
                case 'controlDown':
                    if (!isNullOrUndefined(focusedDate) || !isNullOrUndefined(selectedDate) && !levelRestrict) {
                        this.contentClick(null, --view, (focusedDate || selectedDate), value);
                    }
                    e.preventDefault();
                    break;
                case 'home':
                    this.currentDate = this.firstDay(this.currentDate);
                    detach(this.tableBodyElement);
                    (view === 0) ? this.renderMonths(e) : ((view === 1) ? this.renderYears(e) : this.renderDecades(e));
                    e.preventDefault();
                    break;
                case 'end':
                    this.currentDate = this.lastDay(this.currentDate, view);
                    detach(this.tableBodyElement);
                    (view === 0) ? this.renderMonths(e) : ((view === 1) ? this.renderYears(e) : this.renderDecades(e));
                    e.preventDefault();
                    break;
                case 'pageUp':
                    this.addMonths(this.currentDate, -1);
                    this.navigateTo('Month', this.currentDate);
                    e.preventDefault();
                    break;
                case 'pageDown':
                    this.addMonths(this.currentDate, 1);
                    this.navigateTo('Month', this.currentDate);
                    e.preventDefault();
                    break;
                case 'shiftPageUp':
                    this.addYears(this.currentDate, -1);
                    this.navigateTo('Month', this.currentDate);
                    e.preventDefault();
                    break;
                case 'shiftPageDown':
                    this.addYears(this.currentDate, 1);
                    this.navigateTo('Month', this.currentDate);
                    e.preventDefault();
                    break;
                case 'controlHome':
                    this.navigateTo('Month', new Date(this.currentDate.getFullYear(), 0, 1));
                    e.preventDefault();
                    break;
                case 'controlEnd':
                    this.navigateTo('Month', new Date(this.currentDate.getFullYear(), 11, 31));
                    e.preventDefault();
                    break;
            }
            if (this.getModuleName() === 'calendar') {
                this.table.focus();
            }
        }
    };
    CalendarBase.prototype.KeyboardNavigate = function (number, currentView, e, max, min) {
        var date = new Date(this.checkValue(this.currentDate));
        switch (currentView) {
            case 2:
                this.addYears(this.currentDate, number);
                if (this.isMonthYearRange(this.currentDate)) {
                    detach(this.tableBodyElement);
                    this.renderDecades(e);
                }
                else {
                    this.currentDate = date;
                }
                break;
            case 1:
                this.addMonths(this.currentDate, number);
                if (this.calendarMode === 'Gregorian') {
                    if (this.isMonthYearRange(this.currentDate)) {
                        detach(this.tableBodyElement);
                        this.renderYears(e);
                    }
                    else {
                        this.currentDate = date;
                    }
                }
                else {
                    if (this.isMonthYearRange(this.currentDate)) {
                        detach(this.tableBodyElement);
                        this.renderYears(e);
                    }
                    else {
                        this.currentDate = date;
                    }
                }
                break;
            case 0:
                this.addDay(this.currentDate, number, e, max, min);
                if (this.isMinMaxRange(this.currentDate)) {
                    detach(this.tableBodyElement);
                    this.renderMonths(e);
                }
                else {
                    this.currentDate = date;
                }
                break;
        }
    };
    /**
     * Initialize the event handler
     * @private
     */
    CalendarBase.prototype.preRender = function (value) {
        var _this = this;
        this.navigatePreviousHandler = this.navigatePrevious.bind(this);
        this.navigateNextHandler = this.navigateNext.bind(this);
        this.defaultKeyConfigs = this.getDefaultKeyConfig();
        this.navigateHandler = function (e) {
            _this.triggerNavigate(e);
        };
    };
    
    CalendarBase.prototype.minMaxDate = function (localDate) {
        var currentDate = new Date(new Date(+localDate).setHours(0, 0, 0, 0));
        var minDate = new Date(new Date(+this.min).setHours(0, 0, 0, 0));
        var maxDate = new Date(new Date(+this.max).setHours(0, 0, 0, 0));
        if (+currentDate === +minDate || +currentDate === +maxDate) {
            if (+localDate < +this.min) {
                localDate = new Date(+this.min);
            }
            if (+localDate > +this.max) {
                localDate = new Date(+this.max);
            }
        }
        return localDate;
    };
    CalendarBase.prototype.renderMonths = function (e, value) {
        var numCells = this.weekNumber ? 8 : 7;
        var tdEles;
        if (this.calendarMode === 'Gregorian') {
            tdEles = this.renderDays(this.currentDate, e, value);
        }
        else {
            tdEles = this.islamicModule.islamicRenderDays(this.currentDate, value);
        }
        this.createContentHeader();
        if (this.calendarMode === 'Gregorian') {
            this.renderTemplate(tdEles, numCells, MONTH, e, value);
        }
        else {
            this.islamicModule.islamicRenderTemplate(tdEles, numCells, MONTH, e, value);
        }
    };
    // tslint:disable-next-line:max-func-body-length
    CalendarBase.prototype.renderDays = function (currentDate, e, value, multiSelection, values) {
        var tdEles = [];
        var cellsCount = 42;
        var localDate = new Date(this.checkValue(currentDate));
        var minMaxDate;
        var numCells = this.weekNumber ? 8 : 7;
        // 8 and 7 denotes the number of columns to be specified.
        var currentMonth = localDate.getMonth();
        this.titleUpdate(currentDate, 'days');
        var d = localDate;
        localDate = new Date(d.getFullYear(), d.getMonth(), 0, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
        while (localDate.getDay() !== this.firstDayOfWeek) {
            this.setStartDate(localDate, -1 * dayMilliSeconds);
        }
        for (var day = 0; day < cellsCount; ++day) {
            var weekEle = this.createElement('td', { className: CELL });
            var weekAnchor = this.createElement('span');
            if (day % 7 === 0 && this.weekNumber) {
                weekAnchor.textContent = '' + this.getWeek(localDate);
                weekEle.appendChild(weekAnchor);
                addClass([weekEle], '' + WEEKNUMBER);
                tdEles.push(weekEle);
            }
            minMaxDate = new Date(+localDate);
            localDate = this.minMaxDate(localDate);
            var dateFormatOptions = { type: 'dateTime', skeleton: 'full' };
            var date = this.globalize.parseDate(this.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
            var tdEle = this.dayCell(localDate);
            var title = this.globalize.formatDate(localDate, { type: 'date', skeleton: 'full' });
            var dayLink = this.createElement('span');
            dayLink.textContent = this.globalize.formatDate(localDate, { format: 'd', type: 'date', skeleton: 'yMd' });
            var disabled = (this.min > localDate) || (this.max < localDate);
            if (disabled) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
            }
            else {
                dayLink.setAttribute('title', '' + title);
            }
            if (currentMonth !== localDate.getMonth()) {
                addClass([tdEle], OTHERMONTH);
            }
            if (localDate.getDay() === 0 || localDate.getDay() === 6) {
                addClass([tdEle], WEEKEND);
            }
            tdEle.appendChild(dayLink);
            this.renderDayCellArgs = {
                date: localDate,
                isDisabled: false,
                element: tdEle,
                isOutOfRange: disabled
            };
            var argument = this.renderDayCellArgs;
            this.renderDayCellEvent(argument);
            if (argument.isDisabled) {
                if (multiSelection) {
                    if (!isNullOrUndefined(values) && values.length > 0) {
                        for (var index = 0; index < values.length; index++) {
                            var localDateString = +new Date(this.globalize.formatDate(argument.date, { type: 'date', skeleton: 'yMd' }));
                            var tempDateString = +new Date(this.globalize.formatDate(values[index], { type: 'date', skeleton: 'yMd' }));
                            if (localDateString === tempDateString) {
                                values.splice(index, 1);
                                index = -1;
                            }
                        }
                    }
                }
                else if (value && +value === +argument.date) {
                    this.setProperties({ value: null }, true);
                }
            }
            if (this.renderDayCellArgs.isDisabled && !tdEle.classList.contains(SELECTED)) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
                if (+this.renderDayCellArgs.date === +this.todayDate) {
                    this.todayDisabled = true;
                }
            }
            var otherMnthBool = tdEle.classList.contains(OTHERMONTH);
            var disabledCls = tdEle.classList.contains(DISABLED);
            if (!disabledCls) {
                EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            // to set the value as null while setting the disabled date onProperty change.
            // if (args.isDisabled && +this.value === +args.date) {
            //     this.setProperties({ value: null }, true);
            // }
            if (multiSelection && !isNullOrUndefined(values) && !disabledCls) {
                for (var tempValue = 0; tempValue < values.length; tempValue++) {
                    var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                    var formatOptions = { type: 'date', skeleton: 'short', calendar: type };
                    var localDateString = this.globalize.formatDate(localDate, formatOptions);
                    var tempDateString = this.globalize.formatDate(values[tempValue], formatOptions);
                    if ((localDateString === tempDateString && this.getDateVal(localDate, values[tempValue]))
                        || (this.getDateVal(localDate, value))) {
                        addClass([tdEle], SELECTED);
                    }
                    else {
                        this.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
                    }
                }
                if (values.length <= 0) {
                    this.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
                }
            }
            else if (!disabledCls && this.getDateVal(localDate, value)) {
                addClass([tdEle], SELECTED);
            }
            else {
                this.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
            }
            if (date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate()) {
                if (date.getFullYear() === new Date().getFullYear()) {
                    addClass([tdEle], TODAY);
                }
            }
            tdEles.push(this.renderDayCellArgs.element);
            localDate = new Date(+minMaxDate);
            this.addDay(localDate, 1, null, this.max, this.min);
        }
        return tdEles;
    };
    CalendarBase.prototype.updateFocus = function (otherMonth, disabled, localDate, tableElement, currentDate) {
        if (currentDate.getDate() === localDate.getDate() && !otherMonth && !disabled) {
            addClass([tableElement], FOCUSEDDATE);
        }
        else {
            if (currentDate >= this.max && parseInt(tableElement.id, 0) === +this.max && !otherMonth && !disabled) {
                addClass([tableElement], FOCUSEDDATE);
            }
            if (currentDate <= this.min && parseInt(tableElement.id, 0) === +this.min && !otherMonth && !disabled) {
                addClass([tableElement], FOCUSEDDATE);
            }
        }
    };
    CalendarBase.prototype.renderYears = function (e, value) {
        this.removeTableHeadElement();
        var numCells = 4;
        var tdEles = [];
        var valueUtil = isNullOrUndefined(value);
        var curDate = new Date(this.checkValue(this.currentDate));
        var mon = curDate.getMonth();
        var yr = curDate.getFullYear();
        var localDate = curDate;
        var curYrs = localDate.getFullYear();
        var minYr = new Date(this.checkValue(this.min)).getFullYear();
        var minMonth = new Date(this.checkValue(this.min)).getMonth();
        var maxYr = new Date(this.checkValue(this.max)).getFullYear();
        var maxMonth = new Date(this.checkValue(this.max)).getMonth();
        localDate.setMonth(0);
        this.titleUpdate(this.currentDate, 'months');
        var disabled = (this.min > localDate) || (this.max < localDate);
        localDate.setDate(1);
        for (var month = 0; month < 12; ++month) {
            var tdEle = this.dayCell(localDate);
            var dayLink = this.createElement('span');
            var localMonth = (value && (value).getMonth() === localDate.getMonth());
            var select$$1 = (value && (value).getFullYear() === yr && localMonth);
            dayLink.textContent = this.toCapitalize(this.globalize.formatDate(localDate, { type: 'dateTime', skeleton: 'MMM' }));
            if ((this.min && (curYrs < minYr || (month < minMonth && curYrs === minYr))) || (this.max && (curYrs > maxYr || (month > maxMonth && curYrs >= maxYr)))) {
                addClass([tdEle], DISABLED);
            }
            else if (!valueUtil && select$$1) {
                addClass([tdEle], SELECTED);
            }
            else {
                if (localDate.getMonth() === mon && this.currentDate.getMonth() === mon) {
                    addClass([tdEle], FOCUSEDDATE);
                }
            }
            localDate.setDate(1);
            localDate.setMonth(localDate.getMonth() + 1);
            if (!tdEle.classList.contains(DISABLED)) {
                EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.renderTemplate(tdEles, numCells, YEAR, e, value);
    };
    CalendarBase.prototype.renderDecades = function (e, value) {
        this.removeTableHeadElement();
        var numCells = 4;
        var yearCell = 12;
        var tdEles = [];
        var localDate = new Date(this.checkValue(this.currentDate));
        localDate.setMonth(0);
        localDate.setDate(1);
        var localYr = localDate.getFullYear();
        var startYr = new Date(localDate.setFullYear((localYr - localYr % 10)));
        var endYr = new Date(localDate.setFullYear((localYr - localYr % 10 + (10 - 1))));
        var startFullYr = startYr.getFullYear();
        var endFullYr = endYr.getFullYear();
        var startHdrYr = this.globalize.formatDate(startYr, { type: 'dateTime', skeleton: 'y' });
        var endHdrYr = this.globalize.formatDate(endYr, { type: 'dateTime', skeleton: 'y' });
        this.headerTitleElement.textContent = startHdrYr + ' - ' + (endHdrYr);
        var start = new Date(localYr - (localYr % 10) - 1, 0, 1);
        var startYear = start.getFullYear();
        for (var rowIterator = 0; rowIterator < yearCell; ++rowIterator) {
            var year = startYear + rowIterator;
            localDate.setFullYear(year);
            var tdEle = this.dayCell(localDate);
            attributes(tdEle, { 'role': 'gridcell' });
            var dayLink = this.createElement('span');
            dayLink.textContent = this.globalize.formatDate(localDate, { type: 'dateTime', skeleton: 'y' });
            if ((year < startFullYr) || (year > endFullYr)) {
                addClass([tdEle], OTHERDECADE);
                if (!isNullOrUndefined(value) && localDate.getFullYear() === (value).getFullYear()) {
                    addClass([tdEle], SELECTED);
                }
                if (year < new Date(this.checkValue(this.min)).getFullYear() ||
                    year > new Date(this.checkValue(this.max)).getFullYear()) {
                    addClass([tdEle], DISABLED);
                }
            }
            else if (year < new Date(this.checkValue(this.min)).getFullYear() ||
                year > new Date(this.checkValue(this.max)).getFullYear()) {
                addClass([tdEle], DISABLED);
            }
            else if (!isNullOrUndefined(value) && localDate.getFullYear() === (value).getFullYear()) {
                addClass([tdEle], SELECTED);
            }
            else {
                if (localDate.getFullYear() === this.currentDate.getFullYear() && !tdEle.classList.contains(DISABLED)) {
                    addClass([tdEle], FOCUSEDDATE);
                }
            }
            if (!tdEle.classList.contains(DISABLED)) {
                EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.renderTemplate(tdEles, numCells, 'e-decade', e, value);
    };
    CalendarBase.prototype.dayCell = function (localDate) {
        var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
        var dateFormatOptions = { skeleton: 'full', type: 'dateTime', calendar: type };
        var date = this.globalize.parseDate(this.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
        var value = date.valueOf();
        var attrs = {
            className: CELL, attrs: { 'id': '' + getUniqueID('' + value), 'aria-selected': 'false', 'role': 'gridcell' }
        };
        return this.createElement('td', attrs);
    };
    CalendarBase.prototype.firstDay = function (date) {
        var collection = this.currentView() !== 'Decade' ? this.tableBodyElement.querySelectorAll('td' + ':not(.' + OTHERMONTH + '') :
            this.tableBodyElement.querySelectorAll('td' + ':not(.' + OTHERDECADE + '');
        if (collection.length) {
            for (var i = 0; i < collection.length; i++) {
                if (!collection[i].classList.contains(DISABLED)) {
                    date = new Date(parseInt(collection[i].id, 0));
                    break;
                }
            }
        }
        return date;
    };
    CalendarBase.prototype.lastDay = function (date, view) {
        var lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        if (view !== 2) {
            var timeOffset = Math.abs(lastDate.getTimezoneOffset() - this.firstDay(date).getTimezoneOffset());
            if (timeOffset) {
                lastDate.setHours(this.firstDay(date).getHours() + (timeOffset / 60));
            }
            return this.findLastDay(lastDate);
        }
        else {
            return this.findLastDay(this.firstDay(lastDate));
        }
    };
    
    CalendarBase.prototype.checkDateValue = function (value) {
        return (!isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    };
    CalendarBase.prototype.findLastDay = function (date) {
        var collection = this.currentView() === 'Decade' ? this.tableBodyElement.querySelectorAll('td' + ':not(.' + OTHERDECADE + '') :
            this.tableBodyElement.querySelectorAll('td' + ':not(.' + OTHERMONTH + '');
        if (collection.length) {
            for (var i = collection.length - 1; i >= 0; i--) {
                if (!collection[i].classList.contains(DISABLED)) {
                    date = new Date(parseInt(collection[i].id, 0));
                    break;
                }
            }
        }
        return date;
    };
    CalendarBase.prototype.removeTableHeadElement = function () {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.element.querySelectorAll('.e-content table thead')[0])) {
                detach(this.tableHeadElement);
            }
        }
        else {
            if (!isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content table thead')[0])) {
                detach(this.tableHeadElement);
            }
        }
    };
    CalendarBase.prototype.renderTemplate = function (elements, count, classNm, e, value) {
        var view = this.getViewNumber(this.currentView());
        var trEle;
        this.tableBodyElement = this.createElement('tbody');
        this.table.appendChild(this.tableBodyElement);
        removeClass([this.contentElement, this.headerElement], [MONTH, DECADE, YEAR]);
        addClass([this.contentElement, this.headerElement], [classNm]);
        var weekNumCell = 41;
        var numberCell = 35;
        var otherMonthCell = 6;
        var row = count;
        var rowIterator = 0;
        for (var dayCell = 0; dayCell < elements.length / count; ++dayCell) {
            trEle = this.createElement('tr', { attrs: { 'role': 'row' } });
            for (rowIterator = 0 + rowIterator; rowIterator < row; rowIterator++) {
                if (!elements[rowIterator].classList.contains('e-week-number') && !isNullOrUndefined(elements[rowIterator].children[0])) {
                    addClass([elements[rowIterator].children[0]], [LINK]);
                    rippleEffect(elements[rowIterator].children[0], {
                        duration: 600,
                        isCenterRipple: true
                    });
                }
                trEle.appendChild(elements[rowIterator]);
                if (this.weekNumber && rowIterator === otherMonthCell + 1 && elements[otherMonthCell + 1].classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (!this.weekNumber && rowIterator === otherMonthCell && elements[otherMonthCell].classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (this.weekNumber) {
                    if (rowIterator === weekNumCell && elements[weekNumCell].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                }
                else {
                    if (rowIterator === numberCell && elements[numberCell].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                }
            }
            row = row + count;
            rowIterator = rowIterator + 0;
            this.tableBodyElement.appendChild(trEle);
        }
        this.table.querySelector('tbody').className = this.effect;
        if (this.calendarMode === 'Gregorian') {
            this.iconHandler();
        }
        else {
            this.islamicModule.islamicIconHandler();
        }
        if (view !== this.getViewNumber(this.currentView()) || (view === 0 && view !== this.getViewNumber(this.currentView()))) {
            this.navigateHandler(e);
        }
        this.setAriaActiveDescendant();
    };
    CalendarBase.prototype.clickHandler = function (e, value) {
        this.clickEventEmitter(e);
        var eve = e.currentTarget;
        var view = this.getViewNumber(this.currentView());
        if (eve.classList.contains(OTHERMONTH)) {
            this.contentClick(e, 0, null, value);
        }
        else if (view === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
            this.contentClick(e, 1, null, value);
        }
        else if (2 === view) {
            this.contentClick(e, 1, null, value);
        }
        else if (!eve.classList.contains(OTHERMONTH) && view === 0) {
            this.selectDate(e, this.getIdValue(e, null), null);
        }
        else {
            this.contentClick(e, 0, eve, value);
        }
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    };
    // Content click event handler required for extended components
    CalendarBase.prototype.clickEventEmitter = function (e) {
        e.preventDefault();
    };
    CalendarBase.prototype.contentClick = function (e, view, element, value) {
        var currentView = this.getViewNumber(this.currentView());
        var d = this.getIdValue(e, element);
        switch (view) {
            case 0:
                if (currentView === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                    detach(this.tableBodyElement);
                    this.currentDate = d;
                    this.effect = ZOOMIN;
                    this.renderMonths(e);
                }
                else {
                    if (this.calendarMode === 'Gregorian') {
                        this.currentDate.setMonth(d.getMonth());
                        if (d.getMonth() > 0 && this.currentDate.getMonth() !== d.getMonth()) {
                            this.currentDate.setDate(0);
                        }
                        this.currentDate.setFullYear(d.getFullYear());
                    }
                    else {
                        this.currentDate = d;
                    }
                    this.effect = ZOOMIN;
                    detach(this.tableBodyElement);
                    this.renderMonths(e);
                }
                break;
            case 1:
                if (currentView === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                    this.selectDate(e, d, null);
                }
                else {
                    if (this.calendarMode === 'Gregorian') {
                        this.currentDate.setFullYear(d.getFullYear());
                    }
                    else {
                        var islamicDate = this.islamicModule.getIslamicDate(d);
                        this.currentDate = this.islamicModule.toGregorian(islamicDate.year, islamicDate.month, 1);
                    }
                    this.effect = ZOOMIN;
                    detach(this.tableBodyElement);
                    this.renderYears(e);
                }
        }
    };
    CalendarBase.prototype.switchView = function (view, e, multiSelection) {
        switch (view) {
            case 0:
                detach(this.tableBodyElement);
                this.renderMonths(e);
                if (multiSelection && !isNullOrUndefined(this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0])) {
                    this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0].classList.remove(FOCUSEDDATE);
                }
                break;
            case 1:
                detach(this.tableBodyElement);
                this.renderYears(e);
                break;
            case 2:
                detach(this.tableBodyElement);
                this.renderDecades(e);
        }
    };
    /**
     * To get component name
     * @private
     */
    CalendarBase.prototype.getModuleName = function () {
        return 'calendar';
    };
    /**
     * @deprecated
     */
    CalendarBase.prototype.requiredModules = function () {
        var modules = [];
        if (this) {
            modules.push({ args: [this], member: 'islamic' });
        }
        return modules;
    };
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    CalendarBase.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    CalendarBase.prototype.onPropertyChanged = function (newProp, oldProp, multiSelection, values) {
        this.effect = '';
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        if (this.getModuleName() === 'calendar') {
                            this.element.classList.add('e-rtl');
                        }
                        else {
                            this.calendarElement.classList.add('e-rtl');
                        }
                    }
                    else {
                        if (this.getModuleName() === 'calendar') {
                            this.element.classList.remove('e-rtl');
                        }
                        else {
                            this.calendarElement.classList.remove('e-rtl');
                        }
                    }
                    break;
                case 'dayHeaderFormat':
                    this.getCultureValues();
                    this.createContentHeader();
                    this.adjustLongHeaderSize();
                    break;
                case 'min':
                case 'max':
                    this.rangeValidation(this.min, this.max);
                    prop === 'min' ? this.setProperties({ min: this.checkDateValue(new Date(this.checkValue(newProp.min))) }, true) :
                        this.setProperties({ max: this.checkDateValue(new Date(this.checkValue(newProp.max))) }, true);
                    this.setProperties({ start: this.currentView() }, true);
                    detach(this.tableBodyElement);
                    this.minMaxUpdate();
                    if (multiSelection) {
                        this.validateValues(multiSelection, values);
                    }
                    this.createContentBody();
                    if ((this.todayDate < this.min || this.max < this.todayDate) && (this.footer) && (this.todayElement)) {
                        detach(this.todayElement);
                        detach(this.footer);
                        this.todayElement = this.footer = null;
                        this.createContentFooter();
                    }
                    else {
                        if ((this.footer) && (this.todayElement) && this.todayElement.classList.contains('e-disabled')) {
                            removeClass([this.todayElement], DISABLED);
                            detach(this.todayElement);
                            detach(this.footer);
                            this.todayElement = this.footer = null;
                            this.createContentFooter();
                        }
                    }
                    break;
                case 'start':
                case 'depth':
                case 'weekNumber':
                case 'firstDayOfWeek':
                    this.checkView();
                    this.createContentHeader();
                    this.createContentBody();
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.createContentHeader();
                    this.createContentBody();
                    this.l10.setLocale(this.locale);
                    this.updateFooter();
                    break;
                case 'showTodayButton':
                    if (newProp.showTodayButton) {
                        this.createContentFooter();
                    }
                    else {
                        if (!isNullOrUndefined(this.todayElement) && !isNullOrUndefined(this.footer)) {
                            detach(this.todayElement);
                            detach(this.footer);
                            this.todayElement = this.footer = undefined;
                        }
                    }
                    this.setProperties({ showTodayButton: newProp.showTodayButton }, true);
                    break;
            }
        }
    };
    /**
     * values property updated with considered disabled dates of the calendar.
     */
    CalendarBase.prototype.validateValues = function (multiSelection, values) {
        if (multiSelection && !isNullOrUndefined(values) && values.length > 0) {
            var copyValues = this.copyValues(values);
            for (var skipIndex = 0; skipIndex < copyValues.length; skipIndex++) {
                var tempValue = copyValues[skipIndex];
                var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                var tempValueString = void 0;
                if (this.calendarMode === 'Gregorian') {
                    /* tslint:disable-next-line:max-line-length */
                    tempValueString = this.globalize.formatDate(tempValue, { type: 'date', skeleton: 'yMd' });
                }
                else {
                    /* tslint:disable-next-line:max-line-length */
                    tempValueString = this.globalize.formatDate(tempValue, { type: 'dateTime', skeleton: 'full', calendar: 'islamic' });
                }
                var minFormatOption = { type: 'date', skeleton: 'yMd', calendar: type };
                var minStringValue = this.globalize.formatDate(this.min, minFormatOption);
                var minString = minStringValue;
                var maxFormatOption = { type: 'date', skeleton: 'yMd', calendar: type };
                var maxStringValue = this.globalize.formatDate(this.max, maxFormatOption);
                var maxString = maxStringValue;
                if (+new Date(tempValueString) < +new Date(minString) ||
                    +new Date(tempValueString) > +new Date(maxString)) {
                    copyValues.splice(skipIndex, 1);
                    skipIndex = -1;
                }
            }
            this.setProperties({ values: copyValues }, true);
        }
    };
    CalendarBase.prototype.setValueUpdate = function () {
        if (!isNullOrUndefined(this.tableBodyElement)) {
            detach(this.tableBodyElement);
            this.setProperties({ start: this.currentView() }, true);
            this.createContentBody();
        }
    };
    CalendarBase.prototype.copyValues = function (values) {
        var copyValues = [];
        if (!isNullOrUndefined(values) && values.length > 0) {
            for (var index = 0; index < values.length; index++) {
                copyValues.push(new Date(+values[index]));
            }
        }
        return copyValues;
    };
    CalendarBase.prototype.titleUpdate = function (date, view) {
        var globalize = new Internationalization(this.locale);
        var dayFormatOptions;
        var monthFormatOptions;
        var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
        if (this.calendarMode === 'Gregorian') {
            dayFormatOptions = globalize.formatDate(date, { type: 'dateTime', skeleton: 'yMMMM', calendar: type });
            monthFormatOptions = globalize.formatDate(date, { type: 'dateTime', skeleton: 'y', calendar: type });
        }
        else {
            dayFormatOptions = globalize.formatDate(date, { type: 'dateTime', format: 'MMMM y', calendar: type });
            monthFormatOptions = globalize.formatDate(date, { type: 'dateTime', format: 'y', calendar: type });
        }
        switch (view) {
            case 'days':
                this.headerTitleElement.textContent = this.toCapitalize(dayFormatOptions);
                break;
            case 'months':
                this.headerTitleElement.textContent = monthFormatOptions;
        }
    };
    CalendarBase.prototype.setActiveDescendant = function () {
        var id;
        var focusedEle = this.tableBodyElement.querySelector('tr td.e-focused-date');
        var selectedEle = this.tableBodyElement.querySelector('tr td.e-selected');
        var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
        var title;
        var view = this.currentView();
        if (view === 'Month') {
            title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: 'full', calendar: type });
        }
        else if (view === 'Year') {
            if (type !== 'islamic') {
                title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: 'yMMMM', calendar: type });
            }
            else {
                title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: 'GyMMM', calendar: type });
            }
        }
        else {
            title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: 'y', calendar: type });
        }
        if (selectedEle || focusedEle) {
            if (!isNullOrUndefined(selectedEle)) {
                selectedEle.setAttribute('aria-selected', 'true');
            }
            (focusedEle || selectedEle).setAttribute('aria-label', title);
            id = (focusedEle || selectedEle).getAttribute('id');
        }
        return id;
    };
    CalendarBase.prototype.iconHandler = function () {
        new Date(this.checkValue(this.currentDate)).setDate(1);
        switch (this.currentView()) {
            case 'Month':
                this.previousIconHandler(this.compareMonth(new Date(this.checkValue(this.currentDate)), this.min) < 1);
                this.nextIconHandler(this.compareMonth(new Date(this.checkValue(this.currentDate)), this.max) > -1);
                break;
            case 'Year':
                this.previousIconHandler(this.compareYear(new Date(this.checkValue(this.currentDate)), this.min) < 1);
                this.nextIconHandler(this.compareYear(new Date(this.checkValue(this.currentDate)), this.max) > -1);
                break;
            case 'Decade':
                this.previousIconHandler(this.compareDecade(new Date(this.checkValue(this.currentDate)), this.min) < 1);
                this.nextIconHandler(this.compareDecade(new Date(this.checkValue(this.currentDate)), this.max) > -1);
        }
    };
    /**
     * Destroys the widget.
     * @returns void
     */
    CalendarBase.prototype.destroy = function () {
        if (this.getModuleName() === 'calendar') {
            removeClass([this.element], [ROOT]);
        }
        else {
            if (this.calendarElement) {
                removeClass([this.element], [ROOT]);
            }
        }
        if (this.getModuleName() === 'calendar') {
            EventHandler.remove(this.headerTitleElement, 'click', this.navigateTitle);
            if (this.todayElement) {
                EventHandler.remove(this.todayElement, 'click', this.todayButtonClick);
            }
            this.previousIconHandler(true);
            this.nextIconHandler(true);
            this.keyboardModule.destroy();
            this.element.removeAttribute('data-role');
            (!isNullOrUndefined(this.calendarEleCopy.getAttribute('tabindex'))) ?
                this.element.setAttribute('tabindex', this.tabIndex) : this.element.removeAttribute('tabindex');
        }
        this.element.innerHTML = '';
        _super.prototype.destroy.call(this);
    };
    CalendarBase.prototype.title = function (e) {
        var currentView = this.getViewNumber(this.currentView());
        this.effect = ZOOMIN;
        this.switchView(++currentView, e);
    };
    CalendarBase.prototype.getViewNumber = function (stringVal) {
        if (stringVal === 'Month') {
            return 0;
        }
        else if (stringVal === 'Year') {
            return 1;
        }
        else {
            return 2;
        }
    };
    CalendarBase.prototype.navigateTitle = function (e) {
        e.preventDefault();
        this.title(e);
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    };
    CalendarBase.prototype.previous = function () {
        this.effect = '';
        var currentView = this.getViewNumber(this.currentView());
        switch (this.currentView()) {
            case 'Month':
                this.addMonths(this.currentDate, -1);
                this.switchView(currentView);
                break;
            case 'Year':
                this.addYears(this.currentDate, -1);
                this.switchView(currentView);
                break;
            case 'Decade':
                this.addYears(this.currentDate, -10);
                this.switchView(currentView);
                break;
        }
    };
    CalendarBase.prototype.navigatePrevious = function (e) {
        e.preventDefault();
        if (this.calendarMode === 'Gregorian') {
            this.previous();
        }
        else {
            this.islamicModule.islamicPrevious();
        }
        this.triggerNavigate(e);
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    };
    CalendarBase.prototype.next = function () {
        this.effect = '';
        var currentView = this.getViewNumber(this.currentView());
        switch (this.currentView()) {
            case 'Month':
                this.addMonths(this.currentDate, 1);
                this.switchView(currentView);
                break;
            case 'Year':
                this.addYears(this.currentDate, 1);
                this.switchView(currentView);
                break;
            case 'Decade':
                this.addYears(this.currentDate, 10);
                this.switchView(currentView);
                break;
        }
    };
    CalendarBase.prototype.navigateNext = function (eve) {
        eve.preventDefault();
        if (this.calendarMode === 'Gregorian') {
            this.next();
        }
        else {
            this.islamicModule.islamicNext();
        }
        this.triggerNavigate(eve);
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    };
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    CalendarBase.prototype.navigateTo = function (view, date) {
        if (+date >= +this.min && +date <= +this.max) {
            this.currentDate = date;
        }
        if (+date <= +this.min) {
            this.currentDate = new Date(this.checkValue(this.min));
        }
        if (+date >= +this.max) {
            this.currentDate = new Date(this.checkValue(this.max));
        }
        if ((this.getViewNumber(this.depth) >= this.getViewNumber(view))) {
            if ((this.getViewNumber(this.depth) <= this.getViewNumber(this.start))
                || this.getViewNumber(this.depth) === this.getViewNumber(view)) {
                view = this.depth;
            }
        }
        this.switchView(this.getViewNumber(view));
    };
    /**
     * Gets the current view of the Calendar.
     * @returns string
     */
    CalendarBase.prototype.currentView = function () {
        if (this.contentElement.classList.contains(YEAR)) {
            return 'Year';
        }
        else if (this.contentElement.classList.contains(DECADE)) {
            return 'Decade';
        }
        else {
            return 'Month';
        }
    };
    CalendarBase.prototype.getDateVal = function (date, value) {
        return (!isNullOrUndefined(value) && date.getDate() === (value).getDate()
            && date.getMonth() === (value).getMonth() && date.getFullYear() === (value).getFullYear());
    };
    CalendarBase.prototype.getCultureObjects = function (ld, c) {
        var gregorianFormat = '.dates.calendars.gregorian.days.format.' + this.dayHeaderFormat.toLowerCase();
        var islamicFormat = '.dates.calendars.islamic.days.format.' + this.dayHeaderFormat.toLowerCase();
        if (this.calendarMode === 'Gregorian') {
            return getValue('main.' + '' + this.locale + gregorianFormat, ld);
        }
        else {
            return getValue('main.' + '' + this.locale + islamicFormat, ld);
        }
    };
    
    CalendarBase.prototype.getWeek = function (d) {
        var currentDate = new Date(this.checkValue(d)).valueOf();
        var date = new Date(d.getFullYear(), 0, 1).valueOf();
        var a = (currentDate - date);
        return Math.ceil((((a) / dayMilliSeconds) + new Date(date).getDay() + 1) / 7);
    };
    CalendarBase.prototype.setStartDate = function (date, time) {
        var tzOffset = date.getTimezoneOffset();
        var d = new Date(date.getTime() + time);
        var tzOffsetDiff = d.getTimezoneOffset() - tzOffset;
        date.setTime(d.getTime() + tzOffsetDiff * minutesMilliSeconds);
    };
    CalendarBase.prototype.addMonths = function (date, i) {
        if (this.calendarMode === 'Gregorian') {
            var day = date.getDate();
            date.setDate(1);
            date.setMonth(date.getMonth() + i);
            date.setDate(Math.min(day, this.getMaxDays(date)));
        }
        else {
            var islamicDate = this.islamicModule.getIslamicDate(date);
            this.currentDate = this.islamicModule.toGregorian(islamicDate.year, (islamicDate.month) + i, 1);
        }
    };
    CalendarBase.prototype.addYears = function (date, i) {
        if (this.calendarMode === 'Gregorian') {
            var day = date.getDate();
            date.setDate(1);
            date.setFullYear(date.getFullYear() + i);
            date.setDate(Math.min(day, this.getMaxDays(date)));
        }
        else {
            var islamicDate = this.islamicModule.getIslamicDate(date);
            this.currentDate = this.islamicModule.toGregorian(islamicDate.year + i, (islamicDate.month), 1);
        }
    };
    CalendarBase.prototype.getIdValue = function (e, element) {
        var eve;
        if (e) {
            eve = e.currentTarget;
        }
        else {
            eve = element;
        }
        var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
        var dateFormatOptions = { type: 'dateTime', skeleton: 'full', calendar: type };
        var dateString = this.globalize.formatDate(new Date(parseInt('' + eve.getAttribute('id'), 0)), dateFormatOptions);
        var date = this.globalize.parseDate(dateString, dateFormatOptions);
        var value = date.valueOf() - date.valueOf() % 1000;
        return new Date(value);
        //return this.globalize.parseDate(dateString, dateFormatOptions);
    };
    CalendarBase.prototype.adjustLongHeaderSize = function () {
        removeClass([this.element], DAYHEADERLONG);
        if (this.dayHeaderFormat === 'Wide') {
            addClass([this.getModuleName() === 'calendar' ? this.element : this.calendarElement], DAYHEADERLONG);
        }
    };
    CalendarBase.prototype.selectDate = function (e, date, node, multiSelection, values) {
        var element = node || e.currentTarget;
        this.isDateSelected = false;
        if (this.currentView() === 'Decade') {
            this.setDateDecade(this.currentDate, date.getFullYear());
        }
        else if (this.currentView() === 'Year') {
            this.setDateYear(this.currentDate, date);
        }
        else {
            if (multiSelection && !this.checkPresentDate(date, values)) {
                var copyValues = this.copyValues(values);
                if (!isNullOrUndefined(values) && copyValues.length > 0) {
                    copyValues.push(new Date(this.checkValue(date)));
                    this.setProperties({ values: copyValues }, true);
                    this.setProperties({ value: values[values.length - 1] }, true);
                }
                else {
                    this.setProperties({ values: [new Date(this.checkValue(date))] }, true);
                }
            }
            else {
                this.setProperties({ value: new Date(this.checkValue(date)) }, true);
            }
            this.currentDate = new Date(this.checkValue(date));
        }
        var tableBodyElement = closest(element, '.' + ROOT);
        if (isNullOrUndefined(tableBodyElement)) {
            tableBodyElement = this.tableBodyElement;
        }
        if (!multiSelection && !isNullOrUndefined(tableBodyElement.querySelector('.' + SELECTED))) {
            removeClass([tableBodyElement.querySelector('.' + SELECTED)], SELECTED);
        }
        if (!multiSelection && !isNullOrUndefined(tableBodyElement.querySelector('.' + FOCUSEDDATE))) {
            removeClass([tableBodyElement.querySelector('.' + FOCUSEDDATE)], FOCUSEDDATE);
        }
        if (multiSelection) {
            var copyValues = this.copyValues(values);
            var collection = Array.prototype.slice.call(this.tableBodyElement.querySelectorAll('td'));
            for (var index = 0; index < collection.length; index++) {
                var tempElement = tableBodyElement.querySelectorAll('td' + '.' + FOCUSEDDATE)[0];
                var selectedElement = tableBodyElement.querySelectorAll('td' + '.' + SELECTED)[0];
                if (collection[index] === tempElement) {
                    removeClass([collection[index]], FOCUSEDDATE);
                }
                if (collection[index] === selectedElement &&
                    !this.checkPresentDate(new Date(parseInt(selectedElement.getAttribute('id').split('_')[0], 10)), values)) {
                    removeClass([collection[index]], SELECTED);
                }
            }
            if (element.classList.contains(SELECTED)) {
                removeClass([element], SELECTED);
                for (var i = 0; i < copyValues.length; i++) {
                    var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                    var formatOptions = { type: 'date', skeleton: 'short', calendar: type };
                    var localDateString = this.globalize.formatDate(date, formatOptions);
                    var tempDateString = this.globalize.formatDate(copyValues[i], formatOptions);
                    if (localDateString === tempDateString) {
                        var index = copyValues.indexOf(copyValues[i]);
                        copyValues.splice(index, 1);
                        addClass([element], FOCUSEDDATE);
                    }
                }
                this.setProperties({ values: copyValues }, true);
            }
            else {
                addClass([element], SELECTED);
            }
        }
        else {
            addClass([element], SELECTED);
        }
        this.isDateSelected = true;
    };
    CalendarBase.prototype.checkPresentDate = function (dates, values) {
        var previousValue = false;
        if (!isNullOrUndefined(values)) {
            for (var checkPrevious = 0; checkPrevious < values.length; checkPrevious++) {
                var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                /* tslint:disable-next-line:max-line-length */
                var localDateString = this.globalize.formatDate(dates, { type: 'date', skeleton: 'short', calendar: type });
                /* tslint:disable-next-line:max-line-length */
                var tempDateString = this.globalize.formatDate(values[checkPrevious], { type: 'date', skeleton: 'short', calendar: type });
                if (localDateString === tempDateString) {
                    previousValue = true;
                }
            }
        }
        return previousValue;
    };
    CalendarBase.prototype.setAriaActiveDescendant = function () {
        attributes(this.table, {
            'aria-activedescendant': '' + this.setActiveDescendant()
        });
    };
    CalendarBase.prototype.previousIconHandler = function (disabled) {
        if (disabled) {
            EventHandler.remove(this.previousIcon, 'click', this.navigatePreviousHandler);
            addClass([this.previousIcon], '' + DISABLED);
            addClass([this.previousIcon], '' + OVERLAY);
            this.previousIcon.setAttribute('aria-disabled', 'true');
        }
        else {
            EventHandler.add(this.previousIcon, 'click', this.navigatePreviousHandler);
            removeClass([this.previousIcon], '' + DISABLED);
            removeClass([this.previousIcon], '' + OVERLAY);
            this.previousIcon.setAttribute('aria-disabled', 'false');
        }
    };
    CalendarBase.prototype.renderDayCellEvent = function (args) {
        extend(this.renderDayCellArgs, { name: 'renderDayCell' });
        this.trigger('renderDayCell', args);
    };
    CalendarBase.prototype.navigatedEvent = function (eve) {
        extend(this.navigatedArgs, { name: 'navigated', event: eve });
        this.trigger('navigated', this.navigatedArgs);
    };
    CalendarBase.prototype.triggerNavigate = function (event) {
        this.navigatedArgs = { view: this.currentView(), date: this.currentDate };
        this.navigatedEvent(event);
    };
    CalendarBase.prototype.nextIconHandler = function (disabled) {
        if (disabled) {
            EventHandler.remove(this.nextIcon, 'click', this.navigateNextHandler);
            addClass([this.nextIcon], DISABLED);
            addClass([this.nextIcon], OVERLAY);
            this.nextIcon.setAttribute('aria-disabled', 'true');
        }
        else {
            EventHandler.add(this.nextIcon, 'click', this.navigateNextHandler);
            removeClass([this.nextIcon], DISABLED);
            removeClass([this.nextIcon], OVERLAY);
            this.nextIcon.setAttribute('aria-disabled', 'false');
        }
    };
    CalendarBase.prototype.compare = function (startDate, endDate, modifier) {
        var start = endDate.getFullYear();
        var end;
        var result;
        end = start;
        result = 0;
        if (modifier) {
            start = start - start % modifier;
            end = start - start % modifier + modifier - 1;
        }
        if (startDate.getFullYear() > end) {
            result = 1;
        }
        else if (startDate.getFullYear() < start) {
            result = -1;
        }
        return result;
    };
    CalendarBase.prototype.isMinMaxRange = function (date) {
        return +date >= +this.min && +date <= +this.max;
    };
    CalendarBase.prototype.isMonthYearRange = function (date) {
        if (this.calendarMode === 'Gregorian') {
            return date.getMonth() >= this.min.getMonth()
                && date.getFullYear() >= this.min.getFullYear()
                && date.getMonth() <= this.max.getMonth()
                && date.getFullYear() <= this.max.getFullYear();
        }
        else {
            var islamicDate = this.islamicModule.getIslamicDate(date);
            return islamicDate.month >= (this.islamicModule.getIslamicDate(new Date(1944, 1, 18))).month
                && islamicDate.year >= (this.islamicModule.getIslamicDate(new Date(1944, 1, 18))).year
                && islamicDate.month <= (this.islamicModule.getIslamicDate(new Date(2069, 1, 16))).month
                && islamicDate.year <= (this.islamicModule.getIslamicDate(new Date(2069, 1, 16))).year;
        }
    };
    CalendarBase.prototype.compareYear = function (start, end) {
        return this.compare(start, end, 0);
    };
    CalendarBase.prototype.compareDecade = function (start, end) {
        return this.compare(start, end, 10);
    };
    CalendarBase.prototype.shiftArray = function (array, i) {
        return array.slice(i).concat(array.slice(0, i));
    };
    CalendarBase.prototype.addDay = function (date, i, e, max, min) {
        var column = i;
        var value = new Date(+date);
        if (!isNullOrUndefined(this.tableBodyElement) && !isNullOrUndefined(e)) {
            while (this.findNextTD(new Date(+date), column, max, min)) {
                column += i;
            }
            var rangeValue = new Date(value.setDate(value.getDate() + column));
            column = (+rangeValue > +max || +rangeValue < +min) ? column === i ? i - i : i : column;
        }
        date.setDate(date.getDate() + column);
    };
    CalendarBase.prototype.findNextTD = function (date, column, max, min) {
        var value = new Date(date.setDate(date.getDate() + column));
        var collection = [];
        var isDisabled = false;
        if ((!isNullOrUndefined(value) && value.getMonth()) === (!isNullOrUndefined(this.currentDate) && this.currentDate.getMonth())) {
            var tdEles = void 0;
            if (this.calendarMode === 'Gregorian') {
                tdEles = this.renderDays(value, null);
            }
            else {
                tdEles = this.islamicModule.islamicRenderDays(this.currentDate, value);
            }
            collection = tdEles.filter(function (element) {
                return element.classList.contains(DISABLED);
            });
        }
        else {
            collection = this.tableBodyElement.querySelectorAll('td.' + DISABLED);
        }
        if (+value <= (+(max)) && +value >= (+(min))) {
            if (collection.length) {
                for (var i = 0; i < collection.length; i++) {
                    isDisabled = (+value === +new Date(parseInt(collection[i].id, 0))) ? true : false;
                    if (isDisabled) {
                        break;
                    }
                }
            }
        }
        return isDisabled;
    };
    CalendarBase.prototype.getMaxDays = function (d) {
        var date;
        var month;
        var tmpDate = new Date(this.checkValue(d));
        date = 28;
        month = tmpDate.getMonth();
        while (tmpDate.getMonth() === month) {
            ++date;
            tmpDate.setDate(date);
        }
        return date - 1;
    };
    CalendarBase.prototype.setDateDecade = function (date, year) {
        date.setFullYear(year);
        this.setProperties({ value: new Date(this.checkValue(date)) }, true);
    };
    
    CalendarBase.prototype.setDateYear = function (date, value) {
        date.setFullYear(value.getFullYear(), value.getMonth(), date.getDate());
        if (value.getMonth() !== date.getMonth()) {
            date.setDate(0);
            this.currentDate = new Date(this.checkValue(value));
        }
        this.setProperties({ value: new Date(this.checkValue(date)) }, true);
    };
    CalendarBase.prototype.compareMonth = function (start, end) {
        var result;
        if (start.getFullYear() > end.getFullYear()) {
            result = 1;
        }
        else if (start.getFullYear() < end.getFullYear()) {
            result = -1;
        }
        else {
            result = start.getMonth() === end.getMonth() ? 0 : start.getMonth() > end.getMonth() ? 1 : -1;
        }
        return result;
    };
    CalendarBase.prototype.checkValue = function (inValue) {
        if (inValue instanceof Date) {
            return (inValue.toUTCString());
        }
        else {
            return ('' + inValue);
        }
    };
    CalendarBase.prototype.checkView = function () {
        if (this.start !== 'Decade' && this.start !== 'Year') {
            this.setProperties({ start: 'Month' }, true);
        }
        if (this.depth !== 'Decade' && this.depth !== 'Year') {
            this.setProperties({ depth: 'Month' }, true);
        }
        if (this.getViewNumber(this.depth) > this.getViewNumber(this.start)) {
            this.setProperties({ depth: 'Month' }, true);
        }
    };
    __decorate([
        Property(new Date(1900, 0, 1))
    ], CalendarBase.prototype, "min", void 0);
    __decorate([
        Property(new Date(2099, 11, 31))
    ], CalendarBase.prototype, "max", void 0);
    __decorate([
        Property(null)
    ], CalendarBase.prototype, "firstDayOfWeek", void 0);
    __decorate([
        Property('Gregorian')
    ], CalendarBase.prototype, "calendarMode", void 0);
    __decorate([
        Property('Month')
    ], CalendarBase.prototype, "start", void 0);
    __decorate([
        Property('Month')
    ], CalendarBase.prototype, "depth", void 0);
    __decorate([
        Property(false)
    ], CalendarBase.prototype, "weekNumber", void 0);
    __decorate([
        Property(true)
    ], CalendarBase.prototype, "showTodayButton", void 0);
    __decorate([
        Property('Short')
    ], CalendarBase.prototype, "dayHeaderFormat", void 0);
    __decorate([
        Property(false)
    ], CalendarBase.prototype, "enablePersistence", void 0);
    __decorate([
        Property(null)
    ], CalendarBase.prototype, "keyConfigs", void 0);
    __decorate([
        Property(null)
    ], CalendarBase.prototype, "serverTimezoneOffset", void 0);
    __decorate([
        Event()
    ], CalendarBase.prototype, "created", void 0);
    __decorate([
        Event()
    ], CalendarBase.prototype, "destroyed", void 0);
    __decorate([
        Event()
    ], CalendarBase.prototype, "navigated", void 0);
    __decorate([
        Event()
    ], CalendarBase.prototype, "renderDayCell", void 0);
    CalendarBase = __decorate([
        NotifyPropertyChanges
    ], CalendarBase);
    return CalendarBase;
}(Component));
/**
 * Represents the Calendar component that allows the user to select a date.
 * ```html
 * <div id="calendar"/>
 * ```
 * ```typescript
 * <script>
 *   var calendarObj = new Calendar({ value: new Date() });
 *   calendarObj.appendTo("#calendar");
 * </script>
 * ```
 */
var Calendar = /** @__PURE__ @class */ (function (_super) {
    __extends(Calendar, _super);
    /**
     * Initialized new instance of Calendar Class.
     * Constructor for creating the widget
     * @param  {CalendarModel} options?
     * @param  {string|HTMLElement} element?
     */
    function Calendar(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    Calendar.prototype.render = function () {
        if (this.calendarMode === 'Islamic' && this.islamicModule === undefined) {
            throwError('Requires the injectable Islamic modules to render Calendar in Islamic mode');
        }
        if (this.isMultiSelection && typeof this.values === 'object' && !isNullOrUndefined(this.values) && this.values.length > 0) {
            var tempValues = [];
            var copyValues = [];
            for (var limit = 0; limit < this.values.length; limit++) {
                if (tempValues.indexOf(+this.values[limit]) === -1) {
                    tempValues.push(+this.values[limit]);
                    copyValues.push(this.values[limit]);
                }
            }
            this.setProperties({ values: copyValues }, true);
            for (var index = 0; index < this.values.length; index++) {
                if (!this.checkDateValue(this.values[index])) {
                    if (typeof (this.values[index]) === 'string' && this.checkDateValue(new Date(this.checkValue(this.values[index])))) {
                        var copyDate = new Date(this.checkValue(this.values[index]));
                        this.values.splice(index, 1);
                        this.values.splice(index, 0, copyDate);
                    }
                    else {
                        this.values.splice(index, 1);
                    }
                }
            }
            this.setProperties({ value: this.values[this.values.length - 1] }, true);
            this.previousValues = this.values.length;
        }
        this.validateDate();
        this.minMaxUpdate();
        _super.prototype.render.call(this);
        if (this.getModuleName() === 'calendar') {
            var form = closest(this.element, 'form');
            if (form) {
                EventHandler.add(form, 'reset', this.formResetHandler.bind(this));
            }
            this.setTimeZone(this.serverTimezoneOffset);
        }
        this.renderComplete();
    };
    Calendar.prototype.isDayLightSaving = function () {
        var secondOffset = new Date(this.value.getFullYear(), 6, 1).getTimezoneOffset();
        var firstOffset = new Date(this.value.getFullYear(), 0, 1).getTimezoneOffset();
        return (this.value.getTimezoneOffset() < Math.max(firstOffset, secondOffset));
    };
    Calendar.prototype.setTimeZone = function (offsetValue) {
        if (this.serverTimezoneOffset && this.value) {
            var serverTimezoneDiff = offsetValue;
            var clientTimeZoneDiff = new Date().getTimezoneOffset() / 60;
            var timeZoneDiff = serverTimezoneDiff + clientTimeZoneDiff;
            timeZoneDiff = this.isDayLightSaving() ? timeZoneDiff-- : timeZoneDiff;
            this.value = new Date(this.value.getTime() + (timeZoneDiff * 60 * 60 * 1000));
        }
    };
    Calendar.prototype.formResetHandler = function () {
        this.setProperties({ value: null }, true);
    };
    Calendar.prototype.validateDate = function () {
        if (typeof this.value === 'string') {
            this.setProperties({ value: this.checkDateValue(new Date(this.checkValue(this.value))) }, true); // persist the value property.
        }
        _super.prototype.validateDate.call(this, this.value);
        if (!isNullOrUndefined(this.value) && this.min <= this.max && this.value >= this.min && this.value <= this.max) {
            this.currentDate = new Date(this.checkValue(this.value));
        }
        if (isNaN(+this.value)) {
            this.setProperties({ value: null }, true);
        }
    };
    Calendar.prototype.minMaxUpdate = function () {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.value) && this.value <= this.min && this.min <= this.max) {
                this.setProperties({ value: this.min }, true);
                this.changedArgs = { value: this.value };
            }
            else {
                if (!isNullOrUndefined(this.value) && this.value >= this.max && this.min <= this.max) {
                    this.setProperties({ value: this.max }, true);
                    this.changedArgs = { value: this.value };
                }
            }
        }
        if (this.getModuleName() !== 'calendar' && !isNullOrUndefined(this.value)) {
            if (!isNullOrUndefined(this.value) && this.value < this.min && this.min <= this.max) {
                _super.prototype.minMaxUpdate.call(this, this.min);
            }
            else {
                if (!isNullOrUndefined(this.value) && this.value > this.max && this.min <= this.max) {
                    _super.prototype.minMaxUpdate.call(this, this.max);
                }
            }
        }
        else {
            _super.prototype.minMaxUpdate.call(this, this.value);
        }
    };
    Calendar.prototype.generateTodayVal = function (value) {
        var tempValue = new Date();
        if (value) {
            tempValue.setHours(value.getHours());
            tempValue.setMinutes(value.getMinutes());
            tempValue.setSeconds(value.getSeconds());
            tempValue.setMilliseconds(value.getMilliseconds());
        }
        else {
            tempValue = new Date(tempValue.getFullYear(), tempValue.getMonth(), tempValue.getDate(), 0, 0, 0, 0);
        }
        return tempValue;
    };
    Calendar.prototype.todayButtonClick = function () {
        if (this.showTodayButton) {
            var tempValue = this.generateTodayVal(this.value);
            this.setProperties({ value: tempValue }, true);
            if (this.isMultiSelection) {
                var copyValues = this.copyValues(this.values);
                if (!_super.prototype.checkPresentDate.call(this, tempValue, this.values)) {
                    copyValues.push(tempValue);
                    this.setProperties({ values: copyValues });
                }
            }
            _super.prototype.todayButtonClick.call(this, new Date(+this.value));
        }
    };
    Calendar.prototype.keyActionHandle = function (e) {
        _super.prototype.keyActionHandle.call(this, e, this.value, this.isMultiSelection);
    };
    /**
     * Initialize the event handler
     * @private
     */
    Calendar.prototype.preRender = function () {
        var _this = this;
        this.changeHandler = function (e) {
            _this.triggerChange(e);
        };
        this.checkView();
        _super.prototype.preRender.call(this, this.value);
    };
    
    /**
     * @deprecated
     */
    Calendar.prototype.createContent = function () {
        this.previousDate = this.value;
        this.previousDateTime = this.value;
        _super.prototype.createContent.call(this);
    };
    Calendar.prototype.minMaxDate = function (localDate) {
        return _super.prototype.minMaxDate.call(this, localDate);
    };
    Calendar.prototype.renderMonths = function (e) {
        _super.prototype.renderMonths.call(this, e, this.value);
    };
    Calendar.prototype.renderDays = function (currentDate, e) {
        var tempDays = _super.prototype.renderDays.call(this, currentDate, e, this.value, this.isMultiSelection, this.values);
        if (this.isMultiSelection) {
            _super.prototype.validateValues.call(this, this.isMultiSelection, this.values);
        }
        return tempDays;
    };
    Calendar.prototype.renderYears = function (e) {
        if (this.calendarMode === 'Gregorian') {
            _super.prototype.renderYears.call(this, e, this.value);
        }
        else {
            this.islamicModule.islamicRenderYears(e, this.value);
        }
    };
    Calendar.prototype.renderDecades = function (e) {
        if (this.calendarMode === 'Gregorian') {
            _super.prototype.renderDecades.call(this, e, this.value);
        }
        else {
            this.islamicModule.islamicRenderDecade(e, this.value);
        }
    };
    Calendar.prototype.renderTemplate = function (elements, count, classNm, e) {
        if (this.calendarMode === 'Gregorian') {
            _super.prototype.renderTemplate.call(this, elements, count, classNm, e, this.value);
        }
        else {
            this.islamicModule.islamicRenderTemplate(elements, count, classNm, e, this.value);
        }
        this.changedArgs = { value: this.value, values: this.values };
        this.changeHandler();
    };
    Calendar.prototype.clickHandler = function (e) {
        var eve = e.currentTarget;
        this.isPopupClicked = true;
        if (eve.classList.contains(OTHERMONTH)) {
            if (this.isMultiSelection) {
                var copyValues = this.copyValues(this.values);
                copyValues.push(this.getIdValue(e, null));
                this.setProperties({ values: copyValues }, true);
                this.setProperties({ value: this.values[this.values.length - 1] }, true);
            }
            else {
                this.setProperties({ value: this.getIdValue(e, null) }, true);
            }
        }
        var storeView = this.currentView();
        _super.prototype.clickHandler.call(this, e, this.value);
        if (this.isMultiSelection && this.currentDate !== this.value &&
            !isNullOrUndefined(this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0]) && storeView === 'Year') {
            this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0].classList.remove(FOCUSEDDATE);
        }
    };
    Calendar.prototype.switchView = function (view, e) {
        _super.prototype.switchView.call(this, view, e, this.isMultiSelection);
    };
    /**
     * To get component name
     * @private
     */
    Calendar.prototype.getModuleName = function () {
        _super.prototype.getModuleName.call(this);
        return 'calendar';
    };
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    Calendar.prototype.getPersistData = function () {
        _super.prototype.getPersistData.call(this);
        var keyEntity = ['value', 'values'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    Calendar.prototype.onPropertyChanged = function (newProp, oldProp) {
        this.effect = '';
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'value':
                    if (this.isDateSelected) {
                        if (typeof newProp.value === 'string') {
                            this.setProperties({ value: new Date(this.checkValue(newProp.value)) }, true);
                        }
                        else {
                            newProp.value = new Date(this.checkValue(newProp.value));
                        }
                        if (isNaN(+this.value)) {
                            this.setProperties({ value: oldProp.value }, true);
                        }
                        this.update();
                    }
                    break;
                case 'values':
                    if (this.isDateSelected) {
                        if (typeof newProp.values === 'string' || typeof newProp.values === 'number') {
                            this.setProperties({ values: null }, true);
                        }
                        else {
                            var copyValues = this.copyValues(this.values);
                            for (var index = 0; index < copyValues.length; index++) {
                                var tempDate = copyValues[index];
                                if (this.checkDateValue(tempDate) && !_super.prototype.checkPresentDate.call(this, tempDate, copyValues)) {
                                    copyValues.push(tempDate);
                                }
                            }
                            this.setProperties({ values: copyValues }, true);
                            if (this.values.length > 0) {
                                this.setProperties({ value: newProp.values[newProp.values.length - 1] }, true);
                            }
                        }
                        this.validateValues(this.isMultiSelection, this.values);
                        this.update();
                    }
                    break;
                case 'isMultiSelection':
                    if (this.isDateSelected) {
                        this.setProperties({ isMultiSelection: newProp.isMultiSelection }, true);
                        this.update();
                    }
                    break;
                default:
                    _super.prototype.onPropertyChanged.call(this, newProp, oldProp, this.isMultiSelection, this.values);
            }
        }
    };
    /**
     * Destroys the widget.
     * @returns void
     */
    Calendar.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.getModuleName() === 'calendar') {
            var form = closest(this.element, 'form');
            if (form) {
                EventHandler.remove(form, 'reset', this.formResetHandler.bind(this));
            }
        }
    };
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     * @deprecated
     */
    Calendar.prototype.navigateTo = function (view, date) {
        this.minMaxUpdate();
        _super.prototype.navigateTo.call(this, view, date);
    };
    /**
     * Gets the current view of the Calendar.
     * @returns string
     * @deprecated
     */
    Calendar.prototype.currentView = function () {
        return _super.prototype.currentView.call(this);
    };
    /**
     * This method is used to add the single or multiple dates to the values property of the Calendar.
     * @param  {Date || Date[]} dates - Specifies the date or dates to be added to the values property of the Calendar.
     * @returns void
     */
    Calendar.prototype.addDate = function (dates) {
        if (typeof dates !== 'string' && typeof dates !== 'number') {
            var copyValues = this.copyValues(this.values);
            if (typeof dates === 'object' && (dates).length > 0) {
                var tempDates = dates;
                for (var i = 0; i < tempDates.length; i++) {
                    if (this.checkDateValue(tempDates[i]) && !_super.prototype.checkPresentDate.call(this, tempDates[i], copyValues)) {
                        if (!isNullOrUndefined(copyValues) && copyValues.length > 0) {
                            copyValues.push(tempDates[i]);
                        }
                        else {
                            copyValues = [new Date(+tempDates[i])];
                        }
                    }
                }
            }
            else {
                if (this.checkDateValue(dates) && !_super.prototype.checkPresentDate.call(this, dates, copyValues)) {
                    if (!isNullOrUndefined(copyValues) && copyValues.length > 0) {
                        copyValues.push((dates));
                    }
                    else {
                        copyValues = [new Date(+dates)];
                    }
                }
            }
            this.setProperties({ values: copyValues }, true);
            if (this.isMultiSelection) {
                this.setProperties({ value: this.values[this.values.length - 1] }, true);
            }
            this.validateValues(this.isMultiSelection, copyValues);
            this.update();
            this.changedArgs = { value: this.value, values: this.values };
            this.changeHandler();
        }
    };
    /**
     * This method is used to remove the single or multiple dates from the values property of the Calendar.
     * @param  {Date || Date[]} dates - Specifies the date or dates which need to be removed from the values property of the Calendar.
     * @returns void
     */
    Calendar.prototype.removeDate = function (dates) {
        if (typeof dates !== 'string' && typeof dates !== 'number' && !isNullOrUndefined(this.values) && this.values.length > 0) {
            var copyValues = this.copyValues(this.values);
            if (typeof dates === 'object' && ((dates).length > 0)) {
                var tempDates = dates;
                for (var index = 0; index < tempDates.length; index++) {
                    for (var i = 0; i < copyValues.length; i++) {
                        if (+copyValues[i] === +tempDates[index]) {
                            copyValues.splice(i, 1);
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < copyValues.length; i++) {
                    if (+copyValues[i] === +dates) {
                        copyValues.splice(i, 1);
                    }
                }
            }
            this.setProperties({ values: copyValues }, false);
            this.update();
            if (this.isMultiSelection) {
                this.setProperties({ value: this.values[this.values.length - 1] }, true);
            }
            this.changedArgs = { value: this.value, values: this.values };
            this.changeHandler();
        }
    };
    Calendar.prototype.update = function () {
        this.validateDate();
        this.minMaxUpdate();
        _super.prototype.setValueUpdate.call(this);
    };
    Calendar.prototype.selectDate = function (e, date, element) {
        _super.prototype.selectDate.call(this, e, date, element, this.isMultiSelection, this.values);
        if (this.isMultiSelection && !isNullOrUndefined(this.values) && this.values.length > 0) {
            this.setProperties({ value: this.values[this.values.length - 1] }, true);
        }
        this.changedArgs = { value: this.value, values: this.values };
        this.changeHandler(e);
    };
    Calendar.prototype.changeEvent = function (e) {
        if ((this.value && this.value.valueOf()) !== (this.previousDate && +this.previousDate.valueOf())) {
            this.trigger('change', this.changedArgs);
            this.previousDate = new Date(+this.value);
        }
    };
    Calendar.prototype.triggerChange = function (e) {
        this.changedArgs.event = e || null;
        this.changedArgs.isInteracted = !isNullOrUndefined(e);
        if (!isNullOrUndefined(this.value)) {
            this.setProperties({ value: this.value }, true);
        }
        if (!this.isMultiSelection && +this.value !== Number.NaN && (+this.value !== +this.previousDate || this.previousDate == null
            && !isNaN(+this.value))) {
            this.changeEvent(e);
        }
        else if (!isNullOrUndefined(this.values) && this.previousValues !== this.values.length) {
            this.changeEvent(e);
            this.previousValues = this.values.length;
        }
    };
    __decorate([
        Property(null)
    ], Calendar.prototype, "value", void 0);
    __decorate([
        Property(null)
    ], Calendar.prototype, "values", void 0);
    __decorate([
        Property(false)
    ], Calendar.prototype, "isMultiSelection", void 0);
    __decorate([
        Event()
    ], Calendar.prototype, "change", void 0);
    Calendar = __decorate([
        NotifyPropertyChanges
    ], Calendar);
    return Calendar;
}(CalendarBase));

/**
 *
 */
//class constant defination.
var OTHERMONTH$1 = 'e-other-month';
var YEAR$1 = 'e-year';
var MONTH$1 = 'e-month';
var DECADE$1 = 'e-decade';
var DISABLED$1 = 'e-disabled';
var OVERLAY$1 = 'e-overlay';
var WEEKEND$1 = 'e-weekend';
var WEEKNUMBER$1 = 'e-week-number';
var SELECTED$1 = 'e-selected';
var FOCUSEDDATE$1 = 'e-focused-date';
var OTHERMONTHROW$1 = 'e-month-hide';
var TODAY$1 = 'e-today';
var LINK$1 = 'e-day';
var CELL$1 = 'e-cell';
var dayMilliSeconds$1 = 86400000;
var minDecade = 2060;
var maxDecade = 2069;
var Islamic = /** @__PURE__ @class */ (function () {
    function Islamic(instance) {
        this.calendarInstance = instance;
    }
    Islamic.prototype.getModuleName = function () {
        return 'islamic';
    };
    Islamic.prototype.islamicTitleUpdate = function (date, view) {
        var globalize = new Internationalization(this.calendarInstance.locale);
        switch (view) {
            case 'days':
                /* tslint:disable-next-line:max-line-length */
                this.calendarInstance.headerTitleElement.textContent = globalize.formatDate(date, { type: 'dateTime', format: 'MMMMyyyy', calendar: 'islamic' });
                break;
            case 'months':
                /* tslint:disable-next-line:max-line-length */
                this.calendarInstance.headerTitleElement.textContent = globalize.formatDate(date, { type: 'dateTime', format: 'yyyy', calendar: 'islamic' });
        }
    };
    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    Islamic.prototype.islamicRenderDays = function (currentDate, value, multiSelection, values) {
        var tdEles = [];
        var cellsCount = 42;
        var localDate = new Date(this.islamicInValue(currentDate));
        var minMaxDate;
        var numCells = this.calendarInstance.weekNumber ? 8 : 7;
        // 8 and 7 denotes the number of columns to be specified.
        this.islamicTitleUpdate(currentDate, 'days');
        /* tslint:disable-next-line:no-any */
        var islamicDate = this.getIslamicDate(localDate);
        var gregorianObject = this.toGregorian(islamicDate.year, islamicDate.month, 1);
        var currentMonth = islamicDate.month;
        localDate = gregorianObject;
        while (localDate.getDay() !== this.calendarInstance.firstDayOfWeek) {
            this.calendarInstance.setStartDate(localDate, -1 * dayMilliSeconds$1);
        }
        for (var day = 0; day < cellsCount; ++day) {
            var weekEle = this.calendarInstance.createElement('td', { className: CELL$1 });
            var weekAnchor = this.calendarInstance.createElement('span');
            if (day % 7 === 0 && this.calendarInstance.weekNumber) {
                weekAnchor.textContent = '' + this.calendarInstance.getWeek(localDate);
                weekEle.appendChild(weekAnchor);
                addClass([weekEle], '' + WEEKNUMBER$1);
                tdEles.push(weekEle);
            }
            minMaxDate = new Date(+localDate);
            localDate = this.calendarInstance.minMaxDate(localDate);
            /* tslint:disable-next-line:max-line-length */
            var dateFormatOptions = { type: 'dateTime', skeleton: 'full', calendar: 'islamic' };
            var date = this.calendarInstance.globalize.parseDate(this.calendarInstance.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
            var tdEle = this.islamicDayCell(localDate);
            /* tslint:disable-next-line:max-line-length */
            var title = this.calendarInstance.globalize.formatDate(localDate, { type: 'date', skeleton: 'full', calendar: 'islamic' });
            var dayLink = this.calendarInstance.createElement('span');
            /* tslint:disable-next-line:max-line-length */
            dayLink.textContent = this.calendarInstance.globalize.formatDate(localDate, { type: 'date', skeleton: 'd', calendar: 'islamic' });
            var disabled = (this.calendarInstance.min > localDate) || (this.calendarInstance.max < localDate);
            if (disabled) {
                addClass([tdEle], DISABLED$1);
                addClass([tdEle], OVERLAY$1);
            }
            else {
                dayLink.setAttribute('title', '' + title);
            }
            /* tslint:disable-next-line:no-any */
            var hijriMonthObject = this.getIslamicDate(localDate);
            if (currentMonth !== hijriMonthObject.month) {
                addClass([tdEle], OTHERMONTH$1);
            }
            if (localDate.getDay() === 0 || localDate.getDay() === 6) {
                addClass([tdEle], WEEKEND$1);
            }
            tdEle.appendChild(dayLink);
            this.calendarInstance.renderDayCellArgs = {
                date: localDate,
                isDisabled: false,
                element: tdEle,
                isOutOfRange: disabled
            };
            var argument = this.calendarInstance.renderDayCellArgs;
            this.calendarInstance.renderDayCellEvent(argument);
            if (argument.isDisabled) {
                if (this.calendarInstance.isMultiSelection) {
                    if (!isNullOrUndefined(this.calendarInstance.values) && this.calendarInstance.values.length > 0) {
                        for (var index = 0; index < values.length; index++) {
                            /* tslint:disable-next-line:max-line-length */
                            var localDateString = +new Date(this.calendarInstance.globalize.formatDate(argument.date, { type: 'date', skeleton: 'yMd', calendar: 'islamic' }));
                            /* tslint:disable-next-line:max-line-length */
                            var tempDateString = +new Date(this.calendarInstance.globalize.formatDate(this.calendarInstance.values[index], { type: 'date', skeleton: 'yMd', calendar: 'islamic' }));
                            if (localDateString === tempDateString) {
                                this.calendarInstance.values.splice(index, 1);
                                index = -1;
                            }
                        }
                    }
                }
                else if (value && +value === +argument.date) {
                    this.calendarInstance.setProperties({ value: null }, true);
                }
            }
            if (this.calendarInstance.renderDayCellArgs.isDisabled && !tdEle.classList.contains(SELECTED$1)) {
                addClass([tdEle], DISABLED$1);
                addClass([tdEle], OVERLAY$1);
                if (+this.calendarInstance.renderDayCellArgs.date === +this.calendarInstance.todayDate) {
                    this.calendarInstance.todayDisabled = true;
                }
            }
            var otherMnthBool = tdEle.classList.contains(OTHERMONTH$1);
            var disabledCls = tdEle.classList.contains(DISABLED$1);
            if (!disabledCls) {
                EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
            }
            if (this.calendarInstance.isMultiSelection && !isNullOrUndefined(this.calendarInstance.values) &&
                !otherMnthBool && !disabledCls) {
                for (var tempValue = 0; tempValue < this.calendarInstance.values.length; tempValue++) {
                    /* tslint:disable-next-line:max-line-length */
                    var localDateString = this.calendarInstance.globalize.formatDate(localDate, { type: 'date', skeleton: 'short', calendar: 'islamic' });
                    var tempDateString = this.calendarInstance.globalize.formatDate(this.calendarInstance.values[tempValue], { type: 'date', skeleton: 'short', calendar: 'islamic' });
                    if (localDateString === tempDateString &&
                        this.calendarInstance.getDateVal(localDate, this.calendarInstance.values[tempValue])) {
                        addClass([tdEle], SELECTED$1);
                    }
                    else {
                        this.calendarInstance.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
                    }
                }
                if (this.calendarInstance.values.length <= 0) {
                    this.calendarInstance.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
                }
            }
            else if (!otherMnthBool && !disabledCls && this.calendarInstance.getDateVal(localDate, value)) {
                addClass([tdEle], SELECTED$1);
            }
            else {
                this.calendarInstance.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
            }
            if (date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
                if (date.getFullYear() === new Date().getFullYear()) {
                    addClass([tdEle], TODAY$1);
                }
            }
            localDate = new Date(+minMaxDate);
            tdEles.push(this.calendarInstance.renderDayCellArgs.element);
            this.calendarInstance.addDay(localDate, 1, null, this.calendarInstance.max, this.calendarInstance.min);
        }
        return tdEles;
    };
    Islamic.prototype.islamicIconHandler = function () {
        new Date(this.islamicInValue(this.calendarInstance.currentDate)).setDate(1);
        var date = new Date(this.islamicInValue(this.calendarInstance.currentDate));
        switch (this.calendarInstance.currentView()) {
            case 'Month':
                var prevMonthCompare = this.islamicCompareMonth(date, this.calendarInstance.min) < 1;
                var nextMonthCompare = this.islamicCompareMonth(date, this.calendarInstance.max) > -1;
                this.calendarInstance.previousIconHandler(prevMonthCompare);
                this.calendarInstance.nextIconHandler(nextMonthCompare);
                break;
            case 'Year':
                var prevYearCompare = this.hijriCompareYear(date, this.calendarInstance.min) < 1;
                var nextYearCompare = this.hijriCompareYear(date, this.calendarInstance.max) > -1;
                this.calendarInstance.previousIconHandler(prevYearCompare);
                this.calendarInstance.nextIconHandler(nextYearCompare);
                break;
            case 'Decade':
                var prevDecadeCompare = this.hijriCompareDecade(date, this.calendarInstance.min) < 1;
                var nextDecadeCompare = this.hijriCompareDecade(date, this.calendarInstance.max) > -1;
                this.calendarInstance.previousIconHandler(prevDecadeCompare);
                this.calendarInstance.nextIconHandler(nextDecadeCompare);
        }
    };
    Islamic.prototype.islamicNext = function () {
        this.calendarInstance.effect = '';
        var view = this.calendarInstance.getViewNumber(this.calendarInstance.currentView());
        /* tslint:disable-next-line:no-any */
        var islamicDate = this.getIslamicDate(this.calendarInstance.currentDate);
        switch (this.calendarInstance.currentView()) {
            case 'Year':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year + 1, islamicDate.month, 1);
                this.calendarInstance.switchView(view);
                break;
            case 'Month':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year, islamicDate.month + 1, 1);
                this.calendarInstance.switchView(view);
                break;
            case 'Decade':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year + 10, islamicDate.month, 1);
                this.calendarInstance.switchView(view);
                break;
        }
    };
    Islamic.prototype.islamicPrevious = function () {
        var currentView = this.calendarInstance.getViewNumber(this.calendarInstance.currentView());
        this.calendarInstance.effect = '';
        /* tslint:disable-next-line:no-any */
        var islamicDate = this.getIslamicDate(this.calendarInstance.currentDate);
        switch (this.calendarInstance.currentView()) {
            case 'Month':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year, islamicDate.month - 1, 1);
                this.calendarInstance.switchView(currentView);
                break;
            case 'Year':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year - 1, islamicDate.month, 1);
                this.calendarInstance.switchView(currentView);
                break;
            case 'Decade':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year - 10, islamicDate.month - 1, 1);
                this.calendarInstance.switchView(currentView);
                break;
        }
    };
    Islamic.prototype.islamicRenderYears = function (e, value) {
        this.calendarInstance.removeTableHeadElement();
        var numCells = 4;
        var tdEles = [];
        var valueUtil = isNullOrUndefined(value);
        var curDate = new Date(this.islamicInValue(this.calendarInstance.currentDate));
        var localDate = curDate;
        /* tslint:disable-next-line:no-any */
        var islamicDate = this.getIslamicDate(localDate);
        var gregorianObject = HijriParser.toGregorian(islamicDate.year, 1, 1);
        localDate = gregorianObject;
        var mon = islamicDate.month;
        var yr = islamicDate.year;
        var curYrs = islamicDate.year;
        /* tslint:disable-next-line:no-any */
        var minYr = (this.getIslamicDate(this.calendarInstance.min)).year;
        /* tslint:disable-next-line:no-any */
        var minMonth = (this.getIslamicDate(this.calendarInstance.min)).month;
        /* tslint:disable-next-line:no-any */
        var maxYr = (this.getIslamicDate(this.calendarInstance.max)).year;
        /* tslint:disable-next-line:no-any */
        var maxMonth = (this.getIslamicDate(this.calendarInstance.max)).month;
        this.islamicTitleUpdate(this.calendarInstance.currentDate, 'months');
        var disabled = (this.calendarInstance.min > localDate) || (this.calendarInstance.max < localDate);
        for (var month = 1; month <= 12; ++month) {
            /* tslint:disable-next-line:no-any */
            var islamicDate_1 = this.getIslamicDate(localDate);
            var gregorianObject_1 = HijriParser.toGregorian(islamicDate_1.year, month, 1);
            localDate = gregorianObject_1;
            var tdEle = this.islamicDayCell(localDate);
            var dayLink = this.calendarInstance.createElement('span');
            /* tslint:disable-next-line:max-line-length */
            /* tslint:disable-next-line:no-any */
            var localMonth = (value && (this.getIslamicDate(value)).month === (this.getIslamicDate(localDate)).month);
            /* tslint:disable-next-line:no-any  tslint:disable-next-line:max-line-length */
            var select$$1 = (value && (this.getIslamicDate(value)).year === yr && localMonth);
            /* tslint:disable-next-line:max-line-length */
            dayLink.textContent = this.calendarInstance.globalize.formatDate(localDate, { type: 'dateTime', format: 'MMM', calendar: 'islamic' });
            if ((this.calendarInstance.min && (curYrs < minYr || (month < minMonth && curYrs === minYr))) || (this.calendarInstance.max && (curYrs > maxYr || (month > maxMonth && curYrs >= maxYr)))) {
                addClass([tdEle], DISABLED$1);
            }
            else if (!valueUtil && select$$1) {
                addClass([tdEle], SELECTED$1);
            }
            else {
                /* tslint:disable-next-line:no-any */
                if ((this.getIslamicDate(localDate)).month === mon &&
                    /* tslint:disable-next-line:no-any */
                    (this.getIslamicDate(this.calendarInstance.currentDate)).month === mon) {
                    addClass([tdEle], FOCUSEDDATE$1);
                }
            }
            if (!tdEle.classList.contains(DISABLED$1)) {
                EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.islamicRenderTemplate(tdEles, numCells, YEAR$1, e, value);
    };
    Islamic.prototype.islamicRenderDecade = function (e, value) {
        this.calendarInstance.removeTableHeadElement();
        var numCells = 4;
        var yearCell = 12;
        var tdEles = [];
        var localDate = new Date(this.islamicInValue(this.calendarInstance.currentDate));
        /* tslint:disable-next-line:no-any */
        var islamicDate = this.getIslamicDate(localDate);
        var gregorianObject = HijriParser.toGregorian(islamicDate.year, 1, 1);
        localDate = gregorianObject;
        var localYr = localDate.getFullYear();
        var startYr = new Date(this.islamicInValue((localYr - localYr % 10)));
        var endYr = new Date(this.islamicInValue((localYr - localYr % 10 + (10 - 1))));
        var startFullYr = startYr.getFullYear();
        var endFullYr = endYr.getFullYear();
        /* tslint:disable-next-line:max-line-length */
        var startHdrYr = this.calendarInstance.globalize.formatDate(startYr, { type: 'dateTime', format: 'y', calendar: 'islamic' });
        var endHdrYr = this.calendarInstance.globalize.formatDate(endYr, { type: 'dateTime', format: 'y', calendar: 'islamic' });
        this.calendarInstance.headerTitleElement.textContent = startHdrYr + ' - ' + (endHdrYr);
        var start = new Date(localYr - (localYr % 10) - 2, 0, 1);
        var startYear = start.getFullYear();
        for (var rowCount = 1; rowCount <= yearCell; ++rowCount) {
            var year = startYear + rowCount;
            localDate.setFullYear(year);
            localDate.setDate(1);
            localDate.setMonth(0);
            /* tslint:disable-next-line:no-any */
            var islamicDate_2 = this.getIslamicDate(localDate);
            var gregorianObject_2 = HijriParser.toGregorian(islamicDate_2.year, 1, 1);
            localDate = gregorianObject_2;
            var tdEle = this.islamicDayCell(localDate);
            attributes(tdEle, { 'role': 'gridcell' });
            var dayLink = this.calendarInstance.createElement('span');
            /* tslint:disable-next-line:max-line-length */
            dayLink.textContent = this.calendarInstance.globalize.formatDate(localDate, { type: 'dateTime', format: 'y', calendar: 'islamic' });
            /* tslint:disable-next-line:no-any */
            if ((year < startFullYr) || (year > endFullYr)) {
                addClass([tdEle], OTHERMONTH$1);
            }
            else if (year < new Date(this.islamicInValue(this.calendarInstance.min)).getFullYear()
                || year > new Date(this.islamicInValue(this.calendarInstance.max)).getFullYear()) {
                addClass([tdEle], DISABLED$1);
            }
            else if (!isNullOrUndefined(value) &&
                /* tslint:disable-next-line:no-any */
                (this.getIslamicDate(localDate)).year ===
                    /* tslint:disable-next-line:no-any */
                    (this.getIslamicDate(value)).year) {
                addClass([tdEle], SELECTED$1);
            }
            else {
                if (localDate.getFullYear() === this.calendarInstance.currentDate.getFullYear() && !tdEle.classList.contains(DISABLED$1)) {
                    addClass([tdEle], FOCUSEDDATE$1);
                }
            }
            if (!tdEle.classList.contains(DISABLED$1)) {
                EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.islamicRenderTemplate(tdEles, numCells, 'e-decade', e, value);
    };
    Islamic.prototype.islamicDayCell = function (localDate) {
        var dateFormatOptions = { skeleton: 'full', type: 'dateTime', calendar: 'islamic' };
        var formatDate = this.calendarInstance.globalize.formatDate(localDate, dateFormatOptions);
        var date = this.calendarInstance.globalize.parseDate(formatDate, dateFormatOptions);
        var value = date.valueOf();
        var attrs = {
            className: CELL$1, attrs: { 'id': '' + getUniqueID('' + value), 'aria-selected': 'false', 'role': 'gridcell' }
        };
        return this.calendarInstance.createElement('td', attrs);
    };
    Islamic.prototype.islamicRenderTemplate = function (elements, count, classNm, e, value) {
        var view = this.calendarInstance.getViewNumber(this.calendarInstance.currentView());
        var trEle;
        this.calendarInstance.tableBodyElement = this.calendarInstance.createElement('tbody');
        this.calendarInstance.table.appendChild(this.calendarInstance.tableBodyElement);
        removeClass([this.calendarInstance.contentElement, this.calendarInstance.headerElement], [MONTH$1, DECADE$1, YEAR$1]);
        addClass([this.calendarInstance.contentElement, this.calendarInstance.headerElement], [classNm]);
        var weekNumCell = 41;
        var numberCell = 35;
        var otherMonthCell = 6;
        var row = count;
        var rowCount = 0;
        for (var dayCell = 0; dayCell < elements.length / count; ++dayCell) {
            trEle = this.calendarInstance.createElement('tr', { attrs: { 'role': 'row' } });
            for (rowCount = 0 + rowCount; rowCount < row; rowCount++) {
                if (!elements[rowCount].classList.contains('e-week-number') && !isNullOrUndefined(elements[rowCount].children[0])) {
                    addClass([elements[rowCount].children[0]], [LINK$1]);
                    rippleEffect(elements[rowCount].children[0], {
                        duration: 600,
                        isCenterRipple: true
                    });
                }
                trEle.appendChild(elements[rowCount]);
                if (this.calendarInstance.weekNumber &&
                    rowCount === otherMonthCell + 1 && elements[otherMonthCell + 1].classList.contains(OTHERMONTH$1)) {
                    addClass([trEle], OTHERMONTHROW$1);
                }
                if (!this.calendarInstance.weekNumber
                    && rowCount === otherMonthCell && elements[otherMonthCell].classList.contains(OTHERMONTH$1)) {
                    addClass([trEle], OTHERMONTHROW$1);
                }
                if (this.calendarInstance.weekNumber) {
                    if (rowCount === weekNumCell && elements[weekNumCell].classList.contains(OTHERMONTH$1)) {
                        addClass([trEle], OTHERMONTHROW$1);
                    }
                }
                else {
                    if (rowCount === numberCell && elements[numberCell].classList.contains(OTHERMONTH$1)) {
                        addClass([trEle], OTHERMONTHROW$1);
                    }
                }
            }
            row = row + count;
            rowCount = rowCount + 0;
            this.calendarInstance.tableBodyElement.appendChild(trEle);
        }
        this.calendarInstance.table.querySelector('tbody').className = this.calendarInstance.effect;
        this.islamicIconHandler();
        if (view !== this.calendarInstance.getViewNumber(this.calendarInstance.currentView())
            || (view === 0 && view !== this.calendarInstance.getViewNumber(this.calendarInstance.currentView()))) {
            this.calendarInstance.navigateHandler(e);
        }
        this.calendarInstance.setAriaActiveDescendant();
        this.calendarInstance.changedArgs = { value: this.calendarInstance.value, values: this.calendarInstance.values };
        this.calendarInstance.changeHandler();
    };
    Islamic.prototype.islamicCompareMonth = function (start, end) {
        /* tslint:disable-next-line:no-any */
        var hijriStart = (this.getIslamicDate(start));
        /* tslint:disable-next-line:no-any */
        var hijriEnd = (this.getIslamicDate(end));
        var result;
        if (hijriStart.year > hijriEnd.year) {
            result = 1;
        }
        else if (hijriStart.year < hijriEnd.year) {
            result = -1;
        }
        else {
            result = hijriStart.month === hijriEnd.month ? 0 : hijriStart.month > hijriEnd.month ? 1 : -1;
        }
        return result;
    };
    
    Islamic.prototype.islamicCompare = function (startDate, endDate, modifier) {
        /* tslint:disable-next-line:no-any */
        var hijriStart = this.getIslamicDate(startDate);
        /* tslint:disable-next-line:no-any */
        var hijriEnd = this.getIslamicDate(endDate);
        var start = hijriEnd.year;
        var end;
        var result;
        end = start;
        result = 0;
        if (modifier) {
            start = start - start % modifier;
            end = start - start % modifier + modifier - 1;
        }
        if (hijriStart.year > end) {
            result = 1;
        }
        else if ((this.calendarInstance.currentView() === 'Decade') && hijriStart.year < start &&
            !((startDate.getFullYear() >= minDecade && startDate.getFullYear() <= maxDecade))) {
            result = -1;
        }
        else if (hijriStart.year < start && (this.calendarInstance.currentView() === 'Year')) {
            result = -1;
        }
        return result;
    };
    
    /* tslint:disable-next-line:no-any */
    Islamic.prototype.getIslamicDate = function (date) {
        /* tslint:disable-next-line:no-any */
        return (HijriParser.getHijriDate(date));
    };
    Islamic.prototype.toGregorian = function (year, month, date) {
        return HijriParser.toGregorian(year, month, date);
    };
    Islamic.prototype.hijriCompareYear = function (start, end) {
        return this.islamicCompare(start, end, 0);
    };
    Islamic.prototype.hijriCompareDecade = function (start, end) {
        return this.islamicCompare(start, end, 10);
    };
    
    Islamic.prototype.destroy = function () {
        this.calendarInstance = null;
    };
    Islamic.prototype.islamicInValue = function (inValue) {
        if (inValue instanceof Date) {
            return (inValue.toUTCString());
        }
        else {
            return ('' + inValue);
        }
    };
    return Islamic;
}());

/**
 * Calendar modules
 */

var __extends$1 = (undefined && undefined.__extends) || (function () {
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
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../calendar/calendar-model.d.ts'/>
// tslint:disable-next-line
//class constant defination
var DATEWRAPPER = 'e-date-wrapper';
var ROOT$1 = 'e-datepicker';
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
var SELECTED$2 = 'e-selected';
var FOCUSEDDATE$2 = 'e-focused-date';
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
var DatePicker = /** @__PURE__ @class */ (function (_super) {
    __extends$1(DatePicker, _super);
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
        this.setTimeZone(this.serverTimezoneOffset);
    };
    DatePicker.prototype.setTimeZone = function (offsetValue) {
        if (this.serverTimezoneOffset && this.value) {
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
            attributes(this.inputElement, { 'readonly': '' });
        }
        this.updateIconState();
    };
    DatePicker.prototype.updateIconState = function () {
        if (!this.allowEdit && this.inputWrapper && !this.readonly) {
            if (this.inputElement.value === '') {
                removeClass([this.inputWrapper.container], [NONEDIT]);
            }
            else {
                addClass([this.inputWrapper.container], [NONEDIT]);
            }
        }
        else if (this.inputWrapper) {
            removeClass([this.inputWrapper.container], [NONEDIT]);
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
            Input.bindInitialEvent({
                element: this.inputElement,
                floatLabelType: this.floatLabelType
            });
            if (this.showClearButton && this.inputWrapper.clearButton) {
                Input.wireClearBtnEvents(this.inputElement, this.inputWrapper.clearButton, this.inputWrapper.container);
            }
            this.setAllowEdit();
        }
        this.previousElementValue = this.inputElement.value;
        this.previousDate = new Date(+this.value);
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
            this.globalize = new Internationalization(this.locale);
            this.l10n = new L10n('datepicker', l10nLocale, this.locale);
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
        this.inputWrapper = Input.createInput({
            element: this.inputElement,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: this.cssClass,
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
        attributes(this.inputElement, ariaAttrs);
        if (!this.enabled) {
            this.inputElement.setAttribute('aria-disabled', 'true');
            this.inputElement.tabIndex = -1;
        }
        else {
            this.inputElement.setAttribute('aria-disabled', 'false');
            this.inputElement.setAttribute('tabindex', this.tabIndex);
        }
        Input.addAttributes({ 'aria-label': 'select' }, this.inputWrapper.buttons[0]);
        addClass([this.inputWrapper.container], DATEWRAPPER);
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
        if (!isNullOrUndefined(this.value)) {
            var dateValue = this.value;
            var dateString = void 0;
            var tempFormat = !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat;
            if (this.getModuleName() === 'datetimepicker') {
                if (this.calendarMode === 'Gregorian') {
                    dateString = this.globalize.formatDate(this.value, {
                        format: tempFormat, type: 'dateTime', skeleton: 'yMd'
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
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
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
        if (isNullOrUndefined(this.value) && this.strictMode) {
            this.updateInputValue('');
        }
        if (!this.strictMode && isNullOrUndefined(this.value) && this.invalidValueString) {
            this.updateInputValue(this.invalidValueString);
        }
        this.changedArgs = { value: this.value };
        this.errorClass();
        this.updateIconState();
    };
    
    DatePicker.prototype.minMaxUpdates = function () {
        if (!isNullOrUndefined(this.value) && this.value < this.min && this.min <= this.max && this.strictMode) {
            this.setProperties({ value: this.min }, true);
            this.changedArgs = { value: this.value };
        }
        else {
            if (!isNullOrUndefined(this.value) && this.value > this.max && this.min <= this.max && this.strictMode) {
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
            var culture = new Internationalization(this.locale);
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd' };
                formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime' };
            }
            else {
                formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime', calendar: 'islamic' };
            }
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
            }
            else {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
        }
        returnDate = this.checkDateValue(this.globalize.parseDate(val, formatOptions));
        if (isNullOrUndefined(returnDate) && (this.getModuleName() === 'datetimepicker')) {
            returnDate = this.checkDateValue(this.globalize.parseDate(val, formatDateTime));
        }
        return returnDate;
    };
    DatePicker.prototype.checkInvalidValue = function (value) {
        if (!(value instanceof Date) && !isNullOrUndefined(value)) {
            var valueDate = null;
            var valueString = value;
            if (typeof value === 'number') {
                valueString = value.toString();
            }
            var formatOptions = null;
            var formatDateTime = null;
            if (this.getModuleName() === 'datetimepicker') {
                var culture = new Internationalization(this.locale);
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd' };
                    formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime' };
                }
                else {
                    formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                    formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime', calendar: 'islamic' };
                }
            }
            else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
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
        if (!isNullOrUndefined(this.formatString)) {
            if (this.formatString.indexOf('y') === -1) {
                EventHandler.add(this.inputElement, 'input', this.inputHandler, this);
            }
            else {
                EventHandler.remove(this.inputElement, 'input', this.inputHandler);
            }
        }
    };
    DatePicker.prototype.bindEvents = function () {
        if (this.enabled) {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown touchstart', (this.isBlazorServer ? this.preventEventBubbling : this.dateIconHandler), this);
            EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
            EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
            this.bindInputEvent();
            // To prevent the twice triggering.
            EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
            if (this.showClearButton && (this.inputWrapper.clearButton || (this.isBlazorServer))) {
                EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
            }
            if (this.formElement) {
                EventHandler.add(this.formElement, 'reset', this.resetFormHandler, this);
            }
        }
        else {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', (this.isBlazorServer ? this.preventEventBubbling : this.dateIconHandler));
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
            if (this.showClearButton && (this.inputWrapper.clearButton || (this.isBlazorServer))) {
                EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
            }
            if (this.formElement) {
                EventHandler.remove(this.formElement, 'reset', this.resetFormHandler);
            }
        }
        this.defaultKeyConfigs = extend(this.defaultKeyConfigs, this.keyConfigs);
        this.keyboardModules = new KeyboardEvents(this.inputElement, {
            eventName: 'keydown',
            keyAction: this.inputKeyActionHandle.bind(this),
            keyConfigs: this.defaultKeyConfigs
        });
    };
    DatePicker.prototype.resetFormHandler = function () {
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
        this.previousElementValue = (isNullOrUndefined(this.inputValueCopy)) ? '' :
            this.globalize.formatDate(this.inputValueCopy, { format: this.formatString, type: 'dateTime', skeleton: 'yMd' });
    };
    DatePicker.prototype.inputChangeHandler = function (e) {
        e.stopPropagation();
    };
    DatePicker.prototype.bindClearEvent = function () {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    };
    DatePicker.prototype.resetHandler = function (e) {
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
        Input.setValue(value, this.inputElement, this.floatLabelType, this.showClearButton);
    };
    DatePicker.prototype.dateIconHandler = function (e) {
        if (Browser.isDevice) {
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
                    addClass([this.inputWrapper.container], [INPUTFOCUS]);
                    addClass(this.inputWrapper.buttons, ACTIVE);
                }
            }
        }
    };
    DatePicker.prototype.updateHtmlAttributeToWrapper = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (!isNullOrUndefined(this.htmlAttributes[key])) {
                    if (containerAttr.indexOf(key) > -1) {
                        if (key === 'class') {
                            addClass([this.inputWrapper.container], this.htmlAttributes[key].split(' '));
                        }
                        else if (key === 'style') {
                            var setStyle = this.inputWrapper.container.getAttribute(key);
                            if (!isNullOrUndefined(setStyle)) {
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
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (containerAttr.indexOf(key) < 0) {
                    this.inputElement.setAttribute(key, this.htmlAttributes[key]);
                }
            }
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
        var focusArguments = {
            model: isBlazor() && this.isServerRendered ? null : this
        };
        this.isDateIconClicked = false;
        this.trigger('focus', focusArguments);
        this.updateIconState();
    };
    DatePicker.prototype.inputHandler = function (e) {
        this.isPopupClicked = false;
    };
    DatePicker.prototype.inputBlurHandler = function (e) {
        if (!this.isBlazorServer) {
            this.strictModeUpdate();
            if (this.inputElement.value === '' && isNullOrUndefined(this.value)) {
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
                model: isBlazor() && this.isServerRendered ? null : this
            };
            this.trigger('blur', blurArguments);
        }
        if (this.isCalendar()) {
            this.defaultKeyConfigs = extend(this.defaultKeyConfigs, this.keyConfigs);
            this.calendarKeyboardModules = new KeyboardEvents(this.calendarElement.children[1].firstElementChild, {
                eventName: 'keydown',
                keyAction: this.CalendarKeyActionHandle.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        }
        this.isPopupClicked = false;
    };
    DatePicker.prototype.documentHandler = function (e) {
        if ((!isNullOrUndefined(this.popupObj) && (this.inputWrapper.container.contains(e.target) ||
            (this.popupObj.element && this.popupObj.element.contains(e.target)))) && e.type !== 'touchstart') {
            e.preventDefault();
        }
        var target = e.target;
        if (!(closest(target, '.e-datepicker.e-popup-wrapper'))
            && !(closest(target, '.' + INPUTCONTAINER) === this.inputWrapper.container)
            && (!target.classList.contains('e-day'))) {
            this.hide(e);
            this.focusOut();
        }
        else if (closest(target, '.e-datepicker.e-popup-wrapper')) {
            // Fix for close the popup when select the previously selected value.
            if (target.classList.contains('e-day')
                && !isNullOrUndefined(e.target.parentElement)
                && e.target.parentElement.classList.contains('e-selected')
                && closest(target, '.e-content')
                && closest(target, '.e-content').classList.contains('e-' + this.depth.toLowerCase())) {
                this.hide(e);
            }
            else if (closest(target, '.e-footer-container')
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
        this.previousDate = ((!isNullOrUndefined(this.value) && new Date(+this.value)) || null);
        if (this.isCalendar()) {
            _super.prototype.keyActionHandle.call(this, e);
            if (!this.isBlazorServer) {
                attributes(this.inputElement, {
                    'aria-activedescendant': '' + this.setActiveDescendant()
                });
            }
        }
    };
    DatePicker.prototype.popupUpdate = function () {
        if ((isNullOrUndefined(this.value)) && (!isNullOrUndefined(this.previousDate)) ||
            (+this.value !== +this.previousDate)) {
            if (this.popupObj) {
                if (this.popupObj.element.querySelectorAll('.' + SELECTED$2).length > 0) {
                    removeClass(this.popupObj.element.querySelectorAll('.' + SELECTED$2), [SELECTED$2]);
                }
            }
            if (!isNullOrUndefined(this.value) && !this.isBlazorServer) {
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
            format = !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat;
        }
        else {
            format = isNullOrUndefined(this.formatString) ? this.formatString : this.formatString.replace('dd', 'd');
        }
        if (!isNullOrUndefined(format)) {
            var len = format.split('M').length - 1;
            if (len < 3) {
                format = format.replace('MM', 'M');
            }
        }
        var dateOptions;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                dateOptions = {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd'
                };
            }
            else {
                dateOptions = {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                };
            }
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: format, type: 'dateTime', skeleton: 'yMd' };
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
                    formatOptions = { type: 'dateTime', skeleton: 'yMd' };
                }
                else {
                    formatOptions = { type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.parseDate(this.inputElement.value, formatOptions);
            }
        }
        else {
            date = this.globalize.parseDate(this.inputElement.value, dateOptions);
            if (!isNullOrUndefined(this.formatString) && this.inputElement.value !== '' && this.strictMode) {
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
        if (isNullOrUndefined(this.value)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
        }
    };
    DatePicker.prototype.createCalendar = function () {
        var _this = this;
        if (!this.isBlazorServer) {
            this.popupWrapper = this.createElement('div', { className: '' + ROOT$1 + ' ' + POPUPWRAPPER });
            if (!isNullOrUndefined(this.cssClass)) {
                this.popupWrapper.className += ' ' + this.cssClass;
            }
        }
        else {
            this.popupWrapper = this.inputWrapper.container.nextElementSibling;
            this.calendarElement = this.popupWrapper.firstElementChild;
            this.tableBodyElement = select('tbody', this.calendarElement);
            this.contentElement = select('.e-content', this.calendarElement);
        }
        if (Browser.isDevice) {
            this.modelHeader();
            this.modal = this.createElement('div');
            this.modal.className = '' + ROOT$1 + ' e-date-modal';
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        //this.calendarElement represent the Calendar object from the Calendar class.
        this.calendarElement.querySelector('table tbody').className = '';
        this.popupObj = new Popup(this.popupWrapper, {
            content: this.isBlazorServer ? null : this.calendarElement,
            relateTo: Browser.isDevice ? document.body : this.inputWrapper.container,
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            offsetY: OFFSETVALUE,
            targetType: 'container',
            enableRtl: this.enableRtl,
            zIndex: this.zIndex,
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            open: function () {
                if (_this.getModuleName() !== 'datetimepicker') {
                    if (document.activeElement !== _this.inputElement) {
                        _this.defaultKeyConfigs = extend(_this.defaultKeyConfigs, _this.keyConfigs);
                        _this.calendarElement.children[1].firstElementChild.focus();
                        _this.calendarKeyboardModules = new KeyboardEvents(_this.calendarElement.children[1].firstElementChild, {
                            eventName: 'keydown',
                            keyAction: _this.CalendarKeyActionHandle.bind(_this),
                            keyConfigs: _this.defaultKeyConfigs
                        });
                        _this.calendarKeyboardModules = new KeyboardEvents(_this.inputWrapper.container.children[_this.index], {
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
                detach(_this.popupWrapper);
                _this.popupObj = _this.popupWrapper = null;
                _this.setAriaAttributes();
            }, targetExitViewport: function () {
                if (!Browser.isDevice) {
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
                this.changedArgs.isInteracted = !isNullOrUndefined(event);
                this.trigger('change', this.changedArgs);
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
            tempFormat = !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat;
        }
        else {
            tempFormat = this.formatString;
        }
        if (this.value) {
            if (this.getModuleName() === 'datetimepicker') {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: tempFormat, type: 'dateTime', skeleton: 'yMd' };
                }
                else {
                    formatOptions = { format: tempFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.formatDate(this.changedArgs.value, formatOptions);
            }
            else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
                }
                else {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.formatDate(this.changedArgs.value, formatOptions);
            }
        }
        if (!isNullOrUndefined(date)) {
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
            this.inputWrapper.container.style.width = formatUnit(this.width);
        }
        else if (typeof width === 'string') {
            this.inputWrapper.container.style.width = (width.match(/px|%|em/)) ? (this.width) : (formatUnit(this.width));
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
            if (!isNullOrUndefined(this.value) && !(+this.value >= +this.min && +this.value <= +this.max)) {
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
            if (Browser.isDevice) {
                this.mobilePopupWrapper = this.createElement('div', { className: 'e-datepick-mob-popup-wrap' });
                document.body.appendChild(this.mobilePopupWrapper);
            }
            this.preventArgs = {
                preventDefault: function () {
                    prevent_1 = false;
                },
                popup: isBlazor() && this.isServerRendered ? null : this.popupObj,
                event: e || null,
                cancel: false,
                appendTo: Browser.isDevice ? this.mobilePopupWrapper : document.body
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
                    addClass(_this.inputWrapper.buttons, ACTIVE);
                    _this.preventArgs.appendTo.appendChild(_this.popupWrapper);
                    _this.popupObj.refreshPosition(_this.inputElement);
                    var openAnimation = {
                        name: 'FadeIn',
                        duration: Browser.isDevice ? 0 : OPENDURATION,
                    };
                    if (_this.zIndex === 1000) {
                        _this.popupObj.show(new Animation(openAnimation), _this.element);
                    }
                    else {
                        _this.popupObj.show(new Animation(openAnimation), null);
                    }
                    if (!_this.isBlazorServer) {
                        _super.prototype.setOverlayIndex.call(_this, _this.mobilePopupWrapper, _this.popupObj.element, _this.modal, Browser.isDevice);
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
                if (!isNullOrUndefined(_this.inputElement) && _this.inputElement.value === '') {
                    if (!isNullOrUndefined(_this.tableBodyElement) && _this.tableBodyElement.querySelectorAll('td.e-selected').length > 0) {
                        addClass([_this.tableBodyElement.querySelector('td.e-selected')], FOCUSEDDATE$2);
                        removeClass(_this.tableBodyElement.querySelectorAll('td.e-selected'), SELECTED$2);
                    }
                }
                EventHandler.add(document, 'mousedown touchstart', _this.documentHandler, _this);
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
        if (!isNullOrUndefined(this.popupWrapper)) {
            var prevent_2 = true;
            this.preventArgs = {
                preventDefault: function () {
                    prevent_2 = false;
                },
                popup: isBlazor() && this.isServerRendered ? null : this.popupObj,
                event: event || null,
                cancel: false
            };
            removeClass(this.inputWrapper.buttons, ACTIVE);
            removeClass([document.body], OVERFLOW);
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
            if (Browser.isDevice && this.allowEdit && !this.readonly) {
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
            removeClass(this.inputWrapper.buttons, ACTIVE);
        }
        this.setAriaAttributes();
        if (Browser.isDevice && this.modal) {
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
        if (Browser.isDevice) {
            if (!isNullOrUndefined(this.mobilePopupWrapper)) {
                this.mobilePopupWrapper.remove();
                this.mobilePopupWrapper = null;
            }
        }
        EventHandler.remove(document, 'mousedown touchstart', this.documentHandler);
        if (Browser.isDevice && this.allowEdit && !this.readonly) {
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
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
            
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    DatePicker.prototype.focusOut = function () {
        if (document.activeElement === this.inputElement) {
            removeClass([this.inputWrapper.container], [INPUTFOCUS]);
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
            Input.removeAttributes(ariaAttrs, this.inputElement);
            (!isNullOrUndefined(this.inputElementCopy.getAttribute('tabindex'))) ?
                this.inputElement.setAttribute('tabindex', this.tabIndex) : this.inputElement.removeAttribute('tabindex');
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            this.ensureInputAttribute();
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) {
                detach(this.popupWrapper);
            }
            this.popupObj = this.popupWrapper = null;
            if (!this.isBlazorServer) {
                this.keyboardModule.destroy();
            }
        }
        if (this.ngTag === null) {
            if (this.inputElement) {
                this.inputWrapper.container.insertAdjacentElement('afterend', this.inputElement);
                removeClass([this.inputElement], [INPUTROOT]);
            }
            removeClass([this.element], [ROOT$1]);
            detach(this.inputWrapper.container);
        }
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.resetFormHandler);
        }
    };
    DatePicker.prototype.ensureInputAttribute = function () {
        var prop = [];
        for (var i = 0; i < this.inputElement.attributes.length; i++) {
            prop[i] = this.inputElement.attributes[i].name;
        }
        for (var i = 0; i < prop.length; i++) {
            if (isNullOrUndefined(this.inputElementCopy.getAttribute(prop[i]))) {
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
        removeClass([this.inputElementCopy], [ROOT$1, CONTROL, LIBRARY]);
        this.inputElement = this.element;
        this.formElement = closest(this.inputElement, 'form');
        this.index = this.showClearButton ? 2 : 1;
        this.isBlazorServer = (isBlazor() && this.isServerRendered && this.getModuleName() === 'datepicker') ? true : false;
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
                    this.element.id = getUniqueID('ej2-datetimepicker');
                    if (this.ngTag !== null) {
                        attributes(this.inputElement, { 'id': this.element.id + '_input' });
                    }
                }
                else {
                    this.element.id = getUniqueID('ej2-datepicker');
                    if (this.ngTag !== null) {
                        attributes(this.inputElement, { 'id': this.element.id + '_input' });
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
        this.element.removeAttribute('tabindex');
        if (!this.isBlazorServer) {
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
            if (isNullOrUndefined(target.getAttribute(attribute[i]))) {
                continue;
            }
            var attr = target.getAttribute(attribute[i]);
            inputElement.setAttribute(attribute[i], attr);
            target.removeAttribute(attribute[i]);
        }
    };
    DatePicker.prototype.checkFormat = function () {
        var culture = new Internationalization(this.locale);
        if (this.format) {
            if (typeof this.format === 'string') {
                this.formatString = this.format;
            }
            else if (this.format.skeleton !== '' && !isNullOrUndefined(this.format.skeleton)) {
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
        this.globalize = new Internationalization(this.locale);
        this.checkFormat();
        this.checkView();
        var attributes$$1 = dynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['value', 'min', 'max', 'disabled', 'readonly', 'style', 'name', 'placeholder', 'type'];
        var options;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                options = {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd'
                };
            }
            else {
                options = {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                };
            }
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                options = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
            }
            else {
                options = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
        }
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if (((isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['enabled'] === undefined)) || dynamic) && !this.isBlazorServer) {
                            var enabled = this.inputElement.getAttribute(prop) === 'disabled' || this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !dynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if (((isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['readonly'] === undefined)) || dynamic) && !this.isBlazorServer) {
                            var readonly = this.inputElement.getAttribute(prop) === 'readonly' || this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !dynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if (((isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['placeholder'] === undefined)) || dynamic) && !this.isBlazorServer) {
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
                        if (((isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['value'] === undefined)) || dynamic) && !this.isBlazorServer) {
                            var value = this.inputElement.getAttribute(prop);
                            this.setProperties(setValue(prop, this.globalize.parseDate(value, options), {}), !dynamic);
                        }
                        break;
                    case 'min':
                        if ((+this.min === +new Date(1900, 0, 1)) || dynamic) {
                            var min = this.inputElement.getAttribute(prop);
                            this.setProperties(setValue(prop, this.globalize.parseDate(min), {}), !dynamic);
                        }
                        break;
                    case 'max':
                        if ((+this.max === +new Date(2099, 11, 31)) || dynamic) {
                            var max = this.inputElement.getAttribute(prop);
                            this.setProperties(setValue(prop, this.globalize.parseDate(max), {}), !dynamic);
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
        if (!isNullOrUndefined(this.calendarElement.querySelectorAll(dateIdString)[0])) {
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
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd'
                });
            }
            else {
                globalize = this.globalize.formatDate(valueCopy, {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                });
            }
            inputVal = globalize;
        }
        else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
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
                attributes(this.inputElement, { 'aria-activedescendant': '' + id });
            }
            else {
                attributes(this.inputElement, { 'aria-activedescendant': 'null' });
            }
        }
        else {
            if (this.isCalendar()) {
                Input.addAttributes({ 'aria-expanded': 'true' }, this.inputElement);
                attributes(this.inputElement, { 'aria-activedescendant': '' + this.setActiveDescendant() });
            }
            else {
                Input.addAttributes({ 'aria-expanded': 'false' }, this.inputElement);
                attributes(this.inputElement, { 'aria-activedescendant': 'null' });
            }
        }
    };
    DatePicker.prototype.errorClass = function () {
        var dateIdString = '*[id^="/id"]'.replace('/id', '' + (+this.value));
        var isDisabledDate = this.calendarElement &&
            this.calendarElement.querySelectorAll(dateIdString)[0] &&
            this.calendarElement.querySelectorAll(dateIdString)[0].classList.contains('e-disabled');
        if ((!isNullOrUndefined(this.value) && !(+new Date(+this.value).setMilliseconds(0) >= +this.min
            && +new Date(+this.value).setMilliseconds(0) <= +this.max))
            || (!this.strictMode && this.inputElement.value !== '' && isNullOrUndefined(this.value) || isDisabledDate)) {
            addClass([this.inputWrapper.container], ERROR);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        }
        else {
            removeClass([this.inputWrapper.container], ERROR);
            attributes(this.inputElement, { 'aria-invalid': 'false' });
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
            options = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
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
                        if (isNullOrUndefined(this.value)) {
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
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.inputElement);
                    this.setAriaDisabled();
                    this.bindEvents();
                    break;
                case 'htmlAttributes':
                    this.updateHtmlAttributeToElement();
                    this.updateHtmlAttributeToWrapper();
                    this.checkHtmlAttributes(true);
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                    if (!this.isBlazorServer) {
                        this.updateInput();
                    }
                    break;
                case 'enableRtl':
                    Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
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
                    Input.setCssClass(newProp.cssClass, [this.inputWrapper.container], oldProp.cssClass);
                    if (this.popupWrapper) {
                        Input.setCssClass(newProp.cssClass, [this.popupWrapper], oldProp.cssClass);
                    }
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
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
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
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
    __decorate$1([
        Property(null)
    ], DatePicker.prototype, "width", void 0);
    __decorate$1([
        Property(null)
    ], DatePicker.prototype, "value", void 0);
    __decorate$1([
        Property(null)
    ], DatePicker.prototype, "cssClass", void 0);
    __decorate$1([
        Property(false)
    ], DatePicker.prototype, "strictMode", void 0);
    __decorate$1([
        Property(null)
    ], DatePicker.prototype, "format", void 0);
    __decorate$1([
        Property(true)
    ], DatePicker.prototype, "enabled", void 0);
    __decorate$1([
        Property({})
    ], DatePicker.prototype, "htmlAttributes", void 0);
    __decorate$1([
        Property(null)
    ], DatePicker.prototype, "values", void 0);
    __decorate$1([
        Property(false)
    ], DatePicker.prototype, "isMultiSelection", void 0);
    __decorate$1([
        Property(true)
    ], DatePicker.prototype, "showClearButton", void 0);
    __decorate$1([
        Property(true)
    ], DatePicker.prototype, "allowEdit", void 0);
    __decorate$1([
        Property(null)
    ], DatePicker.prototype, "keyConfigs", void 0);
    __decorate$1([
        Property(false)
    ], DatePicker.prototype, "enablePersistence", void 0);
    __decorate$1([
        Property(1000)
    ], DatePicker.prototype, "zIndex", void 0);
    __decorate$1([
        Property(false)
    ], DatePicker.prototype, "readonly", void 0);
    __decorate$1([
        Property(null)
    ], DatePicker.prototype, "placeholder", void 0);
    __decorate$1([
        Property('Never')
    ], DatePicker.prototype, "floatLabelType", void 0);
    __decorate$1([
        Property(null)
    ], DatePicker.prototype, "serverTimezoneOffset", void 0);
    __decorate$1([
        Event()
    ], DatePicker.prototype, "open", void 0);
    __decorate$1([
        Event()
    ], DatePicker.prototype, "cleared", void 0);
    __decorate$1([
        Event()
    ], DatePicker.prototype, "close", void 0);
    __decorate$1([
        Event()
    ], DatePicker.prototype, "blur", void 0);
    __decorate$1([
        Event()
    ], DatePicker.prototype, "focus", void 0);
    __decorate$1([
        Event()
    ], DatePicker.prototype, "created", void 0);
    __decorate$1([
        Event()
    ], DatePicker.prototype, "destroyed", void 0);
    DatePicker = __decorate$1([
        NotifyPropertyChanges
    ], DatePicker);
    return DatePicker;
}(Calendar));

/**
 * Datepicker modules
 */

var __extends$2 = (undefined && undefined.__extends) || (function () {
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
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../calendar/calendar-model.d.ts'/>
var DATERANGEWRAPPER = 'e-date-range-wrapper';
var INPUTCONTAINER$1 = 'e-input-group';
var DATERANGEICON = 'e-input-group-icon e-range-icon e-icons';
var POPUP$1 = 'e-popup';
var LEFTCALENDER = 'e-left-calendar';
var RIGHTCALENDER = 'e-right-calendar';
var LEFTCONTAINER = 'e-left-container';
var RIGHTCONTAINER = 'e-right-container';
var ROOT$2 = 'e-daterangepicker';
var LIBRARY$1 = 'e-lib';
var CONTROL$1 = 'e-control';
var ERROR$1 = 'e-error';
var ACTIVE$1 = 'e-active';
var STARTENDCONTAINER = 'e-start-end';
var STARTDATE = 'e-start-date';
var ENDDATE = 'e-end-date';
var STARTBUTTON = 'e-start-btn';
var INPUTFOCUS$1 = 'e-input-focus';
var ENDBUTTON = 'e-end-btn';
var RANGEHOVER = 'e-range-hover';
var OTHERMONTH$2 = 'e-other-month';
var STARTLABEL = 'e-start-label';
var ENDLABEL = 'e-end-label';
var DISABLED$2 = 'e-disabled';
var SELECTED$3 = 'e-selected';
var CALENDAR = 'e-calendar';
var NEXTICON$1 = 'e-next';
var PREVICON$1 = 'e-prev';
var HEADER$1 = 'e-header';
var TITLE$1 = 'e-title';
var ICONCONTAINER$1 = 'e-icon-container';
var RANGECONTAINER = 'e-date-range-container';
var RANGEHEADER = 'e-range-header';
var PRESETS = 'e-presets';
var FOOTER$1 = 'e-footer';
var RANGEBORDER = 'e-range-border';
var TODAY$2 = 'e-today';
var FOCUSDATE = 'e-focused-date';
var CONTENT$1 = 'e-content';
var DAYSPAN = 'e-day-span';
var WEEKNUMBER$2 = 'e-week-number';
var DATEDISABLED = 'e-date-disabled';
var ICONDISABLED = 'e-icon-disabled';
var CALENDARCONTAINER = 'e-calendar-container';
var SEPARATOR = 'e-separator';
var APPLY = 'e-apply';
var CANCEL = 'e-cancel';
var DEVICE$1 = 'e-device';
var OVERLAY$2 = 'e-overlay';
var CHANGEICON = 'e-change-icon e-icons';
var LISTCLASS = cssClass.li;
var RTL$2 = 'e-rtl';
var HOVER = 'e-hover';
var OVERFLOW$1 = 'e-range-overflow';
var OFFSETVALUE$1 = 4;
var PRIMARY$1 = 'e-primary';
var FLAT$1 = 'e-flat';
var CSS$1 = 'e-css';
var ZOOMIN$1 = 'e-zoomin';
var NONEDITABLE = 'e-non-edit';
var DAYHEADERLONG$1 = 'e-daterange-day-header-lg';
var HIDDENELEMENT = 'e-daterange-hidden';
var wrapperAttr = ['title', 'class', 'style'];
var Presets = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Presets, _super);
    function Presets() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property()
    ], Presets.prototype, "label", void 0);
    __decorate$2([
        Property()
    ], Presets.prototype, "start", void 0);
    __decorate$2([
        Property()
    ], Presets.prototype, "end", void 0);
    return Presets;
}(ChildProperty));
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
var DateRangePicker = /** @__PURE__ @class */ (function (_super) {
    __extends$2(DateRangePicker, _super);
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
        removeClass([this.cloneElement], [ROOT$2, CONTROL$1, LIBRARY$1]);
        this.updateHtmlAttributeToElement();
        if (this.element.getAttribute('id')) {
            if (this.angularTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        }
        else {
            this.element.id = getUniqueID('ej2-datetimepicker');
            if (this.angularTag !== null) {
                attributes(this.inputElement, { 'id': this.element.id + '_input' });
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
        this.formElement = closest(this.element, 'form');
    };
    
    DateRangePicker.prototype.updateValue = function () {
        var dateOptions = { format: this.formatString, type: 'date', skeleton: 'yMd' };
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
        else if (isNullOrUndefined(this.value)) {
            this.endValue = this.checkDateValue(new Date(this.checkValue(this.endDate)));
            this.startValue = this.checkDateValue(new Date(this.checkValue(this.startDate)));
            this.setValue();
        }
    };
    DateRangePicker.prototype.initProperty = function () {
        this.globalize = new Internationalization(this.locale);
        this.checkFormat();
        this.checkView();
        if (isNullOrUndefined(this.firstDayOfWeek) || this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: this.globalize.getFirstDayOfWeek() }, true);
        }
        this.updateValue();
    };
    DateRangePicker.prototype.checkFormat = function () {
        if (this.format) {
            if (typeof this.format === 'string') {
                this.formatString = this.format;
            }
            else if (this.format.skeleton !== '' && !isNullOrUndefined(this.format.skeleton)) {
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
        merge(this.defaultKeyConfigs, { shiftTab: 'shift+tab' });
        var start = this.checkDateValue(new Date(this.checkValue(this.startValue)));
        this.setProperties({ startDate: start }, true); // persist the value propeerty.
        this.setProperties({ endValue: this.checkDateValue(new Date(this.checkValue(this.endValue))) }, true);
        this.setValue();
        this.setProperties({ min: this.checkDateValue(new Date(this.checkValue(this.min))) }, true);
        this.setProperties({ max: this.checkDateValue(new Date(this.checkValue(this.max))) }, true);
        this.l10n = new L10n('daterangepicker', this.defaultConstant, this.locale);
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
            attributes(this.inputElement, { 'readonly': '' });
        }
        this.updateClearIconState();
    };
    DateRangePicker.prototype.updateClearIconState = function () {
        if (!this.allowEdit && this.inputWrapper && !this.readonly) {
            if (this.inputElement.value === '') {
                removeClass([this.inputWrapper.container], [NONEDITABLE]);
            }
            else {
                addClass([this.inputWrapper.container], [NONEDITABLE]);
            }
        }
        else if (this.inputWrapper) {
            removeClass([this.inputWrapper.container], [NONEDITABLE]);
        }
    };
    DateRangePicker.prototype.validationAttribute = function (element, input) {
        var name = element.getAttribute('name') ? element.getAttribute('name') : element.getAttribute('id');
        input.setAttribute('name', name);
        element.removeAttribute('name');
        var attributes$$1 = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attributes$$1.length; i++) {
            if (isNullOrUndefined(element.getAttribute(attributes$$1[i]))) {
                continue;
            }
            var attr = element.getAttribute(attributes$$1[i]);
            input.setAttribute(attributes$$1[i], attr);
            element.removeAttribute(attributes$$1[i]);
        }
    };
    DateRangePicker.prototype.updateHtmlAttributeToWrapper = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttr.indexOf(key) > -1) {
                    if (key === 'class') {
                        addClass([this.inputWrapper.container], this.htmlAttributes[key].split(' '));
                    }
                    else if (key === 'style') {
                        var dateRangeStyle = this.inputWrapper.container.getAttribute(key);
                        dateRangeStyle = !isNullOrUndefined(dateRangeStyle) ? (dateRangeStyle + this.htmlAttributes[key]) :
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
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttr.indexOf(key) < 0) {
                    this.inputElement.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    };
    DateRangePicker.prototype.processPresets = function () {
        this.presetsItem = [];
        var i = 0;
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
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
            var startDate = isNullOrUndefined(this.startValue) ? null : new Date(+this.startValue);
            var endDate = isNullOrUndefined(this.endValue) ? null : new Date(+this.endValue);
            this.presetsItem.push({ id: 'custom_range', text: this.l10n.getConstant('customRange'), start: startDate, end: endDate });
            if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
                this.isCustomRange = true;
                this.activeIndex = this.presetsItem.length - 1;
            }
        }
    };
    DateRangePicker.prototype.bindEvents = function () {
        if (this.enabled) {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler, this);
            EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
            EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
            EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
            if (this.showClearButton && this.inputWrapper.clearButton) {
                EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
            }
            if (!this.isMobile) {
                this.keyInputConfigs = extend(this.keyInputConfigs, this.keyConfigs);
                this.inputKeyboardModule = new KeyboardEvents(this.inputElement, {
                    eventName: 'keydown',
                    keyAction: this.inputHandler.bind(this),
                    keyConfigs: this.keyInputConfigs
                });
            }
            if (this.formElement) {
                EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
            }
            this.inputElement.setAttribute('tabindex', this.tabIndex);
        }
        else {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
            if (this.showClearButton && this.inputWrapper.clearButton) {
                EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
            }
            if (!this.isMobile) {
                if (!isNullOrUndefined(this.inputKeyboardModule)) {
                    this.inputKeyboardModule.destroy();
                }
            }
            if (this.formElement) {
                EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
            }
            this.inputElement.tabIndex = -1;
        }
    };
    DateRangePicker.prototype.updateHiddenInput = function () {
        if (this.firstHiddenChild && this.secondHiddenChild) {
            var format = { type: 'datetime', skeleton: 'yMd' };
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
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
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
            if (!isNullOrUndefined(this.startCopy)) {
                if (!isNullOrUndefined(this.value) && !isNullOrUndefined(this.value.start)) {
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
                Input.setValue(val, this.inputElement, this.floatLabelType, this.showClearButton);
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
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        if (!(isNullOrUndefined(this.applyButton))) {
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
        if (this.isPopupOpen()) {
            this.applyFunction(e);
        }
        else {
            this.isRangeIconClicked = true;
            this.inputWrapper.container.children[0].focus();
            this.show(null, e);
            if (!this.isMobile) {
                if (!isNullOrUndefined(this.leftCalendar)) {
                    this.isRangeIconClicked = false;
                    this.calendarFocus();
                    this.isRangeIconClicked = true;
                }
            }
            addClass([this.inputWrapper.container], [INPUTFOCUS$1]);
        }
    };
    DateRangePicker.prototype.checkHtmlAttributes = function (isDynamic) {
        this.globalize = new Internationalization(this.locale);
        var attributes$$1 = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['startDate', 'endDate', 'minDays', 'maxDays', 'min', 'max', 'disabled', 'readonly', 'style', 'name', 'placeholder',
                'type', 'value'];
        var format = { format: this.formatString, type: 'date', skeleton: 'yMd' };
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['enabled'] === undefined)) || isDynamic) {
                            var disabled = this.inputElement.getAttribute(prop) === 'disabled' ||
                                this.inputElement.getAttribute(prop) === '' || this.inputElement.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ enabled: !disabled }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['readonly'] === undefined)) || isDynamic) {
                            var readonly = this.inputElement.getAttribute(prop) === 'readonly' ||
                                this.inputElement.getAttribute(prop) === 'true' || this.inputElement.getAttribute(prop) === '' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['value'] === undefined)) || isDynamic) {
                            var value = this.inputElement.getAttribute(prop);
                            this.setProperties(setValue(prop, value, {}), !isDynamic);
                        }
                        break;
                    case 'style':
                        this.inputElement.setAttribute('style', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'min':
                        if ((isNullOrUndefined(this.min) || +this.min === +new Date(1900, 0, 1)) || isDynamic) {
                            var dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.setProperties(setValue(prop, dateValue, {}), !isDynamic);
                        }
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'max':
                        if ((isNullOrUndefined(this.max) || +this.max === +new Date(2099, 11, 31)) || isDynamic) {
                            var dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.setProperties(setValue(prop, dateValue, {}), !isDynamic);
                        }
                        break;
                    case 'startDate':
                        if (isNullOrUndefined(this.startDate)) {
                            var dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.startValue = dateValue;
                            this.setValue();
                        }
                        break;
                    case 'endDate':
                        if (isNullOrUndefined(this.endDate)) {
                            var dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.endValue = dateValue;
                            this.setValue();
                        }
                        break;
                    case 'minDays':
                        if (isNullOrUndefined(this.minDays)) {
                            this.setProperties(setValue(prop, parseInt(this.inputElement.getAttribute(prop), 10), {}), true);
                        }
                        break;
                    case 'maxDays':
                        if (isNullOrUndefined(this.maxDays)) {
                            this.setProperties(setValue(prop, parseInt(this.inputElement.getAttribute(prop), 10), {}), true);
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
        this.popupWrapper = createElement('div', { id: this.element.id + '_popup', className: ROOT$2 + ' ' + POPUP$1 });
        this.adjustLongHeaderWidth();
        var isPreset = (!this.isCustomRange || this.isMobile);
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && isPreset) {
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
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            this.disabledDateRender();
        }
        this.updateHeader();
    };
    DateRangePicker.prototype.clearCalendarEvents = function () {
        EventHandler.clearEvents(this.leftCalPrevIcon);
        EventHandler.clearEvents(this.leftCalNextIcon);
        EventHandler.clearEvents(this.rightCalPrevIcon);
        EventHandler.clearEvents(this.rightCalNextIcon);
    };
    DateRangePicker.prototype.updateNavIcons = function () {
        _super.prototype.iconHandler.call(this);
    };
    DateRangePicker.prototype.calendarIconEvent = function () {
        this.clearCalendarEvents();
        if (this.leftCalPrevIcon && !this.leftCalPrevIcon.classList.contains(DISABLED$2)) {
            EventHandler.add(this.leftCalPrevIcon, 'mousedown', this.navPrevFunction);
        }
        if (this.leftCalNextIcon && !this.leftCalNextIcon.classList.contains(DISABLED$2)) {
            EventHandler.add(this.leftCalNextIcon, 'mousedown', this.navNextFunction);
        }
        if (this.rightCalPrevIcon && !this.rightCalPrevIcon.classList.contains(DISABLED$2)) {
            EventHandler.add(this.rightCalPrevIcon, 'mousedown', this.navPrevFunction);
        }
        if (this.rightCalNextIcon && !this.rightCalNextIcon.classList.contains(DISABLED$2)) {
            EventHandler.add(this.rightCalNextIcon, 'mousedown', this.navNextFunction);
        }
    };
    DateRangePicker.prototype.bindCalendarEvents = function () {
        if (!this.isMobile) {
            this.updateNavIcons();
            this.calendarIconEvent();
            this.calendarIconRipple();
            this.headerTitleElement = this.popupObj.element.querySelector('.' + RIGHTCALENDER + ' .' + HEADER$1 + ' .' + TITLE$1);
            this.headerTitleElement = this.popupObj.element.querySelector('.' + LEFTCALENDER + ' .' + HEADER$1 + ' .' + TITLE$1);
            this.defaultKeyConfigs = extend(this.defaultKeyConfigs, this.keyConfigs);
            this.leftKeyboardModule = new KeyboardEvents(this.leftCalendar, {
                eventName: 'keydown',
                keyAction: this.keyInputHandler.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
            this.rightKeyboardModule = new KeyboardEvents(this.rightCalendar, {
                eventName: 'keydown',
                keyAction: this.keyInputHandler.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        }
        else {
            this.deviceCalendarEvent();
            EventHandler.add(this.startButton.element, 'click', this.deviceHeaderClick, this);
            EventHandler.add(this.endButton.element, 'click', this.deviceHeaderClick, this);
        }
        if (this.start === this.depth) {
            this.bindCalendarCellEvents();
        }
        this.removeFocusedDate();
    };
    DateRangePicker.prototype.calendarIconRipple = function () {
        rippleEffect(this.leftCalPrevIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.leftCalNextIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
        rippleEffect(this.rightCalPrevIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.rightCalNextIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
    };
    DateRangePicker.prototype.deviceCalendarEvent = function () {
        EventHandler.clearEvents(this.nextIcon);
        EventHandler.clearEvents(this.previousIcon);
        rippleEffect(this.nextIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.previousIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
        if (this.nextIcon && !this.nextIcon.classList.contains(DISABLED$2)) {
            EventHandler.add(this.nextIcon, 'mousedown', this.deviceNavNextFunction);
        }
        if (this.previousIcon && !this.previousIcon.classList.contains(DISABLED$2)) {
            EventHandler.add(this.previousIcon, 'mousedown', this.deviceNavPrevFunction);
        }
    };
    DateRangePicker.prototype.deviceNavNext = function (e) {
        var calendar = closest(e.target, '.' + CALENDAR);
        this.updateDeviceCalendar(calendar);
        this.navigateNext(e);
        this.deviceNavigation();
    };
    DateRangePicker.prototype.deviceNavPrevious = function (e) {
        var calendar = closest(e.target, '.' + CALENDAR);
        this.updateDeviceCalendar(calendar);
        this.navigatePrevious(e);
        this.deviceNavigation();
    };
    DateRangePicker.prototype.updateDeviceCalendar = function (calendar) {
        if (calendar) {
            this.previousIcon = calendar.querySelector('.' + PREVICON$1);
            this.nextIcon = calendar.querySelector('.' + NEXTICON$1);
            this.calendarElement = calendar;
            this.deviceCalendar = calendar;
            this.contentElement = calendar.querySelector('.' + CONTENT$1);
            this.tableBodyElement = select('.' + CONTENT$1 + ' tbody', calendar);
            this.table = calendar.querySelector('.' + CONTENT$1).getElementsByTagName('table')[0];
            this.headerTitleElement = calendar.querySelector('.' + HEADER$1 + ' .' + TITLE$1);
            this.headerElement = calendar.querySelector('.' + HEADER$1);
        }
    };
    DateRangePicker.prototype.deviceHeaderClick = function (event) {
        var element = event.currentTarget;
        if (element.classList.contains(STARTBUTTON) && !isNullOrUndefined(this.startValue)) {
            this.endButton.element.classList.remove(ACTIVE$1);
            this.startButton.element.classList.add(ACTIVE$1);
            var calendar = this.popupObj.element.querySelector('.' + CALENDAR);
            this.updateDeviceCalendar(calendar);
            if (isNullOrUndefined(this.calendarElement.querySelector('.' + STARTDATE + ':not(.e-other-month)'))) {
                this.currentDate = new Date(+this.startValue);
                remove(this.tableBodyElement);
                this.createContentBody();
                this.deviceNavigation();
            }
            this.removeClassDisabled();
        }
        else if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            this.startButton.element.classList.remove(ACTIVE$1);
            this.endButton.element.classList.add(ACTIVE$1);
            var calendar = this.popupObj.element.querySelector('.' + CALENDAR);
            this.updateDeviceCalendar(calendar);
            if (isNullOrUndefined(this.calendarElement.querySelector('.' + ENDDATE + ':not(.e-other-month)'))) {
                this.currentDate = new Date(+this.endValue);
                remove(this.tableBodyElement);
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
            model: (isBlazor() && this.isServerRendered) ? null : this
        };
        if (!this.preventFocus) {
            this.preventFocus = true;
            this.trigger('focus', focusArguments);
        }
        this.updateClearIconState();
        this.updateHiddenInput();
    };
    DateRangePicker.prototype.inputBlurHandler = function (e) {
        if (!this.preventBlur) {
            var value = this.inputElement.value;
            if (!isNullOrUndefined(this.presetsItem)) {
                if (this.presetsItem.length > 0 && this.previousEleValue !== this.inputElement.value) {
                    this.activeIndex = this.presetsItem.length - 1;
                    this.isCustomRange = true;
                }
            }
            if (!isNullOrUndefined(value) && value.trim() !== '') {
                var range = value.split(' ' + this.separator + ' ');
                if (range.length > 1) {
                    this.invalidValueString = null;
                    var dateOptions = { format: this.formatString, type: 'date', skeleton: 'yMd' };
                    var startDate = this.globalize.parseDate(range[0].trim(), dateOptions);
                    var endDate = this.globalize.parseDate(range[1].trim(), dateOptions);
                    if (!isNullOrUndefined(startDate) && !isNaN(+startDate) && !isNullOrUndefined(endDate) && !isNaN(+endDate)) {
                        this.startValue = startDate;
                        this.endValue = endDate;
                        this.setValue();
                        this.refreshControl();
                        if (value !== this.previousEleValue) {
                            this.changeTrigger(e);
                        }
                        if (!this.preventBlur && document.activeElement !== this.inputElement) {
                            this.preventFocus = false;
                            var blurArguments = {
                                model: (isBlazor() && this.isServerRendered) ? null : this
                            };
                            this.trigger('blur', blurArguments);
                        }
                        this.updateHiddenInput();
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
                if (isNullOrUndefined(this.popupObj)) {
                    this.currentDate = null;
                }
                this.previousStartValue = this.previousEndValue = null;
                this.startValue = null;
                this.endValue = null;
                this.setValue();
            }
            else {
                if (!isNullOrUndefined(value) && value.trim() === '') {
                    this.startValue = null;
                    this.endValue = null;
                }
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                this.updateInput();
            }
            this.errorClass();
            this.changeTrigger(e);
            if (!this.preventBlur && document.activeElement !== this.inputElement) {
                this.preventFocus = false;
                var blurArguments = {
                    model: (isBlazor() && this.isServerRendered) ? null : this
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
        if (((isNullOrUndefined(this.endValue) && isNullOrUndefined(this.startValue) && inputStr !== '') ||
            ((!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
                || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
                || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max))
            || ((this.startValue && this.isDateDisabled(this.startValue))
                || (this.endValue && this.isDateDisabled(this.endValue)))) && inputStr !== '') {
            addClass([this.inputWrapper.container], ERROR$1);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        }
        else {
            if (this.inputWrapper) {
                removeClass([this.inputWrapper.container], ERROR$1);
                attributes(this.inputElement, { 'aria-invalid': 'false' });
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
        if (!isNullOrUndefined(this.maxDays) && this.isMaxDaysClicked && !isNullOrUndefined(this.startValue)) {
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
                remove(this.tableBodyElement);
                (view === 0) ? this.renderMonths(e) : ((view === 1) ? this.renderYears(e) : this.renderDecades(e));
                this.keyNavigation(ele, e);
                break;
            case 'end':
                this.currentDate = this.lastDay(this.currentDate, view);
                remove(this.tableBodyElement);
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
        var ele = closest(e.target, '.' + RIGHTCALENDER);
        ele = isNullOrUndefined(ele) ? this.leftCalendar : ele;
        var isLeftCalendar = ele.classList.contains(LEFTCALENDER);
        this.updateCalendarElement(ele);
        var selectedDate = this.tableBodyElement.querySelector('tr td.e-selected');
        var focusedDate = ele.querySelector('tr td.' + FOCUSDATE);
        var startDate = ele.querySelector('tr td.' + STARTDATE);
        var endDate = ele.querySelector('tr td.' + ENDDATE);
        var depthValue = this.getViewNumber(this.depth);
        var levelRestrict = (view === depthValue && this.getViewNumber(this.start) >= depthValue);
        var leftCalendar = closest(e.target, '.' + LEFTCALENDER);
        var rightCalendar = closest(e.target, '.' + RIGHTCALENDER);
        var presetElement = closest(e.target, '.' + PRESETS);
        if (!isNullOrUndefined(focusedDate)) {
            this.currentDate = this.currentDate;
        }
        else if (!isNullOrUndefined(endDate) && !this.dateDisabled) {
            this.currentDate = new Date(+this.endValue);
        }
        else if (!isNullOrUndefined(startDate) && !this.dateDisabled) {
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
                    addClass([this.inputWrapper.container], [INPUTFOCUS$1]);
                }
                break;
            case 'select':
                if (levelRestrict) {
                    var element = !isNullOrUndefined(focusedDate) ? focusedDate : startDate;
                    if (!isNullOrUndefined(element) && !element.classList.contains(DISABLED$2)) {
                        this.selectRange(null, (element));
                    }
                }
                else {
                    if (!isNullOrUndefined(selectedDate) && !levelRestrict || !isNullOrUndefined(focusedDate)) {
                        if (!isNullOrUndefined(this.value)) {
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
                if (!isNullOrUndefined(leftCalendar)) {
                    this.rightCalendar.children[1].firstElementChild.focus();
                }
                else if (!isNullOrUndefined(rightCalendar)) {
                    if (!isNullOrUndefined(this.presetElement)) {
                        this.presetElement.focus();
                        this.removeFocusedDate();
                    }
                    else {
                        this.cancelButton.element.focus();
                    }
                }
                else {
                    if (!isNullOrUndefined(presetElement)) {
                        this.cancelButton.element.focus();
                    }
                }
                e.preventDefault();
                break;
            case 'altLeftArrow':
                if (!isNullOrUndefined(leftCalendar)) {
                    if (this.applyButton.element.disabled !== true) {
                        this.applyButton.element.focus();
                    }
                    else {
                        this.cancelButton.element.focus();
                    }
                }
                else {
                    if (!isNullOrUndefined(rightCalendar)) {
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
                if ((!isNullOrUndefined(selectedDate) || !isNullOrUndefined(focusedDate)) && !levelRestrict) {
                    if (!isNullOrUndefined(this.value)) {
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
                if (!isNullOrUndefined(this.presetElement)) {
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
                        if (!isNullOrUndefined(this.leftCalendar)) {
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
            EventHandler.clearEvents(cell);
            var disabledCell = void 0;
            disabledCell = cell.classList.contains(DISABLED$2) || cell.classList.contains(DATEDISABLED);
            if (!disabledCell && !cell.classList.contains(WEEKNUMBER$2)) {
                if (!this.isMobile) {
                    EventHandler.add(cell, 'mouseover', this.hoverSelection, this);
                }
                EventHandler.add(cell, 'mousedown', this.selectRange, this);
            }
        }
    };
    DateRangePicker.prototype.removeFocusedDate = function () {
        var isDate = !isNullOrUndefined(this.startValue) || !isNullOrUndefined(this.endValue);
        var focusedDate;
        focusedDate = this.popupObj.element.querySelectorAll('.' + CALENDAR + ' .' + FOCUSDATE);
        for (var _i = 0, focusedDate_1 = focusedDate; _i < focusedDate_1.length; _i++) {
            var ele = focusedDate_1[_i];
            var today = new Date();
            var eleDate = this.getIdValue(null, ele);
            if ((this.depth === 'Month' && this.currentView() === 'Month' &&
                (!ele.classList.contains(TODAY$2) || (ele.classList.contains(TODAY$2) && isDate)))
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
        if (!isNullOrUndefined(this.startValue) && +this.startValue >= +this.min && +this.startValue <= +this.max) {
            if ((!this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)
                && isNullOrUndefined(this.endValue) && isNullOrUndefined(this.startValue))
                || (!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue))) {
                var tdCells = void 0;
                tdCells = this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td');
                for (var _i = 0, tdCells_2 = tdCells; _i < tdCells_2.length; _i++) {
                    var ele = tdCells_2[_i];
                    var isDisabledCell = (!ele.classList.contains(DISABLED$2) || ele.classList.contains(DATEDISABLED));
                    if (!ele.classList.contains(WEEKNUMBER$2) && isDisabledCell) {
                        var eleDate = this.getIdValue(null, ele);
                        var startDateValue = new Date(+this.startValue);
                        var eleDateValue = new Date(+eleDate);
                        if (eleDateValue.setHours(0, 0, 0, 0) >= startDateValue.setHours(0, 0, 0, 0) && +eleDate <= +currentDate) {
                            addClass([ele], RANGEHOVER);
                        }
                        else {
                            removeClass([ele], [RANGEHOVER]);
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
        if (!isNullOrUndefined(this.startValue)) {
            for (var _i = 0, elementCollection_1 = elementCollection; _i < elementCollection_1.length; _i++) {
                var calendar = elementCollection_1[_i];
                var tdCells = calendar.querySelectorAll('.' + CALENDAR + ' td');
                for (var _a = 0, tdCells_3 = tdCells; _a < tdCells_3.length; _a++) {
                    var ele = tdCells_3[_a];
                    if (!ele.classList.contains(WEEKNUMBER$2) && !ele.classList.contains(DISABLED$2)) {
                        var eleDate = this.getIdValue(null, ele);
                        var eleDateValue = this.getIdValue(null, ele);
                        if (!isNullOrUndefined(this.endValue)) {
                            if (this.currentView() === this.depth &&
                                +eleDateValue.setHours(0, 0, 0, 0) >= +new Date(+this.startValue).setHours(0, 0, 0, 0)
                                && +eleDateValue.setHours(0, 0, 0, 0) <= +new Date(+this.endValue).setHours(0, 0, 0, 0) &&
                                !this.isSameStartEnd(new Date(+this.startValue), new Date(+this.endValue)) &&
                                +new Date(+this.startValue).setHours(0, 0, 0, 0) >= +this.min
                                && +new Date(+this.endValue).setHours(0, 0, 0, 0) <= +this.max
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                addClass([ele], RANGEHOVER);
                            }
                        }
                        else {
                            removeClass([ele], [RANGEHOVER]);
                        }
                        if (!ele.classList.contains(OTHERMONTH$2)) {
                            var startDateValue = new Date(+this.startValue);
                            var eleDateValue_1 = new Date(+eleDate);
                            if (this.currentView() === this.depth &&
                                +eleDateValue_1.setHours(0, 0, 0, 0) === +startDateValue.setHours(0, 0, 0, 0)
                                && +eleDateValue_1.setHours(0, 0, 0, 0) >= +startDateValue.setHours(0, 0, 0, 0) &&
                                +this.startValue >= +this.min
                                && !this.inputWrapper.container.classList.contains('e-error')
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                addClass([ele], [STARTDATE, SELECTED$3]);
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
                                !isNullOrUndefined(this.endValue) &&
                                +eleDateValue_1.setHours(0, 0, 0, 0) === +endDateValue.setHours(0, 0, 0, 0)
                                && +eleDateValue_1.setHours(0, 0, 0, 0) <= +endDateValue.setHours(0, 0, 0, 0) &&
                                +this.startValue >= +this.min
                                && !this.inputWrapper.container.classList.contains('e-error')
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                addClass([ele], [ENDDATE, SELECTED$3]);
                                this.addSelectedAttributes(ele, this.startValue, false);
                            }
                            if (+eleDate === +this.startValue && !isNullOrUndefined(this.endValue) && +eleDate === +this.endValue) {
                                this.addSelectedAttributes(ele, this.endValue, false, true);
                            }
                        }
                    }
                }
            }
        }
    };
    DateRangePicker.prototype.checkMinMaxDays = function () {
        if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) || (!isNullOrUndefined(this.maxDays) && this.maxDays > 0)) {
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
        var startDate = !isNullOrUndefined(this.startValue) ?
            this.globalize.formatDate(this.startValue, { format: this.formatString, type: 'date', skeleton: 'yMd' }) : null;
        var endDate = !isNullOrUndefined(this.endValue) ?
            this.globalize.formatDate(this.endValue, { format: this.formatString, type: 'date', skeleton: 'yMd' }) : null;
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            inputValue = startDate + ' ' + this.separator + ' ' + endDate;
            range = (Math.round(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
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
            isInteracted: !isNullOrUndefined(e),
            text: inputValue
        };
        return args;
    };
    DateRangePicker.prototype.otherMonthSelect = function (ele, isStartDate, sameDate) {
        var value = +this.getIdValue(null, ele);
        var dateIdString = '*[id^="/id"]:not(.e-other-month)'.replace('/id', '' + value);
        var tdCell = this.popupObj && this.popupObj.element.querySelector(dateIdString);
        if (!isNullOrUndefined(tdCell)) {
            if (isStartDate) {
                addClass([tdCell], [STARTDATE, SELECTED$3]);
                this.addSelectedAttributes(tdCell, this.startValue, true);
            }
            else {
                addClass([tdCell], [ENDDATE, SELECTED$3]);
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
        date = isNullOrUndefined(event) ? this.getIdValue(null, element)
            : this.getIdValue(event, null);
        var y = date.getFullYear();
        var m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var firstMonth = new Date(y, 0, 1);
        var lastMonth = new Date(y, 11, 31);
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            if (!this.isMobile || this.isMobile && !this.endButton.element.classList.contains(ACTIVE$1)) {
                this.removeSelection();
            }
        }
        else if (this.isMobile && this.startButton.element.classList.contains(ACTIVE$1)) {
            this.removeSelection();
        }
        var ele = element || event.currentTarget;
        if (isNullOrUndefined(this.startValue)) {
            if (!isNullOrUndefined(this.previousStartValue)) {
                date.setHours(this.previousStartValue.getHours());
                date.setMinutes(this.previousStartValue.getMinutes());
                date.setSeconds(this.previousStartValue.getSeconds());
            }
            this.startValue = (this.depth === 'Month') ? new Date(this.checkValue(date)) :
                (this.depth === 'Year') ? firstDay : firstMonth;
            this.endValue = null;
            this.setValue();
            addClass([ele], STARTDATE);
            this.addSelectedAttributes(ele, this.startValue, true);
            if (ele.classList.contains(OTHERMONTH$2)) {
                this.otherMonthSelect(ele, true);
            }
            this.checkMinMaxDays();
            this.applyButton.disabled = true;
            this.applyButton.element.disabled = true;
            if (this.isMobile) {
                this.endButton.element.classList.add(ACTIVE$1);
                this.startButton.element.classList.remove(ACTIVE$1);
                this.endButton.element.removeAttribute('disabled');
                this.selectableDates();
            }
            this.trigger('select', this.rangeArgs(event));
        }
        else {
            if (+date === +this.startValue || +date > +this.startValue) {
                if (+date === +this.startValue && !isNullOrUndefined(this.minDays) && this.minDays > 1) {
                    return;
                }
                this.endValue = null;
                this.setValue();
                if (this.isMobile || element) {
                    this.hoverSelection(event, element);
                }
                if (!isNullOrUndefined(this.previousEndValue)) {
                    date.setHours(this.previousEndValue.getHours());
                    date.setMinutes(this.previousEndValue.getMinutes());
                    date.setSeconds(this.previousEndValue.getSeconds());
                }
                this.endValue = (this.depth === 'Month') ? new Date(this.checkValue(date)) :
                    (this.depth === 'Year') ? lastDay : lastMonth;
                this.setValue();
                var endEle = this.popupObj.element.querySelectorAll('.' + ENDDATE);
                if (this.isMobile) {
                    this.startButton.element.classList.remove(ACTIVE$1);
                    this.endButton.element.classList.add(ACTIVE$1);
                    for (var _i = 0, endEle_1 = endEle; _i < endEle_1.length; _i++) {
                        var ele_1 = endEle_1[_i];
                        ele_1.removeAttribute('aria-label');
                        if (!ele_1.classList.contains(STARTDATE)) {
                            ele_1.setAttribute('aria-selected', 'false');
                            removeClass([ele_1], [ENDDATE, SELECTED$3]);
                        }
                        else {
                            this.addSelectedAttributes(ele_1, this.startValue, true);
                            removeClass([ele_1], [ENDDATE]);
                        }
                    }
                }
                addClass([ele], ENDDATE);
                if (+this.endValue === +this.startValue) {
                    this.addSelectedAttributes(ele, this.endValue, false, true);
                }
                else {
                    this.addSelectedAttributes(ele, this.endValue, false);
                }
                if (ele.classList.contains(OTHERMONTH$2)) {
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
                        removeClass([ele_2], [RANGEHOVER]);
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
                removeClass(this.popupObj.element.querySelectorAll('.' + STARTDATE), [STARTDATE, SELECTED$3]);
                addClass([ele], STARTDATE);
                this.addSelectedAttributes(ele, this.startValue, true);
                if (ele.classList.contains(OTHERMONTH$2)) {
                    this.otherMonthSelect(ele, true);
                }
                this.checkMinMaxDays();
            }
        }
        if (event) {
            leftCalendar = closest(event.target, '.' + LEFTCALENDER);
        }
        if (!isNullOrUndefined(leftCalendar)) {
            this.leftCalendar.children[1].firstElementChild.focus();
        }
        else {
            if (event) {
                rightCalendar = event && closest(event.target, '.' + RIGHTCALENDER);
            }
            if (!isNullOrUndefined(rightCalendar)) {
                this.rightCalendar.children[1].firstElementChild.focus();
            }
        }
        addClass([ele], SELECTED$3);
        this.updateHeader();
        this.removeFocusedDate();
    };
    DateRangePicker.prototype.selectableDates = function () {
        if (!isNullOrUndefined(this.startValue)) {
            var tdCells = this.calendarElement.querySelectorAll('.' + CALENDAR + ' td');
            var isStartDate = false;
            if (this.currentView() === this.depth) {
                for (var _i = 0, tdCells_4 = tdCells; _i < tdCells_4.length; _i++) {
                    var ele = tdCells_4[_i];
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(WEEKNUMBER$2)) {
                        if (!ele.classList.contains(DISABLED$2)) {
                            var eleDate = this.getIdValue(null, ele);
                            if (+eleDate < +this.startValue) {
                                addClass([ele], [DATEDISABLED, DISABLED$2, OVERLAY$2]);
                                EventHandler.clearEvents(ele);
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                    }
                    if (ele.classList.contains(STARTDATE) && !ele.classList.contains(OTHERMONTH$2)) {
                        isStartDate = true;
                        break;
                    }
                }
                if (isStartDate) {
                    if (!this.previousIcon.classList.contains(DISABLED$2)) {
                        addClass([this.previousIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
                    }
                }
            }
            else {
                for (var _a = 0, tdCells_5 = tdCells; _a < tdCells_5.length; _a++) {
                    var ele = tdCells_5[_a];
                    var startMonth = this.startValue.getMonth();
                    var startYear = this.startValue.getFullYear();
                    var element = this.getIdValue(null, ele);
                    if (!this.startButton.element.classList.contains(ACTIVE$1) && ((this.currentView() === 'Year' &&
                        (element.getMonth() < startMonth) && (element.getFullYear() <= startYear))
                        || (this.currentView() === 'Decade' && (element.getMonth() <= startMonth) &&
                            (element.getFullYear() < startYear)))) {
                        addClass([ele], [DISABLED$2]);
                    }
                    else {
                        break;
                    }
                }
                if (tdCells[0].classList.contains(DISABLED$2)) {
                    this.previousIconHandler(true);
                }
                else if (tdCells[tdCells.length - 1].classList.contains(DISABLED$2)) {
                    this.nextIconHandler(true);
                }
            }
        }
    };
    DateRangePicker.prototype.updateMinMaxDays = function (calendar) {
        if ((!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) ||
            (this.isMobile && this.endButton.element.classList.contains(ACTIVE$1))) {
            if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) || (!isNullOrUndefined(this.maxDays) && this.maxDays > 0)) {
                var minDate = new Date(new Date(+this.startValue).setDate(this.startValue.getDate() + (this.minDays - 1)));
                var maxDate = new Date(new Date(+this.startValue).setDate(this.startValue.getDate() + (this.maxDays - 1)));
                minDate = (!isNullOrUndefined(this.minDays) && this.minDays > 0) ? minDate : null;
                maxDate = (!isNullOrUndefined(this.maxDays) && this.maxDays > 0) ? maxDate : null;
                if (this.currentView() === 'Year') {
                    minDate = isNullOrUndefined(minDate) ? null : new Date(minDate.getFullYear(), minDate.getMonth(), 0);
                    maxDate = isNullOrUndefined(maxDate) ? null : new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
                }
                else if (this.currentView() === 'Decade') {
                    minDate = isNullOrUndefined(minDate) ? null : new Date(minDate.getFullYear() - 1, 11, 1);
                    maxDate = isNullOrUndefined(maxDate) ? null : new Date(maxDate.getFullYear(), 0, 1);
                }
                var tdCells = calendar.querySelectorAll('.' + CALENDAR + ' td');
                var maxEle = void 0;
                for (var _i = 0, tdCells_6 = tdCells; _i < tdCells_6.length; _i++) {
                    var ele = tdCells_6[_i];
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(WEEKNUMBER$2)) {
                        var eleDate = this.getIdValue(null, ele);
                        if (!isNullOrUndefined(minDate) && +eleDate === +minDate && ele.classList.contains(DISABLED$2)) {
                            minDate.setDate(minDate.getDate() + 1);
                        }
                        if (!ele.classList.contains(DISABLED$2)) {
                            if (+eleDate <= +this.startValue) {
                                continue;
                            }
                            if (!isNullOrUndefined(minDate) && +eleDate < +minDate) {
                                addClass([ele], [DATEDISABLED, DISABLED$2, OVERLAY$2]);
                                EventHandler.clearEvents(ele);
                            }
                            if (!isNullOrUndefined(maxDate) && +eleDate > +maxDate) {
                                addClass([ele], [DATEDISABLED, DISABLED$2, OVERLAY$2]);
                                this.isMaxDaysClicked = true;
                                EventHandler.clearEvents(ele);
                                if (isNullOrUndefined(maxEle) && !ele.classList.contains(OTHERMONTH$2)) {
                                    maxEle = ele;
                                }
                            }
                        }
                    }
                }
                if (!isNullOrUndefined(maxEle)) {
                    if (this.isMobile) {
                        if (!this.nextIcon.classList.contains(DISABLED$2)) {
                            addClass([this.nextIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
                        }
                    }
                    else {
                        var calendar_1 = closest(maxEle, '.' + RIGHTCALENDER);
                        calendar_1 = isNullOrUndefined(calendar_1) ? this.leftCalendar : calendar_1;
                        var isLeftCalendar = calendar_1.classList.contains(LEFTCALENDER);
                        if (!isLeftCalendar) {
                            if (!this.rightCalNextIcon.classList.contains(DISABLED$2)) {
                                addClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
                            }
                        }
                        else {
                            if (!this.rightCalNextIcon.classList.contains(DISABLED$2)) {
                                addClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
                            }
                            if (!this.leftCalNextIcon.classList.contains(DISABLED$2)) {
                                addClass([this.leftCalNextIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
                            }
                            if (!this.rightCalPrevIcon.classList.contains(DISABLED$2)) {
                                addClass([this.rightCalPrevIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
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
                removeClass([ele], [DATEDISABLED, DISABLED$2, OVERLAY$2]);
                EventHandler.add(ele, 'click', this.selectRange, this);
                if (!this.isMobile) {
                    EventHandler.add(ele, 'mouseover', this.hoverSelection, this);
                }
            }
        }
        if (this.isMobile) {
            if (this.nextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.nextIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
            }
            if (this.previousIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.previousIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
            }
        }
        else {
            if (this.rightCalNextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
            }
            if (this.rightCalPrevIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.rightCalPrevIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
            }
            if (this.leftCalNextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.leftCalNextIcon], [ICONDISABLED, DISABLED$2, OVERLAY$2]);
            }
        }
    };
    DateRangePicker.prototype.updateHeader = function () {
        var format = { type: 'date', skeleton: 'yMMMd' };
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            var range = (Math.round(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if (!isNullOrUndefined(this.disabledDayCnt)) {
                range = range - this.disabledDayCnt;
                this.disabledDayCnt = null;
            }
            this.popupObj.element.querySelector('.' + DAYSPAN).textContent = range.toString() + ' ' + this.l10n.getConstant('days');
        }
        else {
            this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
        }
        if (!this.isMobile) {
            if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.globalize.formatDate(this.endValue, format);
            }
            else {
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.l10n.getConstant('endLabel');
            }
            if (!isNullOrUndefined(this.startValue)) {
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.globalize.formatDate(this.startValue, format);
            }
            else {
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.l10n.getConstant('startLabel');
            }
        }
        else {
            if (!isNullOrUndefined(this.startValue)) {
                this.startButton.element.textContent = this.globalize.formatDate(this.startValue, format);
            }
            else {
                this.startButton.element.textContent = this.l10n.getConstant('startLabel');
            }
            if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
                this.endButton.element.textContent = this.globalize.formatDate(this.endValue, format);
            }
            else {
                this.endButton.element.textContent = this.l10n.getConstant('endLabel');
            }
        }
        if ((this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue)) ||
            ((!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
                || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
                || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue))
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
            if (this.popupObj.element.querySelectorAll('.' + SELECTED$3).length > 0) {
                removeClass(this.popupObj.element.querySelectorAll('.' + SELECTED$3), [STARTDATE, ENDDATE, SELECTED$3]);
            }
            if (this.popupObj.element.querySelectorAll('.' + FOCUSDATE).length > 0) {
                removeClass(this.popupObj.element.querySelectorAll('.' + FOCUSDATE), FOCUSDATE);
            }
            if (this.popupObj.element.querySelectorAll('.' + RANGEHOVER).length > 0) {
                removeClass(this.popupObj.element.querySelectorAll('.' + RANGEHOVER), [RANGEHOVER]);
            }
        }
    };
    DateRangePicker.prototype.addSelectedAttributes = function (ele, date, isStartDate, sameDate) {
        if (ele) {
            var title = this.globalize.formatDate(date, { type: 'date', skeleton: 'full' });
            if (!isNullOrUndefined(sameDate) && sameDate) {
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
        this.contentElement = calendar.querySelector('.' + CONTENT$1);
        this.tableBodyElement = select('.' + CONTENT$1 + ' tbody', calendar);
        this.table = calendar.querySelector('.' + CONTENT$1).getElementsByTagName('table')[0];
        this.headerTitleElement = calendar.querySelector('.' + HEADER$1 + ' .' + TITLE$1);
        this.headerElement = calendar.querySelector('.' + HEADER$1);
    };
    DateRangePicker.prototype.navPrevMonth = function (e) {
        e.preventDefault();
        var ele = closest(e.target, '.' + LEFTCALENDER);
        ele = isNullOrUndefined(ele) ? closest(e.target, '.' + RIGHTCALENDER) : ele;
        this.updateCalendarElement(ele);
        this.navigatePrevious(e);
        if (!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) {
            this.updateMinMaxDays(ele);
        }
        this.updateControl(ele);
    };
    DateRangePicker.prototype.deviceNavigation = function (ele) {
        this.deviceCalendarEvent();
        this.updateRange([this.popupObj.element.querySelector('.' + CALENDAR)]);
        if (this.endButton.element.classList.contains(ACTIVE$1)) {
            this.updateMinMaxDays(this.popupObj.element.querySelector('.' + CALENDAR));
        }
        if (this.endButton.element.classList.contains(ACTIVE$1)) {
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
        var ele = closest(event.target, '.' + LEFTCALENDER);
        ele = isNullOrUndefined(ele) ? closest(event.target, '.' + RIGHTCALENDER) : ele;
        this.updateCalendarElement(ele);
        this.navigateNext(event);
        if (!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) {
            this.updateMinMaxDays(ele);
        }
        this.updateControl(ele);
    };
    DateRangePicker.prototype.isPopupOpen = function () {
        if (!isNullOrUndefined(this.popupObj) && this.popupObj.element.classList.contains(POPUP$1)) {
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
            attributes(startLabel, { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'Start Date', 'role': 'button' });
            attributes(endLabel, { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'End Date', 'role': 'button' });
            labelContainer.appendChild(startLabel);
            labelContainer.appendChild(changeIcon);
            labelContainer.appendChild(endLabel);
            startLabel.textContent = this.l10n.getConstant('startLabel');
            endLabel.textContent = this.l10n.getConstant('endLabel');
        }
        else {
            var endBtn = this.createElement('button', { className: ENDBUTTON });
            var startBtn = this.createElement('button', { className: STARTBUTTON });
            this.startButton = new Button({ content: this.l10n.getConstant('startLabel') }, startBtn);
            this.endButton = new Button({ content: this.l10n.getConstant('endLabel') }, endBtn);
            labelContainer.appendChild(startBtn);
            labelContainer.appendChild(endBtn);
        }
        return labelContainer;
    };
    DateRangePicker.prototype.disableInput = function () {
        if (this.strictMode) {
            if (!isNullOrUndefined(this.previousStartValue) && !isNullOrUndefined(this.previousEndValue)) {
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
        Input.setEnabled(this.enabled, this.inputElement);
        this.bindEvents();
    };
    DateRangePicker.prototype.validateMinMax = function () {
        this.min = isNullOrUndefined(this.min) || !(+this.min) ? this.min = new Date(1900, 0, 1) : this.min;
        this.max = isNullOrUndefined(this.max) || !(+this.max) ? this.max = new Date(2099, 11, 31) : this.max;
        if (!(this.min <= this.max)) {
            this.disableInput();
            return;
        }
        if (!isNullOrUndefined(this.minDays) && !isNullOrUndefined(this.maxDays)) {
            if (this.maxDays > 0 && this.minDays > 0 && (this.minDays > this.maxDays)) {
                this.maxDays = null;
            }
        }
        if (!isNullOrUndefined(this.minDays) && this.minDays < 0) {
            this.minDays = null;
        }
        if (!isNullOrUndefined(this.maxDays) && this.maxDays < 0) {
            this.maxDays = null;
        }
    };
    DateRangePicker.prototype.validateRangeStrict = function () {
        if (!isNullOrUndefined(this.startValue)) {
            if (+this.startValue <= +this.min) {
                this.startValue = this.min;
                this.setValue();
            }
            else if (+this.startValue >= +this.min && +this.startValue >= +this.max) {
                this.startValue = this.max;
            }
        }
        if (!isNullOrUndefined(this.endValue)) {
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
        if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            var range = (Math.round(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) && !(range >= this.minDays)) {
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
            if ((!isNullOrUndefined(this.maxDays) && this.maxDays > 0) && !(range <= this.maxDays)) {
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
            this.calendarElement.classList.add(RTL$2);
        }
        attributes(this.calendarElement, { 'role': 'calendar' });
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
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) && !this.isSameMonth(this.endValue, this.currentDate)
            && !this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)) {
            this.currentDate = new Date(+this.endValue);
        }
        else {
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            return;
        }
        if ((!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
            || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setDate(1);
            var month = this.currentDate.getMonth() + 1;
            this.currentDate.setMonth(month);
        }
    };
    DateRangePicker.prototype.selectNextYear = function () {
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) && !this.isSameYear(this.endValue, this.currentDate)
            && !this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)) {
            this.currentDate = new Date(+this.endValue);
        }
        else {
            this.currentDate.setMonth(0);
            var yr = this.currentDate.getFullYear() + 1;
            this.currentDate.setFullYear(yr);
            return;
        }
        if ((!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
            || (!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setMonth(0);
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        }
    };
    DateRangePicker.prototype.selectNextDecade = function () {
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) && !this.isSameDecade(this.endValue, this.currentDate)
            && !this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)) {
            this.currentDate = new Date(+this.endValue);
        }
        else {
            var decyr = this.currentDate.getFullYear() + 10;
            this.currentDate.setFullYear(decyr);
            return;
        }
        if (((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
            || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || (!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 10);
        }
    };
    DateRangePicker.prototype.selectStartMonth = function () {
        if (!isNullOrUndefined(this.startValue)) {
            if (!isNullOrUndefined(this.max) && this.isSameMonth(this.startValue, this.max)) {
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
        if ((!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || (!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
            || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)) {
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
            this.leftCalPrevIcon = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + PREVICON$1);
            this.leftCalNextIcon = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + NEXTICON$1);
            this.leftTitle = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + TITLE$1);
            remove(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + ICONCONTAINER$1));
            this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER$1).appendChild(this.leftCalNextIcon);
            this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER$1).appendChild(this.leftCalPrevIcon);
            prepend([this.leftCalPrevIcon], this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER$1));
            this.leftCalendar = this.calendarElement;
            var leftContainer = this.createElement('div', { className: LEFTCONTAINER });
            var rightContainer = this.createElement('div', { className: RIGHTCONTAINER });
            leftContainer.appendChild(this.leftCalendar);
            calendarContainer.appendChild(leftContainer);
            if (!this.isMobile) {
                EventHandler.add(this.leftTitle, 'click', this.leftNavTitle, this);
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
            addClass([this.calendarElement], RIGHTCALENDER);
            this.rightCalendar = this.calendarElement;
            removeClass([this.leftCalendar && this.leftCalendar.querySelector('.e-content tbody')], 'e-zoomin');
            removeClass([this.rightCalendar && this.rightCalendar.querySelector('.e-content tbody')], 'e-zoomin');
            this.rightCalPrevIcon = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + PREVICON$1);
            this.rightCalNextIcon = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + NEXTICON$1);
            this.rightTitle = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + TITLE$1);
            remove(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + ICONCONTAINER$1));
            this.calendarElement.querySelector('table').setAttribute('tabindex', '-1');
            this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER$1).appendChild(this.rightCalNextIcon);
            this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER$1).appendChild(this.rightCalPrevIcon);
            prepend([this.rightCalPrevIcon], this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER$1));
            rightContainer.appendChild(this.rightCalendar);
            calendarContainer.appendChild(rightContainer);
            if (!this.isMobile) {
                EventHandler.add(this.rightTitle, 'click', this.rightNavTitle, this);
            }
        }
        else {
            if (!isNullOrUndefined(this.startValue)) {
                this.currentDate = new Date(+this.startValue);
            }
            _super.prototype.validateDate.call(this);
            _super.prototype.minMaxUpdate.call(this);
            _super.prototype.render.call(this);
            var prevIcon = this.calendarElement.querySelector('.' + CALENDAR + ' .' + PREVICON$1);
            var nextIcon = this.calendarElement.querySelector('.' + CALENDAR + ' .' + NEXTICON$1);
            remove(this.calendarElement.querySelector('.' + CALENDAR + ' .' + ICONCONTAINER$1));
            this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER$1).appendChild(nextIcon);
            this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER$1).appendChild(prevIcon);
            prepend([prevIcon], this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER$1));
            this.deviceCalendar = this.calendarElement;
            calendarContainer.appendChild(this.calendarElement);
            this.headerTitleElement = this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER$1 + ' .' + TITLE$1);
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
            if (closest(e.target, '.e-calendar.e-left-calendar')) {
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
        if (!isNullOrUndefined(this.popupObj)) {
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
                        || (!isNullOrUndefined(this.controlDown)))) {
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
                        || (!isNullOrUndefined(this.controlDown))) {
                        this.rightCalCurrentDate = new Date(+this.currentDate);
                        this.effect = '';
                        this.currentDate = this.rightCalCurrentDate;
                        this.updateCalendarElement(this.rightCalendar);
                        this.updateControl(this.rightCalendar);
                        this.updateCalendarElement(this.leftCalendar);
                        if (this.startValue && isNullOrUndefined(this.endValue)) {
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
        attributes(daySpan, { 'aria-label': 'Selected Days' });
        daySpan.textContent = this.l10n.getConstant('selectedDays');
        headerContainer.appendChild(daySpan);
        var separator = this.createElement('div', { className: SEPARATOR });
        var calendarContainer = this.createCalendar();
        controlContainer.appendChild(headerContainer);
        controlContainer.appendChild(separator);
        controlContainer.appendChild(calendarContainer);
        var footerSection = this.createElement('div', { className: FOOTER$1 });
        var cancelBtn = this.createElement('button', { className: CANCEL + ' ' + FLAT$1 + ' ' + CSS$1 });
        var applyBtn = this.createElement('button');
        addClass([applyBtn], [APPLY, FLAT$1, PRIMARY$1, CSS$1]);
        footerSection.appendChild(applyBtn);
        footerSection.appendChild(cancelBtn);
        var enable = !isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue);
        this.cancelButton = new Button({ content: this.l10n.getConstant('cancelText') }, cancelBtn);
        this.applyButton = new Button({ content: this.l10n.getConstant('applyText'), disabled: !enable }, applyBtn);
        EventHandler.add(applyBtn, 'click', this.applyFunction, this);
        EventHandler.add(cancelBtn, 'click', this.cancelFunction, this);
        this.popupWrapper.appendChild(controlContainer);
        if (!this.isMobile) {
            if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
                this.createPresets();
                this.listRippleEffect();
                addClass([controlContainer], RANGEBORDER);
                addClass([this.popupWrapper], 'e-preset-wrapper');
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
            addClass([this.inputWrapper.container], [INPUTFOCUS$1]);
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
        if (isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) {
            this.endButton.element.setAttribute('disabled', '');
            this.startButton.element.classList.add(ACTIVE$1);
        }
        else if (!isNullOrUndefined(this.startValue)) {
            this.startButton.element.classList.add(ACTIVE$1);
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
            addClass([this.inputWrapper.container], [INPUTFOCUS$1]);
        }
        if (eve.type !== 'touchstart' &&
            this.closeEventArgs && !this.closeEventArgs.cancel) {
            eve.preventDefault();
        }
        if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            this.previousStartValue = new Date(+this.startValue);
            this.previousEndValue = new Date(+this.endValue);
            this.previousEleValue = this.inputElement.value;
            Input.setValue(this.rangeArgs(eve).text, this.inputElement, this.floatLabelType, this.showClearButton);
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
        if (!(closest(eve.target, '.' + INPUTCONTAINER$1))
            && (!isValueChanged)) {
            this.focusOut();
        }
        if (!this.isMobile) {
            this.isKeyPopup = false;
            if (this.isRangeIconClicked) {
                this.inputWrapper.container.children[1].focus();
                this.keyInputConfigs = extend(this.keyInputConfigs, this.keyConfigs);
                this.popupKeyboardModule = new KeyboardEvents(this.inputWrapper.container.children[1], {
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
        var li = closest(target, '.' + LISTCLASS);
        var isClick = li && li.classList.contains(ACTIVE$1);
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
        var li = closest(event.target, '.' + LISTCLASS);
        if (li && li.classList.contains(LISTCLASS) && !li.classList.contains(HOVER)) {
            addClass([li], HOVER);
        }
    };
    DateRangePicker.prototype.onMouseLeave = function (event) {
        var item = closest(event.target, '.' + HOVER);
        if (!isNullOrUndefined(item)) {
            removeClass([item], HOVER);
        }
    };
    DateRangePicker.prototype.setListSelection = function (li, event) {
        if (li && (!li.classList.contains(ACTIVE$1) || (this.isMobile && li.classList.contains(ACTIVE$1)))) {
            if (this.isMobile && li.classList.contains(ACTIVE$1)) {
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
            addClass([li], ACTIVE$1);
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
        var item = this.presetElement.querySelector('.' + ACTIVE$1);
        if (!isNullOrUndefined(item)) {
            removeClass([item], ACTIVE$1);
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
        this.popupWrapper = this.createElement('div', { id: this.element.id + '_popup', className: ROOT$2 + ' ' + POPUP$1 });
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
            rippleEffect(li);
        }
    };
    DateRangePicker.prototype.createPresets = function () {
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
            this.presetElement = this.createElement('div', { className: PRESETS, attrs: { 'tabindex': '0' } });
            var listTag = ListBase.createList(this.createElement, this.presetsItem, null, true);
            attributes(listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
            this.presetElement.appendChild(listTag);
            this.popupWrapper.appendChild(this.presetElement);
            var customElement = this.presetElement.querySelector('#custom_range');
            if (!isNullOrUndefined(customElement)) {
                customElement.textContent = this.l10n.getConstant('customRange') !== '' ? this.l10n.getConstant('customRange')
                    : 'Custom Range';
            }
            this.liCollections = this.presetElement.querySelectorAll('.' + LISTCLASS);
            this.wireListEvents();
            if (this.isMobile) {
                this.presetElement.style.width = this.inputWrapper.container.getBoundingClientRect().width + 'px';
            }
            if (!isNullOrUndefined(this.activeIndex) && this.activeIndex > -1) {
                addClass([this.liCollections[this.activeIndex]], ACTIVE$1);
            }
        }
    };
    DateRangePicker.prototype.wireListEvents = function () {
        EventHandler.add(this.presetElement, 'click', this.onMouseClick, this);
        if (!this.isMobile) {
            EventHandler.add(this.presetElement, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.presetElement, 'mouseout', this.onMouseLeave, this);
        }
    };
    DateRangePicker.prototype.unWireListEvents = function () {
        if (!isNullOrUndefined(this.presetElement)) {
            EventHandler.remove(this.presetElement, 'click touchstart', this.onMouseClick);
            if (!this.isMobile) {
                EventHandler.remove(this.presetElement, 'mouseover', this.onMouseOver);
                EventHandler.remove(this.presetElement, 'mouseout', this.onMouseLeave);
            }
        }
    };
    // tslint:disable-next-line:max-func-body-length
    DateRangePicker.prototype.renderPopup = function () {
        var _this = this;
        this.popupWrapper.classList.add('e-control');
        var popupWidth = this.popupWrapper.getBoundingClientRect().width;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass.trim() !== '') {
            this.popupWrapper.className += ' ' + this.cssClass;
        }
        if (this.isMobile && this.isCustomWindow) {
            this.modal = this.createElement('div');
            document.body.appendChild(this.modal);
        }
        this.popupObj = new Popup(this.popupWrapper, {
            relateTo: this.isMobile && this.isCustomWindow ? document.body :
                (!isNullOrUndefined(this.targetElement) ? this.targetElement : this.inputWrapper.container),
            position: (this.isMobile ?
                (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && !this.isCustomWindow ?
                    { X: 'left', Y: 'bottom' } : { X: 'center', Y: 'center' }) :
                this.enableRtl ? { X: 'left', Y: 'bottom' } : { X: 'right', Y: 'bottom' }),
            offsetX: this.isMobile || this.enableRtl ? 0 : -popupWidth,
            offsetY: OFFSETVALUE$1,
            collision: this.isMobile ?
                (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && !this.isCustomWindow ?
                    { X: 'fit' } : { X: 'fit', Y: 'fit' }) : { X: 'fit', Y: 'flip' },
            targetType: this.isMobile && this.isCustomWindow ? 'container' : 'relative',
            enableRtl: this.enableRtl,
            zIndex: this.zIndex,
            open: function () {
                attributes(_this.inputElement, { 'aria-expanded': 'true' });
                addClass([_this.inputWrapper.buttons[0]], ACTIVE$1);
                if (!_this.isMobile) {
                    if (_this.cancelButton) {
                        _this.btnKeyboardModule = new KeyboardEvents(_this.cancelButton.element, {
                            eventName: 'keydown',
                            keyAction: _this.popupKeyActionHandle.bind(_this),
                            keyConfigs: { tab: 'tab', altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                        });
                        _this.btnKeyboardModule = new KeyboardEvents(_this.applyButton.element, {
                            eventName: 'keydown',
                            keyAction: _this.popupKeyActionHandle.bind(_this),
                            keyConfigs: { altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                        });
                    }
                    if (!isNullOrUndefined(_this.leftCalendar)) {
                        if (!_this.isRangeIconClicked) {
                            _this.calendarFocus();
                        }
                    }
                    if (!isNullOrUndefined(_this.presetElement)) {
                        _this.keyInputConfigs = extend(_this.keyInputConfigs, _this.keyConfigs);
                        _this.presetKeyboardModule = new KeyboardEvents(_this.presetElement, {
                            eventName: 'keydown',
                            keyAction: _this.presetKeyActionHandler.bind(_this),
                            keyConfigs: _this.keyInputConfigs
                        });
                        _this.presetKeyboardModule = new KeyboardEvents(_this.presetElement, {
                            eventName: 'keydown',
                            keyAction: _this.popupKeyActionHandle.bind(_this),
                            keyConfigs: { altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                        });
                        if (isNullOrUndefined(_this.leftCalendar)) {
                            _this.preventBlur = true;
                            _this.presetElement.focus();
                        }
                        else {
                            _this.presetElement.setAttribute('tabindex', '-1');
                        }
                    }
                    _this.popupKeyBoardHandler();
                }
                if (_this.isMobile && !Browser.isDevice) {
                    EventHandler.add(document, 'keydown', _this.popupCloseHandler, _this);
                }
            },
            close: function () {
                attributes(_this.inputElement, { 'aria-expanded': 'false' });
                removeClass([_this.inputWrapper.buttons[0]], ACTIVE$1);
                if (_this.isRangeIconClicked) {
                    _this.inputWrapper.container.children[1].focus();
                }
                if (!isUndefined(_this.presets[0].start && _this.presets[0].end && _this.presets[0].label)) {
                    _this.unWireListEvents();
                }
                if (!isNullOrUndefined(_this.popupObj)) {
                    if (!isNullOrUndefined(_this.popupObj.element.parentElement)) {
                        detach(_this.popupObj.element);
                    }
                    _this.popupObj.destroy();
                    _this.popupObj = null;
                }
                if (_this.isMobile && !Browser.isDevice) {
                    EventHandler.remove(document, 'keydown', _this.popupCloseHandler);
                }
            }, targetExitViewport: function () {
                if (!Browser.isDevice) {
                    _this.hide();
                }
            }
        });
        if (this.isMobile) {
            this.popupObj.element.classList.add(DEVICE$1);
            if (!this.isMobile) {
                this.popupObj.element.classList.add('e-bigger');
            }
        }
        if (this.isMobile && this.isCustomWindow) {
            addClass([this.modal], [DEVICE$1, ROOT$2, 'e-range-modal']);
            document.body.className += ' ' + OVERFLOW$1;
            this.modal.style.display = 'block';
        }
        EventHandler.add(document, 'mousedown touchstart', this.documentHandler, this);
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
            var ele = closest(startDate, '.' + RIGHTCALENDER);
            ele = isNullOrUndefined(ele) ? this.leftCalendar : ele;
            if (this.isRangeIconClicked) {
                this.inputWrapper.container.focus();
            }
            else {
                this.preventBlur = true;
                ele.children[1].firstElementChild.focus();
            }
            addClass([startDate], FOCUSDATE);
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
        if (!isNullOrUndefined(presets) && !isNullOrUndefined(rangeContainer)) {
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
                if (!isNullOrUndefined(this.leftCalendar) && !isNullOrUndefined(actItem)) {
                    if (isNullOrUndefined(hvrItem) || (!isNullOrUndefined(actItem) && actItem === hvrItem)) {
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
                if (!isNullOrUndefined(hvrItem) || !isNullOrUndefined(actItem)) {
                    this.onMouseClick(e, hvrItem || actItem);
                }
                e.preventDefault();
                break;
            case 'tab':
                if (this.leftCalendar) {
                    var item = this.getHoverLI();
                    if (!isNullOrUndefined(item)) {
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
        if (!isNullOrUndefined(hvrItem)) {
            var li = hvrItem.nextElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                removeClass([hvrItem], HOVER);
                addClass([li], HOVER);
            }
        }
        else if (!isNullOrUndefined(actItem)) {
            var li = actItem.nextElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                addClass([li], HOVER);
            }
        }
        else {
            addClass([this.liCollections[0]], HOVER);
        }
    };
    DateRangePicker.prototype.listMoveUp = function (e) {
        var hvrItem = this.getHoverLI();
        var actItem = this.getActiveLI();
        if (!isNullOrUndefined(hvrItem)) {
            var li = hvrItem.previousElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                removeClass([hvrItem], HOVER);
                addClass([li], HOVER);
            }
        }
        else if (!isNullOrUndefined(actItem)) {
            var li = actItem.previousElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                addClass([li], HOVER);
            }
        }
    };
    DateRangePicker.prototype.getHoverLI = function () {
        var item = this.presetElement.querySelector('.' + HOVER);
        return item;
    };
    DateRangePicker.prototype.getActiveLI = function () {
        var item = this.presetElement.querySelector('.' + ACTIVE$1);
        return item;
    };
    DateRangePicker.prototype.popupKeyBoardHandler = function () {
        this.popupKeyboardModule = new KeyboardEvents(this.popupWrapper, {
            eventName: 'keydown',
            keyAction: this.popupKeyActionHandle.bind(this),
            keyConfigs: { escape: 'escape' }
        });
        this.keyInputConfigs = extend(this.keyInputConfigs, this.keyConfigs);
        this.popupKeyboardModule = new KeyboardEvents(this.inputWrapper.container.children[1], {
            eventName: 'keydown',
            keyAction: this.popupKeyActionHandle.bind(this),
            keyConfigs: this.keyInputConfigs
        });
    };
    DateRangePicker.prototype.setScrollPosition = function () {
        var listHeight = this.presetElement.getBoundingClientRect().height;
        var hover = this.presetElement.querySelector('.' + HOVER);
        var active = this.presetElement.querySelector('.' + ACTIVE$1);
        var element = !isNullOrUndefined(hover) ? hover : active;
        if (!isNullOrUndefined(element)) {
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
        var presetElement = closest(e.target, '.' + PRESETS);
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
                if (!isNullOrUndefined(presetElement)) {
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
                if (!isNullOrUndefined(presetElement)) {
                    this.rightCalendar.children[1].firstElementChild.focus();
                }
                else {
                    if (document.activeElement === this.applyButton.element && this.applyButton.element.disabled !== true) {
                        this.cancelButton.element.focus();
                    }
                    else {
                        if (!isNullOrUndefined(this.presetElement) && (document.activeElement === this.cancelButton.element)) {
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
        if (isNullOrUndefined(this.popupObj)) {
            return;
        }
        var target = e.target;
        if (!this.inputWrapper.container.contains(target) ||
            (!isNullOrUndefined(this.popupObj) && !closest(target, this.popupWrapper.id))) {
            if (e.type !== 'touchstart' && ((e.type === 'mousedown') ||
                this.closeEventArgs && !this.closeEventArgs.cancel)) {
                e.preventDefault();
            }
        }
        if ((isNullOrUndefined(this.targetElement) ||
            (!isNullOrUndefined(this.targetElement) && !(target === this.targetElement))) &&
            !(closest(target, '#' + this.popupObj.element.id))
            && !(closest(target, '.' + INPUTCONTAINER$1) === this.inputWrapper.container)
            && !(closest(target, '.e-daterangepicker.e-popup') && (!target.classList.contains('e-day')))) {
            this.preventBlur = false;
            if (this.isPopupOpen()) {
                this.applyFunction(e);
                if (!this.isMobile) {
                    this.isRangeIconClicked = false;
                }
            }
        }
    };
    DateRangePicker.prototype.createInput = function () {
        this.inputWrapper = Input.createInput({
            floatLabelType: this.floatLabelType,
            element: this.inputElement,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: this.cssClass,
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
            },
            buttons: [DATERANGEICON]
        }, this.createElement);
        attributes(this.inputElement, {
            'aria-readonly': this.readonly ? 'true' : 'false', 'tabindex': '0', 'aria-haspopup': 'true',
            'aria-activedescendant': 'null', 'aria-owns': this.element.id + '_popup', 'aria-expanded': 'false',
            'role': 'combobox', 'autocomplete': 'off', 'aria-disabled': !this.enabled ? 'true' : 'false',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        });
        Input.addAttributes({ 'aria-label': 'select' }, this.inputWrapper.buttons[0]);
        if (!isNullOrUndefined(this.placeholder) && this.placeholder.trim() !== '') {
            Input.addAttributes({ 'aria-placeholder': this.placeholder }, this.inputElement);
        }
        this.setEleWidth(this.width);
        addClass([this.inputWrapper.container], DATERANGEWRAPPER);
        if (isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            attributes(this.inputElement, { 'name': this.element.id });
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
            this.inputWrapper.container.style.width = formatUnit(this.width);
        }
        else {
            this.inputWrapper.container.style.width = '100%';
        }
    };
    DateRangePicker.prototype.adjustLongHeaderWidth = function () {
        if (this.dayHeaderFormat === 'Wide') {
            addClass([this.popupWrapper], DAYHEADERLONG$1);
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
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) && !isDisabled) {
            this.disabledDateRender();
        }
        this.errorClass();
        this.previousStartValue = isNullOrUndefined(this.startValue) || isNaN(+this.startValue) ? null : new Date(+this.startValue);
        this.previousEndValue = isNullOrUndefined(this.endValue) || isNaN(+this.endValue) ? null : new Date(+this.endValue);
    };
    DateRangePicker.prototype.updateInput = function () {
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            var formatOption = { format: this.formatString, type: 'date', skeleton: 'yMd' };
            var startDate = this.globalize.formatDate(this.startValue, formatOption);
            var endDate = this.globalize.formatDate(this.endValue, formatOption);
            Input.setValue(startDate + ' ' + this.separator + ' ' + endDate, this.inputElement, this.floatLabelType, this.showClearButton);
            this.previousStartValue = new Date(+this.startValue);
            this.previousEndValue = new Date(+this.endValue);
        }
        if (!this.strictMode && isNullOrUndefined(this.value) && this.invalidValueString) {
            Input.setValue(this.invalidValueString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    };
    DateRangePicker.prototype.checkInvalidRange = function (value) {
        if (!isNullOrUndefined(value)) {
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
                else if (!isNullOrUndefined(startinvalue)) {
                    invalidobject = true;
                }
                if (!(endinvalue instanceof Date) && typeof (endinvalue) !== 'object') {
                    endString = this.getstringvalue(endinvalue);
                }
                else if (endinvalue instanceof Date) {
                    endObject = true;
                }
                else if (!isNullOrUndefined(endinvalue)) {
                    invalidobject = true;
                }
            }
            if ((isNullOrUndefined(startString) && !startObject && !isNullOrUndefined(endString)) ||
                (!isNullOrUndefined(startString) && !endObject && isNullOrUndefined(endString))) {
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
                if (!isNullOrUndefined(startString) && !isNullOrUndefined(endString)) {
                    valueString = startString + ' ' + this.separator + ' ' + endString;
                }
                else if (!isNullOrUndefined(startString)) {
                    valueString = startString;
                }
                else if (!isNullOrUndefined(endString)) {
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
        if (!isNullOrUndefined(value) && (typeof value === 'number')) {
            stringValue = (value).toString();
        }
        else if (!isNullOrUndefined(value) && (typeof value === 'string')) {
            stringValue = '' + value;
        }
        return stringValue;
    };
    DateRangePicker.prototype.checkInvalidValue = function (value) {
        var valueString = value;
        var invalid = false;
        var formatOpt = null;
        formatOpt = { format: this.formatString, type: 'date', skeleton: 'yMd' };
        if (typeof valueString !== 'string') {
            invalid = true;
        }
        else {
            var globalize = new Internationalization(this.locale);
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
        if (isNullOrUndefined(date)) {
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
        extend(this.virtualRenderCellArgs, { name: 'renderDayCell' });
        this.trigger('renderDayCell', args);
    };
    DateRangePicker.prototype.disabledDates = function () {
        var isStartDisabled = false;
        var isEndDisabled = false;
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            isStartDisabled = this.isDateDisabled(this.startValue);
            isEndDisabled = this.isDateDisabled(this.endValue);
            this.currentDate = null;
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
        this.effect = ZOOMIN$1;
        _super.prototype.navigateTo.call(this, view, date);
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    DateRangePicker.prototype.focusIn = function () {
        if (document.activeElement !== this.inputElement && this.enabled) {
            addClass([this.inputWrapper.container], [INPUTFOCUS$1]);
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
            removeClass([this.inputWrapper.container], [INPUTFOCUS$1]);
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
            removeClass([this.inputElement], [ROOT$2]);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            Input.removeAttributes(ariaAttrs, this.inputElement);
            (!isNullOrUndefined(this.cloneElement.getAttribute('tabindex'))) ?
                this.inputElement.setAttribute('tabindex', this.tabIndex) : this.inputElement.removeAttribute('tabindex');
            this.ensureInputAttribute();
            this.inputElement.classList.remove('e-input');
            if (!isNullOrUndefined(this.inputWrapper)) {
                EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler);
                if (this.angularTag === null) {
                    this.inputWrapper.container.parentElement.appendChild(this.inputElement);
                }
                detach(this.inputWrapper.container);
            }
        }
        if (!isNullOrUndefined(this.inputKeyboardModule) && !this.isMobile) {
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
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
        if ((!isNullOrUndefined(this.firstHiddenChild))
            && (!isNullOrUndefined(this.secondHiddenChild))) {
            detach(this.firstHiddenChild);
            detach(this.secondHiddenChild);
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
            if (isNullOrUndefined(this.cloneElement.getAttribute(attr[i]))) {
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
        if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            range = (Math.round(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            this.disabledDateRender();
            if (!isNullOrUndefined(this.disabledDayCnt)) {
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
                if (this.isMobile || Browser.isDevice) {
                    this.mobileRangePopupWrap = this.createElement('div', { className: 'e-daterangepick-mob-popup-wrap' });
                    document.body.appendChild(this.mobileRangePopupWrap);
                }
                this.openEventArgs = {
                    popup: (isBlazor() && this.isServerRendered) ? null : this.popupObj || null,
                    cancel: false,
                    date: this.inputElement.value,
                    model: (isBlazor() && this.isServerRendered) ? null : this,
                    event: event ? event : null,
                    appendTo: this.isMobile || Browser.isDevice ? this.mobileRangePopupWrap : document.body
                };
                var eventArgs = this.openEventArgs;
                this.trigger('open', eventArgs, function (eventArgs) {
                    _this.openEventArgs = eventArgs;
                    if (!_this.openEventArgs.cancel) {
                        _this.openEventArgs.appendTo.appendChild(_this.popupWrapper);
                        _this.showPopup(element, event);
                        var isPreset = (!_this.isCustomRange || (_this.isMobile && _this.isCustomRange));
                        if (!isUndefined(_this.presets[0].start && _this.presets[0].end && _this.presets[0].label) && isPreset) {
                            _this.setScrollPosition();
                        }
                        _this.checkMinMaxDays();
                        if ((_this.isMobile) && (!isNullOrUndefined(_this.startDate)) && (isNullOrUndefined(_this.endDate))) {
                            _this.endButton.element.classList.add(ACTIVE$1);
                            _this.startButton.element.classList.remove(ACTIVE$1);
                            _this.endButton.element.removeAttribute('disabled');
                            _this.selectableDates();
                        }
                        _super.prototype.setOverlayIndex.call(_this, _this.mobileRangePopupWrap, _this.popupObj.element, _this.modal, _this.isMobile || Browser.isDevice);
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
            if (isNullOrUndefined(this.previousEndValue) && isNullOrUndefined(this.previousStartValue)) {
                this.clearRange();
            }
            else {
                if (!isNullOrUndefined(this.previousStartValue)) {
                    this.startValue = new Date(this.checkValue(this.previousStartValue));
                    this.setValue();
                    this.currentDate = new Date(this.checkValue(this.startValue));
                }
                else {
                    this.startValue = null;
                    this.setValue();
                }
                if (!isNullOrUndefined(this.previousEndValue)) {
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
                    popup: (isBlazor() && this.isServerRendered) ? null : this.popupObj,
                    date: this.inputElement.value,
                    model: (isBlazor() && this.isServerRendered) ? null : this,
                    event: event ? event : null
                };
                var eventArgs = this.closeEventArgs;
                this.trigger('close', eventArgs, function (eventArgs) {
                    _this.closeEventArgs = eventArgs;
                    if (!_this.closeEventArgs.cancel) {
                        if (_this.isMobile) {
                            if (!isNullOrUndefined(_this.startButton) && !isNullOrUndefined(_this.endButton)) {
                                EventHandler.remove(_this.startButton.element, 'click touchstart', _this.deviceHeaderClick);
                                EventHandler.remove(_this.endButton.element, 'click touchstart', _this.deviceHeaderClick);
                            }
                        }
                        if (_this.popupObj) {
                            _this.popupObj.hide();
                            if (_this.preventBlur) {
                                _this.inputElement.focus();
                                addClass([_this.inputWrapper.container], [INPUTFOCUS$1]);
                            }
                        }
                        if (!_this.isMobile) {
                            if (!isNullOrUndefined(_this.leftKeyboardModule) && !isNullOrUndefined(_this.rightKeyboardModule)) {
                                _this.leftKeyboardModule.destroy();
                                _this.rightKeyboardModule.destroy();
                            }
                            if (!isNullOrUndefined(_this.presetElement)) {
                                _this.presetKeyboardModule.destroy();
                            }
                            if (!isNullOrUndefined(_this.cancelButton)) {
                                _this.btnKeyboardModule.destroy();
                            }
                        }
                        _this.targetElement = null;
                        removeClass([document.body], OVERFLOW$1);
                        EventHandler.remove(document, 'mousedown touchstart', _this.documentHandler);
                        if (_this.isMobile && _this.modal) {
                            _this.modal.style.display = 'none';
                            _this.modal.outerHTML = '';
                            _this.modal = null;
                        }
                        if (_this.isMobile || Browser.isDevice) {
                            if (!isNullOrUndefined(_this.mobileRangePopupWrap)) {
                                _this.mobileRangePopupWrap.remove();
                                _this.mobileRangePopupWrap = null;
                            }
                        }
                        _this.isKeyPopup = _this.dateDisabled = false;
                    }
                    else {
                        removeClass([_this.inputWrapper.buttons[0]], ACTIVE$1);
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
        this.globalize = new Internationalization(this.locale);
        this.l10n.setLocale(this.locale);
        this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
        Input.setPlaceholder(this.placeholder, this.inputElement);
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
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        this.refreshChange();
    };
    DateRangePicker.prototype.enableInput = function () {
        if (+this.min <= +this.max) {
            this.setProperties({ enabled: true }, true);
            Input.setEnabled(this.enabled, this.inputElement);
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
        if (isNullOrUndefined(this.firstHiddenChild) && isNullOrUndefined(this.secondHiddenChild)) {
            this.firstHiddenChild = this.createElement('input');
            this.secondHiddenChild = this.createElement('input');
        }
        if (!isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            this.inputElement.setAttribute('data-name', this.inputElement.getAttribute('name'));
            this.inputElement.removeAttribute('name');
        }
        attributes(this.firstHiddenChild, {
            'type': 'text', 'name': this.inputElement.getAttribute('data-name'), 'class': HIDDENELEMENT
        });
        attributes(this.secondHiddenChild, {
            'type': 'text', 'name': this.inputElement.getAttribute('data-name'), 'class': HIDDENELEMENT
        });
        var format = { type: 'datetime', skeleton: 'yMd' };
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
        var format = { format: this.formatString, type: 'date', skeleton: 'yMd' };
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
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.setProperties({ placeholder: newProp.placeholder }, true);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement);
                    this.inputElement.setAttribute('aria-readonly', '' + this.readonly);
                    this.setRangeAllowEdit();
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.inputWrapper.container], oldProp.cssClass);
                    if (this.popupWrapper) {
                        Input.setCssClass(newProp.cssClass, [this.popupWrapper], oldProp.cssClass);
                    }
                    break;
                case 'enabled':
                    this.setProperties({ enabled: newProp.enabled }, true);
                    Input.setEnabled(this.enabled, this.inputElement);
                    this.bindEvents();
                    break;
                case 'allowEdit':
                    this.setRangeAllowEdit();
                    break;
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
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
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                    this.setLocale();
                    break;
                case 'htmlAttributes':
                    this.updateHtmlAttributeToElement();
                    this.updateHtmlAttributeToWrapper();
                    this.setDataAttribute(true);
                    this.checkHtmlAttributes(true);
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
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
                        if ((!isNullOrUndefined(newProp.value) && newProp.value.length > 0)
                            || !isNullOrUndefined(newProp.value) && newProp.value.start) {
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
                            if (isNullOrUndefined(this.value)
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
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
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
    __decorate$2([
        Property(null)
    ], DateRangePicker.prototype, "value", void 0);
    __decorate$2([
        Property(false)
    ], DateRangePicker.prototype, "enablePersistence", void 0);
    __decorate$2([
        Property(new Date(1900, 0, 1))
    ], DateRangePicker.prototype, "min", void 0);
    __decorate$2([
        Property(new Date(2099, 11, 31))
    ], DateRangePicker.prototype, "max", void 0);
    __decorate$2([
        Property(null)
    ], DateRangePicker.prototype, "locale", void 0);
    __decorate$2([
        Property(null)
    ], DateRangePicker.prototype, "firstDayOfWeek", void 0);
    __decorate$2([
        Property(false)
    ], DateRangePicker.prototype, "weekNumber", void 0);
    __decorate$2([
        Property('Gregorian')
    ], DateRangePicker.prototype, "calendarMode", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "created", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "destroyed", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "change", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "cleared", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "navigated", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "renderDayCell", void 0);
    __decorate$2([
        Property(null)
    ], DateRangePicker.prototype, "startDate", void 0);
    __decorate$2([
        Property(null)
    ], DateRangePicker.prototype, "endDate", void 0);
    __decorate$2([
        Collection([{}], Presets)
    ], DateRangePicker.prototype, "presets", void 0);
    __decorate$2([
        Property('')
    ], DateRangePicker.prototype, "width", void 0);
    __decorate$2([
        Property(1000)
    ], DateRangePicker.prototype, "zIndex", void 0);
    __decorate$2([
        Property(true)
    ], DateRangePicker.prototype, "showClearButton", void 0);
    __decorate$2([
        Property(true)
    ], DateRangePicker.prototype, "showTodayButton", void 0);
    __decorate$2([
        Property('Month')
    ], DateRangePicker.prototype, "start", void 0);
    __decorate$2([
        Property('Month')
    ], DateRangePicker.prototype, "depth", void 0);
    __decorate$2([
        Property('')
    ], DateRangePicker.prototype, "cssClass", void 0);
    __decorate$2([
        Property('-')
    ], DateRangePicker.prototype, "separator", void 0);
    __decorate$2([
        Property(null)
    ], DateRangePicker.prototype, "minDays", void 0);
    __decorate$2([
        Property(null)
    ], DateRangePicker.prototype, "maxDays", void 0);
    __decorate$2([
        Property(false)
    ], DateRangePicker.prototype, "strictMode", void 0);
    __decorate$2([
        Property(null)
    ], DateRangePicker.prototype, "keyConfigs", void 0);
    __decorate$2([
        Property(null)
    ], DateRangePicker.prototype, "format", void 0);
    __decorate$2([
        Property(true)
    ], DateRangePicker.prototype, "enabled", void 0);
    __decorate$2([
        Property(false)
    ], DateRangePicker.prototype, "readonly", void 0);
    __decorate$2([
        Property(true)
    ], DateRangePicker.prototype, "allowEdit", void 0);
    __decorate$2([
        Property('Never')
    ], DateRangePicker.prototype, "floatLabelType", void 0);
    __decorate$2([
        Property(null)
    ], DateRangePicker.prototype, "placeholder", void 0);
    __decorate$2([
        Property({})
    ], DateRangePicker.prototype, "htmlAttributes", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "open", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "close", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "select", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "focus", void 0);
    __decorate$2([
        Event()
    ], DateRangePicker.prototype, "blur", void 0);
    DateRangePicker = __decorate$2([
        NotifyPropertyChanges
    ], DateRangePicker);
    return DateRangePicker;
}(CalendarBase));

/**
 * DateRangePicker modules
 */

var __extends$3 = (undefined && undefined.__extends) || (function () {
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
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WRAPPERCLASS = 'e-time-wrapper';
var POPUP$2 = 'e-popup';
var ERROR$2 = 'e-error';
var POPUPDIMENSION = '240px';
var DAY = new Date().getDate();
var MONTH$2 = new Date().getMonth();
var YEAR$2 = new Date().getFullYear();
var ROOT$3 = 'e-timepicker';
var LIBRARY$2 = 'e-lib';
var CONTROL$2 = 'e-control';
var CONTENT$2 = 'e-content';
var SELECTED$4 = 'e-active';
var HOVER$1 = 'e-hover';
var NAVIGATION = 'e-navigation';
var DISABLED$3 = 'e-disabled';
var ICONANIMATION = 'e-icon-anim';
var FOCUS = 'e-input-focus';
var LISTCLASS$1 = cssClass.li;
var HALFPOSITION = 2;
var ANIMATIONDURATION = 50;
var OVERFLOW$2 = 'e-time-overflow';
var OFFSETVAL = 4;
var EDITABLE = 'e-non-edit';
var wrapperAttributes = ['title', 'class', 'style'];
var TimePickerBase;
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
        var listTag = ListBase.createList(createdEl, listItems, null, true);
        return { collection: timeCollections, list: listTag };
    }
    TimePickerBase.createListItems = createListItems;
})(TimePickerBase || (TimePickerBase = {}));
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
var TimePicker = /** @__PURE__ @class */ (function (_super) {
    __extends$3(TimePicker, _super);
    /**
     * Constructor for creating the widget
     */
    function TimePicker(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.liCollections = [];
        _this.timeCollections = [];
        _this.disableItemCollection = [];
        _this.invalidValueString = null;
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
        removeClass([this.cloneElement], [ROOT$3, CONTROL$2, LIBRARY$2]);
        this.inputElement = this.element;
        this.angularTag = null;
        this.formElement = closest(this.element, 'form');
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
    };
    // element creation
    TimePicker.prototype.render = function () {
        this.initialize();
        this.createInputElement();
        this.updateHtmlAttributeToWrapper();
        this.setTimeAllowEdit();
        this.setEnable();
        this.validateInterval();
        this.bindEvents();
        this.validateDisable();
        this.setValue(this.getFormattedValue(this.value));
        this.anchor = this.inputElement;
        this.inputElement.setAttribute('value', this.inputElement.value);
        this.inputEleValue = this.getDateObject(this.inputElement.value);
        this.renderComplete();
    };
    TimePicker.prototype.setTimeAllowEdit = function () {
        if (this.allowEdit) {
            if (!this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        }
        else {
            attributes(this.inputElement, { 'readonly': '' });
        }
        this.clearIconState();
    };
    TimePicker.prototype.clearIconState = function () {
        if (!this.allowEdit && this.inputWrapper && !this.readonly) {
            if (this.inputElement.value === '') {
                removeClass([this.inputWrapper.container], [EDITABLE]);
            }
            else {
                addClass([this.inputWrapper.container], [EDITABLE]);
            }
        }
        else if (this.inputWrapper) {
            removeClass([this.inputWrapper.container], [EDITABLE]);
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
            if (isNullOrUndefined(target.getAttribute(attributes$$1[i]))) {
                continue;
            }
            var attr = target.getAttribute(attributes$$1[i]);
            input.setAttribute(attributes$$1[i], attr);
            target.removeAttribute(attributes$$1[i]);
        }
    };
    TimePicker.prototype.initialize = function () {
        this.globalize = new Internationalization(this.locale);
        this.defaultCulture = new Internationalization('en');
        this.checkTimeFormat();
        this.checkInvalidValue(this.value);
        // persist the value property.
        this.setProperties({ value: this.checkDateValue(new Date(this.checkInValue(this.value))) }, true);
        this.setProperties({ min: this.checkDateValue(new Date(this.checkInValue(this.min))) }, true);
        this.setProperties({ max: this.checkDateValue(new Date(this.checkInValue(this.max))) }, true);
        if (this.angularTag !== null) {
            this.validationAttribute(this.element, this.inputElement);
        }
        this.updateHtmlAttributeToElement();
        this.checkAttributes(false); //check the input element attributes
        var localeText = { placeholder: this.placeholder };
        this.l10n = new L10n('timepicker', localeText, this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        this.initValue = this.checkDateValue(this.value);
        this.initMin = this.checkDateValue(this.min);
        this.initMax = this.checkDateValue(this.max);
        this.isNavigate = this.isPreventBlur = this.isTextSelected = false;
        this.activeIndex = this.valueWithMinutes = this.prevDate = null;
        if (!isNullOrUndefined(this.element.getAttribute('id'))) {
            if (this.angularTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        }
        else {
            //for angular case
            this.element.id = getUniqueID('ej2_timepicker');
            if (this.angularTag !== null) {
                attributes(this.inputElement, { 'id': this.element.id + '_input' });
            }
        }
        if (isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            attributes(this.inputElement, { 'name': this.element.id });
        }
    };
    TimePicker.prototype.checkTimeFormat = function () {
        if (this.format) {
            if (typeof this.format === 'string') {
                this.formatString = this.format;
            }
            else if (!isNullOrUndefined(this.format.skeleton) && this.format.skeleton !== '') {
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
        return (!isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    };
    TimePicker.prototype.createInputElement = function () {
        this.inputWrapper = Input.createInput({
            element: this.inputElement,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: this.cssClass,
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
            },
            buttons: [' e-input-group-icon e-time-icon e-icons']
        }, this.createElement);
        this.inputWrapper.container.style.width = this.setWidth(this.width);
        attributes(this.inputElement, {
            'aria-haspopup': 'true', 'aria-autocomplete': 'list', 'tabindex': '0', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-disabled': 'false', 'aria-invalid': 'false'
        });
        if (!this.isNullOrEmpty(this.inputStyle)) {
            Input.addAttributes({ 'style': this.inputStyle }, this.inputElement);
        }
        addClass([this.inputWrapper.container], WRAPPERCLASS);
    };
    TimePicker.prototype.getCldrDateTimeFormat = function () {
        var culture = new Internationalization(this.locale);
        var cldrTime;
        var dateFormat = culture.getDatePattern({ skeleton: 'yMd' });
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
        if (typeof value !== 'object' && !isNullOrUndefined(value)) {
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
                    if (isNullOrUndefined(valueExpression)) {
                        valueExpression = this.checkDateValue(this.globalize.parseDate(valueString, {
                            format: this.getCldrDateTimeFormat(), type: 'datetime'
                        }));
                        if (isNullOrUndefined(valueExpression)) {
                            valueExpression = this.checkDateValue(this.globalize.parseDate(valueString, {
                                format: this.formatString, type: 'dateTime', skeleton: 'yMd'
                            }));
                        }
                    }
                }
            }
            valueExp = this.globalize.parseDate(valueString, {
                format: this.getCldrDateTimeFormat(), type: 'datetime'
            });
            valueExpression = (!isNullOrUndefined(valueExp) && valueExp instanceof Date && !isNaN(+valueExp)) ? valueExp : null;
            if (isNullOrUndefined(valueExpression) && valueString.replace(/\s/g, '').length) {
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
            cldrDateTimeString = (getValue('timeFormats.short', getDefaultDateObject()));
        }
        else {
            cldrDateTimeString = (this.getCultureTimeObject(cldrData, '' + this.locale));
        }
        return cldrDateTimeString;
    };
    // destroy function
    TimePicker.prototype.destroy = function () {
        this.hide();
        this.unBindEvents();
        var ariaAttribute = {
            'aria-haspopup': 'true', 'aria-autocomplete': 'list', 'tabindex': '0', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-disabled': 'true', 'aria-invalid': 'false'
        };
        if (this.inputElement) {
            Input.removeAttributes(ariaAttribute, this.inputElement);
            if (this.angularTag === null) {
                this.inputWrapper.container.parentElement.appendChild(this.inputElement);
            }
            (!isNullOrUndefined(this.cloneElement.getAttribute('tabindex'))) ?
                this.inputElement.setAttribute('tabindex', this.tabIndex) : this.inputElement.removeAttribute('tabindex');
            this.ensureInputAttribute();
            this.enableElement([this.inputElement]);
            this.inputElement.classList.remove('e-input');
            if (isNullOrUndefined(this.cloneElement.getAttribute('disabled'))) {
                Input.setEnabled(true, this.inputElement, this.floatLabelType);
            }
        }
        if (this.inputWrapper.container) {
            detach(this.inputWrapper.container);
        }
        this.inputWrapper = this.popupWrapper = this.cloneElement = undefined;
        this.liCollections = this.timeCollections = this.disableItemCollection = [];
        if (!isNullOrUndefined(this.rippleFn)) {
            this.rippleFn();
        }
        _super.prototype.destroy.call(this);
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
    };
    TimePicker.prototype.ensureInputAttribute = function () {
        var propertyList = [];
        for (var i = 0; i < this.inputElement.attributes.length; i++) {
            propertyList[i] = this.inputElement.attributes[i].name;
        }
        for (var i = 0; i < propertyList.length; i++) {
            if (!isNullOrUndefined(this.cloneElement.getAttribute(propertyList[i]))) {
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
        this.popupWrapper = this.createElement('div', {
            className: ROOT$3 + ' ' + POPUP$2,
            attrs: { 'id': this.element.id + '_popup', 'style': 'visibility:hidden' }
        });
        if (!isNullOrUndefined(this.cssClass)) {
            this.popupWrapper.className += ' ' + this.cssClass;
        }
        if (!isNullOrUndefined(this.step) && this.step > 0) {
            this.generateList();
            append([this.listWrapper], this.popupWrapper);
        }
        this.openPopupEventArgs.appendTo.appendChild(this.popupWrapper);
        this.addSelection();
        this.renderPopup();
        detach(this.popupWrapper);
    };
    TimePicker.prototype.getPopupHeight = function () {
        var height = parseInt(POPUPDIMENSION, 10);
        var popupHeight = this.popupWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    };
    TimePicker.prototype.generateList = function () {
        this.createListItems();
        this.wireListEvents();
        var rippleModel = { duration: 300, selector: '.' + LISTCLASS$1 };
        this.rippleFn = rippleEffect(this.listWrapper, rippleModel);
        this.liCollections = this.listWrapper.querySelectorAll('.' + LISTCLASS$1);
    };
    TimePicker.prototype.renderPopup = function () {
        var _this = this;
        this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
        this.popupObj = new Popup(this.popupWrapper, {
            width: this.setPopupWidth(this.width),
            zIndex: this.zIndex,
            targetType: 'relative',
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            enableRtl: this.enableRtl,
            relateTo: Browser.isDevice ? document.body : this.inputWrapper.container,
            offsetY: OFFSETVAL,
            open: function () {
                _this.popupWrapper.style.visibility = 'visible';
                addClass([_this.inputWrapper.buttons[0]], SELECTED$4);
            }, close: function () {
                removeClass([_this.inputWrapper.buttons[0]], SELECTED$4);
                _this.unWireListEvents();
                _this.inputElement.setAttribute('aria-activedescendant', 'null');
                remove(_this.popupObj.element);
                _this.popupObj.destroy();
                _this.popupWrapper.innerHTML = '';
                _this.listWrapper = _this.popupWrapper = _this.listTag = undefined;
            }, targetExitViewport: function () {
                if (!Browser.isDevice) {
                    _this.hide();
                }
            }
        });
        if (!Browser.isDevice) {
            this.popupObj.collision = { X: 'none', Y: 'flip' };
        }
        this.popupObj.element.style.maxHeight = POPUPDIMENSION;
    };
    //util function
    TimePicker.prototype.getFormattedValue = function (value) {
        if (isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        else {
            return this.globalize.formatDate(value, { skeleton: 'medium', type: 'time' });
        }
    };
    TimePicker.prototype.getDateObject = function (text) {
        if (!this.isNullOrEmpty(text)) {
            var dateValue = this.createDateObj(text);
            var value = !this.isNullOrEmpty(this.initValue);
            if (this.checkDateValue(dateValue)) {
                var date = value ? this.initValue.getDate() : DAY;
                var month = value ? this.initValue.getMonth() : MONTH$2;
                var year = value ? this.initValue.getFullYear() : YEAR$2;
                return new Date(year, month, date, dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds());
            }
        }
        return null;
    };
    TimePicker.prototype.updateHtmlAttributeToWrapper = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttributes.indexOf(key) > -1) {
                    if (key === 'class') {
                        addClass([this.inputWrapper.container], this.htmlAttributes[key].split(' '));
                    }
                    else if (key === 'style') {
                        var timeStyle = this.inputWrapper.container.getAttribute(key);
                        timeStyle = !isNullOrUndefined(timeStyle) ? (timeStyle + this.htmlAttributes[key]) :
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
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttributes.indexOf(key) < 0) {
                    this.inputElement.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    };
    TimePicker.prototype.removeErrorClass = function () {
        removeClass([this.inputWrapper.container], ERROR$2);
        attributes(this.inputElement, { 'aria-invalid': 'false' });
    };
    TimePicker.prototype.checkErrorState = function (val) {
        var value = this.getDateObject(val);
        if (this.validateState(value) && !this.invalidValueString) {
            this.removeErrorClass();
        }
        else {
            addClass([this.inputWrapper.container], ERROR$2);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        }
    };
    TimePicker.prototype.validateInterval = function () {
        if (!isNullOrUndefined(this.step) && this.step > 0) {
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
        addClass(element, DISABLED$3);
    };
    TimePicker.prototype.enableElement = function (element) {
        removeClass(element, DISABLED$3);
    };
    TimePicker.prototype.selectInputText = function () {
        this.inputElement.setSelectionRange(0, (this.inputElement).value.length);
    };
    TimePicker.prototype.getMeridianText = function () {
        var meridian;
        if (this.locale === 'en' || this.locale === 'en-US') {
            meridian = getValue('dayPeriods.format.wide', getDefaultDateObject());
        }
        else {
            meridian = getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.dayPeriods.format.abbreviated', cldrData);
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
        if (!isNullOrUndefined(this.popupWrapper)) {
            return this.popupWrapper.querySelectorAll('.' + SELECTED$4);
        }
        else {
            return null;
        }
    };
    TimePicker.prototype.isNullOrEmpty = function (value) {
        if (isNullOrUndefined(value) || (typeof value === 'string' && value.trim() === '')) {
            return true;
        }
        else {
            return false;
        }
    };
    TimePicker.prototype.setWidth = function (width) {
        if (typeof width === 'number') {
            width = formatUnit(width);
        }
        else if (typeof width === 'string') {
            width = (width.match(/px|%|em/)) ? width : formatUnit(width);
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
        if (!isNullOrUndefined(element)) {
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
        if (!isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + LISTCLASS$1);
            if (items.length) {
                var initialTime = this.timeCollections[0];
                var scrollTime = this.getDateObject(this.checkDateValue(this.scrollTo)).getTime();
                element = items[Math.round((scrollTime - initialTime) / (this.step * 60000))];
            }
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
        if (!isNullOrUndefined(element)) {
            this.findScrollTop(element);
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
    };
    TimePicker.prototype.getText = function () {
        return (isNullOrUndefined(this.checkDateValue(this.value))) ? '' : this.getValue(this.value);
    };
    TimePicker.prototype.getValue = function (value) {
        return (isNullOrUndefined(this.checkDateValue(value))) ? null : this.globalize.formatDate(value, {
            format: this.cldrTimeFormat(), type: 'time'
        });
    };
    TimePicker.prototype.cldrDateFormat = function () {
        var cldrDate;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrDate = (getValue('dateFormats.short', getDefaultDateObject()));
        }
        else {
            cldrDate = (this.getCultureDateObject(cldrData, '' + this.locale));
        }
        return cldrDate;
    };
    TimePicker.prototype.cldrTimeFormat = function () {
        var cldrTime;
        if (this.isNullOrEmpty(this.formatString)) {
            if (this.locale === 'en' || this.locale === 'en-US') {
                cldrTime = (getValue('timeFormats.short', getDefaultDateObject()));
            }
            else {
                cldrTime = (this.getCultureTimeObject(cldrData, '' + this.locale));
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
            cldrTime = (getValue('timeFormats.medium', getDefaultDateObject()));
        }
        else {
            cldrTime = (getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.medium', cldrData));
        }
        return cldrTime;
    };
    TimePicker.prototype.getExactDateTime = function (value) {
        if (isNullOrUndefined(this.checkDateValue(value))) {
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
        if (isNullOrUndefined(value)) {
            return null;
        }
        return (value !== this.getText()) ? this.getDateObject(value) : this.getDateObject(this.value);
    };
    TimePicker.prototype.updatePlaceHolder = function () {
        Input.setPlaceholder(this.l10n.getConstant('placeholder'), this.inputElement);
    };
    //event related functions
    TimePicker.prototype.popupHandler = function (e) {
        if (Browser.isDevice) {
            this.inputElement.setAttribute('readonly', '');
        }
        e.preventDefault();
        if (this.isPopupOpen()) {
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
            EventHandler.add(this.inputElement, 'mouseup', this.mouseUpHandler, this);
        }
    };
    TimePicker.prototype.mouseUpHandler = function (event) {
        if (!this.readonly) {
            event.preventDefault();
            EventHandler.remove(this.inputElement, 'mouseup', this.mouseUpHandler);
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
                        this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
                        this.updateValue(this.valueWithMinutes, event);
                    }
                    else {
                        this.updateValue(this.inputElement.value, event);
                    }
                    this.hide();
                    addClass([this.inputWrapper.container], FOCUS);
                    this.isNavigate = false;
                    if (this.isPopupOpen()) {
                        event.stopPropagation();
                    }
                    break;
                case 'open':
                    this.show(event);
                    break;
                case 'escape':
                    Input.setValue(this.objToString(this.value), this.inputElement, this.floatLabelType, this.showClearButton);
                    this.previousState(this.value);
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
        var li = this.selectedElement = closest(target, '.' + LISTCLASS$1);
        this.setSelection(li, event);
        if (li && li.classList.contains(LISTCLASS$1)) {
            this.hide();
            addClass([this.inputWrapper.container], FOCUS);
        }
    };
    TimePicker.prototype.closePopup = function (delay, e) {
        var _this = this;
        if (this.isPopupOpen() && this.popupWrapper) {
            var args = {
                popup: (isBlazor() && this.isServerRendered) ? null : this.popupObj,
                event: e || null,
                cancel: false,
                name: 'open'
            };
            removeClass([document.body], OVERFLOW$2);
            this.trigger('close', args, function (args) {
                if (!args.cancel) {
                    var animModel = {
                        name: 'FadeOut',
                        duration: ANIMATIONDURATION,
                        delay: delay ? delay : 0
                    };
                    _this.popupObj.hide(new Animation(animModel));
                    removeClass([_this.inputWrapper.container], [ICONANIMATION]);
                    attributes(_this.inputElement, { 'aria-expanded': 'false' });
                    EventHandler.remove(document, 'mousedown touchstart', _this.documentClickHandler);
                }
                if (Browser.isDevice && _this.modal) {
                    _this.modal.style.display = 'none';
                    _this.modal.outerHTML = '';
                    _this.modal = null;
                }
                if (Browser.isDevice) {
                    if (!isNullOrUndefined(_this.mobileTimePopupWrap)) {
                        _this.mobileTimePopupWrap.remove();
                        _this.mobileTimePopupWrap = null;
                    }
                }
                if (Browser.isDevice && _this.allowEdit && !_this.readonly) {
                    _this.inputElement.removeAttribute('readonly');
                }
            });
        }
        else {
            if (Browser.isDevice && this.allowEdit && !this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
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
                if ((this.prevValue !== this.inputElement.value) || isNullOrUndefined(this.checkDateValue(this.value))) {
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
        var currentLi = closest(event.target, '.' + LISTCLASS$1);
        this.setHover(currentLi, HOVER$1);
    };
    TimePicker.prototype.setHover = function (li, className) {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(className)) {
            this.removeHover(className);
            addClass([li], className);
            if (className === NAVIGATION) {
                li.setAttribute('aria-selected', 'true');
            }
        }
    };
    TimePicker.prototype.setSelection = function (li, event) {
        if (this.isValidLI(li) && !li.classList.contains(SELECTED$4)) {
            this.checkValue(li.getAttribute('data-value'));
            this.selectedElement = li;
            this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
            this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
            addClass([this.selectedElement], SELECTED$4);
            this.selectedElement.setAttribute('aria-selected', 'true');
            this.checkValueChange(event, true);
        }
    };
    TimePicker.prototype.onMouseLeave = function () {
        this.removeHover(HOVER$1);
    };
    TimePicker.prototype.scrollHandler = function () {
        if (this.getModuleName() === 'timepicker' && Browser.isDevice) {
            return;
        }
        else {
            this.hide();
        }
    };
    TimePicker.prototype.setMinMax = function (minVal, maxVal) {
        if (isNullOrUndefined(this.checkDateValue(minVal))) {
            this.initMin = this.getDateObject('12:00:00 AM');
        }
        if (isNullOrUndefined(this.checkDateValue(maxVal))) {
            this.initMax = this.getDateObject('11:59:59 PM');
        }
    };
    //protected function
    TimePicker.prototype.validateMinMax = function (dateVal, minVal, maxVal) {
        var value = dateVal instanceof Date ? dateVal : this.getDateObject(dateVal);
        if (!isNullOrUndefined(this.checkDateValue(value))) {
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
                if (!isNullOrUndefined(this.checkDateValue(value))) {
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
                Input.setValue(this.getValue(this.initValue), this.inputElement, this.floatLabelType, this.showClearButton);
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
        EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.popupHandler, this);
        EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
        EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
        EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.clearHandler, this);
        }
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
        if (!Browser.isDevice) {
            this.keyConfigure = extend(this.keyConfigure, this.keyConfigs);
            this.inputEvent = new KeyboardEvents(this.inputWrapper.container, {
                keyAction: this.inputHandler.bind(this),
                keyConfigs: this.keyConfigure,
                eventName: 'keydown'
            });
            if (this.showClearButton && this.inputElement) {
                EventHandler.add(this.inputElement, 'mousedown', this.mouseDownHandler, this);
            }
        }
    };
    TimePicker.prototype.formResetHandler = function () {
        if (!this.inputElement.disabled) {
            var timeValue = this.inputElement.getAttribute('value');
            var val = this.checkDateValue(this.inputEleValue);
            if (this.element.tagName === 'EJS-TIMEPICKER') {
                val = null;
                timeValue = '';
                this.inputElement.setAttribute('value', '');
            }
            this.setProperties({ value: val }, true);
            this.prevDate = this.value;
            this.valueWithMinutes = this.value;
            this.initValue = this.value;
            if (this.inputElement) {
                Input.setValue(timeValue, this.inputElement, this.floatLabelType, this.showClearButton);
                this.checkErrorState(timeValue);
                this.prevValue = this.inputElement.value;
            }
        }
    };
    TimePicker.prototype.inputChangeHandler = function (e) {
        e.stopPropagation();
    };
    TimePicker.prototype.unBindEvents = function () {
        if (this.inputWrapper) {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.popupHandler);
        }
        EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
        EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
        EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
        if (this.inputEvent) {
            this.inputEvent.destroy();
        }
        EventHandler.remove(this.inputElement, 'mousedown touchstart', this.mouseDownHandler);
        if (this.showClearButton && !isNullOrUndefined(this.inputWrapper.clearButton)) {
            EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.clearHandler);
        }
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
    };
    TimePicker.prototype.bindClearEvent = function () {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.clearHandler, this);
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
        if (!isNullOrUndefined(this.value)) {
            this.clear(e);
        }
        else {
            this.resetState();
            this.raiseClearedEvent(e);
        }
        if (this.popupWrapper) {
            this.popupWrapper.scrollTop = 0;
        }
    };
    TimePicker.prototype.clear = function (event) {
        this.setProperties({ value: null }, true);
        this.initValue = null;
        this.resetState();
        this.raiseClearedEvent(event);
        this.changeEvent(event);
    };
    TimePicker.prototype.setZIndex = function () {
        if (this.popupObj) {
            this.popupObj.zIndex = this.zIndex;
            this.popupObj.dataBind();
        }
    };
    TimePicker.prototype.checkAttributes = function (isDynamic) {
        var attributes$$1 = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['step', 'disabled', 'readonly', 'style', 'name', 'value', 'min', 'max', 'placeholder'];
        var value;
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.timeOptions) || (this.timeOptions['enabled'] === undefined)) || isDynamic) {
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
                        if ((isNullOrUndefined(this.timeOptions) || (this.timeOptions['readonly'] === undefined)) || isDynamic) {
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
                        if ((isNullOrUndefined(this.timeOptions) || (this.timeOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, !isDynamic);
                        }
                        break;
                    case 'min':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.timeOptions) || (this.timeOptions['min'] === undefined)) || isDynamic) {
                            value = new Date(this.inputElement.getAttribute(prop));
                            if (!isNullOrUndefined(this.checkDateValue(value))) {
                                this.setProperties({ min: value }, !isDynamic);
                            }
                        }
                        break;
                    case 'max':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.timeOptions) || (this.timeOptions['max'] === undefined)) || isDynamic) {
                            value = new Date(this.inputElement.getAttribute(prop));
                            if (!isNullOrUndefined(this.checkDateValue(value))) {
                                this.setProperties({ max: value }, !isDynamic);
                            }
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.timeOptions) || (this.timeOptions['value'] === undefined)) || isDynamic) {
                            value = new Date(this.inputElement.getAttribute(prop));
                            if (!isNullOrUndefined(this.checkDateValue(value))) {
                                this.initValue = value;
                                this.updateInput(false, this.initValue);
                                this.setProperties({ value: value }, !isDynamic);
                            }
                        }
                        break;
                }
            }
        }
    };
    TimePicker.prototype.setCurrentDate = function (value) {
        if (isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        return new Date(YEAR$2, MONTH$2, DAY, value.getHours(), value.getMinutes(), value.getSeconds());
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
                Input.setValue(inputVal, this.inputElement, this.floatLabelType, this.showClearButton);
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
        Input.setValue('', this.inputElement, this.floatLabelType, false);
        this.valueWithMinutes = this.activeIndex = null;
        if (!this.strictMode) {
            this.checkErrorState(null);
        }
    };
    TimePicker.prototype.objToString = function (val) {
        if (isNullOrUndefined(this.checkDateValue(val))) {
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
            this.valueWithMinutes = isNullOrUndefined(newval) ? null : newval;
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
        if (!this.strictMode && isNullOrUndefined(time)) {
            var value_1 = val.trim().length > 0 ? val : '';
            Input.setValue(value_1, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        else {
            Input.setValue(time, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        return time;
    };
    TimePicker.prototype.findNextElement = function (event) {
        var textVal = (this.inputElement).value;
        var value = isNullOrUndefined(this.valueWithMinutes) ? this.createDateObj(textVal) :
            this.getDateObject(this.valueWithMinutes);
        var timeVal = null;
        var count = this.liCollections.length;
        if (!isNullOrUndefined(this.checkDateValue(value)) || !isNullOrUndefined(this.activeIndex)) {
            if (event.action === 'home') {
                var index = this.validLiElement(0);
                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                this.activeIndex = index;
            }
            else if (event.action === 'end') {
                var index = this.validLiElement(this.timeCollections.length - 1, true);
                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                this.activeIndex = index;
            }
            else {
                if (event.action === 'down') {
                    for (var i = 0; i < count; i++) {
                        if (+value < this.timeCollections[i]) {
                            var index = this.validLiElement(i);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                        else if (i === count - 1) {
                            var index = this.validLiElement(0);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                    }
                }
                else {
                    for (var i = count - 1; i >= 0; i--) {
                        if (+value > this.timeCollections[i]) {
                            var index = this.validLiElement(i, true);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                        else if (i === 0) {
                            var index = this.validLiElement(count - 1);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                    }
                }
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.elementValue(isNullOrUndefined(timeVal) ? null : new Date(timeVal));
        }
        else {
            var index = this.validLiElement(0, event.action === 'down' ? false : true);
            this.activeIndex = index;
            this.selectedElement = this.liCollections[index];
            this.elementValue(new Date(this.timeCollections[index]));
        }
    };
    TimePicker.prototype.elementValue = function (value) {
        if (!isNullOrUndefined(this.checkDateValue(value))) {
            this.checkValue(value);
        }
    };
    TimePicker.prototype.validLiElement = function (index, backward) {
        var elementIndex = null;
        var items = isNullOrUndefined(this.popupWrapper) ? this.liCollections :
            this.popupWrapper.querySelectorAll('.' + LISTCLASS$1);
        var isCheck = true;
        if (items.length) {
            if (backward) {
                for (var i = index; i >= 0; i--) {
                    if (!items[i].classList.contains(DISABLED$3)) {
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
                    if (!items[i].classList.contains(DISABLED$3)) {
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
        return elementIndex;
    };
    TimePicker.prototype.keyHandler = function (event) {
        if (isNullOrUndefined(this.step) || this.step <= 0 || this.inputWrapper.buttons[0].classList.contains(DISABLED$3)) {
            return;
        }
        var count = this.timeCollections.length;
        if (isNullOrUndefined(this.getActiveElement()) || this.getActiveElement().length === 0) {
            if (this.liCollections.length > 0) {
                if (isNullOrUndefined(this.value) && isNullOrUndefined(this.activeIndex)) {
                    var index = this.validLiElement(0, event.action === 'down' ? false : true);
                    this.activeIndex = index;
                    this.selectedElement = this.liCollections[index];
                    this.elementValue(new Date(this.timeCollections[index]));
                }
                else {
                    this.findNextElement(event);
                }
            }
            else {
                this.findNextElement(event);
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
                nextItem = isNullOrUndefined(this.timeCollections[index]) ? this.timeCollections[0] : this.timeCollections[index];
            }
            else if (event.action === 'home') {
                var index = this.validLiElement(0);
                this.activeIndex = index;
                nextItem = this.timeCollections[index];
            }
            else if (event.action === 'end') {
                var index = this.validLiElement(count - 1, true);
                this.activeIndex = index;
                nextItem = this.timeCollections[index];
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.elementValue(new Date(nextItem));
        }
        this.isNavigate = true;
        this.setHover(this.selectedElement, NAVIGATION);
        this.setActiveDescendant();
        this.selectInputText();
        if (this.isPopupOpen() && this.selectedElement !== null && (!event || event.type !== 'click')) {
            this.setScrollPosition();
        }
    };
    TimePicker.prototype.getCultureTimeObject = function (ld, c) {
        return getValue('main.' + c + '.dates.calendars.gregorian.timeFormats.short', ld);
    };
    TimePicker.prototype.getCultureDateObject = function (ld, c) {
        return getValue('main.' + c + '.dates.calendars.gregorian.dateFormats.short', ld);
    };
    TimePicker.prototype.wireListEvents = function () {
        EventHandler.add(this.listWrapper, 'click', this.onMouseClick, this);
        if (!Browser.isDevice) {
            EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
        }
    };
    TimePicker.prototype.unWireListEvents = function () {
        if (this.listWrapper) {
            EventHandler.remove(this.listWrapper, 'click', this.onMouseClick);
            if (!Browser.isDevice) {
                EventHandler.remove(this.listWrapper, 'mouseover', this.onMouseOver);
                EventHandler.remove(this.listWrapper, 'mouseout', this.onMouseLeave);
            }
        }
    };
    TimePicker.prototype.valueProcess = function (event, value) {
        var result = (isNullOrUndefined(this.checkDateValue(value))) ? null : value;
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
            isInteracted: !isNullOrUndefined(e),
            element: this.element
        };
        eventArgs.value = this.valueWithMinutes || this.getDateObject(this.inputElement.value);
        this.prevDate = this.valueWithMinutes || this.getDateObject(this.inputElement.value);
        this.trigger('change', eventArgs);
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
        if (!this.strictMode && isNullOrUndefined(this.value) && this.invalidValueString) {
            this.checkErrorState(this.invalidValueString);
            Input.setValue(this.invalidValueString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        this.clearIconState();
    };
    TimePicker.prototype.setActiveDescendant = function () {
        if (!isNullOrUndefined(this.selectedElement)) {
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedElement.getAttribute('id') });
        }
        else {
            attributes(this.inputElement, { 'aria-activedescendant': 'null' });
        }
    };
    TimePicker.prototype.removeSelection = function () {
        this.removeHover(HOVER$1);
        if (!isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + SELECTED$4);
            if (items.length) {
                removeClass(items, SELECTED$4);
                items[0].removeAttribute('aria-selected');
            }
        }
    };
    TimePicker.prototype.removeHover = function (className) {
        var hoveredItem = this.getHoverItem(className);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, className);
            if (className === NAVIGATION) {
                hoveredItem[0].removeAttribute('aria-selected');
            }
        }
    };
    TimePicker.prototype.getHoverItem = function (className) {
        var hoveredItem;
        if (!isNullOrUndefined(this.popupWrapper)) {
            hoveredItem = this.popupWrapper.querySelectorAll('.' + className);
        }
        return hoveredItem;
    };
    TimePicker.prototype.setActiveClass = function () {
        if (!isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + LISTCLASS$1);
            if (items.length) {
                for (var i = 0; i < items.length; i++) {
                    if (this.timeCollections[i] === +this.getDateObject(this.valueWithMinutes)) {
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
        if (!isNullOrUndefined(this.selectedElement)) {
            addClass([this.selectedElement], SELECTED$4);
            this.selectedElement.setAttribute('aria-selected', 'true');
        }
    };
    TimePicker.prototype.isValidLI = function (li) {
        return (li && li.classList.contains(LISTCLASS$1) && !li.classList.contains(DISABLED$3));
    };
    TimePicker.prototype.createDateObj = function (val) {
        var today = this.globalize.formatDate(new Date(), { skeleton: 'short', type: 'date' });
        var value = null;
        if (typeof val === 'string') {
            if (val.toUpperCase().indexOf('AM') > -1 || val.toUpperCase().indexOf('PM') > -1) {
                today = this.defaultCulture.formatDate(new Date(), { skeleton: 'short', type: 'date' });
                value = isNaN(+new Date(today + ' ' + val)) ? null : new Date(new Date(today + ' ' + val).setMilliseconds(0));
                if (isNullOrUndefined(value)) {
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
        value = isNullOrUndefined(value) ? this.globalize.parseDate(today + ' ' + val, {
            format: this.cldrDateFormat() + ' ' + this.dateToNumeric(), type: 'datetime'
        }) : value;
        value = isNullOrUndefined(value) ? value : new Date(value.setMilliseconds(0));
        return value;
    };
    TimePicker.prototype.createListItems = function () {
        var _this = this;
        this.listWrapper = this.createElement('div', { className: CONTENT$2, attrs: { 'tabindex': '0' } });
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
                        eventArgs.element.classList.add(DISABLED$3);
                    }
                    if (eventArgs.element.classList.contains(DISABLED$3)) {
                        _this.disableItemCollection.push(eventArgs.element.getAttribute('data-value'));
                    }
                });
            }
        };
        this.listTag = ListBase.createList(this.createElement, listItems, listBaseOptions, true);
        attributes(this.listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
        append([this.listTag], this.listWrapper);
    };
    TimePicker.prototype.documentClickHandler = function (event) {
        var target = event.target;
        if ((!isNullOrUndefined(this.popupObj) && (this.inputWrapper.container.contains(target) ||
            (this.popupObj.element && this.popupObj.element.contains(target)))) && event.type !== 'touchstart') {
            event.preventDefault();
        }
        if (!(closest(target, '#' + this.popupObj.element.id)) && target !== this.inputElement
            && target !== (this.inputWrapper && this.inputWrapper.buttons[0]) &&
            target !== (this.inputWrapper && this.inputWrapper.clearButton) &&
            target !== (this.inputWrapper && this.inputWrapper.container)) {
            if (this.isPopupOpen()) {
                this.hide();
                this.focusOut();
            }
        }
        else if (target !== this.inputElement) {
            if (!Browser.isDevice) {
                this.isPreventBlur = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.inputElement);
            }
        }
    };
    TimePicker.prototype.setEnableRtl = function () {
        Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
        if (this.popupObj) {
            this.popupObj.enableRtl = this.enableRtl;
            this.popupObj.dataBind();
        }
    };
    TimePicker.prototype.setEnable = function () {
        Input.setEnabled(this.enabled, this.inputElement, this.floatLabelType);
        if (this.enabled) {
            removeClass([this.inputWrapper.container], DISABLED$3);
            attributes(this.inputElement, { 'aria-disabled': 'false' });
            this.inputElement.setAttribute('tabindex', this.tabIndex);
        }
        else {
            this.hide();
            addClass([this.inputWrapper.container], DISABLED$3);
            attributes(this.inputElement, { 'aria-disabled': 'true' });
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
        removeClass([this.inputWrapper.container], [FOCUS]);
        var blurArguments = {
            model: (isBlazor() && this.isServerRendered) ? null : this
        };
        this.trigger('blur', blurArguments);
        if (this.getText() !== this.inputElement.value) {
            this.updateValue((this.inputElement).value, e);
        }
        else if (this.inputElement.value.trim().length === 0) {
            this.resetState();
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
            var blurArguments = {
                model: (isBlazor() && this.isServerRendered) ? null : this
            };
            this.trigger('blur', blurArguments);
        }
    };
    TimePicker.prototype.isPopupOpen = function () {
        if (this.popupWrapper && this.popupWrapper.classList.contains('' + ROOT$3)) {
            return true;
        }
        return false;
    };
    TimePicker.prototype.inputFocusHandler = function () {
        var focusArguments = {
            model: (isBlazor() && this.isServerRendered) ? null : this
        };
        if (!this.readonly && !Browser.isDevice) {
            this.selectInputText();
        }
        this.trigger('focus', focusArguments);
        this.clearIconState();
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
     */
    TimePicker.prototype.hide = function () {
        this.closePopup(100, null);
        this.clearIconState();
    };
    /**
     * Opens the popup to show the list items.
     * @returns void
     */
    TimePicker.prototype.show = function (event) {
        var _this = this;
        if ((this.enabled && this.readonly) || !this.enabled || this.popupWrapper) {
            return;
        }
        else {
            this.popupCreation();
            if (Browser.isDevice && this.listWrapper) {
                this.modal = this.createElement('div');
                this.modal.className = '' + ROOT$3 + ' e-time-modal';
                document.body.className += ' ' + OVERFLOW$2;
                document.body.appendChild(this.modal);
            }
            if (Browser.isDevice) {
                this.mobileTimePopupWrap = this.createElement('div', { className: 'e-timepicker-mob-popup-wrap' });
                document.body.appendChild(this.mobileTimePopupWrap);
            }
            this.openPopupEventArgs = {
                popup: (isBlazor() && this.isServerRendered) ? null : this.popupObj || null,
                cancel: false,
                event: event || null,
                name: 'open',
                appendTo: Browser.isDevice ? this.mobileTimePopupWrap : document.body
            };
            var eventArgs = this.openPopupEventArgs;
            this.trigger('open', eventArgs, function (eventArgs) {
                if ((isBlazor() && _this.isServerRendered)) {
                    eventArgs.popup = _this.popupObj || null;
                }
                _this.openPopupEventArgs = eventArgs;
                if (!_this.openPopupEventArgs.cancel && !_this.inputWrapper.buttons[0].classList.contains(DISABLED$3)) {
                    _this.openPopupEventArgs.appendTo.appendChild(_this.popupWrapper);
                    _this.popupAlignment(_this.openPopupEventArgs);
                    _this.setScrollPosition();
                    if (!Browser.isDevice) {
                        _this.inputElement.focus();
                    }
                    var openAnimation = {
                        name: 'FadeIn',
                        duration: ANIMATIONDURATION,
                    };
                    _this.popupObj.refreshPosition(_this.anchor);
                    if (_this.zIndex === 1000) {
                        _this.popupObj.show(new Animation(openAnimation), _this.element);
                    }
                    else {
                        _this.popupObj.show(new Animation(openAnimation), null);
                    }
                    _this.setActiveDescendant();
                    attributes(_this.inputElement, { 'aria-expanded': 'true' });
                    addClass([_this.inputWrapper.container], FOCUS);
                    EventHandler.add(document, 'mousedown touchstart', _this.documentClickHandler, _this);
                    _this.setOverlayIndex(_this.mobileTimePopupWrap, _this.popupObj.element, _this.modal, Browser.isDevice);
                }
                else {
                    _this.popupObj.destroy();
                    _this.popupWrapper = _this.listTag = undefined;
                    _this.liCollections = _this.timeCollections = _this.disableItemCollection = [];
                    _this.popupObj = null;
                }
            });
        }
    };
    TimePicker.prototype.setOverlayIndex = function (popupWrapper, timePopupElement, modal, isDevice) {
        if (isDevice && !isNullOrUndefined(timePopupElement) && !isNullOrUndefined(modal) && !isNullOrUndefined(popupWrapper)) {
            var index = parseInt(timePopupElement.style.zIndex, 10) ? parseInt(timePopupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupWrapper.style.zIndex = index.toString();
        }
    };
    TimePicker.prototype.formatValues = function (type) {
        var value;
        if (typeof type === 'number') {
            value = formatUnit(type);
        }
        else if (typeof type === 'string') {
            value = (type.match(/px|%|em/)) ? type : isNaN(parseInt(type, 10)) ? type : formatUnit(type);
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
        if (!Browser.isDevice) {
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
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.inputElement.setAttribute('aria-placeholder', newProp.placeholder);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement, this.floatLabelType);
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
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    this.setEnableRtl();
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.inputWrapper.container], oldProp.cssClass);
                    if (this.popupWrapper) {
                        Input.setCssClass(newProp.cssClass, [this.popupWrapper], oldProp.cssClass);
                    }
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
                    this.getProperty(newProp, prop);
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'locale':
                    this.setProperties({ locale: newProp.locale }, true);
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.updatePlaceHolder();
                    this.setValue(this.value);
                    break;
                case 'width':
                    setStyleAttribute(this.inputWrapper.container, { 'width': this.setWidth(newProp.width) });
                    this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.checkTimeFormat();
                    this.setValue(this.value);
                    break;
                case 'value':
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
                        Input.setValue(this.invalidValueString, this.inputElement, this.floatLabelType, this.showClearButton);
                        this.checkErrorState(this.invalidValueString);
                    }
                    this.checkValueChange(null, false);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                case 'strictMode':
                    this.invalidValueString = null;
                    if (newProp.strictMode) {
                        this.checkErrorState(null);
                    }
                    this.setProperties({ strictMode: newProp.strictMode }, true);
                    this.checkValue((this.inputElement).value);
                    this.checkValueChange(null, false);
                    break;
                case 'scrollTo':
                    if (this.checkDateValue(new Date(this.checkInValue(newProp.scrollTo)))) {
                        if (this.popupWrapper) {
                            this.setScrollTo();
                        }
                        this.setProperties({ scrollTo: newProp.scrollTo }, true);
                    }
                    else {
                        this.setProperties({ scrollTo: null }, true);
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
    __decorate$3([
        Property(null)
    ], TimePicker.prototype, "width", void 0);
    __decorate$3([
        Property(null)
    ], TimePicker.prototype, "cssClass", void 0);
    __decorate$3([
        Property(false)
    ], TimePicker.prototype, "strictMode", void 0);
    __decorate$3([
        Property(null)
    ], TimePicker.prototype, "keyConfigs", void 0);
    __decorate$3([
        Property(null)
    ], TimePicker.prototype, "format", void 0);
    __decorate$3([
        Property(true)
    ], TimePicker.prototype, "enabled", void 0);
    __decorate$3([
        Property(false)
    ], TimePicker.prototype, "readonly", void 0);
    __decorate$3([
        Property({})
    ], TimePicker.prototype, "htmlAttributes", void 0);
    __decorate$3([
        Property('Never')
    ], TimePicker.prototype, "floatLabelType", void 0);
    __decorate$3([
        Property(null)
    ], TimePicker.prototype, "placeholder", void 0);
    __decorate$3([
        Property(1000)
    ], TimePicker.prototype, "zIndex", void 0);
    __decorate$3([
        Property(false)
    ], TimePicker.prototype, "enablePersistence", void 0);
    __decorate$3([
        Property(true)
    ], TimePicker.prototype, "showClearButton", void 0);
    __decorate$3([
        Property(30)
    ], TimePicker.prototype, "step", void 0);
    __decorate$3([
        Property(null)
    ], TimePicker.prototype, "scrollTo", void 0);
    __decorate$3([
        Property(null)
    ], TimePicker.prototype, "value", void 0);
    __decorate$3([
        Property(null)
    ], TimePicker.prototype, "min", void 0);
    __decorate$3([
        Property(null)
    ], TimePicker.prototype, "max", void 0);
    __decorate$3([
        Property(true)
    ], TimePicker.prototype, "allowEdit", void 0);
    __decorate$3([
        Event()
    ], TimePicker.prototype, "change", void 0);
    __decorate$3([
        Event()
    ], TimePicker.prototype, "created", void 0);
    __decorate$3([
        Event()
    ], TimePicker.prototype, "destroyed", void 0);
    __decorate$3([
        Event()
    ], TimePicker.prototype, "open", void 0);
    __decorate$3([
        Event()
    ], TimePicker.prototype, "itemRender", void 0);
    __decorate$3([
        Event()
    ], TimePicker.prototype, "close", void 0);
    __decorate$3([
        Event()
    ], TimePicker.prototype, "cleared", void 0);
    __decorate$3([
        Event()
    ], TimePicker.prototype, "blur", void 0);
    __decorate$3([
        Event()
    ], TimePicker.prototype, "focus", void 0);
    TimePicker = __decorate$3([
        NotifyPropertyChanges
    ], TimePicker);
    return TimePicker;
}(Component));

/**
 * TimePicker modules
 */

var __extends$4 = (undefined && undefined.__extends) || (function () {
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
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
///<reference path='../datepicker/datepicker-model.d.ts'/>
//class constant defination
var DATEWRAPPER$1 = 'e-date-wrapper';
var DATEPICKERROOT = 'e-datepicker';
var DATETIMEWRAPPER = 'e-datetime-wrapper';
var DAY$1 = new Date().getDate();
var MONTH$3 = new Date().getMonth();
var YEAR$3 = new Date().getFullYear();
var HOUR = new Date().getHours();
var MINUTE = new Date().getMinutes();
var SECOND = new Date().getSeconds();
var MILLISECOND = new Date().getMilliseconds();
var ROOT$4 = 'e-datetimepicker';
var DATETIMEPOPUPWRAPPER = 'e-datetimepopup-wrapper';
var INPUTWRAPPER$1 = 'e-input-group-icon';
var POPUP$3 = 'e-popup';
var TIMEICON = 'e-time-icon';
var INPUTFOCUS$2 = 'e-input-focus';
var POPUPDIMENSION$1 = '250px';
var ICONANIMATION$1 = 'e-icon-anim';
var DISABLED$4 = 'e-disabled';
var ERROR$3 = 'e-error';
var CONTENT$3 = 'e-content';
var NAVIGATION$1 = 'e-navigation';
var ACTIVE$2 = 'e-active';
var HOVER$2 = 'e-hover';
var ICONS$1 = 'e-icons';
var HALFPOSITION$1 = 2;
var LISTCLASS$2 = cssClass.li;
var ANIMATIONDURATION$1 = 100;
var OVERFLOW$3 = 'e-time-overflow';
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
var DateTimePicker = /** @__PURE__ @class */ (function (_super) {
    __extends$4(DateTimePicker, _super);
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
        addClass([this.inputWrapper.container], INPUTFOCUS$2);
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
            removeClass([this.inputWrapper.container], [INPUTFOCUS$2]);
        }
    };
    DateTimePicker.prototype.blurHandler = function (e) {
        // IE popup closing issue when click over the scrollbar
        if (this.isTimePopupOpen() && this.isPreventBlur) {
            this.inputElement.focus();
            return;
        }
        removeClass([this.inputWrapper.container], INPUTFOCUS$2);
        var blurArguments = {
            model: (isBlazor() && this.isServerRendered) ? null : this
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
        if (this.popupObject && this.popupObject.element.classList.contains(POPUP$3)) {
            this.popupObject.destroy();
            detach(this.dateTimeWrapper);
            this.dateTimeWrapper = undefined;
            this.liCollections = this.timeCollections = [];
            if (!isNullOrUndefined(this.rippleFn)) {
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
            Input.removeAttributes(ariaAttribute, this.inputElement);
            this.inputElement.removeAttribute('aria-placeholder');
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) {
                detach(this.popupWrapper);
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
        this.l10n = new L10n('datetimepicker', localeText, this.locale);
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
            Input.setValue(this.getFormattedValue(value), this.inputElement, this.floatLabelType, this.showClearButton);
            this.setProperties({ value: value }, true);
        }
        else {
            if (isNullOrUndefined(this.value)) {
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
            removeClass([this.inputWrapper.container], ERROR$3);
        }
        else {
            addClass([this.inputWrapper.container], ERROR$3);
        }
        attributes(this.inputElement, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
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
            addClass([this.inputWrapper.buttons[0], this.timeIcon], DISABLED$4);
            this.hide();
        }
        else {
            removeClass([this.inputWrapper.buttons[0], this.timeIcon], DISABLED$4);
        }
    };
    DateTimePicker.prototype.getFormattedValue = function (value) {
        var dateOptions;
        if (!isNullOrUndefined(value)) {
            if (this.calendarMode === 'Gregorian') {
                dateOptions = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd' };
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
        return (!isNullOrUndefined(value) && !isNaN(+value)) ? true : false;
    };
    DateTimePicker.prototype.createInputElement = function () {
        removeClass([this.inputElement], DATEPICKERROOT);
        removeClass([this.inputWrapper.container], DATEWRAPPER$1);
        addClass([this.inputWrapper.container], DATETIMEWRAPPER);
        addClass([this.inputElement], ROOT$4);
        this.renderTimeIcon();
    };
    DateTimePicker.prototype.renderTimeIcon = function () {
        this.timeIcon = Input.appendSpan(INPUTWRAPPER$1 + ' ' + TIMEICON + ' ' + ICONS$1, this.inputWrapper.container);
    };
    DateTimePicker.prototype.bindInputEvents = function () {
        EventHandler.add(this.timeIcon, 'mousedown', this.timeHandler, this);
        EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.dateHandler, this);
        EventHandler.add(this.inputElement, 'blur', this.blurHandler, this);
        EventHandler.add(this.inputElement, 'focus', this.focusHandler, this);
        this.defaultKeyConfigs = extend(this.defaultKeyConfigs, this.keyConfigs);
        this.keyboardHandler = new KeyboardEvents(this.inputElement, {
            eventName: 'keydown',
            keyAction: this.inputKeyAction.bind(this),
            keyConfigs: this.defaultKeyConfigs
        });
    };
    DateTimePicker.prototype.unBindInputEvents = function () {
        EventHandler.remove(this.timeIcon, 'mousedown touchstart', this.timeHandler);
        EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateHandler);
        if (this.inputElement) {
            EventHandler.remove(this.inputElement, 'blur', this.blurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.focusHandler);
        }
        if (this.keyboardHandler) {
            this.keyboardHandler.destroy();
        }
    };
    DateTimePicker.prototype.cldrTimeFormat = function () {
        var cldrTime;
        if (this.isNullOrEmpty(this.timeFormat)) {
            if (this.locale === 'en' || this.locale === 'en-US') {
                cldrTime = (getValue('timeFormats.short', getDefaultDateObject()));
            }
            else {
                cldrTime = (this.getCultureTimeObject(cldrData, '' + this.locale));
            }
        }
        else {
            cldrTime = this.timeFormat;
        }
        return cldrTime;
    };
    DateTimePicker.prototype.cldrDateTimeFormat = function () {
        var cldrTime;
        var culture = new Internationalization(this.locale);
        var dateFormat = culture.getDatePattern({ skeleton: 'yMd' });
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
            cldrDateTime = (getValue('timeFormats.short', getDefaultDateObject()));
        }
        else {
            cldrDateTime = (this.getCultureTimeObject(cldrData, '' + this.locale));
        }
        return cldrDateTime;
    };
    DateTimePicker.prototype.isNullOrEmpty = function (value) {
        if (isNullOrUndefined(value) || (typeof value === 'string' && value.trim() === '')) {
            return true;
        }
        else {
            return false;
        }
    };
    DateTimePicker.prototype.getCultureTimeObject = function (ld, c) {
        if (this.calendarMode === 'Gregorian') {
            return getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.short', ld);
        }
        else {
            return getValue('main.' + '' + this.locale + '.dates.calendars.islamic.timeFormats.short', ld);
        }
    };
    DateTimePicker.prototype.timeHandler = function (e) {
        if (Browser.isDevice) {
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
                addClass([this.inputWrapper.container], [INPUTFOCUS$2]);
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
            if (!isNullOrUndefined(this.popupWrapper)) {
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
        var value = isNullOrUndefined(this.value) ? this.inputElement.value !== '' ?
            dateObject :
            new Date() : this.value;
        this.valueWithMinutes = value;
        this.listWrapper = createElement('div', { className: CONTENT$3, attrs: { 'tabindex': '0' } });
        var min = this.startTime(value);
        var max = this.endTime(value);
        var listDetails = TimePickerBase.createListItems(this.createElement, min, max, this.globalize, this.cldrTimeFormat(), this.step);
        this.timeCollections = listDetails.collection;
        this.listTag = listDetails.list;
        attributes(this.listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
        append([listDetails.list], this.listWrapper);
        this.wireTimeListEvents();
        var rippleModel = { duration: 300, selector: '.' + LISTCLASS$2 };
        this.rippleFn = rippleEffect(this.listWrapper, rippleModel);
        this.liCollections = this.listWrapper.querySelectorAll('.' + LISTCLASS$2);
    };
    DateTimePicker.prototype.popupCreation = function (type, e) {
        if (Browser.isDevice) {
            this.element.setAttribute('readonly', 'readonly');
        }
        if (type === 'date') {
            if (!this.readonly && this.popupWrapper) {
                addClass([this.popupWrapper], DATETIMEPOPUPWRAPPER);
                attributes(this.popupWrapper, { 'id': this.element.id + '_datepopup' });
            }
        }
        else {
            if (!this.readonly) {
                this.dateTimeWrapper = createElement('div', {
                    className: ROOT$4 + ' ' + POPUP$3,
                    attrs: { 'id': this.element.id + '_timepopup', 'style': 'visibility:hidden ; display:block' }
                });
                if (!isNullOrUndefined(this.cssClass)) {
                    this.dateTimeWrapper.className += ' ' + this.cssClass;
                }
                if (!isNullOrUndefined(this.step) && this.step > 0) {
                    this.listCreation();
                    append([this.listWrapper], this.dateTimeWrapper);
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
            popup: (isBlazor() && this.isServerRendered) ? null : this.popupObject,
            event: e || null
        };
        var eventArgs = this.preventArgs;
        this.trigger('open', eventArgs, function (eventArgs) {
            _this.preventArgs = eventArgs;
            if (!_this.preventArgs.cancel && !_this.readonly) {
                var openAnimation = {
                    name: 'FadeIn',
                    duration: ANIMATIONDURATION$1,
                };
                if (_this.zIndex === 1000) {
                    _this.popupObject.show(new Animation(openAnimation), _this.element);
                }
                else {
                    _this.popupObject.show(new Animation(openAnimation), null);
                }
                addClass([_this.inputWrapper.container], [ICONANIMATION$1]);
                attributes(_this.inputElement, { 'aria-expanded': 'true' });
                EventHandler.add(document, 'mousedown touchstart', _this.documentClickHandler, _this);
            }
        });
    };
    DateTimePicker.prototype.documentClickHandler = function (event) {
        var target = event.target;
        if ((!isNullOrUndefined(this.popupObject) && (this.inputWrapper.container.contains(target) ||
            (this.popupObject.element && this.popupObject.element.contains(target)))) && event.type !== 'touchstart') {
            event.preventDefault();
        }
        if (!(closest(target, '#' + (this.popupObject && this.popupObject.element.id))) && target !== this.inputElement
            && target !== this.timeIcon && target !== this.inputWrapper.container) {
            if (this.isTimePopupOpen()) {
                this.hide(event);
                this.focusOut();
            }
        }
        else if (target !== this.inputElement) {
            if (!Browser.isDevice) {
                this.isPreventBlur = ((document.activeElement === this.inputElement) && (Browser.isIE || Browser.info.name === 'edge')
                    && target === this.popupObject.element);
            }
        }
    };
    DateTimePicker.prototype.isTimePopupOpen = function () {
        return (this.dateTimeWrapper && this.dateTimeWrapper.classList.contains('' + ROOT$4)) ? true : false;
    };
    DateTimePicker.prototype.isDatePopupOpen = function () {
        return (this.popupWrapper && this.popupWrapper.classList.contains('' + DATETIMEPOPUPWRAPPER)) ? true : false;
    };
    DateTimePicker.prototype.renderPopup = function () {
        var _this = this;
        this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
        if (Browser.isDevice) {
            this.timeModal = createElement('div');
            this.timeModal.className = '' + ROOT$4 + ' e-time-modal';
            document.body.className += ' ' + OVERFLOW$3;
            this.timeModal.style.display = 'block';
            document.body.appendChild(this.timeModal);
        }
        var offset = 4;
        this.popupObject = new Popup(this.dateTimeWrapper, {
            width: this.setPopupWidth(),
            zIndex: this.zIndex,
            targetType: 'container',
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            relateTo: Browser.isDevice ? document.body : this.inputWrapper.container,
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            enableRtl: this.enableRtl,
            offsetY: offset,
            open: function () {
                _this.dateTimeWrapper.style.visibility = 'visible';
                addClass([_this.timeIcon], ACTIVE$2);
                if (!Browser.isDevice) {
                    _this.timekeyConfigure = extend(_this.timekeyConfigure, _this.keyConfigs);
                    _this.inputEvent = new KeyboardEvents(_this.inputWrapper.container, {
                        keyAction: _this.TimeKeyActionHandle.bind(_this),
                        keyConfigs: _this.timekeyConfigure,
                        eventName: 'keydown'
                    });
                }
            }, close: function () {
                removeClass([_this.timeIcon], ACTIVE$2);
                _this.unWireTimeListEvents();
                _this.inputElement.setAttribute('aria-activedescendant', 'null');
                remove(_this.popupObject.element);
                _this.popupObject.destroy();
                _this.dateTimeWrapper.innerHTML = '';
                _this.listWrapper = _this.dateTimeWrapper = undefined;
                if (_this.inputEvent) {
                    _this.inputEvent.destroy();
                }
            }, targetExitViewport: function () {
                if (!Browser.isDevice) {
                    _this.hide();
                }
            }
        });
        this.popupObject.element.style.maxHeight = POPUPDIMENSION$1;
    };
    DateTimePicker.prototype.setDimension = function (width) {
        if (typeof width === 'number') {
            width = formatUnit(width);
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
        EventHandler.add(this.listWrapper, 'click', this.onMouseClick, this);
        if (!Browser.isDevice) {
            EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
        }
    };
    DateTimePicker.prototype.unWireTimeListEvents = function () {
        if (this.listWrapper) {
            EventHandler.remove(this.listWrapper, 'click', this.onMouseClick);
            EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
            if (!Browser.isDevice) {
                EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
                EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
            }
        }
    };
    DateTimePicker.prototype.onMouseOver = function (event) {
        var currentLi = closest(event.target, '.' + LISTCLASS$2);
        this.setTimeHover(currentLi, HOVER$2);
    };
    DateTimePicker.prototype.onMouseLeave = function () {
        this.removeTimeHover(HOVER$2);
    };
    DateTimePicker.prototype.setTimeHover = function (li, className) {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(className)) {
            this.removeTimeHover(className);
            addClass([li], className);
        }
    };
    DateTimePicker.prototype.getPopupHeight = function () {
        var height = parseInt(POPUPDIMENSION$1, 10);
        var popupHeight = this.dateTimeWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    };
    DateTimePicker.prototype.changeEvent = function (e) {
        if ((this.value && this.value.valueOf()) !== (this.previousDateTime && +this.previousDateTime.valueOf())) {
            _super.prototype.changeEvent.call(this, e);
            this.inputElement.focus();
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
                isInteracted: !isNullOrUndefined(e),
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
        if (!isNullOrUndefined(popupElement)) {
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
            this.dateTimeWrapper.scrollTop = nextElement ? (height - (listHeight / HALFPOSITION$1 + lineHeight / HALFPOSITION$1)) : height;
        }
        else {
            this.dateTimeWrapper.scrollTop = 0;
        }
    };
    DateTimePicker.prototype.setScrollTo = function () {
        var element;
        var items = this.dateTimeWrapper.querySelectorAll('.' + LISTCLASS$2);
        if (items.length >= 0) {
            var initialTime = this.timeCollections[0];
            var scrollTime = this.getDateObject(this.checkDateValue(this.scrollTo)).getTime();
            element = items[Math.round((scrollTime - initialTime) / (this.step * 60000))];
        }
        else {
            this.dateTimeWrapper.scrollTop = 0;
        }
        if (!isNullOrUndefined(element)) {
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
            Input.setValue(tempVal, this.inputElement, this.floatLabelType, this.showClearButton);
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
        var li = this.selectedElement = closest(target, '.' + LISTCLASS$2);
        if (li && li.classList.contains(LISTCLASS$2)) {
            this.timeValue = li.getAttribute('data-value');
            this.hide(event);
        }
        this.setSelection(li, event);
    };
    DateTimePicker.prototype.setSelection = function (li, event) {
        if (this.isValidLI(li) && !li.classList.contains(ACTIVE$2)) {
            var value = li.getAttribute('data-value');
            this.selectedElement = li;
            var index = Array.prototype.slice.call(this.liCollections).indexOf(li);
            this.activeIndex = index;
            this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
            addClass([this.selectedElement], ACTIVE$2);
            this.selectedElement.setAttribute('aria-selected', 'true');
            this.updateValue(event);
        }
    };
    DateTimePicker.prototype.setTimeActiveClass = function () {
        var collections = isNullOrUndefined(this.dateTimeWrapper) ? this.listWrapper : this.dateTimeWrapper;
        if (!isNullOrUndefined(collections)) {
            var items = collections.querySelectorAll('.' + LISTCLASS$2);
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
        if (!isNullOrUndefined(this.selectedElement)) {
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedElement.getAttribute('id') });
        }
        else {
            attributes(this.inputElement, { 'aria-activedescendant': 'null' });
        }
    };
    DateTimePicker.prototype.addTimeSelection = function () {
        this.selectedElement = null;
        this.removeTimeSelection();
        this.setTimeActiveClass();
        if (!isNullOrUndefined(this.selectedElement)) {
            addClass([this.selectedElement], ACTIVE$2);
            this.selectedElement.setAttribute('aria-selected', 'true');
        }
    };
    DateTimePicker.prototype.removeTimeSelection = function () {
        this.removeTimeHover(HOVER$2);
        if (!isNullOrUndefined(this.dateTimeWrapper)) {
            var items = this.dateTimeWrapper.querySelectorAll('.' + ACTIVE$2);
            if (items.length) {
                removeClass(items, ACTIVE$2);
                items[0].removeAttribute('aria-selected');
            }
        }
    };
    DateTimePicker.prototype.removeTimeHover = function (className) {
        var hoveredItem = this.getTimeHoverItem(className);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, className);
        }
    };
    DateTimePicker.prototype.getTimeHoverItem = function (className) {
        var collections = isNullOrUndefined(this.dateTimeWrapper) ? this.listWrapper : this.dateTimeWrapper;
        var hoveredItem;
        if (!isNullOrUndefined(collections)) {
            hoveredItem = collections.querySelectorAll('.' + className);
        }
        return hoveredItem;
    };
    DateTimePicker.prototype.isValidLI = function (li) {
        return (li && li.classList.contains(LISTCLASS$2) && !li.classList.contains(DISABLED$4));
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
                popup: (isBlazor() && this.isServerRendered) ? null : this.popupObj || this.popupObject,
                event: e || null
            };
            var eventArgs = this.preventArgs;
            if (isNullOrUndefined(this.popupObj)) {
                this.trigger('close', eventArgs, function (eventArgs) {
                    _this.dateTimeCloseEventCallback(e, eventArgs);
                });
            }
            else {
                this.dateTimeCloseEventCallback(e, eventArgs);
            }
        }
        else {
            if (Browser.isDevice && this.allowEdit && !this.readonly) {
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
                removeClass([document.body], OVERFLOW$3);
                if (Browser.isDevice && this.timeModal) {
                    this.timeModal.style.display = 'none';
                    this.timeModal.outerHTML = '';
                    this.timeModal = null;
                }
                this.setTimeActiveDescendant();
            }
        }
        if (Browser.isDevice && this.allowEdit && !this.readonly) {
            this.inputElement.removeAttribute('readonly');
        }
        this.setAllowEdit();
    };
    DateTimePicker.prototype.closePopup = function (e) {
        if (this.isTimePopupOpen() && this.popupObject) {
            var animModel = {
                name: 'FadeOut',
                duration: ANIMATIONDURATION$1,
                delay: 0
            };
            this.popupObject.hide(new Animation(animModel));
            this.inputWrapper.container.classList.remove(ICONANIMATION$1);
            attributes(this.inputElement, { 'aria-expanded': 'false' });
            EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
        }
    };
    DateTimePicker.prototype.preRender = function () {
        this.checkFormat();
        this.dateTimeFormat = this.cldrDateTimeFormat();
        _super.prototype.preRender.call(this);
        removeClass([this.inputElementCopy], [ROOT$4]);
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
        var attributes$$1 = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['style', 'name', 'step', 'disabled', 'readonly', 'value', 'min', 'max', 'placeholder', 'type'];
        var value;
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'name':
                        this.inputElement.setAttribute('name', this.inputElement.getAttribute(prop));
                        break;
                    case 'step':
                        this.step = parseInt(this.inputElement.getAttribute(prop), 10);
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['readonly'] === undefined)) || isDynamic) {
                            var readonly = this.inputElement.getAttribute(prop) === 'disabled' ||
                                this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, !isDynamic);
                        }
                        break;
                    case 'min':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['min'] === undefined)) || isDynamic) {
                            value = new Date(this.inputElement.getAttribute(prop));
                            if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                                this.setProperties({ min: value }, !isDynamic);
                            }
                        }
                        break;
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['enabled'] === undefined)) || isDynamic) {
                            var enabled = this.inputElement.getAttribute(prop) === 'disabled' ||
                                this.inputElement.getAttribute(prop) === 'true' ||
                                this.inputElement.getAttribute(prop) === '' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['value'] === undefined)) || isDynamic) {
                            value = new Date(this.inputElement.getAttribute(prop));
                            if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                                this.setProperties({ value: value }, !isDynamic);
                            }
                        }
                        break;
                    case 'max':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['max'] === undefined)) || isDynamic) {
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
        if (!isNullOrUndefined(this.dateTimeWrapper)) {
            return this.dateTimeWrapper.querySelectorAll('.' + ACTIVE$2);
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
            var status_1 = !isNullOrUndefined(value);
            if (this.checkDateValue(dateValue)) {
                var date = status_1 ? value.getDate() : DAY$1;
                var month = status_1 ? value.getMonth() : MONTH$3;
                var year = status_1 ? value.getFullYear() : YEAR$3;
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
        var value = isNullOrUndefined(this.valueWithMinutes) ? this.createDateObj(textVal) :
            this.getDateObject(this.valueWithMinutes);
        var dateTimeVal = null;
        var listCount = this.liCollections.length;
        if (!isNullOrUndefined(this.activeIndex) || !isNullOrUndefined(this.checkDateValue(value))) {
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
            this.timeElementValue(isNullOrUndefined(dateTimeVal) ? null : new Date(dateTimeVal));
        }
    };
    DateTimePicker.prototype.setTimeValue = function (date, value) {
        var dateString;
        var time;
        var val = this.validateMinMaxRange(value);
        var newval = this.createDateObj(val);
        if (this.getFormattedValue(newval) !== (!isNullOrUndefined(this.value) ? this.getFormattedValue(this.value) : null)) {
            this.valueWithMinutes = isNullOrUndefined(newval) ? null : newval;
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
                format: !isNullOrUndefined(this.formatString) ? this.formatString : this.cldrDateTimeFormat(),
                type: 'dateTime', skeleton: 'yMd'
            });
        }
        else {
            dateString = this.globalize.formatDate(time, {
                format: !isNullOrUndefined(this.formatString) ? this.formatString : this.cldrDateTimeFormat(),
                type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
            });
        }
        if (!this.strictMode && isNullOrUndefined(time)) {
            Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        else {
            Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        return time;
    };
    DateTimePicker.prototype.timeElementValue = function (value) {
        if (!isNullOrUndefined(this.checkDateValue(value)) && !this.isNullOrEmpty(value)) {
            var date = value instanceof Date ? value : this.getDateObject(value);
            return this.setTimeValue(date, value);
        }
        return null;
    };
    DateTimePicker.prototype.timeKeyHandler = function (event) {
        if (isNullOrUndefined(this.step) || this.step <= 0) {
            return;
        }
        var listCount = this.timeCollections.length;
        if (isNullOrUndefined(this.getTimeActiveElement()) || this.getTimeActiveElement().length === 0) {
            if (this.liCollections.length > 0) {
                if (isNullOrUndefined(this.value) && isNullOrUndefined(this.activeIndex)) {
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
                nextItemValue = isNullOrUndefined(this.timeCollections[index]) ? this.timeCollections[0] : this.timeCollections[index];
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
        this.setTimeHover(this.selectedElement, NAVIGATION$1);
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
                    addClass([this.inputWrapper.container], INPUTFOCUS$2);
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
                    var options = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd' };
                    this.invalidValueString = null;
                    this.checkInvalidValue(newProp.value);
                    newProp.value = this.value;
                    newProp.value = this.validateValue(newProp.value);
                    Input.setValue(this.getFormattedValue(newProp.value), this.inputElement, this.floatLabelType, this.showClearButton);
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
                    Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.inputWrapper.container], oldProp.cssClass);
                    if (this.dateTimeWrapper) {
                        Input.setCssClass(newProp.cssClass, [this.dateTimeWrapper], oldProp.cssClass);
                    }
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.l10n.getConstant('placeholder'), this.inputElement);
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
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.inputElement.setAttribute('aria-placeholder', newProp.placeholder);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.inputElement);
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
                    Input.setReadonly(this.readonly, this.inputElement);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
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
        this.previousElementValue = this.previousElementValue = (isNullOrUndefined(this.inputValueCopy)) ? '' :
            this.getFormattedValue(this.inputValueCopy);
    };
    __decorate$4([
        Property(null)
    ], DateTimePicker.prototype, "timeFormat", void 0);
    __decorate$4([
        Property(30)
    ], DateTimePicker.prototype, "step", void 0);
    __decorate$4([
        Property(null)
    ], DateTimePicker.prototype, "scrollTo", void 0);
    __decorate$4([
        Property(1000)
    ], DateTimePicker.prototype, "zIndex", void 0);
    __decorate$4([
        Property(null)
    ], DateTimePicker.prototype, "value", void 0);
    __decorate$4([
        Property(null)
    ], DateTimePicker.prototype, "keyConfigs", void 0);
    __decorate$4([
        Property({})
    ], DateTimePicker.prototype, "htmlAttributes", void 0);
    __decorate$4([
        Property(false)
    ], DateTimePicker.prototype, "enablePersistence", void 0);
    __decorate$4([
        Property(true)
    ], DateTimePicker.prototype, "allowEdit", void 0);
    __decorate$4([
        Property(false)
    ], DateTimePicker.prototype, "isMultiSelection", void 0);
    __decorate$4([
        Property(null)
    ], DateTimePicker.prototype, "values", void 0);
    __decorate$4([
        Property(true)
    ], DateTimePicker.prototype, "showClearButton", void 0);
    __decorate$4([
        Property(null)
    ], DateTimePicker.prototype, "placeholder", void 0);
    __decorate$4([
        Property(false)
    ], DateTimePicker.prototype, "strictMode", void 0);
    __decorate$4([
        Property(null)
    ], DateTimePicker.prototype, "serverTimezoneOffset", void 0);
    __decorate$4([
        Property(new Date(1900, 0, 1))
    ], DateTimePicker.prototype, "min", void 0);
    __decorate$4([
        Property(new Date(2099, 11, 31))
    ], DateTimePicker.prototype, "max", void 0);
    __decorate$4([
        Property(null)
    ], DateTimePicker.prototype, "firstDayOfWeek", void 0);
    __decorate$4([
        Property('Gregorian')
    ], DateTimePicker.prototype, "calendarMode", void 0);
    __decorate$4([
        Property('Month')
    ], DateTimePicker.prototype, "start", void 0);
    __decorate$4([
        Property('Month')
    ], DateTimePicker.prototype, "depth", void 0);
    __decorate$4([
        Property(false)
    ], DateTimePicker.prototype, "weekNumber", void 0);
    __decorate$4([
        Property(true)
    ], DateTimePicker.prototype, "showTodayButton", void 0);
    __decorate$4([
        Property('Short')
    ], DateTimePicker.prototype, "dayHeaderFormat", void 0);
    __decorate$4([
        Event()
    ], DateTimePicker.prototype, "open", void 0);
    __decorate$4([
        Event()
    ], DateTimePicker.prototype, "close", void 0);
    __decorate$4([
        Event()
    ], DateTimePicker.prototype, "cleared", void 0);
    __decorate$4([
        Event()
    ], DateTimePicker.prototype, "blur", void 0);
    __decorate$4([
        Event()
    ], DateTimePicker.prototype, "focus", void 0);
    __decorate$4([
        Event()
    ], DateTimePicker.prototype, "created", void 0);
    __decorate$4([
        Event()
    ], DateTimePicker.prototype, "destroyed", void 0);
    DateTimePicker = __decorate$4([
        NotifyPropertyChanges
    ], DateTimePicker);
    return DateTimePicker;
}(DatePicker));

/**
 * DateTimePicker modules
 */

/**
 * Calendar all modules
 */

export { CalendarBase, Calendar, Islamic, DatePicker, Presets, DateRangePicker, TimePickerBase, TimePicker, DateTimePicker };
//# sourceMappingURL=ej2-calendars.es5.js.map
