import { Calculate } from '../base/index';

/**
 * Shared bond/coupon date helpers for financial ECMA formulas.
 *
 * @hidden
 */
export class FinancialBondHelpers {
    private parent: Calculate;

    constructor(parent: Calculate) {
        this.parent = parent;
    }

    /**
     * yearDays helper.
     *
     * @param {number} basis - basis argument.
     * @returns {number} - yearDays result.
     */
    public yearDays(basis: number): number {
        switch (basis) {
        case 1:
            return 365;
        case 3:
            return 365;
        default:
            return 360;
        }
    }

    /**
     * toDate helper.
     *
     * @param {number} serial - serial argument.
     * @returns {Date} - toDate result.
     */
    public toDate(serial: number): Date {
        return this.parent.fromOADate(serial);
    }

    /**
     * toSerial helper.
     *
     * @param {Date} date - date argument.
     * @returns {number} - toSerial result.
     */
    public toSerial(date: Date): number {
        return this.parent.toOADate(date);
    }
    /**
     * coupPCD helper.
     *
     * @param {number} settlement - settlement argument.
     * @param {number} maturity - maturity argument.
     * @param {number} frequency - frequency argument.
     * @returns {number} - coupPCD result.
     */
    public coupPCD(settlement: number, maturity: number, frequency: number): number {
        const mat: Date = this.toDate(maturity);
        let coupon: Date = new Date(mat.getFullYear(), mat.getMonth(), mat.getDate());
        const monthsPer: number = 12 / frequency;
        while (this.toSerial(coupon) > settlement) {
            coupon = this.addMonths(coupon, -monthsPer);
        }
        if (this.toSerial(coupon) > settlement) {
            return settlement;
        }
        return this.toSerial(coupon);
    }
    /**
     * coupNCD helper.
     *
     * @param {number} settlement - settlement argument.
     * @param {number} maturity - maturity argument.
     * @param {number} frequency - frequency argument.
     * @returns {number} - coupNCD result.
     */
    public coupNCD(settlement: number, maturity: number, frequency: number): number {
        let pcd: number = this.coupPCD(settlement, maturity, frequency);
        if (pcd <= settlement) {
            const monthsPer: number = 12 / frequency;
            pcd = this.toSerial(this.addMonths(this.toDate(pcd), monthsPer));
        }
        return pcd;
    }

    /**
     * coupDays helper.
     *
     * @param {number} settlement - settlement argument.
     * @param {number} maturity - maturity argument.
     * @param {number} frequency - frequency argument.
     * @param {number} basis - basis argument.
     * @returns {number} - coupDays result.
     */
    public coupDays(settlement: number, maturity: number, frequency: number, basis: number = 0): number {
        const pcd: number = this.coupPCD(settlement, maturity, frequency);
        const ncd: number = this.coupNCD(settlement, maturity, frequency);
        return this.daysBetween(pcd, ncd, basis);
    }

    /**
     * coupDayBS helper.
     *
     * @param {number} settlement - settlement argument.
     * @param {number} maturity - maturity argument.
     * @param {number} frequency - frequency argument.
     * @param {number} basis - basis argument.
     * @returns {number} - coupDayBS result.
     */
    public coupDayBS(settlement: number, maturity: number, frequency: number, basis: number = 0): number {
        const pcd: number = this.coupPCD(settlement, maturity, frequency);
        return this.daysBetween(pcd, settlement, basis);
    }

    /**
     * coupDaysNC helper.
     *
     * @param {number} settlement - settlement argument.
     * @param {number} maturity - maturity argument.
     * @param {number} frequency - frequency argument.
     * @param {number} basis - basis argument.
     * @returns {number} - coupDaysNC result.
     */
    public coupDaysNC(settlement: number, maturity: number, frequency: number, basis: number = 0): number {
        const ncd: number = this.coupNCD(settlement, maturity, frequency);
        return this.daysBetween(settlement, ncd, basis);
    }

    /**
     * coupNum helper.
     *
     * @param {number} settlement - settlement argument.
     * @param {number} maturity - maturity argument.
     * @param {number} frequency - frequency argument.
     * @param {number} _basis - basis argument.
     * @returns {number} - coupNum result.
     */
    public coupNum(settlement: number, maturity: number, frequency: number, _basis: number = 0): number {
        void _basis;
        const monthsPer: number = 12 / frequency;
        const mat: Date = this.toDate(maturity);
        let coupon: Date = new Date(mat.getFullYear(), mat.getMonth(), mat.getDate());
        let count: number = 0;
        while (this.toSerial(coupon) > settlement) {
            count++;
            coupon = this.addMonths(coupon, -monthsPer);
        }
        return count;
    }

    /**
     * daysBetween helper.
     *
     * @param {number} start - start argument.
     * @param {number} end - end argument.
     * @param {number} basis - basis argument.
     * @returns {number} - daysBetween result.
     */
    public daysBetween(start: number, end: number, basis: number): number {
        if (basis === 1) {
            return Math.round((end - start));
        }
        const d1: Date = this.toDate(start);
        const d2: Date = this.toDate(end);
        if (basis === 3) {
            return Math.abs(Math.round((d2.getTime() - d1.getTime()) / 86400000));
        }
        const y1: number = d1.getFullYear();
        const m1: number = d1.getMonth() + 1;
        let day1: number = d1.getDate();
        const y2: number = d2.getFullYear();
        const m2: number = d2.getMonth() + 1;
        let day2: number = d2.getDate();
        if (day1 === 31) {
            day1 = 30;
        }
        if (day2 === 31) {
            day2 = 30;
        }
        return (y2 - y1) * 360 + (m2 - m1) * 30 + (day2 - day1);
    }

    /**
     * addMonths helper.
     *
     * @param {Date} date - date argument.
     * @param {number} months - months argument.
     * @returns {Date} - addMonths result.
     */
    private addMonths(date: Date, months: number): Date {
        const d: Date = new Date(date.getTime());
        d.setMonth(d.getMonth() + months);
        return d;
    }
}
