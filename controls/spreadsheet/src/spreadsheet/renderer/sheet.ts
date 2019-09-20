import { formatUnit, detach } from '@syncfusion/ej2-base';
import { Spreadsheet } from '../base/index';
import { getRangeIndexes } from './../../workbook/common/address';
import { getColumnWidth } from '../../workbook/base/column';
import { contentLoaded, editOperation, getUpdateUsingRaf, IRowRenderer, removeAllChildren } from '../common/index';
import { IRenderer, beforeContentLoaded, getColGroupWidth, virtualContentLoaded, setAriaOptions, dataBound } from '../common/index';
import { CellRenderArgs, beforeHeaderLoaded, ICellRenderer } from '../common/index';
import { CellModel, SheetModel } from '../../workbook/index';

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
    }

    private refreshSelectALLContent(): void {
        let cell: Element;
        if (this.freezePane) {
            let tHead: Element = this.getSelectAllTable().querySelector('thead');
            let row: Element = this.rowRenderer.render(true);
            tHead.appendChild(row);
            cell = this.parent.createElement('th', { className: 'e-select-all-cell' });
            row.appendChild(cell);
        } else {
            cell = this.headerPanel.firstElementChild; cell.classList.add('e-select-all-cell');
        }
        cell.appendChild(this.parent.createElement('button', { className: 'e-selectall e-icons',
            id: `${this.parent.element.id}_select_all` }));
    }

    private updateLeftColGroup(width?: number, table?: Element): void {
        if (width) { this.colGroupWidth = width; }
        if (!table) { table = this.getRowHeaderTable(); }
        this.detachColGroup(table);
        let colGrp: Element = this.parent.createElement('colgroup');
        let colGrpWidth: string = `${this.colGroupWidth}px`;
        let col: HTMLElement = this.col.cloneNode() as HTMLElement; col.style.width = colGrpWidth;
        colGrp.appendChild(col);
        table.insertBefore(colGrp, table.querySelector('tbody'));
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
            this.parent.scrollModule.setPadding();
        } else {
            this.updateHideHeaders();
        }
        let content: HTMLElement = this.contentPanel.appendChild(
            this.parent.createElement('div', { className: 'e-main-content', id: `${id}_main_content` }));
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
        this.updateLeftColGroup(null, rowHdrEle.querySelector('table'));
    }

    private updateTable(tagName: string, name: string, appendTo: Element): void {
        let table: HTMLElement = this.parent.createElement('table', { className: 'e-table', attrs: { 'role': 'grid' } });
        table.classList.add(`e-${name}-table`);
        appendTo.appendChild(table);
        table.appendChild(this.parent.createElement(tagName));
    }

    /**
     * It is used to refresh the select all, row header, column header and content table contents.
     */
    public renderTable(cells: Map<string, CellModel>, rowIdx: number, colIdx: number, lastIdx: number, top?: number, left?: number): void {
        let indexes: number[]; let row: Element; let sheet: SheetModel = this.parent.getActiveSheet();
        let frag: DocumentFragment = document.createDocumentFragment();
        this.createTable();
        let colGrp: Element = this.parent.createElement('colgroup');
        let cTBody: Element = this.contentPanel.querySelector('.e-main-content tbody');
        let rHdrTBody: Element; let cHdrTHead: Element; let cHdrRow: Element;
        if (sheet.showHeaders) {
            frag.appendChild(this.headerPanel);
            this.refreshSelectALLContent();
            rHdrTBody = this.contentPanel.querySelector('.e-row-header tbody');
            cHdrTHead = this.headerPanel.querySelector('.e-column-header thead');
            this.getColHeaderTable().insertBefore(colGrp, cHdrTHead);
            cHdrRow = this.rowRenderer.render(true); cHdrTHead.appendChild(cHdrRow);
        }
        frag.appendChild(this.contentPanel);
        this.parent.notify(beforeContentLoaded, { startColIdx: colIdx });
        (cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[0] === rowIdx) {
                this.updateCol(indexes[1], colGrp, sheet);
                if (sheet.showHeaders) {
                    cHdrRow.appendChild(this.cellRenderer.renderColHeader(indexes[1]));
                }
            }
            if (indexes[1] === colIdx) {
                if (sheet.showHeaders) {
                    row = this.rowRenderer.render(false, indexes[0]);
                    rHdrTBody.appendChild(row);
                    row.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                }
                row = this.rowRenderer.render(false, indexes[0]);
                cTBody.appendChild(row);
            }
            row.appendChild(this.cellRenderer.render(<CellRenderArgs>{colIdx: indexes[1], rowIdx: indexes[0], cell: value,
                address: key, lastCell: indexes[1] === lastIdx, isHeightCheckNeeded: true }));
        });
        this.getContentTable().insertBefore(colGrp.cloneNode(true), cTBody);
        getUpdateUsingRaf((): void => {
            let content: Element = this.parent.getMainContent();
            document.getElementById(this.parent.element.id + '_sheet').appendChild(frag);
            if (top) {
                content.scrollTop = top; if (sheet.showHeaders) { this.parent.getRowHeaderContent().scrollTop = top; }
            }
            if (left) {
                content.scrollLeft = left; if (sheet.showHeaders) { this.parent.getColumnHeaderContent().scrollLeft = left; }
            }
            this.parent.notify(contentLoaded, null);
            this.parent.notify(editOperation, { action: 'renderEditor' });
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: false });
            this.parent.trigger(dataBound, {});
        });
    }

    public refreshColumnContent(cells: Map<string, CellModel>, rowIndex: number, colIndex: number, lastIdx: number): void {
        let indexes: number[]; let row: Element; let table: Element; let count: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let frag: DocumentFragment = document.createDocumentFragment(); let hFrag: DocumentFragment = document.createDocumentFragment();
        let tBody: Element = this.parent.element.querySelector('.e-main-content tbody');
        tBody = frag.appendChild(tBody.cloneNode(true) as Element);
        let colGrp: Element = this.parent.element.querySelector('.e-main-content colgroup');
        colGrp = colGrp.cloneNode() as Element;
        let hRow: Element; let tHead: Element;
        if (sheet.showHeaders) {
            hFrag.appendChild(colGrp);
            tHead = this.parent.element.querySelector('.e-column-header thead');
            tHead = hFrag.appendChild(tHead.cloneNode(true) as Element);
            hRow = tHead.querySelector('tr'); hRow.innerHTML = '';
        }
        (cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[0] === rowIndex) {
                this.updateCol(indexes[1], colGrp, sheet);
                if (sheet.showHeaders) { hRow.appendChild(this.cellRenderer.renderColHeader(indexes[1])); }
            }
            if (indexes[1] === colIndex) {
                row = tBody.children[count];
                if (row) {
                    count++;
                    row.innerHTML = '';
                } else {
                    return;
                }
            }
            row.appendChild(this.cellRenderer.render(<CellRenderArgs>{
                colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key }));
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
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: false });
        });
    }

    public refreshRowContent(cells: Map<string, CellModel>, startIndex: number, lastIdx: number): void {
        let indexes: number[]; let row: HTMLElement; let hRow: HTMLElement; let colGroupWidth: number = this.colGroupWidth;
        let sheet: SheetModel = this.parent.getActiveSheet(); let hFrag: DocumentFragment; let hTBody: Element;
        let frag: DocumentFragment = document.createDocumentFragment();
        let tBody: Element = this.parent.createElement('tbody');
        if (sheet.showHeaders) {
            hFrag = document.createDocumentFragment();
            hTBody = tBody.cloneNode() as Element; hFrag.appendChild(hTBody);
        }
        frag.appendChild(tBody);
        (cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[1] === startIndex) {
                if (sheet.showHeaders) {
                    hRow = this.rowRenderer.render(false, indexes[0]) as HTMLElement;
                    hTBody.appendChild(hRow);
                    hRow.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                }
                row = this.rowRenderer.render(false, indexes[0]) as HTMLElement;
                tBody.appendChild(row);
            }
            row.appendChild(this.cellRenderer.render(<CellRenderArgs>{ rowIdx: indexes[0], colIdx: indexes[1], cell: value, address: key,
                lastCell: indexes[1] === lastIdx, row: row, hRow: hRow, isHeightCheckNeeded: true }));
        });
        getUpdateUsingRaf((): void => {
            if (this.parent.isDestroyed) { return; }
            if (this.colGroupWidth !== colGroupWidth) {
                this.updateLeftColGroup(colGroupWidth);
            }
            if (sheet.showHeaders) {
                detach(this.contentPanel.querySelector('.e-row-header tbody'));
                this.getRowHeaderTable().appendChild(hFrag);
            }
            detach(this.contentPanel.querySelector('.e-main-content tbody'));
            this.getContentTable().appendChild(frag);
            this.parent.notify(virtualContentLoaded, { refresh: 'Row' });
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: false });
        });
    }

    private updateCol(idx: number, appendTo: Element, sheet: SheetModel): void {
        let col: HTMLElement = this.col.cloneNode() as HTMLElement;
        col.style.width = formatUnit(getColumnWidth(sheet, idx));
        appendTo.appendChild(col);
    }

    public updateColContent(cells: Map<string, CellModel>, rowIdx: number, colIdx: number, lastIdx: number, direction: string): void {
        getUpdateUsingRaf((): void => {
            let indexes: number[]; let row: Element; let table: Element; let refChild: Element; let cell: Element; let hRow: Element;
            let rowCount: number = 0; let col: HTMLElement; let hRefChild: Element; let sheet: SheetModel = this.parent.getActiveSheet();
            if (sheet.showHeaders) {
                hRow = this.parent.element.querySelector('.e-column-header .e-header-row');
                hRefChild = hRow.firstElementChild;
            }
            let colGrp: Element = this.parent.element.querySelector('.e-main-content colgroup');
            let colRefChild: Element = colGrp.firstElementChild;
            let tBody: Element = this.parent.element.querySelector('.e-main-content tbody');
            (cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
                indexes = getRangeIndexes(key);
                if (indexes[0] === rowIdx) {
                    if (direction === 'first') {
                        this.updateCol(indexes[1], colGrp, sheet);
                        if (sheet.showHeaders) { hRow.appendChild(this.cellRenderer.renderColHeader(indexes[1])); }
                    } else {
                        col = this.col.cloneNode() as HTMLElement;
                        col.style.width = formatUnit(getColumnWidth(sheet, indexes[1]));
                        colGrp.insertBefore(col, colRefChild);
                        if (sheet.showHeaders) { hRow.insertBefore(this.cellRenderer.renderColHeader(indexes[1]), hRefChild); }
                    }
                    if (this.parent.scrollSettings.enableVirtualization) {
                        // tslint:disable
                        detach((colGrp as any)[direction + 'ElementChild']);
                        if (sheet.showHeaders) { detach((hRow as any)[direction + 'ElementChild']); }
                        // tslint:enable
                    }
                }
                if (indexes[1] === colIdx) {
                    row = tBody.children[rowCount];
                    rowCount++;
                    refChild = row.firstElementChild;
                }
                cell = this.cellRenderer.render(<CellRenderArgs>{colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key,
                    lastCell: indexes[1] === lastIdx, isHeightCheckNeeded: direction === 'first' });
                if (direction === 'first') {
                    row.appendChild(cell);
                } else {
                    row.insertBefore(cell, refChild);
                }
                if (this.parent.scrollSettings.enableVirtualization) {
                    // tslint:disable-next-line:no-any
                    detach((row as any)[direction + 'ElementChild']);
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
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: false });
        });
    }

    public updateRowContent(cells: Map<string, CellModel>, startIndex: number, lastIdx: number, direction: string): void {
        let colGroupWidth: number = this.colGroupWidth; let row: HTMLElement; let hRow: HTMLElement;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let tBody: Element = this.parent.getMainContent().querySelector('tbody'); let rTBody: Element; let rFrag: DocumentFragment;
        if (sheet.showHeaders) {
            rFrag = document.createDocumentFragment();
            rTBody = this.parent.getRowHeaderContent().querySelector('tbody');
        }
        let indexes: number[]; let frag: DocumentFragment = document.createDocumentFragment();
        this.parent.showSpinner();
        (cells as Map<string, CellModel>).forEach((value: CellModel, cKey: string): void => {
            indexes = getRangeIndexes(cKey);
            if (indexes[1] === startIndex) {
                if (sheet.showHeaders) {
                    hRow = this.rowRenderer.render(false, indexes[0]) as HTMLElement;
                    rFrag.appendChild(hRow);
                    hRow.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                    if (this.parent.scrollSettings.enableVirtualization) {
                        // tslint:disable-next-line:no-any
                        detach((rTBody as any)[direction + 'ElementChild']);
                    }
                }
                row = this.rowRenderer.render(false, indexes[0]) as HTMLElement;
                frag.appendChild(row);
                if (this.parent.scrollSettings.enableVirtualization) {
                    // tslint:disable-next-line:no-any
                    detach((tBody as any)[direction + 'ElementChild']);
                }
            }
            row.appendChild(this.cellRenderer.render(<CellRenderArgs>{ colIdx: indexes[1], rowIdx: indexes[0], cell: value,
                address: cKey, lastCell: indexes[1] === lastIdx, row: row, hRow: hRow, isHeightCheckNeeded: direction === 'first' }));
        });
        getUpdateUsingRaf((): void => {
            if (this.colGroupWidth !== colGroupWidth) {
                this.updateLeftColGroup(colGroupWidth);
            }
            if (direction === 'first') {
                if (sheet.showHeaders) { rTBody.appendChild(rFrag); }
                tBody.appendChild(frag);
            } else {
                if (sheet.showHeaders) { rTBody.insertBefore(rFrag, rTBody.firstElementChild); }
                tBody.insertBefore(frag, tBody.firstElementChild);
            }
            if (this.parent.scrollSettings.enableVirtualization) {
                this.parent.notify(virtualContentLoaded, { refresh: 'Row' });
            }
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: false });
        });
    }

    /**
     * Used to toggle row and column headers.
     */
    public showHideHeaders(): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.showHeaders) {
            if (this.parent.scrollSettings.enableVirtualization) {
                let startIndex: number[] = [this.parent.viewport.topIndex, this.parent.viewport.leftIndex];
                this.renderHeaders(
                    [ startIndex[0], startIndex[0] + this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2) ],
                    [ startIndex[1], startIndex[1] + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2) ]);
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
        let cRow: Element = this.rowRenderer.render(true); cTHead.appendChild(cRow); let row: Element;
        for (let i: number = colIndexes[0]; i <= colIndexes[1]; i++) {
            cRow.appendChild(this.cellRenderer.renderColHeader(i));
        }
        let colGroupWidth: number = getColGroupWidth(rowIndexes[1]);
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth);
        }
        for (let i: number = rowIndexes[0]; i <= rowIndexes[1]; i++) {
            row = this.rowRenderer.render(false, i);
            row.appendChild(this.cellRenderer.renderRowHeader(i));
            rTBody.appendChild(row);
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
        return this.contentPanel.getElementsByClassName('e-main-content')[0] as Element;
    }
}