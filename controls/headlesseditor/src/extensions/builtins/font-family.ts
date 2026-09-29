import { defineExtension } from '../define-extension';
import type { Command } from '../../commands/types';
import type { ExtensionDefinition, ExtensionOptions } from '../types';
import { textStyleExtension } from './text-style';
import { setFontFamilyCommand } from '../../commands/builtins/formatting/set-font-family';
import { unsetFontFamilyCommand } from '../../commands/builtins/formatting/unset-font-family';

/**
 * Provides font family formatting support.
 *
 * This extension provides commands for applying and removing font
 * family styling. Font family values are stored using the shared
 * `textStyle` mark.
 */
export const fontFamilyExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
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
