window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.TimePicker = (function () {
'use strict';

var ROOT = 'e-timepicker';
var POPUPDIMENSION = '240px';
var POPUPWRAPPER = 'e-popup-wrapper';
var OVERFLOW = 'e-time-overflow';
var LISTCLASS = 'e-list-item';
var SELECTED = 'e-active';
var HOVER = 'e-hover';
var NAVIGATION = 'e-navigation';
var POPUP_CONTENT = 'e-content';
var MODEL_POPUP = 'e-timepicker-mob-popup-wrap';
var ARIA_SELECT = 'aria-selected';
var HIDE_POPUP = 'HidePopup';
var TIME_MODAL = 'e-time-modal';
var RIGHT = 'right';
var LEFT = 'left';
var TAB = 'tab';
var ENTER = 'enter';
var CLOSE_POPUP = 'ClosePopup';
var OFFSETVALUE = 4;
var OPENDURATION = 300;
var HALFPOSITION = 2;
var ANIMATIONDURATION = 50;
var DAY = new Date().getDate();
var MONTH = new Date().getMonth();
var YEAR = new Date().getFullYear();
var SfTimePicker = /** @class */ (function () {
    // tslint:disable
    function SfTimePicker(containerElement, element, dotnetRef, options) {
        this.containerElement = containerElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    SfTimePicker.prototype.initialize = function () {
        this.keyConfigure = {
            enter: 'enter', escape: 'escape', end: 'end', tab: 'tab', home: 'home', down: 'downarrow',
            up: 'uparrow', left: 'leftarrow', right: 'rightarrow', open: 'alt+downarrow', close: 'alt+uparrow'
        };
        if (!sf.base.Browser.isDevice) {
            this.keyConfigure = sf.base.extend(this.keyConfigure, this.options.keyConfigs);
            new sf.base.KeyboardEvents(this.containerElement, {
                keyAction: this.inputHandler.bind(this),
                keyConfigs: this.keyConfigure,
                eventName: 'keydown'
            });
        }
    };
    // tslint:disable
    SfTimePicker.prototype.renderPopup = function (popupElement, popupHolderEle, openEventArgs, options) {
        this.options = options;
        this.popupHolder = popupHolderEle;
        this.timeCollections = [];
        this.listWrapper = popupHolderEle.querySelector('.' + POPUP_CONTENT) || sf.base.select('.' + POPUP_CONTENT);
        this.getTimeCollection();
        if (!sf.base.isNullOrUndefined(this.element.value)) {
            this.removeSelection();
            this.selectedElement = this.listWrapper.querySelector('li[data-value = "' + this.element.value + '"]');
            this.updateSelection(this.selectedElement);
        }
        this.popupCreation(popupElement, options);
        if (sf.base.Browser.isDevice) {
            this.mobilePopupWrapper = sf.base.createElement('div', { className: MODEL_POPUP });
            document.body.appendChild(this.mobilePopupWrapper);
        }
        var appendToElement = openEventArgs.appendTo === 'model' ? this.mobilePopupWrapper : document.body;
        appendToElement.appendChild(this.popupWrapper);
        this.setScrollPosition();
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
        sf.base.EventHandler.add(document, 'mousedown touchstart', this.documentClickHandler, this);
    };
    SfTimePicker.prototype.getTimeCollection = function () {
        var liCollections = this.listWrapper.querySelectorAll('.' + LISTCLASS);
        for (var index = 0; index < liCollections.length; index++) {
            this.timeCollections.push(liCollections[index].getAttribute('data-value'));
        }
    };
    SfTimePicker.prototype.updateSelection = function (selectElement) {
        if (selectElement) {
            sf.base.addClass([selectElement], SELECTED);
            selectElement.setAttribute(ARIA_SELECT, 'true');
        }
    };
    SfTimePicker.prototype.setScrollPosition = function () {
        if (!sf.base.isNullOrUndefined(this.selectedElement)) {
            this.findScrollTop(this.selectedElement);
        }
        else if (this.popupWrapper && this.options.scrollTo && this.checkDateValue(new Date(this.options.scrollTo))) {
            this.setScrollTo();
        }
    };
    SfTimePicker.prototype.checkDateValue = function (value) {
        return (!sf.base.isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    };
    SfTimePicker.prototype.findScrollTop = function (element) {
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
    SfTimePicker.prototype.setScrollTo = function () {
        var element;
        if (!sf.base.isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                var initialTime = new Date(new Date().toDateString() + ' ' + this.timeCollections[0]).setMilliseconds(0);
                var scrollTime = this.getDateObject(new Date(this.options.scrollTo)).getTime();
                element = items[Math.round((scrollTime - initialTime) / (this.options.step * 60000))];
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
    SfTimePicker.prototype.getDateObject = function (text) {
        if (!sf.base.isNullOrUndefined(text)) {
            var dateValue = text;
            var value = !sf.base.isNullOrUndefined(this.options.value);
            if (this.checkDateValue(dateValue)) {
                var date = value ? new Date(this.options.value).getDate() : DAY;
                var month = value ? new Date(this.options.value).getMonth() : MONTH;
                var year = value ? new Date(this.options.value).getFullYear() : YEAR;
                return new Date(year, month, date, dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds());
            }
        }
        return null;
    };
    SfTimePicker.prototype.getPopupHeight = function () {
        var height = parseInt(POPUPDIMENSION, 10);
        var popupHeight = this.popupWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    };
    SfTimePicker.prototype.popupCreation = function (popupElement, options) {
        var _this = this;
        this.popupWrapper = popupElement;
        this.containerStyle = this.containerElement.getBoundingClientRect();
        if (sf.base.Browser.isDevice) {
            this.modal = sf.base.createElement('div');
            this.modal.className = '' + ROOT + ' ' + TIME_MODAL;
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        this.popupObj = new sf.popups.Popup(this.popupWrapper, {
            width: this.setPopupWidth(this.options.width),
            relateTo: sf.base.Browser.isDevice ? document.body : this.containerElement,
            position: sf.base.Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            collision: sf.base.Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            offsetY: OFFSETVALUE,
            targetType: 'relative',
            enableRtl: options.enableRtl,
            zIndex: options.zIndex,
            open: function () {
                _this.popupWrapper.style.visibility = 'visible';
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
        if (!sf.base.Browser.isDevice) {
            this.popupObj.collision = { X: 'none', Y: 'flip' };
        }
        this.popupObj.element.style.maxHeight = POPUPDIMENSION;
    };
    SfTimePicker.prototype.closePopup = function (closeEventArgs, options) {
        this.options = options;
        sf.base.removeClass([document.body], OVERFLOW);
        this.closeEventCallback(closeEventArgs);
    };
    SfTimePicker.prototype.removeSelection = function () {
        this.removeHover(HOVER);
        if (!sf.base.isNullOrUndefined(this.popupWrapper)) {
            var items = this.popupWrapper.querySelectorAll('.' + SELECTED);
            if (items.length) {
                sf.base.removeClass(items, SELECTED);
                items[0].removeAttribute(ARIA_SELECT);
            }
        }
    };
    SfTimePicker.prototype.removeHover = function (className) {
        var hoveredItem = this.popupWrapper ?
            this.popupWrapper.querySelectorAll('.' + className) : [];
        if (hoveredItem && hoveredItem.length) {
            sf.base.removeClass(hoveredItem, className);
            if (className === NAVIGATION) {
                hoveredItem[0].removeAttribute(ARIA_SELECT);
            }
        }
    };
    SfTimePicker.prototype.setWidth = function (width) {
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
    SfTimePicker.prototype.setPopupWidth = function (width) {
        width = this.setWidth(width);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    };
    SfTimePicker.prototype.closeEventCallback = function (eventArgs) {
        var preventArgs = eventArgs;
        if (this.isPopupOpen() && !preventArgs.cancel && this.popupObj) {
            var animModel = {
                name: 'FadeOut',
                duration: ANIMATIONDURATION,
                delay: 0
            };
            this.popupObj.hide(new sf.base.Animation(animModel));
        }
        if (sf.base.Browser.isDevice) {
            if (this.modal) {
                this.modal.style.display = 'none';
                this.modal.outerHTML = '';
                this.modal = null;
            }
            if (!sf.base.isNullOrUndefined(this.mobilePopupWrapper)) {
                this.mobilePopupWrapper.remove();
                this.mobilePopupWrapper = null;
            }
        }
        sf.base.EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
    };
    SfTimePicker.prototype.isPopupOpen = function () {
        return this.popupWrapper && this.popupWrapper.classList.contains('' + ROOT);
    };
    SfTimePicker.prototype.documentClickHandler = function (event) {
        var target = event.target;
        if ((!sf.base.isNullOrUndefined(this.popupObj) && (this.containerElement.contains(target) ||
            (this.popupObj.element && this.popupObj.element.contains(target)))) && event.type !== 'touchstart') {
            event.preventDefault();
        }
        var clearElement = this.containerElement.querySelector('.e-clear-icon');
        var timeIconElement = this.containerElement.querySelector('.e-time-icon.e-icons');
        if (!(sf.base.closest(target, '.' + POPUPWRAPPER)) && target !== this.element
            && target !== timeIconElement && target !== clearElement && target !== this.containerElement) {
            if (this.isPopupOpen()) {
                this.dotNetRef.invokeMethodAsync(HIDE_POPUP, null);
            }
        }
    };
    SfTimePicker.prototype.setOverlayIndex = function (popupWrapper, timePopupElement, modal, isDevice) {
        if (isDevice && !sf.base.isNullOrUndefined(timePopupElement) && !sf.base.isNullOrUndefined(modal) && !sf.base.isNullOrUndefined(popupWrapper)) {
            var index = parseInt(timePopupElement.style.zIndex, 10) ? parseInt(timePopupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupWrapper.style.zIndex = index.toString();
        }
    };
    SfTimePicker.prototype.selectInputText = function (element, isNavigation, index) {
        if (!sf.base.Browser.isDevice) {
            element.setSelectionRange(0, element.value.length);
            if (isNavigation && this.listWrapper) {
                this.selectedElement = this.listWrapper.querySelectorAll('.' + LISTCLASS)[index];
                this.setScrollPosition();
            }
        }
    };
    SfTimePicker.prototype.isDevice = function () {
        return sf.base.Browser.isDevice;
    };
    SfTimePicker.prototype.inputHandler = function (event) {
        if (event.action !== RIGHT && event.action !== LEFT && event.action !== TAB) {
            event.preventDefault();
        }
        if (event.action === ENTER && this.isPopupOpen()) {
            event.stopPropagation();
        }
        var eventArgs = {
            Action: event.action,
            Key: event.key,
            KeyCode: event.keyCode,
            Events: event,
            SelectDate: null,
            FocusedDate: null,
            classList: '',
            Id: null,
            TargetClassList: null
        };
        this.dotNetRef.invokeMethodAsync('KeyboardHandler', eventArgs);
    };
    return SfTimePicker;
}());
// tslint:disable
var TimePicker = {
    initialize: function (containerElement, element, dotnetRef, options) {
        new SfTimePicker(containerElement, element, dotnetRef, options);
        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
            return element.blazor__instance.isDevice();
        }
        return false;
    },
    renderPopup: function (element, popupElement, popupHolderEle, openEventArgs, options) {
        if (element && element.blazor__instance && popupElement && popupHolderEle) {
            element.blazor__instance.renderPopup(popupElement, popupHolderEle, openEventArgs, options);
        }
    },
    closePopup: function (element, closeEventArgs, options) {
        if (element && element.blazor__instance) {
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
    selectInputText: function (element, isNavigation, index) {
        if (element && element.blazor__instance) {
            element.blazor__instance.selectInputText(element, isNavigation, index);
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
    }
};

return TimePicker;

}());
