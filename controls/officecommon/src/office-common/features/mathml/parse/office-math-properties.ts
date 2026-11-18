/**
 * Property readers that populate the Office Math model from `m:*Pr` elements.
 *
 * Source: ECMA-376-1 §22.1.2 (shared-math.xsd). Invalid values are ignored so the model default applies.
 */

import { MATH_NAMESPACE } from '../constants';
import { attrValue, childElements, OpenXmlElement } from '../openxml';
import {
    MathDelimiterShapeType, MathFontType, MathFractionType, MathHorizontalAlignment, MathStyleType,
    MathVerticalAlignment, SpacingRule
} from '../office-math/enums';
import { OfficeMathBreak } from '../office-math/break';
import { OfficeMath } from '../office-math/office-math';
import { OfficeMathFormat } from '../office-math/format';
import {
    OfficeMathAccent, OfficeMathBar, OfficeMathBorderBox, OfficeMathBox, OfficeMathGroupCharacter,
    OfficeMathPhantom, OfficeMathRadical
} from '../office-math/functions-basic';
import {
    OfficeMathDelimiter, OfficeMathEquationArray, OfficeMathFraction, OfficeMathNArray, OfficeMathRightScript
} from '../office-math/functions-multi';
import { OfficeMathMatrix } from '../office-math/matrix';
import { OfficeMathMatrixColumn } from '../office-math/matrix-column';

/**
 * Finds the first `m:` child with the given local name. @private
 *
 * @param {OpenXmlElement | undefined} parent The parent element.
 * @param {string} localName The local name to find.
 * @returns {OpenXmlElement | undefined} The result.
 */
export function findMathChild(parent: OpenXmlElement | undefined, localName: string): OpenXmlElement | undefined {
    return parent === undefined ? undefined : childElements(parent)
        .filter((c: OpenXmlElement) => c.namespaceUri === MATH_NAMESPACE && c.localName === localName)[0];
}

/**
 * Finds every `m:` child with the given local name. @private
 *
 * @param {OpenXmlElement} parent The parent element.
 * @param {string} localName The local name to find.
 * @returns {OpenXmlElement[]} The result.
 */
export function findMathChildren(parent: OpenXmlElement, localName: string): OpenXmlElement[] {
    return childElements(parent).filter((c: OpenXmlElement) => c.namespaceUri === MATH_NAMESPACE && c.localName === localName);
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @param {string} name The local name of the child element.
 * @returns {string | undefined} The result.
 */
function str(pr: OpenXmlElement | undefined, name: string): string | undefined {
    const child: OpenXmlElement | undefined = findMathChild(pr, name);
    return child === undefined ? undefined : attrValue(child, 'val');
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @param {string} name The local name of the child element.
 * @returns {boolean | undefined} The result.
 */
function onOff(pr: OpenXmlElement | undefined, name: string): boolean | undefined {
    const child: OpenXmlElement | undefined = findMathChild(pr, name);
    if (child === undefined) { return undefined; }
    const raw: string | undefined = attrValue(child, 'val');
    if (raw === undefined) { return true; }
    const v: string = raw.toLowerCase();
    return v === '1' || v === 'true' || v === 'on' ? true : v === '0' || v === 'false' || v === 'off' ? false : undefined;
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @param {string} name The local name of the child element.
 * @returns {number | undefined} The result.
 */
function int(pr: OpenXmlElement | undefined, name: string): number | undefined {
    const raw: string | undefined = str(pr, name);
    return raw !== undefined && /^\d+$/.test(raw) ? Number(raw) : undefined;
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @param {Array<[string, Function]>} table The lookup table of valid values.
 * @returns {void}
 */
function flags(pr: OpenXmlElement | undefined, table: Array<[string, (value: boolean) => void]>): void {
    table.forEach((entry: [string, (value: boolean) => void]) => {
        const value: boolean | undefined = onOff(pr, entry[0]);
        if (value !== undefined) { entry[1](value); }
    });
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @param {string} name The local name of the child element.
 * @param {Function} set Callback receiving the parsed value.
 * @returns {void}
 */
function text(pr: OpenXmlElement | undefined, name: string, set: (value: string) => void): void {
    const value: string | undefined = str(pr, name);
    if (value !== undefined) { set(value); }
}

/**
 * Implementation helper. @private
 *
 * @param {string | undefined} value The value to convert.
 * @returns {MathVerticalAlignment | undefined} The result.
 */
function verticalAlignment(value: string | undefined): MathVerticalAlignment | undefined {
    if (value === 'top') { return MathVerticalAlignment.Top; }
    if (value === 'bottom') { return MathVerticalAlignment.Bottom; }
    return value === 'center' ? MathVerticalAlignment.Center : undefined;
}

/**
 * Reads `m:brk` of a property container. @private
 *
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @param {OfficeMath} owner Optional owning equation whose break collection creates the break.
 * @returns {OfficeMathBreak | undefined} The result.
 */
export function readBreak(pr: OpenXmlElement | undefined, owner?: OfficeMath): OfficeMathBreak | undefined {
    const brk: OpenXmlElement | undefined = findMathChild(pr, 'brk');
    if (brk === undefined) { return undefined; }
    const result: OfficeMathBreak = owner !== undefined ? owner.breaks.add() : new OfficeMathBreak();
    const raw: string | undefined = attrValue(brk, 'alnAt');
    if (raw !== undefined && /^\d+$/.test(raw) && Number(raw) >= 1 && Number(raw) <= 255) { result.alignAt = Number(raw); }
    return result;
}

const FONTS: { [key: string]: MathFontType } = {
    'roman': MathFontType.Roman, 'script': MathFontType.Script, 'fraktur': MathFontType.Fraktur,
    'double-struck': MathFontType.DoubleStruck, 'sans-serif': MathFontType.SansSerif, 'monospace': MathFontType.Monospace
};
const STYLES: { [key: string]: MathStyleType } = {
    p: MathStyleType.Regular, b: MathStyleType.Bold, i: MathStyleType.Italic, bi: MathStyleType.BoldItalic
};

/**
 * Applies `m:rPr` to a run format. @private
 *
 * @param {OfficeMathFormat} format The Math run format to populate.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyRunFormat(format: OfficeMathFormat, pr: OpenXmlElement | undefined): void {
    flags(pr, [['lit', (v: boolean) => { format.hasLiteral = v; }], ['nor', (v: boolean) => { format.hasNormalText = v; }],
        ['aln', (v: boolean) => { format.hasAlignment = v; }]]);
    const scr: string | undefined = str(pr, 'scr');
    if (scr !== undefined && FONTS.hasOwnProperty(scr)) { format.font = FONTS[scr as string]; }
    const sty: string | undefined = str(pr, 'sty');
    if (sty !== undefined && STYLES.hasOwnProperty(sty)) { format.style = STYLES[sty as string]; }
    const brk: OfficeMathBreak | undefined = readBreak(pr);
    if (brk !== undefined) { format.break = brk; }
}

/**
 * Applies `m:accPr`. @private
 *
 * @param {OfficeMathAccent} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyAccent(fn: OfficeMathAccent, pr: OpenXmlElement | undefined): void {
    text(pr, 'chr', (v: string) => { fn.accentCharacter = v; });
}

/**
 * Applies `m:barPr`. @private
 *
 * @param {OfficeMathBar} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyBar(fn: OfficeMathBar, pr: OpenXmlElement | undefined): void {
    const pos: string | undefined = str(pr, 'pos');
    if (pos === 'top' || pos === 'bot') { fn.barTop = pos === 'top'; }
}

/**
 * Applies `m:borderBoxPr`. @private
 *
 * @param {OfficeMathBorderBox} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyBorderBox(fn: OfficeMathBorderBox, pr: OpenXmlElement | undefined): void {
    flags(pr, [['hideTop', (v: boolean) => { fn.hideTop = v; }], ['hideBot', (v: boolean) => { fn.hideBottom = v; }],
        ['hideLeft', (v: boolean) => { fn.hideLeft = v; }], ['hideRight', (v: boolean) => { fn.hideRight = v; }],
        ['strikeH', (v: boolean) => { fn.strikeHorizontal = v; }], ['strikeV', (v: boolean) => { fn.strikeVertical = v; }],
        ['strikeBLTR', (v: boolean) => { fn.strikeDiagonalUp = v; }], ['strikeTLBR', (v: boolean) => { fn.strikeDiagonalDown = v; }]]);
}

/**
 * Applies `m:boxPr`. @private
 *
 * @param {OfficeMathBox} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyBox(fn: OfficeMathBox, pr: OpenXmlElement | undefined): void {
    flags(pr, [['opEmu', (v: boolean) => { fn.operatorEmulator = v; }], ['noBreak', (v: boolean) => { fn.noBreak = v; }],
        ['diff', (v: boolean) => { fn.enableDifferential = v; }], ['aln', (v: boolean) => { fn.alignment = v; }]]);
    const brk: OfficeMathBreak | undefined = readBreak(pr, fn.ownerMathEntity instanceof OfficeMath ? fn.ownerMathEntity : undefined);
    if (brk !== undefined) { fn.break = brk; }
}

/**
 * Applies `m:dPr`. @private
 *
 * @param {OfficeMathDelimiter} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyDelimiter(fn: OfficeMathDelimiter, pr: OpenXmlElement | undefined): void {
    text(pr, 'begChr', (v: string) => { fn.beginCharacter = v; });
    text(pr, 'sepChr', (v: string) => { fn.separator = v; });
    text(pr, 'endChr', (v: string) => { fn.endCharacter = v; });
    flags(pr, [['grow', (v: boolean) => { fn.isGrow = v; }]]);
    const shp: string | undefined = str(pr, 'shp');
    if (shp === 'centered' || shp === 'match') {
        fn.delimiterShape = shp === 'centered' ? MathDelimiterShapeType.Centered : MathDelimiterShapeType.Match;
    }
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @param {Function} rule Callback receiving the spacing rule.
 * @param {Function} value Callback receiving the spacing value.
 * @param {string} ruleName The local name of the rule element.
 * @param {string} valueName The local name of the value element.
 * @returns {void}
 */
function spacing(pr: OpenXmlElement | undefined, rule: (v: SpacingRule) => void, value: (v: number) => void,
                 ruleName: string, valueName: string): void {
    const r: number | undefined = int(pr, ruleName);
    if (r !== undefined && r <= 4) { rule(r as SpacingRule); }
    const v: number | undefined = int(pr, valueName);
    if (v !== undefined) {
        try { value(v); } catch (e) { if (!(e instanceof RangeError)) { throw e; } }
    }
}

/**
 * Applies `m:eqArrPr`. @private
 *
 * @param {OfficeMathEquationArray} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyEquationArray(fn: OfficeMathEquationArray, pr: OpenXmlElement | undefined): void {
    const align: MathVerticalAlignment | undefined = verticalAlignment(str(pr, 'baseJc'));
    if (align !== undefined) { fn.verticalAlignment = align; }
    flags(pr, [['maxDist', (v: boolean) => { fn.expandEquationContainer = v; }],
        ['objDist', (v: boolean) => { fn.expandEquationContent = v; }]]);
    spacing(pr, (v: SpacingRule) => { fn.rowSpacingRule = v; }, (v: number) => { fn.rowSpacing = v; }, 'rSpRule', 'rSp');
}

const FRACTIONS: { [key: string]: MathFractionType } = {
    bar: MathFractionType.NormalFractionBar, noBar: MathFractionType.NoFractionBar,
    skw: MathFractionType.SkewedFractionBar, lin: MathFractionType.FractionInline
};

/**
 * Applies `m:fPr`. @private
 *
 * @param {OfficeMathFraction} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyFraction(fn: OfficeMathFraction, pr: OpenXmlElement | undefined): void {
    const type: string | undefined = str(pr, 'type');
    if (type !== undefined && FRACTIONS.hasOwnProperty(type)) { fn.fractionType = FRACTIONS[type as string]; }
}

/**
 * Applies `m:groupChrPr`. @private
 *
 * @param {OfficeMathGroupCharacter} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyGroupCharacter(fn: OfficeMathGroupCharacter, pr: OpenXmlElement | undefined): void {
    text(pr, 'chr', (v: string) => { fn.groupCharacter = v; });
    const pos: string | undefined = str(pr, 'pos');
    if (pos === 'top' || pos === 'bot') { fn.hasCharacterTop = pos === 'top'; }
    const vert: string | undefined = str(pr, 'vertJc');
    if (vert === 'top' || vert === 'bot') { fn.hasAlignTop = vert === 'top'; }
}

/**
 * Applies `m:naryPr`. @private
 *
 * @param {OfficeMathNArray} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyNArray(fn: OfficeMathNArray, pr: OpenXmlElement | undefined): void {
    text(pr, 'chr', (v: string) => { fn.nArrayCharacter = v; });
    const loc: string | undefined = str(pr, 'limLoc');
    if (loc === 'undOvr' || loc === 'subSup') { fn.subSuperscriptLimit = loc === 'subSup'; }
    flags(pr, [['grow', (v: boolean) => { fn.hasGrow = v; }], ['subHide', (v: boolean) => { fn.hideLowerLimit = v; }],
        ['supHide', (v: boolean) => { fn.hideUpperLimit = v; }]]);
}

/**
 * Applies `m:phantPr`. @private
 *
 * @param {OfficeMathPhantom} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyPhantom(fn: OfficeMathPhantom, pr: OpenXmlElement | undefined): void {
    flags(pr, [['show', (v: boolean) => { fn.show = v; }], ['zeroWid', (v: boolean) => { fn.zeroWidth = v; }],
        ['zeroAsc', (v: boolean) => { fn.zeroAscent = v; }], ['zeroDesc', (v: boolean) => { fn.zeroDescent = v; }],
        ['transp', (v: boolean) => { fn.transparent = v; }]]);
}

/**
 * Applies `m:radPr`. @private
 *
 * @param {OfficeMathRadical} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyRadical(fn: OfficeMathRadical, pr: OpenXmlElement | undefined): void {
    flags(pr, [['degHide', (v: boolean) => { fn.hideDegree = v; }]]);
}

/**
 * Applies `m:sSubSupPr`. @private
 *
 * @param {OfficeMathRightScript} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyRightScript(fn: OfficeMathRightScript, pr: OpenXmlElement | undefined): void {
    flags(pr, [['alnScr', (v: boolean) => { fn.isSkipAlign = v; }]]);
}

/**
 * Implementation helper. @private
 *
 * @param {string | undefined} value The value to convert.
 * @returns {MathHorizontalAlignment | undefined} The result.
 */
function columnAlignment(value: string | undefined): MathHorizontalAlignment | undefined {
    if (value === 'left') { return MathHorizontalAlignment.Left; }
    if (value === 'right') { return MathHorizontalAlignment.Right; }
    return value === 'center' ? MathHorizontalAlignment.Center : undefined;
}

/**
 * Applies the scalar settings of `m:mPr` (columns are handled by {@link applyMatrixColumns}). @private
 *
 * @param {OfficeMathMatrix} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @returns {void}
 */
export function applyMatrix(fn: OfficeMathMatrix, pr: OpenXmlElement | undefined): void {
    const align: MathVerticalAlignment | undefined = verticalAlignment(str(pr, 'baseJc'));
    if (align !== undefined) { fn.verticalAlignment = align; }
    flags(pr, [['plcHide', (v: boolean) => { fn.hidePlaceholder = v; }]]);
    spacing(pr, (v: SpacingRule) => { fn.rowSpacingRule = v; }, (v: number) => { fn.rowSpacing = v; }, 'rSpRule', 'rSp');
    spacing(pr, (v: SpacingRule) => { fn.columnGapRule = v; }, (v: number) => { fn.columnGap = v; }, 'cGpRule', 'cGp');
    const cSp: number | undefined = int(pr, 'cSp');
    if (cSp !== undefined) { fn.columnSpacing = cSp; }
}

/**
 * Creates matrix columns from `m:mcs`, then pads to `cellCount` so every row cell has a column.
 *
 * @param {OfficeMathMatrix} fn The matrix.
 * @param {OpenXmlElement} pr The `m:mPr` element.
 * @param {number} cellCount The widest row, in cells.
 * @returns {void}
 * @private
 */
export function applyMatrixColumns(fn: OfficeMathMatrix, pr: OpenXmlElement | undefined, cellCount: number): void {
    const mcs: OpenXmlElement | undefined = findMathChild(pr, 'mcs');
    const groups: OpenXmlElement[] = mcs === undefined ? [] : findMathChildren(mcs, 'mc');
    groups.forEach((mc: OpenXmlElement) => {
        const mcPr: OpenXmlElement | undefined = findMathChild(mc, 'mcPr');
        const raw: number | undefined = int(mcPr, 'count');
        const count: number = raw !== undefined && raw >= 1 && raw <= 255 ? raw : 1;
        const align: MathHorizontalAlignment | undefined = columnAlignment(str(mcPr, 'mcJc'));
        for (let i: number = 0; i < count; i++) {
            const column: OfficeMathMatrixColumn = fn.columns.add();
            if (align !== undefined) { column.horizontalAlignment = align; }
        }
    });
    while (fn.columns.count < cellCount) { fn.columns.add(); }
}

/**
 * Reads `m:argPr/m:argSz` (ST_Integer2, -2..2). Invalid values are ignored. @private
 *
 * @param {OpenXmlElement | undefined} argPr The `m:argPr` element, if present.
 * @returns {string | undefined} The valid size as text, or undefined.
 */
export function readArgumentSize(argPr: OpenXmlElement | undefined): string | undefined {
    const raw: string | undefined = str(argPr, 'argSz');
    return raw !== undefined && /^-?\d+$/.test(raw) && Math.abs(Number(raw)) <= 2 ? raw : undefined;
}
