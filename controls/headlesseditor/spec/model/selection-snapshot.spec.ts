/**
 * spec/model/selection-snapshot.spec.ts
 * 
 * Unit tests for SelectionSnapshot creation and status transitions.
 */
import {
    SelectionSnapshot,
    createSnapshot,
    isCellSelection,
    withStatus
} from '../../src/model/selection';
import { Selection, SelectionType, CellSelection } from '../../src/model/selection';

// ── Text selection ───────────────────────────────────────────────────────────

describe('createSnapshot — Text selection', () => {
    it('captures anchor and head', () => {
        const sel: Selection = {
            type: SelectionType.Text,
            anchor: { nodeId: 'p1', offset: 0 },
            head: { nodeId: 'p1', offset: 5 }
        };
        const snap: SelectionSnapshot = createSnapshot(sel, 1);
        expect(snap.type).toBe(SelectionType.Text);
        expect(snap.anchor).toEqual({ nodeId: 'p1', offset: 0 });
        expect(snap.head).toEqual({ nodeId: 'p1', offset: 5 });
        expect(snap.nodeId).toBeNull();
        expect(snap.cellRange).toBeNull();
        expect(snap.schemaVersion).toBe(1);
        expect(snap.status).toBe('pending');
        expect(typeof snap.capturedAt).toBe('number');
    });

    it('toSelection round-trips', () => {
        const sel: Selection = {
            type: SelectionType.Text,
            anchor: { nodeId: 'a', offset: 1 },
            head: { nodeId: 'b', offset: 2 }
        };
        const out: Selection = createSnapshot(sel, 3).toSelection();
        expect(out.type).toBe(SelectionType.Text);
        expect(out.anchor).toEqual({ nodeId: 'a', offset: 1 });
        expect(out.head).toEqual({ nodeId: 'b', offset: 2 });
    });

    it('honors the explicit `now` argument', () => {
        const sel: Selection = {
            type: SelectionType.Text,
            anchor: { nodeId: 'a', offset: 0 },
            head: { nodeId: 'a', offset: 0 }
        };
        const snap: SelectionSnapshot = createSnapshot(sel, 1, 1700000000000);
        expect(snap.capturedAt).toBe(1700000000000);
    });

    it('handles a collapsed cursor (no head)', () => {
        const sel: Selection = {
            type: SelectionType.Text,
            anchor: { nodeId: 'p1', offset: 3 }
        };
        const snap: SelectionSnapshot = createSnapshot(sel, 1);
        expect(snap.anchor).toEqual({ nodeId: 'p1', offset: 3 });
        expect(snap.head).toBeNull();
        expect(snap.toSelection()).toEqual(sel);
    });

    it('falls back to a null anchor when no position is provided', () => {
        const sel: Selection = { type: SelectionType.Text };
        const snap: SelectionSnapshot = createSnapshot(sel, 1);
        expect(snap.type).toBe(SelectionType.Text);
        expect(snap.anchor).toBeNull();
        expect(snap.head).toBeNull();
        expect(snap.nodeId).toBeNull();
        expect(snap.cellRange).toBeNull();
    });
});

// ── Block selection ──────────────────────────────────────────────────────────

describe('createSnapshot — Block selection', () => {
    it('captures anchor only (no head)', () => {
        const sel: Selection = {
            type: SelectionType.Block,
            anchor: { nodeId: 'p2', offset: 0 }
        };
        const snap: SelectionSnapshot = createSnapshot(sel, 2);
        expect(snap.type).toBe(SelectionType.Block);
        expect(snap.anchor).toEqual({ nodeId: 'p2', offset: 0 });
        expect(snap.head).toBeNull();
    });

    it('toSelection round-trips', () => {
        const sel: Selection = {
            type: SelectionType.Block,
            anchor: { nodeId: 'h1', offset: 0 }
        };
        const out: Selection = createSnapshot(sel, 1).toSelection();
        expect(out.type).toBe(SelectionType.Block);
        expect(out.anchor).toEqual({ nodeId: 'h1', offset: 0 });
    });

    it('falls back to a null anchor when no position is provided', () => {
        const sel: Selection = { type: SelectionType.Block };
        const snap: SelectionSnapshot = createSnapshot(sel, 1);
        expect(snap.type).toBe(SelectionType.Block);
        expect(snap.anchor).toBeNull();
        expect(snap.head).toBeNull();
    });
});

// ── Node selection ───────────────────────────────────────────────────────────

describe('createSnapshot — Node selection', () => {
    it('captures the target nodeId', () => {
        const sel: Selection = {
            type: SelectionType.Node,
            anchor: { nodeId: 'img1', offset: 0 }
        };
        const snap: SelectionSnapshot = createSnapshot(sel, 1);
        expect(snap.type).toBe(SelectionType.Node);
        expect(snap.nodeId).toBe('img1');
        expect(snap.anchor).toBeNull();
        expect(snap.head).toBeNull();
        expect(snap.cellRange).toBeNull();
    });

    it('falls back to a null nodeId when anchor is missing', () => {
        const sel: Selection = { type: SelectionType.Node };
        const snap: SelectionSnapshot = createSnapshot(sel, 1);
        expect(snap.type).toBe(SelectionType.Node);
        expect(snap.nodeId).toBeNull();
        expect(snap.anchor).toBeNull();
        expect(snap.head).toBeNull();
        expect(snap.cellRange).toBeNull();
    });

    it('toSelection round-trips', () => {
        const sel: Selection = {
            type: SelectionType.Node,
            anchor: { nodeId: 'img1', offset: 0 }
        };
        const out: Selection = createSnapshot(sel, 1).toSelection();
        expect(out.type).toBe(SelectionType.Node);
        expect(out.anchor).toEqual({ nodeId: 'img1', offset: 0 });
    });
});

// ── Cell selection ───────────────────────────────────────────────────────────

describe('createSnapshot — Cell selection', () => {
    it('captures anchorCellId and headCellId', () => {
        const sel: CellSelection = {
            type: SelectionType.Cell,
            anchorCellId: 'c1',
            headCellId: 'c6'
        };
        const snap: SelectionSnapshot = createSnapshot(sel, 1);
        expect(snap.type).toBe(SelectionType.Cell);
        expect(snap.cellRange).toEqual({ anchorCellId: 'c1', headCellId: 'c6' });
        expect(snap.nodeId).toBeNull();
        expect(snap.anchor).toBeNull();
        expect(snap.head).toBeNull();
    });

    it('toSelection returns the original CellSelection', () => {
        const sel: CellSelection = {
            type: SelectionType.Cell,
            anchorCellId: 'c1',
            headCellId: 'c3'
        };
        const out: Selection = createSnapshot(sel, 1).toSelection();
        expect(out).toBe(sel);
        expect(isCellSelection(out)).toBeTruthy();
    });
});

// ── isCellSelection type guard ───────────────────────────────────────────────

describe('isCellSelection', () => {
    it('returns true for a CellSelection', () => {
        const sel: CellSelection = {
            type: SelectionType.Cell,
            anchorCellId: 'c1',
            headCellId: 'c1'
        };
        expect(isCellSelection(sel)).toBeTruthy();
    });

    it('returns false for non-cell selections', () => {
        const cases: Selection[] = [
            { type: SelectionType.Text, anchor: { nodeId: 'a', offset: 0 } },
            { type: SelectionType.Block, anchor: { nodeId: 'b', offset: 0 } },
            { type: SelectionType.Node, anchor: { nodeId: 'n', offset: 0 } },
            { type: SelectionType.All }
        ];
        for (const sel of cases) {
            expect(isCellSelection(sel)).toBeFalsy();
        }
    });
});

// ── All selection ────────────────────────────────────────────────────────────

describe('createSnapshot — All selection', () => {
    it('captures no anchors', () => {
        const sel: Selection = { type: SelectionType.All };
        const snap: SelectionSnapshot = createSnapshot(sel, 1);
        expect(snap.type).toBe(SelectionType.All);
        expect(snap.anchor).toBeNull();
        expect(snap.head).toBeNull();
        expect(snap.nodeId).toBeNull();
        expect(snap.cellRange).toBeNull();
    });

    it('toSelection returns a fresh All selection', () => {
        const snap: SelectionSnapshot = createSnapshot(
            { type: SelectionType.All },
            1
        );
        const out: Selection = snap.toSelection();
        expect(out.type).toBe(SelectionType.All);
        expect(out.anchor).toBeUndefined();
        expect(out.head).toBeUndefined();
    });
});

// ── withStatus ───────────────────────────────────────────────────────────────

describe('withStatus', () => {
    it('returns a new snapshot with the given status', () => {
        const snap: SelectionSnapshot = createSnapshot(
            { type: SelectionType.Text, anchor: { nodeId: 'a', offset: 0 } },
            1
        );
        const next: SelectionSnapshot = withStatus(snap, 'restored');
        expect(next).not.toBe(snap);
        expect(next.status).toBe('restored');
        // original is unchanged
        expect(snap.status).toBe('pending');
    });

    it('is a no-op when status is unchanged', () => {
        const snap: SelectionSnapshot = createSnapshot(
            { type: SelectionType.Text, anchor: { nodeId: 'a', offset: 0 } },
            1
        );
        const same: SelectionSnapshot = withStatus(snap, 'pending');
        expect(same).toBe(snap);
    });

    it('transitions through every status value (pending → restored → consumed)', () => {
        let snap: SelectionSnapshot = createSnapshot(
            { type: SelectionType.Text, anchor: { nodeId: 'a', offset: 0 } },
            1
        );
        expect(snap.status).toBe('pending');

        snap = withStatus(snap, 'restored');
        expect(snap.status).toBe('restored');

        snap = withStatus(snap, 'consumed');
        expect(snap.status).toBe('consumed');
    });

    it('transitions to a stale status', () => {
        const snap: SelectionSnapshot = createSnapshot(
            { type: SelectionType.Text, anchor: { nodeId: 'a', offset: 0 } },
            1
        );
        const stale: SelectionSnapshot = withStatus(snap, 'stale');
        expect(stale).not.toBe(snap);
        expect(stale.status).toBe('stale');
    });

    it('transitions to a partial status', () => {
        const snap: SelectionSnapshot = createSnapshot(
            { type: SelectionType.Text, anchor: { nodeId: 'a', offset: 0 } },
            1
        );
        const partial: SelectionSnapshot = withStatus(snap, 'partial');
        expect(partial).not.toBe(snap);
        expect(partial.status).toBe('partial');
    });
});
