window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Menu = (function () {
'use strict';

var MENUITEM$1 = 'e-menu-item';
var FOCUSED$1 = 'e-focused';
var SELECTED$1 = 'e-selected';
var CONTAINER$1 = 'e-menu-container';
var MENU$1 = 'e-contextmenu';
var SUBMENU = 'e-ul';
var SEPARATOR = 'e-separator';
var DISABLED = 'e-disabled';
var HIDE = 'e-menu-hide';
var MENUPARENT$1 = 'e-menu-parent';
var RTL = 'e-rtl';
var HAMBURGER$1 = '.e-hamburger';
var SCROLLMENU$1 = '.e-menu-vscroll';
var NONE$1 = 'none';
var DOT$1 = '.';
var ESC = 27;
var ENTER = 13;
var UP$1 = 38;
var DOWN$1 = 40;
var LEFT$1 = 37;
var RIGHT$1 = 39;
/**
 * Keyboard action handler common for menu and context menu.
 * @hidden
 */
function keyActionHandler(container, target, keyCode, menuId) {
    if (keyCode === DOWN$1 || keyCode === UP$1) {
        var index = void 0;
        var ul = void 0;
        var focusedLi = void 0;
        if (target.classList.contains(MENUPARENT$1)) {
            ul = target;
            focusedLi = ul.querySelector("" + DOT$1 + MENUITEM$1 + DOT$1 + FOCUSED$1);
            if (focusedLi) {
                index = Array.prototype.indexOf.call(ul.children, focusedLi);
                index = keyCode === DOWN$1 ? (index === ul.childElementCount - 1 ? 0 : index + 1) :
                    (index === 0 ? ul.childElementCount - 1 : index - 1);
            }
            else {
                index = 0;
            }
            index = isValidLI(ul, index, keyCode === DOWN$1);
        }
        else if (target.classList.contains(MENUITEM$1)) {
            ul = target.parentElement;
            focusedLi = ul.querySelector("" + DOT$1 + MENUITEM$1 + DOT$1 + FOCUSED$1);
            index = Array.prototype.indexOf.call(ul.children, focusedLi ? focusedLi : target);
            index = keyCode === DOWN$1 ? (index === ul.childElementCount - 1 ? 0 : index + 1) : (index === 0 ?
                ul.childElementCount - 1 : index - 1);
            index = isValidLI(ul, index, keyCode === DOWN$1);
        }
        if (ul && index !== -1) {
            ul.children[index].focus();
        }
    }
    else if (((container.classList.contains(RTL) ? keyCode === RIGHT$1 : keyCode === LEFT$1) || keyCode === ESC ||
        (keyCode === ENTER && sf.base.closest(target, DOT$1 + CONTAINER$1))) && (target.classList.contains(SUBMENU) ||
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
            var hamburgerMenu = sf.base.closest(ul, HAMBURGER$1);
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

var CONTAINER = 'e-menu-container';
var MENUCLASS = '.e-menu';
var MENUITEM = 'e-menu-item';
var FOCUSED = '.e-focused';
var SELECTED = '.e-selected';
var MENU = '.e-ul';
var MOUSEDOWNHANDLER = 'DocumentMouseDown';
var PIXEL = 'px';
var MOUSEDOWN = 'mousedown touchstart';
var CLICK = 'click';
var HASH = '#';
var EMPTY = '';
var DOT = '.';
var MENUPARENT = 'e-menu-parent';
var MENUCARET = 'e-menu-caret-icon';
var KEYDOWN = 'keydown';
var HAMBURGER = 'e-hamburger';
var VERTICAL = 'e-vertical';
var VSCROLL = 'vscroll';
var HSCROLL = 'hscroll';
var SCROLLMENU = 'e-menu-';
var SCROLLNAV = '.e-scroll-nav';
var NONE = 'none';
var LEFT = 37;
var RIGHT = 39;
var UP = 38;
var DOWN = 40;
/**
 * Client side scripts for SfMenu
 */
var SfMenu = /** @class */ (function () {
    function SfMenu(options, dotnetRef) {
        this.element = options.element;
        this.dotnetRef = dotnetRef;
        this.element.blazor__instance = this;
        this.addEventListener();
        this.updateScroll(options.enableScrolling, options.isRtl, false);
    }
    SfMenu.prototype.calculatePosition = function (args) {
        var left;
        var top;
        var parent = args.element.getElementsByClassName(MENUITEM)[args.itemIndex];
        var offset = parent.getBoundingClientRect();
        var menu = args.popup.blazor__instance.hideMenu(true);
        if (!menu) {
            return;
        }
        this.popup = args.popup;
        if (args.enableScrolling) {
            this.destroyScroll(null, menu);
            if (args.scrollHeight) {
                menu = sf.navigations.addScrolling(sf.base.createElement, args.popup, menu, VSCROLL, args.isRtl, args.scrollHeight);
            }
        }
        var ul = menu.classList.contains(MENUPARENT) ? menu : sf.base.select(DOT + MENUPARENT, menu);
        args.popup.blazor__instance.setBlankIconStyle(ul, args.isRtl);
        var menuOffset = ul.getBoundingClientRect();
        var width = args.popup.blazor__instance.getMenuWidth(ul, menuOffset.width, args.isRtl);
        if (args.isVertical) {
            top = offset.top;
            if (args.isRtl) {
                left = offset.left;
                if (left - width < document.documentElement.clientLeft) {
                    var newLeft = offset.right + width;
                    if (newLeft < document.documentElement.clientWidth) {
                        left = newLeft;
                    }
                }
            }
            else {
                left = offset.right;
                if (left + width > document.documentElement.clientWidth) {
                    var newLeft = offset.left - width;
                    if (newLeft > document.documentElement.clientLeft) {
                        left = newLeft;
                    }
                }
            }
        }
        else {
            top = offset.bottom;
            if (args.isRtl) {
                left = offset.right;
                if (offset.right - width < document.documentElement.clientLeft) {
                    var newLeft = offset.left + width;
                    if (newLeft < document.documentElement.clientWidth) {
                        left = newLeft;
                    }
                }
            }
            else {
                left = offset.left;
                if (left + width > document.documentElement.clientWidth) {
                    var newLeft = offset.right - width;
                    if (newLeft > document.documentElement.clientLeft) {
                        left = newLeft;
                    }
                }
            }
        }
        var height = args.scrollHeight || menuOffset.height;
        if (top + height > document.documentElement.clientHeight) {
            var newTop = document.documentElement.clientHeight - height - 20;
            if (newTop > document.documentElement.clientTop) {
                top = newTop;
            }
        }
        args.popup.blazor__instance.updateProperty(args.showItemOnClick, args.element);
        this.popup.style.zIndex = sf.popups.getZindexPartial(this.popup).toString();
        menu.style.width = Math.ceil(width) + PIXEL;
        this.popup.style.left = Math.ceil(left) + PIXEL;
        this.popup.style.top = Math.ceil(top) + PIXEL;
        ul.style.visibility = EMPTY;
        ul.focus();
    };
    SfMenu.prototype.subMenuPosition = function (args) {
        var menu = args.popup.blazor__instance.hideMenu();
        if (args.enableScrolling && menu) {
            this.destroyScroll(null, menu);
            if (args.scrollHeight) {
                menu = sf.navigations.addScrolling(sf.base.createElement, args.popup, menu, VSCROLL, args.isRtl, args.scrollHeight);
            }
        }
        args.popup.blazor__instance.subMenuPosition(menu, args.isRtl, args.showItemOnClick, false, args.scrollHeight);
    };
    SfMenu.prototype.clickHandler = function (e) {
        var target = e.target;
        if (!sf.base.isNullOrUndefined(this.popup) && sf.base.closest(target, HASH + this.popup.id)) {
            var li = sf.base.closest(target, DOT + MENUITEM);
            if (li && !li.classList.contains(MENUCARET)) {
                if (!sf.base.closest(target, DOT + MENUITEM + SELECTED)) {
                    this.destroyScroll(NONE);
                }
                var selectedLi = sf.base.select(SELECTED, this.element);
                if (selectedLi) {
                    selectedLi.focus();
                }
            }
        }
        else if (sf.base.closest(target, HASH + this.element.id + DOT + HAMBURGER) && !target.classList.contains(MENUPARENT) &&
            !target.classList.contains(CONTAINER)) {
            var li = target.classList.contains(MENUITEM) ? target : sf.base.closest(target, DOT + MENUITEM + FOCUSED);
            if (li && !li.classList.contains(MENUCARET)) {
                this.focusMenu(true);
            }
        }
    };
    SfMenu.prototype.keyDownHandler = function (e) {
        e.preventDefault();
        if (this.element.classList.contains(HAMBURGER)) {
            keyActionHandler(this.element, e.target, e.keyCode);
        }
        else {
            var isVertical = sf.base.select(MENUCLASS, this.element).classList.contains(VERTICAL);
            if (isVertical) {
                if (e.keyCode === UP || e.keyCode === DOWN) {
                    keyActionHandler(this.element, e.target, e.keyCode);
                }
            }
            else {
                if (e.keyCode === LEFT || e.keyCode === RIGHT) {
                    keyActionHandler(this.element, e.target, e.keyCode === LEFT ? UP : DOWN);
                }
            }
        }
    };
    SfMenu.prototype.focusMenu = function (first) {
        if (sf.base.select(DOT + SCROLLMENU + VSCROLL, this.popup)) {
            this.destroyScroll(EMPTY);
            var menu = this.popup.blazor__instance.getLastMenu();
            if (menu) {
                menu.focus();
            }
            return;
        }
        var menuCollections = sf.base.selectAll(DOT + MENUPARENT, this.element);
        if (menuCollections.length) {
            if (first) {
                menuCollections[0].focus();
            }
            else {
                var focusedEle = sf.base.select(DOT + MENUITEM + FOCUSED, menuCollections[menuCollections.length - 1]);
                (focusedEle ? focusedEle : menuCollections[menuCollections.length - 1]).focus();
            }
        }
    };
    SfMenu.prototype.destroyScroll = function (display, curMenu) {
        var scrollElements = sf.base.selectAll(DOT + SCROLLMENU + VSCROLL, this.popup);
        var menus = [].slice.call(sf.base.selectAll(DOT + MENUPARENT, this.popup));
        var menu;
        var index = -1;
        if (!sf.base.isNullOrUndefined(display) && curMenu) {
            index = menus.indexOf(curMenu);
        }
        scrollElements.forEach(function (element) {
            menu = null;
            menu = sf.base.select(MENU, element);
            if (menu && !sf.base.isNullOrUndefined(display)) {
                if (curMenu) {
                    if (menus.indexOf(menu) > index) {
                        element.style.display = display;
                    }
                }
                else {
                    element.style.display = display;
                }
            }
            else {
                sf.navigations.destroyScroll(sf.base.getInstance(element, sf.navigations.VScroll), element, curMenu);
            }
        });
    };
    SfMenu.prototype.mouseDownHandler = function (e) {
        var target = e.target;
        if (sf.base.isNullOrUndefined(this.element) || !document.body.contains(this.element)) {
            this.removeEventListener(false);
        }
        var scrollNav = sf.base.closest(target, SCROLLNAV);
        if (sf.base.isNullOrUndefined(this.popup) || (!sf.base.closest(target, HASH + this.popup.id) || scrollNav)) {
            var menuLength = sf.base.selectAll(MENU, this.element).length;
            if ((sf.base.select(FOCUSED, this.element) || sf.base.select(SELECTED, this.element)) &&
                !sf.base.closest(e.target, HASH + this.element.id) && (!scrollNav || menuLength > 1)) {
                this.dotnetRef.invokeMethodAsync(MOUSEDOWNHANDLER, true, false, !sf.base.isNullOrUndefined(scrollNav));
            }
            if (!sf.base.isNullOrUndefined(this.popup) && !sf.base.closest(e.target, DOT + MENUITEM + SELECTED) && !scrollNav) {
                this.destroyScroll(NONE);
            }
        }
    };
    SfMenu.prototype.updateScroll = function (enableScrolling, isRtl, destroy) {
        if (enableScrolling) {
            var menu = sf.base.select(MENUCLASS, this.element);
            if (menu) {
                sf.navigations.addScrolling(sf.base.createElement, this.element, menu, menu.classList.contains(VERTICAL) ? VSCROLL : HSCROLL, isRtl);
            }
        }
        else if (destroy) {
            var scrollElement = sf.base.select(DOT + SCROLLMENU + (this.element.classList.contains(VERTICAL) ? VSCROLL : HSCROLL), this.element);
            if (scrollElement) {
                var scrollInstance = (this.element.classList.contains(VERTICAL) ? sf.base.getInstance(scrollElement, sf.navigations.VScroll) :
                    sf.base.getInstance(scrollElement, sf.navigations.HScroll));
                sf.navigations.destroyScroll(scrollInstance, scrollElement);
            }
        }
    };
    SfMenu.prototype.addEventListener = function () {
        sf.base.EventHandler.add(document, MOUSEDOWN, this.mouseDownHandler, this);
        sf.base.EventHandler.add(this.element, KEYDOWN, this.keyDownHandler, this);
        sf.base.EventHandler.add(document, CLICK, this.clickHandler, this);
    };
    SfMenu.prototype.removeEventListener = function (isEleAvailable) {
        sf.base.EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        if (isEleAvailable) {
            sf.base.EventHandler.remove(this.element, KEYDOWN, this.keyDownHandler);
        }
        sf.base.EventHandler.remove(document, CLICK, this.clickHandler);
    };
    return SfMenu;
}());
// tslint:disable-next-line:variable-name
var Menu = {
    initialize: function (args, dotnetRef) {
        if (!sf.base.isNullOrUndefined(args.element)) {
            new SfMenu(args, dotnetRef);
        }
    },
    calculatePosition: function (args) {
        if (!sf.base.isNullOrUndefined(args.element) && !sf.base.isNullOrUndefined(args.element.blazor__instance) && !sf.base.isNullOrUndefined(args.popup) &&
            !sf.base.isNullOrUndefined(args.popup.blazor__instance)) {
            args.element.blazor__instance.calculatePosition(args);
        }
    },
    subMenuPosition: function (args) {
        if (!sf.base.isNullOrUndefined(args.element) && !sf.base.isNullOrUndefined(args.element.blazor__instance) && !sf.base.isNullOrUndefined(args.popup) &&
            !sf.base.isNullOrUndefined(args.popup.blazor__instance)) {
            args.element.blazor__instance.subMenuPosition(args);
        }
    },
    focusMenu: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.focusMenu(false);
        }
    },
    updateScroll: function (element, enableScrolling, isRtl) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.updateScroll(enableScrolling, isRtl, true);
        }
    },
    destroy: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.removeEventListener(true);
        }
    }
};

return Menu;

}());
