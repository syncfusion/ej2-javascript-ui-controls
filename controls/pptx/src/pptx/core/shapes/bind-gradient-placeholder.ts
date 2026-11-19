import { OoxmlElement, OoxmlAttribute, OoxmlNamespaceDeclaration, OoxmlText } from '../xml/dom';
import { cloneScopedElement, ScopedElementSource, ScopedCloneError } from '../xml/clone-scoped-element';
import { SecurityLimits } from '../security/limits';
import { getGradientDrawingNamespace } from '../theme/read-gradient';
import { asMutable, getAttr } from './dom-utils';
import { uniqueGradientChild } from './gradient-materialization-dom';
/**
 * Binds copied native phClr stops to authored fillRef/bgRef colors, without RGB flattening.
 *
 * @internal
 * @param {OoxmlElement} copy - Detached gradient or complete stop-list copy.
 * @param {ScopedElementSource | undefined} reference - Actual reference color and original scope.
 * @param {string} partName - Destination part.
 * @param {SecurityLimits} limits - Existing limits.
 * @returns {number} Bound stop count; only the detached copy changes. Incompatible scopes throw.
 */
export function bindGradientPlaceholder(copy: OoxmlElement, reference: ScopedElementSource | undefined,
                                        partName: string, limits: SecurityLimits): number {
    const ns: string | undefined = getGradientDrawingNamespace(copy.namespaceUri);
    if (!ns) { throw new ScopedCloneError('gradient-namespace', partName); }
    const list: OoxmlElement | undefined = copy.localName === 'gsLst' ? copy : uniqueGradientChild(copy, ns, 'gsLst');
    if (!list) { return 0; }
    let count: number = 0;
    for (const stop of list.children) {
        if (stop.kind !== 'element' || stop.namespaceUri !== ns || stop.localName !== 'gs') { continue; }
        const placeholder: OoxmlElement | undefined = uniqueGradientChild(stop, ns, 'schemeClr');
        if (!placeholder || getAttr(placeholder, '', 'val') !== 'phClr') { continue; }
        if (!reference) { throw new ScopedCloneError('placeholder-reference-unavailable', partName); }
        const replacement: OoxmlElement = boundColor(copy, placeholder, reference, partName, limits, ns);
        asMutable(stop).children = stop.children.map((value: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText =>
            value === placeholder ? replacement : value);
        count++;
    }
    return count;
}
/** @param {OoxmlElement} root - Detached source scope.
 * @param {OoxmlElement} placeholder - Native stop color.
 * @param {ScopedElementSource} reference - Authored replacement color and original scope.
 * @param {string} partName - Destination part.
 * @param {SecurityLimits} limits - Existing limits.
 * @param {string} ns - Actual DrawingML namespace.
 * @returns {OoxmlElement} Independent authored color with reference transforms before stop transforms. */
function boundColor(root: OoxmlElement, placeholder: OoxmlElement, reference: ScopedElementSource,
                    partName: string, limits: SecurityLimits, ns: string): OoxmlElement {
    const color: OoxmlElement = reference.node;
    const choices: ReadonlyArray<string> = ['srgbClr', 'scrgbClr', 'hslClr', 'sysClr', 'schemeClr', 'prstClr'];
    if (color.namespaceUri !== ns || choices.indexOf(color.localName) < 0 ||
        color.localName === 'schemeClr' && getAttr(color, '', 'val') === 'phClr') {
        throw new ScopedCloneError('placeholder-reference-color', partName);
    }
    const original: OoxmlElement = cloneScopedElement({ root, node: placeholder, partName }, { partName, limits });
    const bound: OoxmlElement = cloneScopedElement(reference, { partName, limits });
    const declarations: OoxmlNamespaceDeclaration[] = (original.namespaceDeclarations || []).slice();
    for (const declaration of bound.namespaceDeclarations || []) {
        const same: OoxmlNamespaceDeclaration | undefined = declarations.find((value: OoxmlNamespaceDeclaration): boolean =>
            value.prefix === declaration.prefix);
        if (same && same.uri !== declaration.uri) { throw new ScopedCloneError('placeholder-prefix-conflict', partName); }
        if (!same) { declarations.push({ prefix: declaration.prefix, uri: declaration.uri }); }
    }
    const attributes: OoxmlAttribute[] = original.attributes.filter((value: OoxmlAttribute): boolean =>
        !(value.namespaceUri === '' && value.localName === 'val'));
    for (const attribute of bound.attributes) {
        const same: OoxmlAttribute | undefined = attributes.find((value: OoxmlAttribute): boolean =>
            value.namespaceUri === attribute.namespaceUri && value.localName === attribute.localName);
        if (same && same.value !== attribute.value) { throw new ScopedCloneError('placeholder-attribute-conflict', partName); }
        if (!same) { attributes.push({ ...attribute }); }
    }
    return { ...bound, namespaceDeclarations: declarations, attributes,
        children: [...bound.children, ...original.children] };
}
