/**
 * selection-manager.ts — Internal owner of the "saved selection" concept.
 *
 * Lives at the PM boundary. Syncfusion documents carry no persistent node IDs,
 * so the "stale" detection now rests on the schemaVersion mismatch only.
 */
import { Selection, SelectionType, SelectionSnapshot, createSnapshot, withStatus } from '../../core/model/selection';
import { SelectionAdapter } from '../adapters/selection-adapter';
import { IntegrationManager } from './integration-manager';
import { PMEditorState, PMTransaction } from '../pm-guard';

export class SelectionManager {
    private readonly integration: IntegrationManager;
    private readonly selectionAdapter: SelectionAdapter;
    private readonly documentSchemaVersion: number;
    private held: SelectionSnapshot | null;

    constructor(
        integration: IntegrationManager,
        selectionAdapter: SelectionAdapter,
        documentSchemaVersion: number = 1
    ) {
        this.integration = integration;
        this.selectionAdapter = selectionAdapter;
        this.documentSchemaVersion = documentSchemaVersion;
        this.held = null;
    }

    public get snapshot(): SelectionSnapshot | null {
        return this.held;
    }

    public hasPending(): boolean {
        return this.held !== null && this.held.status === 'pending';
    }

    public isStale(snap: SelectionSnapshot): boolean {
        if (this.integration.isDestroyed) { return true; }
        if (snap.schemaVersion !== this.documentSchemaVersion) { return true; }
        return false;
    }

    public save(): SelectionSnapshot {
        const pmState: PMEditorState = this.integration.getState();
        const sel: Selection | null = this.selectionAdapter.fromPMSelection(pmState.selection, pmState.doc);
        if (!sel) {
            this.held = null;
            throw new Error('SelectionManager.save: current PM selection could not be captured.');
        }
        const snap: SelectionSnapshot = createSnapshot(sel, this.documentSchemaVersion);
        this.held = snap;
        return snap;
    }

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

    public consume(): void {
        if (!this.held) { return; }
        if (this.held.status === 'pending' || this.held.status === 'restored' || this.held.status === 'partial') {
            this.held = withStatus(this.held, 'consumed');
        }
    }

    public discard(): void {
        this.held = null;
    }

    public onTransactionApplied(): void {
        if (!this.held || this.held.status === 'consumed' || this.held.status === 'stale') { return; }
        if (this.isStale(this.held)) {
            this.held = withStatus(this.held, 'stale');
        }
    }
}
