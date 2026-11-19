/**
 * Common plain-text and structure query APIs for DrawingML diagram points.
 *
 * @remarks
 * Text lives under `dgm:pt/dgm:t` as DrawingML `a:CT_TextBody` (`dml-main.xsd`:
 * required `bodyPr`, optional `lstStyle`, one or more `p`). Plain text is the
 * concatenation of `a:t` under each paragraph, with paragraphs joined by `\n`.
 * Write rebuilds a minimal schema-valid text body while preserving other `pt`
 * children and any existing `bodyPr` / `lstStyle`. Citations: `dml-diagram.xsd`
 * `CT_Pt`; `dml-main.xsd` `CT_TextBody` / `CT_TextParagraph`; ECMA-376 Part 1
 * §14.2.4. Structure add/remove of points and connections is deferred (no
 * schema-valid factory beyond enumerate in this task).
 * @public
 */

import { cloneElement, elementChildren, findChild, getAttribute, DiagramXmlElement, DiagramXmlNode, DiagramXmlAttribute } from './diagram-xml';
import { DiagramPartError } from './errors';
import { DIAGRAM_NAMESPACE, DRAWINGML_MAIN_NAMESPACE } from './namespaces';
import { parseDiagramData } from './parse-data';
import { serializeDiagramData } from './serialize';
import { DiagramConnection, DiagramDataPart, DiagramPoint } from './types';

/**
 * Returns the points of a Diagram Data part (structure enumerate).
 *
 * @param {DiagramDataPart} data - Parsed {@link DiagramDataPart}.
 * @returns {ReadonlyArray<DiagramPoint>} The part's `points` array (same reference; treat as read-only).
 * @public
 */
export function listDiagramPoints(data: DiagramDataPart): ReadonlyArray<DiagramPoint> {
    return data.points;
}

/**
 * Returns the connections of a Diagram Data part (structure enumerate).
 *
 * @param {DiagramDataPart} data - Parsed {@link DiagramDataPart}.
 * @returns {ReadonlyArray<DiagramConnection>} The part's `connections` array (same reference; treat as read-only).
 * @public
 */
export function listDiagramConnections(data: DiagramDataPart): ReadonlyArray<DiagramConnection> {
    return data.connections;
}

/**
 * Finds a point by `modelId`.
 *
 * @param {DiagramDataPart} data - Parsed {@link DiagramDataPart}.
 * @param {string} modelId - `dgm:pt@modelId` value.
 * @returns {DiagramPoint | undefined} The matching {@link DiagramPoint}, or `undefined` when absent.
 * @public
 */
export function diagramPoint(data: DiagramDataPart, modelId: string): DiagramPoint | undefined {
    for (const point of data.points) {
        if (point.modelId === modelId) {
            return point;
        }
    }
    return undefined;
}

/**
 * Reads plain text from a diagram point's `dgm:t` DrawingML text body.
 *
 * @param {DiagramPoint} point - Modeled point (from parse or {@link listDiagramPoints}).
 * @returns {string} Plain text; empty string when the point has no text body or no `a:t`.
 * @remarks
 * Walks `a:p` paragraphs in document order. Within each paragraph, concatenates
 * text from `a:t` descendants (including under `a:r` and `a:fld`). Paragraphs
 * are joined with `\n`. Missing `dgm:t` yields an empty string.
 * @public
 */
export function diagramPointText(point: DiagramPoint): string {
    const textBody: DiagramXmlElement = point.textBody != null ? point.textBody : findChild(point.element, 't', DIAGRAM_NAMESPACE);
    if (textBody === undefined) {
        return '';
    }
    return plainTextFromTextBody(textBody);
}

/**
 * Returns a new {@link DiagramDataPart} with plain text written to the named point.
 *
 * @param {DiagramDataPart} data - Source data part (immutable).
 * @param {string} modelId - Target `dgm:pt@modelId`.
 * @param {string} text - Plain text; `\n` splits paragraphs.
 * @returns {DiagramDataPart} New data part with updated point text and synced root.
 * @remarks
 * Does not mutate `data`. Rebuilds `dgm:t` as a minimal valid `a:CT_TextBody`
 * (`bodyPr` + one `p`/`r`/`t` per line). When a text body already exists,
 * `bodyPr` and `lstStyle` (if present) are preserved; paragraph children are
 * replaced. Other `dgm:pt` siblings and package root extensions are preserved
 * via root rewrite + reparse. Unknown `modelId` throws.
 *
 * Prefer this name over a `set*` verb (API-RULES R1.1 content-mutation ban on
 * `set*` / free-function `set*` patterns).
 * @throws {DiagramPartError} When no point matches `modelId`.
 * @public
 */
export function withDiagramPointText(data: DiagramDataPart, modelId: string, text: string): DiagramDataPart {
    const target: DiagramPoint = diagramPoint(data, modelId);
    if (target === undefined) {
        throw new DiagramPartError(`Unknown diagram point modelId "${modelId}"`);
    }
    const newRoot: DiagramXmlElement = replacePointTextOnRoot(data.root, modelId, text);
    // Reparse so points[].textBody / element stay consistent with root.
    return parseDiagramData(serializeDiagramData({
        ...data,
        root: newRoot
    }));
}
/**
 * The plain text from text body.
 *
 * @param {DiagramXmlElement} textBody - The text body.
 * @returns {string} The result.
 */
function plainTextFromTextBody(textBody: DiagramXmlElement): string {
    const paragraphs: DiagramXmlElement[] = elementChildren(textBody).filter((el: DiagramXmlElement) => el.localName === 'p' && el.namespaceUri === DRAWINGML_MAIN_NAMESPACE);
    if (paragraphs.length === 0) {
    // Fallback: collect any a:t under the body (malformed-but-present text).
        return collectDrawingMlText(textBody);
    }
    return paragraphs.map((p: DiagramXmlElement) => collectDrawingMlText(p)).join('\n');
}
/**
 * The collect drawing ml text.
 *
 * @param {DiagramXmlElement} el - The el.
 * @returns {string} The result.
 */
function collectDrawingMlText(el: DiagramXmlElement): string {
    let out: string = '';
    for (const child of el.children) {
        if (child.kind === 'text') {
            continue;
        }
        if (child.localName === 't' && child.namespaceUri === DRAWINGML_MAIN_NAMESPACE) {
            out += textContent(child);
            continue;
        }
        out += collectDrawingMlText(child);
    }
    return out;
}
/**
 * The text content.
 *
 * @param {DiagramXmlElement} el - The el.
 * @returns {string} The result.
 */
function textContent(el: DiagramXmlElement): string {
    let out: string = '';
    for (const child of el.children) {
        if (child.kind === 'text') {
            out += child.value;
        } else {
            out += textContent(child);
        }
    }
    return out;
}
/**
 * The replace point text on root.
 *
 * @param {DiagramXmlElement} root - The root.
 * @param {string} modelId - The model id.
 * @param {string} text - The text.
 * @returns {DiagramXmlElement} The result.
 */
function replacePointTextOnRoot(root: DiagramXmlElement, modelId: string, text: string): DiagramXmlElement {
    return mapTree(root, (el: DiagramXmlElement) => {
        if (el.localName === 'pt' && el.namespaceUri === DIAGRAM_NAMESPACE && getAttribute(el, 'modelId') === modelId) {
            return withPointTextElement(el, text);
        }
        return undefined;
    });
}

/**
 * Deep-maps an element tree. When `visitor` returns an element, that subtree is
 * replaced as-is (no further recursion into the replacement). Otherwise children
 * are mapped recursively.
 *
 * @param {DiagramXmlElement} el - The el.
 * @param {Function} visitor - The visitor.
 * @returns {DiagramXmlElement} The result.
 */
function mapTree(el: DiagramXmlElement, visitor: (node: DiagramXmlElement) => DiagramXmlElement | undefined): DiagramXmlElement {
    const replaced: DiagramXmlElement = visitor(el);
    if (replaced !== undefined) {
        return replaced;
    }
    let changed: boolean = false;
    const children: DiagramXmlNode[] = [];
    for (const child of el.children) {
        if (child.kind === 'text') {
            children.push({
                kind: 'text',
                value: child.value
            });
            continue;
        }
        const next: DiagramXmlElement = mapTree(child, visitor);
        if (next !== child) {
            changed = true;
        }
        children.push(next);
    }
    if (!changed) {
        return el;
    }
    return { kind: 'element',
        prefix: el.prefix,
        localName: el.localName,
        namespaceUri: el.namespaceUri,
        qName: el.qName,
        attributes: el.attributes.map((a: DiagramXmlAttribute) => ({
            ...a
        })),
        children
    };
}
/**
 * The with point text element.
 *
 * @param {DiagramXmlElement} pt - The pt.
 * @param {string} text - The text.
 * @returns {DiagramXmlElement} The result.
 */
function withPointTextElement(pt: DiagramXmlElement, text: string): DiagramXmlElement {
    const existingT: DiagramXmlElement = findChild(pt, 't', DIAGRAM_NAMESPACE);
    const newT: DiagramXmlElement = buildTextBodyElement(existingT, text);
    const children: DiagramXmlNode[] = [];
    let replaced: boolean = false;
    for (const child of pt.children) {
        if (!replaced && child.kind === 'element' && child.localName === 't' && child.namespaceUri === DIAGRAM_NAMESPACE) {
            children.push(newT);
            replaced = true;
            continue;
        }
        if (child.kind === 'text') {
            children.push({
                kind: 'text',
                value: child.value
            });
        } else {
            children.push(cloneElement(child));
        }
    }
    if (!replaced) {
        children.push(newT);
    }
    return { kind: 'element',
        prefix: pt.prefix,
        localName: pt.localName,
        namespaceUri: pt.namespaceUri,
        qName: pt.qName,
        attributes: pt.attributes.map((a: DiagramXmlAttribute) => ({
            ...a
        })),
        children
    };
}

/**
 * Builds `dgm:t` with DrawingML `a:CT_TextBody` children.
 *
 * Order per XSD: bodyPr (required), lstStyle (optional), p+ (required ≥1).
 *
 * @param {DiagramXmlElement | undefined} existing - The existing.
 * @param {string} text - The text.
 * @returns {DiagramXmlElement} The result.
 */
function buildTextBodyElement(existing: DiagramXmlElement | undefined, text: string): DiagramXmlElement {
    const aPrefix: string = existing !== undefined ? drawingMlPrefix(existing) : 'a';
    const dgmPrefix: string = (existing == null ? void 0 : existing.prefix) && existing.prefix.length > 0 ? existing.prefix : 'dgm';
    const bodyPr: DiagramXmlElement = existing !== undefined ? findChild(existing, 'bodyPr', DRAWINGML_MAIN_NAMESPACE) : undefined;
    const lstStyle: DiagramXmlElement = existing !== undefined ? findChild(existing, 'lstStyle', DRAWINGML_MAIN_NAMESPACE) : undefined;
    const lines: string[] = splitPlainTextLines(text);
    const paragraphs: DiagramXmlElement[] = lines.map((line: string) => aElement(aPrefix, 'p', [aElement(aPrefix, 'r', [aTextElement(aPrefix, line)])]));
    const children: DiagramXmlNode[] = [];
    if (bodyPr !== undefined) {
        children.push(cloneElement(bodyPr));
    } else {
        children.push(aElement(aPrefix, 'bodyPr', []));
    }
    if (lstStyle !== undefined) {
        children.push(cloneElement(lstStyle));
    }
    for (const p of paragraphs) {
        children.push(p);
    }

    // Ensure xmlns:a is in scope on dgm:t when the root may not declare it yet
    // (e.g. blank points from minimal samples that only declare dgm).
    const attributes: {
        prefix: string;
        localName: string;
        namespaceUri: string;
        value: string;
        qName: string;
    }[] = existing !== undefined ? existing.attributes.map((a: DiagramXmlAttribute) => ({
        ...a
    })) : [{
        prefix: 'xmlns',
        localName: 'a',
        namespaceUri: 'http://www.w3.org/2000/xmlns/',
        value: DRAWINGML_MAIN_NAMESPACE,
        qName: 'xmlns:a'
    }];

    // If existing t lacked xmlns:a and ancestors also might miss it after rewrite,
    // ensure declaration when we detect no a attributes already present.
    const hasANs: boolean = attributes.some((a: DiagramXmlAttribute) =>
        a.prefix === 'xmlns' && a.localName === 'a' ||
        a.prefix === '' && a.localName === 'xmlns' && a.value === DRAWINGML_MAIN_NAMESPACE);
    const finalAttributes: {
        prefix: string;
        localName: string;
        namespaceUri: string;
        value: string;
        qName: string;
    }[] = hasANs ? attributes : [...attributes, {
        prefix: 'xmlns',
        localName: 'a',
        namespaceUri: 'http://www.w3.org/2000/xmlns/',
        value: DRAWINGML_MAIN_NAMESPACE,
        qName: 'xmlns:a'
    }];
    return { kind: 'element',
        prefix: dgmPrefix,
        localName: 't',
        namespaceUri: DIAGRAM_NAMESPACE,
        qName: dgmPrefix.length > 0 ? `${dgmPrefix}:t` : 't',
        attributes: finalAttributes,
        children
    };
}
/**
 * The split plain text lines.
 *
 * @param {string} text - The text.
 * @returns {string[]} The result.
 */
function splitPlainTextLines(text: string): string[] {
    if (text.length === 0) {
        return [''];
    }
    return text.split('\n');
}
/**
 * The a element.
 *
 * @param {string} prefix - The prefix.
 * @param {string} localName - The local name.
 * @param {ReadonlyArray<DiagramXmlNode>} children - The children.
 * @returns {DiagramXmlElement} The result.
 */
function aElement(prefix: string, localName: string, children: ReadonlyArray<DiagramXmlNode>): DiagramXmlElement {
    const p: string = prefix.length > 0 ? prefix : 'a';
    return { kind: 'element',
        prefix: p,
        localName,
        namespaceUri: DRAWINGML_MAIN_NAMESPACE,
        qName: `${p}:${localName}`,
        attributes: [],
        children: [...children]
    };
}
/**
 * The a text element.
 *
 * @param {string} prefix - The prefix.
 * @param {string} value - The value.
 * @returns {DiagramXmlElement} The result.
 */
function aTextElement(prefix: string, value: string): DiagramXmlElement {
    return aElement(prefix, 't', [{
        kind: 'text',
        value
    }]);
}
/**
 * The drawing ml prefix.
 *
 * @param {DiagramXmlElement} textBody - The text body.
 * @returns {string} The result.
 */
function drawingMlPrefix(textBody: DiagramXmlElement): string {
    for (const child of elementChildren(textBody)) {
        if (child.namespaceUri === DRAWINGML_MAIN_NAMESPACE && child.prefix.length > 0) {
            return child.prefix;
        }
    }
    return 'a';
}
