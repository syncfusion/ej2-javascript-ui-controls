import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { getAlphalabel } from '../base/index';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Cell and range reference utilities: ADDRESS, INDIRECT, OFFSET, and sheet-aware lookups.
 *
 * Registered functions: ROW, ROWS, COLUMN, COLUMNS, HYPERLINK, OFFSET.
 *
 * @hidden
 */
export class LookupRefFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'ROW', category: 'Lookup & Reference', description: 'Returns the row number of a reference.', syntax: 'ROW([reference])' },
        { formulaName: 'ROWS', category: 'Lookup & Reference', description: 'Returns the number of rows in a reference.', syntax: 'ROWS(array)' },
        { formulaName: 'COLUMN', category: 'Lookup & Reference', description: 'Returns the column number of a reference.', syntax: 'COLUMN([reference])' },
        { formulaName: 'COLUMNS', category: 'Lookup & Reference', description: 'Returns the number of columns in a reference.', syntax: 'COLUMNS(array)' },
        { formulaName: 'HYPERLINK', category: 'Lookup & Reference', description: 'Creates a shortcut that opens a document on a network server, intranet, or Internet.', syntax: 'HYPERLINK(link_location, [friendly_name])' },
        { formulaName: 'OFFSET', category: 'Lookup & Reference', description: 'Returns a reference offset from a given reference.', syntax: 'OFFSET(reference, rows, cols, [height], [width])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the row number of a reference.
     *
     * Excel: `ROW(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=ROW(1)');
     * ```
     */
    public ComputeROW(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            const act: string = this.parent.actCell || this.parent.cell || 'A1';
            const cell: string = act.indexOf('!') > -1 ? act.substring(act.lastIndexOf('!') + 1) : act;
            return this.parent.rowIndex(cell).toString();
        }
        if (args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const ref: string = args[0].split('$').join('');
        if (!this.parent.isCellReference(ref.split(':')[0])) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        const first: string = ref.indexOf(':') > -1 ? ref.split(':')[0] : ref;
        const stripped: string = first.indexOf('!') > -1 ? first.substring(first.lastIndexOf('!') + 1) : first;
        return this.parent.rowIndex(stripped).toString();
    }

    /**
     * Returns the column number of a reference.
     *
     * Excel: `COLUMN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOLUMN(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            const act: string = this.parent.actCell || this.parent.cell || 'A1';
            const cell: string = act.indexOf('!') > -1 ? act.substring(act.lastIndexOf('!') + 1) : act;
            return this.parent.colIndex(cell).toString();
        }
        if (args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const ref: string = args[0].split('$').join('');
        if (!this.parent.isCellReference(ref.split(':')[0])) {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        }
        const first: string = ref.indexOf(':') > -1 ? ref.split(':')[0] : ref;
        const stripped: string = first.indexOf('!') > -1 ? first.substring(first.lastIndexOf('!') + 1) : first;
        return this.parent.colIndex(stripped).toString();
    }

    /**
     * Returns the number of rows in a reference.
     *
     * Excel: `ROWS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeROWS(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1 || args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const ref: string = args[0].split('$').join('');
        if (ref.indexOf(':') === -1) {
            if (!this.parent.isCellReference(ref)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            return '1';
        }
        const parts: string[] = ref.split(':');
        const a: string = parts[0].indexOf('!') > -1 ? parts[0].substring(parts[0].lastIndexOf('!') + 1) : parts[0];
        const b: string = parts[1].indexOf('!') > -1 ? parts[1].substring(parts[1].lastIndexOf('!') + 1) : parts[1];
        return (Math.abs(this.parent.rowIndex(b) - this.parent.rowIndex(a)) + 1).toString();
    }

    /**
     * Returns the number of columns in a reference.
     *
     * Excel: `COLUMNS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOLUMNS(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1 || args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const ref: string = args[0].split('$').join('');
        if (ref.indexOf(':') === -1) {
            if (!this.parent.isCellReference(ref)) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            return '1';
        }
        const parts: string[] = ref.split(':');
        const a: string = parts[0].indexOf('!') > -1 ? parts[0].substring(parts[0].lastIndexOf('!') + 1) : parts[0];
        const b: string = parts[1].indexOf('!') > -1 ? parts[1].substring(parts[1].lastIndexOf('!') + 1) : parts[1];
        return (Math.abs(this.parent.colIndex(b) - this.parent.colIndex(a)) + 1).toString();
    }

    /**
     * Creates a shortcut that opens a document on a network server, intranet, or Internet.
     *
     * Excel: `HYPERLINK(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeHYPERLINK(...args: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const link: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(link) > -1) {
            return link;
        }
        if (args.length === 2) {
            const friendly: string = this.resolveTextArg(args[1]);
            if (errCollection.indexOf(friendly) > -1) {
                return friendly;
            }
            return friendly;
        }
        return link;
    }

    /**
     * Returns a reference offset from a given reference.
     *
     * Excel: `OFFSET(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeOFFSET(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const ref: string = args[0].split('$').join('');
        if (!this.parent.isCellReference(ref.split(':')[0])) {
            return errCollection[CommonErrors.Value];
        }
        const rows: number | string = this.resolveNumberArg(args[1]);
        const cols: number | string = this.resolveNumberArg(args[2]);
        if (typeof rows === 'string') {
            return rows;
        }
        if (typeof cols === 'string') {
            return cols;
        }
        let height: number = 1;
        let width: number = 1;
        if (args.length >= 4 && args[3] !== '') {
            const h: number | string = this.resolveNumberArg(args[3]);
            if (typeof h === 'string') {
                return h;
            }
            height = Math.floor(h);
        }
        if (args.length === 5 && args[4] !== '') {
            const w: number | string = this.resolveNumberArg(args[4]);
            if (typeof w === 'string') {
                return w;
            }
            width = Math.floor(w);
        }
        if (height < 1 || width < 1) {
            return errCollection[CommonErrors.Ref];
        }
        const first: string = ref.indexOf(':') > -1 ? ref.split(':')[0] : ref;
        const sheet: string = first.indexOf('!') > -1 ? first.substring(0, first.lastIndexOf('!') + 1) : '';
        const cell: string = first.indexOf('!') > -1 ? first.substring(first.lastIndexOf('!') + 1) : first;
        const baseRow: number = this.parent.rowIndex(cell) + Math.floor(rows);
        const baseCol: number = this.parent.colIndex(cell) + Math.floor(cols);
        if (baseRow < 1 || baseCol < 1) {
            return errCollection[CommonErrors.Ref];
        }
        const start: string = sheet + getAlphalabel(baseCol) + baseRow;
        if (height === 1 && width === 1) {
            return this.parent.getValueFromArg(start);
        }
        return this.parent.getValueFromArg(start) || start;
    }
}
