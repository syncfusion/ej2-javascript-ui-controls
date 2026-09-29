/**
 * @internal PM NodeSpec metadata registry.
 *
 * Maps node type names to ProseMirror NodeSpec overrides that must be applied
 * by the schema compiler. This file is sealed — never imported by extension
 * authors or outside src/pm/.
 *
 * Each extension can register its own PM-specific node metadata here.
 *
 * Example:
 *   TABLE_NODE_METADATA['tableCell'] = { tableRole: 'cell' }
 *   LIST_NODE_METADATA['listItem'] = { defining: true }
 */

export const NODE_PM_METADATA: Record<string, Record<string, any>> = {
    // Table nodes
    'table': {
        tableRole: 'table',
        isolating: true
    },
    'tableRow': {
        tableRole: 'row'
    },
    'tableCell': {
        tableRole: 'cell',
        isolating: true
    },
    'tableHeader': {
        tableRole: 'header_cell',
        isolating: true
    },
    // List nodes
    'listItem': {
        defining: true
    },
    'taskItem': {
        defining: true
    },
    // Code block: preserve structure on copy/paste and disallow inline marks
    'codeBlock': {
        defining: true,
        marks: '',
        code: true
    }
};

/**
 * @returns
 * Get PM metadata for a node type, or empty object if none registered.
 *
 * @param {string} nodeName - The name of the node for which to retrieve metadata.
 * @returns {Record<string, any>} Returns the metadata object associated with the specified node type.
 * @hidden
 */
export function getPMNodeMetadata(nodeName: string): Record<string, any> {
    return NODE_PM_METADATA[`${nodeName}`] ?? {};
}
