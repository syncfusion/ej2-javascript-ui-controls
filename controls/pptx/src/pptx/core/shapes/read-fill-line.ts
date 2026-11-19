import { AuthoredFillMatrixReference, readFillMatrixReference } from '../theme/read-fill-reference';
import { arrayAt } from '../util/es5-compat';
import { readAuthoredGradient, projectAuthoredGradient, getGradientDrawingNamespace } from '../theme/read-gradient';
import { AuthoredGradientFill, AuthoredGradientShade } from '../theme/gradient-types';
/**
 * Read direct fill, line, and shape style refs from live shape DOM (preserve path).
 *
 * @remarks
 * Classification only — does not mutate markup, fetch blip targets, or collapse
 * scheme/style refs to RGB. Citation: Transitional `dml-main.xsd` `EG_FillProperties`,
 * `CT_LineProperties`, `CT_ShapeStyle`; `pml.xsd` `CT_Shape`.
 *
 * @internal
 */
import { OFFICE_REL_ATTR_NS } from '../presentation/constants';
import { tryParseColorChoiceChild } from '../theme/parse-color-choice';
import { readColorTransforms, ThemeColorTransform, ThemeFillStyle } from '../theme/theme-render-model';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { DML_NS } from './constants';
import { findChild, getAttr } from './dom-utils';
import { DirectFill, DirectLine, DirectLineFill, LineEnd, LineJoin, ResolvedFill, ShapeStyleRefs, StyleMatrixReference } from './fill-line-types';
/** Fill local names under `EG_FillProperties` (shape fill). */
const SHAPE_FILL_LOCALS: Set<string> = new Set([
    'noFill',
    'solidFill',
    'gradFill',
    'blipFill',
    'pattFill',
    'grpFill'
]);
/** Fill local names under `EG_LineFillProperties` (no blip/grp). */
const LINE_FILL_LOCALS: Set<string> = new Set(['noFill', 'solidFill', 'gradFill', 'pattFill']);
/**
 * Locates direct shape properties, or exact owning-namespace `grpSpPr` for a group.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findShapeSpPr(shapeElement: OoxmlElement): OoxmlElement | undefined {
    const ns: string | undefined = getGradientDrawingNamespace(shapeElement.namespaceUri);
    if (ns === undefined) { return undefined; }
    if (shapeElement.localName === 'grpSp' || shapeElement.localName === 'spTree') {
        return findChild(shapeElement, shapeElement.namespaceUri, 'grpSpPr');
    }
    return findChild(shapeElement, shapeElement.namespaceUri, 'spPr') || findChild(shapeElement, ns, 'spPr');
}
/**
 * Locates optional `p:style` / `a:style` under a shape element.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findShapeStyle(shapeElement: OoxmlElement): OoxmlElement | undefined {
    const ns: string | undefined = getGradientDrawingNamespace(shapeElement.namespaceUri);
    if (ns === undefined) { return undefined; }
    return findChild(shapeElement, shapeElement.namespaceUri, 'style') || findChild(shapeElement, ns, 'style');
}
/**
 * Reads `CT_Shape/@useBgFill` (`xsd:boolean`, default false).
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @returns {boolean} The result.
 */
export function readUseBgFill(shapeElement: OoxmlElement): boolean {
    const raw: string = getAttr(shapeElement, '', 'useBgFill');
    if (raw === undefined) {
        return false;
    }
    return raw === '1' || raw.toLowerCase() === 'true';
}
/**
 * Classifies the first `EG_FillProperties` child under shape or group properties.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @returns {DirectFill} The result.
 */
export function readDirectFill(shapeElement: OoxmlElement): DirectFill {
    const spPr: OoxmlElement = findShapeSpPr(shapeElement);
    if (spPr === undefined) {
        return { kind: 'missing' };
    }
    return readFillProperties(spPr);
}
/**
 * Reads direct `a:ln` under `spPr` when present.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @returns {DirectLine} The result.
 */
export function readDirectLine(shapeElement: OoxmlElement): DirectLine {
    const spPr: OoxmlElement = findShapeSpPr(shapeElement);
    const ln: OoxmlElement = spPr === undefined ? undefined : findChild(spPr, getGradientDrawingNamespace(spPr.namespaceUri) || DML_NS, 'ln');
    return readLineElement(ln);
}
/** Reads an existing line carrier without manufacturing a shape or changing its source.
 *
 * @param {OoxmlElement} ln - Actual shape/table line carrier or absent.
 * @returns {DirectLine} Direct lexical line properties.
 * @internal
 */
export function readLineElement(ln: OoxmlElement | undefined): DirectLine {
    if (ln === undefined) {
        return {
            present: false,
            widthEmu: undefined,
            cap: undefined,
            compound: undefined,
            align: undefined,
            presetDash: undefined,
            join: undefined,
            headEnd: undefined,
            tailEnd: undefined,
            fill: { kind: 'missing' }
        };
    }
    const prstDash: OoxmlElement = findChild(ln, DML_NS, 'prstDash');
    return {
        present: true,
        widthEmu: parseOptionalNonNegInt(getAttr(ln, '', 'w')),
        cap: getAttr(ln, '', 'cap'),
        compound: getAttr(ln, '', 'cmpd'),
        align: getAttr(ln, '', 'algn'),
        presetDash: prstDash === undefined ? undefined : getAttr(prstDash, '', 'val'),
        join: readLineJoin(ln),
        headEnd: readLineEnd(findChild(ln, DML_NS, 'headEnd')),
        tailEnd: readLineEnd(findChild(ln, DML_NS, 'tailEnd')),
        fill: readLineFill(ln)
    };
}
/**
 * Reads optional `CT_ShapeStyle` matrix references.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @returns {ShapeStyleRefs | undefined} The result.
 */
export function readShapeStyleRefs(shapeElement: OoxmlElement): ShapeStyleRefs | undefined {
    const style: OoxmlElement = findShapeStyle(shapeElement);
    if (style === undefined) {
        return undefined;
    }
    return {
        lnRef: readStyleMatrixRef(findChild(style, DML_NS, 'lnRef')),
        fillRef: readStyleMatrixRef(findChild(style, DML_NS, 'fillRef')),
        effectRef: readStyleMatrixRef(findChild(style, DML_NS, 'effectRef')),
        fontRef: readStyleMatrixRef(findChild(style, DML_NS, 'fontRef'))
    };
}
/**
 * View-only fill resolve: direct spPr fill wins; else style fillRef as ref; else missing.
 *
 * @remarks Does **not** expand theme `fmtScheme/fillStyleLst` into solid RGB. Style refs stay references. Inheritance from layout/master
 * placeholder fill is out of scope here (optional smoke for TASK-1015).
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @returns {ResolvedFill} The result.
 */
export function resolveFillView(shapeElement: OoxmlElement): ResolvedFill {
    const direct: DirectFill = readDirectFill(shapeElement);
    if (direct.kind !== 'missing') {
        return { kind: 'direct', fill: direct, source: 'direct' };
    }
    const styleRefs: ShapeStyleRefs = readShapeStyleRefs(shapeElement);
    const fillRef: StyleMatrixReference = (styleRefs == null ? undefined : styleRefs.fillRef);
    if (fillRef !== undefined) {
        return { kind: 'styleRef', fillRef, source: 'style' };
    }
    return { kind: 'missing', source: 'none' };
}
/**
 *
 * @param {OoxmlElement} ln - The ln value.
 * @returns {DirectLineFill} The result.
 */
function readLineFill(ln: OoxmlElement): DirectLineFill {
    const fillEl: OoxmlElement = findFirstFillChild(ln, LINE_FILL_LOCALS);
    if (fillEl === undefined) {
        return { kind: 'missing' };
    }
    switch (fillEl.localName) {
    case 'noFill':
        return { kind: 'noFill' };
    case 'solidFill':
        return readSolidFill(fillEl);
    case 'gradFill':
        return readGradientFill(fillEl);
    case 'pattFill':
        return readPatternFill(fillEl);
    default:
        return { kind: 'missing' };
    }
}
/**
 *
 * @param {OoxmlElement} fillEl - The fillEl value.
 * @returns {DirectFill} The result.
 */
function classifyShapeFill(fillEl: OoxmlElement): DirectFill {
    switch (fillEl.localName) {
    case 'noFill':
        return { kind: 'noFill' };
    case 'solidFill':
        return readSolidFill(fillEl);
    case 'gradFill':
        return readGradientFill(fillEl);
    case 'blipFill':
        return classifyBlipFill(fillEl);
    case 'pattFill':
        return readPatternFill(fillEl);
    case 'grpFill':
        return { kind: 'group' };
    default:
        return { kind: 'missing' };
    }
}

/**
 * Read one solid fill while keeping authored colour transforms direct.
 *
 * @param {OoxmlElement} element - `a:solidFill` element.
 * @returns {DirectFill} Direct solid fill.
 */
function readSolidFill(element: OoxmlElement): Extract<DirectFill, { readonly kind: 'solid' }> {
    const transforms: ThemeColorTransform[] = readColorTransforms(element);
    return {
        kind: 'solid',
        color: tryParseColorChoiceChild(element),
        ...(transforms.length > 0 ? { colorTransforms: transforms } : {})
    };
}

/**
 * Read one gradient fill through the shared DrawingML fill parser.
 *
 * @param {OoxmlElement} element - `a:gradFill` element.
 * @returns {DirectFill} Direct gradient fill.
 */
function readGradientFill(element: OoxmlElement): Extract<DirectFill, { readonly kind: 'gradient' }> {
    const authored: AuthoredGradientFill | undefined = readAuthoredGradient(element);
    if (authored === undefined) { throw new Error('Expected DrawingML gradFill parser result'); }
    const parsed: Extract<ThemeFillStyle, { readonly kind: 'gradient' }> = projectAuthoredGradient(authored);
    const shade: AuthoredGradientShade | undefined = authored.shade;
    return {
        kind: 'gradient', stops: parsed.stops, angle: parsed.angle,
        scaled: shade !== undefined && shade.kind === 'linear' && shade.scaled.kind === 'value' ? shade.scaled.value : undefined,
        rotateWithShape: authored.rotateWithShape.kind === 'value' ? authored.rotateWithShape.value : undefined,
        path: parsed.path, fillToRect: parsed.fillToRect
    };
}

/**
 * Read direct pattern token and its two authored colours.
 *
 * @param {OoxmlElement} element - `a:pattFill` element.
 * @returns {DirectFill} Direct pattern fill.
 */
function readPatternFill(element: OoxmlElement): Extract<DirectFill, { readonly kind: 'pattern' }> {
    const foreground: OoxmlElement = findChild(element, DML_NS, 'fgClr');
    const background: OoxmlElement = findChild(element, DML_NS, 'bgClr');
    return {
        kind: 'pattern',
        preset: getAttr(element, '', 'prst'),
        foregroundColor: foreground === undefined ? undefined : tryParseColorChoiceChild(foreground),
        foregroundTransforms: foreground === undefined ? [] : readColorTransforms(foreground),
        backgroundColor: background === undefined ? undefined : tryParseColorChoiceChild(background),
        backgroundTransforms: background === undefined ? [] : readColorTransforms(background)
    };
}

/**
 * Read the first supported line-join choice.
 *
 * @param {OoxmlElement} line - `a:ln` element.
 * @returns {LineJoin | undefined} Direct join when authored.
 */
function readLineJoin(line: OoxmlElement): LineJoin | undefined {
    if (findChild(line, DML_NS, 'round') !== undefined) {
        return { kind: 'round' };
    }
    if (findChild(line, DML_NS, 'bevel') !== undefined) {
        return { kind: 'bevel' };
    }
    const miter: OoxmlElement = findChild(line, DML_NS, 'miter');
    if (miter === undefined) {
        return undefined;
    }
    const raw: string = getAttr(miter, '', 'lim');
    const numeric: number = raw === undefined ? NaN : Number(raw);
    return { kind: 'miter', limit: Number.isFinite(numeric) ? numeric / 100000 : undefined };
}

/**
 * Read one direct line-ending property bag.
 *
 * @param {OoxmlElement | undefined} element - End element when authored.
 * @returns {LineEnd | undefined} Direct line ending.
 */
function readLineEnd(element: OoxmlElement | undefined): LineEnd | undefined {
    if (element === undefined) {
        return undefined;
    }
    return {
        type: getAttr(element, '', 'type'),
        width: getAttr(element, '', 'w'),
        length: getAttr(element, '', 'len')
    };
}

/**
 * Records blip relationship ids without resolving package parts or URLs.
 *
 * @param {OoxmlElement} blipFill - The blipFill value.
 * @returns {DirectFill} The result.
 */
function classifyBlipFill(blipFill: OoxmlElement): DirectFill {
    const blip: OoxmlElement = findChild(blipFill, DML_NS, 'blip');
    if (blip === undefined) {
        return {
            kind: 'blip',
            embedRelationshipId: undefined,
            linkRelationshipId: undefined
        };
    }
    return {
        kind: 'blip',
        embedRelationshipId: getAttr(blip, OFFICE_REL_ATTR_NS, 'embed'),
        linkRelationshipId: getAttr(blip, OFFICE_REL_ATTR_NS, 'link')
    };
}
/**
 *
 * @param {OoxmlElement | undefined} el - The el value.
 * @returns {StyleMatrixReference | undefined} The result.
 */
function readStyleMatrixRef(el: OoxmlElement | undefined): StyleMatrixReference | undefined {
    if (el === undefined) {
        return undefined;
    }
    const idx: string = getAttr(el, '', 'idx');
    if (idx === undefined) {
        return undefined;
    }
    const transforms: ThemeColorTransform[] = readColorTransforms(el);
    return {
        idx,
        color: tryParseColorChoiceChild(el),
        ...(transforms.length > 0 ? { colorTransforms: transforms } : {})
    };
}
/**
 *
 * @param {OoxmlElement} parent - The parent value.
 * @param {ReadonlySet<string>} allowed - The allowed value.
 * @returns {OoxmlElement | undefined} The result.
 */
function findFirstFillChild(parent: OoxmlElement, allowed: ReadonlySet<string>): OoxmlElement | undefined {
    const ns: string | undefined = getGradientDrawingNamespace(parent.namespaceUri);
    if (ns === undefined) { return undefined; }
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' && child.namespaceUri === ns && allowed.has(child.localName)) {
            return child;
        }

    }
    return undefined;
}
/**
 *
 * @param {string | undefined} raw - The raw value.
 * @returns {number | undefined} The result.
 */
function parseOptionalNonNegInt(raw: string | undefined): number | undefined {
    if (raw === undefined || raw.length === 0) {
        return undefined;
    }
    if (!/^\d+$/u.test(raw)) {
        return undefined;
    }
    const n: number = Number(raw);
    if (!Number.isSafeInteger(n) || n < 0) {
        return undefined;
    }
    return n;
}

/**
 * Reads complete shape fill-reference context alongside compatible style views.
 *
 * @param {OoxmlElement} shape - Shape whose direct style is inspected.
 * @param {string} partName - Optional owning package part.
 * @returns {AuthoredFillMatrixReference | undefined} Sparse direct reference without fallback.
 * @internal
 */
export function readShapeFillReference(shape: OoxmlElement, partName?: string): AuthoredFillMatrixReference | undefined {
    const style: OoxmlElement | undefined = findShapeStyle(shape);
    if (style === undefined) { return undefined; }
    const ns: string | undefined = getGradientDrawingNamespace(style.namespaceUri);
    if (ns === undefined) { return undefined; }
    const reference: OoxmlElement | undefined = findChild(style, ns, 'fillRef');
    return reference === undefined ? undefined : readFillMatrixReference(reference, partName);
}

/**
 * Reads the selected direct fill from an exact DrawingML properties carrier.
 *
 * @param {OoxmlElement} properties - Shape, group, table or cell properties.
 * @returns {DirectFill} Legacy fill view; canonical sparse gradients remain separate.
 * @internal
 */
export function readFillProperties(properties: OoxmlElement): DirectFill {
    const ns: string | undefined = getGradientDrawingNamespace(properties.namespaceUri);
    if (ns === undefined) { return { kind: 'missing' }; }
    const fill: OoxmlElement | undefined = findFirstFillChild(properties, SHAPE_FILL_LOCALS);
    return fill === undefined ? { kind: 'missing' } : classifyShapeFill(fill);
}
