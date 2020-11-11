window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.ContextMenu = (function () {
'use strict';

var MENUITEM$1 = 'e-menu-item';
var FOCUSED$1 = 'e-focused';
var SELECTED$1 = 'e-selected';
var CONTAINER = 'e-menu-container';
var MENU$1 = 'e-contextmenu';
var SUBMENU = 'e-ul';
var SEPARATOR = 'e-separator';
var DISABLED = 'e-disabled';
var HIDE = 'e-menu-hide';
var MENUPARENT = 'e-menu-parent';
var RTL = 'e-rtl';
var HAMBURGER = '.e-hamburger';
var SCROLLMENU$1 = '.e-menu-vscroll';
var NONE$1 = 'none';
var DOT$1 = '.';
var ESC = 27;
var ENTER = 13;
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;
/**
 * Keyboard action handler common for menu and context menu.
 * @hidden
 */
function keyActionHandler(container, target, keyCode, menuId) {
    if (keyCode === DOWN || keyCode === UP) {
        var index = void 0;
        var ul = void 0;
        var focusedLi = void 0;
        if (target.classList.contains(MENUPARENT)) {
            ul = target;
            focusedLi = ul.querySelector("" + DOT$1 + MENUITEM$1 + DOT$1 + FOCUSED$1);
            if (focusedLi) {
                index = Array.prototype.indexOf.call(ul.children, focusedLi);
                index = keyCode === DOWN ? (index === ul.childElementCount - 1 ? 0 : index + 1) :
                    (index === 0 ? ul.childElementCount - 1 : index - 1);
            }
            else {
                index = 0;
            }
            index = isValidLI(ul, index, keyCode === DOWN);
        }
        else if (target.classList.contains(MENUITEM$1)) {
            ul = target.parentElement;
            focusedLi = ul.querySelector("" + DOT$1 + MENUITEM$1 + DOT$1 + FOCUSED$1);
            index = Array.prototype.indexOf.call(ul.children, focusedLi ? focusedLi : target);
            index = keyCode === DOWN ? (index === ul.childElementCount - 1 ? 0 : index + 1) : (index === 0 ?
                ul.childElementCount - 1 : index - 1);
            index = isValidLI(ul, index, keyCode === DOWN);
        }
        if (ul && index !== -1) {
            ul.children[index].focus();
        }
    }
    else if (((container.classList.contains(RTL) ? keyCode === RIGHT : keyCode === LEFT) || keyCode === ESC ||
        (keyCode === ENTER && sf.base.closest(target, DOT$1 + CONTAINER))) && (target.classList.contains(SUBMENU) ||
        (target.classList.contains(MENUITEM$1) && !(target.parentElement.classList.contains(MENU$1))))) {
        var menuContainer = void 0;
        if (menuId) {
            menuContainer = sf.base.select(menuId);
        }
        var ul = target.classList.contains(SUBMENU) ? target : target.parentElement;
        var menu = sf.base.closest(ul, SCROLLMENU$1);
        var selectedLi = void 0;
        var previousUl = menu ? menu.previousElementSibling : ul.previousElementSibling;
        if (menuContainer && (!previousUl || keyCode === ENTER)) {
            selectedLi = sf.base.select("" + DOT$1 + MENUITEM$1 + DOT$1 + SELECTED$1, menuContainer);
            menu = sf.base.select(SCROLLMENU$1, container);
            // tslint:disable-next-line:no-any
            if (menu) {
                menuContainer.blazor__instance.destroyScroll(NONE$1);
            }
        }
        else {
            var hamburgerMenu = sf.base.closest(ul, HAMBURGER);
            if (hamburgerMenu) {
                selectedLi = sf.base.select("" + DOT$1 + MENUITEM$1 + DOT$1 + SELECTED$1, hamburgerMenu);
            }
            else {
                selectedLi = sf.base.select("" + DOT$1 + MENUITEM$1 + DOT$1 + SELECTED$1, previousUl);
            }
        }
        if (selectedLi) {
            selectedLi.focus();
        }
    }
}
function isValidLI(ul, index, isKeyDown, count) {
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
        index = isValidLI(ul, index, isKeyDown);
    }
    return index;
}

var TRANSPARENT = 'e-transparent';
var MENU = 'e-menu-parent';
var MENUITEM = 'e-menu-item';
var FOCUSED = 'e-focused';
var SELECTED = 'e-selected';
var CLOSE = 'CloseMenu';
var KEYDOWN = 'keydown';
var CONTEXTMENU = 'contextmenu';
var SCROLLMENU = '.e-menu-vscroll';
var SCROLLNAV = '.e-scroll-nav';
var SPACE = ' ';
var HIDDEN = 'hidden';
var OPENMENU = 'OpenContextMenu';
var PIXEL = 'px';
var MOUSEDOWN = 'mousedown touchstart';
var MOUSEOVER = 'mouseover';
var SCROLL = 'scroll';
var NONE = 'none';
var HASH = '#';
var EMPTY = '';
var DOT = '.';
var TARGET = 'Target';
var FILTER = 'Filter';
var CARET = 'e-caret';
/**
 * Client side scripts for Blazor context menu
 */
var SfContextMenu = /** @class */ (function () {
    function SfContextMenu(element, target, filter, dotnetRef) {
        this.element = element;
        this.target = target;
        this.filter = filter;
        this.dotnetRef = dotnetRef;
        this.element.blazor__instance = this;
        this.addContextMenuEvent();
        sf.base.EventHandler.add(this.element, KEYDOWN, this.keyDownHandler, this);
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
    SfContextMenu.prototype.scrollHandler = function () {
        if (sf.base.select(DOT + MENU, this.element)) {
            this.dotnetRef.invokeMethodAsync(CLOSE, 0, false, true, false);
        }
    };
    SfContextMenu.prototype.touchHandler = function (e) {
        this.cmenuHandler(e.originalEvent);
    };
    SfContextMenu.prototype.keyDownHandler = function (e) {
        e.preventDefault();
        keyActionHandler(this.element, e.target, e.keyCode, this.menuId);
    };
    SfContextMenu.prototype.cmenuHandler = function (e) {
        var _this = this;
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
        var left = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        var top = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        // tslint:disable-next-line:no-any
        this.dotnetRef.invokeMethodAsync(OPENMENU, Math.ceil(left), Math.ceil(top)).then(function (rtl) { return _this.contextMenuPosition(left, top, rtl, false, false); });
    };
    SfContextMenu.prototype.contextMenuPosition = function (left, top, rtl, subMenu, manualOpen) {
        this.removeEventListener();
        var cmenu = this.hideMenu(true);
        if (!cmenu) {
            return;
        }
        this.setBlankIconStyle(cmenu, rtl);
        var cmenuOffset = cmenu.getBoundingClientRect();
        var cmenuWidth = this.getMenuWidth(cmenu, cmenuOffset.width, rtl);
        if (subMenu && sf.base.Browser.isDevice) {
            cmenu.style.width = Math.ceil(cmenuWidth) + PIXEL;
            cmenu.style.visibility = EMPTY;
            return;
        }
        if (!manualOpen) {
            if (top + cmenuOffset.height > document.documentElement.clientHeight) {
                var newTop = document.documentElement.clientHeight - cmenuOffset.height - 20;
                if (newTop > document.documentElement.clientTop) {
                    top = newTop;
                }
            }
            if (left + cmenuWidth > document.documentElement.clientWidth) {
                var newLeft = document.documentElement.clientWidth - cmenuWidth - 20;
                if (newLeft > document.documentElement.clientLeft) {
                    left = newLeft;
                }
            }
        }
        this.element.style.top = Math.ceil(top + 1) + PIXEL;
        this.element.style.left = Math.ceil(left + 1) + PIXEL;
        cmenu.style.width = Math.ceil(cmenuWidth) + PIXEL;
        this.element.style.zIndex = sf.popups.getZindexPartial(this.element).toString();
        cmenu.style.visibility = EMPTY;
        cmenu.focus();
        this.addEventListener();
    };
    SfContextMenu.prototype.setBlankIconStyle = function (menu, isRtl) {
        var blankIconList = [].slice.call(menu.getElementsByClassName('e-blankicon'));
        var cssProp = isRtl ? { padding: 'paddingRight', cssSelector: 'padding-right', margin: 'marginLeft' } : { padding: 'paddingLeft', cssSelector: 'padding-left', margin: 'marginRight' };
        [].slice.call(menu.querySelectorAll('.e-menu-item[style~="' + cssProp.cssSelector + '"]:not(.e-blankicon)')).forEach(function (li) {
            // tslint:disable-next-line:no-any
            li.style[cssProp.padding] = EMPTY;
        });
        if (!blankIconList.length) {
            return;
        }
        var iconLi = menu.querySelector('.e-menu-item:not(.e-blankicon):not(.e-separator)');
        var icon = iconLi.querySelector('.e-menu-icon');
        if (!icon) {
            return;
        }
        var iconCssProps = getComputedStyle(icon);
        var iconSize = parseInt(iconCssProps.fontSize, 10);
        if (!!parseInt(iconCssProps.width, 10) && parseInt(iconCssProps.width, 10) > iconSize) {
            iconSize = parseInt(iconCssProps.width, 10);
        }
        // tslint:disable
        var size = iconSize + parseInt(iconCssProps[cssProp.margin], 10) + parseInt(getComputedStyle(iconLi)[cssProp.padding], 10) + "px";
        blankIconList.forEach(function (li) {
            li.style[cssProp.padding] = size;
        });
        // tslint:enable
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
        if (!sf.base.select(DOT + MENU, this.element)) {
            this.removeEventListener();
            return;
        }
        if (!sf.base.closest(e.target, HASH + this.element.id) && (sf.base.isNullOrUndefined(this.menuId) ||
            !sf.base.closest(e.target, this.menuId))) {
            this.dotnetRef.invokeMethodAsync(CLOSE, 0, false, true, false);
        }
    };
    SfContextMenu.prototype.mouseOverHandler = function (e) {
        if (!sf.base.select(DOT + MENU, this.element)) {
            this.removeEventListener();
            return;
        }
        var target = e.target;
        var menus = [].slice.call(sf.base.selectAll(DOT + MENU, this.element));
        var scrollNav = sf.base.closest(target, SCROLLNAV);
        if (this.subMenuOpen && (menus.length > 1 || (!sf.base.isNullOrUndefined(this.menuId) && !scrollNav))) {
            if ((!sf.base.closest(target, HASH + this.element.id) && (sf.base.isNullOrUndefined(this.menuId) || !sf.base.closest(target, this.menuId))) ||
                scrollNav) {
                var index = 1;
                if (!sf.base.isNullOrUndefined(this.menuId)) {
                    index = 0;
                    if (scrollNav) {
                        index = menus.indexOf(sf.base.select(DOT + MENU, scrollNav.parentElement)) + 1;
                        if (index === menus.length) {
                            return;
                        }
                    }
                }
                this.dotnetRef.invokeMethodAsync(CLOSE, index, false, true, false);
                if (!sf.base.isNullOrUndefined(this.menuId) && !sf.base.closest(target, SCROLLNAV)) {
                    this.destroyMenuScroll(null);
                }
            }
            if (!sf.base.isNullOrUndefined(this.menuId) && (sf.base.closest(target, HASH + this.element.id) || sf.base.closest(target, this.menuId)) &&
                sf.base.closest(target, DOT + MENUITEM) && !sf.base.closest(target, DOT + SELECTED)) {
                this.destroyMenuScroll(sf.base.closest(target, DOT + MENU));
            }
        }
        var activeEle = document.activeElement;
        if (!sf.base.closest(activeEle, "" + HASH + this.element.id) && menus.length) {
            if (this.openAsMenu) {
                this.openAsMenu = false;
                sf.base.EventHandler.remove(document, MOUSEOVER, this.mouseOverHandler);
            }
            var lastChild = this.getLastMenu();
            if (lastChild) {
                lastChild.focus();
            }
        }
    };
    SfContextMenu.prototype.destroyMenuScroll = function (menu) {
        if (!sf.base.select(SCROLLMENU, this.element)) {
            return;
        }
        var menuElement = sf.base.select(this.menuId);
        if (menuElement) {
            // tslint:disable-next-line:no-any
            var menuInstance = menuElement.blazor__instance;
            if (!sf.base.isNullOrUndefined(menuInstance)) {
                menuInstance.destroyScroll(NONE, menu);
            }
        }
    };
    SfContextMenu.prototype.hideMenu = function (first) {
        var cMenu;
        if (first) {
            cMenu = sf.base.select(DOT + MENU, this.element);
            if (!cMenu || sf.base.isNullOrUndefined(this.element.parentElement)) {
                return null;
            }
            if (this.element.parentElement !== document.body) {
                document.body.appendChild(this.element);
            }
        }
        else {
            var menus = sf.base.selectAll(DOT + MENU, this.element);
            if (menus.length < 2) {
                return null;
            }
            cMenu = menus[menus.length - 1];
        }
        cMenu.style.width = EMPTY;
        cMenu.style.visibility = HIDDEN;
        cMenu.classList.remove(TRANSPARENT);
        return cMenu;
    };
    SfContextMenu.prototype.subMenuPosition = function (cmenu, isRtl, showOnClick, isNull, scrollHeight) {
        if (!cmenu) {
            return;
        }
        var menus = sf.base.selectAll(DOT + MENU, this.element);
        var parentLi = menus[menus.length - 2].querySelector("." + MENUITEM + "." + SELECTED);
        var parentOffset = parentLi.getBoundingClientRect();
        var containerOffset = this.element.getBoundingClientRect();
        var menu = cmenu.classList.contains(MENU) ? cmenu : sf.base.select(DOT + MENU, cmenu);
        this.setBlankIconStyle(menu, isRtl);
        var curUlOffset = menu.getBoundingClientRect();
        var cmenuWidth = this.getMenuWidth(menu, curUlOffset.width, isRtl);
        var left;
        var borderLeft;
        if (isRtl) {
            borderLeft = parseInt(getComputedStyle(menu).borderWidth, 10);
            left = parentOffset.left - cmenuWidth - containerOffset.left;
        }
        else {
            left = parentOffset.right - containerOffset.left;
        }
        var top = parentOffset.top - containerOffset.top;
        if (isRtl) {
            if (parentOffset.left - borderLeft - cmenuWidth < document.documentElement.clientLeft) {
                if (parentOffset.right + cmenuWidth < document.documentElement.clientWidth) {
                    left = parentOffset.right - containerOffset.left;
                }
            }
        }
        else if (parentOffset.right + cmenuWidth > document.documentElement.clientWidth) {
            var newLeft = parentOffset.left - cmenuWidth;
            if (newLeft > document.documentElement.clientLeft) {
                left = newLeft - containerOffset.left;
            }
        }
        var height = scrollHeight || curUlOffset.height;
        if (parentOffset.top + height > document.documentElement.clientHeight) {
            var newTop = document.documentElement.clientHeight - height - 20;
            if (newTop > document.documentElement.clientTop) {
                top = newTop - containerOffset.top;
            }
        }
        this.subMenuOpen = !showOnClick;
        cmenu.style.left = Math.ceil(left) + PIXEL;
        cmenu.style.top = Math.ceil(top) + PIXEL;
        cmenu.style.width = Math.ceil(cmenuWidth) + PIXEL;
        menu.style.visibility = EMPTY;
        var focusedLi = menu.querySelector("" + DOT + MENUITEM + DOT + FOCUSED);
        focusedLi ? focusedLi.focus() : menu.focus();
        if (isNull) {
            this.openAsMenu = true;
            this.removeEventListener();
            this.addEventListener();
        }
    };
    SfContextMenu.prototype.getLastMenu = function () {
        var menus = sf.base.selectAll(DOT + MENU, this.element);
        return menus.length ? menus[menus.length - 1] : null;
    };
    SfContextMenu.prototype.onPropertyChanged = function (key, result) {
        switch (key) {
            case TARGET:
                this.addContextMenuEvent(false);
                this.target = result;
                this.addContextMenuEvent();
                break;
            case FILTER:
                this.filter = result;
                break;
        }
    };
    SfContextMenu.prototype.destroy = function (refElement) {
        this.removeEventListener();
        this.addContextMenuEvent(false);
        sf.base.EventHandler.remove(this.element, KEYDOWN, this.keyDownHandler);
        if (refElement && refElement.parentElement && refElement.previousElementSibling !== this.element) {
            refElement.parentElement.insertBefore(this.element, refElement);
        }
        if ((!refElement || !refElement.parentElement) && this.element.parentElement && this.element.parentElement === document.body) {
            document.body.removeChild(this.element);
        }
    };
    SfContextMenu.prototype.updateProperty = function (showItemOnClick, menu) {
        if (menu) {
            this.menuId = HASH + menu.id;
        }
        if (!showItemOnClick) {
            this.subMenuOpen = true;
            this.removeEventListener();
            this.addEventListener();
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
    },
    contextMenuPosition: function (element, left, top, isRtl, subMenu, isOpen) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.contextMenuPosition(left, top, isRtl, subMenu, isOpen);
        }
    },
    subMenuPosition: function (element, isRtl, showOnClick, isNull) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            var cmenu = element.blazor__instance.hideMenu();
            element.blazor__instance.subMenuPosition(cmenu, isRtl, showOnClick, isNull);
        }
    },
    onPropertyChanged: function (element, key, result) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.onPropertyChanged(key, result);
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
