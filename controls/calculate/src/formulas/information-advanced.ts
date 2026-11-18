import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

type InfoType = 'system' | 'release' | 'numfile' | 'directory' | 'origin' | 'recalc' | 'memavail' | 'memused';

/**
 * Advanced information utilities including SHEET, SHEETS, and structured reference introspection.
 *
 * Registered functions: INFO, CELL.
 *
 * @hidden
 */
export class InformationAdvancedFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'INFO', category: 'Information', description: 'Returns information about the current operating environment.', syntax: 'INFO(type_text)' },
        { formulaName: 'CELL', category: 'Information', description: 'Returns information about the formatting, location, or contents of a cell.', syntax: 'CELL(info_type, [reference])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns information about the current operating environment.
     *
     * Excel: `INFO(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=INFO(1)');
     * ```
     */
    public ComputeINFO(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const typeText: string = this.resolveTextArg(args[0]).toLowerCase();
        if (errCollection.indexOf(typeText) > -1) {
            return typeText;
        }
        const validTypes: InfoType[] = ['system', 'release', 'numfile', 'directory', 'origin', 'recalc', 'memavail', 'memused'];
        if (validTypes.indexOf(typeText as InfoType) === -1) {
            return errCollection[CommonErrors.NA];
        }
        const infoType: InfoType = typeText as InfoType;
        switch (infoType) {
        case 'system':
            return 'pcdos';
        case 'release':
            return '16.0';
        case 'numfile':
            return '1';
        case 'directory':
            return '/';
        case 'origin':
            return 'A1';
        case 'recalc':
            return (this.parent.parentObject as { calculationMode?: string }).calculationMode === 'Manual' ? 'Manual' : 'Automatic';
        case 'memavail':
            return '1048576';
        case 'memused':
            return '0';
        default: {
            const _exhaustive: never = infoType;
            return _exhaustive;
        }
        }
    }

    /**
     * Returns information about the formatting, location, or contents of a cell.
     *
     * Excel: `CELL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCELL(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const infoType: string = this.resolveTextArg(args[0]).toLowerCase();
        if (errCollection.indexOf(infoType) > -1) {
            return infoType;
        }
        let ref: string = args.length === 2 ? args[1] : (this.parent.actCell || this.parent.cell || 'A1');
        ref = ref.split('$').join('');
        if (!this.parent.isCellReference(ref.split(':')[0])) {
            return errCollection[CommonErrors.Value];
        }
        const cell: string = ref.indexOf(':') > -1 ? ref.split(':')[0] : ref;
        const stripped: string = cell.indexOf('!') > -1 ? cell.substring(cell.lastIndexOf('!') + 1) : cell;
        const value: string = this.parent.getValueFromArg(cell);
        switch (infoType) {
        case 'address':
            return '$' + stripped.replace(/([A-Z]+)(\d+)/, '$1$$$2');
        case 'col':
            return this.parent.colIndex(stripped).toString();
        case 'row':
            return this.parent.rowIndex(stripped).toString();
        case 'contents':
            return value;
        case 'format':
            return 'G';
        case 'prefix':
            return '';
        case 'protect':
            return '0';
        case 'type':
            if (value === '') {
                return 'b';
            }
            if (this.parent.isNumber(value)) {
                return 'v';
            }
            return 'l';
        case 'width':
            return '8';
        case 'parentheses':
            return '0';
        default:
            return errCollection[CommonErrors.NA];
        }
    }
}
