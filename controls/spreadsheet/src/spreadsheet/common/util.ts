import { Browser, setStyleAttribute as setBaseStyleAttribute, getComponent, detach, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { StyleType, CollaborativeEditArgs, CellSaveEventArgs, ICellRenderer, IAriaOptions } from './index';
import { IOffset, clearViewer, deleteImage, createImageElement, refreshImgCellObj } from './index';
import { Spreadsheet } from '../base/index';
import { SheetModel, getRowsHeight, getColumnsWidth, getSwapRange, CellModel, CellStyleModel, clearCells, setCellFormat, RowModel } from '../../workbook/index';
import { RangeModel, getRangeIndexes, Workbook, wrap, setRowHeight, insertModel, InsertDeleteModelArgs  } from '../../workbook/index';
import { BeforeSortEventArgs, SortEventArgs, initiateSort, getIndexesFromAddress, getRowHeight, setMerge } from '../../workbook/index';
import { ValidationModel, setValidation, removeValidation, clearCFRule, setCFRule, ConditionalFormatModel } from '../../workbook/index';
import { removeSheetTab, rowHeightChanged } from './index';
import { getCellIndexes, getCell, ChartModel, setChart, refreshChartSize } from '../../workbook/index';
import { deleteChart } from '../../spreadsheet/index';
import { initiateFilterUI } from './event';

/**
 * The function used to update Dom using requestAnimationFrame.
 *
 * @param  {Function} fn - Function that contains the actual action
 * @returns {void}
 * @hidden
 */
export function getUpdateUsingRaf(fn: Function): void {
    requestAnimationFrame(() => {
        fn();
    });
}

/**
 * The function used to remove the dom element children.
 *
 * @param  {Element} parent - Specify the parent
 * @param {number} index - specify the index.
 * @returns {void} - The function used to get colgroup width based on the row index.
 * @hidden
 */
export function removeAllChildren(parent: Element, index?: number): void {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/**
 * The function used to get colgroup width based on the row index.
 *
 * @param  {number} index - Specify the index
 * @returns {number} - The function used to get colgroup width based on the row index.
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

/**
 * @hidden
 * @returns {number} - To get scrollbar width
 */
export function getScrollBarWidth(): number {
    if (scrollAreaWidth !== null) { return scrollAreaWidth; }
    const htmlDivNode: HTMLDivElement = document.createElement('div');
    let result: number = 0;
    htmlDivNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(htmlDivNode);
    result = (htmlDivNode.offsetWidth - htmlDivNode.clientWidth) | 0;
    document.body.removeChild(htmlDivNode);
    return scrollAreaWidth = result;
}

const classes: string[] = ['e-ribbon', 'e-formula-bar-panel', 'e-sheet-tab-panel', 'e-header-toolbar'];

/**
 * @hidden
 * @param {HTMLElement} element - Specify the element.
 * @param {string[]} classList - Specify the classList.
 * @returns {number} - get Siblings Height
 */
export function getSiblingsHeight(element: HTMLElement, classList: string[] = classes): number {
    const previous: number = getHeightFromDirection(element, 'previous', classList);
    const next: number = getHeightFromDirection(element, 'next', classList);
    return previous + next;
}

/**
 * @param {HTMLElement} element - Specify the element.
 * @param {string} direction - Specify the direction.
 * @param {string[]} classList - Specify the classList.
 * @returns {number} - get Height FromDirection
 */
function getHeightFromDirection(element: HTMLElement, direction: string, classList: string[]): number {
    let sibling: HTMLElement = (element)[direction + 'ElementSibling'];
    let result: number = 0;
    while (sibling) {
        if (classList.some((value: string) => sibling.classList.contains(value))) {
            result += sibling.offsetHeight;
        }
        sibling = (sibling)[direction + 'ElementSibling'];
    }

    return result;
}

/**
 * @hidden
 * @param {Spreadsheet} context - Specify the spreadsheet.
 * @param {number[]} range - Specify the range.
 * @param {boolean} isModify - Specify the boolean value.
 * @returns {boolean} - Returns boolean value.
 */
export function inView(context: Spreadsheet, range: number[], isModify?: boolean): boolean {
    if (context.scrollSettings.enableVirtualization) {
        const topIdx: number = context.viewport.topIndex;
        const leftIdx: number = context.viewport.leftIndex;
        const bottomIdx: number = topIdx + context.viewport.rowCount + context.getThreshold('row') * 2;
        const rightIdx: number = leftIdx + context.viewport.colCount + context.getThreshold('col') * 2;
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
 * To get the top left cell position in viewport.
 *
 * @hidden
 * @param {SheetModel} sheet - Specify the sheet.
 * @param {number[]} indexes - specify the indexes.
 * @param {number} frozenRow - Specidy the frozen row.
 * @param {number} frozenColumn - Specify the frozen column
 * @returns {number} - To get the top left cell position in viewport.
 */
export function getCellPosition(
    sheet: SheetModel, indexes: number[],
    frozenRow?: number, frozenColumn?: number, freezeScrollHeight?: number, freezeScrollWidth?: number,
    rowHdrWidth?: number): { top: number, left: number } {
    let i: number; const offset: { left: IOffset, top: IOffset } = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } };
    let top: number = offset.top.size;
    let left: number = offset.left.size;
    for (i = offset.top.idx; i < indexes[0]; i++) {
        if (frozenRow) {
            if (frozenRow - 1 < indexes[0] && i < frozenRow) { continue; }
        }
        top += getRowsHeight(sheet, i);
    }
    for (i = offset.left.idx; i < indexes[1]; i++) {
        if (frozenColumn && frozenColumn - 1 < indexes[1] && i < frozenColumn) { continue; }
        left += getColumnsWidth(sheet, i);
    }
    if (frozenRow && indexes[0] < frozenRow) {
        if (sheet.showHeaders) { top += 30; }
        if (freezeScrollHeight) { top -= freezeScrollHeight; }
    }
    if (frozenColumn && indexes[1] < frozenColumn) {
        if (sheet.showHeaders) { left += rowHdrWidth ? rowHdrWidth : 30; }
        if (freezeScrollWidth) { left -= freezeScrollWidth; }
    }
    return { top: top, left: left };
}

/**
 * @hidden
 */
export function setPosition(parent: Spreadsheet, ele: HTMLElement, range: number[], cls: string = 'e-selection'): void {
    const sheet: SheetModel = parent.getActiveSheet();
    if (sheet.frozenRows || sheet.frozenColumns) {
        let content: HTMLElement;
        const frozenRow: number = parent.frozenRowCount(sheet); let frozenCol: number = parent.frozenColCount(sheet);
        if (cls === 'e-active-cell') {
            if (range[0] < frozenRow || range[1] < frozenCol) {
                ele.style.display = 'none';
                content = range[0] < frozenRow && range[1] < frozenCol ? parent.getSelectAllContent() :
                    (range[0] < frozenRow ? parent.getColumnHeaderContent() : parent.getRowHeaderContent());
                let rangeEle: HTMLElement = content.querySelector('.' + cls);
                if (!rangeEle) { rangeEle = ele.cloneNode(true) as HTMLElement; content.appendChild(rangeEle); }
                ele = rangeEle;
                locateElem(
                    ele, range, sheet, parent.enableRtl, frozenRow, frozenCol, true, parent.viewport.beforeFreezeHeight,
                    parent.viewport.beforeFreezeWidth, parent.sheetModule.colGroupWidth);
            } else {
                locateElem(ele, range, sheet, parent.enableRtl, frozenRow, frozenCol);
            }
            if (ele.style.display) { ele.style.display = ''; }
            removeRangeEle(parent.getSelectAllContent(), content, true);
            removeRangeEle(parent.getColumnHeaderContent(), content, true);
            removeRangeEle(parent.getRowHeaderContent(), content, true);
        } else {
            const swapRange: number[] = getSwapRange(range);
            if (swapRange[0] < frozenRow || swapRange[1] < frozenCol) {
                ele.classList.add('e-hide');
                const ranges: number[][] = [];
                if (swapRange[0] < frozenRow && swapRange[1] < frozenCol) {
                    if (swapRange[2] < frozenRow && swapRange[3] < frozenCol) {
                        ranges.push(range);
                        removeRangeEle(parent.getColumnHeaderContent(), content, false);
                        removeRangeEle(parent.getRowHeaderContent(), content, false);
                    } else if (swapRange[2] > frozenRow - 1) {
                        if (swapRange[3] < frozenCol) {
                            removeRangeEle(parent.getColumnHeaderContent(), content, false);
                            ranges.push([swapRange[0], swapRange[1], frozenRow - 1, swapRange[3]]);
                            ranges.push([frozenRow, swapRange[1], swapRange[2], swapRange[3]]);
                        } else {
                            ranges.push([swapRange[0], swapRange[1], frozenRow - 1, frozenCol - 1]);
                            ranges.push([frozenRow, swapRange[1], swapRange[2], frozenCol - 1]);
                            ranges.push([swapRange[0], frozenCol, frozenRow - 1, swapRange[3]]);
                            ranges.push([frozenRow, frozenCol, swapRange[2], swapRange[3]]);
                        }
                    } else {
                        if (swapRange[2] < frozenRow) {
                            ranges.push([swapRange[0], swapRange[1], swapRange[2], frozenCol - 1]);
                            ranges.push([swapRange[0], frozenCol, swapRange[2], swapRange[3]]);
                            removeRangeEle(parent.getRowHeaderContent(), content, false);
                        } else {
                            ranges.push([frozenRow, swapRange[1], swapRange[2], frozenCol - 1]);
                            ranges.push([swapRange[0], swapRange[1], frozenRow - 1, frozenCol - 1]);
                            ranges.push([frozenRow, frozenCol, swapRange[2], swapRange[3]]);
                            ranges.push([swapRange[0], frozenCol, frozenRow - 1, swapRange[3]]);
                        }
                    }
                } else if (swapRange[0] < frozenRow) {
                    if (swapRange[2] < frozenRow) {
                        ranges.push(range);
                    } else {
                        ranges.push([swapRange[0], swapRange[1], frozenRow - 1, swapRange[3]]);
                        ranges.push([frozenRow, swapRange[1], swapRange[2], swapRange[3]]);
                        removeRangeEle(parent.getSelectAllContent(), content, false);
                        removeRangeEle(parent.getRowHeaderContent(), content, false);
                    }
                } else {
                    if (swapRange[3] < frozenCol) {
                        ranges.push(range);
                    } else {
                        ranges.push([swapRange[0], swapRange[1], swapRange[2], frozenCol - 1]);
                        ranges.push([swapRange[0], frozenCol, swapRange[2], swapRange[3]]);
                        removeRangeEle(parent.getSelectAllContent(), content, false);
                        removeRangeEle(parent.getColumnHeaderContent(), content, false);
                    }
                }
                let removeEle: Element;
                ranges.forEach((rng: number[]): void => {
                    content = rng[2] < frozenRow && rng[3] < frozenCol ? parent.getSelectAllContent() :
                        (rng[2] < frozenRow ? parent.getColumnHeaderContent() : (rng[3] < frozenCol ?
                            parent.getRowHeaderContent() : parent.getMainContent() as HTMLElement));
                    let rangeEle: HTMLElement;
                    if (cls === 'e-copy-indicator' || cls === 'e-range-indicator') {
                        rangeEle = ele.cloneNode(true) as HTMLElement; content.appendChild(rangeEle);
                        if (frozenRow) {
                            if (rng[2] + 1 === frozenRow) {
                                ranges.forEach((subRng: number[]): void => {
                                    if (subRng != rng) {
                                        removeEle = rangeEle.getElementsByClassName('e-bottom')[0];
                                        if (removeEle && subRng[0] === frozenRow) { detach(removeEle); }
                                    }
                                });
                            }
                            if (rng[0] === frozenRow && content.parentElement.classList.contains('e-main-panel')) {
                                ranges.forEach((subRng: number[]): void => {
                                    if (subRng != rng) {
                                        removeEle = rangeEle.getElementsByClassName('e-top')[0];
                                        if (removeEle && subRng[2] + 1 === frozenRow) { detach(removeEle); }
                                    }
                                });
                            }
                        }
                        if (frozenCol) {
                            if (rng[3] + 1 === frozenCol) {
                                ranges.forEach((subRng: number[]): void => {
                                    if (subRng != rng) {
                                        removeEle = rangeEle.getElementsByClassName('e-right')[0];
                                        if (removeEle && subRng[1] === frozenCol) { detach(removeEle); }
                                    }
                                });
                            }
                            if (rng[1] === frozenCol && (content.classList.contains('e-sheet-content') || content.classList.contains('e-column-header'))) {
                                ranges.forEach((subRng: number[]): void => {
                                    if (subRng != rng) {
                                        removeEle = rangeEle.getElementsByClassName('e-left')[0];
                                        if (removeEle && subRng[3] + 1 === frozenCol) { detach(removeEle); }
                                    }
                                });
                            }
                        }
                    } else {
                        rangeEle = content.querySelector('.' + cls);
                        if (!rangeEle) {
                            rangeEle = ele.cloneNode(true) as HTMLElement; content.appendChild(rangeEle);
                        }
                    }
                    locateElem(
                        rangeEle, rng, sheet, parent.enableRtl, frozenRow, frozenCol, false, parent.viewport.beforeFreezeHeight,
                        parent.viewport.beforeFreezeWidth, parent.sheetModule.colGroupWidth);
                    if (rangeEle.classList.contains('e-hide')) { rangeEle.classList.remove('e-hide'); }
                });
            } else {
                removeRangeEle(parent.getSelectAllContent(), null, false);
                removeRangeEle(parent.getColumnHeaderContent(), null, false);
                removeRangeEle(parent.getRowHeaderContent(), null, false);
                locateElem(ele, range, sheet, parent.enableRtl, frozenRow, frozenCol);
                if (cls === 'e-range-indicator' || !parent.getMainContent().querySelector('.' + cls)) {
                    parent.getMainContent().appendChild(ele);
                }
            }
        }
    } else {
        locateElem(ele, range, sheet, parent.enableRtl, 0, 0);
        if (ele && !parent.getMainContent().querySelector('.' + cls)) { parent.getMainContent().appendChild(ele); }
    }
}
/**
 * @hidden
 */
export function removeRangeEle(content: Element, checkEle: HTMLElement, checkActiveCell: boolean): void {
    let ele: HTMLElement;
    if (checkActiveCell) {
        if (content !== checkEle) {
            ele = content.querySelector('.e-active-cell');
            if (ele) { detach(ele); }
        }
    } else {
        ele = content.querySelector('.e-selection');
        if (ele) { detach(ele); }
    }
}

/**
 * Position element with given range
 *
 * @hidden
 * @param {HTMLElement} ele - Specify the element.
 * @param {number[]} range - specify the range.
 * @param {SheetModel} sheet - Specify the sheet.
 * @param {boolean} isRtl - Specify the boolean value.
 * @param {number} frozenRow - Specidy the frozen row.
 * @param {number} frozenColumn - Specify the frozen column
 * @returns {void} - Position element with given range
 */
export function locateElem(
    ele: HTMLElement, range: number[], sheet: SheetModel, isRtl: boolean, frozenRow?: number, frozenColumn?: number,
    isActiveCell?: boolean, freezeScrollHeight?: number, freezeScrollWidth?: number, rowHdrWidth?: number): void {
    let swapRange: number[] = getSwapRange(range);
    let cellPosition: { top: number, left: number } = getCellPosition(
        sheet, swapRange, frozenRow, frozenColumn, freezeScrollHeight, freezeScrollWidth, rowHdrWidth);
    let startIndex: number[] = [skipHiddenIdx(sheet, 0, true), skipHiddenIdx(sheet, 0, true, 'columns')];
    let attrs: { [key: string]: string } = {
        'top': (swapRange[0] === startIndex[0] ? cellPosition.top : cellPosition.top - 1) + 'px',
        'height': getRowsHeight(sheet, range[0], range[2]) + (swapRange[0] === startIndex[0] ? 0 : 1) + 'px',
        'width': getColumnsWidth(sheet, range[1], range[3]) + (swapRange[1] === startIndex[1] ? 0 : 1) + (isActiveCell && frozenColumn &&
            swapRange[1] < frozenColumn && swapRange[3] >= frozenColumn ? 1 : 0) + 'px'
    };
    attrs[isRtl ? 'right' : 'left'] = (swapRange[1] === startIndex[1] ? cellPosition.left : cellPosition.left - 1) + 'px';
    if (ele) { setStyleAttribute([{ element: ele, attrs: attrs }]); }
}

/**
 * To update element styles using request animation frame
 *
 * @hidden
 * @param {StyleType[]} styles - Specify the styles
 * @returns {void} - To update element styles using request animation frame
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
 * @returns {string} - to get Start Event
 */
export function getStartEvent(): string {
    return (Browser.isPointer ? 'pointerdown' : 'mousedown touchstart');
}

/**
 * @hidden
 * @returns {string} - to get Move Event
 */
export function getMoveEvent(): string {
    return (Browser.isPointer ? 'pointermove' : 'mousemove touchmove');
}

/**
 * @hidden
 * @returns {string} - Returns string value.
 */
export function getEndEvent(): string {
    return (Browser.isPointer ? 'pointerup' : 'mouseup touchend');
}

/**
 * @hidden
 * @param {Event} e - To specify the event.
 * @returns {boolean} - Returns boolean value.
 */
export function isTouchStart(e: Event): boolean {
    return e.type === 'touchstart' || (e.type === 'pointerdown' && (e as PointerEvent).pointerType === 'touch');
}

/**
 * @hidden
 * @param {Event} e - To specify the event.
 * @returns {boolean} - Returns boolean value.
 */
export function isTouchMove(e: Event): boolean {
    return e.type === 'touchmove' || (e.type === 'pointermove' && (e as PointerEvent).pointerType === 'touch');
}

/**
 * @hidden
 * @param {Event} e - To specify the event.
 * @returns {boolean} - Returns boolean value.
 */
export function isTouchEnd(e: Event): boolean {
    return e.type === 'touchend' || (e.type === 'pointerup' && (e as PointerEvent).pointerType === 'touch');
}

/**
 * @hidden
 * @param {TouchEvent | MouseEvent} e - To specify the mouse and touch event.
 * @returns {number} - To get client value
 */
export function isMouseDown(e: MouseEvent): boolean {
    return e && (e.type === 'mousedown' || e.type === 'pointerdown');
}

/**
 * @hidden
 */
export function isMouseMove(e: MouseEvent): boolean {
    return e && (e.type === 'mousemove' || e.type === 'pointermove');
}

/**
 * @hidden
 */
export function isMouseUp(e: MouseEvent): boolean {
    return e && (e.type === 'mouseup' || e.type === 'pointerup');
}

/**
 * @hidden
 */
export function getClientX(e: TouchEvent & MouseEvent): number {
    return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
}

/**
 * @hidden
 * @param {MouseEvent | TouchEvent} e - To specify the mouse and touch event.
 * @returns {number} - To get client value
 */
export function getClientY(e: MouseEvent & TouchEvent): number {
    return e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
}

/**
 * Get even number based on device pixel ratio
 * @hidden
 */
export function getDPRValue(value: number) {
    return window.devicePixelRatio % 1 > 0 ? value % 2 === 0 ? value : value + 1 : value;
}

/**
 * @hidden
 */
function getDPRWidth(value: number) {
    if (window.devicePixelRatio % 1 > 0) {
        const pointValue = (value * window.devicePixelRatio) % 1;
        return value + (pointValue ? (1 - parseFloat(pointValue.toFixed(2))) / window.devicePixelRatio : 0);
    } else {
        return value;
    }
}

const config: IAriaOptions<string> = {
    role: 'role',
    selected: 'aria-selected',
    multiselectable: 'aria-multiselectable',
    busy: 'aria-busy',
    colcount: 'aria-colcount'
};

/**
 * @hidden
 * @param {HTMLElement} target - specify the target.
 * @param {IAriaOptions<boolean>} options - Specify the options.
 * @returns {void} -  to set Aria Options
 */
export function setAriaOptions(target: HTMLElement, options: IAriaOptions<boolean>): void {
    const props: string[] = Object.keys(options);
    props.forEach((name: string) => {
        if (target) { target.setAttribute(config[name], <string>options[name]); }
    });
}

/**
 * @hidden
 * @param {HTMLElement} element - specify the element.
 * @param {Object} component - Specify the component.
 * @returns {void} -  to destroy the component.
 */
export function destroyComponent(element: HTMLElement, component: Object): void {
    if (element) {
        const compObj: Object = getComponent(element, component);
        if (compObj) {
            (<{ destroy: Function }>compObj).destroy();
        }
    }
}

/**
 * @hidden
 * @param {number} index - Specify the index
 * @param {string} value - Specify the value.
 * @param {boolean} isCol - Specify the boolean value.
 * @param {Spreadsheet} parent - Specify the parent.
 * @returns {void} - To set resize.
 */
export function setResize(idx: number, index: number, value: string, isCol: boolean, parent: Spreadsheet): void {
    let curEle: HTMLElement;
    let curEleH: HTMLElement;
    let curEleC: HTMLElement;
    let preEle: HTMLElement;
    let preEleH: HTMLElement;
    let preEleC: HTMLElement;
    let nxtEle: HTMLElement;
    let nxtEleH: HTMLElement;
    let nxtEleC: HTMLElement;
    const sheet: SheetModel = parent.getActiveSheet();
    const frozenRow: number = parent.frozenRowCount(sheet); const frozenCol: number = parent.frozenColCount(sheet);
    if (isCol) {
        let header: Element = idx < frozenCol ? parent.getSelectAllContent() : parent.getColumnHeaderContent();
        curEle = header.getElementsByTagName('th')[index]; curEleH = header.getElementsByTagName('col')[index];
        curEleC = (idx < frozenCol ? parent.getRowHeaderContent() : parent.getMainContent()).getElementsByTagName('col')[index];
    } else {
        curEle = curEleH = frozenRow || frozenCol ? parent.getRow(idx, null, frozenCol - 1) :
            parent.getRow(idx, parent.getRowHeaderTable());
        curEleH.style.height = parseInt(value, 10) > 0 ? getDPRValue(parseInt(value, 10)) + 'px' : '2px';
        curEleC = parent.getRow(idx, null, frozenCol);
        curEleC.style.height = parseInt(value, 10) > 0 ? getDPRValue(parseInt(value, 10)) + 'px' : '0px';
        let hdrFntSize: number;
        if (sheet.showHeaders) {
            const hdrRow: HTMLCollectionOf<HTMLTableRowElement> =
                parent.getRowHeaderContent().getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
            const hdrClone: HTMLElement[] = [];
            hdrClone[0] = hdrRow[index].getElementsByTagName('td')[0].cloneNode(true) as HTMLElement;
            hdrFntSize = findMaxValue(parent.getRowHeaderTable(), hdrClone, false, parent) + 1;
        }
        const contentRow: HTMLCollectionOf<HTMLTableRowElement> =
            parent.getMainContent().getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
        const contentClone: HTMLElement[] = [];
        for (let idx: number = 0; idx < contentRow[index].getElementsByTagName('td').length; idx++) {
            contentClone[idx] = contentRow[index].getElementsByTagName('td')[idx].cloneNode(true) as HTMLElement;
        }
        const cntFntSize: number = findMaxValue(parent.getContentTable(), contentClone, false, parent) + 1;
        const fntSize: number = hdrFntSize >= cntFntSize ? hdrFntSize : cntFntSize;
        if (parseInt(curEleC.style.height, 10) < fntSize ||
            (curEle && curEle.classList.contains('e-reach-fntsize') && parseInt(curEleC.style.height, 10) === fntSize)) {
            if (sheet.showHeaders) {
                curEle.classList.add('e-reach-fntsize');
                curEleH.style.lineHeight = parseInt(value, 10) >= 4 ? ((parseInt(value, 10)) - 4) + 'px' :
                    parseInt(value, 10) > 0 ? ((parseInt(value, 10)) - 1) + 'px' : '0px';
            }
            curEleC.style.lineHeight = parseInt(value, 10) > 0 ? ((parseInt(value, 10)) - 1) + 'px' : '0px';
        } else {
            if (curEleH) { curEleH.style.removeProperty('line-height'); }
            curEleC.style.removeProperty('line-height');
            if (curEle && curEle.classList.contains('e-reach-fntsize')) {
                curEle.classList.remove('e-reach-fntsize');
            }
        }
    }
    preEleC = curEleC.previousElementSibling as HTMLElement;
    nxtEleC = curEleC.nextElementSibling as HTMLElement;
    if (preEleC) {
        if (sheet.showHeaders) {
            preEle = curEle.previousElementSibling as HTMLElement;
            preEleH = curEleH.previousElementSibling as HTMLElement;
        }
        preEleC = curEleC.previousElementSibling as HTMLElement;
    }
    if (nxtEleC) {
        if (sheet.showHeaders) {
            nxtEle = curEle.nextElementSibling as HTMLElement;
            nxtEleH = curEleH.nextElementSibling as HTMLElement;
        }
        nxtEleC = curEleC.nextElementSibling as HTMLElement;
    }
    if (parseInt(value, 10) <= 0 && !(curEleC.classList.contains('e-zero') || curEleC.classList.contains('e-zero-start'))) {
        if (preEleC && nxtEleC) {
            if (isCol) {
                if (sheet.showHeaders) { curEleH.style.width = '2px'; }
                curEleC.style.width = '0px';
            } else {
                if (sheet.showHeaders) { curEleH.style.height = '2px'; }
                curEleC.style.height = '0px';
            }
            if (preEleC.classList.contains('e-zero-start')) {
                if (sheet.showHeaders) { curEle.classList.add('e-zero-start'); }
                curEleC.classList.add('e-zero-start');
            } else {
                if (sheet.showHeaders) { curEle.classList.add('e-zero'); }
                curEleC.classList.add('e-zero');
            }
            if (nxtEle && !nxtEle.classList.contains('e-zero') && !nxtEle.classList.contains('e-zero-last')) {
                if (sheet.showHeaders) { curEle.classList.add('e-zero-last'); }
                curEleC.classList.add('e-zero-last');
            }
            if (preEleC.classList.contains('e-zero-last')) {
                if (sheet.showHeaders) { preEle.classList.remove('e-zero-last'); }
                preEleC.classList.remove('e-zero-last');
            }
            if (sheet.showHeaders && preEle.classList.contains('e-zero')) {
                if (curEle.classList.contains('e-zero-end')) {
                    setWidthAndHeight(preEleH, -2, isCol);
                } else {
                    setWidthAndHeight(preEleH, -2, isCol);
                }
            } else if (sheet.showHeaders) {
                setWidthAndHeight(preEleH, -1, isCol);
            }

            if (sheet.showHeaders && preEle.classList.contains('e-zero-start')) {
                setWidthAndHeight(curEleH, -1, isCol);
            }
            if (sheet.showHeaders && nxtEle.classList.contains('e-zero')) {
                if (curEle.classList.contains('e-zero-start')) {
                    while (nxtEle) {
                        if (nxtEle.classList.contains('e-zero') && (parseInt(nxtEleH.style.height, 10) !== 0 && !isCol) ||
                            (parseInt(nxtEleH.style.width, 10) !== 0 && isCol)) {
                            if (isCol) {
                                curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                                nxtEleH.style.width = parseInt(nxtEleH.style.width, 10) - 1 + 'px';
                            } else {
                                curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                                nxtEleH.style.height = parseInt(nxtEleH.style.height, 10) - 1 + 'px';
                            }
                            nxtEle.classList.remove('e-zero');
                            nxtEle.classList.add('e-zero-start');
                            break;
                        } else {
                            let nxtIndex: number;
                            nxtEle.classList.remove('e-zero');
                            nxtEle.classList.add('e-zero-start');
                            if (isCol) {
                                nxtIndex = parseInt(nxtEle.getAttribute('aria-colindex'), 10) - 1;
                                nxtEle = parent.getColHeaderTable().getElementsByTagName('th')[nxtIndex + 1];
                                nxtEleH = parent.getColHeaderTable().getElementsByTagName('col')[nxtIndex + 1];
                            } else {
                                nxtIndex = parseInt(nxtEle.getAttribute('aria-rowindex'), 10) - 1;
                                nxtEle = parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                                nxtEleH = parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                            }
                        }
                    }
                } else {
                    setWidthAndHeight(curEleH, -2, isCol);
                }
            } else if (sheet.showHeaders) {
                if (nxtEle.classList.contains('e-zero-end')) {
                    if (isCol) {
                        curEleH.style.width = '0px';
                    } else {
                        curEleH.style.height = '0px';
                    }
                } else {
                    setWidthAndHeight(nxtEleH, -1, isCol);
                }
            }
        } else if (preEleC) {
            if (isCol) {
                if (sheet.showHeaders) { curEleH.style.width = '1px'; }
                curEleC.style.width = '0px';
            } else {
                if (sheet.showHeaders) { curEleH.style.height = '1px'; }
                curEleC.style.height = '0px';
            }
            if (sheet.showHeaders) { curEle.classList.add('e-zero-end'); }
            curEleC.classList.add('e-zero-end');
            if (sheet.showHeaders) { curEle.classList.add('e-zero-last'); }
            curEleC.classList.add('e-zero-last');
            if (sheet.showHeaders && preEle.classList.contains('e-zero')) {
                setWidthAndHeight(preEleH, -2, isCol);
            } else {
                setWidthAndHeight(preEleH, -1, isCol);
            }
        } else if (nxtEle) {
            curEle.classList.add('e-zero-start');
            curEleC.classList.add('e-zero-start');
            if (!nxtEle.classList.contains('e-zero')) {
                curEle.classList.add('e-zero-last');
                curEleC.classList.add('e-zero-last');
            }
            if (isCol) {
                curEleH.style.width = '1px';
                curEleC.style.width = '0px';
            } else {
                curEleH.style.height = '1px';
                curEleC.style.height = '0px';
            }
            if (sheet.showHeaders && nxtEle.classList.contains('e-zero')) {
                while (nxtEle) {
                    if (nxtEle.classList.contains('e-zero') && (parseInt(nxtEleH.style.width, 10) !== 0
                        && isCol) || (parseInt(nxtEleH.style.height, 10) !== 0 && !isCol)) {
                        if (isCol) {
                            nxtEleH.style.width = parseInt(nxtEleH.style.width, 10) - 1 + 'px';
                            curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                        } else {
                            nxtEleH.style.height = parseInt(nxtEleH.style.height, 10) - 1 + 'px';
                            curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                        }
                        nxtEle.classList.add('e-zero-start');
                        nxtEle.classList.remove('e-zero');
                        break;
                    } else {
                        let nxtIndex: number;
                        nxtEle.classList.add('e-zero-start');
                        nxtEle.classList.remove('e-zero');
                        if (isCol) {
                            nxtIndex = parseInt(nxtEle.getAttribute('aria-colindex'), 10) - 1;
                            nxtEleH = parent.getColHeaderTable().getElementsByTagName('col')[nxtIndex + 1];
                            nxtEle = parent.getColHeaderTable().getElementsByTagName('th')[nxtIndex + 1];
                        } else {
                            nxtIndex = parseInt(nxtEle.getAttribute('aria-rowindex'), 10) - 1;
                            nxtEleH = parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                            nxtEle = parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                        }
                    }
                }

            } else if (sheet.showHeaders) {
                setWidthAndHeight(nxtEleH, -1, isCol);
            }
        }
    } else if (parseInt(value, 10) > 0) {
        const DPRValue: string = getDPRValue(parseInt(value, 10)) + 'px'
        if (isCol) {
            curEleH.style.width = DPRValue;
            curEleC.style.width = DPRValue;
        } else {
            curEleH.style.height = DPRValue;
            curEleC.style.height = DPRValue;
        }
        if (sheet.showHeaders && preEle && nxtEle) {
            if (preEle.classList.contains('e-zero')) {
                if (curEle.classList.contains('e-zero')) {
                    if (isCol) {
                        preEleH.style.width = parseInt(preEleH.style.width, 10) + 2 + 'px';
                        curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                    } else {
                        preEleH.style.height = parseInt(preEleH.style.height, 10) + 2 + 'px';
                        curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                    }
                } else {
                    setWidthAndHeight(curEleH, -1, isCol);
                }
            } else {
                if (curEle.classList.contains('e-zero')) {
                    setWidthAndHeight(preEleH, 1, isCol);
                } else {
                    if (curEle.classList.contains('e-zero-start')) {
                        if (isCol) {
                            preEleH.style.width = parseInt(preEleH.style.width, 10) + 1 + 'px';
                            curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                        } else {
                            preEleH.style.height = parseInt(preEleH.style.height, 10) + 1 + 'px';
                            curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                        }

                    }
                }
            }
            if (nxtEle.classList.contains('e-zero')) {
                setWidthAndHeight(curEleH, -1, isCol);
            } else {
                if (curEle.classList.contains('e-zero') || curEle.classList.contains('e-zero-start')) {
                    setWidthAndHeight(nxtEleH, 1, isCol);
                }
            }
            if (curEle.classList.contains('e-zero')) { curEle.classList.remove('e-zero'); }
            if (curEle.classList.contains('e-zero-start')) { curEle.classList.remove('e-zero-start'); }
            if (curEleC.classList.contains('e-zero')) { curEleC.classList.remove('e-zero'); }
            if (curEleC.classList.contains('e-zero-start')) { curEleC.classList.remove('e-zero-start'); }

            if (curEle.classList.contains('e-zero-last')) { curEle.classList.remove('e-zero-last'); }
            if (curEleC.classList.contains('e-zero-last')) { curEleC.classList.remove('e-zero-last'); }
            if (preEle.classList.contains('e-zero') || preEle.classList.contains('e-zero-start')) {
                preEle.classList.add('e-zero-last');
                preEleC.classList.add('e-zero-last');
            }
        } else if (sheet.showHeaders && preEle) {
            if (preEle.classList.contains('e-zero')) {
                if (curEle.classList.contains('e-zero')) {
                    if (isCol) {
                        curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                        preEleH.style.width = parseInt(preEleH.style.width, 10) + 2 + 'px';
                    } else {
                        curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                        preEleH.style.height = parseInt(preEleH.style.height, 10) + 2 + 'px';
                    }
                } else {
                    setWidthAndHeight(curEleH, -1, isCol);
                }
            } else {
                if (curEle.classList.contains('e-zero')) {
                    setWidthAndHeight(preEleH, 1, isCol);
                } else {
                    setWidthAndHeight(curEleH, -1, isCol);
                }
            }
            if (curEle.classList.contains('e-zero')) { curEle.classList.remove('e-zero'); }
            if (curEle.classList.contains('e-zero-end')) { curEle.classList.remove('e-zero-end'); }
            if (curEleC.classList.contains('e-zero')) { curEleC.classList.remove('e-zero'); }
            if (curEleC.classList.contains('e-zero-end')) { curEleC.classList.remove('e-zero-end'); }
        } else if (sheet.showHeaders && nxtEle) {
            if (nxtEle.classList.contains('e-zero')) {
                setWidthAndHeight(curEleH, -1, isCol);
            } else if (curEle.classList.contains('e-zero-start')) {
                setWidthAndHeight(nxtEleH, 1, isCol);
                curEle.classList.remove('e-zero-start');
            }
            if (curEle.classList.contains('e-zero')) { curEle.classList.remove('e-zero'); }
            if (curEleC.classList.contains('e-zero')) { curEleC.classList.remove('e-zero'); }
            if (curEle.classList.contains('e-zero-start')) { curEle.classList.remove('e-zero-start'); }
            if (curEleC.classList.contains('e-zero-start')) { curEleC.classList.remove('e-zero-start'); }
        }
    }
}

/**
 * @hidden
 * @param {HTMLElement} trgt - Specify the target element.
 * @param {number} value - specify the number.
 * @param {boolean} isCol - Specify the boolean vlaue.
 * @returns {void} -  to set width and height.
 */
export function setWidthAndHeight(trgt: HTMLElement, value: number, isCol: boolean): void {
    if (isCol) {
        trgt.style.width = parseInt(trgt.style.width, 10) + value + 'px';
    } else {
        trgt.style.height = parseInt(trgt.style.height, 10) + value + 'px';
    }
}

/**
 * @hidden
 * @param {HTMLElement} table - Specify the table.
 * @param {HTMLElement[]} text - specify the text.
 * @param {boolean} isCol - Specifyt boolean value
 * @param {Spreadsheet} parent - Specify the parent.
 * @param {string} prevData - specify the prevData.
 * @param {boolean} isWrap - Specifyt boolean value
 * @returns {number} - To find maximum value.
 */
export function findMaxValue(
    table: HTMLElement, text: HTMLElement[], isCol: boolean, parent: Spreadsheet, prevData?: string, isWrap?: boolean): number {
    const myTableDiv: HTMLElement = parent.createElement('div', { className: parent.element.className, styles: 'display: block' });
    const myTable: HTMLElement = parent.createElement('table', {
        className: table.className + 'e-resizetable',
        styles: 'width: auto;height: auto'
    });
    const myTr: HTMLElement = parent.createElement('tr');
    if (isCol) {
        text.forEach((element: Element) => {
            const tr: Element = (<Element>myTr.cloneNode());
            tr.appendChild(element);
            myTable.appendChild(tr);
        });
    } else {
        text.forEach((element: Element) => {
            myTr.appendChild(<Element>element.cloneNode(true));
        });
        myTable.appendChild(myTr);
    }
    myTableDiv.appendChild(myTable);
    document.body.appendChild(myTableDiv);
    let offsetWidthValue: number;
    let offsetHeightValue: number;
    let tableMaxWidth: number = myTable.getBoundingClientRect().width;
    let tableMaxHeight: number = myTable.getBoundingClientRect().height;
    if (!isWrap) {
        offsetHeightValue = tableMaxHeight;
        offsetWidthValue = tableMaxWidth;
    } else {
        if (isCol && parseInt(prevData, 10) > tableMaxWidth)
        {
            offsetWidthValue = tableMaxWidth;
        } else {
            offsetWidthValue = parseInt(prevData, 10);
        }
        if (!isCol && parseInt(prevData, 10) > tableMaxHeight)
        {
            offsetHeightValue = tableMaxHeight;
        } else {
            offsetHeightValue = parseInt(prevData, 10);
        }  
    }
    document.body.removeChild(myTableDiv);
    if (isCol) {
        return Math.ceil(offsetWidthValue);
    } else {
        return Math.ceil(offsetHeightValue);
    }
}
/**
 * @hidden
 * @param {CollaborativeEditArgs} options - Specify the collaborative edit arguments.
 * @param {Spreadsheet} spreadsheet - specify the spreadsheet.
 * @param {boolean} isRedo - Specifyt he boolean value.
 * @returns {void} - To update the Action.
 */
export function updateAction(options: CollaborativeEditArgs, spreadsheet: Spreadsheet, isRedo?: boolean): void {
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    const eventArgs: any = options.eventArgs;
    switch (options.action) {
    case 'sorting':
        const args: BeforeSortEventArgs = {
            range: (options.eventArgs as SortEventArgs).range,
            sortOptions: (options.eventArgs as SortEventArgs).sortOptions,
            cancel: false
        };
        const promise: Promise<SortEventArgs> = new Promise((resolve: Function, reject: Function) => {
            resolve((() => { /** */ })());
        });
        const sortArgs: { [key: string]: BeforeSortEventArgs | Promise<SortEventArgs> } = { args: args, promise: promise };
        spreadsheet.notify(initiateSort, sortArgs);
        (sortArgs.promise as Promise<SortEventArgs>).then((args: SortEventArgs) => {
            spreadsheet.serviceLocator.getService<ICellRenderer>('cell').refreshRange(getIndexesFromAddress(args.range));
        });
        break;
    case 'cellSave':
        const cellEvtArgs: CellSaveEventArgs = options.eventArgs as CellSaveEventArgs;
        const cellValue: CellModel = eventArgs.formula ? { formula: cellEvtArgs.formula } : { value: cellEvtArgs.value };
        spreadsheet.updateCell(cellValue, cellEvtArgs.address);
        break;
    case 'cellDelete':
        spreadsheet.clearRange(options.eventArgs.address, null, true);
        spreadsheet.serviceLocator.getService<ICellRenderer>('cell').refreshRange(getRangeIndexes(options.eventArgs.address));
        break;
    case 'format':
        if (eventArgs.requestType === 'CellFormat') {
            if (eventArgs.style && eventArgs.style.border && !isNullOrUndefined(eventArgs.borderType)) {
                let style: CellStyleModel = {};
                Object.assign(style, eventArgs.style, null, true);
                eventArgs.style.border = undefined;
                spreadsheet.cellFormat(eventArgs.style, eventArgs.range);
                eventArgs.style.border = style.border;
                spreadsheet.setBorder(eventArgs.style, eventArgs.range, eventArgs.borderType);
                eventArgs.style = style;
            } else {
                spreadsheet.cellFormat(eventArgs.style, eventArgs.range);
            }
        } else {
            spreadsheet.numberFormat(eventArgs.format, eventArgs.range);
        }
        break;
    case 'clipboard':
        if (eventArgs.copiedInfo.isCut && !isRedo) {
            return;
        }
        const clipboardPromise: Promise<Object> = eventArgs.copiedInfo.isCut ? spreadsheet.cut(eventArgs.copiedRange)
            : spreadsheet.copy(eventArgs.copiedRange);
        clipboardPromise.then((args: Object) => {
            spreadsheet.paste(eventArgs.pastedRange, eventArgs.type);
        });
        break;
    case 'gridLines':
        spreadsheet.setSheetPropertyOnMute(spreadsheet.sheets[eventArgs.sheetIdx], 'showGridLines', eventArgs.isShow);
        break;
    case 'headers':
        spreadsheet.setSheetPropertyOnMute(spreadsheet.sheets[eventArgs.sheetIdx], 'showHeaders', eventArgs.isShow);
        break;
    case 'resize':
    case 'resizeToFit':
        if (eventArgs.isCol) {
            if (eventArgs.hide === undefined) {
                spreadsheet.setColWidth(eventArgs.width, eventArgs.index, eventArgs.sheetIdx);
            } else {
                spreadsheet.hideColumn(eventArgs.index, eventArgs.index, eventArgs.hide);
            }
        } else {
            if (eventArgs.hide === undefined) {
                spreadsheet.setRowHeight(eventArgs.height, eventArgs.index, eventArgs.sheetIdx + 1);
            } else {
                spreadsheet.hideRow(eventArgs.index, eventArgs.index, eventArgs.hide);
            }
        }
        break;
    case 'renameSheet':
        spreadsheet.setSheetPropertyOnMute(spreadsheet.sheets[eventArgs.index - 1], 'name', eventArgs.value);
        break;
    case 'removeSheet':
        spreadsheet.notify(removeSheetTab, {
            index: eventArgs.index,
            isAction: true,
            count: eventArgs.sheetCount,
            clicked: true
        });
        break;
    case 'wrap':
        wrap(options.eventArgs.address, options.eventArgs.wrap, spreadsheet);
        break;
    case 'hideShow':
        eventArgs.isCol ? spreadsheet.hideColumn(eventArgs.startIndex, eventArgs.endIndex, eventArgs.hide) :
            spreadsheet.hideRow(eventArgs.startIndex, eventArgs.endIndex, eventArgs.hide);
        break;
    case 'replace':
        spreadsheet.updateCell({ value: eventArgs.compareVal }, eventArgs.address);
        break;
    case 'filter':
        spreadsheet.notify(initiateFilterUI, { predicates: null, range: eventArgs.range, sIdx: eventArgs.index, isCut: true });
        break;
    case 'insert':
        if (isRedo === false) {
            spreadsheet.delete(
                options.eventArgs.index, options.eventArgs.index + (options.eventArgs.model.length - 1), options.eventArgs.modelType);
        } else {
            spreadsheet.notify(insertModel, <InsertDeleteModelArgs>{
                model: options.eventArgs.modelType === 'Sheet' ? spreadsheet :
                    spreadsheet.getActiveSheet(), start: options.eventArgs.index, end: options.eventArgs.index +
                        (options.eventArgs.model.length - 1), modelType: options.eventArgs.modelType,
                isAction: false, checkCount: options.eventArgs.sheetCount,
                activeSheetIndex: options.eventArgs.activeSheetIndex
            });
        }
        break;
    case 'delete':
        if (isRedo === false) {
            spreadsheet.notify(insertModel, <InsertDeleteModelArgs>{
                model: options.eventArgs.modelType === 'Sheet' ? spreadsheet :
                    spreadsheet.getActiveSheet(), start: options.eventArgs.deletedModel, modelType: options.eventArgs.modelType,
                isAction: false, columnCellsModel: options.eventArgs.deletedCellsModel
            });
        } else {
            spreadsheet.delete(options.eventArgs.startIndex, options.eventArgs.endIndex, options.eventArgs.modelType);
        }
        break;
    case 'validation':
        if (isRedo) {
            const rules: ValidationModel = {
                type: eventArgs.type, operator: eventArgs.operator, value1: eventArgs.value1,
                value2: eventArgs.value2, ignoreBlank: eventArgs.ignoreBlank, inCellDropDown: eventArgs.inCellDropDown
            };
            spreadsheet.notify(setValidation, { rules: rules, range: eventArgs.range });
        } else {
            spreadsheet.notify(removeValidation, { range: eventArgs.range });
        }
        break;
    case 'merge':
        options.eventArgs.isAction = false;
        let model: RowModel[] = [];
        for (let rIdx: number = 0, rCnt = eventArgs.model.length; rIdx < rCnt; rIdx++) {
            model.push({ cells: [] });
             for (let cIdx: number = 0, cCnt = eventArgs.model[rIdx].cells.length; cIdx < cCnt; cIdx++) {
                model[rIdx].cells[cIdx] = {};
                Object.assign(model[rIdx].cells[cIdx], eventArgs.model[rIdx].cells[cIdx]);
             }
        }
        spreadsheet.notify(setMerge, options.eventArgs);
        eventArgs.model = model;
        break;
    case 'clear':
        spreadsheet.notify(clearViewer, { options: options.eventArgs, isPublic: true });
        break;
    case 'conditionalFormat':
        if (isRedo) {
            const conditionalFormat: ConditionalFormatModel = {
                type: eventArgs.type, cFColor: eventArgs.cFColor, value: eventArgs.value,
                range: eventArgs.range
            };
            spreadsheet.notify(setCFRule, { conditionalFormat: conditionalFormat });
        } else {
            spreadsheet.notify(clearCFRule, { range: eventArgs.range });
        }
        break;
    case 'clearCF':
        if (isRedo) {
            spreadsheet.notify(clearCFRule, { range: eventArgs.selectedRange });
        } else {
            spreadsheet.notify(clearCells, {
                conditionalFormats: eventArgs.cFormats,
                oldRange: eventArgs.oldRange, selectedRange: eventArgs.selectedRange
            });
        }
        break;
    case 'insertImage':
        if (isRedo) {
            spreadsheet.notify(createImageElement, {
                options: {
                    src: options.eventArgs.imageData,
                    height: options.eventArgs.imageHeight, width: options.eventArgs.imageWidth, imageId: options.eventArgs.id
                },
                range: options.eventArgs.range, isPublic: false, isUndoRedo: true
            });
        } else {
            spreadsheet.notify(deleteImage, {
                id: options.eventArgs.id, sheetIdx: options.eventArgs.sheetIndex + 1, range: options.eventArgs.range
            });
        }
        break;
    case 'imageRefresh':
        const element: HTMLElement = document.getElementById(options.eventArgs.id);
        if (isRedo) {
            options.eventArgs.isUndoRedo = true;
            spreadsheet.notify(refreshImgCellObj, options.eventArgs);
        } else {
            spreadsheet.notify(refreshImgCellObj, {
                prevTop: options.eventArgs.currentTop, prevLeft: options.eventArgs.currentLeft,
                currentTop: options.eventArgs.prevTop, currentLeft: options.eventArgs.prevLeft, id: options.eventArgs.id,
                currentHeight: options.eventArgs.prevHeight, currentWidth: options.eventArgs.prevWidth, requestType: 'imageRefresh',
                prevHeight: options.eventArgs.currentHeight, prevWidth: options.eventArgs.currentWidth, isUndoRedo: true
            });

        }
        element.style.height = isRedo ? options.eventArgs.currentHeight + 'px' : options.eventArgs.prevHeight + 'px';
        element.style.width = isRedo ? options.eventArgs.currentWidth + 'px' : options.eventArgs.prevWidth + 'px';
        element.style.top = isRedo ? options.eventArgs.currentTop + 'px' : options.eventArgs.prevTop + 'px';
        element.style.left = isRedo ? options.eventArgs.currentLeft + 'px' : options.eventArgs.prevLeft + 'px';
        break;
    case 'insertChart':
        if (isRedo) {
            const chartOptions: ChartModel[] = [{
                type: eventArgs.type, theme: eventArgs.theme, isSeriesInRows: eventArgs.isSeriesInRows,
                range: eventArgs.range, id: eventArgs.id, height: eventArgs.height, width: eventArgs.width
            }];
            spreadsheet.notify(setChart, {
                chart: chartOptions, isInitCell: eventArgs.isInitCell, isUndoRedo: false, range: eventArgs.posRange
            });
        } else {
            spreadsheet.notify(deleteChart, { id: eventArgs.id, isUndoRedo: true });
        }
        break;
    case 'deleteChart':
        if (isRedo) {
            spreadsheet.notify(deleteChart, { id: eventArgs.id });
        } else {
            const chartOpts: ChartModel[] = [{
                type: eventArgs.type, theme: eventArgs.theme, isSeriesInRows: eventArgs.isSeriesInRows,
                range: eventArgs.range, id: eventArgs.id, height: eventArgs.height, width: eventArgs.width,
                top: eventArgs.top, left: eventArgs.left
            }];
            spreadsheet.notify(setChart, {
                chart: chartOpts, isInitCell: eventArgs.isInitCell, isUndoRedo: false, range: eventArgs.posRange
            });
        }
        break;
    case 'chartRefresh':
        const chartElement: HTMLElement = document.getElementById(options.eventArgs.id);
        if (chartElement) {
            chartElement.style.height = isRedo ? options.eventArgs.currentHeight + 'px' : options.eventArgs.prevHeight + 'px';
            chartElement.style.width = isRedo ? options.eventArgs.currentWidth + 'px' : options.eventArgs.prevWidth + 'px';
            chartElement.style.top = isRedo ? options.eventArgs.currentTop + 'px' : options.eventArgs.prevTop + 'px';
            chartElement.style.left = isRedo ? options.eventArgs.currentLeft + 'px' : options.eventArgs.prevLeft + 'px';
        }
        if (isRedo) {
            options.eventArgs.isUndoRedo = true;
            spreadsheet.notify(refreshChartSize, {
                height: chartElement.style.height, width: chartElement.style.width, overlayEle: chartElement
            });
        } else {
            spreadsheet.notify(refreshChartSize, {
                height: chartElement.style.height, width: chartElement.style.width, overlayEle: chartElement
            });
        }
        break;
    }
}

/**
 * @hidden
 * @param {Workbook} workbook - Specify the workbook
 * @param {number} rowIdx - specify the roe index
 * @param {number} colIdx - specify the column Index.
 * @param {number} sheetIdx - specify the sheet index.
 * @returns {boolean} - Returns the boolean value.
 */
export function hasTemplate(workbook: Workbook, rowIdx: number, colIdx: number, sheetIdx: number): boolean {
    const sheet: SheetModel = workbook.sheets[sheetIdx];
    const ranges: RangeModel[] = sheet.ranges;
    let range: number[];
    for (let i: number = 0, len: number = ranges.length; i < len; i++) {
        if (ranges[i].template) {
            range = getRangeIndexes(ranges[i].address.length ? ranges[i].address : ranges[i].startCell);
            if (range[0] <= rowIdx && range[1] <= colIdx && range[2] >= rowIdx && range[3] >= colIdx) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Setting row height in view an model.
 *
 * @hidden
 * @param {Spreadsheet} parent - Specify the parent
 * @param {SheetModel} sheet - specify the column width
 * @param {number} height - specify the style.
 * @param {number} rowIdx - specify the rowIdx
 * @param {HTMLElement} row - specify the row
 * @param {HTMLElement} hRow - specify the hRow.
 * @param {boolean} notifyRowHgtChange - specify boolean value.
 * @returns {void} - Setting row height in view an model.
 */
export function setRowEleHeight(
    parent: Spreadsheet, sheet: SheetModel, height: number, rowIdx: number, row?: HTMLElement,
    hRow?: HTMLElement, notifyRowHgtChange: boolean = true): void {
    const prevHgt: number = getRowHeight(sheet, rowIdx);
    const edit: HTMLElement = parent.element.querySelector('.e-spreadsheet-edit');
    if (edit && (edit.innerHTML.indexOf('\n') > -1)) {
        const actCell: number[] = getCellIndexes(parent.getActiveSheet().activeCell);
        const cell: CellModel = getCell(actCell[0], actCell[1], sheet); let i: number;
        const splitVal: string[] = edit.innerHTML.split('\n');
        let n: number = 0; const valLength: number = splitVal.length;
        for (i = 0; i < valLength; i++) {
            let lines: number = getLines(splitVal[i], getExcludedColumnWidth(sheet, actCell[0], actCell[1]), cell.style, parent.cellStyle);
            if (lines === 0) {
                lines = 1; // for empty new line
            }
            n = n + lines;
        }
        height = getTextHeightWithBorder(parent, actCell[0], actCell[1], sheet, cell.style || parent.cellStyle, n);
        //height = getTextHeight(parent, cell.style || parent.cellStyle, n) + 1;
    }
    let frozenCol: number = parent.frozenColCount(sheet);
    row = row || (sheet.frozenRows ? parent.getRow(rowIdx, null, frozenCol) : parent.getRow(rowIdx));
    if (row) { row.style.height = `${height}px`; }
    hRow = hRow || (sheet.frozenColumns ? parent.getRow(rowIdx, null, frozenCol - 1) :
        parent.getRow(rowIdx, parent.getRowHeaderTable()));
    if (hRow) { hRow.style.height = `${height}px`; }
    setRowHeight(sheet, rowIdx, height);
    parent.setProperties({ sheets: parent.sheets }, true);
    if (notifyRowHgtChange) {
        parent.notify(rowHeightChanged, { rowIdx: rowIdx, threshold: height - prevHgt });
    }
}

/**
 * @hidden
 * @param {Workbook} context - Specify the context
 * @param {CellStyleModel} style - specify the style.
 * @param {number} lines - specify the lines
 * @returns {number} - get Text Height
 */
export function getTextHeight(context: Workbook, style: CellStyleModel, lines: number = 1): number {
    const fontSize: string = (style && style.fontSize) || context.cellStyle.fontSize;
    const fontSizePx: number = fontSize.indexOf('pt') > -1 ? parseInt(fontSize, 10) * 1.33 : parseInt(fontSize, 10);
    const hgt: number = fontSizePx * (style && style.fontFamily === 'Arial Black' ? 1.44 : 1.24) * lines;
    return Math.ceil(hgt % 1 > 0.9 ? hgt + 1 : hgt); // 0.9 -> if it is nearest value adding extra 1 pixel
}

/**
 * @hidden
 * @param {string} text - Specify the text
 * @param {CellStyleModel} style - specify the style.
 * @param {CellStyleModel} parentStyle - specify the parentStyle
 * @returns {number} - get Text Width
 */
export function getTextWidth(text: string, style: CellStyleModel, parentStyle: CellStyleModel): number {
    if (!style) {
        style = parentStyle;
    }
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.font = (style.fontStyle || parentStyle.fontStyle) + ' ' + (style.fontWeight || parentStyle.fontWeight) + ' '
        + (style.fontSize || parentStyle.fontSize) + ' ' + (style.fontFamily || parentStyle.fontFamily);
    return getDPRWidth(context.measureText(text).width);
}

/**
 * @hidden
 * @param {string} text - Specify the text
 * @param {number} colwidth - specify the column width
 * @param {CellStyleModel} style - specify the style.
 * @param {CellStyleModel} parentStyle - specify the parentStyle
 * @returns {number} - Setting maximum height while doing formats and wraptext
 */
export function getLines(text: string, colwidth: number, style: CellStyleModel, parentStyle: CellStyleModel): number {
    let width: number;
    let prevWidth: number = 0;
    const textArr: string[] = text.toString().split(' ');
    const spaceWidth: number = getTextWidth(' ', style, parentStyle);
    let lines: number;
    let cnt: number = 0;
    textArr.forEach((txt: string) => {
        let lWidth: number = 0;
        let cWidth: number = 0;
        width = getTextWidth(txt, style, parentStyle);
        lines = (prevWidth + width) / colwidth;
        if (lines >= 1) {
            if (prevWidth) {
                cnt++;
            }
            if (width / colwidth >= 1) {
                txt.split('').forEach((val: string) => {
                    cWidth = getTextWidth(val, style, parentStyle);
                    lWidth += cWidth;
                    if (lWidth > colwidth) {
                        cnt++;
                        lWidth = cWidth;
                    }
                });
                prevWidth = lWidth + spaceWidth;
            } else {
                prevWidth = width + spaceWidth;
            }
        } else {
            prevWidth += (width + spaceWidth);
        }
    });
    if (prevWidth) {
        cnt += Math.ceil((prevWidth - spaceWidth) / colwidth);
    }
    return cnt;
}

/**
 * calculation for width taken by border inside a cell
 */
function getBorderWidth(rowIdx: number, colIdx: number, sheet: SheetModel): number {
    let width: number = 0;
    let cell: CellModel = getCell(rowIdx, colIdx, sheet, null, true);
    let rightSideCell: CellModel = getCell(rowIdx, colIdx + 1, sheet, null, true);
    if (cell.style) {
        if (cell.style.border) {
            width = (colIdx === 0 ? 2 : 1) * parseFloat(cell.style.border.split('px')[0]);
        } else {
            if (colIdx === 0 && cell.style.borderLeft) {
                width = parseFloat(cell.style.borderLeft.split('px')[0]);
            }
            if (cell.style.borderRight) {
                width += parseFloat(cell.style.borderRight.split('px')[0]);
            }
        }
    }
    if (!(cell.style && (cell.style.border || cell.style.borderRight)) && rightSideCell.style && rightSideCell.style.borderLeft) {
        width += parseFloat(rightSideCell.style.borderLeft.split('px')[0]);
    }
    return width;
}

/** 
 * calculation for height taken by border inside a cell
 * @hidden
 */
export function getBorderHeight(rowIdx: number, colIdx: number, sheet: SheetModel): number {
    let height: number = 0;
    let cell: CellModel = getCell(rowIdx, colIdx, sheet, null, true);
    let bottomSideCell: CellModel = getCell(rowIdx + 1, colIdx, sheet, null, true);
    if (cell.style) {
        if (cell.style.border) {
            height = (rowIdx === 0 ? 2 : 1) * parseFloat(cell.style.border.split('px')[0]);
        } else {
            if (rowIdx === 0 && cell.style.borderTop) {
                height = parseFloat(cell.style.borderTop.split('px')[0]);
            }
            if (cell.style.borderBottom) {
                height += parseFloat(cell.style.borderBottom.split('px')[0]);
            }
        }
    }
    if (!(cell.style && (cell.style.border || cell.style.borderBottom)) && bottomSideCell.style && bottomSideCell.style.borderTop) {
        height += parseFloat(bottomSideCell.style.borderTop.split('px')[0]);
    }
    return height;
}

/**
 * Calculating column width by excluding cell padding and border width
 * @hidden
 */
export function getExcludedColumnWidth(sheet: SheetModel, rowIdx: number, startColIdx: number, endColIdx: number = startColIdx): number {
    return getColumnsWidth(sheet, startColIdx, endColIdx) - (4 + getBorderWidth(rowIdx, startColIdx, sheet)); // 4 -> For cell padding
}

/** @hidden */
export function getTextHeightWithBorder(context: Workbook, rowIdx: number, colIdx: number, sheet: SheetModel, style: CellStyleModel, lines?: number): number {
    const height: number = getTextHeight(context, style, lines) + (getBorderHeight(rowIdx, colIdx, sheet) || 1); // 1 -> For default bottom border
    return (window.devicePixelRatio % 1 > 0) ? height % 2 === 0 ? height : height + 1 : height;
}

/**
 * Setting maximum height while doing formats and wraptext
 *
 * @hidden
 * @param {SheetModel} sheet - Specify the sheet
 * @param {number} rIdx - specify the row Index
 * @param {number} cIdx - specify the column Index.
 * @param {number} hgt - specify the hgt
 * @returns {void} - Setting maximum height while doing formats and wraptext
 */
export function setMaxHgt(sheet: SheetModel, rIdx: number, cIdx: number, hgt: number): void {
    if (!sheet.maxHgts[rIdx]) {
        sheet.maxHgts[rIdx] = {};
    }
    sheet.maxHgts[rIdx][cIdx] = hgt;
}

/**
 * Getting maximum height by comparing each cell's modified height.
 *
 * @hidden
 * @param {SheetModel} sheet - Specify the sheet.
 * @param {number} rIdx - Specify the row index.
 * @returns {number} - Getting maximum height by comparing each cell's modified height.
 */
export function getMaxHgt(sheet: SheetModel, rIdx: number): number {
    let maxHgt: number = 0;
    const rowHgt: object = sheet.maxHgts[rIdx];
    if (rowHgt) {
        Object.keys(rowHgt).forEach((key: string) => {
            if (rowHgt[key] > maxHgt) {
                maxHgt = rowHgt[key];
            }
        });
    }
    return maxHgt;
}
/**
 * @hidden
 * @param {SheetModel} sheet - Specify the sheet
 * @param {number} index - specify the index
 * @param {boolean} increase - specify the boolean value.
 * @param {string} layout - specify the string
 * @returns {number} - To skip the hidden index
 *
 */
export function skipHiddenIdx(sheet: SheetModel, index: number, increase: boolean, layout: string = 'rows'): number {
    if (index < 0) { index = -1; }
    if ((sheet[layout])[index] && (sheet[layout])[index].hidden) {
        increase ? index++ : index--;
        index = skipHiddenIdx(sheet, index, increase, layout);
    }
    return index;
}

/**
 * @hidden
 * @param {HTMLElement} ele - Specify the element.
 * @returns {void} - Specify the focus.
 */
export function focus(ele: HTMLElement): void {
    if (!document.activeElement.classList.contains('e-text-findNext-short')) {
        if (Browser.isIE) {
            const scrollX: number = window.scrollX;
            const scrollY: number = window.scrollY;
            ele.focus();
            window.scrollTo(scrollX, scrollY);
        } else {
            /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
            (ele as any).focus({ preventScroll: true });
        }
    }
}
