import { arrayAt } from '../../core/util/es5-compat';
/**
 * Parse a DrawingML `CT_Hyperlink` element and optionally resolve `r:id`.
 *
 * @remarks
 * Resolution uses only the caller-supplied relationship list (host part). No
 * network, filesystem open of Target, or `ppaction` evaluation occurs.
 * Citation: Transitional `dml-main.xsd` `CT_Hyperlink` (~732–745).
 */
import { PackageRelationship } from '../../core/package/relationships';
import { OFFICE_REL_ATTR_NS } from '../../core/presentation/constants';
import { getAttr } from '../../core/shapes/dom-utils';
import { OoxmlElement } from '../../core/xml/index';
import { HyperlinkInfo, HyperlinkSourceKind } from './types';
/**
 * Builds a readonly {@link HyperlinkInfo} from a live hyperlink element.
 *
 * @internal
 * @param {OoxmlElement} el - `hlinkClick` / `hlinkHover` / `hlinkMouseOver` element.
 * @param {HyperlinkSourceKind} source - Location discriminant.
 * @param {*} relationships - Host-part relationships (e.g. slide `.rels`); may be empty.
 * @returns {HyperlinkInfo} Frozen info view. Missing rel → incomplete fields, not an error.
 */
export function parseHyperlinkElement(el: OoxmlElement, source: HyperlinkSourceKind,
                                      relationships: ReadonlyArray<PackageRelationship>): HyperlinkInfo {
    const rId: string = getAttr(el, OFFICE_REL_ATTR_NS, 'id');
    const action: string = getAttr(el, '', 'action');
    const tooltip: string = getAttr(el, '', 'tooltip');
    const invalidUrl: string = getAttr(el, '', 'invalidUrl');
    const tgtFrame: string = getAttr(el, '', 'tgtFrame');
    let targetMode: HyperlinkInfo['targetMode'];
    let target: string | undefined;
    let relationshipType: string | undefined;
    let targetPartName: string | undefined;
    if (rId !== undefined) {
        const rel: PackageRelationship = findRelationshipById(relationships, rId);
        if (rel !== undefined) {
            targetMode = rel.targetMode;
            target = rel.target;
            relationshipType = rel.type;
            targetPartName = rel.targetPartName;
        }
    }
    return Object.freeze({
        source,
        rId,
        action,
        tooltip,
        invalidUrl,
        tgtFrame,
        targetMode,
        target,
        relationshipType,
        targetPartName
    });
}
/**
 * Finds the first relationship whose Id equals `rId`.
 *
 * @internal
 * @param {*} relationships - The relationships value.
 * @param {string} rId - The rId value.
 * @returns {PackageRelationship | undefined} The result.
 */
function findRelationshipById(relationships: ReadonlyArray<PackageRelationship>, rId: string): PackageRelationship | undefined {
    for (let i: number = 0; i < relationships.length; i++) {
        const rel: PackageRelationship = arrayAt(relationships, i);
        if (rel.id === rId) {
            return rel;
        }

    }
    return undefined;
}
