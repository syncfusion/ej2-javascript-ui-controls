import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined, Internationalization } from '@syncfusion/ej2-base';
import { dateToInt } from '../common/number-date';
import { CalculateDateParseResult } from '../common/interface';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Date and time construction, extraction, and serial-number conversion for spreadsheet calendars.
 *
 * Registers 14 functions including DATE, DAY, TODAY, DAYS, WEEKDAY, and others.
 *
 * @hidden
 */
export class DateTimeFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'DATE', category: 'Date', description: 'Returns the date, given the year, month and day of the month.', syntax: 'DATE(year, month, day)' },
        { formulaName: 'DAY', category: 'Date', description: 'Returns the day of a given date.', syntax: 'DAY(serial_number)' },
        { formulaName: 'TODAY', category: 'Date', description: 'Returns the current date as date value.', syntax: 'TODAY()' },
        { formulaName: 'DAYS', category: 'Date', description: 'Returns the number of days between two dates.', syntax: 'DAYS(end_date, start_date)' },
        { formulaName: 'WEEKDAY', category: 'Date', description: 'Returns the day of the week corresponding to a date.', syntax: 'WEEKDAY(serial_number, [return_type])' },
        { formulaName: 'TIME', category: 'Date & Time', description: 'Converts hours, minutes, seconds to the time formatted text.', syntax: 'TIME(hour, minute, second)' },
        { formulaName: 'EDATE', category: 'Date & Time', description: 'Returns a date with given number of months before or after the specified date.', syntax: 'EDATE(start_date, months)' },
        { formulaName: 'EOMONTH', category: 'Date & Time', description: 'Returns the last day of the month that is a specified number of months before or after an initially supplied start date.', syntax: 'EOMONTH(start_date, months)' },
        { formulaName: 'DATEVALUE', category: 'Date & Time', description: 'Converts a date string into date value.', syntax: 'DATEVALUE(date_text)' },
        { formulaName: 'HOUR', category: 'Date & Time', description: 'Returns the number of hours in a specified time string.', syntax: 'HOUR(serial_number)' },
        { formulaName: 'MINUTE', category: 'Date & Time', description: 'Returns the number of minutes in a specified time string.', syntax: 'MINUTE(serial_number)' },
        { formulaName: 'SECOND', category: 'Date & Time', description: 'Returns the number of seconds in a specified time string.', syntax: 'SECOND(serial_number)' },
        { formulaName: 'NOW', category: 'Date & Time', description: 'Returns the current date and time.', syntax: 'NOW()' },
        { formulaName: 'MONTH', category: 'Date & Time', description: 'Returns the number of months in a specified date string.', syntax: 'MONTH(serial_number)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the date, given the year, month and day of the month.
     *
     * Excel: `DATE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=DATE(2024,1,15)');
     * ```
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
     * Returns the day of a given date.
     *
     * Excel: `DAY(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
     * Returns the current date as date value.
     *
     * Excel: `TODAY(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTODAY(...args: string[]): Date | string {
        let str: string;
        if (args.length !== 1 || args[0] !== '') {
            str = this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else {
            const dt: Date = new Date(Date.now());
            if ((this.parent.parentObject as { getModuleName: Function }).getModuleName() === 'spreadsheet') {
                str = dateToInt(dt).toString();
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
     * Returns the number of days between two dates.
     *
     * Excel: `DAYS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
            const dateCheck: CalculateDateParseResult = this.parent.hostParseDate(value.toString());
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
     * Returns the day of the week corresponding to a date.
     *
     * Excel: `WEEKDAY(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
     * Converts hours, minutes, seconds to the time formatted text.
     *
     * Excel: `TIME(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
        const timeCheck: CalculateDateParseResult = this.parent.hostParseDate(result.toString());
        if (timeCheck.isTime) {
            result = timeCheck.value;
        }
        return result;
    }

    /**
     * Returns a date with given number of months before or after the specified date.
     *
     * Excel: `EDATE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
            if (this.parent.getErrorStrings().indexOf(dValue.toString()) > -1) {
                return dValue.toString();
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
        let result: number = dateToInt(date);
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
     * Returns the last day of the month that is a specified number of months before or after an initially supplied start date.
     *
     * Excel: `EOMONTH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
        const result: number = dateToInt(date);
        if (result < 0 || result > 2958465 || date.getFullYear() < 1900) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * Converts a date string into date value.
     *
     * Excel: `DATEVALUE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
     * Returns the number of hours in a specified time string.
     *
     * Excel: `HOUR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
            const dateCheck: CalculateDateParseResult = this.parent.hostParseDate(cellVal.toString());
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
     * Returns the number of minutes in a specified time string.
     *
     * Excel: `MINUTE(...)`.
     *
     * @hidden
     * @param {string[]} argArr - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
            const dateCheck: CalculateDateParseResult = this.parent.hostParseDate(cellVal.toString());
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
     * Returns the number of seconds in a specified time string.
     *
     * Excel: `SECOND(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
            const dateCheck: CalculateDateParseResult = this.parent.hostParseDate(cellVal.toString());
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
     * Returns the current date and time.
     *
     * Excel: `NOW(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeNOW(...args: string[]): string {
        if (args.length !== 1 || args[0] !== '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        return dateToInt(new Date(Date.now()), true).toString();
    }

    /**
     * Returns the number of months in a specified date string.
     *
     * Excel: `MONTH(...)`.
     *
     * @hidden
     * @param {string[]} argsVal - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
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
}
