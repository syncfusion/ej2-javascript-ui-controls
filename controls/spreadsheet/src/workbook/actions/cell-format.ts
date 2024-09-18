import { CellStyleModel, getRangeIndexes, setCellFormat, applyCellFormat, activeCellChanged, SetCellFormatArgs, isReadOnly } from '../common/index';
import { CellFormatArgs, getSwapRange, TextDecoration, textDecorationUpdate, ClearOptions, BeforeCellFormatArgs } from '../common/index';
import { CellStyleExtendedModel, BorderType, clear, getIndexesFromAddress, activeCellMergedRange, deleteHyperlink } from '../common/index';
import { SheetModel, Workbook, getSheetIndex, isHiddenRow, getSheet, getCell, CellModel, setCell, updateCFModel, getColumn, ColumnModel, RowModel } from '../index';
import { getRow, ExtendedRowModel, updateCell, CellUpdateArgs, isHeightCheckNeeded, workbookFormulaOperation } from '../index';
import { ExtendedWorkbook, ConditionalFormat, ConditionalFormatModel, applyCF, ApplyCFArgs, getColorCode } from '../index';

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
        let sheet: SheetModel; let rng: string | number[] = args.range;
        if (rng && typeof rng === 'string' && rng.indexOf('!') > -1) {
            rng = rng.split('!')[1]; sheet = this.parent.sheets[getSheetIndex(this.parent, (args.range as string).split('!')[0])];
        } else {
            sheet = this.parent.getActiveSheet();
        }
        if (rng === undefined) { rng = sheet.selectedRange; }
        const triggerEvt: boolean = typeof (rng) !== 'object' && args.onActionUpdate;
        const eventArgs: BeforeCellFormatArgs = {
            range: <string>rng, style: Object.assign({}, args.style), requestType: 'CellFormat' };
        if (args.borderType) {
            eventArgs.borderType = args.borderType;
        }
        const style: CellStyleModel = {};
        const indexes: number[] = typeof (eventArgs.range) === 'object' ? <number[]>eventArgs.range :
            getSwapRange(getRangeIndexes(<string>eventArgs.range));
        const isReadonlyCell: boolean = isReadOnly(getCell(indexes[0], indexes[1], sheet), getColumn(sheet, indexes[1]),
                                                   getRow(sheet, indexes[0]));
        const isReadonlyColumn: boolean = getColumn(sheet, indexes[1]) ? getColumn(sheet, indexes[1]).isReadOnly : false;
        const isReadonlyRow: boolean = getRow(sheet, indexes[0]) ? getRow(sheet, indexes[0]).isReadOnly : false;
        Object.assign(style, eventArgs.style, null, true);
        if (triggerEvt && !isReadonlyCell && !isReadonlyColumn && !isReadonlyRow) {
            this.parent.trigger('beforeCellFormat', eventArgs);
            this.parent.notify('actionBegin', { eventArgs: eventArgs, action: 'format' });
            if (eventArgs.cancel) { args.cancel = true; return; }
        }
        if (args.borderType) {
            this.setTypedBorder(sheet, args.style.border, indexes, args.borderType, args.onActionUpdate);
            delete args.style.border;
            delete eventArgs.style.border;
        }
        let i: number; let j: number;
        const props: CellUpdateArgs = { cell: null, rowIdx: 0, colIdx: 0, eventOnly: true, preventEvt: !triggerEvt };
        const triggerBeforeEvent: (cellStyle: CellStyleModel) => boolean = (cellStyle: CellStyleModel): boolean => {
            props.cell = { style: cellStyle };
            props.rowIdx = i;
            props.colIdx = j;
            return updateCell(this.parent, sheet, props);
        };
        if (eventArgs.style.borderTop !== undefined) {
            for (j = indexes[1]; j <= indexes[3]; j++) {
                i = indexes[0];
                if (!triggerBeforeEvent({ borderTop: eventArgs.style.borderTop })) {
                    if (!args.isUndoRedo) {
                        this.checkAdjacentBorder(sheet, 'borderBottom', i - 1, j);
                        this.checkFullBorder(sheet, 'borderBottom', i - 1, j);
                    }
                    this.checkFullBorder(sheet, 'borderTop', i, j);
                    this.setCellBorder(sheet, props.cell.style, i, j, args.onActionUpdate, j === indexes[3], null, null, args.isUndoRedo);
                }
            }
            delete eventArgs.style.borderTop;
        }
        if (eventArgs.style.borderBottom !== undefined) {
            let firstCell: CellModel; let lastCell: CellModel;
            for (j = indexes[1]; j <= indexes[3]; j++) {
                i = indexes[0];
                firstCell = getCell(i, j, sheet, false, true);
                if (firstCell.rowSpan > 0) {
                    lastCell = getCell(indexes[2], indexes[1], sheet, false, true);
                } else {
                    lastCell = getCell(indexes[2], indexes[3], sheet, false, true);
                }
                if (!(firstCell.rowSpan > 1 && lastCell.rowSpan < 0)) {
                    i = indexes[2];
                }
                if (!triggerBeforeEvent({ borderBottom: eventArgs.style.borderBottom })) {
                    if (!args.isUndoRedo) {
                        this.checkAdjacentBorder(sheet, 'borderTop', indexes[2] + 1, j);
                        this.checkFullBorder(sheet, 'borderTop', indexes[2] + 1, j);
                    }
                    this.checkFullBorder(sheet, 'borderBottom', indexes[2], j);
                    this.setCellBorder(sheet, props.cell.style, i, j, args.onActionUpdate, j === indexes[3], null, null, args.isUndoRedo);
                    this.setBottomBorderPriority(sheet, indexes[2], j);
                }
            }
            delete eventArgs.style.borderBottom;
        }
        if (eventArgs.style.borderLeft !== undefined) {
            for (let i: number = indexes[0]; i <= indexes[2]; i++) {
                j = indexes[1];
                if (!triggerBeforeEvent({ borderLeft: eventArgs.style.borderLeft })) {
                    if (!args.isUndoRedo) {
                        this.checkAdjacentBorder(sheet, 'borderRight', i, j - 1);
                        this.checkFullBorder(sheet, 'borderRight', i, j - 1);
                    }
                    this.checkFullBorder(sheet, 'borderLeft', i, j);
                    this.setCellBorder(sheet, props.cell.style, i, j, args.onActionUpdate, null, null, null, args.isUndoRedo);
                }
            }
            delete eventArgs.style.borderLeft;
        }
        if (eventArgs.style.borderRight !== undefined) {
            for (let i: number = indexes[0]; i <= indexes[2]; i++) {
                j = indexes[3];
                if (!triggerBeforeEvent({ borderRight: eventArgs.style.borderRight })) {
                    if (!args.isUndoRedo) {
                        this.checkAdjacentBorder(sheet, 'borderLeft', i, j + 1);
                        this.checkFullBorder(sheet, 'borderLeft', i, j + 1);
                    }
                    this.checkFullBorder(sheet, 'borderRight', i, j);
                    this.setCellBorder(sheet, props.cell.style, i, j, args.onActionUpdate, null, null, null, args.isUndoRedo);
                }
            }
            delete eventArgs.style.borderRight;
        }
        let border: string; let isFullBorder: boolean; let cell: CellModel;
        if (Object.keys(eventArgs.style).length) {
            const parent: ExtendedWorkbook = this.parent as ExtendedWorkbook;
            const activeSheet: boolean = parent.viewport && this.parent.getActiveSheet().id === sheet.id;
            const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
            const viewport: number[] = [frozenRow + parent.viewport.topIndex, frozenCol + parent.viewport.leftIndex,
                parent.viewport.bottomIndex, parent.viewport.rightIndex];
            let uiRefresh: boolean; let row: ExtendedRowModel; let checkHeight: boolean; let formatColor: string;
            for (i = indexes[0]; i <= indexes[2]; i++) {
                row = getRow(sheet, i) || {};
                if (row.isFiltered) {
                    continue;
                }
                uiRefresh = (i >= viewport[0] && i <= viewport[2]) || i < frozenRow;
                checkHeight = false;
                for (j = indexes[1]; j <= indexes[3]; j++) {
                    if (triggerBeforeEvent(eventArgs.style)) {
                        continue;
                    }
                    if (isFullBorder === undefined) {
                        if (eventArgs.style.border !== undefined) {
                            border = eventArgs.style.border; delete eventArgs.style.border; isFullBorder = true;
                        } else {
                            isFullBorder = false;
                        }
                    }
                    cell = getCell(i, j, sheet, false, true);
                    const readonlyColumn: ColumnModel = getColumn(sheet, j);
                    const readOnlyRow: RowModel = getRow(sheet, i);
                    if ((cell && cell.isReadOnly) || (readonlyColumn && readonlyColumn.isReadOnly) ||
                        (readOnlyRow && readOnlyRow.isReadOnly)) {
                        continue;
                    }
                    if (cell.rowSpan > 1 || cell.colSpan > 1) {
                        for (let k: number = i, rowSpanLen: number = cell.rowSpan > 1 ? i + (cell.rowSpan - 1) : i; k <= rowSpanLen; k++) {
                            for (let l: number = j, colSpanLen: number = cell.colSpan > 1 ? j + (cell.colSpan - 1) : j;
                                l <= colSpanLen; l++) {
                                if (isFullBorder) {
                                    this.setFullBorder(sheet, border, indexes, k, l, args.onActionUpdate, true);
                                }
                                this.setCellStyle(sheet, k, l, eventArgs.style);
                            }
                        }
                    }
                    if (isFullBorder) {
                        this.setFullBorder(sheet, border, indexes, i, j, args.onActionUpdate);
                    }
                    this.setCellStyle(sheet, i, j, eventArgs.style);
                    if (!activeSheet) {
                        continue;
                    }
                    if (uiRefresh && ((j >= viewport[1] && j <= viewport[3]) || j < frozenCol)) {
                        formatColor = null;
                        if (eventArgs.style.color && cell.format && cell.format.includes('[')) {
                            const colorCode: string = getColorCode(cell.format);
                            if (colorCode) {
                                formatColor = colorCode.toLowerCase();
                            }
                        }
                        this.parent.notify(applyCellFormat, <CellFormatArgs>{ style: eventArgs.style, rowIdx: i, colIdx: j,
                            lastCell: j === indexes[3], isHeightCheckNeeded: true, manualUpdate: true, onActionUpdate: args.onActionUpdate,
                            formatColor: formatColor });
                    } else if (!row.customHeight) {
                        checkHeight = checkHeight || isHeightCheckNeeded(eventArgs.style, args.onActionUpdate);
                        if (checkHeight) {
                            this.parent.notify(
                                applyCellFormat, <CellFormatArgs>{ rowIdx: i, colIdx: j, lastCell: j === indexes[3], checkHeight: true,
                                    outsideViewport: !uiRefresh, onActionUpdate: args.onActionUpdate });
                        }
                    }
                }
            }
        }
        if (isFullBorder) {
            eventArgs.style.border = border;
        }
        this.parent.setUsedRange(indexes[2], indexes[3]);
        if (args.refreshRibbon) {
            this.parent.notify(activeCellChanged, null);
        }
        if (triggerEvt && !isReadonlyCell && !isReadonlyColumn && !isReadonlyRow) {
            eventArgs.style = style;
            eventArgs.range = `${sheet.name}!${rng}`;
            this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'format' });
        }
    }
    private setBottomBorderPriority(sheet: SheetModel, rowIdx: number, colIdx: number): void {
        if (isHiddenRow(sheet, rowIdx + 1)) {
            const pIdx: number = this.skipHiddenRows(sheet, rowIdx + 1);
            const pCellStyle: string = this.parent.getCellStyleValue(['borderTop'], [pIdx, colIdx]).borderTop;
            if (pCellStyle !== '') {
                (sheet.rows[rowIdx as number].cells[colIdx as number].style as CellStyleExtendedModel).bottomPriority = true;
            }
        }
    }
    private setFullBorder(
        sheet: SheetModel, border: string, indexes: number[], i: number, j: number, actionUpdate: boolean, modelUpdate?: boolean): void {
        const style: CellStyleModel = {};
        if (i === indexes[0]) {
            this.checkAdjacentBorder(sheet, 'borderBottom', i - 1, j);
            this.checkFullBorder(sheet, 'borderBottom', i - 1, j);
        }
        if (j === indexes[1]) {
            this.checkAdjacentBorder(sheet, 'borderRight', i, j - 1); this.checkFullBorder(sheet, 'borderRight', i, j - 1);
        }
        if (j === indexes[3]) {
            this.checkAdjacentBorder(sheet, 'borderLeft', i, j + 1); this.checkFullBorder(sheet, 'borderLeft', i, j + 1);
        } else {
            this.checkAdjacentBorder(sheet, 'border', i, j + 1);
        }
        style.borderRight = border; style.borderTop = border; style.borderLeft = border;
        style.borderBottom = border; this.setCellBorder(sheet, style, i, j, actionUpdate, j === indexes[3], null, modelUpdate);
        if (i === indexes[2]) {
            this.checkAdjacentBorder(sheet, 'borderTop', i + 1, j); this.checkFullBorder(sheet, 'borderTop', i + 1, j);
            this.setBottomBorderPriority(sheet, i, j);
        } else {
            this.checkAdjacentBorder(sheet, 'border', i + 1, j);
        }
    }
    private checkAdjacentBorder(sheet: SheetModel, prop: string, rowIdx: number, colIdx: number): void {
        const style: CellStyleModel = {};
        if (this.parent.getCellStyleValue([prop], [rowIdx, colIdx])[`${prop}`] !== '') {
            style[`${prop}`] = undefined; this.setCellStyle(sheet, rowIdx, colIdx, style);
        }
    }
    private checkFullBorder(sheet: SheetModel, prop: string, rowIdx: number, colIdx: number): void {
        const border: string = this.parent.getCellStyleValue(['border'], [rowIdx, colIdx]).border;
        if (border !== '') {
            const style: CellStyleModel = { border: undefined };
            ['borderBottom', 'borderTop', 'borderLeft', 'borderRight'].forEach((value: string): void => {
                if (value !== prop) { style[`${value}`] = border; }
            });
            this.setCellStyle(sheet, rowIdx, colIdx, style);
        }
    }
    private textDecorationActionUpdate(args: { style: CellStyleModel, refreshRibbon?: boolean, cancel?: boolean }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const eventArgs: BeforeCellFormatArgs = { range: sheet.selectedRange, style: args.style, requestType: 'CellFormat' };
        const indexes: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
        const isReadonlyCell: boolean = isReadOnly(getCell(indexes[0], indexes[1], sheet), getColumn(sheet, indexes[1]),
                                                   getRow(sheet, indexes[0]));
        const isReadonlyColumn: boolean = getColumn(sheet, indexes[1]) ? getColumn(sheet, indexes[1]).isReadOnly : false;
        const isReadonlyRow: boolean = getRow(sheet, indexes[0]) ? getRow(sheet, indexes[0]).isReadOnly : false;
        if (!isReadonlyCell && !isReadonlyColumn && !isReadonlyRow) {
            this.parent.trigger('beforeCellFormat', eventArgs);
            this.parent.notify('actionBegin', { eventArgs: eventArgs, action: 'format' });
            if (eventArgs.cancel) { args.cancel = true; return; }
        }
        const value: TextDecoration = args.style.textDecoration; let changedValue: TextDecoration = value;
        const activeCellIndexes: number[] = getRangeIndexes(sheet.activeCell);
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
        if (!isReadonlyCell && !isReadonlyColumn && !isReadonlyRow) {
            eventArgs.range = sheet.name + '!' + <string>eventArgs.range;
            eventArgs.style.textDecoration = changedValue;
            this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'format' });
        }
    }
    private setTypedBorder(sheet: SheetModel, border: string, range: number[], type: BorderType, actionUpdate: boolean): void {
        let prevBorder: string;
        if (type === 'Outer') {
            for (let colIdx: number = range[1]; colIdx <= range[3]; colIdx++) {
                this.checkAdjacentBorder(sheet, 'borderBottom', range[0] - 1, colIdx);
                this.checkFullBorder(sheet, 'borderBottom', range[0] - 1, colIdx);
                this.setCellBorder(sheet, { borderTop: border }, range[0], colIdx, actionUpdate, colIdx === range[3]);
                this.checkAdjacentBorder(sheet, 'borderTop', range[2] + 1, colIdx);
                this.checkFullBorder(sheet, 'borderTop', range[2] + 1, colIdx);
                this.setCellBorder(sheet, { borderBottom: border }, range[2], colIdx, actionUpdate, colIdx === range[3], type);
                this.setBottomBorderPriority(sheet, range[2], colIdx);
            }
            for (let rowIdx: number = range[0]; rowIdx <= range[2]; rowIdx++) {
                this.checkAdjacentBorder(sheet, 'borderRight', rowIdx, range[1] - 1);
                this.checkFullBorder(sheet, 'borderRight', rowIdx, range[1] - 1);
                this.setCellBorder(sheet, { borderLeft: border }, rowIdx, range[1], actionUpdate);
                this.checkAdjacentBorder(sheet, 'borderLeft', rowIdx, range[3] + 1);
                this.checkFullBorder(sheet, 'borderLeft', rowIdx, range[3] + 1);
                this.setCellBorder(sheet, { borderRight: border }, rowIdx, range[3], actionUpdate, null, type);
            }
        } else if (type === 'Inner') {
            for (let i: number = range[0]; i <= range[2]; i++) {
                for (let j: number = range[1]; j <= range[3]; j++) {
                    const style: CellStyleModel = {};
                    prevBorder = this.parent.getCellStyleValue(['border'], [i, j]).border;
                    if (prevBorder !== '') {
                        style.border = undefined;
                        if (j === range[3] || j === range[1] || i === range[0] || i === range[2]) {
                            if (i === range[0]) { style.borderTop = prevBorder; }
                            if (i === range[2]) { style.borderBottom = prevBorder; }
                            if (j === range[3]) { style.borderRight = prevBorder; }
                            if (j === range[1]) { style.borderLeft = prevBorder; }
                        }
                    }
                    if (j !== range[3]) { style.borderRight = border; }
                    if (i !== range[0]) { style.borderTop = border; }
                    if (i !== range[2]) { style.borderBottom = border; }
                    if (j !== range[1]) { style.borderLeft = border; }
                    this.setCellBorder(sheet, style, i, j, actionUpdate, j === range[3]);
                }
            }
        } else if (type === 'Vertical') {
            for (let i: number = range[0]; i <= range[2]; i++) {
                for (let j: number = range[1]; j <= range[3]; j++) {
                    const style: CellStyleModel = { borderRight: border, borderLeft: border };
                    if (j === range[1]) {
                        this.checkAdjacentBorder(sheet, 'borderRight', i, j - 1);
                        this.checkFullBorder(sheet, 'borderRight', i, j - 1);
                    }
                    if (j === range[3]) {
                        this.checkAdjacentBorder(sheet, 'borderLeft', i, j + 1);
                        this.checkFullBorder(sheet, 'borderLeft', i, j + 1);
                    }
                    this.setCellBorder(sheet, style, i, j, actionUpdate);
                }
            }
        } else {
            for (let i: number = range[0]; i <= range[2]; i++) {
                for (let j: number = range[1]; j <= range[3]; j++) {
                    const style: CellStyleModel = { borderTop: border, borderBottom: border };
                    if (i === range[0]) {
                        this.checkAdjacentBorder(sheet, 'borderBottom', i - 1, j);
                        this.checkFullBorder(sheet, 'borderBottom', i - 1, j);
                    }
                    this.setCellBorder(sheet, style, i, j, actionUpdate, j === range[3]);
                    if (i === range[2]) {
                        this.checkAdjacentBorder(sheet, 'borderTop', i + 1, j); this.checkFullBorder(sheet, 'borderTop', i + 1, j);
                        this.setBottomBorderPriority(sheet, i, j);
                    }
                }
            }
        }
    }
    private setCellBorder(
        sheet: SheetModel, style: CellStyleModel, rowIdx: number, colIdx: number, actionUpdate: boolean, lastCell?: boolean, type?: string,
        modelUpdate?: boolean, isUndoRedo?: boolean): void {
        const cell: CellModel = getCell(rowIdx, colIdx, sheet);
        const column: ColumnModel = getColumn(sheet, colIdx);
        const row: RowModel = getRow(sheet, rowIdx);
        if ((cell && cell.isReadOnly) || (column && column.isReadOnly) || (row && row.isReadOnly)) {
            return;
        }
        this.setCellStyle(sheet, rowIdx, colIdx, style);
        if (!modelUpdate && this.parent.getActiveSheet().id === sheet.id) {
            if (type === 'Outer' && (style.borderBottom || style.borderRight)) {
                const mergeArgs: { range: number[] } = { range: [rowIdx, colIdx, rowIdx, colIdx] };
                this.parent.notify(activeCellMergedRange, mergeArgs);
                rowIdx = mergeArgs.range[0];
                colIdx = mergeArgs.range[1];
            }
            if (isUndoRedo) {
                if (style.borderTop === '' && this.parent.getCellStyleValue(['borderBottom'], [rowIdx - 1, colIdx]).borderBottom !== '') {
                    style.borderTop = this.parent.getCellStyleValue(['borderBottom'], [rowIdx - 1, colIdx]).borderBottom;
                }
                if (style.borderLeft === '' && this.parent.getCellStyleValue(['borderRight'], [rowIdx, colIdx - 1]).borderRight !== '') {
                    style.borderLeft = this.parent.getCellStyleValue(['borderRight'], [rowIdx, colIdx - 1]).borderRight;
                }
                if (style.borderRight === '' && this.parent.getCellStyleValue(['borderLeft'], [rowIdx, colIdx + 1]).borderLeft !== '') {
                    style.borderRight = this.parent.getCellStyleValue(['borderLeft'], [rowIdx, colIdx + 1]).borderLeft;
                }
            }
            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                style: style, rowIdx: rowIdx, colIdx: colIdx, onActionUpdate: actionUpdate, first: '', lastCell: lastCell,
                isHeightCheckNeeded: true, manualUpdate: true });
        }
    }
    private setCellStyle(sheet: SheetModel, rowIdx: number, colIdx: number, style: CellStyleModel): void {
        if (!sheet.rows[rowIdx as number]) {
            sheet.rows[rowIdx as number] = { cells: [] };
        } else if (!sheet.rows[rowIdx as number].cells) {
            sheet.rows[rowIdx as number].cells = [];
        }
        if (!sheet.rows[rowIdx as number].cells[colIdx as number]) {
            sheet.rows[rowIdx as number].cells[colIdx as number] = {};
        }
        if (!sheet.rows[rowIdx as number].cells[colIdx as number].style) {
            sheet.rows[rowIdx as number].cells[colIdx as number].style = {};
        }
        Object.assign(sheet.rows[rowIdx as number].cells[colIdx as number].style, style, null, true);
    }
    private skipHiddenRows(sheet: SheetModel, startIdx: number): number {
        startIdx++;
        if (isHiddenRow(sheet, startIdx)) {
            startIdx = this.skipHiddenRows(sheet, startIdx);
        }
        return startIdx;
    }
    private addEventListener(): void {
        this.parent.on(setCellFormat, this.format, this);
        this.parent.on(textDecorationUpdate, this.textDecorationActionUpdate, this);
        this.parent.on(clear, this.clearCellObj, this);
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setCellFormat, this.format);
            this.parent.off(textDecorationUpdate, this.textDecorationActionUpdate);
            this.parent.off(clear, this.clearCellObj);
        }
    }

    private clearCellObj(options: ClearOptions): void {
        const clrRange: string = options.range ? (options.range.indexOf('!') > 0) ? options.range.split('!')[1] : options.range.split('!')[0]
            : this.parent.getActiveSheet().selectedRange;
        const sheetIdx: number = (options.range && options.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent, options.range.split('!')[0]) : this.parent.activeSheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIdx);
        const range: number[] = getSwapRange(getIndexesFromAddress(clrRange));
        let sRowIdx: number = range[0];
        const eRowIdx: number = range[2];
        const cf: ConditionalFormat[] = sheet.conditionalFormats && sheet.conditionalFormats.length &&
            [].slice.call(sheet.conditionalFormats);
        const cfRule: ConditionalFormatModel[] = []; let cfRefreshAll: boolean;
        let evtArgs: { [key: string]: string | boolean | number[] | number };
        let sColIdx: number;
        let eColIdx: number; let isValExist: boolean;
        for (sRowIdx; sRowIdx <= eRowIdx; sRowIdx++) {
            sColIdx = range[1];
            eColIdx = range[3];
            for (sColIdx; sColIdx <= eColIdx; sColIdx++) {
                const cell: CellModel = getCell(sRowIdx, sColIdx, sheet);
                const isReadonlyCell: boolean = isReadOnly(cell, getColumn(sheet, sColIdx), getRow(sheet, sRowIdx));
                if (cell && !isReadonlyCell) {
                    switch (options.type) {
                    case 'Clear Formats':
                        delete cell.format; delete cell.rowSpan; delete cell.style;
                        delete cell.wrap; delete cell.colSpan; delete cell.formattedText;
                        break;
                    case 'Clear Contents':
                        if (cell.hyperlink) {
                            this.parent.notify(deleteHyperlink, { sheet: sheet, rowIdx: sRowIdx, colIdx: sColIdx, preventRefresh: true });
                        }
                        isValExist = !!(cell.value || cell.formula);
                        delete cell.value; delete cell.formula; delete cell.formattedText;
                        if (isValExist) {
                            evtArgs = { action: 'refreshCalculate', rowIndex: sRowIdx, colIndex: sColIdx, sheetIndex: sheetIdx };
                            this.parent.notify(workbookFormulaOperation, evtArgs);
                            if (cf && !cfRefreshAll) {
                                cfRefreshAll = <boolean>evtArgs.isFormulaDependent;
                                if (!cfRefreshAll) {
                                    updateCFModel(cf, cfRule, sRowIdx, sColIdx);
                                }
                            }
                        }
                        break;
                    case 'Clear Hyperlinks':
                        delete cell.hyperlink;
                        break;
                    case 'Clear All':
                        isValExist = !!(cell.value || cell.formula);
                        setCell(sRowIdx, sColIdx, sheet, {}, false);
                        if (isValExist) {
                            evtArgs = { action: 'refreshCalculate', rowIndex: sRowIdx, colIndex: sColIdx, sheetIndex: sheetIdx };
                            this.parent.notify(workbookFormulaOperation, evtArgs);
                            if (cf && !cfRefreshAll) {
                                cfRefreshAll = <boolean>evtArgs.isFormulaDependent;
                            }
                        }
                        break;
                    }
                }
            }
        }
        if ((cfRule.length || cfRefreshAll) && sheetIdx === this.parent.activeSheetIndex) {
            this.parent.notify(applyCF, <ApplyCFArgs>{ cfModel: !cfRefreshAll && cfRule, refreshAll: cfRefreshAll, isAction: true });
        }
    }
    /**
     * To destroy workbook cell format.
     *
     * @returns {void} - To destroy workbook cell format.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the workbook cell format module name.
     *
     *  @returns {void}
     */
    public getModuleName(): string {
        return 'workbookcellformat';
    }
}
