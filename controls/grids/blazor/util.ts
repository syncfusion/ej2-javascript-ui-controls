import { isNullOrUndefined, createElement, remove, classList } from '@syncfusion/ej2-base';
import { IPosition } from './interfaces';
import { SfGrid } from './sf-grid-fn';
/**
 * The function used to update Dom using requestAnimationFrame.
 * @param  {Function} fn - Function that contains the actual action
 * @return {Promise<T>}
 * @hidden
 */
export function getUpdateUsingRaf<T>(updateFunction: Function, callBack: Function): void {
    requestAnimationFrame(() => {
        try {
            callBack(null, updateFunction());
        } catch (e) {
            callBack(e);
        }
    });
}

/** @hidden */
let scrollWidth: number = null;

/** @hidden */
export function getScrollBarWidth(): number {
    if (scrollWidth !== null) { return scrollWidth; }
    let divNode: HTMLDivElement = document.createElement('div');
    let value: number = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    value = (divNode.offsetWidth - divNode.clientWidth) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}

export function getSiblingsHeight(element: HTMLElement): number { 
    let previous: number = getHeightFromDirection(element, 'previous');
    let next: number = getHeightFromDirection(element, 'next');
    return previous + next;
}

export function getHeightFromDirection(element: HTMLElement, direction: string): number {
    let sibling: HTMLElement = element[direction + 'ElementSibling'];
    let result: number = 0;
    let classList: string[] = ['e-gridheader', 'e-gridfooter', 'e-groupdroparea', 'e-gridpager', 'e-toolbar'];

    while (sibling) {
        if (classList.some((value: string) => sibling.classList.contains(value))) {
            result += sibling.offsetHeight;
        }
        sibling = sibling[direction + 'ElementSibling'];
    }

    return result;
}

/** @hidden */
export function parentsUntil(elem: Element, selector: string, isID?: boolean): Element {
    let parent: Element = elem;
    while (parent) {
        if (isID ? parent.id === selector : parent.classList.contains(selector)) {
            break;
        }
        parent = parent.parentElement;
    }
    return parent;
}

/** @hidden */
export function getElementIndex(element: Element, elements: Element[]): number {
    let index: number = -1;
    for (let i: number = 0, len: number = elements.length; i < len; i++) {
        if (elements[i].isEqualNode(element)) {
            index = i;
            break;
        }
    }
    return index;
}
/** @hidden */
export function inArray(value: Object, collection: Object[]): number {
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        if (collection[i] === value) {
            return i;
        }
    }
    return -1;
}
export function getPosition(e: MouseEvent | TouchEvent): IPosition {
    let position: IPosition = {} as IPosition;
    position.x = (isNullOrUndefined((e as MouseEvent).clientX) ? (e as TouchEvent).changedTouches[0].clientX :
        (e as MouseEvent).clientX);
    position.y = (isNullOrUndefined((e as MouseEvent).clientY) ? (e as TouchEvent).changedTouches[0].clientY :
        (e as MouseEvent).clientY);
    return position;
}

/**
 * @hidden
 */
export function iterateArrayOrObject<T, U>(collection: U[], predicate: (item: Object, index: number) => T): T[] {
    let result: T[] = [];
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        let pred: T = predicate(collection[i], i);
        if (!isNullOrUndefined(pred)) {
            result.push(<T>pred);
        }
    }
    return result;
}

/** @hidden */
export function isActionPrevent(element: HTMLElement): boolean {
    let dlg: HTMLElement = element.querySelector('#' + element.id + 'EditConfirm') as HTMLElement;
    return (element.querySelectorAll('.e-updatedtd').length) && (dlg ? dlg.classList.contains('e-popup-close') : true);
}

/**
 * @hidden
 */
export function isGroupAdaptive(grid: SfGrid): boolean {
    return (grid.options.enableVirtualization && grid.options.groupCount > 0 && (grid.options.offline || grid.options.url === ''));
}
        
/** @hidden */
let rowHeight: number;
/** @hidden */
export function getRowHeight(element?: HTMLElement): number {
    if (rowHeight !== undefined) {
        return rowHeight;
    }
    let table: HTMLTableElement = <HTMLTableElement>createElement('table', { className: 'e-table', styles: 'visibility: hidden' });
    table.innerHTML = '<tr><td class="e-rowcell">A<td></tr>';
    element.appendChild(table);
    let rect: ClientRect = table.querySelector('td').getBoundingClientRect();
    element.removeChild(table);
    rowHeight = Math.ceil(rect.height);
    return rowHeight;
}

export function removeElement(target: Element, selector: string): void {
    let elements: HTMLElement[] = [].slice.call(target.querySelectorAll(selector));
    for (let i: number = 0; i < elements.length; i++) {
        remove(elements[i]);
    }
}

/** @hidden */
export function addRemoveActiveClasses(cells: Element[], add: boolean, ...args: string[]): void {
    for (let i: number = 0, len: number = cells.length; i < len; i++) {
        if (add) {
            classList(cells[i], [...args], []);
            cells[i].setAttribute('aria-selected', 'true');
        } else {
            classList(cells[i], [], [...args]);
            cells[i].removeAttribute('aria-selected');
        }
    }
}
