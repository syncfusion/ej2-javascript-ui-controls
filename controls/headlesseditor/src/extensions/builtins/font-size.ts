import { defineExtension } from '../define-extension';
import type { Command } from '../../commands/types';
import type { ExtensionDefinition, ExtensionOptions } from '../types';
import { textStyleExtension } from './text-style';
import { setFontSizeCommand } from '../../commands/builtins/formatting/set-font-size';
import { unsetFontSizeCommand } from '../../commands/builtins/formatting/unset-font-size';

/**
 * Provides font size formatting support.
 *
 * This extension provides commands for applying and removing font
 * size styling. Font size values are stored using the shared
 * `textStyle` mark.
 */
export const fontSizeExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
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
