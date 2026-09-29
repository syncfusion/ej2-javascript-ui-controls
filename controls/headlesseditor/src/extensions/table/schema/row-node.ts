/**
 * row-node.ts — NodeDefinition for the 'tableRow' node type.
 *
 * A tableRow holds one or more tableCell or tableHeader nodes.
 * Both types must be permitted so that toggleHeaderRow / toggleHeaderColumn
 * can swap cell types without violating the content constraint.
 */
import type { NodeDefinition } from '../../../schema/types/node-definition';
import { NodeContent } from '../../../schema/types/content-expression';

/**
 * NodeDefinition for the `tableRow` node.
 *
 * Content: one or more `tableCell` or `tableHeader` nodes.
 * Attributes: none.
 */
export const tableRowNodeDef: NodeDefinition = {
    name: 'tableRow',
    group: 'container',
    content: NodeContent.choice(
        NodeContent.node('tableCell'),
        NodeContent.node('tableHeader')
    ).oneOrMore()
};
