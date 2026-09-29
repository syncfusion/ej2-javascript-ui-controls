/**
 * cell-node.ts — NodeDefinition for the 'tableCell' node type.
 *
 * A tableCell is a container for block-level content (paragraphs, headings, etc.).
 * Supports colspan/rowspan and a fixed allowlist of style attributes consumed
 * by prosemirror-tables' `setCellAttr` command.
 */
import type { NodeDefinition } from '../../../schema/types/node-definition';
import type { AttributeDefinition } from '../../../schema/types/attribute-definition';
import { NodeContent } from '../../../schema/types/content-expression';

/**
 * NodeDefinition for the `tableCell` node.
 *
 * Content: one or more block-level nodes.
 *
 * Attributes (fixed allowlist — both this node and `tableHeader` expose the
 * same set, so `setCellAttribute` can target either type uniformly):
 *   - `colspan`         {number} — columns spanned (default 1)
 *   - `rowspan`         {number} — rows spanned (default 1)
 *   - `colwidth`        {string} — comma-separated column widths (default null)
 *   - `align`           {enum}   — 'left' | 'center' | 'right' (default null)
 *   - `verticalAlign`   {enum}   — 'top'  | 'middle' | 'bottom' (default null)
 *   - `backgroundColor` {string} — CSS color (default null)
 *   - `color`           {string} — CSS color (default null)
 *   - `borderColor`     {string} — CSS color (default null)
 */
export const tableCellNodeDef: NodeDefinition = {
    name: 'tableCell',
    group: 'container',
    content: NodeContent.block().oneOrMore(),
    attrs: [
        { name: 'colspan',         type: 'number', default: 1 } as AttributeDefinition,
        { name: 'rowspan',         type: 'number', default: 1 } as AttributeDefinition,
        { name: 'colwidth',        type: 'string', default: null } as AttributeDefinition,
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
        { name: 'color',           type: 'string', default: null } as AttributeDefinition,
        { name: 'borderColor',     type: 'string', default: null } as AttributeDefinition
    ]
};
