import { BlazorDotnetObject, closest, EventHandler, select, selectAll, createElement, getInstance } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { getZindexPartial } from '@syncfusion/ej2-popups';
import { keyActionHandler } from './menu-base';
import { addScrolling, destroyScroll } from '../src/common/menu-scroll';
import { VScroll } from '../src/common/v-scroll';
import { HScroll } from '../src/common/h-scroll';

const CONTAINER: string = 'e-menu-container';
const MENUCLASS: string = '.e-menu';
const MENUITEM: string = 'e-menu-item';
const FOCUSED: string = '.e-focused';
const SELECTED: string = '.e-selected';
const MENU: string = '.e-ul';
const MOUSEDOWNHANDLER: string = 'DocumentMouseDown';
const PIXEL: string = 'px';
const MOUSEDOWN: string = 'mousedown touchstart';
const CLICK: string = 'click';
const HASH: string = '#';
const EMPTY: string = '';
const DOT: string = '.';
const MENUPARENT: string = 'e-menu-parent';
const MENUCARET: string = 'e-menu-caret-icon';
const KEYDOWN: string = 'keydown';
const HAMBURGER: string = 'e-hamburger';
const VERTICAL: string = 'e-vertical';
const VSCROLL: string = 'vscroll';
const HSCROLL: string = 'hscroll';
const SCROLLMENU: string = 'e-menu-';
const SCROLLNAV: string = '.e-scroll-nav';
const NONE: string = 'none';
const LEFT: number = 37;
const RIGHT: number = 39;
const UP: number = 38;
const DOWN: number = 40;

/**
 * Client side scripts for SfMenu
 */
class SfMenu {
    private element: BlazorMenuElement;
    private popup: BlazorContextMenuElement;
    private dotnetRef: BlazorDotnetObject;

    constructor(options: MenuOptions, dotnetRef: BlazorDotnetObject) {
        this.element = options.element;
        this.dotnetRef = dotnetRef;
        this.element.blazor__instance = this;
        this.addEventListener();
        this.updateScroll(options.enableScrolling, options.isRtl, false);
    }

    public calculatePosition(args: MenuOptions): void {
        let left: number; let top: number;
        let parent: HTMLElement = <HTMLElement>args.element.getElementsByClassName(MENUITEM)[args.itemIndex];
        let offset: ClientRect = parent.getBoundingClientRect();
        let menu: HTMLElement = args.popup.blazor__instance.hideMenu(true);
        if (!menu) { return; }
        this.popup = args.popup;
        if (args.enableScrolling) {
            this.destroyScroll(null, menu);
            if (args.scrollHeight) { menu = addScrolling(createElement, args.popup, menu, VSCROLL, args.isRtl, args.scrollHeight); }
        }
        let ul: HTMLElement = menu.classList.contains(MENUPARENT) ? menu : select(DOT + MENUPARENT, menu);
        args.popup.blazor__instance.setBlankIconStyle(ul, args.isRtl);
        let menuOffset: ClientRect = ul.getBoundingClientRect();
        let width: number = args.popup.blazor__instance.getMenuWidth(ul, menuOffset.width, args.isRtl);
        if (args.isVertical) {
            top = offset.top;
            if (args.isRtl) {
                left = offset.left;
                if (left - width < document.documentElement.clientLeft) {
                    let newLeft: number = offset.right + width;
                    if (newLeft < document.documentElement.clientWidth) { left = newLeft; }
                }
            } else {
                left = offset.right;
                if (left + width > document.documentElement.clientWidth) {
                    let newLeft: number = offset.left - width;
                    if (newLeft > document.documentElement.clientLeft) { left = newLeft; }
                }
            }
        } else {
            top = offset.bottom;
            if (args.isRtl) {
                left = offset.right;
                if (offset.right - width < document.documentElement.clientLeft) {
                    let newLeft: number = offset.left + width;
                    if (newLeft < document.documentElement.clientWidth) { left = newLeft; }
                }
            } else {
                left = offset.left;
                if (left + width > document.documentElement.clientWidth) {
                    let newLeft: number = offset.right - width;
                    if (newLeft > document.documentElement.clientLeft) { left = newLeft; }
                }
            }
        }
        let height: number = args.scrollHeight || menuOffset.height;
        if (top + height > document.documentElement.clientHeight) {
            let newTop: number = document.documentElement.clientHeight - height - 20;
            if (newTop > document.documentElement.clientTop) { top = newTop; }
        }
        args.popup.blazor__instance.updateProperty(args.showItemOnClick, args.element);
        this.popup.style.zIndex = getZindexPartial(this.popup).toString();
        menu.style.width = Math.ceil(width) + PIXEL;
        this.popup.style.left = Math.ceil(left) + PIXEL;
        this.popup.style.top = Math.ceil(top) + PIXEL;
        ul.style.visibility = EMPTY;
        ul.focus();
    }

    public subMenuPosition(args: MenuOptions): void {
        let menu: HTMLElement = args.popup.blazor__instance.hideMenu();
        if (args.enableScrolling && menu) {
            this.destroyScroll(null, menu);
            if (args.scrollHeight) { menu = addScrolling(createElement, args.popup, menu, VSCROLL, args.isRtl, args.scrollHeight); }
        }
        args.popup.blazor__instance.subMenuPosition(menu, args.isRtl, args.showItemOnClick, false, args.scrollHeight);
    }

    private clickHandler(e: MouseEvent & TouchEvent): void {
        let target: Element = e.target as Element;
        if (!isNullOrUndefined(this.popup) && closest(target, HASH + this.popup.id)) {
            let li: Element = closest(target, DOT + MENUITEM);
            if (li && !li.classList.contains(MENUCARET)) {
                if (!closest(target, DOT + MENUITEM + SELECTED)) { this.destroyScroll(NONE); }
                let selectedLi: HTMLElement = select(SELECTED, this.element);
                if (selectedLi) { selectedLi.focus(); }
            }
        } else if (closest(target, HASH + this.element.id + DOT + HAMBURGER) && !target.classList.contains(MENUPARENT) &&
            !target.classList.contains(CONTAINER)) {
            let li: Element = target.classList.contains(MENUITEM) ? target : closest(target, DOT + MENUITEM + FOCUSED);
            if (li && !li.classList.contains(MENUCARET)) { this.focusMenu(true); }
        }
    }

    private keyDownHandler(e: KeyboardEvent): void {
        e.preventDefault();
        if (this.element.classList.contains(HAMBURGER)) {
            keyActionHandler(this.element, e.target as Element, e.keyCode);
        } else {
            let isVertical: Boolean = select(MENUCLASS, this.element).classList.contains(VERTICAL);
            if (isVertical) {
                if (e.keyCode === UP || e.keyCode === DOWN) {
                    keyActionHandler(this.element, e.target as Element, e.keyCode);
                }
            } else {
                if (e.keyCode === LEFT || e.keyCode === RIGHT) {
                    keyActionHandler(this.element, e.target as Element, e.keyCode === LEFT ? UP : DOWN);
                }
            }
        }
    }

    public focusMenu(first: boolean): void {
        if (select(DOT + SCROLLMENU + VSCROLL, this.popup)) {
            this.destroyScroll(EMPTY);
            let menu: HTMLElement = this.popup.blazor__instance.getLastMenu();
            if (menu) { menu.focus(); }
            return;
        }
        let menuCollections: HTMLElement[] = selectAll(DOT + MENUPARENT, this.element);
        if (menuCollections.length) {
            if (first) {
                menuCollections[0].focus();
            } else {
                let focusedEle: HTMLElement = select(DOT + MENUITEM + FOCUSED, menuCollections[menuCollections.length - 1]);
                (focusedEle ? focusedEle : menuCollections[menuCollections.length - 1]).focus();
            }
        }
    }

    public destroyScroll(display: string, curMenu?: HTMLElement): void {
        let scrollElements: HTMLElement[] = selectAll(DOT + SCROLLMENU + VSCROLL, this.popup);
        let menus: HTMLElement[] = [].slice.call(selectAll(DOT + MENUPARENT, this.popup));
        let menu: HTMLElement; let index: number = -1;
        if (!isNullOrUndefined(display) && curMenu) { index = menus.indexOf(curMenu); }
        scrollElements.forEach((element: HTMLElement): void => {
            menu = null; menu = select(MENU, element);
            if (menu && !isNullOrUndefined(display)) {
                if (curMenu) {
                    if (menus.indexOf(menu) > index) { element.style.display = display; }
                } else {
                    element.style.display = display;
                }
            } else {
                destroyScroll(getInstance(element, VScroll) as VScroll, element, curMenu);
            }
        });
    }

    private mouseDownHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        let isEleAvailable: boolean = !document.body.contains(this.element);
        if (isNullOrUndefined(this.element) || isEleAvailable) { this.removeEventListener(false); }
        let scrollNav: Element = closest(target, SCROLLNAV);
        if (isNullOrUndefined(this.popup) || (!closest(target, HASH + this.popup.id) || scrollNav)) {
            let menuLength: number = selectAll(MENU, this.element).length;
            if (isEleAvailable && (select(FOCUSED, this.element) || select(SELECTED, this.element)) &&
                !closest(e.target as Element, HASH + this.element.id) && (!scrollNav || menuLength > 1)) {
                this.dotnetRef.invokeMethodAsync(MOUSEDOWNHANDLER, true, false, !isNullOrUndefined(scrollNav));
            }
            if (!isNullOrUndefined(this.popup) && !isNullOrUndefined(this.popup.blazor__instance) &&
                (!closest(e.target as Element, DOT + MENUITEM + SELECTED) || !this.popup.blazor__instance.subMenuOpen) && !scrollNav) {
                if (!this.popup.blazor__instance.subMenuOpen) {
                    let menu: HTMLElement = closest(e.target as Element, MENU) as HTMLElement;
                    if (select(DOT + SCROLLMENU + VSCROLL, this.popup)) { this.destroyScroll(NONE, menu); }
                } else {
                    this.destroyScroll(NONE);
                }
            }
        }
    }

    public updateScroll(enableScrolling: boolean, isRtl: boolean, destroy: boolean): void {
        if (enableScrolling) {
            let menu: HTMLElement = select(MENUCLASS, this.element);
            if (menu) {
                addScrolling(createElement, this.element, menu, menu.classList.contains(VERTICAL) ? VSCROLL : HSCROLL, isRtl);
            }
        } else if (destroy) {
            let scrollElement: HTMLElement = select(
                DOT + SCROLLMENU + (this.element.classList.contains(VERTICAL) ? VSCROLL : HSCROLL), this.element);
            if (scrollElement) {
                let scrollInstance: VScroll | HScroll = (this.element.classList.contains(VERTICAL) ? getInstance(scrollElement, VScroll) :
                    getInstance(scrollElement, HScroll)) as VScroll | HScroll;
                destroyScroll(scrollInstance, scrollElement);
            }
        }
    }

    private addEventListener(): void {
        EventHandler.add(document, MOUSEDOWN, this.mouseDownHandler, this);
        EventHandler.add(this.element, KEYDOWN, this.keyDownHandler, this);
        EventHandler.add(document, CLICK, this.clickHandler, this);
    }

    public removeEventListener(isEleAvailable: boolean): void {
        EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        if (isEleAvailable) { EventHandler.remove(this.element, KEYDOWN, this.keyDownHandler); }
        EventHandler.remove(document, CLICK, this.clickHandler);
    }
}

interface BlazorMenuElement extends HTMLElement {
    blazor__instance: SfMenu;
}

interface BlazorContextMenuElement extends HTMLElement {
    // tslint:disable-next-line:no-any
    blazor__instance: any;
}

interface MenuOptions {
    element: BlazorMenuElement;
    popup: BlazorContextMenuElement;
    itemIndex: number;
    isRtl: boolean;
    isVertical: boolean;
    showItemOnClick: boolean;
    enableScrolling: boolean;
    scrollHeight: number;
}

// tslint:disable-next-line:variable-name
let Menu: object = {
    initialize(args: MenuOptions, dotnetRef: BlazorDotnetObject): void {
        if (!isNullOrUndefined(args.element)) { new SfMenu(args, dotnetRef); }
    },
    calculatePosition(args: MenuOptions): void {
        if (!isNullOrUndefined(args.element) && !isNullOrUndefined(args.element.blazor__instance) && !isNullOrUndefined(args.popup) &&
        !isNullOrUndefined(args.popup.blazor__instance)) {
            args.element.blazor__instance.calculatePosition(args);
        }
    },
    subMenuPosition(args: MenuOptions): void {
        if (!isNullOrUndefined(args.element) && !isNullOrUndefined(args.element.blazor__instance) && !isNullOrUndefined(args.popup) &&
        !isNullOrUndefined(args.popup.blazor__instance)) {
            args.element.blazor__instance.subMenuPosition(args);
        }
    },
    focusMenu(element: BlazorMenuElement): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.focusMenu(false);
        }
    },
    updateScroll(element: BlazorMenuElement, enableScrolling: boolean, isRtl: boolean): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.updateScroll(enableScrolling, isRtl, true);
        }
    },
    destroy(element: BlazorMenuElement): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.removeEventListener(true);
        }
    }
};

export default Menu;