import { BlazorDotnetObject, closest, MouseEventArgs, EventHandler, Browser, Touch, TapEventArgs, getInstance } from '@syncfusion/ej2-base';
import { isNullOrUndefined, selectAll } from '@syncfusion/ej2-base';
import { getZindexPartial, getScrollableParent } from '@syncfusion/ej2-popups';

const TRANSPARENT: string = 'e-transparent';
const MENUITEM: string = 'e-menu-item';
const FOCUSED: string = 'e-focused';
const SELECTED: string = 'e-selected';
const MENU: string = 'e-contextmenu';
const SUBMENU: string = 'e-ul';
const SEPARATOR: string = 'e-separator';
const DISABLED: string = 'e-disabled';
const HIDE: string = 'e-menu-hide';
const CLOSE: string = 'CloseMenu';
const KEYDOWN: string = 'keydown';
const CONTEXTMENU: string = 'contextmenu';
const MENUPARENT: string = 'e-menu-parent';
const RTL: string = 'e-rtl';
const SPACE: string = ' ';
const CLOSESUBMENU: string = 'CloseSubMenu';
const HIDDEN: string = 'hidden';
const OPENMENU: string = 'OpenContextMenu';
const PIXEL: string = 'px';
const MOUSEDOWN: string = 'mousedown touchstart';
const MOUSEOVER: string = 'mouseover';
const SCROLL: string = 'scroll';
const HASH: string = '#';
const EMPTY: string = '';
const DOT: string = '.';
const TARGET: string = 'Target';
const FILTER: string = 'Filter';
const CARET: string = 'e-caret';
const ESC: number = 27;
const UP: number = 38;
const DOWN: number = 40;
const LEFT: number = 37;
const RIGHT: number = 39;

/**
 * Client side scripts for Blazor context menu
 */
class SfContextMenu {
    private wrapper: BlazorMenuElement;
    private target: string;
    private filter: string;
    private subMenuOpen: boolean;
    private targetElement: HTMLElement;
    private openAsMenu: boolean;
    private dotnetRef: BlazorDotnetObject;

    constructor(element: BlazorMenuElement, target: string, filter: string, dotnetRef: BlazorDotnetObject) {
        this.wrapper = element;
        this.target = target;
        this.filter = filter;
        this.dotnetRef = dotnetRef;
        this.wrapper.blazor__instance = this;
        this.addContextMenuEvent();
        EventHandler.add(this.wrapper, KEYDOWN, this.keyDownHandler, this);
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

    private scrollHandler(e: MouseEvent): void {
        if (this.wrapper.childElementCount) {
            this.dotnetRef.invokeMethodAsync(CLOSE, e);
        }
    }

    private touchHandler(e: TapEventArgs): void {
        this.cmenuHandler(e.originalEvent);
    }

    private keyDownHandler(e: KeyboardEvent): void {
        e.preventDefault();
        if (e.keyCode === DOWN || e.keyCode === UP) {
            let index: number; let ul: Element; let focusedLi: Element;
            if ((e.target as Element).classList.contains(MENUPARENT)) {
                ul = e.target as Element;
                focusedLi = ul.querySelector(`${DOT}${MENUITEM}${DOT}${FOCUSED}`);
                if (focusedLi) {
                    index = Array.prototype.indexOf.call(ul.children, focusedLi);
                    index = e.keyCode === DOWN ? (index === ul.childElementCount - 1 ? 0 : index + 1) :
                        (index === 0 ? ul.childElementCount - 1 : index - 1);
                } else {
                    index = 0;
                }
                index = this.isValidLI(ul, 0, e.keyCode === DOWN);
            } else if ((e.target as Element).classList.contains(MENUITEM)) {
                ul = (e.target as Element).parentElement;
                focusedLi = ul.querySelector(`${DOT}${MENUITEM}${DOT}${FOCUSED}`);
                index = Array.prototype.indexOf.call(ul.children, focusedLi ? focusedLi : e.target);
                index = e.keyCode === DOWN ? (index === ul.childElementCount - 1 ? 0 : index + 1) : (index === 0 ?
                    ul.childElementCount - 1 : index - 1);
                index = this.isValidLI(ul, index, e.keyCode === DOWN);
            }
            if (ul && index !== -1) {
                (ul.children[index] as HTMLElement).focus();
            }
        } else if (((this.wrapper.classList.contains(RTL) ? e.keyCode === RIGHT : e.keyCode === LEFT) || e.keyCode === ESC) &&
            ((e.target as Element).classList.contains(SUBMENU) || ((e.target as Element).classList.contains(MENUITEM) &&
            !((e.target as Element).parentElement.classList.contains(MENU))))) {
            let ul: Element = (e.target as Element).classList.contains(SUBMENU) ? e.target as Element : (e.target as Element).parentElement;
            let selectedLi: HTMLElement = ul.previousElementSibling.querySelector(`.${MENUITEM}.${SELECTED}`) as HTMLElement;
            if (selectedLi) { selectedLi.focus(); }
        }
    }

    private isValidLI(ul: Element, index: number, isKeyDown: boolean, count: number = 0): number {
        let cli: Element = ul.children[index];
        if (count === ul.childElementCount) { return -1; }
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            index = isKeyDown ? (index === ul.childElementCount - 1 ? 0 : index + 1) : (index === 0 ? ul.childElementCount - 1 : index - 1);
            count++;
        }
        cli = ul.children[index];
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            index = this.isValidLI(ul, index, isKeyDown);
        }
        return index;
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
        let left: number = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
        let top: number = e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
        this.dotnetRef.invokeMethodAsync(OPENMENU, Math.ceil(left), Math.ceil(top), e);
    }

    public contextMenuPosition(left: number, top: number, isRtl: boolean, subMenu: boolean): Offset {
        this.removeEventListener();
        let cmenu: HTMLElement = this.wrapper.firstElementChild as HTMLElement;
        if (!cmenu) { return <Offset>{ Left: 0, Top: 0, ZIndex: 0, Width: 0 }; }
        if (this.wrapper.parentElement !== document.body) { document.body.appendChild(this.wrapper); }
        let zIndex: number = getZindexPartial(this.wrapper);
        cmenu.style.visibility = HIDDEN;
        cmenu.classList.remove(TRANSPARENT);
        let cmenuOffset: ClientRect = cmenu.getBoundingClientRect();
        let cmenuWidth: number = this.getMenuWidth(cmenu, cmenuOffset.width, isRtl);
        if (subMenu && Browser.isDevice) {
            cmenu.classList.add(TRANSPARENT);
            cmenu.style.visibility = EMPTY;
            return <Offset>{ Width: Math.ceil(cmenuWidth) };
        }
        let wrapperOffset: ClientRect = this.wrapper.getBoundingClientRect();
        if (top != null) {
            if (top - pageYOffset + cmenuOffset.height > document.documentElement.clientHeight) {
                let newTop: number = document.documentElement.clientHeight - cmenuOffset.height - 20;
                if (newTop > document.documentElement.clientTop) { top = newTop + pageYOffset; }
            }
            top -= (wrapperOffset.top + pageYOffset);
            top = Math.ceil(top + 1);
        }
        if (left != null) {
            if (left - pageXOffset + cmenuWidth > document.documentElement.clientWidth) {
                let newLeft: number = document.documentElement.clientWidth - cmenuWidth - 20;
                if (newLeft > document.documentElement.clientLeft) { left = newLeft + pageYOffset; }
            }
            left -= (wrapperOffset.left + pageXOffset);
            left = Math.ceil(left + 1);
        }
        cmenu.classList.add(TRANSPARENT);
        if (top != null) { this.wrapper.style.top = top + PIXEL; }
        if (left != null) { this.wrapper.style.left = left + PIXEL; }
        cmenu.style.visibility = EMPTY;
        cmenu.focus();
        this.addEventListener();
        return <Offset>{ Left: left, Top: top, ZIndex: zIndex, Width: Math.ceil(cmenuWidth) };
    }

    private getMenuWidth(cmenu: Element, width: number, isRtl: boolean): number {
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
        if (!this.wrapper.childElementCount) { this.removeEventListener(); return; }
        if (!closest(e.target as Element, HASH + this.wrapper.id)) {
            this.dotnetRef.invokeMethodAsync(CLOSE, e);
        }
    }

    private mouseOverHandler(e: MouseEvent): void {
        if (!this.wrapper.childElementCount) { this.removeEventListener(); return; }
        if (this.subMenuOpen && this.wrapper.childElementCount > 1) {
            if (!closest(e.target as Element, HASH + this.wrapper.id)) {
                this.dotnetRef.invokeMethodAsync(CLOSESUBMENU, e);
            }
        }
        let activeEle: Element = document.activeElement;
        if (!closest(activeEle, `${HASH}${this.wrapper.id}`) && this.wrapper.childElementCount) {
            if (this.openAsMenu) {
                this.openAsMenu = false;
                EventHandler.remove(document, MOUSEOVER, this.mouseOverHandler);
            }
            let lastChild: HTMLElement = this.wrapper.lastElementChild as HTMLElement;
            if (lastChild) { lastChild.focus(); }
        }
    }

    public subMenuPosition(isRtl: boolean, showOnClick: boolean, isNull: boolean): Offset {
        if (!this.wrapper.childElementCount || this.wrapper.childElementCount < 2) { return <Offset>{ Left: 0, Top: 0, Width: 0 }; }
        let parentLi: Element = this.wrapper.children[this.wrapper.childElementCount - 2].querySelector(`.${MENUITEM}.${SELECTED}`);
        let parentOffset: ClientRect = parentLi.getBoundingClientRect();
        let wrapperOffset: ClientRect = this.wrapper.getBoundingClientRect();
        let cmenu: HTMLElement = this.wrapper.lastElementChild as HTMLElement;
        cmenu.style.visibility = HIDDEN;
        cmenu.classList.remove(TRANSPARENT);
        let curUlOffset: ClientRect = cmenu.getBoundingClientRect();
        let cmenuWidth: number = this.getMenuWidth(cmenu, curUlOffset.width, isRtl);
        let left: number; let borderLeft: number;
        if (isRtl) {
            borderLeft = parseInt(getComputedStyle(cmenu).borderWidth, 10);
            left = parentOffset.left - cmenuWidth - wrapperOffset.left;
        } else {
            left = parentOffset.right - wrapperOffset.left;
        }
        let top: number = parentOffset.top - wrapperOffset.top;
        cmenu.classList.add(TRANSPARENT);
        cmenu.style.visibility = EMPTY;
        let focusedLi: HTMLElement = cmenu.querySelector(`${DOT}${MENUITEM}${DOT}${FOCUSED}`) as HTMLElement;
        focusedLi ? focusedLi.focus() : cmenu.focus();
        if (isRtl) {
            if (parentOffset.left - borderLeft - cmenuWidth < document.documentElement.clientLeft) {
                if (parentOffset.right + cmenuWidth < document.documentElement.clientWidth) {
                    left = parentOffset.right - wrapperOffset.left;
                }
            }
        } else if (parentOffset.right + cmenuWidth > document.documentElement.clientWidth) {
            let newLeft: number = parentOffset.left - cmenuWidth;
            if (newLeft > document.documentElement.clientLeft) {
                left = newLeft - wrapperOffset.left;
            }
        }
        if (parentOffset.top + curUlOffset.height > document.documentElement.clientHeight) {
            let newTop: number = document.documentElement.clientHeight - curUlOffset.height - 20;
            if (newTop > document.documentElement.clientTop) {
                top = newTop - wrapperOffset.top;
            }
        }
        this.subMenuOpen = !showOnClick;
        if (isNull) { this.openAsMenu = true; this.removeEventListener(); this.addEventListener(); }
        return <Offset>{ Left: Math.ceil(left), Top: Math.ceil(top), Width: Math.ceil(cmenuWidth) };
    }

    public onPropertyChanged(key: string, value: string): void {
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
    }

    public destroy(refElement: HTMLElement): void {
        this.removeEventListener();
        this.addContextMenuEvent(false);
        if (refElement && refElement.parentElement && refElement.previousElementSibling !== this.wrapper) {
            refElement.parentElement.insertBefore(this.wrapper, refElement);
        }
        if ((!refElement || !refElement.parentElement) && this.wrapper.parentElement && this.wrapper.parentElement === document.body) {
            document.body.removeChild(this.wrapper);
        }
    }
}

interface BlazorMenuElement extends HTMLElement {
    blazor__instance: SfContextMenu;
}

interface Offset {
    Left: number;
    Top: number;
    Width: number;
    ZIndex?: number;
}

// tslint:disable-next-line:variable-name
let ContextMenu: object = {
    initialize(element: BlazorMenuElement, target: string, filter: string, dotnetRef: BlazorDotnetObject): Boolean {
        if (!isNullOrUndefined(element)) { new SfContextMenu(element, target, filter, dotnetRef); }
        return Browser.isDevice;
    },
    contextMenuPosition(element: BlazorMenuElement, left: number, top: number, isRtl: boolean, subMenu?: boolean): Offset {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            return element.blazor__instance.contextMenuPosition(left, top, isRtl, subMenu);
        } else {
            return <Offset>{ Left: 0, Top: 0, ZIndex: 0, Width: 0 };
        }
    },
    subMenuPosition(element: BlazorMenuElement, isRtl: boolean, showOnClick: boolean, isNull?: boolean): Offset {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            return element.blazor__instance.subMenuPosition(isRtl, showOnClick, isNull);
        } else {
            return <Offset>{ Left: 0, Top: 0, Width: 0 };
        }
    },
    onPropertyChanged(element: BlazorMenuElement, key: string, value: string): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.onPropertyChanged(key, value);
        }
    },
    destroy(element: BlazorMenuElement, refElement: HTMLElement): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.destroy(refElement);
        }
    }
};

export default ContextMenu;