import { Browser, KeyboardEventArgs, remove, EventHandler, isUndefined, closest, classList } from '@syncfusion/ej2-base';
import { IGrid, IAction, BeforeCopyEventArgs, BeforePasteEventArgs } from '../base/interface';
import { Column } from '../models/column';
import { parentsUntil } from '../base/util';
import * as events from '../base/constant';
import { ISelectedCell } from '../../index';
import * as literals from '../base/string-literals';

/**
 * The `Clipboard` module is used to handle clipboard copy action.
 */
export class Clipboard implements IAction {
    //Internal variables
    private activeElement: Element;
    protected clipBoardTextArea: HTMLInputElement;
    private copyContent: string = '';
    private isSelect: boolean = false;
    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for the Grid clipboard module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
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
        if (e.keyCode === 67 && isMacLike && e.metaKey && !grid.isEdit) {
            this.copy();
        }
        if (e.keyCode === 86 && (e.ctrlKey || (isMacLike && e.metaKey)) && !grid.isEdit) {
            const target: HTMLElement = closest(document.activeElement, '.' + literals.rowCell) as HTMLElement;
            if (!target || !grid.editSettings.allowEditing || grid.editSettings.mode !== 'Batch' ||
                grid.selectionSettings.mode !== 'Cell' || grid.selectionSettings.cellSelectionMode === 'Flow') {
                return;
            }
            this.activeElement = document.activeElement;
            this.clipBoardTextArea.value = '';
            const x: number = window.scrollX;
            const y: number = window.scrollY;
            this.clipBoardTextArea.focus();
            setTimeout(
                () => {
                    (this.activeElement as HTMLInputElement).focus();
                    window.scrollTo(x, y);
                    this.paste(
                        this.clipBoardTextArea.value,
                        this.parent.getSelectedRowCellIndexes()[0].rowIndex,
                        this.parent.getSelectedRowCellIndexes()[0].cellIndexes[0]
                    );
                },
                10);
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
        if (!grid.editSettings.allowEditing || grid.editSettings.mode !== 'Batch' ||
            grid.selectionSettings.mode !== 'Cell' || grid.selectionSettings.cellSelectionMode === 'Flow') {
            return;
        }
        const rows: string[] = data.split('\n');
        let cols: string[];
        const dataRows: HTMLElement[] = grid.getDataRows() as HTMLElement[];
        let mRows: HTMLElement[];
        let frRows: HTMLElement[];
        const isFrozen: boolean = this.parent.isFrozenGrid();
        if (isFrozen) {
            mRows = grid.getMovableDataRows() as HTMLElement[];
            if (grid.getFrozenRightColumnsCount()) {
                frRows = grid.getFrozenRightDataRows() as HTMLElement[];
            }
        }

        for (let r: number = 0; r < rows.length; r++) {
            cols = rows[r].split('\t');
            cIdx = colIndex;
            if ((r === rows.length - 1 && rows[r] === '') || isUndefined(grid.getRowByIndex(rIdx))) {
                cIdx++;
                break;
            }
            for (let c: number = 0; c < cols.length; c++) {
                isAvail = grid.getCellFromIndex(rIdx, cIdx);
                if (isFrozen) {
                    const fTr: HTMLElement = dataRows[rIdx];
                    const mTr: HTMLElement = mRows[rIdx];
                    isAvail = !fTr.querySelector('[aria-colindex="' + cIdx + '"]') ?
                        mTr.querySelector('[aria-colindex="' + cIdx + '"]') : true;
                    if (frRows && !isAvail) {
                        const frTr: HTMLElement = frRows[rIdx];
                        isAvail = frTr.querySelector('[aria-colindex="' + cIdx + '"]');
                    }
                }
                if (!isAvail) {
                    cIdx++;
                    break;
                }
                col = grid.getColumnByIndex(cIdx);
                value = col.getParser() ? col.getParser()(cols[c]) : cols[c];
                if (col.allowEditing && !col.isPrimaryKey && !col.template) {
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
    }

    private initialEnd(): void {
        this.parent.off(events.contentReady, this.initialEnd);
        this.clipBoardTextArea = this.parent.createElement('textarea', {
            className: 'e-clipboard',
            styles: 'opacity: 0',
            attrs: { tabindex: '-1', 'aria-label': 'clipboard' }
        }) as HTMLInputElement;
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
            const isFrozen: boolean = this.parent.isFrozenGrid();
            this.clipBoardTextArea.value = this.copyContent = '';
            let mRows: Element[];
            let frRows: Element[];
            const rows: Element[] = this.parent.getRows();
            if (isFrozen) {
                mRows = this.parent.getMovableDataRows();
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    frRows = this.parent.getFrozenRightRows();
                }
            }
            if (this.parent.selectionSettings.mode !== 'Cell') {
                const selectedIndexes: Object[] = this.parent.getSelectedRowIndexes().sort((a: number, b: number) => { return a - b; });
                if (withHeader) {
                    const headerTextArray: string[] = [];
                    for (let i: number = 0; i < this.parent.getVisibleColumns().length; i++) {
                        headerTextArray[i] = this.parent.getVisibleColumns()[i].headerText;
                    }
                    this.getCopyData(headerTextArray, false, '\t', withHeader);
                    this.copyContent += '\n';
                }
                for (let i: number = 0; i < selectedIndexes.length; i++) {
                    if (i > 0) {
                        this.copyContent += '\n';
                    }
                    const cells: HTMLElement[] = [].slice.call(rows[selectedIndexes[i] as number].
                        querySelectorAll('.e-rowcell:not(.e-hide)'));
                    if (isFrozen) {
                        cells.push(...[].slice.call(mRows[selectedIndexes[i] as number].querySelectorAll('.e-rowcell:not(.e-hide)')));
                        if (frRows) {
                            cells.push(...[].slice.call(frRows[selectedIndexes[i] as number].querySelectorAll('.e-rowcell:not(.e-hide)')));
                        }
                    }
                    this.getCopyData(cells, false, '\t', withHeader);
                }
            } else {
                const obj: { status: boolean, rowIndexes?: number[], colIndexes?: number[] } = this.checkBoxSelection();
                if (obj.status) {
                    if (withHeader) {
                        const headers: HTMLElement[] = [];
                        for (let i: number = 0; i < obj.colIndexes.length; i++) {
                            headers.push(this.parent.getColumnHeaderByIndex(obj.colIndexes[i]) as HTMLElement);
                        }
                        this.getCopyData(headers, false, '\t', withHeader);
                        this.copyContent += '\n';
                    }
                    for (let i: number = 0; i < obj.rowIndexes.length; i++) {
                        if (i > 0) {
                            this.copyContent += '\n';
                        }
                        const cells: HTMLElement[] = [].slice.call(rows[obj.rowIndexes[i] as number].
                            getElementsByClassName('e-cellselectionbackground'));
                        if (isFrozen) {
                            cells.push(...[].slice.call(mRows[obj.rowIndexes[i] as number]
                                .getElementsByClassName('e-cellselectionbackground')));
                            if (frRows) {
                                cells.push(...[].slice.call(frRows[obj.rowIndexes[i] as number]
                                    .getElementsByClassName('e-cellselectionbackground')));
                            }
                        }
                        this.getCopyData(cells, false, '\t', withHeader);
                    }
                } else {
                    this.getCopyData(
                        [].slice.call(this.parent.element.getElementsByClassName('e-cellselectionbackground')),
                        true, '\n', withHeader);
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
                const colIdx: number = parseInt((cells[j] as HTMLElement).getAttribute(literals.ariaColIndex), 10);
                this.copyContent += (this.parent.getColumns() as Column[])[colIdx].headerText + '\n';
            }
            if (isElement) {
                if (!(cells[j] as HTMLElement).classList.contains('e-hide')) {
                    this.copyContent += (cells[j] as HTMLElement).innerText;
                }
            } else {
                this.copyContent += cells[j];
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
        if (document.queryCommandSupported('copy')) {
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
        if (this.clipBoardTextArea) { remove(this.clipBoardTextArea); }
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
                if (rowCellIndxes[i].cellIndexes.length) {
                    rowIndexes.push(rowCellIndxes[i].rowIndex);
                }
                if (rowCellIndxes[i].cellIndexes.length) {
                    if (!str) {
                        str = JSON.stringify(rowCellIndxes[i].cellIndexes.sort());
                    }
                    if (str !== JSON.stringify(rowCellIndxes[i].cellIndexes.sort())) {
                        break;
                    }
                }
            }
            rowIndexes.sort((a: number, b: number) => { return a - b; });
            if (i === rowCellIndxes.length && rowIndexes[rowIndexes.length - 1] - rowIndexes[0] === rowIndexes.length - 1) {
                obj = { status: true, rowIndexes: rowIndexes, colIndexes: rowCellIndxes[0].cellIndexes };
            }
        }
        return obj;
    }
}
