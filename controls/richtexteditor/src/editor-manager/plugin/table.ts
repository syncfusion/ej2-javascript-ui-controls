import { createElement, closest, detach, Browser } from '@syncfusion/ej2-base';
import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { IHtmlItem } from './../base/interface';
import { InsertHtml } from './inserthtml';
/**
 * Link internal component
 * @hidden
 */
export class TableCommand {
    private parent: EditorManager;
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent: EditorManager) {
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
    }

    private createTable(e: IHtmlItem): HTMLElement {
        let table: HTMLElement = createElement('table', { className: 'e-rte-table' });
        let tblBody: HTMLElement = createElement('tbody');
        table.style.width = e.item.width.width as string;
        let tdWid: number = parseInt(e.item.width.width as string, 10) / e.item.columns;
        for (let i: number = 0; i < e.item.row; i++) {
            let row: HTMLElement = createElement('tr');
            for (let j: number = 0; j < e.item.columns; j++) {
                let cell: HTMLElement = createElement('td');
                cell.appendChild(createElement('br'));
                cell.style.width = tdWid + '%';
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        }
        table.appendChild(tblBody);
        e.item.selection.restore();
        InsertHtml.Insert(this.parent.currentDocument, table, this.parent.editableElement);
        this.removeEmptyNode();
        e.item.selection.setSelectionText(this.parent.currentDocument, table.querySelector('td'), table.querySelector('td'), 0, 0);
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

    private removeEmptyNode(): void {
        let emptyUl: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('ul:empty, ol:empty');
        for (let i: number = 0; i < emptyUl.length; i++) {
            detach(emptyUl[i]);
        }
        let emptyLiChild: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('li *:empty');
        for (let i: number = 0; i < emptyLiChild.length; i++) {
            detach(emptyLiChild[i]);
            if (emptyLiChild.length === i + 1) {
                emptyLiChild = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('li *:empty');
                i = -1;
            }
        }
        let emptyLi: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('li:empty');
        for (let i: number = 0; i < emptyLi.length; i++) {
            detach(emptyLi[i]);
        }
    }

    private insertAfter(newNode: Element, referenceNode: Element): void {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    private insertRow(e: IHtmlItem): void {
        let selectedCell: Node = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        if (selectedCell.nodeName.toLowerCase() === 'th' && e.item.subCommand === 'InsertRowBefore') { return; }
        let curRow: Node = closest(selectedCell as HTMLElement, 'tr');
        let newRow: Node;
        if (selectedCell.nodeName.toLowerCase() !== 'th') {
            newRow = closest(selectedCell as HTMLElement, 'tr').cloneNode(true);
            let tabCell: HTMLElement[] = Array.prototype.slice.call((newRow as HTMLElement).querySelectorAll('td'));
            Array.prototype.forEach.call(tabCell, (cell: HTMLElement): void => {
                cell.innerHTML = '';
                cell.appendChild(createElement('br'));
                cell.removeAttribute('class');
            });
        } else {
            let childNodes: NodeListOf<Node> = curRow.childNodes as NodeListOf<Node>;
            newRow = createElement('tr');
            for (let i: number = 0; i < childNodes.length; i++) {
                let tdElement: Element = createElement('td');
                tdElement.appendChild(createElement('br'));
                newRow.appendChild(tdElement);
            }
        }
        (e.item.subCommand === 'InsertRowBefore') ?
            curRow.parentElement.insertBefore(newRow, curRow) : this.insertAfter((newRow as Element), (curRow as Element));
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

    private insertColumn(e: IHtmlItem): void {
        let selectedCell: Node = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        selectedCell = (selectedCell.nodeName !== 'TD') ? closest(selectedCell, 'td,th') : selectedCell;
        let curRow: HTMLElement = closest(selectedCell as HTMLElement, 'tr') as HTMLElement;
        let curCell: Element;
        let allRows: HTMLCollectionOf<HTMLTableRowElement> = (closest((curRow), 'table') as HTMLTableElement).rows;
        let colIndex: number = Array.prototype.slice.call((curRow as HTMLElement).querySelectorAll('th,td')).indexOf(selectedCell);
        let width: number = parseInt(e.item.width as string, 10) / (curRow.querySelectorAll('td,th').length + 1);
        for (let j: number = 0; j < closest(curRow as HTMLElement, 'table').querySelectorAll('th,td').length; j++) {
            (closest(curRow as HTMLElement, 'table').querySelectorAll('th,td')[j] as HTMLElement).style.width = width + '%';
        }
        for (let i: number = 0; i < allRows.length; i++) {
            curCell = allRows[i].querySelectorAll('th,td')[colIndex];
            let colTemplate: Node = (curCell as HTMLElement).cloneNode(true);
            (colTemplate as HTMLElement).innerHTML = '';
            (colTemplate as HTMLElement).appendChild(createElement('br'));
            (colTemplate as HTMLElement).removeAttribute('class');
            (e.item.subCommand === 'InsertColumnLeft') ? curCell.parentElement.insertBefore(colTemplate, curCell) :
                this.insertAfter((colTemplate as HTMLElement), (curCell as Element));
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

    private deleteColumn(e: IHtmlItem): void {
        let selectedCell: Node = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        let selectedCellIndex: number = (selectedCell as HTMLTableDataCellElement).cellIndex;
        let parentTable: HTMLTableElement = closest(selectedCell, 'table') as HTMLTableElement;
        let curRow: HTMLTableRowElement = closest(selectedCell as HTMLElement, 'tr') as HTMLTableRowElement;
        let allRows: HTMLCollectionOf<HTMLTableRowElement> = (closest(curRow, 'table') as HTMLTableElement).rows;
        if (curRow.querySelectorAll('th,td').length === 1) {
            e.item.selection.restore();
            detach(closest(selectedCell.parentElement, 'table'));
        } else {
            for (let i: number = 0; i < allRows.length; i++) {
                (allRows[i] as HTMLTableRowElement).deleteCell(selectedCellIndex);
                if (Browser.isIE) {
                    e.item.selection.setSelectionText(
                        this.parent.currentDocument, parentTable.querySelector('td'), parentTable.querySelector('td'), 0, 0);
                    parentTable.querySelector('td, th').classList.add('e-cell-select');
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

    private deleteRow(e: IHtmlItem): void {
        let selectedCell: Node = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        let selectedRowIndex: number = (selectedCell.parentNode as HTMLTableRowElement).rowIndex;
        let parentTable: HTMLTableElement = closest(selectedCell, 'table') as HTMLTableElement;
        if (parentTable.rows.length === 1) {
            e.item.selection.restore();
            detach(closest(selectedCell.parentElement, 'table'));
        } else {
            if ((selectedCell as HTMLElement).tagName === 'TH') {
                detach(parentTable.querySelector('thead'));
            } else {
                parentTable.deleteRow(selectedRowIndex);
            }
            e.item.selection.setSelectionText(
                this.parent.currentDocument, parentTable.querySelector('td'), parentTable.querySelector('td'), 0, 0);
            parentTable.querySelector('td, th').classList.add('e-cell-select');
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

    private removeTable(e: IHtmlItem): void {
        let selectedCell: Node = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        let seletedTable: HTMLElement = closest(selectedCell.parentElement, 'table') as HTMLElement;
        if (seletedTable) {
            e.item.selection.restore();
            detach(seletedTable);
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
        let table: HTMLTableElement = closest(selectedCell.parentElement, 'table') as HTMLTableElement;
        [].slice.call(table.childNodes).forEach((el: Element): void => {
            if (el.nodeName === 'THEAD') { headerExit = true; }
        });
        if (table && !headerExit) {
            let cellCount: number = table.querySelector('tr').childElementCount;
            let header: HTMLTableSectionElement = table.createTHead();
            let row: HTMLTableRowElement = header.insertRow(0);
            for (let i: number = 0; i < cellCount; i++) {
                let th: HTMLElement = createElement('th');
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
        if (e.item.subCommand === 'AlignTop') {
            e.item.tableCell.style.verticalAlign = 'top';
        } else if (e.item.subCommand === 'AlignMiddle') {
            e.item.tableCell.style.verticalAlign = 'middle';
        } else {
            e.item.tableCell.style.verticalAlign = 'bottom';
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
}