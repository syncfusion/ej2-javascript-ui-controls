/**
 * Optional comments module (`@syncfusion/ej2-pptx/comments`).
 *
 * @remarks
 * Phase 4 is **preserve-only**: comment parts stay opaque OPC bytes. This entry
 * registers feature id {@link COMMENTS_FEATURE_ID} and extends
 * {@link Slide.hasComments} detection for Microsoft modern comment relationship
 * types that do not rely solely on the ECMA suffix match (when applicable).
 *
 * Core already returns `hasComments === true` for relationship types ending with
 * `/relationships/comments` (ECMA-376 Transitional comments, and modern URIs that
 * share that suffix). Importing this module registers the MS-PPTX modern source
 * relationship type explicitly.
 *
 * Comment CRUD and author management are out of scope for Phase 4.
 *
 * Citation: ECMA-376-1 §13.3.1–§13.3.2; MS-PPTX §2.1.5 (comments);
 * `docs/specs/023-comments-preserve.md`.
 *
 * @packageDocumentation
 */
import { registerCommentRelType, registerFeature } from '../../core/registry/feature-registry';
/**
 * Feature id recorded when this module is imported.
 *
 * @public
 */
export const COMMENTS_FEATURE_ID: string = 'comments';
/**
 * Modern PowerPoint comments relationship type (MS-PPTX).
 *
 * Source: `http://schemas.microsoft.com/office/2018/10/relationships/comments`
 *
 * Citation: MS-PPTX §2.1.5; distinct from ECMA
 * `…/officeDocument/2006/relationships/comments`.
 */
export const MODERN_COMMENTS_REL_TYPE: string = 'http://schemas.microsoft.com/office/2018/10/relationships/comments';
registerCommentRelType(MODERN_COMMENTS_REL_TYPE);
registerFeature({ id: COMMENTS_FEATURE_ID });
/**
 * Ensures the comments module side effects have run (feature + modern rel type).
 *
 * @remarks
 * Importing `@syncfusion/ej2-pptx/comments` already registers; call this when an application
 * wants an explicit enablement hook without relying on import side effects alone.
 *
 * @returns {void} Nothing.
 */
export function enableCommentsModule(): void {
    registerCommentRelType(MODERN_COMMENTS_REL_TYPE);
    registerFeature({ id: COMMENTS_FEATURE_ID });
}
