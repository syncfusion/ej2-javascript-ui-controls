import { CellStyleModel, getRangeIndexes, setCellFormat, applyCellFormat, activeCellChanged, SetCellFormatArgs, } from '../common/index';
import { CellFormatArgs, getSwapRange, TextDecoration, textDecorationUpdate } from '../common/index';
import { BeforeCellFormatArgs } from '../common/index';
import { SheetModel, setCell, Workbook, getSheetIndex } from '../base/index';
import { completeAction, beginAction } from '../../spreadsheet/common/event';

/**
 * Workbook Cell format.
 */
export class WorkbookCellFormat {
    private parent: Workbook;
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }
    private format(args: SetCellFormatArgs): void {
        let sheet: SheetModel;
        let rng: string | number[] = args.range;
        if (rng && typeof rng === 'string' && rng.indexOf('!') > -1) {
            rng = rng.split('!')[1];
            sheet = this.parent.sheets[getSheetIndex(this.parent, (args.range as string).split('!')[0])];
        } else {
            sheet = this.parent.getActiveSheet();
        }
        let eventArgs: BeforeCellFormatArgs;
        if (rng === undefined) { rng = sheet.selectedRange; }
        let triggerEvent: boolean = typeof (rng) !== 'object' && args.onActionUpdate;
        eventArgs = { range: <string>rng, style: args.style, requestType: 'CellFormat' };
        if (triggerEvent) {
            this.parent.trigger('beforeCellFormat', eventArgs);
            this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'format' });
            if (eventArgs.cancel) { args.cancel = true; return; }
        }
        let indexes: number[] = typeof (eventArgs.range) === 'object' ? <number[]>eventArgs.range :
            getSwapRange(getRangeIndexes(<string>eventArgs.range));
        for (let i: number = indexes[0]; i <= indexes[2]; i++) {
            for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                setCell(i, j, sheet, { style: eventArgs.style }, true);
                if (this.parent.getActiveSheet().id === sheet.id) {
                    this.parent.notify(applyCellFormat, <CellFormatArgs>{
                        style: eventArgs.style, rowIdx: i, colIdx: j, lastCell: j === indexes[3],
                        isHeightCheckNeeded: true, manualUpdate: true,
                        onActionUpdate: args.onActionUpdate
                    });
                }
            }
        }
        this.parent.setUsedRange(indexes[2], indexes[3]);
        if (args.refreshRibbon) { this.parent.notify(activeCellChanged, getRangeIndexes(sheet.activeCell)); }
        this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        if (triggerEvent) {
            eventArgs.range = sheet.name + '!' + <string>rng;
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'format' });
        }
    }
    private textDecorationActionUpdate(args: { style: CellStyleModel, refreshRibbon?: boolean, cancel?: boolean }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let eventArgs: BeforeCellFormatArgs = { range: sheet.selectedRange, style: args.style, requestType: 'CellFormat' };
        this.parent.trigger('beforeCellFormat', eventArgs);
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'format' });
        if (eventArgs.cancel) { args.cancel = true; return; }
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
        this.format({
            style: { textDecoration: changedValue }, range: activeCellIndexes, refreshRibbon: args.refreshRibbon,
            onActionUpdate: true
        });
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
                            changedStyle.textDecoration = 'none';
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
                this.format({
                    style: changedStyle, range: [i, j, i, j], refreshRibbon: args.refreshRibbon,
                    onActionUpdate: true
                });
            }
        }
        eventArgs.range = sheet.name + '!' + <string>eventArgs.range;
        this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'format' });
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
