window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.DatePicker = (function () {
'use strict';

var ROOT = 'e-datepicker';
var POPUPDIMENSION = '240px';
var HALFPOSITION = 2;
var POPUP_CONTAINER = 'e-popup-wrapper';
var POPUP = 'e-popup';
var OVERFLOW = 'e-date-overflow';
var TIME_OVERFLOW = 'e-time-overflow';
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
    function SfDatePicker(containerElement, element, dotnetRef, options) {
        this.containerElement = containerElement;
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
        if (this.popupObj && this.popupObj.element.classList.contains(POPUP) && this.options.isDatePopup) {
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
        if (!this.isDisposed) {
            this.dotNetRef.invokeMethodAsync(INPUT_HANDLER, keyEventsArgs);
        }
        if (e.action !== 'select' && this.popupObj && document.body.contains(this.popupObj.element)) {
            e.preventDefault();
        }
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
        if (sf.base.Browser.isDevice && options.isDatePopup) {
            this.mobilePopupContainer = sf.base.createElement('div', { className: 'e-datepick-mob-popup-wrap' });
            document.body.appendChild(this.mobilePopupContainer);
        }
        var appendToElement = openEventArgs.appendTo === 'model' && this.mobilePopupContainer ? this.mobilePopupContainer
            : document.body;
        appendToElement.appendChild(this.popupContainer);
        this.popupObj.refreshPosition(this.element);
        if (!options.isDatePopup) {
            this.setScrollPosition();
        }
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
        this.setOverlayIndex(this.mobilePopupContainer, this.popupObj.element, this.modal, sf.base.Browser.isDevice);
        sf.base.EventHandler.add(document, MOUSE_TOUCH_EVENT, this.documentHandler, this);
    };
    SfDatePicker.prototype.setOverlayIndex = function (popupContainer, popupElement, modal, isDevice) {
        if (isDevice && !sf.base.isNullOrUndefined(popupElement) && !sf.base.isNullOrUndefined(modal) && !sf.base.isNullOrUndefined(popupContainer)) {
            var index = parseInt(popupElement.style.zIndex, 10) ? parseInt(popupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupContainer.style.zIndex = index.toString();
        }
    };
    SfDatePicker.prototype.closePopup = function (closeEventArgs, options) {
        this.options = options;
        this.closeEventCallback(closeEventArgs);
    };
    SfDatePicker.prototype.createCalendar = function (popupElement, options) {
        var _this = this;
        this.popupContainer = popupElement;
        this.calendarElement = this.popupContainer.firstElementChild;
        this.tableBodyElement = sf.base.select(TBODY, this.calendarElement);
        var modelClassName = '' + ROOT + ' e-date-modal';
        var modelOverflow = ' ' + OVERFLOW;
        if (!options.isDatePopup) {
            modelClassName = 'e-datetimepicker e-time-modal';
            modelOverflow = TIME_OVERFLOW;
        }
        else {
            this.calendarElement.querySelector(TABLE + ' ' + TBODY).className = '';
        }
        if (sf.base.Browser.isDevice) {
            this.modal = sf.base.createElement('div');
            this.modal.className = modelClassName;
            document.body.className += modelOverflow;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        this.popupObj = new sf.popups.Popup(this.popupContainer, {
            width: options.isDatePopup ? 'auto' : this.setPopupWidth(this.options.width),
            relateTo: sf.base.Browser.isDevice ? document.body : this.containerElement,
            position: sf.base.Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            offsetY: OFFSETVALUE,
            targetType: 'container',
            enableRtl: options.enableRtl,
            zIndex: options.zIndex,
            collision: sf.base.Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            open: function () {
                if (document.activeElement !== _this.element && options.isDatePopup) {
                    _this.defaultKeyConfigs = sf.base.extend(_this.defaultKeyConfigs, options.keyConfigs);
                    _this.calendarElement.children[1].firstElementChild.focus();
                    new sf.base.KeyboardEvents(_this.calendarElement.children[1].firstElementChild, {
                        eventName: 'keydown',
                        keyAction: _this.CalendarKeyActionHandle.bind(_this),
                        keyConfigs: _this.defaultKeyConfigs
                    });
                    new sf.base.KeyboardEvents(_this.containerElement.children[_this.index], {
                        eventName: 'keydown',
                        keyAction: _this.CalendarKeyActionHandle.bind(_this),
                        keyConfigs: _this.defaultKeyConfigs
                    });
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
        if (!options.isDatePopup) {
            this.popupObj.element.style.maxHeight = POPUPDIMENSION;
        }
    };
    SfDatePicker.prototype.getPopupHeight = function () {
        var height = parseInt(POPUPDIMENSION, 10);
        var popupHeight = this.popupContainer.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    };
    SfDatePicker.prototype.setScrollPosition = function () {
        if ((this.popupContainer && this.popupContainer.querySelector('.e-navigation') || this.popupContainer.querySelector('.e-active'))
            && !this.options.isDatePopup) {
            var selectElement = this.popupContainer.querySelector('.e-navigation') || this.popupContainer.querySelector('.e-active');
            this.findScrollTop(selectElement);
        }
    };
    SfDatePicker.prototype.findScrollTop = function (element) {
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
            sf.base.removeClass([document.body], OVERFLOW);
            if (!sf.base.isNullOrUndefined(this.mobilePopupContainer)) {
                this.mobilePopupContainer.remove();
                this.mobilePopupContainer = null;
            }
        }
        sf.base.EventHandler.remove(document, MOUSE_TOUCH_EVENT, this.documentHandler);
        if (sf.base.Browser.isDevice && this.options.allowEdit && !this.options.readonly) {
            this.element.removeAttribute('readonly');
        }
    };
    SfDatePicker.prototype.documentHandler = function (e) {
        if ((!sf.base.isNullOrUndefined(this.popupObj) && (this.containerElement.contains(e.target) ||
            (this.popupObj.element && this.popupObj.element.contains(e.target)))) && e.type !== 'touchstart') {
            e.preventDefault();
        }
        var clearElement = this.containerElement.querySelector('.e-clear-icon');
        var selectedElement = this.tableBodyElement ? this.tableBodyElement.querySelector('.e-selected') : null;
        var dateValue = this.options.value ? this.options.value.toString() : null;
        var target = e.target;
        if (target == clearElement && selectedElement) {
            sf.base.removeClass([this.tableBodyElement.querySelector('.e-selected')], SELECTED);
        }
        if (!(sf.base.closest(target, '.' + ROOT + '.' + POPUP_CONTAINER))
            && !sf.base.closest(target, '.' + 'e-datetimepicker' + '.' + POPUP_CONTAINER)
            && !(sf.base.closest(target, '.' + INPUTCONTAINER) === this.containerElement)
            && (!target.classList.contains(DAY)) && !this.isDisposed) {
            this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
            this.element.focus();
        }
        else if (sf.base.closest(target, '.' + ROOT + '.' + POPUP_CONTAINER)) {
            if (target.classList.contains(DAY)
                && !sf.base.isNullOrUndefined(e.target.parentElement)
                && e.target.parentElement.classList.contains(SELECTED)
                && sf.base.closest(target, '.' + CONENT)
                && sf.base.closest(target, '.' + CONENT).classList.contains('e-' + this.options.depth.toLowerCase()) && !this.isDisposed) {
                this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
            }
            else if (sf.base.closest(target, '.' + FOOTER_CONTAINER)
                && target.classList.contains(TODAY)
                && target.classList.contains(BTN)
                && (+new Date(dateValue) === +this.generateTodayVal(new Date(dateValue))) && !this.isDisposed) {
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
        return this.popupContainer && this.popupContainer.classList.contains('' + POPUP_CONTAINER);
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
    SfDatePicker.prototype.setWidth = function (width) {
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
    SfDatePicker.prototype.setPopupWidth = function (width) {
        width = this.setWidth(width);
        if (width.indexOf('%') > -1) {
            var containerStyle = this.containerElement.getBoundingClientRect();
            var inputWidth = containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    };
    return SfDatePicker;
}());
// tslint:disable
var DatePicker = {
    initialize: function (containerElement, element, dotnetRef, options) {
        if (element) {
            new SfDatePicker(containerElement, element, dotnetRef, options);
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
    // tslint:disable
    closePopup: function (element, popupElement, popupHolderEle, closeEventArgs, options) {
        if (element && element.blazor__instance) {
            element.blazor__instance.closePopup(closeEventArgs, options);
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

return DatePicker;

}());
