/**
 * selection-manager.ts — Internal owner of the "saved selection" concept.
 *
 * Lives at the PM boundary. Holds at most one SelectionSnapshot at a time
 * (most-recent-wins). The framework's auto-restore hooks (CommandManager,
 * ChainBuilder) consult this manager on every command execution.
 *
 * The class is NOT exported from src/index.ts. Public interaction is
 * mediated by Editor.saveSelection / restoreSelection / discardSavedSelection.
 */
import { Selection, SelectionType, SelectionSnapshot, createSnapshot, withStatus } from '../../model/selection';
import { PositionAdapter } from '../adapters/position-adapter';
import { SelectionAdapter } from '../adapters/selection-adapter';
import { IntegrationManager } from './integration-manager';
import { PMEditorState, PMNode, PMTransaction } from '../pm-guard';

// ── SelectionManager ──────────────────────────────────────────────────────────

export class SelectionManager {
    private readonly integration: IntegrationManager;
    private readonly selectionAdapter: SelectionAdapter;
    private readonly positionAdapter: PositionAdapter;
    private readonly documentSchemaVersion: number;
    private held: SelectionSnapshot | null;

    constructor(
        integration: IntegrationManager,
        selectionAdapter: SelectionAdapter,
        positionAdapter: PositionAdapter,
        documentSchemaVersion: number = 1
    ) {
        this.integration = integration;
        this.selectionAdapter = selectionAdapter;
        this.positionAdapter = positionAdapter;
        this.documentSchemaVersion = documentSchemaVersion;
        this.held = null;
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    /**
     * Read-only access to the currently held snapshot.
     *
     * @returns {SelectionSnapshot} Snapshot options
     * @hidden
     */
    public get snapshot(): SelectionSnapshot | null {
        return this.held;
    }

    /**
     * True when there is a snapshot and its status is `pending`.
     *
     * @returns {boolean} Whether the status is pending
     * @hidden
     */
    public hasPending(): boolean {
        return this.held !== null && this.held.status === 'pending';
    }

    /**
     * Returns true if the snapshot is no longer applicable to the current
     * document — schemaVersion mismatch OR a referenced nodeId was removed.
     * Does not mutate the held snapshot.
     *
     * @param {SelectionSnapshot} snap - Snapshot object
     * @returns {boolean} Returns whether the snapshot is stale or not.
     * @hidden
     */
    public isStale(snap: SelectionSnapshot): boolean {
        if (this.integration.isDestroyed) { return true; }

        if (snap.schemaVersion !== this.documentSchemaVersion) {
            return true;
        }

        const pmState: PMEditorState = this.integration.getState();
        return this.anyReferencedNodeMissing(snap, pmState.doc);
    }

    // ── Mutate ────────────────────────────────────────────────────────────────

    /**
     * Capture the current PM selection as a PM-free SelectionSnapshot.
     * Replaces any previously held snapshot.
     *
     * @returns {SelectionSnapshot} The snapshot object
     * @hidden
     */
    public save(): SelectionSnapshot {
        const pmState: PMEditorState = this.integration.getState();
        const sel: Selection | null = this.selectionAdapter.fromPMSelection(pmState.selection, pmState.doc);
        if (!sel) {
            // No valid PM selection to capture — discard any prior hold.
            this.held = null;
            throw new Error('SelectionManager.save: current PM selection could not be captured.');
        }
        const snap: SelectionSnapshot = createSnapshot(sel, this.documentSchemaVersion);
        this.held = snap;
        return snap;
    }

    /**
     * Try to apply a snapshot to the live PM state.
     * Uses the held snapshot if none is provided.
     * Returns true on success; false if stale (status updated to 'stale').
     *
     * @param {SelectionSnapshot} snap - Snapshot options to restore (optional)
     * @returns {boolean} Returns whether the restore is success or not.
     * @hidden
     */
    public restore(snap?: SelectionSnapshot): boolean {
        const target: SelectionSnapshot | null = snap ?? this.held;
        if (!target || !this.hasPending()) { return false; }

        if (this.isStale(target)) {
            this.held = withStatus(target, 'stale');
            return false;
        }

        const pmState: PMEditorState = this.integration.getState();
        const sel: Selection = target.toSelection();
        const pmSel: ReturnType<SelectionAdapter['toPMSelection']> = this.selectionAdapter.toPMSelection(sel, pmState.doc);

        const tr: PMTransaction = pmState.tr.setSelection(pmSel);
        this.integration.dispatch(tr);

        if (!snap) {
            this.held = withStatus(target, 'restored');
        }

        this.integration.focusView();

        return true;
    }

    /**
     * Mark the held snapshot as consumed.
     * Idempotent. Safe to call on null.
     *
     * @returns {void}
     * @hidden
     */
    public consume(): void {
        if (!this.held) { return; }
        if (this.held.status === 'pending' || this.held.status === 'restored' || this.held.status === 'partial') {
            this.held = withStatus(this.held, 'consumed');
        }
    }

    /**
     * Clear the held snapshot. Idempotent.
     *
     * @returns {void}
     * @hidden
     */
    public discard(): void {
        this.held = null;
    }

    /**
     * Called by IntegrationManager.dispatch() after a transaction has been
     * applied. If the transaction removed any nodeId referenced by the held
     * snapshot, the snapshot is marked stale (it can no longer be applied).
     *
     * @returns {void}
     * @hidden
     */
    public onTransactionApplied(): void {
        if (!this.held || this.held.status === 'consumed' || this.held.status === 'stale') {
            return;
        }
        if (this.isStale(this.held)) {
            this.held = withStatus(this.held, 'stale');
        }
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    private anyReferencedNodeMissing(snap: SelectionSnapshot, pmDoc: PMNode): boolean {
        const ids: string[] = [];
        if (snap.anchor) { ids.push(snap.anchor.nodeId); }
        if (snap.head && snap.head.nodeId !== snap.anchor?.nodeId) { ids.push(snap.head.nodeId); }
        if (snap.nodeId) { ids.push(snap.nodeId); }
        if (snap.cellRange) {
            ids.push(snap.cellRange.anchorCellId);
            if (snap.cellRange.headCellId !== snap.cellRange.anchorCellId) {
                ids.push(snap.cellRange.headCellId);
            }
        }
        for (const id of ids) {
            if (!this.findNodeById(pmDoc, id)) { return true; }
        }
        return false;
    }

    private findNodeById(pmDoc: PMNode, nodeId: string): boolean {
        let found: boolean = false;
        pmDoc.descendants((node: import('../pm-guard').PMNode): boolean => {
            if (found) { return false; }
            const id: unknown = node.attrs ? node.attrs['id'] : null;
            if (id !== null && id !== undefined && String(id) === nodeId) {
                found = true;
                return false;
            }
            return true;
        });
        return found;
    }
}
