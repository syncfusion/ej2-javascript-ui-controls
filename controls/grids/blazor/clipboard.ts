import { Browser, KeyboardEventArgs, remove, EventHandler, isUndefined,createElement, closest, classList } from '@syncfusion/ej2-base';
import { parentsUntil } from './util';
import { SfGrid } from './sf-grid-fn';
import { Column, ISelectedCell } from './interfaces';

/**
 * The `Clipboard` module is used to handle clipboard copy action.
 */
export class Clipboard {
    //Internal variables 
    private activeElement: Element;
    protected clipBoardTextArea: HTMLInputElement;
    private copyContent: string = '';
    private isSelect: boolean = false;
    //Module declarations
    private parent: SfGrid;

    constructor(parent?: SfGrid) {
        this.parent = parent;
        this.clipBoardTextArea = createElement('textarea', {
            className: 'e-clipboard',
            styles: 'opacity: 0',
            attrs: { tabindex: '-1', 'aria-label': 'clipboard', 'aria-hidden':'true' }
        }) as HTMLInputElement;
        this.parent.element.appendChild(this.clipBoardTextArea);
    }

    public pasteHandler(): void {
        let grid: SfGrid = this.parent;
        let target: HTMLElement = closest(document.activeElement, '.e-rowcell') as HTMLElement;
        if (!target || !grid.options.allowEditing || grid.options.editMode !== 'Batch' ||
            grid.options.selectionMode !== 'Cell' || grid.options.cellSelectionMode === 'Flow') {
            return;
        }
        this.activeElement = document.activeElement;
        this.clipBoardTextArea.value = '';
        let x: number = window.scrollX;
        let y: number = window.scrollY;
        this.clipBoardTextArea.focus();
        setTimeout(
            () => {
                (this.activeElement as HTMLInputElement).focus();
                window.scrollTo(x, y);
                this.paste(
                    this.clipBoardTextArea.value,
                    this.getSelectedRowCellIndexes()[0].rowIndex,
                    this.getSelectedRowCellIndexes()[0].cellIndexes[0]
                    );
            },
            10);
    }

    public paste(data: string, rowIndex: number, colIndex: number): void {
        let grid: SfGrid = this.parent;
        let cIdx: number = colIndex;
        let rIdx: number = rowIndex;
        let col: Column;
        let value: string;
        let isAvail: Element | boolean;
        if (!grid.options.allowEditing || grid.options.editMode !== 'Batch' ||
            grid.options.selectionMode !== 'Cell' || grid.options.cellSelectionMode === 'Flow') {
            return;
        }
        let rows: string[] = data.split('\n');
        let cols: string[];
        let dataRows: HTMLElement[] = grid.getDataRows() as HTMLElement[];
        let mRows: HTMLElement[];
        let isFrozen: number = this.parent.options.frozenColumns;
        if (isFrozen) {
            mRows = grid.getMovableDataRows() as HTMLElement[];
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
                    let fTr: HTMLElement = dataRows[rIdx] as HTMLElement;
                    let mTr: HTMLElement = mRows[rIdx] as HTMLElement;
                    isAvail = !fTr.querySelector('[aria-colindex="' + cIdx + '"]') ?
                        mTr.querySelector('[aria-colindex="' + cIdx + '"]') : true;
                }
                if (!isAvail) {
                    cIdx++;
                    break;
                }
                col = grid.getColumnByIndex(cIdx);
                // value = col.getParser() ? col.getParser()(cols[c]) : cols[c];
                if (col.allowEditing && !col.isPrimaryKey && !col.template) {
                    // let args: BeforePasteEventArgs = {
                    //     column: col,
                    //     data: value,
                    //     rowIndex: rIdx
                    // };
                    // this.parent.trigger(events.beforePaste, args);
                    //rIdx = args.rowIndex;
                    //if (!args.cancel) {
                        if (grid.editModule) {
                            if (col.type === 'number') {
                               // grid.editModule.updateCell(rIdx, col.field, parseInt(args.data as string, 10));
                            } else {
                                //grid.editModule.updateCell(rIdx, col.field, args.data);
                            }
                        }
                    //}
                }
                cIdx++;
            }
            rIdx++;
        }
        //grid.selectionModule.selectCellsByRange(
          //  { rowIndex: rowIndex, cellIndex: colIndex }, { rowIndex: rIdx - 1, cellIndex: cIdx - 1 });
        let cell: Element = this.parent.getCellFromIndex(rIdx - 1, cIdx - 1);
        if (cell) {
            classList(cell, ['e-focus', 'e-focused'], []);
        }
    }

    protected setCopyData(withHeader?: boolean): void {
        if (window.getSelection().toString() === '') {
            let isFrozen: number = this.parent.options.frozenColumns;
            this.clipBoardTextArea.value = this.copyContent = '';
            let mRows: Element[];
            let rows: Element[] = this.parent.getRows();
            if (isFrozen) {
                mRows = this.parent.getMovableDataRows();
            }
            if (this.parent.options.selectionMode !== 'Cell') {
                //let selectedIndexes: Object[] = this.parent.getSelectedRowIndexes().sort((a: number, b: number) => { return a - b; });
                let selectedIndexes: number[] = this.parent.getSelectedRowIndexes();
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
            // let args: BeforeCopyEventArgs = {
            //     data: this.copyContent,
            //     cancel: false,
            // };
            // this.parent.trigger(events.beforeCopy, args);
            // if (args.cancel) {
            //     return;
            // }
            this.clipBoardTextArea.value = this.copyContent;
            if (!Browser.userAgent.match(/ipad|ipod|iphone/i)) {
                this.clipBoardTextArea.select();
            } else {
                this.clipBoardTextArea.setSelectionRange(0, this.clipBoardTextArea.value.length);
            }
            this.isSelect = true;
        }
    }

    private getCopyData(cells: HTMLElement[] | string[], isCell: boolean, splitKey: string, withHeader?: boolean): void {
        let isElement: boolean = typeof cells[0] !== 'string';
        for (let j: number = 0; j < cells.length; j++) {
            if (withHeader && isCell) {
                this.copyContent += (this.parent.getColumns() as Column[])
                [parseInt((cells[j] as HTMLElement).getAttribute('aria-colindex'), 10)].headerText + '\n';
            }
            if (isElement) {
                if (!(cells[j] as HTMLElement).classList.contains('e-hide')) {
                    if ((!(cells[j] as HTMLElement).classList.contains('e-gridchkbox')) &&
                        Object.keys((cells[j] as HTMLElement).querySelectorAll('.e-check')).length) {
                        this.copyContent += true;
                    } else if ((!(cells[j] as HTMLElement).classList.contains('e-gridchkbox')) &&
                        Object.keys((cells[j] as HTMLElement).querySelectorAll('.e-uncheck')).length) {
                        this.copyContent += false;
                    } else {
                        this.copyContent += (cells[j] as HTMLElement).innerText;
                    }
                }
            } else {
                this.copyContent += cells[j];
            }
            if (j < cells.length - 1) {
                this.copyContent += splitKey;
            }
        }
    }

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

    private getSelectedRowCellIndexes(): ISelectedCell[] {
        let gridObj: SfGrid = this.parent;
        let rowCellIndxes : ISelectedCell[] = [];
        let rows : Element[] = gridObj.getRows();
        let mrows: Element[];
        if(gridObj.options.frozenColumns) {
            mrows = gridObj.getMovableDataRows();
        }
        for(let i: number =0; i < rows.length; i++) {
            let tempCells: NodeList = rows[i].querySelectorAll('.e-cellselectionbackground');
            if(gridObj.options.frozenColumns && !tempCells.length){
                tempCells = mrows[i].querySelectorAll('.e-cellselectionbackground');
            }
            if(tempCells.length) {
                let cellIndexes : number[] = [];
                tempCells.forEach((element: HTMLElement) => {
                    cellIndexes.push(parseInt(element.getAttribute('aria-colindex')));
                })
                rowCellIndxes.push({rowIndex: i, cellIndexes : cellIndexes});
            }
        }
        return rowCellIndxes;
    }

    private checkBoxSelection(): { status: boolean, rowIndexes?: number[], colIndexes?: number[] } {
        let gridObj: SfGrid = this.parent;
        let rowCellIndxes : ISelectedCell[];
        let obj: { status: boolean, rowIndexes?: number[], colIndexes?: number[] } = { status: false };
        if (gridObj.options.selectionMode === 'Cell') {
            rowCellIndxes = this.getSelectedRowCellIndexes();
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
            rowIndexes.sort((a: number, b: number) => { return a - b; });
            if (i === rowCellIndxes.length && rowIndexes[rowIndexes.length - 1] - rowIndexes[0] === rowIndexes.length - 1) {
                obj = { status: true, rowIndexes: rowIndexes, colIndexes: rowCellIndxes[0].cellIndexes };
            }
        }
        return obj;
    }
}
