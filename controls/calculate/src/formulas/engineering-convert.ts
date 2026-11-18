import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

type UnitEntry = { from: string, to: string, factor: number };

/**
 * Unit conversion between engineering measurement systems via the CONVERT function.
 *
 * Registered functions: CONVERT.
 *
 * @hidden
 */
export class EngineeringConvertFormulas extends FormulaModuleBase {
    private static readonly UNITS: UnitEntry[] = [
        { from: 'g', to: 'kg', factor: 0.001 },
        { from: 'kg', to: 'g', factor: 1000 },
        { from: 'lbm', to: 'kg', factor: 0.45359237 },
        { from: 'kg', to: 'lbm', factor: 2.2046226218 },
        { from: 'm', to: 'ft', factor: 3.280839895 },
        { from: 'ft', to: 'm', factor: 0.3048 },
        { from: 'in', to: 'm', factor: 0.0254 },
        { from: 'm', to: 'in', factor: 39.37007874 },
        { from: 'mi', to: 'm', factor: 1609.344 },
        { from: 'm', to: 'mi', factor: 1 / 1609.344 },
        { from: 'yr', to: 'day', factor: 365.25 },
        { from: 'day', to: 'yr', factor: 1 / 365.25 },
        { from: 'hr', to: 'sec', factor: 3600 },
        { from: 'sec', to: 'hr', factor: 1 / 3600 },
        { from: 'C', to: 'F', factor: NaN },
        { from: 'F', to: 'C', factor: NaN },
        { from: 'l', to: 'm3', factor: 0.001 },
        { from: 'm3', to: 'l', factor: 1000 },
        { from: 'N', to: 'lbf', factor: 0.224808943 },
        { from: 'lbf', to: 'N', factor: 4.4482216153 }
    ];

    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'CONVERT', category: 'Engineering', description: 'Converts a number from one measurement system to another.', syntax: 'CONVERT(number, from_unit, to_unit)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Converts a number from one measurement system to another.
     *
     * Excel: `CONVERT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=CONVERT(1)');
     * ```
     */
    public ComputeCONVERT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const num: number | string = this.resolveNumberArg(args[0]);
        if (typeof num === 'string') {
            return num;
        }
        const fromUnit: string = this.resolveTextArg(args[1]).toLowerCase();
        const toUnit: string = this.resolveTextArg(args[2]).toLowerCase();
        if (errCollection.indexOf(fromUnit) > -1) {
            return fromUnit;
        }
        if (errCollection.indexOf(toUnit) > -1) {
            return toUnit;
        }
        if (fromUnit === toUnit) {
            return num.toString();
        }
        if (fromUnit === 'c' && toUnit === 'f') {
            return (num * 9 / 5 + 32).toString();
        }
        if (fromUnit === 'f' && toUnit === 'c') {
            return ((num - 32) * 5 / 9).toString();
        }
        for (const entry of EngineeringConvertFormulas.UNITS) {
            if (entry.from === fromUnit && entry.to === toUnit && !isNaN(entry.factor)) {
                return (num * entry.factor).toString();
            }
        }
        const viaBase: UnitEntry | undefined = EngineeringConvertFormulas.UNITS.find(
            (e: UnitEntry) => e.from === fromUnit && !isNaN(e.factor));
        const viaBaseTo: string | undefined = viaBase ? viaBase.to : undefined;
        const toBase: UnitEntry | undefined = EngineeringConvertFormulas.UNITS.find(
            (e: UnitEntry) => e.to === toUnit && e.from === viaBaseTo && !isNaN(e.factor));
        if (viaBase && toBase) {
            return (num * viaBase.factor * toBase.factor).toString();
        }
        return errCollection[CommonErrors.NA];
    }
}
