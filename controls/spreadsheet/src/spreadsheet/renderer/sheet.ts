import { formatUnit, detach, attributes, isNullOrUndefined, Browser, L10n } from '@syncfusion/ej2-base';
import { Spreadsheet } from '../base/index';
import { getCellIndexes, getRangeIndexes, skipHiddenIdx, applyCF, ApplyCFArgs } from './../../workbook/common/index';
import { getColumnsWidth, getColumnWidth, ConditionalFormat } from '../../workbook/index';
import { contentLoaded, editOperation, getUpdateUsingRaf, IRowRenderer, removeAllChildren, SheetRenderArgs } from '../common/index';
import { IRenderer, beforeContentLoaded, getColGroupWidth, virtualContentLoaded, setAriaOptions, dataBound } from '../common/index';
import { CellRenderArgs, ICellRenderer, created, spreadsheetDestroyed, getDPRValue } from '../common/index';
import { checkMerge, forRefSelRender, initiateEdit, chartRangeSelection, rowHeightChanged } from '../common/index';
import { colWidthChanged, clearUndoRedoCollection, getUpdatedScrollPosition, locale } from '../common/index';
import { CellModel, SheetModel, ExtendedRange, getCell, getRowsHeight, getRowHeight } from '../../workbook/index';

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
        cell.appendChild(
            this.parent.createElement('button', { className: 'e-selectall', id: `${this.parent.element.id}_select_all`,
                attrs: { 'aria-label': this.parent.serviceLocator.getService<L10n>(locale).getConstant('SelectAll'), 'type': 'button' } }));
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

    public setPanelWidth(sheet: SheetModel, rowHdr: HTMLElement, isRtlChange?: boolean): void {
        const scrollSize: number = this.getScrollSize(true);
        const width: number = this.getRowHeaderWidth(sheet); const offset: string = this.parent.enableRtl ? 'right' : 'left';
        let rtlOffset: string;
        if (isRtlChange) {
            rtlOffset = this.parent.enableRtl ? 'left' : 'right';
            this.getContentPanel().style[`${rtlOffset}`] = this.getColHeaderPanel().style[`${rtlOffset}`] = '';
        }
        if (sheet.frozenColumns) {
            const frozenCol: HTMLElement = document.getElementById(this.parent.element.id + '_sheet').getElementsByClassName(
                'e-frozen-column')[0] as HTMLElement;
            frozenCol.style.height = `calc(100% - ${scrollSize}px)`;
            if (isRtlChange) {
                frozenCol.style[`${rtlOffset}`] = '';
            }
            frozenCol.style[`${offset}`] = width - getDPRValue(1) + 'Px'; frozenCol.style.display = '';
        }
        this.setHeaderPanelWidth(this.getSelectAllContent(), width);
        this.getColHeaderPanel().style.width = `calc(100% - ${width}px)`;
        this.getColHeaderPanel().style[`${offset}`] = width + 'px';
        this.setHeaderPanelWidth(rowHdr, width);
        this.getContentPanel().style.width = `calc(100% - ${width}px)`;
        this.getContentPanel().style[`${offset}`] = width + 'px';
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
            if (isRtlChange) {
                scroll.style[`${rtlOffset}`] = '';
            }
            scroll.style[`${offset}`] = width + 'px'; scroll.style.width = `calc(100% - ${width}px)`;
            if (Browser.userAgent.indexOf('Mac OS') > -1 && Browser.info.name === 'safari') {
                scroll.style.height = '7px'; scroll.style.top = '-7px';
            }
        }
    }

    public getScrollSize(addOffset?: boolean): number {
        const scrollSize: number = parseInt(this.headerPanel.style[this.parent.enableRtl ? 'margin-left' : 'margin-right'], 10);
        return scrollSize ? scrollSize + (addOffset ? 1 : 0) : 0;
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
        this.contentPanel = this.parent.createElement('div', { className: 'e-main-panel', attrs: { 'tabindex': '0' } });
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
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        const frozenCol: number = this.parent.frozenColCount(sheet);
        const lastFrozenCol: number = skipHiddenIdx(sheet, frozenCol - 1, false, 'columns');
        this.parent.notify(beforeContentLoaded, { top: args.top, left: args.left });
        const colCount: string = sheet.colCount.toString(); const rowCount: string = sheet.colCount.toString();
        const layout: string = args.top && args.left ? 'RowColumn' : (args.top ? 'Row' : (args.left ? 'Column' : ''));
        this.parent.getColHeaderTable().setAttribute('aria-colcount', colCount);
        this.parent.getRowHeaderTable().setAttribute('aria-rowcount', rowCount); let emptyRow: Element;
        attributes(this.parent.getContentTable(), { 'aria-rowcount': rowCount, 'aria-colcount': colCount });
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[1] === args.indexes[1] || !row) {
                if (indexes[1] === args.indexes[1]) {
                    hRow = this.rowRenderer.render(indexes[0], true) as HTMLElement;
                }
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
                if (indexes[1] === args.indexes[1]) {
                    this.cellRenderer.renderRowHeader(indexes[0], hRow);
                }
            }
            this.cellRenderer.render(<CellRenderArgs>{colIdx: indexes[1], rowIdx: indexes[0], cell: value,
                address: key, lastCell: indexes[1] === args.indexes[3], isHeightCheckNeeded: true, row: row, hRow: hRow,
                pRow: row.previousSibling, pHRow: hRow.previousSibling, isRefreshing: args.isRefreshing,
                first: layout ? (layout.includes('Row') ? (indexes[0] === args.indexes[0] ? 'Row' : (layout.includes('Column') ? (
                    indexes[1] === args.indexes[1] ? 'Column' : '') : '')) : (indexes[1] === args.indexes[1] ? 'Column' : '')) : '' });
            if (frozenCol && indexes[1] === lastFrozenCol) {
                row = null;
            }
            if (indexes[0] === args.indexes[0]) {
                if (frozenCol && indexes[1] < frozenCol) {
                    col = this.updateCol(sheet, indexes[1], selectAllColGrp);
                    const empty: Element = rowHdrColGrp.querySelector('.e-empty');
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    empty ? rowHdrColGrp.insertBefore(col.cloneNode(true), empty) : rowHdrColGrp.appendChild(col.cloneNode(true));
                    this.cellRenderer.renderColHeader(indexes[1], selectAllHdrRow);
                } else {
                    this.updateCol(sheet, indexes[1], colGrp);
                    this.cellRenderer.renderColHeader(indexes[1], cHdrRow);
                }
            }
        });
        if ((this.parent as { isReact?: boolean }).isReact) {
            this.parent['renderReactTemplates']();
        }
        cTBody.parentElement.insertBefore(colGrp.cloneNode(true), cTBody);
        getUpdateUsingRaf((): void => {
            if (!this.parent) { return; }
            const content: HTMLElement = this.parent.getMainContent();
            const sheetContent: HTMLElement = document.getElementById(this.parent.element.id + '_sheet');
            if (sheetContent.childElementCount && sheetContent.querySelector('.e-header-panel') !== this.headerPanel) {
                const sheetChild: HTMLCollection = sheetContent.children;
                for (let i: number = 0; i < sheetChild.length; i++) {
                    if (!sheetChild[i as number].classList.contains('e-frozen-row') &&
                        !sheetChild[i as number].classList.contains('e-frozen-column') &&
                        !sheetChild[i as number].classList.contains('e-ss-overlay')) {
                        sheetContent.removeChild(sheetChild[i as number]);
                    }
                }
            }
            sheetContent.appendChild(frag);
            sheetContent.style.backgroundColor = '';
            if (sheet.conditionalFormats && sheet.conditionalFormats.length) {
                this.parent.notify(applyCF, <ApplyCFArgs>{ indexes: args.indexes });
            }
            this.checkRowHeightChanged(args, sheet);
            if (args.top) {
                content.parentElement.scrollTop = args.top;
            }
            if (args.left) {
                content.scrollLeft = args.left; this.parent.getColumnHeaderContent().scrollLeft = args.left;
            }
            this.parent.notify(contentLoaded, args);
            this.checkTableWidth(sheet);
            this.parent.notify(editOperation, { action: 'renderEditor', initLoad: args.initLoad && !this.parent.isOpen });
            if (!args.initLoad && !this.parent.isOpen) { this.parent.hideSpinner(); }
            setAriaOptions(content, { busy: false });
            this.parent.trigger(dataBound, {});
            if (this.parent.isEdit) { this.parent.notify(initiateEdit, null); }
            if (args.openOptions && args.openOptions.eventArgs && args.openOptions.eventArgs.triggerEvent) {
                this.parent.trigger('openComplete', { response: args.openOptions });
            }
            if (args.initLoad) {
                let triggerEvent: boolean = true;
                if (this.parent.scrollSettings.enableVirtualization) {
                    for (let i: number = 0; i < sheet.ranges.length; i++) {
                        if ((<ExtendedRange>sheet.ranges[i as number]).info.count - 1 > this.parent.viewport.bottomIndex) {
                            triggerEvent = false; break;
                        }
                    }
                }
                if (triggerEvent) {
                    /* eslint-disable */
                    if ((this.parent as any).isReact) {
                        setTimeout(() => {
                            if (!this.parent) { return; }
                            this.triggerCreatedEvent();
                        });
                        /* eslint-enable */
                    } else {
                        this.triggerCreatedEvent();
                    }
                } else if (!this.parent.isOpen) {
                    this.parent.hideSpinner();
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
                (this.parent['created']  as { observers?: object }).observers =
                    (this.parent.createdHandler as { observers: object }).observers;
                if ((this.parent as { isAngular?: boolean }).isAngular &&
                    (this.parent.createdHandler as { currentObservers: object }).currentObservers) {
                    (this.parent['created'] as { currentObservers?: object }).currentObservers =
                        (this.parent.createdHandler as { currentObservers: object }).currentObservers;
                }
            } else {
                this.parent.setProperties({ created: this.parent.createdHandler }, true);
            }
            this.parent.createdHandler = undefined;
            this.parent.trigger(created, null);
            this.parent.notify(clearUndoRedoCollection, null);
        }
    }

    /**
     * This method is used to check whether row height increased above the viewport after import
     */
    private checkRowHeightChanged(args: { top?: number, left?: number }, sheet: SheetModel): void {
        const eventArgs: { top: number, left: number, sheet: SheetModel } = { top: args.top, left: args.left, sheet: sheet };
        this.parent.notify(getUpdatedScrollPosition, eventArgs);
        if (args.top !== eventArgs.top) {
            if (this.parent.scrollModule && this.parent.scrollModule.offset.top.idx && (eventArgs.top - args.top) <
                getRowHeight(sheet, this.parent.scrollModule.offset.top.idx)) {
                this.parent.scrollModule.offset.top.size = eventArgs.top;
            }
            args.top = eventArgs.top;
        }
        if (args.left !== eventArgs.left) {
            if (this.parent.scrollModule && this.parent.scrollModule.offset.left.idx && (eventArgs.left - args.left) <
                getColumnWidth(sheet, this.parent.scrollModule.offset.left.idx)) {
                this.parent.scrollModule.offset.left.size = eventArgs.left
            }
            args.left = eventArgs.left;
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

    private clearCFResult(sheet: SheetModel): void {
        if (sheet.conditionalFormats && sheet.conditionalFormats.length) {
            const cfRule: ConditionalFormat[] = sheet.conditionalFormats as ConditionalFormat[];
            for (let i: number = 0; i < cfRule.length; i++) {
                delete cfRule[i as number].result;
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
        const hRow: HTMLElement = tHead.querySelector('tr'); hRow.innerText = '';
        const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
        if (frozenRow) { hTBody = hFrag.appendChild(hTBody.cloneNode(true) as Element); }
        const lastFrozenRow: number = skipHiddenIdx(sheet, frozenRow - 1, false);
        const notFirstRow: boolean =  this.parent.scrollSettings.enableVirtualization && this.parent.viewport.topIndex !==
            skipHiddenIdx(sheet, 0, true);
        this.clearCFResult(sheet);
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[0] === args.indexes[0]) {
                col = this.updateCol(sheet, indexes[1], hColGrp); colGrp.appendChild(col.cloneNode());
                this.cellRenderer.renderColHeader(indexes[1], hRow);
            }
            if (indexes[1] - frozenCol === args.indexes[1]) {
                if (indexes[0] < frozenRow) {
                    row = hTBody.children[count as number];
                } else {
                    row = tBody.children[count as number];
                }
                if (row) {
                    (row as HTMLElement).innerText = '';
                    count++;
                } else {
                    return;
                }
            }
            if (!row) {
                return;
            }
            cell = this.cellRenderer.render(<CellRenderArgs>{
                colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key, row: row, pRow: row.previousSibling,
                first: !args.skipUpdateOnFirst && indexes[1] === args.indexes[1] ? 'Column' :
                    (notFirstRow && indexes[0] === args.indexes[0] ? 'Row' : ''), isRefreshing: true });
            this.checkColMerge(indexes, args.indexes, cell, value);
            if (frozenRow && indexes[0] === lastFrozenRow) { count = 0; }
        });
        const appendColumns: Function = (): void => {
            table = this.getColHeaderTable(); removeAllChildren(table);
            table.appendChild(hFrag);
            table = this.getContentTable(); removeAllChildren(table);
            table.appendChild(frag);
            this.parent.notify(virtualContentLoaded, { refresh: 'Column', prevRowColCnt: args.prevRowColCnt });
            if (sheet.conditionalFormats && sheet.conditionalFormats.length) {
                this.parent.notify(applyCF, <ApplyCFArgs>{ indexes: args.indexes, isRender: true });
            }
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
        };
        if (args.insertDelete) {
            appendColumns();
        } else {
            getUpdateUsingRaf(() => appendColumns());
        }
    }

    public refreshRowContent(args: SheetRenderArgs): void {
        let indexes: number[]; let row: HTMLElement; let hdrRow: HTMLElement; let colGroupWidth: number = this.colGroupWidth;
        const sheet: SheetModel = this.parent.getActiveSheet(); let cell: Element;
        const frag: DocumentFragment = document.createDocumentFragment();
        const tBody: Element = this.parent.createElement('tbody');
        const hFrag: DocumentFragment = document.createDocumentFragment();
        const hTBody: Element = tBody.cloneNode() as Element; hFrag.appendChild(hTBody);
        frag.appendChild(tBody);
        const frozenCol: number = this.parent.frozenColCount(sheet);
        const lastFrozenCol: number = skipHiddenIdx(sheet, frozenCol - 1, false, 'columns');
        const notFirstCol: boolean = this.parent.scrollSettings.enableVirtualization && this.parent.viewport.leftIndex !==
            skipHiddenIdx(sheet, 0, true, 'columns');
        this.clearCFResult(sheet);
        (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
            indexes = getRangeIndexes(key);
            if (indexes[1] === args.indexes[1] || !row) {
                if (indexes[1] === args.indexes[1]) {
                    hdrRow = this.rowRenderer.render(indexes[0], true) as HTMLElement;
                }
                if (frozenCol && indexes[1] < frozenCol) {
                    hTBody.appendChild(hdrRow); row = hdrRow;
                } else {
                    if (indexes[1] === args.indexes[1]) { hTBody.appendChild(hdrRow); }
                    row = this.rowRenderer.render(indexes[0]) as HTMLElement;
                    tBody.appendChild(row);
                }
                if (indexes[1] === args.indexes[1]) {
                    this.cellRenderer.renderRowHeader(indexes[0], hdrRow);
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                }
            }
            if (frozenCol) { hdrRow = (hTBody.lastElementChild as HTMLElement) || hdrRow; }
            cell = this.cellRenderer.render(<CellRenderArgs>{
                rowIdx: indexes[0], colIdx: indexes[1], cell: value, address:
                    key, lastCell: indexes[1] === args.indexes[3], row: row, hRow: hdrRow, pRow: row.previousSibling,
                pHRow: hdrRow.previousSibling, isHeightCheckNeeded: true, first: !args.skipUpdateOnFirst && indexes[0] === args.indexes[0] ?
                    'Row' : (notFirstCol && indexes[1] === args.indexes[1] ? 'Column' : ''), isRefreshing: true });
            this.checkRowMerge(indexes, args.indexes, cell, value);
            if (frozenCol && indexes[1] === lastFrozenCol) { row = null; }
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
        if (sheet.conditionalFormats && sheet.conditionalFormats.length) {
            this.parent.notify(applyCF, <ApplyCFArgs>{ indexes: args.indexes, isRender: true });
        }
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
            let indexes: number[]; let row: HTMLElement; let refChild: Element; let cell: Element;
            let rowCount: number = 0; let col: HTMLElement; const sheet: SheetModel = this.parent.getActiveSheet();
            const hRow: Element = this.parent.element.querySelector('.e-column-header .e-header-row');
            const hRefChild: Element = hRow.firstElementChild;
            const colGrp: Element = this.parent.element.querySelector('.e-sheet-content colgroup');
            const hColGrp: Element = this.parent.element.querySelector('.e-column-header colgroup');
            const colRefChild: Element = colGrp.firstElementChild; let skipRender: boolean;
            const hColRefChild: Element = hColGrp.firstElementChild;
            const tBody: HTMLTableSectionElement = this.parent.element.querySelector('.e-sheet-content tbody');
            const hTBody: HTMLTableSectionElement = this.parent.element.querySelector('.e-column-header tbody');
            const frozenRow: number = this.parent.frozenRowCount(sheet);
            const frozenCol: number = this.parent.frozenColCount(sheet);
            const lastFrozenRow: number = skipHiddenIdx(sheet, frozenRow - 1, false);
            const firstRow: number = skipHiddenIdx(sheet, args.indexes[0], true);
            let cellArgs: CellRenderArgs;
            this.clearCFResult(sheet);
            (args.cells as Map<string, CellModel>).forEach((value: CellModel, key: string): void => {
                if (skipRender) { return; }
                indexes = getRangeIndexes(key);
                if (args.direction === 'first' && indexes[1] === args.indexes[1]) {
                    this.checkColMerge(
                        [indexes[0], this.parent.viewport.leftIndex + frozenCol], args.indexes,
                        ((indexes[0] < frozenRow ? hTBody : tBody).rows[rowCount as number] ||
                            { cells: [] }).cells[(args.indexes[3] - args.indexes[1]) + 1],
                        getCell(indexes[0], this.parent.viewport.leftIndex + frozenCol, sheet) || {});
                }
                if (indexes[0] === firstRow) {
                    if (args.direction === 'last') {
                        col = this.col.cloneNode() as HTMLElement;
                        col.style.width = formatUnit(getColumnWidth(sheet, indexes[1], null, true));
                        colGrp.insertBefore(col, colRefChild); hColGrp.insertBefore(col.cloneNode(), hColRefChild);
                        this.cellRenderer.renderColHeader(indexes[1], hRow, hRefChild);
                    } else {
                        col = this.updateCol(sheet, indexes[1], colGrp) as HTMLElement; hColGrp.appendChild(col.cloneNode());
                        this.cellRenderer.renderColHeader(indexes[1], hRow);
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
                        row = hTBody.children[rowCount as number] as HTMLElement;
                    } else {
                        row = tBody.children[rowCount as number] as HTMLElement;
                        if (!row) {
                            skipRender = true;
                            return;
                        }
                    }
                    rowCount++;
                    refChild = row.firstElementChild;
                }
                cellArgs = { colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key, row: row,
                    lastCell: indexes[1] === args.indexes[3], isHeightCheckNeeded: args.direction === 'first', first: args.direction ===
                    'last' && !args.skipUpdateOnFirst && indexes[1] === args.indexes[1] ? 'Column' : '', checkNextBorder: args.direction
                    === 'last' && indexes[3] === args.indexes[3] ? 'Column' : '', isRefreshing: args.direction === 'first' };
                if (args.direction === 'last') {
                    cellArgs.refChild = refChild;
                    cell = this.cellRenderer.render(cellArgs);
                    this.checkColMerge(
                        indexes, args.indexes, cell, value, ((indexes[0] < frozenRow ? hTBody : tBody).rows[rowCount - 1] ||
                        { cells: [] }).cells[1]);
                } else {
                    cell = this.cellRenderer.render(cellArgs);
                }
                if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    detach((row as any)[args.direction + 'ElementChild']);
                }
                if (frozenRow && indexes[0] === lastFrozenRow) { rowCount = 0; }
            });
            this.parent.notify(virtualContentLoaded, { refresh: 'Column', prevRowColCnt: args.prevRowColCnt });
            if (sheet.conditionalFormats && sheet.conditionalFormats.length) {
                this.parent.notify(applyCF, <ApplyCFArgs>{ indexes: args.indexes, isRender: true });
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
        const mainContent: HTMLElement = this.parent.getMainContent();
        if (args.direction === '' && !mainContent.children.length) {
            return;
        }
        let colGroupWidth: number = this.colGroupWidth; let row: HTMLElement; let hRow: HTMLElement; let cell: Element;
        const sheet: SheetModel = this.parent.getActiveSheet(); let count: number = 0;
        const tBody: HTMLTableSectionElement = mainContent.querySelector('tbody');
        const rTBody: HTMLTableSectionElement = this.parent.getRowHeaderContent().querySelector('tbody');
        const rFrag: DocumentFragment = document.createDocumentFragment();
        let indexes: number[]; const frag: DocumentFragment = document.createDocumentFragment();
        this.parent.showSpinner(); const frozenCol: number = this.parent.frozenColCount(sheet);
        const frozenRow: number = this.parent.frozenRowCount(sheet); let firstRow: HTMLTableRowElement;
        const firstCol: number = skipHiddenIdx(sheet, args.indexes[1], true, 'columns');
        const lastFrozenCol: number = skipHiddenIdx(sheet, frozenCol - 1, false, 'columns');
        this.clearCFResult(sheet);
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
            if (indexes[1] === firstCol || !row) {
                if (indexes[1] === firstCol) {
                    hRow = this.rowRenderer.render(indexes[0], true) as HTMLElement;
                }  
                if (frozenCol && indexes[1] < frozenCol) {
                    rFrag.appendChild(hRow); row = hRow;
                } else {
                    row = this.rowRenderer.render(indexes[0]) as HTMLElement;
                    frag.appendChild(row);
                    if (indexes[1] === firstCol) { rFrag.appendChild(hRow); }
                    if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        detach((tBody as any)[args.direction + 'ElementChild']);
                    }
                }
                if (indexes[1] === firstCol) {
                    this.cellRenderer.renderRowHeader(indexes[0], hRow);
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                    if (this.parent.scrollSettings.enableVirtualization && args.direction) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        detach((rTBody as any)[args.direction + 'ElementChild']);
                    }
                }
            }
            if (frozenCol) { hRow = (rFrag.lastElementChild as HTMLElement) || hRow; }
            cell = this.cellRenderer.render(
                <CellRenderArgs>{ colIdx: indexes[1], rowIdx: indexes[2], cell: value, address: cKey, row: row,
                    lastCell: indexes[1] === args.indexes[3], pHRow: hRow.previousSibling, checkNextBorder: args.direction === 'last' &&
                    indexes[2] === args.indexes[2] ? 'Row' : '', pRow: row.previousSibling, isHeightCheckNeeded: args.direction === 'first'
                    || args.direction === '', hRow: hRow, first: args.direction === 'last' && !args.skipUpdateOnFirst && indexes[0] ===
                    args.indexes[0] ? 'Row' : '', isRefreshing: args.direction === 'first' });
            if (args.direction ===  'last' && tBody.rows.length) {
                this.checkRowMerge(
                    indexes, args.indexes, cell, value, (indexes[1] < frozenCol ? rTBody : tBody).rows[0].cells[indexes[1] < frozenCol ?
                        count + 1 : count]);
            }
            count++;
            if (frozenCol && indexes[1] === lastFrozenCol) { row = null; firstRow = undefined; count = 0; }
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
        if (sheet.conditionalFormats && sheet.conditionalFormats.length) {
            this.parent.notify(applyCF, <ApplyCFArgs>{ indexes: args.indexes, isRender: true });
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
                    if (this.parent.viewport.topIndex + frozenRow >= range[2]) {
                        this.refreshPrevMerge(range[2] + 1, indexes[1]);
                    }
                }
                if (firstcell && ((firstcell as HTMLTableCellElement).colSpan > 1 || (firstcell as HTMLTableCellElement).rowSpan > 1)) {
                    this.cellRenderer.refresh(indexes[0] + (range[2] - range[0]) + 1, indexes[1], null, firstcell);
                }
            } else if (model.rowSpan > 1) {
                const prevTopIdx: number = range[2] + 1;
                if (indexes[0] + model.rowSpan - 1 >= prevTopIdx && indexes[0] < prevTopIdx) {
                    this.refreshPrevMerge(prevTopIdx, indexes[1], this.parent.viewport.topIndex + frozenRow);
                }
            }
        }
    }

    private refreshPrevMerge(prevTopIdx: number, colIndex: number, currTopIdx?: number): void {
        const td: HTMLTableCellElement
            = this.parent.getCell(prevTopIdx, colIndex, this.parent.getRow(currTopIdx ?
                currTopIdx : 0, null, colIndex)) as HTMLTableCellElement;
        if (td) {
            this.cellRenderer.refresh(prevTopIdx, colIndex, null, td);
        }
    }

    private checkColMerge(indexes: number[], range: number[], cell: Element, model: CellModel, firstcell?: Element): void {
        if (this.parent.scrollSettings.enableVirtualization && cell && (!isNullOrUndefined(model.rowSpan) ||
            !isNullOrUndefined(model.colSpan))) {
            let frozenCol: number = this.parent.frozenColCount(this.parent.getActiveSheet());
            if (indexes[1] === this.parent.viewport.leftIndex + frozenCol) {
                if (model.colSpan < 0) {
                    const e: CellRenderArgs = { td: cell as HTMLTableCellElement, colIdx: indexes[1], rowIdx: indexes[0], isFreezePane: true };
                    this.parent.notify(checkMerge, e);
                    if (e.insideFreezePane) { return; }
                    if (this.parent.viewport.leftIndex + frozenCol >= range[3]) {
                        const td: HTMLTableCellElement
                            = this.parent.getCell(indexes[0], indexes[3] + 1, this.parent.getRow(indexes[0], null, indexes[3] + 1)) as HTMLTableCellElement;
                        if (td) {
                            this.cellRenderer.refresh(indexes[0], range[3] + 1, null, td);
                        }
                    }
                }
                if (firstcell && ((firstcell as HTMLTableCellElement).colSpan >= 1 || (firstcell as HTMLTableCellElement).rowSpan >= 1)) {
                    this.cellRenderer.refresh(indexes[0], indexes[1] + (range[3] - range[1]) + 1, null, firstcell);
                }
            }
            else if (model.colSpan > 1) {
                if (indexes[1] + model.colSpan - 1 >= range[3] + 1 && indexes[1] < range[3] + 1) {
                    const td: HTMLTableCellElement
                        = this.parent.getCell(indexes[0], indexes[3]+1, this.parent.getRow(indexes[0], null, indexes[3]+1)) as HTMLTableCellElement;
                    if (td) {
                        this.cellRenderer.refresh(indexes[0], range[3] + 1, null, td);
                    }
                }
            }
        }
    }

    public toggleGridlines(): void {
        const sheetElem: Element = document.getElementById(this.parent.element.id + '_sheet');
        if (this.parent.getActiveSheet().showGridLines) {
            sheetElem.classList.remove('e-hide-gridlines');
        } else {
            sheetElem.classList.add('e-hide-gridlines');
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
                    this.getContentPanel().style[this.parent.enableRtl ? 'right' : 'left'] = '';
                }
                this.getScrollElement().style.left = this.getRowHeaderWidth(sheet) + 'px';
            }
        });
    }

    private updateHideHeaders(sheet: SheetModel, ele: HTMLElement): void {
        if (!sheet.showHeaders) { ele.classList.add('e-hide-headers'); }
    }

    public rowHeightChanged(args: { rowIdx: number, threshold: number, isHideShow?: boolean }): void {
        if (args.threshold || args.isHideShow) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (args.rowIdx < this.parent.frozenRowCount(sheet)) { this.setPanelHeight(sheet); }
        }
    }

    public colWidthChanged(args: { colIdx: number, threshold: number, isHideShow?: boolean }): void {
        if (args.threshold || args.isHideShow) {
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
        const elem: Element = (this.contentPanel.parentElement || this.contentPanel.nextElementSibling);
        return elem && elem.querySelector('.e-scroller') as HTMLElement;
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
        this.parent.on(rowHeightChanged, this.rowHeightChanged, this);
        this.parent.on(colWidthChanged, this.colWidthChanged, this);
        this.parent.on(spreadsheetDestroyed, this.removeEventListener, this);
    }

    /**
     * Clears the internal properties of Sheet module.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.headerPanel) { this.headerPanel.remove(); } this.headerPanel = null;
        if (this.contentPanel) { this.contentPanel.remove(); } this.contentPanel = null;
        if (this.col) { this.col.remove(); } this.col = null;
        this.rowRenderer = null;
        this.cellRenderer = null;
        this.colGroupWidth = null;
        this.parent = null;
    }

    private removeEventListener(): void {
        this.parent.off(created, this.triggerCreatedEvent);
        this.parent.off(rowHeightChanged, this.rowHeightChanged);
        this.parent.off(colWidthChanged, this.colWidthChanged);
        this.parent.off(spreadsheetDestroyed, this.removeEventListener);
    }
}
