import { defineExtension } from '../define-extension';
import type { Command } from '../../commands/types';
import type { ExtensionDefinition, ExtensionOptions } from '../types';
import { textStyleExtension } from './text-style';
import { setHighlightCommand } from '../../commands/builtins/formatting/set-highlight';
import { unsetHighlightCommand } from '../../commands/builtins/formatting/unset-highlight';

/**
 * Provides background color (highlight) formatting support.
 *
 * This extension provides commands for applying and removing background
 * color styling. Background color values are stored using the shared
 * `textStyle` mark.
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
