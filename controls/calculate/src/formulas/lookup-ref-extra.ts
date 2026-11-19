import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Supplementary reference helpers for row/column indexing and dynamic range resolution.
 *
 * Registered functions: INDIRECT, AREAS, FORMULATEXT, ISREF.
 *
 * @hidden
 */
export class LookupRefExtraFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'INDIRECT', category: 'Lookup & Reference', description: 'Returns a reference indicated by a text value.', syntax: 'INDIRECT(ref_text, [a1])' },
        { formulaName: 'AREAS', category: 'Lookup & Reference', description: 'Returns the number of areas in a reference.', syntax: 'AREAS(reference)' },
        { formulaName: 'FORMULATEXT', category: 'Lookup & Reference', description: 'Returns the formula in a cell as text.', syntax: 'FORMULATEXT(reference)' },
        { formulaName: 'ISREF', category: 'Information', description: 'Returns TRUE if the value is a reference.', syntax: 'ISREF(value)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns a reference indicated by a text value.
     *
     * Excel: `INDIRECT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=INDIRECT(1)');
     * ```
     */
    public ComputeINDIRECT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let refText: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(refText) > -1) {
            return refText;
        }
        refText = refText.split('$').join('');
        let a1Style: boolean = true;
        if (args.length === 2) {
            const style: number | string = this.resolveNumberArg(args[1]);
            if (typeof style === 'string') {
                return style;
            }
            a1Style = style !== 0;
        }
        if (!a1Style) {
            return errCollection[CommonErrors.Value];
        }
        if (!this.parent.isCellReference(refText.split(':')[0])) {
            return errCollection[CommonErrors.Ref];
        }
        if (refText.indexOf(':') > -1) {
            const cells: string[] | string = this.parent.getCellCollection(refText);
            const list: string[] = Array.isArray(cells) ? cells : [cells];
            const values: string[] = [];
            for (let i: number = 0; i < list.length; i++) {
                const val: string = this.parent.getValueFromArg(list[i as number]);
                if (errCollection.indexOf(val) > -1) {
                    return val;
                }
                values.push(val);
            }
            return values.join(this.parent.getParseArgumentSeparator());
        }
        return this.parent.getValueFromArg(refText);
    }

    /**
     * Returns the number of areas in a reference.
     *
     * Excel: `AREAS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeAREAS(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const ref: string = args[0].split('$').join('');
        if (!this.parent.isCellReference(ref.split(':')[0]) && ref.indexOf('(') === -1) {
            return errCollection[CommonErrors.Value];
        }
        if (ref.indexOf(',') > -1) {
            return ref.split(',').length.toString();
        }
        return '1';
    }

    /**
     * Returns the formula in a cell as text.
     *
     * Excel: `FORMULATEXT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFORMULATEXT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const ref: string = args[0].split('$').join('');
        if (!this.parent.isCellReference(ref)) {
            return errCollection[CommonErrors.Value];
        }
        const sheetPrefix: string = ref.indexOf('!') > -1 ? ref.substring(0, ref.lastIndexOf('!') + 1) : '';
        const cell: string = ref.indexOf('!') > -1 ? ref.substring(ref.lastIndexOf('!') + 1) : ref;
        const key: string = '!' + this.parent.getSheetID(this.parent.grid) + '!' + cell;
        const fullKey: string = sheetPrefix ? ref : key;
        const infoTable: Map<string, { getFormulaText: () => string }> = this.parent.getFormulaInfoTable();
        const lookupKey: string = sheetPrefix ? fullKey : key;
        if (infoTable.has(lookupKey)) {
            return infoTable.get(lookupKey).getFormulaText();
        }
        return errCollection[CommonErrors.NA];
    }

    /**
     * Returns TRUE if the value is a reference.
     *
     * Excel: `ISREF(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {boolean} - Boolean result, nested-formula numeric string (`"0"`/`"1"`), or an Excel error token.
     */
    public ComputeISREF(...args: string[]): boolean | string {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const ref: string = args[0].split('$').join('');
        return this.parent.isCellReference(ref.split(':')[0]);
    }
}
