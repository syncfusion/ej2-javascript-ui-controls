import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { Calculate } from '../base/index';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

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
        { formulaName: 'DAYS', category: 'Date', description: 'Returns the number of days between two dates.' },
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
            formulaName: 'LN', category: 'Math & Trig', description: 'Returns the natural logarithm of a number.'
        },
    ];
    private isConcat: boolean = false;
    constructor(parent?: Calculate) {
        this.parent = parent;
        this.init();
    }

    private init(): void {
        let fn: Function;
        for (let i: number = 0; i < this.formulas.length; i++) {
            fn = getValue('Compute' + this.formulas[i].formulaName, this).bind(this);
            this.addFormulaCollection
                (this.formulas[i].formulaName.toUpperCase(), fn, this.formulas[i].category, this.formulas[i].description);
        }
    }

    private addFormulaCollection(
        formulaName: string, functionName: Function, formulaCategory: string, description: string): void {
        this.parent.libraryFormulas = {
            fName: formulaName, handler: functionName as Function, category: formulaCategory,
            description: description
        };
    }

    /** @hidden */
    public ComputeSUM(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let sum: number = 0;
        let val: string;
        let orgValue: number | string;
        if (!isNullOrUndefined(args)) {
            let argArr: string[] = args;
            for (let i: number = 0; i < argArr.length; i++) {
                let argValue: string = argArr[i].toString();
                if (argValue.indexOf(':') > -1 && this.parent.isCellReference(argValue)) {
                    let cellCollection: string[] | string = this.parent.getCellCollection(argValue.split(this.parent.tic).join(''));
                    for (let j: number = 0; j < cellCollection.length; j++) {
                        val = this.parent.getValueFromArg(cellCollection[j]);
                        if (this.parent.getErrorStrings().indexOf(val) > -1) {
                            return val;
                        }
                        if (isNullOrUndefined(val[0]) || isNaN(this.parent.parseFloat(val))) {
                            continue;
                        }
                        sum = sum + this.parent.parseFloat(val);
                    }
                } else {
                    if (argArr[i].split(this.parent.tic).join('') === this.parent.trueValue) {
                        argArr[i] = '1';
                    }
                    if (argArr[i].split(this.parent.tic).join('') === this.parent.falseValue) {
                        argArr[i] = '0';
                    }
                    orgValue = this.parent.getValueFromArg(argArr[i].split(this.parent.tic).join(''));
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) {
                        return orgValue;
                    }
                    if (isNullOrUndefined(orgValue) || isNaN(this.parent.parseFloat(orgValue))) {
                        continue;
                    }
                    if (orgValue.length > 0) {
                        sum = sum + this.parent.parseFloat(orgValue + '');
                    }
                }
            }
        }
        return sum;
    }

    /** @hidden */
    public ComputeCOUNT(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArr: string[] = args;
        let argVal: string | number;
        let cellColl: string[] | string;
        let result: number = 0;
        let cellValue: string;
        for (let i: number = 0; i < argArr.length; i++) {
            argVal = argArr[i];
            if (argVal.indexOf(':') > -1 && this.parent.isCellReference(argVal)) {
                cellColl = this.parent.getCellCollection(argVal.split(this.parent.tic).join(''));
                for (let j: number = 0; j < cellColl.length; j++) {
                    cellValue = this.parent.getValueFromArg(cellColl[j]);
                    if (!isNaN(this.parent.parseFloat(cellValue))) {
                        if (argVal.length > 0 && argVal !== '' && argVal !== ' ') {
                            result++;
                        }
                    }
                }
            } else {
                argVal = argVal.split(this.parent.tic).join('');
                if (!isNaN(this.parent.parseFloat(this.parent.getValueFromArg(argVal)))) {
                    if (argVal.length > 0 && argVal !== '' && argVal !== ' ') {
                        result++;
                    }
                }
            }
        }
        return result;
    }

    /** @hidden */
    public ComputeDATE(...args: string[]): Date | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArr: string[] = args;
        if (argArr.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (let i: number = 0; i < argArr.length; ++i) {
            argArr[i] = this.parent.getValueFromArg(argArr[i]);
        }
        /* tslint:disable */
        argArr[0] = (argArr[0].split(this.parent.tic).join('') === 'TRUE') ? '1' : (argArr[0].split(this.parent.tic).join('') === 'FALSE') ? '0' : argArr[0];
        argArr[1] = (argArr[1].split(this.parent.tic).join('') === 'TRUE') ? '1' : (argArr[1].split(this.parent.tic).join('') === 'FALSE') ? '0' : argArr[1];
        argArr[2] = (argArr[2].split(this.parent.tic).join('') === 'TRUE') ? '1' : (argArr[2].split(this.parent.tic).join('') === 'FALSE') ? '0' : argArr[2];
        /* tslint:enable */
        let year: number = this.parent.parseFloat(argArr[0].split(this.parent.tic).join(''));
        let month: number = this.parent.parseFloat(argArr[1].split(this.parent.tic).join(''));
        let day: number = this.parent.parseFloat(argArr[2].split(this.parent.tic).join(''));
        let days: number = 0;
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            if (year < 0) {
                return this.parent.getErrorStrings()[CommonErrors.num].toString();
            }
            while (month > 12) {
                month -= 12;
                year++;
            }
            days = this.parent.getSerialDateFromDate(year, month, day);
        } else {
            return this.parent.getErrorStrings()[CommonErrors.value].toString();
        }
        if (days === 0) {
            return this.parent.getErrorStrings()[CommonErrors.num].toString();
        }
        let date: Date = this.parent.fromOADate(days);
        if (date.toString() !== 'Invalid Date') {
            /* tslint:disable-next-line */
            return date.getFullYear() + '/' + this.parent.calculateDate((date.getMonth() + 1).toString()) + '/' + this.parent.calculateDate(date.getDate().toString());
        }
        return days.toString();
    }

    /** @hidden */
    public ComputeFLOOR(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let argArr: string[] = args;
        let argCount: number = argArr.length;
        let splitArg: string = argArr[1].split(this.parent.tic).join('');
        let argValue: number[] = [];
        let fnum: number;
        let significance: number;
        if (argCount !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        argValue.push(fnum = this.parent.parseFloat(this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join(''))));
        argArr[1] = (splitArg === this.parent.trueValue) ? '1' : (splitArg === this.parent.falseValue) ? '0' : argArr[1];
        argValue.push(significance = this.parent.parseFloat(this.parent.getValueFromArg(argArr[1].split(this.parent.tic).join(''))));
        if (fnum > 0 && significance < 0) {
            return this.parent.getErrorStrings()[CommonErrors.num];
        }
        if (fnum > 0 && significance === 0) {
            return this.parent.getErrorStrings()[CommonErrors.divzero];
        }
        for (let i: number = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        if (isNaN(fnum)) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        return Math.floor(fnum / significance) * significance;
    }

    /** @hidden */
    public ComputeCEILING(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let argArr: string[] = args;
        let orgValue: number[] = [];
        let argCount: number = argArr.length;
        let splitArg: string = argArr[1].split(this.parent.tic).join('');
        let cnum: number;
        let significance: number;
        if (argCount !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        orgValue.push(cnum = this.parent.parseFloat(this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join(''))));
        argArr[1] = (splitArg === this.parent.trueValue) ? '1' : (splitArg === this.parent.falseValue) ? '0' : argArr[1];
        orgValue.push(significance = this.parent.parseFloat(this.parent.getValueFromArg(argArr[1].split(this.parent.tic).join(''))));
        if (cnum > 0 && significance < 0) {
            return this.parent.getErrorStrings()[CommonErrors.num];
        }
        for (let i: number = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        if (isNaN(cnum)) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        if (significance === 0) {
            return 0;
        }
        return Math.ceil(cnum / significance) * significance;
    }

    /** @hidden */
    public ComputeDAY(...serialNumber: string[]): number | string {
        let date: string[] = serialNumber;
        let result: number | string;
        if (isNullOrUndefined(date) || (date.length === 1 && date[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (date.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let dateVal: string = this.parent.getValueFromArg(date[0].split(this.parent.tic).join(''));
        if (!isNaN(this.parent.parseFloat(dateVal))) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        } else {
            dateVal = dateVal;
        }
        result = this.parent.parseDate(dateVal);
        if (Object.prototype.toString.call(result) === '[object Date]') {
            /* tslint:disable-next-line */
            result = (result as any).getDate();
        }
        return result;
    }

    /** @hidden */
    public ComputeIF(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (this.parent.getErrorStrings().indexOf(args[0]) > 0) {
            return args[0];
        }
        let argArr: string[] = args;
        let condition: string;
        let result: string;
        if (argArr.length > 3 || argArr.length === 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        } else if (argArr.length <= 3) {
            condition = this.parent.getValueFromArg(argArr[0]);
            if (this.parent.getErrorStrings().indexOf(condition) > -1) {
                return condition;
            }
            if (condition === this.parent.trueValue || this.parent.parseFloat(condition) > 0 || this.parent.parseFloat(condition) < 0) {
                result = this.parent.getValueFromArg(argArr[1]);
            } else if (condition === this.parent.falseValue || this.parent.parseFloat(condition) === 0) {
                if (isNullOrUndefined(argArr[2])) {
                    return this.parent.falseValue;
                }
                result = this.parent.getValueFromArg(argArr[2]);
            } else {
                return this.parent.formulaErrorStrings[FormulasErrorsStrings.requires_3_args];
            }
        }
        if (result.indexOf(this.parent.tic) > -1) {
            return result.split(this.parent.tic).join('');
        } else {
            return result;
        }
    }

    /** @hidden */
    public ComputeIFERROR(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let argArr: string[] = args;
        let condition: string;
        if (argArr.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        condition = this.parent.getValueFromArg(argArr[0]);
        if (condition === this.parent.trueValue || condition === this.parent.falseValue) {
            return condition;
        }
        if (condition[0] === this.parent.arithMarker) {
            condition = condition.replace(this.parent.arithMarker, ' ');
        }
        condition = this.parent.getValueFromArg(condition).toUpperCase().split(this.parent.tic).join('');
        if (condition[0] === '#' || condition.indexOf('Infinity') > -1 || this.parent.getErrorStrings().indexOf(condition) > -1) {
            return this.parent.getValueFromArg(argArr[1]).split(this.parent.tic).join('');
        } else {
            return condition;
        }
    }

    /** @hidden */
    public ComputePRODUCT(...range: string[]): string | number {
        if (isNullOrUndefined(range) || (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let product: number = 1;
        let val: string;
        let orgValue: string;
        let argsHit: boolean = true;
        let parseVal: number;
        if (!isNullOrUndefined(range)) {
            let argArr: string[] = range;
            for (let i: number = 0; i < argArr.length; i++) {
                let rangevalue: string = argArr[i];
                if (rangevalue.indexOf(':') > -1 && this.parent.isCellReference(rangevalue)) {
                    let cellCollection: string[] | string = this.parent.getCellCollection(rangevalue);
                    for (let j: number = 0; j < cellCollection.length; j++) {
                        val = this.parent.getValueFromArg(cellCollection[j].split(this.parent.tic).join(''));
                        if (this.parent.getErrorStrings().indexOf(val) > -1) {
                            return val;
                        }
                        val = (val.split(this.parent.tic).join('') === 'TRUE') ? '1' :
                            (val.split(this.parent.tic).join('') === 'FALSE') ? '0' : val;
                        parseVal = this.parent.parseFloat(val);
                        if (!isNaN(parseVal)) {
                            if (val.length > 0) {
                                product = product * parseVal;
                                argsHit = false;
                            }
                        }
                    }
                } else {
                    orgValue = this.parent.getValueFromArg(argArr[i].split(this.parent.tic).join(''));
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) {
                        return orgValue;
                    }
                    orgValue = (orgValue.split(this.parent.tic).join('') === 'TRUE') ? '1' :
                        (orgValue.split(this.parent.tic).join('') === 'FALSE') ? '0' : orgValue;
                    parseVal = this.parent.parseFloat(orgValue);
                    if (!isNaN(parseVal)) {
                        if (orgValue.length > 0) {
                            product = product * parseVal;
                            argsHit = false;
                        }
                    }
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) {
                        return orgValue;
                    }
                }
            }
        }
        return argsHit ? '0' : product.toString();
    }

    /** @hidden */
    public ComputeDAYS(...range: string[]): number | string {
        let result: number | string;
        if (isNullOrUndefined(range) && (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (range.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argsArr: string[] = range;
        if (argsArr[0].split(this.parent.tic).join('') === this.parent.trueValue) {
            argsArr[0] = '1';
        }
        if (argsArr[0].split(this.parent.tic).join('') === this.parent.falseValue) {
            argsArr[0] = '0';
        }
        let endDate: string = this.parent.getValueFromArg(argsArr[0].split(this.parent.tic).join(''));
        let startDate: string = this.parent.getValueFromArg(argsArr[1].split(this.parent.tic).join(''));
        startDate = (startDate === '' || startDate == null) ? new Date(Date.parse('1899-12-31')).toDateString() : startDate;
        endDate = (endDate === '' || endDate == null) ? new Date(Date.parse('1899-12-31')).toDateString() : endDate;
        if (endDate[0] === '#') {
            return endDate;
        }
        if (startDate[0] === '#') {
            return startDate;
        }
        let d1: string | Date = this.parent.parseDate(endDate);
        let d2: string | Date = this.parent.parseDate(startDate);
        if (d1.toString()[0] === '#') {
            return d1.toString();
        }
        if (d2.toString()[0] === '#') {
            return d2.toString();
        }
        if (Object.prototype.toString.call(d1) === '[object Date]' && Object.prototype.toString.call(d2) === '[object Date]') {
            /* tslint:disable-next-line */
            result = Math.ceil((d1 as any).getTime() - (d2 as any).getTime()) / (1000 * 3600 * 24);
        } else {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        return Math.round(result);
    }

    /** @hidden */
    public ComputeCHOOSE(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (args.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argsArr: string[] = args;
        if (argsArr[0].indexOf(':') > -1 && this.parent.isCellReference(argsArr[0])) {
            let cellCollection: string[] | string = this.parent.getCellCollection(argsArr[0]);
            if (cellCollection.length === 1) {
                argsArr[0] = cellCollection[0];
            } else {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        let cond: string = this.parent.getValueFromArg(argsArr[0]);
        if (this.parent.getErrorStrings().indexOf(cond) > -1) {
            return cond;
        }
        let indexNum: number = this.parent.parseFloat(this.parent.getValueFromArg(argsArr[0].split(this.parent.tic).join('')));
        if (indexNum < 1) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        indexNum = Math.floor(indexNum);
        let result: string | number;
        if (isNullOrUndefined(argsArr[indexNum])) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        result = argsArr[indexNum];
        if (result === '') {
            result = '0';
        }
        if (result.indexOf(':') > -1 && this.parent.isCellReference(result)) {
            let cellCollection: string[] | string = this.parent.getCellCollection(argsArr[0].split(this.parent.tic).join(''));
            if (cellCollection.length === 1) {
                argsArr[0] = cellCollection[0];
            } else {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        return this.parent.getValueFromArg(result).split(this.parent.tic).join('');
    }

    /** @hidden */
    public ComputeSUMIF(...range: string[]): string | number {
        let argArr: string[] = range;
        if (argArr[0].indexOf(':') < 0 && !this.parent.isCellReference(argArr[0])) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
        }
        let result: number[] | string = this.parent.computeSumIfAndAvgIf(range);
        if (typeof result === 'string' && (this.parent.formulaErrorStrings.indexOf(result)
            || this.parent.getErrorStrings().indexOf(result))) {
            return result;
        }
        return result[0];
    }

    /** @hidden */
    public ComputeABS(...absValue: string[]): string | number {
        let argArr: string[] = absValue;
        let cellvalue: string = '';
        let absVal: number;
        if (absValue.length === 0 || absValue.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        if (argArr[0].toString().split(this.parent.tic).join('').trim() === '' || argArr[0].indexOf(this.parent.tic) > -1) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        if (this.parent.isCellReference(argArr[0])) {
            cellvalue = this.parent.getValueFromArg(argArr[0]);
            if (cellvalue === '') {
                return this.parent.getErrorStrings()[CommonErrors.name];
            }
            absVal = this.parent.parseFloat(cellvalue);
            if (isNaN(absVal)) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        } else {
            absVal = this.parent.parseFloat(argArr[0]);
            if (isNaN(absVal)) {
                return this.parent.getErrorStrings()[CommonErrors.name];
            }
        }
        return Math.abs(absVal);
    }

    /** @hidden */
    public ComputeAVERAGE(...args: string[]): string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let argArr: string[] = args;
        for (let i: number = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1) {
                if (argArr[i].indexOf(this.parent.tic) > -1) {
                    return this.parent.getErrorStrings()[CommonErrors.value];
                }
            }
        }
        return this.parent.calculateAvg(argArr);
    }

    /** @hidden */
    public ComputeAVERAGEIF(...range: string[]): string | number {
        let argList: string[] = range;
        if (argList[0].indexOf(':') < 0 && !this.parent.isCellReference(argList[0])) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
        }
        let resultVal: number[] | string = this.parent.computeSumIfAndAvgIf(range);
        if (typeof resultVal === 'string' && (this.parent.formulaErrorStrings.indexOf(resultVal)
            || this.parent.getErrorStrings().indexOf(resultVal))) {
            return resultVal;
        }
        return this.parent.parseFloat(resultVal[0]) / this.parent.parseFloat(resultVal[1]);
    }

    /** @hidden */
    public ComputeCONCATENATE(...range: string[]): string {
        if (isNullOrUndefined(range) || (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let argsList: string[] = range;
        let result: string = '';
        let tempStr: string = '';
        for (let i: number = 0; i < argsList.length; i++) {
            if (argsList[i].indexOf(':') > -1 && this.parent.isCellReference(argsList[i])) {
                if (this.isConcat) {
                    let cells: string[] | string = this.parent.getCellCollection(argsList[i]);
                    for (let i: number = 0; i < cells.length; i++) {
                        tempStr = this.parent.getValueFromArg(cells[i]);
                        result = result + tempStr;
                    }
                } else {
                    return this.parent.getErrorStrings()[CommonErrors.value];
                }
            } else {
                if (argsList.length === 1 && argsList[0].indexOf(this.parent.tic) < 0) {
                    return this.parent.getErrorStrings()[CommonErrors.name];
                } else {
                    tempStr = this.parent.getValueFromArg(argsList[i]);
                    result = result + tempStr;
                }
            }

            if (this.parent.getErrorStrings().indexOf(tempStr) > -1) {
                return tempStr;
            }
        }
        return result.split(this.parent.tic).join('');
    }

    /** @hidden */
    public ComputeCONCAT(...range: string[]): string {
        this.isConcat = true;
        return this.ComputeCONCATENATE(...range);
    }

    /** @hidden */
    public ComputeMAX(...args: string[]): string {
        return this.parent.computeMinMax(args, 'max');
    }

    /** @hidden */
    public ComputeMIN(...args: string[]): string {
        return this.parent.computeMinMax(args, 'min');
    }

    /** @hidden */
    public ComputeRAND(...args: string[]): string {
        if (args.length === 1 && args[0] === '') {
            args.length = 0;
        }
        if (args.length > 0) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        return Math.random().toString();
    }

    /** @hidden */
    public ComputeAND(...args: string[]): string {
        return this.parent.computeAndOr(args, 'and');
    }

    /** @hidden */
    public ComputeOR(...args: string[]): string {
        return this.parent.computeAndOr(args, 'or');
    }

    /** @hidden */
    public ComputeFIND(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argsList: string[] = args;
        if (argsList.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let findText: string = this.parent.removeTics(this.parent.getValueFromArg(argsList[0]));
        let withinText: string = this.parent.removeTics(this.parent.getValueFromArg(argsList[1]));
        if (this.parent.getErrorStrings().indexOf(findText) > -1 || this.parent.getErrorStrings().indexOf(withinText) > -1) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        let startNum: number | string = 1;
        let loc: number;
        if (argsList.length === 3) {
            startNum = this.parent.removeTics(this.parent.getValueFromArg(argsList[2]));
            if (this.parent.getErrorStrings().indexOf(startNum) > -1) {
                return startNum;
            }
            startNum = this.parent.parseFloat(startNum);
            if (isNaN(startNum)) {
                startNum = 1;
            }
        }
        if (startNum <= 0 || startNum > withinText.length) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        loc = withinText.indexOf(findText, startNum - 1);
        if (loc < 0) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        return (Number(loc) + Number(1)).toString();
    }

    /** @hidden */
    public ComputeINDEX(...range: string[]): string | number {
        let argArr: string[] = range;
        let argCount: number = argArr.length;
        if (isNullOrUndefined(range) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        if (argCount > 3) {
            return this.parent.getErrorStrings()[CommonErrors.ref];
        }
        let rangeValue: string = '';
        let rangeArr: string[] | string = [];
        if (argCount > 2) {
            for (let i: number = 0; i < argCount; i++) {
                if (this.parent.isCellReference(argArr[i]) && argArr[i].indexOf(':') < 0) {
                    return this.parent.getErrorStrings()[CommonErrors.ref];
                }
                if (this.parent.isCellReference(argArr[i])) {
                    rangeArr[i] = argArr[i];
                }
            }
        }
        rangeValue = argArr[0];
        argArr[1] = argArr[1] === '' ? '1' : argArr[1];
        argArr[1] = this.parent.getValueFromArg(argArr[1]);
        if (this.parent.getErrorStrings().indexOf(argArr[1]) > -1) {
            return argArr[1];
        }
        if (!isNullOrUndefined(argArr[2])) {
            argArr[2] = argArr[2] === '' ? '1' : argArr[2];
            argArr[2] = this.parent.getValueFromArg(argArr[2]);
            if (this.parent.getErrorStrings().indexOf(argArr[2]) > -1) {
                return argArr[2];
            }
            if (argArr[2] === '0') {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        let row: number = parseFloat(argArr[1]);
        row = !isNaN(row) ? row : -1;
        let col: number = parseFloat(argArr[2] ? argArr[2] : '1');
        col = !isNaN(col) ? col : -1;
        if (row === -1 || col === -1) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        let i: number = argArr[0].indexOf(':');
        let startRow: number = this.parent.rowIndex(rangeValue.substring(0, i));
        let endRow: number = this.parent.rowIndex(rangeValue.substring(i + 1));
        let startCol: number = this.parent.colIndex(rangeValue.substring(0, i));
        let endCol: number = this.parent.colIndex(rangeValue.substring(i + 1));
        if (row > endRow - startRow + 1 || col > endCol - startCol + 1) {
            return this.parent.getErrorStrings()[CommonErrors.ref];
        }
        row = startRow + row - 1;
        col = startCol + col - 1;
        let cellRef: string = '' + this.parent.convertAlpha(col) + row;
        let result: string = this.parent.getValueFromArg(cellRef);
        if (result === '') {
            return 0;
        }
        return result;
    }

    /** @hidden */
    public ComputeIFS(...range: string[]): string | number {
        let argArr: string[] = range;
        if (isNullOrUndefined(range) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let condition: string = '';
        let result: string = '';
        for (let i: number = 0; i < argArr.length; i++) {
            condition = this.parent.getValueFromArg(argArr[i]);
            if (condition !== this.parent.trueValue && condition !== this.parent.falseValue) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
            if (condition === this.parent.trueValue) {
                if (argArr[i + 1].indexOf(this.parent.arithMarker) > -1) {
                    return this.parent.trueValue;
                }
                if (this.parent.isCellReference(argArr[i + 1].split(this.parent.tic).join(''))) {
                    result = this.parent.getValueFromArg(argArr[i + 1]);
                } else {
                    result = (argArr[i + 1].indexOf(this.parent.tic) > -1) ? argArr[i + 1].split(this.parent.tic).join('') :
                        this.parent.getErrorStrings()[CommonErrors.name];
                }
                i = i + 1;
                return result;
            } else if (condition === this.parent.falseValue) {
                i = i + 1;
            }
        }
        return this.parent.getErrorStrings()[CommonErrors.na];
    }

    /** @hidden */
    public ComputeCOUNTA(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArr: string[] = args;
        let cellColl: string[] | string;
        let result: number = 0;
        let cellValue: string;
        for (let i: number = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.parent.isCellReference(argArr[i])) {
                cellColl = this.parent.getCellCollection(argArr[i].split(this.parent.tic).join(''));
                for (let j: number = 0; j < cellColl.length; j++) {
                    cellValue = this.parent.getValueFromArg(cellColl[j]);
                    if (cellValue.length > 0) {
                        result++;
                    }
                }
            } else {
                let cellValue: string = this.parent.getValueFromArg(argArr[i].split(this.parent.tic).join(''));
                if (cellValue.length > 0) {
                    result++;
                }
            }
        }
        return result;
    }

    /** @hidden */
    public ComputeAVERAGEA(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArrs: string[] = args;
        let cellCol: string[] | string;
        let result: number = 0;
        let cellValue: string | number;
        let length: number = 0;
        let parseValue: string | number;
        for (let k: number = 0; k < argArrs.length; k++) {
            if (argArrs[k].indexOf(':') > -1 && this.parent.isCellReference(argArrs[k])) {
                cellCol = this.parent.getCellCollection(argArrs[k].split(this.parent.tic).join(''));
                for (let j: number = 0; j < cellCol.length; j++) {
                    cellValue = this.parent.getValueFromArg(cellCol[j]);
                    if (cellValue.toUpperCase() === this.parent.trueValue) {
                        cellValue = '1';
                    } else if (cellValue.toUpperCase() === this.parent.falseValue || cellValue === '') {
                        cellValue = '0';
                    } else if (this.parent.getErrorStrings().indexOf(cellValue) > -1) {
                        return cellValue;
                    } else if (cellValue.length > 0) {
                        parseValue = parseFloat(cellValue);
                        cellValue = !isNaN(parseValue) ? parseValue : 0;
                        result = result + cellValue;
                        length = length + 1;
                    }
                }
                length = cellCol.length;
            } else {
                if (argArrs[k] === this.parent.trueValue) {
                    argArrs[k] = '1';
                }
                if (argArrs[k] === this.parent.falseValue || argArrs[k] === '') {
                    argArrs[k] = '0';
                }
                cellValue = this.parent.getValueFromArg(argArrs[k].split(this.parent.tic).join(''));
                if (this.parent.getErrorStrings().indexOf(cellValue) > -1) {
                    return cellValue;
                }
                if (cellValue.length > 0) {
                    parseValue = parseFloat(cellValue);
                    cellValue = !isNaN(parseValue) ? parseValue : 0;
                    result = result + cellValue;
                    length = length + 1;
                }
            }
            if (length === 0) {
                return this.parent.getErrorStrings()[CommonErrors.divzero];
            }
        }
        return result / length;
    }

    /** @hidden */
    public ComputeCOUNTIF(...args: string[]): number | string {
        let argArr: string[] = args;
        if (isNullOrUndefined(args) || args[0] === '' || argArr.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let cellColl: string[] | string;
        let result: number = 0;
        let cellValue: string;
        let stack: string[] = [];
        let op: string = 'equal';
        let condition: string = argArr[1].split(this.parent.tic).join('');
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
        if (argArr[0].indexOf(':') > -1 && this.parent.isCellReference(argArr[0])) {
            cellColl = this.parent.getCellCollection(argArr[0].split(this.parent.tic).join(''));
            for (let j: number = 0; j < cellColl.length; j++) {
                cellValue = this.parent.getValueFromArg(cellColl[j]);
                if (condition.indexOf('*') > -1 || condition.indexOf('?') > -1) {
                    cellValue = this.parent.findWildCardValue(condition, cellValue);
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

    /** @hidden */
    public ComputeSUMIFS(...range: string[]): string | number {
        let sum: string | number;
        sum = this.parent.computeIfsFormulas(range, this.parent.falseValue);
        return sum;
    }

    /** @hidden */
    public ComputeCOUNTIFS(...args: string[]): number | string {
        let sum: string | number;
        sum = this.parent.computeIfsFormulas(args, this.parent.trueValue);
        return sum;
    }

    /** @hidden */
    public ComputeAVERAGEIFS(...args: string[]): number | string {
        let sum: string | number;
        sum = this.parent.computeIfsFormulas(args, this.parent.falseValue, this.parent.trueValue);
        return sum;
    }

    /** @hidden */
    public ComputeMATCH(...args: string[]): string | number {
        let argArr: string[] = args;
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '') || argArr.length < 2 || argArr.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let cellColl: string[] | string;
        let cellValue: string[] = [];
        let lookupVal: string = argArr[0].split(this.parent.tic).join('');
        argArr[2] = isNullOrUndefined(argArr[2]) ? '1' : argArr[2].split(this.parent.tic).join('');
        if (argArr[2].split(this.parent.tic).join('') === this.parent.trueValue) {
            argArr[2] = '1';
        }
        if (argArr[2].split(this.parent.tic).join('') === this.parent.falseValue) {
            argArr[2] = '0';
        }
        let matchType: number = parseFloat(argArr[2]);
        if (matchType !== -1 && matchType !== 0 && matchType !== 1) {
            return this.parent.getErrorStrings()[CommonErrors.na];
        }
        let index: number = 0;
        let indexVal: string = '';
        if (argArr[1].indexOf(':') > -1 || this.parent.isCellReference(argArr[1])) {
            cellColl = this.parent.getCellCollection(argArr[1].split(this.parent.tic).join(''));
            for (let j: number = 0; j < cellColl.length; j++) {
                cellValue[j] = this.parent.getValueFromArg(cellColl[j]).split(this.parent.tic).join('');
            }
            for (let i: number = 0; i < cellValue.length; i++) {
                if (matchType === 1) {
                    if (lookupVal === cellValue[i]) {
                        return i + 1;
                    } else if (lookupVal > cellValue[i]) {
                        if (!indexVal) {
                            index = i + 1;
                            indexVal = cellValue[i];
                        } else if (cellValue[i] > indexVal) {
                            index = i + 1;
                            indexVal = cellValue[i];
                        }
                    }
                } else if (matchType === 0) {
                    if (lookupVal.indexOf('*') > -1 || lookupVal.indexOf('?') > -1) {
                        cellValue[i] = this.parent.findWildCardValue(lookupVal, cellValue[i]);
                    }
                    if (lookupVal === cellValue[i]) {
                        return i + 1;
                    }
                    if (this.parent.parseFloat(lookupVal) === this.parent.parseFloat(cellValue[i])) {
                        return i + 1;
                    }
                } else if (matchType === -1) {
                    if (lookupVal === cellValue[i]) {
                        return i + 1;
                    } else if (lookupVal < cellValue[i]) {
                        if (!indexVal) {
                            index = i + 1;
                            indexVal = cellValue[i];
                        } else if (cellValue[i] < indexVal) {
                            index = i + 1;
                            indexVal = cellValue[i];
                        }
                    }
                }
            }
        }
        return index ? index : this.parent.getErrorStrings()[CommonErrors.na];
    }

    /** @hidden */
    public ComputeLOOKUP(...range: string[]): string | number {
        let argArr: string[] = range;
        let result: string = '';
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '') || argArr.length < 2 || argArr.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        result = this.parent.computeLookup(argArr);
        return result;
    }

    /** @hidden */
    public ComputeVLOOKUP(...range: string[]): string | number {
        let argArr: string[] = range;
        let result: string = '';
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '') || argArr.length < 3 || argArr.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        result = this.parent.computeVLookup(argArr);
        return result;
    }

    /** @hidden */
    public ComputeSUBTOTAL(...range: string[]): string | number {
        let argArr: string[] = range;
        let result: string | number = '';
        if (argArr.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let formula: number = this.parent.parseFloat(this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join('')));
        if (isNaN(formula)) {
            this.parent.getErrorStrings()[CommonErrors.value];
        }
        if ((formula < 1 || formula > 11) && (formula < 101 || formula > 111)) {
            this.parent.getErrorStrings()[CommonErrors.value];
        }
        let cellRef: string[] = argArr.slice(1, argArr.length);
        switch (formula) {
            case 1:
            case 101:
                result = this.ComputeAVERAGE(...cellRef);
                break;
            case 2:
            case 102:
                result = this.ComputeCOUNT(...cellRef);
                break;
            case 3:
            case 103:
                result = this.ComputeCOUNTA(...cellRef);
                break;
            case 4:
            case 104:
                result = this.ComputeMAX(...cellRef);
                break;
            case 5:
            case 105:
                result = this.ComputeMIN(...cellRef);
                break;
            case 6:
            case 106:
                result = this.ComputePRODUCT(...cellRef);
                break;
            case 7:
            case 107:
                result = this.ComputeDAY(...cellRef);
                break;
            case 8:
            case 108:
                result = this.ComputeCONCAT(...cellRef);
                break;
            case 9:
            case 109:
                result = this.ComputeSUM(...cellRef);
                break;
            case 10:
            case 110:
                result = this.ComputeAVERAGEA(...cellRef);
                break;
            case 11:
            case 111:
                result = this.ComputeABS(...cellRef);
                break;
            default:
                result = this.parent.getErrorStrings()[CommonErrors.value];
                break;
        }
        return result;
    }

    /** @hidden */
    public ComputeRADIANS(...range: string[]): string | number {
        let argArr: string[] = range;
        let result: number;
        if (argArr[0] === '' || argArr.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        if (argArr[0].indexOf(':') > -1 || argArr[0].split(this.parent.tic).join('') === '') {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        let val: string = argArr[0].split(this.parent.tic).join('');
        argArr[0] = isNaN(this.parent.parseFloat(val)) ? argArr[0] : val;
        let cellvalue: string = this.parent.getValueFromArg(argArr[0]);
        let radVal: number = this.parent.parseFloat(cellvalue);
        if (!isNaN(radVal)) {
            result = Math.PI * (radVal) / 180;
        } else {
            if (cellvalue.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            } else {
                return this.parent.getErrorStrings()[CommonErrors.name];
            }
        }
        return result;
    }

    /** @hidden */
    public ComputeRANDBETWEEN(...range: string[]): string | number {
        let argsLength: number = range.length;
        let min: number;
        let max: number;
        let argVal: number;
        if (argsLength !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (let i: number = 0; i < argsLength; i++) {
            if (range[i] === '') {
                return this.parent.getErrorStrings()[CommonErrors.na];
            }
            if (range[i].indexOf(this.parent.tic) > -1) {
                if (isNaN(parseFloat(range[i].split(this.parent.tic).join('')))) {
                    return this.parent.getErrorStrings()[CommonErrors.value];
                } else {
                    range[i] = range[i].split(this.parent.tic).join('');
                }
            }
            argVal = parseFloat(this.parent.getValueFromArg(range[i]));
            if (!this.parent.isCellReference(range[i])) {
                if (isNaN(argVal)) {
                    return this.parent.getErrorStrings()[CommonErrors.name];
                }
                i === 0 ? min = argVal : max = argVal;
            } else {
                argVal = this.parent.getValueFromArg(range[i]) === '' ? 0 : argVal;
                i === 0 ? min = argVal : max = argVal;
                if (min === 0 && max === 0) {
                    return '0';
                }
                if (isNaN(argVal)) {
                    return this.parent.getErrorStrings()[CommonErrors.value];
                }
            }
        }
        if (max < min) {
            return this.parent.getErrorStrings()[CommonErrors.num];
        }
        if (min === 0) {
            return Math.floor(Math.random() * (max - (min - 1))) + min;
        } else {
            return max - min === 1 ? Math.round((Math.random() * (max - min)) + min) : Math.floor(Math.random() * (max - (min - 1))) + min;
        }
    }

    /** @hidden */
    public ComputeSLOPE(...range: string[]): string | number {
        let argArr: string[] = range;
        if (argArr.length !== 2 || argArr[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let yPoints: string[];
        let xPoints: string[];
        let xPointsRange: string | string[] = this.parent.getCellCollection(argArr[1].split(this.parent.tic).join(''));
        let yPointsRange: string | string[] = this.parent.getCellCollection(argArr[0].split(this.parent.tic).join(''));
        if (yPointsRange.length !== xPointsRange.length) {
            return this.parent.getErrorStrings()[CommonErrors.na];
        }
        yPoints = this.getDataCollection(yPointsRange);
        xPoints = this.getDataCollection(xPointsRange);
        if (xPoints.indexOf('#NAME?') > -1 || yPoints.indexOf('#NAME?') > -1) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        let sumXY: number = 0;
        let sumX2: number = 0;
        let sumX: number = 0;
        let sumY: number = 0;
        for (let i: number = 0, len: number = xPoints.length; i < len; ++i) {
            if (Number(xPoints[i]).toString() !== 'NaN' && Number(yPoints[i]).toString() !== 'NaN') {
                sumXY += Number(xPoints[i]) * Number(yPoints[i]);
                sumX += Number(xPoints[i]);
                sumY += Number(yPoints[i]);
                sumX2 += Number(xPoints[i]) * Number(xPoints[i]);
            }
        }
        if ((sumXY - sumX * sumY) === 0 || (sumX2 - sumX * sumX) === 0) {
            this.parent.getErrorStrings()[CommonErrors.divzero];
        }
        let result: string = ((sumXY - sumX * sumY / xPoints.length) / (sumX2 - sumX * sumX / xPoints.length)).toString();
        if (result === 'NaN') {
            return this.parent.getErrorStrings()[CommonErrors.divzero];
        }
        return result;
    }

    /** @hidden */
    public ComputeINTERCEPT(...range: string[]): string | number {
        let argArr: string[] = range;
        if (argArr[0] === '' || argArr.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let xValues: string[];
        let yValues: string[];
        let yValuesRange: string | string[] = this.parent.getCellCollection(argArr[0].split(this.parent.tic).join(''));
        let xValuesRange: string | string[] = this.parent.getCellCollection(argArr[1].split(this.parent.tic).join(''));
        if (yValuesRange.length !== xValuesRange.length) {
            return this.parent.getErrorStrings()[CommonErrors.na];
        }
        xValues = this.getDataCollection(xValuesRange);
        yValues = this.getDataCollection(yValuesRange);
        if (xValues.indexOf('#NAME?') > -1 || yValues.indexOf('#NAME?') > -1) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        let sumX: number = 0;
        let sumY: number = 0;
        for (let i: number = 0, len: number = xValues.length; i < len; ++i) {
            sumX += Number(xValues[i]);
            sumY += Number(yValues[i]);
        }
        sumX = sumX / xValues.length;
        sumY = sumY / xValues.length;
        let sumXY: number = 0;
        let sumX2: number = 0;
        let diff: number;
        for (let i: number = 0, len: number = xValues.length; i < len; ++i) {
            diff = Number(xValues[i]) - sumX;
            sumXY += diff * (Number(yValues[i]) - sumY);
            sumX2 += diff * diff;
        }
        let result: string = (sumY - sumXY / sumX2 * sumX).toString();
        if ((sumY - sumXY) === 0 || (sumX2 * sumX) === 0) {
            this.parent.getErrorStrings()[CommonErrors.divzero];
        }
        if (result === 'NaN') {
            return this.parent.getErrorStrings()[CommonErrors.divzero];
        }
        return result;
    }

    /** @hidden */
    public ComputeLN(...logValue: string[]): string | number {
        let argArr: string[] = logValue;
        let cellvalue: string = '';
        let logVal: number;
        let orgValue: number | string;
        if (logValue.length === 0 || logValue.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        if (this.parent.isCellReference(argArr[0])) {
            cellvalue = this.parent.getValueFromArg(argArr[0]);
            logVal = this.parent.parseFloat(cellvalue);
            if (logVal <= 0 || cellvalue === '') {
                return this.parent.getErrorStrings()[CommonErrors.num];
            }
            if (isNaN(logVal)) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        } else {
            orgValue = this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join(''));
            logVal = this.parent.parseFloat(orgValue);
            if (logVal <= 0 || logVal.toString() === '') {
                return this.parent.getErrorStrings()[CommonErrors.num];
            }
            if (isNaN(logVal)) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        return Math.log(logVal);
    }
    private getDataCollection(cells: string[] | string): string[] {
        let cellsData: string[] = [];
        for (let i: number = 0, len: number = cells.length; i < len; i++) {
            cellsData.push(this.parent.getValueFromArg(cells[i]));
        }
        return cellsData;
    }

    protected getModuleName(): string {
        return 'basic-formulas';
    }
}