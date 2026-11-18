/**
 * Structural traversal shared by clone and equality over the Math model.
 */

import { MathFunctionType } from './enums';
import { OfficeMathFunctionBase } from './function-base';
import { OfficeMath } from './office-math';
import { OfficeMathMatrix } from './matrix';
import { OfficeMathBreak } from './break';
import { OfficeMathBox } from './functions-basic';
import { OfficeMathRunElement } from './run-element';

/**
 * Lists the child equations of a function in a fixed, schema-like order.
 * Matrix cells are listed row by row.
 *
 * @param {OfficeMathFunctionBase} fn The function to inspect.
 * @returns {OfficeMath[]} Child equations in order.
 * @private
 */
export function childEquations(fn: OfficeMathFunctionBase): OfficeMath[] {
    const holder: { [name: string]: unknown } = fn as unknown as { [name: string]: unknown };
    if (fn.type === MathFunctionType.Matrix) {
        const cells: OfficeMath[] = [];
        (fn as OfficeMathMatrix).rowItems.forEach((row: { arguments: Iterable<OfficeMath> }) => {
            for (const cell of row.arguments) { cells.push(cell); }
        });
        return cells;
    }
    const result: OfficeMath[] = [];
    ['equation', 'degree', 'numerator', 'denominator', 'functionName', 'limit', 'script', 'subscript', 'superscript']
        .forEach((name: string) => {
            const value: unknown = holder[name as string];
            if (value instanceof OfficeMath) { result.push(value); }
        });
    const list: unknown = holder['equations'];
    if (list !== undefined) { result.push(...Array.from(list as Iterable<OfficeMath>)); }
    return result;
}

/**
 * Returns the manual break owned by a box or run element.
 *
 * @param {OfficeMathFunctionBase} fn The function to inspect.
 * @returns {OfficeMathBreak | undefined} The break, when present.
 * @private
 */
export function breakOf(fn: OfficeMathFunctionBase): OfficeMathBreak | undefined {
    if (fn.type === MathFunctionType.Box) { return (fn as OfficeMathBox).break; }
    if (fn.type === MathFunctionType.RunElement) { return (fn as OfficeMathRunElement).mathFormat.break; }
    return undefined;
}
