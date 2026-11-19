import { CommonErrors } from '../common/index';
import { getRangeIndexes } from '../common/address';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Shared matrix helpers for MDETERM / MINVERSE / MMULT / TRANSPOSE.
 *
 * @hidden
 */
export class MatrixFormulaBase extends FormulaModuleBase {
    protected readMatrix(ref: string): number[][] | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        const stripped: string = ref.split('$').join('');
        if (!this.parent.isCellReference(stripped.split(':')[0])) {
            return errCollection[CommonErrors.Value];
        }
        const indexes: number[] = getRangeIndexes(stripped);
        const rows: number = indexes[2] - indexes[0] + 1;
        const cols: number = indexes[3] - indexes[1] + 1;
        const cells: string[] | string = this.parent.getCellCollection(stripped);
        const list: string[] = Array.isArray(cells) ? cells : [cells];
        if (list.length !== rows * cols) {
            return errCollection[CommonErrors.Value];
        }
        const matrix: number[][] = [];
        for (let r: number = 0; r < rows; r++) {
            const row: number[] = [];
            for (let c: number = 0; c < cols; c++) {
                const val: string = this.parent.getValueFromArg(list[r * cols + c]);
                if (errCollection.indexOf(val) > -1) {
                    return val;
                }
                if (val === '' || !this.parent.isNumber(val)) {
                    return errCollection[CommonErrors.Value];
                }
                row.push(this.parent.parseFloat(val));
            }
            matrix.push(row);
        }
        return matrix;
    }

    protected flattenMatrix(matrix: number[][], transpose: boolean = false): string {
        const sep: string = this.parent.getParseArgumentSeparator();
        const rows: number = matrix.length;
        const cols: number = matrix[0].length;
        const parts: string[] = [];
        if (transpose) {
            for (let c: number = 0; c < cols; c++) {
                for (let r: number = 0; r < rows; r++) {
                    parts.push(matrix[r as number][c as number].toString());
                }
            }
        } else {
            for (let r: number = 0; r < rows; r++) {
                for (let c: number = 0; c < cols; c++) {
                    parts.push(matrix[r as number][c as number].toString());
                }
            }
        }
        return parts.join(sep);
    }

    protected determinant(m: number[][]): number {
        const n: number = m.length;
        if (n === 1) {
            return m[0][0];
        }
        if (n === 2) {
            return m[0][0] * m[1][1] - m[0][1] * m[1][0];
        }
        let det: number = 0;
        for (let c: number = 0; c < n; c++) {
            const minor: number[][] = [];
            for (let r: number = 1; r < n; r++) {
                const row: number[] = [];
                for (let k: number = 0; k < n; k++) {
                    if (k !== c) {
                        row.push(m[r as number][k as number]);
                    }
                }
                minor.push(row);
            }
            det += (c % 2 === 0 ? 1 : -1) * m[0][c as number] * this.determinant(minor);
        }
        return det;
    }

    protected inverse(m: number[][]): number[][] | null {
        const n: number = m.length;
        const aug: number[][] = [];
        for (let i: number = 0; i < n; i++) {
            aug.push(m[i as number].slice());
            for (let j: number = 0; j < n; j++) {
                aug[i as number].push(i === j ? 1 : 0);
            }
        }
        for (let i: number = 0; i < n; i++) {
            let maxRow: number = i;
            for (let k: number = i + 1; k < n; k++) {
                if (Math.abs(aug[k as number][i as number]) > Math.abs(aug[maxRow as number][i as number])) {
                    maxRow = k;
                }
            }
            const tmp: number[] = aug[i as number];
            aug[i as number] = aug[maxRow as number];
            aug[maxRow as number] = tmp;
            const pivot: number = aug[i as number][i as number];
            if (Math.abs(pivot) < 1e-12) {
                return null;
            }
            for (let j: number = 0; j < 2 * n; j++) {
                aug[i as number][j as number] /= pivot;
            }
            for (let k: number = 0; k < n; k++) {
                if (k === i) {
                    continue;
                }
                const factor: number = aug[k as number][i as number];
                for (let j: number = 0; j < 2 * n; j++) {
                    aug[k as number][j as number] -= factor * aug[i as number][j as number];
                }
            }
        }
        const inv: number[][] = [];
        for (let i: number = 0; i < n; i++) {
            inv.push(aug[i as number].slice(n));
        }
        return inv;
    }

    protected multiply(a: number[][], b: number[][]): number[][] | null {
        if (a[0].length !== b.length) {
            return null;
        }
        const rows: number = a.length;
        const cols: number = b[0].length;
        const inner: number = b.length;
        const result: number[][] = [];
        for (let i: number = 0; i < rows; i++) {
            const row: number[] = [];
            for (let j: number = 0; j < cols; j++) {
                let sum: number = 0;
                for (let k: number = 0; k < inner; k++) {
                    sum += a[i as number][k as number] * b[k as number][j as number];
                }
                row.push(sum);
            }
            result.push(row);
        }
        return result;
    }
}
