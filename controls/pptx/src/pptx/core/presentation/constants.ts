/**
 * PresentationML namespaces used by the presentation / slide skeleton.
 *
 * @remarks
 * Values are from ECMA-376 Part 1 / `pml.xsd` (Transitional primary). Do not invent
 * alternate URIs.
 */
/**
 * PresentationML main namespace (`pml.xsd`).
 * Source: `http://schemas.openxmlformats.org/presentationml/2006/main`
 */
export const PML_NS: string = 'http://schemas.openxmlformats.org/presentationml/2006/main';
/**
 * Office document relationships attribute namespace (`r:id` on `p:sldId`).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships`
 */
export const OFFICE_REL_ATTR_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
/**
 * Minimum inclusive value of `ST_SlideId` (`pml.xsd`).
 */
export const ST_SLIDE_ID_MIN: number = 256;
/**
 * Maximum exclusive value of `ST_SlideId` (`pml.xsd`).
 */
export const ST_SLIDE_ID_MAX_EXCLUSIVE: number = 2147483648;
