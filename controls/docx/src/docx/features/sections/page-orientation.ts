/**
 * Page orientation (`ST_PageOrientation`).
 *
 * Canonical definition lives in core so {@link Section.pageSetup} can type
 * against it without a core→feature import. Re-exported here for the sections
 * feature public surface.
 *
 * @public
 */
export { PageOrientation } from '../document/page-setup';
