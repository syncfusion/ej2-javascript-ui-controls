import { CellStyleModel, getRangeIndexes, setCellFormat, applyCellFormat, activeCellChanged } from '../common/index';
import { CellFormatArgs, getSwapRange, TextDecoration, textDecorationUpdate } from '../common/index';
import { SheetModel,  setCell, Workbook } from '../base/index';
/**
 * Workbook Cell format.
 */
export class WorkbookCellFormat {
    private parent: Workbook;
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }
    private format(args: { style?: CellStyleModel, range?: string | number[], refreshRibbon?: boolean, onActionUpdate?: boolean }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (args.range === undefined) { args.range = sheet.selectedRange; }
        let indexes: number[] = args.range.length === 4 ? args.range as number[] : getSwapRange(getRangeIndexes(args.range as string));
        for (let i: number = indexes[0]; i <= indexes[2]; i++) {
            for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                setCell(i, j, sheet, { style: args.style }, true);
                this.parent.notify(applyCellFormat, <CellFormatArgs>{
                    style: args.style, rowIdx: i, colIdx: j, lastCell: j === indexes[3], isHeightCheckNeeded: true, manualUpdate: true,
                    onActionUpdate: args.onActionUpdate });
            }
        }
        this.parent.setUsedRange(indexes[2], indexes[3]);
        if (args.refreshRibbon) { this.parent.notify(activeCellChanged, getRangeIndexes(sheet.activeCell)); }
        this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
    }
    private textDecorationActionUpdate(args: { style: CellStyleModel, refreshRibbon?: boolean }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let indexes: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
        let value: TextDecoration = args.style.textDecoration; let changedValue: TextDecoration = value;
        let activeCellIndexes: number[] = getRangeIndexes(sheet.activeCell);
        let cellValue: TextDecoration = this.parent.getCellStyleValue(['textDecoration'], activeCellIndexes).textDecoration;
        let changedStyle: CellStyleModel; let removeProp: boolean = false;
        if (cellValue === 'underline') {
            changedValue = value === 'underline' ? 'none' : 'underline line-through';
        } else if (cellValue === 'line-through') {
            changedValue = value === 'line-through' ? 'none' : 'underline line-through';
        } else if (cellValue === 'underline line-through') {
            changedValue = value === 'underline' ? 'line-through' : 'underline'; removeProp = true;
        }
        if (changedValue === 'none') { removeProp = true; }
        this.format({ style: { textDecoration: changedValue }, range: activeCellIndexes, refreshRibbon: args.refreshRibbon,
            onActionUpdate: true });
        for (let i: number = indexes[0]; i <= indexes[2]; i++) {
            for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                if (i === activeCellIndexes[0] && j === activeCellIndexes[1]) { continue; }
                changedStyle = {};
                cellValue = this.parent.getCellStyleValue(['textDecoration'], [i, j]).textDecoration;
                if (cellValue === 'none') {
                    if (removeProp) { continue; }
                    changedStyle.textDecoration = value;
                } else if (cellValue === 'underline' || cellValue === 'line-through') {
                    if (removeProp) {
                        if (value === cellValue) {
                            changedStyle.textDecoration =  'none';
                        } else {
                            continue;
                        }
                    } else {
                        changedStyle.textDecoration = value !== cellValue ? 'underline line-through' : value;

                    }
                } else if (cellValue === 'underline line-through') {
                    if (removeProp) {
                        changedStyle.textDecoration = value === 'underline' ? 'line-through' : 'underline';
                    } else {
                        continue;
                    }
                }
                this.format({ style: changedStyle, range: [i, j, i, j], refreshRibbon: args.refreshRibbon,
                    onActionUpdate: true });
            }
        }
    }
    private addEventListener(): void {
        this.parent.on(setCellFormat, this.format, this);
        this.parent.on(textDecorationUpdate, this.textDecorationActionUpdate, this);
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setCellFormat, this.format);
            this.parent.off(textDecorationUpdate, this.textDecorationActionUpdate);
        }
    }
    /**
     * To destroy workbook cell format.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the workbook cell format module name.
     */
    public getModuleName(): string {
        return 'workbookcellformat';
    }
}
