import { defineExtension } from '../define-extension';
import type { Command } from '../../commands/types';
import type { ExtensionDefinition, ExtensionOptions } from '../types';
import { textStyleExtension } from './text-style';
import { setColorCommand } from '../../commands/builtins/formatting/set-color';
import { unsetColorCommand } from '../../commands/builtins/formatting/unset-color';

/**
 * Provides font color formatting support.
 *
 * This extension provides commands for applying and removing font
 * color styling. Color values are stored using the shared
 * `textStyle` mark.
 */
export const fontColorExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
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
