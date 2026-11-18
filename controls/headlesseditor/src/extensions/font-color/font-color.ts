import { defineExtension } from '../define-extension';
import type { Command } from '../../core/commands/types';
import type { ExtensionDefinition, ExtensionOptions } from '../types';
import { textStyleExtension } from '../text-style/text-style';
import { setColorCommand } from './commands/set-color';
import { unsetColorCommand } from './commands/unset-color';

/**
 * Font color extension for the Syncfusion Headless Editor.
 *
 * Provides foreground font color formatting for text content. Enables users to set or
 * remove text colors through the setColor and unsetColor commands. Color values are
 * stored using the shared `textStyle` mark, which is automatically registered as a
 * dependency of this extension.
 *
 * **Contributes:**
 * - `setColor` command for applying font color to the current selection
 * - `unsetColor` command for removing font color formatting
 * - Shared `textStyle` mark dependency for attribute storage
 *
 * **Supported color formats:**
 * - Hex values (`#ff0000`)
 * - RGB/RGBA values (`rgb(255, 0, 0)`)
 * - HSL values (`hsl(0, 100%, 50%)`)
 * - Named CSS colors (`red`)
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with font color extension
 * const editor = HeadlessEditor.create({
 *   extensions: [fontColorExtension]
 * });
 *
 * // Apply red font color
 * editor.commands.setColor('#ff0000');
 *
 * // Remove font color
 * editor.commands.unsetColor();
 * ```
 *
 * @see setColorCommand for direct command usage
 * @see textStyleExtension for the shared mark storage
 */
export const fontColorExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'fontColor',

    /**
     * Adds options to the fontColorExtension.
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
     * @returns {ExtensionDefinition<object>[]} The extensions required to support text color formatting.
     */
    addExtensions(): readonly ExtensionDefinition<object>[] {
        return [textStyleExtension];
    },

    /**
     * Registers commands for applying and removing text color formatting.
     *
     * @returns {Command[]} The commands provided by this extension.
     */
    commands(): Command[] {
        return [
            setColorCommand,
            unsetColorCommand
        ];
    }
});

export default fontColorExtension;
