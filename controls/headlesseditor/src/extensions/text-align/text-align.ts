import { defineExtension } from '../define-extension';
import type { Command } from '../../core/commands/types';
import type { ExtensionDefinition } from '../types';
import { setTextAlignCommand, unsetTextAlignCommand } from './commands/text-align';

/**
 * Configuration options for the text align extension.
 *
 * Defines the HTML attributes and block node types where text alignment
 * applies. Consumers can override the default block types to limit or
 * extend alignment support.
 *
 * @interface TextAlignOptions
 */
export interface TextAlignOptions {
    /**
     * HTML attributes applied to the aligned block elements.
     *
     * @default {}
     * @type {Readonly<Record<string, string>>}
     */
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
 * Text align extension for the Syncfusion Headless Editor.
 *
 * Provides text alignment formatting support for block-level content. Enables users
 * to set or remove text alignment (left, center, right, justify) through the
 * setTextAlign and unsetTextAlign commands. The actual `align` node attribute and
 * DOM rendering live on each individual block extension (`paragraph`, `heading`,
 * `blockquote`, `listItem`, `taskItem`, etc.), which is why this extension
 * contributes no schema or DOM specs of its own — only commands.
 *
 * **Contributes:**
 * - `setTextAlign` command for applying block-level alignment
 * - `unsetTextAlign` command for removing alignment attributes
 * - Keyboard shortcuts (Ctrl/Cmd + Shift + L/E/R/J for left/center/right/justify)
 *
 * **Block type support:**
 * Consumers should ensure at least one of the target block extensions is
 * also registered. Use the `types` option to customize which block types
 * accept alignment.
 *
 * @type {ExtensionDefinition<TextAlignOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with text align extension
 * const editor = HeadlessEditor.create({
 *   extensions: [basicExtensions, textAlignExtension]
 * });
 *
 * // Apply center alignment
 * editor.commands.setTextAlign({ align: 'center' });
 *
 * // Apply right alignment
 * editor.commands.setTextAlign({ align: 'right' });
 *
 * // Remove alignment
 * editor.commands.unsetTextAlign();
 *
 * // Press Ctrl/Cmd + Shift + L/E/R/J for shortcuts
 * ```
 *
 * @see TextAlignOptions for configuration options
 * @see setTextAlignCommand for factory usage
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
     * @returns {Object} Keyboard shortcut mapping.
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
