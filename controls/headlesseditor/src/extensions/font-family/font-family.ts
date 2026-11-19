import { defineExtension } from '../define-extension';
import type { Command } from '../../core/commands/types';
import type { ExtensionDefinition, ExtensionOptions } from '../types';
import { textStyleExtension } from '../text-style/text-style';
import { setFontFamilyCommand } from './commands/set-font-family';
import { unsetFontFamilyCommand } from './commands/unset-font-family';

/**
 * Font family extension for the Syncfusion Headless Editor.
 *
 * Provides font family (typeface) formatting for text content. Enables users to set or
 * remove font families through the setFontFamily and unsetFontFamily commands. Font
 * family values are stored using the shared `textStyle` mark, which is automatically
 * registered as a dependency of this extension.
 *
 * **Contributes:**
 * - `setFontFamily` command for applying font family to the current selection
 * - `unsetFontFamily` command for removing font family formatting
 * - Shared `textStyle` mark dependency for attribute storage
 *
 * **Supported font family formats:**
 * - Single font names (`Arial`)
 * - Font stacks with fallbacks (`Arial, Helvetica, sans-serif`)
 * - Quoted font names with spaces (`'Times New Roman', serif`)
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with font family extension
 * const editor = HeadlessEditor.create({
 *   extensions: [fontFamilyExtension]
 * });
 *
 * // Apply Arial font family
 * editor.commands.setFontFamily('Arial');
 *
 * // Apply font stack with fallbacks
 * editor.commands.setFontFamily("'Times New Roman', serif");
 *
 * // Reset to default font
 * editor.commands.unsetFontFamily();
 * ```
 *
 * @see setFontFamilyCommand for direct command usage
 * @see textStyleExtension for the shared mark storage
 */
export const fontFamilyExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'fontFamily',

    /**
     * Adds options to the fontFamilyExtension.
     *
     * @returns {ExtensionOptions} The default configuration.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the required dependencies for this extension.
     *
     * @returns {ExtensionDefinition<object>[]} The extensions required to support font family formatting.
     */
    addExtensions(): readonly ExtensionDefinition<object>[] {
        return [textStyleExtension];
    },

    /**
     * Registers commands for applying and removing font family formatting.
     *
     * @returns {Command[]} The commands provided by this extension.
     */
    commands(): Command[] {
        return [
            setFontFamilyCommand,
            unsetFontFamilyCommand
        ];
    }
});

export default fontFamilyExtension;
