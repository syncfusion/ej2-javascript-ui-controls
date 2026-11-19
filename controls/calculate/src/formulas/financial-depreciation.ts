import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Asset depreciation schedules including straight-line, declining-balance, and SYD methods.
 *
 * Registered functions: SLN, SYD, DB, DDB.
 *
 * @hidden
 */
export class FinancialDepreciationFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'SLN', category: 'Financial', description: 'Returns the straight-line depreciation of an asset for one period.', syntax: 'SLN(cost, salvage, life)' },
        { formulaName: 'SYD', category: 'Financial', description: 'Returns the sum-of-years digits depreciation for a specified period.', syntax: 'SYD(cost, salvage, life, per)' },
        { formulaName: 'DB', category: 'Financial', description: 'Returns the depreciation of an asset for a period using fixed-declining balance.', syntax: 'DB(cost, salvage, life, period, [month])' },
        { formulaName: 'DDB', category: 'Financial', description: 'Returns the depreciation of an asset for a period using double-declining balance.', syntax: 'DDB(cost, salvage, life, period, [factor])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the straight-line depreciation of an asset for one period.
     *
     * Excel: `SLN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=SLN(1)');
     * ```
     */
    public ComputeSLN(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const cost: number | string = this.resolveNumberArg(args[0]);
        const salvage: number | string = this.resolveNumberArg(args[1]);
        const life: number | string = this.resolveNumberArg(args[2]);
        if (typeof cost === 'string') { return cost; }
        if (typeof salvage === 'string') { return salvage; }
        if (typeof life === 'string') { return life; }
        if (life === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        return ((cost - salvage) / life).toString();
    }

    /**
     * Returns the sum-of-years digits depreciation for a specified period.
     *
     * Excel: `SYD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSYD(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const cost: number | string = this.resolveNumberArg(args[0]);
        const salvage: number | string = this.resolveNumberArg(args[1]);
        const life: number | string = this.resolveNumberArg(args[2]);
        const per: number | string = this.resolveNumberArg(args[3]);
        if (typeof cost === 'string') { return cost; }
        if (typeof salvage === 'string') { return salvage; }
        if (typeof life === 'string') { return life; }
        if (typeof per === 'string') { return per; }
        if (life <= 0 || per <= 0 || per > life) {
            return errCollection[CommonErrors.Num];
        }
        const sumYears: number = life * (life + 1) / 2;
        const depreciation: number = (cost - salvage) * (life - per + 1) / sumYears;
        return depreciation.toString();
    }

    /**
     * Returns the depreciation of an asset for a period using fixed-declining balance.
     *
     * Excel: `DB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDB(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 4 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const cost: number | string = this.resolveNumberArg(args[0]);
        const salvage: number | string = this.resolveNumberArg(args[1]);
        const life: number | string = this.resolveNumberArg(args[2]);
        const period: number | string = this.resolveNumberArg(args[3]);
        if (typeof cost === 'string') { return cost; }
        if (typeof salvage === 'string') { return salvage; }
        if (typeof life === 'string') { return life; }
        if (typeof period === 'string') { return period; }
        let month: number = 12;
        if (args.length === 5) {
            const m: number | string = this.resolveNumberArg(args[4]);
            if (typeof m === 'string') { return m; }
            month = Math.floor(m);
        }
        if (life <= 0 || period <= 0) {
            return errCollection[CommonErrors.Num];
        }
        const rate: number = 1 - Math.pow(salvage / cost, 1 / life);
        let totalDep: number = 0;
        for (let p: number = 1; p <= Math.floor(period); p++) {
            const dep: number = (cost - totalDep) * rate * (p === 1 ? month / 12 : 1);
            totalDep += dep;
        }
        const frac: number = period - Math.floor(period);
        if (frac > 0) {
            totalDep += (cost - totalDep) * rate * frac;
        }
        if (Math.floor(period) === 1) {
            return (totalDep).toString();
        }
        let prev: number = 0;
        for (let p: number = 1; p < Math.floor(period); p++) {
            const dep: number = (cost - prev) * rate * (p === 1 ? month / 12 : 1);
            prev += dep;
        }
        return (totalDep - prev).toString();
    }

    /**
     * Returns the depreciation of an asset for a period using double-declining balance.
     *
     * Excel: `DDB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDDB(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 4 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const cost: number | string = this.resolveNumberArg(args[0]);
        const salvage: number | string = this.resolveNumberArg(args[1]);
        const life: number | string = this.resolveNumberArg(args[2]);
        const period: number | string = this.resolveNumberArg(args[3]);
        if (typeof cost === 'string') { return cost; }
        if (typeof salvage === 'string') { return salvage; }
        if (typeof life === 'string') { return life; }
        if (typeof period === 'string') { return period; }
        let factor: number = 2;
        if (args.length === 5) {
            const f: number | string = this.resolveNumberArg(args[4]);
            if (typeof f === 'string') { return f; }
            factor = f;
        }
        if (life <= 0 || period <= 0) {
            return errCollection[CommonErrors.Num];
        }
        const rate: number = factor / life;
        let book: number = cost;
        let dep: number = 0;
        for (let p: number = 1; p <= Math.floor(period); p++) {
            dep = Math.min(book * rate, book - salvage);
            book -= dep;
        }
        const frac: number = period - Math.floor(period);
        if (frac > 0) {
            dep = Math.min(book * rate * frac, (book - salvage) * frac);
        }
        return dep.toString();
    }
}
