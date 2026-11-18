/** Sparse line decoration attributes remain separate from authored/effective fill. */
import { OoxmlElement } from '../xml/dom';
import { findChild, getAttr } from '../shapes/dom-utils';
import { AuthoredLineMatrixReference } from '../theme/read-fill-reference';
/** Raw tokens; invalid values survive until checked rendering. @internal */
export interface OutlineEnd { readonly type?: string; readonly width?: string; readonly length?: string; }
/** Independent direct head/tail children. @internal */
export interface OutlineEnds { readonly head?: OutlineEnd; readonly tail?: OutlineEnd; }
/** Effective per-attribute view, never written into authored XML. @internal */
export interface ResolvedOutlineEnds extends OutlineEnds {
    readonly provenance: Readonly<Record<string, string>>;
    readonly diagnostics?: ReadonlyArray<{ readonly source: string; readonly reason: string; }>;
}
/** Existing canonical high-to-low host tier. @internal */
export interface OutlineEndSource { readonly id: string; readonly ends?: OutlineEnds; readonly reference?: AuthoredLineMatrixReference; }
/**
 * Reads exact direct DrawingML line-end attributes without defaults.
 *
 * @param {OoxmlElement | undefined} line - Validated direct line carrier.
 * @param {string} ns - Exact owner DrawingML namespace.
 * @returns {OutlineEnds} Independent sparse raw tokens.
 * @internal
 */
export function readOutlineEnds(line: OoxmlElement | undefined, ns: string): OutlineEnds {
    if (line === undefined || line.namespaceUri !== ns || line.localName !== 'ln') { return {}; }
    const read: (name: string) => OutlineEnd | undefined = (name: string): OutlineEnd | undefined => {
        const end: OoxmlElement | undefined = findChild(line, ns, name);
        return end === undefined ? undefined : { type: getAttr(end, '', 'type'), width: getAttr(end, '', 'w'),
            length: getAttr(end, '', 'len') };
    };
    return { head: read('headEnd'), tail: read('tailEnd') };
}
/**
 * Preserves independent line-list availability and every element slot.
 *
 * @param {OoxmlElement | undefined} list - Direct lnStyleLst.
 * @param {string} ns - Exact DrawingML namespace.
 * @returns {ReadonlyArray<OutlineEnds> | undefined} Sparse ordered line-end entries.
 * @internal
 */
export function readOutlineEndList(list: OoxmlElement | undefined, ns: string): ReadonlyArray<OutlineEnds> | undefined {
    if (list === undefined) { return undefined; }
    const entries: OutlineEnds[] = [];
    for (const child of list.children) {
        if (child.kind === 'element') { entries.push(readOutlineEnds(child, ns)); }
    }
    return entries;
}
/**
 * Resolves marker attributes using the same direct/style/layout/master ordering.
 *
 * @remarks A fill barrier does not erase independently inherited line properties.
 * Invalid indices never clamp or select fill/background matrices. The fill
 * resolver owns their paint diagnostics; this view only takes known line slots.
 * @param {ReadonlyArray<OutlineEndSource>} inputs - Existing exact matched tiers.
 * @param {ReadonlyArray<OutlineEnds> | undefined} styles - Independent line-end list.
 * @returns {ResolvedOutlineEnds} Detached effective attributes and field provenance.
 * @internal
 */
export function resolveOutlineEnds(inputs: ReadonlyArray<OutlineEndSource>,
                                   styles: ReadonlyArray<OutlineEnds> | undefined): ResolvedOutlineEnds {
    const head: { type?: string; width?: string; length?: string; } = {};
    const tail: { type?: string; width?: string; length?: string; } = {};
    const provenance: Record<string, string> = {};
    const diagnostics: { source: string; reason: string; }[] = [];
    const merge: (ends: OutlineEnds | undefined, id: string) => void = (ends: OutlineEnds | undefined, id: string): void => {
        if (ends === undefined) { return; }
        if (head.type === undefined && ends.head !== undefined && ends.head.type !== undefined) {
            head.type = ends.head.type; provenance['head.type'] = id;
        }
        if (head.width === undefined && ends.head !== undefined && ends.head.width !== undefined) {
            head.width = ends.head.width; provenance['head.width'] = id;
        }
        if (head.length === undefined && ends.head !== undefined && ends.head.length !== undefined) {
            head.length = ends.head.length; provenance['head.length'] = id;
        }
        if (tail.type === undefined && ends.tail !== undefined && ends.tail.type !== undefined) {
            tail.type = ends.tail.type; provenance['tail.type'] = id;
        }
        if (tail.width === undefined && ends.tail !== undefined && ends.tail.width !== undefined) {
            tail.width = ends.tail.width; provenance['tail.width'] = id;
        }
        if (tail.length === undefined && ends.tail !== undefined && ends.tail.length !== undefined) {
            tail.length = ends.tail.length; provenance['tail.length'] = id;
        }
    };
    for (const input of inputs) {
        merge(input.ends, input.id);
        const index: AuthoredLineMatrixReference['index'] | undefined = input.reference === undefined ? undefined : input.reference.index;
        if (styles === undefined && index !== undefined && index.kind === 'value' && index.value > 0 && index.value !== 1000) {
            diagnostics.push({ source: input.id + '-style', reason: 'unavailable-line-end-style-list' });
        }
        if (styles !== undefined && index !== undefined && index.kind === 'value' && Number.isFinite(index.value) &&
            Number.isInteger(index.value) && index.value > 0 && index.value !== 1000 && index.value <= styles.length) {
            merge(styles[index.value - 1], input.id + '-style');
        }
    }
    return { head: Object.keys(head).length === 0 ? undefined : head, tail: Object.keys(tail).length === 0 ? undefined : tail,
        provenance, ...(diagnostics.length === 0 ? {} : { diagnostics }) };
}
