import { readFontReferenceFills } from '../text/font-reference-fill';
/** Host traversal for character fill views; never modifies authored formatting. */
import { PresentationError } from '../errors';
import { Shape } from '../shapes/shape';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { getGradientDrawingNamespace } from '../theme/read-gradient';
import { findChild, getAttr } from '../shapes/dom-utils';
import { readTextCharacterFills } from '../text/character-fills';
import { ResolveContext } from './resolve-style';
import { txStylesBucketForPlaceholderType } from './tx-styles';
import { EffectiveTextCharacterFills, TextFillInheritanceSource, resolveTextCharacterFills } from './resolve-text-fills';
import { arrayAt } from '../util/es5-compat';
/** Character target; run and field indices count their own element kinds. @public */
export type TextFillTarget = { readonly kind: 'paragraph' | 'end'; } |
{ readonly kind: 'run' | 'field'; readonly index: number; };
/**
 * Resolves an explicitly selected character target through existing placeholder
 * matches, per-level list defaults and master/presentation defaults. End formatting
 * is considered only for end targets; visible glyphs never inherit endParaRPr.
 *
 * @param {Shape} shape - Owning shape.
 * @param {number} paragraphIndex - Zero-based paragraph index.
 * @param {TextFillTarget} target - Separate run, field, default or insertion target.
 * @param {ResolveContext} context - Existing matched placeholder sources.
 * @returns {EffectiveTextCharacterFills} Independent non-mutating carrier views.
 * @internal
 */
export function resolveHostTextFills(shape: Shape, paragraphIndex: number, target: TextFillTarget,
                                     context: ResolveContext): EffectiveTextCharacterFills {
    if (target === null || typeof target !== 'object' ||
        ['paragraph', 'end', 'run', 'field'].indexOf(target.kind) < 0) {
        throw new PresentationError('model/invalid-argument', 'Invalid text fill target for shape ' + shape.id);
    }
    const sources: TextFillInheritanceSource[] = [];
    const body: OoxmlElement | undefined = textBody(shape);
    const paragraph: OoxmlElement | undefined = body === undefined ? undefined : childAt(body, 'p', paragraphIndex);
    const ns: string = paragraph === undefined ? '' : paragraph.namespaceUri;
    const pPr: OoxmlElement | undefined = paragraph === undefined ? undefined : findChild(paragraph, ns, 'pPr');
    if (paragraph === undefined) { throw new PresentationError('model/out-of-range',
                                                               'Text paragraph index ' + String(paragraphIndex) + ' is out of range for shape ' + shape.id); }
    if ((target.kind === 'run' || target.kind === 'field') &&
        childAt(paragraph, target.kind === 'run' ? 'r' : 'fld', target.index) === undefined) {
        throw new PresentationError('model/out-of-range',
                                    'Text ' + target.kind + ' index ' + String(target.index) + ' is out of range for shape ' + shape.id +
            ', paragraph ' + String(paragraphIndex));
    }
    const lexical: string | undefined = pPr === undefined ? undefined : getAttr(pPr, '', 'lvl');
    const level: number = lexical !== undefined && /^[+-]?\d+$/u.test(lexical.trim()) &&
        Number.isSafeInteger(Number(lexical)) && Number(lexical) >= 0 && Number(lexical) <= 8 ? Number(lexical) : 0;
    addShape(sources, shape, paragraphIndex, target, level, 'direct');
    if (context.layoutShape !== undefined) { addShape(sources, context.layoutShape, paragraphIndex, target, level, 'layout'); }
    if (context.masterShape !== undefined) { addShape(sources, context.masterShape, paragraphIndex, target, level, 'master'); }
    if (context.masterTxStyles !== undefined && context.placeholderType !== undefined) {
        addList(sources, findChild(context.masterTxStyles, context.masterTxStyles.namespaceUri,
                                   txStylesBucketForPlaceholderType(context.placeholderType)),
                level, 'txStyles');
    }
    addList(sources, context.defaultTextStyle, level, 'defaultTextStyle');
    sources.push({ id: 'fontRef', fills: readFontReferenceFills(shape.getElement()) });
    return resolveTextCharacterFills(sources);
}
/**
 * @param {TextFillInheritanceSource[]} sources - Ordered destination.
 * @param {Shape} shape - Applicable placeholder or direct shape.
 * @param {number} index - Paragraph index.
 * @param {TextFillTarget} target - Independent character target.
 * @param {number} level - Owning slide paragraph list level.
 * @param {string} id - Source identity.
 * @returns {void} Appends sparse applicable sources.
 */
function addShape(sources: TextFillInheritanceSource[], shape: Shape, index: number,
                  target: TextFillTarget, level: number, id: string): void {
    const body: OoxmlElement | undefined = textBody(shape);
    if (body === undefined) { return; }
    const ns: string | undefined = drawingNamespace(body);
    if (ns === undefined) { return; }
    const paragraph: OoxmlElement | undefined = childAt(body, 'p', index);
    if (paragraph !== undefined) {
        if (target.kind === 'end') { add(sources, findChild(paragraph, ns, 'endParaRPr'), id + '/end'); }
        if (target.kind === 'run' || target.kind === 'field') {
            const item: OoxmlElement | undefined = childAt(paragraph, target.kind === 'run' ? 'r' : 'fld', target.index);
            if (item !== undefined) { add(sources, findChild(item, ns, 'rPr'), id + '/' + target.kind); }
        }
        const properties: OoxmlElement | undefined = findChild(paragraph, ns, 'pPr');
        if (properties !== undefined) { add(sources, findChild(properties, ns, 'defRPr'), id + '/paragraph'); }
    }
    addList(sources, findChild(body, ns, 'lstStyle'), level, id + '/list');
}
/**
 * @param {TextFillInheritanceSource[]} sources - Ordered destination.
 * @param {OoxmlElement | undefined} list - Applicable list style.
 * @param {number} level - Zero-based list level.
 * @param {string} id - Source identity.
 * @returns {void} Adds level then defPPr fallback independently per carrier.
 */
function addList(sources: TextFillInheritanceSource[], list: OoxmlElement | undefined, level: number, id: string): void {
    if (list === undefined) { return; }
    const ns: string | undefined = drawingNamespace(list);
    if (ns === undefined) { return; }
    const selected: OoxmlElement | undefined = findChild(list, ns, 'lvl' + String(level + 1) + 'pPr');
    if (selected !== undefined) { add(sources, findChild(selected, ns, 'defRPr'), id + '/level' + String(level)); }
    const fallback: OoxmlElement | undefined = findChild(list, ns, 'defPPr');
    if (fallback !== undefined) { add(sources, findChild(fallback, ns, 'defRPr'), id + '/default'); }
}
/**
 * @param {TextFillInheritanceSource[]} sources - Ordered destination.
 * @param {OoxmlElement | undefined} element - Direct character properties.
 * @param {string} id - Source identity.
 * @returns {void} Appends an authored snapshot without creating XML.
 */
function add(sources: TextFillInheritanceSource[], element: OoxmlElement | undefined, id: string): void {
    if (element !== undefined) { sources.push({ id, fills: readTextCharacterFills(element) }); }
}
/**
 * @param {Shape} shape - Shape owning a PresentationML text body.
 * @returns {OoxmlElement | undefined} Exact-namespace text body.
 */
function textBody(shape: Shape): OoxmlElement | undefined {
    const root: OoxmlElement = shape.getElement();
    return findChild(root, root.namespaceUri, 'txBody');
}
/**
 * @param {OoxmlElement} parent - Text body or DrawingML owner.
 * @returns {string | undefined} Exact supported DrawingML dialect.
 */
function drawingNamespace(parent: OoxmlElement): string | undefined {
    return getGradientDrawingNamespace(parent.namespaceUri) ||
        (parent.namespaceUri === 'http://schemas.openxmlformats.org/presentationml/2006/main' ?
            'http://schemas.openxmlformats.org/drawingml/2006/main' :
            parent.namespaceUri === 'http://purl.oclc.org/ooxml/presentationml/main' ?
                'http://purl.oclc.org/ooxml/drawingml/main' : undefined);
}
/**
 * @param {OoxmlElement} parent - Owning element.
 * @param {string} name - DrawingML child kind.
 * @param {number} index - Zero-based kind-specific index.
 * @returns {OoxmlElement | undefined} Selected exact-namespace child.
 */
function childAt(parent: OoxmlElement, name: string, index: number): OoxmlElement | undefined {
    const ns: string | undefined = drawingNamespace(parent);
    if (ns === undefined || !Number.isSafeInteger(index) || index < 0) { return undefined; }
    let count: number = 0;
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' && child.namespaceUri === ns && child.localName === name) {
            if (count === index) { return child; } count++;
        }
    }
    return undefined;
}
