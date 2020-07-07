window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.DatePicker = (function () {
'use strict';

var ROOT = 'e-datepicker';
var POPUPWRAPPER = 'e-popup-wrapper';
var POPUP = 'e-popup';
var OVERFLOW = 'e-date-overflow';
var CONENT = 'e-content';
var FOOTER_CONTAINER = 'e-footer-container';
var INPUT_HANDLER = 'InputKeyActionHandle';
var TBODY = 'tbody';
var TABLE = 'table';
var HIDE_POPUP = 'HidePopup';
var CLOSE_POPUP = 'ClosePopup';
var SHOW_POPUP = 'ShowPopup';
var MOUSE_TOUCH_EVENT = 'mousedown touchstart';
var SELECTED = 'e-selected';
var DAY = 'e-day';
var TODAY = 'e-today';
var BTN = 'e-btn';
var OFFSETVALUE = 4;
var OPENDURATION = 300;
var INPUTCONTAINER = 'e-input-group';
var SfDatePicker = /** @class */ (function () {
    function SfDatePicker(wrapperElement, element, dotnetRef, options) {
        this.wrapperElement = wrapperElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    SfDatePicker.prototype.initialize = function () {
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
        this.defaultKeyConfigs = sf.base.extend(this.defaultKeyConfigs, this.options.keyConfigs);
        new sf.base.KeyboardEvents(this.element, {
            eventName: 'keydown',
            keyAction: this.inputKeyActionHandle.bind(this),
            keyConfigs: this.defaultKeyConfigs
        });
        this.index = this.options.showClearButton ? 2 : 1;
        sf.base.EventHandler.add(this.element, 'blur', this.inputBlurHandler, this);
    };
    SfDatePicker.prototype.inputKeyActionHandle = function (e) {
        var keyEventsArgs;
        if (this.popupObj && this.popupObj.element.classList.contains(POPUP)) {
            var focusedDate = this.tableBodyElement.querySelector('tr td.e-focused-date');
            var selectedDate = this.tableBodyElement.querySelector('tr td.' + SELECTED);
            this.tableBodyElement.focus();
            keyEventsArgs = {
                Action: e.action, Key: e.key, Events: e, SelectDate: selectedDate ? selectedDate.id : null,
                FocusedDate: focusedDate ? focusedDate.id : null,
                classList: selectedDate ? selectedDate.classList.toString() : focusedDate ? focusedDate.classList.toString() : 'e-cell',
                Id: focusedDate ? focusedDate.id : selectedDate ? selectedDate.id : null,
                TargetClassList: this.calendarElement.classList.toString()
            };
        }
        else {
            keyEventsArgs = {
                Action: e.action, Key: e.key, Events: e
            };
        }
        this.dotNetRef.invokeMethodAsync(INPUT_HANDLER, keyEventsArgs);
    };
    SfDatePicker.prototype.inputBlurHandler = function (e) {
        if (this.isCalendar() && document.activeElement === this.element) {
            this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
        }
    };
    // tslint:disable
    SfDatePicker.prototype.renderPopup = function (popupElement, popupHolderEle, openEventArgs, options) {
        this.options = options;
        this.popupHolder = popupHolderEle;
        this.createCalendar(popupElement, options);
        if (sf.base.Browser.isDevice) {
            this.mobilePopupWrapper = sf.base.createElement('div', { className: 'e-datepick-mob-popup-wrap' });
            document.body.appendChild(this.mobilePopupWrapper);
        }
        var appendToElement = openEventArgs.appendTo === 'model' ? this.mobilePopupWrapper : document.body;
        appendToElement.appendChild(this.popupWrapper);
        this.popupObj.refreshPosition(this.element);
        var openAnimation = {
            name: 'FadeIn',
            duration: sf.base.Browser.isDevice ? 0 : OPENDURATION,
        };
        if (this.options.zIndex === 1000) {
            this.popupObj.show(new sf.base.Animation(openAnimation), this.element);
        }
        else {
            this.popupObj.show(new sf.base.Animation(openAnimation), null);
        }
        this.setOverlayIndex(this.mobilePopupWrapper, this.popupObj.element, this.modal, sf.base.Browser.isDevice);
        sf.base.EventHandler.add(document, MOUSE_TOUCH_EVENT, this.documentHandler, this);
    };
    SfDatePicker.prototype.setOverlayIndex = function (popupWrapper, popupElement, modal, isDevice) {
        if (isDevice && !sf.base.isNullOrUndefined(popupElement) && !sf.base.isNullOrUndefined(modal) && !sf.base.isNullOrUndefined(popupWrapper)) {
            var index = parseInt(popupElement.style.zIndex, 10) ? parseInt(popupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupWrapper.style.zIndex = index.toString();
        }
    };
    SfDatePicker.prototype.closePopup = function (closeEventArgs, options) {
        this.options = options;
        this.closeEventCallback(closeEventArgs);
    };
    SfDatePicker.prototype.createCalendar = function (popupElement, options) {
        var _this = this;
        this.popupWrapper = popupElement;
        this.calendarElement = this.popupWrapper.firstElementChild;
        this.tableBodyElement = sf.base.select(TBODY, this.calendarElement);
        this.contentElement = sf.base.select('.' + CONENT, this.calendarElement);
        if (sf.base.Browser.isDevice) {
            this.modal = sf.base.createElement('div');
            this.modal.className = '' + ROOT + ' e-date-modal';
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        this.calendarElement.querySelector(TABLE + ' ' + TBODY).className = '';
        this.popupObj = new sf.popups.Popup(this.popupWrapper, {
            content: this.calendarElement,
            relateTo: sf.base.Browser.isDevice ? document.body : this.wrapperElement,
            position: sf.base.Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            offsetY: OFFSETVALUE,
            targetType: 'container',
            enableRtl: options.enableRtl,
            zIndex: options.zIndex,
            collision: sf.base.Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            open: function () {
                if (document.activeElement !== _this.element) {
                    _this.defaultKeyConfigs = sf.base.extend(_this.defaultKeyConfigs, options.keyConfigs);
                    _this.calendarElement.children[1].firstElementChild.focus();
                    new sf.base.KeyboardEvents(_this.calendarElement.children[1].firstElementChild, {
                        eventName: 'keydown',
                        keyAction: _this.CalendarKeyActionHandle.bind(_this),
                        keyConfigs: _this.defaultKeyConfigs
                    });
                    new sf.base.KeyboardEvents(_this.wrapperElement.children[_this.index], {
                        eventName: 'keydown',
                        keyAction: _this.CalendarKeyActionHandle.bind(_this),
                        keyConfigs: _this.defaultKeyConfigs
                    });
                }
            }, close: function () {
                _this.popupHolder.appendChild(_this.popupWrapper);
                if (_this.popupObj) {
                    _this.popupObj.destroy();
                }
                _this.dotNetRef.invokeMethodAsync(CLOSE_POPUP);
                _this.popupObj = null;
            }, targetExitViewport: function () {
                if (!sf.base.Browser.isDevice) {
                    _this.dotNetRef.invokeMethodAsync(HIDE_POPUP, null);
                }
            }
        });
    };
    SfDatePicker.prototype.closeEventCallback = function (eventArgs) {
        var preventArgs = eventArgs;
        if (this.isCalendar() && !preventArgs.cancel && this.popupObj) {
            this.popupObj.hide();
        }
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
        sf.base.EventHandler.remove(document, MOUSE_TOUCH_EVENT, this.documentHandler);
        if (sf.base.Browser.isDevice && this.options.allowEdit && !this.options.readonly) {
            this.element.removeAttribute('readonly');
        }
    };
    SfDatePicker.prototype.documentHandler = function (e) {
        if ((!sf.base.isNullOrUndefined(this.popupObj) && (this.wrapperElement.contains(e.target) ||
            (this.popupObj.element && this.popupObj.element.contains(e.target)))) && e.type !== 'touchstart') {
            e.preventDefault();
        }
        var dateValue = this.options.value ? this.options.value.toString() : null;
        var target = e.target;
        if (!(sf.base.closest(target, '.' + ROOT + '.' + POPUPWRAPPER))
            && !(sf.base.closest(target, '.' + INPUTCONTAINER) === this.wrapperElement)
            && (!target.classList.contains(DAY))) {
            this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
            this.element.focus();
        }
        else if (sf.base.closest(target, '.' + ROOT + '.' + POPUPWRAPPER)) {
            if (target.classList.contains(DAY)
                && !sf.base.isNullOrUndefined(e.target.parentElement)
                && e.target.parentElement.classList.contains(SELECTED)
                && sf.base.closest(target, '.' + CONENT)
                && sf.base.closest(target, '.' + CONENT).classList.contains('e-' + this.options.depth.toLowerCase())) {
                this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
            }
            else if (sf.base.closest(target, '.' + FOOTER_CONTAINER)
                && target.classList.contains(TODAY)
                && target.classList.contains(BTN)
                && (+new Date(dateValue) === +this.generateTodayVal(new Date(dateValue)))) {
                this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
            }
        }
    };
    SfDatePicker.prototype.generateTodayVal = function (value) {
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
    SfDatePicker.prototype.isCalendar = function () {
        return this.popupWrapper && this.popupWrapper.classList.contains('' + POPUPWRAPPER);
    };
    SfDatePicker.prototype.CalendarKeyActionHandle = function (e) {
        switch (e.action) {
            case this.defaultKeyConfigs.escape:
                if (this.isCalendar()) {
                    this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
                }
                else {
                    this.element.blur();
                }
                break;
            case this.defaultKeyConfigs.enter:
                if (!this.isCalendar()) {
                    this.dotNetRef.invokeMethodAsync(SHOW_POPUP, e);
                }
                break;
            case this.defaultKeyConfigs.tab:
                this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
        }
    };
    return SfDatePicker;
}());
// tslint:disable
var DatePicker = {
    initialize: function (wrapperElement, element, dotnetRef, options) {
        new SfDatePicker(wrapperElement, element, dotnetRef, options);
        element.blazor__instance.initialize();
    },
    renderPopup: function (element, popupElement, popupHolderEle, openEventArgs, options) {
        if (popupElement && popupHolderEle) {
            element.blazor__instance.renderPopup(popupElement, popupHolderEle, openEventArgs, options);
        }
    },
    // tslint:disable
    closePopup: function (element, popupElement, popupHolderEle, closeEventArgs, options) {
        element.blazor__instance.closePopup(closeEventArgs, options);
    },
    focusIn: function (inputEle) {
        inputEle.focus();
    },
    focusOut: function (inputEle) {
        inputEle.blur();
    }
};

return DatePicker;

}());
