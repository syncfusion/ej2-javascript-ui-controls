window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.DropDownButton = (function () {
'use strict';

var HIDDEN = 'hidden';
var TRANSPARENT = 'e-transparent';
var EMPTY = '';
var DOT = '.';
var HASH = '#';
var BTNCLICK = 'BtnClick';
var FOCUS = 'focus';
var DROPDOWN = 'e-dropdown-menu';
var ITEM = 'e-item';
var TABIDX = 'tabindex';
var FOCUSED = 'e-focused';
var WRAPPER = 'e-split-btn-wrapper';
var ELEMENT = 'e-dropdown-btn';
var MOUSEDOWN = 'mousedown touchstart';
var KEYDOWN = 'keydown';
var CLICK = 'click';
var ESC = 27;
var UP = 38;
var DOWN = 40;
var ENTER = 13;
var TAB = 9;
/**
 * Dropdown Button Blazor introp module
 */
var SfDropDownButton = /** @class */ (function () {
    function SfDropDownButton(element, popup, dotnetRef) {
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.popup = popup;
        this.element.blazor__instance = this;
    }
    SfDropDownButton.prototype.calculatePosition = function () {
        var borderWidth = parseInt(getComputedStyle(this.element).borderWidth, 10);
        this.popup.style.visibility = HIDDEN;
        this.popup.classList.remove(TRANSPARENT);
        var popupOffset = this.popup.getBoundingClientRect();
        var left = 0 - borderWidth;
        var bottom = -popupOffset.height - borderWidth;
        var zIndex = sf.popups.getZindexPartial(this.popup);
        var btnOffset = this.element.getBoundingClientRect();
        if (popupOffset.height + btnOffset.bottom > document.documentElement.clientHeight) {
            if (btnOffset.top - popupOffset.height > document.documentElement.clientTop) {
                bottom = btnOffset.height - borderWidth;
            }
        }
        if (popupOffset.width + btnOffset.right > document.documentElement.clientWidth) {
            if (btnOffset.left - popupOffset.width > document.documentElement.clientLeft) {
                left = btnOffset.width - popupOffset.width;
            }
        }
        left = Math.ceil(left);
        bottom = Math.ceil(bottom);
        this.popup.classList.add(TRANSPARENT);
        this.popup.style.visibility = EMPTY;
        if (this.popup.firstElementChild) {
            this.popup.firstElementChild.focus();
        }
        this.addEventListener();
        return { Left: left, Bottom: bottom, ZIndex: zIndex };
    };
    SfDropDownButton.prototype.mouseDownHandler = function (e) {
        if (!sf.base.closest(e.target, HASH + this.getDropDownButton().id)) {
            this.dotNetRef.invokeMethodAsync(BTNCLICK, null);
            this.removeEventListener();
        }
    };
    SfDropDownButton.prototype.keydownHandler = function (e) {
        var element = this.getElement();
        if (e.altKey) {
            if (e.keyCode === UP) {
                e.stopPropagation();
                e.preventDefault();
                this.dotNetRef.invokeMethodAsync(BTNCLICK, null);
                element.focus();
                this.removeEventListener();
            }
        }
        else {
            var ul = this.popup.firstElementChild;
            if (e.keyCode === ESC || e.keyCode === TAB) {
                e.stopPropagation();
                this.dotNetRef.invokeMethodAsync(BTNCLICK, null);
                if (e.keyCode === ESC) {
                    e.preventDefault();
                    element.focus();
                }
                else {
                    if (e.shiftKey) {
                        sf.base.EventHandler.add(element, FOCUS, this.preventFocus, this);
                        element.tabIndex = -1;
                        element.focus();
                    }
                }
                this.removeEventListener();
            }
            if (!ul || !ul.classList.contains(DROPDOWN)) {
                return;
            }
            if (e.keyCode === ENTER) {
                e.preventDefault();
                if (e.target.classList.contains(ITEM) && e.target.classList.contains(FOCUSED)) {
                    element.focus();
                    this.removeEventListener();
                }
                else {
                    e.stopPropagation();
                }
                return;
            }
            if (e.keyCode === UP || e.keyCode === DOWN) {
                if (e.target.classList.contains(DROPDOWN)) {
                    e.stopPropagation();
                }
                e.preventDefault();
                sf.splitbuttons.upDownKeyHandler(ul, e.keyCode);
            }
        }
    };
    SfDropDownButton.prototype.preventFocus = function (e) {
        var element = this.getElement();
        e.preventDefault();
        sf.base.EventHandler.remove(element, FOCUS, this.preventFocus);
        element.removeAttribute(TABIDX);
    };
    SfDropDownButton.prototype.getElement = function () {
        return (this.element.classList.contains(WRAPPER) ? this.element.firstElementChild : this.element);
    };
    SfDropDownButton.prototype.getDropDownButton = function () {
        return this.element.classList.contains(WRAPPER) ?
            this.element.getElementsByClassName(ELEMENT)[0] : this.element;
    };
    SfDropDownButton.prototype.btnClickHandler = function (e) {
        if (sf.base.closest(e.target, HASH + this.popup.id)) {
            if (sf.base.closest(e.target, DOT + ITEM)) {
                this.removeEventListener();
                this.getElement().focus();
            }
        }
        else {
            this.removeEventListener();
        }
    };
    SfDropDownButton.prototype.addEventListener = function (setFocus) {
        sf.base.EventHandler.add(document, MOUSEDOWN, this.mouseDownHandler, this);
        sf.base.EventHandler.add(this.getDropDownButton(), CLICK, this.btnClickHandler, this);
        sf.base.EventHandler.add(this.popup, KEYDOWN, this.keydownHandler, this);
        if (setFocus && this.popup.firstElementChild) {
            var focusEle = this.popup.querySelector(DOT + FOCUSED);
            focusEle ? focusEle.focus() : this.popup.firstElementChild.focus();
        }
    };
    SfDropDownButton.prototype.removeEventListener = function () {
        sf.base.EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        sf.base.EventHandler.remove(this.getDropDownButton(), CLICK, this.btnClickHandler);
        if (this.popup.parentElement) {
            sf.base.EventHandler.remove(this.popup, KEYDOWN, this.keydownHandler);
        }
    };
    return SfDropDownButton;
}());
// tslint:disable-next-line:variable-name
var DropDownButton = {
    calculatePosition: function (element, popup, dotnetRef) {
        if (sf.base.isNullOrUndefined(element.blazor__instance)) {
            new SfDropDownButton(element, popup, dotnetRef);
            return element.blazor__instance.calculatePosition();
        }
        element.blazor__instance.popup = popup;
        return element.blazor__instance.calculatePosition();
    },
    addEventListener: function (element) {
        element.blazor__instance.addEventListener(true);
    },
    removeEventListener: function (element) {
        element.blazor__instance.removeEventListener();
    }
};

return DropDownButton;

}());
