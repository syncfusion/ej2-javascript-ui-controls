/**
 * @packageDocumentation
 * @syncfusion/ej2-docx - programmatic DOCX/OOXML class library for JavaScript and TypeScript.
 *
 * Public package surface for the the package sources implementation root.
 * the package entry point re-exports this file so `generateRootFiles` still resolves `./src/index`.
 */

export * from './core/index';
export * from './features/index';
// Side-effect: registers the Paragraph.appendChart bridge (kept out of the owning module to avoid a runtime require).
import './features/charts/register';
// Side-effect: registers the trial-license watermark bridge used by WordDocument.save.
import './features/watermark/license-register';
// Side-effect: registers the WordDocument.importContent implementation (styles and numbering aware).
import './features/document/import-content';
