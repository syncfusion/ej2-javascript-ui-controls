/**
 * selected-node-resolver.ts — Internal resolver for context-aware node queries.
 *
 * Lives at the PM boundary. Converts PM state into PM-free SelectedNode
 * and SelectedCell by tree-walking the document and resolving DOM elements
 * from the PM view.
 *
 * Exported only to Editor. Not part of the public API.
 *
 * @internal
 */

import {
    PMNode,
    PMSelection,
    PMEditorView,
    NodeSelection,
    TextSelection,
    AllSelection,
    PMCellSelection,
    PMResolvedPos
} from '../pm-guard';
import { NodeMapper } from '../adapters/node-mapper';
import { EditorNode, TextNode } from '../../model/editor-node';
import { SelectedNode, SelectedCell, CellSelection } from '../../model/selection';
import { SelectionType } from '../../model/selection';
import { CellContext, TableService } from '../../extensions/table/services/table-service';
import { IdGenerator } from '../../utils/id-generator';

/**
 * SelectedNodeResolver — converts PM state selections into PM-free node info.
 *
 * Methods return arrays to handle multi-selection scenarios (e.g., range across
 * multiple blocks). Callers pick the first, all, or specific entries as needed.
 *
 * All operations perform pure tree walks (or DOM lookups) and do not mutate state.
 */
export class SelectedNodeResolver {
    private readonly tableService: TableService = new TableService();

    /**
     * Resolve the currently selected node for a NodeSelection (atom: image, hr, hardBreak).
     * Returns null for any other selection shape.
     *
     * @param {PMSelection} pmSel - The ProseMirror selection
     * @param {PMNode} pmDoc - The PM document
     * @param {PMEditorView | undefined} pmView - The PM editor view (for DOM lookup)
     * @param {IdGenerator} idGen - ID generator (for document mapping)
     * @returns {SelectedNode | null} SelectedNode for atoms, null for non-node selections
     * @hidden
     */
    public resolveSelectedNode(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined,
        idGen: IdGenerator
    ): SelectedNode | null {
        if (!(pmSel instanceof NodeSelection)) {
            return null;
        }

        const nodeAtPos: PMNode | null = pmDoc.nodeAt(pmSel.from);
        if (!nodeAtPos) {
            return null;
        }

        const syncNode: EditorNode | TextNode = NodeMapper.fromPMNode(nodeAtPos, idGen);
        const dom: HTMLElement | null = this._getDOMElement(pmView, pmSel.from);

        return {
            node: syncNode,
            dom,
            pmPos: pmSel.from,
            source: 'node'
        };
    }

    /**
     * Resolve the block node that encloses the current selection (or cursor).
     *
     * For any selection shape, this walks up the node tree from the anchor
     * position to find the nearest ancestor with `group: 'block'` in its schema.
     * Returns the document root as a fallback.
     *
     * @param {PMSelection} pmSel - The ProseMirror selection
     * @param {PMNode} pmDoc - The PM document
     * @param {PMEditorView | undefined} pmView - The PM editor view (for DOM lookup)
     * @param {IdGenerator} idGen - ID generator (for document mapping)
     * @returns {SelectedNode | null} SelectedNode for the enclosing block
     * @hidden
     */
    public resolveSelectedBlock(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined,
        idGen: IdGenerator
    ): SelectedNode | null {
        let pos: number;

        if (pmSel instanceof AllSelection) {
            // AllSelection: default to document start
            pos = 0;
        } else if (pmSel instanceof PMCellSelection) {
            // CellSelection: use the anchor cell's start position
            pos = pmSel.from;
        } else if (pmSel instanceof TextSelection || pmSel instanceof NodeSelection) {
            // TextSelection / NodeSelection: use anchor
            pos = pmSel.$anchor.pos;
        } else {
            return null;
        }

        const $pos: PMResolvedPos = pmDoc.resolve(pos);

        // Walk up the resolved pos tree to find the first block-level node
        for (let d: number = $pos.depth; d > 0; d--) {
            const node: PMNode = $pos.node(d);
            if (this._isBlockNode(node)) {
                const blockPos: number = $pos.before(d);
                const syncNode: EditorNode = NodeMapper.fromPMNode(node, idGen);
                const dom: HTMLElement | null = this._getDOMElement(pmView, blockPos);
                return {
                    node: syncNode,
                    dom,
                    pmPos: blockPos,
                    source: 'block'
                };
            }
        }

        // Fallback: document root
        const syncRoot: EditorNode = NodeMapper.fromPMNode(pmDoc, idGen);
        return {
            node: syncRoot,
            dom: pmView?.dom ?? null,
            pmPos: 0,
            source: 'block'
        };
    }

    /**
     * Resolve all block nodes that intersect the current selection.
     *
     * For a cursor or single NodeSelection, returns a single block.
     * For a TextSelection spanning N blocks, returns all N blocks.
     *
     * @param {PMSelection} pmSel - The ProseMirror selection
     * @param {PMNode} pmDoc - The PM document
     * @param {PMEditorView | undefined} pmView - The PM editor view (for DOM lookup)
     * @param {IdGenerator} idGen - ID generator (for document mapping)
     * @returns {SelectedNode[]} Array of SelectedNode for all intersecting blocks
     * @hidden
     */
    public resolveSelectedBlocks(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined,
        idGen: IdGenerator
    ): SelectedNode[] {
        if (pmSel instanceof AllSelection) {
            // AllSelection: return document root
            const syncRoot: EditorNode = NodeMapper.fromPMNode(pmDoc, idGen);
            return [
                {
                    node: syncRoot,
                    dom: pmView?.dom ?? null,
                    pmPos: 0,
                    source: 'block'
                }
            ];
        }

        if (pmSel instanceof PMCellSelection) {
            // CellSelection: cells are not blocks; return enclosing table
            const blockInfo: SelectedNode | null = this.resolveSelectedBlock(
                pmSel,
                pmDoc,
                pmView,
                idGen
            );
            return blockInfo ? [blockInfo] : [];
        }

        const from: number = pmSel.from;
        const to: number = pmSel.to;

        const blocks: SelectedNode[] = [];
        const seenNodeIds: Set<string> = new Set();

        pmDoc.nodesBetween(from, to, (node: PMNode, nodePos: number): boolean | void => {
            if (this._isBlockNode(node)) {
                const syncNode: EditorNode = NodeMapper.fromPMNode(node, idGen);
                if (!seenNodeIds.has(syncNode.id)) {
                    seenNodeIds.add(syncNode.id);
                    const dom: HTMLElement | null = this._getDOMElement(pmView, nodePos);
                    blocks.push({
                        node: syncNode,
                        dom,
                        pmPos: nodePos,
                        source: blocks.length === 0 ? 'text' : 'block'
                    });
                }
            }
        });

        return blocks;
    }

    /**
     * Resolve the selected cell for a CellSelection (returns anchor cell only).
     * Returns null for non-CellSelection.
     *
     * @param {PMSelection} pmSel - The ProseMirror selection
     * @param {PMNode} pmDoc - The PM document
     * @param {PMEditorView | undefined} pmView - The PM editor view (for DOM lookup)
     * @param {IdGenerator} idGen - ID generator (for document mapping)
     * @param {EditorNode} syncDoc - The Syncfusion document (for table-service lookups)
     * @returns {SelectedCell | null} SelectedCell for the anchor cell, or null
     * @hidden
     */
    public resolveSelectedCell(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined,
        idGen: IdGenerator,
        syncDoc: EditorNode
    ): SelectedCell | null {
        if (!(pmSel instanceof PMCellSelection)) {
            return null;
        }

        // Anchor cell is at pmSel.from
        const cellNode: PMNode | null = pmDoc.nodeAt(pmSel.from);
        if (!cellNode || cellNode.type.name !== 'tableCell') {
            return null;
        }

        const syncCell: EditorNode = NodeMapper.fromPMNode(cellNode, idGen);
        const dom: HTMLElement | null = this._getDOMElement(pmView, pmSel.from);

        // Use table-service to get coordinates
        const cellSelection: CellSelection = {
            type: SelectionType.Cell,
            anchorCellId: syncCell.id,
            headCellId: syncCell.id
        };
        const cellContext: CellContext = this.tableService.getCurrentCell(
            syncDoc as any,
            cellSelection
        );

        if (!cellContext) {
            return null;
        }

        const table: EditorNode | null = this._findTableAncestor(syncDoc, syncCell.id);
        if (!table) {
            return null;
        }

        return {
            node: syncCell,
            dom,
            pmPos: pmSel.from,
            source: 'cell',
            colIndex: cellContext.col,
            rowIndex: cellContext.row,
            row: cellContext.cellNode,
            table
        };
    }

    /**
     * Resolve all selected cells for a CellSelection.
     * Returns empty array for non-CellSelection.
     *
     * @param {PMSelection} pmSel - The ProseMirror selection
     * @param {PMNode} pmDoc - The PM document
     * @param {PMEditorView | undefined} pmView - The PM editor view (for DOM lookup)
     * @param {IdGenerator} idGen - ID generator (for document mapping)
     * @param {EditorNode} syncDoc - The Syncfusion document (for table-service lookups)
     * @returns {SelectedCell[]} Array of SelectedCell for all selected cells
     * @hidden
     */
    public resolveSelectedCells(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined,
        idGen: IdGenerator,
        syncDoc: EditorNode
    ): SelectedCell[] {
        if (!(pmSel instanceof PMCellSelection)) {
            return [];
        }

        // Resolve anchor and head cell IDs from PM positions
        const anchorCell: PMNode | null = pmDoc.nodeAt(pmSel.from);
        const headCell: PMNode | null = pmDoc.nodeAt(pmSel.to - 1);

        if (!anchorCell || !headCell) {
            return [];
        }

        const anchorCellId: string = anchorCell.attrs['id'] as string;
        const headCellId: string = headCell.attrs['id'] as string;

        const cellSelection: CellSelection = {
            type: SelectionType.Cell,
            anchorCellId,
            headCellId
        };
        const cellContexts: CellContext[] = this.tableService.getSelectedCells(
            syncDoc as any,
            cellSelection
        );

        // Walk through the resolved cell contexts
        const cells: SelectedCell[] = [];

        for (const cellContext of cellContexts) {
            const syncCell: EditorNode = cellContext.cellNode;
            const dom: HTMLElement | null = this._getDOMElement(pmView, pmSel.from); // approximate position

            // Resolve row and table ancestors
            const resolvedTable: EditorNode | null = this._findTableAncestor(syncDoc, syncCell.id);
            const resolvedRow: EditorNode | null = this._findRowAncestor(syncDoc, syncCell.id);

            if (resolvedTable && resolvedRow) {
                cells.push({
                    node: syncCell,
                    dom,
                    pmPos: pmSel.from,
                    source: 'cell',
                    colIndex: cellContext.col,
                    rowIndex: cellContext.row,
                    row: resolvedRow,
                    table: resolvedTable
                });
            }
        }

        return cells;


    }

    /**
     * Resolve all leaf nodes (non-block atoms: image, horizontal-rule, hard-break)
     * within the current selection range.
     *
     * Returns empty array if no leaf nodes are selected.
     *
     * @param {PMSelection} pmSel - The ProseMirror selection
     * @param {PMNode} pmDoc - The PM document
     * @param {PMEditorView | undefined} pmView - The PM editor view (for DOM lookup)
     * @param {IdGenerator} idGen - ID generator (for document mapping)
     * @returns {SelectedNode[]} Array of SelectedNode for all leaf nodes in range
     * @hidden
     */
    public resolveSelectedLeafNodes(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined,
        idGen: IdGenerator
    ): SelectedNode[] {
        const from: number = pmSel.from;
        const to: number = pmSel.to;

        const leafNodes: SelectedNode[] = [];
        const seenNodeIds: Set<string> = new Set();

        pmDoc.nodesBetween(from, to, (node: PMNode, nodePos: number): boolean | void => {
            if (node.isAtom && this._isLeafNode(node) && !seenNodeIds.has(node.attrs['id'] as string)) {
                seenNodeIds.add(node.attrs['id'] as string);

                const syncNode: EditorNode = NodeMapper.fromPMNode(node, idGen);
                const dom: HTMLElement | null = this._getDOMElement(pmView, nodePos);

                leafNodes.push({
                    node: syncNode,
                    dom,
                    pmPos: nodePos,
                    source: 'node'
                });
            }
        });

        return leafNodes;
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    /**
     * Check if a PM node is a block-level node (has `group: 'block'` in schema spec).
     *
     * @param {PMNode} node - The PM node to check
     * @returns {boolean} true if node is a block; false otherwise
     * @hidden
     */
    private _isBlockNode(node: PMNode): boolean {
        const spec: { group?: string } | undefined = node.type.spec as { group?: string } | undefined;
        return spec?.group === 'block';
    }

    /**
     * Check if a PM node is a leaf node (has no children).
     * Excludes inline text nodes, only returns true for atom containers.
     *
     * @param {PMNode} node - The PM node to check
     * @returns {boolean} true if node is a leaf; false otherwise
     * @hidden
     */
    private _isLeafNode(node: PMNode): boolean {
        return node.isAtom && node.childCount === 0;
    }

    /**
     * Attempt to retrieve the DOM element for a node at a given PM position.
     * Returns null if the view is not mounted or the position is not rendered.
     *
     * @param {PMEditorView | undefined} pmView - The PM editor view
     * @param {number} pos - The PM position
     * @returns {HTMLElement | null} The DOM element or null
     * @hidden
     */
    private _getDOMElement(pmView: PMEditorView | undefined, pos: number): HTMLElement | null {
        if (!pmView) {
            return null;
        }

        try {
            const domNode: any = pmView.nodeDOM(pos);
            if (domNode && domNode.nodeType === 1) {
                return domNode as HTMLElement;
            }
        } catch {
            // Position may not have a DOM representation
        }

        return null;
    }

    /**
     * Find the nearest table ancestor of a node by ID, walking the Syncfusion document tree.
     *
     * @param {EditorNode} root - The document root
     * @param {string} nodeId - The node ID to find
     * @returns {EditorNode | null} The table ancestor or null
     * @hidden
     */
    private _findTableAncestor(root: EditorNode, nodeId: string): EditorNode | null {
        const walk: (node: EditorNode) => EditorNode | null = (node: EditorNode): EditorNode | null => {
            if (node.id === nodeId) {
                // Found the node; now walk back up looking for a table
                return this._findAncestorType(root, nodeId, 'table');
            }
            for (const child of node.children) {
                const found: EditorNode | null = walk(child);
                if (found) {
                    return found;
                }
            }
            return null;
        };

        return walk(root);
    }

    /**
     * Find the nearest table row ancestor of a node by ID.
     *
     * @param {EditorNode} root - The document root
     * @param {string} nodeId - The node ID to find
     * @returns {EditorNode | null} The table row ancestor or null
     * @hidden
     */
    private _findRowAncestor(root: EditorNode, nodeId: string): EditorNode | null {
        return this._findAncestorType(root, nodeId, 'tableRow');
    }

    /**
     * Find the nearest ancestor of a given type, walking from root to the node.
     *
     * @param {EditorNode} root - The document root
     * @param {string} nodeId - The node ID to find
     * @param {string} ancestorType - The ancestor type to search for
     * @returns {EditorNode | null} The ancestor node or null
     * @hidden
     */
    private _findAncestorType(
        root: EditorNode,
        nodeId: string,
        ancestorType: string
    ): EditorNode | null {
        type WalkResult = { found: boolean; ancestor: EditorNode | null; }
        const walk: (node: EditorNode, closestAncestor: EditorNode | null) => WalkResult = (
            node: EditorNode,
            closestAncestor: EditorNode | null
        ): WalkResult => {
            const updatedAncestor: EditorNode | null = node.type === ancestorType ? node : closestAncestor;

            if (node.id === nodeId) {
                return { found: true, ancestor: updatedAncestor };
            }

            for (const child of node.children) {
                const result: WalkResult = walk(child, updatedAncestor);
                if (result.found) {
                    return result;
                }
            }

            return { found: false, ancestor: null };
        };

        const result: WalkResult = walk(root, null);
        return result.found ? result.ancestor : null;
    }
}
