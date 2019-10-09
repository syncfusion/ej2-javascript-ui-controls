import { Browser, setStyleAttribute as setBaseStyleAttribute, getComponent } from '@syncfusion/ej2-base';
import { StyleType } from './interface';
import { Spreadsheet } from '../base/index';
import { SheetModel, getCellPosition, getRowsHeight, getColumnsWidth, getSwapRange } from '../../workbook/index';

/**
 * The function used to update Dom using requestAnimationFrame.
 * @param  {Function} fn - Function that contains the actual action
 * @return {Promise<T>}
 * @hidden
 */
export function getUpdateUsingRaf(fn: Function): void {
    requestAnimationFrame(() => {
        fn();
    });
}

/**
 * The function used to remove the dom element children.
 * @param  parent - 
 * @hidden
 */
export function removeAllChildren(parent: Element, index?: number): void {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/**
 * The function used to remove the dom element children.
 * @param  parent - 
 * @hidden
 */
export function getColGroupWidth(index: number): number {
    let width: number = 30;
    if (index.toString().length > 3) {
        width = index.toString().length * 10;
    }
    return width;
}

let scrollAreaWidth: number = null;

/** @hidden */
export function getScrollBarWidth(): number {
    if (scrollAreaWidth !== null) { return scrollAreaWidth; }
    let htmlDivNode: HTMLDivElement = document.createElement('div');
    let result: number = 0;
    htmlDivNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(htmlDivNode);
    result = (htmlDivNode.offsetWidth - htmlDivNode.clientWidth) | 0;
    document.body.removeChild(htmlDivNode);
    return scrollAreaWidth = result;
}

let classes: string[] = ['e-ribbon', 'e-formula-bar-panel', 'e-sheet-tab-panel', 'e-header-toolbar'];

/** @hidden */
export function getSiblingsHeight(element: HTMLElement, classList: string[] = classes): number {
    let previous: number = getHeightFromDirection(element, 'previous', classList);
    let next: number = getHeightFromDirection(element, 'next', classList);
    return previous + next;
}

function getHeightFromDirection(element: HTMLElement, direction: string, classList: string[]): number {
    // tslint:disable-next-line:no-any
    let sibling: HTMLElement = (element as any)[direction + 'ElementSibling'];
    let result: number = 0;
    while (sibling) {
        if (classList.some((value: string) => sibling.classList.contains(value))) {
            result += sibling.offsetHeight;
        }
        // tslint:disable-next-line:no-any
        sibling = (sibling as any)[direction + 'ElementSibling'];
    }

    return result;
}

/**
 * @hidden
 */
export function inView(context: Spreadsheet, range: number[], isModify?: boolean): boolean {
    if (context.scrollSettings.enableVirtualization) {
        let topIdx: number = context.viewport.topIndex;
        let leftIdx: number = context.viewport.leftIndex;
        let bottomIdx: number = topIdx + context.viewport.rowCount + context.getThreshold('row') * 2;
        let rightIdx: number = leftIdx + context.viewport.colCount + context.getThreshold('col') * 2;
        let inView: boolean = topIdx <= range[0] && bottomIdx >= range[2] && leftIdx <= range[1] && rightIdx >= range[3];
        if (inView) { return true; }
        if (isModify) {
            if (range[0] < topIdx && range[2] < topIdx || range[0] > bottomIdx && range[2] > bottomIdx) {
                return false;
            } else {
                if (range[0] < topIdx && range[2] > topIdx) {
                    range[0] = topIdx;
                    inView = true;
                }
                if (range[2] > bottomIdx) {
                    range[2] = bottomIdx;
                    inView = true;
                }
            }
            if (range[1] < leftIdx && range[3] < leftIdx || range[1] > rightIdx && range[3] > rightIdx) {
                return false;
            } else {
                if (range[1] < leftIdx && range[3] > leftIdx) {
                    range[1] = leftIdx;
                    inView = true;
                }
                if (range[3] > rightIdx) {
                    range[3] = rightIdx;
                    inView = true;
                }
            }
        }
        return inView;
    } else {
        return true;
    }
}

/**
 * Position element with given range
 * @hidden
 */
export function locateElem(ele: Element, range: number[], sheet: SheetModel, isRtl?: boolean): void {
    let swapRange: number[] = getSwapRange(range);
    let cellPosition: { top: number, left: number } = getCellPosition(sheet, swapRange);
    let attrs: { [key: string]: string } = {
        'top': (swapRange[0] === 0 ? cellPosition.top : cellPosition.top - 1) + 'px',
        'height': getRowsHeight(sheet, range[0], range[2]) + (swapRange[0] === 0 ? 0 : 1) + 'px',
        'width': getColumnsWidth(sheet, range[1], range[3]) + (swapRange[1] === 0 ? 0 : 1) + 'px'
    };
    attrs[isRtl ? 'right' : 'left'] = (swapRange[1] === 0 ? cellPosition.left : cellPosition.left - 1) + 'px';
    setStyleAttribute([{ element: ele, attrs: attrs }]);
}

/**
 * To update element styles using request animation frame
 * @hidden
 */
export function setStyleAttribute(styles: StyleType[]): void {
    requestAnimationFrame(() => {
        styles.forEach((style: StyleType): void => {
            setBaseStyleAttribute(style.element as HTMLElement, style.attrs);
        });
    });
}

/**
 * @hidden
 */
export function getStartEvent(): string {
    return (Browser.isPointer ? 'pointerdown' : 'mousedown touchstart');
}

/**
 * @hidden
 */
export function getMoveEvent(): string {
    return (Browser.isPointer ? 'pointermove' : 'mousemove touchmove');
}

/**
 * @hidden
 */
export function getEndEvent(): string {
    return (Browser.isPointer ? 'pointerup' : 'mouseup touchend');
}

/**
 * @hidden
 */
export function isTouchStart(e: Event): boolean {
    return e.type === 'touchstart' || (e.type === 'pointerdown' && (e as PointerEvent).pointerType === 'touch');
}

/**
 * @hidden
 */
export function isTouchMove(e: Event): boolean {
    return e.type === 'touchmove' || (e.type === 'pointermove' && (e as PointerEvent).pointerType === 'touch');
}

/**
 * @hidden
 */
export function isTouchEnd(e: Event): boolean {
    return e.type === 'touchend' || (e.type === 'pointerup' && (e as PointerEvent).pointerType === 'touch');
}

/**
 * @hidden
 */
export function getClientX(e: TouchEvent & MouseEvent): number {
    return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
}

/**
 * @hidden
 */
export function getClientY(e: MouseEvent & TouchEvent): number {
    return e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
}

const config: IAriaOptions<string> = {
    role: 'role',
    selected: 'aria-selected',
    multiselectable: 'aria-multiselectable',
    busy: 'aria-busy',
    colcount: 'aria-colcount'
};


/** @hidden */
export interface IAriaOptions<T> {
    role?: string;
    selected?: T;
    multiselectable?: T;
    busy?: T;
    colcount?: string;
}

/** @hidden */
export function setAriaOptions(target: HTMLElement, options: IAriaOptions<boolean>): void {
    let props: string[] = Object.keys(options);
    props.forEach((name: string) => {
        if (target) { target.setAttribute(config[name], <string>options[name]); }
    });
}

/**
 * @hidden 
 */
export function destroyComponent(element: HTMLElement, component: Object): void {
    if (element) {
        let compObj: Object = getComponent(element, component);
        if (compObj) {
            (<{ destroy: Function }>compObj).destroy();
        }
    }
}