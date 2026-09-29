/**
 * Built-in extensions barrel
 *
 * Re-exports all built-in extension definitions.
 * Includes: paragraph, heading, formatting marks (bold, italic, underline,
 * strikethrough, inline code, superscript, subscript, font color, background color),
 * text case (upper/lower), code block, clear formatting,
 * lists (bullet, ordered, task), quote, callout, horizontalRule, image, table,
 * collapsible, and core preset.
 */

export { documentExtension } from './document';
export { paragraphExtension } from './paragraph';
export { headingExtension } from './heading';
export { boldExtension } from './bold';
export { italicExtension } from './italic';
export { underlineExtension } from './underline';
export { strikethroughExtension } from './strikethrough';
export { inlineCodeExtension } from './inline-code';
export { linkExtension } from './link';
export { superscriptExtension } from './superscript';
export { subscriptExtension } from './subscript';
export { toUpperCaseExtension } from './upper-case';
export { toLowerCaseExtension } from './lower-case';
export { fontColorExtension } from './font-color';
export { backgroundColorExtension } from './background-color';
export { codeBlockExtension } from './code-block';
export { clearFormattingExtension } from './clear-formatting';
export { blockquoteExtension } from './block-quote';
export { calloutExtension } from './callout';
export { horizontalRuleExtension } from './horizontal-rule';
export { undoRedoExtension } from './undo-redo';
export { listExtension } from './list';
export { taskListExtension } from './task-list';
export { listKeymapExtension } from './list-keymap';
export { basicExtensions } from './basic';
export { textExtension } from './text';
export { textStyleExtension } from './text-style';
export { fontSizeExtension } from './font-size';
export { fontFamilyExtension } from './font-family';
export { textAlignExtension } from './text-align';
export { indentOutdentExtension } from './indent-outdent';
export { tableExtension } from './table';
export type { TableOptions } from './table';
export { imageExtension, getDefaultSaveFormat, getDefaultDisplay } from './image';
export type {
    SaveFormatType,
    ImageDisplayMode,
    ImageOptions,
    ImageUIPlacement,
    ImageUIContribution,
    ImageUINodeViewFactory,
    ImageUploadState,
    ImageUploadStatus,
    ImageResizeOptions
} from './image';
export { collapsibleExtension } from './collapsible';
export { placeholderExtension } from './placeholder';
export { hardBreakExtension } from './hard-break';
