/**
 * All-in entry for consumers who want every public API. Importing this module
 * registers every optional feature handler (R6.1).
 *
 * Prefer explicit `@syncfusion/ej2-docx/<feature>` subpaths when bundle size matters.
 * (Harness still resolves the legacy `@syncfusion/ej2-docx/*` id.)
 *
 * @packageDocumentation
 */
import './docx/features/document/augmentations';
import './docx/features/bibliography/index';
import './docx/features/bookmarks/index';
import './docx/features/comments/index';
import './docx/features/content-controls/index';
import './docx/features/custom-xml/index';
import './docx/features/drawing/index';
import './docx/features/editable-ranges/index';
import './docx/features/fields/index';
import './docx/features/font-table/index';
import './docx/features/math/index';
import './docx/features/glossary/index';
import './docx/features/headers-footers/index';
import './docx/features/hyperlinks/index';
// Public images entry loads caption authoring (fields/styles) without putting
// those optionals on the main package always-on graph.
import './docx/features/images/public-entry';
import './docx/features/mail-merge/index';
import './docx/features/notes/index';
import './docx/features/numbering/index';
import './docx/features/ole-object/index';
import './docx/features/properties/index';
import './docx/features/revisions/index';
import './docx/features/sections/index';
import './docx/features/settings/index';
import './docx/features/styles/index';
import './docx/features/tables/index';
import './docx/features/watermark/index';
import { registerBibliographyFeature, resetBibliographyFeatureForTests } from './docx/features/bibliography/index';
import { registerBookmarksFeature, resetBookmarksFeatureForTests } from './docx/features/bookmarks/index';
import { registerCommentsFeature, resetCommentsFeatureForTests } from './docx/features/comments/index';
import { registerContentControlsFeature, resetContentControlsFeatureForTests } from './docx/features/content-controls/index';
import { registerCustomXmlFeature, resetCustomXmlFeatureForTests } from './docx/features/custom-xml/index';
import { registerDrawingFeature, resetDrawingFeatureForTests } from './docx/features/drawing/parse-register';
import { registerEditableRangesFeature, resetEditableRangesFeatureForTests } from './docx/features/editable-ranges/index';
import { registerFieldsFeature, resetFieldsFeatureForTests } from './docx/features/fields/index';
import { registerFontTableFeature, resetFontTableFeatureForTests } from './docx/features/font-table/index';
import { registerGlossaryFeature, resetGlossaryFeatureForTests } from './docx/features/glossary/index';
import { registerHeadersFootersFeature, resetHeadersFootersFeatureForTests } from './docx/features/headers-footers/index';
import { registerHyperlinksFeature, resetHyperlinksFeatureForTests } from './docx/features/hyperlinks/index';
import { registerImagesFeature, resetImagesFeatureForTests } from './docx/features/images/index';
import { registerMailMergeFeature, resetMailMergeFeatureForTests } from './docx/features/mail-merge/index';
import { registerNotesFeature, resetNotesFeatureForTests } from './docx/features/notes/index';
import { registerNumberingFeature, resetNumberingFeatureForTests } from './docx/features/numbering/index';
import { registerOleObjectFeature, resetOleObjectFeatureForTests } from './docx/features/ole-object/index';
import { registerPropertiesFeature, resetPropertiesFeatureForTests } from './docx/features/properties/index';
import { registerRevisionsFeature, resetRevisionsFeatureForTests } from './docx/features/revisions/index';
import { registerSectionsFeature, resetSectionsFeatureForTests } from './docx/features/sections/index';
import { registerSettingsFeature, resetSettingsFeatureForTests } from './docx/features/settings/index';
import { registerStylesFeature, resetStylesFeatureForTests } from './docx/features/styles/index';
import {
    resetFeatureBlockHandlers,
    resetFeatureInlineHandlers,
    resetFeatureRunLeafHandlers,
    resetFeaturePartHandlers,
    resetFeatureMultiPartHandlers,
    resetFeaturePackagePartHandlers,
    resetFeatureMaterializeHandlers,
    resetFeatureRegistry
} from './docx/core/registry/index';
import { resetFeatureCreateDefaultHandlers } from './docx/core/registry/create-defaults';
import { registerTablesFeature, resetTablesFeatureForTests } from './docx/features/tables/index';
import { registerWatermarkFeature, resetWatermarkFeatureForTests } from './docx/features/watermark/index';
/**
 * @private
 * Optional feature subpaths (excludes core `.` and this `./all` entry).
 */
export const FEATURE_SUBPATHS: string[] = [
    'styles',
    'numbering',
    'sections',
    'headers-footers',
    'properties',
    'tables',
    'images',
    'hyperlinks',
    'bookmarks',
    'math',
    'fields',
    'notes',
    'comments',
    'revisions',
    'content-controls',
    'custom-xml',
    'settings',
    'mail-merge',
    'drawing',
    'editable-ranges',
    'bibliography',
    'glossary',
    'watermark',
    'font-table'
];
/** One optional feature export subpath under `@syncfusion/ej2-docx/`.
 *
 * @private
 */
export type FeatureSubpath = (typeof FEATURE_SUBPATHS)[number];
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook — clears every registry and per-module registration flag without re-registering.
 */
export function clearAllFeaturesForTests(): void {
    resetFeatureBlockHandlers();
    resetFeatureInlineHandlers();
    resetFeatureRunLeafHandlers();
    resetFeaturePartHandlers();
    resetFeatureMultiPartHandlers();
    resetFeaturePackagePartHandlers();
    resetFeatureMaterializeHandlers();
    resetFeatureCreateDefaultHandlers();
    resetFeatureRegistry();
    resetSectionsFeatureForTests();
    resetStylesFeatureForTests();
    resetFontTableFeatureForTests();
    resetNumberingFeatureForTests();
    resetPropertiesFeatureForTests();
    resetHeadersFootersFeatureForTests();
    resetTablesFeatureForTests();
    resetImagesFeatureForTests();
    resetHyperlinksFeatureForTests();
    resetBookmarksFeatureForTests();
    resetFieldsFeatureForTests();
    resetNotesFeatureForTests();
    resetCommentsFeatureForTests();
    resetRevisionsFeatureForTests();
    resetContentControlsFeatureForTests();
    resetCustomXmlFeatureForTests();
    resetSettingsFeatureForTests();
    resetMailMergeFeatureForTests();
    resetDrawingFeatureForTests();
    resetEditableRangesFeatureForTests();
    resetBibliographyFeatureForTests();
    resetGlossaryFeatureForTests();
    resetOleObjectFeatureForTests();
    resetWatermarkFeatureForTests();
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook — clears per-module registration flags and re-registers handlers.
 */
export function resetAllFeaturesForTests(): void {
    clearAllFeaturesForTests();
    registerSectionsFeature();
    registerStylesFeature();
    registerFontTableFeature();
    registerNumberingFeature();
    registerPropertiesFeature();
    registerHeadersFootersFeature();
    registerTablesFeature();
    registerImagesFeature();
    registerHyperlinksFeature();
    registerBookmarksFeature();
    registerFieldsFeature();
    registerNotesFeature();
    registerCommentsFeature();
    registerRevisionsFeature();
    registerContentControlsFeature();
    registerCustomXmlFeature();
    registerSettingsFeature();
    registerMailMergeFeature();
    registerDrawingFeature();
    registerEditableRangesFeature();
    registerBibliographyFeature();
    registerGlossaryFeature();
    registerWatermarkFeature();
    registerOleObjectFeature();
}
export * from './index';
// Feature barrels are already exported through `./index`. Only the relationship
// hyperlink alias is unique to this entry (the field facade owns `Hyperlink`).
export { Hyperlink as RelationshipHyperlink } from './docx/features/hyperlinks/index';
