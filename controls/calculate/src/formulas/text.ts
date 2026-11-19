import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined, Internationalization } from '@syncfusion/ej2-base';
import { isValidCellReference } from '../common/cell-ref';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Core text manipulation: concatenation, case conversion, trimming, and substring extraction.
 *
 * Registers 10 functions including FIND, CONCATENATE, CONCAT, T, EXACT, and others.
 *
 * @hidden
 */
export class TextFormulas extends FormulaModuleBase {
    private isConcat: boolean = false;

    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'FIND', category: 'Text', description: 'Returns the position of a string of text within another string.', syntax: 'FIND(find_text, within_text, [start_num])' },
        { formulaName: 'CONCATENATE', category: 'Text', description: ' Used to join two or more strings together.', syntax: 'CONCATENATE(text1, [text2], ...)' },
        { formulaName: 'CONCAT', category: 'Text', description: 'Concatenates a list or range of text strings.', syntax: 'CONCAT(text1, [text2], ...)' },
        { formulaName: 'T', category: 'Text', description: 'Checks whether a value is text or not and returns the text.', syntax: 'T(value)' },
        { formulaName: 'EXACT', category: 'Text', description: 'Checks whether a two text strings are exactly same and returns TRUE or FALSE.', syntax: 'EXACT(text1, text2)' },
        { formulaName: 'LEN', category: 'Text', description: 'Returns a number of characters in a given string.', syntax: 'LEN(text)' },
        { formulaName: 'CHAR', category: 'Text', description: 'Returns the character from the specified number.', syntax: 'CHAR(number)' },
        { formulaName: 'CODE', category: 'Text', description: 'Returns the numeric code for the first character in a given string.', syntax: 'CODE(text)' },
        { formulaName: 'DOLLAR', category: 'Text', description: 'Converts the number to currency formatted text.', syntax: 'DOLLAR(number, [decimals])' },
        { formulaName: 'PROPER', category: 'Text', description: 'Converts a text to proper case; first letter to uppercase and other letters to lowercase.', syntax: 'PROPER(text)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the position of a string of text within another string.
     *
     * Excel: `FIND(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=FIND(1)');
     * ```
     */
    public ComputeFIND(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length === 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const processArgs: Function = (actuaValue: string): string => {
            let value: string = this.parent.getValueFromArg(actuaValue);
            if (isNullOrUndefined(value)) {
                value = '';
            } else {
                value = value.toString();
            }
            if (errCollection.indexOf(value) > -1) { return value; }
            if (!this.parent.isCellReference(actuaValue)) {
                if (value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
                    value = (Number(value.split('%')[0]) * 0.01).toString();
                } else if (actuaValue.indexOf(this.parent.tic) > -1) {
                    if (this.parent.removeTics(actuaValue).match(/^(\d*\.\d+|\d+)\s*[-*/]\s*(\d*\.\d+|\d+)$/)) {
                        value = this.parent.getValueFromArg(this.parent.removeTics(actuaValue));
                        if (isNullOrUndefined(value)) {
                            value = '';
                        } else {
                            value = value.toString();
                        }
                    } else if (value.indexOf(this.parent.tic + this.parent.tic) > -1) {
                        value = value.replace(/""/g, this.parent.tic);
                    }
                }
            }
            return value;
        };
        let findText: string = '';
        if (!isNullOrUndefined(args[0])) {
            findText = processArgs(args[0]);
            if (errCollection.indexOf(findText) > -1) {
                return findText;
            } else if (!this.parent.isCellReference(args[0])) {
                findText = this.parent.removeTics(findText);
            }
        }
        let withinText: string = '';
        if (!isNullOrUndefined(args[1])) {
            withinText = processArgs(args[1]);
            if (errCollection.indexOf(withinText) > -1) {
                return withinText;
            } else if (!this.parent.isCellReference(args[1])) {
                withinText = this.parent.removeTics(withinText);
            }
        }
        let startNum: number | string = 1;
        if (!isNullOrUndefined(args[2])) {
            startNum = processArgs(args[2]) as string;
            if (errCollection.indexOf(startNum) > -1) {
                return startNum;
            } else if (startNum.toUpperCase() === this.parent.trueValue) {
                startNum = '1';
            } else if (startNum.toUpperCase() === this.parent.falseValue) {
                startNum = '0';
            }
            if (!this.parent.isCellReference(args[2])) {
                startNum = this.parent.removeTics(startNum);
            }
            startNum = this.parent.parseFloat(startNum);
            if (isNaN(startNum) || startNum <= 0) {
                return errCollection[CommonErrors.Value];
            }
        }
        startNum = withinText.indexOf(findText, startNum - 1);
        if (startNum < 0) {
            return errCollection[CommonErrors.Value];
        }
        return (Number(startNum) + Number(1)).toString();
    }

    /**
     *  Used to join two or more strings together.
     *
     * Excel: `CONCATENATE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeCONCATENATE(...args: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argsList: string[] = args;
        let result: string = '';
        let tempStr: string = '';
        for (let i: number = 0; i < argsList.length; i++) {
            const val: string = argsList[i as number];
            if (this.parent.isCellReference(val)) {
                if (val.indexOf(':') > -1) {
                    if (this.isConcat) {
                        const cells: string[] | string = this.parent.getCellCollection(val);
                        for (let i: number = 0; i < cells.length; i++) {
                            const tempString: string = this.parent.getValueFromArg(cells[i as number]);
                            result = result + tempString;
                        }
                    } else {
                        return errCollection[CommonErrors.Value];
                    }
                } else {
                    if (argsList.length === 1 && argsList[0].indexOf(this.parent.tic) < 0 &&
                        !isValidCellReference(argsList[0])) {
                        return errCollection[CommonErrors.Name];
                    }
                    else {
                        tempStr = this.parent.getValueFromArg(val);
                    }
                }
                if (errCollection.indexOf(tempStr) > -1) { return tempStr; }
            }
            else {
                if (val.startsWith(this.parent.tic) && val.endsWith(this.parent.tic) && val.indexOf('""') > -1) {
                    tempStr = val.substring(1, val.length - 1);
                    tempStr = tempStr.replace(/""/g, '"');
                } else {
                    tempStr = val.split(this.parent.tic).join('');
                    if (!(!(this.parent.isNumber(tempStr)) && !isNullOrUndefined(this.parent.isDate(tempStr))) || val.startsWith(' n')) {
                        tempStr = this.parent.getValueFromArg(val).split(this.parent.tic).join('');
                    }
                }
                if (errCollection.indexOf(tempStr) > -1) { return tempStr; }
            }
            result += tempStr;
        }
        this.isConcat = false;
        return result;
    }

    /**
     * Concatenates a list or range of text strings.
     *
     * Excel: `CONCAT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeCONCAT(...args: string[]): string {
        this.isConcat = true;
        return this.owner.ComputeCONCATENATE(...args);
    }

    /**
     * Checks whether a value is text or not and returns the text.
     *
     * Excel: `T(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeT(...args: string[]): string {
        let value: string; let nestedFormula: boolean;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0].trim() === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        value = this.parent.getValueFromArg(args[0]).trim();
        if (errCollection.indexOf(value) > -1) { return value; }
        if (args[0].indexOf(this.parent.tic) > -1) {
            value = this.parent.removeTics(args[0].trim());
            if (value.indexOf(this.parent.tic + this.parent.tic) > -1) {
                value = value.replace(/""/g, this.parent.tic);
            }
        } else {
            if (value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
                value = (Number(value.split('%')[0]) / 100).toString();
            }
            if (this.parent.isNumber(value) ||
                value.toUpperCase() === this.parent.trueValue || value.toUpperCase() === this.parent.falseValue) {
                return '';
            }
        }
        if (nestedFormula) {
            value = this.parent.tic + value + this.parent.tic;
        }
        return value;
    }

    /**
     * Checks whether a two text strings are exactly same and returns TRUE or FALSE.
     *
     * Excel: `EXACT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeEXACT(...args: string[]): string | boolean {
        let result: string | boolean = false;
        const nestedFormula: boolean = args.length && args[args.length - 1] === 'nestedFormulaTrue';
        const errCollection: string[] = this.parent.getErrorStrings();
        if (nestedFormula) {
            args.pop();
        }
        if (!args || (!args[0] && args.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let value1: string;
        let value2: string;
        let isCellRef: boolean;
        if (args[0]) {
            value1 = this.parent.getValueFromArg(args[0]);
            if (errCollection.indexOf(value1) > -1) {
                return value1;
            }
            if (value1.indexOf(this.parent.tic) === -1 && value1.includes('%')) {
                value1 = (Number(value1.split('%')[0]) / 100).toString();
            }
            if (this.parent.isCellReference(args[0])) {
                isCellRef = true;
            } else {
                value1 = value1.split(this.parent.tic).join('');
            }
        }
        if (args[1]) {
            value2 = this.parent.getValueFromArg(args[1]);
            if (errCollection.indexOf(value2) > -1) {
                return value2;
            }
            if (value2.indexOf(this.parent.tic) === -1 && value2.includes('%')) {
                value2 = (Number(value2.split('%')[0]) / 100).toString();
            }
            if (this.parent.isCellReference(args[1])) {
                if (!isCellRef && ((value1.trim().length === 0) && (value2.trim().length === 0))) {
                    result = false;
                }
            } else {
                value2 = value2.split(this.parent.tic).join('');
                if (isCellRef && ((value1.trim().length === 0) && (value2.trim().length === 0))) {
                    result = false;
                }
            }
        }
        if (value1 === value2) {
            result = true;
        }
        return nestedFormula ? (result ? '1' : '0') : result;
    }

    /**
     * Returns a number of characters in a given string.
     *
     * Excel: `LEN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeLEN(...args: string[]): string | number  {
        let value: string | number;
        const errorStrings: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args[0].trim() === '' && args.length === 1 )) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        value = this.parent.getValueFromArg(args[0]);
        if (errorStrings.indexOf(value) > -1) { return value; }
        if (args[0].indexOf(this.parent.tic) > -1) {
            if (args[0] !== value && args[0].startsWith('n')) {
                value = this.parent.removeTics(value.trim());
            } else {
                value = this.parent.removeTics(args[0].trim());
                if (value.indexOf(this.parent.tic + this.parent.tic) > -1) {
                    value = value.replace(/""/g, this.parent.tic);
                }
            }
        } else if (!args[0].startsWith('n') && value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
            value = (Number(value.split('%')[0]) / 100).toString();
        } else if (this.parent.isNumber(value)) {
            value = value.trim();
        }
        return value.length;
    }

    /**
     * Returns the character from the specified number.
     *
     * Excel: `CHAR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCHAR(...args: string[]): string | number  {
        let value: string;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let val: string = this.parent.getValueFromArg(args[0]).trim();
        if (errCollection.indexOf(val) > -1) {
            return val;
        } else if (val.indexOf('"TRUE"') > -1 || (this.parent.isCellReference(args[0]) &&
            val.startsWith(this.parent.tic))) {
            return errCollection[CommonErrors.Value];
        }
        val = val.split(this.parent.tic).join('');
        if (this.parent.isNumber(val)) {
            val = Math.floor(Number(val)).toString();
        } else if (val.indexOf('%') > -1) {
            val = Math.floor(Number(val.split('%')[0]) / 100).toString();
        } else if (val === this.parent.trueValue) {
            val = '1';
        }
        if (val.toUpperCase().match(/^[0-9]+$/)) {
            const char: number = parseInt(val, 10);
            if (char > 255 || char <= 0) {
                return errCollection[CommonErrors.Value];
            }
            value = String.fromCharCode(char);
        } else {
            return errCollection[CommonErrors.Value];
        }
        return value;
    }

    /**
     * Returns the numeric code for the first character in a given string.
     *
     * Excel: `CODE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCODE(...args: string[]): string | number  {
        let value: string | number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0].trim() === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        value = this.parent.getValueFromArg(args[0]).trim();
        if (errCollection.indexOf(value) > -1) { return value; }
        if (args[0].indexOf(this.parent.tic) > -1) {
            if (args[0] !== value && args[0].startsWith('n')) {
                value = this.parent.removeTics(value.trim());
            } else {
                value = this.parent.removeTics(args[0].trim());
            }
        } else if (!args[0].startsWith('n') && value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
            value = (Number(value.split('%')[0]) / 100).toString();
        }
        if (value !== '') {
            value = value.charCodeAt(0);
        } else {
            return errCollection[CommonErrors.Value];
        }
        return value;
    }

    /**
     * Converts the number to currency formatted text.
     *
     * Excel: `DOLLAR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDOLLAR(...args: string[]): string | number  {
        let value: string;
        let isEmpty: boolean;
        let nestedFormula: boolean;
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        if (args.length === 1) {
            if (args[0] === '') { isEmpty = true; }
            args.push('2');
        }
        if (isNullOrUndefined(args) || args.length !== 2 || isEmpty) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        for (let i: number = 0; i < args.length; i++) {
            if (args[i as number].indexOf(this.parent.tic) > -1) {
                if (isNaN(this.parent.parseFloat(args[i as number]))) {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
            }
        }
        let val: string = this.parent.getValueFromArg(args[0]).split(this.parent.tic).join('');
        let val2: string = this.parent.getValueFromArg(args[1]).split(this.parent.tic).join('');
        val = val === '' || val === this.parent.falseValue ? '0' : val === this.parent.trueValue ? '1' : val;
        val2 = val2 === '' || val2 === this.parent.falseValue ? '0' : val2 === this.parent.trueValue ? '1' : val2;
        if (val === '#NAME?' || val2 === '#NAME?') { return this.parent.getErrorStrings()[CommonErrors.Name]; }
        if (val.toUpperCase().match(/^[-]?[0-9.]+$/) && val2.toUpperCase().match(/^[-]?[0-9.]+$/)) {
            const intl: Internationalization = new Internationalization();
            const decimalCount: number = parseInt(val2, 10);
            const divisor: number = Math.pow(10, -1 * decimalCount);
            let decimalValue: string = '';
            for (let decimalIdx: number = 1; decimalIdx <= decimalCount; decimalIdx++) {
                decimalValue += '0';
            }
            const roundedNumber: number = Math.round(this.parent.parseFloat(val) / divisor) * divisor;
            if (!isNaN(roundedNumber)) {
                value = intl.formatNumber(roundedNumber, { format: '$#,##0.' + decimalValue + ';($#,##0.' + decimalValue + ');$0.' + decimalValue });
            } else {
                value = this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (nestedFormula) {
            value = this.parent.tic + value + this.parent.tic;
        }
        return value;
    }

    /**
     * Converts a text to proper case; first letter to uppercase and other letters to lowercase.
     *
     * Excel: `PROPER(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputePROPER(...args: string[]): string {
        let str: string;
        let nestedFormula: boolean;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        if (isNullOrUndefined(args) || (args[0].trim() === '' && args.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        str = this.parent.getValueFromArg(args[0]).trim();
        if (errCollection.indexOf(str) > -1) { return str; }
        if (args[0].indexOf(this.parent.tic) > -1) {
            if (args[0] !== str && args[0].startsWith('n')) {
                str = this.parent.removeTics(str.trim());
            } else {
                str = this.parent.removeTics(args[0].trim());
                if (str.indexOf(this.parent.tic + this.parent.tic) > -1) {
                    str = str.replace(/""/g, this.parent.tic);
                }
            }
        } else if (!args[0].startsWith('n') && str.split('%').length === 2 && this.parent.isNumber(str.split('%')[0])) {
            str = (Number(str.split('%')[0]) / 100).toString();
        }
        str = str.toLowerCase().replace(/\b\w/g, function(char: string): string {
            return char.toUpperCase();
        }).replace(/(\d)([a-z])/g, function(match: string, number: string, char: string): string {
            return number + char.toUpperCase();
        });
        if (nestedFormula) {
            str = this.parent.tic + str + this.parent.tic;
        }
        return str;
    }
}
