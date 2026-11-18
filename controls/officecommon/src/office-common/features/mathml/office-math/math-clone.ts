/**
 * Deep clone of the Math model.
 */

import { MathFunctionType } from './enums';
import { OfficeMathFunctionBase } from './function-base';
import { OfficeMath } from './office-math';
import { OfficeMathParagraph } from './math-paragraph';
import { OfficeMathMatrix } from './matrix';
import { OfficeMathBox } from './functions-basic';
import { OfficeMathDelimiter, OfficeMathEquationArray } from './functions-multi';
import { OfficeMathRunElement } from './run-element';
import { OfficeMathUnknownElement } from './unknown-element';
import { OfficeMathBreak } from './break';
import { BasicRun } from './basic';
import { childEquations } from './math-traversal';
import { OfficeMathMatrixRow } from './matrix-row';
import { OfficeMathMatrixColumn } from './matrix-column';

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathBreak} source The source object.
 * @returns {OfficeMathBreak} The result.
 */
function cloneBreak(source: OfficeMathBreak): OfficeMathBreak {
    const copy: OfficeMathBreak = new OfficeMathBreak();
    copy.copyExplicitFrom(source);
    return copy;
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathRunElement} source The source object.
 * @param {OfficeMathRunElement} target The target to populate.
 * @param {OfficeMathParagraph} root The owning Math paragraph.
 * @returns {void}
 */
function cloneRunContent(source: OfficeMathRunElement, target: OfficeMathRunElement, root: OfficeMathParagraph): void {
    target.mathFormat.copyExplicitFrom(source.mathFormat);
    if (source.mathFormat.break !== undefined) { target.mathFormat.break = cloneBreak(source.mathFormat.break); }
    if (source.item === undefined) { return; }
    if (root.adapter !== undefined) {
        target.item = root.adapter.cloneRun(source.item);
    } else {
        if (source.item instanceof BasicRun) {
            target.item = source.item.clone();
        } else {
            const run: BasicRun = new BasicRun();
            run.text = source.text;
            target.item = run;
        }
    }
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathFunctionBase} source The source object.
 * @param {OfficeMathFunctionBase} target The target to populate.
 * @returns {void}
 */
function prepareStructure(source: OfficeMathFunctionBase, target: OfficeMathFunctionBase): void {
    if (source.type === MathFunctionType.Matrix) {
        const from: OfficeMathMatrix = source as OfficeMathMatrix;
        const to: OfficeMathMatrix = target as OfficeMathMatrix;
        from.columns.toArray().forEach((column: OfficeMathMatrixColumn) => to.columns.add().copyExplicitFrom(column));
        from.rowItems.forEach((row: OfficeMathMatrixRow) => to.rows.add().copyExplicitFrom(row));
    } else if (source.type === MathFunctionType.Delimiter || source.type === MathFunctionType.EquationArray) {
        const from: OfficeMathDelimiter | OfficeMathEquationArray = source as OfficeMathDelimiter;
        const to: OfficeMathDelimiter | OfficeMathEquationArray = target as OfficeMathDelimiter;
        for (let i: number = 0; i < from.equations.count; i++) { to.equations.add(); }
    }
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathFunctionBase} source The source object.
 * @param {OfficeMathFunctionBase} target The target to populate.
 * @returns {void}
 */
function copyFunctionState(source: OfficeMathFunctionBase, target: OfficeMathFunctionBase): void {
    target.copyExplicitFrom(source);
    if (source.hasControlProperties) { target.controlProperties = source.controlProperties.clone(); }
    if (source.type === MathFunctionType.Box && (source as OfficeMathBox).break !== undefined) {
        const sourceBreak: OfficeMathBreak = (source as OfficeMathBox).break as OfficeMathBreak;
        const from: OfficeMath | undefined = source.ownerMathEntity instanceof OfficeMath ? source.ownerMathEntity : undefined;
        const to: OfficeMath | undefined = target.ownerMathEntity instanceof OfficeMath ? target.ownerMathEntity : undefined;
        const index: number = from !== undefined ? from.breaks.toArray().indexOf(sourceBreak) : -1;
        (target as OfficeMathBox).break = index >= 0 && to !== undefined ? to.breaks.getItem(index) : cloneBreak(sourceBreak);
    }
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathFunctionBase} source The source object.
 * @param {OfficeMath} destination The destination equation.
 * @param {OfficeMathParagraph} root The owning Math paragraph.
 * @returns {void}
 */
function cloneFunctionInto(source: OfficeMathFunctionBase, destination: OfficeMath, root: OfficeMathParagraph): void {
    if (source instanceof OfficeMathUnknownElement) {
        destination.functions.insert(destination.functions.count, new OfficeMathUnknownElement(source.localName, source.preservedXml));
        return;
    }
    const target: OfficeMathFunctionBase = destination.functions.add(source.type);
    copyFunctionState(source, target);
    if (source.type === MathFunctionType.RunElement) {
        cloneRunContent(source as OfficeMathRunElement, target as OfficeMathRunElement, root);
        return;
    }
    prepareStructure(source, target);
    const from: OfficeMath[] = childEquations(source);
    const to: OfficeMath[] = childEquations(target);
    from.forEach((child: OfficeMath, i: number) => cloneEquationInto(child, to[i as number], root));
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMath} source The source object.
 * @param {OfficeMath} target The target to populate.
 * @param {OfficeMathParagraph} root The owning Math paragraph.
 * @returns {void}
 */
function cloneEquationInto(source: OfficeMath, target: OfficeMath, root: OfficeMathParagraph): void {
    target.copyExplicitFrom(source);
    target.preservedControlProperties = source.preservedControlProperties;
    for (const brk of source.breaks) { target.breaks.add().copyExplicitFrom(brk); }
    for (const fn of source.functions) { cloneFunctionInto(fn, target, root); }
}

/**
 * Deep-clones an equation as a new, detached equation.
 *
 * @param {OfficeMath} source The equation to clone.
 * @param {OfficeMathParagraph} root Paragraph that supplies the host adapter for the copy.
 * @returns {OfficeMath} An attached copy living under `root`.
 */
export function cloneOfficeMath(source: OfficeMath, root: OfficeMathParagraph): OfficeMath {
    const copy: OfficeMath = root.maths.add();
    cloneEquationInto(source, copy, root);
    return copy;
}

/**
 * Deep-clones a Math paragraph including explicit properties, owners and unknown elements.
 *
 * @param {OfficeMathParagraph} source The paragraph to clone.
 * @returns {OfficeMathParagraph} An independent copy.
 */
export function cloneOfficeMathParagraph(source: OfficeMathParagraph): OfficeMathParagraph {
    const copy: OfficeMathParagraph = new OfficeMathParagraph(source.adapter);
    copy.copyExplicitFrom(source);
    for (const math of source.maths) { cloneOfficeMath(math, copy); }
    return copy;
}
