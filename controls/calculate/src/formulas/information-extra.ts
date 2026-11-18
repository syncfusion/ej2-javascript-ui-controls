import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Extended information functions: ISBLANK, ISERROR, ISFORMULA, and cell metadata probes.
 *
 * Registers 12 functions including ISBLANK, ISTEXT, ISNONTEXT, ISLOGICAL, ISERROR, and others.
 *
 * @hidden
 */
export class InformationExtraFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'ISBLANK', category: 'Information', description: 'Returns TRUE if the value is blank.', syntax: 'ISBLANK(value)' },
        { formulaName: 'ISTEXT', category: 'Information', description: 'Returns TRUE if the value is text.', syntax: 'ISTEXT(value)' },
        { formulaName: 'ISNONTEXT', category: 'Information', description: 'Returns TRUE if the value is not text.', syntax: 'ISNONTEXT(value)' },
        { formulaName: 'ISLOGICAL', category: 'Information', description: 'Returns TRUE if the value is a logical value.', syntax: 'ISLOGICAL(value)' },
        { formulaName: 'ISERROR', category: 'Information', description: 'Returns TRUE if the value is any error value.', syntax: 'ISERROR(value)' },
        { formulaName: 'ISERR', category: 'Information', description: 'Returns TRUE if the value is any error value except #N/A.', syntax: 'ISERR(value)' },
        { formulaName: 'ISNA', category: 'Information', description: 'Returns TRUE if the value is the #N/A error value.', syntax: 'ISNA(value)' },
        { formulaName: 'ISEVEN', category: 'Information', description: 'Returns TRUE if the number is even.', syntax: 'ISEVEN(number)' },
        { formulaName: 'ISODD', category: 'Information', description: 'Returns TRUE if the number is odd.', syntax: 'ISODD(number)' },
        { formulaName: 'N', category: 'Information', description: 'Returns a value converted to a number.', syntax: 'N(value)' },
        { formulaName: 'NA', category: 'Information', description: 'Returns the error value #N/A.', syntax: 'NA()' },
        { formulaName: 'TYPE', category: 'Information', description: 'Returns a number indicating the data type of a value.', syntax: 'TYPE(value)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private requireOne(args: string[]): string | null {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return null;
    }

    /**
     * Returns TRUE if the value is blank.
     *
     * Excel: `ISBLANK(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     *
     * @example
     * ```ts
     * engine.computeFormula('=ISBLANK(1)');
     * ```
     */
    public ComputeISBLANK(...args: string[]): boolean | string {
        const bad: string | null = this.requireOne(args);
        if (bad) {
            return bad;
        }
        if (this.parent.isCellReference(args[0])) {
            return this.parent.getValueFromArg(args[0]) === '';
        }
        const val: string = this.parent.getValueFromArg(args[0]);
        return val === '';
    }

    /**
     * Returns TRUE if the value is text.
     *
     * Excel: `ISTEXT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeISTEXT(...args: string[]): boolean | string {
        const bad: string | null = this.requireOne(args);
        if (bad) {
            return bad;
        }
        const val: string = this.parent.getValueFromArg(args[0]);
        if (this.parent.getErrorStrings().indexOf(val) > -1) {
            return false;
        }
        if (val === '') {
            return false;
        }
        if (val.toUpperCase() === this.parent.trueValue || val.toUpperCase() === this.parent.falseValue) {
            return false;
        }
        return isNaN(this.parent.parseFloat(val)) || (!this.parent.isCellReference(args[0]) && args[0].indexOf(this.parent.tic) > -1);
    }

    /**
     * Returns TRUE if the value is not text.
     *
     * Excel: `ISNONTEXT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeISNONTEXT(...args: string[]): boolean | string {
        const result: boolean | string = this.ComputeISTEXT(...args);
        return typeof result === 'string' ? result : !result;
    }

    /**
     * Returns TRUE if the value is a logical value.
     *
     * Excel: `ISLOGICAL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeISLOGICAL(...args: string[]): boolean | string {
        const bad: string | null = this.requireOne(args);
        if (bad) {
            return bad;
        }
        const val: string = this.parent.getValueFromArg(args[0]).toUpperCase();
        return val === this.parent.trueValue || val === this.parent.falseValue;
    }

    /**
     * Returns TRUE if the value is any error value.
     *
     * Excel: `ISERROR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeISERROR(...args: string[]): boolean | string {
        const bad: string | null = this.requireOne(args);
        if (bad) {
            return bad;
        }
        const val: string = this.parent.getValueFromArg(args[0]);
        return this.parent.getErrorStrings().indexOf(val) > -1 || /^#[A-Z/?!]+$/.test(val);
    }

    /**
     * Returns TRUE if the value is any error value except #N/A.
     *
     * Excel: `ISERR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeISERR(...args: string[]): boolean | string {
        const bad: string | null = this.requireOne(args);
        if (bad) {
            return bad;
        }
        const val: string = this.parent.getValueFromArg(args[0]);
        if (val === this.parent.getErrorStrings()[CommonErrors.NA] || val === '#N/A') {
            return false;
        }
        return this.parent.getErrorStrings().indexOf(val) > -1 || /^#[A-Z/?!]+$/.test(val);
    }

    /**
     * Returns TRUE if the value is the #N/A error value.
     *
     * Excel: `ISNA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeISNA(...args: string[]): boolean | string {
        const bad: string | null = this.requireOne(args);
        if (bad) {
            return bad;
        }
        const val: string = this.parent.getValueFromArg(args[0]);
        return val === this.parent.getErrorStrings()[CommonErrors.NA] || val === '#N/A';
    }

    /**
     * Returns TRUE if the number is even.
     *
     * Excel: `ISEVEN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeISEVEN(...args: string[]): boolean | string {
        return this.parity(args, true);
    }

    /**
     * Returns TRUE if the number is odd.
     *
     * Excel: `ISODD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeISODD(...args: string[]): boolean | string {
        return this.parity(args, false);
    }

    private parity(args: string[], wantEven: boolean): boolean | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        const bad: string | null = this.requireOne(args);
        if (bad) {
            return bad;
        }
        const num: number | string = this.resolveNumberArg(args[0]);
        if (typeof num === 'string') {
            return errCollection[CommonErrors.Value];
        }
        const truncated: number = num < 0 ? Math.ceil(num) : Math.floor(num);
        const even: boolean = truncated % 2 === 0;
        return wantEven ? even : !even;
    }

    /**
     * Returns a value converted to a number.
     *
     * Excel: `N(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeN(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        const bad: string | null = this.requireOne(args);
        if (bad) {
            return bad;
        }
        const val: string = this.parent.getValueFromArg(args[0]);
        if (errCollection.indexOf(val) > -1) {
            return val;
        }
        if (val.toUpperCase() === this.parent.trueValue) {
            return '1';
        }
        if (val.toUpperCase() === this.parent.falseValue || val === '') {
            return '0';
        }
        const num: number = this.parent.parseFloat(val);
        return isNaN(num) ? '0' : num.toString();
    }

    /**
     * Returns the error value #N/A.
     *
     * Excel: `NA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeNA(...args: string[]): string {
        if (args && args.length === 1 && args[0] === '') {
            return this.parent.getErrorStrings()[CommonErrors.NA];
        }
        if (args && args.length > 0 && !(args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return this.parent.getErrorStrings()[CommonErrors.NA];
    }

    /**
     * Returns a number indicating the data type of a value.
     *
     * Excel: `TYPE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTYPE(...args: string[]): string | number {
        const bad: string | null = this.requireOne(args);
        if (bad) {
            return bad;
        }
        const val: string = this.parent.getValueFromArg(args[0]);
        if (this.parent.getErrorStrings().indexOf(val) > -1 || /^#[A-Z/?!]+$/.test(val)) {
            return '16';
        }
        if (val.toUpperCase() === this.parent.trueValue || val.toUpperCase() === this.parent.falseValue) {
            return '4';
        }
        if (val !== '' && !isNaN(this.parent.parseFloat(val)) &&
            (this.parent.isCellReference(args[0]) || args[0].indexOf(this.parent.tic) === -1)) {
            return '1';
        }
        return '2';
    }
}
