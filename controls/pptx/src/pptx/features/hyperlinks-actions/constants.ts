/**
 * Hyperlink relationship type and feature id (optional `hyperlinks-actions` module).
 *
 * @remarks
 * Relationship type is the Transitional officeDocument hyperlink string from
 * ECMA-376 Part 4. Do not invent alternate type URIs. Feature id is used only for
 * registry bookkeeping when this optional entry is imported.
 *
 * Citation: ECMA-376-4 Transitional relationships; `docs/specs/015-hyperlinks.md`.
 *
 * @packageDocumentation
 */
/**
 * Hyperlink relationship type (Transitional, ECMA-376 Part 4).
 *
 * @public
 */
export const HYPERLINK_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink';
/**
 * Feature registry id for the optional hyperlinks-actions module.
 *
 * @public
 */
export const HYPERLINKS_ACTIONS_FEATURE_ID: string = 'hyperlinks-actions';
