import { Workbook, CellModel, getCell, SheetModel, setCell, isHiddenRow, isHiddenCol } from '../base/index';
import { getSwapRange, getRangeIndexes, setAutoFill, AutoFillDirection, AutoFillType, isNumber, refreshCell, intToDate, dateToInt, getRangeAddress, getFillInfo } from './../common/index';
import { checkIsFormula, workbookEditOperation, getColumnHeaderText } from './../common/index';

/**
 * WorkbookAutoFill module allows to perform auto fill functionalities.
 */

export class WorkbookAutoFill {
    private parent: Workbook;
    private fillInfo: {
        fillType: AutoFillType;
        disableItems: string[];
    };
    private uniqueOBracket = String.fromCharCode(129);
    private uniqueCBracket = String.fromCharCode(130);
    private uniqueCSeparator = String.fromCharCode(131);
    private uniqueCOperator = String.fromCharCode(132);
    private uniquePOperator = String.fromCharCode(133);
    private uniqueSOperator = String.fromCharCode(134);
    private uniqueMOperator = String.fromCharCode(135);
    private uniqueDOperator = String.fromCharCode(136);
    private uniqueModOperator = String.fromCharCode(137);
    private uniqueConcateOperator = String.fromCharCode(138);
    private uniqueEqualOperator = String.fromCharCode(139);
    private uniqueExpOperator = String.fromCharCode(140);
    private uniqueGTOperator = String.fromCharCode(141);
    private uniqueLTOperator = String.fromCharCode(142);
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

    private getFillInfo(options: { dataRange: number[], fillRange: number[], direction: AutoFillDirection, fillType: AutoFillType }): { fillType: AutoFillType, disableItems: string[] } {
        let i: number;
        let val: string = '';
        let isStringType: boolean = true;
        let fillType: AutoFillType = 'CopyCells';
        let disableItems: string[] = [];
        let isVFill: boolean = ['Down', 'Up'].indexOf(options.direction) > -1,
            data = this.getRangeData({ range: options.dataRange, sheetIdx: this.parent.activeSheetIndex });
        let len: number = data.join().replace(/,/g, '').length;
        if (this.isRange(options.dataRange) && len) {
            i = data.length;
            while (i--) {
                val = data[i] && data[i].value;
                if (isNumber(val) || checkIsFormula(val)) {
                    isStringType = false;
                    fillType = this.parent.autoFillSettings.fillType;
                    break;
                }
            }
        }
        else {
            val = data[0] && data[0].value;
            if (isNumber(val) || checkIsFormula(val)) {
                isStringType = false;
                fillType = this.parent.autoFillSettings.fillType;
            }
        }
        if (!len || isStringType) {
            disableItems.push('Fill Series');
            fillType = (options.fillType == "FillSeries") ? fillType : options.fillType;
        }
        if (!isVFill || (isVFill && options.dataRange[1] !== options.dataRange[3]))
            disableItems.push('Flash Fill');  // for flash fill option
        return { fillType: fillType, disableItems: disableItems };
    }

    private isRange(range: number[]): boolean {
        return range && (range[0] !== range[2] || range[1] !== range[3]);
    }

    private autoFill(options: { dataRange: string, fillRange: string, direction: AutoFillDirection, fillType: AutoFillType, isFillOptClick ?:boolean }): void {
        if (!options.dataRange || !options.fillRange || !options.direction || !this.parent.allowEditing || this.parent.getActiveSheet().isProtected)
            return;
        let autoFillOptions: { dataRange: number[], fillRange: number[], fillType: AutoFillType, direction: AutoFillDirection } = { dataRange: null, fillRange: null, fillType: null, direction: null };
        let dataRangeIndices: number[] = getSwapRange(getRangeIndexes(options.dataRange));
        let fillRangeIndices: number[] = getSwapRange(getRangeIndexes(options.fillRange));
        this.fillInfo = this.getFillInfo({ dataRange: dataRangeIndices, fillRange: fillRangeIndices, fillType: options.fillType, direction: options.direction });
        autoFillOptions.dataRange = dataRangeIndices;
        autoFillOptions.fillRange = fillRangeIndices;
        autoFillOptions.direction = options.direction;
        autoFillOptions.fillType = options.fillType || this.fillInfo.fillType;
        this.fillInfo.fillType = options.isFillOptClick ? options.fillType: this.fillInfo.fillType;
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

    private fillSeries(options: { dataRange: number[], fillRange: number[], fillType: AutoFillType, direction: AutoFillDirection }): void {
        let val: string | string; let plen: number;
        let patterns: PatternInfo[] | number[]; let patrn: object | number;
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
        let sheet: SheetModel = this.parent.getActiveSheet();
        let dminr: number = options.dataRange[0]; let dminc: number = options.dataRange[1]; let dmaxr: number = options.dataRange[2]; let dmaxc: number = options.dataRange[3];
        let fminr: number = options.fillRange[0]; let fminc: number = options.fillRange[1]; let fmaxr: number = options.fillRange[2]; let fmaxc: number = options.fillRange[3];
        let isVFill: boolean = ['Down', 'Up'].indexOf(options.direction) > -1; let isRFill: boolean = ['Up', 'Left'].indexOf(options.direction) > -1;
        let len: number = isVFill ? dmaxc - dminc : dmaxr - dminr; let withFrmt: boolean = options.fillType === 'FillSeries';
        while (i <= len) {
            pRanges = this.updateFillValues(isVFill, dminr, dminc, dmaxr, dmaxc, fminr, fminc, fmaxr, fmaxc, i);
            patrnRange = pRanges.patternRange;
            fillRange = pRanges.fillRange;
            patterns = this.getPattern(patrnRange, { isRFill: isRFill, isVFill: isVFill });
            data = this.getRangeData({ range: patrnRange, sheetIdx: this.parent.activeSheetIndex });
            dlen = data.length;
            if (!patterns)
                return;
            plen = patterns.length;
            cells = this.getSelectedRange({ rowIndex: fillRange[0], colIndex: fillRange[1] }, { rowIndex: fillRange[2], colIndex: fillRange[3] });
            clen = cells.length;
            if (isRFill) {
                cells = cells.reverse();
                patterns = patterns.reverse();
                patterns = this.ensurePattern(patterns as PatternInfo[]);
                data = data.reverse();
            }
            j = 0;
            while (j < clen) {
                cellIdx = cells[j];
                patrn = patterns[j % plen] as object | number;
                if (isNumber(patrn as number)) {
                    patrn = patterns[patrn as number];
                }
                switch (patrn['type']) {
                    case 'number':
                        val = (this.round(patrn['regVal'].a + (patrn['regVal'].b * patrn['i']), 5)).toString();
                        if (isRFill)
                            patrn['i']--;
                        else
                            patrn['i']++;
                        break;
                    case 'string':
                        let newVal: number = patrn['i'] % patrn['val'].length
                        val = patrn['val'][newVal];
                        patrn['i']++;
                        break;
                    case 'formula':
                        hasRef = false;
                        val = '=';
                        k = 0;
                        tlen = patrn['val'].length;
                        while (k < tlen) {
                            temp = patrn['val'][k];
                            if (typeof temp === 'object') {
                                hasRef = true;
                                tot = this.round(temp['a'] + (temp['b'] * patrn['i']), 5);
                                if (tot < 1)
                                    val += "#REF!";
                                else
                                    val += isVFill ? temp['c'] + (temp['b'] ? tot : '$' + tot) : (temp['b'] ? getColumnHeaderText(tot) : '$' + getColumnHeaderText(tot)) + temp['c'];
                            }
                            else
                                val += temp;
                            k++;
                        }
                        if (hasRef && isRFill)
                            patrn['i']--;
                        else
                            patrn['i']++;
                        break;
                    case 'time':
                        val = (patrn['regVal'].a + (patrn['regVal'].b * patrn['i'])).toString();
                        if (isRFill)
                            patrn['i']--;
                        else
                            patrn['i']++;
                        break;
                }
                l = j % dlen;
                prevCellData = getCell(cellIdx.rowIndex, cellIdx.colIndex, sheet);
                if (withFrmt)
                    Object.assign(cellProps, data[l], null, true);
                else {
                    cellProps.style = prevCellData && prevCellData.style;
                    cellProps.format = prevCellData && prevCellData.format;
                    cellProps.wrap = prevCellData && prevCellData.wrap;
                    cellProps.rowSpan = prevCellData && prevCellData.rowSpan;
                    cellProps.colSpan = prevCellData && prevCellData.colSpan;
                }
                cellProps.value = val;
                if (checkIsFormula(val)) {
                    cellProps.formula = val;
                }
                setCell(cellIdx.rowIndex, cellIdx.colIndex, sheet, cellProps);
                this.parent.notify(
                    workbookEditOperation,
                    {
                        action: 'updateCellValue', address: [cellIdx.rowIndex, cellIdx.colIndex, cellIdx.rowIndex,
                        cellIdx.colIndex], value: cellProps.formula ? cellProps.formula : cellProps.value
                    });
                this.parent.notify(refreshCell, { rowIndex: cellIdx.rowIndex, colIndex: cellIdx.colIndex });
                cellProps = {};
                j++;
            }
            i++;
        }
    }

    private copyCells(options: { dataRange: number[], fillRange: number[], fillType: AutoFillType, direction: AutoFillDirection }): void {
        let i: number = 0; let j: number;
        let k: number; let patrnRange: number[];
        let fillRange: number[];
        let pRanges: { patternRange: number[], fillRange: number[] };
        let data: CellModel[]; let dlen: number;
        let cells: {
            rowIndex: number;
            colIndex: number;
        }[]
        let clen: number; let cellProperty: CellModel = {};
        let cellIdx: { rowIndex: number, colIndex: number };
        let dMinR: number = options.dataRange[0];
        let dMinC: number = options.dataRange[1];
        let dMaxR: number = options.dataRange[2];
        let dMaxC: number = options.dataRange[3];
        let fMinR: number = options.fillRange[0];
        let fMinC: number = options.fillRange[1];
        let fMaxR: number = options.fillRange[2];
        let fMaxC: number = options.fillRange[3];
        let isVFill: boolean = ['Down', 'Up'].indexOf(options.direction) > -1;
        let isRFill: boolean = ['Up', 'Left'].indexOf(options.direction) > -1;
        let len: number = isVFill ? dMaxC - dMinC : dMaxR - dMinR;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let formatOnly: boolean = options.fillType === 'FillFormattingOnly';
        let prevCellData: CellModel;
        while (i <= len) {
            pRanges = this.updateFillValues(isVFill, dMinR, dMinC, dMaxR, dMaxC, fMinR, fMinC, fMaxR, fMaxC, i);
            patrnRange = pRanges.patternRange;
            fillRange = pRanges.fillRange;
            data = this.getRangeData({ range: patrnRange, sheetIdx: this.parent.activeSheetIndex });
            dlen = data.length;
            cells = this.getSelectedRange({ rowIndex: fillRange[0], colIndex: fillRange[1] }, { rowIndex: fillRange[2], colIndex: fillRange[3] });
            clen = cells.length;
            j = 0;
            if (isRFill) {
                cells = cells.reverse();
            }
            if (formatOnly) {
                while (j < clen) {
                    k = j % dlen;
                    cellIdx = cells[j];
                    prevCellData = getCell(cellIdx.rowIndex, cellIdx.colIndex, sheet);
                    Object.assign(cellProperty, data[k], null, true);
                    cellProperty.value = prevCellData.value;
                    cellProperty.formula = prevCellData.formula;
                    setCell(cellIdx.rowIndex, cellIdx.colIndex, sheet, cellProperty);
                    this.parent.notify(refreshCell, { rowIndex: cellIdx.rowIndex, colIndex: cellIdx.colIndex });
                    cellProperty = {};
                    j++;
                }
            }
            else {
                while (j < clen) {
                    k = j % dlen;
                    cellIdx = cells[j];
                    Object.assign(cellProperty, data[k], null, true);
                    setCell(cellIdx.rowIndex, cellIdx.colIndex, sheet, cellProperty);
                    this.parent.notify(
                        workbookEditOperation,
                        {
                            action: 'updateCellValue', address: [cellIdx.rowIndex, cellIdx.colIndex, cellIdx.rowIndex,
                            cellIdx.colIndex], value: cellProperty.formula ? cellProperty.formula : cellProperty.value
                        });
                    this.parent.notify(refreshCell, { rowIndex: cellIdx.rowIndex, colIndex: cellIdx.colIndex });
                    cellProperty = {};
                    j++;
                }
            }
            i++;
        }
    }

    private updateFillValues(isVFill: boolean, dminr: number, dminc: number, dmaxr: number, dmaxc: number, fminr: number, fminc: number,
        fmaxr: number, fmaxc: number, i: number): { patternRange: number[], fillRange: number[] } {
        let pStart: { rowIndex: number, colIndex: number };
        let pEnd: { rowIndex: number, colIndex: number };
        let fStart: { rowIndex: number, colIndex: number };
        let fEnd: { rowIndex: number, colIndex: number };
        let patternRange: number[];
        let fillRange: number[];
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
        patternRange = [pStart.rowIndex, pStart.colIndex, pEnd.rowIndex, pEnd.colIndex];
        fillRange = [fStart.rowIndex, fStart.colIndex, fEnd.rowIndex, fEnd.colIndex];
        return { patternRange: patternRange, fillRange: fillRange };
    }

    private getType(val: string, isTime: boolean): string {
        let type: string
        if (isTime)
            type = 'time'
        else if (checkIsFormula(val))
            type = 'formula';
        else if (isNumber(val))
            type = 'number';
        return type || 'string';
    }

    private getDataPattern(range: number[]): { val: string[] | number[], type: string }[] {
        let val: string[] | string;
        let type: string;
        let i: number = 0;
        let obj: { val: string[], type: string } = { val: null, type: null };
        let patrn: { val: string[] | number[], type: string }[] = [];
        let data: CellModel[] = this.getRangeData({ range: range, sheetIdx: this.parent.activeSheetIndex });
        let dlen: number = data.length;
        if (dlen) {
            while (i < dlen) {
                val = data[i] && data[i].formula ? data[i].formula : data[i] && data[i].value ? data[i].value : '';
                type = this.getType(val, data[i] && data[i].format === 'h:mm:ss AM/PM');
                if (i === 0)
                    obj = { val: [val], type: type };
                else if (type === obj.type)
                    obj.val.push(val);
                else {
                    patrn.push(obj);
                    obj = { val: [val], type: type };
                }
                i++;
            }
            patrn.push(obj);
            return patrn;
        } else {
            return [{ val: null, type: null }]
        }
    }

    private getPredictionValue(args: number[], isTime?: boolean): { a: number, b: number } {
        let i: number = 0;
        let sumx: number = 0;
        let sumy: number = 0;
        let sumxy: number = 0;
        let sumxx: number = 0;
        let a: number = 0; let b: number = 0;
        let n: number = args.length;
        while (i < n) {
            sumx = sumx + i;
            sumy = sumy + Number(args[i]);
            sumxy = sumxy + (i * Number(args[i]));
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
        let i: number = 0
        let pattern: PatternInfo[] | number[] = [];
        let patrns: { val?: number[] | string[], type: string }[] = this.getDataPattern(range);
        let plen: number = patrns.length;
        let patrn: { val?: number[] | string[] | string | number, type?: string, isInPattern?: boolean };
        if (patrns) {
            while (i < plen) {
                patrn = patrns[i];
                switch (patrn.type) {
                    case 'number':
                        idx = pattern.length;
                        len = (patrn.val as number[]).length;
                        diff = options.isRFill ? -1 : len;
                        if (len === 1) {
                            let newVal: number = parseFloat(patrn.val[0] as string) + 1;
                            (patrn.val as number[]).push(newVal);
                        }
                        regVal = this.getPredictionValue(patrn.val as number[]);
                        temp = { regVal: regVal, type: patrn.type, i: diff };
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
                                (pattern as PatternInfo[]).push({ val: patrn.val[j], type: 'formula', i: diff });
                                j++;
                            }
                        }
                        break;
                    case 'time':
                        idx = pattern.length;
                        len = (patrn.val as number[]).length;
                        diff = options.isRFill ? -1 : 1;
                        if (len === 1) {
                            let oldTimeVal: Date = intToDate(patrn.val[0]);
                            let newTimeVal: number = dateToInt(new Date(oldTimeVal.getTime() + 60 * 60000), true);
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
        } else { return [{ regVal: null }] }
    }

    private isCellReference(text: string): string | boolean {
        return /^[a-z]{1,3}\d{1,7}$/gi.test(text) ? 'relative' : (/^\$[a-z]{1,3}\$\d{1,7}$/gi.test(text) ? "absolute" : (/^((\$[a-z]{1,3})\d{1,7}|[a-z]{1,3}(\$\d{1,7}))$/gi.test(text) ? "mixed" : false));
    }

    private round(value: string | number, round: string | number): number {
        return Number(Math.round(parseFloat(value + 'e' + round)) + 'e-' + round);
    }

    private getRangeData(options: { range: number[], sheetIdx: number }): CellModel[] {
        let arr: CellModel[] = [];
        let sheet: SheetModel = this.parent.getActiveSheet();
        let minR: number = options.range[0];
        let minC: number = options.range[1];
        let maxR: number = options.range[2];
        let maxC: number = options.range[3];
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

    private getFormulaPattern(data: string[], options: { isRFill: boolean, isVFill: boolean }): { isInPattern: boolean, val?: number[] | string[] | number | string } {
        let j: number; let temp: string;
        // tslint:disable-next-line
        let patrn: any; let patrns: any = [];
        let isInPatrn: boolean; let i: number = 0; let len: number = data.length; let cRfrType: string;
        while (i < len) {
            patrns.push(this.parseFormula(data[i]));
            i++;
        }
        isInPatrn = this.isInPattern(patrns, options.isVFill);
        if (isInPatrn) {
            patrn = patrns[0];
            i = patrn.length;
            while (i--) {
                temp = patrn[i];
                cRfrType = this.isCellReference(temp) as string;
                if (cRfrType && (cRfrType !== 'absolute'))
                    patrn[i] = this.getCellRefPrediction(temp, options, null, cRfrType);
            }
            return { isInPattern: isInPatrn, val: patrn };
        }
        else {
            i = 0;
            while (i < len) {
                patrn = patrns[i];
                j = patrn.length;
                while (j--) {
                    temp = patrn[j];
                    cRfrType = this.isCellReference(temp) as string;
                    if (cRfrType && (cRfrType !== "absolute"))
                        patrns[i][j] = this.getCellRefPrediction(temp, options, len, cRfrType);
                }
                i++;
            }
            return { isInPattern: isInPatrn, val: patrns };
        }
    }

    private generateColCount(text: string): number {
        let colCount: number = 0;
        let newText: string[] | string = text.split('').reverse().join('');
        for (let i: number = newText.length - 1; i >= 0; i--) {
            colCount += (text[i].charCodeAt(parseInt(newText[i])) - 64) * (Math.pow(26, i));
        }
        return colCount;
    }

    private getCellRefPrediction(text: string, options: { isRFill: boolean, isVFill: boolean }, length: number, rfrType: string): number[] | number | object {
        text = text.toUpperCase();
        let eStr: string = '';
        let aRegx: RegExp = new RegExp("[a-z$]", "gi"), nRegx = new RegExp("[0-9$]", "g");
        let str: string = options.isVFill ? text.replace(nRegx, eStr) : text.replace(aRegx, eStr);
        let temp: number[] | number | object = options.isVFill ? Number(text.replace(aRegx, eStr)) : this.generateColCount(text.replace(nRegx, eStr));
        let arr = [temp];
        let isColAbslt: boolean = text[0] === '$';
        if (length && length !== 1)
            arr.push(temp + length);
        else
            arr.push(temp + 1);
        temp = this.getPredictionValue(arr);
        if (rfrType && (rfrType === "mixed")) {
            if (isColAbslt === options.isVFill)
                str = '$' + str;
            else
                temp['b'] = 0;
        }
        temp['c'] = str;
        return temp;
    }

    private isInPattern(patrn: string[], isVFill: boolean): boolean {
        let oldPatrn: string;
        let olen: number;
        let newPatrn: string;
        let nlen: number; let oldStr: string; let newStr: string; let oldInt: number; let newInt: number; let eStr: string = '';
        let i: number = 0; let j: number = 1; let plen: number = patrn.length; let nregx: RegExp = new RegExp("[0-9$]", "g");
        let aregx: RegExp = new RegExp("[a-z$]", "gi");
        if (plen === 1)
            return false;
        while (j < plen) {
            oldPatrn = patrn[i];
            newPatrn = patrn[j];
            olen = oldPatrn.length;
            nlen = newPatrn.length;
            if (olen !== nlen)
                return false;
            else {
                while (olen--) {
                    oldStr = oldPatrn[olen];
                    newStr = newPatrn[olen];
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
                            return false;
                    }
                    else if (oldStr !== newStr)
                        return false;
                }
            }
            i++;
            j++;
        }
        return true;
    }
    private parseFormula(formula: string | string[]): string[] {
        let temp, str, len, i = 0, arrValues = [];
        formula = this.markSpecialChar((formula as string).replace('=', ''));
        formula = formula.split(/\(|\)|=|\^|>|<|,|:|\+|-|\*|\/|%|&/g);
        len = formula.length;
        while (i < len) {
            temp = formula[i];
            if (!temp) {
                i++;
                continue;
            }
            if (temp.length === 1)
                arrValues.push(this.isUniqueChar(temp) ? this.getUniqueCharVal(temp) : temp);
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
                    arrValues.push(temp);
            }
            i++;
        }
        return arrValues;
    }

    private getUniqueCharVal(str: string): string {
        switch (str) {
            case this.uniqueOBracket:
                return "(";
            case this.uniqueCBracket:
                return ")";
            case this.uniqueCSeparator:
                return ",";
            case this.uniqueCOperator:
                return ':';
            case this.uniquePOperator:
                return "+";
            case this.uniqueSOperator:
                return "-";
            case this.uniqueMOperator:
                return "*";
            case this.uniqueDOperator:
                return "/";
            case this.uniqueModOperator:
                return "%";
            case this.uniqueConcateOperator:
                return "&";
            case this.uniqueEqualOperator:
                return "=";
            case this.uniqueExpOperator:
                return "^";
            case this.uniqueGTOperator:
                return ">";
            case this.uniqueLTOperator:
                return "<";
        }
        return "";
    }

    private isUniqueChar(str: string): boolean {
        let code: number = str.charCodeAt(parseInt(str));
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
            patrn = patterns[i];
            if (typeof (patrn) === 'object') {
                idx = i;
                if (patrn.type === 'string')
                    patrn.val = (patrn.val as string[]).reverse();
            }
            else {
                patterns[i] = idx;
            }
        }
        return patterns;
    }
    private getSelectedRange(startcell: { rowIndex: number, colIndex: number }, endcell: { rowIndex: number, colIndex: number }): { rowIndex: number, colIndex: number }[] {
        let i: number; let j: number; let k: number; let l: number; let arr: { rowIndex: number, colIndex: number }[] = [],
            range = getSwapRange([startcell.rowIndex, startcell.colIndex, endcell.rowIndex, endcell.colIndex]);
        i = range[0], j = range[2];
        while (i <= j) {
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
        args.fillType = this.fillInfo.fillType; args.disableItems = this.fillInfo.disableItems
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
            this.parent.off(getFillInfo, this.getFillInfo);
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
    val?: string[] | number[] | string | number
}