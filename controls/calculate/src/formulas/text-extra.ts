import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Extended text functions for search, replace, formatting, and character-code conversion.
 *
 * Registers 19 functions including LEFT, RIGHT, MID, UPPER, LOWER, and others.
 *
 * @hidden
 */
export class TextExtraFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'LEFT', category: 'Text', description: 'Returns the leftmost characters from a text value.', syntax: 'LEFT(text, [num_chars])' },
        { formulaName: 'RIGHT', category: 'Text', description: 'Returns the rightmost characters from a text value.', syntax: 'RIGHT(text, [num_chars])' },
        { formulaName: 'MID', category: 'Text', description: 'Returns a specific number of characters from a text string starting at the position you specify.', syntax: 'MID(text, start_num, num_chars)' },
        { formulaName: 'UPPER', category: 'Text', description: 'Converts text to uppercase.', syntax: 'UPPER(text)' },
        { formulaName: 'LOWER', category: 'Text', description: 'Converts text to lowercase.', syntax: 'LOWER(text)' },
        { formulaName: 'TRIM', category: 'Text', description: 'Removes spaces from text except for single spaces between words.', syntax: 'TRIM(text)' },
        { formulaName: 'REPLACE', category: 'Text', description: 'Replaces characters within text.', syntax: 'REPLACE(old_text, start_num, num_chars, new_text)' },
        { formulaName: 'SUBSTITUTE', category: 'Text', description: 'Substitutes new text for old text in a text string.', syntax: 'SUBSTITUTE(text, old_text, new_text, [instance_num])' },
        { formulaName: 'REPT', category: 'Text', description: 'Repeats text a given number of times.', syntax: 'REPT(text, number_times)' },
        { formulaName: 'SEARCH', category: 'Text', description: 'Finds one text value within another (not case-sensitive).', syntax: 'SEARCH(find_text, within_text, [start_num])' },
        { formulaName: 'VALUE', category: 'Text', description: 'Converts a text argument to a number.', syntax: 'VALUE(text)' },
        { formulaName: 'CLEAN', category: 'Text', description: 'Removes all nonprintable characters from text.', syntax: 'CLEAN(text)' },
        { formulaName: 'FIXED', category: 'Text', description: 'Formats a number as text with a fixed number of decimals.', syntax: 'FIXED(number, [decimals], [no_commas])' },
        { formulaName: 'TEXTJOIN', category: 'Text', description: 'Combines text from multiple ranges/strings with a delimiter.', syntax: 'TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)' },
        { formulaName: 'LEFTB', category: 'Text', description: 'Returns the leftmost characters from a text value (byte count alias).', syntax: 'LEFTB(text, [num_bytes])' },
        { formulaName: 'RIGHTB', category: 'Text', description: 'Returns the rightmost characters from a text value (byte count alias).', syntax: 'RIGHTB(text, [num_bytes])' },
        { formulaName: 'MIDB', category: 'Text', description: 'Returns characters from a text string (byte count alias).', syntax: 'MIDB(text, start_num, num_bytes)' },
        { formulaName: 'REPLACEB', category: 'Text', description: 'Replaces characters within text (byte count alias).', syntax: 'REPLACEB(old_text, start_num, num_bytes, new_text)' },
        { formulaName: 'SEARCHB', category: 'Text', description: 'Finds one text value within another (byte count alias).', syntax: 'SEARCHB(find_text, within_text, [start_num])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the leftmost characters from a text value.
     *
     * Excel: `LEFT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=LEFT("Calculate",4)');
     * ```
     */
    public ComputeLEFT(...args: string[]): string {
        return this.substringSide(args, true);
    }

    /**
     * Returns the rightmost characters from a text value.
     *
     * Excel: `RIGHT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeRIGHT(...args: string[]): string {
        return this.substringSide(args, false);
    }

    private substringSide(args: string[], fromLeft: boolean): string {
        let nestedFormula: boolean;
        if (args && args.length > 0 && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        let count: number = 1;
        if (args.length === 2) {
            const num: number | string = this.resolveNumberArg(args[1]);
            if (typeof num === 'string') {
                return num;
            }
            count = Math.floor(num);
            if (count < 0) {
                return errCollection[CommonErrors.Value];
            }
        }
        const result: string = fromLeft ? text.substring(0, count) : (count >= text.length ? text : text.substring(text.length - count));
        return nestedFormula ? this.parent.tic + result + this.parent.tic : result;
    }

    /**
     * Returns a specific number of characters from a text string starting at the position you specify.
     *
     * Excel: `MID(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeMID(...args: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        const start: number | string = this.resolveNumberArg(args[1]);
        const numChars: number | string = this.resolveNumberArg(args[2]);
        if (typeof start === 'string') {
            return start;
        }
        if (typeof numChars === 'string') {
            return numChars;
        }
        const startIdx: number = Math.floor(start);
        const length: number = Math.floor(numChars);
        if (startIdx < 1 || length < 0) {
            return errCollection[CommonErrors.Value];
        }
        return text.substring(startIdx - 1, startIdx - 1 + length);
    }

    /**
     * Converts text to uppercase.
     *
     * Excel: `UPPER(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeUPPER(...args: string[]): string {
        return this.caseTransform(args, true);
    }

    /**
     * Converts text to lowercase.
     *
     * Excel: `LOWER(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeLOWER(...args: string[]): string {
        return this.caseTransform(args, false);
    }

    private caseTransform(args: string[], upper: boolean): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        return upper ? text.toUpperCase() : text.toLowerCase();
    }

    /**
     * Removes spaces from text except for single spaces between words.
     *
     * Excel: `TRIM(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeTRIM(...args: string[]): string {
        let nestedFormula: boolean;
        if (args && args.length > 0 && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        const result: string = text.trim().replace(/\s+/g, ' ');
        return nestedFormula ? this.parent.tic + result + this.parent.tic : result;
    }

    /**
     * Replaces characters within text.
     *
     * Excel: `REPLACE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeREPLACE(...args: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        const start: number | string = this.resolveNumberArg(args[1]);
        const numChars: number | string = this.resolveNumberArg(args[2]);
        const newText: string = this.resolveTextArg(args[3]);
        if (typeof start === 'string') {
            return start;
        }
        if (typeof numChars === 'string') {
            return numChars;
        }
        if (errCollection.indexOf(newText) > -1) {
            return newText;
        }
        const startIdx: number = Math.floor(start);
        const length: number = Math.floor(numChars);
        if (startIdx < 1 || length < 0) {
            return errCollection[CommonErrors.Value];
        }
        return text.substring(0, startIdx - 1) + newText + text.substring(startIdx - 1 + length);
    }

    /**
     * Substitutes new text for old text in a text string.
     *
     * Excel: `SUBSTITUTE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeSUBSTITUTE(...args: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        const oldText: string = this.resolveTextArg(args[1]);
        const newText: string = this.resolveTextArg(args[2]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        if (errCollection.indexOf(oldText) > -1) {
            return oldText;
        }
        if (errCollection.indexOf(newText) > -1) {
            return newText;
        }
        if (oldText === '') {
            return text;
        }
        if (args.length === 3) {
            return text.split(oldText).join(newText);
        }
        const instance: number | string = this.resolveNumberArg(args[3]);
        if (typeof instance === 'string') {
            return instance;
        }
        const nth: number = Math.floor(instance);
        if (nth < 1) {
            return errCollection[CommonErrors.Value];
        }
        let found: number = 0;
        let index: number = text.indexOf(oldText);
        while (index > -1) {
            found++;
            if (found === nth) {
                return text.substring(0, index) + newText + text.substring(index + oldText.length);
            }
            index = text.indexOf(oldText, index + oldText.length);
        }
        return text;
    }

    /**
     * Repeats text a given number of times.
     *
     * Excel: `REPT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeREPT(...args: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        const times: number | string = this.resolveNumberArg(args[1]);
        if (typeof times === 'string') {
            return times;
        }
        const count: number = Math.floor(times);
        if (count < 0) {
            return errCollection[CommonErrors.Value];
        }
        if (count === 0 || text === '') {
            return '';
        }
        return new Array(count + 1).join(text);
    }

    /**
     * Finds one text value within another (not case-sensitive).
     *
     * Excel: `SEARCH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSEARCH(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const findText: string = this.resolveTextArg(args[0]).toLowerCase();
        const withinText: string = this.resolveTextArg(args[1]).toLowerCase();
        if (errCollection.indexOf(findText) > -1) {
            return findText;
        }
        if (errCollection.indexOf(withinText) > -1) {
            return withinText;
        }
        let startNum: number = 1;
        if (args.length === 3) {
            const start: number | string = this.resolveNumberArg(args[2]);
            if (typeof start === 'string') {
                return start;
            }
            startNum = Math.floor(start);
            if (startNum < 1) {
                return errCollection[CommonErrors.Value];
            }
        }
        const idx: number = withinText.indexOf(findText, startNum - 1);
        if (idx < 0) {
            return errCollection[CommonErrors.Value];
        }
        return (idx + 1).toString();
    }

    /**
     * Converts a text argument to a number.
     *
     * Excel: `VALUE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeVALUE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        if (text === '') {
            return '0';
        }
        const cleaned: string = text.replace(/,/g, '').replace(/\$/g, '').trim();
        const num: number = this.parent.parseFloat(cleaned);
        if (isNaN(num)) {
            return errCollection[CommonErrors.Value];
        }
        return num.toString();
    }

    /**
     * Removes all nonprintable characters from text.
     *
     * Excel: `CLEAN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeCLEAN(...args: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        let result: string = '';
        for (let i: number = 0; i < text.length; i++) {
            const code: number = text.charCodeAt(i);
            if (code >= 32) {
                result += text.charAt(i);
            }
        }
        return result;
    }

    /**
     * Formats a number as text with a fixed number of decimals.
     *
     * Excel: `FIXED(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeFIXED(...args: string[]): string {
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const number: number | string = this.resolveNumberArg(args[0]);
        if (typeof number === 'string') {
            return number;
        }
        let decimals: number = 2;
        if (args.length >= 2 && args[1] !== '') {
            const d: number | string = this.resolveNumberArg(args[1]);
            if (typeof d === 'string') {
                return d;
            }
            decimals = Math.floor(d);
        }
        let noCommas: boolean = false;
        if (args.length === 3 && args[2] !== '') {
            const flag: string = this.parent.getValueFromArg(args[2]).toUpperCase();
            noCommas = flag === this.parent.trueValue || this.parent.parseFloat(flag) !== 0;
        }
        if (decimals < 0) {
            const factor: number = Math.pow(10, -decimals);
            const rounded: number = Math.round(number / factor) * factor;
            return noCommas ? rounded.toString() : rounded.toLocaleString('en-US');
        }
        const fixed: string = number.toFixed(decimals);
        if (noCommas) {
            return fixed;
        }
        const parts: string[] = fixed.split('.');
        let intPart: string = parts[0];
        const sign: string = intPart.charAt(0) === '-' ? '-' : '';
        if (sign) {
            intPart = intPart.substring(1);
        }
        let grouped: string = '';
        for (let i: number = 0; i < intPart.length; i++) {
            const fromEnd: number = intPart.length - i;
            if (i > 0 && fromEnd % 3 === 0) {
                grouped += ',';
            }
            grouped += intPart.charAt(i);
        }
        parts[0] = sign + grouped;
        return parts.join('.');
    }

    /**
     * Combines text from multiple ranges/strings with a delimiter.
     *
     * Excel: `TEXTJOIN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeTEXTJOIN(...args: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const delimiter: string = this.resolveTextArg(args[0]);
        if (errCollection.indexOf(delimiter) > -1) {
            return delimiter;
        }
        const ignoreEmptyFlag: string = this.parent.getValueFromArg(args[1]).toUpperCase();
        const ignoreEmpty: boolean = ignoreEmptyFlag === this.parent.trueValue ||
            (!isNaN(this.parent.parseFloat(ignoreEmptyFlag)) && this.parent.parseFloat(ignoreEmptyFlag) !== 0);
        const parts: string[] = [];
        for (let i: number = 2; i < args.length; i++) {
            const arg: string = args[i as number];
            if (this.parent.isCellReference(arg) && arg.indexOf(':') > -1) {
                const cells: string[] | string = this.parent.getCellCollection(arg);
                const list: string[] = Array.isArray(cells) ? cells : [cells];
                for (let c: number = 0; c < list.length; c++) {
                    const val: string = this.parent.getValueFromArg(list[c as number]);
                    if (errCollection.indexOf(val) > -1) {
                        return val;
                    }
                    if (!(ignoreEmpty && val === '')) {
                        parts.push(val);
                    }
                }
            } else {
                const val: string = this.resolveTextArg(arg);
                if (errCollection.indexOf(val) > -1) {
                    return val;
                }
                if (!(ignoreEmpty && val === '')) {
                    parts.push(val);
                }
            }
        }
        return parts.join(delimiter);
    }

    /**
     * Returns the leftmost characters from a text value (byte count alias).
     *
     * Excel: `LEFTB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeLEFTB(...args: string[]): string {
        return this.ComputeLEFT(...args);
    }

    /**
     * Returns the rightmost characters from a text value (byte count alias).
     *
     * Excel: `RIGHTB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeRIGHTB(...args: string[]): string {
        return this.ComputeRIGHT(...args);
    }

    /**
     * Returns characters from a text string (byte count alias).
     *
     * Excel: `MIDB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeMIDB(...args: string[]): string {
        return this.ComputeMID(...args);
    }

    /**
     * Replaces characters within text (byte count alias).
     *
     * Excel: `REPLACEB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeREPLACEB(...args: string[]): string {
        return this.ComputeREPLACE(...args);
    }

    /**
     * Finds one text value within another (byte count alias).
     *
     * Excel: `SEARCHB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSEARCHB(...args: string[]): string | number {
        return this.ComputeSEARCH(...args);
    }
}
