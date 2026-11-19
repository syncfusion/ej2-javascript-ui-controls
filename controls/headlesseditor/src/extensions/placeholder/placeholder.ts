import { defineExtension } from '../define-extension';
import { ExtensionDefinition, ExtensionOptions, ExtensionScope } from '../types';
import { createPlaceholderPlugin, PlaceholderContext } from './plugins/placeholder-plugin';

/**
 * Configuration options for the Placeholder extension.
 *
 * The Placeholder extension displays hint text in empty nodes or when the entire editor
 * is empty, improving user experience by showing where content should be entered.
 *
 * @interface PlaceholderOptions
 *
 * @example
 * ```typescript
 * const editor = HeadlessEditor.create({
 *   extensions: [
 *     placeholderExtension.configure({
 *       placeholder: 'Start typing...',
 *       emptyNodeClass: 'is-empty',
 *       showOnlyCurrent: true
 *     })
 *   ]
 * });
 * ```
 */
export interface PlaceholderOptions extends ExtensionOptions {
    /**
     * The placeholder text to display in empty nodes or the editor.
     *
     * Can be a static string or a function that dynamically generates text based on the node context.
     * Useful for displaying context-specific hints like "Write your intro..." for introduction sections.
     *
     * @type {string | ((context: PlaceholderContext) => string)}
     * @default 'Write something...'
     *
     * @example
     * ```typescript
     * // Static text
     * placeholder: 'Enter text here'
     *
     * // Dynamic text based on context
     * placeholder: (context) => `Write a ${context.node.type.name}...`
     * ```
     */
    placeholder?: string | ((context: PlaceholderContext) => string);

    /**
     * CSS class applied to nodes that are empty and should display placeholder text.
     *
     * Can be a static class name string or a function that generates class names dynamically.
     * Used for styling empty placeholders with CSS.
     *
     * @type {string | ((context: PlaceholderContext) => string)}
     * @default 'e-placeholder-is-empty'
     */
    emptyNodeClass?: string | ((context: PlaceholderContext) => string);

    /**
     * CSS class applied to the editor root element when the entire editor is empty.
     *
     * Applied at the document level, enabling distinct styling for the empty-editor state
     * (e.g., larger placeholder text, different background color).
     *
     * @type {string}
     * @default 'e-placeholder-is-editor-empty'
     */
    emptyEditorClass?: string;

    /**
     * HTML data attribute name used to store the placeholder text on DOM elements.
     *
     * The placeholder value is stored as a data attribute for accessibility and CSS `::before` pseudo-element rendering.
     *
     * @type {string}
     * @default 'data-placeholder'
     */
    dataAttribute?: string;

    /**
     * When true, placeholder is shown only for the current (focused) node.
     *
     * Reduces visual clutter by hiding placeholders for all other empty nodes, showing only
     * the placeholder for the node containing the active cursor.
     *
     * @type {boolean}
     * @default true
     */
    showOnlyCurrent?: boolean;

    /**
     * When true, placeholder is displayed only when the editor is in editable mode.
     *
     * When false, placeholders appear even in read-only editors.
     *
     * @type {boolean}
     * @default true
     */
    showOnlyWhenEditable?: boolean;

    /**
     * When true, placeholder is shown for parent nodes containing only empty child nodes.
     *
     * When false, placeholders appear only on leaf-level empty nodes.
     *
     * @type {boolean}
     * @default true
     */
    includeChildren?: boolean;

    /**
     * When true, placeholder is shown only when the entire editor is empty (no content at all).
     *
     * Useful for showing a global "Start typing here..." message only when the document has no content.
     *
     * @type {boolean}
     * @default true
     */
    showOnlyWhenEditorEmpty?: boolean;
}

/**
 * Placeholder extension for the Syncfusion Headless Editor.
 *
 * Displays hint text in empty editor nodes to guide users where content should be entered.
 * Supports both static and dynamic placeholder text, configurable visibility rules, and
 * CSS-driven styling.
 *
 * @see PlaceholderOptions for configuration details.
 */
export const placeholderExtension: ExtensionDefinition<PlaceholderOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'placeholder',

    /**
     * Defines the default configuration options for the Placeholder extension.
     *
     * @returns {PlaceholderOptions} Default option values.
     */
    defineOptions(): PlaceholderOptions {
        return {
            placeholder: 'Write something...',
            emptyNodeClass: 'e-placeholder-is-empty',
            emptyEditorClass: 'e-placeholder-is-editor-empty',
            dataAttribute: 'data-placeholder',
            showOnlyCurrent: true,
            showOnlyWhenEditable: true,
            includeChildren: true,
            showOnlyWhenEditorEmpty: true
        };
    },

    plugins(this: ExtensionScope<PlaceholderOptions>): readonly unknown[] {
        return [
            createPlaceholderPlugin({
                placeholder: this.options?.placeholder ?? 'Write something...',
                emptyNodeClass: this.options?.emptyNodeClass ?? 'e-placeholder-is-empty',
                emptyEditorClass: this.options?.emptyEditorClass ?? 'e-placeholder-is-editor-empty',
                dataAttribute: this.options?.dataAttribute ?? 'data-placeholder',
                showOnlyCurrent: this.options?.showOnlyCurrent ?? false,
                showOnlyWhenEditable: this.options?.showOnlyWhenEditable ?? true,
                includeChildren: this.options?.includeChildren ?? true,
                showOnlyWhenEditorEmpty: this.options?.showOnlyWhenEditorEmpty ?? false
            })
        ];
    }
});

export default placeholderExtension;
