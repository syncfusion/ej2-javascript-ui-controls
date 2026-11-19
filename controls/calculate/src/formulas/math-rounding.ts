import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { isCellReference } from '../common/cell-ref';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Rounding and truncation functions for numeric precision control, including CEILING, FLOOR, ROUND, and TRUNC variants.
 *
 * Registers 9 functions including ROUND, ROUNDUP, ROUNDDOWN, FLOOR, CEILING, and others.
 *
 * @hidden
 */
export class MathRoundingFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'ROUND', category: 'Math & Trig', description: 'Rounds a number to a specified number of digits.', syntax: 'ROUND(number, num_digits)' },
        { formulaName: 'ROUNDUP', category: 'Math & Trig', description: 'Rounds a number away from zero.', syntax: 'ROUNDUP(number, num_digits)' },
        { formulaName: 'ROUNDDOWN', category: 'Math & Trig', description: 'Rounds a number down, toward zero.', syntax: 'ROUNDDOWN(number, num_digits)' },
        { formulaName: 'FLOOR', category: 'Math & Trig', description: 'Returns the round a number down to the nearest integer.', syntax: 'FLOOR(number, [significance])' },
        { formulaName: 'CEILING', category: 'Math & Trig', description: 'Returns a number rounded up to a multiple of another number.', syntax: 'CEILING(number, significance)' },
        { formulaName: 'INT', category: 'Math & Trig', description: 'Returns a number to the nearest integer.', syntax: 'INT(number)' },
        { formulaName: 'TRUNC', category: 'Math & Trig', description: 'Returns the truncated value of a number to a specified number of decimal places.', syntax: 'TRUNC(number, [num_digits])' },
        { formulaName: 'ODD', category: 'Math & Trig', description: 'Rounds a positive number up and negative number down to the nearest odd integer.', syntax: 'ODD(number)' },
        { formulaName: 'EVEN', category: 'Math & Trig', description: 'Rounds a positive number up and negative number down to the nearest even integer.', syntax: 'EVEN(number)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Rounds a number to a specified number of digits.
     *
     * Excel: `ROUND(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=ROUND(3.1415,2)');
     * ```
     */
    public ComputeROUND(...args: string[]): number | string {
        if (!args.length || args.length === 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArr: string[] = args;
        if (args.length === 1) {
            const orgValue: number | string = (argArr[0].split(this.parent.tic).join('') === 'TRUE')
                ? '1'
                : (argArr[0].split(this.parent.tic).join('') === 'FALSE')
                    ? '0'
                    : argArr[0];
            if (isNaN(this.parent.parseFloat(orgValue))) {
                return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
            }
            return Math.round(this.parent.parseFloat(orgValue)).toString();
        }
        let numStr: string | number = this.parent.getValueFromArg(argArr[0]);
        if (this.parent.getErrorStrings().indexOf(numStr) > -1) {
            return numStr;
        }
        let digStr: string | number = this.parent.getValueFromArg(argArr[1]);
        if (this.parent.getErrorStrings().indexOf(digStr) > -1) {
            return digStr;
        }
        numStr = numStr === 'TRUE' ? '1' : numStr === 'FALSE' ? '0' : numStr;
        digStr = digStr === 'TRUE' ? '1' : digStr === 'FALSE' ? '0' : digStr;
        numStr = numStr.split(this.parent.tic).join('');
        digStr = digStr.split(this.parent.tic).join('');
        const isInvalidNumStr: boolean = isNaN(Number(numStr)) || numStr.trim() === '';
        const isInvalidDigStr: boolean = isNaN(Number(digStr)) || digStr.trim() === '';
        if (((argArr[0].indexOf('"') > -1 || this.parent.isCellReference(argArr[0])) && isInvalidNumStr)
            || ((argArr[1].indexOf('"') > -1 || this.parent.isCellReference(argArr[1])) && isInvalidDigStr)) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if ((numStr === '' && digStr === '') || numStr === '') {
            return 0;
        }
        const x: number = this.parent.parseFloat(numStr);
        const digits: number = this.parent.parseFloat(digStr);
        let round: number | string;
        if (!isNaN(digits) && !isNaN(x) && digits > 0) {
            round = this.parent.parseFloat(this.preciseRound(x, digits, 'ROUND'));
        } else {
            const mult: number = Math.pow(10, -digits);
            round = Math.round(x / mult) * mult;
        }
        return round.toString();
    }

    private preciseRound(numValue: number, decimalValue: number, formula: string): string {
        const factor: number = Math.pow(10, decimalValue);
        const absValue: number = Math.abs(numValue) * factor;
        const sign: number = numValue >= 0 ? 1 : -1;
        const result: number = formula === 'ROUND' ? Math.round(absValue) : formula === 'ROUNDDOWN' ?
            Math.floor(absValue) : Math.ceil(absValue);
        return (sign * (result / factor)).toFixed(decimalValue);
    }

    /**
     * Rounds a number away from zero.
     *
     * Excel: `ROUNDUP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeROUNDUP(...args: string[]): string | number {
        let str: string; let arg1: string; let arg2: string;
        let num: number;
        const len: number = args.length;
        if (len === 1 && args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (len !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (this.parent.isCellReference(args[0])) {
            arg1 = this.parent.getValueFromArg(args[0]) || '0';
        } else {
            if (args[0].indexOf(this.parent.tic) > -1 && (args[0].split(this.parent.tic).join('') === this.parent.trueValue ||
                args[0].split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            arg1 = this.parent.getValueFromArg(args[0]).split(this.parent.tic).join('');
        }
        if (this.parent.getErrorStrings().indexOf(arg1) > -1) { return arg1; }
        if (this.parent.isCellReference(args[1])) {
            arg2 = this.parent.getValueFromArg(args[1]) || '0';
        } else {
            if (args[1].indexOf(this.parent.tic) > -1 && (args[1].split(this.parent.tic).join('') === this.parent.trueValue ||
                args[1].split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            arg2 = this.parent.getValueFromArg(args[1]).split(this.parent.tic).join('');
        }
        if (this.parent.getErrorStrings().indexOf(arg2) > -1) { return arg2; }
        arg1 = arg1.toUpperCase() === 'TRUE' ? '1' : (arg1 === 'FALSE' ? '0' : arg1);
        arg2 = arg2.toUpperCase() === 'TRUE' ? '1' : (arg2 === 'FALSE' ? '0' : arg2);
        const isInvalidNumStr: boolean = isNaN(Number(arg1)) || arg1.trim() === '';
        const isInvalidDigStr: boolean = isNaN(Number(arg2)) || arg2.trim() === '';
        if (((args[0].indexOf('"') > -1 || this.parent.isCellReference(args[0])) && isInvalidNumStr)
            || ((args[1].indexOf('"') > -1 || this.parent.isCellReference(args[1])) && isInvalidDigStr)) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        const digits: number = Math.ceil(this.parent.parseFloat(arg2));
        num = this.parent.parseFloat(arg1);
        if (digits > 0) {
            const decimalArr: string[] = arg1.split('.');
            const decimalCount: number = decimalArr.length === 2 ? (decimalArr[1].length >= digits ? digits : decimalArr[1].length) : 0;
            num = this.parent.parseFloat(this.preciseRound(num, decimalCount, 'ROUNDUP'));
            str = num.toString();
            if (isNaN(num)) {
                if (digits.toString().indexOf('"') > - 1) {
                    str = this.parent.getErrorStrings()[CommonErrors.Value];
                } else {
                    str = this.parent.getErrorStrings()[CommonErrors.Name];
                }
            }
        } else {
            if (num > 0) {
                num = (num / Math.pow(10, -digits)) + .49999;
            } else if (num < 0) {
                num = (num / Math.pow(10, -digits)) - .49999;
            }
            if (num > 0 && digits < -9) {
                num = 1 * Math.pow(10, -digits);
            } else {
                num = this.parent.parseFloat(num.toFixed(0)) * Math.pow(10, -digits);
            }
            str = num.toString();
            if (isNaN(num)) {
                str = (digits.toString().indexOf('"') > - 1) ? this.parent.getErrorStrings()[CommonErrors.Value] :
                    str = this.parent.getErrorStrings()[CommonErrors.Name];
            }
        }
        return str;
    }

    /**
     * Rounds a number down, toward zero.
     *
     * Excel: `ROUNDDOWN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeROUNDDOWN(...args: string[]): string | number {
        let result: string; let arg1: string; let arg2: string;
        let num: number;
        const len: number = args.length;
        if (len === 1 && args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (len !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (this.parent.isCellReference(args[0])) {
            arg1 = this.parent.getValueFromArg(args[0]) || '0';
        } else {
            if (args[0].indexOf(this.parent.tic) > -1 && (args[0].split(this.parent.tic).join('') === this.parent.trueValue ||
                args[0].split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            arg1 = this.parent.getValueFromArg(args[0]).split(this.parent.tic).join('');
        }
        if (this.parent.getErrorStrings().indexOf(arg1) > -1) { return arg1; }
        if (this.parent.isCellReference(args[1])) {
            arg2 = this.parent.getValueFromArg(args[1]) || '0';
        } else {
            if (args[1].indexOf(this.parent.tic) > -1 && (args[1].split(this.parent.tic).join('') === this.parent.trueValue ||
                args[1].split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            arg2 = this.parent.getValueFromArg(args[1]).split(this.parent.tic).join('');
        }
        if (this.parent.getErrorStrings().indexOf(arg2) > -1) { return arg2; }
        arg1 = arg1.toUpperCase() === 'TRUE' ? '1' : (arg1 === 'FALSE' ? '0' : arg1);
        arg2 = arg2.toUpperCase() === 'TRUE' ? '1' : (arg2 === 'FALSE' ? '0' : arg2);
        const isInvalidNumStr: boolean = isNaN(Number(arg1)) || arg1.trim() === '';
        const isInvalidDigStr: boolean = isNaN(Number(arg2)) || arg2.trim() === '';
        if (((args[0].indexOf('"') > -1 || this.parent.isCellReference(args[0])) && isInvalidNumStr)
            || ((args[1].indexOf('"') > -1 || this.parent.isCellReference(args[1])) && isInvalidDigStr)) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        const digits: number = Math.ceil(this.parent.parseFloat(arg2));
        num = this.parent.parseFloat(arg1);
        if (digits > 0) {
            const decimalIndex: number = arg1.indexOf('.');
            let decimalCount: number = 0;
            if (decimalIndex !== -1) {
                decimalCount = arg1.length - decimalIndex - 1;
                decimalCount = decimalCount >= digits ? digits : decimalCount;
            }
            num = this.parent.parseFloat(this.preciseRound(num, decimalCount, 'ROUNDDOWN'));
            result = num.toString();
            if (isNaN(num)) {
                if (digits.toString().indexOf('"') > - 1) {
                    result = this.parent.getErrorStrings()[CommonErrors.Value];
                } else {
                    result = this.parent.getErrorStrings()[CommonErrors.Name];
                }
            }
        } else {
            if (num > 0) {
                num = (num / Math.pow(10, -digits)) - .49999;
            } else if (num < 0) {
                num = (num / Math.pow(10, -digits)) + .49999;
            }
            if (num > 0 && digits < -9) {
                num = 1 * Math.pow(10, -digits);
            } else {
                num = this.parent.parseFloat(num.toFixed(0)) * Math.pow(10, -digits);
            }
            result = num.toString();
            if (isNaN(num)) {
                result = (digits.toString().indexOf('"') > - 1) ? this.parent.getErrorStrings()[CommonErrors.Value] :
                    result = this.parent.getErrorStrings()[CommonErrors.Name];
            }
        }
        return result;
    }

    /**
     * Returns the round a number down to the nearest integer.
     *
     * Excel: `FLOOR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFLOOR(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argArr: string[] = args;
        const argCount: number = argArr.length;
        let value: string;
        if (argCount !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if ((argArr[0] === '' && argArr[1] === '') || (argArr[0] === '' && !argArr[1].includes('"'))) {
            return 0;
        } else if (argArr[1] === '' && !argArr[0].includes('"')) {
            argArr[1] = '0';
        }
        for (let i: number = 0; i < argArr.length; i++) {
            const argVal: string = argArr[i as number].split(this.parent.tic).join('').trim();
            if (argVal === '' || (argArr[i as number].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(argVal)))) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            if (isCellReference(argArr[i as number])) {
                value = this.parent.getValueFromArg(argArr[i as number]) || '0';
                value = (value === this.parent.trueValue) ? '1' : (value === this.parent.falseValue) ? '0' : value;
                if (value.toUpperCase().match(/[A-Z]/) || value.includes('"') || !this.parent.isNumber(value)) {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
            } else {
                value = this.parent.getValueFromArg(argArr[i as number].split(this.parent.tic).join(''));
                value = value === this.parent.trueValue ? '1' : (value === this.parent.falseValue ? '0' : value);
                if (value.toUpperCase().match(/[A-Z]/) || value.includes('"') || !this.parent.isNumber(value)) {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
            }
            argArr[i as number] = value;
        }
        const fnum: number = this.parent.parseFloat(argArr[0]);
        const significance: number = this.parent.parseFloat(argArr[1]);
        if (fnum > 0 && significance < 0) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        if ((fnum > 0 || fnum < 0) && significance === 0) {
            return this.parent.getErrorStrings()[CommonErrors.DivZero];
        }
        if (isNaN(fnum)) {
            return this.parent.getErrorStrings()[CommonErrors.Name];
        }
        if (fnum === 0 && significance === 0) {
            return 0;
        }
        return Math.floor(fnum / significance) * significance;
    }

    /**
     * Returns a number rounded up to a multiple of another number.
     *
     * Excel: `CEILING(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCEILING(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argArr: string[] = args;
        const argCount: number = argArr.length;
        let value: string;
        if (argCount !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if ((argArr[0] === '' && argArr[1] === '') || (argArr[0] === '' && !argArr[1].includes('"'))) {
            return 0;
        } else if (argArr[1] === '' && !argArr[0].includes('"')) {
            argArr[1] = '0';
        }
        for (let i: number = 0; i < argArr.length; i++) {
            const argVal: string = argArr[i as number].split(this.parent.tic).join('').trim();
            if (argVal === '' || (argArr[i as number].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(argVal)))) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            if (isCellReference(argArr[i as number])) {
                value = this.parent.getValueFromArg(argArr[i as number]) || '0';
                value = (value === this.parent.trueValue) ? '1' : (value === this.parent.falseValue) ? '0' : value;
                if (value.toUpperCase().match(/[A-Z]/) || value.includes('"') || !this.parent.isNumber(value)) {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
            } else {
                value = this.parent.getValueFromArg(argArr[i as number].split(this.parent.tic).join(''));
                value = (value === this.parent.trueValue) ? '1' : (value === this.parent.falseValue) ? '0' : value;
                if (value.toUpperCase().match(/[A-Z]/) || value.includes('"') || !this.parent.isNumber(value)) {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
            }
            argArr[i as number] = value;
        }
        const cnum: number = this.parent.parseFloat(argArr[0]);
        const significance: number = this.parent.parseFloat(argArr[1]);
        if (cnum > 0 && significance < 0) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        if (isNaN(cnum)) {
            return this.parent.getErrorStrings()[CommonErrors.Name];
        }
        if ((cnum > 0 || cnum === 0) && significance === 0) {
            return 0;
        }
        return Math.ceil(cnum / significance) * significance;
    }

    /**
     * Returns a number to the nearest integer.
     *
     * Excel: `INT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeINT(...args: string[]): string | number {
        let argsValue: string | number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (args[0] === '' && args.length === 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        argsValue = this.parent.getValueFromArg(args[0]);
        if (errCollection.indexOf(argsValue) > -1) {
            return argsValue;
        }
        if (argsValue.toUpperCase() === this.parent.trueValue) {
            argsValue = '1';
        } else if (argsValue.toUpperCase() === this.parent.falseValue) {
            argsValue = '0';
        }
        if (!this.parent.isCellReference(args[0])) {
            if (args[0].indexOf(this.parent.tic + this.parent.tic) === -1) {
                argsValue = argsValue.split(this.parent.tic).join('');
            }
            if (argsValue.trim() === '') {
                return errCollection[CommonErrors.Value];
            }
        }
        if (argsValue.indexOf('%') > -1) {
            argsValue = (Number(argsValue.split('%')[0]) * 0.01).toString();
        }
        if (isNaN(this.parent.parseFloat(argsValue))) {
            return errCollection[CommonErrors.Value];
        }
        argsValue = this.parent.parseFloat(argsValue);
        argsValue = Math.floor(argsValue);
        return argsValue;
    }

    /**
     * Returns the truncated value of a number to a specified number of decimal places.
     *
     * Excel: `TRUNC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeTRUNC(...args: string[]): boolean | string {
        let orgNumValue: number | string;
        let orgDigitValue: number | string = 0;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args[0] === '' && args.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length === 0 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const processArgs: Function = (orgValue: string): string => {
            let actualValue: string = this.parent.getValueFromArg(orgValue);
            if (errCollection.indexOf(actualValue) > -1) { return actualValue; }
            if (actualValue === this.parent.trueValue) {
                actualValue = '1';
            } else if (actualValue === this.parent.falseValue) {
                actualValue = '0';
            } else if (!this.parent.isCellReference(orgValue)) {
                if (orgValue.indexOf(this.parent.tic) > -1 && this.parent.removeTics(orgValue).match(/^(\d*\.\d+|\d+)\s*[*]\s*(\d*\.\d+|\d+)$/)) {
                    actualValue = this.parent.getValueFromArg(this.parent.removeTics(orgValue));
                } else if (actualValue.indexOf(this.parent.tic) > -1) {
                    actualValue = this.parent.removeTics(actualValue);
                    if (actualValue.trim() === '') {
                        return errCollection[CommonErrors.Value];
                    } else if (actualValue.indexOf(':') > -1) {
                        const values: string[] = actualValue.split(':');
                        if (values.length <= 3) {
                            if (!this.parent.isNumber(values[0]) || !this.parent.isNumber(values[1])) {
                                return errCollection[CommonErrors.Value];
                            }
                            let hours: number = Number(values[0]) + Number((Number(values[1]) / 60));
                            if (values.length === 3) {
                                if (!this.parent.isNumber(values[2])) {
                                    return errCollection[CommonErrors.Value];
                                }
                                hours += Number(Number(values[2]) / 3600);
                            }
                            actualValue = (hours / 24).toString();
                        } else {
                            return errCollection[CommonErrors.Value];
                        }
                    }
                }
                if (actualValue.split('%').length === 2 && this.parent.isNumber(actualValue.split('%')[0])) {
                    actualValue = (Number(actualValue.split('%')[0]) * 0.01).toString();
                }
            }
            return actualValue;
        };
        if (!isNullOrUndefined(args[0])) {
            orgNumValue = processArgs(args[0]) as string;
            if (errCollection.indexOf(orgNumValue) > -1) { return orgNumValue; }
            orgNumValue = this.parent.parseFloat(orgNumValue);
            if (isNaN(orgNumValue)) {
                return errCollection[CommonErrors.Value];
            }
        }
        if (!isNullOrUndefined(args[1])) {
            orgDigitValue = processArgs(args[1]) as string;
            if (errCollection.indexOf(orgDigitValue) > -1) { return orgDigitValue; }
            orgDigitValue = this.parent.parseFloat(orgDigitValue);
            if (isNaN(orgDigitValue)) {
                return errCollection[CommonErrors.Value];
            }
        }
        orgDigitValue = Math.pow(10, Math.floor(orgDigitValue));
        orgNumValue = Number(orgNumValue);
        return ((orgNumValue < 0 ? -1 : 1) * Math.floor(orgDigitValue * Math.abs(orgNumValue)) / orgDigitValue).toString();
    }

    /**
     * Rounds a positive number up and negative number down to the nearest odd integer.
     *
     * Excel: `ODD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeODD(...args: string[]): string | number  {
        if (isNullOrUndefined(args) || args.length !== 1 || args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argVal: string = args[0].split(this.parent.tic).join('').trim();
        if (argVal === '' || (args[0].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(argVal)))) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        let val: string;
        if (isCellReference(args[0])) {
            val = this.parent.getValueFromArg(args[0]);
            if (this.parent.getErrorStrings().indexOf(val) > -1) {
                return val;
            }
            if (val === this.parent.trueValue) {
                val = '1';
            } else if (val === '' || val === this.parent.falseValue) {
                val = '0';
            } else if (val.toUpperCase().match(/[A-Z]/) || val.includes('"') || !this.parent.isNumber(val)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            val = this.parent.getValueFromArg(args[0].split(this.parent.tic).join(''));
            if (val === '#NAME?') {
                return this.parent.getErrorStrings()[CommonErrors.Name];
            }
            if (val === this.parent.trueValue) {
                val = '1';
            } else if (val === '' || val === this.parent.falseValue) {
                val = '0';
            } else if (val.toUpperCase().match(/[A-Z]/) || !this.parent.isNumber(val)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        let result: number = Math.ceil(parseInt(val, 10));
        const isOne: boolean = result === 0;
        result = result % 2 === 0 ? (result > 0 ? result + 1 : result - 1) : result;
        if (Math.ceil(parseInt(val, 10)) % 2 !== 0) {
            if (parseInt(val, 10) > 0 && parseFloat(val) > parseInt(val, 10)) {
                result = result + 2;
            } else if (parseInt(val, 10) < 0 && parseFloat(val) < parseInt(val, 10)) {
                result = result - 2;
            }
        }
        if (isNaN(result)) { return this.parent.getErrorStrings()[CommonErrors.Name]; }
        return isOne ? 1 : result;
    }

    /**
     * Rounds a positive number up and negative number down to the nearest even integer.
     *
     * Excel: `EVEN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeEVEN(...args: string[]): string | number  {
        if (isNullOrUndefined(args) || args.length !== 1 || args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argVal: string = args[0].split(this.parent.tic).join('').trim();
        if (argVal === '' || (args[0].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(argVal)))) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        let value1: string;
        if (isCellReference(args[0])) {
            value1 = this.parent.getValueFromArg(args[0]);
            if (this.parent.getErrorStrings().indexOf(value1) > -1) {
                return value1;
            }
            if (value1 === this.parent.trueValue) {
                value1 = '1';
            } else if (value1 === '' || value1 === this.parent.falseValue) {
                value1 = '0';
            } else if (value1.toUpperCase().match(/[A-Z]/) || value1.includes('"') || !this.parent.isNumber(value1)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            value1 = this.parent.getValueFromArg(args[0].split(this.parent.tic).join(''));
            if (value1 === '#NAME?') {
                return this.parent.getErrorStrings()[CommonErrors.Name];
            }
            if (value1 === this.parent.trueValue) {
                value1 = '1';
            } else if (value1 === '' || value1 === this.parent.falseValue) {
                value1 = '0';
            } else if (value1.toUpperCase().match(/[A-Z]/) || !this.parent.isNumber(value1)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        let result: string | number = Math.ceil(parseInt(value1, 10));
        result = result % 2 === 0 ? result : (result > 0 ? result + 1 : result - 1);
        if (Math.ceil(parseInt(value1, 10)) % 2 === 0) {
            if (parseInt(value1, 10) > 0 && parseFloat(value1) > parseInt(value1, 10)) {
                result = result + 2;
            } else if (parseInt(value1, 10) < 0 && parseFloat(value1) < parseInt(value1, 10)) {
                result = result - 2;
            }
        }
        if (isNaN(result)) { return this.parent.getErrorStrings()[CommonErrors.Name]; }
        return result;
    }
}
