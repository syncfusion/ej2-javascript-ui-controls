import { Browser, KeyboardEventArgs, remove } from '@syncfusion/ej2-base';
import { IGrid, IAction, BeforeCopyEventArgs } from '../base/interface';
import { Column } from '../models/column';
import * as events from '../base/constant';
import { ISelectedCell } from '../../index';

/**
 * The `Clipboard` module is used to handle clipboard copy action.
 */
export class Clipboard implements IAction {
    //Internal variables 
    private clipBoardTextArea: HTMLInputElement;
    private copyContent: string = '';
    private isSelect: boolean = false;
    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for the Grid clipboard module
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.keyPressed, this.keyDownHandler, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.keyPressed, this.keyDownHandler);
    }

    private initialEnd(): void {
        this.parent.off(events.contentReady, this.initialEnd);
        this.clipBoardTextArea = this.parent.createElement('textarea', {
            className: 'e-clipboard',
            styles: 'opacity: 0',
            attrs: { readonly: 'true', tabindex: '-1', 'aria-label': 'clipboard' }
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

    private setCopyData(withHeader?: boolean): void {
        if (window.getSelection().toString() === '') {
            let isFrozen: number = this.parent.getFrozenColumns();
            this.clipBoardTextArea.value = this.copyContent = '';
            let mRows: Element[];
            let rows: Element[] = this.parent.getRows();
            if (isFrozen) {
                mRows = this.parent.getMovableDataRows();
            }
            if (this.parent.selectionSettings.mode !== 'Cell') {
                let selectedIndexes: Object[] = this.parent.getSelectedRowIndexes().sort((a: number, b: number) => { return a - b; });
                if (withHeader) {
                    let headerTextArray: string[] = [];
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
                    let cells: HTMLElement[] = [].slice.call(rows[selectedIndexes[i] as number].querySelectorAll('.e-rowcell'));
                    if (isFrozen) {
                        cells.push(...[].slice.call(mRows[selectedIndexes[i] as number].querySelectorAll('.e-rowcell')));
                    }
                    this.getCopyData(cells, false, '\t', withHeader);
                }
            } else {
                let obj: { status: boolean, rowIndexes?: number[], colIndexes?: number[] } = this.checkBoxSelection();
                if (obj.status) {
                    if (withHeader) {
                        let headers: HTMLElement[] = [];
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
                        let cells: HTMLElement[] = [].slice.call(rows[obj.rowIndexes[i] as number].
                            querySelectorAll('.e-cellselectionbackground'));
                        if (isFrozen) {
                            cells.push(...[].slice.call(mRows[obj.rowIndexes[i] as number].querySelectorAll('.e-cellselectionbackground')));
                        }
                        this.getCopyData(cells, false, '\t', withHeader);
                    }
                } else {
                    this.getCopyData(
                        [].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground')),
                        true, '\n', withHeader);
                }
            }
            let args: BeforeCopyEventArgs = {
                data: this.copyContent,
                cancel: false,
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
        let isElement: boolean =  typeof cells[0] !== 'string';
        for (let j: number = 0; j < cells.length; j++) {
            if (withHeader && isCell) {
                this.copyContent += (this.parent.getColumns() as Column[])
                [parseInt((cells[j] as HTMLElement).getAttribute('aria-colindex'), 10)].headerText + '\n';
            }
            if (isElement) {
                if (!(cells[j] as HTMLElement).classList.contains('e-hide')) {
                    this.copyContent += (cells[j] as HTMLElement).textContent;
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
     * @private
     */
    protected getModuleName(): string {
        return 'clipboard';
    }

    /**
     * To destroy the clipboard 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.clipBoardTextArea) { remove(this.clipBoardTextArea); }
    }

    private checkBoxSelection(): { status: boolean, rowIndexes?: number[], colIndexes?: number[] } {
        let gridObj: IGrid = this.parent;
        let obj: { status: boolean, rowIndexes?: number[], colIndexes?: number[] } = { status: false };
        if (gridObj.selectionSettings.mode === 'Cell') {
            let rowCellIndxes: ISelectedCell[] = gridObj.getSelectedRowCellIndexes();
            let str: string;
            let isBox: boolean;
            let rowIndexes: number[] = [];
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
            rowIndexes.sort();
            if (i === rowCellIndxes.length && rowIndexes[rowIndexes.length - 1] - rowIndexes[0] === rowIndexes.length - 1) {
                obj = { status: true, rowIndexes: rowIndexes, colIndexes: rowCellIndxes[0].cellIndexes };
            }
        }
        return obj;
    }
}
