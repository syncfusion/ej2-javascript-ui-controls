import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Calculate } from '../base/index';
import { FormulasErrorsStrings, CommonErrors } from '../common/index';
import { FormulaOwner } from './formula-owner';

/**
 * Base class for formula category modules registered with {@link BasicFormulas}.
 *
 * Provides shared argument parsing helpers used across Compute handlers.
 *
 * @hidden
 */
export class FormulaModuleBase {
    /** Calculate engine instance resolved from the formula owner. */
    protected parent: Calculate;
    /** Formula registration owner (typically {@link BasicFormulas}). */
    protected owner: FormulaOwner;

    /**
     * @param {FormulaOwner} owner - Formula registration owner whose `parent` is the Calculate engine.
     */
    constructor(owner: FormulaOwner) {
        this.owner = owner;
        this.parent = owner.parent;
    }

    /**
     * @hidden
     * @param {string} value - specify the value
     * @returns {number} - Returns parse double value.
     */
    protected parseDouble(value: string): number {
        const val: number = this.parent.parseFloat(value.toString());
        return !isNaN(val) ? val : NaN;
    }

    /**
     * @hidden
     * @param {string} range - Cell / range text.
     * @returns {string} - Sheet token prefix when present.
     */
    protected getSheetReference(range: string): string {
        return range.indexOf(this.parent.sheetToken) === 0 && range.lastIndexOf(this.parent.sheetToken) > range.indexOf(
            this.parent.sheetToken) ? range.substring(0, range.lastIndexOf(this.parent.sheetToken) + 1) : '';
    }

    /**
     * @hidden
     * @param {string[]} ranges - IFS ranges / criteria.
     * @param {string} isAvgIfs - AVERAGEIFS marker.
     * @returns {string | number} - Aggregated IFS result.
     */
    protected calculateIFS(ranges: string[], isAvgIfs?: string): string | number {
        if (isNullOrUndefined(ranges) || ranges[0] === '' || ranges.length < 2 || ranges.length > 127 || ranges.length % 2 === 0) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (ranges.length === 3 && ranges[2] !== '""') { // SUMIFS and AVERAGEIFS OR operation will contains only 3 arguments.
            if (ranges[2].includes(this.parent.tic + this.parent.tic)) {
                let result: string = ''; let sumVal: string;
                const separator: string = this.parent.getParseArgumentSeparator();
                const criterias: string[] = ranges[2].split(this.parent.tic + this.parent.tic);
                criterias.forEach((criteria: string) => {
                    criteria = criteria.trim().split(this.parent.tic).join('');
                    if (criteria) {
                        sumVal = this.parent.computeIfsFormulas(
                            [ranges[0], ranges[1], criteria], this.parent.falseValue, isAvgIfs).toString();
                        result += (result ? separator : '') + sumVal;
                    }
                });
                return result;
            }
        }
        return this.parent.computeIfsFormulas(ranges, this.parent.falseValue, isAvgIfs);
    }

    /**
     * Resolve an argument to a display/text value (strips quotes for literals).
     *
     * @hidden
     * @param {string} arg - Formula argument token.
     * @returns {string} - Resolved text (may be an error token).
     */
    protected resolveTextArg(arg: string): string {
        if (isNullOrUndefined(arg)) {
            return '';
        }
        let value: string = this.parent.getValueFromArg(arg);
        const errCollection: string[] = this.parent.getErrorStrings();
        if (errCollection.indexOf(value) > -1) {
            return value;
        }
        if (!this.parent.isCellReference(arg)) {
            value = this.parent.removeTics(value);
        }
        return value;
    }

    /**
     * Resolve an argument to a number (booleans → 1/0).
     *
     * @hidden
     * @param {string} arg - Formula argument token.
     * @returns {number | string} - Number or error token.
     */
    protected resolveNumberArg(arg: string): number | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        let value: string = this.parent.getValueFromArg(arg);
        if (errCollection.indexOf(value) > -1) {
            return value;
        }
        if (value === '') {
            return 0;
        }
        const upper: string = value.toUpperCase();
        if (upper === this.parent.trueValue) {
            return 1;
        }
        if (upper === this.parent.falseValue) {
            return 0;
        }
        if (!this.parent.isCellReference(arg)) {
            value = this.parent.removeTics(value);
        }
        if (value.indexOf('%') > -1) {
            const pct: string = value.replace('%', '');
            if (this.parent.isNumber(pct)) {
                return this.parent.parseFloat(pct) / 100;
            }
        }
        const num: number = this.parent.parseFloat(value);
        if (isNaN(num)) {
            return errCollection[CommonErrors.Value];
        }
        return num;
    }
}
