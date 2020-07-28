window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.ContextMenu = (function () {
'use strict';

var TRANSPARENT = 'e-transparent';
var MENUITEM = 'e-menu-item';
var FOCUSED = 'e-focused';
var SELECTED = 'e-selected';
var MENU = 'e-contextmenu';
var SUBMENU = 'e-ul';
var SEPARATOR = 'e-separator';
var DISABLED = 'e-disabled';
var HIDE = 'e-menu-hide';
var CLOSE = 'CloseMenu';
var KEYDOWN = 'keydown';
var CONTEXTMENU = 'contextmenu';
var MENUPARENT = 'e-menu-parent';
var RTL = 'e-rtl';
var SPACE = ' ';
var CLOSESUBMENU = 'CloseSubMenu';
var HIDDEN = 'hidden';
var OPENMENU = 'OpenContextMenu';
var PIXEL = 'px';
var MOUSEDOWN = 'mousedown touchstart';
var MOUSEOVER = 'mouseover';
var SCROLL = 'scroll';
var HASH = '#';
var EMPTY = '';
var DOT = '.';
var TARGET = 'Target';
var FILTER = 'Filter';
var CARET = 'e-caret';
var ESC = 27;
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;
/**
 * Client side scripts for Blazor context menu
 */
var SfContextMenu = /** @class */ (function () {
    function SfContextMenu(element, target, filter, dotnetRef) {
        this.wrapper = element;
        this.target = target;
        this.filter = filter;
        this.dotnetRef = dotnetRef;
        this.wrapper.blazor__instance = this;
        this.addContextMenuEvent();
        sf.base.EventHandler.add(this.wrapper, KEYDOWN, this.keyDownHandler, this);
    }
    SfContextMenu.prototype.addContextMenuEvent = function (add) {
        if (add === void 0) { add = true; }
        var target;
        if (this.target) {
            var targetElems = sf.base.selectAll(this.target);
            if (targetElems.length) {
                for (var i = 0, len = targetElems.length; i < len; i++) {
                    target = targetElems[i];
                    if (add) {
                        if (sf.base.Browser.isIos) {
                            new sf.base.Touch(target, { tapHold: this.touchHandler.bind(this) });
                        }
                        else {
                            sf.base.EventHandler.add(target, CONTEXTMENU, this.cmenuHandler, this);
                        }
                    }
                    else {
                        if (sf.base.Browser.isIos) {
                            var touchModule = sf.base.getInstance(target, sf.base.Touch);
                            if (touchModule) {
                                touchModule.destroy();
                            }
                        }
                        else {
                            sf.base.EventHandler.remove(target, CONTEXTMENU, this.cmenuHandler);
                        }
                    }
                }
                if (sf.base.isNullOrUndefined(this.targetElement)) {
                    this.targetElement = target;
                }
                if (add) {
                    sf.base.EventHandler.add(this.targetElement, SCROLL, this.scrollHandler, this);
                    for (var _i = 0, _a = sf.popups.getScrollableParent(this.targetElement); _i < _a.length; _i++) {
                        var parent_1 = _a[_i];
                        sf.base.EventHandler.add(parent_1, SCROLL, this.scrollHandler, this);
                    }
                }
                else {
                    var scrollableParents = void 0;
                    if (this.targetElement.parentElement) {
                        sf.base.EventHandler.remove(this.targetElement, SCROLL, this.scrollHandler);
                        scrollableParents = sf.popups.getScrollableParent(this.targetElement);
                    }
                    else {
                        scrollableParents = sf.popups.getScrollableParent(target);
                    }
                    for (var _b = 0, scrollableParents_1 = scrollableParents; _b < scrollableParents_1.length; _b++) {
                        var parent_2 = scrollableParents_1[_b];
                        sf.base.EventHandler.remove(parent_2, SCROLL, this.scrollHandler);
                    }
                    this.targetElement = null;
                }
            }
        }
    };
    SfContextMenu.prototype.scrollHandler = function (e) {
        if (this.wrapper.childElementCount) {
            this.dotnetRef.invokeMethodAsync(CLOSE, e);
        }
    };
    SfContextMenu.prototype.touchHandler = function (e) {
        this.cmenuHandler(e.originalEvent);
    };
    SfContextMenu.prototype.keyDownHandler = function (e) {
        e.preventDefault();
        if (e.keyCode === DOWN || e.keyCode === UP) {
            var index = void 0;
            var ul = void 0;
            var focusedLi = void 0;
            if (e.target.classList.contains(MENUPARENT)) {
                ul = e.target;
                focusedLi = ul.querySelector("" + DOT + MENUITEM + DOT + FOCUSED);
                if (focusedLi) {
                    index = Array.prototype.indexOf.call(ul.children, focusedLi);
                    index = e.keyCode === DOWN ? (index === ul.childElementCount - 1 ? 0 : index + 1) :
                        (index === 0 ? ul.childElementCount - 1 : index - 1);
                }
                else {
                    index = 0;
                }
                index = this.isValidLI(ul, 0, e.keyCode === DOWN);
            }
            else if (e.target.classList.contains(MENUITEM)) {
                ul = e.target.parentElement;
                focusedLi = ul.querySelector("" + DOT + MENUITEM + DOT + FOCUSED);
                index = Array.prototype.indexOf.call(ul.children, focusedLi ? focusedLi : e.target);
                index = e.keyCode === DOWN ? (index === ul.childElementCount - 1 ? 0 : index + 1) : (index === 0 ?
                    ul.childElementCount - 1 : index - 1);
                index = this.isValidLI(ul, index, e.keyCode === DOWN);
            }
            if (ul && index !== -1) {
                ul.children[index].focus();
            }
        }
        else if (((this.wrapper.classList.contains(RTL) ? e.keyCode === RIGHT : e.keyCode === LEFT) || e.keyCode === ESC) &&
            (e.target.classList.contains(SUBMENU) || (e.target.classList.contains(MENUITEM) &&
                !(e.target.parentElement.classList.contains(MENU))))) {
            var ul = e.target.classList.contains(SUBMENU) ? e.target : e.target.parentElement;
            var selectedLi = ul.previousElementSibling.querySelector("." + MENUITEM + "." + SELECTED);
            if (selectedLi) {
                selectedLi.focus();
            }
        }
    };
    SfContextMenu.prototype.isValidLI = function (ul, index, isKeyDown, count) {
        if (count === void 0) { count = 0; }
        var cli = ul.children[index];
        if (count === ul.childElementCount) {
            return -1;
        }
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            index = isKeyDown ? (index === ul.childElementCount - 1 ? 0 : index + 1) : (index === 0 ? ul.childElementCount - 1 : index - 1);
            count++;
        }
        cli = ul.children[index];
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            index = this.isValidLI(ul, index, isKeyDown);
        }
        return index;
    };
    SfContextMenu.prototype.cmenuHandler = function (e) {
        if (this.filter) {
            var canOpen = false;
            var filter = this.filter.split(SPACE);
            for (var i = 0, len = filter.length; i < len; i++) {
                if (sf.base.closest(e.target, filter[i])) {
                    canOpen = true;
                    break;
                }
            }
            if (!canOpen) {
                return;
            }
        }
        e.preventDefault();
        var left = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
        var top = e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
        this.dotnetRef.invokeMethodAsync(OPENMENU, Math.ceil(left), Math.ceil(top), e);
    };
    SfContextMenu.prototype.contextMenuPosition = function (left, top, isRtl, subMenu) {
        this.removeEventListener();
        var cmenu = this.wrapper.firstElementChild;
        if (!cmenu) {
            return { Left: 0, Top: 0, ZIndex: 0, Width: 0 };
        }
        if (this.wrapper.parentElement !== document.body) {
            document.body.appendChild(this.wrapper);
        }
        var zIndex = sf.popups.getZindexPartial(this.wrapper);
        cmenu.style.visibility = HIDDEN;
        cmenu.classList.remove(TRANSPARENT);
        var cmenuOffset = cmenu.getBoundingClientRect();
        var cmenuWidth = this.getMenuWidth(cmenu, cmenuOffset.width, isRtl);
        if (subMenu && sf.base.Browser.isDevice) {
            cmenu.classList.add(TRANSPARENT);
            cmenu.style.visibility = EMPTY;
            return { Width: Math.ceil(cmenuWidth) };
        }
        var wrapperOffset = this.wrapper.getBoundingClientRect();
        if (top != null) {
            if (top - pageYOffset + cmenuOffset.height > document.documentElement.clientHeight) {
                var newTop = document.documentElement.clientHeight - cmenuOffset.height - 20;
                if (newTop > document.documentElement.clientTop) {
                    top = newTop + pageYOffset;
                }
            }
            top -= (wrapperOffset.top + pageYOffset);
            top = Math.ceil(top + 1);
        }
        if (left != null) {
            if (left - pageXOffset + cmenuWidth > document.documentElement.clientWidth) {
                var newLeft = document.documentElement.clientWidth - cmenuWidth - 20;
                if (newLeft > document.documentElement.clientLeft) {
                    left = newLeft + pageYOffset;
                }
            }
            left -= (wrapperOffset.left + pageXOffset);
            left = Math.ceil(left + 1);
        }
        cmenu.classList.add(TRANSPARENT);
        if (top != null) {
            this.wrapper.style.top = top + PIXEL;
        }
        if (left != null) {
            this.wrapper.style.left = left + PIXEL;
        }
        cmenu.style.visibility = EMPTY;
        cmenu.focus();
        this.addEventListener();
        return { Left: left, Top: top, ZIndex: zIndex, Width: Math.ceil(cmenuWidth) };
    };
    SfContextMenu.prototype.getMenuWidth = function (cmenu, width, isRtl) {
        var caretIcon = cmenu.getElementsByClassName(CARET)[0];
        if (caretIcon) {
            width += parseInt(getComputedStyle(caretIcon)[isRtl ? 'marginRight' : 'marginLeft'], 10);
        }
        return width < 120 ? 120 : width;
    };
    SfContextMenu.prototype.addEventListener = function () {
        sf.base.EventHandler.add(document, MOUSEDOWN, this.mouseDownHandler, this);
        sf.base.EventHandler.add(document, MOUSEOVER, this.mouseOverHandler, this);
    };
    SfContextMenu.prototype.removeEventListener = function () {
        sf.base.EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        sf.base.EventHandler.remove(document, MOUSEOVER, this.mouseOverHandler);
    };
    SfContextMenu.prototype.mouseDownHandler = function (e) {
        if (!this.wrapper.childElementCount) {
            this.removeEventListener();
            return;
        }
        if (!sf.base.closest(e.target, HASH + this.wrapper.id)) {
            this.dotnetRef.invokeMethodAsync(CLOSE, e);
        }
    };
    SfContextMenu.prototype.mouseOverHandler = function (e) {
        if (!this.wrapper.childElementCount) {
            this.removeEventListener();
            return;
        }
        if (this.subMenuOpen && this.wrapper.childElementCount > 1) {
            if (!sf.base.closest(e.target, HASH + this.wrapper.id)) {
                this.dotnetRef.invokeMethodAsync(CLOSESUBMENU, e);
            }
        }
        var activeEle = document.activeElement;
        if (!sf.base.closest(activeEle, "" + HASH + this.wrapper.id) && this.wrapper.childElementCount) {
            if (this.openAsMenu) {
                this.openAsMenu = false;
                sf.base.EventHandler.remove(document, MOUSEOVER, this.mouseOverHandler);
            }
            var lastChild = this.wrapper.lastElementChild;
            if (lastChild) {
                lastChild.focus();
            }
        }
    };
    SfContextMenu.prototype.subMenuPosition = function (isRtl, showOnClick, isNull) {
        if (!this.wrapper.childElementCount || this.wrapper.childElementCount < 2) {
            return { Left: 0, Top: 0, Width: 0 };
        }
        var parentLi = this.wrapper.children[this.wrapper.childElementCount - 2].querySelector("." + MENUITEM + "." + SELECTED);
        var parentOffset = parentLi.getBoundingClientRect();
        var wrapperOffset = this.wrapper.getBoundingClientRect();
        var cmenu = this.wrapper.lastElementChild;
        cmenu.style.visibility = HIDDEN;
        cmenu.classList.remove(TRANSPARENT);
        var curUlOffset = cmenu.getBoundingClientRect();
        var cmenuWidth = this.getMenuWidth(cmenu, curUlOffset.width, isRtl);
        var left;
        var borderLeft;
        if (isRtl) {
            borderLeft = parseInt(getComputedStyle(cmenu).borderWidth, 10);
            left = parentOffset.left - cmenuWidth - wrapperOffset.left;
        }
        else {
            left = parentOffset.right - wrapperOffset.left;
        }
        var top = parentOffset.top - wrapperOffset.top;
        cmenu.classList.add(TRANSPARENT);
        cmenu.style.visibility = EMPTY;
        var focusedLi = cmenu.querySelector("" + DOT + MENUITEM + DOT + FOCUSED);
        focusedLi ? focusedLi.focus() : cmenu.focus();
        if (isRtl) {
            if (parentOffset.left - borderLeft - cmenuWidth < document.documentElement.clientLeft) {
                if (parentOffset.right + cmenuWidth < document.documentElement.clientWidth) {
                    left = parentOffset.right - wrapperOffset.left;
                }
            }
        }
        else if (parentOffset.right + cmenuWidth > document.documentElement.clientWidth) {
            var newLeft = parentOffset.left - cmenuWidth;
            if (newLeft > document.documentElement.clientLeft) {
                left = newLeft - wrapperOffset.left;
            }
        }
        if (parentOffset.top + curUlOffset.height > document.documentElement.clientHeight) {
            var newTop = document.documentElement.clientHeight - curUlOffset.height - 20;
            if (newTop > document.documentElement.clientTop) {
                top = newTop - wrapperOffset.top;
            }
        }
        this.subMenuOpen = !showOnClick;
        if (isNull) {
            this.openAsMenu = true;
            this.removeEventListener();
            this.addEventListener();
        }
        return { Left: Math.ceil(left), Top: Math.ceil(top), Width: Math.ceil(cmenuWidth) };
    };
    SfContextMenu.prototype.onPropertyChanged = function (key, value) {
        switch (key) {
            case TARGET:
                this.addContextMenuEvent(false);
                this.target = value;
                this.addContextMenuEvent();
                break;
            case FILTER:
                this.filter = value;
                break;
        }
    };
    SfContextMenu.prototype.destroy = function (refElement) {
        this.removeEventListener();
        this.addContextMenuEvent(false);
        if (refElement && refElement.parentElement && refElement.previousElementSibling !== this.wrapper) {
            refElement.parentElement.insertBefore(this.wrapper, refElement);
        }
        if ((!refElement || !refElement.parentElement) && this.wrapper.parentElement && this.wrapper.parentElement === document.body) {
            document.body.removeChild(this.wrapper);
        }
    };
    return SfContextMenu;
}());
// tslint:disable-next-line:variable-name
var ContextMenu = {
    initialize: function (element, target, filter, dotnetRef) {
        if (!sf.base.isNullOrUndefined(element)) {
            new SfContextMenu(element, target, filter, dotnetRef);
        }
        return sf.base.Browser.isDevice;
    },
    contextMenuPosition: function (element, left, top, isRtl, subMenu) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            return element.blazor__instance.contextMenuPosition(left, top, isRtl, subMenu);
        }
        else {
            return { Left: 0, Top: 0, ZIndex: 0, Width: 0 };
        }
    },
    subMenuPosition: function (element, isRtl, showOnClick, isNull) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            return element.blazor__instance.subMenuPosition(isRtl, showOnClick, isNull);
        }
        else {
            return { Left: 0, Top: 0, Width: 0 };
        }
    },
    onPropertyChanged: function (element, key, value) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.onPropertyChanged(key, value);
        }
    },
    destroy: function (element, refElement) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.destroy(refElement);
        }
    }
};

return ContextMenu;

}());
