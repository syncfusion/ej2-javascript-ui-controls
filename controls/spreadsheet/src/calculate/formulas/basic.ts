import { FormulasErrorsStrings, CommonErrors, IBasicFormula, getSkeletonVal } from '../common/index';
import { Calculate, getAlphalabel, CalcSheetFamilyItem } from '../base/index';
import { isNullOrUndefined, getValue, Internationalization } from '@syncfusion/ej2-base';
import { DataUtil } from '@syncfusion/ej2-data';
import { DateFormatCheckArgs, checkDateFormat, dateToInt, isNumber, isCellReference, isValidCellReference, getSheetIndexByName, workbookFormulaOperation, getRangeIndexes, getCellAddress } from '../../workbook/index';

/**
 * Represents the basic formulas module.
 */
export class BasicFormulas {
    private parent: Calculate;
    public formulas: IBasicFormula[] = [
        { formulaName: 'SUM', category: 'Math & Trig', description: 'Sums individual values, cell references or ranges.' },
        {
            formulaName: 'SUMIFS', category: 'Math & Trig',
            description: 'Sums the cells specified by a given set of conditionsor criteria.'
        },
        {
            formulaName: 'SUMPRODUCT', category: 'Math & Trig',
            description: 'Returns sum of the product of given ranges of arrays.'
        },
        { formulaName: 'ABS', category: 'Math & Trig', description: 'Returns the absolute value of a number.' },
        { formulaName: 'RAND', category: 'Math & Trig', description: 'Return a random number between 0 and 1.' },
        { formulaName: 'FLOOR', category: 'Math & Trig', description: 'Returns the round a number down to the nearest integer.' },
        { formulaName: 'CEILING', category: 'Math & Trig', description: 'Returns a number rounded up to a multiple of another number.' },
        {
            formulaName: 'SUMIF', category: 'Math & Trig',
            description: 'It will sum up cells that meet the given criteria.'
        },
        {
            formulaName: 'PRODUCT', category: 'Math & Trig',
            description: 'Multiplies all the numbers given as arguments and returns the product.'
        },
        {
            formulaName: 'AVERAGE', category: 'Statistical',
            description: 'The sum of the numbers divided by how many numbers are being averaged.'
        },
        {
            formulaName: 'AVERAGEIF', category: 'Statistical',
            description: 'Computes the average of the numbers in a range that meet the supplied criteria.'
        },
        {
            formulaName: 'COUNT', category: 'Statistical',
            description: 'Counts the numbers in the list of arguments, exclude text entries.'
        },
        { formulaName: 'COUNTA', category: 'Statistical', description: 'Counts the non-empty values in the list of arguments.' },
        {
            formulaName: 'COUNTIF', category: 'Statistical',
            description: 'Counts the number of cells in a range that meet a specified condition.'
        },
        {
            formulaName: 'COUNTIFS', category: 'Statistical',
            description: 'Counts the number of times each cells in all the ranges that meet the specific conditions.'
        },
        {
            formulaName: 'AVERAGEA', category: 'Statistical',
            description: 'Calculates the average of values in the list of arguments.Arguments can be numbers, names, arrays or references.'
        },
        {
            formulaName: 'AVERAGEIFS', category: 'Statistical',
            description: 'Conditionally returns the average of the contents of cells for the set of ranges.'
        },
        {
            formulaName: 'MIN', category: 'Statistical',
            description: 'Returns the smaller number in set of arguments.'
        },
        { formulaName: 'MAX', category: 'Statistical', description: 'Returns the largest number in set of arguments.' },
        { formulaName: 'DATE', category: 'Date', description: 'Returns the date, given the year, month and day of the month.' },
        { formulaName: 'DAY', category: 'Date', description: 'Returns the day of a given date.' },
        { formulaName: 'TODAY', category: 'Date', description: 'Returns the current date as date value.' },
        { formulaName: 'DAYS', category: 'Date', description: 'Returns the number of days between two dates.' },
        { formulaName: 'WEEKDAY', category: 'Date', description: 'Returns the day of the week corresponding to a date.' },
        {
            formulaName: 'IF', category: 'Logical',
            description: 'Returns one value if a logical expression is TRUE and another if it is FALSE'
        },
        {
            formulaName: 'AND', category: 'Logical',
            description: 'Returns TRUE if all the arguments are considered TRUE, and FALSE otherwise.'
        },
        {
            formulaName: 'IFS', category: 'Logical',
            description: 'Checks multiple conditions and returns a value corresponding to the first TRUE result.'
        },
        {
            formulaName: 'IFERROR', category: 'Logical',
            description: 'Returns a value you specify if a formula evaluates to an error; otherwise, it returns the result of the formula.'
        },
        {
            formulaName: 'CHOOSE', category: 'Lookup & Reference',
            description: 'Returns a value from a list, given an index number.'
        },
        {
            formulaName: 'INDEX', category: 'Lookup & Reference',
            description: 'Returns a value from a table, given a row and column number.'
        },
        { formulaName: 'FIND', category: 'Text', description: 'Returns the position of a string of text within another string.' },
        { formulaName: 'CONCATENATE', category: 'Text', description: ' Used to join two or more strings together.' },
        { formulaName: 'CONCAT', category: 'Text', description: 'Concatenates a list or range of text strings.' },
        { formulaName: 'SUBTOTAL', category: 'Lookup & Reference', description: 'Returns a subtotal in a list or database.' },
        { formulaName: 'RADIANS', category: 'Math & Trig', description: 'Converts degrees to radians.' },
        {
            formulaName: 'OR', category: 'Logical',
            description: 'Returns TRUE if any arguments considered TRUE, and all the arguments are FALSE it will return FALSE.'
        },
        { formulaName: 'NOT', category: 'Logical', description: 'Returns the inverse of a given logical expression.' },
        {
            formulaName: 'MATCH', category: 'Lookup & Reference',
            description: 'Returns the relative position of an checked item in range that matches a specified value in a specified order'
        },
        {
            formulaName: 'RANDBETWEEN', category: 'Math & Trig', description: 'Returns an integer random number in a specified range.'
        },
        {
            formulaName: 'SLOPE', category: 'Statistical',
            description: 'Returns the slope of the line from linear regression of the data points.'
        },
        {
            formulaName: 'INTERCEPT', category: 'Statistical',
            description: 'Calculates the point of the Y-intercept line via linear regression.'
        },
        {
            formulaName: 'RSQ', category: 'Statistical',
            description: 'Returns the square of the Pearson product moment correlation coefficient based on data points in known_ys and known_xs'
        },
        {
            formulaName: 'UNIQUE', category: 'Lookup & Reference',
            description: 'Returns a unique values from a range or array.'
        },
        {
            formulaName: 'ROUNDUP', category: 'Math & Trig', description: 'Rounds a number away from zero.'
        },
        {
            formulaName: 'ROUNDDOWN', category: 'Math & Trig', description: 'Rounds a number down, toward zero.'
        },
        {
            formulaName: 'INT', category: 'Math & Trig', description: 'Returns a number to the nearest integer.'
        },
        {
            formulaName: 'LN', category: 'Math & Trig', description: 'Returns the natural logarithm of a number.'
        },
        {
            formulaName: 'ISNUMBER', category: 'Information', description: 'Returns TRUE, if the argument is number and FALSE otherwise.'
        },
        {
            formulaName: 'ROUND', category: 'Math & Trig', description: 'Rounds a number to a specified number of digits.'
        },
        {
            formulaName: 'LOG', category: 'Math & Trig', description: 'Returns the logarithm of a number to the base that you specify.'
        },
        {
            formulaName: 'POWER', category: 'Math & Trig', description: 'Returns the result of a number raised to power.'
        },
        {
            formulaName: 'SQRT', category: 'Math & Trig', description: 'Returns the square root of a positive number.'
        },
        {
            formulaName: 'TRUNC', category: 'Math & Trig',
            description: 'Returns the truncated value of a number to a specified number of decimal places.'
        },
        {
            formulaName: 'EXP', category: 'Math & Trig', description: 'Returns e raised to the power of the given number.'
        },
        {
            formulaName: 'GEOMEAN', category: 'Statistical',
            description: 'Returns the geometric mean of an array or range of positive data.'
        },
        { formulaName: 'TEXT', category: 'Lookup & Reference', description: 'Converts a value to text in specified number format.' },
        { formulaName: 'SORT', category: 'Lookup & Reference', description: 'Sorts a range of an array.' },
        { formulaName: 'LOOKUP', category: 'Lookup & Reference', description: 'Looks for a value in a one-row or one-column range, then returns a value from the same position in a second one-row or one-column range.' },
        { formulaName: 'VLOOKUP', category: 'Lookup & Reference', description: 'Looks for a specific value in the first column of a lookup range and returns a corresponding value from a different column within the same row.' },
        { formulaName: 'HLOOKUP', category: 'Lookup & Reference', description: 'Looks for a value in the top row of the array of values and then returns a value in the same column from a row in the array that you specify.' },
        { formulaName: 'T', category: 'Text', description: 'Checks whether a value is text or not and returns the text.' },
        { formulaName: 'EXACT', category: 'Text', description: 'Checks whether a two text strings are exactly same and returns TRUE or FALSE.' },
        { formulaName: 'LEN', category: 'Text', description: 'Returns a number of characters in a given string.' },
        { formulaName: 'MOD', category: 'Math & Trig', description: 'Returns a remainder after a number is divided by divisor.' },
        { formulaName: 'ODD', category: 'Math & Trig', description: 'Rounds a positive number up and negative number down to the nearest odd integer.' },
        { formulaName: 'PI', category: 'Math & Trig', description: 'Returns the value of pi.' },
        { formulaName: 'COUNTBLANK', category: 'Statistical', description: 'Returns the number of empty cells in a specified range of cells.' },
        { formulaName: 'EVEN', category: 'Math & Trig', description: 'Rounds a positive number up and negative number down to the nearest even integer.' },
        { formulaName: 'FACT', category: 'Math & Trig', description: 'Returns the factorial of a number.' },
        { formulaName: 'DECIMAL', category: 'Math & Trig', description: 'Converts a text representation of a number in a given base into a decimal number.' },
        { formulaName: 'DEGREES', category: 'Math & Trig', description: 'Converts radians to degrees.' },
        { formulaName: 'ADDRESS', category: 'Lookup & Reference', description: 'Returns a cell reference as text, given specified row and column numbers.' },
        { formulaName: 'TIME', category: 'Date & Time', description: 'Converts hours, minutes, seconds to the time formatted text.' },
        { formulaName: 'CHAR', category: 'Text', description: 'Returns the character from the specified number.' },
        { formulaName: 'CODE', category: 'Text', description: 'Returns the numeric code for the first character in a given string.' },
        { formulaName: 'DOLLAR', category: 'Text', description: 'Converts the number to currency formatted text.' },
        { formulaName: 'SMALL', category: 'Statistical', description: 'Returns the k-th smallest value in a given array.' },
        { formulaName: 'LARGE', category: 'Statistical', description: 'Returns the k-th largest value in a given array.' },
        { formulaName: 'MEDIAN', category: 'Statistical', description: 'Returns the median of the given set of numbers.' },
        { formulaName: 'EDATE', category: 'Date & Time', description: 'Returns a date with given number of months before or after the specified date.' },
        { formulaName: 'EOMONTH', category: 'Date & Time', description: 'Returns the last day of the month that is a specified number of months before or after an initially supplied start date.' },
        { formulaName: 'DATEVALUE', category: 'Date & Time', description: 'Converts a date string into date value.' },
        { formulaName: 'HOUR', category: 'Date & Time', description: 'Returns the number of hours in a specified time string.' },
        { formulaName: 'MINUTE', category: 'Date & Time', description: 'Returns the number of minutes in a specified time string.' },
        { formulaName: 'SECOND', category: 'Date & Time', description: 'Returns the number of seconds in a specified time string.' },
        { formulaName: 'NOW', category: 'Date & Time', description: 'Returns the current date and time.' },
        { formulaName: 'MONTH', category: 'Date & Time', description: 'Returns the number of months in a specified date string.' },
        { formulaName: 'PROPER', category: 'Text', description: 'Converts a text to proper case; first letter to uppercase and other letters to lowercase.' }
    ];
    private isConcat: boolean = false;
    constructor(parent?: Calculate) {
        this.parent = parent;
        this.init();
    }

    private init(): void {
        let fn: Function;
        for (let i: number = 0; i < this.formulas.length; i++) {
            fn = getValue('Compute' + this.formulas[i as number].formulaName, this).bind(this);
            this.addFormulaCollection(
                this.formulas[i as number].formulaName.toUpperCase(), fn, this.formulas[i as number].category,
                this.formulas[i as number].description);
        }
    }

    private addFormulaCollection(
        formulaName: string, functionName: Function, formulaCategory: string, description: string): void {
        this.parent.libraryFormulas = {
            fName: formulaName, handler: functionName as Function, category: formulaCategory,
            description: description
        };
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args
     * @returns {string | number} - Comput sum value
     */
    public ComputeSUM(...args: string[]): string | number {
        let isSubtotalFormula: boolean = false;
        if (args.length) {
            const lastArgument: string = args[args.length - 1];
            if (lastArgument === 'isSubtotal') {
                isSubtotalFormula = true;
                args.pop();
            }
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        let sum: number = 0;
        let val: string;
        let orgValue: number | string;
        let maxDecimalLength: number = 0;
        if (!isNullOrUndefined(args)) {
            const argArr: string[] = args;
            const setMaxDecimalLength: Function = (val: string): void => {
                if (val.toString().indexOf('.') > - 1) {
                    maxDecimalLength = Math.max(maxDecimalLength, val.split('.')[1].length);
                }
            };
            for (let i: number = 0; i < argArr.length; i++) {
                const argValue: string = argArr[i as number].toString();
                if (argValue.indexOf(':') > -1 && this.parent.isCellReference(argValue)) {
                    const cellCollection: string[] | string = this.parent.getCellCollection(argValue.split(this.parent.tic).join(''));
                    for (let j: number = 0; j < cellCollection.length; j++) {
                        val = !isSubtotalFormula ? this.parent.getValueFromArg(cellCollection[j as number]) :
                            this.parent.getValueFromArg(cellCollection[j as number], null, null, true);
                        if (isSubtotalFormula && val.includes('SUBTOTAL(')) {
                            continue;
                        }
                        if (this.parent.getErrorStrings().indexOf(val) > -1) {
                            return val;
                        }
                        if (isNullOrUndefined(val[0]) || isNaN(this.parent.parseFloat(val))) {
                            continue;
                        }
                        setMaxDecimalLength(val);
                        sum = sum + this.parent.parseFloat(val);
                    }
                } else {
                    if (argArr[i as number].indexOf(this.parent.tic) > -1) {
                        if (isNaN(this.parent.parseFloat(argArr[i as number].split(this.parent.tic).join(''))) ||
                            argArr[i as number].split(this.parent.tic).join('').trim() === '') {
                            return this.parent.getErrorStrings()[CommonErrors.Value];
                        }
                    }
                    if (argArr[i as number].split(this.parent.tic).join('') === this.parent.trueValue) {
                        argArr[i as number] = '1';
                    }
                    if (argArr[i as number].split(this.parent.tic).join('') === this.parent.falseValue) {
                        argArr[i as number] = '0';
                    }
                    orgValue = !isSubtotalFormula ? this.parent.getValueFromArg(argArr[i as number].split(this.parent.tic).join('')) :
                        this.parent.getValueFromArg(argArr[i as number].split(this.parent.tic).join(''), null, null, true);
                    if (isSubtotalFormula && orgValue.includes('SUBTOTAL(')) {
                        continue;
                    }
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) {
                        return orgValue;
                    }
                    if (isNullOrUndefined(orgValue) || isNaN(this.parent.parseFloat(orgValue))) {
                        continue;
                    }
                    if (orgValue.length > 0) {
                        setMaxDecimalLength(orgValue);
                        sum = sum + this.parent.parseFloat(orgValue + '');
                    }
                }
            }
        }
        return sum.toString().indexOf('.') > - 1 ? sum.toFixed(maxDecimalLength) : sum;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string | number} - Compute the Integer.
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
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {Date | string} - Compute the Today.
     */
    public ComputeTODAY(...args: string[]): Date | string {
        let str: string;
        if (args.length !== 1 || args[0] !== '') {
            str = this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else {
            const dt: Date = new Date(Date.now());
            if ((this.parent.parentObject as { getModuleName: Function }).getModuleName() === 'spreadsheet') {
                str = (this.parent.parentObject as { dateToInt: Function }).dateToInt(dt);
                if ((this.parent.parser as unknown as { storedStringText: string }).storedStringText.toUpperCase().indexOf('TODAY') === 0 &&
                    this.parent.cell !== '') {
                    (this.parent.parentObject as { setDateFormat: Function }).setDateFormat(
                        (this.parent as unknown as { getSheetId: Function }).getSheetId(this.parent.grid),
                        this.parent.rowIndex(this.parent.cell) - 1, this.parent.colIndex(this.parent.cell) - 1);
                }
            } else {
                str = dt.getFullYear() + '/' + this.parent.calculateDate((dt.getMonth() + 1).toString()) + '/'
                    + this.parent.calculateDate(dt.getDate().toString());
            }
        }
        return str;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {number} - Compute the day from the date.
     */
    public ComputeWEEKDAY(...args: string[]): number | string {
        if ((args[0] === '' && isNullOrUndefined(args[1])) || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if ((args[0] === '' && args[1] === '') || args[1] === '') {
            return this.parent.getErrorStrings()[CommonErrors.Num].toString();
        }
        if (args.length === 1) {
            args.push('1');
        }
        if ((args[0].indexOf(this.parent.tic) > -1 && args[0].split(this.parent.tic).join('').trim() === '') || (args[1].split(this.parent.tic).join('').trim() === '') || (args[1].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(args[1].split(this.parent.tic).join(''))))) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        let date: string;
        let value: number | string;
        let day: number | string;
        if (this.parent.isCellReference(args[0])) {
            date = this.parent.getValueFromArg(args[0].split(this.parent.tic).join('')) || '0';
            if (date.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            if ((args[0].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(args[0].split(this.parent.tic).join(''))))) {
                date = this.parent.getValueFromArg(args[0]);
            } else {
                date = this.parent.getValueFromArg(args[0].split(this.parent.tic).join('')) || '0';
            }
        }
        if (this.parent.isCellReference(args[1])) {
            value = this.parent.getValueFromArg(args[1].split(this.parent.tic).join('')) || '0';
        } else {
            value = this.parent.getValueFromArg(args[1].split(this.parent.tic).join(''));
        }
        if (this.parent.getErrorStrings().indexOf(date) > -1) {
            return date;
        }
        if (this.parent.getErrorStrings().indexOf(value) > -1) {
            return value;
        }
        date = date === this.parent.trueValue ? '1' : (date === this.parent.falseValue ? '0' : date);
        value = value === this.parent.trueValue ? '1' : (value === this.parent.falseValue ? '0' : value);
        day = this.parent.parseFloat(date);
        value = this.parent.parseFloat(value);
        if (isNaN(value) || isNaN(day)) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (day < 0 || day > 2958465) {
            return this.parent.getErrorStrings()[CommonErrors.Num].toString();
        }
        value = parseInt(value.toString(), 10);
        day = day < 1 ? 0 : Math.floor(day) % 7;
        switch (value) {
        case 1:
        case 17:
            day = day <= 0 ? day + 7 : day;
            break;
        case 2:
        case 11:
            day = day - 1;
            day = day <= 0 ? day + 7 : day;
            break;
        case 3:
            day = day - 2;
            day = day < 0 ? day + 7 : day;
            break;
        case 12:
            day = day + 5;
            day = day > 7 ? day - 7 : day;
            break;
        case 13:
            day = day + 4;
            day = day > 7 ? day - 7 : day;
            break;
        case 14:
            day = day + 3;
            day = day > 7 ? day - 7 : day;
            break;
        case 15:
            day = day + 2;
            day = day > 7 ? day - 7 : day;
            break;
        case 16:
            day = day + 1;
            day = day > 7 ? day - 7 : day;
            break;
        default:
            day = this.parent.getErrorStrings()[CommonErrors.Num].toString();
            break;
        }
        return day;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string} - Compute to the Proper casing.
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

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string | number} - Compute the Sum product.
     */
    public ComputeSUMPRODUCT(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        let sum: number = 0; let count: number = 0; let index: number;
        let mulValues: number[] = null;
        const ranges: string[] = args; const len: number[] = [];
        for (let i: number = 0; i < ranges.length; i++) {
            const cells: string | string[] = this.parent.getCellCollection(ranges[i as number]);
            if (cells[0] === '#REF!') {
                return this.parent.getErrorStrings()[CommonErrors.Name];
            }
            len.push(cells.length);
        }
        for (let j: number = 0; j < len.length; j++) {
            if (len[j as number] && len[j + 1] && len[j as number] !== len[j + 1]) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        for (let k: number = 0; k < ranges.length; ++k) {
            const range: string = ranges[k as number];
            if (!range.startsWith(this.parent.tic) && this.parent.isCellReference(range)) {
                let i: number = range.indexOf(':');
                let startRow: number = this.parent.rowIndex(range.substr(0, i));
                let endRow: number = this.parent.rowIndex(range.substr(i + 1));
                if (!(startRow !== -1 || endRow === -1) === (startRow === -1 || endRow !== -1)) {
                    return this.parent.getErrorStrings()[CommonErrors.Name];
                }
                if (startRow > endRow) {
                    [startRow, endRow] = [endRow, startRow];
                }
                let col1: number = this.parent.colIndex(range.substr(0, i));
                let col2: number = this.parent.colIndex(range.substr(i + 1));
                if (col1 > col2) {
                    [col1, col2] = [col2, col1];
                }
                if (mulValues === null) {
                    count = (endRow - startRow + 1) * (col2 - col1 + 1);
                    mulValues = [];
                    for (i = 0; i < count; ++i) {
                        mulValues[i as number] = 1; //To create required index.
                    }
                }
                i = 0;
                for (let row: number = startRow; row <= endRow; ++row) {
                    for (let col: number = col1; col <= col2; ++col) {
                        const cellRef: string = this.getSheetReference(range) + this.parent.convertAlpha(col) + (row);
                        const result: string = this.parent.getValueFromArg(cellRef);
                        if (this.parent.getErrorStrings().indexOf(result) > -1) {
                            return result;
                        }
                        if (!isNaN(this.parent.parseFloat(result))) {
                            //To return #VALUE! error when array dimensions are mismatched.
                            if (isNaN(mulValues[i as number])) {
                                return this.parent.getErrorStrings()[CommonErrors.Name];
                            }
                            mulValues[i as number] = mulValues[i as number] * this.parent.parseFloat(result);
                        } else {
                            mulValues[i as number] = 0;
                        }
                        i++;
                    }
                }
            } else {
                const s1: string = this.parent.getValueFromArg(range);
                index = s1.indexOf('"');
                if (this.parent.getErrorStrings().indexOf(s1) > -1) {
                    return s1;
                } else if (index > -1) {
                    return 0;
                } else {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
            }
        }
        for (let i: number = 0; i < count; ++i) {
            sum += mulValues[i as number];
        }
        return sum;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string | number} - Compute the Roundup.
     */
    public ComputeROUNDUP(...args: string[]): string | number {
        let str: string; let arg1: string; let arg2: string;
        let index: number; let num: number;
        const len: number = args.length;
        if (!isNullOrUndefined(args) && len > 2) {
            str = this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (len === 1 && args[0] !== '') {
            index = args[0].indexOf('"');
            arg1 = args[0].indexOf('"') > -1 ? args[0].replace('"', '') : args[0];
            arg1 = arg1.indexOf('"') > -1 ? arg1.replace('"', '') : arg1;
            arg1 = arg1.toUpperCase() === 'TRUE' ? '1' : (arg1 === 'FALSE' ? '0' : arg1);
            arg1 = this.parent.getValueFromArg(arg1);
            num = this.parent.parseFloat(arg1);
            if (num > 0) {
                num += .4999999999; // To round the number, we using this value.
            } else if (num < 0) {
                num -= .4999999999;
            }
            num = this.parent.parseFloat(num.toFixed(0));
            str = num.toString();
        } else if (len === 2) {
            index = args[0].indexOf('"') > -1 ? args[0].indexOf('"') : (args[1].indexOf('"') > -1 ? args[1].indexOf('"') : -1);
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
        } else {
            str = index > - 1 ? this.parent.getErrorStrings()[CommonErrors.Value] :
                this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        return str;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string | number} - Compute the Rounddown.
     */
    public ComputeROUNDDOWN(...args: string[]): string | number {
        let result: string; let arg1: string; let arg2: string;
        let index: number; let num: number;
        const len: number = args.length;
        if (!isNullOrUndefined(args) && len > 2) {
            result = this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (len === 1 && args[0] !== '') {
            index = args[0].indexOf('"');
            arg1 = args[0].indexOf('"') > -1 ? args[0].replace('"', '') : args[0];
            arg1 = arg1.indexOf('"') > -1 ? arg1.replace('"', '') : arg1;
            arg1 = arg1.toUpperCase() === 'TRUE' ? '1' : (arg1 === 'FALSE' ? '0' : arg1);
            arg1 = this.parent.getValueFromArg(arg1);
            num = this.parent.parseFloat(arg1);
            if (num > 0) {
                num -= .4999999999; // To round the number, we are using this value.
            } else if (num < 0) {
                num += .4999999999;
            }
            num = this.parent.parseFloat(num.toFixed(0));
            result = num.toString();
        } else if (len === 2) {
            index = args[0].indexOf('"') > -1 ? args[0].indexOf('"') : (args[1].indexOf('"') > -1 ? args[1].indexOf('"') : -1);
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
        } else {
            result = index > - 1 ? this.parent.getErrorStrings()[CommonErrors.Value] :
                this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        return result;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {number | string} - Compute the count.
     */
    public ComputeCOUNT(...args: string[]): number | string {
        let isSubtotalFormula: boolean = false;
        if (args.length && args[args.length - 1] === 'isSubtotal') {
            isSubtotalFormula = true;
            args.pop();
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArr: string[] = args;
        let argVal: string | number;
        let cellColl: string[] | string;
        let result: number = 0;
        let cellValue: string; let value: string;
        for (let i: number = 0; i < argArr.length; i++) {
            argVal = argArr[i as number];
            if (this.parent.isCellReference(argVal)) {
                if (argVal.indexOf(':') > -1) {
                    cellColl = this.parent.getCellCollection(argVal.split(this.parent.tic).join(''));
                    for (let j: number = 0; j < cellColl.length; j++) {
                        cellValue = !isSubtotalFormula ? this.parent.getValueFromArg(cellColl[j as number]) :
                            this.parent.getValueFromArg(cellColl[j as number], null, null, true);
                        if (isSubtotalFormula && cellValue.includes('SUBTOTAL(')) {
                            continue;
                        }
                        if (!isNaN(this.parent.parseFloat(cellValue))) {
                            if (argVal.length > 0 && cellValue.trim() !== '') {
                                result++;
                            }
                        }
                    }
                } else {
                    cellValue = !isSubtotalFormula ? this.parent.getValueFromArg(argVal) :
                        this.parent.getValueFromArg(argVal, null, null, true);
                    if (isSubtotalFormula && cellValue.includes('SUBTOTAL(')) {
                        continue;
                    }
                    if (!isNaN(this.parent.parseFloat(cellValue))) {
                        if (argVal.length > 0 && cellValue.trim() !== '') {
                            result++;
                        }
                    }
                }
            } else {
                value = this.parent.getValueFromArg(argVal).split(this.parent.tic).join('');
                if (argVal.length === 0 && value.trim() === '') {
                    result++;
                } else if (!isNaN(this.parent.parseFloat(value)) || argVal === this.parent.trueValue || argVal === this.parent.falseValue) {
                    if (argVal.length > 0 && argVal.trim() !== '' && value.trim() !== '') {
                        result++;
                    }
                }
            }
        }
        return result;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {Date | string} - Compute the Date.
     */
    public ComputeDATE(...args: string[]): Date | string {
        let nestedFormula: boolean;
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArr: string[] = [];
        for (let i: number = 0; i < args.length; ++i) {
            argArr[i as number] = this.parent.getValueFromArg(args[i as number]);
        }
        argArr[0] = (argArr[0] === this.parent.trueValue) ? '1' : (argArr[0] === this.parent.falseValue) ? '0' : argArr[0];
        argArr[1] = (argArr[1] === this.parent.trueValue) ? '1' : (argArr[1] === this.parent.falseValue) ? '0' : argArr[1];
        argArr[2] = (argArr[2] === this.parent.trueValue) ? '1' : (argArr[2] === this.parent.falseValue) ? '0' : argArr[2];
        for (let idx: number = 0; idx < argArr.length; idx++) {
            const argsValue: string = argArr[idx as number];
            if (this.parent.getErrorStrings().indexOf(argsValue) > -1) {
                return argsValue;
            } else if ((argsValue === '""') || (argsValue === '"0"' && args[idx as number] !== '"0"') || (argsValue === '"TRUE"'  || argsValue === '"FALSE"' )) {
                return this.parent.getErrorStrings()[CommonErrors.Value].toString();
            }
        }
        let year: number = Math.floor(this.parent.parseFloat(argArr[0].split(this.parent.tic).join('')));
        let month: number = Math.floor(this.parent.parseFloat(argArr[1].split(this.parent.tic).join('')));
        const day: number = Math.floor(this.parent.parseFloat(argArr[2].split(this.parent.tic).join('')));
        let days: number = 0;
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            if ((year < 0 && month <= 12 ) || (year >= 10000 && month > 0)) {
                return this.parent.getErrorStrings()[CommonErrors.Num].toString();
            }
            while (month > 12) {
                month -= 12;
                year++;
            }
            days = this.parent.getSerialDateFromDate(year, month, day);
        } else {
            return this.parent.getErrorStrings()[CommonErrors.Value].toString();
        }
        if (days === 0) {
            return this.parent.getErrorStrings()[CommonErrors.Num].toString();
        }
        const date: Date = this.parent.fromOADate(days);
        if (date.toString() !== 'Invalid Date') {
            if ((date.getFullYear() < 1900) || (10000 <= date.getFullYear())) {
                return this.parent.getErrorStrings()[CommonErrors.Num].toString();
            }
            if (!nestedFormula) {
                return new Internationalization((this.parent.parentObject as { locale?: string }).locale || 'en-US').formatDate(
                    date, { type: 'date', skeleton: 'yMd' });
            }
        }
        return days.toString();
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {number | string} - Compute the ceiling.
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
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {number | string} - Compute the ceiling.
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
     * @hidden
     * @param {string[]} args - specify the serialNumber.
     * @returns {number | string} - Compute the DAY.
     */
    public ComputeDAY(...args: string[]): number | string {
        let result: number | string;
        let dateVal: string;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (args[0].startsWith(this.parent.tic)) {
            dateVal = args[0].split(this.parent.tic).join('');
            if (dateVal === '' || dateVal === this.parent.trueValue || dateVal === this.parent.falseValue) {
                return errCollection[CommonErrors.Value];
            }
        } else {
            dateVal = this.parent.getValueFromArg(args[0].split(this.parent.tic).join(''));
            if (this.parent.isCellReference(args[0]) && (dateVal.indexOf(this.parent.tic) > -1)) {
                return errCollection[CommonErrors.Value];
            }
        }
        if (errCollection.indexOf(dateVal) > -1) {
            return dateVal;
        } else if (Number(dateVal) < 0) {
            return errCollection[CommonErrors.Num];
        } else if (Math.floor(Number(dateVal)) === 0 || dateVal === this.parent.falseValue) {
            return 0;
        } else if (dateVal === this.parent.trueValue) {
            return 1;
        }
        result = this.parent.isNaN(Number(dateVal)) ? this.parent.parseDate(dateVal) : this.parent.intToDate(dateVal);
        if (Object.prototype.toString.call(result) === '[object Date]') { /* eslint-disable-next-line */
            result = ((new Date(result).getFullYear() < 1900) || (new Date(result).getFullYear()) > 9999) ? this.parent.isNumber(dateVal) ? 'Num' : 'NaN' : (result as any).getDate();
        }
        if (result.toString() === 'NaN') {
            return errCollection[CommonErrors.Value];
        } else if (result.toString() === 'Num') {
            return errCollection[CommonErrors.Num];
        }
        return result;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string | number} - Compute the IF value.
     */
    public ComputeIF(...args: string[]): string | number {
        let nestedFormula: boolean;
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (this.parent.getErrorStrings().indexOf(args[0]) > 0) {
            return args[0];
        }
        const argArr: string[] = args; let skipTick: boolean;
        if (argArr.length === 4 && argArr[3] === 'nestedFormulaTrue') { skipTick = true; argArr.pop(); }
        let condition: string;
        let result: string;
        if (argArr.length > 3 || argArr.length === 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (argArr.length <= 3) {
            let cellValues: string[] | string;
            let cellVal: string;
            let val : string = '';
            condition = this.parent.getValueFromArg(argArr[0]);
            if (this.parent.getErrorStrings().indexOf(condition) > -1) {
                return condition;
            }
            const condUpper: string = condition.toUpperCase();
            const parsedVal: number = this.parent.parseFloat(condition);
            if (condUpper === this.parent.trueValue || (parsedVal < 0 || parsedVal > 0)) {
                if (nestedFormula && argArr[1].includes(':')) {
                    cellValues = this.parent.getCellCollection(argArr[1]);
                    for (let i: number = 0; i < cellValues.length; i++) {
                        cellVal = this.parent.getValueFromArg(cellValues[i as number]);
                        if (!isNaN(this.parent.parseFloat(cellVal))) {
                            val += cellVal + ',';
                        }
                    }
                    return val.slice(0, val.length - 1);
                }
                result = argArr[1] === '' ? '0' : this.parent.getValueFromArg(argArr[1], undefined, undefined, undefined, true);
            } else if (condUpper === this.parent.falseValue || parsedVal === 0) {
                if (isNullOrUndefined(argArr[2])) {
                    return this.parent.falseValue;
                }
                if (nestedFormula && argArr[2].includes(':')) {
                    cellValues = this.parent.getCellCollection(argArr[2]);
                    for (let i: number = 0; i < cellValues.length; i++) {
                        cellVal = this.parent.getValueFromArg(cellValues[i as number]);
                        if (!isNaN(this.parent.parseFloat(cellVal))) {
                            val += cellVal + ',';
                        }
                    }
                    return val.slice(0, val.length - 1);
                }
                result = argArr[2] === '' ? '0' : this.parent.getValueFromArg(argArr[2], undefined, undefined, undefined, true);
            } else {
                return this.parent.formulaErrorStrings[FormulasErrorsStrings.Requires3Args];
            }
        }
        const indexOfTic: number = result.indexOf(this.parent.tic);
        if (!skipTick && indexOfTic > -1) {
            return result.split(this.parent.tic).join('');
        } else if (skipTick && !isNumber(result) && indexOfTic === -1 && result !== this.parent.trueValue &&
            result !== this.parent.falseValue && !this.parent.isCellReference(result)) {
            return '"' + result + '"';
        } else {
            return result === '' ? '0' : result;
        }
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {number | string} - Compute the IFERROR value.
     */
    public ComputeIFERROR(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argArr: string[] = args;
        let condition: string;
        if (argArr.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (this.parent.isCellReference(argArr[0])) {
            condition = this.parent.getValueFromArg(argArr[0]) || '0';
            if (this.parent.getErrorStrings().indexOf(condition) === -1 && condition !== 'NaN') {
                return condition;
            }
        } else {
            condition = this.parent.getValueFromArg(argArr[0], null, true) || '0';
            if (this.parent.getErrorStrings().indexOf(condition) === -1 && condition !== 'NaN') {
                condition = condition.split(this.parent.tic).join('').trim();
                return condition;
            }
        }
        if (this.parent.isCellReference(argArr[1])) {
            condition = this.parent.getValueFromArg(argArr[1]) || '0';
        } else {
            condition = this.parent.getValueFromArg(argArr[1]) || '0';
            condition = condition.split(this.parent.tic).join('').trim();
        }
        return condition;
    }

    /**
     * @hidden
     * @param {string[]} range - specify the range.
     * @returns {string | number} - Compute the PRODUCT value.
     */
    public ComputePRODUCT(...range: string[]): string | number {
        let isSubtotalFormula: boolean = false;
        if (range.length && range[range.length - 1] === 'isSubtotal') {
            isSubtotalFormula = true;
            range.pop();
        }
        if (isNullOrUndefined(range) || (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        let product: number = 1;
        let val: string;
        let orgValue: string;
        let argsHit: boolean = true;
        let parseVal: number;
        if (!isNullOrUndefined(range)) {
            const argArr: string[] = range;
            for (let i: number = 0; i < argArr.length; i++) {
                const rangevalue: string = argArr[i as number];
                if (rangevalue.indexOf(':') > -1 && this.parent.isCellReference(rangevalue)) {
                    const cellCollection: string[] | string = this.parent.getCellCollection(rangevalue);
                    for (let j: number = 0; j < cellCollection.length; j++) {
                        val = !isSubtotalFormula ? this.parent.getValueFromArg(cellCollection[j as number]) :
                            this.parent.getValueFromArg(cellCollection[j as number], null, null, true);
                        if (isSubtotalFormula && val.includes('SUBTOTAL(')) {
                            continue;
                        }
                        if (!isNumber(val)) {
                            continue;
                        }
                        if (this.parent.getErrorStrings().indexOf(val) > -1) { return val; }
                        parseVal = this.parent.parseFloat(val);
                        if (!isNaN(parseVal)) {
                            if (val.length > 0) {
                                product = product * parseVal;
                                argsHit = false;
                            }
                        }
                    }
                } else if (rangevalue.indexOf(':') === -1 && this.parent.isCellReference(rangevalue)) {
                    orgValue = !isSubtotalFormula ? this.parent.getValueFromArg(argArr[i as number]) :
                        this.parent.getValueFromArg(argArr[i as number], null, null, true);
                    if (isSubtotalFormula && orgValue.includes('SUBTOTAL(')) {
                        continue;
                    }
                    if (!isNumber(orgValue)) {
                        continue;
                    }
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) { return orgValue; }
                } else {
                    orgValue = argArr[i as number];
                    const isEmptyStr: boolean = orgValue.indexOf(this.parent.tic) > -1 && orgValue.split(this.parent.tic).join('').trim() === '';
                    if (isEmptyStr || (argArr[i as number].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(orgValue.split(this.parent.tic).join(''))))) {
                        return this.parent.getErrorStrings()[CommonErrors.Value];
                    }
                    orgValue = this.parent.getValueFromArg(argArr[i as number].split(this.parent.tic).join(''));
                    orgValue = (orgValue === this.parent.trueValue) ? '1' : (orgValue === this.parent.falseValue) ? '0' : orgValue.split(this.parent.tic).join('');
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) { return orgValue; }
                }
                parseVal = this.parent.parseFloat(orgValue);
                if (!isNaN(parseVal)) {
                    if (orgValue.length > 0) {
                        product = product * parseVal;
                        argsHit = false;
                    }
                }
            }
        }
        return argsHit ? '0' : product.toString();
    }

    /**
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {string | number} - Compute the Choose value.
     */
    public ComputeDAYS(...args: string[]): number | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) && (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const processArgs: Function = (actuaValue: string): string => {
            let value: string = this.parent.getValueFromArg(actuaValue).trim();
            if (value.indexOf(this.parent.tic) > -1) {
                value = value.split(this.parent.tic).join('').trim();
                if (value === '' || this.parent.isCellReference(actuaValue) || value.toUpperCase() === this.parent.trueValue ||
                    value.toUpperCase() === this.parent.falseValue) {
                    return errCollection[CommonErrors.Value];
                }
            }
            value = value.split(this.parent.tic).join('');
            if (value.toUpperCase() === this.parent.trueValue) {
                value = '1';
            } else if (value === '' || value.toUpperCase() === this.parent.falseValue) {
                value = '0';
            } else if (Number(value) < 0) {
                return errCollection[CommonErrors.Num];
            }
            const dateCheck: DateFormatCheckArgs = { value: value.toString() };
            (<{ notify: Function }>this.parent.parentObject).notify(checkDateFormat, dateCheck);
            if (dateCheck.isDate || dateCheck.isTime) {
                value = (this.parent.parseDate(value).getTime() / (1000 * 3600 * 24)).toString();
            }
            return value;
        };
        const endDate: string = processArgs(args[0]);
        if (errCollection.indexOf(endDate) > -1) { return endDate; }
        const startDate: string = processArgs(args[1]);
        if (errCollection.indexOf(startDate as string) > -1) { return startDate; }
        const result: number | string = Math.floor(Number(endDate)) - Math.floor(Number(startDate));
        if (isNaN(result)) {
            return errCollection[CommonErrors.Value];
        }
        return result;
    }

    /**
     * @hidden
     * @param {string[]} argArr - specify the range.
     * @returns {number | string | number[] | string[]} - Compute the unique.
     */
    public ComputeUNIQUE(...argArr: string[]): number | string | number[] | string[] {
        let result: string; let isComputeExp: boolean;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (argArr[argArr.length - 1] === 'isComputeExp') {
            isComputeExp = true; argArr.pop();
        }
        if (isNullOrUndefined(argArr) || (argArr[0] === '' && argArr.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argArr.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const processArgs: Function = (actualValue: string): string => {
            if (isNullOrUndefined(actualValue)) {
                return this.parent.falseValue;
            }
            let value: string = this.parent.getValueFromArg(actualValue);
            if (errCollection.indexOf(value) > -1) { return value; }
            if (Number(value) === 0) {
                return this.parent.falseValue;
            } else if (Number(value) < 0 || Number(value) > 0) {
                return this.parent.trueValue;
            }
            if (!this.parent.isCellReference(actualValue)) {
                value = this.parent.removeTics(value);
            }
            if (value.toUpperCase() === this.parent.trueValue || value.toUpperCase() === this.parent.falseValue) {
                return value.toUpperCase();
            } else if (value.indexOf(this.parent.tic) > -1 || actualValue.indexOf(this.parent.tic) > -1) {
                return errCollection[CommonErrors.Value];
            } else {
                return errCollection[CommonErrors.Name];
            }
        };
        const byColumn: string = processArgs(argArr[1]);
        if (errCollection.indexOf(byColumn) > -1) { return byColumn; }
        const exactlyOne: string = processArgs(argArr[2]);
        if (errCollection.indexOf(exactlyOne) > -1) { return exactlyOne; }
        const valueCollection: string[] = [];
        if (argArr[0].indexOf(':') > -1) {
            if (isNullOrUndefined(argArr[0].match(/[0-9]/))) {
                const splitArray: string[] = argArr[0].split(':');
                argArr[0] = splitArray[0] + '1' + ':' + splitArray[1] + (this.parent.spreadSheetUsedRange[0] + 1);
            } else if (isNullOrUndefined(argArr[0].toUpperCase().match(/[A-Z]/))) {
                const splitArray: string[] = argArr[0].split(':');
                argArr[0] = 'A' + splitArray[0] + ':' + getAlphalabel(this.parent.spreadSheetUsedRange[1] + 1) + splitArray[1];
            }
            const rangeSplit: string[] = argArr[0].split(':');
            if (this.parent.isCellReference(rangeSplit[0]) && this.parent.isCellReference(rangeSplit[1])) {
                const collection: string[] = this.parent.dependencyCollection;
                for (let i: number = 0; i < collection.length && !isComputeExp; i++) {
                    if (collection[i as number].split(':')[0] === argArr[0].split(':')[0]) {
                        this.clearDependency(collection[i as number]);
                    }
                }
                if (this.parent.dependencyCollection.indexOf(argArr[0]) === -1) {
                    if (!isComputeExp) {
                        this.parent.dependencyCollection.push(argArr[0]);
                    }
                } else { this.clearDependency(argArr[0]); }
                const j: number = argArr[0].indexOf(':'); let swap: number;
                let rowIdx: number = this.parent.rowIndex(this.parent.substring(argArr[0], 0, j));
                let colIdx: number = this.parent.colIndex(this.parent.substring(argArr[0], 0, j));
                let endRowIdx: number = this.parent.rowIndex(this.parent.substring(argArr[0], j + 1, j + argArr[0].length - j - 1));
                let endColIdx: number = this.parent.colIndex(this.parent.substring(argArr[0], j + 1, j + argArr[0].length - j - 1));
                if (rowIdx > endRowIdx) {
                    swap = endRowIdx; endRowIdx = rowIdx; rowIdx = swap;
                }
                if (colIdx > endColIdx) {
                    swap = endColIdx; endColIdx = colIdx; colIdx = swap;
                }
                let sheetIndex: string | number = '';
                if (argArr[0].indexOf('!') === 0) {
                    sheetIndex = argArr[0].substring(0, argArr[0].replace('!', '').indexOf('!') + 2);
                }
                argArr[0] = sheetIndex + getAlphalabel(colIdx) + rowIdx + ':' + getAlphalabel(endColIdx) + endRowIdx;
                const colDiff: number = endColIdx - colIdx;
                const cellValues: string[] = this.parent.getCellCollection(argArr[0]) as string[];
                let actCell: string; let uniqueActCell: string;
                actCell = uniqueActCell = this.parent.actCell;
                if (byColumn === this.parent.falseValue) {
                    if (colDiff === 0) {
                        for (let i: number = 0; i < cellValues.length; i++) {
                            let val: string = this.parent.getValueFromArg(cellValues[i as number]);
                            val = val === '' ? '0' : val;
                            valueCollection.push(val);
                        }
                    } else {
                        let temp: string = ''; let diff: number = colDiff;
                        for (let i: number = 0; i < cellValues.length; i++) {
                            if (i === cellValues.length - 1) {
                                let val: string = this.parent.getValueFromArg(cellValues[i as number]);
                                val = val === '' ? '0' : val;
                                temp = temp + val + '++';
                                valueCollection.push(temp.substring(0, temp.length - 2));
                            }
                            if (i <= diff) {
                                let val: string = this.parent.getValueFromArg(cellValues[i as number]);
                                val = val === '' ? '0' : val;
                                temp = temp + val + '++';
                            } else {
                                valueCollection.push(temp.substring(0, temp.length - 2));
                                diff = colDiff + i;
                                let val: string = this.parent.getValueFromArg(cellValues[i as number]);
                                val = val === '' ? '0' : val;
                                temp = val + '++';
                            }
                        }
                    }
                } else {
                    let temp: string = ''; const diff: number = colDiff + 1; const rowDiff: number = endRowIdx - rowIdx;
                    for (let i: number = 0; i < diff; i++) {
                        for (let j: number = 0; j <= rowDiff; j++) {
                            let val: string = this.parent.getValueFromArg(cellValues[j * diff + i]);
                            val = val === '' ? '0' : val;
                            temp = temp + val + '++';
                        }
                        valueCollection.push(temp.substring(0, temp.length - 2));
                        temp = '';
                    }
                }
                const uniqueCollection: string[] = []; const duplicateCollection: string[] = [];
                let tmp: string[] = []; const tmp2: string[] = [];
                for (let i: number = 0; i < valueCollection.length; i++) {
                    if (uniqueCollection.indexOf(valueCollection[i as number].toLowerCase()) === -1) {
                        uniqueCollection.push(valueCollection[i as number].toLowerCase());
                        tmp.push(valueCollection[i as number]);
                    } else {
                        if (duplicateCollection.indexOf(valueCollection[i as number].toLowerCase()) === -1) {
                            duplicateCollection.push(valueCollection[i as number].toLowerCase());
                        }
                        tmp2.push(valueCollection[i as number]);
                    }
                }
                if (exactlyOne === this.parent.trueValue) {
                    const exactOne: string[] = [];
                    for (let i: number = 0; i < tmp.length; i++) {
                        if (duplicateCollection.indexOf(tmp[i as number].toLowerCase()) === -1) {
                            exactOne.push(tmp[i as number]);
                        }
                    }
                    tmp = exactOne;
                    if (tmp.length === 0) {
                        return errCollection[CommonErrors.Calc];
                    }
                }
                if (isComputeExp) {
                    let computeExpResult: string | number | string[] | number[];
                    if (colDiff !== 0) {
                        computeExpResult = [];
                        (tmp).forEach(function (item: string): void {
                            computeExpResult = [...(computeExpResult as string[]), ...item.split('++')];
                        });
                    } else {
                        computeExpResult = byColumn === this.parent.falseValue ? tmp : tmp[0].split('++');
                    }
                    return computeExpResult;
                }
                if (actCell.indexOf('!') > - 1) {
                    actCell = actCell.substring(actCell.lastIndexOf('!') + 1);
                }
                let actRowIdx: number = this.parent.rowIndex(actCell);
                let actColIdx: number = this.parent.colIndex(actCell);
                if (this.parent.dependencyLevel === 0) {
                    let isSpill: boolean = false;
                    if (byColumn === this.parent.falseValue) {
                        for (let i: number = actRowIdx, diff: number = tmp.length + actRowIdx; i < diff; i++) {
                            const splitValue: string[] = tmp[0].split('++');
                            for (let j: number = actColIdx, diff2: number = splitValue.length + actColIdx; j < diff2; j++) {
                                if (i === diff - 1 && j === diff2 - 1 &&
                                    this.parent.uniqueRange.indexOf(uniqueActCell + ':' + getAlphalabel(j) + i) === - 1) {
                                    this.parent.uniqueRange.push(uniqueActCell + ':' + getAlphalabel(j) + i);
                                }
                                if (this.checkSpill(j, i)) {
                                    isSpill = true;
                                }
                            }
                        }
                    } else {
                        for (let i: number = actColIdx, diff: number = tmp.length + actColIdx; i < diff; i++) {
                            const splitValue: string[] = tmp[0].split('++');
                            for (let j: number = actRowIdx, diff2: number = splitValue.length + actRowIdx; j < diff2; j++) {
                                if (i === diff - 1 && j === diff2 - 1 &&
                                    this.parent.uniqueRange.indexOf(this.parent.actCell + ':' + getAlphalabel(i) + j) === - 1) {
                                    this.parent.uniqueRange.push(this.parent.actCell + ':' + getAlphalabel(i) + j);
                                }
                                if (this.checkSpill(i, j)) {
                                    isSpill = true;
                                }
                            }
                        }
                    }
                    if (isSpill) {
                        return this.parent.formulaErrorStrings[FormulasErrorsStrings.Spill];
                    }
                } else if (this.parent.dependencyLevel > 0 &&
                    this.parent.getValueFromArg(getAlphalabel(actColIdx) + actRowIdx, true).indexOf('#SPILL!') > - 1) {
                    return this.parent.formulaErrorStrings[FormulasErrorsStrings.Spill];
                }
                if (byColumn === this.parent.falseValue) {
                    const calcFamily: CalcSheetFamilyItem = this.parent.getSheetFamilyItem(this.parent.grid);
                    let token: string = ''; let cellTxt: string;
                    if (calcFamily.sheetNameToParentObject !== null && calcFamily.sheetNameToParentObject.size > 0) {
                        token = calcFamily.parentObjectToToken.get(this.parent.grid);
                        cellTxt = token + actCell;
                    }
                    for (let i: number = 0; i < tmp.length; i++) {
                        const splitValue: string[] = tmp[i as number].split('++');
                        if (i > 0) {
                            actRowIdx++;
                            actColIdx = this.parent.colIndex(actCell);
                        }
                        for (let j: number = 0; j < splitValue.length; j++) {
                            this.setValueRefresh(splitValue[j as number], actRowIdx, actColIdx);
                            if (i > 0 || j > 0) {
                                this.parent.refresh(token + getAlphalabel(actColIdx) + actRowIdx.toString(), cellTxt);
                            }
                            if (splitValue[j + 1]) {
                                actColIdx++;
                            }
                        }
                    }
                    result = tmp[0].split('++')[0];
                } else {
                    for (let i: number = 0; i < tmp.length; i++) {
                        const splitValue: string[] = tmp[i as number].split('++');
                        for (let i: number = 0; i < splitValue.length; i++) {
                            this.setValueRefresh(splitValue[i as number], actRowIdx, actColIdx);
                            if (splitValue[i + 1]) {
                                actRowIdx++;
                            } else {
                                actColIdx++;
                                actRowIdx = this.parent.rowIndex(actCell);
                            }
                        }
                    }
                    result = tmp[0].split('++')[0];
                }
            }
        } else if (this.parent.isCellReference(argArr[0])) {
            if (this.parent.dependencyCollection.indexOf(argArr[0]) === -1) {
                if (!isComputeExp) {
                    this.parent.dependencyCollection.push(argArr[0]);
                }
            } else { this.clearDependency(argArr[0]); }
            result = this.parent.getValueFromArg(argArr[0]);
        } else {
            result = this.parent.getValueFromArg(argArr[0].trim());
            if (errCollection.indexOf(result) > -1) { return result; }
            result = this.parent.removeTics(result);
        }
        return result;
    }

    private setValueRefresh(splitValue: string, rowIdx: number, colIdx: number): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.parent.parentObject as any).setValueRowCol(this.parent.getSheetId(this.parent.grid), splitValue, rowIdx, colIdx);
    }

    private checkSpill(i: number, j: number): boolean {
        let spill: boolean = false;
        const value: string = this.parent.getValueFromArg(getAlphalabel(i) + j, true);
        const formulaAddress: string = '!' + this.parent.getSheetID(this.parent.grid) + '!' + getAlphalabel(i) + j;
        let formulaString: string;
        if (this.parent.getFormulaInfoTable().get(formulaAddress)) {
            formulaString = this.parent.getFormulaInfoTable().get(formulaAddress).formulaText;
        }
        if (value && (value.toUpperCase().indexOf('UNIQUE') < 0 ||
            (formulaString && !formulaString.toUpperCase().includes('UNIQUE'))) &&
            value !== this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments]) {
            spill = true;
        }
        return spill;
    }

    public clearDependency(value: string): void {
        let actCell: string = this.parent.actCell;
        let actCellSheetName: string = '';
        if (actCell.lastIndexOf('!') > - 1) {
            const actCellAddr: string = actCell;
            actCell = actCellAddr.substring(actCellAddr.lastIndexOf('!') + 1);
            actCellSheetName = actCellAddr.substring(0, actCellAddr.lastIndexOf('!')) + '!';
        }
        const actRowIdx: number = this.parent.rowIndex(actCell);
        const actColIdx: number = this.parent.colIndex(actCell);
        const j: number = value.indexOf(':');
        const rowIndex: number = this.parent.rowIndex(this.parent.substring(value, 0, j));
        const colIndex: number = this.parent.colIndex(this.parent.substring(value, 0, j));
        const eRowIdx: number = this.parent.rowIndex(this.parent.substring(value, j + 1, j + value.length - j - 1));
        const eColIdx: number = this.parent.colIndex(this.parent.substring(value, j + 1, j + value.length - j - 1));
        const rowDiff: number = eRowIdx - rowIndex + actRowIdx; const colDiff: number = eColIdx - colIndex + actColIdx;
        const formulaText: string = this.parent.getFormulaInfoTable().get('!' + this.parent.getSheetID(this.parent.grid) + '!' + actCell) ?
            this.parent.getFormulaInfoTable().get('!' + this.parent.getSheetID(this.parent.grid) + '!' + actCell).getFormulaText() : '';
        for (let i: number = actRowIdx; i <= rowDiff; i++) {
            for (let j: number = actColIdx; j <= colDiff; j++) {
                if (this.parent.dependencyLevel > 0 || formulaText.indexOf('UNIQUE') > - 1) {
                    if (this.parent.getValueFromArg('!' + this.parent.getSheetID(this.parent.grid) + '!' +
                        getAlphalabel(actColIdx) + actRowIdx, true).indexOf('#SPILL!') > - 1) {
                        return;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.parent.parentObject as any).setValueRowCol(this.parent.getSheetID(this.parent.grid) + 1, '', i, j);
                    this.parent.refresh('!' + this.parent.getSheetID(this.parent.grid) + '!' + getAlphalabel(j) + i, actCell);
                    this.parent.actCell = actCellSheetName + actCell;
                }
            }
        }
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string} - Compute the text or null value.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the hours.
     */
    public ComputeHOUR(...args: string[]): number | string  {
        if (args.length !== 1 || isNullOrUndefined(args) || args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (args[0].split(this.parent.tic).join('').trim() === '') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        let cellVal: string;
        if (this.parent.isCellReference(args[0])) {
            cellVal = this.parent.getValueFromArg(args[0].split(this.parent.tic).join('')) || '0';
            if (cellVal.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            if (args[0].indexOf(this.parent.tic) > -1 && (args[0].split(this.parent.tic).join('') === this.parent.trueValue || args[0].split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            cellVal = this.parent.getValueFromArg(args[0]).split(this.parent.tic).join('');
        }
        if (this.parent.getErrorStrings().indexOf(cellVal) > -1) {
            return cellVal;
        }
        cellVal = cellVal === this.parent.trueValue ? '1' : (cellVal === this.parent.falseValue ? '0' : cellVal);
        let date: Date;
        if (this.parent.isNumber(cellVal)) {
            if (this.parent.parseFloat(cellVal) < 0 || this.parent.parseFloat(cellVal) > 2958465) {
                return this.parent.getErrorStrings()[CommonErrors.Num];
            }
            date = this.parent.intToTime(cellVal);
        } else {
            const dateCheck: DateFormatCheckArgs = { value: cellVal.toString() };
            (<{ notify: Function }>this.parent.parentObject).notify(checkDateFormat, dateCheck);
            if (dateCheck.isDate || dateCheck.isTime) {
                date = dateCheck.dateObj;
            } else {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        if (date.toString() === 'Invalid Date') {
            date = new Date(Date.parse(cellVal));
        }
        if (date.toString() === 'Invalid Date') {
            const argVal: string = new Date(Date.now()).toLocaleDateString() + ' ' + cellVal;
            date = new Date(Date.parse(argVal));
        }
        if (date.toString() === 'Invalid Date') {
            date = this.parent.fromOADate(this.parent.parseFloat(cellVal));
        }
        if (date.toString() === 'Invalid Date') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (date.getFullYear() < 1900 || date.getFullYear() > 9999) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        return date.getHours();
    }

    /**
     * @hidden
     * @param {string} argArr - specify the args.
     * @returns {string | boolean} - Compute the hours.
     */
    public ComputeMINUTE(...argArr: string[]): number | string  {
        if (argArr.length !== 1 || isNullOrUndefined(argArr) || argArr[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (argArr[0].split(this.parent.tic).join('').trim() === '') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        let cellVal: string;
        if (this.parent.isCellReference(argArr[0])) {
            cellVal = this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join('')) || '0';
            if (cellVal.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            if (argArr[0].indexOf(this.parent.tic) > -1 && (argArr[0].split(this.parent.tic).join('') === this.parent.trueValue || argArr[0].split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            cellVal = this.parent.getValueFromArg(argArr[0]).split(this.parent.tic).join('');
        }
        if (this.parent.getErrorStrings().indexOf(cellVal) > -1) {
            return cellVal;
        }
        cellVal = cellVal === this.parent.trueValue ? '1' : (cellVal === this.parent.falseValue ? '0' : cellVal);
        let dateVal: Date;
        if (this.parent.isNumber(cellVal)) {
            if (this.parent.parseFloat(cellVal) < 0 || this.parent.parseFloat(cellVal) > 2958465) {
                return this.parent.getErrorStrings()[CommonErrors.Num];
            }
            dateVal = this.parent.intToTime(cellVal);
        } else {
            const dateCheck: DateFormatCheckArgs = { value: cellVal.toString() };
            (<{ notify: Function }>this.parent.parentObject).notify(checkDateFormat, dateCheck);
            if (dateCheck.isDate || dateCheck.isTime) {
                dateVal = dateCheck.dateObj;
            } else {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        if (dateVal.toString() === 'Invalid Date') {
            dateVal = new Date(Date.parse(cellVal));
        }
        if (dateVal.toString() === 'Invalid Date') {
            const argVal: string = new Date(Date.now()).toLocaleDateString() + ' ' + cellVal;
            dateVal = new Date(Date.parse(argVal));
        }
        if (dateVal.toString() === 'Invalid Date') {
            dateVal = this.parent.fromOADate(this.parent.parseFloat(cellVal));
        }
        if (dateVal.toString() === 'Invalid Date') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (dateVal.getFullYear() < 1900 || dateVal.getFullYear() > 9999) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        return dateVal.getMinutes();
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the hours.
     */
    public ComputeSECOND(...args: string[]): number | string  {
        if (args.length !== 1 || isNullOrUndefined(args) || args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (args[0].split(this.parent.tic).join('').trim() === '') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        let cellVal: string;
        if (this.parent.isCellReference(args[0])) {
            cellVal = this.parent.getValueFromArg(args[0].split(this.parent.tic).join('')) || '0';
            if (cellVal.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            if (args[0].indexOf(this.parent.tic) > -1 && (args[0].split(this.parent.tic).join('') === this.parent.trueValue || args[0].split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            cellVal = this.parent.getValueFromArg(args[0]).split(this.parent.tic).join('');
        }
        if (this.parent.getErrorStrings().indexOf(cellVal) > -1) {
            return cellVal;
        }
        cellVal = cellVal === this.parent.trueValue ? '1' : (cellVal === this.parent.falseValue ? '0' : cellVal);
        let dateValue: Date;
        if (this.parent.isNumber(cellVal)) {
            if (this.parent.parseFloat(cellVal) < 0 || this.parent.parseFloat(cellVal) > 2958465) {
                return this.parent.getErrorStrings()[CommonErrors.Num];
            }
            dateValue = this.parent.intToTime(cellVal);
        } else {
            const dateCheck: DateFormatCheckArgs = { value: cellVal.toString() };
            (<{ notify: Function }>this.parent.parentObject).notify(checkDateFormat, dateCheck);
            if (dateCheck.isDate || dateCheck.isTime) {
                dateValue = dateCheck.dateObj;
            } else {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        if (dateValue.toString() === 'Invalid Date') {
            dateValue = new Date(Date.parse(cellVal));
        }
        if (dateValue.toString() === 'Invalid Date') {
            const argVal: string = (new Date(Date.now())).toLocaleDateString() + ' ' + cellVal;
            dateValue = new Date(Date.parse(argVal));
        }
        if (dateValue.toString() === 'Invalid Date') {
            dateValue = this.parent.fromOADate(this.parent.parseFloat(cellVal));
        }
        if (dateValue.toString() === 'Invalid Date') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (dateValue.getFullYear() < 1900 || dateValue.getFullYear() > 9999) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        return dateValue.getSeconds();
    }
    /**
     * @hidden
     * @param {string} argsVal - specify the args.
     * @returns {string | boolean} - Compute the months.
     */
    public ComputeMONTH(...argsVal: string[]): number | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (argsVal.length === 1 && argsVal[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argsVal.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let value: string | number = this.parent.getValueFromArg(argsVal[0]).trim();
        if (errCollection.indexOf(value) > -1) { return value; }
        if (this.parent.isCellReference(argsVal[0])) {
            if (value.indexOf(this.parent.tic) > -1) {
                return errCollection[CommonErrors.Value];
            } else if (value === '') {
                return 1;
            }
        } else {
            if (value.toUpperCase() === '"TRUE"' || value.toUpperCase() === '"FALSE"') {
                return errCollection[CommonErrors.Value];
            }
            value = value.split(this.parent.tic).join('');
        }
        if (value === '') {
            return errCollection[CommonErrors.Value];
        } else if (value === this.parent.trueValue || value === this.parent.falseValue ||
            (Number(value) > -1 && Number(value) < 32)) {
            return 1;
        } else if (Number(value) < 0) {
            return errCollection[CommonErrors.Num];
        } else if (value.indexOf('%') > -1) {
            value = (Number(value.split('%')[0]) * 0.01).toString();
        }
        if (this.parent.isNumber(value)) {
            value = parseInt((Math.floor(Number(value)).toString()), 10);
        }
        const date: Date = this.parent.parseDate(value);
        if (date.toString() === 'Invalid Date') {
            if (this.parent.isNumber(value)) {
                return errCollection[CommonErrors.Num];
            } else {
                return errCollection[CommonErrors.Value];
            }
        } else if ((date.getFullYear() < 1900) || (10000 <= date.getFullYear())) {
            return errCollection[CommonErrors.Num];
        }
        return (date.getMonth() + 1).toString();
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string } - Compute the time and date value.
     */
    public ComputeNOW(...args: string[]): string {
        if (args.length !== 1 || args[0] !== '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        return (this.parent.parentObject as { dateToInt: Function }).dateToInt(new Date(Date.now()), true).toString();
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the exact value or not.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the exact value or not.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the remainder from the given numbers.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the next odd number.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the next even number.
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

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the value of pi.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the median value.
     */
    public ComputeMEDIAN(...args: string[]): string | number  {
        let value1: number; let num: number[] = [];
        if (isNullOrUndefined(args) || args[0] === '' && args.length === 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        for (let i: number = 0; i < args.length; i++) {
            if (this.parent.isCellReference(args[i as number])) {
                if (args[i as number].indexOf(':') > -1) {
                    const cellCollection: string | string[] = this.parent.getCellCollection(args[i as number]);
                    for (let a: number = 0; a < cellCollection.length; a++) {
                        const cellValue: string = this.parent.getValueFromArg(cellCollection[a as number]);
                        if (this.parent.getErrorStrings().indexOf(cellValue) > -1) {
                            return cellValue;
                        } else if (cellValue.trim() !== '') {
                            num.push(this.parent.parseFloat(cellValue));
                        }
                    }
                } else {
                    const cellVal: string = this.parent.getValueFromArg(args[i as number]);
                    if (this.parent.getErrorStrings().indexOf(cellVal) > -1) {
                        return cellVal;
                    } else if (cellVal.trim() !== '') {
                        num.push(this.parent.parseFloat(cellVal));
                    }
                }
            } else if (args[i as number] === '' || args[i as number] === this.parent.falseValue && !this.parent.isCellReference(args[i as number])) {
                num.push(0);
            } else if (args[i as number] === this.parent.trueValue && !this.parent.isCellReference(args[i as number])) {
                num.push(1);
            } else if (args[i as number].indexOf(this.parent.tic) > -1 && isNaN(parseFloat(args[i as number].split(this.parent.tic).join('')))) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            } else {
                const cValue: string = this.parent.getValueFromArg(args[i as number]).split(this.parent.tic).join('');
                if (this.parent.getErrorStrings().indexOf(cValue) > -1) {
                    return cValue;
                } else {
                    num.push(this.parent.parseFloat(cValue));
                }
            }
        }
        num = num.sort((n1: number, n2: number) => n1 - n2);
        let len: number = num.length;
        for (let j: number = 0; j < len; j++) {
            if (isNaN(num[j as number])) {
                num.splice(j, 1);
                len = num.length;
                j--;
                if (num.length === 0) {
                    break;
                }
            }
        }
        if (num.length % 2 !== 0 && !isNaN(num[parseInt((num.length / 2).toString(), 10)])) {
            value1 = num[parseInt((num.length / 2).toString(), 10)];
        } else if (!isNaN(num[num.length / 2]) && !isNaN(num[num.length / 2 - 1])) {
            value1 = (num[num.length / 2] + num[num.length / 2 - 1]) / 2;
        } else {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return value1;
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the edate value.
     */
    public ComputeEDATE(...args: string[]): Date | string  {
        if (args.length !== 2 || isNullOrUndefined(args)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (args[0] === '' || args[1] === '') {
            return this.parent.getErrorStrings()[CommonErrors.NA];
        }
        if (args[0].split(this.parent.tic).join('') === '' || args[1].split(this.parent.tic).join('') === ''
            || (args[1].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(args[1].split(this.parent.tic).join(''))))) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        let dValue: string | number;
        let mValue: string | number;
        if (this.parent.isCellReference(args[0])) {
            if (args[0].indexOf(':') > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            dValue = this.parent.getValueFromArg(args[0].split(this.parent.tic).join('')) || '0';
            if (dValue.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            dValue = this.parent.getValueFromArg(args[0].split(this.parent.tic).join(''));
        }
        if (this.parent.isCellReference(args[1])) {
            if (args[1].indexOf(':') > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            mValue = this.parent.getValueFromArg(args[1].split(this.parent.tic).join('')) || '0';
        } else {
            mValue = this.parent.getValueFromArg(args[1].split(this.parent.tic).join(''));
        }
        if (this.parent.getErrorStrings().indexOf(mValue) > -1) {
            return mValue;
        }
        mValue = parseInt(mValue, 10);
        let date: Date;
        if (this.parent.isNumber(dValue)) {
            dValue = parseInt(dValue, 10);
            if (dValue < 0 || dValue > 2958465) {
                return this.parent.getErrorStrings()[CommonErrors.Num];
            }
            date = this.parent.fromOADate(dValue);
        } else {
            date = this.parent.checkDateFormat(dValue);
        }
        if (isNaN(mValue) || isNullOrUndefined(this.parent.isDate(date)) || date.getFullYear() > 9999) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        const checkDate: number = date.getDate();
        date.setMonth(date.getMonth() + mValue);
        if (checkDate !== date.getDate()) {
            date.setDate(0);
            //For the date like 31st of January and mValue as 1, the setMonth returns 3rd of March, so we using setDate(0) to return 28th of February.
        }
        let result: number = (this.parent.parentObject as { dateToInt: Function }).dateToInt(date);
        // For 0 and 1 values we are considering the same starting date as 1/1/1900, so for 0 we are decrementing the value with 1.
        if (dValue.toString() === '0') {
            result -= 1;
        }
        if (result < 0 || result > 2958465) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the number of months value.
     */
    public ComputeEOMONTH(...args: string[]): Date | string {
        if (args.length !== 2 || isNullOrUndefined(args)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (args[0] === '' || args[1] === '') {
            return this.parent.getErrorStrings()[CommonErrors.NA];
        }
        if (args[0].split(this.parent.tic).join('') === '' || args[1].split(this.parent.tic).join('') === ''
            || (args[1].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(args[1].split(this.parent.tic).join(''))))) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        let dateValue: string | number;
        let monthValue: string | number;
        if (this.parent.isCellReference(args[0])) {
            if (args[0].indexOf(':') > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            dateValue = this.parent.getValueFromArg(args[0].split(this.parent.tic).join('')) || '0';
            if (dateValue.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            dateValue = this.parent.getValueFromArg(args[0]).split(this.parent.tic).join('');
        }
        if (this.parent.getErrorStrings().indexOf(dateValue) > -1) {
            return dateValue;
        }
        if (this.parent.isCellReference(args[1])) {
            if (args[1].indexOf(':') > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            monthValue = this.parent.getValueFromArg(args[1].split(this.parent.tic).join('')) || '0';
        } else {
            monthValue = this.parent.getValueFromArg(args[1].split(this.parent.tic).join(''));
        }
        if (this.parent.getErrorStrings().indexOf(monthValue) > -1) {
            return monthValue;
        }
        monthValue = parseInt(monthValue, 10);
        let date: Date;
        if (this.parent.isNumber(dateValue)) {
            dateValue = parseInt(dateValue, 10);
            if (dateValue < 0 || dateValue > 2958465) {
                return this.parent.getErrorStrings()[CommonErrors.Num];
            }
            date = this.parent.fromOADate(dateValue);
        } else {
            date = this.parent.checkDateFormat(dateValue);
        }
        if (isNaN(monthValue) || isNullOrUndefined(this.parent.isDate(date)) || date.getFullYear() > 9999) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        date = new Date(date.getFullYear(), date.getMonth() + (monthValue + 1), 0);
        const result: number = (this.parent.parentObject as { dateToInt: Function }).dateToInt(date);
        if (result < 0 || result > 2958465 || date.getFullYear() < 1900) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the date value.
     */
    public ComputeDATEVALUE(...args: string[]): Date | string  {
        let dValue: string; let computedDvalue: string;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        dValue = computedDvalue = this.parent.getValueFromArg(args[0]) || '0';
        if (errCollection.indexOf(dValue) > -1) { return dValue; }
        if (this.parent.isCellReference(args[0])) {
            if ((args[0].indexOf(':') > -1) || dValue.startsWith(this.parent.tic)) {
                return errCollection[CommonErrors.Value];
            }
        } else {
            dValue = (args[0]).split(this.parent.tic).join('') || '0';
        }
        if (!(!(this.parent.isNumber(dValue)) && !isNullOrUndefined(this.parent.isDate(dValue)))) {
            if (!this.parent.isNumber(computedDvalue) && this.parent.isDate(computedDvalue)) {
                dValue = computedDvalue;
            } else {
                return errCollection[CommonErrors.Value];
            }
        }
        const date: Date = this.parent.parseDate(dValue);
        if (errCollection.indexOf(dValue) > -1) {
            return dValue;
        } else if (isNullOrUndefined(date) || date.toString() === 'Invalid Date' ||
            date.getFullYear() < 1900 || date.getFullYear() > 9999) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        } else {
            dValue = this.parent.toOADate(date).toString();
        }
        return parseFloat(dValue).toFixed(0).toString();
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the count blank value.
     */
    public ComputeCOUNTBLANK(...args: string[]): string | number  {
        let result: number = 0;
        if (args.length !== 1 || isNullOrUndefined(args) || !this.parent.isCellReference(args[0])) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args[0] === '') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        } else {
            const cellRange: string | string[] = this.parent.getCellCollection(args[0]);
            for (let i: number = 0; i < cellRange.length; i++) {
                if (this.parent.getValueFromArg(cellRange[i as number]) === '') {
                    result++;
                }
            }
        }
        return result;
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the factorial value.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the decimal value.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the degrees value.
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
     * @hidden
     * @param {string} argArr - specify the args.
     * @returns {string | boolean} - Compute the cell address.
     */
    public ComputeADDRESS(...argArr: string[]): string | number  {
        let value: string; const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0].trim() === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argArr.length < 2 || argArr.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (argArr[0].split(this.parent.tic).join('').trim() === '' || argArr[1].split(this.parent.tic).join('').trim() === '') {
            return errCollection[CommonErrors.Value];
        }
        const processArgs: Function = (actualValue: string): string => {
            let value: string = this.parent.getValueFromArg(actualValue).trim();
            if (errCollection.indexOf(value) > 0) { return value; }
            if (value.toUpperCase() === this.parent.trueValue) {
                value = '1';
            } else if (value.toUpperCase() === this.parent.falseValue) {
                value = '0';
            }
            if (this.parent.isCellReference(actualValue) && value.indexOf(this.parent.tic) > -1) {
                return errCollection[CommonErrors.Value];
            }
            value = this.parent.removeTics(value);
            if (value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
                value = (Number(value.split('%')[0]) / 100).toString();
            }
            return value;
        };
        /* For argArr[0] */
        let rowIndex: string | number = processArgs(argArr[0], 0);
        if (errCollection.indexOf(rowIndex as string) > 0) { return rowIndex; }
        rowIndex = Number(rowIndex);
        if (isNaN(rowIndex) || rowIndex < 1) {
            return errCollection[CommonErrors.Value];
        } else {
            rowIndex = rowIndex.toString();
        }
        /* For argArr[1] */
        let colIndex: string | number = processArgs(argArr[1], 1);
        if (errCollection.indexOf(colIndex as string) > 0) { return colIndex; }
        colIndex = Number(colIndex);
        if (isNaN(colIndex) || colIndex < 1) {
            return errCollection[CommonErrors.Value];
        } else {
            colIndex = colIndex.toString();
        }
        /* For argArr[2] */
        let absIndex: string | number; let refStyle: string;
        if (isNullOrUndefined(argArr[2]) || argArr[2].trim() === '') {
            absIndex = '1';
        } else {
            absIndex = processArgs(argArr[2], 2);
            if (errCollection.indexOf(absIndex as string) > 0) { return absIndex; }
            absIndex = Number(absIndex);
            if (isNaN(absIndex) || absIndex < 1 || absIndex > 4) {
                return errCollection[CommonErrors.Value];
            } else {
                absIndex = absIndex.toString();
            }
        }
        if (isNullOrUndefined(argArr[3]) || argArr[3].trim() === '') {
            refStyle = '1';
        } else {
            refStyle = processArgs(argArr[3], 3);
            if (errCollection.indexOf(refStyle) > 0) { return refStyle; }
            if (refStyle.toUpperCase() === this.parent.trueValue || Number(refStyle) > 1) {
                refStyle = '1';
            } else if (refStyle === '' || refStyle.toUpperCase() === this.parent.falseValue) {
                refStyle = '0';
            }
        }
        if (refStyle === '1') {
            if (absIndex === '1') {
                value = '$' + getAlphalabel(parseInt(colIndex, 10)) + '$' + parseInt(rowIndex, 10);
            } else if (absIndex === '2') {
                value = getAlphalabel(parseInt(colIndex, 10)) + '$' + parseInt(rowIndex, 10);
            } else if (absIndex === '3') {
                value = '$' + getAlphalabel(parseInt(colIndex, 10)) + parseInt(rowIndex, 10);
            } else if (absIndex === '4') {
                value = getAlphalabel(parseInt(colIndex, 10)) + parseInt(rowIndex, 10);
            }
        } else if (refStyle === '0') {
            if (absIndex === '1') {
                value = 'R' + parseInt(rowIndex, 10) + 'C' + parseInt(colIndex, 10);
            } else if (absIndex === '2') {
                value = 'R' + parseInt(rowIndex, 10) + 'C[' + parseInt(colIndex, 10) + ']';
            } else if (absIndex === '3') {
                value = 'R[' + parseInt(rowIndex, 10) + ']C' + parseInt(colIndex, 10);
            } else if (absIndex === '4') {
                value = 'R[' + parseInt(rowIndex, 10) + ']C[' + parseInt(colIndex, 10) + ']';
            }
        } else {
            return errCollection[CommonErrors.Name];
        }
        let val: string;
        if (!isNullOrUndefined(argArr[4]) && argArr[4] !== '') {
            val = this.parent.getValueFromArg(argArr[4]).split(this.parent.tic).join('');
            if (errCollection.indexOf(val) > 0) { return val; }
        }
        if (!isNullOrUndefined(val)) {
            value = val + '!' + value;
        }
        return value;
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the time.
     */
    public ComputeTIME(...args: string[]): string | number  {
        let result: string;
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (args[0].indexOf(this.parent.tic) > -1 && args[0].split(this.parent.tic).join('').trim() === '') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        } else if (args[1].indexOf(this.parent.tic) > -1 && args[1].split(this.parent.tic).join('').trim() === '') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        } else if (args[2].indexOf(this.parent.tic) > -1 && args[2].split(this.parent.tic).join('').trim() === '') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        let hours: string | number;
        let minutes: string | number;
        let seconds: string | number;
        if (this.parent.isCellReference(args[0])) {
            hours = this.parent.getValueFromArg(args[0].split(this.parent.tic).join('')) || '0';
            if (hours.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            if (args[0].indexOf(this.parent.tic) > -1 && (args[0].split(this.parent.tic).join('') === this.parent.trueValue || args[0].split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            hours = this.parent.getValueFromArg(args[0]).split(this.parent.tic).join('') || '0';
        }
        if (this.parent.getErrorStrings().indexOf(hours) > -1) {
            return hours;
        }
        if (isNaN(this.parent.parseFloat(hours)) && !(hours === this.parent.trueValue || hours === this.parent.falseValue)) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (this.parent.isCellReference(args[1])) {
            minutes = this.parent.getValueFromArg(args[1].split(this.parent.tic).join('')) || '0';
            if (minutes.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            if (args[1].indexOf(this.parent.tic) > -1 && (args[1].split(this.parent.tic).join('') === this.parent.trueValue || args[1].split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            minutes = this.parent.getValueFromArg(args[1]).split(this.parent.tic).join('') || '0';
        }
        if (this.parent.getErrorStrings().indexOf(minutes) > -1) {
            return minutes;
        }
        if (isNaN(this.parent.parseFloat(minutes)) && !(minutes === this.parent.trueValue || minutes === this.parent.falseValue)) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (this.parent.isCellReference(args[2])) {
            seconds = this.parent.getValueFromArg(args[2].split(this.parent.tic).join('')) || '0';
            if (seconds.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            if (args[2].indexOf(this.parent.tic) > -1 && (args[2].split(this.parent.tic).join('') === this.parent.trueValue || args[2].split(this.parent.tic).join('') === this.parent.falseValue)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            seconds = this.parent.getValueFromArg(args[2]).split(this.parent.tic).join('') || '0';
        }
        if (this.parent.getErrorStrings().indexOf(seconds) > -1) {
            return seconds;
        }
        if (isNaN(this.parent.parseFloat(seconds)) && !(seconds === this.parent.trueValue || seconds === this.parent.falseValue)) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        hours = hours === this.parent.trueValue ? '1' : (hours === this.parent.falseValue ? '0' : hours);
        minutes = minutes === this.parent.trueValue ? '1' : (minutes === this.parent.falseValue ? '0' : minutes);
        seconds = seconds === this.parent.trueValue ? '1' : (seconds === this.parent.falseValue ? '0' : seconds);
        hours = parseInt(this.parent.parseFloat(hours).toString(), 10);
        minutes = parseInt(this.parent.parseFloat(minutes).toString(), 10);
        seconds = parseInt(this.parent.parseFloat(seconds).toString(), 10);
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (hours > 32767 || minutes > 32767 || seconds > 32767) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        const value: Date = new Date(1900, 0, 1, hours, minutes, seconds);
        if (value.getFullYear() < 1900) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        let h: string | number = value.getHours();
        let m: string | number = value.getMinutes();
        let s: string | number = value.getSeconds();
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        h = h < 10 ? '0' + h : h;
        result = h + ':' + m + ':' + s;
        const timeCheck: DateFormatCheckArgs = { value: result.toString() };
        (<{ notify: Function }>this.parent.parentObject).notify(
            checkDateFormat, timeCheck);
        if (timeCheck.isTime) {
            result = timeCheck.updatedVal;
        }
        return result;
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the char value.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the code value.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the currency value.
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
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the k-th smallest value.
     */
    public ComputeSMALL(...args: string[]): string | number  {
        let value: number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length === 1 || args[0] === '') {
            if ((args[0] === '') && (args[1] === '')) {
                return errCollection[CommonErrors.Num];
            } else {
                return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
            }
        } else if (args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let cellCollection: string[] | string = [];
        const valueCollection: string[] = [];
        let numArr: number[] = [];
        if (!isNullOrUndefined(args[0])) {
            let originalValue: string | number;
            if (this.parent.isCellReference(args[0])) {
                cellCollection = this.parent.getCellCollection(args[0]);
                for (let i: number = 0; i < cellCollection.length; i++) {
                    originalValue = this.parent.getValueFromArg(cellCollection[i as number]);
                    if (errCollection.indexOf(originalValue) > -1) {
                        return originalValue;
                    }
                    valueCollection.push(originalValue);
                }
            } else {
                originalValue = this.parent.getValueFromArg(args[0]).split(this.parent.tic).join('');
                if (errCollection.indexOf(originalValue) > -1) {
                    return originalValue;
                }
                valueCollection.push(originalValue);
            }
            for (let i: number = 0; i < valueCollection.length; i++) {
                if (valueCollection[i as number] !== '' && !isNaN(this.parent.parseFloat(valueCollection[i as number]))) {
                    numArr.push(this.parent.parseFloat(valueCollection[i as number]));
                }
            }
            if (numArr.length === 0) {
                if (isNullOrUndefined(valueCollection[0]) || args[0].indexOf(this.parent.tic) > -1) {
                    return errCollection[CommonErrors.Value];
                }
            }
        }
        numArr = numArr.sort((n1: number, n2: number) => n1 - n2);
        let smallIndex: string;
        if (!isNullOrUndefined(args[1])) {
            if (this.parent.isCellReference(args[1])) {
                smallIndex = this.parent.getValueFromArg(args[1]);
                if (smallIndex === '') {
                    return errCollection[CommonErrors.Num];
                } else if (smallIndex.trim() === '') {
                    return errCollection[CommonErrors.Value];
                }
                if (smallIndex.toUpperCase() === this.parent.trueValue) {
                    smallIndex = '1';
                } else if (smallIndex.toUpperCase() === this.parent.falseValue) {
                    smallIndex = '0';
                }
            } else {
                smallIndex = this.parent.getValueFromArg(args[1]).split(this.parent.tic).join('');
            }
            if (errCollection.indexOf(smallIndex) > -1) {
                return smallIndex;
            } else if (smallIndex.trim() === '') {
                return args[1].length > 0 ? errCollection[CommonErrors.Value] : errCollection[CommonErrors.Num];
            } else if (isNaN(this.parent.parseFloat(smallIndex))) {
                if (args[1].toUpperCase() === this.parent.trueValue) {
                    smallIndex = '1';
                } else if (args[1].toUpperCase() === this.parent.falseValue) {
                    smallIndex = '0';
                } else {
                    return errCollection[CommonErrors.Value];
                }
            }
        }
        const finalIndex: string | number = (Number(smallIndex) < 1 ? 0 : Math.floor(Number(smallIndex)));
        if (isNullOrUndefined(numArr[(finalIndex as number) - 1]) && !isNaN(Number(finalIndex))) {
            return errCollection[CommonErrors.Num];
        } else {
            value = numArr[(finalIndex as number) - 1];
        }
        return value;
    }

    /**
     * @hidden
     * @param {string} args - specify the args.
     * @returns {string | boolean} - Compute the k-th largest value.
     */
    public ComputeLARGE(...args: string[]): string | number {
        let value: number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length === 1 || args[0] === '') {
            if ((args[0] === '') && (args[1] === '')) {
                return errCollection[CommonErrors.Num];
            } else {
                return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
            }
        } else if (args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let cellCollection: string[] | string = [];
        const valueCollection: string[] = [];
        let numArr: number[] = [];
        if (!isNullOrUndefined(args[0])) {
            let originalValue: string | number;
            if (this.parent.isCellReference(args[0])) {
                cellCollection = this.parent.getCellCollection(args[0]);
                for (let i: number = 0; i < cellCollection.length; i++) {
                    originalValue = this.parent.getValueFromArg(cellCollection[i as number]);
                    if (errCollection.indexOf(originalValue) > -1) {
                        return originalValue;
                    }
                    valueCollection.push(originalValue);
                }
            } else {
                originalValue = this.parent.getValueFromArg(args[0]).split(this.parent.tic).join('');
                if (errCollection.indexOf(originalValue) > -1) {
                    return originalValue;
                }
                valueCollection.push(originalValue);
            }
            for (let i: number = 0; i < valueCollection.length; i++) {
                if (valueCollection[i as number] !== '' && !isNaN(this.parent.parseFloat(valueCollection[i as number]))) {
                    numArr.push(this.parent.parseFloat(valueCollection[i as number]));
                }
            }
            if (numArr.length === 0) {
                if (isNullOrUndefined(valueCollection[0]) || args[0].indexOf(this.parent.tic) > -1) {
                    return errCollection[CommonErrors.Value];
                }
            }
        }
        numArr = numArr.sort((n1: number, n2: number) => n2 - n1);
        let largeIndex: string;
        if (!isNullOrUndefined(args[1])) {
            if (this.parent.isCellReference(args[1])) {
                largeIndex = this.parent.getValueFromArg(args[1]);
                if (largeIndex === '') {
                    return errCollection[CommonErrors.Num];
                } else if (largeIndex.trim() === '') {
                    return errCollection[CommonErrors.Value];
                }
                if (largeIndex.toUpperCase() === this.parent.trueValue) {
                    largeIndex = '1';
                } else if (largeIndex.toUpperCase() === this.parent.falseValue) {
                    largeIndex = '0';
                }
            } else {
                largeIndex = this.parent.getValueFromArg(args[1]).split(this.parent.tic).join('');
            }
            if (errCollection.indexOf(largeIndex) > -1) {
                return largeIndex;
            } else if (largeIndex.trim() === '') {
                return args[1].length > 0 ? errCollection[CommonErrors.Value] : errCollection[CommonErrors.Num];
            } else if (isNaN(this.parent.parseFloat(largeIndex))) {
                if (args[1].toUpperCase() === this.parent.trueValue) {
                    largeIndex = '1';
                } else if (args[1].toUpperCase() === this.parent.falseValue) {
                    largeIndex = '0';
                } else {
                    return errCollection[CommonErrors.Value];
                }
            }
        }
        const finalIndex: string | number = (Number(largeIndex) < 1 ? 0 : Math.ceil(Number(largeIndex)));
        if (isNullOrUndefined(numArr[(finalIndex as number) - 1]) && !isNaN(Number(finalIndex))) {
            return errCollection[CommonErrors.Num];
        } else {
            value = numArr[(finalIndex as number) - 1];
        }
        return value;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string | number} - Compute the Choose value.
     */
    public ComputeCHOOSE(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args[0] === '' && args.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const processArgs: Function = (actuaValue: string): string => {
            actuaValue = this.parent.getValueFromArg(actuaValue);
            if (actuaValue.toUpperCase() === this.parent.trueValue) {
                actuaValue = '1';
            } else if (actuaValue.toUpperCase() === this.parent.falseValue) {
                actuaValue = '0';
            }
            return actuaValue;
        };
        let getIndexValue: string | number;
        getIndexValue = processArgs(args[0]) as string;
        if (errCollection.indexOf(getIndexValue) > -1) {
            return getIndexValue;
        }
        if (this.parent.isCellReference(args[0])) {
            if (args[0].indexOf(':') > -1) {
                return errCollection[CommonErrors.Value];
            }
        } else {
            getIndexValue = this.parent.removeTics(getIndexValue);
            if (getIndexValue.split('%').length === 2 && this.parent.isNumber(getIndexValue.split('%')[0])) {
                getIndexValue = (Number(getIndexValue.split('%')[0]) * 0.01).toString();
            }
        }
        getIndexValue =  Math.floor(this.parent.parseFloat(getIndexValue));
        if (getIndexValue < 1 || isNaN(getIndexValue) || isNullOrUndefined(args[getIndexValue as number])) {
            return errCollection[CommonErrors.Value];
        }
        getIndexValue = args[getIndexValue as number];
        if (getIndexValue === '') {
            getIndexValue = '0';
        }
        if (this.parent.isCellReference(getIndexValue)) {
            if (getIndexValue.indexOf(':') > -1) {
                return errCollection[CommonErrors.Value];
            }
            return this.parent.getValueFromArg(getIndexValue);
        } else {
            if (getIndexValue.indexOf(this.parent.tic) > -1 && (errCollection.indexOf(getIndexValue.split(this.parent.tic).join('')) > -1 ||
                (this.parent.removeTics(getIndexValue).match(/^(\d*\.\d+|\d+)\s*[-*/]\s*(\d*\.\d+|\d+)$/)))) {
                getIndexValue = this.parent.removeTics(getIndexValue);
            }
            getIndexValue = this.parent.removeTics(this.parent.getValueFromArg(getIndexValue));
            if (getIndexValue.indexOf(this.parent.tic + this.parent.tic) > -1) {
                return getIndexValue.replace(/""/g, this.parent.tic);
            }
            if (getIndexValue.split('%').length === 2 && this.parent.isNumber(getIndexValue.split('%')[0])) {
                getIndexValue = (Number(getIndexValue.split('%')[0]) * 0.01).toString();
            }
            return getIndexValue;
        }
    }

    /**
     * @hidden
     * @param {string[]} range - specify the range.
     * @returns {string | number} - Compute the SUMIF value.
     */
    public ComputeSUMIF(...range: string[]): string | number {
        const argArr: string[] = range;
        if (argArr[0].indexOf(':') < 0 && !this.parent.isCellReference(argArr[0]) ||
            (argArr[2] && argArr[2].indexOf(':') < 0 && !this.parent.isCellReference(argArr[2]))) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.ImproperFormula];
        }
        if (argArr.length > 3 || argArr.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const result: number[] | string = this.parent.computeSumIfAndAvgIf(range, false);
        if (typeof result === 'string' && (this.parent.formulaErrorStrings.indexOf(result)
            || this.parent.getErrorStrings().indexOf(result))) {
            return result;
        }
        return result[0];
    }

    /**
     * @hidden
     * @param {string[]} absValue - specify the absValue.
     * @returns {string | number} - Compute the AVERAGE value.
     */
    public ComputeABS(...absValue: string[]): string | number {
        const argArr: string[] = absValue;
        let cellvalue: string = '';
        let absVal: number;
        if (absValue.length === 0 || absValue.length > 1) {
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
                return this.parent.getErrorStrings()[CommonErrors.Value];
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
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {string} - Compute the AVERAGE value.
     */
    public ComputeAVERAGE(...args: string[]): string {
        let isSubtotalFormula: boolean = false;
        if (args.length) {
            const lastArgument: string = args[args.length - 1];
            if (lastArgument === 'isSubtotal') {
                isSubtotalFormula = true;
                args.pop();
            }
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argArr: string[] = args;
        for (let i: number = 0; i < argArr.length; i++) {
            if (argArr[i as number].indexOf(':') > -1) {
                if (argArr[i as number].indexOf(this.parent.tic) > -1) {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
            }
        }
        return this.parent.calculateAvg(argArr, isSubtotalFormula);
    }

    /**
     * @hidden
     * @param {string[]} range - specify the range.
     * @returns {string | number} - Compute the AVERAGEIF value.
     */
    public ComputeAVERAGEIF(...range: string[]): string | number {
        const argList: string[] = range;
        if (argList[0].indexOf(':') < 0 && !this.parent.isCellReference(argList[0])) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.ImproperFormula];
        }
        const resultVal: number[] | string = this.parent.computeSumIfAndAvgIf(range, true);
        if (resultVal[1] === 0 || resultVal[0].toString() === 'NaN') { return this.parent.formulaErrorStrings[FormulasErrorsStrings.Div]; }
        if (typeof resultVal === 'string' && (this.parent.formulaErrorStrings.indexOf(resultVal)
            || this.parent.getErrorStrings().indexOf(resultVal))) {
            return resultVal;
        }
        return this.parent.parseFloat(resultVal[0]) / this.parent.parseFloat(resultVal[1]);
    }

    /**
     * @hidden
     * @param {string[]} range - specify the range.
     * @returns {string} - Compute the CONCATENATE value.
     */
    public ComputeCONCATENATE(...range: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(range) || (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argsList: string[] = range;
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
     * @hidden
     * @param {string[]} range - specify the range.
     * @returns {string} - Compute the CONCAT value.
     */
    public ComputeCONCAT(...range: string[]): string {
        this.isConcat = true;
        return this.ComputeCONCATENATE(...range);
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string | number} - Compute the MAX value.
     */
    public ComputeMAX(...args: string[]): string {
        return this.parent.computeMinMax(args, 'max');
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string} - Compute the MIN value.
     */
    public ComputeMIN(...args: string[]): string {
        return this.parent.computeMinMax(args, 'min');
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string} - Compute the RAND value.
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
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string} - Compute the AND value.
     */
    public ComputeAND(...args: string[]): string {
        const argArr: string[] = args;
        if (isNullOrUndefined(args) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        return this.parent.computeAndOrNot(argArr, 'and');
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string} - Compute the OR value.
     */
    public ComputeOR(...args: string[]): string {
        const argArr: string[] = args;
        if (isNullOrUndefined(args) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        return this.parent.computeAndOrNot(argArr, 'or');
    }

    /**
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {string} - Compute the NOT value.
     */
    public ComputeNOT(...args: string[]): string {
        const argArr: string[] = args;
        if (isNullOrUndefined(args) || (args.length > 1 || args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return this.parent.computeAndOrNot(argArr, 'not');
    }

    /**
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {string | number} - Compute the find value.
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
            if (errCollection.indexOf(value) > -1) { return value; }
            if (!this.parent.isCellReference(actuaValue)) {
                if (value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
                    value = (Number(value.split('%')[0]) * 0.01).toString();
                } else if (actuaValue.indexOf(this.parent.tic) > -1) {
                    if (this.parent.removeTics(actuaValue).match(/^(\d*\.\d+|\d+)\s*[-*/]\s*(\d*\.\d+|\d+)$/)) {
                        value = this.parent.getValueFromArg(this.parent.removeTics(actuaValue));
                    } else if (value.indexOf(this.parent.tic + this.parent.tic) > -1) {
                        value = value.replace(/""/g, this.parent.tic);
                    }
                }
            }
            return value;
        };
        let findText: string;
        if (!isNullOrUndefined(args[0])) {
            findText = processArgs(args[0]);
            if (errCollection.indexOf(findText) > -1) {
                return findText;
            } else if (!this.parent.isCellReference(args[0])) {
                findText = this.parent.removeTics(findText);
            }
        }
        let withinText: string;
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
     * @hidden
     * @param {string[]} argArr - specify the range.
     * @returns {string | number} - Compute the index.
     */
    public ComputeINDEX(...argArr: string[]): string | number {
        let nestedFormula: boolean; let value: string;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (argArr.length && argArr[argArr.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            argArr.pop();
        }
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argArr.length < 2 || argArr.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (argArr[0] === '') {
            return errCollection[CommonErrors.Value];
        } else if (argArr[0].indexOf(':') === -1) {
            return errCollection[CommonErrors.Ref];
        } else if (argArr[3] && argArr[3] === '0') {
            return errCollection[CommonErrors.Value];
        }
        let row: number; let col: number; let area: number;
        const processArgs: Function = (actualValue: string): string | number => {
            if (isNullOrUndefined(actualValue) || actualValue === '') {
                return 1;
            }
            let value: string | number = this.parent.getValueFromArg(actualValue as string);
            if (errCollection.indexOf(value) > -1) { return value; }
            if (value.toUpperCase() === this.parent.trueValue) {
                value = '1';
            } else if (value.toUpperCase() === this.parent.falseValue) {
                value = '0';
            }
            if ((value as string).indexOf(this.parent.tic) > -1) {
                value = this.parent.removeTics(value as string);
                if (actualValue.indexOf(this.parent.tic) === -1 || value.trim() === '') {
                    return errCollection[CommonErrors.Value];
                }
            }
            if ((value as string).split('%').length === 2 && this.parent.isNumber((value as string).split('%')[0])) {
                value = (Number((value as string).split('%')[0]) / 100).toString();
            }
            value = parseInt(Number(value).toString(), 10);
            if (isNaN(value) || value < 0) {
                return errCollection[CommonErrors.Value];
            } else if (value === 0) {
                value = 1;
            }
            return value;
        };
        if (argArr[3]) {
            area = processArgs(argArr[3]);
            if (errCollection.indexOf(area.toString()) > -1) { return area.toString(); }
        }
        if (argArr[0].startsWith(this.parent.tic) && argArr[0].endsWith(this.parent.tic)) {
            argArr[0] = argArr[0].substring(1, argArr[0].length - 1);
        }
        const rangeArr: string[] = argArr[0].split(this.parent.getParseArgumentSeparator());
        argArr[0] = rangeArr[area ? area - 1 : 0];
        if (!argArr[0]) {
            return errCollection[CommonErrors.Ref];
        }
        value = argArr[0];
        row = processArgs(argArr[1]);
        if (errCollection.indexOf(row.toString()) > -1) { return row.toString(); }
        col = processArgs(argArr[2]);
        if (errCollection.indexOf(col.toString()) > -1) { return col.toString(); }
        const i: number = value.indexOf(':');
        const startRow: number = this.parent.rowIndex(value.substring(0, i));
        const endRow: number = this.parent.rowIndex(value.substring(i + 1));
        const startCol: number = this.parent.colIndex(value.substring(0, i));
        const endCol: number = this.parent.colIndex(value.substring(i + 1));
        if (row > endRow - startRow + 1 || col > endCol - startCol + 1) {
            return errCollection[CommonErrors.Ref];
        }
        row = startRow + row - 1; col = startCol + col - 1;
        value = this.parent.getValueFromArg(
            this.getSheetReference(value) + this.parent.convertAlpha(col) + row
        );
        if (value === '') { return 0; }
        if (nestedFormula && errCollection.indexOf(value) === -1 &&
            !this.parent.isNumber(value) && value !== this.parent.trueValue && value !== this.parent.falseValue) {
            return this.parent.tic + value + this.parent.tic;
        }
        return value;
    }

    private getSheetReference(range: string): string {
        return range.indexOf(this.parent.sheetToken) === 0 && range.lastIndexOf(this.parent.sheetToken) > range.indexOf(
            this.parent.sheetToken) ? range.substring(0, range.lastIndexOf(this.parent.sheetToken) + 1) : '';
    }

    /**
     * @hidden
     * @param {string[]} range - specify the range.
     * @returns {string | number} - Compute the if.
     */
    public ComputeIFS(...range: string[]): string | number {
        const argArr: string[] = range;
        if (isNullOrUndefined(range) || (argArr.length === 1 && argArr[0] === '') || argArr.length % 2 !== 0) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let condition: string = '';
        let result: string = '';
        for (let i: number = 0; i < argArr.length; i++) {
            condition = this.parent.getValueFromArg(argArr[i as number]);
            if (argArr[i as number] === '') {
                return this.parent.getErrorStrings()[CommonErrors.NA];
            }
            if (this.parent.getErrorStrings().indexOf(condition) > -1) {
                return condition;
            }
            if (condition !== this.parent.trueValue && condition !== this.parent.falseValue) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            if (condition === this.parent.trueValue) {
                if (this.parent.isCellReference(argArr[i + 1].split(this.parent.tic).join('')) || argArr[i + 1].includes(this.parent.arithMarker)) {
                    result = this.parent.getValueFromArg(argArr[i + 1]);
                    result = result === '' ? '0' : result;
                } else {
                    result = argArr[i + 1] === '' ? '0' : this.parent.getValueFromArg(argArr[i + 1]);
                    if (result.indexOf(this.parent.tic) > -1) {
                        result = result.split(this.parent.tic).join('');
                    }
                }
                i = i + 1;
                return result;
            } else if (condition === this.parent.falseValue) {
                i = i + 1;
            }
        }
        return this.parent.getErrorStrings()[CommonErrors.NA];
    }

    /**
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {number | string} - Compute the count.
     */
    public ComputeCOUNTA(...args: string[]): number | string {
        let isSubtotalFormula: boolean = false;
        if (args.length) {
            const lastArgument: string = args[args.length - 1];
            if (lastArgument === 'isSubtotal') {
                isSubtotalFormula = true;
                args.pop();
            }
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArr: string[] = args;
        let cellColl: string[] | string;
        let result: number = 0;
        let cellValue: string; let value: string;
        for (let i: number = 0; i < argArr.length; i++) {
            if (this.parent.isCellReference(argArr[i as number])) {
                if (argArr[i as number].indexOf(':') > -1) {
                    cellColl = this.parent.getCellCollection(argArr[i as number].split(this.parent.tic).join(''));
                    for (let j: number = 0; j < cellColl.length; j++) {
                        cellValue = !isSubtotalFormula ? this.parent.getValueFromArg(cellColl[j as number]) :
                            this.parent.getValueFromArg(cellColl[j as number], null, null, true);
                        if (isSubtotalFormula && cellValue.includes('SUBTOTAL(')) {
                            continue;
                        }
                        if (cellValue.length > 0) {
                            result++;
                        }
                    }
                } else {
                    cellValue = !isSubtotalFormula ? this.parent.getValueFromArg(argArr[i as number]) :
                        this.parent.getValueFromArg(argArr[i as number], null, null, true);
                    if (isSubtotalFormula && cellValue.includes('SUBTOTAL(')) {
                        continue;
                    }
                    if (cellValue.length > 0) {
                        result++;
                    }
                }
            } else {
                value = this.parent.getValueFromArg(argArr[i as number]).split(this.parent.tic).join('');
                if (value.length > 0) {
                    result++;
                } else if (value.length === 0 && value.trim() === '') {
                    result++;
                }
            }
        }
        return result;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {number | string} - Compute the average.
     */
    public ComputeAVERAGEA(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArrs: string[] = args;
        let cellCol: string[] | string;
        let result: number = 0;
        let cellValue: string | number; let value: string;
        let length: number = 0;
        let parseValue: string | number;
        for (let k: number = 0; k < argArrs.length; k++) {
            if (this.parent.isCellReference(argArrs[k as number])) {
                if (argArrs[k as number].indexOf(':') > -1) {
                    cellCol = this.parent.getCellCollection(argArrs[k as number].split(this.parent.tic).join(''));
                    for (let j: number = 0; j < cellCol.length; j++) {
                        cellValue = this.parent.getValueFromArg(cellCol[j as number]);
                        cellValue = this.processLogicalCellValue(cellValue);
                        if (this.parent.getErrorStrings().indexOf(cellValue) > -1) {
                            return cellValue;
                        } else if (isNullOrUndefined(cellValue) || cellValue === '') {
                            continue;
                        }
                        parseValue = this.parent.parseFloat(cellValue);
                        cellValue = !isNaN(parseValue) ? parseValue : 0;
                        result += cellValue;
                        length = length + 1;
                    }
                } else {
                    cellValue = this.parent.getValueFromArg(argArrs[k as number]);
                    cellValue = this.processLogicalCellValue(cellValue);
                    if (this.parent.getErrorStrings().indexOf(cellValue) > -1) {
                        return cellValue;
                    } else if (isNullOrUndefined(cellValue) || cellValue === '') {
                        continue;
                    }
                    parseValue = this.parent.parseFloat(cellValue);
                    cellValue = !isNaN(parseValue) ? parseValue : 0;
                    result += cellValue;
                    length = length + 1;
                }
            } else {
                if (argArrs[k as number].indexOf(this.parent.tic) > -1) {
                    if (isNaN(this.parent.parseFloat(argArrs[k as number].split(this.parent.tic).join(''))) ||
                        argArrs[k as number].split(this.parent.tic).join('').trim() === '') {
                        return this.parent.getErrorStrings()[CommonErrors.Value];
                    }
                }
                argArrs[k as number] = this.processLogicalCellValue(argArrs[k as number]);
                value = this.parent.getValueFromArg(argArrs[k as number].split(this.parent.tic).join(''));
                if (this.parent.getErrorStrings().indexOf(value) > -1) {
                    return value;
                }
                result += this.parent.parseFloat(value);
                length = length + 1;
            }
        }
        if (length === 0) {
            return this.parent.getErrorStrings()[CommonErrors.DivZero];
        }
        return result / length;
    }

    private processLogicalCellValue(cellValue: string): string {
        let value: string = cellValue;
        if (value.toUpperCase() === this.parent.trueValue) {
            value = '1';
        } else if (value.toUpperCase() === this.parent.falseValue) {
            value = '0';
        }
        return value;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {number | string} - Compute the count if.
     */
    public ComputeSORT(...args: string[]): number | string {
        let nestedFormula: boolean; let isStringVal: boolean;
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        const argArr: string[] = args; let result: string | number;
        const values: string[] = [];
        if (isNullOrUndefined(args) || args[0] === '' || argArr.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        argArr[1] = argArr[1] ? argArr[1] : '1';
        argArr[2] = argArr[2] ? argArr[2] : '1'; // 1 = Ascending, -1 = Descending. Default is ascending order.
        argArr[3] = argArr[3] ? argArr[3] : 'FALSE'; // Default is FALSE = sort by column or row
        argArr[0] = argArr[0].split('$').join('');
        let cellCollection: string | string[]; const valueCollection: string[] = [];
        if (argArr[0].indexOf(':') > -1) {
            const rangeSplit: string[] = argArr[0].split(':');
            if (this.parent.isCellReference(rangeSplit[0]) && this.parent.isCellReference(rangeSplit[1])) {
                const j: number = argArr[0].indexOf(':'); let swap: number;
                let rowIdx: number = this.parent.rowIndex(this.parent.substring(argArr[0], 0, j));
                let colIdx: number = this.parent.colIndex(this.parent.substring(argArr[0], 0, j));
                let eRowIdx: number = this.parent.rowIndex(this.parent.substring(argArr[0], j + 1, j + argArr[0].length - j - 1));
                let eColIdx: number = this.parent.colIndex(this.parent.substring(argArr[0], j + 1, j + argArr[0].length - j - 1));
                if (rowIdx > eRowIdx) {
                    swap = eRowIdx; eRowIdx = rowIdx; rowIdx = swap;
                }
                if (colIdx > eColIdx) {
                    swap = eColIdx; eColIdx = colIdx; colIdx = swap;
                }
                if (this.parent.isCellReference(argArr[3])) {
                    argArr[3] = this.parent.getValueFromArg(argArr[3]).toUpperCase();
                    if (argArr[3] !== this.parent.trueValue && argArr[3] !== this.parent.falseValue) {
                        if (isNumber(argArr[3])) {
                            argArr[3] = Number(argArr[3]) === 0 ? this.parent.falseValue : this.parent.trueValue;
                        } else if (argArr[3] === '') {
                            argArr[3] = this.parent.falseValue;
                        } else {
                            return this.parent.getErrorStrings()[CommonErrors.Value];
                        }
                    }
                } else {
                    isStringVal = argArr[3].startsWith(this.parent.tic) && argArr[3].endsWith(this.parent.tic);
                    argArr[3] = this.parent.getValueFromArg(argArr[3]);
                    argArr[3] = isNumber(argArr[3]) ? (Number(argArr[3]) === 0 ? this.parent.falseValue : this.parent.trueValue) :
                        argArr[3].split(this.parent.tic).join('').toUpperCase();
                    if (argArr[3] !== this.parent.trueValue && argArr[3] !== this.parent.falseValue) {
                        return this.parent.getErrorStrings()[isStringVal ? CommonErrors.Value : CommonErrors.Name];
                    }
                }
                if (this.parent.isCellReference(argArr[2])) {
                    argArr[2] = this.parent.getValueFromArg(argArr[2]);
                    argArr[2] = argArr[2] === this.parent.trueValue ? '1' : argArr[2];
                } else {
                    argArr[2] = this.parent.getValueFromArg(argArr[2]);
                    argArr[2] = argArr[2] === this.parent.trueValue ? '1' : argArr[2].split(this.parent.tic).join('');
                }
                argArr[2] = isNumber(argArr[2]) ? Math.floor(Number(argArr[2])).toString() : argArr[2];
                if (argArr[2] !== '1' && argArr[2] !== '-1') {
                    return this.parent.getErrorStrings().indexOf(argArr[2]) > -1 ? this.parent.getErrorStrings()[CommonErrors.Name] :
                        this.parent.getErrorStrings()[CommonErrors.Value];
                }
                const order: string = argArr[2] === '1' ? 'Ascending' : 'Descending';
                if (this.parent.isCellReference(argArr[1])) {
                    argArr[1] = this.parent.getValueFromArg(argArr[1]);
                    argArr[1] = isNumber(argArr[1]) ? Math.floor(Number(argArr[1])).toString() : (argArr[1] === this.parent.trueValue ? '1'
                        : (argArr[1] === this.parent.falseValue ? '0' : argArr[1]));
                    if (!isNaN(this.parseDouble(argArr[1])) ? (this.parseDouble(argArr[1]) < 1 || (argArr[3] === this.parent.trueValue ?
                        (eRowIdx - rowIdx) + 1 < this.parseDouble(argArr[1]) : (eColIdx - colIdx) + 1 < this.parseDouble(argArr[1])))
                        : true) {
                        return this.parent.getErrorStrings()[CommonErrors.Value];
                    }
                } else {
                    isStringVal = argArr[1].startsWith(this.parent.tic) && argArr[1].endsWith(this.parent.tic);
                    argArr[1] = this.parent.getValueFromArg(argArr[1]);
                    argArr[1] = isNumber(argArr[1]) ? Math.floor(Number(argArr[1])).toString() : (argArr[1] === this.parent.trueValue ?
                        '1' : (argArr[1] === this.parent.falseValue ? '0' : argArr[1].split(this.parent.tic).join('')));
                    if (!isNaN(this.parseDouble(argArr[1])) ? (this.parseDouble(argArr[1]) < 1 || (argArr[3] === this.parent.trueValue ?
                        (eRowIdx - rowIdx) + 1 < this.parseDouble(argArr[1]) : (eColIdx - colIdx) + 1 < this.parseDouble(argArr[1])))
                        : isStringVal) {
                        return this.parent.getErrorStrings()[CommonErrors.Value];
                    }
                }
                let sheetIdx: string | number = '';
                if (argArr[0].indexOf('!') === 0) {
                    sheetIdx = argArr[0]; sheetIdx = sheetIdx.replace('!', ''); sheetIdx = sheetIdx.indexOf('!');
                    sheetIdx = argArr[0].substring(0, sheetIdx + 2);
                }
                argArr[0] = sheetIdx + getAlphalabel(colIdx) + rowIdx + ':' + getAlphalabel(eColIdx) + eRowIdx;
                cellCollection = this.parent.getCellCollection(argArr[0]);
                for (let i: number = 0; i < cellCollection.length; i++) {
                    valueCollection.push(this.parent.getValueFromArg(cellCollection[i as number]));
                }
                const colSort: (string | number)[] = [];
                const numColl: (string | number)[] = [];
                const strColl: (string)[] = [];
                const booleanColl: (string)[] = [];
                const emptyCellColl: (string | number)[] = [];
                const totalColumn: number = eColIdx - colIdx + 1;
                const sortRangeValuesHandler: Function = (value: string): void => {
                    if (value) {
                        if (value.toUpperCase() === 'TRUE' || value.toUpperCase() === 'FALSE') {
                            booleanColl.push(value);
                            colSort.push(value);
                        } else if (isNaN(this.parseDouble(value))) {
                            strColl.push(value);
                            colSort.push(value);
                        } else {
                            numColl.push(this.parseDouble(value));
                            colSort.push(this.parseDouble(value));
                        }
                    } else if (value === '') {
                        emptyCellColl.push(this.parseDouble(value).toString());
                        colSort.push(this.parseDouble(value).toString());
                    }
                };
                if (argArr[3] === 'TRUE') {
                    for (let i: number = 0; i < totalColumn; i++) {
                        sortRangeValuesHandler(valueCollection[i + ((this.parseDouble(argArr[1]) - 1) * totalColumn)]);
                    }
                }
                if (argArr[3] === 'FALSE') {
                    for (let i: number = 0; i < valueCollection.length; i++) {
                        sortRangeValuesHandler(valueCollection[i * totalColumn + this.parseDouble(argArr[1]) - 1]);
                    }
                }
                const sortedNumColl: object[] = numColl.length > 0 ? DataUtil.sort(numColl, null, DataUtil.fnSort(order)) : [];
                const sortedStrColl: object[] = strColl.length > 0 ? DataUtil.sort(strColl, null, DataUtil.fnSort(order)) : [];
                const sortedBooleanColl: object[] = booleanColl.length > 0 ? DataUtil.sort(booleanColl, null, DataUtil.fnSort(order)) : [];
                const sortedVal: object[] = order === 'Ascending' ? sortedNumColl.concat(sortedStrColl, sortedBooleanColl, emptyCellColl) : sortedBooleanColl.concat(sortedStrColl, sortedNumColl, emptyCellColl);
                const id: number[] = [];
                for (let a: number = 0; a < sortedVal.length; a++) {
                    for (let b: number = 0; b < colSort.length; b++) {
                        if (JSON.stringify(sortedVal[a as number]) === JSON.stringify(colSort[b as number])) {
                            if (id.indexOf(b) === - 1) { id.push(b); }
                        }
                    }
                }
                if (argArr[3] === 'TRUE') {
                    for (let startRow: number = rowIdx, rowInc: number = 0; startRow <= eRowIdx; startRow++, rowInc++) {
                        for (let a: number = 0, colInc: number = 0; a < id.length; a++, colInc++) {
                            let cellValue: string = this.parent.getValueFromArg(
                                sheetIdx + getAlphalabel(id[a as number] + colIdx) + startRow);
                            if (nestedFormula && cellValue !== '') {
                                values.push(cellValue);
                                continue;
                            }
                            cellValue = cellValue === '' ? '0' : cellValue;
                            let activeCell: string = this.parent.cell;
                            if (activeCell) {
                                activeCell = activeCell.indexOf('!') > - 1 ? activeCell.substring(activeCell.lastIndexOf('!') + 1) :
                                    activeCell;
                                const actRowIdx: number = this.parent.rowIndex(activeCell);
                                const actColIdx: number = this.parent.colIndex(activeCell);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (this.parent.parentObject as any).setValueRowCol(this.parent.getSheetID(this.parent.grid) + 1,
                                                                                 cellValue, actRowIdx + rowInc, actColIdx + colInc);
                            }
                        }
                    }
                    result = this.parent.getValueFromArg(sheetIdx + getAlphalabel(id[0] + colIdx) + rowIdx);
                }
                if (argArr[3] === 'FALSE') {
                    for (let a: number = 0, rowInc: number = 0; a < id.length; a++, rowInc++) {
                        for (let startCol: number = colIdx, colInc: number = 0; startCol <= eColIdx; startCol++, colInc++) {
                            let value: string = this.parent.getValueFromArg(
                                sheetIdx + getAlphalabel(startCol) + (id[a as number] + rowIdx));
                            if (nestedFormula && value !== '') {
                                values.push(value);
                                continue;
                            }
                            value = value === '' ? '0' : value;
                            let activeCell: string = this.parent.cell;
                            if (activeCell) {
                                activeCell = activeCell.indexOf('!') > - 1 ? activeCell.substring(activeCell.lastIndexOf('!') + 1) :
                                    activeCell;
                                const actColIdx: number = this.parent.colIndex(activeCell);
                                const actRowIdx: number = this.parent.rowIndex(activeCell);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (this.parent.parentObject as any).setValueRowCol(this.parent.getSheetID(this.parent.grid) + 1,
                                                                                 value, actRowIdx + rowInc, actColIdx + colInc);
                            }
                        }
                    }
                    result = this.parent.getValueFromArg(sheetIdx + getAlphalabel(colIdx) + (id[0] + rowIdx));
                }
            }
        }
        if (nestedFormula) {
            return values.join(',');
        }
        return result === '' ? '0' : result;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {number | string} - Compute the count if.
     */
    public ComputeCOUNTIF(...args: string[]): number | string {
        const argArr: string[] = args;
        if (isNullOrUndefined(args) || args[0] === '' || argArr.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (argArr[0].indexOf(':') < 0 && !this.parent.isCellReference(argArr[0])) {
            return this.parent.getErrorStrings()[CommonErrors.Name];
        }
        let cellColl: string[] | string;
        let result: number = 0;
        let cellValue: string;
        const stack: string[] = [];
        let op: string = 'equal';
        if (argArr[1] === '') { return 0; }
        const isStringVal: boolean = argArr[1].startsWith(this.parent.tic) && argArr[1].endsWith(this.parent.tic);
        let condition: string = this.parent.getANDComputedValue(argArr[1]);
        const isAsterisk: boolean = condition.includes('*');
        const isAsteriskOnly: boolean = condition === '*' || condition === '<>*';
        let criteriaValue: string = isAsterisk && !isAsteriskOnly ? condition.replace(/\*/g, '').trim() : condition;
        let isCellReferenceValue: boolean = false;
        if (!isStringVal && this.parent.isCellReference(criteriaValue)) {
            criteriaValue = this.parent.getValueFromArg(criteriaValue);
            isCellReferenceValue = true;
        }
        if (isAsterisk && !isAsteriskOnly) {
            const asteriskIndex: number = condition.indexOf('*');
            if (condition[0] === '*') { criteriaValue = '*' + criteriaValue; }
            if (condition[condition.length - 1] === '*') { criteriaValue += '*'; }
            if (asteriskIndex > 0 && asteriskIndex < condition.length - 1) {
                criteriaValue = condition.substring(0, asteriskIndex) + '*' + condition.substring(asteriskIndex + 1);
            }
        }
        condition = criteriaValue;
        if (condition.startsWith('<=')) {
            op = 'lessEq';
            condition = condition.substring(2);
        } else if (condition.startsWith('>=')) {
            op = 'greaterEq';
            condition = condition.substring(2);
        } else if (condition.startsWith('<>')) {
            op = 'notEq';
            condition = condition.substring(2);
        } else if (condition.startsWith('<')) {
            op = 'less';
            condition = condition.substring(1);
        } else if (condition.startsWith('>')) {
            op = 'greater';
            condition = condition.substring(1);
        } else if (condition.startsWith('=')) {
            op = 'equal';
            condition = condition.substring(1);
        }
        const isWildCardCondition: boolean = condition.indexOf('*') > -1 || condition.indexOf('?') > -1;
        if ((!isStringVal && this.parent.isCellReference(condition) && !isCellReferenceValue) || condition.includes(this.parent.arithMarker)
            || (condition.includes(this.parent.getParseDecimalSeparator()) && !isWildCardCondition)) {
            condition = this.parent.getValueFromArg(condition);
        }
        if (this.parent.isCellReference(argArr[0])) {
            cellColl = this.parent.getCellCollection(argArr[0].split(this.parent.tic).join(''));
            for (let j: number = 0; j < cellColl.length; j++) {
                cellValue = this.parent.getValueFromArg(cellColl[j as number]);
                if (isWildCardCondition) {
                    cellValue = this.parent.findWildCardValue(condition.toLowerCase(), cellValue.toLowerCase());
                }
                stack.push(cellValue);
                stack.push(condition);
                if (this.parent.processLogical(stack, op) === this.parent.trueValue) {
                    result++;
                }
            }
        }
        return result;
    }

    /**
     * @hidden
     * @param {string[]} range - specify the range.
     * @returns {string | number} - Compute the sum if.
     */
    public ComputeSUMIFS(...range: string[]): string | number {
        const sum: string | number = this.calculateIFS(range);
        return sum;
    }

    private calculateIFS(ranges: string[], isAvgIfs?: string): string | number {
        if (isNullOrUndefined(ranges) || ranges[0] === '' || ranges.length < 2 || ranges.length > 127) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (ranges.length === 3) { // SUMIFS and AVERAGEIFS OR operation will contains only 3 arguments.
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
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {string | number} - Compute the Text.
     */
    public ComputeTEXT(...args: string[]): string | number {
        let nestedFormula: boolean;
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        const argsLength: number = args.length;
        const firstArg: string = args[0];
        const secondArg: string = args[1];
        if ( argsLength !== 2 ) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let s1: string = firstArg;
        let s2: string = secondArg;
        if (secondArg === '') {
            return this.parent.getValueFromArg(s1);
        }
        let dTime: Date | number = new Date(1900, 0, 1, 0, 0, 0);
        const checkString: string = s1 + ',' + s2;
        const intl: Internationalization = new Internationalization();
        if (this.parent.getErrorStrings().indexOf(checkString) > -1) {
            return checkString;
        }
        s1 = this.parent.getValueFromArg(s1);
        if (isNumber(s1.split(this.parent.tic).join(''))) {
            s1 = s1.split(this.parent.tic).join('');
        }
        if (secondArg.startsWith('"') && secondArg.endsWith('"')) {
            s2 = s2.split(this.parent.tic).join('');
        } else {
            s2 = this.parent.getValueFromArg(s2);
        }
        if (s2 === '') {
            return '';
        }
        if (s1 === '' && (s2.length > 0 && (s2.toUpperCase().indexOf('M') > -1 || s2.toUpperCase().indexOf('D') > -1
            || s2.toUpperCase().indexOf('Y') > -1 || s2.toUpperCase().indexOf('S') > -1 || s2.toUpperCase().indexOf('T') > -1)
            || s2.toUpperCase().indexOf('H') > -1)) {
            s1 = dTime.toString();
        }
        let d: number = this.parseDouble(s1);
        if (isNaN(d) && this.parent.isDate(new Date(s1)) !== null) {
            d = this.parent.toOADate(new Date(s1));
        }
        dTime = Date.parse(s1.split(this.parent.tic).join(''));
        if (!isNaN(d) || !isNaN(dTime)) {
            if (s2.length > 0 && s2.indexOf('#') === -1 && (s2.toUpperCase().indexOf('M') > -1 || s2.toUpperCase().indexOf('D') > -1
                || s2.toUpperCase().indexOf('Y') > -1 || s2.toUpperCase().indexOf('S') > -1 || s2.toUpperCase().indexOf('T') > -1)
                || s2.toUpperCase().indexOf('H') > -1) {
                s2 = s2.split('Y').join('y').split('D').join('d').split('H').join('h');
                s2 = s2.split('S').join('s').split('m').join('M').split('AM/PM').join('tt');
                const formatChar: string[] = s2.split('');
                let isH: boolean = false; let isMFound: boolean = false;
                let i: number = 0;
                // let mcount: number = 0;
                let lastCharIndex: number = 0; let totalCharforM: number = 0;
                for (i = 0; i < formatChar.length; ) {
                    const c: string = formatChar[i as number];
                    if (c === 's' && formatChar[lastCharIndex as number] === 'M') {
                        formatChar[lastCharIndex as number] = 'm';
                        if (formatChar[lastCharIndex - 1] === 'M') {
                            formatChar[lastCharIndex - 1] = 'm';
                        }
                    }
                    if (this.parent.isChar(c)) {
                        lastCharIndex = i;
                        if (c === 'M') {
                            // mcount++;
                            totalCharforM++;
                        }
                    } else if (totalCharforM > 1) {
                        totalCharforM++;
                    }
                    if (c === 'M' && isH) {
                        formatChar[i as number] = 'm';
                        isMFound = true;
                    }
                    if (c === 'h') {
                        isH = true;
                    } else if (this.parent.isChar(c) && c !== 'M' && c !== 'h' && !isMFound) {
                        isH = false;
                        isMFound = false;
                    }
                    i++;
                }
                s2 = String(formatChar);
                s2 = s2.split(',').join('').split('\n').join(' ');
                let dt: Date | number = this.parent.fromOADate(d);
                if (d === 0) {
                    dt = dTime;
                }
                const getSkeleton: string = getSkeletonVal(s2);
                if (getSkeleton === '') {
                    const date: number = dateToInt(dt);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const dateString: string = (this.parent.parentObject as any).getDisplayText({format : s2, value: date});
                    return dateString;
                }
                const dFormatter: Function = intl.getDateFormat({ skeleton: getSkeleton, type: 'date' });
                const formattedString: string = dFormatter(new Date(dt.toString()));
                s1 = formattedString;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                s1 = (this.parent.parentObject as any).getDisplayText({ format: s2, value: d });
            }
        }
        return nestedFormula ? this.parent.tic + s1 + this.parent.tic : s1;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {number | string} - Compute the count if.
     */
    public ComputeCOUNTIFS(...args: string[]): number | string {
        const sum: string | number = this.parent.computeCountIfsFormulas(args);
        return sum;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {number | string} - Compute the Average if.
     */
    public ComputeAVERAGEIFS(...args: string[]): number | string {
        const sum: string | number = this.calculateIFS(args, this.parent.trueValue);
        return sum;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {string | number} - Compute the Match.
     */
    public ComputeMATCH(...args: string[]): string | number {
        const argArr: string[] = [...args];
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argArr.length < 2 || argArr.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }

        // args[0] codes
        argArr[0] = this.parent.getValueFromArg(args[0]);
        let isStringValue: boolean = argArr[0].indexOf(this.parent.tic) > -1;
        argArr[0] = argArr[0].split(this.parent.tic).join('');
        if (errCollection.indexOf(argArr[0]) > -1) { return argArr[0]; }
        if (argArr[0] === '') { return errCollection[CommonErrors.NA]; }
        if (isNaN(Number(argArr[0]))) {
            isStringValue = true;
        }

        // args[2] codes
        let matchType: number;
        if (isNullOrUndefined(args[2])) {
            argArr[2] = '1';
        } else {
            argArr[2] = this.parent.getValueFromArg(argArr[2]);
            if ((argArr[2].indexOf(this.parent.tic) > -1) && isNaN(Number(argArr[2].split(this.parent.tic).join('')))) {
                return errCollection[CommonErrors.Value];
            }
            if (argArr[2].toUpperCase() === this.parent.trueValue) {
                argArr[2] = '1';
            } else if (argArr[2].toUpperCase() === this.parent.falseValue) {
                argArr[2] = '0';
            }
        }
        matchType = parseFloat(argArr[2]);
        if ([-1, 0, 1].indexOf(matchType) === -1) {
            matchType = 0;
        }

        // args[1] codes
        const valueCollection: string[] = []; let isStringCollection: boolean = false; let grid: Object = this.parent.grid;
        const curGrid: Object = this.parent.grid;
        let isWildCardVal: boolean;
        if (argArr[1].indexOf(':') > -1 || this.parent.isCellReference(argArr[1])) {
            const cellIdxs: number[] = getRangeIndexes(argArr[1]);
            const startRow: number = cellIdxs[0]; const startCol: number = cellIdxs[1];
            let endRow: number = cellIdxs[2]; let endCol: number = cellIdxs[3];
            if (startRow >= 1048576 || endRow >= 1048576 || startCol >= 16384 || endCol >= 16384) {
                return errCollection[CommonErrors.Name];
            }
            if (startRow !== endRow && startCol !== endCol) {
                return errCollection[CommonErrors.NA];
            }
            let sheetToken: string = '';
            const family: CalcSheetFamilyItem = this.parent.getSheetFamilyItem(grid);
            if (argArr[1].startsWith('!')) {
                sheetToken = argArr[1].substring(0, argArr[1].replace('!', '').indexOf('!') + 2);
                if (family.tokenToParentObject !== null) {
                    grid = family.tokenToParentObject.get(sheetToken);
                }
            } else if (family.parentObjectToToken !== null) {
                sheetToken = family.parentObjectToToken.get(grid);
            }
            const sheetId: number = this.parent.getSheetId(grid);
            const sheetInfoArgs: { action: string, sheetInfo: { visibleName: string, sheet: string, index: number }[] } = {
                action: 'getSheetInfo', sheetInfo: []
            };
            (this.parent.parentObject as { notify?: Function }).notify(workbookFormulaOperation, sheetInfoArgs);
            const getCellValue: (row: number, col: number, curCell: string) => string =
                this.parent.getCellValueFn(grid, this.parent.cell, sheetId, true);
            let j: number = 0; let cellValue: string;
            let performAction: Function; let result: number;
            if (matchType === 0) {
                isWildCardVal = argArr[0].indexOf('*') > -1 || argArr[0].indexOf('?') > -1;
                performAction = (): void => {
                    if (isWildCardVal) {
                        cellValue = this.parent.findWildCardValue(argArr[0], cellValue);
                    }
                    if (argArr[0] === cellValue) {
                        endCol = -2;
                        endRow = -2;
                        result = j + 1;
                        return;
                    }
                    j++;
                };
            } else {
                performAction = (): void => {
                    valueCollection[j as number] = cellValue;
                    j++;
                };
            }
            for (let r: number = startRow; r <= endRow; r++) {
                for (let c: number = startCol; c <= endCol; c++) {
                    cellValue = getCellValue(r + 1, c + 1, getCellAddress(r, c));
                    if (!isStringCollection && isNaN(Number(cellValue))) {
                        isStringCollection = true;
                    }
                    performAction();
                }
            }
            if (result) {
                this.parent.grid = curGrid;
                return result;
            }
            if (isStringValue !== isStringCollection) {
                this.parent.grid = curGrid;
                return errCollection[CommonErrors.NA];
            }
        } else if (!isNullOrUndefined(argArr[1]) && argArr[1].includes(this.parent.tic + this.parent.tic)) {
            const criterias: string[] = argArr[1].split(this.parent.tic + this.parent.tic);
            criterias.forEach((criteria: string) => {
                criteria = criteria.trim().split(this.parent.tic).join('');
                if (criteria) {
                    valueCollection.push(criteria);
                }
            });
        }
        let index: number = 0;
        let indexVal: string = '';
        let isIndexFound: boolean = false;
        let matchValue: string | number = !isNaN(Number(argArr[0])) ? Number(argArr[0]) : argArr[0];
        for (let i: number = 0; i < valueCollection.length; i++) {
            if (valueCollection[i as number] === '') {
                if (i === (valueCollection.length - 1)) {
                    valueCollection.pop();
                }
                continue;
            } else if (matchType === -1 && (isStringValue || isStringCollection)) {
                break;
            }
            const matchCollectionValue: string | number = !isNaN(Number(valueCollection[i as number])) ?
                Number(valueCollection[i as number]) : valueCollection[i as number];
            if (matchType === 1) {
                if (matchValue === matchCollectionValue) {
                    index = i + 1;
                    isIndexFound = true;
                    if (isNaN(Number(argArr[0]))) {
                        isStringValue = false;
                    }
                } else if ((matchValue > matchCollectionValue) && !isStringValue && !isIndexFound) {
                    if (!indexVal || (matchCollectionValue > (!isNaN(Number(indexVal)) ? Number(indexVal) : indexVal))) {
                        index = i + 1;
                        indexVal = valueCollection[i as number];
                    }
                }
            } else if (matchType === 0) {
                if (isWildCardVal) {
                    valueCollection[i as number] = this.parent.findWildCardValue(argArr[0], valueCollection[i as number]);
                }
                if (argArr[0] === valueCollection[i as number]) {
                    return i + 1;
                }
            } else if (matchType === -1) {
                if ((Number(valueCollection[i as number]) > Number(valueCollection[(i as number) + 1]))
                    || i === valueCollection.length - 1) {
                    if (matchValue === matchCollectionValue) {
                        index = i + 1;
                        matchValue = undefined;
                    } else if (matchValue < matchCollectionValue) {
                        if (!indexVal || (matchCollectionValue < (!isNaN(Number(indexVal)) ? Number(indexVal) : indexVal))) {
                            index = i + 1;
                            indexVal = valueCollection[i as number];
                        }
                    }
                } else {
                    this.parent.grid = curGrid;
                    return errCollection[CommonErrors.NA];
                }
            }
        }
        if (isStringValue && isStringCollection && matchType === 1) {
            index = valueCollection.length;
        }
        this.parent.grid = curGrid;
        return index ? index : errCollection[CommonErrors.NA];
    }

    /**
     * @hidden
     * @param {string[]} range - specify the range.
     * @returns {string | number} - Compute the lookup value.
     */
    public ComputeLOOKUP(...range: string[]): string | number {
        const argArr: string[] = range;
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return this.parent.computeLookup(argArr);
    }

    /**
     * @hidden
     * @param {string[]} range - specify the range.
     * @returns {string | number} - Compute the vlookup value.
     */
    public ComputeVLOOKUP(...range: string[]): string | number {
        const argArr: string[] = range;
        return this.parent.computeVHLookup(argArr, true);
    }

    /**
     * @hidden
     * @param {string[]} range - specify the range.
     * @returns {string | number} - Compute the hlookup value.
     */
    public ComputeHLOOKUP(...range: string[]): string | number {
        const argArr: string[] = range;
        return this.parent.computeVHLookup(argArr);
    }

    /**
     * @hidden
     * @param {string[]} argArr - specify the range.
     * @returns {string | number} - Compute the sub total value.
     */
    public ComputeSUBTOTAL(...argArr: string[]): string | number {
        let value: string | number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === ''))  {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argArr.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        value = this.parent.getValueFromArg(argArr[0]).trim();
        if (errCollection.indexOf(value) > -1) { return value; }
        if (value.split(this.parent.tic).join('').trim() === '') {
            return errCollection[CommonErrors.Value];
        }
        if (!this.parent.isCellReference(argArr[0])) {
            value = this.parent.removeTics(value);
        }
        if (value.toUpperCase() === this.parent.trueValue) {
            value = '1';
        } else if (value.toUpperCase() === this.parent.falseValue) {
            value = '0';
        } else if (value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
            value = (Number(value.split('%')[0]) / 100).toString();
        }
        value = this.parent.parseFloat(value);
        if (isNaN(value) || ((1 > value || value > 11) && (101 > value || value > 111))) {
            return errCollection[CommonErrors.Value];
        }
        const cellRef: string[] = argArr.slice(1, argArr.length);
        switch (value) {
        case 1:
        case 101:
            value = this.ComputeAVERAGE(...cellRef, 'isSubtotal');
            break;
        case 2:
        case 102:
            value = this.ComputeCOUNT(...cellRef, 'isSubtotal');
            break;
        case 3:
        case 103:
            value = this.ComputeCOUNTA(...cellRef, 'isSubtotal');
            break;
        case 4:
        case 104:
            value = this.ComputeMAX(...cellRef, 'isSubtotal');
            break;
        case 5:
        case 105:
            value = this.ComputeMIN(...cellRef, 'isSubtotal');
            break;
        case 6:
        case 106:
            value = this.ComputePRODUCT(...cellRef, 'isSubtotal');
            break;
        case 7:
        case 107:
            value = this.ComputeDAY(...cellRef);
            break;
        case 8:
        case 108:
            value = this.ComputeCONCAT(...cellRef);
            break;
        case 9:
        case 109:
            value = this.ComputeSUM(...cellRef, 'isSubtotal');
            break;
        case 10:
        case 110:
            value = this.ComputeAVERAGEA(...cellRef);
            break;
        case 11:
        case 111:
            value = this.ComputeABS(...cellRef);
            break;
        default:
            value = errCollection[CommonErrors.Value];
            break;
        }
        return value;
    }

    /**
     * @hidden
     * @param {string[]} argValue - specify the range.
     * @returns {string | number} - Compute the Radians value.
     */
    public ComputeRADIANS(...argValue: string[]): string | number {
        let value: string | number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(argValue) || (argValue[0] === '' && argValue.length === 1) ||
            (argValue[0].split('!').length === 2 && argValue[0].indexOf(this.parent.tic) === -1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argValue.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (argValue[0].indexOf(':') > -1 || argValue[0].split(this.parent.tic).join('').trim() === '' ||
            argValue[0].split(this.parent.tic).join('').trim() === '!' || argValue[0].split('!').length === 2) {
            return errCollection[CommonErrors.Value];
        }
        value = this.parent.getValueFromArg(argValue[0]).trim();
        if (errCollection.indexOf(value) > -1) { return value; }
        if ((value.indexOf(this.parent.tic) > -1 && argValue[0].indexOf(this.parent.tic) === -1) ||
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
            if (this.parent.isCellReference(argValue[0]) || argValue[0].indexOf(this.parent.tic) > -1) {
                return errCollection[CommonErrors.Value];
            } else {
                return errCollection[CommonErrors.Name];
            }
        }
        return value;
    }

    /**
     * @hidden
     * @param {string[]} args - specify the range.
     * @returns {string | number} - Compute the random between value.
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
     * @hidden
     * @param {string[]} argValue - specify the range.
     * @returns {string | number} - Compute the slope value.
     */
    public ComputeSLOPE(...argValue: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(argValue) || (argValue.length === 1 && argValue[0].trim() === ''))  {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argValue.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (argValue[0] === '' || argValue[1] === '') {
            return errCollection[CommonErrors.Value];
        }
        const cellCollection: Function = (actuaValue: string | string[]): string | string[] => {
            if (actuaValue.indexOf(this.parent.tic) === -1) {
                actuaValue = this.parent.getCellCollection((actuaValue as string).split(this.parent.tic).join(''));
            } else {
                actuaValue = undefined;
            }
            return actuaValue;
        };
        let yPoints: string | string[] = cellCollection(argValue[0].trim());
        let xPoints: string | string[] = cellCollection(argValue[1].trim());
        if (isNullOrUndefined(yPoints) || isNullOrUndefined(xPoints) || (yPoints.length < 2 && xPoints.length < 2)) {
            return errCollection[CommonErrors.DivZero];
        } else if (yPoints.length !== xPoints.length) {
            return errCollection[CommonErrors.NA];
        }
        const dataCollection: Function = (actuaValue: string | string[]): string | string[] => {
            actuaValue = this.getDataCollection(actuaValue);
            for (let b: number = 0; b < actuaValue.length; b++) {
                if (errCollection.indexOf(actuaValue[b as number]) > -1) { return actuaValue[b as number].toString(); }
            }
            return actuaValue;
        };
        yPoints = dataCollection(yPoints);
        if (errCollection.indexOf(yPoints.toString()) > -1) { return yPoints.toString(); }
        xPoints = dataCollection(xPoints);
        if (errCollection.indexOf(xPoints.toString()) > -1) { return xPoints.toString(); }
        let sumXY: number = 0; let sumX2: number = 0; let sumX: number = 0; let sumY: number = 0; let length: number = 0;
        for (let i: number = 0, len: number = xPoints.length; i < len; ++i) {
            if ((xPoints[i as number] !== '' && Number(xPoints[i as number]).toString() !== 'NaN') &&
                (yPoints[i as number] !== '' && Number(yPoints[i as number]).toString() !== 'NaN')) {
                sumXY += Number(xPoints[i as number]) * Number(yPoints[i as number]);
                sumX += Number(xPoints[i as number]);
                sumY += Number(yPoints[i as number]);
                sumX2 += Number(xPoints[i as number]) * Number(xPoints[i as number]);
                length++;
            }
        }
        const value: string = ((sumXY - (sumX * sumY) / length) / (sumX2 - (sumX * sumX) / length)).toString();
        if (value === 'NaN') {
            return errCollection[CommonErrors.DivZero];
        }
        return value;
    }

    /**
     * @hidden
     * @param {string[]} argValue - specify the range.
     * @returns {string | number} - Compute the intercept.
     */
    public ComputeINTERCEPT(...argValue: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(argValue) || (argValue.length === 1 && argValue[0].trim() === ''))  {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argValue.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (argValue[0] === '' || argValue[1] === '') {
            return errCollection[CommonErrors.Value];
        }
        const cellCollection: Function = (actuaValue: string | string[]): string | string[] => {
            if (actuaValue.indexOf(this.parent.tic) === -1) {
                actuaValue = this.parent.getCellCollection((actuaValue as string).split(this.parent.tic).join(''));
            } else {
                actuaValue = undefined;
            }
            return actuaValue;
        };
        let yValues: string | string[] = cellCollection(argValue[0].trim());
        let xValues: string | string[] = cellCollection(argValue[1].trim());
        if (isNullOrUndefined(yValues) || isNullOrUndefined(xValues) || (yValues.length < 2 && xValues.length < 2)) {
            return errCollection[CommonErrors.DivZero];
        } else if (yValues.length !== xValues.length) {
            return errCollection[CommonErrors.NA];
        }
        const dataCollection: Function = (actuaValue: string | string[]): string | string[] => {
            actuaValue = this.getDataCollection(actuaValue);
            for (let b: number = 0; b < actuaValue.length; b++) {
                if (errCollection.indexOf(actuaValue[b as number]) > -1) { return actuaValue[b as number]; }
            }
            return actuaValue;
        };
        yValues = dataCollection(yValues);
        if (errCollection.indexOf(yValues.toString()) > -1) { return yValues.toString(); }
        xValues = dataCollection(xValues);
        if (errCollection.indexOf(xValues.toString()) > -1) { return xValues.toString(); }
        let sumY: number = 0; let sumX: number = 0; let length: number = 0;
        let sumXY: number = 0; let sumX2: number = 0; let diff: number;
        const calculation: Function = (isSum: boolean): void => {
            for (let i: number = 0, len: number = xValues.length; i < len; ++i) {
                if ((yValues[i as number] !== '' && Number(yValues[i as number]).toString() !== 'NaN') &&
                    (xValues[i as number] !== '' && Number(xValues[i as number]).toString() !== 'NaN')) {
                    if (isSum) {
                        sumY += Number(yValues[i as number]);
                        sumX += Number(xValues[i as number]);
                        length++;
                    } else {
                        diff = Number(xValues[i as number]) - sumX;
                        sumXY += diff * (Number(yValues[i as number]) - sumY);
                        sumX2 += diff * diff;
                    }
                }
            }
        };
        calculation(true);
        sumY = sumY / length; sumX = sumX / length;
        calculation(false);
        const value: string = (sumY - sumXY / sumX2 * sumX).toString();
        if (value === 'NaN') {
            return errCollection[CommonErrors.DivZero];
        }
        return value;
    }

    /**
     * @hidden
     * @param {string[]} logValue - specify the log value.
     * @returns {string | number} - Compute the value.
     */
    public ComputeLN(...logValue: string[]): string | number {
        let cellvalue: string | number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(logValue) || (logValue[0] === '' && logValue.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (logValue.length === 0 || logValue.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        cellvalue = this.parent.getValueFromArg(logValue[0]);
        if (errCollection.indexOf(cellvalue) > -1) {
            return cellvalue;
        }
        if (cellvalue.toUpperCase() === this.parent.trueValue) {
            cellvalue = '1';
        } else if (cellvalue.toUpperCase() === this.parent.falseValue) {
            cellvalue = '0';
        }
        if (!this.parent.isCellReference(logValue[0])) {
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
     * @hidden
     * @param {string[]} logValue - specify the log value.
     * @returns {boolean | string} - Compute the Isnumber value.
     */
    public ComputeISNUMBER(...logValue: string[]): boolean | string {
        const argArr: string[] = logValue;
        let isNestedFormula: boolean;
        if (argArr && argArr[argArr.length - 1] === 'nestedFormulaTrue') {
            isNestedFormula = true;
            argArr.pop();
        }
        if (logValue.length === 1 && logValue[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (logValue.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const orgValue: number | string = (this.parent.isCellReference(argArr[0])) ? this.parent.getValueFromArg(argArr[0]) :
            this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join(''));
        if (orgValue.toString() === '' || logValue.toString().startsWith(this.parent.tic)) { return isNestedFormula ? '0' : false; }
        const isLogVal: boolean = !isNaN(this.parent.parseFloat(orgValue));
        return isNestedFormula ? (isLogVal ? '1' : '0') : isLogVal;
    }

    /**
     * @hidden
     * @param {string[]} logValue - specify the log value.
     * @returns {number | string} - Compute the round value.
     */
    public ComputeROUND(...logValue: string[]): number | string {
        if (!logValue.length || logValue.length === 1 || logValue.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArr: string[] = logValue;
        if (logValue.length === 1) {
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
     * @hidden
     * @param {string[]} argArr - specify the log value.
     * @returns {boolean | string} - Compute the power value.
     */
    public ComputePOWER(...argArr: string[]): boolean | string {
        let power: string | number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0].trim() === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argArr.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (argArr[0].trim() === '' && argArr[1].trim() === '') {
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
        const numValue: string | number = processArgs(argArr[0]);
        if (errCollection.indexOf(numValue as string) > -1) { return numValue as string; }
        const powValue: string | number = processArgs(argArr[1]);
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
     * @hidden
     * @param {string[]} args - specify the args.
     * @returns {number | string} - Computes a positive square root of the given number.
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
        if (this.parent.parseFloat(sqrtValue) < 0) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        } else if (isNaN(this.parent.parseFloat(sqrtValue))) {
            const dateTimeCheck: DateFormatCheckArgs = { value: sqrtValue };
            (<{ notify: Function }>this.parent.parentObject).notify(checkDateFormat, dateTimeCheck);
            if (dateTimeCheck.isDate || dateTimeCheck.isTime) {
                sqrtValue = dateTimeCheck.updatedVal;
            } else {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        return Math.sqrt(this.parent.parseFloat(sqrtValue));
    }

    /**
     * @hidden
     * @param {string[]} logValue - specify the log value.
     * @returns {number | string} - Compute the log value.
     */
    public ComputeLOG(...logValue: string[]): number | string {
        let orgNumValue: number | string;
        let orgBaseValue: number | string;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(logValue) || (logValue.length === 1 && logValue[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (logValue.length > 2) {
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
        if (!isNullOrUndefined(logValue[0])) {
            orgNumValue = processArgs(logValue[0]) as string;
            if (errCollection.indexOf(orgNumValue) > -1) {
                return orgNumValue;
            }
            orgNumValue = this.parent.parseFloat(orgNumValue);
        }
        orgBaseValue = 10;
        if (!isNullOrUndefined(logValue[1])) {
            orgBaseValue = processArgs(logValue[1]) as string;
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
     * @hidden
     * @param {string[]} logValue - specify the log value.
     * @returns {boolean | string} - Compute the trunc value.
     */
    public ComputeTRUNC(...logValue: string[]): boolean | string {
        let orgNumValue: number | string;
        let orgDigitValue: number | string = 0;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(logValue) || (logValue[0] === '' && logValue.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (logValue.length === 0 || logValue.length > 2) {
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
        if (!isNullOrUndefined(logValue[0])) {
            orgNumValue = processArgs(logValue[0]) as string;
            if (errCollection.indexOf(orgNumValue) > -1) { return orgNumValue; }
            orgNumValue = this.parent.parseFloat(orgNumValue);
            if (isNaN(orgNumValue)) {
                return errCollection[CommonErrors.Value];
            }
        }
        if (!isNullOrUndefined(logValue[1])) {
            orgDigitValue = processArgs(logValue[1]) as string;
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
     * @hidden
     * @param {string[]} logValue - specify the log value.
     * @returns {boolean | string} - Compute the expression.
     */
    public ComputeEXP(...logValue: string[]): boolean | string {
        let orgNumValue: number | string;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (logValue[0] === '' && logValue.length === 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (logValue.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (logValue[0].split(this.parent.tic).join('').trim() === '') {
            return errCollection[CommonErrors.Value];
        }
        orgNumValue = this.parent.getValueFromArg(logValue[0]);
        if (errCollection.indexOf(orgNumValue) > -1) { return orgNumValue; }
        if (orgNumValue.indexOf(this.parent.tic) > -1 && (this.parent.isCellReference(logValue[0]) ||
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
    /**
     * @hidden
     * @param {string[]} logValue - specify the log value
     * @returns {boolean | string} - compute the value.
     */
    public ComputeGEOMEAN(...logValue: string[]): boolean | string {
        const argArr: string[] = logValue;
        let sum: number | string = 1;
        let count: number | string = 0;
        let cellVal: number | string = 0;
        let cellStr: number | string = 0;
        let dev: number | string;
        let r: number;
        let s: number;
        let cell: string[] | string;
        if (logValue.length === 0) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (argArr.length === 1 && argArr[0] === '') {
            return sum.toString();
        }
        let isBoolean: boolean;
        for (r = 0; r < argArr.length; r++) {
            if (argArr[r as number].indexOf(':') > -1) {
                if (argArr[0] === this.parent.tic) {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
                cell = this.parent.getCellCollection(argArr[r as number].split(this.parent.tic).join(''));
                for (s = 0; s < cell.length; s++) {
                    cellVal = this.parent.getValueFromArg(cell[s as number]);
                    cellStr = cellVal.split(this.parent.tic).join('');
                    isBoolean = cellStr === this.parent.trueValue || cellStr === this.parent.falseValue;
                    dev = this.parent.parseFloat(cellVal);
                    if (dev <= 0) {
                        return this.parent.getErrorStrings()[CommonErrors.Num];
                    }
                    if (isBoolean || this.parent.getErrorStrings().indexOf(cellVal) > -1) {
                        continue;
                    } else if (!isNaN(dev)) {
                        count++;
                        sum = sum * dev;
                    }
                }
            } else {
                cellVal = this.parent.getValueFromArg(argArr[r as number]);
                if (this.parent.getErrorStrings().indexOf(cellVal) > -1) {
                    return cellVal;
                }
                const cellStr: string = cellVal.split(this.parent.tic).join('');
                if (cellVal.indexOf('"') > -1 && isNaN(this.parent.parseFloat(cellStr))) {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
                argArr[r as number] = argArr[r as number].startsWith('n') ? argArr[r as number].slice(1) : argArr[r as number];
                if ((cellVal === '' && argArr[r as number] === '')) {
                    return this.parent.getErrorStrings()[CommonErrors.Num];
                }
                if ((cellStr === 'TRUE' || cellStr === 'FALSE') && this.parent.isCellReference(argArr[r as number])) {
                    continue;
                }
                if (cellVal.length > 0) {
                    cellVal = cellVal.indexOf('"') > -1 ? cellStr : cellVal;
                    cellVal = (cellVal.split(this.parent.tic).join('') === 'TRUE') ? '1' :
                        (cellVal.split(this.parent.tic).join('') === 'FALSE') ? '0' : cellVal;
                    if (!this.parent.isCellReference(argArr[r as number])) {
                        if (isNaN(this.parent.parseFloat(cellVal))) {
                            return this.parent.getErrorStrings()[CommonErrors.Value];
                        }
                    }
                    dev = this.parent.parseFloat(cellVal);
                    if (dev <= 0) {
                        return this.parent.getErrorStrings()[CommonErrors.Num];
                    } else if (!isNaN(dev)) {
                        count++;
                        sum = sum * dev;
                    }
                }
            }
        }
        if (count > 0) {
            sum = Math.pow(sum, 1 / count);
        }
        return sum.toString();
    }

    /**
     * @hidden
     * @param {string[]} range - specify the args.
     * @returns {number | string} - Returns the square of the Pearson product moment correlation coefficient based on data points in known_y's and known_x's.
     */
    public ComputeRSQ(...range: string[]): string | number {
        let validCount: number = 0;
        const argArr: string[] = range;
        if (argArr.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (argArr[0] === '' || argArr[1] === '') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        if (argArr[0].includes('"') || argArr[1].includes('"')){
            return this.parent.getErrorStrings()[CommonErrors.NA];
        }
        if ((argArr[0].indexOf(':') === -1 && isCellReference(argArr[0])) && (argArr[1].indexOf(':') === -1 && isCellReference(argArr[1]))) {
            return this.parent.getErrorStrings()[CommonErrors.DivZero];
        }
        const yValuesRange: string | string[] = this.parent.getCellCollection(argArr[0]);
        const xValuesRange: string | string[] = this.parent.getCellCollection(argArr[1]);
        if ((yValuesRange.length !== xValuesRange.length)) {
            return this.parent.getErrorStrings()[CommonErrors.NA];
        }
        const xValues: string[] = this.getDataCollection(xValuesRange);
        for (let a: number = 0; a < xValues.length; a++) {
            if (this.parent.getErrorStrings().indexOf(xValues[a as number]) > -1) { return xValues[a as number]; }
        }
        const yValues: string[] = this.getDataCollection(yValuesRange);
        for (let b: number = 0; b < yValues.length; b++) {
            if (this.parent.getErrorStrings().indexOf(yValues[b as number]) > -1) { return yValues[b as number]; }
        }
        let xValue: number; let yValue: number;
        for (let i: number = 0; i < xValues.length; i++) {
            xValue = Number(xValues[i as number]);
            yValue = Number(yValues[i as number]);
            if (isNumber(xValue) && isNumber(yValue)) {
                validCount++;
            }
        }
        if (validCount <= 1) {
            return this.parent.getErrorStrings()[CommonErrors.DivZero];
        }
        if (validCount === 2) {
            return 1;
        }
        const meanArray: number[] = this.getMeanArray(xValues, yValues);
        const meanX: number = meanArray[0];
        const meanY: number = meanArray[1];
        const correlation: number = this.getCorrelation(xValues, yValues, meanX, meanY);
        return correlation ** 2;
    }

    /**
     * @hidden
     * @param {string[]} xValues - specify the x values
     * @param {string[]} yValues - specify the y values
     * @param {number} meanX - specify the mean of x values
     * @param {number} meanY - specify the mean of y values
     * @returns {number} - Returns correlation value
     */
    private getCorrelation(xValues: string[], yValues: string[], meanX: number, meanY: number): number {
        let numerator: number = 0;
        let denominatorX: number = 0;
        let denominatorY: number = 0;
        let diffY: number; let diffX: number;
        for (let i: number = 0; i < xValues.length; i++) {
            if (isNumber(xValues[i as number]) && isNumber(yValues[i as number])){
                diffX = Number(xValues[i as number]) - meanX;
                diffY = Number(yValues[i as number]) - meanY;
                numerator += diffX * diffY;
                denominatorX += diffX ** 2;
                denominatorY += diffY ** 2;
            }
        }
        const correlation: number = numerator / Math.sqrt(denominatorX * denominatorY);
        return correlation;
    }

    /**
     * @hidden
     * @param {string[]} xValues - specify the x values
     * @param {string[]} yValues - specify the y values
     * @returns {number[]} meanX - returns array of mean values of x and y values
     */
    private getMeanArray(xValues: string[], yValues: string[]): number[] {
        let count: number = 0;
        let sumX: number = 0;
        let sumY: number = 0;
        let meanX: number = 0;
        let meanY: number = 0;
        for (let i: number = 0; i < xValues.length; i++) {
            if (isNumber(xValues[i as number]) && isNumber(yValues[i as number])){
                sumX += Number(xValues[i as number]);
                sumY += Number(yValues[i as number]);
                count++;
            }
        }
        meanX = sumX / count;
        meanY = sumY / count;
        return [meanX, meanY];
    }

    private getDataCollection(cells: string[] | string): string[] {
        const cellsData: string[] = [];
        for (let i: number = 0, len: number = cells.length; i < len; i++) {
            cellsData.push(this.parent.getValueFromArg(cells[i as number]));
        }
        return cellsData;
    }
    /**
     * @hidden
     * @param {string} value - specify the value
     * @returns {number} - Returns parse double value.
     */
    private parseDouble(value: string): number {
        const val: number = this.parent.parseFloat(value.toString());
        return !isNaN(val) ? val : NaN;
    }
    /**
     * @hidden
     * @param {string} value - specify the value
     * @returns {string} - Returns spreadsheet display text.
     */
    private spreadsheetDisplayText(value: string): string {
        // eslint-disable-next-line
        if (this.parent.parentObject && (this.parent.parentObject as any).element && (this.parent.parentObject as any).element.classList.contains('e-spreadsheet') && this.parent.isCellReference(value)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const indexes: { startIdx: number, endIdx: number, isCol: boolean } = (this.parent.parentObject as any).getIndexes(value);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value = (this.parent.parentObject as any).getDisplayText((this.parent.parentObject as any).
                getActiveSheet().rows[indexes.startIdx].cells[indexes.endIdx]);
        }
        return value;
    }

    /**
     * @hidden
     * @param {string} value - specify the value
     * @returns {string} - Returns spreadsheet format.
     */
    private spreadsheetFormat(value: string): string {
        // eslint-disable-next-line
        if (this.parent.parentObject && (this.parent.parentObject as any).element && (this.parent.parentObject as any).element.classList.contains('e-spreadsheet') && this.parent.isCellReference(value)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const index: { startIdx: number, endIdx: number, isCol: boolean } = (this.parent.parentObject as any).getIndexes(value);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value = (this.parent.parentObject as any).getActiveSheet().rows[index.startIdx].cells[index.endIdx].format;
        }
        return value;
    }
}
