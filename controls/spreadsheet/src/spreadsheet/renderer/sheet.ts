import { formatUnit, detach, attributes, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Spreadsheet } from '../base/index';
import { getRangeIndexes } from './../../workbook/common/address';
import { getColumnWidth, isHiddenCol } from '../../workbook/base/column';
import { contentLoaded, editOperation, getUpdateUsingRaf, IRowRenderer, removeAllChildren, SheetRenderArgs } from '../common/index';
import { IRenderer, beforeContentLoaded, getColGroupWidth, virtualContentLoaded, setAriaOptions, dataBound } from '../common/index';
import { CellRenderArgs, beforeHeaderLoaded, ICellRenderer, created, spreadsheetDestroyed, skipHiddenIdx, isReact } from '../common/index';
import { checkMerge, forRefSelRender, initiateEdit, chartRangeSelection, renderReactTemplates } from '../common/index';
import { CellModel, SheetModel, ExtendedRange, getCell, isHiddenRow } from '../../workbook/index';

/**
 * Sheet module is used to render Sheet
 * @hidden
 */
export class SheetRender implements IRenderer {
    private parent: Spreadsheet;
    private headerPanel: Element;
    private contentPanel: Element;
    private col: HTMLTableColElement;
    private rowRenderer: IRowRenderer;
    private cellRenderer: ICellRenderer;
    private freezePane: boolean = false;
    public colGroupWidth: number = 30; //Row header and selectall table colgroup width

    constructor(parent?: Spreadsheet) {
        this.parent = parent;
        this.col = parent.createElement('col') as HTMLTableColElement;
        this.rowRenderer = parent.serviceLocator.getService<IRowRenderer>('row');
        this.cellRenderer = parent.serviceLocator.getService<ICellRenderer>('cell');
        this.addEventListener();
    }

    private refreshSelectALLContent(): void {
        let cell: Element;
        if (this.freezePane) {
            let tHead: Element = this.getSelectAllTable().querySelector('thead');
            let row: Element = this.rowRenderer.render();
            tHead.appendChild(row);
            cell = this.parent.createElement('th', { className: 'e-select-all-cell' });
            row.appendChild(cell);
        } else {
            cell = this.headerPanel.firstElementChild; cell.classList.add('e-select-all-cell');
        }
        cell.appendChild(this.parent.createElement('button', { className: 'e-selectall e-icons',
            id: `${this.parent.element.id}_select_all` }));
    }

    private updateLeftColGroup(width?: number, rowHdr?: Element): void {
        if (width) { this.colGroupWidth = width; }
        if (!rowHdr) { rowHdr = this.getRowHeaderPanel(); }
        let table: Element = rowHdr.querySelector('table');
        this.detachColGroup(table);
        let colGrp: Element = this.parent.createElement('colgroup');
        let colGrpWidth: string = `${this.colGroupWidth}px`;
        let col: HTMLElement = this.col.cloneNode() as HTMLElement; col.style.width = colGrpWidth;
        colGrp.appendChild(col);
        table.insertBefore(colGrp, table.querySelector('tbody'));
        (rowHdr as HTMLElement).style.width = colGrpWidth;
        if (this.freezePane) {
            table = this.getSelectAllTable();
            this.detachColGroup(table);
            table.insertBefore(colGrp.cloneNode(true), table.querySelector('thead'));
        } else {
            this.getSelectAllContent().style.width = colGrpWidth;
        }
        if (this.parent.getActiveSheet().showHeaders) {
            (this.getColHeaderPanel() as HTMLElement).style.width = `calc(100% - ${colGrpWidth})`;
            (this.getContentPanel() as HTMLElement).style.width = `calc(100% - ${colGrpWidth})`;
        }
    }

    private detachColGroup(table: Element): void {
        let colGrp: Element = table.querySelector('colgroup');
        if (colGrp) { detach(colGrp); }
    }

    public renderPanel(): void {
        this.contentPanel = this.parent.createElement('div', { className: 'e-main-panel' });
        let sheet: SheetModel = this.parent.getActiveSheet();
        let id: string = this.parent.element.id;
        if (sheet.showHeaders) {
            this.contentPanel.appendChild(this.parent.createElement('div', { className: 'e-row-header', id: `${id}_row_header` }));
            this.initHeaderPanel();
            if (this.parent.allowScrolling) { this.parent.scrollModule.setPadding(); }
        } else {
            this.updateHideHeaders();
        }
        let content: HTMLElement = this.contentPanel.appendChild(
            this.parent.createElement('div', { className: 'e-sheet-content', id: `${id}_main_content` }));
        if (!sheet.showGridLines) { content.classList.add('e-hide-gridlines'); }
        if (!this.parent.allowScrolling) { content.style.overflow = 'hidden'; }
    }

    private initHeaderPanel(): void {
        let id: string = this.parent.element.id;
        this.headerPanel = this.parent.createElement('div', { className: 'e-header-panel' });
        this.headerPanel.appendChild(this.parent.createElement('div', { className: 'e-selectall-container', id: `${id}_selectall` }));
        this.headerPanel.appendChild(this.parent.createElement('div', { className: 'e-column-header', id: `${id}_col_header` }));
    }

    public createTable(): void {
        if (this.parent.getActiveSheet().showHeaders) {
            this.createHeaderTable();
        }
        this.updateTable('tbody', 'content', this.contentPanel.lastElementChild);
    }

    private createHeaderTable(rowHdrEle: Element = this.contentPanel.querySelector('.e-row-header')): void {
        if (this.freezePane) { this.updateTable('thead', 'selectall', this.headerPanel.querySelector('.e-selectall-container')); }
        this.updateTable('thead', 'colhdr', this.headerPanel.querySelector('.e-column-header'));
        this.updateTable('tbody', 'rowhdr', rowHdrEle);
        this.updateLeftColGroup(null, rowHdrEle);
    }

    private updateTable(tagName: string, name: string, appendTo: Element): void {
        let table: HTMLElement = this.parent.createElement('table', { className: 'e-table', attrs: { 'role': 'grid' } });
        table.classList.add(`e-${name}-table`);
        appendTo.appendChild(table);
        table.appendChild(this.parent.createElement(tagName));
    }

    /**
     * It is used to refresh the select all, row header, column header and content of the spreadsheet.
     */
    public renderTable(args: SheetRenderArgs): void {
        let indexes: number[]; let row: Element; let hRow: Element; let sheet: SheetModel = this.parent.getActiveSheet();
        let frag: DocumentFragment = document.createDocumentFragment();
        this.createTable();
        let colGrp: Element = this.parent.createElement('colgroup');
        let cTBody: Element = this.contentPanel.querySelector('.e-sheet-content tbody');
        let rHdrTBody: Element; let cHdrTHead: Element; let cHdrRow: Element;
        if (sheet.showHeaders) {
            frag.appendChild(this.headerPanel);
            this.refreshSelectALLContent();
            rHdrTBody = this.contentPanel.querySelector('.e-row-header tbody');
            cHdrTHead = this.headerPanel.querySelector('.e-column-header thead');
            this.getColHeaderTable().insertBefore(colGrp, cHdrTHead);
            cHdrRow = this.rowRenderer.render(); cHdrTHead.appendChild(cHdrRow);
        }
        frag.appendChild(this.contentPanel);
        this.parent.notify(beforeContentLoaded, { startColIdx: args.indexes[1] });
        let colCount: string = sheet.colCount.toString(); let rowCount: string = sheet.colCount.toString();
        let layout: string = args.top && args.left ? 'RowColumn' : (args.top ? 'Row' : (args.left ? 'Column' : ''));
        if (sheet.showHeaders) {
            this.parent.getColHeaderTable().setAttribute('aria-colcount', colCount);
            this.parent.getRowHeaderTable().setAttribute('aria-rowcount', rowCount);
        }
        attributes(this.parent.getContentTable(), { 'aria-rowcount': rowCount, 'aria-colcount': colCount });
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[1] === args.indexes[1]) {
                if (sheet.showHeaders) {
                    hRow = this.rowRenderer.render(indexes[0], true);
                    rHdrTBody.appendChild(hRow);
                    hRow.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                }
                row = this.rowRenderer.render(indexes[0]);
                cTBody.appendChild(row);
            }
            row.appendChild(this.cellRenderer.render(<CellRenderArgs>{colIdx: indexes[1], rowIdx: indexes[0], cell: value,
                address: key, lastCell: indexes[1] === args.indexes[3], isHeightCheckNeeded: true, row: row, hRow: hRow,
                pRow: row.previousSibling, pHRow: sheet.showHeaders ? hRow.previousSibling : null,
                first: layout ? (layout.includes('Row') ? (indexes[0] === args.indexes[0] ? 'Row' : (layout.includes('Column') ? (
                    indexes[1] === args.indexes[1] ? 'Column' : '') : '')) : (indexes[1] === args.indexes[1] ? 'Column' : '')) : '' }));
            if (indexes[0] === args.indexes[0]) {
                this.updateCol(sheet, indexes[1], colGrp);
                if (sheet.showHeaders) { cHdrRow.appendChild(this.cellRenderer.renderColHeader(indexes[1])); }
            }
        });
        if (this.parent[isReact]) {
            this.parent[renderReactTemplates]();
        }
        cTBody.parentElement.insertBefore(colGrp.cloneNode(true), cTBody);
        getUpdateUsingRaf((): void => {
            let content: Element = this.parent.getMainContent();
            let sheetContent: HTMLElement = document.getElementById(this.parent.element.id + '_sheet');
            sheetContent.appendChild(frag);
            if (args.top) {
                content.scrollTop = args.top; if (sheet.showHeaders) { this.parent.getRowHeaderContent().scrollTop = args.top; }
            }
            if (args.left) {
                content.scrollLeft = args.left; if (sheet.showHeaders) { this.parent.getColumnHeaderContent().scrollLeft = args.left; }
            }
            this.parent.notify(contentLoaded, null);
            this.parent.notify(editOperation, { action: 'renderEditor' });
            if (!args.initLoad && !this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: false });
            this.parent.trigger(dataBound, {});
            if (this.parent.isEdit) {
                this.parent.notify(initiateEdit, null);
            }
            if (args.initLoad) {
                let triggerEvent: boolean = true;
                if (this.parent.scrollSettings.enableVirtualization) {
                    for (let i: number = 0; i < sheet.ranges.length; i++) {
                        if ((<ExtendedRange>sheet.ranges[i]).info.count - 1 > this.parent.viewport.bottomIndex) {
                            triggerEvent = false; break;
                        }
                    }
                }
                if (triggerEvent) { this.triggerCreatedEvent(); }
            }
        });
    }
    private triggerCreatedEvent(): void {
        if (!this.parent.isOpen) {
            this.parent.hideSpinner();
        }
        if (this.parent.createdHandler) {
            if ((this.parent.createdHandler as { observers: object }).observers) {
                this.parent[created].observers = (this.parent.createdHandler as { observers: object }).observers;
            } else {
                this.parent.setProperties({ created: this.parent.createdHandler }, true);
            }
            this.parent.createdHandler = undefined;
            this.parent.trigger(created, null);
        }
    }

    public refreshColumnContent(args: SheetRenderArgs): void {
        let indexes: number[]; let row: Element; let table: Element; let count: number = 0; let cell: Element;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let frag: DocumentFragment = document.createDocumentFragment(); let hFrag: DocumentFragment = document.createDocumentFragment();
        let tBody: Element = this.parent.element.querySelector('.e-sheet-content tbody');
        tBody = frag.appendChild(tBody.cloneNode(true) as Element);
        let colGrp: Element = this.parent.element.querySelector('.e-sheet-content colgroup');
        colGrp = colGrp.cloneNode() as Element;
        let hRow: Element; let tHead: Element;
        if (sheet.showHeaders) {
            hFrag.appendChild(colGrp);
            tHead = this.parent.element.querySelector('.e-column-header thead');
            tHead = hFrag.appendChild(tHead.cloneNode(true) as Element);
            hRow = tHead.querySelector('tr'); hRow.innerHTML = '';
        }
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[0] === args.indexes[0]) {
                this.updateCol(sheet, indexes[1], colGrp);
                if (sheet.showHeaders) { hRow.appendChild(this.cellRenderer.renderColHeader(indexes[1])); }
            }
            if (indexes[1] === args.indexes[1]) {
                row = tBody.children[count];
                if (row) {
                    row.innerHTML = ''; count++;
                } else {
                    return;
                }
            }
            cell = row.appendChild(this.cellRenderer.render(<CellRenderArgs>{
                colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key, row: row, pRow: row.previousSibling,
                first: !args.skipUpdateOnFirst && indexes[1] === args.indexes[1] ? 'Column' : (this.parent.scrollSettings.
                enableVirtualization && indexes[0] === args.indexes[0] && this.parent.viewport.topIndex !== skipHiddenIdx(sheet, 0, true)
                ? 'Row' : '') }));
            this.checkColMerge(indexes, args.indexes, cell, value);
        });
        frag.insertBefore(colGrp.cloneNode(true), tBody);
        getUpdateUsingRaf((): void => {
            if (sheet.showHeaders) {
                table = this.getColHeaderTable(); removeAllChildren(table);
                table.appendChild(hFrag);
            }
            table = this.getContentTable(); removeAllChildren(table);
            table.appendChild(frag);
            this.parent.notify(virtualContentLoaded, { refresh: 'Column' });
            if (this.parent.isEdit) {
                this.parent.notify(forRefSelRender, {});
            }
            if (this.parent.allowChart) {
                this.parent.notify(chartRangeSelection, null);
            }
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: false });
        });
    }

    public refreshRowContent(args: SheetRenderArgs): void {
        let indexes: number[]; let row: HTMLElement; let hdrRow: HTMLElement; let colGroupWidth: number = this.colGroupWidth;
        let sheet: SheetModel = this.parent.getActiveSheet(); let hFrag: DocumentFragment; let hTBody: Element; let cell: Element;
        let frag: DocumentFragment = document.createDocumentFragment();
        let tBody: Element = this.parent.createElement('tbody');
        if (sheet.showHeaders) {
            hFrag = document.createDocumentFragment();
            hTBody = tBody.cloneNode() as Element; hFrag.appendChild(hTBody);
        }
        frag.appendChild(tBody);
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[1] === args.indexes[1]) {
                if (sheet.showHeaders) {
                    hdrRow = this.rowRenderer.render(indexes[0], true) as HTMLElement;
                    hTBody.appendChild(hdrRow);
                    hdrRow.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                }
                row = this.rowRenderer.render(indexes[0]) as HTMLElement;
                tBody.appendChild(row);
            }
            cell = row.appendChild(this.cellRenderer.render(<CellRenderArgs>{ rowIdx: indexes[0], colIdx: indexes[1], cell: value, address:
                key, lastCell: indexes[1] === args.indexes[3], row: row, hRow: hdrRow, pRow: row.previousSibling, pHRow: sheet.showHeaders ?
                hdrRow.previousSibling : null, isHeightCheckNeeded: true, first: !args.skipUpdateOnFirst && indexes[0] === args.indexes[0] ?
                'Row' : (this.parent.scrollSettings.enableVirtualization && indexes[1] === args.indexes[1] && this.parent.viewport.leftIndex
                !== skipHiddenIdx(sheet, 0, true, 'columns') ? 'Column' : '') }));
            this.checkRowMerge(indexes, args.indexes, cell, value);
        });
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth);
        }
        if (sheet.showHeaders) {
            if (this.contentPanel.querySelector('.e-row-header tbody')) {
                detach(this.contentPanel.querySelector('.e-row-header tbody'));
                this.getRowHeaderTable().appendChild(hFrag);
            }
        }
        if (this.contentPanel.querySelector('.e-sheet-content tbody')) {
            detach(this.contentPanel.querySelector('.e-sheet-content tbody'));
            this.getContentTable().appendChild(frag);
        }
        this.parent.notify(virtualContentLoaded, { refresh: 'Row' });
        if (this.parent.allowChart) {
            this.parent.notify(chartRangeSelection, {});
        }
        if (this.parent.isEdit) {
            this.parent.notify(forRefSelRender, null);
        }
        if (!this.parent.isOpen) {
            this.parent.hideSpinner();
        }
        setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: false });
    }

    public updateCol(sheet: SheetModel, idx: number, appendTo?: Node): Element {
        let col: HTMLElement = this.col.cloneNode() as HTMLElement;
        col.style.width = formatUnit(getColumnWidth(sheet, idx));
        return appendTo ? appendTo.appendChild(col) : col;
    }

    public updateColContent(args: SheetRenderArgs): void {
        getUpdateUsingRaf((): void => {
            let indexes: number[]; let row: Element; let table: Element; let refChild: Element; let cell: Element; let hRow: Element;
            let rowCount: number = 0; let col: HTMLElement; let hRefChild: Element; let sheet: SheetModel = this.parent.getActiveSheet();
            if (sheet.showHeaders) {
                hRow = this.parent.element.querySelector('.e-column-header .e-header-row');
                hRefChild = hRow.firstElementChild;
            }
            let colGrp: Element = this.parent.element.querySelector('.e-sheet-content colgroup');
            let colRefChild: Element = colGrp.firstElementChild; let skipRender: boolean;
            let tBody: HTMLTableSectionElement = this.parent.element.querySelector('.e-sheet-content tbody');
            (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
                if (skipRender) { return; }
                indexes = getRangeIndexes(key);
                if (args.direction ===  'first' && indexes[1] === args.indexes[1]) {
                    this.checkColMerge(
                        [indexes[0], this.parent.viewport.leftIndex], args.indexes,
                        (tBody.rows[rowCount] || { cells: [] }).cells[(args.indexes[3] - args.indexes[1]) + 1],
                        getCell(indexes[0], this.parent.viewport.leftIndex, sheet) || {});
                }
                if (indexes[0] === args.indexes[0]) {
                    if (args.direction === 'last') {
                        col = this.col.cloneNode() as HTMLElement;
                        col.style.width = formatUnit(getColumnWidth(sheet, indexes[1]));
                        colGrp.insertBefore(col, colRefChild);
                        if (sheet.showHeaders) { hRow.insertBefore(this.cellRenderer.renderColHeader(indexes[1]), hRefChild); }
                    } else {
                        this.updateCol(sheet, indexes[1], colGrp);
                        if (sheet.showHeaders) { hRow.appendChild(this.cellRenderer.renderColHeader(indexes[1])); }
                    }
                    if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                        // tslint:disable
                        detach((colGrp as any)[args.direction + 'ElementChild']);
                        if (sheet.showHeaders) { detach((hRow as any)[args.direction + 'ElementChild']); }
                        // tslint:enable
                    }
                }
                if (indexes[1] === args.indexes[1]) {
                    row = tBody.children[rowCount];
                    rowCount++;
                    if (!row) { skipRender = true; return; }
                    refChild = row.firstElementChild;
                }
                cell = this.cellRenderer.render(<CellRenderArgs>{colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key,
                    lastCell: indexes[1] === args.indexes[3], isHeightCheckNeeded: args.direction === 'first',
                    first: args.direction === 'last' && !args.skipUpdateOnFirst && indexes[1] === args.indexes[1] ? 'Column' : '',
                    checkNextBorder: args.direction === 'last' && indexes[3] === args.indexes[3] ? 'Column' : '', });
                if (args.direction === 'last') {
                    this.checkColMerge(indexes, args.indexes, cell, value, (tBody.rows[rowCount - 1] || { cells: [] }).cells[0]);
                    row.insertBefore(cell, refChild);
                } else {
                    row.appendChild(cell);
                }
                if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                    // tslint:disable-next-line:no-any
                    detach((row as any)[args.direction + 'ElementChild']);
                }
            });
            if (sheet.showHeaders) {
                table = this.getColHeaderTable();
                detach(table.querySelector('colgroup'));
                table.insertBefore(colGrp.cloneNode(true), table.querySelector('thead'));
            }
            if (this.parent.scrollSettings.enableVirtualization) {
                this.parent.notify(virtualContentLoaded, { refresh: 'Column' });
            }
            if (this.parent.allowChart) {
                this.parent.notify(chartRangeSelection, null);
            }
            if (this.parent.isEdit) {
                this.parent.notify(forRefSelRender, {});
            }
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: false });
        });
    }

    public updateRowContent(args: SheetRenderArgs): void {
        let colGroupWidth: number = this.colGroupWidth; let row: HTMLElement; let hRow: HTMLElement; let cell: Element;
        let sheet: SheetModel = this.parent.getActiveSheet(); let cellModel: CellModel; let count: number = 0;
        let tBody: HTMLTableSectionElement = this.parent.getMainContent().querySelector('tbody');
        let rTBody: Element; let rFrag: DocumentFragment; let index: number;
        if (sheet.showHeaders) {
            rFrag = document.createDocumentFragment();
            rTBody = this.parent.getRowHeaderContent().querySelector('tbody');
        }
        let indexes: number[]; let frag: DocumentFragment = document.createDocumentFragment();
        this.parent.showSpinner();
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, cKey: string): void => {
            indexes = getRangeIndexes(cKey);
            if (args.direction ===  'first' && indexes[0] === args.indexes[0]) {
                this.checkRowMerge(
                    [this.parent.viewport.topIndex, indexes[1]], args.indexes,
                    (tBody.rows[(args.indexes[2] - args.indexes[0]) + 1] || { cells: [] }).cells[count],
                    getCell(this.parent.viewport.topIndex, indexes[1], sheet) || {});
            }
            if (indexes[1] === args.indexes[1]) {
                if (sheet.showHeaders) {
                    hRow = this.rowRenderer.render(indexes[0], true) as HTMLElement;
                    rFrag.appendChild(hRow);
                    hRow.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                    if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                        // tslint:disable-next-line:no-any
                        detach((rTBody as any)[args.direction + 'ElementChild']);
                    }
                }
                row = this.rowRenderer.render(indexes[0]) as HTMLElement;
                frag.appendChild(row);
                if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                    // tslint:disable-next-line:no-any
                    detach((tBody as any)[args.direction + 'ElementChild']);
                }
            }
            cell = row.appendChild(this.cellRenderer.render(<CellRenderArgs>{ colIdx: indexes[1], rowIdx: indexes[2], cell: value, address:
                cKey, lastCell: indexes[1] === args.indexes[3], row: row, pHRow: sheet.showHeaders ? hRow.previousSibling : null,
                checkNextBorder: args.direction === 'last' && indexes[2] === args.indexes[2] ? 'Row' : '', pRow: row.previousSibling,
                isHeightCheckNeeded: args.direction === 'first' || args.direction === '', hRow: hRow, first: args.direction === 'last' &&
                !args.skipUpdateOnFirst && indexes[0] === args.indexes[0] ? 'Row' : '' }));
            if (args.direction ===  'last') { this.checkRowMerge(indexes, args.indexes, cell, value, tBody.rows[0].cells[count]); }
            count++;
        });
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth);
        }
        if (args.direction === 'last') {
            if (sheet.showHeaders) { rTBody.insertBefore(rFrag, rTBody.firstElementChild); }
            tBody.insertBefore(frag, tBody.firstElementChild);
        } else {
            if (sheet.showHeaders) { rTBody.appendChild(rFrag); }
            tBody.appendChild(frag);
        }
        if (this.parent.scrollSettings.enableVirtualization) {
            this.parent.notify(virtualContentLoaded, { refresh: 'Row' });
        }
        if (this.parent.isEdit) {
            this.parent.notify(forRefSelRender, null);
        }
        if (this.parent.allowChart) {
            this.parent.notify(chartRangeSelection, {});
        }
        if (!this.parent.isOpen) {
            this.parent.hideSpinner();
        }
        setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: false });
    }

    private checkRowMerge(indexes: number[], range: number[], cell: Element, model: CellModel, firstcell?: Element): void {
        if (this.parent.scrollSettings.enableVirtualization && cell &&
            (!isNullOrUndefined(model.rowSpan) || !isNullOrUndefined(model.colSpan))) {
            if (indexes[0] === this.parent.viewport.topIndex) {
                if (model.rowSpan < 0) {
                    this.parent.notify(checkMerge, <CellRenderArgs>{ td: cell, rowIdx: indexes[0], colIdx: indexes[1], isRow: true });
                    if (this.parent.viewport.topIndex >= range[0]) {
                        this.refreshPrevMerge(range[0] + 1, indexes[1]);
                    }
                }
                if (firstcell && ((firstcell as HTMLTableCellElement).colSpan || (firstcell as HTMLTableCellElement).rowSpan)) {
                    this.cellRenderer.refresh(indexes[0] + (range[2] - range[0]) + 1, indexes[1], null, firstcell);
                }
            } else if (model.rowSpan > 1) {
                let prevTopIdx: number = range[2] + 1;
                if (indexes[0] + model.rowSpan - 1 > prevTopIdx && indexes[0] < prevTopIdx) {
                    this.refreshPrevMerge(prevTopIdx, indexes[1], this.parent.viewport.topIndex);
                }
            }
        }
    }

    private refreshPrevMerge(prevTopIdx: number, colIndex: number, currTopIdx?: number): void {
        let td: HTMLTableCellElement
            = this.parent.getCell(prevTopIdx, colIndex, this.parent.getRow(currTopIdx ? currTopIdx : 0)) as HTMLTableCellElement;
        if (td && td.rowSpan > 1) {
            this.cellRenderer.refresh(prevTopIdx, colIndex, null, td);
        }
    }

    private checkColMerge(indexes: number[], range: number[], cell: Element, model: CellModel, firstcell?: Element): void {
        if (this.parent.scrollSettings.enableVirtualization && cell && indexes[1] === this.parent.viewport.leftIndex &&
            (!isNullOrUndefined(model.rowSpan) || !isNullOrUndefined(model.colSpan))) {
            if (model.colSpan < 0) {
                this.parent.notify(checkMerge, <CellRenderArgs>{ td: cell, colIdx: indexes[1], rowIdx: indexes[0] });
            }
            if (firstcell && ((firstcell as HTMLTableCellElement).colSpan || (firstcell as HTMLTableCellElement).rowSpan)) {
                this.cellRenderer.refresh(indexes[0], indexes[1] + (range[3] - range[1]) + 1, null, firstcell);
            }
        }
    }

    /**
     * Used to toggle row and column headers.
     */
    public showHideHeaders(): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.showHeaders) {
            if (this.parent.scrollSettings.enableVirtualization) {
                let indexes: number[] = [this.parent.viewport.topIndex, this.parent.viewport.leftIndex,
                this.parent.viewport.bottomIndex, this.parent.viewport.rightIndex];
                this.renderHeaders([indexes[0], indexes[2]], [indexes[1], indexes[3]]);
            } else {
                this.renderHeaders([0, sheet.rowCount - 1], [0, sheet.colCount - 1]);
                if (sheet.topLeftCell !== 'A1') { this.parent.goTo(sheet.topLeftCell); }
            }
        } else {
            getUpdateUsingRaf((): void => {
                detach(this.headerPanel); detach(this.getRowHeaderPanel());
                (this.getContentPanel() as HTMLElement).style.width = '';
                this.updateHideHeaders();
            });
        }
    }

    private renderHeaders(rowIndexes: number[], colIndexes: number[]): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        this.initHeaderPanel();
        let cFrag: DocumentFragment = document.createDocumentFragment(); let rFrag: DocumentFragment = document.createDocumentFragment();
        cFrag.appendChild(this.headerPanel);
        let rowHdrEle: HTMLElement = rFrag.appendChild(
            this.parent.createElement('div', { className: 'e-row-header', id: `${this.parent.element.id}_row_header` })) as HTMLElement;
        this.createHeaderTable(rowHdrEle);
        this.parent.notify(beforeHeaderLoaded, { element: rowHdrEle });
        this.refreshSelectALLContent();
        let rTBody: Element = rowHdrEle.querySelector('tbody');
        let cTHead: Element = this.headerPanel.querySelector('.e-column-header thead');
        let cRow: Element = this.rowRenderer.render(); cTHead.appendChild(cRow); let row: Element;
        for (let i: number = colIndexes[0]; i <= colIndexes[1]; i++) {
            if (!isHiddenCol(sheet, i)) {
                cRow.appendChild(this.cellRenderer.renderColHeader(i));
            }
        }
        let colGroupWidth: number = getColGroupWidth(rowIndexes[1]);
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth, rowHdrEle);
        }
        for (let i: number = rowIndexes[0]; i <= rowIndexes[1]; i++) {
            if (!isHiddenRow(sheet, i)) {
                row = this.rowRenderer.render(i, true);
                row.appendChild(this.cellRenderer.renderRowHeader(i));
                rTBody.appendChild(row);
            }
        }
        getUpdateUsingRaf((): void => {
            this.getColHeaderTable().insertBefore(this.getContentTable().querySelector('colgroup').cloneNode(true), cTHead);
            let sheet: HTMLElement = document.getElementById(this.parent.element.id + '_sheet');
            sheet.classList.remove('e-hide-headers');
            sheet.insertBefore(cFrag, this.contentPanel);
            let content: Element = this.getContentPanel();
            this.contentPanel.insertBefore(rFrag, content);
            this.parent.scrollModule.setPadding();
            rowHdrEle.scrollTop = content.scrollTop; this.getColHeaderPanel().scrollLeft = content.scrollLeft;
        });
    }

    private updateHideHeaders(): void {
        document.getElementById(this.parent.element.id + '_sheet').classList.add('e-hide-headers'); this.headerPanel = null;
    }

    /**
     * Get the select all table element of spreadsheet 
     * @return {HTMLElement} 
     */
    private getSelectAllContent(): HTMLElement {
        return this.headerPanel.getElementsByClassName('e-selectall-container')[0] as HTMLElement;
    }

    /**
     * Get the select all table element of spreadsheet 
     * @return {Element} 
     */
    private getSelectAllTable(): Element {
        return this.headerPanel.getElementsByClassName('e-selectall-table')[0];
    }

    /**
     * Get the column header element of spreadsheet 
     * @return {HTMLTableElement} 
     */
    public getColHeaderTable(): HTMLTableElement {
        return this.headerPanel.getElementsByClassName('e-colhdr-table')[0] as HTMLTableElement;
    }

    /**
     * Get the row header table element of spreadsheet 
     * @return {HTMLTableElement} 
     */
    public getRowHeaderTable(): HTMLTableElement {
        return this.contentPanel.getElementsByClassName('e-rowhdr-table')[0] as HTMLTableElement;
    }

    /**
     * Get the main content table element of spreadsheet 
     * @return {Element} 
     */
    public getContentTable(): HTMLTableElement {
        return this.contentPanel.getElementsByClassName('e-content-table')[0] as HTMLTableElement;
    }

    /**
     * Get the row header div element of spreadsheet 
     * @return {Element} 
     */
    public getRowHeaderPanel(): Element {
        return this.contentPanel.getElementsByClassName('e-row-header')[0] as Element;
    }

    /**
     * Get the column header div element of spreadsheet 
     * @return {Element} 
     */
    public getColHeaderPanel(): Element {
        return this.headerPanel.getElementsByClassName('e-column-header')[0] as Element;
    }

    /**
     * Get the main content div element of spreadsheet 
     * @return {Element} 
     */
    public getContentPanel(): Element {
        return this.contentPanel.getElementsByClassName('e-sheet-content')[0] as Element;
    }

    private addEventListener(): void {
        this.parent.on(created, this.triggerCreatedEvent, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }
    private destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        this.parent.off(created, this.triggerCreatedEvent);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    }
}