/**
 * Built-in Core Preset Extension
 *
 * Meta-extension that composes all standard built-in extensions into a single
 * ready-to-use preset for general-purpose document editing.
 */

import { defineExtension } from '../define-extension';
import { ExtensionDefinition } from '../types';
import { documentExtension } from '../document/document';
import { paragraphExtension } from '../paragraph/paragraph';
import { headingExtension } from '../heading/heading';
import { boldExtension } from '../bold/bold';
import { italicExtension } from '../italic/italic';
import { underlineExtension } from '../underline/underline';
import { strikethroughExtension } from '../strikethrough/strikethrough';
import { inlineCodeExtension } from '../inline-code/inline-code';
import { codeBlockExtension } from '../code-block/code-block';
import { blockquoteExtension } from '../blockquote/blockquote';
import { horizontalRuleExtension } from '../horizontal-rule/horizontal-rule';
import hardBreakExtension from '../hard-break/hard-break';
import undoRedoExtension from '../undo-redo/undo-redo';
import listExtension from '../list/list';
import taskListExtension from '../task-list/task-list';
import textExtension from '../text/text';
import listKeymapExtension from '../list/list-keymap';

/**
 * Basic : composes all standard built-in extensions.
 * Use this as a drop-in preset for comprehensive editing capabilities.
 *
 * @remarks
 * Composed extensions:
 * - document
 * - paragraph
/**
 * Basic extension for the Syncfusion Headless Editor.
 *
 * Meta-extension that composes all standard built-in extensions into a single ready-to-use
 * preset for general-purpose document editing. Provides document structure, block-level
 * elements, text formatting, and history management in one convenient entry point.
 *
 * **Contributes:**
 * - Document structure: `document`, `paragraph`, `heading`, `blockquote`, `text`
 * - Code support: `codeBlock`, `inlineCode`
 * - Visual separators: `horizontalRule`, `hardBreak`
 * - List support: `list`, `listKeymap`, `taskList`
 * - Text formatting: `bold`, `italic`, `underline`, `strikethrough`
 * - History management: `undoRedo`
 *
 * Use this as a drop-in preset for comprehensive editing capabilities without
 * registering each extension individually.
 *
 * @type {ExtensionDefinition}
 *
 * @example
 * ```typescript
 * // Create editor with all basic editing capabilities
 * const editor = HeadlessEditor.create({
 *   extensions: [basicExtensions]
 * });
 *
 * // All basic commands are now available
 * editor.commands.toggleBold();
 * editor.commands.toggleHeading(2);
 * editor.commands.undo();
 *
 * // Markdown-style input rules active
 * // **text** applies bold, # adds heading, - creates list
 * ```
 *
 * @see ExtensionDefinition for individual extension configuration
 */
export const basicExtensions: ExtensionDefinition = defineExtension({
    /**
     * Unique extension identifier used to register and reference this preset.
     *
     * @type {string}
     */
    name: 'basic',

    /**
     * Composes all standard built-in extensions for comprehensive editing.
     *
     * Returns the list of extension definitions that provide document structure,
     * text formatting, list support, and history management.
     *
     * @returns {ExtensionDefinition[]} Array of built-in extension definitions.
     */
    addExtensions(): ExtensionDefinition[] {
        return [
            documentExtension,
            paragraphExtension,
            headingExtension,
            blockquoteExtension,
            codeBlockExtension,
            horizontalRuleExtension,
            hardBreakExtension,
            listExtension,
            listKeymapExtension,
            taskListExtension,
            boldExtension,
            italicExtension,
            underlineExtension,
            strikethroughExtension,
            inlineCodeExtension,
            textExtension,
            undoRedoExtension
        ];
    }
});
export default basicExtensions;
