/**
 * Tolerant OMML → Office Math model parser.
 *
 * Source: ECMA-376-1 §22.1 (shared-math.xsd). Never throws on load: unknown elements and
 * structures missing required children are kept verbatim as {@link OfficeMathUnknownElement}.
 */

import { MATH_NAMESPACE, WML_TRANSITIONAL_NAMESPACE, XML_NAMESPACE } from '../constants';
import { attrValue, attrValueNs, childElements, textContent, OpenXmlElement } from '../openxml';
import { MathFunctionType, MathJustification, MathLimitType, MathScriptType } from '../office-math/enums';
import { MathDocumentAdapter, OfficeRunFormat } from '../office-math/adapter';
import { BasicRun, BasicRunFormat } from '../office-math/basic';
import { OfficeMath } from '../office-math/office-math';
import { OfficeMathParagraph } from '../office-math/math-paragraph';
import { OfficeMathFunctionBase } from '../office-math/function-base';
import { OfficeMathUnknownElement } from '../office-math/unknown-element';
import { OfficeMathRunElement } from '../office-math/run-element';
import {
    OfficeMathAccent, OfficeMathBar, OfficeMathBorderBox, OfficeMathBox, OfficeMathGroupCharacter,
    OfficeMathPhantom, OfficeMathRadical
} from '../office-math/functions-basic';
import {
    OfficeMathDelimiter, OfficeMathEquationArray, OfficeMathFraction, OfficeMathFunction, OfficeMathLimit,
    OfficeMathNArray, OfficeMathRightScript, OfficeMathScript, OfficeMathLeftScript
} from '../office-math/functions-multi';
import { OfficeMathMatrix } from '../office-math/matrix';
import { OfficeMathMatrixRow } from '../office-math/matrix-row';
import { MathParseDiagnostic, ParseMathOptions } from './parse-options';
import * as P from './office-math-properties';

interface Context {
    readonly adapter: MathDocumentAdapter | undefined;
    readonly options: ParseMathOptions | undefined;
}

type Fill = (fn: never, pr: OpenXmlElement | undefined) => void;

/** Required argument names, in schema order, and the property element name per element. */
interface Shape {
    readonly type: MathFunctionType;
    readonly pr: string;
    readonly args: string[];
    readonly apply?: Fill;
}

/**
 * Implementation helper. @private
 *
 * @param {MathFunctionType} type The function type.
 * @param {string} pr The property element (`m:*Pr`), if present.
 * @param {string[]} args The argument element names, in order.
 * @param {Fill} [apply] Optional property applier.
 * @returns {Shape} The result.
 */
function shape(type: MathFunctionType, pr: string, args: string[], apply?: Fill): Shape {
    return { type, pr, args, apply };
}

const SHAPES: { [name: string]: Shape } = {
    acc: shape(MathFunctionType.Accent, 'accPr', ['e'], P.applyAccent as Fill),
    bar: shape(MathFunctionType.Bar, 'barPr', ['e'], P.applyBar as Fill),
    borderBox: shape(MathFunctionType.BorderBox, 'borderBoxPr', ['e'], P.applyBorderBox as Fill),
    box: shape(MathFunctionType.Box, 'boxPr', ['e'], P.applyBox as Fill),
    f: shape(MathFunctionType.Fraction, 'fPr', ['num', 'den'], P.applyFraction as Fill),
    func: shape(MathFunctionType.Function, 'funcPr', ['fName', 'e']),
    groupChr: shape(MathFunctionType.GroupCharacter, 'groupChrPr', ['e'], P.applyGroupCharacter as Fill),
    limLow: shape(MathFunctionType.Limit, 'limLowPr', ['e', 'lim']),
    limUpp: shape(MathFunctionType.Limit, 'limUppPr', ['e', 'lim']),
    nary: shape(MathFunctionType.NArray, 'naryPr', ['sub', 'sup', 'e'], P.applyNArray as Fill),
    phant: shape(MathFunctionType.Phantom, 'phantPr', ['e'], P.applyPhantom as Fill),
    rad: shape(MathFunctionType.Radical, 'radPr', ['deg', 'e'], P.applyRadical as Fill),
    sPre: shape(MathFunctionType.LeftSubSuperscript, 'sPrePr', ['sub', 'sup', 'e']),
    sSub: shape(MathFunctionType.SubSuperscript, 'sSubPr', ['e', 'sub']),
    sSubSup: shape(MathFunctionType.RightSubSuperscript, 'sSubSupPr', ['e', 'sub', 'sup'], P.applyRightScript as Fill),
    sSup: shape(MathFunctionType.SubSuperscript, 'sSupPr', ['e', 'sup'])
};

/**
 * Implementation helper. @private
 *
 * @param {Context} ctx The parse context.
 * @param {OpenXmlElement} xml The source element.
 * @param {string} message The diagnostic message.
 * @returns {void}
 */
function diagnose(ctx: Context, xml: OpenXmlElement, message: string): void {
    if (ctx.options !== undefined && ctx.options.onDiagnostic !== undefined) {
        const diagnostic: MathParseDiagnostic = { path: xml.localName, message, localName: xml.localName };
        ctx.options.onDiagnostic(diagnostic);
    }
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement} xml The source element.
 * @param {OfficeMath} target The target to populate.
 * @returns {void}
 */
function preserve(xml: OpenXmlElement, target: OfficeMath): void {
    target.functions.insert(target.functions.count, new OfficeMathUnknownElement(xml.localName, xml));
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement} ctrl The `m:ctrlPr` element.
 * @param {OfficeMathFunctionBase} fn The function being populated.
 * @param {Context} ctx The parse context.
 * @returns {OfficeRunFormat} The result.
 */
function ctrlFormat(ctrl: OpenXmlElement, fn: OfficeMathFunctionBase, ctx: Context): OfficeRunFormat {
    return ctx.adapter !== undefined ? ctx.adapter.parseControlProperties(ctrl, fn) : new BasicRunFormat(ctrl);
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMath} target The target to populate.
 * @param {OpenXmlElement | undefined} el The source element.
 * @param {Context} ctx The parse context.
 * @returns {void}
 */
function fillArgument(target: OfficeMath, el: OpenXmlElement | undefined, ctx: Context): void {
    if (el === undefined) { return; }
    const ctrl: OpenXmlElement | undefined = P.findMathChild(el, 'ctrlPr');
    if (ctrl !== undefined) { target.preservedControlProperties = ctrl; }
    const size: string | undefined = P.readArgumentSize(P.findMathChild(el, 'argPr'));
    if (size !== undefined) { target.argumentSize = Number(size); }
    fillElements(target, el, ctx);
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMath} target The target to populate.
 * @param {OpenXmlElement} parent The parent element.
 * @param {Context} ctx The parse context.
 * @returns {void}
 */
function fillElements(target: OfficeMath, parent: OpenXmlElement, ctx: Context): void {
    childElements(parent).forEach((child: OpenXmlElement) => {
        const isMath: boolean = child.namespaceUri === MATH_NAMESPACE;
        if (isMath && (child.localName === 'argPr' || child.localName === 'ctrlPr')) { return; }
        parseFunction(child, target, ctx);
    });
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement} el The source element.
 * @param {OfficeMath} target The target to populate.
 * @param {Context} ctx The parse context.
 * @returns {void}
 */
function parseFunction(el: OpenXmlElement, target: OfficeMath, ctx: Context): void {
    if (el.namespaceUri !== MATH_NAMESPACE) { preserve(el, target); return; }
    if (el.localName === 'r') { parseRun(el, target, ctx); return; }
    if (el.localName === 'd' || el.localName === 'eqArr') { parseList(el, target, ctx); return; }
    if (el.localName === 'm') { parseMatrix(el, target, ctx); return; }
    const spec: Shape | undefined = SHAPES.hasOwnProperty(el.localName) ? SHAPES[el.localName] : undefined;
    const args: OpenXmlElement[] = spec === undefined ? [] : spec.args.map((n: string) => P.findMathChild(el, n) as OpenXmlElement);
    if (spec === undefined || args.some((a: OpenXmlElement | undefined) => a === undefined)) {
        if (spec !== undefined) { diagnose(ctx, el, 'm:' + el.localName + ' is missing a required child'); }
        preserve(el, target);
        return;
    }
    const fn: OfficeMathFunctionBase = target.functions.add(spec.type);
    const pr: OpenXmlElement | undefined = P.findMathChild(el, spec.pr);
    applyCommon(fn, pr, ctx);
    if (spec.apply !== undefined) { (spec.apply as (f: OfficeMathFunctionBase, p: OpenXmlElement | undefined) => void)(fn, pr); }
    bind(el.localName, fn, args, ctx);
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathFunctionBase} fn The function being populated.
 * @param {OpenXmlElement | undefined} pr The property element (`m:*Pr`), if present.
 * @param {Context} ctx The parse context.
 * @returns {void}
 */
function applyCommon(fn: OfficeMathFunctionBase, pr: OpenXmlElement | undefined, ctx: Context): void {
    const ctrl: OpenXmlElement | undefined = P.findMathChild(pr, 'ctrlPr');
    if (ctrl !== undefined) { fn.controlProperties = ctrlFormat(ctrl, fn, ctx); }
}

/**
 * Implementation helper. @private
 *
 * @param {string} name The local name of the child element.
 * @param {OfficeMathFunctionBase} fn The function being populated.
 * @param {OpenXmlElement[]} a First object.
 * @param {Context} ctx The parse context.
 * @returns {void}
 */
function bind(name: string, fn: OfficeMathFunctionBase, a: OpenXmlElement[], ctx: Context): void {
    const into: (m: OfficeMath, i: number) => void = (m: OfficeMath, i: number) => fillArgument(m, a[i as number], ctx);
    switch (fn.type) {
    case MathFunctionType.Fraction:
        into((fn as OfficeMathFraction).numerator, 0); into((fn as OfficeMathFraction).denominator, 1); break;
    case MathFunctionType.Function:
        into((fn as OfficeMathFunction).functionName, 0); into((fn as OfficeMathFunction).equation, 1); break;
    case MathFunctionType.Limit:
        (fn as OfficeMathLimit).limitType = name === 'limUpp' ? MathLimitType.UpperLimit : MathLimitType.LowerLimit;
        into((fn as OfficeMathLimit).equation, 0); into((fn as OfficeMathLimit).limit, 1); break;
    case MathFunctionType.NArray:
        into((fn as OfficeMathNArray).subscript, 0); into((fn as OfficeMathNArray).superscript, 1);
        into((fn as OfficeMathNArray).equation, 2); break;
    case MathFunctionType.Radical:
        into((fn as OfficeMathRadical).degree, 0); into((fn as OfficeMathRadical).equation, 1); break;
    case MathFunctionType.LeftSubSuperscript:
        into((fn as OfficeMathLeftScript).subscript, 0); into((fn as OfficeMathLeftScript).superscript, 1);
        into((fn as OfficeMathLeftScript).equation, 2); break;
    case MathFunctionType.SubSuperscript:
        (fn as OfficeMathScript).scriptType = name === 'sSub' ? MathScriptType.Subscript : MathScriptType.Superscript;
        into((fn as OfficeMathScript).equation, 0); into((fn as OfficeMathScript).script, 1); break;
    case MathFunctionType.RightSubSuperscript:
        into((fn as OfficeMathRightScript).equation, 0); into((fn as OfficeMathRightScript).subscript, 1);
        into((fn as OfficeMathRightScript).superscript, 2); break;
    default:
        into((fn as OfficeMathAccent | OfficeMathBar | OfficeMathBorderBox | OfficeMathBox | OfficeMathGroupCharacter
        | OfficeMathPhantom).equation, 0);
    }
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement} el The source element.
 * @param {OfficeMath} target The target to populate.
 * @param {Context} ctx The parse context.
 * @returns {void}
 */
function parseList(el: OpenXmlElement, target: OfficeMath, ctx: Context): void {
    const items: OpenXmlElement[] = P.findMathChildren(el, 'e');
    if (items.length < 1) { diagnose(ctx, el, 'm:' + el.localName + ' is missing a required m:e'); preserve(el, target); return; }
    const isDelimiter: boolean = el.localName === 'd';
    const fn: OfficeMathFunctionBase = target.functions.add(isDelimiter ? MathFunctionType.Delimiter : MathFunctionType.EquationArray);
    const pr: OpenXmlElement | undefined = P.findMathChild(el, isDelimiter ? 'dPr' : 'eqArrPr');
    applyCommon(fn, pr, ctx);
    if (isDelimiter) { P.applyDelimiter(fn as OfficeMathDelimiter, pr); } else { P.applyEquationArray(fn as OfficeMathEquationArray, pr); }
    const equations: OfficeMathDelimiter['equations'] = (fn as OfficeMathDelimiter).equations;
    items.forEach((item: OpenXmlElement) => fillArgument(equations.add(), item, ctx));
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement} el The source element.
 * @param {OfficeMath} target The target to populate.
 * @param {Context} ctx The parse context.
 * @returns {void}
 */
function parseMatrix(el: OpenXmlElement, target: OfficeMath, ctx: Context): void {
    const rows: OpenXmlElement[] = P.findMathChildren(el, 'mr');
    if (rows.length < 1) { diagnose(ctx, el, 'm:m is missing a required m:mr'); preserve(el, target); return; }
    const matrix: OfficeMathMatrix = target.functions.add(MathFunctionType.Matrix) as OfficeMathMatrix;
    const pr: OpenXmlElement | undefined = P.findMathChild(el, 'mPr');
    applyCommon(matrix, pr, ctx);
    P.applyMatrix(matrix, pr);
    const widest: number = rows.reduce((max: number, r: OpenXmlElement) => Math.max(max, P.findMathChildren(r, 'e').length), 0);
    P.applyMatrixColumns(matrix, pr, widest);
    rows.forEach((row: OpenXmlElement) => {
        const created: OfficeMathMatrixRow = matrix.rows.add();
        P.findMathChildren(row, 'e').forEach((cell: OpenXmlElement, i: number) => fillArgument(created.arguments.getItem(i), cell, ctx));
    });
}

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement} el The source element.
 * @param {OfficeMath} target The target to populate.
 * @param {Context} ctx The parse context.
 * @returns {void}
 */
function parseRun(el: OpenXmlElement, target: OfficeMath, ctx: Context): void {
    const run: OfficeMathRunElement = target.functions.add(MathFunctionType.RunElement) as OfficeMathRunElement;
    P.applyRunFormat(run.mathFormat, P.findMathChild(el, 'rPr'));
    if (ctx.adapter !== undefined) { ctx.adapter.parseMathRun(el, run); return; }
    const item: BasicRun = new BasicRun();
    childElements(el).forEach((child: OpenXmlElement) => {
        if (child.namespaceUri === MATH_NAMESPACE && child.localName === 'rPr') { return; }
        if (child.namespaceUri === WML_TRANSITIONAL_NAMESPACE && child.localName === 'rPr') { item.runProperties = child; return; }
        if (child.namespaceUri === MATH_NAMESPACE && child.localName === 't') {
            const space: string | undefined = attrValueNs(child, XML_NAMESPACE, 'space');
            item.parts.push(space === undefined ? { kind: 'text', value: textContent(child) }
                : { kind: 'text', value: textContent(child), space });
            return;
        }
        item.parts.push({ kind: 'xml', element: child });
    });
    run.item = item;
}

/**
 * Implementation helper. @private
 *
 * @param {OfficeMathParagraph} paragraph The paragraph being populated.
 * @param {OpenXmlElement} oMath The `m:oMath` element.
 * @param {Context} ctx The parse context.
 * @returns {void}
 */
function fillRoot(paragraph: OfficeMathParagraph, oMath: OpenXmlElement, ctx: Context): void {
    fillElements(paragraph.maths.add(), oMath, ctx);
}

/**
 * Parses an `m:oMathPara` (or a bare `m:oMath`) into an {@link OfficeMathParagraph}.
 *
 * Tolerant: never throws. A bare `m:oMath` is wrapped in a paragraph that has no explicit justification.
 * A malformed `m:oMathPara` (foreign children, text, or no `m:oMath`) is preserved verbatim as a single
 * `OfficeMathUnknownElement` and reported through `onDiagnostic`.
 *
 * @param {OpenXmlElement} root The `m:oMathPara` or `m:oMath` element.
 * @param {MathDocumentAdapter} adapter Optional host adapter supplying native runs and formats.
 * @param {ParseMathOptions} options Optional parser options.
 * @returns {OfficeMathParagraph} The populated model.
 * @public
 */
export function parseOfficeMathParagraph(root: OpenXmlElement, adapter?: MathDocumentAdapter,
                                         options?: ParseMathOptions): OfficeMathParagraph {
    const paragraph: OfficeMathParagraph = new OfficeMathParagraph(adapter);
    const ctx: Context = { adapter, options };
    paragraph.suspendMutations(() => {
        if (!isWellFormedRoot(root)) {
            diagnose(ctx, root, 'm:' + root.localName + ' is not a well-formed m:oMath or m:oMathPara; preserved verbatim');
            preserve(root, paragraph.maths.add());
            return;
        }
        if (root.localName === 'oMath') { fillRoot(paragraph, root, ctx); return; }
        const jc: string | undefined = attrValueOf(P.findMathChild(P.findMathChild(root, 'oMathParaPr'), 'jc'));
        if (jc !== undefined && Object.prototype.hasOwnProperty.call(JUSTIFICATION, jc)) {
            paragraph.justification = JUSTIFICATION[jc as string];
        }
        P.findMathChildren(root, 'oMath').forEach((m: OpenXmlElement) => fillRoot(paragraph, m, ctx));
    });
    return paragraph;
}

/**
 * A root is well formed when it is `m:oMath`, or an `m:oMathPara` whose children are an optional
 * `m:oMathParaPr` followed by at least one `m:oMath` and nothing else.
 *
 * @param {OpenXmlElement} root The candidate root element.
 * @returns {boolean} True when the root can be modelled without losing content.
 */
function isWellFormedRoot(root: OpenXmlElement): boolean {
    if (root.namespaceUri !== MATH_NAMESPACE) { return false; }
    if (root.localName === 'oMath') { return true; }
    if (root.localName !== 'oMathPara') { return false; }
    const children: OpenXmlElement[] = childElements(root).slice();
    const nonMath: OpenXmlElement[] = children.filter((c: OpenXmlElement) => c.namespaceUri !== MATH_NAMESPACE);
    const others: OpenXmlElement[] = children.filter((c: OpenXmlElement) => c.namespaceUri === MATH_NAMESPACE
        && c.localName !== 'oMath' && c.localName !== 'oMathParaPr');
    const hasText: boolean = root.children.some((c: { kind: string; value?: string }) => c.kind === 'text' && (c.value || '').trim() !== '');
    return nonMath.length === 0 && others.length === 0 && !hasText && P.findMathChildren(root, 'oMath').length > 0;
}

const JUSTIFICATION: { [key: string]: MathJustification } = {
    left: MathJustification.Left, right: MathJustification.Right,
    center: MathJustification.Center, centerGroup: MathJustification.CenterGroup
};

/**
 * Implementation helper. @private
 *
 * @param {OpenXmlElement | undefined} el The source element.
 * @returns {string | undefined} The result.
 */
function attrValueOf(el: OpenXmlElement | undefined): string | undefined {
    return el === undefined ? undefined : attrValue(el, 'val');
}
