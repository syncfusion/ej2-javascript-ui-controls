window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.DropDownButton = (function () {
'use strict';

var HIDDEN = 'hidden';
var TRANSPARENT = 'e-transparent';
var EMPTY = '';
var PIXEL = 'px';
var DOT = '.';
var HASH = '#';
var BTN_CLICK = 'BtnClick';
var DROPDOWN = 'e-dropdown-menu';
var COLOR_PICKER = 'e-colorpicker-container';
var HSV_MODEL = 'e-hsv-model';
var CONTAINER = '.e-container';
var ITEM = 'e-item';
var FOCUSED = 'e-focused';
var WRAPPER = 'e-split-btn-wrapper';
var ELEMENT = 'e-dropdown-btn';
var MOUSEDOWN = 'mousedown touchstart';
var KEYDOWN = 'keydown';
var CLICK = 'click';
var SCROLL = 'scroll';
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
        this.addScrollEvents(true);
    }
    SfDropDownButton.prototype.openPopup = function (blankIcon) {
        this.popup.style.visibility = HIDDEN;
        document.body.appendChild(this.popup);
        if (blankIcon) {
            sf.splitbuttons.setBlankIconStyle(this.popup);
        }
        this.popup.classList.remove(TRANSPARENT);
        var zIndex = sf.popups.getZindexPartial(this.element);
        var isColorPicker = this.element.parentElement.classList.contains(COLOR_PICKER);
        if (isColorPicker) {
            this.element.parentElement.blazor__instance.setPaletteWidth(this.popup.querySelector(CONTAINER));
        }
        this.setPosition();
        sf.base.EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        this.addEventListener();
        this.popup.style.zIndex = zIndex + EMPTY;
        this.popup.style.visibility = EMPTY;
        if (isColorPicker) {
            this.element.parentElement.blazor__instance.setOffset(this.popup, zIndex);
        }
        if (this.popup.firstElementChild) {
            this.popup.firstElementChild.focus();
        }
    };
    SfDropDownButton.prototype.setPosition = function () {
        var btnOffset = this.element.getBoundingClientRect();
        var left = btnOffset.left + pageXOffset;
        var top = btnOffset.bottom + pageYOffset;
        var popupOffset = this.popup.getBoundingClientRect();
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
        this.popup.style.left = Math.ceil(left) + PIXEL;
        this.popup.style.top = Math.ceil(top) + PIXEL;
    };
    SfDropDownButton.prototype.mouseDownHandler = function (e) {
        if (this.popup.parentElement) {
            var target = e.target;
            var prevent = true;
            if (target.classList.contains(HSV_MODEL)) {
                var ref = target.parentElement.getBoundingClientRect();
                var btn = this.element.getBoundingClientRect();
                prevent = (e.clientX >= ref.left && e.clientX <= ref.right && e.clientY >= ref.top && e.clientY <= ref.bottom) ||
                    (e.clientX >= btn.left && e.clientX <= btn.right && e.clientY >= btn.top && e.clientY <= btn.bottom);
            }
            if (!prevent || (!sf.base.closest(target, HASH + this.getDropDownButton().id) && !sf.base.closest(e.target, HASH + this.popup.id))) {
                this.dotNetRef.invokeMethodAsync(BTN_CLICK, null);
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
                this.dotNetRef.invokeMethodAsync(BTN_CLICK, null);
                element.focus();
                this.removeEventListener();
            }
        }
        else {
            var ul = this.popup.firstElementChild;
            if (e.keyCode === ESC || e.keyCode === TAB) {
                e.stopPropagation();
                this.dotNetRef.invokeMethodAsync(BTN_CLICK, null);
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
    SfDropDownButton.prototype.scrollHandler = function (e) {
        if (!this.popup || !document.getElementById(this.popup.id)) {
            var ddb = this.getDropDownButton();
            if (!ddb || !document.getElementById(ddb.id)) {
                sf.base.EventHandler.remove(e.target, SCROLL, this.scrollHandler);
            }
            return;
        }
        this.setPosition();
        if (this.element.parentElement.classList.contains(COLOR_PICKER)) {
            this.element.parentElement.blazor__instance.setOffset(this.popup);
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
            if (reposition) {
                var ddb = this.getDropDownButton();
                if (ddb && document.getElementById(ddb.id)) {
                    this.addScrollEvents(false);
                    this.element.appendChild(this.popup);
                }
            }
        }
    };
    SfDropDownButton.prototype.addScrollEvents = function (add) {
        var elements = sf.popups.getScrollableParent(this.element);
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            add ? sf.base.EventHandler.add(element, SCROLL, this.scrollHandler, this) :
                sf.base.EventHandler.remove(element, SCROLL, this.scrollHandler);
        }
    };
    return SfDropDownButton;
}());
// tslint:disable-next-line:variable-name
var DropDownButton = {
    openPopup: function (element, popup, dotnetRef, blankIcon) {
        if (!sf.base.isNullOrUndefined(element)) {
            if (sf.base.isNullOrUndefined(element.blazor__instance)) {
                new SfDropDownButton(element, popup, dotnetRef);
            }
            else {
                element.blazor__instance.popup = popup;
            }
            element.blazor__instance.openPopup(blankIcon);
        }
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
