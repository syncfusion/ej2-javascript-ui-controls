/**
 * header-cell-node.ts — NodeDefinition for the 'tableHeader' node type.
 *
 * A tableHeader is the semantic equivalent of a tableCell but rendered as
 * `<th>`. prosemirror-tables' toggleHeaderRow / toggleHeaderColumn commands
 * swap tableCell ↔ tableHeader by replacing the node type, so this node MUST
 * exist in the schema for those commands to work.
 *
 * Mirrors tableCell exactly in structure so the same attribute allowlist
 * applies regardless of whether a cell has been toggled to a header:
 *   - Same content model  (block+)
 *   - Same attributes     (colspan, rowspan, colwidth, align, verticalAlign,
 *                          backgroundColor, color, borderColor)
 *   - tableRole resolved to 'header_cell' via NODE_PM_METADATA
 *   - isolating: true     via NODE_PM_METADATA
 */
import type { NodeDefinition } from '../../../schema/types/node-definition';
import type { AttributeDefinition } from '../../../schema/types/attribute-definition';
import { NodeContent } from '../../../schema/types/content-expression';

export const tableHeaderNodeDef: NodeDefinition = {
    name: 'tableHeader',
    group: 'container',
    content: NodeContent.block().oneOrMore(),
    attrs: [
        { name: 'colspan', type: 'number', default: 1 } as AttributeDefinition,
        { name: 'rowspan', type: 'number', default: 1 } as AttributeDefinition,
        { name: 'colwidth', type: 'string', default: null } as AttributeDefinition,
        {
            name: 'align',
            type: 'enum',
            default: null,
            values: ['left', 'center', 'right']
        } as AttributeDefinition,
        {
            name: 'verticalAlign',
            type: 'enum',
            default: null,
            values: ['top', 'middle', 'bottom']
        } as AttributeDefinition,
        { name: 'backgroundColor', type: 'string', default: null } as AttributeDefinition,
        { name: 'color', type: 'string', default: null } as AttributeDefinition,
        { name: 'borderColor', type: 'string', default: null } as AttributeDefinition
    ]
};
