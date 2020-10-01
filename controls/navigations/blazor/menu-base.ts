import { select, closest } from '@syncfusion/ej2-base';

const MENUITEM: string = 'e-menu-item';
const FOCUSED: string = 'e-focused';
const SELECTED: string = 'e-selected';
const CONTAINER: string = 'e-menu-container';
const MENU: string = 'e-contextmenu';
const SUBMENU: string = 'e-ul';
const SEPARATOR: string = 'e-separator';
const DISABLED: string = 'e-disabled';
const HIDE: string = 'e-menu-hide';
const MENUPARENT: string = 'e-menu-parent';
const RTL: string = 'e-rtl';
const HAMBURGER: string = '.e-hamburger';
const SCROLLMENU: string = '.e-menu-vscroll';
const NONE: string = 'none';
const DOT: string = '.';
const ESC: number = 27;
const ENTER: number = 13;
const UP: number = 38;
const DOWN: number = 40;
const LEFT: number = 37;
const RIGHT: number = 39;

/**
 * Keyboard action handler common for menu and context menu.
 * @hidden
 */
export function keyActionHandler(container: HTMLElement, target: Element, keyCode: number, menuId?: string): void {
    if (keyCode === DOWN || keyCode === UP) {
        let index: number; let ul: Element; let focusedLi: Element;
        if (target.classList.contains(MENUPARENT)) {
            ul = target;
            focusedLi = ul.querySelector(`${DOT}${MENUITEM}${DOT}${FOCUSED}`);
            if (focusedLi) {
                index = Array.prototype.indexOf.call(ul.children, focusedLi);
                index = keyCode === DOWN ? (index === ul.childElementCount - 1 ? 0 : index + 1) :
                    (index === 0 ? ul.childElementCount - 1 : index - 1);
            } else {
                index = 0;
            }
            index = isValidLI(ul, index, keyCode === DOWN);
        } else if (target.classList.contains(MENUITEM)) {
            ul = target.parentElement;
            focusedLi = ul.querySelector(`${DOT}${MENUITEM}${DOT}${FOCUSED}`);
            index = Array.prototype.indexOf.call(ul.children, focusedLi ? focusedLi : target);
            index = keyCode === DOWN ? (index === ul.childElementCount - 1 ? 0 : index + 1) : (index === 0 ?
                ul.childElementCount - 1 : index - 1);
            index = isValidLI(ul, index, keyCode === DOWN);
        }
        if (ul && index !== -1) {
            (ul.children[index] as HTMLElement).focus();
        }
    } else if (((container.classList.contains(RTL) ? keyCode === RIGHT : keyCode === LEFT) || keyCode === ESC ||
        (keyCode === ENTER && closest(target, DOT + CONTAINER))) && (target.classList.contains(SUBMENU) ||
        (target.classList.contains(MENUITEM) && !(target.parentElement.classList.contains(MENU))))) {
        let menuContainer: Element;
        if (menuId) { menuContainer = select(menuId); }
        let ul: Element = target.classList.contains(SUBMENU) ? target : target.parentElement;
        let menu: Element = closest(ul, SCROLLMENU);
        let selectedLi: HTMLElement; let previousUl: Element = menu ? menu.previousElementSibling : ul.previousElementSibling;
        if (menuContainer && (!previousUl || keyCode === ENTER)) {
            selectedLi = select(`${DOT}${MENUITEM}${DOT}${SELECTED}`, menuContainer);
            menu = select(SCROLLMENU, container);
            // tslint:disable-next-line:no-any
            if (menu) { (menuContainer as any).blazor__instance.destroyScroll(NONE); }
        } else {
            let hamburgerMenu: Element = closest(ul, HAMBURGER);
            if (hamburgerMenu) {
                selectedLi = select(`${DOT}${MENUITEM}${DOT}${SELECTED}`, hamburgerMenu);
            } else {
                selectedLi = select(`${DOT}${MENUITEM}${DOT}${SELECTED}`, previousUl);
            }
        }
        if (selectedLi) { selectedLi.focus(); }
    }
}

function isValidLI(ul: Element, index: number, isKeyDown: boolean, count: number = 0): number {
    let cli: Element = ul.children[index];
    if (count === ul.childElementCount) { return -1; }
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