import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Additional date/time utilities: workdays, network days, week numbers, and calendar offsets.
 *
 * Registered functions: YEAR, WEEKNUM, TIMEVALUE, DAYS360, YEARFRAC, NETWORKDAYS, WORKDAY.
 *
 * @hidden
 */
export class DateTimeExtraFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'YEAR', category: 'Date & Time', description: 'Converts a serial number to a year.', syntax: 'YEAR(serial_number)' },
        { formulaName: 'WEEKNUM', category: 'Date & Time', description: 'Converts a serial number to a number representing where the week falls numerically within a year.', syntax: 'WEEKNUM(serial_number, [return_type])' },
        { formulaName: 'TIMEVALUE', category: 'Date & Time', description: 'Converts a time in the form of text to a serial number.', syntax: 'TIMEVALUE(time_text)' },
        { formulaName: 'DAYS360', category: 'Date & Time', description: 'Calculates the number of days between two dates based on a 360-day year.', syntax: 'DAYS360(start_date, end_date, [method])' },
        { formulaName: 'YEARFRAC', category: 'Date & Time', description: 'Returns the year fraction representing the number of whole days between start_date and end_date.', syntax: 'YEARFRAC(start_date, end_date, [basis])' },
        { formulaName: 'NETWORKDAYS', category: 'Date & Time', description: 'Returns the number of whole workdays between two dates.', syntax: 'NETWORKDAYS(start_date, end_date, [holidays])' },
        { formulaName: 'WORKDAY', category: 'Date & Time', description: 'Returns the serial number of the date before or after a specified number of workdays.', syntax: 'WORKDAY(start_date, days, [holidays])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private toSerial(arg: string): number | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        let value: string = this.parent.getValueFromArg(arg);
        if (errCollection.indexOf(value) > -1) {
            return value;
        }
        if (!this.parent.isCellReference(arg)) {
            value = this.parent.removeTics(value);
        }
        if (value === '') {
            return errCollection[CommonErrors.Value];
        }
        if (this.parent.isNumber(value)) {
            return this.parent.parseFloat(value);
        }
        const parsed: Date = this.parent.isDate(new Date(value));
        if (parsed) {
            return this.parent.toOADate(parsed);
        }
        return errCollection[CommonErrors.Value];
    }

    /**
     * Converts a serial number to a year.
     *
     * Excel: `YEAR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=YEAR(1)');
     * ```
     */
    public ComputeYEAR(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const serial: number | string = this.toSerial(args[0]);
        if (typeof serial === 'string') {
            return serial;
        }
        if (serial < 0) {
            return errCollection[CommonErrors.Num];
        }
        return this.parent.fromOADate(serial).getFullYear().toString();
    }

    /**
     * Converts a serial number to a number representing where the week falls numerically within a year.
     *
     * Excel: `WEEKNUM(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeWEEKNUM(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const serial: number | string = this.toSerial(args[0]);
        if (typeof serial === 'string') {
            return serial;
        }
        let returnType: number = 1;
        if (args.length === 2 && args[1] !== '') {
            const rt: number | string = this.resolveNumberArg(args[1]);
            if (typeof rt === 'string') {
                return rt;
            }
            returnType = Math.floor(rt);
        }
        const date: Date = this.parent.fromOADate(serial);
        const yearStart: Date = new Date(date.getFullYear(), 0, 1);
        let dayOffset: number = 0;
        if (returnType === 2 || returnType === 11) {
            dayOffset = 1; // week begins Monday
        }
        const startDow: number = (yearStart.getDay() + 7 - dayOffset) % 7;
        const dayOfYear: number = Math.floor((date.getTime() - yearStart.getTime()) / 86400000);
        const week: number = Math.floor((dayOfYear + startDow) / 7) + 1;
        if (week < 1) {
            return errCollection[CommonErrors.Num];
        }
        return week.toString();
    }

    /**
     * Converts a time in the form of text to a serial number.
     *
     * Excel: `TIMEVALUE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTIMEVALUE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        // eslint-disable-next-line security/detect-unsafe-regex
        const match: RegExpMatchArray = text.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
        if (!match) {
            const asDate: Date = this.parent.isDate(new Date(text));
            if (asDate) {
                const serial: number = this.parent.toOADate(asDate, true);
                return (serial - Math.floor(serial)).toString();
            }
            return errCollection[CommonErrors.Value];
        }
        let hours: number = parseInt(match[1], 10);
        const minutes: number = parseInt(match[2], 10);
        const seconds: number = match[3] ? parseInt(match[3], 10) : 0;
        const ampm: string = match[4] ? match[4].toUpperCase() : '';
        if (ampm === 'PM' && hours < 12) {
            hours += 12;
        }
        if (ampm === 'AM' && hours === 12) {
            hours = 0;
        }
        if (hours > 23 || minutes > 59 || seconds > 59) {
            return errCollection[CommonErrors.Value];
        }
        return ((hours * 3600 + minutes * 60 + seconds) / 86400).toString();
    }

    /**
     * Calculates the number of days between two dates based on a 360-day year.
     *
     * Excel: `DAYS360(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDAYS360(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const start: number | string = this.toSerial(args[0]);
        const end: number | string = this.toSerial(args[1]);
        if (typeof start === 'string') {
            return start;
        }
        if (typeof end === 'string') {
            return end;
        }
        let method: boolean = false;
        if (args.length === 3 && args[2] !== '') {
            const flag: string = this.parent.getValueFromArg(args[2]).toUpperCase();
            method = flag === this.parent.trueValue || this.parent.parseFloat(flag) !== 0;
        }
        const d1: Date = this.parent.fromOADate(start);
        const d2: Date = this.parent.fromOADate(end);
        const y1: number = d1.getFullYear();
        const m1: number = d1.getMonth() + 1;
        let day1: number = d1.getDate();
        const y2: number = d2.getFullYear();
        const m2: number = d2.getMonth() + 1;
        let day2: number = d2.getDate();
        if (!method) {
            if (day1 === 31) {
                day1 = 30;
            }
            if (day2 === 31 && day1 === 30) {
                day2 = 30;
            }
        } else {
            if (day1 === 31) {
                day1 = 30;
            }
            if (day2 === 31) {
                day2 = 30;
            }
        }
        return ((y2 - y1) * 360 + (m2 - m1) * 30 + (day2 - day1)).toString();
    }

    /**
     * Returns the year fraction representing the number of whole days between start_date and end_date.
     *
     * Excel: `YEARFRAC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeYEARFRAC(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const start: number | string = this.toSerial(args[0]);
        const end: number | string = this.toSerial(args[1]);
        if (typeof start === 'string') {
            return start;
        }
        if (typeof end === 'string') {
            return end;
        }
        let basis: number = 0;
        if (args.length === 3 && args[2] !== '') {
            const b: number | string = this.resolveNumberArg(args[2]);
            if (typeof b === 'string') {
                return b;
            }
            basis = Math.floor(b);
        }
        const days: number = Math.abs(end - start);
        switch (basis) {
        case 0:
            return (Math.abs(this.parent.parseFloat(this.ComputeDAYS360(args[0], args[1], 'FALSE') as string)) / 360).toString();
        case 1: {
            const avgYear: number = 365.25;
            return (days / avgYear).toString();
        }
        case 2:
            return (days / 360).toString();
        case 3:
            return (days / 365).toString();
        case 4:
            return (Math.abs(this.parent.parseFloat(this.ComputeDAYS360(args[0], args[1], 'TRUE') as string)) / 360).toString();
        default:
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
    }

    private isWeekend(date: Date): boolean {
        const dow: number = date.getDay();
        return dow === 0 || dow === 6;
    }

    private holidaySet(arg?: string): Set<number> | string {
        const set: Set<number> = new Set<number>();
        if (!arg || arg === '') {
            return set;
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        if (this.parent.isCellReference(arg) && arg.indexOf(':') > -1) {
            const cells: string[] | string = this.parent.getCellCollection(arg);
            const list: string[] = Array.isArray(cells) ? cells : [cells];
            for (let i: number = 0; i < list.length; i++) {
                const serial: number | string = this.toSerial(list[i as number]);
                if (typeof serial === 'string') {
                    if (errCollection.indexOf(serial) > -1) {
                        return serial;
                    }
                    continue;
                }
                set.add(Math.floor(serial));
            }
        } else {
            const serial: number | string = this.toSerial(arg);
            if (typeof serial === 'string') {
                return serial;
            }
            set.add(Math.floor(serial));
        }
        return set;
    }

    /**
     * Returns the number of whole workdays between two dates.
     *
     * Excel: `NETWORKDAYS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeNETWORKDAYS(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const start: number | string = this.toSerial(args[0]);
        const end: number | string = this.toSerial(args[1]);
        if (typeof start === 'string') {
            return start;
        }
        if (typeof end === 'string') {
            return end;
        }
        const holidays: Set<number> | string = this.holidaySet(args[2]);
        if (!(holidays instanceof Set)) {
            return holidays;
        }
        const step: number = start <= end ? 1 : -1;
        let count: number = 0;
        for (let s: number = Math.floor(start); step > 0 ? s <= Math.floor(end) : s >= Math.floor(end); s += step) {
            const d: Date = this.parent.fromOADate(s);
            if (!this.isWeekend(d) && !holidays.has(s)) {
                count += step;
            }
        }
        return count.toString();
    }

    /**
     * Returns the serial number of the date before or after a specified number of workdays.
     *
     * Excel: `WORKDAY(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeWORKDAY(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const start: number | string = this.toSerial(args[0]);
        const daysArg: number | string = this.resolveNumberArg(args[1]);
        if (typeof start === 'string') {
            return start;
        }
        if (typeof daysArg === 'string') {
            return daysArg;
        }
        const days: number = Math.trunc(daysArg);
        const holidays: Set<number> | string = this.holidaySet(args[2]);
        if (!(holidays instanceof Set)) {
            return holidays;
        }
        let current: number = Math.floor(start);
        const step: number = days >= 0 ? 1 : -1;
        let remaining: number = Math.abs(days);
        while (remaining > 0) {
            current += step;
            const d: Date = this.parent.fromOADate(current);
            if (!this.isWeekend(d) && !holidays.has(current)) {
                remaining--;
            }
            if (current < 0) {
                return errCollection[CommonErrors.Num];
            }
        }
        return current.toString();
    }
}
