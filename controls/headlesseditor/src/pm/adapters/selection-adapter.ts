/**
 * selection-adapter.ts — Converts between Syncfusion Selection and PM Selection.
 *
 * Supports all five SelectionType variants: text, node, cell, block, all.
 *
 * Sealed inside src/pm/. Nothing outside src/pm/ may import from this file.
 */
import {
    PMNode,
    PMSelection,
    PMCellSelection,
    TextSelection,
    NodeSelection,
    AllSelection,
    Mapping
} from '../pm-guard';
import { PositionAdapter } from './position-adapter';
import { Selection, SelectionType, CellSelection, isCellSelection } from '../../model/selection';
import { Position } from '../../model/position';
import { InternalPosition } from '../types';
import {
    toPMCellSelection,
    fromPMCellSelection,
    remapCellSelection
} from './table/cell-selection-adapter';

export class SelectionAdapter {

    private positionAdapter: PositionAdapter;

    constructor(positionAdapter: PositionAdapter) {
        this.positionAdapter = positionAdapter;
    }

    // ── To PM ─────────────────────────────────────────────────────────────────

    /**
     * Converts a Syncfusion Selection to a ProseMirror Selection.
     * Returns null when the selection cannot be resolved (e.g. unknown nodeId).
     *
     * @param {Selection} sel - The Syncfusion selection to convert.
     * @param {PMNode} pmDoc - The current PM document used for context.
     * @returns {PMSelection | null} The corresponding PM selection, or null if it cannot be resolved.
     */
    public toPMSelection(sel: Selection, pmDoc: PMNode): PMSelection | null {
        try {
            switch (sel.type) {
            case SelectionType.All:
                return new AllSelection(pmDoc);

            case SelectionType.Node: {
                if (!sel.anchor) { return null; }
                const internal: InternalPosition = this.positionAdapter.toPMPosition(sel.anchor, pmDoc);
                // NodeSelection requires the position to be at the start of a node
                return NodeSelection.create(pmDoc, internal.pmPos - 1 >= 0 ? internal.pmPos - 1 : 0);
            }

            case SelectionType.Cell: {
                // Delegate to cell-selection-adapter for real PM CellSelection
                if (isCellSelection(sel)) {
                    return toPMCellSelection(sel, pmDoc);
                }
                return null;
            }

            case SelectionType.Text:
            case SelectionType.Block: {
                if (!sel.anchor) { return null; }
                const anchorInternal: InternalPosition = this.positionAdapter.toPMPosition(sel.anchor, pmDoc);
                const anchorPM: number = anchorInternal.pmPos;

                let headPM: number = anchorPM;
                if (sel.head) {
                    const headInternal: InternalPosition = this.positionAdapter.toPMPosition(sel.head, pmDoc);
                    headPM = headInternal.pmPos;
                }
                return TextSelection.create(pmDoc, anchorPM, headPM);
            }

            default:
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    // ── From PM ───────────────────────────────────────────────────────────────

    /**
     * Converts a ProseMirror Selection to a Syncfusion Selection.
     * Returns null when the reverse mapping is not possible.
     *
     * @param {PMSelection} pmSel - The PM selection to convert.
     * @param {PMNode} pmDoc - The current PM document used for context.
     * @returns {Selection | null} The corresponding Syncfusion selection, or null if it cannot be resolved.
     */
    public fromPMSelection(pmSel: PMSelection, pmDoc: PMNode): Selection | null {
        try {
            if (pmSel instanceof AllSelection) {
                return { type: SelectionType.All };
            }

            if (pmSel instanceof NodeSelection) {
                const pos: Position = this.positionAdapter.fromPMPosition(pmSel.from + 1, pmDoc);
                return { type: SelectionType.Node, anchor: pos };
            }

            // PM CellSelection — convert via cell-selection-adapter
            if (pmSel instanceof PMCellSelection) {
                return fromPMCellSelection(pmSel);
            }

            if (pmSel instanceof TextSelection) {
                const anchor: Position = this.positionAdapter.fromPMPosition(pmSel.anchor, pmDoc);
                const head: Position = this.positionAdapter.fromPMPosition(pmSel.head, pmDoc);
                return { type: SelectionType.Text, anchor, head };
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    // ── Remap ─────────────────────────────────────────────────────────────────

    /**
     * Remaps a Syncfusion Selection through a PM Mapping so the selection
     * remains valid after document mutations.
     * Returns null when either endpoint was deleted.
     *
     * For CellSelection, remapping is done by locating both cell nodeIds in
     * the post-mutation document rather than using PM position mappings.
     *
     * @param {Selection} sel - The selection to remap.
     * @param {PMNode} pmDoc - The new PM document after the transaction.
     * @param {Mapping} mapping - The PM mapping produced by the transaction.
     * @returns {Selection | null} The remapped selection, or null if it was deleted.
     */
    public remapLocalSelection(
        sel: Selection,
        pmDoc: PMNode,
        mapping: Mapping
    ): Selection | null {
        if (sel.type === SelectionType.All) {
            return { type: SelectionType.All };
        }

        // CellSelection: remap by nodeId lookup in the post-mutation document
        if (isCellSelection(sel)) {
            return remapCellSelection(sel as CellSelection, pmDoc);
        }

        let newAnchor: Position | null = null;
        let newHead: Position | null = null;

        if (sel.anchor) {
            newAnchor = this.positionAdapter.mapAfterTransaction(sel.anchor, pmDoc, mapping);
            if (!newAnchor) { return null; }
        }

        if (sel.head) {
            newHead = this.positionAdapter.mapAfterTransaction(sel.head, pmDoc, mapping);
            if (!newHead) { return null; }
        }

        return {
            type: sel.type,
            anchor: newAnchor !== null ? newAnchor : undefined,
            head: newHead !== null ? newHead : undefined
        };
    }
}
