/**
 * To Lower Case Extension
 *
 * Provides the `toLowerCase` command that converts selected text to lowercase.
 * Command-only extension — contributes no schema marks and no DOM rendering.
 *
 * Note: This command transforms the literal text characters; it does NOT
 * add a CSS `text-transform` style. Use a real CSS mark for that.
 */

import { defineExtension } from '../define-extension';
import { ExtensionOptions, ExtensionDefinition, ExtensionScope } from '../types';
import { toLowerCaseCommand } from './commands/lower-case';
import type { Command } from '../../core/commands/types';

/**
 * To lower case extension for the Syncfusion Headless Editor.
 *
 * Provides the `toLowerCase` command that converts selected text to lowercase.
 * Command-only extension — contributes no schema marks and no DOM rendering.
 *
 * **Contributes:**
 * - `toLowerCase` command for literal text character transformation
 *
 * This command transforms the literal text characters; it does NOT add a
 * CSS `text-transform` style. Use a real CSS mark for that behavior.
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with lower case extension
 * const editor = HeadlessEditor.create({
 *   extensions: [basicExtensions, toLowerCaseExtension]
 * });
 *
 * // Select text and convert to lowercase
 * // "HELLO WORLD" becomes "hello world"
 * editor.commands.toLowerCase();
 * ```
 *
 * @see toLowerCaseCommand for direct command usage
 */
export const toLowerCaseExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'toLowerCase',

    /**
     * Adds options to the To Lower Case extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Contributes the `toLowerCase` command.
     *
     * @returns {Command<unknown>[]} Command array
     */
    commands(): Command<unknown>[] {
        return [toLowerCaseCommand] as Command<unknown>[];
    }
});

export default toLowerCaseExtension;
