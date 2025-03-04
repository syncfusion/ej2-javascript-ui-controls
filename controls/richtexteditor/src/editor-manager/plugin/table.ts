import { createElement, closest, detach, Browser, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { IHtmlItem, IHtmlSubCommands } from './../base/interface';
import { InsertHtml } from './inserthtml';
import { removeClassWithAttr } from '../../common/util';
import * as EVENTS from '../../common/constant';
import { NodeSelection } from '../../selection';

/**
 * Link internal component
 *
 * @hidden
 * @deprecated
 */
export class TableCommand {
    private parent: EditorManager;
    private activeCell: HTMLElement;
    private curTable: HTMLTableElement;
    /**
     * Constructor for creating the Formats plugin
     *
     * @param {EditorManager} parent - specifies the parent element
     * @hidden
     * @deprecated
     */
    public constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.TABLE, this.createTable, this);
        this.parent.observer.on(CONSTANT.INSERT_ROW, this.insertRow, this);
        this.parent.observer.on(CONSTANT.INSERT_COLUMN, this.insertColumn, this);
        this.parent.observer.on(CONSTANT.DELETEROW, this.deleteRow, this);
        this.parent.observer.on(CONSTANT.DELETECOLUMN, this.deleteColumn, this);
        this.parent.observer.on(CONSTANT.REMOVETABLE, this.removeTable, this);
        this.parent.observer.on(CONSTANT.TABLEHEADER, this.tableHeader, this);
        this.parent.observer.on(CONSTANT.TABLE_VERTICAL_ALIGN, this.tableVerticalAlign, this);
        this.parent.observer.on(CONSTANT.TABLE_MERGE, this.cellMerge, this);
        this.parent.observer.on(CONSTANT.TABLE_HORIZONTAL_SPLIT, this.HorizontalSplit, this);
        this.parent.observer.on(CONSTANT.TABLE_VERTICAL_SPLIT, this.VerticalSplit, this);
        this.parent.observer.on(CONSTANT.TABLE_DASHED, this.tableStyle, this);
        this.parent.observer.on(CONSTANT.TABLE_BACKGROUND_COLOR, this.setBGColor, this);
        this.parent.observer.on(CONSTANT.TABLE_ALTERNATE, this.tableStyle, this);
        this.parent.observer.on(CONSTANT.TABLE_MOVE, this.tableMove, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.TABLE, this.createTable);
        this.parent.observer.off(CONSTANT.INSERT_ROW, this.insertRow);
        this.parent.observer.off(CONSTANT.INSERT_COLUMN, this.insertColumn);
        this.parent.observer.off(CONSTANT.DELETEROW, this.deleteRow);
        this.parent.observer.off(CONSTANT.DELETECOLUMN, this.deleteColumn);
        this.parent.observer.off(CONSTANT.REMOVETABLE, this.removeTable);
        this.parent.observer.off(CONSTANT.TABLEHEADER, this.tableHeader);
        this.parent.observer.off(CONSTANT.TABLE_VERTICAL_ALIGN, this.tableVerticalAlign);
        this.parent.observer.off(CONSTANT.TABLE_MERGE, this.cellMerge);
        this.parent.observer.off(CONSTANT.TABLE_HORIZONTAL_SPLIT, this.HorizontalSplit);
        this.parent.observer.off(CONSTANT.TABLE_VERTICAL_SPLIT, this.VerticalSplit);
        this.parent.observer.off(CONSTANT.TABLE_DASHED, this.tableStyle);
        this.parent.observer.off(CONSTANT.TABLE_ALTERNATE, this.tableStyle);
        this.parent.observer.off(CONSTANT.TABLE_BACKGROUND_COLOR, this.setBGColor);
        this.parent.observer.off(CONSTANT.TABLE_MOVE, this.tableMove);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    private createTable(e: IHtmlItem): HTMLElement {
        const table: HTMLElement = createElement('table', { className: 'e-rte-table' });
        const tblBody: HTMLElement = createElement('tbody');
        if (!isNOU(e.item.width.width)) {
            table.style.width = this.calculateStyleValue(e.item.width.width);
        }
        if (!isNOU(e.item.width.minWidth)) {
            table.style.minWidth = this.calculateStyleValue(e.item.width.minWidth);
        }
        if (!isNOU(e.item.width.maxWidth)) {
            table.style.maxWidth = this.calculateStyleValue(e.item.width.maxWidth);
        }
        const tdWid: number = parseInt(e.item.width.width as string, 10) > 100 ?
            100 / e.item.columns : parseInt(e.item.width.width as string, 10) / e.item.columns;
        for (let i: number = 0; i < e.item.rows; i++) {
            const row: HTMLElement = createElement('tr');
            for (let j: number = 0; j < e.item.columns; j++) {
                const cell: HTMLElement = createElement('td');
                cell.appendChild(createElement('br'));
                cell.style.width = tdWid + '%';
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        }
        table.appendChild(tblBody);
        e.item.selection.restore();
        InsertHtml.Insert(this.parent.currentDocument, table, this.parent.editableElement);
        e.item.selection.setSelectionText(this.parent.currentDocument, table.querySelector('td'), table.querySelector('td'), 0, 0);
        if (table.nextElementSibling === null && !table.classList.contains('ignore-table')) {
            let insertElem: HTMLElement;
            if (e.enterAction === 'DIV') {
                insertElem = createElement('div');
                insertElem.appendChild(createElement('br'));
            } else if (e.enterAction === 'BR') {
                insertElem = createElement('br');
            } else {
                insertElem = createElement('p');
                insertElem.appendChild(createElement('br'));
            }
            this.insertAfter(insertElem, table);
        }
        if (table.classList.contains('ignore-table')) {
            removeClassWithAttr([table], ['ignore-table']);
        }
        table.querySelector('td').classList.add('e-cell-select');
        if (e.callBack) {
            e.callBack({
                requestType: 'Table',
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: [table] as Element[]
            });
        }
        return table;
    }

    private calculateStyleValue(value: string | number): string {
        let styleValue: string;
        if (typeof (value) === 'string') {
            if (value.indexOf('px') >= 0 || value.indexOf('%') >= 0 || value.indexOf('auto') >= 0) {
                styleValue = value;
            } else {
                styleValue = value + 'px';
            }
        } else {
            styleValue = value + 'px';
        }
        return styleValue;
    }

    private insertAfter(newNode: Element, referenceNode: Element): void {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    private getSelectedCellMinMaxIndex(e: HTMLElement[][]): MinMax {
        const selectedCells: NodeListOf<HTMLElement> = this.curTable.querySelectorAll('.e-cell-select');
        let a: number = 0;
        let minI: number = e.length;
        let maxI: number = 0;
        let minJ: number = e[0].length;
        let maxJ: number = 0;
        //eslint-disable-next-line
        for (let i: number = 0; a < selectedCells.length; a++) {
            const selectedCellIndex: number[] = this.getCorrespondingIndex(selectedCells[a as number], e);
            const minMaxIndex: number[] = this.FindIndex(selectedCellIndex[0], selectedCellIndex[1], e);
            //eslint-disable-next-line
            minI = Math.min(selectedCellIndex[0], minI),
            maxI = Math.max(minMaxIndex[0], maxI),
            minJ = Math.min(selectedCellIndex[1], minJ),
            maxJ = Math.max(minMaxIndex[1], maxJ);
        }
        return {
            startRow: minI,
            endRow: maxI,
            startColumn: minJ,
            endColumn: maxJ
        };
    }

    private insertRow(e: IHtmlItem): void {
        const isBelow: boolean = e.item.subCommand === 'InsertRowBefore' ? false : true;
        let selectedCell: HTMLElement = e.item.selection.range.startContainer as HTMLElement;
        if (!(selectedCell.nodeName === 'TH' || selectedCell.nodeName === 'TD')) {
            selectedCell = closest(selectedCell.parentElement, 'td,th') as HTMLElement;
        }
        this.curTable = closest(this.parent.nodeSelection.range.startContainer.parentElement, 'table') as HTMLTableElement;
        if (this.curTable.querySelectorAll('.e-cell-select').length === 0) {
            const lastRow: Element = this.curTable.rows[this.curTable.rows.length - 1];
            const cloneRow: Node = lastRow.cloneNode(true);
            (cloneRow as HTMLElement).removeAttribute('rowspan');
            this.insertAfter(cloneRow as HTMLElement, lastRow);
        } else {
            const allCells: HTMLElement[][] = this.getCorrespondingColumns();
            const minMaxIndex: MinMax = this.getSelectedCellMinMaxIndex(allCells);
            const minVal: number = isBelow ? minMaxIndex.endRow : minMaxIndex.startRow;
            const newRow: Element = createElement('tr');
            const isHeaderSelect: boolean = this.curTable.querySelectorAll('th.e-cell-select').length > 0;
            for (let i: number = 0; i < allCells[minVal as number].length; i++) {
                // eslint-disable-next-line max-len
                if (isBelow && minVal < allCells.length - 1 && allCells[minVal as number][i as number] === allCells[minVal + 1][i as number] ||
                        !isBelow && 0 < minVal && allCells[minVal as number][i as number] === allCells[minVal - 1][i as number]) {
                    if (0 === i || 0 < i && allCells[minVal as number][i as number] !== allCells[minVal as number][i - 1]) {
                        allCells[minVal as number][i as number].setAttribute('rowspan', (parseInt(allCells[minVal as number][i as number].getAttribute('rowspan'), 10) + 1).toString());
                    }
                } else {
                    const tdElement: HTMLElement = createElement('td');
                    tdElement.appendChild(createElement('br'));
                    newRow.appendChild(tdElement);
                    const styleValue: string = allCells[(isHeaderSelect && isBelow) ? allCells[(minVal + 1)] ? (minVal + 1) : minVal : minVal][i as number].getAttribute('style');
                    if (styleValue) {
                        const updatedStyle: string = this.cellStyleCleanup(styleValue);
                        tdElement.style.cssText = updatedStyle;
                    }
                }
            }
            // eslint-disable-next-line
            let selectedRow;
            if (isHeaderSelect && isBelow) {
                selectedRow = this.curTable.querySelector('tbody').childNodes[0];
            } else {
                selectedRow = this.curTable.rows[minVal as number];
            }
            // eslint-disable-next-line
            (e.item.subCommand === 'InsertRowBefore') ? selectedRow.parentElement.insertBefore(newRow, selectedRow) :
                (isHeaderSelect ? selectedRow.parentElement.insertBefore(newRow, selectedRow) :
                    this.insertAfter(newRow, selectedRow as Element));
        }
        e.item.selection.setSelectionText(
            this.parent.currentDocument, e.item.selection.range.startContainer, e.item.selection.range.startContainer, 0, 0);
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private cellStyleCleanup(value: string): string {
        const styles: string[] = value.split(';');
        const newStyles: string[] = [];
        const deniedFormats: string[] = ['background-color', 'vertical-align', 'text-align'];
        for (let i: number = 0; i < styles.length; i++) {
            const style: string = styles[i as number];
            let isAllowed: boolean = true;
            for (let j: number = 0; j < deniedFormats.length; j++) {
                const deniedStyle: string = deniedFormats[j as number];
                if (style.indexOf(deniedStyle) > -1) {
                    isAllowed = false;
                }
            }
            if (isAllowed) {
                newStyles.push(style);
            }
        }
        return newStyles.join(';');
    }

    private insertColumn(e: IHtmlItem): void {
        let selectedCell: HTMLElement = e.item.selection.range.startContainer as HTMLElement;
        if (!(selectedCell.nodeName === 'TH' || selectedCell.nodeName === 'TD')) {
            selectedCell = closest(selectedCell.parentElement, 'td,th') as HTMLElement;
        }
        const curRow: HTMLElement = closest(selectedCell as HTMLElement, 'tr') as HTMLElement;
        let curCell: Element;
        const allRows: HTMLCollectionOf<HTMLTableRowElement> = (closest((curRow), 'table') as HTMLTableElement).rows;
        const colIndex: number = Array.prototype.slice.call((curRow as HTMLElement).querySelectorAll(':scope > td, :scope > th')).indexOf(selectedCell);
        const previousWidth: number = parseInt(e.item.width as string, 10) / (curRow.querySelectorAll(':scope > td, :scope > th').length);
        const currentWidth: number = parseInt(e.item.width as string, 10) / (curRow.querySelectorAll(':scope > td, :scope > th').length + 1);
        const currentTabElm: Element = closest(curRow as HTMLElement, 'table');
        const thTdElm: NodeListOf<HTMLElement> = closest(curRow as HTMLElement, 'table').querySelectorAll('th,td');
        for (let i: number = 0; i < thTdElm.length; i++) {
            thTdElm[i as number].dataset.oldWidth = (thTdElm[i as number].offsetWidth / (currentTabElm as HTMLElement).offsetWidth * 100) + '%';
        }
        if (isNOU((currentTabElm as HTMLElement).style.width) || (currentTabElm as HTMLElement).style.width === '') {
            (currentTabElm as HTMLElement).style.width = (currentTabElm as HTMLElement).offsetWidth + 'px';
        }
        for (let i: number = 0; i < allRows.length; i++) {
            curCell = allRows[i as number].querySelectorAll(':scope > td, :scope > th')[colIndex as number];
            const colTemplate: HTMLElement = (curCell as HTMLElement).cloneNode(true) as HTMLElement;
            const style: string = (colTemplate as HTMLElement).getAttribute('style');
            if (style) {
                const updatedStyle: string = this.cellStyleCleanup(style);
                colTemplate.style.cssText = updatedStyle;
            }
            (colTemplate as HTMLElement).innerHTML = '';
            (colTemplate as HTMLElement).appendChild(createElement('br'));
            (colTemplate as HTMLElement).removeAttribute('class');
            (colTemplate as HTMLElement).removeAttribute('colspan');
            (colTemplate as HTMLElement).removeAttribute('rowspan');
            // eslint-disable-next-line
            (e.item.subCommand === 'InsertColumnLeft') ? curCell.parentElement.insertBefore(colTemplate, curCell) :
                this.insertAfter((colTemplate as HTMLElement), (curCell as Element));
            (colTemplate as HTMLElement).style.width = currentWidth.toFixed(4) + '%';
            delete (colTemplate as HTMLElement).dataset.oldWidth;
        }
        for (let i: number = 0; i < thTdElm.length; i++) {
            thTdElm[i as number].style.width = (Number(thTdElm[i as number].dataset.oldWidth.split('%')[0]) * currentWidth / previousWidth).toFixed(4) + '%';
            delete thTdElm[i as number].dataset.oldWidth;
        }
        e.item.selection.setSelectionText(this.parent.currentDocument, selectedCell, selectedCell, 0, 0);
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private setBGColor(args: IHtmlSubCommands): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        // eslint-disable-next-line
        const selection: NodeSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        // eslint-disable-next-line
        const selectedCells = this.curTable.querySelectorAll('.e-cell-select');
        for (let i: number = 0; i < selectedCells.length; i++) {
            (selectedCells[i as number] as HTMLElement).style.backgroundColor = args.value.toString();
        }
        this.parent.undoRedoManager.saveData();
        if (args.callBack) {
            args.callBack({
                requestType: args.subCommand,
                editorMode: 'HTML',
                event: args.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private deleteColumn(e: IHtmlItem): void {
        let selectedCell: HTMLElement = e.item.selection.range.startContainer as HTMLElement;
        if (selectedCell.nodeType === 3) {
            selectedCell = closest(selectedCell.parentElement, 'td,th') as HTMLElement;
        }
        const tBodyHeadEle: Element = closest(selectedCell, selectedCell.tagName === 'TH' ? 'thead' : 'tbody');
        const rowIndex: number = tBodyHeadEle && Array.prototype.indexOf.call(tBodyHeadEle.childNodes, selectedCell.parentNode);
        this.curTable = closest(selectedCell, 'table') as HTMLTableElement;
        const curRow: HTMLTableRowElement = closest(selectedCell as HTMLElement, 'tr') as HTMLTableRowElement;
        if (curRow.querySelectorAll('th,td').length === 1) {
            e.item.selection.restore();
            detach(closest(selectedCell.parentElement, 'table'));
        } else {
            let deleteIndex: number;
            const allCells: HTMLElement[][] = this.getCorrespondingColumns();
            //eslint-disable-next-line
            const selectedMinMaxIndex: any = this.getSelectedCellMinMaxIndex(allCells);
            const minCol: number = selectedMinMaxIndex.startColumn;
            const maxCol: number = selectedMinMaxIndex.endColumn;
            for (let i: number = 0; i < allCells.length; i++) {
                const currentRow: HTMLElement[] = allCells[i as number];
                for (let j: number = 0; j < currentRow.length; j++) {
                    const currentCell: HTMLElement = currentRow[j as number];
                    //eslint-disable-next-line
                    const currentCellIndex: any = this.getCorrespondingIndex(currentCell, allCells);
                    const colSpanVal: number = parseInt(currentCell.getAttribute('colspan'), 10) || 1;
                    if (currentCellIndex[1] + (colSpanVal - 1) >= minCol && currentCellIndex[1] <= maxCol) {
                        if (colSpanVal > 1) {
                            currentCell.setAttribute('colspan', (colSpanVal - 1).toString());
                        } else {
                            detach(currentCell);
                            deleteIndex = j;
                            if (Browser.isIE) {
                                e.item.selection.setSelectionText(
                                    this.parent.currentDocument, this.curTable.querySelector('td'), this.curTable.querySelector('td'), 0, 0);
                                this.curTable.querySelector('td, th').classList.add('e-cell-select');
                            }
                        }
                    }
                }
            }
            if (deleteIndex > -1) {
                const rowHeadEle: Element = tBodyHeadEle.children[rowIndex as number];
                const nextFocusCell: HTMLElement = rowHeadEle &&
                    rowHeadEle.children[(deleteIndex <= rowHeadEle.children.length - 1 ? deleteIndex : deleteIndex - 1)] as HTMLElement;
                if (nextFocusCell) {
                    e.item.selection.setSelectionText(this.parent.currentDocument, nextFocusCell, nextFocusCell, 0, 0);
                    nextFocusCell.classList.add('e-cell-select');
                }
            }
        }
        if (e.callBack) {
            const sContainer: Node = this.parent.nodeSelection.getRange(this.parent.currentDocument).startContainer;
            if (sContainer.nodeName !== 'TD') {
                const startChildLength: number = this.parent.nodeSelection.getRange(this.parent.currentDocument).startOffset;
                const focusNode: Element = (sContainer as HTMLElement).children[startChildLength as number];
                if (focusNode) {
                    this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, focusNode, 0);
                }
            }
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private deleteRow(e: IHtmlItem): void {
        let selectedCell: HTMLElement = e.item.selection.range.startContainer as HTMLElement;
        if (selectedCell.nodeType === 3) {
            selectedCell = closest(selectedCell.parentElement, 'td,th') as HTMLElement;
        }
        const colIndex: number = Array.prototype.indexOf.call(selectedCell.parentNode.childNodes, selectedCell);
        this.curTable = closest(selectedCell, 'table') as HTMLTableElement;
        let currentRow: HTMLTableRowElement;
        const allCells: HTMLElement[][] = this.getCorrespondingColumns();
        const minMaxIndex: MinMax = this.getSelectedCellMinMaxIndex(allCells);
        let maxI: number;
        let j: number;
        if (this.curTable.rows.length === 1) {
            e.item.selection.restore();
            detach(closest(selectedCell.parentElement, 'table'));
        } else {
            for (maxI = minMaxIndex.endRow; maxI >= minMaxIndex.startRow; maxI--) {
                currentRow = this.curTable.rows[maxI as number];
                for (j = 0; j < allCells[maxI as number].length; j++) {
                    if (j === 0 || allCells[maxI as number][j as number] !== allCells[maxI as number][j - 1]) {
                        if (1 < parseInt(allCells[maxI as number][j as number].getAttribute('rowspan'), 10)) {
                            const rowSpanVal: number = parseInt(allCells[maxI as number][j as number].getAttribute('rowspan'), 10) - 1;
                            if (1 === rowSpanVal) {
                                allCells[maxI as number][j as number].removeAttribute('rowspan');
                                const cell: HTMLElement = this.getMergedRow(this.getCorrespondingColumns() as HTMLElement[][])[j as number];
                                if (cell) {
                                    const cloneNode: Node = cell.cloneNode(true);
                                    (cloneNode as HTMLElement).innerHTML = '<br>';
                                    if (cell.parentElement) {
                                        cell.parentElement.insertBefore(cloneNode, cell);
                                    }
                                }
                            } else {
                                allCells[maxI as number][j as number].setAttribute('rowspan', rowSpanVal.toString());
                            }
                            /* eslint-enable */
                        }
                    }
                    // eslint-disable-next-line max-len
                    if (maxI < allCells.length - 1 && allCells[maxI as number][j as number] === allCells[maxI + 1][j as number] && (0 === maxI ||
                        allCells[maxI as number][j as number] !== allCells[maxI - 1][j as number])) {
                        const element: HTMLElement = allCells[maxI as number][j as number];
                        let index: number;
                        // eslint-disable-next-line max-len
                        for (index = j; 0 < index && allCells[maxI as number][index as number] === allCells[maxI as number][index - 1]; index--) {
                            if (index === 0) {
                                (this.curTable.rows[maxI + 1] as HTMLElement).prepend(element);
                            } else {
                                allCells[maxI + 1][index - 1].insertAdjacentElement('afterend', element);
                            }
                        }
                    }
                }
                const deleteIndex: number = currentRow.rowIndex;
                this.curTable.deleteRow(deleteIndex);
                const focusTrEle: Element = !isNOU(this.curTable.rows[deleteIndex as number]) ? this.curTable.querySelectorAll('tbody tr')[deleteIndex as number]
                    : this.curTable.querySelectorAll('tbody tr')[deleteIndex - 1];
                const nextFocusCell: HTMLElement = focusTrEle && focusTrEle.querySelectorAll('td')[colIndex as number];
                if (nextFocusCell) {
                    e.item.selection.setSelectionText(this.parent.currentDocument, nextFocusCell, nextFocusCell, 0, 0);
                    nextFocusCell.classList.add('e-cell-select');
                } else {
                    e.item.selection.setSelectionText(
                        this.parent.currentDocument, this.curTable.querySelector('td'), this.curTable.querySelector('td'), 0, 0);
                    this.curTable.querySelector('td, th').classList.add('e-cell-select');
                }
            }
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private getMergedRow(cells: HTMLElement[][]): HTMLElement[] {
        let mergedRow: HTMLElement[];
        for (let i: number = 0; i < cells.length; i++) {
            if (cells[i as number].length !== this.curTable.rows[0].childNodes.length) {
                mergedRow = cells[i as number];
            }
        }
        return mergedRow;
    }

    private removeTable(e: IHtmlItem): void {
        let selectedCell: Node = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        const selectedTable: HTMLElement = closest(selectedCell.parentElement, 'table') as HTMLElement;
        if (selectedTable) {
            detach(selectedTable);
            e.item.selection.restore();
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private tableHeader(e: IHtmlItem): void {
        let headerExit: boolean = false;
        let selectedCell: Node = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        const table: HTMLTableElement = closest(selectedCell.parentElement, 'table') as HTMLTableElement;
        [].slice.call(table.childNodes).forEach((el: Element): void => {
            if (el.nodeName === 'THEAD') {
                headerExit = true;
            }
        });
        if (table && !headerExit) {
            const cellCount: number = table.querySelector('tr').childElementCount;
            let colSpanCount: number = 0;
            for (let i: number = 0; i < cellCount; i++) {
                colSpanCount = colSpanCount + (parseInt(table.querySelector('tr').children[i as number].getAttribute('colspan'), 10) || 1);
            }
            const header: HTMLTableSectionElement = table.createTHead();
            const row: HTMLTableRowElement = header.insertRow(0);
            for (let j: number = 0; j < colSpanCount; j++) {
                const th: HTMLElement = createElement('th');
                th.appendChild(createElement('br'));
                row.appendChild(th);
            }
        } else {
            table.deleteTHead();
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private tableVerticalAlign(e: IHtmlItem): void {
        let value: string = '';
        switch (e.item.subCommand) {
        case 'AlignTop':
            value = 'top';
            break;
        case 'AlignMiddle':
            value = 'middle';
            break;
        case 'AlignBottom':
            value = 'bottom';
            break;
        }
        e.item.tableCell.style.verticalAlign = value;
        if (value && value !== '' && e.item.tableCell.getAttribute('valign')) {
            e.item.tableCell.removeAttribute('valign');
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private cellMerge(e: IHtmlItem): void {
        if (isNOU(this.curTable)) {
            this.curTable = closest(this.parent.nodeSelection.range.startContainer.parentElement, 'table') as HTMLTableElement;
        }
        const selectedCells: NodeListOf<Element> = this.curTable.querySelectorAll('.e-cell-select');
        if (selectedCells.length < 2) {
            return;
        }
        this.mergeCellContent();
        const minMaxIndexes: MinMax = this.getSelectedMinMaxIndexes(this.getCorrespondingColumns());

        const firstCell: Node = selectedCells[0];
        const rowSelectedCells: NodeListOf<HTMLElement> = firstCell.parentElement.querySelectorAll('.e-cell-select');
        let maxHeight: number = 0;
        for (let j: number = 0; j < rowSelectedCells.length; j++) {
            const cellHeight: number = rowSelectedCells[j as number].offsetHeight;
            if (cellHeight > maxHeight) {
                maxHeight = cellHeight;
            }
        }
        if (minMaxIndexes.startColumn < minMaxIndexes.endColumn) {
            (firstCell as HTMLElement).setAttribute('colspan', (minMaxIndexes.endColumn - minMaxIndexes.startColumn + 1).toString());
        }
        if (minMaxIndexes.startRow < minMaxIndexes.endRow) {
            (firstCell as HTMLElement).setAttribute('rowspan', (minMaxIndexes.endRow - minMaxIndexes.startRow + 1).toString());
        }
        let totalWidth: number = 0;
        let unit: string;
        for (let j: number = rowSelectedCells.length - 1; j >= 0; j--) {
            if (!isNOU((rowSelectedCells[j as number] as HTMLElement).style.width)
                && (rowSelectedCells[j as number] as HTMLElement).style.width !== '') {
                if (!unit) {
                    const match: RegExpMatchArray = rowSelectedCells[j as number].style.width.match(/^([\d.]+)([a-z%]+)$/i);
                    unit = match ? match[2] : '%';
                }
                totalWidth = totalWidth + parseFloat((rowSelectedCells[j as number] as HTMLElement).style.width);
            }
            else {
                totalWidth = totalWidth + (((rowSelectedCells[j as number] as HTMLElement).offsetWidth / this.curTable.offsetWidth) * 100);
                unit = '%';
            }
        }
        (firstCell as HTMLElement).style.width = totalWidth + unit;
        (firstCell as HTMLElement).style.height = maxHeight + 'px';

        for (let i: number = 1; i <= selectedCells.length - 1; i++) {
            detach(selectedCells[i as number]);
        }
        for (let i: number = 0; i < this.curTable.rows.length ; i++) {
            if (this.curTable.rows[i as number].innerHTML.trim() === '') {
                detach(this.curTable.rows[i as number]);
            }
        }
        removeClassWithAttr(this.curTable.querySelectorAll('table td, table th'), 'e-multi-cells-select');
        removeClassWithAttr(this.curTable.querySelectorAll('table td, table th'), 'e-cell-select-end');
        this.updateRowSpanStyle(minMaxIndexes.startRow, minMaxIndexes.endRow, this.getCorrespondingColumns());
        this.updateColSpanStyle(minMaxIndexes.startColumn, minMaxIndexes.endColumn, this.getCorrespondingColumns());
        e.item.selection.setSelectionText(
            this.parent.currentDocument, e.item.selection.range.startContainer, e.item.selection.range.startContainer, 0, 0);
        if (this.parent.nodeSelection && firstCell) {
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument,
                // eslint-disable-next-line
                firstCell as HTMLElement, 0);
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private updateColSpanStyle(min: number, max: number, elements: HTMLElement[][]): void {
        let colValue: number;
        let colIndex: number;
        let colMin: number;
        let index: number = 0;
        let attrValue: number;
        let count: number = 0;
        const eleArray: HTMLElement[][] = elements;
        //eslint-disable-next-line
        if (min < (max = Math.min(max, eleArray[0].length - 1))) {
            for (colIndex = min; colIndex <= max; colIndex++) {
                index = Math.min(parseInt(eleArray[0][colIndex as number].getAttribute('colspan'), 10) || 1, max - min + 1);
                if (!(min < colIndex && eleArray[0][colIndex as number] === eleArray[0][colIndex - 1]) && 1 < index &&
                    eleArray[0][colIndex as number] === eleArray[0][colIndex + 1]) {
                    for (count = index - 1, colValue = 1; colValue < eleArray.length; colValue++) {
                        if (eleArray[colValue as number][colIndex as number] !== eleArray[colValue - 1][colIndex as number]) {
                            for (colMin = colIndex as number; colMin < colIndex + index; colMin++) {
                                attrValue = parseInt(eleArray[colValue as number][colMin as number].getAttribute('colspan'), 10) || 1;
                                if (1 < attrValue &&
                                    eleArray[colValue as number][colMin as number] === eleArray[colValue as number][colMin + 1]) {
                                    colMin += count = Math.min(count, attrValue - 1);
                                }
                                else {
                                    count = Math.max(0, count - 1);
                                    if (count === 0) {
                                        break;
                                    }
                                }
                            /* eslint-enable */
                            }
                        }
                        if (!count) {
                            break;
                        }
                    }
                }
            }
            if (count) {
                this.updateCellAttribute(eleArray, count, 'colspan', 0, eleArray.length - 1, min, max);
            }
        }

    }

    private updateRowSpanStyle(min: number, max: number, ele: HTMLElement[][]): void {
        let rowValue: number;
        let colIndex: number;
        let rowMin: number;
        let index: number = 0;
        let attrValue: number;
        let count: number = 0;
        const eleArray: HTMLElement[][] = ele;
        // eslint-disable-next-line
        if (min < (max = Math.min(max, eleArray.length - 1))) {
            for (rowValue = min; rowValue <= max; rowValue++) {
                if (!(min < rowValue && eleArray[rowValue as number][0] === eleArray[rowValue - 1][0])
                    // eslint-disable-next-line no-cond-assign
                    && eleArray[rowValue as number][0] && 1 < (index = Math.min(parseInt(eleArray[rowValue as number][0].getAttribute('rowspan'), 10) ||
                    1, max - min + 1)) && eleArray[rowValue as number][0] === eleArray[rowValue + 1][0]) {
                    for (count = index - 1, colIndex = 1; colIndex < eleArray[0].length; colIndex++) {
                        if (eleArray[rowValue as number][colIndex as number] !== eleArray[rowValue as number][colIndex - 1]) {
                            for (rowMin = rowValue; rowMin < rowValue + index; rowMin++) {
                                attrValue = parseInt(eleArray[rowMin as number][colIndex as number].getAttribute('rowspan'), 10) || 1;
                                if (1 < attrValue && eleArray[rowMin as number][colIndex as number] ===
                                    eleArray[rowMin + 1][colIndex as number]) {
                                    rowMin += count = Math.min(count, attrValue - 1);
                                }
                                // eslint-disable-next-line
                                else if (!(count = Math.max(0, count - 1))) {
                                    break;
                                }
                            }
                            if (!count) {
                                break;
                            }
                        }
                    }
                }
            }
            if (count) {
                this.updateCellAttribute(eleArray, count, 'rowspan', min, max, 0, eleArray[0].length - 1);
            }
        }
    }

    private updateCellAttribute(elements: HTMLElement[][], index: number, attr: string, min: number, max: number,
                                firstIndex: number, length: number): void {
        let rowIndex: number;
        let colIndex: number;
        let spanCount: number;
        for (rowIndex = min; rowIndex <= max; rowIndex++) {
            for (colIndex = firstIndex; colIndex <= length; colIndex++) {
                spanCount = parseInt(elements[rowIndex as number][colIndex as number].getAttribute(attr), 10) || 1;
                if (min < rowIndex && elements[rowIndex as number][colIndex as number] === elements[rowIndex - 1][colIndex as number] ||
                    firstIndex < colIndex && elements[rowIndex as number][colIndex as number] ===
                    elements[rowIndex as number][colIndex - 1] || 1 < (spanCount)) {
                    if ((1 < spanCount - index)) {
                        elements[rowIndex as number][colIndex as number].setAttribute(attr, (spanCount - index).toString());
                    } else {
                        elements[rowIndex as number][colIndex as number].removeAttribute(attr);
                    }
                }
            }
        }
    }

    private mergeCellContent(): void {
        const selectedCells: NodeListOf<HTMLElement> = this.curTable.querySelectorAll('.e-cell-select');
        let innerHtml: string = selectedCells[0].innerHTML === '<br>' ? '' : selectedCells[0].innerHTML;
        for (let i: number = 1; i < selectedCells.length; i++) {
            if ('<br>' !== selectedCells[i as number].innerHTML) {
                innerHtml = innerHtml ? innerHtml + '<br>' + selectedCells[i as number].innerHTML : innerHtml + selectedCells[i as number].innerHTML;
            }
        }
        selectedCells[0].innerHTML = innerHtml;
    }

    private getSelectedMinMaxIndexes(correspondingCells: HTMLElement[][]): MinMax {
        const selectedCells: NodeListOf<HTMLElement> = this.curTable.querySelectorAll('.e-cell-select');
        if (0 < selectedCells.length) {
            let minRow: number = correspondingCells.length;
            let maxRow: number = 0;
            let minCol: number = correspondingCells[0].length;
            let maxCol: number = 0;
            for (let i: number = 0; i < selectedCells.length; i++) {
                const currentRowCol: number[] = this.getCorrespondingIndex(selectedCells[i as number] as HTMLElement, correspondingCells);
                const targetRowCol: number[] = this.FindIndex(currentRowCol[0], currentRowCol[1], correspondingCells);
                minRow = Math.min(currentRowCol[0], minRow);
                maxRow = Math.max(targetRowCol[0], maxRow);
                minCol = Math.min(currentRowCol[1], minCol);
                maxCol = Math.max(targetRowCol[1], maxCol);
            }
            return {
                startRow: minRow,
                endRow: maxRow,
                startColumn: minCol,
                endColumn: maxCol
            };
        }
        return null;
    }

    private HorizontalSplit(e: IHtmlItem): void {
        const selectedCell: Node = e.item.selection.range.startContainer;
        this.curTable = closest(selectedCell.parentElement, 'table') as HTMLTableElement;
        if ((this.curTable as HTMLElement).querySelectorAll('.e-cell-select').length > 1) {
            return;
        }
        this.activeCell = this.curTable.querySelector('.e-cell-select');
        const newCell: HTMLElement = this.activeCell.cloneNode(true) as HTMLElement;
        newCell.removeAttribute('class');
        newCell.innerHTML = '</br>';
        const activeCellIndex: number[] = this.getCorrespondingIndex(this.activeCell, this.getCorrespondingColumns());
        const correspondingCells: HTMLElement[][] = this.getCorrespondingColumns();
        const activeCellRowSpan: number = this.activeCell.getAttribute('rowspan') ? parseInt(this.activeCell.getAttribute('rowspan'), 10) : 1;
        if (activeCellRowSpan > 1) {
            const avgCount: number = Math.ceil(activeCellRowSpan / 2);
            // eslint-disable-next-line
            1 < avgCount ? this.activeCell.setAttribute('rowspan', avgCount.toString()) :
                this.activeCell.removeAttribute('rowspan');
            // eslint-disable-next-line
            1 < (activeCellRowSpan - avgCount) ? newCell.setAttribute('rowspan', (activeCellRowSpan - avgCount).toString()) : newCell.removeAttribute('rowspan');
            let avgRowIndex: number;
            let colIndex: number;
            for (avgRowIndex = activeCellIndex[0] + Math.ceil(activeCellRowSpan / 2),
            colIndex = 0 === activeCellIndex[1] ? activeCellIndex[1]
                : activeCellIndex[1] - 1; 0 <= colIndex && (correspondingCells[avgRowIndex as number][colIndex as number] ===
                    // eslint-disable-next-line max-len
                    correspondingCells[avgRowIndex as number][colIndex - 1] || 0 < avgRowIndex && correspondingCells[avgRowIndex as number][colIndex as number]
                    === correspondingCells[avgRowIndex - 1][colIndex as number]);) {
                colIndex--;
            }
            if (colIndex === -1) {
                if (this.curTable.rows[avgRowIndex as number].firstChild) {
                    (this.curTable.rows[avgRowIndex as number] as HTMLElement).prepend(newCell);
                } else {
                    this.curTable.appendChild(newCell);
                }
            } else {
                correspondingCells[avgRowIndex as number][colIndex as number].insertAdjacentElement('afterend', newCell);
            }

        } else {
            const newTrEle: HTMLElement = createElement('tr');
            newTrEle.appendChild(newCell);
            const selectedRow: HTMLElement[] = correspondingCells[activeCellIndex[0]];
            for (let j: number = 0; j <= selectedRow.length - 1; j++) {
                if (selectedRow[j as number] !== selectedRow[j - 1] && selectedRow[j as number] !== this.activeCell) {
                    selectedRow[j as number].setAttribute('rowspan', ((parseInt(selectedRow[j as number].getAttribute('rowspan'), 10) ?
                        parseInt(selectedRow[j as number].getAttribute('rowspan'), 10) : 1) + 1).toString());
                }
            }
            (this.activeCell.parentNode as HTMLElement).insertAdjacentElement('afterend', newTrEle);
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private VerticalSplit(e: IHtmlItem): void {
        const selectedCell: Node = e.item.selection.range.startContainer;
        this.curTable = closest(selectedCell.parentElement, 'table') as HTMLTableElement;
        if ((this.curTable as HTMLElement).querySelectorAll('.e-cell-select').length > 1) {
            return;
        }
        this.activeCell = this.curTable.querySelector('.e-cell-select');
        const allRows: HTMLCollectionOf<HTMLTableRowElement> = this.curTable.rows;
        const newCell: HTMLElement = this.activeCell.cloneNode(true) as HTMLElement;
        newCell.removeAttribute('class');
        newCell.innerHTML = '</br>';
        const activeCellIndex: number[] = this.getCorrespondingIndex(this.activeCell, this.getCorrespondingColumns());
        const correspondingColumns: HTMLElement[][] = this.getCorrespondingColumns();
        const activeCellcolSpan: number = parseInt(this.activeCell.getAttribute('colspan'), 10) || 1;
        if (activeCellcolSpan > 1) {
            const colSpan: number = Math.ceil(activeCellcolSpan / 2);
            const getColSizes: number[] = this.getColSizes(this.curTable);
            const activeCellUpdatedWidth: number = this.getSplitColWidth(activeCellIndex[1],
                                                                         activeCellIndex[1] + colSpan - 1, getColSizes);
            let newCellWidth: number = this.getSplitColWidth(activeCellIndex[1] + colSpan,
                                                             activeCellIndex[1] + activeCellcolSpan - 1, getColSizes);
            const activeCellWidth: number = this.convertPixelToPercentage(this.activeCell.offsetWidth, this.curTable.offsetWidth);
            newCellWidth = (activeCellWidth - activeCellUpdatedWidth) < newCellWidth ?
                (activeCellWidth - activeCellUpdatedWidth) : newCellWidth;
            if (1 < colSpan) {
                this.activeCell.setAttribute('colspan', colSpan.toString());
            } else {
                this.activeCell.removeAttribute('colspan');
            }
            if (1 < activeCellcolSpan - colSpan) {
                newCell.setAttribute('colspan', (activeCellcolSpan - colSpan).toString());
            } else {
                newCell.removeAttribute('colspan');
            }
            this.activeCell.style.width = activeCellUpdatedWidth + '%';
            newCell.style.width = newCellWidth + '%';
        } else {
            const avgWidth: number = parseFloat(this.activeCell.style.width) / 2;
            for (let i: number = 0; i <= allRows.length - 1; i++) {
                if (0 === i || correspondingColumns[i as number][activeCellIndex[1]] !== correspondingColumns[i - 1][activeCellIndex[1]]) {
                    const currentCell: HTMLElement = correspondingColumns[i as number][activeCellIndex[1]];
                    if (currentCell !== this.activeCell) {
                        currentCell.setAttribute('colspan', ((parseInt(currentCell.getAttribute('colspan'), 10) ?
                            parseInt(currentCell.getAttribute('colspan'), 10) : 1) + 1).toString());
                    }
                }
            }
            this.activeCell.style.width = avgWidth + '%';
            newCell.style.width = avgWidth + '%';
        }
        this.activeCell.parentNode.insertBefore(newCell, this.activeCell.nextSibling);
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }
    private getSplitColWidth(startIndex: number, endInex: number, sizes: number[]): number {
        let width: number = 0;
        for (let i: number = startIndex; i <= endInex; i++)
        {
            width += sizes[i as number];
        }
        return this.convertPixelToPercentage (width, this.curTable.offsetWidth);
    }
    private getColSizes(curTable: HTMLTableElement): number[] {
        const cellColl: HTMLCollectionOf<HTMLTableDataCellElement> = curTable.rows[0].cells;
        let cellCount: number = 0;
        for (let cell: number = 0; cell < cellColl.length; cell++) {
            cellCount = cellCount + cellColl[cell as number].colSpan;
        }
        const sizes: number[] = new Array(cellCount);
        const rowSpanCells: Map<string, HTMLTableDataCellElement> = new Map();
        for (let i: number = 0; i < curTable.rows.length; i++) {
            let currentColIndex: number = 0;
            for (let k: number = 0; k < curTable.rows[i as number].cells.length; k++) {
                for (let l: number = 1; l < curTable.rows[i as number].cells[k as number].rowSpan; l++) {
                    const key: string = `${i + l}${currentColIndex}`;
                    rowSpanCells.set(key, curTable.rows[i as number].cells[k as number]);
                }
                const cellIndex: number = this.getCellIndex(rowSpanCells, i, k);
                if (cellIndex > currentColIndex) {
                    currentColIndex = cellIndex;
                }
                const width: number = curTable.rows[i as number].cells[k as number].offsetWidth;
                if (!sizes[currentColIndex as number] || width < sizes[currentColIndex as number]) {
                    sizes[currentColIndex as number] = width;
                }
                currentColIndex += 1 + curTable.rows[i as number].cells[k as number].colSpan - 1;
            }
        }
        return sizes;
    }
    private getCellIndex(rowSpanCells: Map<string, HTMLTableDataCellElement>, rowIndex: number, colIndex: number): number {
        const cellKey: string = `${rowIndex}${colIndex}`;
        const spannedCell: HTMLTableDataCellElement = rowSpanCells.get(cellKey);
        if (spannedCell) {
            return this.getCellIndex(rowSpanCells, rowIndex, colIndex + spannedCell.colSpan);
        } else {
            return colIndex;
        }
    }
    private convertPixelToPercentage(value: number, offsetValue: number): number {
        return (value / offsetValue) * 100;
    }
    private getCorrespondingColumns(): HTMLElement[][] {
        const elementArray: HTMLElement[][] = [];
        // eslint-disable-next-line
        let _this = this;
        const colspan: number = 0;
        const allRows: HTMLCollectionOf<HTMLTableRowElement> = _this.curTable.rows;
        for (let i: number = 0; i <= allRows.length - 1; i++) {
            const ele: HTMLElement = allRows[i as number];
            let index: number = 0;
            for (let j: number = 0; j <= ele.children.length - 1; j++) {
                const colEle: Element = ele.children[j as number];
                for (let ele: HTMLElement = colEle as HTMLElement, colspan: number = parseInt(ele.getAttribute('colspan'), 10) || 1,
                    rowSpan: number = parseInt(ele.getAttribute('rowspan'), 10) || 1, rowIndex: number = i; rowIndex < i + rowSpan; rowIndex++) {
                    for (let colIndex: number = index; colIndex < index + colspan; colIndex++) {
                        if (!elementArray[rowIndex as number]) {
                            elementArray[rowIndex as number] = [];
                        }
                        if (elementArray[rowIndex as number][colIndex as number]) {
                            index++;
                        } else {
                            elementArray[rowIndex as number][colIndex as number] = colEle as HTMLElement;
                        }
                    }
                }
                index += colspan;
            }
            /* eslint-enable */
        }
        return elementArray;
    }

    // eslint-disable-next-line
    private FindIndex(rowIndex: number, columnIndex: number, cells: HTMLElement[][]) {
        let nextIndex: number;
        let nextCol: number;
        for (nextIndex = rowIndex + 1, nextCol = columnIndex + 1; nextIndex < cells.length;) {
            if (cells[nextIndex as number][columnIndex as number] !== cells[rowIndex as number][columnIndex as number]) {
                nextIndex--;
                break;
            }
            nextIndex++;
        }
        for (nextIndex === cells.length && nextIndex--; nextCol < cells[rowIndex as number].length;) {
            if (cells[rowIndex as number][nextCol as number] !== cells[rowIndex as number][columnIndex as number]) {
                nextCol--;
                break;
            }
            nextCol++;
        }
        return nextCol === cells[rowIndex as number].length && nextCol--,
        [
            nextIndex,
            nextCol
        ];
    }

    private getCorrespondingIndex(cell: HTMLElement, allCells: HTMLElement[][]): number[] {
        //let value: RowCol = new RowCol();
        for (let i: number = 0; i < allCells.length; i++) {
            for (let j: number = 0; j < allCells[i as number].length; j++) {
                if (allCells[i as number][j as number] === cell) {
                    return [i, j];
                }
            }
        }
        return [];
    }

    private highlightCells(minRow: number, maxRow: number, minCol: number, maxCol: number, eleArray: HTMLElement[][]): MinMax {
        let j: number;
        let k: number;
        let startCell: number[];
        let endCell: number[];
        let minRowIndex: number = minRow;
        let maxRowIndex: number = maxRow;
        let minColIndex: number = minCol;
        let maxColIndex: number = maxCol;
        let minMaxValues: MinMax = new MinMax();
        for (j = minRowIndex; j <= maxRowIndex; j++) {
            startCell = this.getCorrespondingIndex(eleArray[j as number][minColIndex as number], eleArray);
            endCell = this.FindIndex(startCell[0], startCell[1], eleArray);
            if ((1 < (parseInt(eleArray[j as number][minColIndex as number].getAttribute('rowspan'), 10) || 1) ||
                1 < (parseInt(eleArray[j as number][minColIndex as number].getAttribute('colspan'), 10) || 1)) &&
                endCell) {
                minRowIndex = Math.min(startCell[0], minRowIndex);
                maxRowIndex = Math.max(endCell[0], maxRowIndex);
                minColIndex = Math.min(startCell[1], minColIndex);
                maxColIndex = Math.max(endCell[1], maxColIndex);
            } else if ((1 < (parseInt(eleArray[j as number][maxColIndex as number].getAttribute('rowspan'), 10) || 1) ||
                1 < (parseInt(eleArray[j as number][maxColIndex as number].getAttribute('colspan'), 10) || 1))) {
                startCell = this.getCorrespondingIndex(eleArray[j as number][maxColIndex as number],
                                                       eleArray);
                endCell = this.FindIndex(startCell[0], startCell[1], eleArray);
                if (endCell) {
                    minRowIndex = Math.min(startCell[0], minRowIndex);
                    maxRowIndex = Math.max(endCell[0], maxRowIndex);
                    minColIndex = Math.min(startCell[1], minColIndex);
                    maxColIndex = Math.max(endCell[1], maxColIndex);
                }
            }

            for (k = minColIndex; k <= maxColIndex; k++) {
                startCell = this.getCorrespondingIndex(eleArray[minRowIndex as number][k as number],
                                                       eleArray);
                endCell = this.FindIndex(startCell[0], startCell[1], eleArray);
                if ((1 < (parseInt(eleArray[minRowIndex as number][k as number].getAttribute('rowspan'), 10) || 1) ||
                    1 < (parseInt(eleArray[minRowIndex as number][k as number].getAttribute('colspan'), 10) || 1)) &&
                    endCell) {
                    minRowIndex = Math.min(startCell[0], minRowIndex);
                    maxRowIndex = Math.max(endCell[0], maxRowIndex);
                    minColIndex = Math.min(startCell[1], minColIndex);
                    maxColIndex = Math.max(endCell[1], maxColIndex);
                } else if ((1 < (parseInt(eleArray[maxRowIndex as number][k as number].getAttribute('rowspan'), 10) || 1) ||
                    1 < (parseInt(eleArray[maxRowIndex as number][k as number].getAttribute('colspan'), 10) || 1))) {
                    startCell = this.getCorrespondingIndex(eleArray[maxRowIndex as number][k as number],
                                                           eleArray);
                    endCell = this.FindIndex(startCell[0], startCell[1], eleArray);
                    if (endCell) {
                        minRowIndex = Math.min(startCell[0], minRowIndex);
                        maxRowIndex = Math.max(endCell[0], maxRowIndex);
                        minColIndex = Math.min(startCell[1], minColIndex);
                        maxColIndex = Math.max(endCell[1], maxColIndex);
                    }
                }
            }
            minMaxValues = minRowIndex === minRow && maxRowIndex === maxRow && minColIndex === minCol && maxColIndex === maxCol ? {
                startRow: minRow,
                endRow: maxRow,
                startColumn: minCol,
                endColumn: maxCol
            } : this.highlightCells(minRowIndex, maxRowIndex, minColIndex, maxColIndex, eleArray);
        }
        return minMaxValues;
        /* eslint-enable */
    }

    private restoreRange(target: HTMLElement): void {
        if (this.parent.currentDocument.getSelection().rangeCount && (target.nodeName === 'TD' || target.nodeName === 'TH')) {
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, target, 0);
        }
    }

    private tableStyle(e: IHtmlItem): void {
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private tableMove(e: IHtmlItem): void {
        this.activeCell = e.selectNode[0] as HTMLElement;
        const target: HTMLElement = e.event.target as HTMLElement;
        const activeCellTag: string = this.activeCell.tagName;
        const targetCellTag: string = target.tagName;
        this.curTable = closest(target, 'table') as HTMLTableElement;
        if ((target.tagName !== 'TD' && target.tagName !== 'TH') && activeCellTag !== targetCellTag) {
            return;
        }
        const activeCellTable: HTMLTableElement = closest(this.activeCell, 'table') as HTMLTableElement;
        if ((isNOU(this.curTable) || isNOU(activeCellTable)) || activeCellTable !== this.curTable) {
            return;
        }
        const correspondingCells: HTMLElement[][] = this.getCorrespondingColumns();
        const activeIndexes: number[] = this.getCorrespondingIndex(this.activeCell, correspondingCells);
        const targetIndexes: number[] = this.getCorrespondingIndex(target as HTMLElement, correspondingCells);
        const activeCellList: NodeListOf<HTMLElement> = this.curTable.querySelectorAll('.e-cell-select, .e-multi-cells-select, .e-cell-select-end');
        for (let i: number = activeCellList.length - 1; i >= 0; i--) {
            if (this.activeCell !== activeCellList[i as number]) {
                removeClassWithAttr([activeCellList[i as number]], ['e-cell-select']);
            }
            removeClassWithAttr([activeCellList[i as number]], ['e-multi-cells-select']);
            removeClassWithAttr([activeCellList[i as number]], ['e-cell-select-end']);
        }
        if (activeIndexes[0] === targetIndexes[0] && activeIndexes[1] === targetIndexes[1]) {
            if (activeCellList.length > 1) {
                this.restoreRange(target);
            }
            return;
        }
        const minMaxIndexes: MinMax = this.highlightCells(Math.min(activeIndexes[0], targetIndexes[0]),
                                                          Math.max(activeIndexes[0], targetIndexes[0]),
                                                          Math.min(activeIndexes[1], targetIndexes[1]),
                                                          Math.max(activeIndexes[1], targetIndexes[1]), correspondingCells);
        for (let rowIndex: number = minMaxIndexes.startRow; rowIndex <= minMaxIndexes.endRow; rowIndex++) {
            for (let colIndex: number = minMaxIndexes.startColumn; colIndex <= minMaxIndexes.endColumn; colIndex++) {
                correspondingCells[rowIndex as number][colIndex as number].classList.add('e-cell-select');
                correspondingCells[rowIndex as number][colIndex as number].classList.add('e-multi-cells-select');
            }
        }
        target.classList.add('e-cell-select-end');
        if (e.event.type) {
            e.event.preventDefault();
        }
        this.restoreRange(target);
    }

    public destroy(): void {
        this.removeEventListener();
    }
}

class MinMax {
    public startRow: number;
    public endRow: number;
    public startColumn: number;
    public endColumn: number;
}
