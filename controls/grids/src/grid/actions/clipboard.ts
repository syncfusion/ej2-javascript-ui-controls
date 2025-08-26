import { Browser, KeyboardEventArgs, remove, EventHandler, isUndefined, closest, classList, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, IAction, BeforeCopyEventArgs, BeforePasteEventArgs } from '../base/interface';
import { Column } from '../models/column';
import { parentsUntil, isGroupAdaptive } from '../base/util';
import * as events from '../base/constant';
import { ISelectedCell } from '../../index';
import * as literals from '../base/string-literals';
import { ServiceLocator } from '../services/service-locator';

/**
 * The `Clipboard` module is used to handle clipboard copy action.
 */
export class Clipboard implements IAction {
    //Internal variables
    private activeElement: Element;
    protected clipBoardTextArea: HTMLInputElement;
    private copyContent: string = '';
    private isSelect: boolean = false;
    private l10n: L10n;
    protected serviceLocator: ServiceLocator;
    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for the Grid clipboard module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the serviceLocator
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.keyPressed, this.keyDownHandler, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.onEmpty, this.initialEnd, this);
        EventHandler.add(this.parent.element, 'keydown', this.pasteHandler, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.keyPressed, this.keyDownHandler);
        this.parent.off(events.contentReady, this.initialEnd);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.onEmpty, this.initialEnd);
        EventHandler.remove(this.parent.element, 'keydown', this.pasteHandler);
    }

    private clickHandler(e: MouseEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        target = parentsUntil(target, 'e-rowcell') as HTMLElement;
    }

    private pasteHandler(e: KeyboardEvent): void {
        const grid: IGrid = this.parent;
        const isMacLike: boolean = /(Mac)/i.test(navigator.platform);
        const selectedRowCellIndexes: ISelectedCell[] = this.parent.getSelectedRowCellIndexes();
        if (!grid.isEdit && e.keyCode === 67 && isMacLike && e.metaKey) {
            this.copy();
        }
        if (selectedRowCellIndexes.length && e.keyCode === 86 && ((!isMacLike && e.ctrlKey) || (isMacLike && e.metaKey)) && !grid.isEdit) {
            const target: HTMLElement = closest(document.activeElement, '.' + literals.rowCell) as HTMLElement;
            if (!this.clipBoardTextArea || !target || !grid.editSettings.allowEditing || grid.editSettings.mode !== 'Batch' ||
                grid.selectionSettings.mode !== 'Cell' || grid.selectionSettings.cellSelectionMode === 'Flow') {
                return;
            }
            this.activeElement = document.activeElement;
            const x: number = window.scrollX;
            const y: number = window.scrollY;
            this.clipBoardTextArea.focus();
            setTimeout(
                () => {
                    (this.activeElement as HTMLInputElement).focus();
                    window.scrollTo(x, y);
                    this.paste(
                        this.clipBoardTextArea.value,
                        selectedRowCellIndexes[0].rowIndex,
                        selectedRowCellIndexes[0].cellIndexes[0]
                    );
                },
                isMacLike ? 100 : 10);
        }
    }

    /**
     * Paste data from clipboard to selected cells.
     *
     * @param {boolean} data - Specifies the date for paste.
     * @param {boolean} rowIndex - Specifies the row index.
     * @param {boolean} colIndex - Specifies the column index.
     * @returns {void}
     */
    public paste(data: string, rowIndex: number, colIndex: number): void {
        const grid: IGrid = this.parent;
        let cIdx: number = colIndex;
        let rIdx: number = rowIndex;
        let col: Column;
        let value: string;
        let isAvail: Element | boolean;
        const rows: string[] = data.split('\n');
        let cols: string[];
        for (let r: number = 0; r < rows.length; r++) {
            cols = rows[parseInt(r.toString(), 10)].split('\t');
            cIdx = colIndex;
            if ((r === rows.length - 1 && rows[parseInt(r.toString(), 10)] === '') || isUndefined(grid.getRowByIndex(rIdx))) {
                cIdx++;
                break;
            }
            for (let c: number = 0; c < cols.length; c++) {
                isAvail = grid.getCellFromIndex(rIdx, cIdx);
                if (!isAvail) {
                    cIdx++;
                    break;
                }
                col = grid.getColumnByIndex(cIdx);
                value = col.getParser() ? col.getParser()(cols[parseInt(c.toString(), 10)]) : cols[parseInt(c.toString(), 10)];
                if (col.allowEditing && !col.isPrimaryKey) {
                    const args: BeforePasteEventArgs = {
                        column: col,
                        data: value,
                        rowIndex: rIdx
                    };
                    this.parent.trigger(events.beforePaste, args);
                    rIdx = args.rowIndex;
                    if (!args.cancel) {
                        if (grid.editModule) {
                            if (col.type === 'number') {
                                this.parent.editModule.updateCell(rIdx, col.field, parseFloat(args.data as string));
                            } else {
                                grid.editModule.updateCell(rIdx, col.field, args.data);
                            }
                        }
                    }
                }
                cIdx++;
            }
            rIdx++;
        }
        grid.selectionModule.selectCellsByRange(
            { rowIndex: rowIndex, cellIndex: colIndex }, { rowIndex: rIdx - 1, cellIndex: cIdx - 1 });
        const cell: Element = this.parent.getCellFromIndex(rIdx - 1, cIdx - 1);
        if (cell) {
            classList(cell, ['e-focus', 'e-focused'], []);
        }
        this.clipBoardTextArea.value = '';
    }

    private initialEnd(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.parent.off(events.contentReady, this.initialEnd);
        this.clipBoardTextArea = this.parent.createElement('textarea', {
            className: 'e-clipboard',
            attrs: { tabindex: '-1', 'aria-label': this.l10n.getConstant('ClipBoard') }
        }) as HTMLInputElement;
        this.clipBoardTextArea.style.opacity = '0';
        this.parent.element.appendChild(this.clipBoardTextArea);
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        if (e.action === 'ctrlPlusC') {
            this.copy();
        } else if (e.action === 'ctrlShiftPlusH') {
            this.copy(true);
        }
    }

    protected setCopyData(withHeader?: boolean): void {
        if (window.getSelection().toString() === '') {
            this.clipBoardTextArea.value = this.copyContent = '';
            const rows: Element[] = this.parent.getDataRows();
            if (this.parent.selectionSettings && this.parent.selectionSettings.allowColumnSelection && this.parent.selectionModule &&
                this.parent.selectionModule.selectedColumnsIndexes.length) {
                if (withHeader) {
                    const selectedColumns: number[] = this.parent.selectionModule.selectedColumnsIndexes;
                    const headerColumns: HTMLElement[] = [];
                    for (let i: number = 0; i < selectedColumns.length; i++) {
                        const colIndex: number = selectedColumns[parseInt(i.toString(), 10)];
                        const headerCell: HTMLElement = this.parent.getColumnHeaderByIndex(colIndex) as HTMLElement;
                        if (headerCell && !headerCell.classList.contains('e-hide')) {
                            headerColumns.push(headerCell);
                        }
                    }
                    this.getCopyData(headerColumns, false, '\t', withHeader);
                    this.copyContent += '\n';
                }
                for (let j: number = 0; j < rows.length; j++) {
                    const columnCells: HTMLElement[] = [];
                    if (j > 0) {
                        this.copyContent += '\n';
                    }
                    columnCells.push(...[].slice.call(rows[parseInt(j.toString(), 10)].querySelectorAll('.e-columnselection:not(.e-hide)')));
                    this.getCopyData(columnCells, false, '\t', withHeader);
                }
            } else {
                if (this.parent.selectionSettings.mode !== 'Cell') {
                    let selectedIndexes: Object[] = this.parent.getSelectedRowIndexes().sort((a: number, b: number) => { return a - b; });
                    if (withHeader) {
                        const headerTextArray: string[] = [];
                        for (let i: number = 0; i < this.parent.getVisibleColumns().length; i++) {
                            headerTextArray[parseInt(i.toString(), 10)] = this.parent
                                .getVisibleColumns()[parseInt(i.toString(), 10)].headerText;
                        }
                        this.getCopyData(headerTextArray, false, '\t', withHeader);
                        this.copyContent += '\n';
                    }
                    if ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) && selectedIndexes.length > rows.length) {
                        selectedIndexes = [];
                        for (let i: number = 0; i < rows.length; i++) {
                            const row: Element = rows[parseInt(i.toString(), 10)] as HTMLTableRowElement;
                            if (row.getAttribute('aria-selected') === 'true') {
                                selectedIndexes.push(parseInt(row.getAttribute('data-rowindex'), 10));
                            }
                        }
                    }
                    for (let i: number = 0; i < selectedIndexes.length; i++) {
                        if (i > 0) {
                            this.copyContent += '\n';
                        }
                        const leftCols: HTMLElement[] = [];
                        let idx: number = selectedIndexes[parseInt(i.toString(), 10)] as number;
                        if (!isGroupAdaptive(this.parent) && (this.parent.enableVirtualization ||
                            (this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache) ||
                            (this.parent.groupSettings.columns.length && this.parent.groupSettings.enableLazyLoading))) {
                            idx = rows.map((m: Element) => m.getAttribute('data-rowindex')).indexOf(
                                selectedIndexes[parseInt(i.toString(), 10)].toString());
                        }
                        const currentRow: Element = rows[parseInt(idx.toString(), 10)];
                        if (!(isNullOrUndefined(currentRow))) {
                            leftCols.push(...[].slice.call(currentRow.querySelectorAll('.e-rowcell:not(.e-hide)')));
                            this.getCopyData(leftCols, false, '\t', withHeader);
                        }
                    }
                } else if (this.parent.selectionModule && this.parent.selectionModule.selectedRowCellIndexes.length)  {
                    const obj: { status: boolean, rowIndexes?: number[], colIndexes?: number[] } = this.checkBoxSelection();
                    if (obj.status) {
                        if (withHeader) {
                            const headers: HTMLElement[] = [];
                            for (let i: number = 0; i < obj.colIndexes.length; i++) {
                                const colHeader: HTMLElement = this.parent
                                    .getColumnHeaderByIndex(obj.colIndexes[parseInt(i.toString(), 10)]) as HTMLElement;
                                if (!colHeader.classList.contains('e-hide')) {
                                    headers.push(colHeader);
                                }
                            }
                            this.getCopyData(headers, false, '\t', withHeader);
                            this.copyContent += '\n';
                        }
                        for (let i: number = 0; i < obj.rowIndexes.length; i++) {
                            if (i > 0) {
                                this.copyContent += '\n';
                            }
                            const cells: HTMLElement[] = [].slice.call(rows[obj.rowIndexes[parseInt(i.toString(), 10)] as number].
                                querySelectorAll('.e-cellselectionbackground:not(.e-hide)'));
                            this.getCopyData(cells, false, '\t', withHeader);
                        }
                    } else {
                        this.getCopyData(
                            [].slice.call(this.parent.element.getElementsByClassName('e-cellselectionbackground')),
                            true, '\n', withHeader);
                    }
                }
            }
            const args: BeforeCopyEventArgs = {
                data: this.copyContent,
                cancel: false
            };
            this.parent.trigger(events.beforeCopy, args);
            if (args.cancel) {
                return;
            }
            this.clipBoardTextArea.value = this.copyContent = args.data;
            if (!Browser.userAgent.match(/ipad|ipod|iphone/i)) {
                this.clipBoardTextArea.select();
            } else {
                this.clipBoardTextArea.setSelectionRange(0, this.clipBoardTextArea.value.length);
            }
            this.isSelect = true;
        }
    }

    private getCopyData(cells: HTMLElement[] | string[], isCell: boolean, splitKey: string, withHeader?: boolean): void {
        const isElement: boolean = typeof cells[0] !== 'string';
        for (let j: number = 0; j < cells.length; j++) {
            if (withHeader && isCell) {
                const colIdx: number = parseInt((cells[parseInt(j.toString(), 10)] as HTMLElement).
                    getAttribute(literals.ariaColIndex), 10) - 1;
                this.copyContent += (this.parent.getColumns() as Column[])[parseInt(colIdx.toString(), 10)].headerText + '\n';
            }
            if (isElement) {
                if (!(cells[parseInt(j.toString(), 10)] as HTMLElement).classList.contains('e-hide')) {
                    this.copyContent += (cells[parseInt(j.toString(), 10)] as HTMLElement).innerText;
                }
            } else {
                this.copyContent += cells[parseInt(j.toString(), 10)];
            }
            if (j < cells.length - 1) {
                this.copyContent += splitKey;
            }
        }
    }

    /**
     * Copy selected rows or cells data into clipboard.
     *
     * @returns {void}
     * @param {boolean} withHeader - Specifies whether the column header data need to be copied or not.
     */
    public copy(withHeader?: boolean): void {
        if (document.queryCommandSupported('copy') && this.clipBoardTextArea) {
            this.setCopyData(withHeader);
            document.execCommand('copy');
            this.clipBoardTextArea.blur();
        }
        if (this.isSelect) {
            window.getSelection().removeAllRanges();
            this.isSelect = false;
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'clipboard';
    }

    /**
     * To destroy the clipboard
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.clipBoardTextArea) {
            remove(this.clipBoardTextArea);
            this.clipBoardTextArea = null;
        }
    }

    private checkBoxSelection(): { status: boolean, rowIndexes?: number[], colIndexes?: number[] } {
        const gridObj: IGrid = this.parent;
        let obj: { status: boolean, rowIndexes?: number[], colIndexes?: number[] } = { status: false };
        if (gridObj.selectionSettings.mode === 'Cell') {
            const rowCellIndxes: ISelectedCell[] = gridObj.getSelectedRowCellIndexes();
            let str: string;
            const rowIndexes: number[] = [];
            let i: number;
            for (i = 0; i < rowCellIndxes.length; i++) {
                if (rowCellIndxes[parseInt(i.toString(), 10)].cellIndexes.length) {
                    rowIndexes.push(rowCellIndxes[parseInt(i.toString(), 10)].rowIndex);
                }
                if (rowCellIndxes[parseInt(i.toString(), 10)].cellIndexes.length) {
                    if (!str) {
                        str = JSON.stringify(rowCellIndxes[parseInt(i.toString(), 10)].cellIndexes.sort());
                    }
                    if (str !== JSON.stringify(rowCellIndxes[parseInt(i.toString(), 10)].cellIndexes.sort())) {
                        break;
                    }
                }
            }
            rowIndexes.sort((a: number, b: number) => { return a - b; });
            if (i === rowCellIndxes.length) {
                obj = { status: true, rowIndexes: rowIndexes, colIndexes: rowCellIndxes[0].cellIndexes };
            }
        }
        return obj;
    }
}
