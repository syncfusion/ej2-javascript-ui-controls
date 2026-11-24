import {
    MathFunctionType,
    OfficeMath,
    OfficeMathFunctionBase,
    OfficeMathMatrix,
    OfficeMathParagraph,
    OfficeMathRunElement
} from '@syncfusion/ej2-office-common';
import { TextRange } from '../document/text-range';
import { applyMathFonts } from './math-adapter';

const CHILD_EQUATION_NAMES: string[] = ['equation', 'degree', 'numerator', 'denominator', 'functionName', 'limit', 'script', 'subscript', 'superscript'];

/**
 *  Child equations of a function (matrix cells row by row).
 *
 * @param {OfficeMathFunctionBase} fn - The fn.
 * @returns {OfficeMath[]} The result.
 */
function childEquations(fn: OfficeMathFunctionBase): OfficeMath[] {
    if (fn.type === MathFunctionType.Matrix) {
        const cells: OfficeMath[] = [];
        for (const row of (fn as OfficeMathMatrix).rowItems) {
            for (const cell of row.arguments) {
                cells.push(cell);
            }
        }
        return cells;
    }
    const holder: { [name: string]: unknown; } = fn as unknown as { [name: string]: unknown };
    const result: OfficeMath[] = [];
    for (const name of CHILD_EQUATION_NAMES) {
        // Child equations are prototype accessors (not own properties) and `name` comes from a fixed list.
        // eslint-disable-next-line security/detect-object-injection
        const value: unknown = holder[name];
        if (value instanceof OfficeMath) {
            result.push(value);
        }
    }
    const list: unknown = holder['equations'];
    if (list !== undefined) {
        result.push(...Array.from(list as Iterable<OfficeMath>));
    }
    return result;
}

/**
 *  Visits every function in the paragraph, depth first.
 *
 * @param {OfficeMathParagraph} paragraph - The paragraph.
 * @param {Function} visit - The visit.
 * @returns {void} Nothing is returned.
 *
 * @private
 */
export function forEachMathFunction(paragraph: OfficeMathParagraph, visit: (fn: OfficeMathFunctionBase) => void): void {
    const walk: (math: OfficeMath) => void = (math: OfficeMath): void => {
        for (const fn of math.functions.toArray()) {
            visit(fn);
            childEquations(fn).forEach(walk);
        }
    };
    paragraph.maths.toArray().forEach(walk);
}

/**
 * Gives code-created functions Word's defaults: `m:ctrlPr` (Cambria Math, italic) on functions and
 * Cambria Math fonts on runs. Functions in `skip` (parsed from a file) are left untouched.
 *
 * @param {OfficeMathParagraph} paragraph - The paragraph.
 * @param {WeakSet<object>} skip - The skip.
 * @returns {void} Nothing is returned.
 *
 * @private
 */
export function seedMathDefaults(paragraph: OfficeMathParagraph, skip: WeakSet<object>): void {
    forEachMathFunction(paragraph, (fn: OfficeMathFunctionBase) => {
        if (skip.has(fn)) {
            return;
        }
        if (fn.type !== MathFunctionType.RunElement) {
            void fn.controlProperties;
            return;
        }
        const item: OfficeMathRunElement['item'] = (fn as OfficeMathRunElement).item;
        if (item instanceof TextRange && item.characterFormat.snapshot().fontsValue === undefined) {
            applyMathFonts(item.characterFormat);
        }
    });
}
