/**
 * table-node.ts — NodeDefinition for the 'table' node type.
 *
 * The table node is a block-level container for tableRow nodes.
 * Dimensions are derived at runtime via TableMap; no stored attributes needed.
 */
import type { NodeDefinition } from '../../../schema/types/node-definition';
import { NodeContent } from '../../../schema/types/content-expression';

/**
 * NodeDefinition for the `table` node.
 *
 * Content: one or more `tableRow` nodes.
 * Attributes: none (dimensions derived via TableMap).
 */
export const tableNodeDef: NodeDefinition = {
    name: 'table',
    group: 'block',
    content: NodeContent.node('tableRow').oneOrMore()
};
