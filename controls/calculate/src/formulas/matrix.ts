import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { MatrixFormulaBase } from './matrix-base';

/**
 * Matrix and linear-algebra helpers for array-oriented spreadsheet calculations.
 *
 * Registered functions: MDETERM, MINVERSE, MMULT, TRANSPOSE.
 *
 * @hidden
 */
export class MatrixFormulas extends MatrixFormulaBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'MDETERM', category: 'Math & Trig', description: 'Returns the matrix determinant of an array.', syntax: 'MDETERM(array)' },
        { formulaName: 'MINVERSE', category: 'Math & Trig', description: 'Returns the matrix inverse of an array.', syntax: 'MINVERSE(array)' },
        { formulaName: 'MMULT', category: 'Math & Trig', description: 'Returns the matrix product of two arrays.', syntax: 'MMULT(array1, array2)' },
        { formulaName: 'TRANSPOSE', category: 'Math & Trig', description: 'Returns the transpose of an array.', syntax: 'TRANSPOSE(array)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the matrix determinant of an array.
     *
     * Excel: `MDETERM(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=MDETERM(1)');
     * ```
     */
    public ComputeMDETERM(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const matrix: number[][] | string = this.readMatrix(args[0]);
        if (typeof matrix === 'string') {
            return matrix;
        }
        if (matrix.length !== matrix[0].length) {
            return errCollection[CommonErrors.Value];
        }
        return this.determinant(matrix).toString();
    }

    /**
     * Returns the matrix inverse of an array.
     *
     * Excel: `MINVERSE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMINVERSE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const matrix: number[][] | string = this.readMatrix(args[0]);
        if (typeof matrix === 'string') {
            return matrix;
        }
        if (matrix.length !== matrix[0].length) {
            return errCollection[CommonErrors.Value];
        }
        const inv: number[][] | null = this.inverse(matrix);
        if (!inv) {
            return errCollection[CommonErrors.Num];
        }
        return this.flattenMatrix(inv);
    }

    /**
     * Returns the matrix product of two arrays.
     *
     * Excel: `MMULT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMMULT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const a: number[][] | string = this.readMatrix(args[0]);
        const b: number[][] | string = this.readMatrix(args[1]);
        if (typeof a === 'string') {
            return a;
        }
        if (typeof b === 'string') {
            return b;
        }
        const product: number[][] | null = this.multiply(a, b);
        if (!product) {
            return errCollection[CommonErrors.Value];
        }
        return this.flattenMatrix(product);
    }

    /**
     * Returns the transpose of an array.
     *
     * Excel: `TRANSPOSE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTRANSPOSE(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const matrix: number[][] | string = this.readMatrix(args[0]);
        if (typeof matrix === 'string') {
            return matrix;
        }
        return this.flattenMatrix(matrix, true);
    }
}
