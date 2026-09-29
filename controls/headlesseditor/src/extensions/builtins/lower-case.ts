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
import { toLowerCaseCommand } from '../../commands/builtins/formatting/lower-case';
import type { Command } from '../../commands/types';

export const toLowerCaseExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /** Unique extension identifier */
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
