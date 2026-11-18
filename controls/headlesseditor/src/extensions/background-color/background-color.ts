import { defineExtension } from '../define-extension';
import type { Command } from '../../core/commands/types';
import type { ExtensionDefinition, ExtensionOptions } from '../types';
import { textStyleExtension } from '../text-style/text-style';
import { setHighlightCommand } from './commands/set-highlight';
import { unsetHighlightCommand } from './commands/unset-highlight';

/**
 * Background color extension for the Syncfusion Headless Editor.
 *
 * Provides background color (highlight) formatting support by applying color styling behind
 * the text content. Enables users to set or remove background colors through the setHighlight
 * and unsetHighlight commands. Color values are stored using the shared `textStyle` mark,
 * which is automatically registered as a dependency of this extension.
 *
 * **Contributes:**
 * - `setHighlight` command for applying background color to the current selection
 * - `unsetHighlight` command for removing background color formatting
 * - Shared `textStyle` mark dependency for attribute storage
 *
 * **Supported color formats:**
 * - Hex values (`#ffff00`)
 * - RGB/RGBA values (`rgb(255, 255, 0)`)
 * - HSL values (`hsl(60, 100%, 50%)`)
 * - Named CSS colors (`yellow`)
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with background color extension
 * const editor = HeadlessEditor.create({
 *   extensions: [backgroundColorExtension]
 * });
 *
 * // Apply yellow highlight
 * editor.commands.setHighlight('#ffff00');
 *
 * // Remove highlight
 * editor.commands.unsetHighlight();
 * ```
 *
 * @see setHighlightCommand for direct command usage
 * @see textStyleExtension for the shared mark storage
 */
export const backgroundColorExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'backgroundColor',

    /**
     * Adds options to the backgroundColorExtension.
     *
     * @returns {ExtensionOptions} Options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the required dependencies for this extension.
     *
     * @returns {ExtensionDefinition<object>[]} The extensions required to support background color formatting.
     */
    addExtensions(): readonly ExtensionDefinition<object>[] {
        return [textStyleExtension];
    },

    /**
     * Registers commands for applying and removing background color formatting.
     *
     * @returns {Command[]} The commands provided by this extension.
     */
    commands(): Command[] {
        return [
            setHighlightCommand,
            unsetHighlightCommand
        ];
    }
});

export default backgroundColorExtension;
