import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Advanced text parsing, regex-style extraction, and structured text transforms.
 *
 * Registered functions: ASC, TEXTBEFORE, VALUETOTEXT, ARRAYTOTEXT.
 *
 * @hidden
 */
export class TextAdvancedFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'ASC', category: 'Text', description: 'Changes full-width characters to half-width.', syntax: 'ASC(text)' },
        { formulaName: 'TEXTBEFORE', category: 'Text', description: 'Returns text before a given character or string.', syntax: 'TEXTBEFORE(text, delimiter, [instance_num], [match_mode], [match_end], [if_not_found])' },
        { formulaName: 'VALUETOTEXT', category: 'Text', description: 'Returns text from any specified value.', syntax: 'VALUETOTEXT(value, [format])' },
        { formulaName: 'ARRAYTOTEXT', category: 'Text', description: 'Returns the text representation of an array.', syntax: 'ARRAYTOTEXT(array, [format])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Changes full-width characters to half-width.
     *
     * Excel: `ASC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=ASC(1)');
     * ```
     */
    public ComputeASC(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (this.parent.getErrorStrings().indexOf(text) > -1) {
            return text;
        }
        let result: string = '';
        for (let i: number = 0; i < text.length; i++) {
            const code: number = text.charCodeAt(i);
            if (code >= 0xFF01 && code <= 0xFF5E) {
                result += String.fromCharCode(code - 0xFEE0);
            } else if (code === 0x3000) {
                result += ' ';
            } else {
                result += text.charAt(i);
            }
        }
        return result;
    }

    /**
     * Returns text before a given character or string.
     *
     * Excel: `TEXTBEFORE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTEXTBEFORE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 6) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        const delimiter: string = this.resolveTextArg(args[1]);
        if (errCollection.indexOf(delimiter) > -1) {
            return delimiter;
        }
        let instance: number = 1;
        if (args.length >= 3 && args[2] !== '') {
            const inst: number | string = this.resolveNumberArg(args[2]);
            if (typeof inst === 'string') {
                return inst;
            }
            instance = Math.floor(inst);
            if (instance < 1) {
                return errCollection[CommonErrors.Value];
            }
        }
        let start: number = 0;
        for (let i: number = 0; i < instance; i++) {
            const idx: number = text.indexOf(delimiter, start);
            if (idx < 0) {
                if (args.length >= 6 && args[5] !== '') {
                    return this.resolveTextArg(args[5]);
                }
                return errCollection[CommonErrors.NA];
            }
            if (i === instance - 1) {
                return text.substring(0, idx);
            }
            start = idx + delimiter.length;
        }
        return text;
    }

    /**
     * Returns text from any specified value.
     *
     * Excel: `VALUETOTEXT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeVALUETOTEXT(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const val: string = this.parent.getValueFromArg(args[0]);
        if (errCollection.indexOf(val) > -1) {
            return val;
        }
        if (val === '') {
            return '';
        }
        let concise: boolean = true;
        if (args.length === 2) {
            const fmt: number | string = this.resolveNumberArg(args[1]);
            if (typeof fmt === 'string') {
                return fmt;
            }
            concise = fmt === 0;
        }
        if (!concise && !this.parent.isCellReference(args[0]) && args[0].indexOf(this.parent.tic) > -1) {
            return this.parent.removeTics(val);
        }
        return val;
    }

    /**
     * Returns the text representation of an array.
     *
     * Excel: `ARRAYTOTEXT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeARRAYTOTEXT(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const parts: string[] = [];
        const collect: (arg: string) => string | null = (arg: string): string | null => {
            if (this.parent.isCellReference(arg) && arg.indexOf(':') > -1) {
                const cells: string[] | string = this.parent.getCellCollection(arg);
                const list: string[] = Array.isArray(cells) ? cells : [cells];
                for (let i: number = 0; i < list.length; i++) {
                    const val: string = this.parent.getValueFromArg(list[i as number]);
                    if (errCollection.indexOf(val) > -1) {
                        return val;
                    }
                    parts.push(val);
                }
            } else {
                const val: string = this.resolveTextArg(arg);
                if (errCollection.indexOf(val) > -1) {
                    return val;
                }
                parts.push(val);
            }
            return null;
        };
        const err: string | null = collect(args[0]);
        if (err) {
            return err;
        }
        return parts.join(this.parent.getParseArgumentSeparator());
    }
}
