/**
 * selected-node-resolver.ts — Internal resolver for context-aware node queries.
 *
 * Lives at the PM boundary. Syncfusion documents carry no persistent node
 * IDs, so all idGen parameters have been removed from this module.
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
import { EditorNode, DocumentRoot } from '../../core/model/editor-node';
import { SelectedNode, SelectedCell } from '../../core/model/selection';
import { CellContext, TableService, createCellSelection } from '../../extensions/table/services/table-service';

// Node types that count as a table cell for selection purposes.
const TABLE_CELL_TYPES: ReadonlySet<string> = new Set<string>(['tableCell', 'tableHeader']);

/**
 * @hidden
 */
interface CellAncestor {
    node: PMNode;
    pos: number;
}

/**
 * @hidden
 */
interface IndexedCell {
    path: number[];
    pmPos: number;
    syncNode: EditorNode;
}

/**
 * @hidden
 */
interface CellPathPair {
    anchorCellPath: number[];
    headCellPath: number[];
}

export class SelectedNodeResolver {
    private readonly tableService: TableService = new TableService();

    private resolveContentContext(
        pmSel: PMSelection,
        pmDoc: PMNode
    ): { node: PMNode; pos: number; resolved: PMResolvedPos } | null {
        if (pmSel instanceof PMCellSelection) {
            const node: PMNode | null = pmDoc.nodeAt(pmSel.from);
            return node ? { node, pos: pmSel.from, resolved: pmDoc.resolve(pmSel.from) } : null;
        }

        if (!(pmSel instanceof TextSelection || pmSel instanceof NodeSelection)) {
            return null;
        }

        const resolved: PMResolvedPos = pmDoc.resolve(pmSel.$from.pos);
        if (pmSel instanceof NodeSelection) {
            const node: PMNode | null = pmDoc.nodeAt(pmSel.from);
            return node ? { node, pos: pmSel.from, resolved } : null;
        }
        if (resolved.depth === 0) { return null; }

        return {
            node: resolved.parent,
            pos: resolved.before(resolved.depth),
            resolved
        };
    }

    public resolveSelectedNode(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined
    ): SelectedNode | null {
        if (pmSel instanceof NodeSelection) {
            const nodeAtPos: PMNode | null = pmDoc.nodeAt(pmSel.from);
            if (!nodeAtPos) { return null; }
            return this.toSelectedNode(nodeAtPos, pmSel.from, pmView, 'node');
        }

        if (pmSel instanceof PMCellSelection) {
            const cell: PMNode | null = pmDoc.nodeAt(pmSel.from);
            return cell ? this.toSelectedNode(cell, pmSel.from, pmView, 'cell') : null;
        }

        if (!(pmSel instanceof TextSelection)) { return null; }
        const resolved: PMResolvedPos = pmDoc.resolve(pmSel.$from.pos);
        if (resolved.depth === 0) { return null; }
        const contentNode: PMNode = resolved.parent;
        const contentPos: number = resolved.before(resolved.depth);
        return this.toSelectedNode(contentNode, contentPos, pmView, 'text');
    }

    private toSelectedNode(
        node: PMNode,
        pos: number,
        pmView: PMEditorView | undefined,
        source: 'node' | 'cell' | 'text' | 'block'
    ): SelectedNode {
        const syncNode: EditorNode = NodeMapper.fromPMNode(node);
        const dom: HTMLElement | null = this._getDOMElement(pmView, pos);

        return {
            node: syncNode,
            dom,
            pmPos: pos,
            source
        };
    }

    public resolveSelectedBlock(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined
    ): SelectedNode | null {
        if (pmSel instanceof AllSelection) {
            return null;
        }

        const content: { node: PMNode; pos: number; resolved: PMResolvedPos } | null =
            this.resolveContentContext(pmSel, pmDoc);
        if (!content) { return null; }

        const firstAncestorDepth: number = pmSel instanceof NodeSelection
            ? content.resolved.depth
            : content.resolved.depth - 1;
        for (let d: number = firstAncestorDepth; d > 0; d--) {
            const node: PMNode = content.resolved.node(d);
            if (this._isMeaningfulBlock(node)) {
                const blockPos: number = content.resolved.before(d);
                return this.toSelectedNode(node, blockPos, pmView, 'block');
            }
        }

        return this.toSelectedNode(content.node, content.pos, pmView, 'block');
    }

    public resolveSelectedBlocks(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined
    ): SelectedNode[] {
        if (pmSel instanceof AllSelection) {
            const syncRoot: EditorNode = NodeMapper.fromPMNode(pmDoc);
            return [{ node: syncRoot, dom: pmView?.dom ?? null, pmPos: 0, source: 'block' as const }];
        }

        if (pmSel instanceof PMCellSelection) {
            const blockInfo: SelectedNode | null = this.resolveSelectedBlock(pmSel, pmDoc, pmView);
            return blockInfo ? [blockInfo] : [];
        }

        const from: number = pmSel.from;
        const to: number = pmSel.to;

        if (from === to) {
            const content: { node: PMNode; pos: number; resolved: PMResolvedPos } | null =
                this.resolveContentContext(pmSel, pmDoc);
            if (content && this._isBlockNode(content.node)) {
                return [this.toSelectedNode(content.node, content.pos, pmView, 'text')];
            }
        }

        const blocks: SelectedNode[] = [];

        pmDoc.descendants((node: PMNode, nodePos: number): void => {
            if (!this._isBlockNode(node)) { return; }
            const nodeEnd: number = nodePos + node.nodeSize;
            const intersectsSelection: boolean = nodePos < to && nodeEnd > from;
            const isNestedSelection: boolean = this._isMeaningfulBlock(node)
                && from >= nodePos && to <= nodeEnd;
            if (!intersectsSelection || isNestedSelection) { return; }

            const syncNode: EditorNode = NodeMapper.fromPMNode(node);
            const dom: HTMLElement | null = this._getDOMElement(pmView, nodePos);
            blocks.push({ node: syncNode, dom, pmPos: nodePos, source: blocks.length === 0 ? 'text' : 'block' });
        });

        return blocks;
    }

    /**
     * Walk up the resolved tree at `pos` and return the first ancestor
     * that is a table cell, together with the cell's content-start
     * position (one token past the cell's opening).
     *
     * @param {PMNode} pmDoc The ProseMirror document to resolve against.
     * @param {number} pos   An absolute PM position; may sit inside a cell,
     *                       exactly at a cell opening, or outside any cell.
     * @returns {CellAncestor} `{ node, pos }` where
     *          `pos` is the cell's content-start (matching the value
     *          `indexCells` stores), or `null` if `pos` is not inside /
     *          at the boundary of a cell.
     */
    private findCellAncestorAtPos(
        pmDoc: PMNode,
        pos: number
    ): CellAncestor | null {
        if (pos < 0 || pos > pmDoc.content.size) { return null; }
        const resolved: PMResolvedPos = pmDoc.resolve(pos);
        for (let d: number = resolved.depth; d > 0; d--) {
            const node: PMNode = resolved.node(d);
            if (TABLE_CELL_TYPES.has(node.type.name)) {
                return { node, pos: resolved.before(d) + 1 };
            }
        }
        // Handle the boundary case where `pos` sits exactly at a cell
        // opening (e.g. `PMCellSelection.$anchorCell.pos`); the cell at
        // the boundary is `resolved.nodeAfter`.
        const after: PMNode | null = resolved.nodeAfter;
        if (after && TABLE_CELL_TYPES.has(after.type.name)) {
            return { node: after, pos: pos + 1 };
        }
        return null;
    }

    /**
     * Build a lookup table of every cell in the document.
     *
     * Walks the live `pmDoc` and, for every `tableCell` / `tableHeader`
     * it finds, records the cell's sync path and its PM content-start
     * position. The result is reused by `resolveCellPaths` (to map a
     * selection position to a sync path) and by `resolveSelectedCells`
     * (to map each returned cell context back to a PM position for DOM
     * lookup). Building it once per call avoids a separate full-doc
     * walk per consumer.
     *
     * @param {PMNode} pmDoc  The live ProseMirror document to walk.
     * @param {DocumentRoot} syncDoc The sync document used to validate
     *                               each cell's path; cells whose
     *                               computed path does not point to a
     *                               cell in `syncDoc` are dropped
     *                               (defends against a divergent /
     *                               stale tree).
     * @returns {IndexedCell[]} One entry per cell with its sync path,
     *                          PM content-start, and the sync cell node.
     */
    private indexCells(
        pmDoc: PMNode,
        syncDoc: DocumentRoot
    ): IndexedCell[] {
        const result: { path: number[]; pmPos: number; syncNode: EditorNode }[] = [];
        pmDoc.descendants((node: PMNode, nodePos: number): boolean => {
            if (!TABLE_CELL_TYPES.has(node.type.name)) { return true; }
            // Resolve at the cell's content start (`nodePos + 1`) so
            // `index(0/1/2)` returns the table / row / cell indices.
            const cellContentStart: number = nodePos + 1;
            const cellInside: PMResolvedPos = pmDoc.resolve(cellContentStart);
            const docChildIdx: number = cellInside.index(0);
            const tableRowIdx: number = cellInside.index(1);
            const cellColIdx: number = cellInside.index(2);
            const path: number[] = [docChildIdx, tableRowIdx, cellColIdx];
            const syncNode: EditorNode | null = this._getNodeAtPath(syncDoc, path);
            if (syncNode && TABLE_CELL_TYPES.has(syncNode.type)) {
                result.push({ path, pmPos: cellContentStart, syncNode });
            }
            return true; // keep walking so siblings (multiple cells in same row) are indexed too
        });
        return result;
    }

    /**
     * Translate the current PM selection into the sync cell paths it
     * spans — the (anchorCellPath, headCellPath) pair the table service
     * uses for rectangular range walks.
     *
     * @param {PMSelection} pmSel The current ProseMirror selection.
     * @param {PMNode} pmDoc The live ProseMirror document.
     * @param {IndexedCell[]} index Cell index built by `indexCells`;
     *                            reused here so we do not re-walk the
     *                            document.
     * @returns {CellPathPair | null} `{ anchorCellPath, headCellPath }`
     *          when both ends of the selection land inside cells, or
     *          `null` otherwise (e.g. cursor sits in a paragraph
     *          outside any table).
     */
    private resolveCellPaths(
        pmSel: PMSelection,
        pmDoc: PMNode,
        index: IndexedCell[]
    ): CellPathPair | null {
        // For `PMCellSelection`, `$from`/`$to` both point at the first
        // cell — use `$anchorCell` / `$headCell` instead.
        let anchorPos: number;
        let headPos: number;
        if (pmSel instanceof PMCellSelection) {
            anchorPos = pmSel.$anchorCell.pos;
            headPos = pmSel.$headCell.pos;
        } else {
            anchorPos = pmSel.$anchor ? pmSel.$anchor.pos : pmSel.from;
            const headRaw: number = pmSel.$head ? pmSel.$head.pos : pmSel.to;
            headPos = Math.min(headRaw, pmDoc.content.size);
        }

        const findCellAt: (pos: number) => number[] | null = (pos: number): number[] | null => {
            const ancestor: CellAncestor | null =
                this.findCellAncestorAtPos(pmDoc, pos);
            if (!ancestor) { return null; }
            const match: IndexedCell | undefined =
                index.find((entry: IndexedCell): boolean =>
                    entry.pmPos === ancestor.pos
                );
            return match ? match.path : null;
        };

        const anchorCellPath: number[] | null = findCellAt(anchorPos);
        const headCellPath: number[] | null = findCellAt(headPos);
        if (!anchorCellPath || !headCellPath) { return null; }

        return { anchorCellPath, headCellPath };
    }

    /**
     * Resolve the live DOM element that renders a cell.
     *
     * At the cell's content start, `pmView.nodeDOM(pos)` returns the
     * cell's first child (e.g. the inner `<p>`), not the cell itself.
     * At the cell's opening (`pmCellPos - 1`) it returns the cell's
     * own `<td>` / `<th>`. This method tries both, then falls back to
     * `closest('td, th')` to defend against schema wrappers.
     *
     * @param {PMEditorView | undefined} pmView The live editor view
     *                                          (may be undefined).
     * @param {number} pmCellPos The cell's content-start position from
     *                           the index.
     * @returns {HTMLElement} The cell's `<td>` / `<th>` element, or
     *                       `null` when the position is invalid or the
     *                       cell is not mounted.
     */
    private getDOMElementAtCell(pmView: PMEditorView | undefined, pmCellPos: number): HTMLElement | null {
        if (!pmView || pmCellPos <= 0) { return null; }
        const candidates: number[] = [pmCellPos - 1, pmCellPos];
        for (const pos of candidates) {
            try {
                const domNode: unknown = pmView.nodeDOM(pos);
                if (domNode && (domNode as { nodeType?: number }).nodeType === 1) {
                    const el: HTMLElement = domNode as HTMLElement;
                    if (el.tagName === 'TD' || el.tagName === 'TH') {
                        return el;
                    }
                    const cellEl: HTMLElement | null = el.closest('td, th');
                    if (cellEl) {
                        return cellEl;
                    }
                    return el;
                }
            } catch {
                // pmView.nodeDOM throws when the position is not bound to a DOM node
            }
        }
        return null;
    }

    public resolveSelectedCells(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined,
        syncDoc: DocumentRoot
    ): SelectedCell[] {
        // Build the index once and reuse it for both path resolution and
        // PM-position lookup — avoids a second full-doc walk per call.
        const index: IndexedCell[] = this.indexCells(pmDoc, syncDoc);
        const paths: CellPathPair | null =
            this.resolveCellPaths(pmSel, pmDoc, index);
        if (!paths) { return []; }

        const cellContexts: CellContext[] = this.tableService.getSelectedCells(
            syncDoc,
            createCellSelection(paths.anchorCellPath, paths.headCellPath)
        );

        const cells: SelectedCell[] = [];
        for (const cellContext of cellContexts) {
            const entry: IndexedCell | undefined = index.find(
                (e: IndexedCell): boolean =>
                    e.path.length === cellContext.cellPath.length
                    && e.path.every((seg: number, idx: number): boolean =>
                        seg === cellContext.cellPath[idx as number]
                    )
            );
            const pmCellPos: number = entry ? entry.pmPos : -1;
            cells.push({
                node: cellContext.cellNode,
                dom: this.getDOMElementAtCell(pmView, pmCellPos),
                pmPos: pmCellPos >= 0 ? pmCellPos : pmSel.from,
                source: 'cell',
                colIndex: cellContext.col,
                rowIndex: cellContext.row
            });
        }
        return cells;
    }

    public resolveSelectedLeafNodes(
        pmSel: PMSelection,
        pmDoc: PMNode,
        pmView: PMEditorView | undefined
    ): SelectedNode[] {
        // Fast path: a NodeSelection that already targets a leaf returns that
        // single node. This matches the public contract "the selected leaf
        // node" for the most common case (clicking an image / HR / hard break).
        if (pmSel instanceof NodeSelection) {
            const nodeAtPos: PMNode | null = pmDoc.nodeAt(pmSel.from);
            if (nodeAtPos && this._isLeafNode(nodeAtPos)) {
                return [this.toSelectedNode(nodeAtPos, pmSel.from, pmView, 'node')];
            }
            return [];
        }

        if (pmSel instanceof PMCellSelection || pmSel instanceof AllSelection) {
            return [];
        }

        const from: number = pmSel.from;
        const to: number = pmSel.to;

        // Empty / collapsed range — no leaf is "selected" until the user
        // actually selects something.
        if (from === to) {
            return [];
        }

        const leafNodes: SelectedNode[] = [];

        // Use descendants (full doc walk) with an explicit intersection
        // check. nodesBetween visits ancestors that merely overlap the
        // range, which previously let non-leaf ancestors slip through when
        // a downstream predicate drifted; descendants + the explicit
        // nodePos/nodeEnd test keeps the iteration to the leaves that
        // actually lie inside [from, to).
        pmDoc.descendants((node: PMNode, nodePos: number): void => {
            if (!this._isLeafNode(node)) { return; }
            const nodeEnd: number = nodePos + node.nodeSize;
            // A leaf is "selected" only when its full range is contained in
            // the current selection. Overlap alone (which nodesBetween
            // used) is too permissive and surfaced partial selections.
            if (nodePos < from || nodeEnd > to) { return; }
            leafNodes.push(this.toSelectedNode(node, nodePos, pmView, 'node'));
        });

        return leafNodes;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private _isBlockNode(node: PMNode): boolean {
        const spec: { group?: string } | undefined = node.type.spec as { group?: string } | undefined;
        return spec?.group === 'block';
    }

    private _isMeaningfulBlock(node: PMNode): boolean {
        return new Set<string>([
            'blockquote', 'callout', 'bulletList', 'orderedList', 'taskList',
            'collapsible', 'table'
        ]).has(node.type.name);
    }

    private _isLeafNode(node: PMNode): boolean {
        // A "leaf" here means a non-text atom: image, horizontal rule, hard
        // break, and any custom node declared with `leaf: true` in its
        // NodeDefinition. Using `isLeaf && !isText` matches the convention
        // already used by `ActiveMarksResolver` and
        // `SelectionContextResolver` so the three resolvers agree on what
        // counts as a leaf.
        return node.isLeaf && !node.isText;
    }

    private _getDOMElement(pmView: PMEditorView | undefined, pos: number): HTMLElement | null {
        if (!pmView) { return null; }
        try {
            const domNode: any = pmView.nodeDOM(pos);
            if (domNode && domNode.nodeType === 1) {
                return domNode as HTMLElement;
            }
        } catch {
            // ignore
        }
        return null;
    }

    private _getNodeAtPath(root: EditorNode, path: number[]): EditorNode | null {
        let node: EditorNode = root;
        for (const idx of path) {
            if (!node.children || idx < 0 || idx >= node.children.length) { return null; }
            node = node.children[idx as number];
        }
        return node;
    }
}
