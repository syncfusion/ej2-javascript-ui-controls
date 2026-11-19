import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Locale-aware and ECMA date functions including DATEDIF and custom-weekend WORKDAY/NETWORKDAYS variants.
 *
 * Registered functions: DATEDIF, NETWORKDAYS.INTL, WORKDAY.INTL.
 *
 * @hidden
 */
export class DateTimeIntlFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'DATEDIF', category: 'Date & Time', description: 'Calculates the number of days, months, or years between two dates.', syntax: 'DATEDIF(start_date, end_date, unit)' },
        { formulaName: 'NETWORKDAYS.INTL', category: 'Date & Time', description: 'Returns workdays between dates for a custom weekend.', syntax: 'NETWORKDAYS.INTL(start_date, end_date, [weekend], [holidays])' },
        { formulaName: 'WORKDAY.INTL', category: 'Date & Time', description: 'Returns the date before or after a number of workdays with a custom weekend.', syntax: 'WORKDAY.INTL(start_date, days, [weekend], [holidays])' }
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
            return Math.floor(this.parent.parseFloat(value));
        }
        const parsed: Date = this.parent.isDate(new Date(value));
        if (parsed) {
            return Math.floor(this.parent.toOADate(parsed));
        }
        return errCollection[CommonErrors.Value];
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
                set.add(serial);
            }
        } else {
            const serial: number | string = this.toSerial(arg);
            if (typeof serial === 'string') {
                return serial;
            }
            set.add(serial);
        }
        return set;
    }

    private weekendMask(weekendArg?: string): boolean[] | string {
        const defaultMask: boolean[] = [false, false, false, false, false, true, true];
        if (!weekendArg || weekendArg === '') {
            return defaultMask;
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const text: string = this.resolveTextArg(weekendArg);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        if (text.length === 7 && /^[01]+$/.test(text)) {
            const mask: boolean[] = [];
            for (let i: number = 0; i < 7; i++) {
                mask.push(text.charAt(i) === '1');
            }
            return mask;
        }
        const num: number | string = this.resolveNumberArg(weekendArg);
        if (typeof num === 'string') {
            return num;
        }
        const n: number = Math.floor(num);
        const masks: Record<number, boolean[]> = {
            1: [false, false, false, false, false, true, true],
            2: [true, false, false, false, false, false, true],
            3: [true, true, false, false, false, false, false],
            4: [false, true, true, false, false, false, false],
            5: [false, false, true, true, false, false, false],
            6: [false, false, false, true, true, false, false],
            7: [false, false, false, false, true, true, false],
            11: [true, false, false, false, false, false, false],
            12: [false, true, false, false, false, false, false],
            13: [false, false, true, false, false, false, false],
            14: [false, false, false, true, false, false, false],
            15: [false, false, false, false, true, false, false],
            16: [false, false, false, false, false, true, false],
            17: [false, false, false, false, false, false, true]
        };
        // eslint-disable-next-line security/detect-object-injection
        return masks[n] || errCollection[CommonErrors.Num];
    }

    private isWeekendMask(date: Date, mask: boolean[]): boolean {
        const dow: number = (date.getDay() + 6) % 7;
        return mask[dow as number];
    }

    /**
     * Calculates the number of days, months, or years between two dates.
     *
     * Excel: `DATEDIF(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=DATEDIF(DATE(2020,1,1),DATE(2024,1,1),"Y")');
     * ```
     */
    public ComputeDATEDIF(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
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
        const unit: string = this.resolveTextArg(args[2]).toUpperCase();
        if (start > end) {
            return errCollection[CommonErrors.Num];
        }
        const d1: Date = this.parent.fromOADate(start);
        const d2: Date = this.parent.fromOADate(end);
        switch (unit) {
        case 'Y':
            return (d2.getFullYear() - d1.getFullYear() -
                (d2.getMonth() < d1.getMonth() || (d2.getMonth() === d1.getMonth() && d2.getDate() < d1.getDate()) ? 1 : 0)).toString();
        case 'M': {
            let months: number = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
            if (d2.getDate() < d1.getDate()) {
                months--;
            }
            return months.toString();
        }
        case 'D':
            return (end - start).toString();
        case 'MD': {
            let md: number = d2.getDate() - d1.getDate();
            if (md < 0) {
                md += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
            }
            return md.toString();
        }
        case 'YM': {
            let ym: number = d2.getMonth() - d1.getMonth();
            if (d2.getDate() < d1.getDate()) {
                ym--;
            }
            if (ym < 0) {
                ym += 12;
            }
            return ym.toString();
        }
        case 'YD': {
            const anchor: Date = new Date(d2.getFullYear(), d1.getMonth(), d1.getDate());
            let yd: number = Math.round((d2.getTime() - anchor.getTime()) / 86400000);
            if (yd < 0) {
                yd += this.isLeapYear(d2.getFullYear()) ? 366 : 365;
            }
            return yd.toString();
        }
        default:
            return errCollection[CommonErrors.Num];
        }
    }

    private isLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    /**
     * Returns workdays between dates for a custom weekend.
     *
     * Excel: `NETWORKDAYS.INTL(...)`.
     *
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ['ComputeNETWORKDAYS.INTL'](...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 4) {
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
        const mask: boolean[] | string = this.weekendMask(args[2]);
        if (!(mask instanceof Array)) {
            return mask;
        }
        const holidays: Set<number> | string = this.holidaySet(args[3]);
        if (!(holidays instanceof Set)) {
            return holidays;
        }
        const step: number = start <= end ? 1 : -1;
        let count: number = 0;
        for (let s: number = start; step > 0 ? s <= end : s >= end; s += step) {
            const d: Date = this.parent.fromOADate(s);
            if (!this.isWeekendMask(d, mask) && !holidays.has(s)) {
                count += step;
            }
        }
        return count.toString();
    }

    /**
     * Returns the date before or after a number of workdays with a custom weekend.
     *
     * Excel: `WORKDAY.INTL(...)`.
     *
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ['ComputeWORKDAY.INTL'](...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 4) {
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
        const mask: boolean[] | string = this.weekendMask(args[2]);
        if (!(mask instanceof Array)) {
            return mask;
        }
        const holidays: Set<number> | string = this.holidaySet(args[3]);
        if (!(holidays instanceof Set)) {
            return holidays;
        }
        let current: number = start;
        const step: number = daysArg >= 0 ? 1 : -1;
        let remaining: number = Math.abs(Math.trunc(daysArg));
        while (remaining > 0) {
            current += step;
            const d: Date = this.parent.fromOADate(current);
            if (!this.isWeekendMask(d, mask) && !holidays.has(current)) {
                remaining--;
            }
            if (current < 0) {
                return errCollection[CommonErrors.Num];
            }
        }
        return current.toString();
    }
}
