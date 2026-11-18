import { defineExtension } from '../define-extension';
import { ExtensionDefinition } from '../types';
import { NodeDefinition } from '../../core/schema/types/node-definition';

/**
 * Text extension for the Syncfusion Headless Editor.
 *
 * Provides the mandatory inline text node required by the editor schema. The `text`
 * node represents plain textual content and is used inside block nodes such as
 * paragraphs, headings, blockquotes, and other text-containing structures.
 *
 * **Contributes:**
 * - `text` node type (mandatory inline text container)
 *
 * **Schema requirement:**
 * Every editor instance requires the `text` node. It is included in the
 * `basicExtensions` preset by default.
 *
 * @type {ExtensionDefinition<Record<string, never>>}
 *
 * @example
 * ```typescript
 * // The text extension is included in basicExtensions preset
 * const editor = HeadlessEditor.create({
 *   extensions: [basicExtensions] // text node included automatically
 * });
 *
 * // Or register individually alongside other extensions
 * const editor = HeadlessEditor.create({
 *   extensions: [documentExtension, paragraphExtension, textExtension]
 * });
 * ```
 *
 * @see basicExtensions for the complete preset
 */
export const textExtension: ExtensionDefinition<Record<string, never>> =
    defineExtension({
        /**
         * Unique extension identifier used to register and reference this extension.
         *
         * @type {string}
         */
        name: 'text',

        /**
         * The `text` node is pinned unconditionally to position 1 in the schema
         * node map by the compiler — priority has no effect, but is set explicitly
         * for documentation clarity.
         *
         * @type {number}
         */
        priority: 100,

        /**
         * Registers the mandatory inline text node type.
         *
         * @returns {NodeDefinition[]} Array containing the text node definition.
         */
        nodes(): NodeDefinition[] {
            return [
                {
                    name: 'text',
                    group: 'inline'
                }
            ];
        }
    });

export default textExtension;
