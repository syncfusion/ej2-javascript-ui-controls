import { Browser, setStyleAttribute as setBaseStyleAttribute, getComponent } from '@syncfusion/ej2-base';
import { StyleType, CollaborativeEditArgs, CellSaveEventArgs, ICellRenderer, IAriaOptions } from './interface';
import { Spreadsheet } from '../base/index';
import { SheetModel, getCellPosition, getRowsHeight, getColumnsWidth, getSwapRange, CellModel } from '../../workbook/index';
import { BeforeSortEventArgs, SortEventArgs, initiateSort, getIndexesFromAddress } from '../../workbook/index';
import { addSheetTab, removeSheetTab } from './event';

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
        curEle = parent.element.getElementsByClassName('e-column-header')[0].getElementsByTagName('th')[index];
        curEleH = parent.element.getElementsByClassName('e-column-header')[0].getElementsByTagName('col')[index];
        curEleC = parent.element.getElementsByClassName('e-main-content')[0].getElementsByTagName('col')[index];
    } else {
        curEle = parent.element.getElementsByClassName('e-row-header')[0].getElementsByTagName('tr')[index];
        curEleH = parent.element.getElementsByClassName('e-row-header')[0].getElementsByTagName('tr')[index];
        curEleC = parent.element.getElementsByClassName('e-main-content')[0].getElementsByTagName('tr')[index];
        curEleH.style.height = parseInt(value, 10) > 0 ? value : '2px';
        curEleC.style.height = parseInt(value, 10) > 0 ? value : '0px';
        let hdrRow: HTMLCollectionOf<HTMLTableRowElement> =
            parent.getRowHeaderContent().getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
        let hdrClone: HTMLElement[] = [];
        hdrClone[0] = hdrRow[index].getElementsByTagName('td')[0].cloneNode(true) as HTMLElement;
        let hdrFntSize: number = findMaxValue(parent.getRowHeaderTable(), hdrClone, false, parent) + 1;
        let contentRow: HTMLCollectionOf<HTMLTableRowElement> =
            parent.getMainContent().getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
        let contentClone: HTMLElement[] = [];
        for (let idx: number = 0; idx < contentRow[index].getElementsByTagName('td').length; idx++) {
            contentClone[idx] = contentRow[index].getElementsByTagName('td')[idx].cloneNode(true) as HTMLElement;
        }
        let cntFntSize: number = findMaxValue(parent.getContentTable(), contentClone, false, parent) + 1;
        let fntSize: number = hdrFntSize >= cntFntSize ? hdrFntSize : cntFntSize;
        if (parseInt(curEleC.style.height, 10) < fntSize ||
            (curEle.classList.contains('e-reach-fntsize') && parseInt(curEleC.style.height, 10) === fntSize)) {
            curEle.classList.add('e-reach-fntsize');
            curEleH.style.lineHeight = parseInt(value, 10) >= 4 ? ((parseInt(value, 10)) - 4) + 'px' :
                parseInt(value, 10) > 0 ? ((parseInt(value, 10)) - 1) + 'px' : '0px';
            curEleC.style.lineHeight = parseInt(value, 10) > 0 ? ((parseInt(value, 10)) - 1) + 'px' : '0px';
        } else {
            curEleH.style.removeProperty('line-height');
            curEleC.style.removeProperty('line-height');
            if (curEle.classList.contains('e-reach-fntsize')) {
                curEle.classList.remove('e-reach-fntsize');
            }
        }
    }
    preEle = curEle.previousElementSibling as HTMLElement;
    nxtEle = curEle.nextElementSibling as HTMLElement;
    if (preEle) {
        preEle = curEle.previousElementSibling as HTMLElement;
        preEleH = curEleH.previousElementSibling as HTMLElement;
        preEleC = curEleC.previousElementSibling as HTMLElement;
    }
    if (nxtEle) {
        nxtEle = curEle.nextElementSibling as HTMLElement;
        nxtEleH = curEleH.nextElementSibling as HTMLElement;
        nxtEleC = curEleC.nextElementSibling as HTMLElement;
    }
    if (parseInt(value, 10) <= 0 && !(curEle.classList.contains('e-zero') || curEle.classList.contains('e-zero-start'))) {
        if (preEle && nxtEle) {
            if (isCol) {
                curEleH.style.width = '2px';
                curEleC.style.width = '0px';
            } else {
                curEleH.style.height = '2px';
                curEleC.style.height = '0px';
            }
            if (preEle.classList.contains('e-zero-start')) {
                curEle.classList.add('e-zero-start');
                curEleC.classList.add('e-zero-start');
            } else {
                curEle.classList.add('e-zero');
                curEleC.classList.add('e-zero');
            }
            if (!nxtEle.classList.contains('e-zero') && !nxtEle.classList.contains('e-zero-last')) {
                curEle.classList.add('e-zero-last');
                curEleC.classList.add('e-zero-last');
            }
            if (preEle.classList.contains('e-zero-last')) {
                preEle.classList.remove('e-zero-last');
                preEleC.classList.remove('e-zero-last');
            }
            if (preEle.classList.contains('e-zero')) {
                if (curEle.classList.contains('e-zero-end')) {
                    setWidthAndHeight(preEleH, -2, isCol);
                } else {
                    setWidthAndHeight(preEleH, -2, isCol);
                }
            } else {
                setWidthAndHeight(preEleH, -1, isCol);
            }

            if (preEle.classList.contains('e-zero-start')) {
                setWidthAndHeight(curEleH, -1, isCol);
            }
            if (nxtEle.classList.contains('e-zero')) {
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
            } else {
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
        } else if (preEle) {
            if (isCol) {
                curEleH.style.width = '1px';
                curEleC.style.width = '0px';
            } else {
                curEleH.style.height = '1px';
                curEleC.style.height = '0px';
            }
            curEle.classList.add('e-zero-end');
            curEleC.classList.add('e-zero-end');
            curEle.classList.add('e-zero-last');
            curEleC.classList.add('e-zero-last');
            if (preEle.classList.contains('e-zero')) {
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
            if (nxtEle.classList.contains('e-zero')) {
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

            } else {
                setWidthAndHeight(nxtEleH, -1, isCol);
            }
        }
    } else if (parseInt(value, 10) > 0) {
        if (isCol) {
            curEleH.style.width = value;
            curEleC.style.width = value;
        } else {
            curEleH.style.height = value;
            curEleC.style.height = value;
        }
        if (preEle && nxtEle) {
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
        } else if (preEle) {
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
        } else if (nxtEle) {
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
export function findMaxValue(table: HTMLElement, text: HTMLElement[], isCol: boolean, parent: Spreadsheet): number {
    let myTableDiv: HTMLElement = parent.createElement('div', { className: parent.element.className });
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
    let offsetWidthValue: number = myTable.getBoundingClientRect().width;
    let offsetHeightValue: number = myTable.getBoundingClientRect().height;
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
/* tslint:disable no-any */
export function updateAction(options: CollaborativeEditArgs, spreadsheet: Spreadsheet, isCutRedo?: boolean): void {
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
        case 'format':
            if (eventArgs.requestType === 'CellFormat') {
                spreadsheet.cellFormat(eventArgs.style, eventArgs.range);
            } else {
                spreadsheet.numberFormat(eventArgs.format, eventArgs.range);
            }
            break;
        case 'clipboard':
            if (eventArgs.copiedInfo.isCut && !isCutRedo) {
                return;
            }
            let clipboardPromise: Promise<Object> = eventArgs.copiedInfo.isCut ? spreadsheet.cut(eventArgs.copiedRange)
                : spreadsheet.copy(eventArgs.copiedRange);
            clipboardPromise.then((args: Object) => {
                spreadsheet.paste(eventArgs.pastedRange, eventArgs.type);
            });
            break;
        case 'gridLines':
            spreadsheet.sheets[eventArgs.sheetIdx - 1].showGridLines = eventArgs.isShow;
            break;
        case 'headers':
            spreadsheet.sheets[eventArgs.sheetIdx - 1].showHeaders = eventArgs.isShow;
            break;
        case 'resize':
        case 'resizeToFit':
            if (eventArgs.isCol) {
                spreadsheet.setColWidth(eventArgs.width, eventArgs.index, eventArgs.sheetIdx);
            } else {
                spreadsheet.setRowHeight(eventArgs.height, eventArgs.index, eventArgs.sheetIdx);
            }
            break;
        case 'addSheet':
            spreadsheet.notify(addSheetTab, {
                text: eventArgs.text, isAction: true, count: eventArgs.sheetCount,
                previousIndex: eventArgs.previousIndex
            });
            break;
        case 'renameSheet':
            spreadsheet.sheets[eventArgs.index - 1].name = eventArgs.value;
            break;
        case 'removeSheet':
            spreadsheet.notify(removeSheetTab, {
                index: eventArgs.index,
                isAction: true,
                count: eventArgs.sheetCount,
                clicked: true
            });
            break;
    }
}