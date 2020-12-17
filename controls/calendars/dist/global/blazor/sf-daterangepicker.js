window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.DateRangePicker = (function () {
'use strict';

var POPUPDIMENSION = '240px';
var HALFPOSITION = 2;
var POPUP = 'e-popup';
var OVERFLOW = 'e-range-overflow';
var FOOTER_CONTAINER = 'e-footer-container';
var INPUT_HANDLER = 'InputKeyActionHandle';
var LEFTCALENDER = 'e-left-calendar';
var RIGHTCALENDER = 'e-right-calendar';
var CALENDAR = 'e-calendar';
var NEXTICON = 'e-next';
var PREVICON = 'e-prev';
var HEADER = 'e-header';
var TITLE = 'e-title';
var ICONCONTAINER = 'e-icon-container';
var TBODY = 'tbody';
var TABLE = 'table';
var HIDE_POPUP = 'HidePopup';
var CLOSE_POPUP = 'ClosePopup';
var MOUSE_TOUCH_EVENT = 'mousedown touchstart';
var SELECTED = 'e-selected';
var OFFSETVALUE = 4;
var INPUTCONTAINER = 'e-input-group';
var INPUTFOCUS = 'e-input-focus';
var FOCUS_DATE = 'e-focused-date';
var RANGECONTAINER = 'e-date-range-container';
var PRESETS = 'e-presets';
var SfDateRangePicker = /** @class */ (function () {
    function SfDateRangePicker(containerElement, element, dotnetRef, options) {
        this.containerElement = containerElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    // tslint:disable
    SfDateRangePicker.prototype.initialize = function () {
        this.isMobile = window.matchMedia('(max-width:550px)').matches;
        this.defaultKeyConfigs = {
            altUpArrow: 'alt+uparrow',
            altDownArrow: 'alt+downarrow',
            altRightArrow: 'alt+rightarrow',
            altLeftArrow: 'alt+leftarrow',
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
            shiftTab: 'shift+tab'
        };
        new sf.base.KeyboardEvents(this.element, { eventName: 'keydown', keyAction: this.keyInputHandler.bind(this), keyConfigs: this.defaultKeyConfigs });
    };
    SfDateRangePicker.prototype.keyInputHandler = function (e) {
        var keyEventsArgs;
        if (this.popupObj && this.popupObj.element.classList.contains(POPUP)) {
            var ele = sf.base.closest(e.target, '.' + RIGHTCALENDER);
            ele = sf.base.isNullOrUndefined(ele) ? this.tableElement.querySelector('.' + LEFTCALENDER) : ele;
            var isLeftCalendar = ele.classList.contains(LEFTCALENDER);
            var focusedDate = this.tableElement.querySelector('tr td.' + FOCUS_DATE);
            var selectedDates = this.tableElement.querySelectorAll('tr td.' + SELECTED);
            var selectedDate = selectedDates[selectedDates.length - 1];
            var tableBodyEle = focusedDate && sf.base.closest(focusedDate, TBODY) || selectedDate && sf.base.closest(selectedDate, TBODY);
            if (!isLeftCalendar && this.leftCalendar.querySelectorAll('tr td.' + FOCUS_DATE).length > 0) {
                sf.base.removeClass(this.leftCalendar.querySelectorAll('tr td.' + FOCUS_DATE), FOCUS_DATE);
            }
            tableBodyEle && tableBodyEle.focus();
            keyEventsArgs = {
                Action: e.action,
                Key: e.key,
                Events: e,
                SelectDate: selectedDate ? selectedDate.id : null,
                FocusedDate: focusedDate ? focusedDate.id : null,
                classList: selectedDate ? selectedDate.classList.toString() :
                    focusedDate ? focusedDate.classList.toString() : 'e-cell',
                Id: focusedDate ? focusedDate.id : selectedDate ? selectedDate.id : null,
                TargetClassList: this.calendarElement.classList.toString(),
                IsLeftCalendar: isLeftCalendar
            };
        }
        else {
            keyEventsArgs = {
                Action: e.action,
                Key: e.key,
                Events: e
            };
        }
        if (!this.isDisposed) {
            this.dotNetRef.invokeMethodAsync(INPUT_HANDLER, keyEventsArgs);
        }
        if (e.action !== 'select' && this.popupObj && document.body.contains(this.popupObj.element)) {
            e.preventDefault();
        }
    };
    SfDateRangePicker.prototype.renderPopup = function (popupElement, popupHolderEle, openEventArgs, options) {
        this.options = options;
        this.popupHolder = popupHolderEle;
        this.createCalendar(popupElement, options);
        if (sf.base.Browser.isDevice) {
            this.mobilePopupContainer = this.popupHolder.querySelector('.e-daterangepick-mob-popup-wrap');
            document.body.appendChild(this.mobilePopupContainer);
        }
        var appendToElement = openEventArgs.appendTo === 'model' && this.mobilePopupContainer ? this.mobilePopupContainer
            : document.body;
        appendToElement.appendChild(this.popupContainer);
        this.presetHeight();
        if (this.options.zIndex === 1000) {
            this.popupObj.show(null, this.element);
        }
        else {
            this.popupObj.show(null, null);
        }
        this.setOverlayIndex(this.mobilePopupContainer, this.popupObj.element, this.modal, sf.base.Browser.isDevice);
        if (sf.base.Browser.isDevice) {
            document.body.className += ' ' + OVERFLOW;
            this.popupHolder.style.display = 'block';
            this.popupHolder.style.visibility = 'visible';
        }
        sf.base.EventHandler.add(document, MOUSE_TOUCH_EVENT, this.documentHandler, this);
    };
    SfDateRangePicker.prototype.setOverlayIndex = function (popupContainer, popupElement, modal, isDevice) {
        if (isDevice && !sf.base.isNullOrUndefined(popupElement) && !sf.base.isNullOrUndefined(modal) && !sf.base.isNullOrUndefined(popupContainer)) {
            var index = parseInt(popupElement.style.zIndex, 10) ? parseInt(popupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupContainer.style.zIndex = index.toString();
        }
    };
    SfDateRangePicker.prototype.closePopup = function (closeEventArgs, options) {
        this.options = options;
        this.closeEventCallback(closeEventArgs);
    };
    SfDateRangePicker.prototype.refreshPopup = function () {
        if (this.isPopupOpen()) {
            this.popupObj.refreshPosition();
        }
    };
    SfDateRangePicker.prototype.createCalendar = function (popupElement, options) {
        var _this = this;
        this.popupContainer = popupElement;
        if (options.isCustomWindow) {
            this.calendarElement = this.popupContainer.firstElementChild;
            this.tableElement = this.calendarElement;
            this.calendarElement.querySelector(TABLE + ' ' + TBODY).className = '';
        }
        var popupWidth = this.popupContainer.getBoundingClientRect().width;
        if (sf.base.Browser.isDevice) {
            this.modal = this.popupHolder.querySelector('.e-range-modal');
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        if (options.isCustomWindow) {
            if (sf.base.Browser.isDevice) {
                this.deviceCalPrevIcon = this.calendarElement.querySelector('.' + CALENDAR + ' .' + PREVICON);
                this.deviceCalNextIcon = this.calendarElement.querySelector('.' + CALENDAR + ' .' + NEXTICON);
                if (this.calendarElement.querySelector('.' + CALENDAR + ' .' + ICONCONTAINER)) {
                    sf.base.remove(this.calendarElement.querySelector('.' + CALENDAR + ' .' + ICONCONTAINER));
                }
                this.calendarElement.querySelector('table').setAttribute('tabindex', '-1');
                this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER).appendChild(this.deviceCalNextIcon);
                this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER).appendChild(this.deviceCalPrevIcon);
                sf.base.prepend([this.deviceCalPrevIcon], this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER));
                if (this.calendarElement.querySelector('.' + CALENDAR + ' .' + FOOTER_CONTAINER)) {
                    sf.base.remove(this.calendarElement.querySelector('.' + CALENDAR + ' .' + FOOTER_CONTAINER));
                }
            }
            else {
                this.leftCalPrevIcon = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + PREVICON);
                this.leftCalNextIcon = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + NEXTICON);
                this.leftTitle = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + TITLE);
                if (this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + ICONCONTAINER)) {
                    sf.base.remove(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + ICONCONTAINER));
                }
                this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER).appendChild(this.leftCalNextIcon);
                this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER).appendChild(this.leftCalPrevIcon);
                sf.base.prepend([this.leftCalPrevIcon], this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER));
                this.rightCalPrevIcon = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + PREVICON);
                this.rightCalNextIcon = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + NEXTICON);
                this.rightTitle = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + TITLE);
                if (this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + ICONCONTAINER)) {
                    sf.base.remove(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + ICONCONTAINER));
                }
                this.calendarElement.querySelector('table').setAttribute('tabindex', '-1');
                this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER).appendChild(this.rightCalNextIcon);
                this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER).appendChild(this.rightCalPrevIcon);
                sf.base.prepend([this.rightCalPrevIcon], this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER));
                if (this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + FOOTER_CONTAINER)) {
                    sf.base.remove(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + FOOTER_CONTAINER));
                }
                if (this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + FOOTER_CONTAINER)) {
                    sf.base.remove(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + FOOTER_CONTAINER));
                }
            }
        }
        this.popupObj = new sf.popups.Popup(this.popupContainer, {
            relateTo: this.isMobile ? document.body : this.containerElement,
            position: (this.isMobile ?
                (!sf.base.isUndefined(options.presets && options.presets[0] && options.presets[0].start && options.presets[0].end && options.presets[0].label) ?
                    { X: 'left', Y: 'bottom' } : { X: 'center', Y: 'center' }) :
                options.enableRtl ? { X: 'left', Y: 'bottom' } : { X: 'right', Y: 'bottom' }),
            offsetX: this.isMobile || options.enableRtl ? 0 : -popupWidth,
            offsetY: OFFSETVALUE,
            collision: this.isMobile ?
                (!sf.base.isUndefined(options.presets && options.presets[0] && options.presets[0].start && options.presets[0].end && options.presets[0].label) ?
                    { X: 'fit' } : { X: 'fit', Y: 'fit' }) : { X: 'fit', Y: 'flip' },
            targetType: this.isMobile ? 'container' : 'relative',
            enableRtl: options.enableRtl,
            zIndex: options.zIndex,
            open: function () {
                _this.leftCalendar = _this.calendarElement.querySelector('.' + LEFTCALENDER);
                _this.rightCalendar = _this.calendarElement.querySelector('.' + RIGHTCALENDER);
                if (!_this.isMobile) {
                    //this.defaultKeyConfigs = sf.base.extend(this.defaultKeyConfigs, this.keyConfigs);
                    new sf.base.KeyboardEvents(_this.leftCalendar, {
                        eventName: 'keydown',
                        keyAction: _this.keyInputHandler.bind(_this),
                        keyConfigs: _this.defaultKeyConfigs
                    });
                    new sf.base.KeyboardEvents(_this.rightCalendar, {
                        eventName: 'keydown',
                        keyAction: _this.keyInputHandler.bind(_this),
                        keyConfigs: _this.defaultKeyConfigs
                    });
                    var cancelBtnEle = _this.popupContainer.querySelector('.e-cancel.e-btn');
                    var applyBtnEle = _this.popupContainer.querySelector('.e-apply.e-btn');
                    new sf.base.KeyboardEvents(cancelBtnEle, {
                        eventName: 'keydown',
                        keyAction: _this.keyInputHandler.bind(_this),
                        keyConfigs: { tab: 'tab', altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                    });
                    new sf.base.KeyboardEvents(applyBtnEle, {
                        eventName: 'keydown',
                        keyAction: _this.keyInputHandler.bind(_this),
                        keyConfigs: { altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                    });
                    _this.leftCalendar.querySelector('table').focus();
                }
            }, close: function () {
                _this.popupHolder.appendChild(_this.popupContainer);
                if (_this.popupObj) {
                    _this.popupObj.destroy();
                }
                if (!_this.isDisposed) {
                    _this.dotNetRef.invokeMethodAsync(CLOSE_POPUP);
                }
                _this.popupObj = null;
            }, targetExitViewport: function () {
                if (!sf.base.Browser.isDevice && !_this.isDisposed) {
                    _this.dotNetRef.invokeMethodAsync(HIDE_POPUP, null);
                }
            }
        });
    };
    SfDateRangePicker.prototype.closeEventCallback = function (eventArgs) {
        var preventArgs = eventArgs;
        if (!preventArgs.cancel && this.popupObj) {
            this.popupObj.hide();
        }
        if (sf.base.Browser.isDevice && this.modal) {
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
        if (sf.base.Browser.isDevice) {
            sf.base.removeClass([document.body], OVERFLOW);
            if (!sf.base.isNullOrUndefined(this.mobilePopupContainer)) {
                this.mobilePopupContainer.remove();
                this.mobilePopupContainer = null;
            }
        }
        sf.base.EventHandler.remove(document, MOUSE_TOUCH_EVENT, this.documentHandler);
    };
    SfDateRangePicker.prototype.documentHandler = function (e) {
        if (sf.base.isNullOrUndefined(this.popupObj)) {
            return;
        }
        var target = e.target;
        if (!this.containerElement.contains(target) ||
            (!sf.base.isNullOrUndefined(this.popupObj) && !sf.base.closest(target, '.e-daterangepicker.e-popup'))) {
            if (e.type !== 'touchstart' && e.type === 'mousedown') {
                e.preventDefault();
            }
        }
        if (!(sf.base.closest(target, '.e-daterangepicker.e-popup'))
            && !(sf.base.closest(target, '.' + INPUTCONTAINER) === this.containerElement)
            && !(sf.base.closest(target, '.e-daterangepicker.e-popup') && (!target.classList.contains('e-day')))) {
            if (this.isPopupOpen() && document.body.contains(this.popupObj.element)) {
                this.applyFunction(e);
            }
        }
    };
    SfDateRangePicker.prototype.applyFunction = function (eve) {
        var isValueChanged = false;
        if (eve.type !== 'touchstart') {
            eve.preventDefault();
        }
        if (document.activeElement !== this.element) {
            this.element.focus();
            sf.base.addClass([this.containerElement], [INPUTFOCUS]);
        }
        this.dotNetRef.invokeMethodAsync(HIDE_POPUP, null);
        if (!(sf.base.closest(eve.target, '.' + INPUTCONTAINER))
            && (!isValueChanged)) {
            if (document.activeElement === this.element) {
                sf.base.removeClass([this.containerElement], [INPUTFOCUS]);
                this.element.blur();
            }
        }
    };
    SfDateRangePicker.prototype.presetHeight = function () {
        var presets = this.popupObj && this.popupObj.element.querySelector('.' + PRESETS);
        var rangeContainer = this.popupObj && this.popupObj.element.querySelector('.' + RANGECONTAINER);
        if (!sf.base.isNullOrUndefined(presets) && !sf.base.isNullOrUndefined(rangeContainer)) {
            presets.style.height = rangeContainer.getBoundingClientRect().height + 'px';
        }
    };
    SfDateRangePicker.prototype.getPopupHeight = function () {
        var height = parseInt(POPUPDIMENSION, 10);
        var popupHeight = this.popupContainer.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    };
    SfDateRangePicker.prototype.setScrollPosition = function () {
        if (!sf.base.isNullOrUndefined(this.popupContainer.querySelector('.e-active')) && (this.options.presets)) {
            var selectElement = this.popupContainer.querySelector('.e-active');
            this.findScrollTop(selectElement);
        }
    };
    SfDateRangePicker.prototype.findScrollTop = function (element) {
        var listHeight = this.getPopupHeight();
        var nextEle = element.nextElementSibling;
        var height = nextEle ? nextEle.offsetTop : element.offsetTop;
        var liHeight = element.getBoundingClientRect().height;
        if ((height + element.offsetTop) > listHeight) {
            this.popupContainer.scrollTop = nextEle ? (height - (listHeight / HALFPOSITION + liHeight / HALFPOSITION)) : height;
        }
        else {
            this.popupContainer.scrollTop = 0;
        }
    };
    SfDateRangePicker.prototype.isPopupOpen = function () {
        if (!sf.base.isNullOrUndefined(this.popupObj) && this.popupObj.element.classList.contains(POPUP)) {
            return true;
        }
        return false;
    };
    SfDateRangePicker.prototype.removeFocusDate = function (popupElement, cellId) {
        var focusedDates = popupElement.querySelectorAll('tr td.e-focused-date');
        if (focusedDates.length > 0) {
            sf.base.removeClass(focusedDates, FOCUS_DATE);
        }
        var focusedDate = popupElement.querySelectorAll('tr td');
        for (var i = 0; i < focusedDate.length; i++) {
            if (focusedDate[i].getAttribute('id').split('_')[0] == cellId) {
                sf.base.removeClass(focusedDate, FOCUS_DATE);
                sf.base.addClass([focusedDate[i]], FOCUS_DATE);
                sf.base.closest(focusedDate[i], 'table').focus();
            }
        }
    };
    return SfDateRangePicker;
}());
// tslint:disable
var DateRangePicker = {
    initialize: function (containerElement, element, dotnetRef, options) {
        if (element) {
            new SfDateRangePicker(containerElement, element, dotnetRef, options);
        }
        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
        }
    },
    renderPopup: function (element, popupElement, popupHolderEle, openEventArgs, options) {
        if (element && element.blazor__instance && popupElement && popupHolderEle) {
            element.blazor__instance.renderPopup(popupElement, popupHolderEle, openEventArgs, options);
        }
    },
    updateScrollPosition: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.setScrollPosition();
        }
    },
    removeFocusDate: function (element, popupElement, cellId) {
        if (element && element.blazor__instance && popupElement) {
            element.blazor__instance.removeFocusDate(popupElement, cellId);
        }
    },
    // tslint:disable
    closePopup: function (element, popupElement, popupHolderEle, closeEventArgs, options) {
        if (element && element.blazor__instance) {
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
    refreshPopup: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.refreshPopup();
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
    destroy: function (element, popupElement, popupHolderEle, closeEventArgs, options) {
        if (element && element.blazor__instance && popupElement && popupElement instanceof HTMLElement && popupHolderEle) {
            element.blazor__instance.isDisposed = true;
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    }
};

return DateRangePicker;

}());
