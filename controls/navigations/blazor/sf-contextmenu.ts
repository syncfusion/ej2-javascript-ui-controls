import { BlazorDotnetObject, closest, MouseEventArgs, EventHandler, Browser, Touch, TapEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined, getInstance, select, selectAll } from '@syncfusion/ej2-base';
import { getZindexPartial, getScrollableParent } from '@syncfusion/ej2-popups';
import { keyActionHandler } from './menu-base';

const TRANSPARENT: string = 'e-transparent';
const MENU: string = 'e-menu-parent';
const MENUITEM: string = 'e-menu-item';
const FOCUSED: string = 'e-focused';
const SELECTED: string = 'e-selected';
const CLOSE: string = 'CloseMenu';
const KEYDOWN: string = 'keydown';
const CONTEXTMENU: string = 'contextmenu';
const SCROLLMENU: string = '.e-menu-vscroll';
const SCROLLNAV: string = '.e-scroll-nav';
const SPACE: string = ' ';
const HIDDEN: string = 'hidden';
const OPENMENU: string = 'OpenContextMenu';
const PIXEL: string = 'px';
const MOUSEDOWN: string = 'mousedown touchstart';
const MOUSEOVER: string = 'mouseover';
const SCROLL: string = 'scroll';
const NONE: string = 'none';
const HASH: string = '#';
const EMPTY: string = '';
const DOT: string = '.';
const TARGET: string = 'Target';
const FILTER: string = 'Filter';
const CARET: string = 'e-caret';

/**
 * Client side scripts for Blazor context menu
 */
class SfContextMenu {
    private element: BlazorMenuElement;
    private target: string;
    private filter: string;
    private subMenuOpen: boolean;
    private menuId: string;
    private targetElement: HTMLElement;
    private openAsMenu: boolean;
    private dotnetRef: BlazorDotnetObject;

    constructor(element: BlazorMenuElement, target: string, filter: string, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.target = target;
        this.filter = filter;
        this.dotnetRef = dotnetRef;
        this.element.blazor__instance = this;
        this.addContextMenuEvent();
        EventHandler.add(this.element, KEYDOWN, this.keyDownHandler, this);
    }

    private addContextMenuEvent(add: boolean = true): void {
        let target: HTMLElement;
        if (this.target) {
            let targetElems: HTMLElement[] = selectAll(this.target);
            if (targetElems.length) {
                for (let i: number = 0, len: number = targetElems.length; i < len; i++) {
                    target = targetElems[i];
                    if (add) {
                        if (Browser.isIos) {
                            new Touch(target, { tapHold: this.touchHandler.bind(this) });
                        } else {
                            EventHandler.add(target, CONTEXTMENU, this.cmenuHandler, this);
                        }
                    } else {
                        if (Browser.isIos) {
                            let touchModule: Touch = getInstance(target, Touch) as Touch;
                            if (touchModule) { touchModule.destroy(); }
                        } else {
                            EventHandler.remove(target, CONTEXTMENU, this.cmenuHandler);
                        }
                    }
                }
                if (isNullOrUndefined(this.targetElement)) { this.targetElement = target; }
                if (add) {
                    EventHandler.add(this.targetElement, SCROLL, this.scrollHandler, this);
                    for (let parent of getScrollableParent(this.targetElement)) {
                        EventHandler.add(parent, SCROLL, this.scrollHandler, this);
                    }
                } else {
                    let scrollableParents: HTMLElement[];
                    if (this.targetElement.parentElement) {
                        EventHandler.remove(this.targetElement, SCROLL, this.scrollHandler);
                        scrollableParents = getScrollableParent(this.targetElement);
                    } else {
                        scrollableParents = getScrollableParent(target);
                    }
                    for (let parent of scrollableParents) {
                        EventHandler.remove(parent, SCROLL, this.scrollHandler);
                    }
                    this.targetElement = null;
                }
            }
        }
    }

    private scrollHandler(): void {
        if (select(DOT + MENU, this.element)) {
            this.dotnetRef.invokeMethodAsync(CLOSE, 0, false, true, false);
        }
    }

    private touchHandler(e: TapEventArgs): void {
        this.cmenuHandler(e.originalEvent);
    }

    private keyDownHandler(e: KeyboardEvent): void {
        e.preventDefault();
        keyActionHandler(this.element, e.target as Element, e.keyCode, this.menuId);
    }

    private cmenuHandler(e: MouseEventArgs): void {
        if (this.filter) {
            let canOpen: boolean = false;
            let filter: string[] = this.filter.split(SPACE);
            for (let i: number = 0, len: number = filter.length; i < len; i++) {
                if (closest(e.target as Element, filter[i])) { canOpen = true; break; }
            }
            if (!canOpen) { return; }
        }
        e.preventDefault();
        let left: number = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        let top: number = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        // tslint:disable-next-line:no-any
        (this.dotnetRef.invokeMethodAsync(OPENMENU, Math.ceil(left), Math.ceil(top)) as any).then(
            (rtl: boolean): void => this.contextMenuPosition(left, top, rtl, false));
    }

    public contextMenuPosition(left: number, top: number, rtl: boolean, subMenu: boolean): void {
        this.removeEventListener();
        let cmenu: HTMLElement = this.hideMenu(true);
        if (!cmenu) { return; }
        let cmenuOffset: ClientRect = cmenu.getBoundingClientRect();
        let cmenuWidth: number = this.getMenuWidth(cmenu, cmenuOffset.width, rtl);
        if (subMenu && Browser.isDevice) {
            cmenu.style.width = Math.ceil(cmenuWidth) + PIXEL;
            cmenu.style.visibility = EMPTY;
            return;
        }
        if (top + cmenuOffset.height > document.documentElement.clientHeight) {
            let newTop: number = document.documentElement.clientHeight - cmenuOffset.height - 20;
            if (newTop > document.documentElement.clientTop) { top = newTop; }
        }
        if (left + cmenuWidth > document.documentElement.clientWidth) {
            let newLeft: number = document.documentElement.clientWidth - cmenuWidth - 20;
            if (newLeft > document.documentElement.clientLeft) { left = newLeft; }
        }
        this.element.style.top = Math.ceil(top + 1) + PIXEL;
        this.element.style.left = Math.ceil(left + 1) + PIXEL;
        cmenu.style.width = Math.ceil(cmenuWidth) + PIXEL;
        this.element.style.zIndex = getZindexPartial(this.element).toString();
        cmenu.style.visibility = EMPTY;
        cmenu.focus();
        this.addEventListener();
    }

    public getMenuWidth(cmenu: Element, width: number, isRtl: boolean): number {
        let caretIcon: HTMLElement = cmenu.getElementsByClassName(CARET)[0] as HTMLElement;
        if (caretIcon) { width += parseInt(getComputedStyle(caretIcon)[isRtl ? 'marginRight' : 'marginLeft'], 10); }
        return width < 120 ? 120 : width;
    }

    private addEventListener(): void {
        EventHandler.add(document, MOUSEDOWN, this.mouseDownHandler, this);
        EventHandler.add(document, MOUSEOVER, this.mouseOverHandler, this);
    }

    private removeEventListener(): void {
        EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        EventHandler.remove(document, MOUSEOVER, this.mouseOverHandler);
    }

    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        if (!select(DOT + MENU, this.element)) { this.removeEventListener(); return; }
        if (!closest(e.target as Element, HASH + this.element.id) && (isNullOrUndefined(this.menuId) ||
            !closest(e.target as Element, this.menuId))) {
            this.dotnetRef.invokeMethodAsync(CLOSE, 0, false, true, false);
        }
    }

    private mouseOverHandler(e: MouseEvent): void {
        if (!select(DOT + MENU, this.element)) { this.removeEventListener(); return; }
        let target: Element = e.target as Element; let menus: HTMLElement[] = [].slice.call(selectAll(DOT + MENU, this.element));
        let scrollNav: Element = closest(target, SCROLLNAV);
        if (this.subMenuOpen && (menus.length > 1 || (!isNullOrUndefined(this.menuId) && !scrollNav))) {
            if ((!closest(target, HASH + this.element.id) && (isNullOrUndefined(this.menuId) || !closest(target, this.menuId))) ||
                scrollNav) {
                let index: number = 1;
                if (!isNullOrUndefined(this.menuId)) {
                    index = 0;
                    if (scrollNav) {
                        index = menus.indexOf(select(DOT + MENU, scrollNav.parentElement)) + 1;
                        if (index === menus.length) { return; }
                    }
                }
                this.dotnetRef.invokeMethodAsync(CLOSE, index, false, true, false);
                if (!isNullOrUndefined(this.menuId) && !closest(target, SCROLLNAV)) { this.destroyMenuScroll(null); }
            }
            if (!isNullOrUndefined(this.menuId) && (closest(target, HASH + this.element.id) || closest(target, this.menuId)) &&
                closest(target, DOT + MENUITEM) && !closest(target, DOT + SELECTED)) {
                this.destroyMenuScroll(closest(target, DOT + MENU));
            }
        }
        let activeEle: Element = document.activeElement;
        if (!closest(activeEle, `${HASH}${this.element.id}`) && menus.length) {
            if (this.openAsMenu) {
                this.openAsMenu = false;
                EventHandler.remove(document, MOUSEOVER, this.mouseOverHandler);
            }
            let lastChild: HTMLElement = this.getLastMenu();
            if (lastChild) { lastChild.focus(); }
        }
    }

    private destroyMenuScroll(menu: Element): void {
        if (!select(SCROLLMENU, this.element)) { return; }
        let menuElement: BlazorMenuElement = select(this.menuId) as BlazorMenuElement;
        if (menuElement) {
            // tslint:disable-next-line:no-any
            let menuInstance: any = menuElement.blazor__instance;
            if (!isNullOrUndefined(menuInstance)) { menuInstance.destroyScroll(NONE, menu); }
        }
    }

    public hideMenu(first?: boolean): HTMLElement {
        let cMenu: HTMLElement;
        if (first) {
            cMenu = select(DOT + MENU, this.element);
            if (!cMenu || isNullOrUndefined(this.element.parentElement)) { return null; }
            if (this.element.parentElement !== document.body) { document.body.appendChild(this.element); }
        } else {
            let menus: HTMLElement[] = selectAll(DOT + MENU, this.element);
            if (menus.length < 2) { return null; }
            cMenu = menus[menus.length - 1];
        }
        cMenu.style.width = EMPTY;
        cMenu.style.visibility = HIDDEN;
        cMenu.classList.remove(TRANSPARENT);
        return cMenu;
    }

    public subMenuPosition(cmenu: HTMLElement, isRtl: boolean, showOnClick: boolean, isNull: boolean, scrollHeight?: number): void {
        if (!cmenu) { return; }
        let menus: HTMLElement[] = selectAll(DOT + MENU, this.element);
        let parentLi: Element = menus[menus.length - 2].querySelector(`.${MENUITEM}.${SELECTED}`);
        let parentOffset: ClientRect = parentLi.getBoundingClientRect();
        let containerOffset: ClientRect = this.element.getBoundingClientRect();
        let menu: HTMLElement = cmenu.classList.contains(MENU) ? cmenu : select(DOT + MENU, cmenu);
        let curUlOffset: ClientRect = menu.getBoundingClientRect();
        let cmenuWidth: number = this.getMenuWidth(menu, curUlOffset.width, isRtl);
        let left: number; let borderLeft: number;
        if (isRtl) {
            borderLeft = parseInt(getComputedStyle(menu).borderWidth, 10);
            left = parentOffset.left - cmenuWidth - containerOffset.left;
        } else {
            left = parentOffset.right - containerOffset.left;
        }
        let top: number = parentOffset.top - containerOffset.top;
        if (isRtl) {
            if (parentOffset.left - borderLeft - cmenuWidth < document.documentElement.clientLeft) {
                if (parentOffset.right + cmenuWidth < document.documentElement.clientWidth) {
                    left = parentOffset.right - containerOffset.left;
                }
            }
        } else if (parentOffset.right + cmenuWidth > document.documentElement.clientWidth) {
            let newLeft: number = parentOffset.left - cmenuWidth;
            if (newLeft > document.documentElement.clientLeft) {
                left = newLeft - containerOffset.left;
            }
        }
        let height: number = scrollHeight || curUlOffset.height;
        if (parentOffset.top + height > document.documentElement.clientHeight) {
            let newTop: number = document.documentElement.clientHeight - height - 20;
            if (newTop > document.documentElement.clientTop) {
                top = newTop - containerOffset.top;
            }
        }
        this.subMenuOpen = !showOnClick;
        cmenu.style.left = Math.ceil(left) + PIXEL;
        cmenu.style.top = Math.ceil(top) + PIXEL;
        cmenu.style.width = Math.ceil(cmenuWidth) + PIXEL;
        menu.style.visibility = EMPTY;
        let focusedLi: HTMLElement = menu.querySelector(`${DOT}${MENUITEM}${DOT}${FOCUSED}`) as HTMLElement;
        focusedLi ? focusedLi.focus() : menu.focus();
        if (isNull) { this.openAsMenu = true; this.removeEventListener(); this.addEventListener(); }
    }

    public getLastMenu(): HTMLElement {
        let menus: HTMLElement[] = selectAll(DOT + MENU, this.element);
        return menus.length ? menus[menus.length - 1] : null;
    }

    public onPropertyChanged(key: string, result: string): void {
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
    }

    public destroy(refElement: HTMLElement): void {
        this.removeEventListener();
        this.addContextMenuEvent(false);
        EventHandler.remove(this.element, KEYDOWN, this.keyDownHandler);
        if (refElement && refElement.parentElement && refElement.previousElementSibling !== this.element) {
            refElement.parentElement.insertBefore(this.element, refElement);
        }
        if ((!refElement || !refElement.parentElement) && this.element.parentElement && this.element.parentElement === document.body) {
            document.body.removeChild(this.element);
        }
    }

    public updateProperty(showItemOnClick: boolean, menu?: HTMLElement): void {
        if (menu) { this.menuId = HASH + menu.id; }
        if (!showItemOnClick) {
            this.subMenuOpen = true;
            this.removeEventListener();
            this.addEventListener();
        }
    }
}

interface BlazorMenuElement extends HTMLElement {
    blazor__instance: SfContextMenu;
}

// tslint:disable-next-line:variable-name
let ContextMenu: object = {
    initialize(element: BlazorMenuElement, target: string, filter: string, dotnetRef: BlazorDotnetObject): void {
        if (!isNullOrUndefined(element)) { new SfContextMenu(element, target, filter, dotnetRef); }
    },
    contextMenuPosition(element: BlazorMenuElement, left: number, top: number, isRtl: boolean, subMenu: boolean): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.contextMenuPosition(left, top, isRtl, subMenu);
        }
    },
    subMenuPosition(element: BlazorMenuElement, isRtl: boolean, showOnClick: boolean, isNull?: boolean): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            let cmenu: HTMLElement = element.blazor__instance.hideMenu();
            element.blazor__instance.subMenuPosition(cmenu, isRtl, showOnClick, isNull);
        }
    },
    onPropertyChanged(element: BlazorMenuElement, key: string, result: string): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.onPropertyChanged(key, result);
        }
    },
    destroy(element: BlazorMenuElement, refElement: HTMLElement): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.destroy(refElement);
        }
    }
};

export default ContextMenu;