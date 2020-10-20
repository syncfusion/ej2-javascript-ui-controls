window.sf = window.sf || {};
var sfcalendar = (function (exports) {
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
var CalendarBase = /** @class */ (function (_super) {
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
        _this.isTodayClicked = false;
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
        this.globalize = new sf.base.Internationalization(this.locale);
        if (sf.base.isNullOrUndefined(this.firstDayOfWeek) || this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: this.globalize.getFirstDayOfWeek() }, true);
        }
        this.todayDisabled = false;
        this.todayDate = new Date(new Date().setHours(0, 0, 0, 0));
        if (this.getModuleName() === 'calendar') {
            this.element.classList.add(ROOT);
            if (this.enableRtl) {
                this.element.classList.add(RTL);
            }
            if (sf.base.Browser.isDevice) {
                this.element.classList.add(DEVICE);
            }
            sf.base.attributes(this.element, {
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
            if (sf.base.Browser.isDevice) {
                this.calendarElement.classList.add(DEVICE);
            }
            sf.base.attributes(this.calendarElement, {
                'role': 'calendar'
            });
        }
        this.createHeader();
        this.createContent();
        this.wireEvents();
    };
    CalendarBase.prototype.rangeValidation = function (min, max) {
        if (sf.base.isNullOrUndefined(min)) {
            this.setProperties({ min: new Date(1900, 0, 1) }, true);
        }
        if (sf.base.isNullOrUndefined(max)) {
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
        if (!sf.base.isNullOrUndefined(value) && this.min <= this.max && value >= this.min && value <= this.max) {
            this.currentDate = new Date(this.checkValue(value));
        }
    };
    CalendarBase.prototype.setOverlayIndex = function (popupWrapper, popupElement, modal, isDevice) {
        if (isDevice && !sf.base.isNullOrUndefined(popupElement) && !sf.base.isNullOrUndefined(modal) && !sf.base.isNullOrUndefined(popupWrapper)) {
            var index = parseInt(popupElement.style.zIndex, 10) ? parseInt(popupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupWrapper.style.zIndex = index.toString();
        }
    };
    CalendarBase.prototype.minMaxUpdate = function (value) {
        if (!(+this.min <= +this.max)) {
            this.setProperties({ min: this.min }, true);
            sf.base.addClass([this.element], OVERLAY);
        }
        else {
            sf.base.removeClass([this.element], OVERLAY);
        }
        this.min = sf.base.isNullOrUndefined(this.min) || !(+this.min) ? this.min = new Date(1900, 0, 1) : this.min;
        this.max = sf.base.isNullOrUndefined(this.max) || !(+this.max) ? this.max = new Date(2099, 11, 31) : this.max;
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
        sf.base.rippleEffect(this.previousIcon, {
            duration: 400,
            selector: '.e-prev',
            isCenterRipple: true
        });
        sf.base.attributes(this.previousIcon, ariaPrevAttrs);
        this.nextIcon = this.createElement('button', { className: '' + NEXTICON, attrs: { type: 'button' } });
        sf.base.rippleEffect(this.nextIcon, {
            selector: '.e-next',
            duration: 400,
            isCenterRipple: true
        });
        sf.base.attributes(this.nextIcon, ariaNextAttrs);
        this.headerTitleElement = this.createElement('div', { className: '' + LINK + ' ' + TITLE });
        sf.base.attributes(this.headerTitleElement, ariaTitleAttrs);
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
        var dayFormat = (sf.base.isBlazor() ? 'days.' : 'days.stand-alone.') + this.dayHeaderFormat.toLowerCase();
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = (sf.base.getValue(dayFormat, sf.base.getDefaultDateObject()));
        }
        else {
            cldrObj = (this.getCultureObjects(sf.base.cldrData, '' + this.locale));
        }
        for (var _i = 0, _a = Object.keys(cldrObj); _i < _a.length; _i++) {
            var obj = _a[_i];
            culShortNames.push(sf.base.getValue(obj, cldrObj));
        }
        return culShortNames;
    };
    CalendarBase.prototype.toCapitalize = function (text) {
        return !sf.base.isNullOrUndefined(text) && text.length ? text[0].toUpperCase() + text.slice(1) : text;
    };
    CalendarBase.prototype.createContentHeader = function () {
        if (this.getModuleName() === 'calendar') {
            if (!sf.base.isNullOrUndefined(this.element.querySelectorAll('.e-content .e-week-header')[0])) {
                sf.base.detach(this.element.querySelectorAll('.e-content .e-week-header')[0]);
            }
        }
        else {
            if (!sf.base.isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content .e-week-header')[0])) {
                sf.base.detach(this.calendarElement.querySelectorAll('.e-content .e-week-header')[0]);
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
                sf.base.addClass([this.element], '' + WEEKNUMBER);
            }
            else {
                sf.base.addClass([this.calendarElement], '' + WEEKNUMBER);
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
            if (!sf.base.isNullOrUndefined(this.element.querySelectorAll('.e-content tbody')[0])) {
                sf.base.detach(this.element.querySelectorAll('.e-content tbody')[0]);
            }
        }
        else {
            if (!sf.base.isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content tbody')[0])) {
                sf.base.detach(this.calendarElement.querySelectorAll('.e-content tbody')[0]);
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
            this.globalize = new sf.base.Internationalization(this.locale);
            this.l10 = new sf.base.L10n(this.getModuleName(), l10nLocale, this.locale);
            this.todayElement = this.createElement('button', { attrs: { role: 'button' } });
            sf.base.rippleEffect(this.todayElement);
            this.updateFooter();
            sf.base.addClass([this.todayElement], [BTN, TODAY, FLAT, PRIMARY, CSS]);
            if ((!(+new Date(minimum.setHours(0, 0, 0, 0)) <= +this.todayDate &&
                +this.todayDate <= +new Date(maximum.setHours(0, 0, 0, 0)))) || (this.todayDisabled)) {
                sf.base.addClass([this.todayElement], DISABLED);
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
                sf.base.EventHandler.add(this.todayElement, 'click', this.todayButtonClick, this);
            }
        }
    };
    CalendarBase.prototype.wireEvents = function (id, ref, keyConfig, moduleName) {
        if (!(sf.base.isBlazor() && ref)) {
            sf.base.EventHandler.add(this.headerTitleElement, 'click', this.navigateTitle, this);
            this.defaultKeyConfigs = sf.base.extend(this.defaultKeyConfigs, this.keyConfigs);
        }
        else {
            this.element = document.getElementById(id);
            this.defaultKeyConfigs = this.getDefaultKeyConfig();
            this.defaultKeyConfigs = sf.base.extend(this.defaultKeyConfigs, keyConfig);
            this.blazorRef = ref;
            this.serverModuleName = moduleName;
        }
        if (this.getModuleName() === 'calendar') {
            this.keyboardModule = new sf.base.KeyboardEvents(this.element, {
                eventName: 'keydown',
                keyAction: this.keyActionHandle.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        }
        else {
            this.keyboardModule = new sf.base.KeyboardEvents(this.calendarElement, {
                eventName: 'keydown',
                keyAction: this.keyActionHandle.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        }
    };
    CalendarBase.prototype.dateWireEvents = function (id, ref, keyConfig, moduleName) {
        this.defaultKeyConfigs = this.getDefaultKeyConfig();
        this.defaultKeyConfigs = sf.base.extend(this.defaultKeyConfigs, keyConfig);
        this.blazorRef = ref;
        this.serverModuleName = moduleName;
    };
    CalendarBase.prototype.todayButtonClick = function (e, value) {
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
        if (sf.base.Browser.isDevice && sf.base.isBlazor() && ref) {
            // tslint:disable-next-line
            ref.invokeMethodAsync('OnDevice', true);
        }
    };
    // tslint:disable-next-line:max-func-body-length
    CalendarBase.prototype.keyActionHandle = function (e, value, multiSelection) {
        if (sf.base.isBlazor() && this.blazorRef) {
            e.preventDefault();
            if (!this.tableBodyElement) {
                this.element = sf.base.closest(e.target, '.' + 'e-calendar');
                this.tableBodyElement = this.element.querySelector('tbody');
            }
            multiSelection = false;
        }
        var focusedDate = this.tableBodyElement.querySelector('tr td.e-focused-date');
        var selectedDate;
        if (multiSelection) {
            if (!sf.base.isNullOrUndefined(focusedDate) && +value === parseInt(focusedDate.getAttribute('id').split('_')[0], 10)) {
                selectedDate = focusedDate;
            }
            else {
                selectedDate = this.tableBodyElement.querySelector('tr td.e-selected');
            }
        }
        else {
            selectedDate = this.tableBodyElement.querySelector('tr td.e-selected');
        }
        if (sf.base.isBlazor() && this.blazorRef) {
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
            if (this.serverModuleName === 'sf.calendars.Calendar') {
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
                        this.todayButtonClick(e, value);
                    }
                    else {
                        var element = !sf.base.isNullOrUndefined(focusedDate) ? focusedDate : selectedDate;
                        if (!sf.base.isNullOrUndefined(element) && !element.classList.contains(DISABLED)) {
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
                    if (!sf.base.isNullOrUndefined(focusedDate) || !sf.base.isNullOrUndefined(selectedDate) && !levelRestrict) {
                        this.contentClick(null, --view, (focusedDate || selectedDate), value);
                    }
                    e.preventDefault();
                    break;
                case 'home':
                    this.currentDate = this.firstDay(this.currentDate);
                    sf.base.detach(this.tableBodyElement);
                    (view === 0) ? this.renderMonths(e) : ((view === 1) ? this.renderYears(e) : this.renderDecades(e));
                    e.preventDefault();
                    break;
                case 'end':
                    this.currentDate = this.lastDay(this.currentDate, view);
                    sf.base.detach(this.tableBodyElement);
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
                    sf.base.detach(this.tableBodyElement);
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
                        sf.base.detach(this.tableBodyElement);
                        this.renderYears(e);
                    }
                    else {
                        this.currentDate = date;
                    }
                }
                else {
                    if (this.isMonthYearRange(this.currentDate)) {
                        sf.base.detach(this.tableBodyElement);
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
                    sf.base.detach(this.tableBodyElement);
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
                sf.base.addClass([weekEle], '' + WEEKNUMBER);
                tdEles.push(weekEle);
            }
            minMaxDate = new Date(+localDate);
            localDate = this.minMaxDate(localDate);
            var dateFormatOptions = { type: 'dateTime', skeleton: sf.base.isBlazor() ? 'D' : 'full' };
            var date = this.globalize.parseDate(this.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
            var tdEle = this.dayCell(localDate);
            var title = this.globalize.formatDate(localDate, { type: 'date', skeleton: sf.base.isBlazor() ? 'D' : 'full' });
            var dayLink = this.createElement('span');
            dayLink.textContent = this.globalize.formatDate(localDate, { format: 'd', type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' });
            var disabled = (this.min > localDate) || (this.max < localDate);
            if (disabled) {
                sf.base.addClass([tdEle], DISABLED);
                sf.base.addClass([tdEle], OVERLAY);
            }
            else {
                dayLink.setAttribute('title', '' + title);
            }
            if (currentMonth !== localDate.getMonth()) {
                sf.base.addClass([tdEle], OTHERMONTH);
            }
            if (localDate.getDay() === 0 || localDate.getDay() === 6) {
                sf.base.addClass([tdEle], WEEKEND);
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
                var selectDate = new Date(this.checkValue(value));
                var argsDate = new Date(this.checkValue(argument.date));
                if (multiSelection) {
                    if (!sf.base.isNullOrUndefined(values) && values.length > 0) {
                        for (var index = 0; index < values.length; index++) {
                            var localDateString = +new Date(this.globalize.formatDate(argument.date, { type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' }));
                            var tempDateString = +new Date(this.globalize.formatDate(values[index], { type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' }));
                            if (localDateString === tempDateString) {
                                values.splice(index, 1);
                                index = -1;
                            }
                        }
                    }
                }
                else if (selectDate && +selectDate === +argsDate) {
                    this.setProperties({ value: null }, true);
                }
            }
            if (this.renderDayCellArgs.isDisabled && !tdEle.classList.contains(SELECTED)) {
                sf.base.addClass([tdEle], DISABLED);
                sf.base.addClass([tdEle], OVERLAY);
                if (+this.renderDayCellArgs.date === +this.todayDate) {
                    this.todayDisabled = true;
                }
            }
            var otherMnthBool = tdEle.classList.contains(OTHERMONTH);
            var disabledCls = tdEle.classList.contains(DISABLED);
            if (!disabledCls) {
                sf.base.EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            // to set the value as null while setting the disabled date onProperty change.
            // if (args.isDisabled && +this.value === +args.date) {
            //     this.setProperties({ value: null }, true);
            // }
            if (multiSelection && !sf.base.isNullOrUndefined(values) && !disabledCls) {
                for (var tempValue = 0; tempValue < values.length; tempValue++) {
                    var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                    var formatOptions = { format: this.getFromatStringValue(), type: 'date', skeleton: 'short', calendar: type };
                    var localDateString = this.globalize.formatDate(localDate, formatOptions);
                    var tempDateString = this.globalize.formatDate(values[tempValue], formatOptions);
                    if ((localDateString === tempDateString && this.getDateVal(localDate, values[tempValue]))
                        || (this.getDateVal(localDate, value))) {
                        sf.base.addClass([tdEle], SELECTED);
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
                sf.base.addClass([tdEle], SELECTED);
            }
            else {
                this.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
            }
            if (date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate()) {
                if (date.getFullYear() === new Date().getFullYear()) {
                    sf.base.addClass([tdEle], TODAY);
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
            sf.base.addClass([tableElement], FOCUSEDDATE);
        }
        else {
            if (currentDate >= this.max && parseInt(tableElement.id, 0) === +this.max && !otherMonth && !disabled) {
                sf.base.addClass([tableElement], FOCUSEDDATE);
            }
            if (currentDate <= this.min && parseInt(tableElement.id, 0) === +this.min && !otherMonth && !disabled) {
                sf.base.addClass([tableElement], FOCUSEDDATE);
            }
        }
    };
    CalendarBase.prototype.renderYears = function (e, value) {
        this.removeTableHeadElement();
        var numCells = 4;
        var tdEles = [];
        var valueUtil = sf.base.isNullOrUndefined(value);
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
            var select = (value && (value).getFullYear() === yr && localMonth);
            dayLink.textContent = this.toCapitalize(this.globalize.formatDate(localDate, {
                format: sf.base.isBlazor() ? 'MMM' : null, type: 'dateTime', skeleton: 'MMM'
            }));
            if ((this.min && (curYrs < minYr || (month < minMonth && curYrs === minYr))) || (this.max && (curYrs > maxYr || (month > maxMonth && curYrs >= maxYr)))) {
                sf.base.addClass([tdEle], DISABLED);
            }
            else if (!valueUtil && select) {
                sf.base.addClass([tdEle], SELECTED);
            }
            else {
                if (localDate.getMonth() === mon && this.currentDate.getMonth() === mon) {
                    sf.base.addClass([tdEle], FOCUSEDDATE);
                }
            }
            localDate.setDate(1);
            localDate.setMonth(localDate.getMonth() + 1);
            if (!tdEle.classList.contains(DISABLED)) {
                sf.base.EventHandler.add(tdEle, 'click', this.clickHandler, this);
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
        var startHdrYr = this.globalize.formatDate(startYr, {
            format: sf.base.isBlazor() ? 'yyyy' : null, type: 'dateTime', skeleton: 'y'
        });
        var endHdrYr = this.globalize.formatDate(endYr, { format: sf.base.isBlazor() ? 'yyyy' : null, type: 'dateTime', skeleton: 'y' });
        this.headerTitleElement.textContent = startHdrYr + ' - ' + (endHdrYr);
        var start = new Date(localYr - (localYr % 10) - 1, 0, 1);
        var startYear = start.getFullYear();
        for (var rowIterator = 0; rowIterator < yearCell; ++rowIterator) {
            var year = startYear + rowIterator;
            localDate.setFullYear(year);
            var tdEle = this.dayCell(localDate);
            sf.base.attributes(tdEle, { 'role': 'gridcell' });
            var dayLink = this.createElement('span');
            dayLink.textContent = this.globalize.formatDate(localDate, {
                format: sf.base.isBlazor() ? 'yyyy' : null, type: 'dateTime', skeleton: 'y'
            });
            if ((year < startFullYr) || (year > endFullYr)) {
                sf.base.addClass([tdEle], OTHERDECADE);
                if (!sf.base.isNullOrUndefined(value) && localDate.getFullYear() === (value).getFullYear()) {
                    sf.base.addClass([tdEle], SELECTED);
                }
                if (year < new Date(this.checkValue(this.min)).getFullYear() ||
                    year > new Date(this.checkValue(this.max)).getFullYear()) {
                    sf.base.addClass([tdEle], DISABLED);
                }
            }
            else if (year < new Date(this.checkValue(this.min)).getFullYear() ||
                year > new Date(this.checkValue(this.max)).getFullYear()) {
                sf.base.addClass([tdEle], DISABLED);
            }
            else if (!sf.base.isNullOrUndefined(value) && localDate.getFullYear() === (value).getFullYear()) {
                sf.base.addClass([tdEle], SELECTED);
            }
            else {
                if (localDate.getFullYear() === this.currentDate.getFullYear() && !tdEle.classList.contains(DISABLED)) {
                    sf.base.addClass([tdEle], FOCUSEDDATE);
                }
            }
            if (!tdEle.classList.contains(DISABLED)) {
                sf.base.EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.renderTemplate(tdEles, numCells, 'e-decade', e, value);
    };
    CalendarBase.prototype.dayCell = function (localDate) {
        var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
        var dateFormatOptions = { skeleton: sf.base.isBlazor() ? 'F' : 'full', type: 'dateTime', calendar: type };
        var date = this.globalize.parseDate(this.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
        var value = date.valueOf();
        var attrs = {
            className: CELL, attrs: { 'id': '' + sf.base.getUniqueID('' + value), 'aria-selected': 'false', 'role': 'gridcell' }
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
        return (!sf.base.isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
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
            if (!sf.base.isNullOrUndefined(this.element.querySelectorAll('.e-content table thead')[0])) {
                sf.base.detach(this.tableHeadElement);
            }
        }
        else {
            if (!sf.base.isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content table thead')[0])) {
                sf.base.detach(this.tableHeadElement);
            }
        }
    };
    CalendarBase.prototype.renderTemplate = function (elements, count, classNm, e, value) {
        var view = this.getViewNumber(this.currentView());
        var trEle;
        this.tableBodyElement = this.createElement('tbody');
        this.table.appendChild(this.tableBodyElement);
        sf.base.removeClass([this.contentElement, this.headerElement], [MONTH, DECADE, YEAR]);
        sf.base.addClass([this.contentElement, this.headerElement], [classNm]);
        var weekNumCell = 41;
        var numberCell = 35;
        var otherMonthCell = 6;
        var row = count;
        var rowIterator = 0;
        for (var dayCell = 0; dayCell < elements.length / count; ++dayCell) {
            trEle = this.createElement('tr', { attrs: { 'role': 'row' } });
            for (rowIterator = 0 + rowIterator; rowIterator < row; rowIterator++) {
                if (!elements[rowIterator].classList.contains('e-week-number') && !sf.base.isNullOrUndefined(elements[rowIterator].children[0])) {
                    sf.base.addClass([elements[rowIterator].children[0]], [LINK]);
                    sf.base.rippleEffect(elements[rowIterator].children[0], {
                        duration: 600,
                        isCenterRipple: true
                    });
                }
                trEle.appendChild(elements[rowIterator]);
                if (this.weekNumber && rowIterator === otherMonthCell + 1 && elements[otherMonthCell + 1].classList.contains(OTHERMONTH)) {
                    sf.base.addClass([trEle], OTHERMONTHROW);
                }
                if (!this.weekNumber && rowIterator === otherMonthCell && elements[otherMonthCell].classList.contains(OTHERMONTH)) {
                    sf.base.addClass([trEle], OTHERMONTHROW);
                }
                if (this.weekNumber) {
                    if (rowIterator === weekNumCell && elements[weekNumCell].classList.contains(OTHERMONTH)) {
                        sf.base.addClass([trEle], OTHERMONTHROW);
                    }
                }
                else {
                    if (rowIterator === numberCell && elements[numberCell].classList.contains(OTHERMONTH)) {
                        sf.base.addClass([trEle], OTHERMONTHROW);
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
                    sf.base.detach(this.tableBodyElement);
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
                    sf.base.detach(this.tableBodyElement);
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
                    sf.base.detach(this.tableBodyElement);
                    this.renderYears(e);
                }
        }
    };
    CalendarBase.prototype.switchView = function (view, e, multiSelection) {
        switch (view) {
            case 0:
                sf.base.detach(this.tableBodyElement);
                this.renderMonths(e);
                if (multiSelection && !sf.base.isNullOrUndefined(this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0])) {
                    this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0].classList.remove(FOCUSEDDATE);
                }
                break;
            case 1:
                sf.base.detach(this.tableBodyElement);
                this.renderYears(e);
                break;
            case 2:
                sf.base.detach(this.tableBodyElement);
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
                    sf.base.detach(this.tableBodyElement);
                    this.minMaxUpdate();
                    if (multiSelection) {
                        this.validateValues(multiSelection, values);
                    }
                    this.createContentBody();
                    if ((this.todayDate < this.min || this.max < this.todayDate) && (this.footer) && (this.todayElement)) {
                        sf.base.detach(this.todayElement);
                        sf.base.detach(this.footer);
                        this.todayElement = this.footer = null;
                        this.createContentFooter();
                    }
                    else {
                        if ((this.footer) && (this.todayElement) && this.todayElement.classList.contains('e-disabled')) {
                            sf.base.removeClass([this.todayElement], DISABLED);
                            sf.base.detach(this.todayElement);
                            sf.base.detach(this.footer);
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
                    this.globalize = new sf.base.Internationalization(this.locale);
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
                        if (!sf.base.isNullOrUndefined(this.todayElement) && !sf.base.isNullOrUndefined(this.footer)) {
                            sf.base.detach(this.todayElement);
                            sf.base.detach(this.footer);
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
        if (multiSelection && !sf.base.isNullOrUndefined(values) && values.length > 0) {
            var copyValues = this.copyValues(values);
            for (var skipIndex = 0; skipIndex < copyValues.length; skipIndex++) {
                var tempValue = copyValues[skipIndex];
                var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                var tempValueString = void 0;
                if (this.calendarMode === 'Gregorian') {
                    /* tslint:disable-next-line:max-line-length */
                    tempValueString = this.globalize.formatDate(tempValue, { type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd' });
                }
                else {
                    /* tslint:disable-next-line:max-line-length */
                    tempValueString = this.globalize.formatDate(tempValue, { type: 'dateTime', skeleton: 'full', calendar: 'islamic' });
                }
                var minFormatOption = { type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd', calendar: type };
                var minStringValue = this.globalize.formatDate(this.min, minFormatOption);
                var minString = minStringValue;
                var maxFormatOption = { type: 'date', skeleton: sf.base.isBlazor() ? 'd' : 'yMd', calendar: type };
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
        if (!sf.base.isNullOrUndefined(this.tableBodyElement)) {
            sf.base.detach(this.tableBodyElement);
            this.setProperties({ start: this.currentView() }, true);
            this.createContentBody();
        }
    };
    CalendarBase.prototype.copyValues = function (values) {
        var copyValues = [];
        if (!sf.base.isNullOrUndefined(values) && values.length > 0) {
            for (var index = 0; index < values.length; index++) {
                copyValues.push(new Date(+values[index]));
            }
        }
        return copyValues;
    };
    CalendarBase.prototype.titleUpdate = function (date, view) {
        var globalize = new sf.base.Internationalization(this.locale);
        var dayFormatOptions;
        var monthFormatOptions;
        var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
        if (this.calendarMode === 'Gregorian') {
            dayFormatOptions = globalize.formatDate(date, { type: 'dateTime', skeleton: sf.base.isBlazor() ? 'y' : 'yMMMM', calendar: type });
            monthFormatOptions = globalize.formatDate(date, {
                format: sf.base.isBlazor() ? 'yyyy' : null, type: 'dateTime', skeleton: 'y', calendar: type
            });
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
            title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: sf.base.isBlazor() ? 'D' : 'full', calendar: type });
        }
        else if (view === 'Year') {
            if (type !== 'islamic') {
                title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: sf.base.isBlazor() ? 'y' : 'yMMMM', calendar: type });
            }
            else {
                title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: 'GyMMM', calendar: type });
            }
        }
        else {
            title = this.globalize.formatDate(this.currentDate, {
                format: sf.base.isBlazor() ? 'yyyy' : null, type: 'date', skeleton: 'y', calendar: type
            });
        }
        if (selectedEle || focusedEle) {
            if (!sf.base.isNullOrUndefined(selectedEle)) {
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
            sf.base.removeClass([this.element], [ROOT]);
        }
        else {
            if (this.calendarElement) {
                sf.base.removeClass([this.element], [ROOT]);
            }
        }
        if (this.getModuleName() === 'calendar') {
            sf.base.EventHandler.remove(this.headerTitleElement, 'click', this.navigateTitle);
            if (this.todayElement) {
                sf.base.EventHandler.remove(this.todayElement, 'click', this.todayButtonClick);
            }
            this.previousIconHandler(true);
            this.nextIconHandler(true);
            this.keyboardModule.destroy();
            this.element.removeAttribute('data-role');
            (!sf.base.isNullOrUndefined(this.calendarEleCopy.getAttribute('tabindex'))) ?
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
        return (!sf.base.isNullOrUndefined(value) && date.getDate() === (value).getDate()
            && date.getMonth() === (value).getMonth() && date.getFullYear() === (value).getFullYear());
    };
    CalendarBase.prototype.getCultureObjects = function (ld, c) {
        var gregorianFormat = (sf.base.isBlazor() ? '.dates.days.' :
            '.dates.calendars.gregorian.days.format.') + this.dayHeaderFormat.toLowerCase();
        var islamicFormat = (sf.base.isBlazor() ? '.dates.days.' :
            '.dates.calendars.islamic.days.format.') + this.dayHeaderFormat.toLowerCase();
        var mainVal = sf.base.isBlazor() ? '' : 'main.';
        if (this.calendarMode === 'Gregorian') {
            return sf.base.getValue(mainVal + '' + this.locale + gregorianFormat, ld);
        }
        else {
            return sf.base.getValue('main.' + '' + this.locale + islamicFormat, ld);
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
        var dateFormatOptions = { type: 'dateTime', skeleton: sf.base.isBlazor() ? 'F' : 'full', calendar: type };
        var dateString = this.globalize.formatDate(new Date(parseInt('' + eve.getAttribute('id'), 0)), dateFormatOptions);
        var date = this.globalize.parseDate(dateString, dateFormatOptions);
        var value = date.valueOf() - date.valueOf() % 1000;
        return new Date(value);
        //return this.globalize.parseDate(dateString, dateFormatOptions);
    };
    CalendarBase.prototype.adjustLongHeaderSize = function () {
        sf.base.removeClass([this.element], DAYHEADERLONG);
        if (this.dayHeaderFormat === 'Wide') {
            sf.base.addClass([this.getModuleName() === 'calendar' ? this.element : this.calendarElement], DAYHEADERLONG);
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
                if (!sf.base.isNullOrUndefined(values) && copyValues.length > 0) {
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
        var tableBodyElement = sf.base.closest(element, '.' + ROOT);
        if (sf.base.isNullOrUndefined(tableBodyElement)) {
            tableBodyElement = this.tableBodyElement;
        }
        if (!multiSelection && !sf.base.isNullOrUndefined(tableBodyElement.querySelector('.' + SELECTED))) {
            sf.base.removeClass([tableBodyElement.querySelector('.' + SELECTED)], SELECTED);
        }
        if (!multiSelection && !sf.base.isNullOrUndefined(tableBodyElement.querySelector('.' + FOCUSEDDATE))) {
            sf.base.removeClass([tableBodyElement.querySelector('.' + FOCUSEDDATE)], FOCUSEDDATE);
        }
        if (multiSelection) {
            var copyValues = this.copyValues(values);
            var collection = Array.prototype.slice.call(this.tableBodyElement.querySelectorAll('td'));
            for (var index = 0; index < collection.length; index++) {
                var tempElement = tableBodyElement.querySelectorAll('td' + '.' + FOCUSEDDATE)[0];
                var selectedElement = tableBodyElement.querySelectorAll('td' + '.' + SELECTED)[0];
                if (collection[index] === tempElement) {
                    sf.base.removeClass([collection[index]], FOCUSEDDATE);
                }
                if (collection[index] === selectedElement &&
                    !this.checkPresentDate(new Date(parseInt(selectedElement.getAttribute('id').split('_')[0], 10)), values)) {
                    sf.base.removeClass([collection[index]], SELECTED);
                }
            }
            if (element.classList.contains(SELECTED)) {
                sf.base.removeClass([element], SELECTED);
                for (var i = 0; i < copyValues.length; i++) {
                    var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                    var formatOptions = { format: this.getFromatStringValue(), type: 'date', skeleton: 'short', calendar: type };
                    var localDateString = this.globalize.formatDate(date, formatOptions);
                    var tempDateString = this.globalize.formatDate(copyValues[i], formatOptions);
                    if (localDateString === tempDateString) {
                        var index = copyValues.indexOf(copyValues[i]);
                        copyValues.splice(index, 1);
                        sf.base.addClass([element], FOCUSEDDATE);
                    }
                }
                this.setProperties({ values: copyValues }, true);
            }
            else {
                sf.base.addClass([element], SELECTED);
            }
        }
        else {
            sf.base.addClass([element], SELECTED);
        }
        this.isDateSelected = true;
    };
    CalendarBase.prototype.getFromatStringValue = function () {
        return sf.base.isBlazor() ?
            // tslint:disable-next-line
            'M' + sf.base.getDefaultDateObject().dateSeperator + 'd' + sf.base.getDefaultDateObject().dateSeperator + 'yy'
            : null;
    };
    CalendarBase.prototype.checkPresentDate = function (dates, values) {
        var previousValue = false;
        if (!sf.base.isNullOrUndefined(values)) {
            for (var checkPrevious = 0; checkPrevious < values.length; checkPrevious++) {
                var type = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                /* tslint:disable-next-line:max-line-length */
                var localDateString = this.globalize.formatDate(dates, {
                    format: this.getFromatStringValue(), type: 'date', skeleton: 'short', calendar: type
                });
                /* tslint:disable-next-line:max-line-length */
                var tempDateString = this.globalize.formatDate(values[checkPrevious], {
                    format: this.getFromatStringValue(), type: 'date', skeleton: 'short', calendar: type
                });
                if (localDateString === tempDateString) {
                    previousValue = true;
                }
            }
        }
        return previousValue;
    };
    CalendarBase.prototype.setAriaActiveDescendant = function () {
        sf.base.attributes(this.table, {
            'aria-activedescendant': '' + this.setActiveDescendant()
        });
    };
    CalendarBase.prototype.previousIconHandler = function (disabled) {
        if (disabled) {
            sf.base.EventHandler.remove(this.previousIcon, 'click', this.navigatePreviousHandler);
            sf.base.addClass([this.previousIcon], '' + DISABLED);
            sf.base.addClass([this.previousIcon], '' + OVERLAY);
            this.previousIcon.setAttribute('aria-disabled', 'true');
        }
        else {
            sf.base.EventHandler.add(this.previousIcon, 'click', this.navigatePreviousHandler);
            sf.base.removeClass([this.previousIcon], '' + DISABLED);
            sf.base.removeClass([this.previousIcon], '' + OVERLAY);
            this.previousIcon.setAttribute('aria-disabled', 'false');
        }
    };
    CalendarBase.prototype.renderDayCellEvent = function (args) {
        sf.base.extend(this.renderDayCellArgs, { name: 'renderDayCell' });
        this.trigger('renderDayCell', args);
    };
    CalendarBase.prototype.navigatedEvent = function (eve) {
        sf.base.extend(this.navigatedArgs, { name: 'navigated', event: eve });
        this.trigger('navigated', this.navigatedArgs);
    };
    CalendarBase.prototype.triggerNavigate = function (event) {
        this.navigatedArgs = { view: this.currentView(), date: this.currentDate };
        this.navigatedEvent(event);
    };
    CalendarBase.prototype.nextIconHandler = function (disabled) {
        if (disabled) {
            sf.base.EventHandler.remove(this.nextIcon, 'click', this.navigateNextHandler);
            sf.base.addClass([this.nextIcon], DISABLED);
            sf.base.addClass([this.nextIcon], OVERLAY);
            this.nextIcon.setAttribute('aria-disabled', 'true');
        }
        else {
            sf.base.EventHandler.add(this.nextIcon, 'click', this.navigateNextHandler);
            sf.base.removeClass([this.nextIcon], DISABLED);
            sf.base.removeClass([this.nextIcon], OVERLAY);
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
        if (!sf.base.isNullOrUndefined(this.tableBodyElement) && !sf.base.isNullOrUndefined(e)) {
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
        if ((!sf.base.isNullOrUndefined(value) && value.getMonth()) === (!sf.base.isNullOrUndefined(this.currentDate) && this.currentDate.getMonth())) {
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
        sf.base.Property(new Date(1900, 0, 1))
    ], CalendarBase.prototype, "min", void 0);
    __decorate([
        sf.base.Property(new Date(2099, 11, 31))
    ], CalendarBase.prototype, "max", void 0);
    __decorate([
        sf.base.Property(null)
    ], CalendarBase.prototype, "firstDayOfWeek", void 0);
    __decorate([
        sf.base.Property('Gregorian')
    ], CalendarBase.prototype, "calendarMode", void 0);
    __decorate([
        sf.base.Property('Month')
    ], CalendarBase.prototype, "start", void 0);
    __decorate([
        sf.base.Property('Month')
    ], CalendarBase.prototype, "depth", void 0);
    __decorate([
        sf.base.Property(false)
    ], CalendarBase.prototype, "weekNumber", void 0);
    __decorate([
        sf.base.Property(true)
    ], CalendarBase.prototype, "showTodayButton", void 0);
    __decorate([
        sf.base.Property('Short')
    ], CalendarBase.prototype, "dayHeaderFormat", void 0);
    __decorate([
        sf.base.Property(false)
    ], CalendarBase.prototype, "enablePersistence", void 0);
    __decorate([
        sf.base.Property(null)
    ], CalendarBase.prototype, "keyConfigs", void 0);
    __decorate([
        sf.base.Property(null)
    ], CalendarBase.prototype, "serverTimezoneOffset", void 0);
    __decorate([
        sf.base.Event()
    ], CalendarBase.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], CalendarBase.prototype, "destroyed", void 0);
    __decorate([
        sf.base.Event()
    ], CalendarBase.prototype, "navigated", void 0);
    __decorate([
        sf.base.Event()
    ], CalendarBase.prototype, "renderDayCell", void 0);
    CalendarBase = __decorate([
        sf.base.NotifyPropertyChanges
    ], CalendarBase);
    return CalendarBase;
}(sf.base.Component));
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
var Calendar = /** @class */ (function (_super) {
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
            sf.base.throwError('Requires the injectable Islamic modules to render Calendar in Islamic mode');
        }
        if (this.isMultiSelection && typeof this.values === 'object' && !sf.base.isNullOrUndefined(this.values) && this.values.length > 0) {
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
            var form = sf.base.closest(this.element, 'form');
            if (form) {
                sf.base.EventHandler.add(form, 'reset', this.formResetHandler.bind(this));
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
        if (!sf.base.isNullOrUndefined(this.serverTimezoneOffset) && this.value) {
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
        if (!sf.base.isNullOrUndefined(this.value) && this.min <= this.max && this.value >= this.min && this.value <= this.max) {
            this.currentDate = new Date(this.checkValue(this.value));
        }
        if (isNaN(+this.value)) {
            this.setProperties({ value: null }, true);
        }
    };
    Calendar.prototype.minMaxUpdate = function () {
        if (this.getModuleName() === 'calendar') {
            if (!sf.base.isNullOrUndefined(this.value) && this.value <= this.min && this.min <= this.max) {
                this.setProperties({ value: this.min }, true);
                this.changedArgs = { value: this.value };
            }
            else {
                if (!sf.base.isNullOrUndefined(this.value) && this.value >= this.max && this.min <= this.max) {
                    this.setProperties({ value: this.max }, true);
                    this.changedArgs = { value: this.value };
                }
            }
        }
        if (this.getModuleName() !== 'calendar' && !sf.base.isNullOrUndefined(this.value)) {
            if (!sf.base.isNullOrUndefined(this.value) && this.value < this.min && this.min <= this.max) {
                _super.prototype.minMaxUpdate.call(this, this.min);
            }
            else {
                if (!sf.base.isNullOrUndefined(this.value) && this.value > this.max && this.min <= this.max) {
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
    Calendar.prototype.todayButtonClick = function (e) {
        if (this.showTodayButton) {
            var tempValue = this.generateTodayVal(this.value);
            this.setProperties({ value: tempValue }, true);
            this.isTodayClicked = true;
            this.todayButtonEvent = e;
            if (this.isMultiSelection) {
                var copyValues = this.copyValues(this.values);
                if (!_super.prototype.checkPresentDate.call(this, tempValue, this.values)) {
                    copyValues.push(tempValue);
                    this.setProperties({ values: copyValues });
                }
            }
            _super.prototype.todayButtonClick.call(this, e, new Date(+this.value));
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
            !sf.base.isNullOrUndefined(this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0]) && storeView === 'Year') {
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
        this.rangeValidation(this.min, this.max);
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
            var form = sf.base.closest(this.element, 'form');
            if (form) {
                sf.base.EventHandler.remove(form, 'reset', this.formResetHandler.bind(this));
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
     * @deprecated
     */
    Calendar.prototype.addDate = function (dates) {
        if (typeof dates !== 'string' && typeof dates !== 'number') {
            var copyValues = this.copyValues(this.values);
            if (typeof dates === 'object' && (dates).length > 0) {
                var tempDates = dates;
                for (var i = 0; i < tempDates.length; i++) {
                    if (this.checkDateValue(tempDates[i]) && !_super.prototype.checkPresentDate.call(this, tempDates[i], copyValues)) {
                        if (!sf.base.isNullOrUndefined(copyValues) && copyValues.length > 0) {
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
                    if (!sf.base.isNullOrUndefined(copyValues) && copyValues.length > 0) {
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
     * @deprecated
     */
    Calendar.prototype.removeDate = function (dates) {
        if (typeof dates !== 'string' && typeof dates !== 'number' && !sf.base.isNullOrUndefined(this.values) && this.values.length > 0) {
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
        if (this.isMultiSelection && !sf.base.isNullOrUndefined(this.values) && this.values.length > 0) {
            this.setProperties({ value: this.values[this.values.length - 1] }, true);
        }
        this.changedArgs = { value: this.value, values: this.values };
        this.changeHandler(e);
    };
    Calendar.prototype.changeEvent = function (e) {
        if ((this.value && this.value.valueOf()) !== (this.previousDate && +this.previousDate.valueOf())
            || this.isMultiSelection) {
            this.trigger('change', this.changedArgs);
            this.previousDate = new Date(+this.value);
        }
    };
    Calendar.prototype.triggerChange = function (e) {
        if (!sf.base.isNullOrUndefined(this.todayButtonEvent) && this.isTodayClicked) {
            e = this.todayButtonEvent;
            this.isTodayClicked = false;
        }
        this.changedArgs.event = e || null;
        this.changedArgs.isInteracted = !sf.base.isNullOrUndefined(e);
        if (!sf.base.isNullOrUndefined(this.value)) {
            this.setProperties({ value: this.value }, true);
        }
        if (!this.isMultiSelection && +this.value !== Number.NaN && (+this.value !== +this.previousDate || this.previousDate == null
            && !isNaN(+this.value))) {
            this.changeEvent(e);
        }
        else if (!sf.base.isNullOrUndefined(this.values) && this.previousValues !== this.values.length) {
            this.changeEvent(e);
            this.previousValues = this.values.length;
        }
    };
    __decorate([
        sf.base.Property(null)
    ], Calendar.prototype, "value", void 0);
    __decorate([
        sf.base.Property(null)
    ], Calendar.prototype, "values", void 0);
    __decorate([
        sf.base.Property(false)
    ], Calendar.prototype, "isMultiSelection", void 0);
    __decorate([
        sf.base.Event()
    ], Calendar.prototype, "change", void 0);
    Calendar = __decorate([
        sf.base.NotifyPropertyChanges
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
var Islamic = /** @class */ (function () {
    function Islamic(instance) {
        this.calendarInstance = instance;
    }
    Islamic.prototype.getModuleName = function () {
        return 'islamic';
    };
    Islamic.prototype.islamicTitleUpdate = function (date, view) {
        var globalize = new sf.base.Internationalization(this.calendarInstance.locale);
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
                sf.base.addClass([weekEle], '' + WEEKNUMBER$1);
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
                sf.base.addClass([tdEle], DISABLED$1);
                sf.base.addClass([tdEle], OVERLAY$1);
            }
            else {
                dayLink.setAttribute('title', '' + title);
            }
            /* tslint:disable-next-line:no-any */
            var hijriMonthObject = this.getIslamicDate(localDate);
            if (currentMonth !== hijriMonthObject.month) {
                sf.base.addClass([tdEle], OTHERMONTH$1);
            }
            if (localDate.getDay() === 0 || localDate.getDay() === 6) {
                sf.base.addClass([tdEle], WEEKEND$1);
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
                    if (!sf.base.isNullOrUndefined(this.calendarInstance.values) && this.calendarInstance.values.length > 0) {
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
                sf.base.addClass([tdEle], DISABLED$1);
                sf.base.addClass([tdEle], OVERLAY$1);
                if (+this.calendarInstance.renderDayCellArgs.date === +this.calendarInstance.todayDate) {
                    this.calendarInstance.todayDisabled = true;
                }
            }
            var otherMnthBool = tdEle.classList.contains(OTHERMONTH$1);
            var disabledCls = tdEle.classList.contains(DISABLED$1);
            if (!disabledCls) {
                sf.base.EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
            }
            if (this.calendarInstance.isMultiSelection && !sf.base.isNullOrUndefined(this.calendarInstance.values) &&
                !otherMnthBool && !disabledCls) {
                for (var tempValue = 0; tempValue < this.calendarInstance.values.length; tempValue++) {
                    /* tslint:disable-next-line:max-line-length */
                    var localDateString = this.calendarInstance.globalize.formatDate(localDate, { type: 'date', skeleton: 'short', calendar: 'islamic' });
                    var tempDateString = this.calendarInstance.globalize.formatDate(this.calendarInstance.values[tempValue], { type: 'date', skeleton: 'short', calendar: 'islamic' });
                    if (localDateString === tempDateString &&
                        this.calendarInstance.getDateVal(localDate, this.calendarInstance.values[tempValue])) {
                        sf.base.addClass([tdEle], SELECTED$1);
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
                sf.base.addClass([tdEle], SELECTED$1);
            }
            else {
                this.calendarInstance.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
            }
            if (date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
                if (date.getFullYear() === new Date().getFullYear()) {
                    sf.base.addClass([tdEle], TODAY$1);
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
        var valueUtil = sf.base.isNullOrUndefined(value);
        var curDate = new Date(this.islamicInValue(this.calendarInstance.currentDate));
        var localDate = curDate;
        /* tslint:disable-next-line:no-any */
        var islamicDate = this.getIslamicDate(localDate);
        var gregorianObject = sf.base.HijriParser.toGregorian(islamicDate.year, 1, 1);
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
            var gregorianObject_1 = sf.base.HijriParser.toGregorian(islamicDate_1.year, month, 1);
            localDate = gregorianObject_1;
            var tdEle = this.islamicDayCell(localDate);
            var dayLink = this.calendarInstance.createElement('span');
            /* tslint:disable-next-line:max-line-length */
            /* tslint:disable-next-line:no-any */
            var localMonth = (value && (this.getIslamicDate(value)).month === (this.getIslamicDate(localDate)).month);
            /* tslint:disable-next-line:no-any  tslint:disable-next-line:max-line-length */
            var select = (value && (this.getIslamicDate(value)).year === yr && localMonth);
            /* tslint:disable-next-line:max-line-length */
            dayLink.textContent = this.calendarInstance.globalize.formatDate(localDate, { type: 'dateTime', format: 'MMM', calendar: 'islamic' });
            if ((this.calendarInstance.min && (curYrs < minYr || (month < minMonth && curYrs === minYr))) || (this.calendarInstance.max && (curYrs > maxYr || (month > maxMonth && curYrs >= maxYr)))) {
                sf.base.addClass([tdEle], DISABLED$1);
            }
            else if (!valueUtil && select) {
                sf.base.addClass([tdEle], SELECTED$1);
            }
            else {
                /* tslint:disable-next-line:no-any */
                if ((this.getIslamicDate(localDate)).month === mon &&
                    /* tslint:disable-next-line:no-any */
                    (this.getIslamicDate(this.calendarInstance.currentDate)).month === mon) {
                    sf.base.addClass([tdEle], FOCUSEDDATE$1);
                }
            }
            if (!tdEle.classList.contains(DISABLED$1)) {
                sf.base.EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
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
        var gregorianObject = sf.base.HijriParser.toGregorian(islamicDate.year, 1, 1);
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
            var gregorianObject_2 = sf.base.HijriParser.toGregorian(islamicDate_2.year, 1, 1);
            localDate = gregorianObject_2;
            var tdEle = this.islamicDayCell(localDate);
            sf.base.attributes(tdEle, { 'role': 'gridcell' });
            var dayLink = this.calendarInstance.createElement('span');
            /* tslint:disable-next-line:max-line-length */
            dayLink.textContent = this.calendarInstance.globalize.formatDate(localDate, { type: 'dateTime', format: 'y', calendar: 'islamic' });
            /* tslint:disable-next-line:no-any */
            if ((year < startFullYr) || (year > endFullYr)) {
                sf.base.addClass([tdEle], OTHERMONTH$1);
            }
            else if (year < new Date(this.islamicInValue(this.calendarInstance.min)).getFullYear()
                || year > new Date(this.islamicInValue(this.calendarInstance.max)).getFullYear()) {
                sf.base.addClass([tdEle], DISABLED$1);
            }
            else if (!sf.base.isNullOrUndefined(value) &&
                /* tslint:disable-next-line:no-any */
                (this.getIslamicDate(localDate)).year ===
                    /* tslint:disable-next-line:no-any */
                    (this.getIslamicDate(value)).year) {
                sf.base.addClass([tdEle], SELECTED$1);
            }
            else {
                if (localDate.getFullYear() === this.calendarInstance.currentDate.getFullYear() && !tdEle.classList.contains(DISABLED$1)) {
                    sf.base.addClass([tdEle], FOCUSEDDATE$1);
                }
            }
            if (!tdEle.classList.contains(DISABLED$1)) {
                sf.base.EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
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
            className: CELL$1, attrs: { 'id': '' + sf.base.getUniqueID('' + value), 'aria-selected': 'false', 'role': 'gridcell' }
        };
        return this.calendarInstance.createElement('td', attrs);
    };
    Islamic.prototype.islamicRenderTemplate = function (elements, count, classNm, e, value) {
        var view = this.calendarInstance.getViewNumber(this.calendarInstance.currentView());
        var trEle;
        this.calendarInstance.tableBodyElement = this.calendarInstance.createElement('tbody');
        this.calendarInstance.table.appendChild(this.calendarInstance.tableBodyElement);
        sf.base.removeClass([this.calendarInstance.contentElement, this.calendarInstance.headerElement], [MONTH$1, DECADE$1, YEAR$1]);
        sf.base.addClass([this.calendarInstance.contentElement, this.calendarInstance.headerElement], [classNm]);
        var weekNumCell = 41;
        var numberCell = 35;
        var otherMonthCell = 6;
        var row = count;
        var rowCount = 0;
        for (var dayCell = 0; dayCell < elements.length / count; ++dayCell) {
            trEle = this.calendarInstance.createElement('tr', { attrs: { 'role': 'row' } });
            for (rowCount = 0 + rowCount; rowCount < row; rowCount++) {
                if (!elements[rowCount].classList.contains('e-week-number') && !sf.base.isNullOrUndefined(elements[rowCount].children[0])) {
                    sf.base.addClass([elements[rowCount].children[0]], [LINK$1]);
                    sf.base.rippleEffect(elements[rowCount].children[0], {
                        duration: 600,
                        isCenterRipple: true
                    });
                }
                trEle.appendChild(elements[rowCount]);
                if (this.calendarInstance.weekNumber &&
                    rowCount === otherMonthCell + 1 && elements[otherMonthCell + 1].classList.contains(OTHERMONTH$1)) {
                    sf.base.addClass([trEle], OTHERMONTHROW$1);
                }
                if (!this.calendarInstance.weekNumber
                    && rowCount === otherMonthCell && elements[otherMonthCell].classList.contains(OTHERMONTH$1)) {
                    sf.base.addClass([trEle], OTHERMONTHROW$1);
                }
                if (this.calendarInstance.weekNumber) {
                    if (rowCount === weekNumCell && elements[weekNumCell].classList.contains(OTHERMONTH$1)) {
                        sf.base.addClass([trEle], OTHERMONTHROW$1);
                    }
                }
                else {
                    if (rowCount === numberCell && elements[numberCell].classList.contains(OTHERMONTH$1)) {
                        sf.base.addClass([trEle], OTHERMONTHROW$1);
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
        return (sf.base.HijriParser.getHijriDate(date));
    };
    Islamic.prototype.toGregorian = function (year, month, date) {
        return sf.base.HijriParser.toGregorian(year, month, date);
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

Calendar.Inject(Islamic);

exports.CalendarBase = CalendarBase;
exports.Calendar = Calendar;
exports.Islamic = Islamic;

return exports;

});

    sf.calendars = sf.base.extend({}, sf.calendars, sfcalendar({}));