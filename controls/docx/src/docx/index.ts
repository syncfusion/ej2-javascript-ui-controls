/**
 * @packageDocumentation
 * @syncfusion/ej2-docx - programmatic DOCX/OOXML class library for JavaScript and TypeScript.
 *
 * Public package surface for the `src/docx/` implementation root.
 * `src/index.ts` re-exports this file so `generateRootFiles` still resolves `./src/index`.
 */

export * from './core/index';
export * from './features/index';
// Side-effect: registers the Paragraph.appendChart bridge (kept out of paragraph.ts to avoid a runtime require).
import './features/charts/register';
// Side-effect: registers the trial-license watermark bridge used by WordDocument.save.
import './features/watermark/license-register';
