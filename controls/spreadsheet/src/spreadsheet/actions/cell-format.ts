import { Spreadsheet } from '../../spreadsheet/index';
import { rowHeightChanged } from '../common/index';
import { CellFormatArgs, getRowHeight, setRowHeight, applyCellFormat, CellStyleModel } from '../../workbook/index';
import { SheetModel } from '../../workbook/index';
/**
 * CellFormat module allows to format the cell styles.
 */
export class CellFormat {
    private parent: Spreadsheet;
    private checkHeight: boolean = false;
    private row: HTMLElement;
    constructor(parent: Spreadsheet) {
        //Spreadsheet.Inject(WorkbookCellFormat);
        this.parent = parent;
        this.row = parent.createElement('tr', { className: 'e-row' });
        this.addEventListener();
    }
    private applyCellFormat(args: CellFormatArgs): void {
        let keys: string[] = Object.keys(args.style);
        if (args.lastCell && !this.row.childElementCount && !keys.length) { return; }
        let cell: HTMLElement = args.cell || this.parent.getCell(args.rowIdx, args.colIdx);
        if (cell) {
            Object.assign(cell.style, args.style);
            if (args.isHeightCheckNeeded) {
                if (!args.manualUpdate) {
                    if (this.isHeightCheckNeeded(args.style)) {
                        let clonedCell: HTMLElement = cell.cloneNode(true) as HTMLElement;
                        if (!clonedCell.innerHTML) { clonedCell.textContent = 'Test'; }
                        this.row.appendChild(clonedCell);
                    }
                    if (args.lastCell && this.row.childElementCount) {
                        let sheet: SheetModel = this.parent.getActiveSheet();
                        let row: HTMLElement = this.parent.getRow(args.rowIdx) || args.row;
                        let prevHeight: number = getRowHeight(sheet, args.rowIdx);
                        let height: number = this.getRowHeightOnInit();
                        if (height > prevHeight) {
                            row.style.height = `${height}px`;
                            if (sheet.showHeaders) {
                                (this.parent.getRow(args.rowIdx, this.parent.getRowHeaderTable()) || args.hRow).style.height =
                                    `${height}px`;
                            }
                            setRowHeight(sheet, args.rowIdx, height);
                        }
                        this.row.innerHTML = '';
                    }
                } else {
                    if (!this.checkHeight) { this.checkHeight = this.isHeightCheckNeeded(args.style, args.onActionUpdate); }
                    this.updateRowHeight(cell, args.rowIdx, args.lastCell, args.onActionUpdate);
                }
            }
        } else {
            this.updateRowHeight(cell, args.rowIdx, true, args.onActionUpdate);
        }
    }
    private updateRowHeight(cell: HTMLElement, rowIdx: number, isLastCell: boolean, onActionUpdate: boolean): void {
        if (this.checkHeight && isLastCell) {
            this.checkHeight = false;
            let sheet: SheetModel = this.parent.getActiveSheet();
            let row: HTMLElement = this.parent.getRow(rowIdx);
            if (!row) { return; }
            if (!cell) { cell = row.lastElementChild as HTMLElement; }
            let test: boolean = false;
            row.style.height = '';
            if (!cell.innerHTML) { cell.textContent = 'test'; test = true; }
            let height: number = Math.ceil(row.getBoundingClientRect().height);
            if (test) { cell.textContent = ''; }
            height = height < 20 ? 20 : height;
            let prevHeight: number = getRowHeight(sheet, rowIdx);
            let heightChanged: boolean = onActionUpdate ? height !== prevHeight : height > prevHeight ;
            if (heightChanged) {
                row.style.height = `${height}px`;
                if (sheet.showHeaders) {
                    this.parent.getRow(rowIdx, this.parent.getRowHeaderTable()).style.height = `${height}px`;
                }
                setRowHeight(sheet, rowIdx, height);
                this.parent.notify(rowHeightChanged, { rowIdx: rowIdx, threshold: height - prevHeight });
            } else {
                row.style.height = `${prevHeight}px`;
            }
        }
    }
    private isHeightCheckNeeded(style: CellStyleModel, onActionUpdate?: boolean): boolean {
        let keys: string[] = Object.keys(style);
        return (onActionUpdate ? keys.indexOf('fontSize') > -1 : keys.indexOf('fontSize') > -1
            && Number(style.fontSize.split('pt')[0]) > 12) || keys.indexOf('fontFamily') > -1;
    }
    private getRowHeightOnInit(): number {
        let table: HTMLElement = this.parent.createElement('table', { className: 'e-table e-test-table' });
        let tBody: HTMLElement = table.appendChild(this.parent.createElement('tbody'));
        tBody.appendChild(this.row);
        this.parent.element.appendChild(table);
        let height: number = Math.round(this.row.getBoundingClientRect().height);
        this.parent.element.removeChild(table);
        return height < 20 ? 20 : height;
    }
    private addEventListener(): void {
        this.parent.on(applyCellFormat, this.applyCellFormat.bind(this));
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.on(applyCellFormat, this.applyCellFormat.bind(this));
        }
    }
    /**
     * Destroy cell format module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null; this.row = null; this.checkHeight = null;
    }
    /**
     * Get the cell format module name.
     */
    public getModuleName(): string {
        return 'cellformat';
    }
}
