/**
 * Writers that turn explicit Office Math properties into `m:*Pr` children.
 *
 * Source: ECMA-376-1 §22.1.2 (shared-math.xsd). Only explicitly set properties are written, in schema order.
 */

import { OpenXmlChild } from '../openxml';
import {
    MathDelimiterShapeType, MathFontType, MathFractionType, MathFunctionType, MathHorizontalAlignment, MathStyleType,
    MathVerticalAlignment, SpacingRule
} from '../office-math/enums';
import { K } from '../office-math/keys';
import { OfficeMathBreak } from '../office-math/break';
import { OfficeMathFormat } from '../office-math/format';
import { OfficeMathFunctionBase } from '../office-math/function-base';
import {
    OfficeMathAccent, OfficeMathBar, OfficeMathBorderBox, OfficeMathBox, OfficeMathGroupCharacter, OfficeMathPhantom,
    OfficeMathRadical
} from '../office-math/functions-basic';
import {
    OfficeMathDelimiter, OfficeMathEquationArray, OfficeMathFraction, OfficeMathNArray, OfficeMathRightScript
} from '../office-math/functions-multi';
import { OfficeMathMatrix } from '../office-math/matrix';
import { OfficeMathMatrixColumn } from '../office-math/matrix-column';
import { invalid, mathAttribute, mathElement, token, unsigned, valueElement, writeFlags, writeValue, WriteContext } from './omml-writer';

const FRACTION: string[] = ['bar', 'noBar', 'skw', 'lin'];
const VERTICAL: string[] = ['center', 'top', 'bottom'];
const HORIZONTAL: string[] = ['center', 'left', 'right'];
const SHAPE: string[] = ['centered', 'match'];
const FONT: string[] = ['double-struck', 'fraktur', 'monospace', 'roman', 'sans-serif', 'script'];
const STYLE: string[] = ['i', 'bi', 'b', 'p'];

/** Element name of the property container of each function. @private */
export const PROPERTY_ELEMENT: { [type: number]: string } = {
    [MathFunctionType.Accent]: 'accPr', [MathFunctionType.Bar]: 'barPr', [MathFunctionType.BorderBox]: 'borderBoxPr',
    [MathFunctionType.Box]: 'boxPr', [MathFunctionType.Delimiter]: 'dPr', [MathFunctionType.EquationArray]: 'eqArrPr',
    [MathFunctionType.Fraction]: 'fPr', [MathFunctionType.Function]: 'funcPr', [MathFunctionType.GroupCharacter]: 'groupChrPr',
    [MathFunctionType.Matrix]: 'mPr', [MathFunctionType.NArray]: 'naryPr', [MathFunctionType.Phantom]: 'phantPr',
    [MathFunctionType.Radical]: 'radPr', [MathFunctionType.LeftSubSuperscript]: 'sPrePr',
    [MathFunctionType.RightSubSuperscript]: 'sSubSupPr'
};

/**
 * Writes `m:brk` when the break has an explicit alignment point, otherwise an empty `m:brk`. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OfficeMathBreak} brk The break.
 * @returns {OpenXmlChild} The element.
 */
export function writeBreak(ctx: WriteContext, brk: OfficeMathBreak): OpenXmlChild {
    if (!brk.isExplicit(K.AlignAt)) { return mathElement(ctx, 'brk'); }
    if (!Number.isInteger(brk.alignAt) || brk.alignAt < 1 || brk.alignAt > 255) {
        invalid('alnAt must be an integer in 1..255, got ' + String(brk.alignAt), 'brk.alnAt', 'value-range');
    }
    return mathElement(ctx, 'brk', [], [mathAttribute(ctx, 'alnAt', String(brk.alignAt))]);
}

/**
 * Writes the children of `m:rPr`. `m:nor` excludes `m:scr`/`m:sty` per the schema choice. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OfficeMathFormat} format The Math run format.
 * @returns {OpenXmlChild[]} The children.
 */
export function runFormatChildren(ctx: WriteContext, format: OfficeMathFormat): OpenXmlChild[] {
    const out: OpenXmlChild[] = [];
    writeFlags(ctx, out, format, [[K.HasLiteral, 'lit', format.hasLiteral]]);
    const normal: boolean = format.isExplicit(K.HasNormalText) && (format.hasNormalText || !isScriptStyle(format));
    if (normal) {
        writeFlags(ctx, out, format, [[K.HasNormalText, 'nor', format.hasNormalText]]);
    } else {
        writeValue(ctx, out, format, K.Script, 'scr', () => token(FONT, format.font as MathFontType, 'rPr.scr', 'ST_Script'));
        writeValue(ctx, out, format, K.Style, 'sty', () => token(STYLE, format.style as MathStyleType, 'rPr.sty', 'ST_Style'));
    }
    if (format.break !== undefined) { out.push(writeBreak(ctx, format.break)); }
    writeFlags(ctx, out, format, [[K.HasAlignment, 'aln', format.hasAlignment]]);
    return out;
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathFormat} format The Math run format.
 * @returns {boolean} True when a script or style is explicit.
 */
function isScriptStyle(format: OfficeMathFormat): boolean {
    return format.isExplicit(K.Script) || format.isExplicit(K.Style);
}

/**
 * Implementation helper. @private
 *
 * @param {number} rule The spacing rule.
 * @param {string} path The element path.
 * @returns {string} The decimal text.
 */
function ruleText(rule: SpacingRule, path: string): string {
    return rule >= 0 && rule <= 4 && Number.isInteger(rule) ? String(rule) : invalid('Illegal spacing rule ' + String(rule), path, 'enum-value');
}

/**
 * Implementation helper. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OpenXmlChild[]} out The children being built.
 * @param {OfficeMathEquationArray | OfficeMathMatrix} fn The function.
 * @param {string} path The element path.
 * @returns {void}
 */
function rowSpacing(ctx: WriteContext, out: OpenXmlChild[], fn: OfficeMathEquationArray | OfficeMathMatrix, path: string): void {
    writeValue(ctx, out, fn, K.RowSpacingRule, 'rSpRule', () => ruleText(fn.rowSpacingRule, path + '.rSpRule'));
}

/**
 * Implementation helper. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OpenXmlChild[]} out The children being built.
 * @param {OfficeMathEquationArray} fn The equation array.
 * @returns {void}
 */
function equationArray(ctx: WriteContext, out: OpenXmlChild[], fn: OfficeMathEquationArray): void {
    writeValue(ctx, out, fn, K.EqArrAlign, 'baseJc', () => token(VERTICAL, fn.verticalAlignment as MathVerticalAlignment, 'eqArrPr.baseJc', 'ST_YAlign'));
    writeFlags(ctx, out, fn, [[K.MaxDist, 'maxDist', fn.expandEquationContainer], [K.ObjDist, 'objDist', fn.expandEquationContent]]);
    rowSpacing(ctx, out, fn, 'eqArrPr');
    writeValue(ctx, out, fn, K.RowSpacing, 'rSp', () => unsigned(fn.rowSpacing, 'eqArrPr.rSp'));
}

/**
 * Implementation helper. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OpenXmlChild[]} out The children being built.
 * @param {OfficeMathMatrix} fn The matrix.
 * @returns {void}
 */
function matrix(ctx: WriteContext, out: OpenXmlChild[], fn: OfficeMathMatrix): void {
    writeValue(ctx, out, fn, K.MatrixAlign, 'baseJc', () => token(VERTICAL, fn.verticalAlignment as MathVerticalAlignment, 'mPr.baseJc', 'ST_YAlign'));
    writeFlags(ctx, out, fn, [[K.PlaceHoldHidden, 'plcHide', fn.hidePlaceholder]]);
    rowSpacing(ctx, out, fn, 'mPr');
    writeValue(ctx, out, fn, K.ColumnGapRule, 'cGpRule', () => ruleText(fn.columnGapRule, 'mPr.cGpRule'));
    writeValue(ctx, out, fn, K.RowSpacing, 'rSp', () => unsigned(fn.rowSpacing, 'mPr.rSp'));
    writeValue(ctx, out, fn, K.ColumnSpacing, 'cSp', () => unsigned(fn.columnSpacing, 'mPr.cSp'));
    writeValue(ctx, out, fn, K.ColumnGap, 'cGp', () => unsigned(fn.columnGap, 'mPr.cGp'));
    const columns: OpenXmlChild | undefined = matrixColumns(ctx, fn);
    if (columns !== undefined) { out.push(columns); }
}

/**
 * Writes `m:mcs`, grouping consecutive columns with the same explicit alignment. Omitted when no column
 * alignment is explicit, because the parser recreates default columns from the row cells. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OfficeMathMatrix} fn The matrix.
 * @returns {OpenXmlChild | undefined} The element, if needed.
 */
function matrixColumns(ctx: WriteContext, fn: OfficeMathMatrix): OpenXmlChild | undefined {
    const columns: OfficeMathMatrixColumn[] = fn.columns.toArray();
    if (!columns.some((c: OfficeMathMatrixColumn) => c.isExplicit(K.MatrixAlign))) { return undefined; }
    const groups: Array<{ column: OfficeMathMatrixColumn; count: number }> = [];
    columns.forEach((column: OfficeMathMatrixColumn) => {
        const last: { column: OfficeMathMatrixColumn; count: number } | undefined = groups[groups.length - 1];
        const same: boolean = last !== undefined && last.column.isExplicit(K.MatrixAlign) === column.isExplicit(K.MatrixAlign)
            && (!column.isExplicit(K.MatrixAlign) || last.column.horizontalAlignment === column.horizontalAlignment);
        if (same && last !== undefined && last.count < 255) { last.count++; } else { groups.push({ column, count: 1 }); }
    });
    return mathElement(ctx, 'mcs', groups.map((g: { column: OfficeMathMatrixColumn; count: number }) => {
        const kids: OpenXmlChild[] = [valueElement(ctx, 'count', String(g.count))];
        writeValue(ctx, kids, g.column, K.MatrixAlign, 'mcJc', () => token(HORIZONTAL, g.column.horizontalAlignment as MathHorizontalAlignment, 'mcPr.mcJc', 'ST_XAlign'));
        return mathElement(ctx, 'mc', [mathElement(ctx, 'mcPr', kids)]);
    }));
}

/**
 * Implementation helper. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OpenXmlChild[]} out The children being built.
 * @param {OfficeMathFunctionBase} fn The function.
 * @returns {void}
 */
function multiProperties(ctx: WriteContext, out: OpenXmlChild[], fn: OfficeMathFunctionBase): void {
    if (fn.type === MathFunctionType.Delimiter) {
        const d: OfficeMathDelimiter = fn as OfficeMathDelimiter;
        writeValue(ctx, out, d, K.BegChar, 'begChr', () => d.beginCharacter);
        writeValue(ctx, out, d, K.SeparatorChar, 'sepChr', () => d.separator);
        writeValue(ctx, out, d, K.EndChar, 'endChr', () => d.endCharacter);
        writeFlags(ctx, out, d, [[K.Grow, 'grow', d.isGrow]]);
        writeValue(ctx, out, d, K.Shape, 'shp', () => token(SHAPE, d.delimiterShape as MathDelimiterShapeType, 'dPr.shp', 'ST_Shp'));
    } else if (fn.type === MathFunctionType.EquationArray) {
        equationArray(ctx, out, fn as OfficeMathEquationArray);
    } else if (fn.type === MathFunctionType.Fraction) {
        const f: OfficeMathFraction = fn as OfficeMathFraction;
        writeValue(ctx, out, f, K.FractionType, 'type', () => token(FRACTION, f.fractionType as MathFractionType, 'fPr.type', 'ST_FType'));
    } else if (fn.type === MathFunctionType.Matrix) {
        matrix(ctx, out, fn as OfficeMathMatrix);
    } else if (fn.type === MathFunctionType.NArray) {
        const n: OfficeMathNArray = fn as OfficeMathNArray;
        writeValue(ctx, out, n, K.NAryChar, 'chr', () => n.nArrayCharacter);
        writeValue(ctx, out, n, K.SubSupLimit, 'limLoc', () => n.subSuperscriptLimit ? 'subSup' : 'undOvr');
        writeFlags(ctx, out, n, [[K.HasGrow, 'grow', n.hasGrow], [K.HideSubscript, 'subHide', n.hideLowerLimit],
            [K.HideSuperscript, 'supHide', n.hideUpperLimit]]);
    } else if (fn.type === MathFunctionType.RightSubSuperscript) {
        writeFlags(ctx, out, fn, [[K.SkipAlign, 'alnScr', (fn as OfficeMathRightScript).isSkipAlign]]);
    }
}

/**
 * Implementation helper. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OpenXmlChild[]} out The children being built.
 * @param {OfficeMathFunctionBase} fn The function.
 * @returns {void}
 */
function basicProperties(ctx: WriteContext, out: OpenXmlChild[], fn: OfficeMathFunctionBase): void {
    if (fn.type === MathFunctionType.Accent) {
        writeValue(ctx, out, fn, K.AccentChar, 'chr', () => (fn as OfficeMathAccent).accentCharacter);
    } else if (fn.type === MathFunctionType.Bar) {
        writeValue(ctx, out, fn, K.BarTop, 'pos', () => (fn as OfficeMathBar).barTop ? 'top' : 'bot');
    } else if (fn.type === MathFunctionType.BorderBox) {
        const b: OfficeMathBorderBox = fn as OfficeMathBorderBox;
        writeFlags(ctx, out, b, [[K.HideTop, 'hideTop', b.hideTop], [K.HideBottom, 'hideBot', b.hideBottom],
            [K.HideLeft, 'hideLeft', b.hideLeft], [K.HideRight, 'hideRight', b.hideRight],
            [K.StrikeHorizontal, 'strikeH', b.strikeHorizontal], [K.StrikeVertical, 'strikeV', b.strikeVertical],
            [K.StrikeBLTR, 'strikeBLTR', b.strikeDiagonalUp], [K.StrikeTLBR, 'strikeTLBR', b.strikeDiagonalDown]]);
    } else if (fn.type === MathFunctionType.Box) {
        const b: OfficeMathBox = fn as OfficeMathBox;
        writeFlags(ctx, out, b, [[K.OperatorEmulator, 'opEmu', b.operatorEmulator], [K.NoBreak, 'noBreak', b.noBreak],
            [K.EnableDifferential, 'diff', b.enableDifferential]]);
        if (b.break !== undefined) { out.push(writeBreak(ctx, b.break)); }
        writeFlags(ctx, out, b, [[K.BoxAlign, 'aln', b.alignment]]);
    } else if (fn.type === MathFunctionType.GroupCharacter) {
        const g: OfficeMathGroupCharacter = fn as OfficeMathGroupCharacter;
        writeValue(ctx, out, g, K.GroupChar, 'chr', () => g.groupCharacter);
        writeValue(ctx, out, g, K.HasCharTop, 'pos', () => g.hasCharacterTop ? 'top' : 'bot');
        writeValue(ctx, out, g, K.HasAlignTop, 'vertJc', () => g.hasAlignTop ? 'top' : 'bot');
    } else if (fn.type === MathFunctionType.Phantom) {
        const p: OfficeMathPhantom = fn as OfficeMathPhantom;
        writeFlags(ctx, out, p, [[K.Show, 'show', p.show], [K.ZeroWidth, 'zeroWid', p.zeroWidth],
            [K.ZeroAscent, 'zeroAsc', p.zeroAscent], [K.ZeroDescent, 'zeroDesc', p.zeroDescent], [K.Transparent, 'transp', p.transparent]]);
    } else if (fn.type === MathFunctionType.Radical) {
        writeFlags(ctx, out, fn, [[K.HideDegree, 'degHide', (fn as OfficeMathRadical).hideDegree]]);
    }
}

/**
 * Writes the explicit properties of a function in schema order, excluding `m:ctrlPr`. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OfficeMathFunctionBase} fn The function.
 * @returns {OpenXmlChild[]} The property children.
 */
export function functionProperties(ctx: WriteContext, fn: OfficeMathFunctionBase): OpenXmlChild[] {
    const out: OpenXmlChild[] = [];
    basicProperties(ctx, out, fn);
    multiProperties(ctx, out, fn);
    return out;
}
