import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { getAlphalabel } from '../base/index';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Database-style conditional aggregates (DSUM, DCOUNT, DGET) over structured table ranges.
 *
 * Registers 12 functions including DAVERAGE, DCOUNT, DCOUNTA, DGET, DMAX, and others.
 *
 * @hidden
 */
export class DatabaseFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'DAVERAGE', category: 'Database', description: 'Averages the values in a column of a list or database that match criteria.', syntax: 'DAVERAGE(database, field, criteria)' },
        { formulaName: 'DCOUNT', category: 'Database', description: 'Counts the cells that contain numbers in a column of a list or database that match criteria.', syntax: 'DCOUNT(database, field, criteria)' },
        { formulaName: 'DCOUNTA', category: 'Database', description: 'Counts nonblank cells in a column of a list or database that match criteria.', syntax: 'DCOUNTA(database, field, criteria)' },
        { formulaName: 'DGET', category: 'Database', description: 'Extracts a single value from a column of a list or database that matches criteria.', syntax: 'DGET(database, field, criteria)' },
        { formulaName: 'DMAX', category: 'Database', description: 'Returns the maximum value from a column of a list or database that matches criteria.', syntax: 'DMAX(database, field, criteria)' },
        { formulaName: 'DMIN', category: 'Database', description: 'Returns the minimum value from a column of a list or database that matches criteria.', syntax: 'DMIN(database, field, criteria)' },
        { formulaName: 'DPRODUCT', category: 'Database', description: 'Multiplies values in a column of a list or database that match criteria.', syntax: 'DPRODUCT(database, field, criteria)' },
        { formulaName: 'DSTDEV', category: 'Database', description: 'Estimates the standard deviation of a population based on a sample of entries that match criteria.', syntax: 'DSTDEV(database, field, criteria)' },
        { formulaName: 'DSTDEVP', category: 'Database', description: 'Calculates the standard deviation of a population based on entries that match criteria.', syntax: 'DSTDEVP(database, field, criteria)' },
        { formulaName: 'DSUM', category: 'Database', description: 'Adds the numbers in the field column of records in the database that match the criteria.', syntax: 'DSUM(database, field, criteria)' },
        { formulaName: 'DVAR', category: 'Database', description: 'Estimates variance based on a sample of entries that match criteria.', syntax: 'DVAR(database, field, criteria)' },
        { formulaName: 'DVARP', category: 'Database', description: 'Calculates variance based on the entire population of entries that match criteria.', syntax: 'DVARP(database, field, criteria)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private readRange(rangeArg: string): string[][] | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (!this.parent.isCellReference(rangeArg)) {
            return errCollection[CommonErrors.Value];
        }
        const parts: string[] = rangeArg.indexOf(':') > -1 ? rangeArg.split(':') : [rangeArg, rangeArg];
        const r1: number = this.parent.rowIndex(parts[0]);
        const c1: number = this.parent.colIndex(parts[0]);
        const r2: number = this.parent.rowIndex(parts[1]);
        const c2: number = this.parent.colIndex(parts[1]);
        const rowStart: number = Math.min(r1, r2);
        const rowEnd: number = Math.max(r1, r2);
        const colStart: number = Math.min(c1, c2);
        const colEnd: number = Math.max(c1, c2);
        const grid: string[][] = [];
        for (let r: number = rowStart; r <= rowEnd; r++) {
            const row: string[] = [];
            for (let c: number = colStart; c <= colEnd; c++) {
                const addr: string = getAlphalabel(c) + r;
                row.push(this.parent.getValueFromArg(addr));
            }
            grid.push(row);
        }
        return grid;
    }

    private fieldIndex(fieldArg: string, headers: string[]): number | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        const fieldVal: string = this.resolveTextArg(fieldArg);
        if (errCollection.indexOf(fieldVal) > -1) {
            return fieldVal;
        }
        const num: number = this.parent.parseFloat(fieldVal);
        if (!isNaN(num) && num >= 1 && num <= headers.length) {
            return Math.floor(num) - 1;
        }
        const upper: string = fieldVal.toUpperCase();
        for (let i: number = 0; i < headers.length; i++) {
            if (headers[i as number].toUpperCase() === upper) {
                return i;
            }
        }
        return errCollection[CommonErrors.Value];
    }

    private matchCriteria(row: string[], criteriaRows: string[][], headers: string[]): boolean {
        for (let cr: number = 0; cr < criteriaRows.length; cr++) {
            const crit: string[] = criteriaRows[cr as number];
            let rowMatch: boolean = true;
            for (let c: number = 0; c < headers.length; c++) {
                const criterion: string = crit[c as number];
                if (criterion === undefined || criterion === '') {
                    continue;
                }
                const cellVal: string = row[c as number];
                if (!this.matchesCriterion(cellVal, criterion)) {
                    rowMatch = false;
                    break;
                }
            }
            if (rowMatch) {
                return true;
            }
        }
        return false;
    }

    private matchesCriterion(value: string, criterion: string): boolean {
        const crit: string = criterion.trim();
        if (crit === '') {
            return true;
        }
        const ops: string[] = ['>=', '<=', '<>', '>', '<', '='];
        for (let i: number = 0; i < ops.length; i++) {
            const op: string = ops[i as number];
            if (crit.startsWith(op)) {
                const rhs: string = crit.substring(op.length).trim();
                const lv: number = this.parent.parseFloat(value);
                const rv: number = this.parent.parseFloat(rhs);
                if (!isNaN(lv) && !isNaN(rv)) {
                    switch (op) {
                    case '>=':
                        return lv >= rv;
                    case '<=':
                        return lv <= rv;
                    case '<>':
                        return lv !== rv;
                    case '>':
                        return lv > rv;
                    case '<':
                        return lv < rv;
                    case '=':
                        return lv === rv;
                    default: {
                        const _exhaustive: never = op as never;
                        return _exhaustive;
                    }
                    }
                }
                if (op === '=' || op === '') {
                    return value.toUpperCase() === rhs.toUpperCase();
                }
                if (op === '<>') {
                    return value.toUpperCase() !== rhs.toUpperCase();
                }
                return false;
            }
        }
        if (crit.includes('*') || crit.includes('?')) {
            // eslint-disable-next-line security/detect-non-literal-regexp
            const regex: RegExp = new RegExp('^' + crit.replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i');
            return regex.test(value);
        }
        return value.toUpperCase() === crit.toUpperCase();
    }

    private collectMatching(databaseArg: string, fieldArg: string, criteriaArg: string, numbersOnly: boolean): number[] | string {
        const db: string[][] | string = this.readRange(databaseArg);
        if (typeof db === 'string') {
            return db;
        }
        if (db.length < 2) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        const headers: string[] = db[0];
        const fieldIdx: number | string = this.fieldIndex(fieldArg, headers);
        if (typeof fieldIdx === 'string') {
            return fieldIdx;
        }
        const critGrid: string[][] | string = this.readRange(criteriaArg);
        if (typeof critGrid === 'string') {
            return critGrid;
        }
        if (critGrid.length < 2) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        const critHeaders: string[] = critGrid[0];
        const critRows: string[][] = critGrid.slice(1);
        const nums: number[] = [];
        for (let r: number = 1; r < db.length; r++) {
            const row: string[] = db[r as number];
            const aligned: string[] = headers.map((_h: string, i: number) => row[i as number] || '');
            const critAligned: string[][] = critRows.map((cr: string[]) =>
                critHeaders.map((_h: string, i: number) => cr[i as number] || ''));
            if (!this.matchCriteria(aligned, critAligned, headers)) {
                continue;
            }
            const val: string = row[fieldIdx as number] || '';
            if (numbersOnly) {
                if (val !== '' && this.parent.isNumber(val)) {
                    nums.push(this.parent.parseFloat(val));
                }
            } else if (val !== '') {
                if (this.parent.isNumber(val)) {
                    nums.push(this.parent.parseFloat(val));
                }
            }
        }
        return nums;
    }

    private requireThree(args: string[]): string | null {
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return null;
    }

    private mean(nums: number[]): number {
        return nums.reduce((a: number, b: number) => a + b, 0) / nums.length;
    }

    private variance(nums: number[], population: boolean): number {
        const m: number = this.mean(nums);
        let sum: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            sum += Math.pow(nums[i as number] - m, 2);
        }
        return sum / (population ? nums.length : nums.length - 1);
    }

    /**
     * Averages the values in a column of a list or database that match criteria.
     *
     * Excel: `DAVERAGE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=DAVERAGE(1)');
     * ```
     */
    public ComputeDAVERAGE(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], true);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length === 0) {
            return this.parent.getErrorStrings()[CommonErrors.DivZero];
        }
        return this.mean(nums).toString();
    }

    /**
     * Counts the cells that contain numbers in a column of a list or database that match criteria.
     *
     * Excel: `DCOUNT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDCOUNT(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], true);
        if (typeof nums === 'string') {
            return nums;
        }
        return nums.length.toString();
    }

    /**
     * Counts nonblank cells in a column of a list or database that match criteria.
     *
     * Excel: `DCOUNTA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDCOUNTA(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const db: string[][] | string = this.readRange(args[0]);
        if (typeof db === 'string') {
            return db;
        }
        const headers: string[] = db[0];
        const fieldIdx: number | string = this.fieldIndex(args[1], headers);
        if (typeof fieldIdx === 'string') {
            return fieldIdx;
        }
        const critGrid: string[][] | string = this.readRange(args[2]);
        if (typeof critGrid === 'string') {
            return critGrid;
        }
        const critRows: string[][] = critGrid.slice(1);
        let count: number = 0;
        for (let r: number = 1; r < db.length; r++) {
            const row: string[] = db[r as number];
            const critAligned: string[][] = critRows.map((cr: string[]) =>
                critGrid[0].map((_h: string, i: number) => cr[i as number] || ''));
            if (this.matchCriteria(row, critAligned, headers) && (row[fieldIdx as number] || '') !== '') {
                count++;
            }
        }
        return count.toString();
    }

    /**
     * Extracts a single value from a column of a list or database that matches criteria.
     *
     * Excel: `DGET(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDGET(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], false);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length === 0) {
            return errCollection[CommonErrors.NA];
        }
        if (nums.length > 1) {
            return errCollection[CommonErrors.Num];
        }
        return nums[0].toString();
    }

    /**
     * Returns the maximum value from a column of a list or database that matches criteria.
     *
     * Excel: `DMAX(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDMAX(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], true);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length === 0) {
            return this.parent.getErrorStrings()[CommonErrors.NA];
        }
        return Math.max(...nums).toString();
    }

    /**
     * Returns the minimum value from a column of a list or database that matches criteria.
     *
     * Excel: `DMIN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDMIN(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], true);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length === 0) {
            return this.parent.getErrorStrings()[CommonErrors.NA];
        }
        return Math.min(...nums).toString();
    }

    /**
     * Multiplies values in a column of a list or database that match criteria.
     *
     * Excel: `DPRODUCT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDPRODUCT(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], true);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length === 0) {
            return '0';
        }
        return nums.reduce((a: number, b: number) => a * b, 1).toString();
    }

    /**
     * Adds the numbers in the field column of records in the database that match the criteria.
     *
     * Excel: `DSUM(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDSUM(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], true);
        if (typeof nums === 'string') {
            return nums;
        }
        return nums.reduce((a: number, b: number) => a + b, 0).toString();
    }

    /**
     * Estimates the standard deviation of a population based on a sample of entries that match criteria.
     *
     * Excel: `DSTDEV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDSTDEV(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], true);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length < 2) {
            return errCollection[CommonErrors.DivZero];
        }
        return Math.sqrt(this.variance(nums, false)).toString();
    }

    /**
     * Calculates the standard deviation of a population based on entries that match criteria.
     *
     * Excel: `DSTDEVP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDSTDEVP(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], true);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length < 1) {
            return errCollection[CommonErrors.DivZero];
        }
        return Math.sqrt(this.variance(nums, true)).toString();
    }

    /**
     * Estimates variance based on a sample of entries that match criteria.
     *
     * Excel: `DVAR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDVAR(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], true);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length < 2) {
            return errCollection[CommonErrors.DivZero];
        }
        return this.variance(nums, false).toString();
    }

    /**
     * Calculates variance based on the entire population of entries that match criteria.
     *
     * Excel: `DVARP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDVARP(...args: string[]): string | number {
        const bad: string | null = this.requireThree(args);
        if (bad) {
            return bad;
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const nums: number[] | string = this.collectMatching(args[0], args[1], args[2], true);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length < 1) {
            return errCollection[CommonErrors.DivZero];
        }
        return this.variance(nums, true).toString();
    }
}
