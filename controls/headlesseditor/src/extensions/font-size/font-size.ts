import { defineExtension } from '../define-extension';
import type { Command } from '../../core/commands/types';
import type { ExtensionDefinition, ExtensionOptions } from '../types';
import { textStyleExtension } from '../text-style/text-style';
import { setFontSizeCommand } from './commands/set-font-size';
import { unsetFontSizeCommand } from './commands/unset-font-size';

/**
 * Font size extension for the Syncfusion Headless Editor.
 *
 * Provides font size formatting for text content. Enables users to set or remove
 * font sizes through the setFontSize and unsetFontSize commands. Font size values
 * are stored using the shared `textStyle` mark, which is automatically registered
 * as a dependency of this extension.
 *
 * **Contributes:**
 * - `setFontSize` command for applying font size to the current selection
 * - `unsetFontSize` command for removing font size formatting
 * - Shared `textStyle` mark dependency for attribute storage
 *
 * **Supported font size formats:**
 * - Absolute units: px, pt (`14px`, `12pt`)
 * - Relative units: em, rem, % (`1.2em`, `0.9rem`, `150%`)
 * - CSS keywords: small, medium, large, x-large (`large`)
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with font size extension
 * const editor = HeadlessEditor.create({
 *   extensions: [fontSizeExtension]
 * });
 *
 * // Apply 14px font size
 * editor.commands.setFontSize('14px');
 *
 * // Apply relative size
 * editor.commands.setFontSize('1.2em');
 *
 * // Reset to default size
 * editor.commands.unsetFontSize();
 * ```
 *
 * @see setFontSizeCommand for direct command usage
 * @see textStyleExtension for the shared mark storage
 */
export const fontSizeExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'fontSize',

    /**
     * Adds options to the fontSizeExtension.
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
     * @returns {ExtensionDefinition<object>[]} The extensions required to support font size formatting.
     */
    addExtensions(): readonly ExtensionDefinition<object>[] {
        return [textStyleExtension];
    },

    /**
     * Registers commands for applying and removing font size formatting.
     *
     * @returns {Command[]} The commands provided by this extension.
     */
    commands(): Command[] {
        return [
            setFontSizeCommand,
            unsetFontSizeCommand
        ];
    }
});

export default fontSizeExtension;
