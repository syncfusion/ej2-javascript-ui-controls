/**
 * Public images feature entry (`@syncfusion/ej2-docx/images`).
 *
 * Re-exports the always-on images surface and loads caption authoring, which
 * reuses fields + styles. The main `@syncfusion/ej2-docx` entry only side-effect-imports
 * `./index.js` so optional fields/styles stay out of `dist/index.js`.
 */
export * from './index';
import './captions';
