/**
 * To Upper Case Extension
 *
 * Provides the `toUpperCase` command that converts selected text to UPPERCASE.
 * Command-only extension — contributes no schema marks and no DOM rendering.
 *
 * Note: This command transforms the literal text characters; it does NOT
 * add a CSS `text-transform` style. Use a real CSS mark for that.
 */

import { defineExtension } from '../define-extension';
import { ExtensionOptions, ExtensionDefinition, ExtensionScope} from '../types';
import { toUpperCaseCommand } from '../../commands/builtins/formatting/upper-case';
import type { Command } from '../../commands/types';

export const toUpperCaseExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /** Unique extension identifier */
    name: 'toUpperCase',

    /**
     * Adds options to the To Upper Case extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Contributes the `toUpperCase` command.
     *
     * @returns {Command<unknown>[]} Command array
     */
    commands(): Command<unknown>[] {
        return [toUpperCaseCommand] as Command<unknown>[];
    }
});

export default toUpperCaseExtension;
