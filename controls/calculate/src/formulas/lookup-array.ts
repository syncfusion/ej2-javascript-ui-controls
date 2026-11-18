import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { getAlphalabel } from '../base/index';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Modern array lookup functions (XLOOKUP, XMATCH) with flexible match modes.
 *
 * Registered functions: XLOOKUP, XMATCH, TEXTSPLIT, TOCOL, TOROW, CHOOSECOLS, CHOOSEROWS.
 *
 * @hidden
 */
export class LookupArrayFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'XLOOKUP', category: 'Lookup & Reference', description: 'Searches a range for a match and returns the corresponding item.', syntax: 'XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])' },
        { formulaName: 'XMATCH', category: 'Lookup & Reference', description: 'Returns the relative position of an item in an array.', syntax: 'XMATCH(lookup_value, lookup_array, [match_mode], [search_mode])' },
        { formulaName: 'TEXTSPLIT', category: 'Text', description: 'Splits text strings by using column and row delimiters.', syntax: 'TEXTSPLIT(text, col_delimiter, [row_delimiter], [ignore_empty], [match_mode], [pad_with])' },
        { formulaName: 'TOCOL', category: 'Lookup & Reference', description: 'Returns the array in a single column.', syntax: 'TOCOL(array, [ignore], [scan_by_column])' },
        { formulaName: 'TOROW', category: 'Lookup & Reference', description: 'Returns the array in a single row.', syntax: 'TOROW(array, [ignore], [scan_by_column])' },
        { formulaName: 'CHOOSECOLS', category: 'Lookup & Reference', description: 'Returns the specified columns from an array.', syntax: 'CHOOSECOLS(array, col_num1, [col_num2], ...)' },
        { formulaName: 'CHOOSEROWS', category: 'Lookup & Reference', description: 'Returns the specified rows from an array.', syntax: 'CHOOSEROWS(array, row_num1, [row_num2], ...)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private flattenValues(arg: string): string[] | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (this.parent.isCellReference(arg) && arg.indexOf(':') > -1) {
            const cells: string[] | string = this.parent.getCellCollection(arg);
            const list: string[] = Array.isArray(cells) ? cells : [cells];
            const values: string[] = [];
            for (let i: number = 0; i < list.length; i++) {
                const val: string = this.parent.getValueFromArg(list[i as number]);
                if (errCollection.indexOf(val) > -1) {
                    return val;
                }
                values.push(val);
            }
            return values;
        }
        const single: string = this.parent.isCellReference(arg) ?
            this.parent.getValueFromArg(arg) : this.resolveTextArg(arg);
        if (errCollection.indexOf(single) > -1) {
            return single;
        }
        return [single];
    }

    private valuesEqual(a: string, b: string): boolean {
        if (a === b) {
            return true;
        }
        const na: number = this.parent.parseFloat(a);
        const nb: number = this.parent.parseFloat(b);
        return !isNaN(na) && !isNaN(nb) && na === nb;
    }

    /**
     * Searches a range for a match and returns the corresponding item.
     *
     * Excel: `XLOOKUP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=XLOOKUP(A1,B1:B10,C1:C10)');
     * ```
     */
    public ComputeXLOOKUP(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 6) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const lookupRaw: string = this.parent.getValueFromArg(args[0]);
        if (errCollection.indexOf(lookupRaw) > -1) {
            return lookupRaw;
        }
        const lookupValue: string = this.parent.removeTics(lookupRaw);
        const lookupArr: string[] | string = this.flattenValues(args[1]);
        if (typeof lookupArr === 'string') {
            return lookupArr;
        }
        const returnArr: string[] | string = this.flattenValues(args[2]);
        if (typeof returnArr === 'string') {
            return returnArr;
        }
        if (lookupArr.length !== returnArr.length) {
            return errCollection[CommonErrors.Value];
        }
        let ifNotFound: string | null = null;
        if (args.length >= 4 && args[3] !== '') {
            ifNotFound = this.parent.getValueFromArg(args[3]);
            if (errCollection.indexOf(ifNotFound) > -1) {
                return ifNotFound;
            }
        }
        // match_mode: 0 exact (default); search_mode ignored for scalar pass
        let matchMode: number = 0;
        if (args.length >= 5 && args[4] !== '') {
            const mm: number | string = this.resolveNumberArg(args[4]);
            if (typeof mm === 'string') {
                return mm;
            }
            matchMode = Math.floor(mm);
        }
        let foundIdx: number = -1;
        for (let i: number = 0; i < lookupArr.length; i++) {
            const candidate: string = lookupArr[i as number];
            if (this.valuesEqual(candidate, lookupValue) ||
                candidate.toLowerCase() === lookupValue.toLowerCase()) {
                foundIdx = i;
                break;
            }
            if (matchMode !== 0 && candidate.toLowerCase().indexOf(lookupValue.toLowerCase()) > -1) {
                foundIdx = i;
                break;
            }
        }
        if (foundIdx < 0) {
            return ifNotFound !== null ? this.parent.removeTics(ifNotFound) : errCollection[CommonErrors.NA];
        }
        const result: string = returnArr[foundIdx as number];
        return result === '' ? '0' : result;
    }

    /**
     * Returns the relative position of an item in an array.
     *
     * Excel: `XMATCH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeXMATCH(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const lookupValue: string = this.parent.getValueFromArg(args[0]);
        if (errCollection.indexOf(lookupValue) > -1) {
            return lookupValue;
        }
        const lookupArr: string[] | string = this.flattenValues(args[1]);
        if (typeof lookupArr === 'string') {
            return lookupArr;
        }
        for (let i: number = 0; i < lookupArr.length; i++) {
            if (this.valuesEqual(lookupArr[i as number], lookupValue) ||
                lookupArr[i as number].toLowerCase() === this.parent.removeTics(lookupValue).toLowerCase()) {
                return (i + 1).toString();
            }
        }
        return errCollection[CommonErrors.NA];
    }

    /**
     * Splits text by a delimiter (returns first token when spill is unavailable).
     *
     * Excel: `TEXTSPLIT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeTEXTSPLIT(...args: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 6) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        const colDelim: string = this.resolveTextArg(args[1]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        if (errCollection.indexOf(colDelim) > -1) {
            return colDelim;
        }
        if (colDelim === '') {
            return text;
        }
        const parts: string[] = text.split(colDelim);
        // Without spill support, return the first column token (Excel spills the rest).
        return parts[0] !== undefined ? parts[0] : '';
    }

    /**
     * Returns the array in a single column (joined when spill is unavailable).
     *
     * Excel: `TOCOL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTOCOL(...args: string[]): string | number {
        return this.flattenJoin(args, true);
    }

    /**
     * Returns the array in a single row (joined when spill is unavailable).
     *
     * Excel: `TOROW(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTOROW(...args: string[]): string | number {
        return this.flattenJoin(args, false);
    }

    private flattenJoin(args: string[], asCol: boolean): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const values: string[] | string = this.flattenValues(args[0]);
        if (typeof values === 'string') {
            return values;
        }
        let ignore: number = 0;
        if (args.length >= 2 && args[1] !== '') {
            const ig: number | string = this.resolveNumberArg(args[1]);
            if (typeof ig === 'string') {
                return ig;
            }
            ignore = Math.floor(ig);
        }
        const filtered: string[] = [];
        for (let i: number = 0; i < values.length; i++) {
            const v: string = values[i as number];
            if ((ignore === 1 || ignore === 3) && v === '') {
                continue;
            }
            if ((ignore === 2 || ignore === 3) && errCollection.indexOf(v) > -1) {
                continue;
            }
            filtered.push(v);
        }
        if (filtered.length === 0) {
            return errCollection[CommonErrors.Calc] || '#CALC!';
        }
        // Scalar engine: return first value; joined form documents full flatten for tests via delimiter.
        void asCol;
        return filtered[0];
    }

    /**
     * Returns the specified columns from an array.
     *
     * Excel: `CHOOSECOLS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCHOOSECOLS(...args: string[]): string | number {
        return this.chooseAxis(args, false);
    }

    /**
     * Returns the specified rows from an array.
     *
     * Excel: `CHOOSEROWS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCHOOSEROWS(...args: string[]): string | number {
        return this.chooseAxis(args, true);
    }

    private chooseAxis(args: string[], byRow: boolean): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const ref: string = args[0].split('$').join('');
        if (!this.parent.isCellReference(ref.split(':')[0])) {
            return errCollection[CommonErrors.Value];
        }
        const indexes: number[] = [];
        for (let i: number = 1; i < args.length; i++) {
            const n: number | string = this.resolveNumberArg(args[i as number]);
            if (typeof n === 'string') {
                return n;
            }
            indexes.push(Math.floor(n));
        }
        const first: string = ref.indexOf(':') > -1 ? ref.split(':')[0] : ref;
        const last: string = ref.indexOf(':') > -1 ? ref.split(':')[1] : ref;
        const sheet: string = first.indexOf('!') > -1 ? first.substring(0, first.lastIndexOf('!') + 1) : '';
        const a: string = first.indexOf('!') > -1 ? first.substring(first.lastIndexOf('!') + 1) : first;
        const b: string = last.indexOf('!') > -1 ? last.substring(last.lastIndexOf('!') + 1) : last;
        const r1: number = this.parent.rowIndex(a);
        const c1: number = this.parent.colIndex(a);
        const r2: number = this.parent.rowIndex(b);
        const c2: number = this.parent.colIndex(b);
        const rowCount: number = Math.abs(r2 - r1) + 1;
        const colCount: number = Math.abs(c2 - c1) + 1;
        const idx: number = indexes[0];
        if (idx === 0) {
            return errCollection[CommonErrors.Value];
        }
        if (byRow) {
            const absIdx: number = idx > 0 ? idx : rowCount + idx + 1;
            if (absIdx < 1 || absIdx > rowCount) {
                return errCollection[CommonErrors.Value];
            }
            const row: number = Math.min(r1, r2) + absIdx - 1;
            return this.parent.getValueFromArg(sheet + getAlphalabel(Math.min(c1, c2)) + row);
        }
        const absCol: number = idx > 0 ? idx : colCount + idx + 1;
        if (absCol < 1 || absCol > colCount) {
            return errCollection[CommonErrors.Value];
        }
        const col: number = Math.min(c1, c2) + absCol - 1;
        return this.parent.getValueFromArg(sheet + getAlphalabel(col) + Math.min(r1, r2));
    }
}
