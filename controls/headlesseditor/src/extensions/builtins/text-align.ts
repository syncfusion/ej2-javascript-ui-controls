import { defineExtension } from '../define-extension';
import type { Command } from '../../commands/types';
import type { ExtensionDefinition } from '../types';
import { setTextAlignCommand, unsetTextAlignCommand } from '../../commands/builtins/structure/text-align';

/**
 * Configuration options accepted by the textAlign extension.
 */
export interface TextAlignOptions {
    /** HTML attributes applied to the `<ul data-type="taskList">` container element. */
    readonly htmlAttributes?: Readonly<Record<string, string>>;
    /**
     * The block node types where text alignment is allowed.
     *
     * Mirrors Tiptap's `TextAlign.types` option. Consumers override this
     * when they want to limit alignment to a subset of block types or to
     * add support for additional ones (for example, a custom `callout`
     * node).
     *
     * @default ['paragraph', 'heading', 'listItem', 'taskItem']
     */
    types?: string[];
}

/**
 * Provides text alignment formatting support.
 *
 * This extension provides commands for applying and removing block-level
 * text alignment (left, center, right, justify). The actual `align` node
 * attribute and DOM rendering live on each individual block extension
 * (`paragraph`, `heading`, `blockquote`, `listItem`, `taskItem`, etc.),
 * which is why this extension contributes no schema or DOM specs of its
 * own — only commands. Consumers should ensure at least one of those
 * block extensions is also registered.
 */
export const textAlignExtension: ExtensionDefinition<TextAlignOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'textAlign',

    /**
     * Default options for the textAlign extension.
     *
     * @returns {TextAlignOptions} The default configuration.
     */
    defineOptions(): TextAlignOptions {
        return {
            types: ['paragraph', 'heading', 'listItem', 'taskItem'],
            htmlAttributes: {}
        };
    },

    /**
     * Registers commands for applying and removing text alignment.
     *
     * The command instances are built from the resolved `types` option,
     * which is the single source of truth for which block types are
     * alignable. `defineOptions()` supplies the default; `.configure({...})`
     * overrides it.
     *
     * @returns {Command[]} The commands provided by this extension.
     */
    commands(): Command[] {
        const alignableTypes: readonly string[] = this.options?.types ?? [];
        return [
            setTextAlignCommand(alignableTypes),
            unsetTextAlignCommand(alignableTypes)
        ];
    },

    /**
     * Contributes keyboard shortcuts for text alignment.
     * Maps Ctrl/Cmd + Shift + L/E/R/J to the setTextAlign command
     * for left, center, right, and justify respectively.
     *
     * @returns {Object} Keyboard shortcut entries for the four align values.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-l': () => this.editor.commands.setTextAlign({ align: 'left' }),
            'Mod-e': () => this.editor.commands.setTextAlign({ align: 'center' }),
            'Mod-r': () => this.editor.commands.setTextAlign({ align: 'right' }),
            'Mod-j': () => this.editor.commands.setTextAlign({ align: 'justify' })
        };
    }
});

export default textAlignExtension;
