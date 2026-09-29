import { PMNode, PMEditorState, PMMark, PMSchema } from '../pm-guard';
import { EditorNode, DocumentRoot, TextNode } from '../../model/editor-node';
import { Mark } from '../../model/mark';
import { IdGenerator, DefaultIdGenerator } from '../../utils/id-generator';
import { NodeMapper } from './node-mapper';

/**
 * DocumentMapper — converts DocumentRoot ↔ ProseMirror document.
 *
 * Handles full document conversion and diff-based sync to preserve node identity
 * after transactions while detecting structure changes.
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
     * If any node's `attrs.id` is null, generates a new UUID.
     *
     * @param {PMNode} pmDoc - The PM document node to convert.
     * @param {IdGenerator} [idGen] - Generator used when a node is missing an id.
     * @returns {DocumentRoot} The corresponding Syncfusion document root.
     */
    public static fromPMDoc(pmDoc: PMNode, idGen: IdGenerator = new DefaultIdGenerator()): DocumentRoot {
        const pmAttrs: Record<string, unknown> = pmDoc.attrs ?? {};
        const { id: _id, ...attrsWithoutId } = pmAttrs;
        const id: string = _id !== undefined && _id !== null ? String(_id) : idGen.generate();

        const children: EditorNode[] = [];
        pmDoc.forEach((child: PMNode) => {
            children.push(NodeMapper.fromPMNode(child, idGen));
        });

        return {
            id,
            type: 'document',
            schemaVersion: 1,
            attrs: attrsWithoutId,
            children,
            marks: []
        };
    }

    /**
     * Diff-based sync: after a PM transaction produces a new state, walk the
     * new PM doc against the current DocumentRoot. Reuse existing EditorNode
     * references for unchanged nodes (same PM node identity); rebuild only
     * changed nodes.
     *
     * @param {PMEditorState} newPMState - The new PM editor state after a transaction.
     * @param {DocumentRoot} currentRoot - The current DocumentRoot to diff against.
     * @param {IdGenerator} [idGen] - IdGenerator used only when PM creates a brand-new node with no id.
     * @returns {DocumentRoot} A DocumentRoot that preserves unchanged node references.
     */
    public static sync(
        newPMState: PMEditorState,
        currentRoot: DocumentRoot,
        idGen: IdGenerator = new DefaultIdGenerator()
    ): DocumentRoot {
        const newPMDoc : PMNode = newPMState.doc;
        return DocumentMapper._syncNode(newPMDoc, currentRoot, idGen) as DocumentRoot;
    }

    private static _syncNode(
        newPMNode: PMNode,
        currentNode: EditorNode | undefined,
        idGen: IdGenerator
    ): EditorNode {
        // If no current node to compare against, do a full fromPMNode conversion
        if (!currentNode) {
            if (newPMNode.type.name === 'document') {
                return DocumentMapper.fromPMDoc(newPMNode, idGen);
            }
            return NodeMapper.fromPMNode(newPMNode, idGen);
        }

        // Check if the PM node is the same reference as it was (PM uses structural equality after apply)
        // We detect "unchanged" by comparing child count, type, and attrs shallowly
        const typeMatch: boolean = newPMNode.type.name === currentNode.type;
        const childCountMatch: boolean = newPMNode.childCount === currentNode.children.length;

        if (!typeMatch) {
            // Type changed — full rebuild
            if (newPMNode.type.name === 'document') {
                return DocumentMapper.fromPMDoc(newPMNode, idGen);
            }
            return NodeMapper.fromPMNode(newPMNode, idGen);
        }

        // Text node sync
        if (newPMNode.isText) {
            const currentText: TextNode = currentNode as TextNode;
            if (newPMNode.text === currentText.text &&
                _marksEqual(Array.from(newPMNode.marks ?? []), currentText.marks ?? [])) {
                return currentNode; // unchanged — preserve reference
            }
            return NodeMapper.fromPMNode(newPMNode, idGen);
        }

        // Check if children changed
        if (!childCountMatch) {
            // Child count different — rebuild this node with sync'd children
            return DocumentMapper._rebuildWithSyncedChildren(newPMNode, currentNode, idGen);
        }

        // Deep-sync each child
        const newChildren: EditorNode[] = [];
        let anyChildChanged: boolean = false;

        let i: number = 0;
        newPMNode.forEach((pmChild: PMNode) => {
            const currentChild: EditorNode = currentNode.children[i as number];
            const synced: EditorNode = DocumentMapper._syncNode(pmChild, currentChild, idGen);
            newChildren.push(synced);
            if (synced !== currentChild) {
                anyChildChanged = true;
            }
            i++;
        });

        // Check if attrs changed
        const rawId: string = newPMNode.attrs ? newPMNode.attrs['id'] : null;
        const newId: string = rawId !== null && rawId !== undefined ? String(rawId) : currentNode.id;
        const attrsChanged: boolean = _attrsChanged(newPMNode, currentNode);

        if (!anyChildChanged && !attrsChanged && newId === currentNode.id) {
            return currentNode; // fully unchanged — preserve reference
        }

        // Rebuild with new children / attrs
        const { id: _ignoreId, ...attrs } = (newPMNode.attrs ?? {}) as Record<string, unknown>;
        void _ignoreId;

        if (newPMNode.type.name === 'document') {
            return {
                ...(currentNode as DocumentRoot),
                id: newId,
                attrs,
                children: newChildren
            } as DocumentRoot;
        }

        return {
            ...currentNode,
            id: newId,
            attrs,
            children: newChildren
        };
    }

    private static _rebuildWithSyncedChildren(
        newPMNode: PMNode,
        currentNode: EditorNode,
        idGen: IdGenerator
    ): EditorNode {
        const newChildren: EditorNode[] = [];

        newPMNode.forEach((pmChild: PMNode) => {
            // Try to find a matching current child by id or position
            newChildren.push(NodeMapper.fromPMNode(pmChild, idGen));
        });

        const rawId: unknown = newPMNode.attrs ? newPMNode.attrs['id'] : null;
        const id: string = rawId !== null && rawId !== undefined ? String(rawId) : currentNode.id;
        const { id: _ignoreRebuildId, ...attrs } = (newPMNode.attrs ?? {}) as Record<string, unknown>;
        void _ignoreRebuildId;

        if (newPMNode.type.name === 'document') {
            return {
                ...(currentNode as DocumentRoot),
                id,
                attrs,
                children: newChildren
            } as DocumentRoot;
        }
        return { ...currentNode, id, attrs, children: newChildren };
    }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Compares two mark lists by type name for diff-sync purposes.
 *
 * @param {PMMark[]} pmMarks - The PM mark list to compare.
 * @param {Mark[]} sfMarks - The Syncfusion mark list to compare.
 * @returns {boolean} True when both lists contain the same mark types in the same order.
 */
function _marksEqual(pmMarks: PMMark[], sfMarks: Mark[]): boolean {
    if (pmMarks.length !== sfMarks.length) { return false; }
    for (let i: number = 0; i < pmMarks.length; i++) {
        if (pmMarks[i as number].type.name !== sfMarks[i as number].type) { return false; }
    }
    return true;
}

/**
 * Detects whether a PM node's non-id attrs differ from a Syncfusion node.
 *
 * @param {PMNode} pmNode - The PM node whose attrs to inspect.
 * @param {EditorNode} sfNode - The Syncfusion node to compare against.
 * @returns {boolean} True when any non-id attr differs.
 */
function _attrsChanged(pmNode: PMNode, sfNode: EditorNode): boolean {
    const pmAttrs: Record<string, unknown> = pmNode.attrs ?? {};
    const sfAttrs: Record<string, unknown> = sfNode.attrs ?? {};
    for (const key of Object.keys(pmAttrs)) {
        if (key === 'id') { continue; }
        const value: unknown = pmAttrs[key as string];
        const sfValue: unknown = Reflect.get(sfAttrs, key);
        if (value !== sfValue) { return true; }
    }
    return false;
}
