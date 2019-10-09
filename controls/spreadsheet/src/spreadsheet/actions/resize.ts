import { Spreadsheet } from '../index';
import { closest, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';
import { colWidthChanged, rowHeightChanged, contentLoaded } from '../common/index';
import { setRowHeight } from '../../workbook/base/row';
import { getColumn } from '../../workbook/base/column';
import { SheetModel } from '../../workbook';

/**
 * The `Resize` module is used to handle the resizing functionalities in Spreadsheet.
 */
export class Resize {
    private parent: Spreadsheet;
    private trgtEle: HTMLElement;
    private event: MouseEvent;

    /**
     * Constructor for resize module in Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(contentLoaded, this.wireEvents, this);
    }

    private wireEvents(): void {
        let rowHeader: Element = this.parent.getRowHeaderContent(); let colHeader: Element = this.parent.getColumnHeaderContent();
        EventHandler.add(colHeader, 'dblclick', this.dblClickHandler, this);
        EventHandler.add(rowHeader, 'dblclick', this.dblClickHandler, this);
        EventHandler.add(this.parent.getColumnHeaderContent(), 'mousedown', this.mouseDownHandler, this);
        EventHandler.add(this.parent.getRowHeaderContent(), 'mousedown', this.mouseDownHandler, this);
        this.wireResizeCursorEvent(rowHeader, colHeader);
    }

    private wireResizeCursorEvent(rowHeader: Element, colHeader: Element): void {
        EventHandler.add(rowHeader, 'mousemove', this.setTarget, this);
        EventHandler.add(colHeader, 'mousemove', this.setTarget, this);
    }

    private unWireResizeCursorEvent(): void {
        EventHandler.remove(this.parent.getRowHeaderContent(), 'mousemove', this.setTarget);
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousemove', this.setTarget);
    }

    private unwireEvents(): void {
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'dblclick', this.dblClickHandler);
        EventHandler.remove(this.parent.getRowHeaderContent(), 'dblclick', this.dblClickHandler);
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.parent.getRowHeaderContent(), 'mousedown', this.mouseDownHandler);
        this.unWireResizeCursorEvent();
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.wireEvents);
        }
    }

    private mouseMoveHandler(e: MouseEvent): void {
        let sheetPanel: Element = this.parent.element.getElementsByClassName('e-sheet-panel')[0];
        let colResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-colresize-handler')[0] as HTMLElement;
        let rowResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-rowresize-handler')[0] as HTMLElement;
        if (colResizeHandler || rowResizeHandler) {
            if (colResizeHandler) {
                if (e.x > (this.trgtEle.parentElement.firstChild as HTMLElement).getBoundingClientRect().left) {
                    colResizeHandler.style.left = e.clientX - this.parent.element.getBoundingClientRect().left + 'px';
                }
            } else if (rowResizeHandler) {
                if (e.y >= (this.trgtEle.parentElement.parentElement.firstChild as HTMLElement).getBoundingClientRect().top) {
                    rowResizeHandler.style.top = e.clientY - sheetPanel.getBoundingClientRect().top + 'px';
                }
            }
        }
    }

    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        this.event = e;
        this.trgtEle = <HTMLElement>e.target;
        this.updateTarget(e, this.trgtEle);
        let trgt: HTMLElement = this.trgtEle;
        let className: string = trgt.classList.contains('e-colresize') ? 'e-colresize-handler' :
            trgt.classList.contains('e-rowresize') ? 'e-rowresize-handler' : '';
        this.createResizeHandler(trgt, className);
        this.unWireResizeCursorEvent();
        EventHandler.add(this.parent.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(document, 'mouseup', this.mouseUpHandler, this);
    }

    private mouseUpHandler(e: MouseEvent & TouchEvent): void {
        let colResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-colresize-handler')[0] as HTMLElement;
        let rowResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-rowresize-handler')[0] as HTMLElement;
        this.resizeOn(e);
        let resizeHandler: HTMLElement = colResizeHandler ? colResizeHandler : rowResizeHandler;
        if (resizeHandler) {
            this.parent.element.getElementsByClassName('e-sheet-panel')[0].removeChild(resizeHandler);
            this.updateCursor(e);
        }
        EventHandler.remove(document, 'mouseup', this.mouseUpHandler);
        EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        this.wireResizeCursorEvent(this.parent.getRowHeaderContent(), this.parent.getColumnHeaderContent());
    }

    private dblClickHandler(e: MouseEvent & TouchEvent): void {
        this.trgtEle = <HTMLElement>e.target;
        this.updateTarget(e, this.trgtEle);
        let trgt: HTMLElement = this.trgtEle;
        if (trgt.classList.contains('e-colresize') || trgt.classList.contains('e-rowresize')) {
            let colIndx: number = parseInt(trgt.getAttribute('aria-colindex'), 10) - 1;
            let rowIndx: number = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            if (trgt.classList.contains('e-colresize')) {
                this.setAutofit(colIndx, true);
            } else if (trgt.classList.contains('e-rowresize')) {
                this.setAutofit(rowIndx, false);
            }
        }
    }

    private setTarget(e: MouseEvent): void {
        let trgt: HTMLElement = <HTMLElement>e.target;
        let newTrgt: HTMLElement; let tOffsetV: number; let eOffsetV: number; let tClass: string;
        if (closest(trgt, '.e-header-row')) {
            eOffsetV = e.offsetX; tOffsetV = trgt.offsetWidth; tClass = 'e-colresize';
            if (!isNullOrUndefined(trgt.previousElementSibling)) { newTrgt = <HTMLElement>trgt.previousElementSibling; }
        } else if (closest(trgt, '.e-row')) {
            eOffsetV = e.offsetY; tOffsetV = trgt.offsetHeight; tClass = 'e-rowresize';
            if (!isNullOrUndefined(trgt.parentElement.previousElementSibling)) {
                newTrgt =
                    <HTMLElement>trgt.parentElement.previousElementSibling.firstElementChild;
            }
        }
        if (tOffsetV - 2 < 8 && eOffsetV !== Math.ceil((tOffsetV - 2) / 2)) {
            if (eOffsetV < Math.ceil((tOffsetV - 2) / 2)) {
                trgt.classList.add(tClass);
                newTrgt.classList.add(tClass);
            } else if (eOffsetV > Math.ceil((tOffsetV - 2) / 2)) {
                trgt.classList.add(tClass);
            }
        } else if (tOffsetV - 5 < eOffsetV && eOffsetV <= tOffsetV && tOffsetV >= 10) {
            trgt.classList.add(tClass);
        } else if (eOffsetV < 5 && newTrgt && tOffsetV >= 10) {
            trgt.classList.add(tClass);
            newTrgt.classList.add(tClass);
        } else {
            let resEle: HTMLCollectionOf<Element> = (tClass === 'e-colresize' ? trgt.parentElement.getElementsByClassName(tClass)
                : this.parent.getRowHeaderTable().getElementsByClassName(tClass)) as HTMLCollectionOf<Element>;
            for (let index: number = 0; index < resEle.length; index++) {
                resEle[index].classList.remove(tClass);
            }
        }
    }

    private updateTarget(e: MouseEvent, trgt: HTMLElement): void {
        if (closest(trgt, '.e-header-row')) {
            if ((trgt.offsetWidth < 10 && e.offsetX < Math.ceil((trgt.offsetWidth - 2) / 2)) || (e.offsetX < 5 &&
                trgt.offsetWidth >= 10) && trgt.classList.contains('e-colresize') && trgt.previousElementSibling) {
                this.trgtEle = trgt.previousElementSibling as HTMLElement;
            }
        } else if (closest(trgt, '.e-row')) {
            if ((trgt.offsetHeight < 10 && e.offsetY < Math.ceil((trgt.offsetHeight - 2) / 2)) || (e.offsetY < 5 &&
                trgt.offsetHeight >= 10) && trgt.classList.contains('e-rowresize') && trgt.parentElement.previousElementSibling) {
                this.trgtEle = trgt.parentElement.previousElementSibling.getElementsByClassName('e-header-cell')[0] as HTMLElement;
            }
        }
    }

    private setAutofit(idx: number, isCol: boolean): void {
        let index: number;
        let oldIdx: number = idx;
        if (this.parent.scrollSettings.enableVirtualization) {
            idx = isCol ? idx - this.parent.viewport.leftIndex : idx - this.parent.viewport.topIndex;
        }
        let sheet: SheetModel = this.parent.getActiveSheet();
        let mainContent: Element = this.parent.getMainContent();
        let oldValue: string = isCol ?
            mainContent.getElementsByTagName('col')[idx].style.width : mainContent.getElementsByTagName('tr')[idx].style.height;
        let headerTable: HTMLElement = isCol ? this.parent.getColHeaderTable() : this.parent.getRowHeaderTable();
        let contentRow: HTMLCollectionOf<HTMLTableRowElement> =
            mainContent.getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
        let contentClone: HTMLElement[] = [];
        let contentTable: HTMLElement =
            mainContent.getElementsByClassName('e-content-table')[0] as HTMLElement;
        let headerRow: HTMLCollectionOf<HTMLTableRowElement> =
            headerTable.getElementsByTagName('tr') as HTMLCollectionOf<HTMLTableRowElement>;
        let headerText: HTMLElement;
        if (isCol) {
            headerText = (<HTMLElement>headerRow[0].getElementsByClassName('e-header-cell')[idx].cloneNode(true));
            for (index = 0; index < contentRow.length; index++) {
                contentClone[index] = contentRow[index].getElementsByTagName('td')[idx].cloneNode(true) as HTMLElement;
            }
        } else {
            headerText = (<HTMLElement>headerRow[idx].getElementsByClassName('e-header-cell')[0].cloneNode(true));
            for (index = 0; index < contentRow[idx].getElementsByTagName('td').length; index++) {
                contentClone[index] = contentRow[idx].getElementsByTagName('td')[index].cloneNode(true) as HTMLElement;
            }
        }
        let headerFit: number = this.findMaxValue(headerTable, [headerText], isCol);
        let contentFit: number = this.findMaxValue(contentTable, contentClone, isCol);
        let autofitValue: number = headerFit < contentFit ? contentFit : headerFit;
        let threshold: number = parseInt(oldValue, 10) > autofitValue ?
            -(parseInt(oldValue, 10) - autofitValue) : autofitValue - parseInt(oldValue, 10);
        if (isCol) {
            getColumn(sheet, idx).width = autofitValue > 0 ? autofitValue : 0;
            this.parent.notify(colWidthChanged, { threshold, colIdx: oldIdx });
        } else {
            setRowHeight(sheet, idx, autofitValue > 0 ? autofitValue : 0);
            this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: oldIdx });
        }
        this.setResize(idx, autofitValue + 'px', isCol);
    }

    private findMaxValue(table: HTMLElement, text: HTMLElement[], isCol: boolean): number {
        let myTableDiv: HTMLElement = this.parent.createElement('div', { className: this.parent.element.className });
        let myTable: HTMLElement = this.parent.createElement('table', {
            className: table.className + 'e-resizetable',
            styles: 'width: auto;height: auto'
        });
        let myTr: HTMLElement = this.parent.createElement('tr');
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

    private createResizeHandler(trgt: HTMLElement, className: string): void {
        let editor: HTMLElement = this.parent.createElement('div', { className: className });
        if (trgt.classList.contains('e-colresize')) {
            editor.style.height = this.parent.getMainContent().clientHeight + trgt.offsetHeight + 'px';
            editor.style.left = this.event.clientX - this.parent.element.getBoundingClientRect().left + 'px';
            editor.style.top = '0px';
        } else if (trgt.classList.contains('e-rowresize')) {
            editor.style.width = this.parent.getMainContent().clientWidth + trgt.offsetWidth + 'px';
            editor.style.left = '0px';
            editor.style.top = this.event.clientY
                - this.parent.element.getElementsByClassName('e-sheet-panel')[0].getBoundingClientRect().top + 'px';
        }
        this.parent.element.getElementsByClassName('e-sheet-panel')[0].appendChild(editor);
        this.updateCursor(this.event);
    }

    private setColWidth(index: number, width: string): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let eleWidth: number = parseInt(this.parent.getMainContent().getElementsByTagName('col')[index].style.width, 10);
        let colWidth: string = width;
        let threshold: number = parseInt(colWidth, 10) - eleWidth;
        if (threshold < 0 && eleWidth < -(threshold)) {
            threshold = -eleWidth;
        }
        let oldIdx: number = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
        this.parent.notify(colWidthChanged, { threshold, colIdx: oldIdx });
        this.setResize(index, colWidth, true);
        getColumn(sheet, index).width = parseInt(colWidth, 10) > 0 ? parseInt(colWidth, 10) : 0;
        sheet.columns[index].customWidth = true;
        this.parent.setProperties({ sheets: this.parent.sheets }, true);
    }

    private setRowHeight(index: number, height: string): void {
        let eleHeight: number = parseInt(this.parent.getMainContent().getElementsByTagName('tr')[index].style.height, 10);
        let rowHeight: string = height;
        let threshold: number = parseInt(rowHeight, 10) - eleHeight;
        if (threshold < 0 && eleHeight < -(threshold)) {
            threshold = -eleHeight;
        }
        let oldIdx: number = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
        this.parent.notify(rowHeightChanged, { threshold, rowIdx: oldIdx });
        this.setResize(index, rowHeight, false);
        setRowHeight(this.parent.getActiveSheet(), index, parseInt(rowHeight, 10) > 0 ? parseInt(rowHeight, 10) : 0);
        this.parent.getActiveSheet().rows[index].customHeight = true;
        this.parent.setProperties({ sheets: this.parent.sheets }, true);
    }

    private resizeOn(e: MouseEvent): void {
        let idx: number;
        if (this.trgtEle.classList.contains('e-rowresize')) {
            idx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            if (this.parent.scrollSettings.enableVirtualization) { idx = idx - this.parent.viewport.topIndex; }
            let rowHeight: string =
                e.clientY - this.event.clientY +
                parseInt((this.parent.getMainContent().getElementsByClassName('e-row')[idx] as HTMLElement).style.height, 10) + 'px';
            this.setRowHeight(idx, rowHeight);
        } else if (this.trgtEle.classList.contains('e-colresize')) {
            idx = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
            if (this.parent.scrollSettings.enableVirtualization) { idx = idx - this.parent.viewport.leftIndex; }
            let colWidth: string =
                e.clientX - this.event.clientX +
                parseInt(this.parent.getMainContent().getElementsByTagName('col')[idx].style.width, 10) + 'px';
            this.setColWidth(idx, colWidth);
        }
    }

    private setWidthAndHeight(trgt: HTMLElement, value: number, isCol: boolean): void {
        if (isCol) {
            trgt.style.width = parseInt(trgt.style.width, 10) + value + 'px';
        } else {
            trgt.style.height = parseInt(trgt.style.height, 10) + value + 'px';
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private setResize(index: number, value: string, isCol: boolean): void {
        let curEle: HTMLElement;
        let curEleH: HTMLElement;
        let curEleC: HTMLElement;
        let preEle: HTMLElement;
        let preEleH: HTMLElement;
        let preEleC: HTMLElement;
        let nxtEle: HTMLElement;
        let nxtEleH: HTMLElement;
        let nxtEleC: HTMLElement;
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (isCol) {
            curEle = this.parent.element.getElementsByClassName('e-column-header')[0].getElementsByTagName('th')[index];
            curEleH = this.parent.element.getElementsByClassName('e-column-header')[0].getElementsByTagName('col')[index];
            curEleC = this.parent.element.getElementsByClassName('e-main-content')[0].getElementsByTagName('col')[index];
        } else {
            curEle = this.parent.element.getElementsByClassName('e-row-header')[0].getElementsByTagName('tr')[index];
            curEleH = this.parent.element.getElementsByClassName('e-row-header')[0].getElementsByTagName('tr')[index];
            curEleC = this.parent.element.getElementsByClassName('e-main-content')[0].getElementsByTagName('tr')[index];
            curEleH.style.height = parseInt(value, 10) > 0 ? value : '2px';
            curEleC.style.height = parseInt(value, 10) > 0 ? value : '0px';
            let hdrRow: HTMLCollectionOf<HTMLTableRowElement> =
                this.parent.getRowHeaderContent().getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
            let hdrClone: HTMLElement[] = [];
            hdrClone[0] = hdrRow[index].getElementsByTagName('td')[0].cloneNode(true) as HTMLElement;
            let hdrFntSize: number = this.findMaxValue(this.parent.getRowHeaderTable(), hdrClone, false) + 1;
            let contentRow: HTMLCollectionOf<HTMLTableRowElement> =
                this.parent.getMainContent().getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
            let contentClone: HTMLElement[] = [];
            for (let idx: number = 0; idx < contentRow[index].getElementsByTagName('td').length; idx++) {
                contentClone[idx] = contentRow[index].getElementsByTagName('td')[idx].cloneNode(true) as HTMLElement;
            }
            let cntFntSize: number = this.findMaxValue(this.parent.getContentTable(), contentClone, false) + 1;
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
                        this.setWidthAndHeight(preEleH, -2, isCol);
                    } else {
                        this.setWidthAndHeight(preEleH, -2, isCol);
                    }
                } else {
                    this.setWidthAndHeight(preEleH, -1, isCol);
                }

                if (preEle.classList.contains('e-zero-start')) {
                    this.setWidthAndHeight(curEleH, -1, isCol);
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
                                    nxtEle = this.parent.getColHeaderTable().getElementsByTagName('th')[nxtIndex + 1];
                                    nxtEleH = this.parent.getColHeaderTable().getElementsByTagName('col')[nxtIndex + 1];
                                } else {
                                    nxtIndex = parseInt(nxtEle.getAttribute('aria-rowindex'), 10) - 1;
                                    nxtEle = this.parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                                    nxtEleH = this.parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                                }
                            }
                        }
                    } else {
                        this.setWidthAndHeight(curEleH, -2, isCol);
                    }
                } else {
                    if (nxtEle.classList.contains('e-zero-end')) {
                        if (isCol) {
                            curEleH.style.width = '0px';
                        } else {
                            curEleH.style.height = '0px';
                        }
                    } else {
                        this.setWidthAndHeight(nxtEleH, -1, isCol);
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
                    this.setWidthAndHeight(preEleH, -2, isCol);
                } else {
                    this.setWidthAndHeight(preEleH, -1, isCol);
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
                                nxtEleH = this.parent.getColHeaderTable().getElementsByTagName('col')[nxtIndex + 1];
                                nxtEle = this.parent.getColHeaderTable().getElementsByTagName('th')[nxtIndex + 1];
                            } else {
                                nxtIndex = parseInt(nxtEle.getAttribute('aria-rowindex'), 10) - 1;
                                nxtEleH = this.parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                                nxtEle = this.parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                            }
                        }
                    }

                } else {
                    this.setWidthAndHeight(nxtEleH, -1, isCol);
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
                        this.setWidthAndHeight(curEleH, -1, isCol);
                    }
                } else {
                    if (curEle.classList.contains('e-zero')) {
                        this.setWidthAndHeight(preEleH, 1, isCol);
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
                    this.setWidthAndHeight(curEleH, -1, isCol);
                } else {
                    if (curEle.classList.contains('e-zero') || curEle.classList.contains('e-zero-start')) {
                        this.setWidthAndHeight(nxtEleH, 1, isCol);
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
                        this.setWidthAndHeight(curEleH, -1, isCol);
                    }
                } else {
                    if (curEle.classList.contains('e-zero')) {
                        this.setWidthAndHeight(preEleH, 1, isCol);
                    } else {
                        this.setWidthAndHeight(curEleH, -1, isCol);
                    }
                }
                if (curEle.classList.contains('e-zero')) { curEle.classList.remove('e-zero'); }
                if (curEle.classList.contains('e-zero-end')) { curEle.classList.remove('e-zero-end'); }
                if (curEleC.classList.contains('e-zero')) { curEleC.classList.remove('e-zero'); }
                if (curEleC.classList.contains('e-zero-end')) { curEleC.classList.remove('e-zero-end'); }
            } else if (nxtEle) {
                if (nxtEle.classList.contains('e-zero')) {
                    this.setWidthAndHeight(curEleH, -1, isCol);
                } else if (curEle.classList.contains('e-zero-start')) {
                    this.setWidthAndHeight(nxtEleH, 1, isCol);
                    curEle.classList.remove('e-zero-start');
                }
                if (curEle.classList.contains('e-zero')) { curEle.classList.remove('e-zero'); }
                if (curEleC.classList.contains('e-zero')) { curEleC.classList.remove('e-zero'); }
                if (curEle.classList.contains('e-zero-start')) { curEle.classList.remove('e-zero-start'); }
                if (curEleC.classList.contains('e-zero-start')) { curEleC.classList.remove('e-zero-start'); }
            }
        }
    }

    private updateCursor(e: MouseEvent): void {
        if (this.parent.element.getElementsByClassName('e-colresize-handler')[0]) {
            this.parent.element.classList.add('e-col-resizing');
        } else if (this.parent.element.classList.contains('e-col-resizing')) {
            this.parent.element.classList.remove('e-col-resizing');
        }
        if (this.parent.element.getElementsByClassName('e-rowresize-handler')[0]) {
            this.parent.element.classList.add('e-row-resizing');
        } else if (this.parent.element.classList.contains('e-row-resizing')) {
            this.parent.element.classList.remove('e-row-resizing');
        }
    }

    /**
     * To destroy the resize module.
     * @return {void}
     */
    public destroy(): void {
        this.unwireEvents();
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'resize';
    }
}