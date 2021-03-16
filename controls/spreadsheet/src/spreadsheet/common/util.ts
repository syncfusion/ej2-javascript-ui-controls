import { Browser, setStyleAttribute as setBaseStyleAttribute, getComponent } from '@syncfusion/ej2-base';
import { StyleType, CollaborativeEditArgs, CellSaveEventArgs, ICellRenderer, IAriaOptions } from './index';
import { IOffset, clearViewer, deleteImage, createImageElement, refreshImgCellObj } from './index';
import { Spreadsheet } from '../base/index';
import { SheetModel, getRowsHeight, getColumnsWidth, getSwapRange, CellModel, CellStyleModel, clearCells } from '../../workbook/index';
import { RangeModel, getRangeIndexes, Workbook, wrap, setRowHeight, insertModel, InsertDeleteModelArgs,  } from '../../workbook/index';
import { BeforeSortEventArgs, SortEventArgs, initiateSort, getIndexesFromAddress, getRowHeight, setMerge } from '../../workbook/index';
import { ValidationModel, setValidation, removeValidation, clearCFRule, setCFRule, ConditionalFormatModel } from '../../workbook/index';
import { removeSheetTab, rowHeightChanged, replace } from './index';
import { getCellIndexes, getCell, ChartModel, setChart, refreshChartSize } from '../../workbook/index';
import { deleteChart } from '../../spreadsheet/index';
import { initiateFilterUI } from './event';

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
 * The function used to get colgroup width based on the row index.
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
    let sibling: HTMLElement = (element)[direction + 'ElementSibling'];
    let result: number = 0;
    while (sibling) {
        if (classList.some((value: string) => sibling.classList.contains(value))) {
            result += sibling.offsetHeight;
        }
        // tslint:disable-next-line:no-any
        sibling = (sibling)[direction + 'ElementSibling'];
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
 * To get the top left cell position in viewport.
 * @hidden
 */
export function getCellPosition(
    sheet: SheetModel, indexes: number[],
    offset: { left: IOffset, top: IOffset } = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } }): { top: number, left: number } {
    let i: number;
    let top: number = offset.top.size;
    let left: number = offset.left.size;
    for (i = offset.top.idx; i < indexes[0]; i++) {
        top += getRowsHeight(sheet, i);
    }
    for (i = offset.left.idx; i < indexes[1]; i++) {
        left += getColumnsWidth(sheet, i);
    }
    return { top: top, left: left };
}

/**
 * Position element with given range
 * @hidden
 */
export function locateElem(
    ele: HTMLElement, range: number[], sheet: SheetModel, isRtl: boolean, offset?: { left: IOffset, top: IOffset }): void {
    let swapRange: number[] = getSwapRange(range);
    let cellPosition: { top: number, left: number } = getCellPosition(sheet, swapRange, offset);
    let startIndex: number[] = [skipHiddenIdx(sheet, 0, true), skipHiddenIdx(sheet, 0, true, 'columns')];
    let attrs: { [key: string]: string } = {
        'top': (swapRange[0] === startIndex[0] ? cellPosition.top : cellPosition.top - 1) + 'px',
        'height': getRowsHeight(sheet, range[0], range[2]) + (swapRange[0] === startIndex[0] ? 0 : 1) + 'px',
        'width': getColumnsWidth(sheet, range[1], range[3]) + (swapRange[1] === startIndex[1] ? 0 : 1) + 'px'
    };
    attrs[isRtl ? 'right' : 'left'] = (swapRange[1] === startIndex[1] ? cellPosition.left : cellPosition.left - 1) + 'px';
    if (ele) { setStyleAttribute([{ element: ele, attrs: attrs }]); }
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

/** 
 * @hidden
 */
// tslint:disable-next-line:max-func-body-length
export function setResize(index: number, value: string, isCol: boolean, parent: Spreadsheet): void {
    let curEle: HTMLElement;
    let curEleH: HTMLElement;
    let curEleC: HTMLElement;
    let preEle: HTMLElement;
    let preEleH: HTMLElement;
    let preEleC: HTMLElement;
    let nxtEle: HTMLElement;
    let nxtEleH: HTMLElement;
    let nxtEleC: HTMLElement;
    let sheet: SheetModel = parent.getActiveSheet();
    if (isCol) {
        if (sheet.showHeaders) {
            curEle = parent.element.getElementsByClassName('e-column-header')[0].getElementsByTagName('th')[index];
            curEleH = parent.element.getElementsByClassName('e-column-header')[0].getElementsByTagName('col')[index];
        }
        curEleC = parent.element.getElementsByClassName('e-sheet-content')[0].getElementsByTagName('col')[index];
    } else {
        if (sheet.showHeaders) {
            curEle = parent.element.getElementsByClassName('e-row-header')[0].getElementsByTagName('tr')[index];
            curEleH = parent.element.getElementsByClassName('e-row-header')[0].getElementsByTagName('tr')[index];
            curEleH.style.height = parseInt(value, 10) > 0 ? value : '2px';
        }
        curEleC = parent.element.getElementsByClassName('e-sheet-content')[0].getElementsByTagName('tr')[index];
        curEleC.style.height = parseInt(value, 10) > 0 ? value : '0px';
        let hdrFntSize: number;
        if (sheet.showHeaders) {
            let hdrRow: HTMLCollectionOf<HTMLTableRowElement> =
                parent.getRowHeaderContent().getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
            let hdrClone: HTMLElement[] = [];
            hdrClone[0] = hdrRow[index].getElementsByTagName('td')[0].cloneNode(true) as HTMLElement;
            hdrFntSize = findMaxValue(parent.getRowHeaderTable(), hdrClone, false, parent) + 1;
        }
        let contentRow: HTMLCollectionOf<HTMLTableRowElement> =
            parent.getMainContent().getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
        let contentClone: HTMLElement[] = [];
        for (let idx: number = 0; idx < contentRow[index].getElementsByTagName('td').length; idx++) {
            contentClone[idx] = contentRow[index].getElementsByTagName('td')[idx].cloneNode(true) as HTMLElement;
        }
        let cntFntSize: number = findMaxValue(parent.getContentTable(), contentClone, false, parent) + 1;
        let fntSize: number = hdrFntSize >= cntFntSize ? hdrFntSize : cntFntSize;
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
        if (isCol) {
            if (sheet.showHeaders) { curEleH.style.width = value; }
            curEleC.style.width = value;
        } else {
            if (sheet.showHeaders) { curEleH.style.height = value; }
            curEleC.style.height = value;
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
 */
export function findMaxValue(
    table: HTMLElement, text: HTMLElement[], isCol: boolean, parent: Spreadsheet, prevData?: string, isWrap?: boolean): number {
    let myTableDiv: HTMLElement = parent.createElement('div', { className: parent.element.className, styles: 'display: block' });
    let myTable: HTMLElement = parent.createElement('table', {
        className: table.className + 'e-resizetable',
        styles: 'width: auto;height: auto'
    });
    let myTr: HTMLElement = parent.createElement('tr');
    if (isCol) {
        text.forEach((element: Element) => {
            let tr: Element = (<Element>myTr.cloneNode());
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
    if (!isWrap) {
        offsetHeightValue = myTable.getBoundingClientRect().height;
        offsetWidthValue = myTable.getBoundingClientRect().width;
    } else {
        offsetHeightValue = parseInt(prevData, 10);
        offsetWidthValue = parseInt(prevData, 10);
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
 */
// tslint:disable-next-line
export function updateAction(options: CollaborativeEditArgs, spreadsheet: Spreadsheet, isRedo?: boolean): void {
    /* tslint:disable-next-line no-any */
    let eventArgs: any = options.eventArgs;
    switch (options.action) {
        case 'sorting':
            let args: BeforeSortEventArgs = {
                range: (options.eventArgs as SortEventArgs).range,
                sortOptions: (options.eventArgs as SortEventArgs).sortOptions,
                cancel: false
            };
            let promise: Promise<SortEventArgs> = new Promise((resolve: Function, reject: Function) => {
                resolve((() => { /** */ })());
            });
            let sortArgs: { [key: string]: BeforeSortEventArgs | Promise<SortEventArgs> } = { args: args, promise: promise };
            spreadsheet.notify(initiateSort, sortArgs);
            (sortArgs.promise as Promise<SortEventArgs>).then((args: SortEventArgs) => {
                spreadsheet.serviceLocator.getService<ICellRenderer>('cell').refreshRange(getIndexesFromAddress(args.range));
            });
            break;
        case 'cellSave':
            let cellEvtArgs: CellSaveEventArgs = options.eventArgs as CellSaveEventArgs;
            let cellValue: CellModel = eventArgs.formula ? { formula: cellEvtArgs.formula } : { value: cellEvtArgs.value };
            spreadsheet.updateCell(cellValue, cellEvtArgs.address);
            break;
        case 'cellDelete':
            spreadsheet.clearRange(options.eventArgs.address, null, true);
            spreadsheet.serviceLocator.getService<ICellRenderer>('cell').refreshRange(getRangeIndexes(options.eventArgs.address));
            break;
        case 'format':
            if (eventArgs.requestType === 'CellFormat') {
                spreadsheet.cellFormat(eventArgs.style, eventArgs.range);
            } else {
                spreadsheet.numberFormat(eventArgs.format, eventArgs.range);
            }
            break;
        case 'clipboard':
            if (eventArgs.copiedInfo.isCut && !isRedo) {
                return;
            }
            let clipboardPromise: Promise<Object> = eventArgs.copiedInfo.isCut ? spreadsheet.cut(eventArgs.copiedRange)
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
                    spreadsheet.setRowHeight(eventArgs.height, eventArgs.index, eventArgs.sheetIdx);
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
                let rules: ValidationModel = {
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
            spreadsheet.notify(setMerge, options.eventArgs);
            break;
        case 'clear':
            spreadsheet.notify(clearViewer, { options: options.eventArgs, isPublic: true });
            break;
        case 'conditionalFormat':
            if (isRedo) {
                let conditionalFormat: ConditionalFormatModel = {
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
            let element: HTMLElement = document.getElementById(options.eventArgs.id);
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
                let chartOptions: ChartModel[] = [{
                    type: eventArgs.type, theme: eventArgs.theme, isSeriesInRows: eventArgs.isSeriesInRows,
                    range: eventArgs.range, id: eventArgs.id, height: eventArgs.height, width: eventArgs.width
                }];
                spreadsheet.notify(setChart, {
                    chart: chartOptions, isInitCell: eventArgs.isInitCell, isUndoRedo: false, range: eventArgs.posRange
                });
            } else {
                spreadsheet.notify(deleteChart, { id: eventArgs.id });
            }
            break;
        case 'deleteChart':
            if (isRedo) {
                spreadsheet.notify(deleteChart, { id: eventArgs.id });
            } else {
                let chartOpts: ChartModel[] = [{
                    type: eventArgs.type, theme: eventArgs.theme, isSeriesInRows: eventArgs.isSeriesInRows,
                    range: eventArgs.range, id: eventArgs.id, height: eventArgs.height, width: eventArgs.width
                }];
                spreadsheet.notify(setChart, {
                    chart: chartOpts, isInitCell: eventArgs.isInitCell, isUndoRedo: false, range: eventArgs.posRange
                });
            }
            break;
        case 'chartRefresh':
            let chartElement: HTMLElement = document.getElementById(options.eventArgs.id);
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
 */
export function hasTemplate(workbook: Workbook, rowIdx: number, colIdx: number, sheetIdx: number): boolean {
    let sheet: SheetModel = workbook.sheets[sheetIdx];
    let ranges: RangeModel[] = sheet.ranges;
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
 * @hidden
 */
export function setRowEleHeight(
    parent: Spreadsheet, sheet: SheetModel, height: number, rowIdx: number, row?: HTMLElement,
    hRow?: HTMLElement, notifyRowHgtChange: boolean = true): void {
    let prevHgt: number = getRowHeight(sheet, rowIdx);
    let edit: HTMLElement = parent.element.querySelector('.e-spreadsheet-edit');
    if (edit && (edit.innerHTML.indexOf('\n') > -1)) {
        let actCell: number[] = getCellIndexes(parent.getActiveSheet().activeCell);
        let cell: CellModel = getCell(actCell[0], actCell[1], sheet); let i: number;
        let splitVal: string[] = edit.innerHTML.split('\n');
        let n: number = 0; let valLength: number = splitVal.length;
        for (i = 0; i < valLength; i++) {
            let lines: number = getLines(splitVal[i], getExcludedColumnWidth(sheet, actCell[0], actCell[1]), cell.style, parent.cellStyle);
            if (lines === 0) {
                lines = 1; // for empty new line
            }
            n = n + lines;
        }
        height = getTextHeight(parent, cell.style || parent.cellStyle, n) + 1;
    }
    if (row || parent.getRow(rowIdx)) {
        (row || parent.getRow(rowIdx)).style.height = `${height}px`;
    }
    if (sheet.showHeaders && hRow || parent.getRow(rowIdx, parent.getRowHeaderTable())) {
        (hRow || parent.getRow(rowIdx, parent.getRowHeaderTable())).style.height = `${height}px`;
    }
    setRowHeight(sheet, rowIdx, height);
    parent.setProperties({ sheets: parent.sheets }, true);
    if (notifyRowHgtChange) {
        parent.notify(rowHeightChanged, { rowIdx: rowIdx, threshold: height - prevHgt });
    }
}

/** @hidden */
export function getTextHeight(context: Workbook, style: CellStyleModel, lines: number = 1): number {
    let fontSize: string = (style && style.fontSize) || context.cellStyle.fontSize;
    let fontSizePx: number = fontSize.indexOf('pt') > -1 ? parseInt(fontSize, 10) * 1.33 : parseInt(fontSize, 10);
    return Math.ceil(fontSizePx * (style && style.fontFamily === 'Arial Black' ? 1.44 : 1.24) * lines);
}

/** @hidden */
export function getTextWidth(text: string, style: CellStyleModel, parentStyle: CellStyleModel): number {
    if (!style) {
        style = parentStyle;
    }
    let canvas: HTMLCanvasElement = document.createElement('canvas');
    let context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.font = (style.fontStyle || parentStyle.fontStyle) + ' ' + (style.fontWeight || parentStyle.fontWeight) + ' '
        + (style.fontSize || parentStyle.fontSize) + ' ' + (style.fontFamily || parentStyle.fontFamily);
    return context.measureText(text).width;
}

/**
 * @hidden
 */
export function getLines(text: string, colwidth: number, style: CellStyleModel, parentStyle: CellStyleModel): number {
    let width: number;
    let prevWidth: number = 0;
    let textArr: string[] = text.toString().split(' ');
    let spaceWidth: number = getTextWidth(' ', style, parentStyle);
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
    return getColumnsWidth(sheet, startColIdx, endColIdx) - (5 + getBorderWidth(rowIdx, startColIdx, sheet)); // 5 -> For cell padding
}

/**
 * Setting maximum height while doing formats and wraptext
 * @hidden
 */
export function setMaxHgt(sheet: SheetModel, rIdx: number, cIdx: number, hgt: number): void {
    if (!sheet.maxHgts[rIdx]) {
        sheet.maxHgts[rIdx] = {};
    }
    sheet.maxHgts[rIdx][cIdx] = hgt;
}

/**
 * Getting maximum height by comparing each cell's modified height.
 * @hidden
 */
export function getMaxHgt(sheet: SheetModel, rIdx: number): number {
    let maxHgt: number = 0;
    let rowHgt: object = sheet.maxHgts[rIdx];
    if (rowHgt) {
        Object.keys(rowHgt).forEach((key: string) => {
            if (rowHgt[key] > maxHgt) {
                maxHgt = rowHgt[key];
            }
        });
    }
    return maxHgt;
}
/** @hidden */
export function skipHiddenIdx(sheet: SheetModel, index: number, increase: boolean, layout: string = 'rows'): number {
    if (index < 0) { index = -1; }
    if ((sheet[layout])[index] && (sheet[layout])[index].hidden) {
        increase ? index++ : index--;
        index = skipHiddenIdx(sheet, index, increase, layout);
    }
    return index;
}

/** @hidden */
export function focus(ele: HTMLElement): void {
    if (Browser.isIE) {
        let scrollX: number = window.scrollX;
        let scrollY: number = window.scrollY;
        ele.focus();
        window.scrollTo(scrollX, scrollY);
    } else {
        // tslint:disable-next-line
        (ele as any).focus({ preventScroll: true });
    }
}