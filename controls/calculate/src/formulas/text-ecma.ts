import { FormulasErrorsStrings, IBasicFormula } from '../common/index';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * ECMA text function aliases and byte-oriented variants (FINDB, LENB, USDOLLAR).
 *
 * Registered functions: USDOLLAR, FINDB, LENB.
 *
 * @hidden
 */
export class TextEcmaFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'USDOLLAR', category: 'Text', description: 'Converts a number to text using currency format (US dollar).', syntax: 'USDOLLAR(number, [decimals])' },
        { formulaName: 'FINDB', category: 'Text', description: 'Finds text within another string (byte-count alias of FIND).', syntax: 'FINDB(find_text, within_text, [start_num])' },
        { formulaName: 'LENB', category: 'Text', description: 'Returns the length of a text string (byte-count alias of LEN).', syntax: 'LENB(text)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Converts a number to text using currency format (US dollar).
     *
     * Excel: `USDOLLAR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=USDOLLAR(1)');
     * ```
     */
    public ComputeUSDOLLAR(...args: string[]): string | number {
        const fn: Function = this.owner['ComputeDOLLAR'] as Function;
        if (fn) {
            return fn(...args);
        }
        return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
    }

    /**
     * Finds text within another string (byte-count alias of FIND).
     *
     * Excel: `FINDB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFINDB(...args: string[]): string | number {
        const fn: Function = this.owner['ComputeFIND'] as Function;
        if (fn) {
            return fn(...args);
        }
        return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
    }

    /**
     * Returns the length of a text string (byte-count alias of LEN).
     *
     * Excel: `LENB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeLENB(...args: string[]): string | number {
        const fn: Function = this.owner['ComputeLEN'] as Function;
        if (fn) {
            return fn(...args);
        }
        return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
    }
}
