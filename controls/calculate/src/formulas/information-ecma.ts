import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * ECMA information helpers such as ERROR.TYPE for classifying error values.
 *
 * Registered functions: ERROR.TYPE.
 *
 * @hidden
 */
export class InformationEcmaFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'ERROR.TYPE', category: 'Information', description: 'Returns a number corresponding to an error type.', syntax: 'ERROR.TYPE(error_val)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns a number corresponding to an error type.
     *
     * Excel: `ERROR.TYPE(...)`.
     *
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=ERROR.TYPE(1)');
     * ```
     */
    public ['ComputeERROR.TYPE'](...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const val: string = this.parent.getValueFromArg(args[0]);
        const map: Record<string, number> = {
            '#NULL!': 1,
            '#DIV/0!': 2,
            '#VALUE!': 3,
            '#REF!': 4,
            '#NAME?': 5,
            '#NUM!': 6,
            '#N/A': 7,
            '#GETTING_DATA': 8
        };
        // eslint-disable-next-line security/detect-object-injection
        if (map[val] !== undefined) {
            // eslint-disable-next-line security/detect-object-injection
            return map[val].toString();
        }
        for (let i: number = 0; i < errCollection.length; i++) {
            if (val === errCollection[i as number]) {
                const idx: number = i + 1;
                if (idx >= 1 && idx <= 8) {
                    return idx.toString();
                }
            }
        }
        return errCollection[CommonErrors.NA];
    }
}
