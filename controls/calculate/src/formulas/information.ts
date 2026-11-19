import { FormulasErrorsStrings, IBasicFormula } from '../common/index';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Type and content inspection functions that classify cell values (numbers, text, errors).
 *
 * Registered functions: ISNUMBER.
 *
 * @hidden
 */
export class InformationFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'ISNUMBER', category: 'Information', description: 'Returns TRUE, if the argument is number and FALSE otherwise.', syntax: 'ISNUMBER(value)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns TRUE, if the argument is number and FALSE otherwise.
     *
     * Excel: `ISNUMBER(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     *
     * @example
     * ```ts
     * engine.computeFormula('=ISNUMBER(1)');
     * ```
     */
    public ComputeISNUMBER(...args: string[]): boolean | string {
        const argArr: string[] = args;
        let isNestedFormula: boolean;
        if (argArr && argArr[argArr.length - 1] === 'nestedFormulaTrue') {
            isNestedFormula = true;
            argArr.pop();
        }
        if (args.length === 1 && args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const orgValue: number | string = (this.parent.isCellReference(argArr[0])) ? this.parent.getValueFromArg(argArr[0]) :
            this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join(''));
        if (orgValue.toString() === '' || args.toString().startsWith(this.parent.tic)) { return isNestedFormula ? '0' : false; }
        const isLogVal: boolean = !isNaN(this.parent.parseFloat(orgValue));
        return isNestedFormula ? (isLogVal ? '1' : '0') : isLogVal;
    }
}
