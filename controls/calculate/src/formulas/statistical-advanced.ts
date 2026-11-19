import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { isNumber } from '../common/number-date';
import { isCellReference } from '../common/cell-ref';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Extended statistical summaries including ranked averages, modes, and specialized aggregates.
 *
 * Registered functions: SMALL, LARGE, MEDIAN, SLOPE, INTERCEPT, RSQ, GEOMEAN.
 *
 * @hidden
 */
export class StatisticalAdvancedFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'SMALL', category: 'Statistical', description: 'Returns the k-th smallest value in a given array.', syntax: 'SMALL(array, k)' },
        { formulaName: 'LARGE', category: 'Statistical', description: 'Returns the k-th largest value in a given array.', syntax: 'LARGE(array, k)' },
        { formulaName: 'MEDIAN', category: 'Statistical', description: 'Returns the median of the given set of numbers.', syntax: 'MEDIAN(number1, [number2], ...)' },
        { formulaName: 'SLOPE', category: 'Statistical', description: 'Returns the slope of the line from linear regression of the data points.', syntax: 'SLOPE(known_y\'s, known_x\'s)' },
        { formulaName: 'INTERCEPT', category: 'Statistical', description: 'Calculates the point of the Y-intercept line via linear regression.', syntax: 'INTERCEPT(known_y\'s, known_x\'s)' },
        { formulaName: 'RSQ', category: 'Statistical', description: 'Returns the square of the Pearson product moment correlation coefficient based on data points in known_ys and known_xs.', syntax: 'RSQ(known_y\'s, known_x\'s)' },
        { formulaName: 'GEOMEAN', category: 'Statistical', description: 'Returns the geometric mean of an array or range of positive data.', syntax: 'GEOMEAN(number1, [number2], ...)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the median of the given set of numbers.
     *
     * Excel: `MEDIAN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=MEDIAN(1)');
     * ```
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
     * Returns the k-th smallest value in a given array.
     *
     * Excel: `SMALL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
     * Returns the k-th largest value in a given array.
     *
     * Excel: `LARGE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
     * Returns the slope of the line from linear regression of the data points.
     *
     * Excel: `SLOPE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSLOPE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0].trim() === ''))  {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (args[0] === '' || args[1] === '') {
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
        let yPoints: string | string[] = cellCollection(args[0].trim());
        let xPoints: string | string[] = cellCollection(args[1].trim());
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
     * Calculates the point of the Y-intercept line via linear regression.
     *
     * Excel: `INTERCEPT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeINTERCEPT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0].trim() === ''))  {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (args[0] === '' || args[1] === '') {
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
        let yValues: string | string[] = cellCollection(args[0].trim());
        let xValues: string | string[] = cellCollection(args[1].trim());
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
     * Returns the geometric mean of an array or range of positive data.
     *
     * Excel: `GEOMEAN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeGEOMEAN(...args: string[]): boolean | string {
        const argArr: string[] = args;
        let sum: number | string = 1;
        let count: number | string = 0;
        let cellVal: number | string = 0;
        let cellStr: number | string = 0;
        let dev: number | string;
        let r: number;
        let s: number;
        let cell: string[] | string;
        if (args.length === 0) {
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
     * Returns the square of the Pearson product moment correlation coefficient based on data points in known_ys and known_xs.
     *
     * Excel: `RSQ(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeRSQ(...args: string[]): string | number {
        let validCount: number = 0;
        const argArr: string[] = args;
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
}
