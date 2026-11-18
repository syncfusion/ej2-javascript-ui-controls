import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Hyperbolic trigonometric functions and their inverses for exponential growth/decay modeling.
 *
 * Registered functions: ACOSH, ASINH, ATANH.
 *
 * @hidden
 */
export class MathTrigHyperbolicFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'ACOSH', category: 'Math & Trig', description: 'Returns the inverse hyperbolic cosine of a number.', syntax: 'ACOSH(number)' },
        { formulaName: 'ASINH', category: 'Math & Trig', description: 'Returns the inverse hyperbolic sine of a number.', syntax: 'ASINH(number)' },
        { formulaName: 'ATANH', category: 'Math & Trig', description: 'Returns the inverse hyperbolic tangent of a number.', syntax: 'ATANH(number)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private unaryMath(args: string[], fn: (n: number) => number, domainCheck?: (n: number) => boolean): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1 || args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const num: number | string = this.resolveNumberArg(args[0]);
        if (typeof num === 'string') {
            return num;
        }
        if (domainCheck && !domainCheck(num)) {
            return errCollection[CommonErrors.Num];
        }
        const result: number = fn(num);
        if (!isFinite(result)) {
            return errCollection[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * Returns the inverse hyperbolic cosine of a number.
     *
     * Excel: `ACOSH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=ACOSH(1)');
     * ```
     */
    public ComputeACOSH(...args: string[]): string | number {
        return this.unaryMath(args, Math.acosh, (n: number) => n >= 1);
    }

    /**
     * Returns the inverse hyperbolic sine of a number.
     *
     * Excel: `ASINH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeASINH(...args: string[]): string | number {
        return this.unaryMath(args, Math.asinh);
    }

    /**
     * Returns the inverse hyperbolic tangent of a number.
     *
     * Excel: `ATANH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeATANH(...args: string[]): string | number {
        return this.unaryMath(args, Math.atanh, (n: number) => n > -1 && n < 1);
    }
}
