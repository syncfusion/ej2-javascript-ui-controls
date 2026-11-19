import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { isCellReference } from '../common/cell-ref';
import { CalculateDateParseResult } from '../common/interface';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Core numeric utilities: absolute value, random numbers, logarithms, powers, roots, factorials, and angle/unit conversions.
 *
 * Registers 14 functions including ABS, RAND, RANDBETWEEN, RADIANS, DEGREES, and others.
 *
 * @hidden
 */
export class MathMiscFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'ABS', category: 'Math & Trig', description: 'Returns the absolute value of a number.', syntax: 'ABS(number)' },
        { formulaName: 'RAND', category: 'Math & Trig', description: 'Return a random number between 0 and 1.', syntax: 'RAND()' },
        { formulaName: 'RANDBETWEEN', category: 'Math & Trig', description: 'Returns an integer random number in a specified range.', syntax: 'RANDBETWEEN(bottom, top)' },
        { formulaName: 'RADIANS', category: 'Math & Trig', description: 'Converts degrees to radians.', syntax: 'RADIANS(angle)' },
        { formulaName: 'DEGREES', category: 'Math & Trig', description: 'Converts radians to degrees.', syntax: 'DEGREES(angle)' },
        { formulaName: 'PI', category: 'Math & Trig', description: 'Returns the value of pi.', syntax: 'PI()' },
        { formulaName: 'MOD', category: 'Math & Trig', description: 'Returns a remainder after a number is divided by divisor.', syntax: 'MOD(number, divisor)' },
        { formulaName: 'FACT', category: 'Math & Trig', description: 'Returns the factorial of a number.', syntax: 'FACT(number)' },
        { formulaName: 'DECIMAL', category: 'Math & Trig', description: 'Converts a text representation of a number in a given base into a decimal number.', syntax: 'DECIMAL(text, radix)' },
        { formulaName: 'LN', category: 'Math & Trig', description: 'Returns the natural logarithm of a number.', syntax: 'LN(number)' },
        { formulaName: 'LOG', category: 'Math & Trig', description: 'Returns the logarithm of a number to the base that you specify.', syntax: 'LOG(number, [base])' },
        { formulaName: 'POWER', category: 'Math & Trig', description: 'Returns the result of a number raised to power.', syntax: 'POWER(number, power)' },
        { formulaName: 'SQRT', category: 'Math & Trig', description: 'Returns the square root of a positive number.', syntax: 'SQRT(number)' },
        { formulaName: 'EXP', category: 'Math & Trig', description: 'Returns e raised to the power of the given number.', syntax: 'EXP(number)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the absolute value of a number.
     *
     * Excel: `ABS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=ABS(-5)');
     * ```
     */
    public ComputeABS(...args: string[]): string | number {
        const argArr: string[] = args;
        let cellvalue: string = '';
        let absVal: number;
        if (args.length === 0 || args.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (argArr[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argVal: string = argArr[0].split(this.parent.tic).join('').trim();
        if (argVal === '' || (argArr[0].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(argVal)))) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (this.parent.isCellReference(argArr[0])) {
            cellvalue = this.parent.getValueFromArg(argArr[0]);
            if (this.parent.getErrorStrings().indexOf(cellvalue) > -1) {
                return cellvalue;
            }
            if (cellvalue === this.parent.trueValue) {
                cellvalue = '1';
            }
            if (cellvalue === '' || cellvalue === this.parent.falseValue) {
                cellvalue = '0';
            }
            absVal = this.parent.parseFloat(cellvalue);
            if (isNaN(absVal) && !this.parent.isNumber(cellvalue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            cellvalue = this.parent.getValueFromArg(argArr[0]).split(this.parent.tic).join();
            if (cellvalue === this.parent.trueValue) {
                cellvalue = '1';
            }
            if (cellvalue === this.parent.falseValue) {
                cellvalue = '0';
            }
            if (this.parent.getErrorStrings().indexOf(cellvalue) > -1) {
                return cellvalue;
            }
            absVal = this.parent.parseFloat(cellvalue);
            if (isNaN(absVal) && !this.parent.isNumber(cellvalue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        return Math.abs(absVal);
    }

    /**
     * Return a random number between 0 and 1.
     *
     * Excel: `RAND(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeRAND(...args: string[]): string {
        if (args.length === 1 && args[0] === '') {
            args.length = 0;
        }
        if (args.length > 0) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return Math.random().toString();
    }

    /**
     * Returns an integer random number in a specified range.
     *
     * Excel: `RANDBETWEEN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeRANDBETWEEN(...args: string[]): string | number {
        let min: number | string;
        let max: number | string;
        if (args.length === 1 && args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const processArgs: Function = (orgValue: string): number | string => {
            let actualValue: string | number;
            actualValue = this.parent.getValueFromArg(orgValue);
            if (errCollection.indexOf(actualValue) > -1) {
                return actualValue;
            }
            if (this.parent.isCellReference(orgValue)) {
                if (actualValue === '') {
                    actualValue = '0';
                } else if (orgValue.indexOf(':') > -1 || actualValue.match(/^(\d*\.\d+|\d+)\s*[+\-*/]\s*(\d*\.\d+|\d+)$/)) {
                    return errCollection[CommonErrors.Value];
                }
            } else {
                if (actualValue === '') {
                    return errCollection[CommonErrors.NA];
                } else if (orgValue.indexOf(this.parent.tic) > -1 && this.parent.removeTics(orgValue).match(/^(\d*\.\d+|\d+)\s*[+*]\s*(\d*\.\d+|\d+)$/)) {
                    return errCollection[CommonErrors.Value];
                } else if (actualValue.indexOf(this.parent.tic) > -1) {
                    actualValue = this.parent.removeTics(actualValue);
                    if (actualValue.indexOf(':') > -1) {
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
            actualValue = parseFloat(actualValue);
            if (isNaN(actualValue)) {
                return errCollection[CommonErrors.Value];
            }
            return actualValue;
        };
        max = processArgs(args[1]);
        if (errCollection.indexOf(max as string) > -1) {
            return max;
        }
        min = processArgs(args[0]);
        if (errCollection.indexOf(min as string) > -1) {
            return min;
        }
        if (min === 0 && max === 0) {
            return '0';
        } else if (max < min) {
            return errCollection[CommonErrors.Num];
        } else {
            min = Math.ceil(min as number);
            max = Math.floor(max as number);
            return Math.floor((Math.random() * ((max - min) + 1)) + min);
        }
    }

    /**
     * Converts degrees to radians.
     *
     * Excel: `RADIANS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeRADIANS(...args: string[]): string | number {
        let value: string | number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args[0] === '' && args.length === 1) ||
            (args[0].split('!').length === 2 && args[0].indexOf(this.parent.tic) === -1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (args[0].indexOf(':') > -1 || args[0].split(this.parent.tic).join('').trim() === '' ||
            args[0].split(this.parent.tic).join('').trim() === '!' || args[0].split('!').length === 2) {
            return errCollection[CommonErrors.Value];
        }
        value = this.parent.getValueFromArg(args[0]).trim();
        if (errCollection.indexOf(value) > -1) { return value; }
        if ((value.indexOf(this.parent.tic) > -1 && args[0].indexOf(this.parent.tic) === -1) ||
            value.split(this.parent.tic).length > 3) {
            return errCollection[CommonErrors.Value];
        }
        if (value.toUpperCase() === this.parent.trueValue) {
            value = '1';
        } else if (value.toUpperCase() === this.parent.falseValue) {
            value = '0';
        } else if (value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
            value = (Number(value.split('%')[0]) / 100).toString();
        }
        value = this.parent.parseFloat(value.split(this.parent.tic).join(''));
        if (!isNaN(value)) {
            value = Math.PI * (value) / 180;
        } else {
            if (this.parent.isCellReference(args[0]) || args[0].indexOf(this.parent.tic) > -1) {
                return errCollection[CommonErrors.Value];
            } else {
                return errCollection[CommonErrors.Name];
            }
        }
        return value;
    }

    /**
     * Converts radians to degrees.
     *
     * Excel: `DEGREES(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDEGREES(...args: string[]): string | number  {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args[0] === '' && args.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let val: string = this.parent.getValueFromArg(args[0]).trim();
        if (errCollection.indexOf(val) > -1) { return val; }
        if (this.parent.isCellReference(args[0])) {
            if (val === '' || val.indexOf(':') > -1) {
                return 0;
            } else if (val.indexOf(this.parent.tic) > -1 || (isNaN(Number(val)) && !isNaN(parseInt(val, 10)))) {
                return errCollection[CommonErrors.Value];
            }
        } else if (val.indexOf('"TRUE"') > -1) {
            return errCollection[CommonErrors.Value];
        }
        val = val.split(this.parent.tic).join('');
        if (val.toUpperCase() === this.parent.trueValue) {
            val = '1';
        } else if (val.toUpperCase() === this.parent.falseValue) {
            val = '0';
        } else if (val.indexOf('%') > -1) {
            val = (Number(val.split('%')[0]) / 100).toString();
        } else if (val.toUpperCase().match(/[A-Z]/) || isNaN(parseInt(val, 10))) {
            return errCollection[CommonErrors.Value];
        }
        return parseFloat(val) * (180 / (Math.PI));
    }

    /**
     * Returns the value of pi.
     *
     * Excel: `PI(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePI(...args: string[]): string | number  {
        let result: string | number;
        if (args && args[0] !== '') {
            result = this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else {
            result = Math.PI;
        }
        return result;
    }

    /**
     * Returns a remainder after a number is divided by divisor.
     *
     * Excel: `MOD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMOD(...args: string[]): string | number  {
        let value: string;
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (args[1] === '' && !args[0].includes('"')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.Div];
        } else if (args[0] === '' && !args[1].includes('"')) {
            return 0;
        }
        for (let i: number = 0; i < args.length; i++) {
            const argVal: string = args[i as number].split(this.parent.tic).join('').trim();
            if (argVal === '' || (args[i as number].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(argVal)))) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            if (isCellReference(args[i as number])) {
                value = this.parent.getValueFromArg(args[i as number]) || '0';
                value = (value === this.parent.trueValue) ? '1' : (value === this.parent.falseValue) ? '0' : value;
                if (value.toUpperCase().match(/[A-Z]/) || value.includes('"') || !this.parent.isNumber(value)) {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
            } else {
                value = this.parent.getValueFromArg(args[i as number].split(this.parent.tic).join(''));
                value = (value === this.parent.trueValue) ? '1' : (value === this.parent.falseValue) ? '0' : value;
                if (this.parent.getErrorStrings().indexOf(value) > -1) { return value; }
            }
            args[i as number] = value;
        }
        let value1: string |number = args[0];
        let value2: string | number = args[1];
        if (value2 === '0' || value2 === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.Div];
        } else if (value1 === '0' || value1 === '') {
            return 0;
        }
        value1 = parseFloat(value1);
        value2 = parseFloat(value2);
        const result: number = ((value1 % value2) + value2) % value2;
        if (isNaN(result)) { return this.parent.getErrorStrings()[CommonErrors.Name]; }
        return result;
    }

    /**
     * Returns the factorial of a number.
     *
     * Excel: `FACT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFACT(...args: string[]): string | number  {
        let fact: number = 1;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let getValue: string = args[0];
        if (this.parent.isCellReference(args[0]) || isNaN(Number(getValue.split(this.parent.tic).join('')))) {
            getValue = this.parent.getValueFromArg(args[0]);
            if (errCollection.indexOf(getValue) > -1) { return getValue; }
            if (getValue.startsWith(this.parent.tic) ||
                getValue.match(/^(\d*\.\d+|\d+)\s*[+\-*/]\s*(\d*\.\d+|\d+)$/)) {
                return errCollection[CommonErrors.Value];
            } else if (getValue === '') {
                return 1;
            }
        }
        getValue = getValue.split(this.parent.tic).join('').trim();
        if (errCollection.indexOf(getValue) > -1) { return getValue; }
        if (getValue.toUpperCase() === this.parent.trueValue || getValue.toUpperCase() === this.parent.falseValue) {
            return 1;
        }
        if (getValue.indexOf('%') > -1) {
            getValue = (Number(getValue.split('%')[0]) / 100).toString();
        }
        const value: number = parseInt(getValue, 10);
        if ((value < 0) || (value > 170)) {
            return errCollection[CommonErrors.Num];
        } else if (getValue.toUpperCase().match(/[A-Z]/) || getValue === '') {
            return errCollection[CommonErrors.Value];
        } else if (getValue.indexOf(':') > -1) {
            return 0;
        }
        for (let i: number = 1; i <= value; i++) {
            fact = fact * i;
        }
        return fact;
    }

    /**
     * Converts a text representation of a number in a given base into a decimal number.
     *
     * Excel: `DECIMAL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDECIMAL(...args: string[]): string | number  {
        let value: number;
        const specialChars: RegExp = /[@#$%^&*()?:{}|<>+-]/g;
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args[0].match(specialChars)) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        } else if (args[1].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(args[1].split(this.parent.tic).join('')))) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        } else {
            let val: string; let val1: string;
            if (this.parent.isCellReference(args[0].toString())) {
                val = this.parent.getValueFromArg(args[0]);
            } else {
                val = this.parent.getValueFromArg(args[0]).split(this.parent.tic).join('');
            }
            if (this.parent.isCellReference(args[1].toString())) {
                val1 = this.parent.getValueFromArg(args[1]);
            } else {
                val1 = this.parent.getValueFromArg(args[1]).split(this.parent.tic).join('');
            }
            const num: number = parseInt(val, 10);
            const radix: number = parseInt(val1, 10);
            if (this.parent.getErrorStrings().indexOf(val) > -1) {
                return val;
            } else if (this.parent.getErrorStrings().indexOf(val1) > -1) {
                return val1;
            } else if (val === '' && val1 !== '') {
                return 0;
            } else if (val === '' || (num < 0) || (!isNaN(num) && !Number.isInteger(parseFloat(val)))) {
                return this.parent.getErrorStrings()[CommonErrors.Num];
            } else if (val1 === '' || (radix < 2 || radix > 36) || isNaN(radix)) {
                return this.parent.getErrorStrings()[CommonErrors.Num];
            } else if (isNaN(this.parent.parseFloat(val)) && this.parent.parseFloat(val1) <= 10) {
                return this.parent.getErrorStrings()[CommonErrors.Num];
            }
            value = parseInt(val, parseInt(val1, 10));
        }
        return isNaN(value) ? this.parent.getErrorStrings()[CommonErrors.Num] : value;
    }

    /**
     * Returns the natural logarithm of a number.
     *
     * Excel: `LN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeLN(...args: string[]): string | number {
        let cellvalue: string | number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args[0] === '' && args.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length === 0 || args.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        cellvalue = this.parent.getValueFromArg(args[0]);
        if (errCollection.indexOf(cellvalue) > -1) {
            return cellvalue;
        }
        if (cellvalue.toUpperCase() === this.parent.trueValue) {
            cellvalue = '1';
        } else if (cellvalue.toUpperCase() === this.parent.falseValue) {
            cellvalue = '0';
        }
        if (!this.parent.isCellReference(args[0])) {
            cellvalue = this.parent.removeTics(cellvalue);
            if (cellvalue.trim() === '') {
                return errCollection[CommonErrors.Value];
            }
        }
        if (cellvalue.split('%').length === 2 && this.parent.isNumber(cellvalue.split('%')[0])) {
            cellvalue = (Number(cellvalue.split('%')[0]) * 0.01).toString();
        }
        cellvalue = this.parent.parseFloat(cellvalue);
        if (cellvalue <= 0) {
            return errCollection[CommonErrors.Num];
        } else if (isNaN(cellvalue)) {
            return errCollection[CommonErrors.Value];
        }
        return Math.log(cellvalue);
    }

    /**
     * Returns the logarithm of a number to the base that you specify.
     *
     * Excel: `LOG(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeLOG(...args: string[]): number | string {
        let orgNumValue: number | string;
        let orgBaseValue: number | string;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const processArgs: Function = (orgValue: string): string => {
            let actualValue: string = this.parent.getValueFromArg(orgValue);
            if (actualValue === this.parent.trueValue) {
                actualValue = '1';
            } else if (actualValue === this.parent.falseValue) {
                actualValue = '0';
            }
            if (!this.parent.isCellReference(orgValue) && actualValue !== '') {
                if (actualValue.indexOf(this.parent.tic) > -1 && errCollection.indexOf(actualValue.split(this.parent.tic).join('')) === -1) {
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
            if (errCollection.indexOf(orgNumValue) > -1) {
                return orgNumValue;
            }
            orgNumValue = this.parent.parseFloat(orgNumValue);
        }
        orgBaseValue = 10;
        if (!isNullOrUndefined(args[1])) {
            orgBaseValue = processArgs(args[1]) as string;
            if (errCollection.indexOf(orgBaseValue) > -1) {
                return orgBaseValue;
            }
            orgBaseValue = this.parent.parseFloat(orgBaseValue);
        }
        orgNumValue = Number(orgNumValue);
        if (isNaN(orgNumValue) || isNaN(orgBaseValue)) {
            return errCollection[CommonErrors.Value];
        } else if (orgNumValue <= 0 || orgBaseValue <= 0) {
            return errCollection[CommonErrors.Num];
        } else if (orgBaseValue === 1) {
            return errCollection[CommonErrors.DivZero];
        }
        return ((Math.log(orgNumValue) / Math.LN10) / (Math.log(orgBaseValue) / Math.LN10)).toString();
    }

    /**
     * Returns the result of a number raised to power.
     *
     * Excel: `POWER(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputePOWER(...args: string[]): boolean | string {
        let power: string | number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0].trim() === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (args[0].trim() === '' && args[1].trim() === '') {
            return errCollection[CommonErrors.Num];
        }
        const processArgs: Function = (actualValue: string): string | number => {
            let value: string | number = this.parent.getValueFromArg(actualValue);
            if (errCollection.indexOf(value) > -1) { return value; }
            if (value.toUpperCase() === this.parent.trueValue) {
                value = '1';
            } else if (value.toUpperCase() === this.parent.falseValue) {
                value = '0';
            }
            if (value.indexOf(this.parent.tic) > -1) {
                value = this.parent.removeTics(value);
                if (actualValue.indexOf(this.parent.tic) === -1 || value.trim() === '') {
                    return errCollection[CommonErrors.Value];
                }
            }
            if (value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
                value = (Number(value.split('%')[0]) / 100).toString();
            } else if (value.indexOf('/') > -1 && this.parent.isNumber(value.split('/').join(''))) {
                return errCollection[CommonErrors.Num];
            }
            value = this.parent.parseFloat(value);
            if (isNaN(value)) {
                return errCollection[CommonErrors.Value];
            }
            return value;
        };
        const numValue: string | number = processArgs(args[0]);
        if (errCollection.indexOf(numValue as string) > -1) { return numValue as string; }
        const powValue: string | number = processArgs(args[1]);
        if (errCollection.indexOf(powValue as string) > -1) { return powValue as string; }
        if (!isNaN(numValue as number) && !isNaN(powValue as number)) {
            if (numValue === 0 && (powValue as number) < 0) {
                return errCollection[CommonErrors.DivZero];
            }
            if (numValue === 0 && powValue === 0) {
                return errCollection[CommonErrors.Num];
            }
            power = Math.pow(numValue as number, powValue as number);
            if (isNaN(power) || power === Infinity) {
                return errCollection[CommonErrors.Num];
            }
        } else {
            return errCollection[CommonErrors.Value];
        }
        return power.toString();
    }

    /**
     * Returns the square root of a positive number.
     *
     * Excel: `SQRT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSQRT(...args: string[]): number | string {
        let sqrtValue: string;
        const arrValue: string = args[0];
        if (args.length === 0 || args.length > 1 || arrValue === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (arrValue.split(this.parent.tic).join('').trim() === '') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (this.parent.isCellReference(arrValue)) {
            sqrtValue = this.parent.getValueFromArg(arrValue) || '0';
            if (sqrtValue.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            if (arrValue.indexOf(this.parent.tic) > -1 && (arrValue.split(this.parent.tic).join('') === this.parent.trueValue ||
                arrValue.split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            sqrtValue = this.parent.getValueFromArg(arrValue).split(this.parent.tic).join('');
        }
        if (this.parent.getErrorStrings().indexOf(sqrtValue) > -1) {
            return sqrtValue;
        }
        sqrtValue = sqrtValue === this.parent.trueValue ? '1' : sqrtValue === this.parent.falseValue ? '0' : sqrtValue;
        const parsedValue: number = this.parent.parseFloat(sqrtValue);
        if (parsedValue < 0) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        } else if (isNaN(parsedValue) ||
            (arrValue.indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(arrValue)))) {
            const dateTimeCheck: CalculateDateParseResult = this.parent.hostParseDate(isNaN(parsedValue) ?
                sqrtValue : arrValue.split(this.parent.tic).join(''));
            if (dateTimeCheck.isDate || dateTimeCheck.isTime) {
                sqrtValue = dateTimeCheck.value;
            } else {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        return Math.sqrt(this.parent.parseFloat(sqrtValue));
    }

    /**
     * Returns e raised to the power of the given number.
     *
     * Excel: `EXP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeEXP(...args: string[]): boolean | string {
        let orgNumValue: number | string;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (args[0] === '' && args.length === 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (args[0].split(this.parent.tic).join('').trim() === '') {
            return errCollection[CommonErrors.Value];
        }
        orgNumValue = this.parent.getValueFromArg(args[0]);
        if (errCollection.indexOf(orgNumValue) > -1) { return orgNumValue; }
        if (orgNumValue.indexOf(this.parent.tic) > -1 && (this.parent.isCellReference(args[0]) ||
            isNaN(Number(orgNumValue.split(this.parent.tic).join(''))))) {
            return errCollection[CommonErrors.Value];
        }
        orgNumValue = orgNumValue.split(this.parent.tic).join('');
        if (orgNumValue === this.parent.trueValue) {
            orgNumValue = '1';
        } else if ((orgNumValue === this.parent.falseValue) || (orgNumValue === '')) {
            orgNumValue = '0';
        } else if (orgNumValue.indexOf('%') > -1) {
            orgNumValue = (Number(orgNumValue.split('%')[0]) / 100).toString();
        } else if (orgNumValue.indexOf(':') > -1) {
            return '0';
        }
        const logNumValue: number | string = this.parent.parseFloat(orgNumValue);
        if (isNaN(logNumValue)) {
            return errCollection[CommonErrors.Value];
        } else if (logNumValue > 709) {
            return errCollection[CommonErrors.Num];
        }
        return Math.exp(logNumValue).toString();
    }
}
