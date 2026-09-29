import { defineExtension } from '../define-extension';
import { ExtensionDefinition } from '../types';
import { NodeDefinition } from '../../schema/types/node-definition';

/**
 * Text Extension
 *
 * Provides the mandatory inline text node required by the editor schema.
 *
 * The 'text' node represents plain textual content and is used inside
 * block nodes such as paragraphs, headings, blockquotes, and other
 * text-containing structures.
 */
export const textExtension: ExtensionDefinition<Record<string, never>> =
    defineExtension({
        name: 'text',

        /**
         * The `text` node is pinned unconditionally to position 1 in the schema
         * node map by the compiler — priority has no effect, but is set explicitly
         * for documentation clarity.
         */
        priority: 100,

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
