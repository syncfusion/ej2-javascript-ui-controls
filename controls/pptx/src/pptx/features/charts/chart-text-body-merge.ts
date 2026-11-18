/** Character-format merge for engine-owned chart text commands. */
import { OoxmlAttribute, OoxmlNamespaceDeclaration, OoxmlElement, OoxmlText } from '../../core/xml/dom';
import { asMutable } from '../../core/shapes/dom-utils';
import { cloneScopedElement } from '../../core/xml/clone-scoped-element';
import { SecurityLimits } from '../../core/security/limits';
/** Source character-property merger, with explicit unchanged-color intent. @internal */
export type ChartCharacterMerge = (source: OoxmlElement, before: OoxmlElement | undefined,
    after: OoxmlElement | undefined, forceFill: boolean) => void;
/**
 * @param {OoxmlElement} sourceRoot - Actual complete source.
 * @param {OoxmlElement} source - Original tx/txPr slot.
 * @param {OoxmlElement | undefined} before - Engine's prior slot.
 * @param {OoxmlElement} after - Engine's new slot.
 * @param {SecurityLimits} limits - Package limits.
 * @param {string} partName - Chart part identity.
 * @param {ChartCharacterMerge} merge - Existing source-preserving character delta merger.
 * @param {boolean} forceFill - Explicit solid-color assignment, including unchanged engine fallback.
 * @param {boolean} preserveContent - Preserve a reference defaults body while merging only font changes.
 * @returns {OoxmlElement} Independent slot retaining authored formatting and applying engine text/font intent.
 * @internal
 */
export function mergeChartTextBody(sourceRoot: OoxmlElement, source: OoxmlElement, before: OoxmlElement | undefined,
                                   after: OoxmlElement, limits: SecurityLimits, partName: string,
                                   merge: ChartCharacterMerge, forceFill: boolean, preserveContent: boolean = false): OoxmlElement {
    const originalBody: OoxmlElement | undefined = body(source); const previousBody: OoxmlElement | undefined = before && body(before);
    const nextBody: OoxmlElement | undefined = body(after);
    const sourceCopy: OoxmlElement = cloneScopedElement({ root: sourceRoot, node: source, partName }, { limits, partName });
    if (!originalBody || !nextBody) { return after; }
    const sameText: boolean = preserveContent || text(previousBody) === text(nextBody);
    const output: OoxmlElement = sourceCopy;
    const resultBody: OoxmlElement | undefined = body(output);
    if (!resultBody) { return output; }
    const main: string = sourceRoot.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/chart' ?
        'http://purl.oclc.org/ooxml/drawingml/main' : 'http://schemas.openxmlformats.org/drawingml/2006/main';
    const sourceParagraph: OoxmlElement | undefined = direct(originalBody, main, 'p');
    const sourceDefault: OoxmlElement | undefined = sourceParagraph && properties(sourceParagraph, main);
    const sourceRun: OoxmlElement | undefined = sourceParagraph && (firstRunProperties(sourceParagraph, main) || sourceDefault);
    const beforeParagraph: OoxmlElement | undefined = previousBody && direct(previousBody, main, 'p');
    const afterParagraph: OoxmlElement | undefined = direct(nextBody, main, 'p');
    const beforeDefault: OoxmlElement | undefined = beforeParagraph && properties(beforeParagraph, main);
    const afterDefault: OoxmlElement | undefined = afterParagraph && properties(afterParagraph, main);
    const beforeRun: OoxmlElement | undefined = beforeParagraph && firstRunProperties(beforeParagraph, main);
    const afterRun: OoxmlElement | undefined = afterParagraph && firstRunProperties(afterParagraph, main);
    if (!sameText) {
        const paragraphs: OoxmlElement[] = [];
        for (const node of nextBody.children) {
            if (node.kind === 'element' && node.namespaceUri === main && node.localName === 'p') { paragraphs.push(clone(node)); }
        }
        let inserted: boolean = false; const children: Array<OoxmlElement | OoxmlText> = [];
        for (const node of resultBody.children) {
            if (node.kind === 'element' && node.namespaceUri === main && node.localName === 'p') {
                if (!inserted) { children.push(...paragraphs); inserted = true; } continue;
            }
            children.push(node);
        }
        if (!inserted) { children.push(...paragraphs); } asMutable(resultBody).children = children;
    }
    for (const paragraph of resultBody.children) {
        if (paragraph.kind !== 'element' || paragraph.namespaceUri !== main || paragraph.localName !== 'p') { continue; }
        let pPr: OoxmlElement | undefined = direct(paragraph, main, 'pPr');
        if (!sameText && sourceParagraph) {
            const original: OoxmlElement | undefined = direct(sourceParagraph, main, 'pPr');
            const copied: OoxmlElement = original ? clone(original) : element(main, 'pPr');
            replace(paragraph, pPr, copied, 0); pPr = copied;
        }
        if (!pPr) { pPr = element(main, 'pPr'); asMutable(paragraph).children.unshift(pPr); }
        let defaults: OoxmlElement | undefined = direct(pPr, main, 'defRPr');
        if (!defaults) { defaults = sourceDefault && !sameText ? clone(sourceDefault) : element(main, 'defRPr'); const end: number = pPr.children.findIndex((node: OoxmlElement | OoxmlText): boolean =>
            node.kind === 'element' && node.namespaceUri === main && node.localName === 'extLst');
        asMutable(pPr).children.splice(end < 0 ? pPr.children.length : end, 0, defaults); }
        merge(defaults, beforeDefault, afterDefault, forceFill && hasFill(afterDefault, main));
        merge(defaults, beforeRun, afterRun, forceFill && !hasFill(afterDefault, main) && hasFill(afterRun, main));
        if (!sameText && !direct(paragraph, main, 'endParaRPr')) {
            asMutable(paragraph).children.push(sourceRun ? { ...clone(sourceRun), localName: 'endParaRPr' } : element(main, 'endParaRPr'));
        }
        for (const run of paragraph.children) {
            if (run.kind !== 'element' || run.namespaceUri !== main || ['r', 'fld', 'br', 'endParaRPr'].indexOf(run.localName) < 0) { continue; }
            let props: OoxmlElement | undefined = run.localName === 'endParaRPr' ? run : direct(run, main, 'rPr');
            if (!sameText) {
                const name: string = run.localName === 'endParaRPr' ? 'endParaRPr' : 'rPr';
                const copied: OoxmlElement = sourceRun ? { ...clone(sourceRun), localName: name } : element(main, name);
                if (run.localName === 'endParaRPr') { replace(paragraph, run, copied, paragraph.children.length); }
                else { replace(run, props, copied, 0); } props = copied;
            }
            if (!props) { props = element(main, 'rPr'); asMutable(run).children.unshift(props); }
            merge(props, beforeDefault, afterDefault, forceFill && hasFill(afterDefault, main));
            merge(props, beforeRun, afterRun, forceFill && !hasFill(afterDefault, main) && hasFill(afterRun, main));
        }
    }
    return output;
}
/** @param {OoxmlElement} slot - Native chart slot.
 * @returns {OoxmlElement | undefined} Native CT_TextBody. */
function body(slot: OoxmlElement): OoxmlElement | undefined {
    return slot.localName === 'txPr' ? slot : direct(slot, slot.namespaceUri, 'rich');
}
/** @param {OoxmlElement | undefined} node - Native body.
 * @returns {string} Plain glyph text with paragraph boundaries. */
function text(node: OoxmlElement | undefined): string {
    if (!node) { return ''; }
    if (node.localName === 't') { return node.children.map((child: OoxmlElement | OoxmlText): string => child.kind === 'text' ? child.text : '').join(''); }
    return node.children.map((child: OoxmlElement | OoxmlText): string => child.kind === 'element' ? text(child) +
        (child.localName === 'p' ? '\n' : child.localName === 'br' ? '\n' : '') : '').join('');
}
/** @param {OoxmlElement} paragraph - Native paragraph.
 * @param {string} ns - DrawingML namespace.
 * @returns {OoxmlElement | undefined} Default properties. */
function properties(paragraph: OoxmlElement, ns: string): OoxmlElement | undefined {
    const pPr: OoxmlElement | undefined = direct(paragraph, ns, 'pPr'); return pPr && direct(pPr, ns, 'defRPr');
}
/** @param {OoxmlElement} paragraph - Native paragraph.
 * @param {string} ns - DrawingML namespace.
 * @returns {OoxmlElement | undefined} First actual glyph owner's direct properties, including a leading field. */
function firstRunProperties(paragraph: OoxmlElement, ns: string): OoxmlElement | undefined {
    for (const run of paragraph.children) {
        if (run.kind !== 'element' || run.namespaceUri !== ns || ['r', 'fld'].indexOf(run.localName) < 0) { continue; }
        const value: OoxmlElement | undefined = direct(run, ns, 't');
        if (value && value.children.some((node: OoxmlElement | OoxmlText): boolean => node.kind === 'text' && node.text.length > 0)) {
            return direct(run, ns, 'rPr');
        }
    }
    return undefined;
}
/** @param {OoxmlElement | undefined} props - Character properties.
 * @param {string} ns - DrawingML namespace.
 * @returns {boolean} Whether a direct paint choice is present. */
function hasFill(props: OoxmlElement | undefined, ns: string): boolean {
    return !!props && ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'].some((name: string): boolean => !!direct(props, ns, name));
}
/** @param {OoxmlElement} owner - Exact owner.
 * @param {string} ns - Exact namespace.
 * @param {string} name - Exact child.
 * @returns {OoxmlElement | undefined} First known child. */
function direct(owner: OoxmlElement, ns: string, name: string): OoxmlElement | undefined {
    for (const node of owner.children) { if (node.kind === 'element' && node.namespaceUri === ns && node.localName === name) { return node; } }
    return undefined;
}
/** @param {OoxmlElement} node - Independent known body fragment.
 * @returns {OoxmlElement} Fully independent child copy in the retained body scope. */
function clone(node: OoxmlElement): OoxmlElement {
    return { ...node, attributes: node.attributes.map((attribute: OoxmlAttribute): OoxmlAttribute => ({ ...attribute })),
        namespaceDeclarations: node.namespaceDeclarations && node.namespaceDeclarations.map(
            (declaration: OoxmlNamespaceDeclaration): OoxmlNamespaceDeclaration => ({ ...declaration })),
        children: node.children.map((child: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText => child.kind === 'element' ? clone(child) : { ...child }) };
}
/** @param {string} ns - DrawingML namespace.
 * @param {string} name - Character/default property host.
 * @returns {OoxmlElement} Empty native host. */
function element(ns: string, name: string): OoxmlElement {
    return { kind: 'element', namespaceUri: ns, localName: name, attributes: [], children: [] };
}
/** @param {OoxmlElement} parent - Independent output owner.
 * @param {OoxmlElement | undefined} old - Existing child.
 * @param {OoxmlElement} value - Independent replacement.
 * @param {number} fallback - Schema insertion offset when absent.
 * @returns {void} Replaces one child without reparenting original nodes. */
function replace(parent: OoxmlElement, old: OoxmlElement | undefined, value: OoxmlElement, fallback: number): void {
    const index: number = old ? parent.children.indexOf(old) : -1;
    const children: Array<OoxmlElement | OoxmlText> = parent.children.slice();
    if (index >= 0) { children.splice(index, 1, value); } else { children.splice(Math.min(fallback, children.length), 0, value); }
    asMutable(parent).children = children;
}
