/**
 * Built-in Document Extension
 *
 * Provides the root document node type:
 * - Node definition: name 'document', group 'root', content block+
 *
 * The document node is the top-level container for all editor content.
 * Every editor instance requires exactly one document node as its root.
 */

import { defineExtension } from '../define-extension';
import type { NodeDefinition } from '../../schema/types/node-definition';
import { NodeContent } from '../../schema/types/content-expression';
import { ExtensionDefinition, ExtensionDOMSpecs } from '../types';

/**
 * Document built-in extension.
 * Registers the root `document` node that wraps all block-level content.
 */
export const documentExtension: ExtensionDefinition<Record<string, never>> = defineExtension({
    name: 'document',

    /**
     * The `document` node is pinned unconditionally to position 0 in the schema
     * node map by the compiler — priority has no effect, but is set explicitly
     * for documentation clarity.
     */
    priority: 100,

    // ── Nodes ──────────────────────────────────────────────────────────────

    nodes(): NodeDefinition[] {
        const documentNode: NodeDefinition = {
            name: 'document',
            group: 'root',
            content: NodeContent.block().oneOrMore()
        };
        return [documentNode];
    },

    // ── DOM Specs ──────────────────────────────────────────────────────────

    domSpecs(): ExtensionDOMSpecs {
        return {
            nodes: {
                document: {
                    toDOM: (_attrs: Record<string, unknown>) => ['div', 0]
                }
            }
        };
    }
});

export default documentExtension;
