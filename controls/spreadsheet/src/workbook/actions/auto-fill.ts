import { isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
import { Workbook, CellModel, getCell, SheetModel, isHiddenRow, isHiddenCol, getSheet, isFilterHidden } from '../base/index';
import { getSwapRange, getRangeIndexes, setAutoFill, AutoFillDirection, AutoFillType, getFillInfo, getSheetIndexFromAddress } from './../common/index';
import { checkIsFormula, getColumnHeaderText, isNumber, ConditionalFormatModel, updateCFModel } from './../common/index';
import { updateCell, intToDate, dateToInt, applyCF, ApplyCFArgs, CellUpdateArgs, ConditionalFormat } from './../common/index';

/**
 * WorkbookAutoFill module allows to perform auto fill functionalities.
 */

export class WorkbookAutoFill {
    private parent: Workbook;
    private fillInfo: {
        fillType: AutoFillType;
        disableItems: string[];
    };
    private uniqueOBracket: string = String.fromCharCode(129);
    private uniqueCBracket: string = String.fromCharCode(130);
    private uniqueDOperator: string = String.fromCharCode(136);
    private uniqueModOperator: string = String.fromCharCode(137);
    private uniqueCSeparator: string = String.fromCharCode(131);
    private uniqueCOperator: string = String.fromCharCode(132);
    private uniqueExpOperator: string = String.fromCharCode(140);
    private uniqueGTOperator: string = String.fromCharCode(141);
    private uniqueConcateOperator: string = String.fromCharCode(138);
    private uniqueEqualOperator: string = String.fromCharCode(139);
    private uniqueLTOperator: string = String.fromCharCode(142);
    private uniqueMOperator: string = String.fromCharCode(135);
    private uniquePOperator: string = String.fromCharCode(133);
    private uniqueSOperator: string = String.fromCharCode(134);
    /**
     * Constructor for the workbook AutoFill module.
     *
     * @param {Workbook} parent - Specifies the workbook.
     * @private
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    private getFillInfo(options: { dataRange: number[], fillRange: number[], direction: AutoFillDirection, fillType: AutoFillType }):
    { fillType: AutoFillType, disableItems: string[] } {
        let val: string = '';
        let isStringType: boolean = true;
        let fillType: AutoFillType = 'CopyCells';
        const disableItems: string[] = [];
        const isVFill: boolean = ['Down', 'Up'].indexOf(options.direction) > -1;
        const data: CellModel[] = this.getRangeData({ range: options.dataRange, sheetIdx: this.parent.activeSheetIndex });
        const len: number = data.join().replace(/,/g, '').length;
        let i: number = this.isRange(options.dataRange) && len ? data.length : 1;
        while (i--) {
            val = data[i as number] && !isNullOrUndefined(data[i as number].value) ? data[i as number].value : '';
            if (isNumber(val) || checkIsFormula(val) || isNumber(val[val.length - 1])) {
                isStringType = false;
                fillType = this.parent.autoFillSettings.fillType;
                break;
            }
        }
        if (!len || isStringType) {
            disableItems.push('Fill Series');
            fillType = (options.fillType === 'FillSeries') ? fillType : options.fillType;
        }
        if (!isVFill || (isVFill && options.dataRange[1] !== options.dataRange[3])) {
            disableItems.push('Flash Fill');  // for flash fill option
        }
        return { fillType: fillType, disableItems: disableItems };
    }

    private isRange(range: number[]): boolean {
        return range && (range[0] !== range[2] || range[1] !== range[3]);
    }

    private autoFill(options: { dataRange: string, fillRange: string, direction: AutoFillDirection, fillType: AutoFillType,
        isFillOptClick?: boolean, isLockedCell ?: boolean }): void {
        if (!options.dataRange || !options.fillRange || !options.direction || !this.parent.allowEditing ||
            (this.parent.getActiveSheet().isProtected && options.isLockedCell)) {
            return;
        }
        const autoFillOptions: { dataRange: number[], fillRange: number[], fillType: AutoFillType, direction: AutoFillDirection, sheetIndex: number } = {
            dataRange: null, fillRange: null, fillType: null, direction: null, sheetIndex: getSheetIndexFromAddress(this.parent, options.dataRange) };
        const dataRangeIndices: number[] = getSwapRange(getRangeIndexes(options.dataRange));
        const fillRangeIndices: number[] = getSwapRange(getRangeIndexes(options.fillRange));
        this.fillInfo = this.getFillInfo({ dataRange: dataRangeIndices, fillRange: fillRangeIndices, fillType: options.fillType,
            direction: options.direction });
        autoFillOptions.dataRange = dataRangeIndices;
        autoFillOptions.fillRange = fillRangeIndices;
        autoFillOptions.direction = options.direction;
        autoFillOptions.fillType = options.fillType || this.fillInfo.fillType;
        this.fillInfo.fillType = options.isFillOptClick ? options.fillType : this.fillInfo.fillType;
        switch (options.fillType) {
        case 'FillSeries':
        case 'FillWithoutFormatting':
            this.fillSeries(autoFillOptions);
            break;
        case 'CopyCells':
        case 'FillFormattingOnly':
            this.copyCells(autoFillOptions);
            break;
        }
    }

    private fillSeries(options: { dataRange: number[], fillRange: number[], fillType: AutoFillType, direction: AutoFillDirection, sheetIndex: number }): void {
        let val: string | string; let plen: number;
        let patterns: PatternInfo[] | number[]; let patrn: PatternInfo | number;
        let pRanges: { patternRange: number[], fillRange: number[] }; let patrnRange: number[];
        let fillRange: number[]; let data: CellModel[];
        let temp: string; let dlen: number;
        let j: number; let k: number;
        let l: number; let tlen: number;
        let tot: number; let hasRef: boolean;
        let cells: { rowIndex: number, colIndex: number }[]; let clen: number;
        let cellIdx: { rowIndex: number, colIndex: number }; let cellProps: CellModel = {};
        let i: number = 0;
        let prevCellData: CellModel;
        const sheetIndex: number = isUndefined(options.sheetIndex) ? this.parent.activeSheetIndex : options.sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        const dminr: number = options.dataRange[0]; const dminc: number = options.dataRange[1]; const dmaxr: number = options.dataRange[2];
        const dmaxc: number = options.dataRange[3];
        const fminr: number = options.fillRange[0]; const fminc: number = options.fillRange[1]; const fmaxr: number = options.fillRange[2];
        const fmaxc: number = options.fillRange[3];
        const isVFill: boolean = ['Down', 'Up'].indexOf(options.direction) > -1;
        const isRFill: boolean = ['Up', 'Left'].indexOf(options.direction) > -1;
        const len: number = isVFill ? dmaxc - dminc : dmaxr - dminr; const withFrmt: boolean = options.fillType === 'FillSeries';
        let prop: CellUpdateArgs; let cfRefreshAll: boolean;
        const cf: ConditionalFormat[] = sheet.conditionalFormats && sheet.conditionalFormats.length &&
            [].slice.call(sheet.conditionalFormats);
        const cfRule: ConditionalFormatModel[] = [];
        while (i <= len) {
            pRanges = this.updateFillValues(isVFill, dminr, dminc, dmaxr, dmaxc, fminr, fminc, fmaxr, fmaxc, i);
            patrnRange = pRanges.patternRange;
            fillRange = pRanges.fillRange;
            patterns = this.getPattern(patrnRange, { isRFill: isRFill, isVFill: isVFill });
            data = this.getRangeData({ range: patrnRange, sheetIdx: sheetIndex });
            dlen = data.length;
            if (!patterns) {
                return;
            }
            plen = patterns.length;
            cells = this.getSelectedRange(sheet, { rowIndex: fillRange[0], colIndex: fillRange[1] }, { rowIndex: fillRange[2],
                colIndex: fillRange[3] });
            clen = cells.length;
            if (isRFill) {
                cells = cells.reverse();
                patterns = patterns.reverse();
                patterns = this.ensurePattern(patterns as PatternInfo[]);
                data = data.reverse();
            }
            j = 0;
            while (j < clen) {
                cellIdx = cells[j as number];
                patrn = patterns[j % plen] as PatternInfo | number;
                if (isNumber(patrn as number)) {
                    patrn = patterns[patrn as number];
                }
                l = j % dlen;
                switch (patrn['type']) {
                case 'number':
                    val = (this.round(patrn['regVal'].a + (patrn['regVal'].b * patrn['i']), 5)).toString();
                    patrn = patrn as PatternInfo;
                    if (patrn.dataVal) {
                        if (patrn.copy === undefined) {
                            patrn.copy = (patrn.val as number[]).length > 2;
                            if (patrn.copy) {
                                for (let m: number = 2; m < (patrn.val as number[]).length; m++) {
                                    patrn.copy = Math.abs(this.round(patrn['regVal'].a + (patrn['regVal'].b * m), 5)) !==
                                        patrn.val[m as number];
                                    if (patrn.copy) { break; }
                                }
                            }
                        }
                        val = patrn.copy ? (data[l as number] && !isNullOrUndefined(data[l as number].value) ? data[l as number].value : '') :
                            (patrn.start ? Math.abs(Number(val)) + patrn.dataVal : patrn.dataVal + Math.abs(Number(val)));
                    }
                    if (isRFill) {
                        patrn['i']--;
                    }
                    else {
                        patrn['i']++;
                    }
                    break;
                case 'string':
                    // eslint-disable-next-line no-case-declarations
                    const newVal: number = patrn['i'] % patrn['val'].length;
                    val = patrn['val'][newVal as number];
                    patrn['i']++;
                    break;
                case 'formula':
                    hasRef = false;
                    val = '=';
                    k = 0;
                    tlen = patrn['val'].length;
                    while (k < tlen) {
                        temp = patrn['val'][k as number];
                        if (typeof temp === 'object') {
                            hasRef = true;
                            tot = this.round(temp['a'] + (temp['b'] * patrn['i']), 5);
                            if (tot < 1) {
                                val += '#REF!';
                            }
                            else {
                                val += isVFill ? temp['c'] + (temp['b'] ? tot : '$' + tot) : (temp['b'] ? getColumnHeaderText(tot) : (temp['c'] as string).substring(0, (temp['c'] as string).search(/\d/)) + '$' + getColumnHeaderText(tot)) + (temp['c'] as string).trim();
                            }
                        }
                        else {
                            val += temp;
                        }
                        k++;
                    }
                    if (hasRef && isRFill) {
                        patrn['i']--;
                    }
                    else {
                        patrn['i']++;
                    }
                    break;
                case 'time':
                    val = (patrn['regVal'].a + (patrn['regVal'].b * patrn['i'])).toString();
                    if (isRFill) {
                        patrn['i']--;
                    }
                    else {
                        patrn['i']++;

                    }
                    break;
                }
                prevCellData = getCell(cellIdx.rowIndex, cellIdx.colIndex, sheet, false, true);
                if (withFrmt) {
                    Object.assign(cellProps, data[l as number], null, true);
                } else {
                    cellProps.style = prevCellData.style;
                    cellProps.format = prevCellData.format;
                    cellProps.wrap = prevCellData.wrap;
                    cellProps.rowSpan = prevCellData.rowSpan;
                    cellProps.colSpan = prevCellData.colSpan;
                }
                cellProps.value = val;
                if (checkIsFormula(val)) {
                    cellProps.formula = val;
                }
                prop = { cell: cellProps, rowIdx: cellIdx.rowIndex, colIdx: cellIdx.colIndex, valChange: true,
                    uiRefresh: true, pvtExtend: true, skipFormatCheck: true };
                updateCell(this.parent, sheet, prop);
                if (cf && !cfRefreshAll) {
                    cfRefreshAll = prop.isFormulaDependent;
                    if (!cfRefreshAll) {
                        updateCFModel(cf, cfRule, cellIdx.rowIndex, cellIdx.colIndex);
                    }
                }
                cellProps = {};
                j++;
            }
            i++;
        }
        if (cfRule.length || cfRefreshAll) {
            this.parent.notify(applyCF, <ApplyCFArgs>{ cfModel: !cfRefreshAll && cfRule, refreshAll: cfRefreshAll, isAction: true });
        }
    }

    private copyCells(
        options: { dataRange: number[], fillRange: number[], fillType: AutoFillType, direction: AutoFillDirection,
            sheetIndex: number }): void {
        let i: number = 0; let j: number;
        let k: number; let patrnRange: number[];
        let fillRange: number[];
        let pRanges: { patternRange: number[], fillRange: number[] };
        let data: CellModel[]; let dlen: number;
        let cells: {
            rowIndex: number;
            colIndex: number;
        }[];
        let clen: number; let cellProperty: CellModel = {};
        let cellIdx: { rowIndex: number, colIndex: number };
        const dMinR: number = options.dataRange[0];
        const dMinC: number = options.dataRange[1];
        const dMaxR: number = options.dataRange[2];
        const dMaxC: number = options.dataRange[3];
        const fMinR: number = options.fillRange[0];
        const fMinC: number = options.fillRange[1];
        const fMaxR: number = options.fillRange[2];
        const fMaxC: number = options.fillRange[3];
        const isVFill: boolean = ['Down', 'Up'].indexOf(options.direction) > -1;
        const isRFill: boolean = ['Up', 'Left'].indexOf(options.direction) > -1;
        const len: number = isVFill ? dMaxC - dMinC : dMaxR - dMinR;
        const sheetIndex: number = isUndefined(options.sheetIndex) ? this.parent.activeSheetIndex : options.sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        const formatOnly: boolean = options.fillType === 'FillFormattingOnly';
        let prevCellData: CellModel; let cfRefreshAll: boolean; let prop: CellUpdateArgs;
        const cf: ConditionalFormat[] = sheet.conditionalFormats && sheet.conditionalFormats.length &&
            [].slice.call(sheet.conditionalFormats);
        const cfRule: ConditionalFormatModel[] = [];
        while (i <= len) {
            pRanges = this.updateFillValues(isVFill, dMinR, dMinC, dMaxR, dMaxC, fMinR, fMinC, fMaxR, fMaxC, i);
            patrnRange = pRanges.patternRange;
            fillRange = pRanges.fillRange;
            data = this.getRangeData({ range: patrnRange, sheetIdx: sheetIndex });
            dlen = data.length;
            cells = this.getSelectedRange(sheet, { rowIndex: fillRange[0], colIndex: fillRange[1] },
                                          { rowIndex: fillRange[2], colIndex: fillRange[3] });
            clen = cells.length;
            j = 0;
            if (isRFill) {
                cells = cells.reverse();
            }
            while (j < clen) {
                k = j % dlen;
                cellIdx = cells[j as number];
                if (formatOnly) {
                    prevCellData = getCell(cellIdx.rowIndex, cellIdx.colIndex, sheet);
                }
                Object.assign(cellProperty, data[k as number], null, true);
                if (formatOnly) {
                    cellProperty.value = prevCellData.value;
                    cellProperty.formula = prevCellData.formula;
                }
                prop = { cell: cellProperty, rowIdx: cellIdx.rowIndex, colIdx: cellIdx.colIndex, valChange: true, uiRefresh: true,
                    pvtExtend: true };
                updateCell(this.parent, sheet, prop);
                if (cf && !cfRefreshAll) {
                    cfRefreshAll = prop.isFormulaDependent;
                    if (!cfRefreshAll) {
                        updateCFModel(cf, cfRule, cellIdx.rowIndex, cellIdx.colIndex);
                    }
                }
                cellProperty = {};
                j++;
            }
            i++;
        }
        if (cfRule.length || cfRefreshAll) {
            this.parent.notify(applyCF, <ApplyCFArgs>{ cfModel: !cfRefreshAll && cfRule, refreshAll: cfRefreshAll, isAction: true });
        }
    }

    private updateFillValues(isVFill: boolean, dminr: number, dminc: number, dmaxr: number, dmaxc: number, fminr: number, fminc: number,
                             fmaxr: number, fmaxc: number, i: number): { patternRange: number[], fillRange: number[] } {
        let pStart: { rowIndex: number, colIndex: number };
        let pEnd: { rowIndex: number, colIndex: number };
        let fStart: { rowIndex: number, colIndex: number };
        let fEnd: { rowIndex: number, colIndex: number };
        if (isVFill) {
            pStart = { rowIndex: dminr, colIndex: dminc + i };
            pEnd = { rowIndex: dmaxr, colIndex: dminc + i };
            fStart = { rowIndex: fminr, colIndex: fminc + i };
            fEnd = { rowIndex: fmaxr, colIndex: fminc + i };
        }
        else {
            pStart = { rowIndex: dminr + i, colIndex: dminc };
            pEnd = { rowIndex: dminr + i, colIndex: dmaxc };
            fStart = { rowIndex: fminr + i, colIndex: fminc };
            fEnd = { rowIndex: fminr + i, colIndex: fmaxc };
        }
        const patternRange: number[] = [pStart.rowIndex, pStart.colIndex, pEnd.rowIndex, pEnd.colIndex];
        const fillRange: number[] = [fStart.rowIndex, fStart.colIndex, fEnd.rowIndex, fEnd.colIndex];
        return { patternRange: patternRange, fillRange: fillRange };
    }

    private getType(val: string, isTime: boolean): string {
        let type: string;
        if (isTime)
        {type = 'time'; }
        else if (checkIsFormula(val))
        {type = 'formula'; }
        else if (isNumber(val))
        {type = 'number'; }
        return type || 'string';
    }

    private getDataPattern(range: number[]): { val: string[] | number[], type: string }[] {
        let val: string[] | string | number;
        let type: string;
        let i: number = 0;
        let obj: { val: string[] | number[], type: string, dataVal?: string, start?: boolean } = { val: null, type: null };
        const patrn: { val: string[] | number[], type: string }[] = [];
        const data: CellModel[] = this.getRangeData({ range: range, sheetIdx: this.parent.activeSheetIndex });
        const dlen: number = data.length; let isStartNum: boolean;
        if (dlen) {
            let count: number; let dataVal: string;
            const minusOperator: Function = (data: string): string => {
                return !isStartNum && data && data[data.length - 1] === '-' ? data.slice(0, data.length - 1) : data;
            };
            while (i < dlen) {
                val = data[i as number] ? (data[i as number].formula ? data[i as number].formula :
                    (isNullOrUndefined(data[i as number].value) ? '' : data[i as number].value)) : '';
                type = this.getType(val as string, data[i as number] && data[i as number].format === 'h:mm:ss AM/PM');
                dataVal = '';
                if (type === 'string') {
                    isStartNum = false;
                    if (isNumber(val[0])) {
                        count = 0;
                        do {
                            count++;
                        } while (isNumber(val[count as number]));
                        if (val[count as number] === ' ') {
                            isStartNum = true; type = 'number';
                            dataVal = (val as string).slice(count, (val as string).length); val = Number((val as string).slice(0, count));
                        }
                    }
                    val = val as string;
                    if (!isStartNum && isNumber(val[val.length - 1])) {
                        count = 1;
                        do {
                            count++;
                        } while (isNumber(val[val.length - count]));
                        type = 'number';
                        count -= 1;
                        dataVal = val.slice(0, val.length - count); val = Number(val.slice(val.length - count, val.length));
                        if (obj.dataVal && obj.dataVal !== dataVal && obj.dataVal === minusOperator(dataVal)) { dataVal = obj.dataVal; }
                    }
                }
                if (i === 0) {
                    obj = { val: [val as string], type: type };
                    if (dataVal) { obj.dataVal = dataVal; obj.start = isStartNum; }
                } else if (type === obj.type && (!obj.dataVal || minusOperator(obj.dataVal) === minusOperator(dataVal))) {
                    (obj.val as string[]).push(val as string);
                } else {
                    patrn.push(obj);
                    obj = { val: [val as string], type: type };
                    if (dataVal) { obj.dataVal = dataVal; obj.start = isStartNum; }
                }
                i++;
            }
            patrn.push(obj);
            return patrn;
        } else {
            return [{ val: null, type: null }];
        }
    }

    private getPredictionValue(args: number[], isTime?: boolean): { a: number, b: number } {
        let i: number = 0;
        let sumx: number = 0;
        let sumy: number = 0;
        let sumxy: number = 0;
        let sumxx: number = 0;
        let a: number = 0; let b: number = 0;
        const n: number = args.length;
        while (i < n) {
            sumx = sumx + i;
            sumy = sumy + Number(args[i as number]);
            sumxy = sumxy + (i * Number(args[i as number]));
            sumxx = sumxx + (i * i);
            i++;
        }
        if (!isTime) {
            a = this.round(((sumy * sumxx) - (sumx * sumxy)) / ((n * sumxx) - (sumx * sumx)), 5);
            b = this.round(((n * sumxy) - (sumx * sumy)) / ((n * sumxx) - (sumx * sumx)), 5);
        } else {
            a = ((sumy * sumxx) - (sumx * sumxy)) / ((n * sumxx) - (sumx * sumx));
            b = ((n * sumxy) - (sumx * sumy)) / ((n * sumxx) - (sumx * sumx));
        }
        return { a: a, b: b };
    }
    private getPattern(range: number[], options: { isRFill: boolean, isVFill: boolean }): PatternInfo[] | number[] {
        let j: number;
        let idx: number;
        let temp: PatternInfo | number[];
        let regVal: { a: number, b: number };
        let diff: number;
        let len: number;
        let i: number = 0;
        const pattern: PatternInfo[] | number[] = [];
        const patrns: { val?: number[] | string[], type: string, dataVal?: string, start?: boolean }[] = this.getDataPattern(range);
        const plen: number = patrns.length;
        let patrn: { val?: number[] | string[] | string | number, type?: string, isInPattern?: boolean, dataVal?: string, start?: boolean };
        if (patrns) {
            while (i < plen) {
                patrn = patrns[i as number];
                switch (patrn.type) {
                case 'number':
                    idx = pattern.length;
                    len = (patrn.val as number[]).length;
                    diff = options.isRFill ? -1 : len;
                    if (len === 1) {
                        const newVal: number = parseFloat(patrn.val[0] as string) + 1;
                        (patrn.val as number[]).push(newVal);
                    }
                    regVal = this.getPredictionValue(patrn.dataVal ? (patrn.val as number[]).slice(0, 2) : patrn.val as number[]);
                    temp = { regVal: regVal, type: patrn.type, i: diff };
                    if (patrn.dataVal) {
                        temp.dataVal = patrn.dataVal; temp.val = patrn.val; temp.start = patrn.start;
                    }
                    (pattern as PatternInfo[]).push(temp);
                    j = 1;
                    while (j < len) {
                        pattern.push(idx);
                        j++;
                    }
                    break;
                case 'string':
                    idx = pattern.length;
                    temp = { val: patrn.val as number[], type: patrn.type, i: 0 };
                    (pattern as PatternInfo[]).push(temp);
                    j = 1;
                    len = (patrn.val as number[]).length;
                    while (j < len) {
                        pattern.push(idx);
                        j++;
                    }
                    break;
                case 'formula':
                    len = (patrn.val as number[]).length;
                    patrn = this.getFormulaPattern(patrn.val as string[], options);
                    diff = options.isRFill ? -1 : len;
                    if (patrn.isInPattern) {
                        idx = pattern.length;
                        temp = { val: patrn.val as string[], type: 'formula', i: diff };
                        (pattern as PatternInfo[]).push(temp);
                        j = 1;
                        while (j < len) {
                            pattern.push(idx);
                            j++;
                        }
                    }
                    else {
                        j = 0;
                        diff = options.isRFill ? -1 : 1;
                        while (j < len) {
                            (pattern as PatternInfo[]).push({ val: patrn.val[j as number], type: 'formula', i: diff });
                            j++;
                        }
                    }
                    break;
                case 'time':
                    idx = pattern.length;
                    len = (patrn.val as number[]).length;
                    diff = options.isRFill ? -1 : 1;
                    if (len === 1) {
                        const oldTimeVal: Date = intToDate(patrn.val[0]);
                        const newTimeVal: number = dateToInt(new Date(oldTimeVal.getTime() + 60 * 60000), true);
                        (patrn.val as number[]).push(newTimeVal);
                    }
                    regVal = this.getPredictionValue(patrn.val as number[], true);
                    temp = { regVal: regVal, type: patrn.type, i: diff };
                    (pattern as PatternInfo[]).push(temp);
                    j = 1;
                    while (j < len) {
                        pattern.push(idx);
                        j++;
                    }
                    break;
                default:
                    break;
                }
                i++;
            }
            return pattern;
        } else { return [{ regVal: null }]; }
    }

    private isCellReference(text: string): string | boolean {
        return /^[a-z]{1,3}\d{1,7}$/gi.test(text) ? 'relative' : (/^\$[a-z]{1,3}\$\d{1,7}$/gi.test(text) ? 'absolute' : (/^((\$[a-z]{1,3})\d{1,7}|[a-z]{1,3}(\$\d{1,7}))$/gi.test(text) ? 'mixed' : false));
    }

    private round(value: string | number, round: string | number): number {
        return Number(Math.round(parseFloat(value + 'e' + round)) + 'e-' + round);
    }

    private getRangeData(options: { range: number[], sheetIdx: number }): CellModel[] {
        const arr: CellModel[] = [];
        const sheet: SheetModel = this.parent.getActiveSheet();
        let minR: number = options.range[0];
        let minC: number = options.range[1];
        const maxR: number = options.range[2];
        const maxC: number = options.range[3];
        const minCol: number = minC;
        let cell: CellModel;
        while (minR <= maxR) {
            if (isHiddenRow(sheet, minR)) { minR++; continue; }
            minC = minCol;
            while (minC <= maxC) {
                if (isHiddenCol(sheet, minC)) { minC++; continue; }
                cell = getCell(minR, minC, sheet);
                arr.push(cell);
                minC++;
            }
            minR++;
        }
        return arr;
    }

    private getFormulaPattern(data: string[], options: { isRFill: boolean, isVFill: boolean }):
    { isInPattern: boolean, val?: number[] | string[] | number | string } {
        let j: number; let temp: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let patrn: any; const patrns: any = [];
        let i: number = 0; const len: number = data.length; let cRfrType: string;
        while (i < len) {
            patrns.push(this.parseFormula(data[i as number]));
            i++;
        }
        const isInPatrn: boolean = this.isInPattern(patrns, options.isVFill);
        if (isInPatrn) {
            patrn = patrns[0];
            i = patrn.length;
            while (i--) {
                temp = patrn[i as number];
                cRfrType = this.isCellReference(temp) as string;
                if (cRfrType && (cRfrType !== 'absolute'))
                {patrn[i as number] = this.getCellRefPrediction(temp, options, null, cRfrType); }
            }
            return { isInPattern: isInPatrn, val: patrn };
        }
        else {
            i = 0;
            while (i < len) {
                patrn = patrns[i as number];
                j = patrn.length;
                while (j--) {
                    temp = patrn[j as number];
                    cRfrType = this.isCellReference(temp.trim()) as string;
                    if (cRfrType && (cRfrType !== 'absolute')) {
                        patrns[i as number][j as number] = this.getCellRefPrediction(temp, options, len, cRfrType);
                    }
                }
                i++;
            }
            return { isInPattern: isInPatrn, val: patrns };
        }
    }

    private generateColCount(text: string): number {
        let colCount: number = 0;
        const newText: string[] | string = text.split('').reverse().join('');
        for (let i: number = newText.length - 1; i >= 0; i--) {
            colCount += (text[i as number].charCodeAt(parseInt(newText[i as number], 10)) - 64) * (Math.pow(26, i));
        }
        return colCount;
    }

    private getCellRefPrediction(text: string, options: { isRFill: boolean, isVFill: boolean }, length: number,
                                 rfrType: string): number[] | number | object {
        text = text.toUpperCase();
        const eStr: string = '';
        const aRegx: RegExp = new RegExp('[a-z$]', 'gi'); const nRegx: RegExp = new RegExp('[0-9$]', 'g');
        let str: string = options.isVFill ? text.replace(nRegx, eStr) : text.replace(aRegx, eStr);
        let temp: number[] | number | object = options.isVFill ? Number(text.replace(aRegx, eStr)) :
            this.generateColCount(text.replace(nRegx, eStr).trim());
        let dollarPosition: number = null;
        const arr: number[] = [temp];
        let isColAbslt: boolean = text[0] === '$';
        if(!isColAbslt && text.includes('$') && text.trim()[0] === '$') {
            for (let idx: number = 1; idx < text.length; idx++) {
                if (text[idx as number] === '$') {
                    dollarPosition = idx;
                    isColAbslt = true;
                    break;
                }
            }
        }
        if (length && length !== 1)
        {arr.push(temp + length); }
        else
        {arr.push(temp + 1); }
        temp = this.getPredictionValue(arr);
        if (rfrType && (rfrType === 'mixed')) {
            if (isColAbslt === options.isVFill)
            {
                if (dollarPosition) {
                    str = str.substring(0, dollarPosition) + '$' + str.substring(dollarPosition);
                } else {
                    str = '$' + str;
                }
            }
            else {
                temp['b'] = 0;
            }
        }
        temp['c'] = str;
        return temp;
    }

    private isInPattern(patrn: string[], isVFill: boolean): boolean {
        let oldPatrn: string;
        let olen: number;
        let newPatrn: string;
        let nlen: number; let oldStr: string; let newStr: string; let oldInt: number; let newInt: number; const eStr: string = '';
        let i: number = 0; let j: number = 1; const plen: number = patrn.length; const nregx: RegExp = new RegExp('[0-9$]', 'g');
        const aregx: RegExp = new RegExp('[a-z$]', 'gi');
        if (plen === 1)
        {return false; }
        while (j < plen) {
            oldPatrn = patrn[i as number];
            newPatrn = patrn[j as number];
            olen = oldPatrn.length;
            nlen = newPatrn.length;
            if (olen !== nlen)
            {return false; }
            else {
                while (olen--) {
                    oldStr = oldPatrn[olen as number];
                    newStr = newPatrn[olen as number];
                    if (this.isCellReference(oldStr) === this.isCellReference(newStr)) {
                        if (isVFill) {
                            oldInt = Number(oldStr.replace(aregx, eStr));
                            newInt = Number(newStr.replace(aregx, eStr));
                        }
                        else {
                            oldInt = this.generateColCount(oldStr.replace(nregx, eStr));
                            newInt = this.generateColCount(newStr.replace(nregx, eStr));
                        }
                        if (oldInt !== newInt - 1)
                        {return false; }
                    }
                    else if (oldStr !== newStr)
                    {return false; }
                }
            }
            i++;
            j++;
        }
        return true;
    }
    private parseFormula(formula: string | string[]): string[] {
        // eslint-disable-next-line @typescript-eslint/tslint/config
        let temp: string; let str; let i: number = 0; const arrValues = [];
        formula = this.markSpecialChar((formula as string).replace('=', ''));
        formula = formula.split(/\(|\)|=|\^|>|<|,|:|\+|-|\*|\/|%|&/g);
        const len: number = formula.length;
        while (i < len) {
            temp = formula[i as number];
            if (!temp) {
                i++;
                continue;
            }
            if (temp.length === 1)
            {arrValues.push(this.isUniqueChar(temp) ? this.getUniqueCharVal(temp) : temp); }
            else {
                str = temp[0];
                if (temp.indexOf('!') > 0) {
                    if (this.isUniqueChar(str)) {
                        arrValues.push(this.getUniqueCharVal(str));
                        temp = temp.substr(1);
                    }
                    str = temp.indexOf('!') + 1;
                    arrValues.push(temp.substr(0, str));
                    arrValues.push(temp.substr(str));
                }
                else if (this.isUniqueChar(str)) {
                    arrValues.push(this.getUniqueCharVal(str));
                    arrValues.push(temp.substr(1));
                }
                else
                {arrValues.push(temp); }
            }
            i++;
        }
        return arrValues;
    }

    private getUniqueCharVal(str: string): string {
        switch (str) {
        case this.uniqueSOperator:
            return '-';
        case this.uniqueOBracket:
            return '(';
        case this.uniqueCOperator:
            return ':';
        case this.uniqueCBracket:
            return ')';
        case this.uniqueCSeparator:
            return ',';
        case this.uniqueGTOperator:
            return '>';
        case this.uniqueLTOperator:
            return '<';
        case this.uniqueMOperator:
            return '*';
        case this.uniqueDOperator:
            return '/';
        case this.uniqueConcateOperator:
            return '&';
        case this.uniqueEqualOperator:
            return '=';
        case this.uniqueExpOperator:
            return '^';
        case this.uniqueModOperator:
            return '%';
        case this.uniquePOperator:
            return '+';
        }
        return '';
    }

    private isUniqueChar(str: string): boolean {
        const code: number = str.charCodeAt(parseInt(str, 10));
        return code >= 129 && code <= 142;
    }

    private markSpecialChar(formulaValue: string): string {
        formulaValue = formulaValue.replace(/\(/g, '(' + this.uniqueOBracket).replace(/\)/g, ')' + this.uniqueCBracket);
        formulaValue = formulaValue.replace(/,/g, ',' + this.uniqueCSeparator).replace(/:/g, ':' + this.uniqueCOperator);
        formulaValue = formulaValue.replace(/\+/g, '+' + this.uniquePOperator).replace(/-/g, '-' + this.uniqueSOperator);
        formulaValue = formulaValue.replace(/\*/g, '*' + this.uniqueMOperator).replace(/\//g, '/' + this.uniqueDOperator);
        formulaValue = formulaValue.replace(/&/g, '&' + this.uniqueConcateOperator);
        formulaValue = formulaValue.replace(/=/g, '=' + this.uniqueEqualOperator);
        formulaValue = formulaValue.replace(/\^/g, '^' + this.uniqueExpOperator);
        formulaValue = formulaValue.replace(/>/g, '>' + this.uniqueGTOperator).replace(/</g, '<' + this.uniqueLTOperator);
        return formulaValue.replace(/%/g, '%' + this.uniqueModOperator);
    }

    private ensurePattern(patterns: PatternInfo[] | number[]): PatternInfo[] | number[] {
        let patrn: PatternInfo | number;
        let idx: number = -1;
        let i: number = patterns.length;
        while (i--) {
            patrn = patterns[i as number];
            if (typeof (patrn) === 'object') {
                idx = i;
                if (patrn.type === 'string')
                {patrn.val = (patrn.val as string[]).reverse(); }
            }
            else {
                patterns[i as number] = idx;
            }
        }
        return patterns;
    }
    private getSelectedRange(
        sheet: SheetModel, startcell: { rowIndex: number, colIndex: number }, endcell: { rowIndex: number, colIndex: number }):
        { rowIndex: number, colIndex: number }[] {
        let i: number; let k: number; let l: number; const arr: { rowIndex: number, colIndex: number }[] = [];
        const range: number[] = getSwapRange([startcell.rowIndex, startcell.colIndex, endcell.rowIndex, endcell.colIndex]);
        i = range[0]; const j: number = range[2];
        while (i <= j) {
            if (isFilterHidden(sheet, i)) { i++; continue; }
            k = range[1];
            l = range[3];
            while (k <= l) {
                arr.push({ rowIndex: i, colIndex: k });
                k++;
            }
            i++;
        }
        return arr;
    }

    private getFillType(args: {
        fillType: AutoFillType;
        disableItems: string[];
    }): {
            fillType: AutoFillType;
            disableItems: string[];
        } {
        args.fillType = this.fillInfo.fillType; args.disableItems = this.fillInfo.disableItems;
        return args;
    }

    private addEventListener(): void {
        this.parent.on(setAutoFill, this.autoFill, this);
        this.parent.on(getFillInfo, this.getFillType, this);
    }

    /**
     * Destroy workbook AutoFill module.
     *
     * @returns {void} - destroy the workbook AutoFill module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setAutoFill, this.autoFill);
            this.parent.off(getFillInfo, this.getFillType);
        }
    }
    /**
     * Get the workbook AutoFill module name.
     *
     * @returns {string} - Return the string.
     */
    public getModuleName(): string {
        return 'workbookautofill';
    }
}

interface PatternInfo {
    regVal?: { a: number, b: number },
    type?: string, i?: number,
    val?: string[] | number[] | string | number,
    dataVal?: string,
    copy?: boolean,
    start?: boolean
}
