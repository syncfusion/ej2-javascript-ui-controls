/**
 * Read `p:pic` blipFill / `a:blip` relationship ids from live DOM.
 *
 * @remarks
 * Picture structure (Transitional `pml.xsd` `CT_Picture`): required `nvPicPr`,
 * `blipFill` (`a:CT_BlipFillProperties`), `spPr`. Blip uses `AG_Blob`
 * (`r:embed` / `r:link`). Classification does **not** fetch link targets or
 * decode image bytes.
 *
 * Distinct from shape `spPr` blipFill fill classification (TASK-1015): here
 * `blipFill` is a **required sibling** of `spPr` under `p:pic`, not an
 * `EG_FillProperties` child under `spPr`.
 *
 * @internal
 */
import { OFFICE_REL_ATTR_NS, PML_NS } from '../presentation/constants';
import { DML_NS } from '../shapes/constants';
import { findChild, getAttr } from '../shapes/dom-utils';
import { OoxmlElement } from '../xml/index';
/**
 * Authored blip relationship ids on a picture element.
 *
 * @internal
 */
export interface PictureBlipIds {
    /** `a:blip/@r:embed` when present. */
    readonly embedRelationshipId: string | undefined;
    /** `a:blip/@r:link` when present (must not be fetched). */
    readonly linkRelationshipId: string | undefined;
}
/**
 * Locates `p:blipFill` / `a:blipFill` under a `p:pic` element.
 *
 * @internal
 * @param {OoxmlElement} picElement - The picElement value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findPictureBlipFill(picElement: OoxmlElement): OoxmlElement | undefined {
    return (findChild(picElement, PML_NS, 'blipFill') !== null &&
        findChild(picElement, PML_NS, 'blipFill') !== undefined ? findChild(picElement, PML_NS, 'blipFill') : findChild(picElement, DML_NS, 'blipFill'));
}
/**
 * Locates `a:blip` under picture blipFill.
 *
 * @internal
 * @param {OoxmlElement} blipFill - The blipFill value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findBlip(blipFill: OoxmlElement): OoxmlElement | undefined {
    return (findChild(blipFill, DML_NS, 'blip') !== null &&
        findChild(blipFill, DML_NS, 'blip') !== undefined ? findChild(blipFill, DML_NS, 'blip') : findChild(blipFill, PML_NS, 'blip'));
}
/**
 * Reads `AG_Blob` relationship ids from `p:pic` → `blipFill` → `blip`.
 *
 * @internal
 * @param {OoxmlElement} picElement - The picElement value.
 * @returns {PictureBlipIds} The result.
 */
export function readPictureBlipIds(picElement: OoxmlElement): PictureBlipIds {
    const blipFill: OoxmlElement = findPictureBlipFill(picElement);
    if (blipFill === undefined) {
        return { embedRelationshipId: undefined, linkRelationshipId: undefined };
    }
    const blip: OoxmlElement = findBlip(blipFill);
    if (blip === undefined) {
        return { embedRelationshipId: undefined, linkRelationshipId: undefined };
    }
    return {
        embedRelationshipId: emptyToUndefined(getAttr(blip, OFFICE_REL_ATTR_NS, 'embed')),
        linkRelationshipId: emptyToUndefined(getAttr(blip, OFFICE_REL_ATTR_NS, 'link'))
    };
}
/**
 * XSD default for AG_Blob embed/link is empty string — treat as absent.
 *
 * @param {string | undefined} value - The value value.
 * @returns {string | undefined} The result.
 */
function emptyToUndefined(value: string | undefined): string | undefined {
    if (value === undefined || value.length === 0) {
        return undefined;
    }
    return value;
}
