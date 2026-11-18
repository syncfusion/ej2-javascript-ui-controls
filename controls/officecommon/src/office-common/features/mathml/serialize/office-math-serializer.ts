/**
 * Office Math model → OMML serializer.
 *
 * Source: ECMA-376-1 §22.1 (shared-math.xsd). Writes only explicitly set properties, in schema order, and
 * re-emits {@link OfficeMathUnknownElement} content verbatim. Throws {@link MathmlValidationError} for
 * structures the schema forbids (for example a delimiter without an `m:e`).
 */

import { MATH_NAMESPACE, XML_NAMESPACE } from '../constants';
import { createText, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../openxml';
import { MathFunctionType, MathJustification, MathLimitType, MathScriptType } from '../office-math/enums';
import { MathDocumentAdapter } from '../office-math/adapter';
import { BasicRun, BasicRunFormat, BasicRunPart } from '../office-math/basic';
import { K } from '../office-math/keys';
import { OfficeMath } from '../office-math/office-math';
import { OfficeMathParagraph } from '../office-math/math-paragraph';
import { OfficeMathFunctionBase } from '../office-math/function-base';
import { OfficeMathUnknownElement } from '../office-math/unknown-element';
import { OfficeMathRunElement } from '../office-math/run-element';
import {
    OfficeMathAccent, OfficeMathBar, OfficeMathBorderBox, OfficeMathBox, OfficeMathGroupCharacter, OfficeMathPhantom,
    OfficeMathRadical
} from '../office-math/functions-basic';
import {
    OfficeMathDelimiter, OfficeMathEquationArray, OfficeMathFraction, OfficeMathFunction, OfficeMathLeftScript,
    OfficeMathLimit, OfficeMathNArray, OfficeMathRightScript, OfficeMathScript
} from '../office-math/functions-multi';
import { OfficeMathMatrix } from '../office-math/matrix';
import { OfficeMathMatrixRow } from '../office-math/matrix-row';
import { invalid, mathElement, resolveMathPrefix, token, valueElement, WriteContext } from './omml-writer';
import { SerializeOfficeMathOptions } from './omml-writer';
import { functionProperties, PROPERTY_ELEMENT, runFormatChildren } from './office-math-properties-writer';

export { SerializeOfficeMathOptions } from './omml-writer';

const JUSTIFICATION: string[] = ['centerGroup', 'center', 'left', 'right'];

/** Element name, property container name and ordered arguments of one function. @private */
interface Layout {
    readonly name: string;
    readonly pr: string;
    readonly args: Array<[string, OfficeMath]>;
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathFunctionBase} fn The function.
 * @returns {Layout | undefined} The layout, or undefined for list/matrix/run/unknown functions.
 */
function layoutOf(fn: OfficeMathFunctionBase): Layout | undefined {
    switch (fn.type) {
    case MathFunctionType.Accent: return { name: 'acc', pr: 'accPr', args: [['e', (fn as OfficeMathAccent).equation]] };
    case MathFunctionType.Bar: return { name: 'bar', pr: 'barPr', args: [['e', (fn as OfficeMathBar).equation]] };
    case MathFunctionType.BorderBox: return { name: 'borderBox', pr: 'borderBoxPr', args: [['e', (fn as OfficeMathBorderBox).equation]] };
    case MathFunctionType.Box: return { name: 'box', pr: 'boxPr', args: [['e', (fn as OfficeMathBox).equation]] };
    case MathFunctionType.GroupCharacter:
        return { name: 'groupChr', pr: 'groupChrPr', args: [['e', (fn as OfficeMathGroupCharacter).equation]] };
    case MathFunctionType.Phantom: return { name: 'phant', pr: 'phantPr', args: [['e', (fn as OfficeMathPhantom).equation]] };
    case MathFunctionType.Radical:
        return { name: 'rad', pr: 'radPr', args: [['deg', (fn as OfficeMathRadical).degree], ['e', (fn as OfficeMathRadical).equation]] };
    case MathFunctionType.Fraction:
        return { name: 'f', pr: 'fPr', args: [['num', (fn as OfficeMathFraction).numerator], ['den', (fn as OfficeMathFraction).denominator]] };
    case MathFunctionType.Function:
        return { name: 'func', pr: 'funcPr', args: [['fName', (fn as OfficeMathFunction).functionName], ['e', (fn as OfficeMathFunction).equation]] };
    default: return layoutOfScripts(fn);
    }
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathFunctionBase} fn The function.
 * @returns {Layout | undefined} The layout, or undefined when `fn` is not a limit, n-ary or script function.
 */
function layoutOfScripts(fn: OfficeMathFunctionBase): Layout | undefined {
    if (fn.type === MathFunctionType.Limit) {
        const l: OfficeMathLimit = fn as OfficeMathLimit;
        const upper: boolean = l.limitType === MathLimitType.UpperLimit;
        return { name: upper ? 'limUpp' : 'limLow', pr: upper ? 'limUppPr' : 'limLowPr', args: [['e', l.equation], ['lim', l.limit]] };
    }
    if (fn.type === MathFunctionType.NArray) {
        const n: OfficeMathNArray = fn as OfficeMathNArray;
        return { name: 'nary', pr: 'naryPr', args: [['sub', n.subscript], ['sup', n.superscript], ['e', n.equation]] };
    }
    if (fn.type === MathFunctionType.SubSuperscript) {
        const s: OfficeMathScript = fn as OfficeMathScript;
        const sub: boolean = s.scriptType === MathScriptType.Subscript;
        return { name: sub ? 'sSub' : 'sSup', pr: sub ? 'sSubPr' : 'sSupPr', args: [['e', s.equation], [sub ? 'sub' : 'sup', s.script]] };
    }
    if (fn.type === MathFunctionType.RightSubSuperscript) {
        const r: OfficeMathRightScript = fn as OfficeMathRightScript;
        return { name: 'sSubSup', pr: 'sSubSupPr', args: [['e', r.equation], ['sub', r.subscript], ['sup', r.superscript]] };
    }
    if (fn.type === MathFunctionType.LeftSubSuperscript) {
        const p: OfficeMathLeftScript = fn as OfficeMathLeftScript;
        return { name: 'sPre', pr: 'sPrePr', args: [['sub', p.subscript], ['sup', p.superscript], ['e', p.equation]] };
    }
    return undefined;
}

/**
 * Builds the `m:ctrlPr` of a function from its control properties. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OfficeMathFunctionBase} fn The function.
 * @returns {OpenXmlChild[]} Zero or one element.
 */
function controlProperties(ctx: WriteContext, fn: OfficeMathFunctionBase): OpenXmlChild[] {
    if (!fn.hasControlProperties) { return []; }
    if (ctx.adapter !== undefined) {
        const kids: OpenXmlElement[] = ctx.adapter.serializeControlProperties(fn.controlProperties);
        return kids.length > 0 ? [mathElement(ctx, 'ctrlPr', kids)] : [];
    }
    const format: BasicRunFormat | undefined = fn.controlProperties instanceof BasicRunFormat ? fn.controlProperties : undefined;
    return format !== undefined && format.preservedXml !== undefined ? [format.preservedXml] : [];
}

/**
 * Writes the property container (`m:*Pr`) of a function, or nothing when it would be empty. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OfficeMathFunctionBase} fn The function.
 * @param {string} prName The container element name.
 * @returns {OpenXmlChild[]} Zero or one element.
 */
function propertyContainer(ctx: WriteContext, fn: OfficeMathFunctionBase, prName: string): OpenXmlChild[] {
    const kids: OpenXmlChild[] = functionProperties(ctx, fn).concat(controlProperties(ctx, fn));
    return kids.length > 0 ? [mathElement(ctx, prName, kids)] : [];
}

/**
 * Writes an argument element (`m:e`, `m:num`, …). @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {string} name The element name.
 * @param {OfficeMath} math The argument content.
 * @param {string} path The element path for diagnostics.
 * @returns {OpenXmlElement} The element.
 */
function writeArgument(ctx: WriteContext, name: string, math: OfficeMath, path: string): OpenXmlElement {
    const kids: OpenXmlChild[] = [];
    if (math.isExplicit(K.ArgumentSize)) {
        kids.push(mathElement(ctx, 'argPr', [valueElement(ctx, 'argSz', String(math.argumentSize))]));
    }
    writeContent(ctx, math, path).forEach((e: OpenXmlElement) => kids.push(e));
    if (math.preservedControlProperties !== undefined) { kids.push(math.preservedControlProperties); }
    return mathElement(ctx, name, kids);
}

/**
 * Implementation helper. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OfficeMath} math The equation.
 * @param {string} path The element path for diagnostics.
 * @returns {OpenXmlElement[]} The serialized functions.
 */
function writeContent(ctx: WriteContext, math: OfficeMath, path: string): OpenXmlElement[] {
    return math.functions.toArray().map((fn: OfficeMathFunctionBase, i: number) => writeFunction(ctx, fn, path + '[' + String(i) + ']'));
}

/**
 * Implementation helper. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {string} name The element name (`d` or `eqArr`).
 * @param {OfficeMathDelimiter | OfficeMathEquationArray} fn The function.
 * @param {string} prName The property container name.
 * @param {string} path The element path for diagnostics.
 * @returns {OpenXmlElement} The element.
 */
function writeList(ctx: WriteContext, name: string, fn: OfficeMathDelimiter | OfficeMathEquationArray, prName: string,
                   path: string): OpenXmlElement {
    if (fn.equations.count < 1) { invalid('m:' + name + ' requires at least one m:e', path, 'required-child'); }
    const kids: OpenXmlChild[] = propertyContainer(ctx, fn, prName);
    fn.equations.toArray().forEach((e: OfficeMath, i: number) => kids.push(writeArgument(ctx, 'e', e, path + '.e[' + String(i) + ']')));
    return mathElement(ctx, name, kids);
}

/**
 * Implementation helper. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OfficeMathMatrix} fn The matrix.
 * @param {string} path The element path for diagnostics.
 * @returns {OpenXmlElement} The element.
 */
function writeMatrix(ctx: WriteContext, fn: OfficeMathMatrix, path: string): OpenXmlElement {
    if (fn.rows.count < 1) { invalid('m:m requires at least one m:mr', path, 'required-child'); }
    const kids: OpenXmlChild[] = propertyContainer(ctx, fn, PROPERTY_ELEMENT[MathFunctionType.Matrix]);
    fn.rowItems.forEach((row: OfficeMathMatrixRow, r: number) => {
        const cells: OpenXmlChild[] = row.arguments.toArray()
            .map((cell: OfficeMath, c: number) => writeArgument(ctx, 'e', cell, path + '.mr[' + String(r) + '].e[' + String(c) + ']'));
        kids.push(mathElement(ctx, 'mr', cells));
    });
    return mathElement(ctx, 'm', kids);
}

/**
 * Implementation helper. @private
 *
 * @param {string} value The text.
 * @returns {boolean} True when leading or trailing whitespace needs `xml:space="preserve"`.
 */
function needsPreserve(value: string): boolean {
    return value.length === 0 || /^\s|\s$/.test(value);
}

/**
 * Implementation helper. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {BasicRunPart} part The run part.
 * @returns {OpenXmlChild} The serialized part.
 */
function writeRunPart(ctx: WriteContext, part: BasicRunPart): OpenXmlChild {
    if (part.kind === 'xml') { return part.element; }
    const space: string | undefined = part.space !== undefined ? part.space : needsPreserve(part.value) ? 'preserve' : undefined;
    const attrs: OpenXmlAttribute[] = space === undefined ? [] : [{ namespaceUri: XML_NAMESPACE, localName: 'space', prefix: 'xml', value: space }];
    return mathElement(ctx, 't', [createText(part.value)], attrs);
}

/**
 * Writes `m:r`: `m:rPr`, then the host/WordprocessingML run content. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OfficeMathRunElement} run The run element.
 * @returns {OpenXmlElement} The element.
 */
function writeRun(ctx: WriteContext, run: OfficeMathRunElement): OpenXmlElement {
    const kids: OpenXmlChild[] = [];
    const format: OpenXmlChild[] = runFormatChildren(ctx, run.mathFormat);
    if (format.length > 0) { kids.push(mathElement(ctx, 'rPr', format)); }
    if (ctx.adapter !== undefined) {
        ctx.adapter.serializeMathRun(run).forEach((e: OpenXmlElement) => kids.push(e));
    } else if (run.item instanceof BasicRun) {
        if (run.item.runProperties !== undefined) { kids.push(run.item.runProperties); }
        run.item.parts.forEach((part: BasicRunPart) => kids.push(writeRunPart(ctx, part)));
    }
    return mathElement(ctx, 'r', kids);
}

/**
 * Serializes one function. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OfficeMathFunctionBase} fn The function.
 * @param {string} path The element path for diagnostics.
 * @returns {OpenXmlElement} The element.
 */
function writeFunction(ctx: WriteContext, fn: OfficeMathFunctionBase, path: string): OpenXmlElement {
    if (fn instanceof OfficeMathUnknownElement) { return fn.preservedXml; }
    if (fn.type === MathFunctionType.RunElement) { return writeRun(ctx, fn as OfficeMathRunElement); }
    if (fn.type === MathFunctionType.Delimiter) { return writeList(ctx, 'd', fn as OfficeMathDelimiter, 'dPr', path); }
    if (fn.type === MathFunctionType.EquationArray) { return writeList(ctx, 'eqArr', fn as OfficeMathEquationArray, 'eqArrPr', path); }
    if (fn.type === MathFunctionType.Matrix) { return writeMatrix(ctx, fn as OfficeMathMatrix, path); }
    const layout: Layout | undefined = layoutOf(fn);
    if (layout === undefined) { return invalid('Unsupported Math function type ' + String(fn.type), path, 'enum-value'); }
    const kids: OpenXmlChild[] = propertyContainer(ctx, fn, layout.pr);
    layout.args.forEach((a: [string, OfficeMath]) => kids.push(writeArgument(ctx, a[0], a[1], path + '.' + a[0])));
    return mathElement(ctx, layout.name, kids);
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathParagraph} paragraph The paragraph.
 * @returns {OpenXmlElement | undefined} A malformed root that the parser preserved verbatim, if that is all the paragraph holds.
 */
function preservedRoot(paragraph: OfficeMathParagraph): OpenXmlElement | undefined {
    if (paragraph.maths.count !== 1 || paragraph.maths.getItem(0).functions.count !== 1) { return undefined; }
    const only: OfficeMathFunctionBase = paragraph.maths.getItem(0).functions.getItem(0);
    const isRoot: boolean = only instanceof OfficeMathUnknownElement && only.preservedXml.namespaceUri === MATH_NAMESPACE
        && (only.localName === 'oMath' || only.localName === 'oMathPara');
    return isRoot ? (only as OfficeMathUnknownElement).preservedXml : undefined;
}

/**
 * Serializes an {@link OfficeMathParagraph} to `m:oMathPara`, or to a bare `m:oMath` for an inline
 * paragraph (one equation, no explicit justification). A paragraph that holds a verbatim-preserved malformed
 * root re-emits that root unchanged.
 *
 * @param {OfficeMathParagraph} paragraph The model.
 * @param {SerializeOfficeMathOptions} options Optional serializer options.
 * @returns {OpenXmlElement} The `m:oMathPara` or `m:oMath` element.
 * @throws {MathmlValidationError} When the model violates the schema.
 * @public
 */
export function serializeOfficeMathParagraph(paragraph: OfficeMathParagraph, options?: SerializeOfficeMathOptions): OpenXmlElement {
    const adapter: MathDocumentAdapter | undefined = paragraph.adapter;
    const ctx: WriteContext = { prefix: resolveMathPrefix(options), adapter };
    const preserved: OpenXmlElement | undefined = preservedRoot(paragraph);
    if (preserved !== undefined) { return preserved; }
    const display: boolean = options !== undefined && options.display !== undefined
        ? options.display : paragraph.hasExplicitJustification || paragraph.maths.count !== 1;
    const maths: OfficeMath[] = paragraph.maths.toArray();
    if (maths.length < 1) { invalid('An equation paragraph requires at least one m:oMath', 'oMathPara', 'required-child'); }
    if (!display) {
        if (maths.length > 1) { invalid('A bare m:oMath holds exactly one equation', 'oMath', 'child-order'); }
        return mathElement(ctx, 'oMath', writeContent(ctx, maths[0], 'oMath'));
    }
    const kids: OpenXmlChild[] = [];
    if (paragraph.hasExplicitJustification) {
        const jc: string = token(JUSTIFICATION, paragraph.justification as MathJustification, 'oMathParaPr.jc', 'ST_Jc');
        kids.push(mathElement(ctx, 'oMathParaPr', [valueElement(ctx, 'jc', jc)]));
    }
    maths.forEach((m: OfficeMath, i: number) => {
        const path: string = 'oMathPara.oMath[' + String(i) + ']';
        kids.push(mathElement(ctx, 'oMath', writeContent(ctx, m, path)));
    });
    return mathElement(ctx, 'oMathPara', kids);
}

