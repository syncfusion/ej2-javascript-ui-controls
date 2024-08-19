import { Browser, setStyleAttribute as setBaseStyleAttribute, getComponent, detach, isNullOrUndefined, removeClass, extend, isUndefined } from '@syncfusion/ej2-base';
import { StyleType, CollaborativeEditArgs, CellSaveEventArgs, ICellRenderer, IAriaOptions, completeAction } from './index';
import { HideShowEventArgs, invalidData, resizeRowHeight } from './../common/index';
import { Cell, CellUpdateArgs, ColumnModel, duplicateSheet, getSheetIndex, getSheetIndexFromAddress, getSheetIndexFromId, getSheetNameFromAddress, hideShow, isReadOnly, moveSheet, protectsheetHandler, refreshChartSize, refreshRibbonIcons, replace, replaceAll, setLinkModel, setLockCells, updateSheetFromDataSource } from '../../workbook/index';
import { IOffset, clearViewer, deleteImage, createImageElement, refreshImgCellObj, removeDataValidation } from './index';
import { Spreadsheet, removeSheetTab, rowHeightChanged, initiateFilterUI, deleteChart, IRenderer } from '../index';
import { SheetModel, getColumnsWidth, getSwapRange, CellModel, CellStyleModel, CFArgs, RowModel } from '../../workbook/index';
import { RangeModel, getRangeIndexes, wrap, setRowHeight, insertModel, InsertDeleteModelArgs, getColumnWidth } from '../../workbook/index';
import { BeforeSortEventArgs, SortEventArgs, initiateSort, getIndexesFromAddress, getRowHeight, isLocked } from '../../workbook/index';
import { cellValidation, clearCFRule, ConditionalFormatModel, getColumn, getRow, updateCell } from '../../workbook/index';
import { getCell, setChart, ApplyCFArgs, VisibleMergeIndexArgs, setVisibleMergeIndex, Row, Sheet, Column } from '../../workbook/index';
import { setCFRule, setMerge, Workbook, setAutoFill, getautofillDDB, getRowsHeight, ChartModel, deleteModel } from '../../workbook/index';
import { workbookFormulaOperation, DefineNameModel, getAddressInfo, getSheet, setCellFormat, updateCFModel } from '../../workbook/index';
import { checkUniqueRange, applyCF, ActionEventArgs, skipHiddenIdx, isFilterHidden, ConditionalFormat } from '../../workbook/index';
import { applyProtect, chartDesignTab, copy, cut, getColIdxFromClientX, getRowIdxFromClientY, goToSheet, hideSheet, paste, performUndoRedo, refreshChartCellObj, removeHyperlink, removeWorkbookProtection, setProtectWorkbook, sheetNameUpdate, showSheet } from './event';
import { keyCodes } from './constant';

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
 * @returns {void} - The function used to get colgroup width based on the row index.
 * @hidden
 */
export function removeAllChildren(parent: Element): void {
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
let textLineHeight: number = 1.24;

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
        const sheet: SheetModel = context.getActiveSheet();
        const frozenRow: number = context.frozenRowCount(sheet);
        const frozenCol: number = context.frozenColCount(sheet);
        const topIdx: number = context.viewport.topIndex + frozenRow;
        const leftIdx: number = context.viewport.leftIndex + frozenCol;
        const bottomIdx: number = context.viewport.bottomIndex;
        const rightIdx: number = context.viewport.rightIndex;
        if (sheet.frozenRows || sheet.frozenColumns) {
            if (context.insideViewport(range[0], range[1]) || context.insideViewport(range[2], range[3])) {
                return true;
            }
        } else if (topIdx <= range[0] && bottomIdx >= range[2] && leftIdx <= range[1] && rightIdx >= range[3]) {
            return true;
        }
        let inView: boolean = false;
        if (isModify) {
            if (range[0] < topIdx && range[2] < topIdx || range[0] > bottomIdx && range[2] > bottomIdx) {
                return false;
            } else {
                if (range[0] < topIdx && range[2] > topIdx && range[0] >= frozenRow) {
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
                if (range[1] < leftIdx && range[3] > leftIdx && range[1] >= frozenCol) {
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
 * @param {number[]} indexes - Specify the indexes.
 * @param {number} frozenRow - Specify the frozen row.
 * @param {number} frozenColumn - Specify the frozen column
 * @param {number} freezeScrollHeight - Specify the freeze scroll height
 * @param {number} freezeScrollWidth - Specify the freeze scroll width
 * @param {number} rowHdrWidth - Specify the row header width
 * @param {boolean} isOverlay - Specify the overlay.
 * @returns {number} - To get the top left cell position in viewport.
 */
export function getCellPosition(
    sheet: SheetModel, indexes: number[],
    frozenRow?: number, frozenColumn?: number, freezeScrollHeight?: number, freezeScrollWidth?: number,
    rowHdrWidth?: number, isOverlay?: boolean): { top: number, left: number } {
    let i: number; const offset: { left: IOffset, top: IOffset } = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } };
    let top: number = offset.top.size;
    let left: number = offset.left.size;
    for (i = offset.top.idx; i < indexes[0]; i++) {
        if (frozenRow) {
            if (frozenRow - 1 < indexes[0] && i < frozenRow) { continue; }
        }
        top += getRowHeight(sheet, i, !isOverlay);
    }
    for (i = offset.left.idx; i < indexes[1]; i++) {
        if (frozenColumn && frozenColumn - 1 < indexes[1] && i < frozenColumn) { continue; }
        left += getColumnWidth(sheet, i, null, !isOverlay);
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
 * @param {Spreadsheet} parent - Specify the parent
 * @param {HTMLElement} ele - Specify the element
 * @param {number[]} range - Specify the range
 * @param {string} cls - Specify the class name
 * @param {boolean} preventAnimation - Specify the preventAnimation.
 * @param {boolean} isMultiRange - Specify the multi range selection.
 * @param {boolean} removeCls - Specify to remove the class from selection.
 * @returns {void} - To set the position
 * @hidden
 */
export function setPosition(
    parent: Spreadsheet, ele: HTMLElement, range: number[], cls: string = 'e-selection', preventAnimation?: boolean, isMultiRange?: boolean,
    removeCls?: boolean): Promise<null> | void {
    const sheet: SheetModel = parent.getActiveSheet();
    if (sheet.frozenRows || sheet.frozenColumns) {
        let content: HTMLElement;
        const frozenRow: number = parent.frozenRowCount(sheet); const frozenCol: number = parent.frozenColCount(sheet);
        if (cls === 'e-active-cell') {
            if (range[0] < frozenRow || range[1] < frozenCol) {
                ele.style.display = 'none';
                content = range[0] < frozenRow && range[1] < frozenCol ? parent.getSelectAllContent() :
                    (range[0] < frozenRow ? parent.getColumnHeaderContent() : parent.getRowHeaderContent());
                let rangeEle: HTMLElement = content.querySelector('.' + cls);
                if (!rangeEle) { rangeEle = ele.cloneNode(true) as HTMLElement; content.appendChild(rangeEle); }
                ele = rangeEle;
                locateElem(
                    parent, ele, range, sheet, parent.enableRtl, frozenRow, frozenCol, preventAnimation, true,
                    parent.viewport.beforeFreezeHeight, parent.viewport.beforeFreezeWidth, parent.sheetModule.colGroupWidth);
            } else {
                locateElem(parent, ele, range, sheet, parent.enableRtl, frozenRow, frozenCol, preventAnimation);
            }
            if (ele.style.display) { ele.style.display = ''; }
            removeRangeEle(parent.getSelectAllContent(), content, 'e-active-cell');
            removeRangeEle(parent.getColumnHeaderContent(), content, 'e-active-cell');
            removeRangeEle(parent.getRowHeaderContent(), content, 'e-active-cell');
        } else if (cls === 'e-autofill') {
            let contentElem: HTMLElement;
            const freezeRow: number = parent.frozenRowCount(sheet); const freezeCol: number = parent.frozenColCount(sheet);
            if (range[0] < freezeRow || range[1] < freezeCol) {
                ele.style.display = 'none';
                contentElem = range[0] < freezeRow && range[1] < freezeCol ? parent.getSelectAllContent() :
                    (range[0] < freezeRow ? parent.getColumnHeaderContent() : parent.getRowHeaderContent());
                let rangeEle: HTMLElement = contentElem.querySelector('.' + cls);
                if (!rangeEle) { rangeEle = ele.cloneNode(true) as HTMLElement; contentElem.appendChild(rangeEle); }
                ele = rangeEle;
                locateElem(
                    parent, ele, range, sheet, parent.enableRtl, freezeRow, freezeCol, preventAnimation, true,
                    parent.viewport.beforeFreezeHeight, parent.viewport.beforeFreezeWidth, parent.sheetModule.colGroupWidth, 'e-autofill');
            }
            else {
                locateElem(
                    parent, ele, range, sheet, parent.enableRtl, freezeRow, freezeCol, preventAnimation, false, 0, 0, 0, 'e-autofill');
            }
            if (ele.style.display) { ele.style.display = ''; }
            removeRangeEle(parent.getSelectAllContent(), contentElem, 'e-autofill');
            removeRangeEle(parent.getColumnHeaderContent(), contentElem, 'e-autofill');
            removeRangeEle(parent.getRowHeaderContent(), contentElem, 'e-autofill');

        } else if (cls === 'e-filloption') {
            let contentElem: HTMLElement;
            const freezeRow: number = parent.frozenRowCount(sheet); const freezeCol: number = parent.frozenColCount(sheet);
            if ((range[0] < freezeRow || range[1] < freezeCol)) {
                if (range[3] + 1 === freezeCol && range[2] + 1 > freezeRow) {
                    locateElem(
                        parent, parent.getMainContent().querySelector('.e-filloption'), range, sheet, parent.enableRtl, freezeRow,
                        freezeCol, preventAnimation, false, 0, 0, 0, 'e-filloption', true, { left: -4 });
                } else if (range[2] + 1 === freezeRow && range[3] + 1 > freezeCol) {
                    locateElem(
                        parent, parent.getMainContent().querySelector('.e-filloption'), range, sheet, parent.enableRtl, freezeRow,
                        freezeCol, preventAnimation, false, 0, 0, 0, 'e-filloption', true, { top: -4 });
                } else if (range[3] + 1 === freezeCol && range[2] + 1 < freezeRow) { // for upper side
                    contentElem = parent.getColumnHeaderContent();
                    const rangeElem: HTMLElement = contentElem.querySelector('.' + cls);
                    if (!rangeElem) {
                        parent.notify(getautofillDDB, { id: parent.element.id + '_autofilloptionbtn', appendElem: contentElem });
                    }
                    ele = parent.autofillModule.autoFillDropDown.element;
                    locateElem(
                        parent, ele, range, sheet, parent.enableRtl, freezeRow, freezeCol, preventAnimation, false, 0, 0, 0, 'e-filloption',
                        true, { left: -4 });
                } else if (range[2] + 1 === freezeRow && range[3] + 1 === freezeCol) { // corner cell
                    locateElem(
                        parent, parent.getMainContent().querySelector('.e-filloption'), range, sheet, parent.enableRtl, freezeRow,
                        freezeCol, preventAnimation, false, 0, 0, 0, 'e-filloption', true, { top: -4, left: -4 });
                }
                else {
                    contentElem = range[0] < freezeRow && range[1] < freezeCol ? parent.getSelectAllContent() :
                        (range[0] < freezeRow ? parent.getColumnHeaderContent() : parent.getRowHeaderContent());
                    const rangeEle: HTMLElement = contentElem.querySelector('.' + cls);
                    if (!rangeEle) {
                        parent.notify(getautofillDDB, { id: parent.element.id + '_autofilloptionbtn', appendElem: contentElem });
                    }
                    ele = parent.autofillModule.autoFillDropDown.element;
                    locateElem(
                        parent, ele, range, sheet, parent.enableRtl, freezeRow, freezeCol, preventAnimation, true, parent.viewport.
                            beforeFreezeHeight, parent.viewport.beforeFreezeWidth, parent.sheetModule.colGroupWidth, 'e-filloption', true);
                }
            }
            else {
                locateElem(
                    parent, parent.getMainContent().querySelector('.e-filloption'), range, sheet, parent.enableRtl, freezeRow, freezeCol,
                    preventAnimation, false, 0, 0, 0, 'e-filloption', true);
            }
            if (ele.style.display) { ele.style.display = ''; }
            removeRangeEle(parent.getSelectAllContent(), contentElem, 'e-filloption');
            removeRangeEle(parent.getColumnHeaderContent(), contentElem, 'e-filloption');
            removeRangeEle(parent.getRowHeaderContent(), contentElem, 'e-filloption');

        } else {
            const swapRange: number[] = getSwapRange(range);
            if (swapRange[0] < frozenRow || swapRange[1] < frozenCol) {
                if (ele && !ele.classList.contains('e-multi-range')) {
                    ele.classList.add('e-hide');
                }
                const ranges: number[][] = [];
                if (swapRange[0] < frozenRow && swapRange[1] < frozenCol) {
                    if (swapRange[2] < frozenRow && swapRange[3] < frozenCol) {
                        ranges.push(range);
                        if (!isMultiRange) {
                            removeRangeEle(parent.getColumnHeaderContent(), content, cls, true);
                            removeRangeEle(parent.getRowHeaderContent(), content, cls, true);
                        }
                    } else if (swapRange[2] > frozenRow - 1) {
                        if (swapRange[3] < frozenCol) {
                            if (!isMultiRange) {
                                removeRangeEle(parent.getColumnHeaderContent(), content, cls, true);
                            }
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
                            if (!isMultiRange) {
                                removeRangeEle(parent.getRowHeaderContent(), content, cls, true);
                            }
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
                        if (!isMultiRange) {
                            removeRangeEle(parent.getRowHeaderContent(), content, cls, true);
                        }
                    } else {
                        ranges.push([swapRange[0], swapRange[1], frozenRow - 1, swapRange[3]]);
                        ranges.push([frozenRow, swapRange[1], swapRange[2], swapRange[3]]);
                        if (!isMultiRange) {
                            removeRangeEle(parent.getSelectAllContent(), content, cls, true);
                            removeRangeEle(parent.getRowHeaderContent(), content, cls, true);
                        }
                    }
                } else {
                    if (swapRange[3] < frozenCol) {
                        ranges.push(range);
                        if (!isMultiRange) {
                            removeRangeEle(parent.getSelectAllContent(), content, cls, true);
                        }
                    } else {
                        ranges.push([swapRange[0], swapRange[1], swapRange[2], frozenCol - 1]);
                        ranges.push([swapRange[0], frozenCol, swapRange[2], swapRange[3]]);
                        if (!isMultiRange) {
                            removeRangeEle(parent.getSelectAllContent(), content, cls, true);
                            removeRangeEle(parent.getColumnHeaderContent(), content, cls, true);
                        }
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
                                    if (subRng !== rng) {
                                        removeEle = rangeEle.getElementsByClassName('e-bottom')[0];
                                        if (removeEle && subRng[0] === frozenRow) { detach(removeEle); }
                                    }
                                });
                            }
                            if (rng[0] === frozenRow && content.parentElement.classList.contains('e-main-panel')) {
                                ranges.forEach((subRng: number[]): void => {
                                    if (subRng !== rng) {
                                        removeEle = rangeEle.getElementsByClassName('e-top')[0];
                                        if (removeEle && subRng[2] + 1 === frozenRow) { detach(removeEle); }
                                    }
                                });
                            }
                        }
                        if (frozenCol) {
                            if (rng[3] + 1 === frozenCol) {
                                ranges.forEach((subRng: number[]): void => {
                                    if (subRng !== rng) {
                                        removeEle = rangeEle.getElementsByClassName('e-right')[0];
                                        if (removeEle && subRng[1] === frozenCol) { detach(removeEle); }
                                    }
                                });
                            }
                            if (rng[1] === frozenCol && (content.classList.contains('e-sheet-content') || content.classList.contains('e-column-header'))) {
                                ranges.forEach((subRng: number[]): void => {
                                    if (subRng !== rng) {
                                        removeEle = rangeEle.getElementsByClassName('e-left')[0];
                                        if (removeEle && subRng[3] + 1 === frozenCol) { detach(removeEle); }
                                    }
                                });
                            }
                        }
                    } else {
                        rangeEle = content.querySelector('.' + cls);
                        if (!rangeEle) {
                            rangeEle = ele.cloneNode(true) as HTMLElement;
                            if (isMultiRange && !rangeEle.classList.contains('e-multi-range')) {
                                rangeEle.classList.add('e-multi-range');
                            }
                            content.appendChild(rangeEle);
                        }
                        if (removeCls) {
                            rangeEle.classList.remove(cls);
                        }
                    }
                    locateElem(
                        parent, rangeEle, rng, sheet, parent.enableRtl, frozenRow, frozenCol, preventAnimation, false,
                        parent.viewport.beforeFreezeHeight, parent.viewport.beforeFreezeWidth, parent.sheetModule.colGroupWidth);
                    if (rangeEle.classList.contains('e-hide')) {
                        rangeEle.classList.remove('e-hide');
                    }
                });
            } else {
                if (!isMultiRange) {
                    removeRangeEle(parent.getSelectAllContent(), null, cls, true);
                    removeRangeEle(parent.getColumnHeaderContent(), null, cls, true);
                    removeRangeEle(parent.getRowHeaderContent(), null, cls, true);
                }
                locateElem(parent, ele, range, sheet, parent.enableRtl, frozenRow, frozenCol, preventAnimation);
                if (cls === 'e-range-indicator' || !parent.getMainContent().querySelector('.' + cls)) {
                    parent.getMainContent().appendChild(ele);
                }
                if (ele.classList.contains('e-hide')) {
                    ele.classList.remove('e-hide');
                }
                if (removeCls) {
                    ele.classList.remove(cls);
                }
            }
        }
    }  else {
        const promise: Promise<null> = locateElem(parent, ele, range, sheet, parent.enableRtl, 0, 0, preventAnimation) as Promise<null>;
        if (ele && !parent.getMainContent().querySelector('.' + cls)) { parent.getMainContent().appendChild(ele); }
        return promise;
    }
}
/**
 * @param {Element} content - Specify the content element.
 * @param {HTMLElement} checkEle - Specify the element.
 * @param {string} cls - Specify the class name.
 * @param {string} isSelection - Specify the selection element.
 * @param {string} removeCls - Specify to remove class from element.
 * @returns {void} - remove element with given range
 */
export function removeRangeEle(content: Element, checkEle: HTMLElement, cls: string, isSelection?: boolean, removeCls?: boolean): void {
    if (isSelection || content !== checkEle) {
        if (removeCls) {
            const collection: NodeListOf<Element> = content.querySelectorAll('.' + cls);
            let i: number = 0;
            while (i < collection.length) {
                collection[i as number].classList.remove(cls);
                i++;
            }
        } else {
            const ele: Element = content.querySelector('.' + cls);
            if (ele && !ele.classList.contains('e-multi-range')) {
                detach(ele);
            }
        }
    }
}

/**
 * Position element with given range
 *
 * @hidden
 * @param {Spreadsheet} parent - Specify the parent.
 * @param {HTMLElement} ele - Specify the element.
 * @param {number[]} range - specify the range.
 * @param {SheetModel} sheet - Specify the sheet.
 * @param {boolean} isRtl - Specify the boolean value.
 * @param {number} frozenRow - Specidy the frozen row.
 * @param {number} frozenColumn - Specify the frozen column
 * @param {boolean} preventAnimation - Specify the preventAnimation.
 * @param {boolean} isActiveCell - Specidy the boolean value.
 * @param {number} freezeScrollHeight - Specify the freeze scroll height
 * @param {number} freezeScrollWidth - Specify the freeze scroll width
 * @param {number} rowHdrWidth - Specify the row header width
 * @param {number} cls - Specify the class
 * @param {number} isFillOptShow - Specify the fill option
 * @param {number} freezeFillOpt - Specifies the fill option
 * @param {number} freezeFillOpt.top - Specifies the fill option
 * @param {number} freezeFillOpt.left - Specifies the fill option
 * @returns {void} - Position element with given range
 */
export function locateElem(
    parent: Spreadsheet, ele: HTMLElement, range: number[], sheet: SheetModel, isRtl: boolean, frozenRow: number, frozenColumn: number,
    preventAnimation?: boolean, isActiveCell?: boolean, freezeScrollHeight?: number, freezeScrollWidth?: number, rowHdrWidth?: number,
    cls?: string, isFillOptShow?: boolean, freezeFillOpt?: {top?: number; left?: number}): Promise<null> | void {
    const swapRange: number[] = getSwapRange(range);
    const cellPosition: { top: number, left: number } = getCellPosition(
        sheet, swapRange, frozenRow, frozenColumn, freezeScrollHeight, freezeScrollWidth, rowHdrWidth);
    const startIndex: number[] = [skipHiddenIdx(sheet, 0, true), skipHiddenIdx(sheet, 0, true, 'columns')];
    let height: number; let width: number;
    if (parent.scrollSettings.isFinite) {
        height = swapRange[0] >= sheet.rowCount ? 0 : getRowsHeight(
            sheet, swapRange[0], swapRange[2] < sheet.rowCount ? swapRange[2] : sheet.rowCount - 1, true);
        width = swapRange[1] >= sheet.colCount ? 0 : getColumnsWidth(
            sheet, swapRange[1], swapRange[3] < sheet.colCount ? swapRange[3] : sheet.colCount - 1, true);
    } else {
        height = getRowsHeight(sheet, swapRange[0], swapRange[2], true);
        width = getColumnsWidth(sheet, swapRange[1], swapRange[3], true);
    }
    const isRowSelected: boolean = (swapRange[1] === 0 && swapRange[3] === sheet.colCount - 1);
    const isColSelected: boolean = (swapRange[0] === 0 && swapRange[2] === sheet.rowCount - 1);
    let top: number = 0; let tdiff: number = -5;
    let ldiff: number = -5;
    let left: number = 0;
    let otdiff: number = 6;
    let oldiff: number = 6;
    if (isNullOrUndefined(cls)) {
        const attrs: { [key: string]: string } = {
            'top': (swapRange[0] === startIndex[0] ? cellPosition.top : cellPosition.top - getDPRValue(1)) + 'px',
            'height': height && height + (swapRange[0] === startIndex[0] ? 0 : getDPRValue(1)) + 'px',
            'width': width && width + (swapRange[1] === startIndex[1] ? 0 : getDPRValue(1)) + (isActiveCell
                && frozenColumn && swapRange[1] < frozenColumn && swapRange[3] >= frozenColumn ? 1 : 0) + 'px'
        };
        attrs[isRtl ? 'right' : 'left'] = (swapRange[1] === startIndex[1] ? cellPosition.left : cellPosition.left - 1) + 'px';
        if (ele) {
            const promise: Promise<null> = setStyleAttribute([{ element: ele, attrs: attrs }], preventAnimation);
            return promise;
        }
    } else {
        if (isRowSelected) {
            tdiff = -5;
            ldiff = -2;
            otdiff = 6;
            oldiff = 3;
        }
        if (isColSelected) {
            ldiff = -5;
            tdiff = 0;
            otdiff = 1;
            oldiff = 6;
        }
        if (!isColSelected) {
            top += height;
        }
        if (!isRowSelected)
        {
            left += width;
        }
        top += Math.round(cellPosition.top) + tdiff;
        left += Math.round(cellPosition.left) + ldiff;
        let attrs: { [key: string]: string } = {};
        if (isFillOptShow) {
            removeClass([ele], 'e-hide');
            top = freezeFillOpt && freezeFillOpt.top ? freezeFillOpt.top : top;
            left = freezeFillOpt && freezeFillOpt.left ? freezeFillOpt.left : left;
            attrs = {
                'top': top + otdiff + 'px'
            };
            attrs[isRtl ? 'right' : 'left'] = left + oldiff + 'px';
            if (ele) { setStyleAttribute([{ element: ele, attrs: attrs }], preventAnimation); }
        } else {
            attrs = {
                'top': top + 'px'
            };
            attrs[isRtl ? 'right' : 'left'] = left + 'px';
            if (ele) { setStyleAttribute([{ element: ele, attrs: attrs }], preventAnimation); }
        }
    }
}

/**
 * To update element styles using request animation frame
 *
 * @hidden
 * @param {StyleType[]} styles - Specify the styles
 * @param {boolean} preventAnimation - Specify the preventAnimation.
 * @returns {void} - To update element styles using request animation frame
 */
export function setStyleAttribute(styles: StyleType[], preventAnimation?: boolean): Promise<null> {
    const promise: Promise<null> = new Promise((resolve: Function) => {
        const setStyleFn: Function = () => {
            styles.forEach((style: StyleType): void => {
                setBaseStyleAttribute(style.element as HTMLElement, style.attrs);
                resolve();
            });
        };
        if (preventAnimation) {
            setStyleFn();
        } else {
            requestAnimationFrame(() => setStyleFn());
        }
    });
    return promise;
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
 * @param {MouseEvent} e - Specify the event.
 * @returns {boolean} - To get boolean value.
 * @hidden
 */
export function isMouseMove(e: MouseEvent): boolean {
    return e && (e.type === 'mousemove' || e.type === 'pointermove');
}

/**
 * @param {MouseEvent} e - Specify the event.
 * @returns {boolean} - To get boolean value
 * @hidden
 */
export function isMouseUp(e: MouseEvent): boolean {
    return e && (e.type === 'mouseup' || e.type === 'pointerup');
}

/**
 * @param {number} keyCode - Specify  the keycode.
 * @returns {boolean} - to get boolean value.
 * @hidden
 */
export function isNavigationKey(keyCode: number): boolean {
    return (keyCode === keyCodes.UP) || (keyCode === keyCodes.DOWN) || (keyCode === keyCodes.LEFT)
        || (keyCode === keyCodes.RIGHT);
}

/**
 * @param {MouseEvent | TouchEvent} e - To specify the mouse or touch event.
 * @returns {number} - To get client X value.
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
 * To get the `pageX` value from the mouse or touch event.
 *
 * @param {MouseEvent | TouchEvent} e - Specifies the mouse or touch event.
 * @returns {number} - Return the `pageX` value.
 * @hidden
 */
export function getPageX(e: TouchEvent & MouseEvent): number {
    return e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
}

/**
 * To get the `pageY` value from the mouse or touch event.
 *
 * @param {MouseEvent | TouchEvent} e - Specifies the mouse or touch event.
 * @returns {number} - Return the `pageY` value.
 * @hidden
 */
export function getPageY(e: MouseEvent & TouchEvent): number {
    return e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
}

/**
 * Get even number based on device pixel ratio
 *
 * @param {number} value - Specify the number
 * @param {boolean} preventDecrease - Specify the boolean value
 * @returns {number} - To get DPR value
 * @hidden
 */
export function getDPRValue(value: number, preventDecrease?: boolean): number {
    if (window.devicePixelRatio % 1 > 0) {
        const pointValue: number = (value * window.devicePixelRatio) % 1;
        return value + (pointValue ? (((pointValue > 0.5 || preventDecrease) ? (1 - pointValue) : -1 * pointValue)
            / window.devicePixelRatio) : 0);
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
        if (target) { target.setAttribute(config[`${name}`], <string>options[`${name}`]); }
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
 * @param {number} idx - Specify the index
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
        const header: Element = idx < frozenCol ? parent.getSelectAllContent() : parent.getColumnHeaderContent();
        curEle = header.getElementsByTagName('th')[index as number]; curEleH = header.getElementsByTagName('col')[index as number];
        curEleC = (idx < frozenCol ? parent.getRowHeaderContent() : parent.getMainContent()).getElementsByTagName('col')[index as number];
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
            hdrClone[0] = hdrRow[index as number].getElementsByTagName('td')[0].cloneNode(true) as HTMLElement;
            hdrFntSize = findMaxValue(parent.getRowHeaderTable(), hdrClone, false, parent) + 1;
        }
        const contentRow: HTMLCollectionOf<HTMLTableRowElement> =
            parent.getMainContent().getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
        const contentClone: HTMLElement[] = [];
        for (let idx: number = 0; idx < contentRow[index as number].getElementsByTagName('td').length; idx++) {
            contentClone[idx as number] = contentRow[index as number].getElementsByTagName('td')[idx as number].cloneNode(true) as HTMLElement;
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
        const DPRValue: string = getDPRValue(parseInt(value, 10)) + 'px';
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
 * @param {number} lineHeight - Specify the line height for other culture text.
 * @returns {void} -  to set the line height for other culture text.
 */
export function setTextLineHeight(lineHeight: number): void {
    textLineHeight = lineHeight;
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
    const tableMaxWidth: number = myTable.getBoundingClientRect().width;
    const tableMaxHeight: number = myTable.getBoundingClientRect().height;
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
 * @param {boolean} isRedo - Specifyt the boolean value.
 * @param {CollaborativeEditArgs[]} undoCollections - Specify the undo collections.
 * @param {object} actionEventArgs - Specify the actionEventArgs.
 * @param {ActionEventArgs} actionEventArgs.eventArgs - Specify the eventArgs.
 * @param {boolean} isRecursive - Specify the recursive.
 * @returns {void} - To update the Action.
 */
export function updateAction(
    options: CollaborativeEditArgs, spreadsheet: Spreadsheet, isRedo?: boolean, undoCollections?: CollaborativeEditArgs[],
    actionEventArgs?: ActionEventArgs, isRecursive?: boolean): void {
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    const eventArgs: any = options.eventArgs;
    let chartElement: HTMLElement;
    let element: HTMLElement;
    let args: BeforeSortEventArgs;
    let promise: Promise<SortEventArgs>;
    let sortArgs: { [key: string]: BeforeSortEventArgs | Promise<SortEventArgs> };
    let cellEvtArgs: CellSaveEventArgs;
    let cellValue: CellModel;
    let clipboardPromise: Promise<Object>;
    let model: RowModel[];
    let sheet: SheetModel;
    let column: ColumnModel;
    let row: RowModel;
    let addressInfo: { indices: number[], sheetIndex: number };
    let isFromUpdateAction: boolean = (options as unknown as { isFromUpdateAction: boolean }).isFromUpdateAction || isUndefined(isRedo);
    if ((options as unknown as { isUndoRedo: boolean }).isUndoRedo) {
        isFromUpdateAction = (options as unknown as { isFromUpdateAction: boolean }).isFromUpdateAction = true;
        delete (options as unknown as { isUndoRedo: boolean }).isUndoRedo;
        spreadsheet.notify(performUndoRedo, options);
        return;
    }
    if (isFromUpdateAction && !isRecursive) {
        const address: string = eventArgs.address || eventArgs.range || eventArgs.pastedRange
            || (eventArgs.addressCollection && eventArgs.addressCollection[0]) || eventArgs.dataRange;
        const sheetIndex: number = isUndefined(eventArgs.sheetIndex) ? isUndefined(eventArgs.sheetIdx)
            ? isUndefined(eventArgs.activeSheetIndex) ? address ? getSheetIndexFromAddress(spreadsheet, address)
                : spreadsheet.activeSheetIndex : eventArgs.activeSheetIndex : eventArgs.sheetIdx : eventArgs.sheetIndex;
        if (sheetIndex !== spreadsheet.activeSheetIndex) {
            const args: { sheet: SheetModel, indexes: number[], promise?: Promise<Cell>, resolveAfterFullDataLoaded?: boolean } = {
                sheet: getSheet(spreadsheet, sheetIndex), resolveAfterFullDataLoaded: true,
                indexes: [0, 0, 0, 0], promise: new Promise((resolve: Function) => { resolve((() => { /** */ })()); })
            };
            spreadsheet.notify(updateSheetFromDataSource, args);
            args.promise.then((): void => {
                updateAction(options, spreadsheet, isRedo, undoCollections, actionEventArgs, true);
            });
            return;
        }
    }
    let cellSaveArgs: CellSaveEventArgs; let addrInfo: { sheetIndex: number, indices: number[] };
    let clearArgs: { options: object, isFromUpdateAction: boolean, cfClearActionArgs?:
    { previousConditionalFormats: object, conditionalFormats: object } };
    const sheetIndex: number = getSheetIndexFromId(spreadsheet, eventArgs.index);
    let cellIndexes: number[];
    switch (options.action) {
    case 'sorting':
        args = {
            range: (options.eventArgs as SortEventArgs).range,
            sortOptions: (options.eventArgs as SortEventArgs).sortOptions,
            cancel: false
        };
        promise = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
        sortArgs = { args: args, promise: promise };
        spreadsheet.notify(initiateSort, sortArgs);
        (sortArgs.promise as Promise<SortEventArgs>).then((args: SortEventArgs) => {
            spreadsheet.serviceLocator.getService<ICellRenderer>('cell').refreshRange(getIndexesFromAddress(args.range));
        });
        break;
    case 'cellSave':
        cellEvtArgs = options.eventArgs as CellSaveEventArgs;
        cellSaveArgs = { element: cellEvtArgs.element, value: cellEvtArgs.value,
            oldValue: cellEvtArgs.oldValue, address: cellEvtArgs.address, displayText: cellEvtArgs.displayText,
            formula: cellEvtArgs.formula, originalEvent: cellEvtArgs.originalEvent };
        cellValue = cellSaveArgs.formula ? { formula: cellSaveArgs.formula } : { value: cellSaveArgs.value };
        spreadsheet.updateCell(cellValue, cellSaveArgs.address);
        if (isRedo === true) {
            spreadsheet.trigger('cellSave', cellSaveArgs);
        }
        break;
    case 'addNote':
    case 'editNote':
    case 'deleteNote':
        cellIndexes = getIndexesFromAddress(options.eventArgs.address);
        if (isRedo) {
            updateCell(
                spreadsheet as Workbook, spreadsheet.getActiveSheet(), { rowIdx: cellIndexes[0], colIdx: cellIndexes[1], preventEvt: true,
                    cell: { notes: options.eventArgs.notes }});
            spreadsheet.serviceLocator.getService<ICellRenderer>('cell').refreshRange(
                getIndexesFromAddress(eventArgs.address), false, false, true, false, isImported(spreadsheet));
        }
        break;
    case 'cellDelete':
        addrInfo = getAddressInfo(spreadsheet, options.eventArgs.address);
        clearRange(spreadsheet, addrInfo.indices, addrInfo.sheetIndex);
        break;
    case 'format':
        if (eventArgs.requestType === 'CellFormat') {
            if (eventArgs.style && eventArgs.style.border && !isNullOrUndefined(eventArgs.borderType)) {
                const style: CellStyleModel = {};
                Object.assign(style, eventArgs.style, null, true);
                eventArgs.style.border = undefined;
                spreadsheet.notify(setCellFormat, { style: eventArgs.style, refreshRibbon: true, range: eventArgs.range });
                eventArgs.style.border = style.border;
                spreadsheet.setBorder(eventArgs.style, eventArgs.range, eventArgs.borderType);
                eventArgs.style = style;
            } else {
                spreadsheet.notify(setCellFormat, { style: eventArgs.style, refreshRibbon: true, range: eventArgs.range });
            }
            getUpdateUsingRaf((): void => spreadsheet.selectRange(spreadsheet.getActiveSheet().selectedRange));
        } else {
            spreadsheet.numberFormat(eventArgs.format, eventArgs.range);
        }
        break;
    case 'clipboard':
        clipboardPromise = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
        addressInfo = spreadsheet.getAddressInfo(eventArgs.copiedRange);
        spreadsheet.notify(eventArgs.copiedInfo.isCut ? cut : copy, {
            range: addressInfo.indices, sId: getSheet(spreadsheet, addressInfo.sheetIndex).id,
            promise: promise, invokeCopy: true, isPublic: true, isFromUpdateAction: true
        });
        clipboardPromise.then(() => spreadsheet.notify(paste, {
            range: getIndexesFromAddress(eventArgs.pastedRange),
            sIdx: getSheetIndex(spreadsheet, getSheetNameFromAddress(eventArgs.pastedRange)),
            type: eventArgs.type, isAction: false, isInternal: true, isFromUpdateAction: true
        }));
        break;
    case 'gridLines':
        spreadsheet.setSheetPropertyOnMute(spreadsheet.sheets[eventArgs.sheetIdx], 'showGridLines', eventArgs.isShow);
        (spreadsheet.serviceLocator.getService('sheet') as IRenderer).toggleGridlines();
        spreadsheet.notify(refreshRibbonIcons, null);
        break;
    case 'headers':
        spreadsheet.setSheetPropertyOnMute(spreadsheet.sheets[eventArgs.sheetIdx], 'showHeaders', eventArgs.isShow);
        (spreadsheet.serviceLocator.getService('sheet') as IRenderer).showHideHeaders();
        spreadsheet.notify(refreshRibbonIcons, null);
        break;
    case 'resize':
    case 'resizeToFit':
        if (isFromUpdateAction) {
            sheet = spreadsheet.sheets[eventArgs.sheetIndex];
            column = getColumn(sheet, eventArgs.index);
            row = getRow(sheet, eventArgs.index);
            if ((eventArgs.isCol && column && column.hidden) || (row && row.hidden)) {
                spreadsheet.notify(hideShow, { startIndex: eventArgs.index, endIndex: eventArgs.index, hide: false, isCol: eventArgs.isCol,
                    sheetIndex: eventArgs.sheetIndex });
            }
        }
        if (eventArgs.isCol) {
            if (eventArgs.hide === undefined) {
                spreadsheet.setColWidth(isFromUpdateAction && !isUndefined(isRedo) ? eventArgs.oldWidth :
                    eventArgs.width, eventArgs.index, eventArgs.sheetIndex);
            } else {
                spreadsheet.hideColumn(eventArgs.index, eventArgs.index, eventArgs.hide);
            }
        } else {
            if (eventArgs.hide === undefined) {
                spreadsheet.setRowHeight(isFromUpdateAction && !isUndefined(isRedo) ? eventArgs.oldHeight :
                    eventArgs.height, eventArgs.index, eventArgs.sheetIndex);
            } else {
                spreadsheet.hideRow(eventArgs.index, eventArgs.index, eventArgs.hide);
            }
            spreadsheet.notify(resizeRowHeight, { rowIndex: eventArgs.index });
        }
        break;
    case 'renameSheet':
        spreadsheet.setSheetPropertyOnMute(spreadsheet.sheets[sheetIndex as number], 'name', eventArgs.value);
        spreadsheet.notify(sheetNameUpdate, {
            items: spreadsheet.element.querySelector('.e-sheet-tabs-items'),
            value: eventArgs.value,
            idx: sheetIndex
        });
        break;
    case 'hideSheet':
        spreadsheet.notify(hideSheet, { sheetIndex: eventArgs.sheetIndex });
        break;
    case 'showSheet':
        spreadsheet.notify(showSheet, eventArgs);
        break;
    case 'removeSheet':
        spreadsheet.notify(removeSheetTab, { index: eventArgs.index, isAction: true, count: eventArgs.sheetCount, clicked: true });
        break;
    case 'gotoSheet':
        spreadsheet.notify(goToSheet, { selectedIndex: eventArgs.currentSheetIndex, previousIndex: eventArgs.previousSheetIndex });
        break;
    case 'moveSheet':
        moveSheet(spreadsheet, eventArgs.position, eventArgs.sheetIndexes, null, isFromUpdateAction);
        break;
    case 'wrap':
        wrap(options.eventArgs.address, options.eventArgs.wrap, spreadsheet);
        break;
    case 'hideShow':
        if (eventArgs.isCol) {
            spreadsheet.notify(
                hideShow, <HideShowEventArgs>{ startIndex: eventArgs.startIndex, endIndex: eventArgs.endIndex, isCol: true,
                    hide: isRedo === false ? !eventArgs.hide : eventArgs.hide, sheetIndex: eventArgs.sheetIndex });
        } else {
            spreadsheet.notify(
                hideShow, <HideShowEventArgs>{ startIndex: eventArgs.startIndex, endIndex: eventArgs.endIndex,
                    hide: isRedo === false ? !eventArgs.hide : eventArgs.hide, sheetIndex: eventArgs.sheetIndex });
        }
        break;
    case 'replace':
        spreadsheet.notify(replace, { value: eventArgs.compareValue, replaceValue: eventArgs.replaceValue,
            sheetIndex: eventArgs.sheetIndex, address: eventArgs.address });
        break;
    case 'replaceAll':
        spreadsheet.notify(replaceAll, eventArgs);
        break;
    case 'filter':
        promise = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
        if (isRedo === false) {
            spreadsheet.notify(
                initiateFilterUI, { predicates: eventArgs.previousPredicates, range: eventArgs.range, sIdx: eventArgs.sheetIndex, promise:
                    promise, isInternal: true });
        } else {
            spreadsheet.notify(
                initiateFilterUI, { predicates: eventArgs.predicates, range: eventArgs.range, sIdx: eventArgs.sheetIndex, promise: promise,
                    isInternal: true, useFilterRange: eventArgs.useFilterRange, allowHeaderFilter: eventArgs.allowHeaderFilter });
        }
        if (actionEventArgs && !isFromUpdateAction) {
            promise.then((): void => {
                spreadsheet.notify(completeAction, extend({ isUndo: !isRedo, isUndoRedo: !isFromUpdateAction }, actionEventArgs));
            });
        }
        break;
    case 'insert':
        if (options.eventArgs.modelType === 'Sheet') {
            sheet = spreadsheet;
        } else {
            sheet = getSheet(spreadsheet, options.eventArgs.activeSheetIndex);
            if (!sheet) { break; }
        }
        if (isRedo === false) {
            spreadsheet.notify(
                deleteModel, <InsertDeleteModelArgs>{ model: sheet, start: options.eventArgs.index, isUndoRedo: true, end:
                    options.eventArgs.index + (options.eventArgs.model.length - 1), modelType: options.eventArgs.modelType });
        } else {
            spreadsheet.notify(
                insertModel, <InsertDeleteModelArgs>{ model: sheet, start: options.eventArgs.index, end: options.eventArgs.index +
                    (options.eventArgs.model.length - 1), modelType: options.eventArgs.modelType, checkCount: isRedo === undefined ?
                    options.eventArgs.sheetCount : null, activeSheetIndex: options.eventArgs.activeSheetIndex, isUndoRedo: true,
                insertType: options.eventArgs.insertType, isFromUpdateAction: isFromUpdateAction });
        }
        break;
    case 'delete':
        if (options.eventArgs.modelType === 'Sheet') {
            sheet = spreadsheet;
        } else {
            sheet = getSheet(spreadsheet, options.eventArgs.activeSheetIndex);
            if (!sheet) {
                break;
            }
        }
        if (isRedo === false) {
            spreadsheet.notify(
                insertModel, <InsertDeleteModelArgs>{ model: sheet, start: options.eventArgs.deletedModel, modelType:
                    options.eventArgs.modelType, columnCellsModel: options.eventArgs.deletedCellsModel, definedNames:
                    options.eventArgs.definedNames, activeSheetIndex: options.eventArgs.activeSheetIndex, isUndoRedo: true,
                insertType: options.eventArgs.modelType === 'Row' ? 'above' : 'before', conditionalFormats: options.eventArgs.conditionalFormats, prevAction: options.action  });
        } else {
            spreadsheet.notify(
                deleteModel, <InsertDeleteModelArgs>{ model: sheet, start: options.eventArgs.startIndex,
                    checkCount: options.eventArgs.sheetCount, end: options.eventArgs.endIndex, modelType: options.eventArgs.modelType,
                    isUndoRedo: true, insertType: options.eventArgs.modelType === 'Row' ? 'above' : 'before' });
        }
        break;
    case 'validation':
        if (isRedo === false) {
            spreadsheet.notify(removeDataValidation, { range: eventArgs.range });
        } else {
            spreadsheet.notify(
                cellValidation, { rules: { type: eventArgs.type, operator: eventArgs.operator, value1: eventArgs.value1, value2:
                    eventArgs.value2, ignoreBlank: eventArgs.ignoreBlank, inCellDropDown: eventArgs.inCellDropDown },
                range: eventArgs.range });
        }
        break;
    case 'removeHighlight':
    case 'addHighlight':
        spreadsheet.notify(
            invalidData, { isRemoveHighlight: options.action === 'removeHighlight' ? isRedo !== false : isRedo === false,
                range: eventArgs.range, isPublic: true });
        break;
    case 'merge':
        options.eventArgs.isAction = false;
        model = [];
        for (let rIdx: number = 0, rCnt: number = eventArgs.model.length; rIdx < rCnt; rIdx++) {
            model.push({ cells: [] });
            for (let cIdx: number = 0, cCnt: number = eventArgs.model[rIdx as number].cells.length; cIdx < cCnt; cIdx++) {
                model[rIdx as number].cells[cIdx as number] = {};
                Object.assign(model[rIdx as number].cells[cIdx as number], eventArgs.model[rIdx as number].cells[cIdx as number]);
            }
        }
        spreadsheet.notify(setMerge, options.eventArgs);
        eventArgs.model = model;
        break;
    case 'clear':
        clearArgs = { options: options.eventArgs, isFromUpdateAction: isFromUpdateAction };
        spreadsheet.notify(clearViewer, clearArgs);
        if (!isFromUpdateAction && clearArgs.cfClearActionArgs) {
            eventArgs.cfClearActionArgs.previousConditionalFormats = clearArgs.cfClearActionArgs.previousConditionalFormats;
            eventArgs.cfClearActionArgs.conditionalFormats = clearArgs.cfClearActionArgs.conditionalFormats;
        }
        break;
    case 'conditionalFormat':
        if (isRedo === false) {
            spreadsheet.notify(
                clearCFRule, <CFArgs>{ range: eventArgs.range, cfModel: { type: eventArgs.type, cFColor: eventArgs.cFColor,
                    value: eventArgs.value }, sheetIdx: eventArgs.sheetIdx, isUndoRedo: !eventArgs.cancel,
                isFromUpdateAction: isFromUpdateAction });
        } else {
            spreadsheet.notify(
                setCFRule, <CFArgs>{ cfModel: { type: eventArgs.type, cFColor: eventArgs.cFColor, value: eventArgs.value,
                    range: eventArgs.range }, sheetIdx: eventArgs.sheetIdx, isUndoRedo: true, isFromUpdateAction: isFromUpdateAction });
        }
        break;
    case 'clearCF':
        if (isRedo === false) {
            spreadsheet.notify(
                clearCFRule, <CFArgs>{ oldCFModel: eventArgs.previousConditionalFormats, updatedCFModel: eventArgs.conditionalFormats,
                    range: eventArgs.selectedRange, isUndo: true, sheetIdx: eventArgs.sheetIdx });
        } else {
            const clearArgs: CFArgs = { range: eventArgs.selectedRange, sheetIdx: eventArgs.sheetIdx,
                isUndoRedo: true, isFromUpdateAction: isFromUpdateAction };
            spreadsheet.notify(clearCFRule, clearArgs);
            if (!isFromUpdateAction) {
                eventArgs.previousConditionalFormats = clearArgs.oldCFModel;
                if (clearArgs.updatedCFModel.length) {
                    eventArgs.conditionalFormats = clearArgs.updatedCFModel;
                } else {
                    delete eventArgs.conditionalFormats;
                }
            }
        }
        break;
    case 'insertImage':
        if (isRedo === false) {
            spreadsheet.notify(
                deleteImage, { id: options.eventArgs.id, sheetIdx: options.eventArgs.sheetIndex + 1, range: options.eventArgs.range,
                    preventEventTrigger: true });
        } else {
            spreadsheet.notify(
                createImageElement, { options: { src: options.eventArgs.imageData, height: options.eventArgs.imageHeight, width:
                options.eventArgs.imageWidth, imageId: options.eventArgs.id }, range: options.eventArgs.range, isPublic: false,
                isUndoRedo: true });
        }
        break;
    case 'deleteImage':
        if (isRedo === false) {
            spreadsheet.notify(
                createImageElement, { options: { src: options.eventArgs.imageData, height: options.eventArgs.imageHeight, width:
                options.eventArgs.imageWidth, imageId: options.eventArgs.id }, range: options.eventArgs.address, isPublic: false,
                isUndoRedo: true });
        } else {
            spreadsheet.notify(
                deleteImage, { id: options.eventArgs.id, range: options.eventArgs.address, preventEventTrigger: true });
        }
        break;
    case 'imageRefresh':
        element = document.getElementById(options.eventArgs.id);
        if (isRedo === false) {
            spreadsheet.notify(
                refreshImgCellObj, { prevTop: options.eventArgs.currentTop, prevLeft: options.eventArgs.currentLeft, currentTop:
                options.eventArgs.prevTop, currentLeft: options.eventArgs.prevLeft, id: options.eventArgs.id, currentHeight:
                options.eventArgs.prevHeight, currentWidth: options.eventArgs.prevWidth, requestType: 'imageRefresh',
                prevHeight: options.eventArgs.currentHeight, prevWidth: options.eventArgs.currentWidth, isUndoRedo: true });
        } else {
            options.eventArgs.isUndoRedo = true;
            spreadsheet.notify(refreshImgCellObj, options.eventArgs);
        }
        if (element) {
            element.style.height = isRedo === false ? options.eventArgs.prevHeight + 'px' : options.eventArgs.currentHeight + 'px';
            element.style.width = isRedo === false ? options.eventArgs.prevWidth + 'px' : options.eventArgs.currentWidth + 'px';
            element.style.top = isRedo === false ? options.eventArgs.prevTop + 'px' : options.eventArgs.currentTop + 'px';
            element.style.left = isRedo === false ? options.eventArgs.prevLeft + 'px' : options.eventArgs.currentLeft + 'px';
        }
        break;
    case 'insertChart':
        if (isRedo === false) {
            spreadsheet.notify(deleteChart, { id: eventArgs.id, range: eventArgs.range, isUndoRedo: true });
        } else {
            const chartOptions: ChartModel[] = [{
                type: eventArgs.type, theme: eventArgs.theme,
                markerSettings: eventArgs.markerSettings, isSeriesInRows: eventArgs.isSeriesInRows,
                range: eventArgs.range, id: eventArgs.id, height: eventArgs.height, width: eventArgs.width, top: eventArgs.top,
                left: eventArgs.left
            }];
            spreadsheet.notify(
                setChart, { chart: chartOptions, isUndoRedo: false, range: eventArgs.posRange });
        }
        break;
    case 'deleteChart':
        if (isRedo === false) {
            const chartOpts: ChartModel[] = [{
                type: eventArgs.type, theme: eventArgs.theme, markerSettings: eventArgs.markerSettings,
                isSeriesInRows: eventArgs.isSeriesInRows, range: eventArgs.range, id: eventArgs.id,
                height: eventArgs.height, width: eventArgs.width, top: eventArgs.top, left: eventArgs.left
            }];
            spreadsheet.notify(
                setChart, { chart: chartOpts, isUndoRedo: false, range: eventArgs.posRange });
        } else {
            spreadsheet.notify(deleteChart, { id: eventArgs.id, range: eventArgs.range, isUndoRedo: true });
        }
        break;
    case 'chartRefresh':
        chartElement = document.getElementById(options.eventArgs.id);
        if (chartElement) {
            chartElement.style.height = isRedo === false ? options.eventArgs.prevHeight + 'px' : options.eventArgs.currentHeight + 'px';
            chartElement.style.width = isRedo === false ? options.eventArgs.prevWidth + 'px' : options.eventArgs.currentWidth + 'px';
            chartElement.style.top = isRedo === false ? options.eventArgs.prevTop + 'px' : options.eventArgs.currentTop + 'px';
            chartElement.style.left = isRedo === false ? options.eventArgs.prevLeft + 'px' : options.eventArgs.currentLeft + 'px';
        }
        if (isRedo === false) {
            spreadsheet.notify(refreshChartCellObj, extend({}, options.eventArgs, {
                currentColIdx: options.eventArgs.prevColIdx, currentHeight: options.eventArgs.prevHeight,
                currentLeft: options.eventArgs.prevLeft, currentRowIdx: options.eventArgs.prevRowIdx,
                currentTop: options.eventArgs.prevTop, currentWidth: options.eventArgs.prevWidth,
                prevColIdx: options.eventArgs.currentColIdx, prevHeight: options.eventArgs.currentHeight,
                prevLeft: options.eventArgs.currentLeft, prevRowIdx: options.eventArgs.currentRowIdx,
                prevTop: options.eventArgs.currentTop, prevWidth: options.eventArgs.currentWidth, isUndoRedo: true
            }));
            spreadsheet.notify(refreshChartSize, {
                height: options.eventArgs.prevHeight.toString(),
                width: options.eventArgs.prevWidth.toString(), overlayEle: chartElement
            });
        } else {
            options.eventArgs.isUndoRedo = true;
            spreadsheet.notify(refreshChartCellObj, options.eventArgs);
            spreadsheet.notify(refreshChartSize, {
                height: options.eventArgs.currentHeight.toString(),
                width: options.eventArgs.currentWidth.toString(), overlayEle: chartElement
            });
        }
        break;
    case 'chartDesign':
        spreadsheet.notify(chartDesignTab, options.eventArgs);
        break;
    case 'autofill':
        if (isFromUpdateAction && eventArgs.undoArgs) {
            eventArgs.undoArgs.isFromUpdateAction = eventArgs.undoArgs.isUndo = eventArgs.undoArgs.preventEvt = true;
            eventArgs.undoArgs.isPublic = true;
            spreadsheet.notify(performUndoRedo, eventArgs.undoArgs);
        }
        spreadsheet.notify(
            setAutoFill, { fillRange: options.eventArgs.fillRange, dataRange: options.eventArgs.dataRange,
                fillType: options.eventArgs.fillType, direction: options.eventArgs.direction });
        break;
    case 'removeValidation':
        if (isRedo !== false) {
            spreadsheet.notify(removeDataValidation, { range: eventArgs.range, isCol: eventArgs.isColSelected });
        }
        break;
    case 'addDefinedName':
        if (isRedo === false) {
            spreadsheet.notify(
                workbookFormulaOperation, { action: 'removeDefinedName', isRemoved: false, definedName: eventArgs.name, scope:
                eventArgs.scope, isEventTrigger: true });
        } else {
            const definedName: DefineNameModel =
                { name: eventArgs.name, refersTo: eventArgs.refersTo, scope: eventArgs.scope, comment: eventArgs.comment };
            spreadsheet.notify(
                workbookFormulaOperation, { action: 'addDefinedName', isAdded: false, definedName: definedName, isEventTrigger: true });
        }
        break;
    case 'hyperlink':
        spreadsheet.notify(
            setLinkModel, { hyperlink: eventArgs.hyperlink, cell: eventArgs.address, displayText: eventArgs.displayText,
                triggerEvt: false });
        spreadsheet.serviceLocator.getService<ICellRenderer>('cell').refreshRange(
            getIndexesFromAddress(eventArgs.address), false, false, false, false, isImported(spreadsheet));
        break;
    case 'removeHyperlink':
        spreadsheet.notify(removeHyperlink, { range: eventArgs.address, preventEventTrigger: true });
        break;
    case 'freezePanes':
        spreadsheet.freezePanes(eventArgs.row, eventArgs.column, eventArgs.sheetIndex);
        break;
    case 'duplicateSheet':
        duplicateSheet(spreadsheet, eventArgs.sheetIndex, null, isFromUpdateAction);
        break;
    case 'protectSheet':
        if (eventArgs.isProtected) {
            spreadsheet.notify(protectsheetHandler, eventArgs);
        } else {
            spreadsheet.setSheetPropertyOnMute(getSheet(spreadsheet, eventArgs.sheetIndex), 'password', '');
            spreadsheet.notify(applyProtect, { isActive: true, sheetIndex: eventArgs.sheetIndex });
        }
        break;
    case 'protectWorkbook':
        if (eventArgs.isProtected) {
            spreadsheet.notify(setProtectWorkbook, eventArgs);
        } else {
            spreadsheet.notify(removeWorkbookProtection, null);
        }
        break;
    case 'lockCells':
        spreadsheet.notify(setLockCells, eventArgs);
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
    const sheet: SheetModel = workbook.sheets[sheetIdx as number];
    const ranges: RangeModel[] = sheet.ranges;
    let range: number[];
    for (let i: number = 0, len: number = ranges.length; i < len; i++) {
        if (ranges[i as number].template) {
            range = getRangeIndexes(ranges[i as number].address.length ? ranges[i as number].address : ranges[i as number].startCell);
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
    const prevHgt: number = getRowHeight(sheet, rowIdx, true);
    const frozenCol: number = parent.frozenColCount(sheet);
    const dprHgt: number = getDPRValue(height);
    row = row || (sheet.frozenRows ? parent.getRow(rowIdx, null, frozenCol) : parent.getRow(rowIdx));
    if (row) {
        row.style.height = `${dprHgt}px`;
    }
    if (sheet.frozenColumns) {
        hRow = hRow || parent.getRow(rowIdx, null, frozenCol - 1);
    } else {
        const frozenRow: number = parent.frozenRowCount(sheet);
        hRow = hRow || parent.getRow(rowIdx, rowIdx < frozenRow ? parent.sheetModule.getSelectAllTable() : parent.getRowHeaderTable());
    }
    if (hRow) {
        hRow.style.height = `${dprHgt}px`;
    }
    setRowHeight(sheet, rowIdx, height);
    parent.setProperties({ sheets: parent.sheets }, true);
    if (notifyRowHgtChange) {
        parent.notify(rowHeightChanged, { rowIdx: rowIdx, threshold: dprHgt - prevHgt });
    }
}

/**
 * @hidden
 * @param {Workbook} context - Specify the context
 * @param {CellStyleModel} style - specify the style.
 * @param {number} lines - specify the lines
 * @param {number} lineHeight - Specify the line height.
 * @returns {number} - get Text Height
 */
export function getTextHeight(context: Workbook, style: CellStyleModel, lines: number = 1, lineHeight?: number): number {
    const fontSize: string = (style && style.fontSize) || context.cellStyle.fontSize;
    const fontSizePx: number = fontSize.indexOf('pt') > -1 ? parseInt(fontSize, 10) / 0.75 : parseInt(fontSize, 10);
    const hgt: number = fontSizePx * (lineHeight || getLineHeight(style && style.fontFamily ? style : context.cellStyle)) * lines;
    return Math.ceil(hgt % 1 > 0.9 ? hgt + 1 : hgt); // 0.9 -> if it is nearest value adding extra 1 pixel
}

/**
 * @hidden
 * @param {CellStyleModel} style - cell style
 * @returns {number} - returns line height
 */
export function getLineHeight(style: CellStyleModel): number {
    let lineHeight: number = textLineHeight;
    if (style) {
        if (style.fontFamily === 'Arial Black' || style.fontFamily === 'Comic Sans MS') {
            lineHeight = 1.44;
        } else if ((style.fontFamily as string) === '"Segoe UI", sans-serif') {
            lineHeight = 1.36;
        }
    }
    return lineHeight;
}

/**
 * @hidden
 * @param {string} text - Specify the text
 * @param {CellStyleModel} style - specify the style.
 * @param {CellStyleModel} parentStyle - specify the parentStyle
 * @param  {boolean} preventDpr - specify the preventDpr.
 * @returns {number} - get Text Width
 */
export function getTextWidth(text: string, style: CellStyleModel, parentStyle: CellStyleModel, preventDpr?: boolean): number {
    if (!style) {
        style = parentStyle;
    }
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.font = (style.fontStyle || parentStyle.fontStyle) + ' ' + (style.fontWeight || parentStyle.fontWeight) + ' '
        + (style.fontSize || parentStyle.fontSize) + ' ' + (style.fontFamily || parentStyle.fontFamily);
    return preventDpr ? context.measureText(text).width : getDPRValue(context.measureText(text).width, true);
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
    let width: number; let splitTextArr: string[]; let lWidth: number; let cWidth: number;
    let prevWidth: number = 0;
    const textArr: string[] = text.toString().split(' ');
    const spaceWidth: number = getTextWidth(' ', style, parentStyle);
    let hypenWidth: number;
    let lines: number;
    let cnt: number = 0;
    let lineCnt: number = 0; let maxCnt: number = 0;
    const calculateCount: Function = (txt: string, isHypenSplit: boolean): void => {
        if (prevWidth) {
            cnt++;
        }
        if (width / colwidth >= 1) {
            txt.split('').forEach((val: string) => {
                cWidth = getTextWidth(val, style, parentStyle, true);
                lWidth += cWidth;
                if (lWidth > colwidth) {
                    cnt++;
                    lWidth = cWidth;
                }
            });
            width = getDPRValue(lWidth, true);
        }
        if (!isHypenSplit) { addSpace(width); }
        prevWidth = width;
    };
    const addSpace: Function = (size: number): void => {
        width += ((size + spaceWidth) / colwidth >= 1 ? 0 : spaceWidth);
    };
    textArr.forEach((txt: string) => {
        lWidth = 0; cWidth = 0;
        width = getTextWidth(txt, style, parentStyle);
        lines = (prevWidth + width) / colwidth;
        if (lines > 1) {
            splitTextArr = txt.split('-');
            if (splitTextArr.length > 1) {
                splitTextArr.forEach((splitText: string) => {
                    lWidth = 0; cWidth = 0;
                    if (!hypenWidth) { hypenWidth = getTextWidth('-', style, parentStyle); }
                    width = getTextWidth(splitText, style, parentStyle);
                    if (splitTextArr[splitTextArr.length - 1] !== splitText) {
                        width += hypenWidth;
                    }
                    lines = (prevWidth + width) / colwidth;
                    if (lines >= 1) {
                        calculateCount(splitText, splitTextArr[splitTextArr.length - 1] !== splitText);
                    } else {
                        if (splitTextArr[splitTextArr.length - 1] === splitText && textArr[textArr.length - 1] !== txt) {
                            addSpace(prevWidth + width);
                        }
                        prevWidth += width;
                    }
                });
            } else {
                calculateCount(txt, false);
            }
        } else {
            addSpace(prevWidth + width);
            prevWidth += width;
        }
    });
    if (prevWidth) {
        lineCnt = (prevWidth - spaceWidth) / colwidth;
        maxCnt = parseFloat((lineCnt).toString().split('.')[0]);
        cnt += (lineCnt + 0.05 >= maxCnt + 1 ?  Math.ceil(lineCnt) + 1 : Math.ceil(lineCnt));
    }
    return cnt;
}

/**
 * calculation for width taken by border inside a cell
 *
 * @param {number} rowIdx - Specify the row index.
 * @param {number} colIdx - Specify the column index.
 * @param {SheetModel} sheet - Specify the sheet.
 * @returns {number} - get border width.
 */
function getBorderWidth(rowIdx: number, colIdx: number, sheet: SheetModel): number {
    let width: number = 0;
    const cell: CellModel = getCell(rowIdx, colIdx, sheet, null, true);
    const rightSideCell: CellModel = getCell(rowIdx, colIdx + 1, sheet, null, true);
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
    return width > 0 && width < 1 ? 1 : width;
}

/**
 * calculation for height taken by border inside a cell
 *
 * @param {number} rowIdx - Specify the row index.
 * @param {number} colIdx - Specify the column index.
 * @param {SheetModel} sheet - Specify the sheet.
 * @returns {number} - get border height.
 * @hidden
 */
export function getBorderHeight(rowIdx: number, colIdx: number, sheet: SheetModel): number {
    let height: number = 0;
    const cell: CellModel = getCell(rowIdx, colIdx, sheet, null, true);
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
    const bottomSideCell: CellModel = getCell(rowIdx + 1, colIdx, sheet, null, true);
    if (!(cell.style && (cell.style.border || cell.style.borderBottom)) && bottomSideCell.style && bottomSideCell.style.borderTop) {
        height += parseFloat(bottomSideCell.style.borderTop.split('px')[0]);
    }
    return Math.ceil(height) || 1; // 1 -> For default bottom border
}

/**
 * Calculating column width by excluding cell padding and border width
 *
 * @param {SheetModel} sheet - Specify the sheet
 * @param {number} rowIdx - Specify the row index.
 * @param {number} startColIdx - Specify the start column index.
 * @param {number} endColIdx - Specify the end column index.
 * @returns {number} - get excluded column width.
 * @hidden
 */
export function getExcludedColumnWidth(sheet: SheetModel, rowIdx: number, startColIdx: number, endColIdx: number = startColIdx): number {
    return getColumnsWidth(sheet, startColIdx, endColIdx, true) - getDPRValue((4 + (getBorderWidth(rowIdx, startColIdx, sheet) || 1))); // 4 -> For cell padding
}

/**
 * @param {Workbook} context - Specify the Workbook.
 * @param {number} rowIdx - Specify the row index.
 * @param {number} colIdx - Specify the column index.
 * @param {SheetModel} sheet - Specify the sheet.
 * @param {CellStyleModel} style - Specify the style.
 * @param {number} lines - Specify the lines.
 * @param {number} lineHeight - Specify the line height.
 * @returns {number} - get text height with border.
 * @hidden
 */
export function getTextHeightWithBorder(
    context: Workbook, rowIdx: number, colIdx: number, sheet: SheetModel, style: CellStyleModel, lines?: number,
    lineHeight?: number): number {
    return getTextHeight(context, style, lines, lineHeight) + getBorderHeight(rowIdx, colIdx, sheet);
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
    if (!sheet.maxHgts[rIdx as number]) {
        sheet.maxHgts[rIdx as number] = {};
    }
    sheet.maxHgts[rIdx as number][cIdx as number] = hgt;
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
    const rowHgt: object = sheet.maxHgts[rIdx as number];
    if (rowHgt) {
        Object.keys(rowHgt).forEach((key: string) => {
            if (rowHgt[`${key}`] > maxHgt) {
                maxHgt = rowHgt[`${key}`];
            }
        });
    }
    return maxHgt;
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
            if (ele.classList.contains('e-input')) {
                const inputEle: HTMLInputElement = ele as HTMLInputElement;
                const position: number = inputEle.value.length;
                inputEle.setSelectionRange(position, position);
            }
            (ele as HTMLElement).focus({ preventScroll: true });
        }
    }
}

/**
 * Checks whether a specific range of cells is locked or not.
 *
 * @param {Spreadsheet} parent - Specify the spreadsheet.
 * @param {number[]} rangeIndexes - Specify the range indexes.
 * @returns {boolean} - Returns true if any of the cells is locked and returns false if none of the cells is locked.
 * @hidden
 */
export function isLockedCells(parent: Spreadsheet, rangeIndexes?: number[]): boolean {
    const sheet: SheetModel = parent.getActiveSheet(); let hasLockCell: boolean;
    const address: number[] = !isNullOrUndefined(rangeIndexes) ? rangeIndexes : getSwapRange(getRangeIndexes(sheet.selectedRange));
    for (let row: number = address[0]; row <= address[2]; row++) {
        for (let col: number = address[1]; col <= address[3]; col++) {
            const cell: CellModel = getCell(row, col, sheet);
            if (isLocked(cell, getColumn(sheet, col))) {
                hasLockCell = true;
                break;
            }
        }
    }
    return hasLockCell;
}

/**
 * Checks whether the range is discontinuous or not.
 *
 * @param {string} range - Specify the sheet
 * @returns {boolean} - Returns true if the range is discontinuous range.
 * @hidden
 */
export function isDiscontinuousRange(range: string): boolean {
    return range.includes(' ');
}

/**
 * @hidden
 * @param {Spreadsheet} context - Specifies the context.
 * @param {number[]} range - Specifies the address range.
 * @param {number} sheetIdx - Specifies the sheetIdx.
 * @returns {void} - To clear the range.
 */
export function clearRange(context: Spreadsheet, range: number[], sheetIdx: number): void {
    const sheet: SheetModel = getSheet(context, sheetIdx);
    let skip: boolean; let cell: CellModel; let newCell: CellModel; let td: HTMLElement; let prop: CellUpdateArgs;
    const uiRefresh: boolean = sheetIdx === context.activeSheetIndex; let cfRefreshAll: boolean;
    const cf: ConditionalFormat[] = sheet.conditionalFormats && sheet.conditionalFormats.length && [].slice.call(sheet.conditionalFormats);
    const cfRule: ConditionalFormatModel[] = []; let isCellUpdated: boolean = false;
    for (let sRIdx: number = range[0], eRIdx: number = range[2]; sRIdx <= eRIdx; sRIdx++) {
        if (isFilterHidden(sheet, sRIdx)) { continue; }
        for (let sCIdx: number = range[1], eCIdx: number = range[3]; sCIdx <= eCIdx; sCIdx++) {
            const args: { cellIdx: number[], isUnique: boolean, uniqueRange: string } = { cellIdx: [sRIdx, sCIdx], isUnique: false ,
                uniqueRange: '' };
            context.notify(checkUniqueRange, args); skip = false;
            if (args.uniqueRange !== '') {
                const rangeIndex: number[] = getIndexesFromAddress(args.uniqueRange);
                skip = getCell(rangeIndex[0], rangeIndex[1], sheet).value === '#SPILL!';
            }
            // Determine if it's the last iteration of the given range.
            const isLastIteration: boolean = (sRIdx === eRIdx) && (sCIdx === eCIdx);
            if (!args.isUnique || skip) {
                cell = getCell(sRIdx, sCIdx, sheet);
                if ((cell && <unknown>cell.value === 0) || cell && cell.value && (isNullOrUndefined(cell.value) || cell.value !== '')) {
                    isCellUpdated = false;
                    newCell = {};
                    if (cell.formula) {
                        newCell.formula = '';
                    }
                    if (cell.value || <unknown>cell.value === 0) {
                        newCell.value = '';
                    }
                    if (cell.hyperlink) {
                        newCell.hyperlink = '';
                    }
                    const mergeArgs: VisibleMergeIndexArgs = { sheet: sheet, cell: cell, rowIdx: sRIdx, colIdx: sCIdx };
                    if (cell.colSpan > 1 || cell.rowSpan > 1) {
                        setVisibleMergeIndex(mergeArgs);
                    }
                    td = context.getCell(mergeArgs.rowIdx, mergeArgs.colIdx);
                    prop = { cell: newCell, rowIdx: sRIdx, colIdx: sCIdx, valChange: true, uiRefresh: uiRefresh, td: td,
                        cellDelete: true, isDelete: !isLastIteration, deletedRange: range };
                    if (!Object.keys(newCell).length || updateCell(context, sheet, prop)) {
                        continue;
                    }
                    if (cf && !cfRefreshAll) {
                        cfRefreshAll = prop.isFormulaDependent;
                        if (!cfRefreshAll) {
                            updateCFModel(cf, cfRule, sRIdx, sCIdx);
                        }
                    }
                    if (td) {
                        if (td.querySelector('.e-cf-databar')) {
                            td.removeChild(td.querySelector('.e-cf-databar'));
                        }
                        if (td.querySelector('.e-iconsetspan')) {
                            td.removeChild(td.querySelector('.e-iconsetspan'));
                        }
                    }
                } else {
                    if (!isCellUpdated && prop) {
                        isCellUpdated = isLastIteration;
                        prop.isDelete = !isLastIteration;
                        if (!Object.keys(newCell).length || updateCell(context, sheet, prop)) {
                            continue;
                        }
                    }
                }
            }
        }
    }
    if ((cfRule.length || cfRefreshAll) && uiRefresh) {
        context.notify(applyCF, <ApplyCFArgs>{ cfModel: !cfRefreshAll && cfRule, refreshAll: cfRefreshAll, isAction: true, isEdit: true });
    }
}

/**
 * Check whether the sheets are imported.
 *
 * @param {Spreadsheet} context - Specifies the spreadsheet instance.
 * @returns {boolean} - It returns true if the sheets are imported otherwise false.
 * @hidden
 */
export function isImported(context: Spreadsheet): boolean {
    return context.allowOpen && context.openModule.preventFormatCheck;
}
/**
 * @param {Spreadsheet} parent - Specifies the spreadsheet instance.
 * @param {number} top - Specifies the top.
 * @returns {number} - It returns bottom offset.
 * @hidden
 */
export function getBottomOffset(parent: Spreadsheet, top: number): { index: number, height: number } {
    let hgt: number = 0;
    const sheet: SheetModel = parent.getActiveSheet();
    const viewPortHeight: number = (sheet.frozenRows ? parent.viewport.height - parent.sheetModule.getColHeaderHeight(sheet, true) :
        parent.viewport.height) - 17 || 20;
    for (let rowIdx: number = top; ; rowIdx++) {
        hgt += getRowHeight(sheet, rowIdx, true);
        if (hgt >= viewPortHeight) {
            return { index: rowIdx, height: hgt };
        }
    }
}

/**
 * @param {Spreadsheet} parent - Specifies the spreadsheet instance.
 * @param {number} left - Specifies the left.
 * @returns {number} -It returns right index using given left value.
 * @hidden
 */
export function getRightIdx(parent: Spreadsheet, left: number): number {
    let width: number = 0;
    const sheet: SheetModel = parent.getActiveSheet();
    const contWidth: number = (parent.getMainContent() as HTMLElement).parentElement.offsetWidth -
        parent.sheetModule.getRowHeaderWidth(sheet) - parent.sheetModule.getScrollSize();
    for (let i: number = left; ; i++) {
        width += getColumnWidth(sheet, i, null, true);
        if (width >= contWidth) {
            return i;
        }
    }
}

/**
 * @param {Spreadsheet} spreadsheet - Specifies the spreadsheet instance.
 * @param {number} minWidth - Specifies the minimum width.
 * @returns {void}
 * @hidden
 */
export function setColMinWidth(spreadsheet: Spreadsheet, minWidth: number): void {
    spreadsheet.renderModule.setSheetPanelSize(minWidth);
}

/**
 * Calculating resolution based windows value
 *
 * @param {number} size - Specify the end column index.
 * @returns {number} - get excluded column width.
 * @hidden
 */
export function addDPRValue(size: number): number {
    if (window.devicePixelRatio % 1 > 0) {
        const pointValue: number = (size * window.devicePixelRatio) % 1;
        return size + (pointValue ? ((pointValue > 0.5 ? (1 - pointValue) : -1 * pointValue) / window.devicePixelRatio) : 0);
    }
    return size;
}

/**
 * @param {Spreadsheet} context - Specifies the spreadsheet instance.
 * @param {string[]} keys - Specifies key array.
 * @returns {string} - It returns sheet property of the given key and context.
 * @hidden
 */
export function getSheetProperties(context: Spreadsheet, keys?: string[]): string {
    const skipProps: string[] = [];
    if (keys) {
        /* eslint-disable */
        let propList: { colPropNames: string[], complexPropNames: string[], propNames: string[] } = Object.getPrototypeOf(
            new Cell(<any>context, 'cells', {}, true)).constructor.prototype.propList;
        const cellProps: string[] = propList.colPropNames.concat(propList.complexPropNames).concat(propList.propNames);
        propList = Object.getPrototypeOf(new Row(<any>context, 'rows', {}, true)).constructor.prototype.propList;
        const rowProps: string[] = propList.colPropNames.concat(propList.complexPropNames).concat(propList.propNames);
        propList = Object.getPrototypeOf(new Column(<any>context, 'columns', {}, true)).constructor.prototype.propList;
        const colProps: string[] = propList.colPropNames.concat(propList.complexPropNames).concat(propList.propNames);
        propList = Object.getPrototypeOf(new Sheet(<any>context, 'sheets', {}, true)).constructor.prototype.propList;
        /* eslint-enable */
        const sheetProps: string[] = propList.colPropNames.concat(propList.complexPropNames).concat(propList.propNames);
        sheetProps.splice(sheetProps.indexOf('rows'), 1);
        sheetProps.splice(sheetProps.indexOf('columns'), 1);
        sheetProps.splice(sheetProps.indexOf('cells'), 1);
        rowProps.splice(rowProps.indexOf('cells'), 1);
        skipProps.push(...sheetProps);
        if (keys.indexOf('rows') === -1) {
            skipProps.push(...rowProps);
        }
        if (keys.indexOf('columns') === -1) {
            skipProps.push(...colProps);
        }
        if (keys.indexOf('cells') === -1) {
            skipProps.push(...cellProps);
        }
        let idx: number;
        keys.forEach((key: string) => {
            idx = skipProps.indexOf(key);
            if (skipProps.indexOf(key) > -1) {
                skipProps.splice(idx, 1);
            }
        });
    } else {
        skipProps.push('ranges');
    }
    const eventArgs: { skipProps: string[], model?: string } = { skipProps: skipProps };
    context.notify('getStringifyObject', eventArgs);
    return eventArgs.model;
}

/**
 * Returns the row indexes and column indexes of the charts in the active sheet
 *
 * @param {Spreadsheet} context - Specifies the Spreadsheet instance.
 * @returns { {chart: ChartModel, chartRowIdx: number, chartColIdx: number}[] } - Returns the row indexes and column indexes of the charts in the active sheet
 * @hidden
 */
export function getChartsIndexes(context?: Spreadsheet): { chart: ChartModel, chartRowIdx: number, chartColIdx: number }[] {
    let chart: ChartModel; const chartIndexes: { chart: ChartModel, chartRowIdx: number, chartColIdx: number }[] = [];
    const sheetName: string = context.getActiveSheet().name;
    for (let i: number = 0, len: number = context.chartColl.length; i < len; i++) {
        chart = context.chartColl[i as number];
        if (sheetName === getSheetNameFromAddress(chart.range)) {
            const prevTop: { clientY: number, isImage?: boolean } = { clientY: chart.top, isImage: true };
            const prevLeft: { clientX: number, isImage?: boolean } = { clientX: chart.left, isImage: true };
            context.notify(getRowIdxFromClientY, prevTop); context.notify(getColIdxFromClientX, prevLeft);
            chartIndexes.push({ chart: chart, chartRowIdx: prevTop.clientY, chartColIdx: prevLeft.clientX });
        }
    }
    return chartIndexes;
}

/**
 * Checks whether a specific range of cells is read-only or not.
 *
 * @param {Spreadsheet} parent - The spreadsheet instance.
 * @param {number[]} rangeIndexes - The range indexes to check.
 * @returns {boolean} - Returns true if any of the cells is read-only, otherwise false.
 * @hidden
 */
export function isReadOnlyCells(parent: Spreadsheet, rangeIndexes?: number[]): boolean {
    const sheet: SheetModel = parent.getActiveSheet(); let hasReadOnlyCell: boolean;
    const address: number[] = !isNullOrUndefined(rangeIndexes) ? rangeIndexes : getSwapRange(getRangeIndexes(sheet.selectedRange));
    for (let row: number = address[0]; row <= address[2]; row++) {
        for (let col: number = address[1]; col <= address[3]; col++) {
            const cell: CellModel = getCell(row, col, sheet);
            if (isReadOnly(cell, getColumn(sheet, col), getRow(sheet, row))) {
                hasReadOnlyCell = true;
                break;
            }
        }
    }
    return hasReadOnlyCell;
}


/**
 * Sets the standard height for a specified sheet in a spreadsheet.
 *
 * @param {Spreadsheet} context - The spreadsheet instance.
 * @param {number} sheetIndex - The index of the sheet to set the standard height.
 * @param {number} standardHeight - The standard height to set for the sheet.
 * @returns {void}
 * @hidden
 */
export function setStandardHeight(context: Spreadsheet, sheetIndex: number, standardHeight: number): void {
    const sheet: SheetModel = context.sheets[sheetIndex as number];
    if (sheet) { sheet.standardHeight = standardHeight; context.dataBind(); }
}

/**
 * Retrieves the standard height of a specific sheet in the spreadsheet.
 *
 * @param {Spreadsheet} context - The spreadsheet instance.
 * @param {number} sheetIndex - The index of the sheet to retrieve the standard height.
 * @returns {number} - The standard height of the specified sheet.
 * @hidden
 */
export function getStandardHeight(context: Spreadsheet, sheetIndex: number): number {
    return context.sheets[sheetIndex as number].standardHeight;
}
