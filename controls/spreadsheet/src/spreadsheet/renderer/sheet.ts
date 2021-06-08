import { formatUnit, detach, attributes, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { Spreadsheet } from '../base/index';
import { getCellIndexes, getRangeIndexes } from './../../workbook/common/address';
import { getColumnsWidth, getColumnWidth } from '../../workbook/base/column';
import { contentLoaded, editOperation, getUpdateUsingRaf, IRowRenderer, removeAllChildren, SheetRenderArgs } from '../common/index';
import { IRenderer, beforeContentLoaded, getColGroupWidth, virtualContentLoaded, setAriaOptions, dataBound } from '../common/index';
import { CellRenderArgs, ICellRenderer, created, spreadsheetDestroyed, skipHiddenIdx, isReact, getDPRValue } from '../common/index';
import { checkMerge, forRefSelRender, initiateEdit, chartRangeSelection, renderReactTemplates, rowHeightChanged } from '../common/index';
import { colWidthChanged, clearUndoRedoCollection } from '../common/index';
import { CellModel, SheetModel, ExtendedRange, getCell, getRowsHeight } from '../../workbook/index';

/**
 * Sheet module is used to render Sheet
 *
 * @hidden
 */
export class SheetRender implements IRenderer {
    private parent: Spreadsheet;
    private headerPanel: HTMLElement;
    public contentPanel: HTMLElement;
    private col: HTMLTableColElement;
    private rowRenderer: IRowRenderer;
    private cellRenderer: ICellRenderer;
    public colGroupWidth: number = 30; //Row header and selectall table colgroup width

    constructor(parent?: Spreadsheet) {
        this.parent = parent;
        this.col = parent.createElement('col') as HTMLTableColElement;
        this.rowRenderer = parent.serviceLocator.getService<IRowRenderer>('row');
        this.cellRenderer = parent.serviceLocator.getService<ICellRenderer>('cell');
        this.addEventListener();
    }

    private refreshSelectALLContent(): void {
        let cell: Element; const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.frozenColumns || sheet.frozenRows) {
            const tHead: Element = this.getSelectAllTable().querySelector('thead');
            const row: Element = this.rowRenderer.render();
            tHead.appendChild(row);
            cell = this.parent.createElement('th', { className: 'e-select-all-cell' });
            row.appendChild(cell);
        } else {
            cell = this.headerPanel.firstElementChild; cell.classList.add('e-select-all-cell');
        }
        cell.appendChild(this.parent.createElement('button', { className: 'e-selectall e-icons',
            id: `${this.parent.element.id}_select_all` }));
    }

    private updateLeftColGroup(width?: number, rowHdr?: HTMLElement): void {
        if (width) { this.colGroupWidth = width; }
        if (!rowHdr) { rowHdr = this.getRowHeaderPanel(); }
        let table: Element = rowHdr.querySelector('table'); const sheet: SheetModel = this.parent.getActiveSheet();
        let colGrp: Element;
        if (width) {
            (table.querySelector('colgroup').firstElementChild as HTMLElement).style.width = `${this.colGroupWidth}px`;
        } else {
            colGrp = this.parent.createElement('colgroup');
            const col: HTMLElement = this.col.cloneNode() as HTMLElement; col.style.width = `${this.colGroupWidth}px`;
            colGrp.appendChild(col);
            table.insertBefore(colGrp, table.querySelector('tbody'));
        }
        if (sheet.frozenRows || sheet.frozenColumns) {
            table = this.getSelectAllTable();
            if (width) {
                (table.querySelector('colgroup').firstElementChild as HTMLElement).style.width = `${this.colGroupWidth}px`;
            } else {
                table.insertBefore(colGrp.cloneNode(true), table.querySelector('thead'));
            }
        }
        this.setPanelWidth(sheet, rowHdr); this.setPanelHeight(sheet);
    }

    public setPanelWidth(sheet: SheetModel, rowHdr: HTMLElement): void {
        const scrollSize: number = this.getScrollSize(true);
        const width: number = this.getRowHeaderWidth(sheet); const offset: string = this.parent.enableRtl ? 'right' : 'left';
        if (sheet.frozenColumns) {
            const frozenCol: HTMLElement = document.getElementById(this.parent.element.id + '_sheet').getElementsByClassName(
                'e-frozen-column')[0] as HTMLElement;
            frozenCol.style.height = `calc(100% - ${scrollSize}px)`;
            frozenCol.style[offset] = width - getDPRValue(1) + 'Px'; frozenCol.style.display = '';
        }
        this.setHeaderPanelWidth(this.getSelectAllContent(), width);
        this.getColHeaderPanel().style.width = `calc(100% - ${width}px)`;
        this.getColHeaderPanel().style[offset] = width + 'px';
        this.setHeaderPanelWidth(rowHdr, width);
        this.getContentPanel().style.width = `calc(100% - ${width}px)`;
        this.getContentPanel().style[offset] = width + 'px';
        let scroll: HTMLElement =
            (this.contentPanel.nextElementSibling ? this.contentPanel.nextElementSibling : null) as HTMLElement;
        if (scroll) {
            if (scrollSize) {
                scroll.style.height = scrollSize + 1 + 'px';
            } else {
                scroll.style.height = '1px';
                scroll.style.borderTopWidth = '0px';
            }
            scroll = scroll.firstElementChild as HTMLElement;
            scroll.style[offset] = width + 'px'; scroll.style.width = `calc(100% - ${width}px)`;
            if (Browser.userAgent.indexOf('Mac OS') > -1 && Browser.info.name === 'safari') {
                scroll.style.height = '7px'; scroll.style.top = '-7px';
            }
        }
    }

    private getScrollSize(addOffset?: boolean): number {
        const prop: string = this.parent.enableRtl ? 'margin-left' : 'margin-right';
        return parseInt(this.headerPanel.style[prop], 10) ? parseInt(this.headerPanel.style[prop], 10) + (addOffset ? 1 : 0) : 0;
    }

    private setHeaderPanelWidth(content: HTMLElement, width: number): void {
        const emptyCol: HTMLElement[] = [].slice.call(content.querySelectorAll('col.e-empty'));
        emptyCol.forEach((col: HTMLElement): void => {
            width += parseInt(col.style.width, 10);
        });
        content.style.width = width + 'px';
    }

    private setPanelHeight(sheet: SheetModel): void {
        const scrollSize: number = this.getScrollSize(true);
        if (sheet.frozenRows) {
            const frozenHeight: number = this.getColHeaderHeight(sheet);
            if (!sheet.showHeaders && !sheet.frozenColumns) {
                this.headerPanel.style.height = frozenHeight + 'px';
            } else {
                this.headerPanel.style.height = '';
            }
            (this.contentPanel as HTMLElement).style.height = `calc(100% - ${frozenHeight + scrollSize}px)`;
            const frozenRow: HTMLElement = document.getElementById(this.parent.element.id + '_sheet').getElementsByClassName(
                'e-frozen-row')[0] as HTMLElement;
            frozenRow.style.width = Browser.isDevice ? '100%' :
                `calc(100% - ${scrollSize}px)`;
            frozenRow.style.top = frozenHeight - 1 - (sheet.showHeaders ? 1 : 0) + 'px'; frozenRow.style.display = '';
        } else {
            (this.contentPanel as HTMLElement).style.height = `calc(100% - ${(sheet.showHeaders ? getDPRValue(31) : 0) + scrollSize}px)`;
        }
    }

    public renderPanel(): void {
        this.contentPanel = this.parent.createElement('div', { className: 'e-main-panel' });
        const sheet: SheetModel = this.parent.getActiveSheet();
        const id: string = this.parent.element.id;
        this.contentPanel.appendChild(this.parent.createElement('div', { className: 'e-row-header', id: `${id}_row_header` }));
        this.initHeaderPanel();
        if (this.parent.allowScrolling) {this.parent.scrollModule.setPadding(); }
        const sheetEle: HTMLElement = document.getElementById(this.parent.element.id + '_sheet');
        if (sheet.frozenColumns) { sheetEle.classList.add('e-frozen-columns'); }
        if (sheet.frozenRows) { sheetEle.classList.add('e-frozen-rows'); }
        this.updateHideHeaders(sheet, sheetEle);
        if (!sheet.showGridLines) { sheetEle.classList.add('e-hide-gridlines'); }
        const content: HTMLElement = this.contentPanel.appendChild(
            this.parent.createElement('div', { className: 'e-sheet-content', id: `${id}_main_content` }));
        if (!this.parent.allowScrolling) { content.style.overflow = 'hidden'; }
        if (sheet.frozenRows) {
            sheetEle.appendChild(this.parent.createElement('div', { className: 'e-frozen-row', styles: 'display: none' }));
        }
        if (sheet.frozenColumns) {
            sheetEle.appendChild(this.parent.createElement('div', { className: 'e-frozen-column', styles: 'display: none' }));
        }
        if (Browser.userAgent.indexOf('Mac OS') > -1 && Browser.info.name === 'safari') { sheetEle.classList.add('e-mac-safari'); }

    }

    private initHeaderPanel(): void {
        const id: string = this.parent.element.id;
        this.headerPanel = this.parent.createElement('div', { className: 'e-header-panel' });
        this.headerPanel.appendChild(this.parent.createElement('div', { className: 'e-selectall-container', id: `${id}_selectall` }));
        this.headerPanel.appendChild(this.parent.createElement('div', { className: 'e-column-header', id: `${id}_col_header` }));
    }

    private createHeaderTable(): void {
        const rowHdrEle: HTMLElement = this.contentPanel.querySelector('.e-row-header');
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.frozenRows || sheet.frozenColumns) {
            this.updateTable(
                sheet.frozenRows ? ['thead', 'tbody'] : ['thead'], 'selectall', this.headerPanel.querySelector('.e-selectall-container'));
        }
        this.updateTable(sheet.frozenRows ? ['thead', 'tbody'] : ['thead'], 'colhdr', this.headerPanel.querySelector('.e-column-header'));
        this.updateTable(['tbody'], 'rowhdr', rowHdrEle);
        this.updateLeftColGroup(null, rowHdrEle);
    }

    private updateTable(tagName: string[], name: string, appendTo: Element): void {
        const table: HTMLElement = this.parent.createElement('table', { className: 'e-table', attrs: { 'role': 'grid' } });
        table.classList.add(`e-${name}-table`);
        appendTo.appendChild(table);
        tagName.forEach((tag: string): void => { table.appendChild(this.parent.createElement(tag)); });
    }

    /**
     * It is used to refresh the select all, row header, column header and content of the spreadsheet.
     *
     * @param {SheetRenderArgs} args - Specifies the cells, indexes, direction, skipUpdateOnFirst, top, left, initload properties.
     * @returns {void}
     */
    public renderTable(args: SheetRenderArgs): void {
        let indexes: number[]; let row: Element; let hRow: Element; const sheet: SheetModel = this.parent.getActiveSheet();
        const frag: DocumentFragment = document.createDocumentFragment();
        frag.appendChild(this.headerPanel); frag.appendChild(this.contentPanel);
        if (this.parent.allowScrolling) {
            const scrollPanel: HTMLElement = this.parent.createElement('div', { className: 'e-scrollbar' });
            scrollPanel.appendChild(this.parent.createElement('div', { className: 'e-scroller' }));
            frag.appendChild(scrollPanel);
        }
        this.createHeaderTable();
        this.updateTable(['tbody'], 'content', this.contentPanel.lastElementChild);
        const colGrp: Element = this.parent.createElement('colgroup'); let col: Element;
        const cTBody: Element = this.contentPanel.querySelector('.e-sheet-content tbody');
        this.refreshSelectALLContent();
        const selectAllColGrp: Element = this.getSelectAllContent().querySelector('colgroup');
        const rowHdrColGrp: Element = this.getRowHeaderPanel().querySelector('colgroup');
        const selectAllHdrRow: Element = this.getSelectAllContent().querySelector('thead .e-header-row');
        const rHdrTBody: Element = this.contentPanel.querySelector('.e-row-header tbody');
        const selectAllTBody: Element = this.getSelectAllContent().querySelector('tbody');
        const cHdrTHead: Element = this.headerPanel.querySelector('.e-column-header thead');
        const cHdrTBody: Element = this.headerPanel.querySelector('.e-column-header tbody');
        const cHdrRow: Element = this.rowRenderer.render(); cHdrTHead.appendChild(cHdrRow);
        this.getColHeaderTable().insertBefore(colGrp, cHdrTHead);
        const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
        this.parent.notify(beforeContentLoaded, { top: args.top, left: args.left });
        const colCount: string = sheet.colCount.toString(); const rowCount: string = sheet.colCount.toString();
        const layout: string = args.top && args.left ? 'RowColumn' : (args.top ? 'Row' : (args.left ? 'Column' : ''));
        this.parent.getColHeaderTable().setAttribute('aria-colcount', colCount);
        this.parent.getRowHeaderTable().setAttribute('aria-rowcount', rowCount); let emptyRow: Element;
        attributes(this.parent.getContentTable(), { 'aria-rowcount': rowCount, 'aria-colcount': colCount });
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[1] === args.indexes[1] || !row) {
                hRow = this.rowRenderer.render(indexes[0], true);
                if (frozenCol && frozenRow && indexes[1] < frozenCol && indexes[0] < frozenRow) {
                    emptyRow = selectAllTBody.querySelector('.e-empty');
                    if (emptyRow) {
                        selectAllTBody.insertBefore(hRow, emptyRow);
                    } else {
                        selectAllTBody.appendChild(hRow);
                    }
                    row = hRow;
                } else if (frozenCol && indexes[1] < frozenCol) {
                    rHdrTBody.appendChild(hRow); row = hRow;
                } else {
                    row = this.rowRenderer.render(indexes[0]);
                    if (frozenRow && indexes[0] < frozenRow) {
                        emptyRow = cHdrTBody.querySelector('.e-empty');
                        if (emptyRow) {
                            cHdrTBody.insertBefore(row, emptyRow);
                        } else {
                            cHdrTBody.appendChild(row);
                        }
                    } else {
                        cTBody.appendChild(row);
                    }
                    if (indexes[1] === args.indexes[1]) {
                        if (frozenRow && indexes[0] < frozenRow) {
                            selectAllTBody.appendChild(hRow);
                        } else {
                            rHdrTBody.appendChild(hRow);
                        }
                    }
                }
                if ( indexes[1] === args.indexes[1]) {
                    hRow.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                }
            }
            row.appendChild(this.cellRenderer.render(<CellRenderArgs>{colIdx: indexes[1], rowIdx: indexes[0], cell: value,
                address: key, lastCell: indexes[1] === args.indexes[3], isHeightCheckNeeded: true, row: row, hRow: hRow,
                pRow: row.previousSibling, pHRow: hRow.previousSibling, isRefreshing: args.isRefreshing,
                first: layout ? (layout.includes('Row') ? (indexes[0] === args.indexes[0] ? 'Row' : (layout.includes('Column') ? (
                    indexes[1] === args.indexes[1] ? 'Column' : '') : '')) : (indexes[1] === args.indexes[1] ? 'Column' : '')) : '' }));
            if (frozenCol && indexes[1] === frozenCol - 1) { row = null; }
            if (indexes[0] === args.indexes[0]) {
                if (frozenCol && indexes[1] < frozenCol) {
                    col = this.updateCol(sheet, indexes[1], selectAllColGrp);
                    const empty: Element = rowHdrColGrp.querySelector('.e-empty');
                    empty ? rowHdrColGrp.insertBefore(col.cloneNode(true), empty) : rowHdrColGrp.appendChild(col.cloneNode(true));
                    selectAllHdrRow.appendChild(this.cellRenderer.renderColHeader(indexes[1]));
                } else {
                    this.updateCol(sheet, indexes[1], colGrp);
                    cHdrRow.appendChild(this.cellRenderer.renderColHeader(indexes[1]));
                }
            }
        });
        if (this.parent[isReact]) { this.parent[renderReactTemplates](); }
        cTBody.parentElement.insertBefore(colGrp.cloneNode(true), cTBody);
        getUpdateUsingRaf((): void => {
            const content: HTMLElement = this.parent.getMainContent();
            const sheetContent: HTMLElement = document.getElementById(this.parent.element.id + '_sheet');
            sheetContent.appendChild(frag);
            sheetContent.style.backgroundColor = '';
            if (args.top) {
                content.parentElement.scrollTop = args.top;
            }
            if (args.left) {
                content.scrollLeft = args.left; this.parent.getColumnHeaderContent().scrollLeft = args.left;
                if (this.parent.allowScrolling) { this.parent.getScrollElement().scrollLeft = args.left; }
            }
            this.parent.notify(contentLoaded, args);
            this.checkTableWidth(sheet);
            this.parent.notify(editOperation, { action: 'renderEditor' });
            if (!args.initLoad && !this.parent.isOpen) { this.parent.hideSpinner(); }
            setAriaOptions(content, { busy: false });
            this.parent.trigger(dataBound, {});
            if (this.parent.isEdit) { this.parent.notify(initiateEdit, null); }
            if (args.initLoad) {
                let triggerEvent: boolean = true;
                if (this.parent.scrollSettings.enableVirtualization) {
                    for (let i: number = 0; i < sheet.ranges.length; i++) {
                        if ((<ExtendedRange>sheet.ranges[i]).info.count - 1 > this.parent.viewport.bottomIndex) {
                            triggerEvent = false; break;
                        }
                    }
                }
                if (triggerEvent) {
                    /* eslint-disable */
                    if ((this.parent as any).isReact) {
                        setTimeout(() => this.triggerCreatedEvent());
                    /* eslint-enable */
                    } else {
                        this.triggerCreatedEvent();
                    }
                }
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
            this.parent.notify(clearUndoRedoCollection, null);
        }
    }
    private checkTableWidth(sheet: SheetModel): void {
        if (this.parent.scrollSettings.isFinite && !this.parent.scrollSettings.enableVirtualization && sheet.colCount - 1 ===
            this.parent.viewport.rightIndex) {
            const cellsWidth: number = getColumnsWidth(
                sheet, this.parent.viewport.leftIndex + this.parent.frozenColCount(sheet), this.parent.viewport.rightIndex);
            const rowHdrWidth: number = this.getRowHeaderWidth(sheet);
            const scrollSize: number = this.getScrollSize();
            if (cellsWidth < this.contentPanel.getBoundingClientRect().width - rowHdrWidth - scrollSize) {
                this.getContentPanel().style.width = cellsWidth + 'px'; this.getColHeaderPanel().style.width = cellsWidth + 'px';
            } else if (!this.getContentPanel().style.width.includes('calc')) {
                this.getContentPanel().style.width = `calc(100% - ${rowHdrWidth}px)`;
                this.getColHeaderPanel().style.width = `calc(100% - ${rowHdrWidth}px)`;
            }
        }
    }

    public refreshColumnContent(args: SheetRenderArgs): void {
        let indexes: number[]; let row: Element; let table: Element; let count: number = 0; let cell: Element; let col: Element;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const frag: DocumentFragment = document.createDocumentFragment(); const hFrag: DocumentFragment = document.createDocumentFragment();
        let tBody: Element = this.parent.element.querySelector('.e-sheet-content tbody');
        let hTBody: Element = this.parent.element.querySelector('.e-column-header tbody');
        let colGrp: Element = this.parent.element.querySelector('.e-sheet-content colgroup');
        colGrp = colGrp.cloneNode() as Element; frag.appendChild(colGrp);
        tBody = frag.appendChild(tBody.cloneNode(true) as Element);
        const hColGrp: Element = colGrp.cloneNode() as Element; hFrag.appendChild(hColGrp);
        let tHead: Element;
        tHead = this.parent.element.querySelector('.e-column-header thead');
        tHead = hFrag.appendChild(tHead.cloneNode(true) as Element);
        const hRow: Element = tHead.querySelector('tr'); hRow.innerHTML = '';
        const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
        if (frozenRow) { hTBody = hFrag.appendChild(hTBody.cloneNode(true) as Element); }
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[0] === args.indexes[0]) {
                col = this.updateCol(sheet, indexes[1], hColGrp); colGrp.appendChild(col.cloneNode());
                hRow.appendChild(this.cellRenderer.renderColHeader(indexes[1]));
            }
            if (indexes[1] - frozenCol === args.indexes[1]) {
                if (indexes[0] < frozenRow) {
                    row = hTBody.children[count];
                } else {
                    row = tBody.children[count];
                }
                if (row) {
                    row.innerHTML = ''; count++;
                } else {
                    return;
                }
            }
            cell = row.appendChild(this.cellRenderer.render(<CellRenderArgs>{
                colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key, row: row, pRow: row.previousSibling,
                first: !args.skipUpdateOnFirst && indexes[1] === args.indexes[1] ? 'Column' : (this.parent.scrollSettings.
                    enableVirtualization && indexes[0] === args.indexes[0] && this.parent.viewport.topIndex !==
                    skipHiddenIdx(sheet, 0, true) ? 'Row' : '') }));
            this.checkColMerge(indexes, args.indexes, cell, value);
            if (frozenRow && indexes[0] === frozenRow - 1) { count = 0; }
        });
        getUpdateUsingRaf((): void => {
            table = this.getColHeaderTable(); removeAllChildren(table);
            table.appendChild(hFrag);
            table = this.getContentTable(); removeAllChildren(table);
            table.appendChild(frag);
            this.parent.notify(virtualContentLoaded, { refresh: 'Column', prevRowColCnt: args.prevRowColCnt });
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
        const sheet: SheetModel = this.parent.getActiveSheet(); let cell: Element;
        const frag: DocumentFragment = document.createDocumentFragment();
        const tBody: Element = this.parent.createElement('tbody');
        const hFrag: DocumentFragment = document.createDocumentFragment();
        const hTBody: Element = tBody.cloneNode() as Element; hFrag.appendChild(hTBody);
        frag.appendChild(tBody); const frozenCol: number = this.parent.frozenColCount(sheet);
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[1] === args.indexes[1] || !row) {
                hdrRow = this.rowRenderer.render(indexes[0], true) as HTMLElement;
                if (frozenCol && indexes[1] < frozenCol) {
                    hTBody.appendChild(hdrRow); row = hdrRow;
                } else {
                    if (indexes[1] === args.indexes[1]) { hTBody.appendChild(hdrRow); }
                    row = this.rowRenderer.render(indexes[0]) as HTMLElement;
                    tBody.appendChild(row);
                }
                if (indexes[1] === args.indexes[1]) {
                    hdrRow.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                }
            }
            cell = row.appendChild(this.cellRenderer.render(<CellRenderArgs>{
                rowIdx: indexes[0], colIdx: indexes[1], cell: value, address:
                    key, lastCell: indexes[1] === args.indexes[3], row: row, hRow: hdrRow, pRow: row.previousSibling,
                pHRow: hdrRow.previousSibling,
                isHeightCheckNeeded: true, first: !args.skipUpdateOnFirst && indexes[0] === args.indexes[0] ?
                    'Row' : (this.parent.scrollSettings.enableVirtualization && indexes[1] === args.indexes[1] && this.parent.viewport.leftIndex
                        !== skipHiddenIdx(sheet, 0, true, 'columns') ? 'Column' : '') }));
            this.checkRowMerge(indexes, args.indexes, cell, value);
            if (frozenCol && indexes[1] === frozenCol - 1) { row = null; }
        });
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth);
        }
        if (this.contentPanel.querySelector('.e-row-header tbody')) {
            detach(this.contentPanel.querySelector('.e-row-header tbody'));
            this.getRowHeaderTable().appendChild(hFrag);
        }
        if (this.contentPanel.querySelector('.e-sheet-content tbody')) {
            detach(this.contentPanel.querySelector('.e-sheet-content tbody'));
            this.getContentTable().appendChild(frag);
        }
        this.parent.notify(virtualContentLoaded, { refresh: 'Row', prevRowColCnt: args.prevRowColCnt });
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

    public updateCol(sheet: SheetModel, idx: number, appendTo?: Element): Element {
        const col: HTMLElement = this.col.cloneNode() as HTMLElement;
        col.style.width = formatUnit(getColumnWidth(sheet, idx, null, true));
        if (appendTo) {
            const empty: Element = appendTo.querySelector('.e-empty');
            return empty ? appendTo.insertBefore(col, empty) : appendTo.appendChild(col);
        } else {
            return col;
        }
    }

    public updateColContent(args: SheetRenderArgs): void {
        getUpdateUsingRaf((): void => {
            let indexes: number[]; let row: Element; let refChild: Element; let cell: Element;
            let rowCount: number = 0; let col: HTMLElement; const sheet: SheetModel = this.parent.getActiveSheet();
            const hRow: Element = this.parent.element.querySelector('.e-column-header .e-header-row');
            const hRefChild: Element = hRow.firstElementChild;
            const colGrp: Element = this.parent.element.querySelector('.e-sheet-content colgroup');
            const hColGrp: Element = this.parent.element.querySelector('.e-column-header colgroup');
            const colRefChild: Element = colGrp.firstElementChild; let skipRender: boolean;
            const hColRefChild: Element = hColGrp.firstElementChild;
            const tBody: HTMLTableSectionElement = this.parent.element.querySelector('.e-sheet-content tbody');
            const hTBody: HTMLTableSectionElement = this.parent.element.querySelector('.e-column-header tbody');
            const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
            (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
                if (skipRender) { return; }
                indexes = getRangeIndexes(key);
                if (args.direction === 'first' && indexes[1] === args.indexes[1]) {
                    this.checkColMerge(
                        [indexes[0], this.parent.viewport.leftIndex + frozenCol], args.indexes,
                        ((indexes[0] < frozenRow ? hTBody : tBody).rows[rowCount] ||
                            { cells: [] }).cells[(args.indexes[3] - args.indexes[1]) + 1],
                        getCell(indexes[0], this.parent.viewport.leftIndex + frozenCol, sheet) || {});
                }
                if (indexes[0] === args.indexes[0]) {
                    if (args.direction === 'last') {
                        col = this.col.cloneNode() as HTMLElement;
                        col.style.width = formatUnit(getColumnWidth(sheet, indexes[1], null, true));
                        colGrp.insertBefore(col, colRefChild); hColGrp.insertBefore(col.cloneNode(), hColRefChild);
                        hRow.insertBefore(this.cellRenderer.renderColHeader(indexes[1]), hRefChild);
                    } else {
                        col = this.updateCol(sheet, indexes[1], colGrp) as HTMLElement; hColGrp.appendChild(col.cloneNode());
                        hRow.appendChild(this.cellRenderer.renderColHeader(indexes[1]));
                    }
                    if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                        /* eslint-disable */
                        detach((colGrp as any)[args.direction + 'ElementChild']);
                        detach((hColGrp as any)[args.direction + 'ElementChild']);
                        detach((hRow as any)[args.direction + 'ElementChild']);
                        /* eslint-enable */
                    }
                }
                if (indexes[1] === args.indexes[1]) {
                    if (indexes[0] < frozenRow) {
                        row = hTBody.children[rowCount];
                    } else {
                        row = tBody.children[rowCount];
                        if (!row) { skipRender = true; return; }
                    }
                    rowCount++;
                    refChild = row.firstElementChild;
                }
                cell = this.cellRenderer.render(<CellRenderArgs>{colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key,
                    lastCell: indexes[1] === args.indexes[3], isHeightCheckNeeded: args.direction === 'first',
                    first: args.direction === 'last' && !args.skipUpdateOnFirst && indexes[1] === args.indexes[1] ? 'Column' : '',
                    checkNextBorder: args.direction === 'last' && indexes[3] === args.indexes[3] ? 'Column' : '' });
                if (args.direction === 'last') {
                    this.checkColMerge(
                        indexes, args.indexes, cell, value, ((indexes[0] < frozenRow ? hTBody : tBody).rows[rowCount - 1] ||
                        { cells: [] }).cells[0]);
                    row.insertBefore(cell, refChild);
                } else {
                    row.appendChild(cell);
                }
                if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    detach((row as any)[args.direction + 'ElementChild']);
                }
                if (frozenRow && indexes[0] === frozenRow - 1) { rowCount = 0; }
            });
            this.parent.notify(virtualContentLoaded, { refresh: 'Column', prevRowColCnt: args.prevRowColCnt });
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
        const sheet: SheetModel = this.parent.getActiveSheet(); let count: number = 0;
        const tBody: HTMLTableSectionElement = this.parent.getMainContent().querySelector('tbody');
        const rTBody: HTMLTableSectionElement = this.parent.getRowHeaderContent().querySelector('tbody');
        const rFrag: DocumentFragment = document.createDocumentFragment();
        let indexes: number[]; const frag: DocumentFragment = document.createDocumentFragment();
        this.parent.showSpinner(); const frozenCol: number = this.parent.frozenColCount(sheet);
        const frozenRow: number = this.parent.frozenRowCount(sheet); let firstRow: HTMLTableRowElement;
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, cKey: string): void => {
            indexes = getRangeIndexes(cKey);
            if (args.direction ===  'first' && indexes[0] === args.indexes[0]) {
                if (firstRow === undefined) {
                    firstRow = (indexes[1] < frozenCol ? rTBody : tBody).rows[(args.indexes[2] - args.indexes[0]) + 1] || null;
                }
                this.checkRowMerge(
                    [this.parent.viewport.topIndex + frozenRow, indexes[1]], args.indexes,
                    (firstRow || { cells: [] }).cells[indexes[1] < frozenCol ? count + 1 : count],
                    getCell(this.parent.viewport.topIndex + frozenRow, indexes[1], sheet) || {});
            }
            if (indexes[1] === args.indexes[1] || !row) {
                hRow = this.rowRenderer.render(indexes[0], true) as HTMLElement;
                if (frozenCol && indexes[1] < frozenCol) {
                    rFrag.appendChild(hRow); row = hRow;
                } else {
                    row = this.rowRenderer.render(indexes[0]) as HTMLElement;
                    frag.appendChild(row);
                    if (indexes[1] === args.indexes[1]) { rFrag.appendChild(hRow); }
                    if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        detach((tBody as any)[args.direction + 'ElementChild']);
                    }
                }
                if (indexes[1] === args.indexes[1]) {
                    hRow.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                    if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        detach((rTBody as any)[args.direction + 'ElementChild']);
                    }
                }
            }
            cell = row.appendChild(this.cellRenderer.render(<CellRenderArgs>{ colIdx: indexes[1], rowIdx: indexes[2], cell: value, address:
                cKey, lastCell: indexes[1] === args.indexes[3], row: row, pHRow: hRow.previousSibling,
            checkNextBorder: args.direction === 'last' && indexes[2] === args.indexes[2] ? 'Row' : '', pRow: row.previousSibling,
            isHeightCheckNeeded: args.direction === 'first' || args.direction === '', hRow: hRow, first: args.direction === 'last' &&
                !args.skipUpdateOnFirst && indexes[0] === args.indexes[0] ? 'Row' : '' }));
            if (args.direction ===  'last' && tBody.rows.length) {
                this.checkRowMerge(
                    indexes, args.indexes, cell, value, (indexes[1] < frozenCol ? rTBody : tBody).rows[0].cells[indexes[1] < frozenCol ?
                        count + 1 : count]);
            }
            count++;
            if (frozenCol && indexes[1] === frozenCol - 1) { row = null; firstRow = undefined; count = 0; }
        });
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth);
        }
        if (args.direction === 'last') {
            rTBody.insertBefore(rFrag, rTBody.firstElementChild);
            tBody.insertBefore(frag, tBody.firstElementChild);
        } else {
            rTBody.appendChild(rFrag);
            tBody.appendChild(frag);
        }
        if (this.parent.scrollSettings.enableVirtualization) {
            this.parent.notify(virtualContentLoaded, { refresh: 'Row', prevRowColCnt: args.prevRowColCnt });
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
            const frozenRow: number = this.parent.frozenRowCount(this.parent.getActiveSheet());
            if (indexes[0] === this.parent.viewport.topIndex + frozenRow) {
                if (model.rowSpan < 0) {
                    const args: CellRenderArgs = { td: cell as HTMLTableCellElement, rowIdx: indexes[0], colIdx: indexes[1], isRow: true,
                        isFreezePane: true };
                    this.parent.notify(checkMerge, args);
                    if (args.insideFreezePane) { return; }
                    if (this.parent.viewport.topIndex + frozenRow >= range[0]) {
                        this.refreshPrevMerge(range[0] + 1, indexes[1]);
                    }
                }
                if (firstcell && ((firstcell as HTMLTableCellElement).colSpan > 1 || (firstcell as HTMLTableCellElement).rowSpan > 1)) {
                    this.cellRenderer.refresh(indexes[0] + (range[2] - range[0]) + 1, indexes[1], null, firstcell);
                }
            } else if (model.rowSpan > 1) {
                const prevTopIdx: number = range[2] + 1;
                if (indexes[0] + model.rowSpan - 1 > prevTopIdx && indexes[0] < prevTopIdx) {
                    this.refreshPrevMerge(prevTopIdx, indexes[1], this.parent.viewport.topIndex + frozenRow);
                }
            }
        }
    }

    private refreshPrevMerge(prevTopIdx: number, colIndex: number, currTopIdx?: number): void {
        const td: HTMLTableCellElement
            = this.parent.getCell(prevTopIdx, colIndex, this.parent.getRow(currTopIdx ?
                currTopIdx : 0, null, colIndex)) as HTMLTableCellElement;
        if (td && td.rowSpan > 1) {
            this.cellRenderer.refresh(prevTopIdx, colIndex, null, td);
        }
    }

    private checkColMerge(indexes: number[], range: number[], cell: Element, model: CellModel, firstcell?: Element): void {
        if (this.parent.scrollSettings.enableVirtualization && cell && indexes[1] === this.parent.viewport.leftIndex +
            this.parent.frozenColCount(this.parent.getActiveSheet()) && (!isNullOrUndefined(model.rowSpan) ||
            !isNullOrUndefined(model.colSpan))) {
            if (model.colSpan < 0) {
                const e: CellRenderArgs = { td: cell as HTMLTableCellElement, colIdx: indexes[1], rowIdx: indexes[0], isFreezePane: true };
                this.parent.notify(checkMerge, e);
                if (e.insideFreezePane) { return; }
            }
            if (firstcell && ((firstcell as HTMLTableCellElement).colSpan > 1 || (firstcell as HTMLTableCellElement).rowSpan > 1)) {
                this.cellRenderer.refresh(indexes[0], indexes[1] + (range[3] - range[1]) + 1, null, firstcell);
            }
        }
    }

    /**
     * Used to toggle row and column headers.
     *
     * @returns {void}
     */
    public showHideHeaders(): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        getUpdateUsingRaf((): void => {
            if (sheet.showHeaders) {
                const content: HTMLElement = this.getContentPanel();
                this.setPanelWidth(sheet, this.getRowHeaderPanel()); this.setPanelHeight(sheet);
                document.getElementById(this.parent.element.id + '_sheet').classList.remove('e-hide-headers');
                this.getColHeaderPanel().scrollLeft = content.scrollLeft;
                this.parent.selectRange(sheet.selectedRange);
            } else {
                this.updateHideHeaders(sheet, document.getElementById(this.parent.element.id + '_sheet'));
                this.setPanelHeight(sheet);
                if (this.parent.frozenColCount(sheet) || this.parent.frozenRowCount(sheet)) {
                    this.setPanelWidth(sheet, this.getRowHeaderPanel());
                    this.parent.selectRange(sheet.selectedRange);
                } else {
                    this.getContentPanel().style.width = '';
                    const offset: string = this.parent.enableRtl ? 'right' : 'left';
                    this.getContentPanel().style[offset] = '';
                }
                this.getScrollElement().style.left = this.getRowHeaderWidth(sheet) + 'px';
            }
        });
    }

    private updateHideHeaders(sheet: SheetModel, ele: HTMLElement): void {
        if (!sheet.showHeaders) { ele.classList.add('e-hide-headers'); }
    }

    private rowHeightChange(args: { rowIdx: number, threshold: number }): void {
        if (args.threshold) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (args.rowIdx < this.parent.frozenRowCount(sheet)) { this.setPanelHeight(sheet); }
        }
    }

    private colWidthChange(args: { colIdx: number, threshold: number }): void {
        if (args.threshold) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (args.colIdx < this.parent.frozenColCount(sheet)) { this.setPanelWidth(sheet, this.getRowHeaderPanel()); }
            this.checkTableWidth(sheet);
        }
    }

    public getRowHeaderWidth(sheet: SheetModel, skipFreezeCheck?: boolean): number {
        let width: number = 0;
        if (!skipFreezeCheck && sheet.frozenColumns) {
            const leftIdx: number = getCellIndexes(sheet.topLeftCell)[1];
            width = getColumnsWidth(sheet, leftIdx, leftIdx + sheet.frozenColumns - 1, true);
        }
        width += sheet.showHeaders ? getDPRValue(this.colGroupWidth) : 0;
        return width;
    }

    public getColHeaderHeight(sheet: SheetModel, skipHeader?: boolean): number {
        const topIndex: number = getCellIndexes(sheet.topLeftCell)[0];
        return (sheet.showHeaders && !skipHeader ? getDPRValue(31) : 0) +
            getRowsHeight(sheet, topIndex, topIndex + sheet.frozenRows - 1, true);
    }

    /**
     * Get the select all table element of spreadsheet
     *
     * @returns {HTMLElement} - Select all content element.
     */
    public getSelectAllContent(): HTMLElement {
        return this.headerPanel.getElementsByClassName('e-selectall-container')[0] as HTMLElement;
    }

    /**
     * Get the horizontal scroll element of spreadsheet
     *
     * @returns {HTMLElement} - Select all content element.
     */
    public getScrollElement(): HTMLElement {
        return (this.contentPanel.parentElement || this.contentPanel.nextElementSibling).querySelector('.e-scroller') as HTMLElement;
    }

    /**
     * Get the select all table element of spreadsheet
     *
     * @returns {HTMLTableElement} - Select all table element.
     */
    public getSelectAllTable(): HTMLTableElement {
        return this.headerPanel.getElementsByClassName('e-selectall-table')[0] as HTMLTableElement;
    }

    /**
     * Get the column header element of spreadsheet
     *
     * @returns {HTMLTableElement} - Column header table element.
     */
    public getColHeaderTable(): HTMLTableElement {
        return this.headerPanel.getElementsByClassName('e-colhdr-table')[0] as HTMLTableElement;
    }

    /**
     * Get the row header table element of spreadsheet
     *
     * @returns {HTMLTableElement} - Row header table element.
     */
    public getRowHeaderTable(): HTMLTableElement {
        return this.contentPanel.getElementsByClassName('e-rowhdr-table')[0] as HTMLTableElement;
    }

    /**
     * Get the main content table element of spreadsheet
     *
     * @returns {Element} - Content table element.
     */
    public getContentTable(): HTMLTableElement {
        return this.contentPanel.getElementsByClassName('e-content-table')[0] as HTMLTableElement;
    }

    /**
     * Get the row header div element of spreadsheet
     *
     * @returns {HTMLElement} - Row header panel element.
     */
    public getRowHeaderPanel(): HTMLElement {
        return this.contentPanel.getElementsByClassName('e-row-header')[0] as HTMLElement;
    }

    /**
     * Get the column header div element of spreadsheet
     *
     * @returns {HTMLElement} - Column header panel element.
     */
    public getColHeaderPanel(): HTMLElement {
        return this.headerPanel.getElementsByClassName('e-column-header')[0] as HTMLElement;
    }

    /**
     * Get the main content div element of spreadsheet
     *
     * @returns {HTMLElement} - Content panel element.
     */
    public getContentPanel(): HTMLElement {
        return this.contentPanel.getElementsByClassName('e-sheet-content')[0] as HTMLElement;
    }

    private addEventListener(): void {
        this.parent.on(created, this.triggerCreatedEvent, this);
        this.parent.on(rowHeightChanged, this.rowHeightChange, this);
        this.parent.on(colWidthChanged, this.colWidthChange, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }
    private destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        this.parent.off(created, this.triggerCreatedEvent);
        this.parent.off(rowHeightChanged, this.rowHeightChange);
        this.parent.off(colWidthChanged, this.colWidthChange);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    }
}
