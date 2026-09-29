/**
 * Built-in Core Preset Extension
 *
 * Meta-extension that composes all standard built-in extensions into a single
 * ready-to-use preset for general-purpose document editing.
 */

import { defineExtension } from '../define-extension';
import { ExtensionDefinition } from '../types';
import { documentExtension } from './document';
import { paragraphExtension } from './paragraph';
import { headingExtension } from './heading';
import { boldExtension } from './bold';
import { italicExtension } from './italic';
import { underlineExtension } from './underline';
import { strikethroughExtension } from './strikethrough';
import { inlineCodeExtension } from './inline-code';
import { codeBlockExtension } from './code-block';
import { blockquoteExtension } from './block-quote';
import { horizontalRuleExtension } from './horizontal-rule';
import hardBreakExtension from './hard-break';
import undoRedoExtension from './undo-redo';
import listExtension from './list';
import taskListExtension from './task-list';
import textExtension from './text';

/**
 * Basic : composes all standard built-in extensions.
 * Use this as a drop-in preset for comprehensive editing capabilities.
 *
 * @remarks
 * Composed extensions:
 * - document
 * - paragraph
 * - heading
 * - quote
 * - code
 * - horizontalRule
 * - list
 * - taskList
 * - bold
 * - italic
 * - underline
 * - strikethrough
 * - inlineCode
 * - text
 * - undoRedo
 * - hardBreak
 */
export const basicExtensions: ExtensionDefinition = defineExtension({
    name: 'basic',

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
