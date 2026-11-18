import { OoxmlElement, OoxmlText, OoxmlAttribute } from '../xml/dom';
import { cloneScopedElement } from '../xml/clone-scoped-element';
import { SecurityLimits } from '../security/limits';
import { GradientFillError } from '../shapes/write-gradient-fill';
/** Opaque same-document authored gradient snapshot; not a worker/clipboard payload. @public */
export interface GradientBackgroundCopy { readonly kind: 'gradient-background-copy'; }
interface CopyData { readonly owner: object; readonly gradient: OoxmlElement; readonly partName: string; }
const OWNERS: WeakMap<object, object> = new WeakMap<object, object>();
const COPIES: WeakMap<GradientBackgroundCopy, CopyData> = new WeakMap<GradientBackgroundCopy, CopyData>();
/**
 * Captures already localized authored XML privately, with no live document retention.
 *
 * @internal
 * @param {object} owner - Actual package identity (or standalone slide root).
 * @param {OoxmlElement} root - Detached complete source scope.
 * @param {OoxmlElement} gradient - Exact localized source gradient.
 * @param {string} partName - Source part identity.
 * @param {SecurityLimits} limits - Existing source limits.
 * @returns {GradientBackgroundCopy} Frozen opaque key; XML is never exposed.
 */
export function captureGradientBackgroundCopy(owner: object, root: OoxmlElement, gradient: OoxmlElement,
                                              partName: string, limits: SecurityLimits): GradientBackgroundCopy {
    const copy: OoxmlElement = cloneScopedElement({ root, node: gradient, partName }, { partName, limits });
    assertNoRelationships(copy, partName);
    const key: GradientBackgroundCopy = { kind: 'gradient-background-copy' }; Object.freeze(key);
    COPIES.set(key, { owner: ownerIdentity(owner), gradient: copy, partName }); return key;
}
/**
 * Validates ownership and clones into an actual destination; never returns stored XML.
 *
 * @internal
 * @param {GradientBackgroundCopy} key - Opaque library-created snapshot.
 * @param {object} owner - Destination package identity.
 * @param {string} partName - Actual destination part.
 * @param {string} ns - Actual destination DrawingML namespace.
 * @param {SecurityLimits} limits - Destination limits, never inherited from the source.
 * @returns {OoxmlElement} Independent detached destination gradient.
 */
export function readGradientBackgroundCopy(key: GradientBackgroundCopy, owner: object, partName: string,
                                           ns: string, limits: SecurityLimits): OoxmlElement {
    const copy: CopyData | undefined = COPIES.get(key);
    if (!copy || copy.owner !== ownerIdentity(owner)) { throw new GradientFillError(partName, 'background.copy.owner'); }
    if (copy.gradient.namespaceUri !== ns) { throw new GradientFillError(partName, 'background.copy.dialect'); }
    return cloneScopedElement({ root: copy.gradient, node: copy.gradient, partName: copy.partName },
                              { partName, limits, depth: 5 });
}
/** @param {object} owner - Actual live package identity, used only as a weak key.
 * @returns {object} Opaque identity that does not retain the presentation or slide. */
function ownerIdentity(owner: object): object {
    let identity: object | undefined = OWNERS.get(owner);
    if (!identity) { identity = Object.freeze({}); OWNERS.set(owner, identity); } return identity;
}
/** Relationship-bearing extension copying requires L24's explicit ownership/remapping policy.
 *
 * @param {OoxmlElement} node - Detached gradient and extension subtree.
 * @param {string} partName - Source diagnostic part.
 * @returns {void} Rejects before capture/publication rather than creating dangling IDs. */
function assertNoRelationships(node: OoxmlElement, partName: string): void {
    if (node.attributes.some((attribute: OoxmlAttribute): boolean =>
        attribute.namespaceUri === 'http://schemas.openxmlformats.org/officeDocument/2006/relationships' ||
        attribute.namespaceUri === 'http://purl.oclc.org/ooxml/officeDocument/relationships')) {
        throw new GradientFillError(partName, 'background.copy.relationships');
    }
    node.children.forEach((child: OoxmlElement | OoxmlText): void => {
        if (child.kind === 'element') { assertNoRelationships(child, partName); }
    });
}
