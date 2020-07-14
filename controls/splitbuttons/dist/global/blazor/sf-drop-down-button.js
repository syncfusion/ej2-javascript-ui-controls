window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.DropDownButton = (function () {
'use strict';

var HIDDEN = 'hidden';
var TRANSPARENT = 'e-transparent';
var EMPTY = '';
var PIXEL = 'px;';
var ZERO = '0';
var DOT = '.';
var HASH = '#';
var BTNCLICK = 'BtnClick';
var DROPDOWN = 'e-dropdown-menu';
var ITEM = 'e-item';
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
        var btnOffset = this.element.getBoundingClientRect();
        var left = btnOffset.left + pageXOffset;
        var top = btnOffset.bottom + pageYOffset;
        this.popup.style.visibility = HIDDEN;
        this.popup.style.top = pageYOffset ? pageYOffset + PIXEL : ZERO;
        this.popup.style.left = pageXOffset ? pageXOffset + PIXEL : ZERO;
        this.popup.classList.remove(TRANSPARENT);
        var popupOffset = this.popup.getBoundingClientRect();
        this.popup.classList.add(TRANSPARENT);
        this.popup.style.visibility = EMPTY;
        var zIndex = sf.popups.getZindexPartial(this.element);
        if (btnOffset.bottom + popupOffset.height > document.documentElement.clientHeight) {
            if (top - btnOffset.height - popupOffset.height > document.documentElement.clientTop) {
                top = top - btnOffset.height - popupOffset.height;
            }
        }
        if (btnOffset.left + popupOffset.width > document.documentElement.clientWidth) {
            if (btnOffset.right - popupOffset.width > document.documentElement.clientLeft) {
                left = (left + btnOffset.width) - popupOffset.width;
            }
        }
        left = Math.ceil(left);
        top = Math.ceil(top);
        document.body.appendChild(this.popup);
        if (this.popup.firstElementChild) {
            this.popup.firstElementChild.focus();
        }
        sf.base.EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        this.addEventListener();
        return { Left: left, Top: top, ZIndex: zIndex };
    };
    SfDropDownButton.prototype.mouseDownHandler = function (e) {
        if (this.popup.parentElement) {
            if (!sf.base.closest(e.target, HASH + this.getDropDownButton().id) && !sf.base.closest(e.target, HASH + this.popup.id)) {
                this.dotNetRef.invokeMethodAsync(BTNCLICK, null);
                this.removeEventListener();
            }
        }
        else {
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
                }
                element.focus();
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
    SfDropDownButton.prototype.getElement = function () {
        return (this.element.classList.contains(WRAPPER) ? this.element.firstElementChild : this.element);
    };
    SfDropDownButton.prototype.getDropDownButton = function () {
        return this.element.classList.contains(WRAPPER) ?
            this.element.getElementsByClassName(ELEMENT)[0] : this.element;
    };
    SfDropDownButton.prototype.clickHandler = function (e) {
        if (sf.base.closest(e.target, DOT + ITEM)) {
            this.removeEventListener();
            this.getElement().focus();
        }
    };
    SfDropDownButton.prototype.addEventListener = function (setFocus) {
        sf.base.EventHandler.add(document, MOUSEDOWN, this.mouseDownHandler, this);
        sf.base.EventHandler.add(this.popup, CLICK, this.clickHandler, this);
        sf.base.EventHandler.add(this.popup, KEYDOWN, this.keydownHandler, this);
        if (setFocus && this.popup.firstElementChild) {
            var focusEle = this.popup.querySelector(DOT + FOCUSED);
            focusEle ? focusEle.focus() : this.popup.firstElementChild.focus();
        }
    };
    SfDropDownButton.prototype.removeEventListener = function (reposition) {
        sf.base.EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        if (this.popup.parentElement) {
            sf.base.EventHandler.remove(this.popup, CLICK, this.clickHandler);
            sf.base.EventHandler.remove(this.popup, KEYDOWN, this.keydownHandler);
            if (reposition && this.element.parentElement) {
                this.element.appendChild(this.popup);
            }
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
        element.blazor__instance.removeEventListener();
        element.blazor__instance.addEventListener(true);
    },
    removeEventListener: function (element) {
        element.blazor__instance.removeEventListener(true);
    }
};

return DropDownButton;

}());
