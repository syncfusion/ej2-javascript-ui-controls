import { readFontReferenceFills } from '../core/text/font-reference-fill';
/** Exact-namespace text fill bindings extracted from an already parsed part. */
import { OoxmlElement, OoxmlText } from '../core/xml/dom';
import { findChild, getAttr } from '../core/shapes/dom-utils';
import { getGradientDrawingNamespace } from '../core/theme/read-gradient';
import { TextCharacterFills } from '../core/text/character-fills';
import { arrayAt } from '../core/util/es5-compat';
/** Default list properties use level -1; normal levels are 0 through 8. @internal */
export interface TextFillLevel { readonly level: number; readonly characterFills: TextCharacterFills; }
/** Canonical direct text carrier bindings, excluding unsupported MC/math projections. @internal */
export interface TextFillBodyBinding {
    readonly id: string;
    readonly fontReferenceFills?: TextCharacterFills;
    readonly list: ReadonlyArray<TextFillLevel>;
    readonly paragraphs: ReadonlyArray<{
        readonly characterFills: TextCharacterFills | undefined;
        readonly end: TextCharacterFills | undefined;
        readonly content: ReadonlyArray<TextCharacterFills | undefined>;
    }>;
}
/** Authored bindings only; no inherited defaults or resolved colors. @internal */
export interface TextFillPartBindings {
    readonly shapes: ReadonlyArray<TextFillBodyBinding>;
    readonly defaultTextStyle: ReadonlyArray<TextFillLevel>;
    readonly titleStyle: ReadonlyArray<TextFillLevel>;
    readonly bodyStyle: ReadonlyArray<TextFillLevel>;
    readonly otherStyle: ReadonlyArray<TextFillLevel>;
}
/**
 * Reuses snapshots already read during canonical traversal. Only exact PML/DML
 * owners participate; MC/math paragraphs are left in the raw sidecar until their
 * selected-branch projection can supply stable content identity.
 *
 * @param {OoxmlElement} root - Already parsed complete package part.
 * @param {ReadonlyMap<OoxmlElement, TextCharacterFills>} fills - Explicit carriers by DOM identity.
 * @returns {TextFillPartBindings} Clone-safe host bindings.
 */
export function readTextFillPartBindings(root: OoxmlElement,
                                         fills: ReadonlyMap<OoxmlElement, TextCharacterFills>): TextFillPartBindings {
    const pml: string = root.namespaceUri;
    const ns: string = pml === 'http://purl.oclc.org/ooxml/presentationml/main' ?
        'http://purl.oclc.org/ooxml/drawingml/main' : 'http://schemas.openxmlformats.org/drawingml/2006/main';
    const shapes: TextFillBodyBinding[] = [];
    const valid: boolean = pml === 'http://purl.oclc.org/ooxml/presentationml/main' ||
        pml === 'http://schemas.openxmlformats.org/presentationml/2006/main';
    const styles: OoxmlElement | undefined = valid ? findChild(root, pml, 'txStyles') : undefined;
    /**
     * @param {OoxmlElement | undefined} list - Exact applicable list owner.
     * @returns {TextFillLevel[]} Sparse levels including independent defPPr.
     */
    function levels(list: OoxmlElement | undefined): TextFillLevel[] {
        const result: TextFillLevel[] = [];
        if (list === undefined) { return result; }
        for (let i: number = -1; i < 9; i++) {
            const owner: OoxmlElement | undefined = findChild(list, ns, i < 0 ? 'defPPr' : 'lvl' + String(i + 1) + 'pPr');
            const properties: OoxmlElement | undefined = owner === undefined ? undefined : findChild(owner, ns, 'defRPr');
            const value: TextCharacterFills | undefined = properties === undefined ? undefined : fills.get(properties);
            if (value !== undefined) { result.push({ level: i, characterFills: value }); }
        }
        return result;
    }
    /**
     * @param {OoxmlElement} element - Bounded parsed tree node.
     * @returns {void} Collects only safely bindable shape text bodies.
     */
    function visit(element: OoxmlElement): void {
        if (element.namespaceUri !== pml) { return; }
        if (element.localName === 'sp' || element.localName === 'cxnSp') {
            const body: OoxmlElement | undefined = findChild(element, pml, 'txBody');
            const nv: OoxmlElement | undefined = findChild(element, pml, element.localName === 'sp' ? 'nvSpPr' : 'nvCxnSpPr');
            const identity: OoxmlElement | undefined = nv === undefined ? undefined : findChild(nv, pml, 'cNvPr');
            const id: string | undefined = identity === undefined ? undefined : getAttr(identity, '', 'id');
            if (body !== undefined && id !== undefined) {
                const paragraphs: TextFillBodyBinding['paragraphs'][number][] = [];
                const directParagraphs: OoxmlElement[] = children(body, ns, 'p');
                let safeParagraphs: boolean = true;
                const pending: OoxmlElement[] = [body];
                for (let cursor: number = 0; cursor < pending.length; cursor++) {
                    const owner: OoxmlElement = arrayAt(pending, cursor);
                    for (let i: number = 0; i < owner.children.length; i++) {
                        const child: OoxmlElement | OoxmlText = arrayAt(owner.children, i);
                        if (child.kind !== 'element') { continue; }
                        if (child.localName === 'p' && (owner !== body || child.namespaceUri !== ns)) { safeParagraphs = false; }
                        pending.push(child);
                    }
                }
                for (const paragraph of directParagraphs) {
                    const pPr: OoxmlElement | undefined = findChild(paragraph, ns, 'pPr');
                    const def: OoxmlElement | undefined = pPr === undefined ? undefined : findChild(pPr, ns, 'defRPr');
                    const end: OoxmlElement | undefined = findChild(paragraph, ns, 'endParaRPr');
                    const content: (TextCharacterFills | undefined)[] = [];
                    let safe: boolean = true;
                    for (let i: number = 0; i < paragraph.children.length; i++) {
                        const child: OoxmlElement | OoxmlText = arrayAt(paragraph.children, i);
                        if (child.kind !== 'element') { continue; }
                        if (child.namespaceUri !== ns) { safe = false; continue; }
                        if (child.localName === 'r' || child.localName === 'fld' || child.localName === 'br') {
                            const properties: OoxmlElement | undefined = findChild(child, ns, 'rPr');
                            content.push(properties === undefined ? undefined : fills.get(properties));
                        }
                    }
                    paragraphs.push({ characterFills: def === undefined ? undefined : fills.get(def),
                        end: end === undefined ? undefined : fills.get(end), content: safe ? content : [] });
                }
                shapes.push({ id, fontReferenceFills: readFontReferenceFills(element), list: levels(findChild(body, ns, 'lstStyle')), paragraphs: safeParagraphs ? paragraphs : [] });
            }
            return;
        }
        for (let i: number = 0; i < element.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(element.children, i);
            if (child.kind === 'element') { visit(child); }
        }
    }
    if (valid && getGradientDrawingNamespace(ns) !== undefined) { visit(root); }
    return { shapes, defaultTextStyle: levels(valid ? findChild(root, pml, 'defaultTextStyle') : undefined),
        titleStyle: levels(styles === undefined ? undefined : findChild(styles, pml, 'titleStyle')),
        bodyStyle: levels(styles === undefined ? undefined : findChild(styles, pml, 'bodyStyle')),
        otherStyle: levels(styles === undefined ? undefined : findChild(styles, pml, 'otherStyle')) };
}
/**
 * @param {OoxmlElement} owner - Exact owner.
 * @param {string} ns - Owning dialect.
 * @param {string} name - Direct child kind.
 * @returns {OoxmlElement[]} Matching direct children.
 */
function children(owner: OoxmlElement, ns: string, name: string): OoxmlElement[] {
    return owner.children.filter((child: OoxmlElement | OoxmlText): child is OoxmlElement =>
        child.kind === 'element' && child.namespaceUri === ns && child.localName === name);
}
