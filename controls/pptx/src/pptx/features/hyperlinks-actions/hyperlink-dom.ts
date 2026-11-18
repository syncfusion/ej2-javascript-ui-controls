/**
 * DOM helpers for hyperlink element create / remove / attribute read.
 *
 * @remarks
 * Builders mirror picture insert local `attr`/`el` helpers. Never invents
 * namespaces beyond DrawingML + office relationship attribute NS. Citation:
 * Transitional `dml-main.xsd` `CT_Hyperlink`.
 *
 * @internal
 */
import { OFFICE_REL_ATTR_NS } from '../../core/presentation/constants';
import { DML_NS } from '../../core/shapes/constants';
import { asMutable, getAttr, MutableOoxmlElement } from '../../core/shapes/dom-utils';
import { OoxmlAttribute, OoxmlElement } from '../../core/xml/index';
/**
 * Reads `r:id` from a hyperlink element.
 *
 * @internal
 * @param {OoxmlElement} el - The el value.
 * @returns {string | undefined} The result.
 */
export function readHyperlinkRelationshipId(el: OoxmlElement): string | undefined {
    return getAttr(el, OFFICE_REL_ATTR_NS, 'id');
}
/**
 * Removes a direct child element from a parent (identity match).
 *
 * @internal
 * @param {OoxmlElement} parent - The parent value.
 * @param {OoxmlElement} child - The child value.
 * @returns {boolean} `true` when a child was removed.
 */
export function removeChildElement(parent: OoxmlElement, child: OoxmlElement): boolean {
    const mutable: MutableOoxmlElement = asMutable(parent);
    const idx: number = mutable.children.indexOf(child);
    if (idx < 0) {
        return false;
    }
    mutable.children.splice(idx, 1);
    return true;
}
/**
 * Appends a hyperlink child under `parent` (typically `cNvPr` or `rPr`).
 *
 * @internal
 * @param {OoxmlElement} parent - The parent value.
 * @param {OoxmlElement} child - The child value.
 * @returns {void} Nothing.
 */
export function appendChildElement(parent: OoxmlElement, child: OoxmlElement): void {
    const mutable: MutableOoxmlElement = asMutable(parent);
    // CT_NonVisualDrawingProps sequence is hlinkClick, hlinkHover, extLst
    // (Transitional dml-main.xsd). Appending after extLst is dropped by PowerPoint.
    if (parent.localName === 'cNvPr' && (child.localName === 'hlinkClick' || child.localName === 'hlinkHover')) {
        let insertAt: number = mutable.children.length;
        for (let i: number = 0; i < mutable.children.length; i += 1) {
            const sibling = mutable.children[i];
            if (sibling !== undefined && sibling.kind === 'element' && sibling.localName === 'extLst') {
                insertAt = i;
                break;
            }
        }
        mutable.children.splice(insertAt, 0, child);
        return;
    }
    mutable.children.push(child);
}
/**
 * Builds a DrawingML `CT_Hyperlink` element with `r:id` and optional tooltip.
 *
 * @internal
 * @param {string} localName - `hlinkClick` | `hlinkHover` | `hlinkMouseOver`.
 * @param {string} relationshipId - Relationship Id to store as `r:id`.
 * @param {*} options - The options value.
 * @param {string} [options.tooltip] - Optional tooltip text.
 * @returns {OoxmlElement} The result.
 */
export function buildHyperlinkElement(localName: string, relationshipId: string, options: {
    readonly tooltip?: string;
} = {}): OoxmlElement {
    const attributes: OoxmlAttribute[] = [attr(OFFICE_REL_ATTR_NS, 'id', relationshipId, 'r')];
    if (options.tooltip !== undefined) {
        attributes.push(attr('', 'tooltip', options.tooltip));
    }
    return el(DML_NS, localName, 'a', attributes, []);
}
/**
 * Builds an empty DrawingML `a:rPr` for runs that lack run properties.
 *
 * @internal
 * @returns {OoxmlElement} The result.
 */
export function buildEmptyRunProperties(): OoxmlElement {
    return el(DML_NS, 'rPr', 'a', [], []);
}
/**
 *
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @param {string} value - The value value.
 * @param {string} prefix - The prefix value.
 * @returns {OoxmlAttribute} The result.
 */
function attr(namespaceUri: string, localName: string, value: string, prefix?: string): OoxmlAttribute {
    if (prefix === undefined) {
        return { namespaceUri, localName, value };
    }
    return { namespaceUri, localName, value, prefix };
}
/**
 *
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @param {string} prefixHint - The prefixHint value.
 * @param {*} attributes - The attributes value.
 * @param {*} children - The children value.
 * @returns {OoxmlElement} The result.
 */
function el(namespaceUri: string, localName: string, prefixHint: string, attributes: ReadonlyArray<OoxmlAttribute>,
            children: ReadonlyArray<OoxmlElement>): OoxmlElement {
    return {
        kind: 'element' as 'element',
        namespaceUri,
        localName,
        attributes,
        children,
        prefixHint
    };
}
