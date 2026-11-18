import { OoxmlElement, OoxmlAttribute, OoxmlText } from '../xml/dom';
import { GradientDialect, parseGradientAngle, parseGradientBoolean, parseGradientPercentage, serializeGradientAngle, serializeGradientPercentage } from '../theme/gradient-values';
import { GradientFillError } from './write-gradient-fill';
/** Sparse geometry edit; omitted members preserve source and null removes the authored field. @public */
export interface GradientRectanglePatch {
    readonly left?: number | null; readonly top?: number | null;
    readonly right?: number | null; readonly bottom?: number | null;
}
/** Same-kind shading edits preserve unmentioned fields; changing kind replaces the exclusive native choice. @public */
export type GradientShadePatch = { readonly kind: 'linear'; readonly angle?: number | null; readonly scaled?: boolean | null } |
{ readonly kind: 'path'; readonly path?: 'circle' | 'rect' | 'shape' | null; readonly fillToRect?: GradientRectanglePatch | null };
/** Selective geometry only: stops, foreign elements and unrelated metadata remain unchanged. @public */
export interface GradientGeometryPatch {
    readonly shade?: GradientShadePatch | null;
    readonly rotateWithShape?: boolean | null;
    readonly flip?: 'none' | 'x' | 'y' | 'xy' | null;
    readonly tileRect?: GradientRectanglePatch | null;
}
/**
 * @param {OoxmlElement} source - Existing direct gradient, never mutated here.
 * @param {GradientGeometryPatch} patch - Sparse explicitly edited fields.
 * @param {string | undefined} partName - Diagnostic owning part.
 * @returns {OoxmlElement} Detached changed ancestors with original stop-list identity retained.
 */
export function patchGradientGeometry(source: OoxmlElement, patch: GradientGeometryPatch, partName?: string): OoxmlElement {
    const dialect: GradientDialect = source.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/main' ? 'strict' : 'transitional';
    try {
        if (!patch || typeof patch !== 'object') { throw new Error(); }
        let root: OoxmlElement = source;
        if (patch.rotateWithShape !== undefined) { root = attribute(root, 'rotWithShape', boolean(patch.rotateWithShape)); }
        if (patch.flip !== undefined) {
            if (patch.flip !== null && ['none', 'x', 'y', 'xy'].indexOf(patch.flip) < 0) { throw new Error(); }
            root = attribute(root, 'flip', patch.flip);
        }
        if (patch.shade !== undefined) {
            const shade: GradientShadePatch | null = patch.shade;
            const linear: OoxmlElement | undefined = child(root, 'lin'); const path: OoxmlElement | undefined = child(root, 'path');
            if (shade === null) { root = replace(replace(root, 'lin', undefined), 'path', undefined); }
            else if (shade.kind === 'linear') {
                let node: OoxmlElement = linear || element(root, 'lin');
                if (shade.angle !== undefined) {
                    if (shade.angle !== null && typeof shade.angle !== 'number') { throw new Error(); }
                    node = attribute(node, 'ang', shade.angle === null ? null : serializeGradientAngle(shade.angle));
                }
                if (shade.scaled !== undefined) { node = attribute(node, 'scaled', boolean(shade.scaled)); }
                root = replace(replace(root, 'path', undefined), 'lin', node);
            } else if (shade.kind === 'path') {
                let node: OoxmlElement = path || element(root, 'path');
                if (shade.path !== undefined) {
                    if (shade.path !== null && ['circle', 'rect', 'shape'].indexOf(shade.path) < 0) { throw new Error(); }
                    node = attribute(node, 'path', shade.path);
                }
                if (shade.fillToRect !== undefined) { node = rectangle(node, 'fillToRect', shade.fillToRect, dialect); }
                root = replace(replace(root, 'lin', undefined), 'path', node);
            } else { throw new Error(); }
        }
        if (patch.tileRect !== undefined) { root = rectangle(root, 'tileRect', patch.tileRect, dialect); }
        return root;
    } catch (error) { throw new GradientFillError(partName, 'fill.geometry'); }
}
/** @param {boolean | null} value - Sparse explicit flag.
 * @returns {string | null} XML boolean or removal. */
function boolean(value: boolean | null): string | null {
    if (value === null) { return null; } if (typeof value !== 'boolean') { throw new Error(); } return value ? '1' : '0';
}
/** @param {OoxmlElement} owner - Namespace/prefix owner.
 * @param {string} name - Native child name.
 * @returns {OoxmlElement} New empty native child. */
function element(owner: OoxmlElement, name: string): OoxmlElement {
    return { kind: 'element', namespaceUri: owner.namespaceUri, prefixHint: owner.prefixHint, localName: name, attributes: [], children: [] };
}
/** @param {OoxmlElement} owner - Existing parent.
 * @param {string} name - Native child name.
 * @returns {OoxmlElement | undefined} Unique child, rejecting ambiguity. */
function child(owner: OoxmlElement, name: string): OoxmlElement | undefined {
    const matches: OoxmlElement[] = owner.children.filter((node: OoxmlElement | OoxmlText): node is OoxmlElement =>
        node.kind === 'element' && node.namespaceUri === owner.namespaceUri && node.localName === name);
    if (matches.length > 1) { throw new Error(); } return matches[0];
}
/** @param {OoxmlElement} node - Existing detached ancestor.
 * @param {string} name - Unqualified known attribute.
 * @param {string | null} value - Edited token or removal.
 * @returns {OoxmlElement} Copy preserving every other attribute and namespace binding. */
function attribute(node: OoxmlElement, name: string, value: string | null): OoxmlElement {
    let found: boolean = false;
    const attributes: OoxmlAttribute[] = [];
    for (const old of node.attributes) {
        if (old.namespaceUri === '' && old.localName === name) {
            if (found) { throw new Error(); } found = true;
            if (value !== null) { attributes.push(equivalent(node, name, old.value, value) ? old : { ...old, value }); }
        } else { attributes.push(old); }
    }
    if (!found && value !== null) { attributes.push({ namespaceUri: '', localName: name, value }); }
    return { ...node, attributes };
}
/** @param {OoxmlElement} owner - Detached parent.
 * @param {string} name - Native child name.
 * @param {OoxmlElement | undefined} value - Replacement or removal.
 * @returns {OoxmlElement} New ancestor preserving unrelated children in source order. */
function replace(owner: OoxmlElement, name: string, value: OoxmlElement | undefined): OoxmlElement {
    const old: OoxmlElement | undefined = child(owner, name);
    const children: Array<OoxmlElement | OoxmlText> = owner.children.slice();
    if (old) { const index: number = children.indexOf(old); children.splice(index, 1, ...(value ? [value] : [])); }
    else if (value) {
        let index: number = 0;
        if (owner.localName === 'gradFill') {
            const list: OoxmlElement | undefined = child(owner, 'gsLst'); index = list ? children.indexOf(list) + 1 : 0;
            if (name === 'tileRect') {
                const shade: OoxmlElement | undefined = child(owner, 'lin') || child(owner, 'path');
                if (shade) { index = children.indexOf(shade) + 1; }
            }
        }
        children.splice(index, 0, value);
    }
    return { ...owner, children };
}
/** @param {OoxmlElement} owner - Detached parent.
 * @param {string} name - Rectangle element name.
 * @param {GradientRectanglePatch | null} patch - Sparse edges or explicit element removal.
 * @param {GradientDialect} dialect - Owning Office dialect.
 * @returns {OoxmlElement} Copy with preserved empty-versus-missing and signed offsets. */
function rectangle(owner: OoxmlElement, name: string, patch: GradientRectanglePatch | null, dialect: GradientDialect): OoxmlElement {
    if (patch === null) { return replace(owner, name, undefined); }
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) { throw new Error(); }
    let node: OoxmlElement = child(owner, name) || element(owner, name);
    const edges: Array<{ name: string; value: number | null | undefined }> = [
        { name: 'l', value: patch.left }, { name: 't', value: patch.top },
        { name: 'r', value: patch.right }, { name: 'b', value: patch.bottom }];
    for (const edge of edges) {
        const value: number | null | undefined = edge.value;
        if (value !== undefined) {
            if (value !== null && typeof value !== 'number') { throw new Error(); }
            node = attribute(node, edge.name, value === null ? null : serializeGradientPercentage(value, dialect, 'rectangle'));
        }
    }
    return replace(owner, name, node);
}

/** @param {OoxmlElement} node - Actual native element.
 * @param {string} name - Edited known unqualified field.
 * @param {string} old - Original authored token.
 * @param {string} value - Validated edited token.
 * @returns {boolean} Preserves original lexical form for a semantic no-op. */
function equivalent(node: OoxmlElement, name: string, old: string, value: string): boolean {
    if (old === value) { return true; }
    if (name === 'scaled' || name === 'rotWithShape') {
        const a: ReturnType<typeof parseGradientBoolean> = parseGradientBoolean(old);
        const b: ReturnType<typeof parseGradientBoolean> = parseGradientBoolean(value);
        return a.kind === 'value' && b.kind === 'value' && a.value === b.value;
    }
    if (name === 'ang') {
        const a: ReturnType<typeof parseGradientAngle> = parseGradientAngle(old);
        const b: ReturnType<typeof parseGradientAngle> = parseGradientAngle(value);
        return a.kind === 'value' && b.kind === 'value' && a.value === b.value;
    }
    if (['l', 't', 'r', 'b'].indexOf(name) >= 0) {
        const dialect: GradientDialect = node.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/main' ? 'strict' : 'transitional';
        const a: ReturnType<typeof parseGradientPercentage> = parseGradientPercentage(old, dialect, 'rectangle');
        const b: ReturnType<typeof parseGradientPercentage> = parseGradientPercentage(value, dialect, 'rectangle');
        return a.kind === 'value' && b.kind === 'value' && a.value === b.value;
    }
    return false;
}
