/**
 * Semantic equality of two Math trees.
 */

import { MathFunctionType } from './enums';
import { OfficeMathFunctionBase } from './function-base';
import { OfficeMath } from './office-math';
import { OfficeMathParagraph } from './math-paragraph';
import { OfficeMathRunElement } from './run-element';
import { OfficeMathUnknownElement } from './unknown-element';
import { OfficeMathBreak } from './break';
import { OfficeMathMatrix } from './matrix';
import { childEquations, breakOf } from './math-traversal';
import { OfficeMathMatrixRow } from './matrix-row';
import { OfficeMathMatrixColumn } from './matrix-column';
import { xmlEqual } from './xml-equal';

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathBreak | undefined} a First object.
 * @param {OfficeMathBreak | undefined} b Second object.
 * @returns {boolean} The result.
 */
function breakEqual(a: OfficeMathBreak | undefined, b: OfficeMathBreak | undefined): boolean {
    if (a === undefined || b === undefined) { return a === b; }
    return a.explicitEquals(b);
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathFunctionBase} a First object.
 * @param {OfficeMathFunctionBase} b Second object.
 * @returns {boolean} The result.
 */
function controlEqual(a: OfficeMathFunctionBase, b: OfficeMathFunctionBase): boolean {
    if (a.hasControlProperties !== b.hasControlProperties) { return false; }
    if (!a.hasControlProperties) { return true; }
    const fa: { equals?(o: unknown): boolean } = a.controlProperties as { equals?(o: unknown): boolean };
    return fa.equals === undefined || fa.equals(b.controlProperties);
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathMatrix} a First object.
 * @param {OfficeMathMatrix} b Second object.
 * @returns {boolean} The result.
 */
function matrixShapeEqual(a: OfficeMathMatrix, b: OfficeMathMatrix): boolean {
    const ca: OfficeMathMatrixColumn[] = a.columns.toArray();
    const cb: OfficeMathMatrixColumn[] = b.columns.toArray();
    const ra: OfficeMathMatrixRow[] = a.rowItems;
    const rb: OfficeMathMatrixRow[] = b.rowItems;
    return ca.length === cb.length && ra.length === rb.length
        && ca.every((c: OfficeMathMatrixColumn, i: number) => c.explicitEquals(cb[i as number]))
        && ra.every((r: OfficeMathMatrixRow, i: number) => r.explicitEquals(rb[i as number]));
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathFunctionBase} a First object.
 * @param {OfficeMathFunctionBase} b Second object.
 * @returns {boolean} The result.
 */
function functionEqual(a: OfficeMathFunctionBase, b: OfficeMathFunctionBase): boolean {
    if (a.type !== b.type || !a.explicitEquals(b) || !controlEqual(a, b)) { return false; }
    if (a instanceof OfficeMathUnknownElement) {
        const other: OfficeMathUnknownElement = b as OfficeMathUnknownElement;
        return a.localName === other.localName && xmlEqual(a.preservedXml, other.preservedXml);
    }
    if (!breakEqual(breakOf(a), breakOf(b))) { return false; }
    if (a.type === MathFunctionType.RunElement) {
        const ra: OfficeMathRunElement = a as OfficeMathRunElement;
        const rb: OfficeMathRunElement = b as OfficeMathRunElement;
        return ra.text === rb.text && ra.mathFormat.explicitEquals(rb.mathFormat);
    }
    if (a.type === MathFunctionType.Matrix && !matrixShapeEqual(a as OfficeMathMatrix, b as OfficeMathMatrix)) { return false; }
    const ca: OfficeMath[] = childEquations(a);
    const cb: OfficeMath[] = childEquations(b);
    return ca.length === cb.length && ca.every((c: OfficeMath, i: number) => officeMathEquals(c, cb[i as number]));
}

/**
 * Semantic equality of two equations (shape, text, explicit properties).
 *
 * @param {OfficeMath} a First equation.
 * @param {OfficeMath} b Second equation.
 * @returns {boolean} True when both trees are equal.
 */
export function officeMathEquals(a: OfficeMath, b: OfficeMath): boolean {
    if (!a.explicitEquals(b) || a.functions.count !== b.functions.count || a.breaks.count !== b.breaks.count) { return false; }
    const bb: OfficeMathBreak[] = b.breaks.toArray();
    if (!a.breaks.toArray().every((x: OfficeMathBreak, i: number) => breakEqual(x, bb[i as number]))) { return false; }
    const fb: OfficeMathFunctionBase[] = b.functions.toArray();
    return a.functions.toArray().every((f: OfficeMathFunctionBase, i: number) => functionEqual(f, fb[i as number]));
}

/**
 * Semantic equality of two Math paragraphs.
 *
 * @param {OfficeMathParagraph} a First paragraph.
 * @param {OfficeMathParagraph} b Second paragraph.
 * @returns {boolean} True when both trees are equal.
 */
export function officeMathParagraphEquals(a: OfficeMathParagraph, b: OfficeMathParagraph): boolean {
    if (!a.explicitEquals(b) || a.maths.count !== b.maths.count) { return false; }
    const mb: OfficeMath[] = b.maths.toArray();
    return a.maths.toArray().every((m: OfficeMath, i: number) => officeMathEquals(m, mb[i as number]));
}
