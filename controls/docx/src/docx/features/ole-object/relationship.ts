/**
 * OLE-object relationship constant shared between the module index and the
 * package catalog (keeps the owning module import-clean of the index barrel).
 *
 * Transitional relationship type for an embedded/linked OLE object part —
 * ECMA-376-1 §15.2.10 (Embedded Object Part); cited in
 * `docs/ooxml-mapping/ole-object.md`.
 *
 * @private
 */

/**
 * Transitional relationship type for an embedded/linked OLE object part.
 *
 * Source: ECMA-376-1 §15.2.10 relationship vocabulary —
 * `http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject`.
 *
 * @private
 */
export const OLE_OBJECT_RELATIONSHIP_TYPE: string =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject';

/**
 * Long-path linked OLE relationship variant ([MS-OI29500] product behavior;
 * Excel `oleObjectLinkLongPath`). Accepted on load as an alias of the
 * transitional oleObject link relationship; **never emitted** on save.
 *
 * @private
 */
export const OLE_OBJECT_LINK_LONG_PATH_RELATIONSHIP_TYPE: string =
  'http://schemas.microsoft.com/office/2019/04/relationships/oleObjectLinkLongPath';
