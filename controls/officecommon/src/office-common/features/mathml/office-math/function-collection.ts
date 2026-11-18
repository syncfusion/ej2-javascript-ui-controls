/**
 * Collection and factory of Math functions.
 */

import { OwnedCollection, CollectionOwner } from './collection';
import { MathFunctionType, MathLimitType, MathScriptType } from './enums';
import { OfficeMathFunctionBase } from './function-base';
import { OfficeMathRunElement } from './run-element';
import { OfficeMathAccent, OfficeMathBar, OfficeMathBorderBox, OfficeMathBox, OfficeMathGroupCharacter, OfficeMathPhantom, OfficeMathRadical } from './functions-basic';
import { OfficeMathDelimiter, OfficeMathEquationArray, OfficeMathFraction, OfficeMathFunction, OfficeMathLimit, OfficeMathNArray, OfficeMathScript, OfficeMathRightScript, OfficeMathLeftScript } from './functions-multi';
import { OfficeMathMatrix } from './matrix';

/**
 * Creates an unattached function of the given type.
 *
 * @param {MathFunctionType} type - The type.
 * @returns {OfficeMathFunctionBase} The result.
 * @private
 */
export function createMathFunction(type: MathFunctionType): OfficeMathFunctionBase {
    switch (type) {
    case MathFunctionType.Accent: return new OfficeMathAccent();
    case MathFunctionType.Bar: return new OfficeMathBar();
    case MathFunctionType.BorderBox: return new OfficeMathBorderBox();
    case MathFunctionType.Box: return new OfficeMathBox();
    case MathFunctionType.Delimiter: return new OfficeMathDelimiter();
    case MathFunctionType.EquationArray: return new OfficeMathEquationArray();
    case MathFunctionType.Fraction: return new OfficeMathFraction();
    case MathFunctionType.Function: return new OfficeMathFunction();
    case MathFunctionType.GroupCharacter: return new OfficeMathGroupCharacter();
    case MathFunctionType.Limit: return new OfficeMathLimit();
    case MathFunctionType.Matrix: return new OfficeMathMatrix();
    case MathFunctionType.NArray: return new OfficeMathNArray();
    case MathFunctionType.Phantom: return new OfficeMathPhantom();
    case MathFunctionType.Radical: return new OfficeMathRadical();
    case MathFunctionType.LeftSubSuperscript: return new OfficeMathLeftScript();
    case MathFunctionType.SubSuperscript: return new OfficeMathScript();
    case MathFunctionType.RightSubSuperscript: return new OfficeMathRightScript();
    case MathFunctionType.RunElement: return new OfficeMathRunElement();
    default: throw new RangeError('Unknown Math function type: ' + String(type));
    }
}

/**
 * Ordered collection of Math functions with a type-based factory.
 *
 * @public
 */
export class OfficeMathFunctionCollection extends OwnedCollection<OfficeMathFunctionBase> {
    constructor(owner: CollectionOwner) { super(owner); }

    /**
     * Creates a function of the given type and appends it, or inserts it at `index`.
     *
     * @param {MathFunctionType} type - The type.
     * @param {number | undefined} index - The index.
     * @returns {OfficeMathFunctionBase} The result.
     */
    add(type: MathFunctionType, index?: number): OfficeMathFunctionBase {
        const item: OfficeMathFunctionBase = createMathFunction(type);
        this.insertItem(index === undefined ? this.count : index, item);
        return item;
    }
}

export { MathLimitType, MathScriptType };
