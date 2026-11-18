import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

type NumberBase = 2 | 8 | 10 | 16;

/**
 * Foundational engineering conversions and numeric transforms used in scientific worksheets.
 *
 * Registers 12 functions including BIN2DEC, BIN2HEX, BIN2OCT, DEC2BIN, DEC2HEX, and others.
 *
 * @hidden
 */
export class EngineeringBaseFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'BIN2DEC', category: 'Engineering', description: 'Converts a binary number to decimal.', syntax: 'BIN2DEC(number)' },
        { formulaName: 'BIN2HEX', category: 'Engineering', description: 'Converts a binary number to hexadecimal.', syntax: 'BIN2HEX(number, [places])' },
        { formulaName: 'BIN2OCT', category: 'Engineering', description: 'Converts a binary number to octal.', syntax: 'BIN2OCT(number, [places])' },
        { formulaName: 'DEC2BIN', category: 'Engineering', description: 'Converts a decimal number to binary.', syntax: 'DEC2BIN(number, [places])' },
        { formulaName: 'DEC2HEX', category: 'Engineering', description: 'Converts a decimal number to hexadecimal.', syntax: 'DEC2HEX(number, [places])' },
        { formulaName: 'DEC2OCT', category: 'Engineering', description: 'Converts a decimal number to octal.', syntax: 'DEC2OCT(number, [places])' },
        { formulaName: 'HEX2BIN', category: 'Engineering', description: 'Converts a hexadecimal number to binary.', syntax: 'HEX2BIN(number, [places])' },
        { formulaName: 'HEX2DEC', category: 'Engineering', description: 'Converts a hexadecimal number to decimal.', syntax: 'HEX2DEC(number)' },
        { formulaName: 'HEX2OCT', category: 'Engineering', description: 'Converts a hexadecimal number to octal.', syntax: 'HEX2OCT(number, [places])' },
        { formulaName: 'OCT2BIN', category: 'Engineering', description: 'Converts an octal number to binary.', syntax: 'OCT2BIN(number, [places])' },
        { formulaName: 'OCT2DEC', category: 'Engineering', description: 'Converts an octal number to decimal.', syntax: 'OCT2DEC(number)' },
        { formulaName: 'OCT2HEX', category: 'Engineering', description: 'Converts an octal number to hexadecimal.', syntax: 'OCT2HEX(number, [places])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private parseBaseNumber(text: string, base: NumberBase): number | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        const cleaned: string = text.trim().toUpperCase();
        if (cleaned === '') {
            return errCollection[CommonErrors.Num];
        }
        const pattern: RegExp = base === 16 ? /^[0-9A-F]+$/ : base === 2 ? /^[01]+$/ : /^[0-7]+$/;
        if (!pattern.test(cleaned)) {
            return errCollection[CommonErrors.Num];
        }
        const value: number = parseInt(cleaned, base);
        if (isNaN(value)) {
            return errCollection[CommonErrors.Num];
        }
        return value;
    }

    private resolveBaseArg(arg: string, base: NumberBase): number | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        const text: string = this.resolveTextArg(arg);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        return this.parseBaseNumber(text, base);
    }

    private formatToBase(value: number, base: NumberBase, places?: number): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        let num: number = Math.trunc(value);
        const limits: Record<NumberBase, { min: number, max: number, maxPlaces: number }> = {
            2: { min: -512, max: 511, maxPlaces: 10 },
            8: { min: -536870912, max: 536870911, maxPlaces: 10 },
            10: { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, maxPlaces: 0 },
            16: { min: -549755813888, max: 549755813887, maxPlaces: 10 }
        };
        // eslint-disable-next-line security/detect-object-injection
        const limit: { min: number, max: number, maxPlaces: number } = limits[base];
        if (num < limit.min || num > limit.max) {
            return errCollection[CommonErrors.Num];
        }
        let negative: boolean = false;
        if (num < 0) {
            negative = true;
            const width: number = places && places > 0 ? places : (base === 2 ? 10 : base === 8 ? 10 : 10);
            num = (1 << width) + num;
        }
        let digits: string = num.toString(base).toUpperCase();
        if (places !== undefined && places > 0) {
            if (places > limit.maxPlaces) {
                return errCollection[CommonErrors.Num];
            }
            while (digits.length < places) {
                digits = '0' + digits;
            }
        }
        return negative && base !== 10 ? digits : digits;
    }

    /**
     * Converts a binary number to decimal.
     *
     * Excel: `BIN2DEC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=BIN2DEC(1)');
     * ```
     */
    public ComputeBIN2DEC(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const val: number | string = this.resolveBaseArg(args[0], 2);
        if (typeof val === 'string') {
            return val;
        }
        const binary: string = this.resolveTextArg(args[0]).trim();
        if (binary.length > 10) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        let num: number = val;
        if (binary.length === 10 && binary.charAt(0) === '1') {
            num = parseInt(binary, 2) - (1 << 10);
        }
        return num.toString();
    }

    /**
     * Converts a binary number to hexadecimal.
     *
     * Excel: `BIN2HEX(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeBIN2HEX(...args: string[]): string | number {
        return this.binTo(args, 16);
    }

    /**
     * Converts a binary number to octal.
     *
     * Excel: `BIN2OCT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeBIN2OCT(...args: string[]): string | number {
        return this.binTo(args, 8);
    }

    private binTo(args: string[], targetBase: 8 | 16): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const dec: string | number = this.ComputeBIN2DEC(args[0]);
        if (typeof dec === 'string' && errCollection.indexOf(dec) > -1) {
            return dec;
        }
        let places: number | undefined;
        if (args.length === 2) {
            const p: number | string = this.resolveNumberArg(args[1]);
            if (typeof p === 'string') {
                return p;
            }
            places = Math.floor(p);
        }
        return this.formatToBase(parseInt(dec.toString(), 10), targetBase, places);
    }

    /**
     * Converts a decimal number to binary.
     *
     * Excel: `DEC2BIN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDEC2BIN(...args: string[]): string | number {
        return this.decTo(args, 2);
    }

    /**
     * Converts a decimal number to hexadecimal.
     *
     * Excel: `DEC2HEX(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDEC2HEX(...args: string[]): string | number {
        return this.decTo(args, 16);
    }

    /**
     * Converts a decimal number to octal.
     *
     * Excel: `DEC2OCT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDEC2OCT(...args: string[]): string | number {
        return this.decTo(args, 8);
    }

    private decTo(args: string[], targetBase: 2 | 8 | 16): string | number {
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const num: number | string = this.resolveNumberArg(args[0]);
        if (typeof num === 'string') {
            return num;
        }
        let places: number | undefined;
        if (args.length === 2) {
            const p: number | string = this.resolveNumberArg(args[1]);
            if (typeof p === 'string') {
                return p;
            }
            places = Math.floor(p);
        }
        return this.formatToBase(Math.trunc(num), targetBase, places);
    }

    /**
     * Converts a hexadecimal number to decimal.
     *
     * Excel: `HEX2DEC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeHEX2DEC(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]).trim().toUpperCase();
        const val: number | string = this.parseBaseNumber(text, 16);
        if (typeof val === 'string') {
            return val;
        }
        if (text.length > 10) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        let num: number = val;
        if (text.length === 10 && parseInt(text.charAt(0), 16) >= 8) {
            num = parseInt(text, 16) - (1 << 40);
        }
        return num.toString();
    }

    /**
     * Converts a hexadecimal number to binary.
     *
     * Excel: `HEX2BIN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeHEX2BIN(...args: string[]): string | number {
        return this.hexOctTo(args, 2, this.ComputeHEX2DEC.bind(this));
    }

    /**
     * Converts a hexadecimal number to octal.
     *
     * Excel: `HEX2OCT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeHEX2OCT(...args: string[]): string | number {
        return this.hexOctTo(args, 8, this.ComputeHEX2DEC.bind(this));
    }

    /**
     * Converts an octal number to decimal.
     *
     * Excel: `OCT2DEC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeOCT2DEC(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const text: string = this.resolveTextArg(args[0]).trim();
        const val: number | string = this.parseBaseNumber(text, 8);
        if (typeof val === 'string') {
            return val;
        }
        if (text.length > 10) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        let num: number = val;
        if (text.length === 10 && text.charAt(0) >= '4') {
            num = parseInt(text, 8) - (1 << 30);
        }
        return num.toString();
    }

    /**
     * Converts an octal number to binary.
     *
     * Excel: `OCT2BIN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeOCT2BIN(...args: string[]): string | number {
        return this.hexOctTo(args, 2, this.ComputeOCT2DEC.bind(this));
    }

    /**
     * Converts an octal number to hexadecimal.
     *
     * Excel: `OCT2HEX(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeOCT2HEX(...args: string[]): string | number {
        return this.hexOctTo(args, 16, this.ComputeOCT2DEC.bind(this));
    }

    private hexOctTo(
        args: string[],
        targetBase: 2 | 8 | 16,
        toDec: (...a: string[]) => string | number
    ): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const dec: string | number = toDec(args[0]);
        if (typeof dec === 'string' && errCollection.indexOf(dec) > -1) {
            return dec;
        }
        let places: number | undefined;
        if (args.length === 2) {
            const p: number | string = this.resolveNumberArg(args[1]);
            if (typeof p === 'string') {
                return p;
            }
            places = Math.floor(p);
        }
        return this.formatToBase(parseInt(dec.toString(), 10), targetBase, places);
    }
}
