/**
 * Feature-domain folder barrel, matching the package sources
 * folder-entry pattern.
 *
 */

export * from './bibliography/index';
export * from './bookmarks/index';
export * from './charts/index';
export * from './comments/index';
export * from './content-controls/index';
export * from './custom-xml/index';
export * from './document/index';
export * from './drawing/index';
export * from './editable-ranges/index';
export * from './fields/index';
export * from './font-table/index';
export * from './glossary/index';
export * from './headers-footers/index';
export * from './hyperlinks/index';
export * from './html-to-docio/index';
export * from './html-parser/index';
export * from './images/index';
export * from './mail-merge/index';
export * from './notes/index';
export * from './numbering/index';
export * from './math/index';
export * from './ole-object/index';
export * from './properties/index';
export * from './revisions/index';
export * from './sections/index';
export * from './settings/index';
export * from './styles/index';
export * from './tables/index';
export * from './watermark/index';

// Explicit re-exports resolve names exported by more than one feature barrel
// (TS2308). Choices mirror the package sources.
export { VerticalAlignment } from './images/index';
export { VerticalAlignment as PageVerticalAlignment } from './sections/index';
export { Hyperlink } from './fields/index';
export { PageBorder, PageBorders, PageSetup } from './sections/index';
export { ImageType } from './images/index';
