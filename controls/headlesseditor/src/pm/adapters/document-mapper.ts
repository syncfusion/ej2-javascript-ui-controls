import { PMNode, PMEditorState, PMSchema } from '../pm-guard';
import { EditorNode, DocumentRoot } from '../../core/model/editor-node';
import { NodeMapper } from './node-mapper';

/**
 * DocumentMapper — converts DocumentRoot ↔ ProseMirror document.
 *
 * Syncfusion documents do not carry persistent node IDs, so all id-based
 * legacy branches have been removed. The mapper is now a thin tree
 * conversion utility.
 */
export class DocumentMapper {
    /**
     * Converts a DocumentRoot to a ProseMirror document node.
     * Uses the schema's 'document' node type as root.
     *
     * @param {DocumentRoot} root - The Syncfusion document root to convert.
     * @param {PMSchema} schema - The PM schema used to resolve node types.
     * @returns {PMNode} The corresponding ProseMirror document node.
     */
    public static toPMDoc(root: DocumentRoot, schema: PMSchema): PMNode {
        return NodeMapper.toPMNode(root, schema);
    }

    /**
     * Converts a ProseMirror document node to a DocumentRoot.
     *
     * @param {PMNode} pmDoc - The PM document node to convert.
     * @returns {DocumentRoot} The corresponding Syncfusion document root.
     */
    public static fromPMDoc(pmDoc: PMNode): DocumentRoot {
        const pmAttrs: Record<string, unknown> = pmDoc.attrs ?? {};
        const attrsWithoutIds: Record<string, unknown> = {};
        for (const key of Object.keys(pmAttrs)) {
            if (key === 'id') { continue; }
            attrsWithoutIds[key as string] = pmAttrs[key as string];
        }

        const children: EditorNode[] = [];
        pmDoc.forEach((child: PMNode) => {
            children.push(NodeMapper.fromPMNode(child));
        });

        return {
            type: 'document',
            schemaVersion: 1,
            attrs: attrsWithoutIds,
            children,
            marks: []
        };
    }

    /**
     * Resyncs a DocumentRoot from the latest PM state by performing a full
     * rebuild. Callers should treat this as opaque when no stable id-based
     * reference preservation is desired.
     *
     * @param {PMEditorState} newPMState - The new PM editor state after a transaction.
     * @returns {DocumentRoot} The rebuilt DocumentRoot matching the new PM state.
     */
    public static sync(newPMState: PMEditorState): DocumentRoot {
        return DocumentMapper.fromPMDoc(newPMState.doc);
    }
}
